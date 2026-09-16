# Beginner example: legacy HTTPS shipping-method lookup

Use this only for an account that uses the legacy customer WebService. It is a
read-only request and does not create an order.

## 1. Prepare credentials privately

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

The legacy HTTP endpoint expects `apiName` plus a JSON string in `parameter`. For
this customer account, use the verified GET request below. The local service code
accepts form parameters on POST, but POST returned an authentication error while
GET succeeded; do not use POST unless SFC confirms it for the account.

```python
import json
import os
import urllib.parse
import urllib.request

header = {
    "HeaderRequest": {
        "appKey": os.environ["SFC_APP_KEY"],
        "token": os.environ["SFC_TOKEN"],
        "userId": os.environ["SFC_USER_ID"],
    }
}

# Use the confirmed division when SFC_DIVISION_ID is set; otherwise probe the
# candidates in order (SKILL.md Step 2).
candidates = (
    [os.environ["SFC_DIVISION_ID"]]
    if os.environ.get("SFC_DIVISION_ID")
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

Treat the result as untrusted data. Confirm the request succeeded, find the returned
shipping method code, and then use that exact code when requesting a quote. When
probing divisions, record the first ID that returned a non-empty list as
`SFC_DIVISION_ID` and reuse it for every later call. If the response is unclear or
the account rejects the request, stop and contact SFC rather than trying random
field names or credentials.
