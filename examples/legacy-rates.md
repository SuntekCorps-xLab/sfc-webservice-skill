# Beginner example: legacy HTTPS shipping-method lookup

Use this only for an account that uses the legacy customer WebService. It is a
read-only request and does not create an order.

## 1. Prepare credentials privately

Preferred: store the credentials in a private file outside the repository, as
in SKILL.md Step 1. The code in section 3 reads `~/.config/sfc/credentials.env`
by default; set `SFC_ENV_FILE` to use a different path. File format:

```text
SFC_APP_KEY=YOUR_APP_KEY
SFC_TOKEN=YOUR_TOKEN
SFC_USER_ID=YOUR_USER_ID
# Optional: only when SFC confirmed the account's division; otherwise the
# code probes for it (section 2).
# SFC_DIVISION_ID=YOUR_CONFIRMED_DIVISION_ID
```

```bash
chmod 600 ~/.config/sfc/credentials.env
```

Alternative (single shell session only): environment variables. The code falls
back to them for any name the file does not set.

macOS/Linux:

```bash
export SFC_APP_KEY='YOUR_APP_KEY'
export SFC_TOKEN='YOUR_TOKEN'
export SFC_USER_ID='YOUR_USER_ID'
# Optional: only set SFC_DIVISION_ID when SFC has confirmed the account's
# division. Leave it unset otherwise; the code in section 3 then probes for it.
# export SFC_DIVISION_ID='YOUR_CONFIRMED_DIVISION_ID'
```

Windows PowerShell:

```powershell
$env:SFC_APP_KEY = 'YOUR_APP_KEY'
$env:SFC_TOKEN = 'YOUR_TOKEN'
$env:SFC_USER_ID = 'YOUR_USER_ID'
# Optional; see the bash note above.
# $env:SFC_DIVISION_ID = 'YOUR_CONFIRMED_DIVISION_ID'
```

SFC issues these values. Do not paste them into public tickets, source code, or
chat. The example must not be hard-coded to a particular warehouse: use the
division SFC confirmed for the account, or discover it in the next section.

## 2. Discover the distribution center

For this customer workflow, try `divisionId=1` first with `US` and a small parcel.
If it does not return a non-empty shipping-method list, repeat with `divisionId=17`.
Stop at the first successful result. This is a read-only check. The code in
section 3 runs this probe automatically when `SFC_DIVISION_ID` is unset.

## 3. Build the request safely

The legacy HTTP endpoint expects `apiName` plus a JSON string in `parameter`.
Use the verified GET request below. The service code also accepts form
parameters on POST, but POST behavior is account-dependent — one verified
integration saw POST fail authentication while GET succeeded — so do not use
POST unless SFC confirms and tests it for the account.

```python
import json
import os
import pathlib
import urllib.parse
import urllib.request


def load_credentials():
    """Read KEY=VALUE pairs from the private env file, then os.environ."""
    env_file = pathlib.Path(
        os.environ.get(
            "SFC_ENV_FILE",
            pathlib.Path.home() / ".config" / "sfc" / "credentials.env",
        )
    )
    values = {}
    if env_file.is_file():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            values[key.strip()] = value.strip().strip("'\"")
    for name in ("SFC_APP_KEY", "SFC_TOKEN", "SFC_USER_ID", "SFC_DIVISION_ID"):
        values.setdefault(name, os.environ.get(name, ""))
    missing = [
        name for name in ("SFC_APP_KEY", "SFC_TOKEN", "SFC_USER_ID")
        if not values[name]
    ]
    if missing:
        raise SystemExit(
            f"Missing {', '.join(missing)}: add them to {env_file} "
            "or export them as environment variables."
        )
    return values


creds = load_credentials()
header = {
    "HeaderRequest": {
        "appKey": creds["SFC_APP_KEY"],
        "token": creds["SFC_TOKEN"],
        "userId": creds["SFC_USER_ID"],
    }
}

# Use the confirmed division when SFC_DIVISION_ID is set; otherwise probe the
# candidates in order (SKILL.md Step 2).
candidates = (
    [creds["SFC_DIVISION_ID"]]
    if creds["SFC_DIVISION_ID"]
    else ["1", "17"]
)

for division_id in candidates:
    parameter = dict(header)
    parameter["getShiptypesByCountryRequestInfo"] = {
        "country": "US",
        "weight": "0.5",
        "length": "10",
        "width": "10",
        "height": "10",
        "divisionId": division_id,
    }
    query = urllib.parse.urlencode({
        "apiName": "getShiptypesByCountry",
        "parameter": json.dumps(parameter, separators=(",", ":")),
    })
    request = urllib.request.Request(
        "https://www.sendfromchina.com/ishipsvc/http-api?" + query,
        headers={"Accept": "application/json"},
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read().decode("utf-8")
    print(f"divisionId={division_id} -> {body}")
    # Stop at the first division that returns a non-empty shipping-method list
    # and save that value as SFC_DIVISION_ID for the rest of the workflow.
```

Use the exact field names from the official method documentation. If the account
uses SOAP, use `getShipTypes` instead; do not change only the capitalization and
assume the two names are interchangeable.

## 4. Interpret the result

Treat the result as untrusted data. The endpoint returns HTTP 200 even for
failures, so parse the body: `{"code":404,...}` or `{"code":500,...}` with a
`msg` means failure (the `msg` may contain `\u`-escaped Chinese), while a
success is a non-empty list of shipping methods with no error `code`. Find the
returned shipping method code and then use that exact code when requesting a
quote. When probing divisions, record the first ID that returned a non-empty
list as `SFC_DIVISION_ID` and reuse it for every later call. If the response is
unclear or the account rejects the request, stop and contact SFC rather than
trying random field names or credentials.
