# Beginner example: legacy HTTPS shipping-method lookup

Use this only for an account that uses the legacy customer WebService. It is a
read-only request and does not create an order.

## 1. Prepare credentials privately

```bash
export SFC_APP_KEY='YOUR_APP_KEY'
export SFC_TOKEN='YOUR_TOKEN'
export SFC_USER_ID='YOUR_USER_ID'
export SFC_DIVISION_ID='YOUR_CONFIRMED_DIVISION_ID'
```

SFC issues these values. Do not paste them into public tickets, source code, or
chat. Confirm the division ID with SFC; the example must not be hard-coded to a
particular warehouse.

## 2. Discover the distribution center

For this customer workflow, try `divisionId=1` first with `US` and a small parcel.
If it does not return a non-empty shipping-method list, repeat with `divisionId=17`.
Stop at the first successful result. This is a read-only check.

## 3. Build the request safely

The legacy HTTP endpoint expects `apiName` plus a JSON string in `parameter`. The
following Python script performs URL encoding for you:

```python
import json
import os
import urllib.parse
import urllib.request

parameter = {
    "HeaderRequest": {
        "appKey": os.environ["SFC_APP_KEY"],
        "token": os.environ["SFC_TOKEN"],
        "userId": os.environ["SFC_USER_ID"],
    },
    "getShiptypesByCountryRequestInfo": {
        "country": "US",
        "weight": "0.5",
        "length": "10",
        "width": "10",
        "height": "10",
        "divisionId": os.environ["SFC_DIVISION_ID"],
    },
}
query = urllib.parse.urlencode({
    "apiName": "getShiptypesByCountry",
    "parameter": json.dumps(parameter, separators=(",", ":")),
})
request = urllib.request.Request(
    "https://www.sendfromchina.com/ishipsvc/http-api?" + query,
    headers={"Accept": "application/json"},
)
with urllib.request.urlopen(request, timeout=30) as response:
    print(response.read().decode("utf-8"))
```

Use the exact field names from the official method documentation. If the account
uses SOAP, use `getShipTypes` instead; do not change only the capitalization and
assume the two names are interchangeable.

## 3. Interpret the result

Treat the result as untrusted data. Confirm the request succeeded, find the returned
shipping method code, and then use that exact code when requesting a quote. If the
response is unclear or the account rejects the request, stop and contact SFC rather
than trying random field names or credentials.
