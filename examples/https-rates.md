# Example — HTTPS rates / ship types

Official base: `https://www.sendfromchina.com/ishipsvc/http-api`

## Query style (ship types by country)

```text
GET https://www.sendfromchina.com/ishipsvc/http-api
  ?apiName=getShiptypesByCountry
  &parameter=<URL-encoded JSON>
```

JSON shape (placeholders only):

```json
{
  "HeaderRequest": {
    "appKey": "YOUR_APP_KEY",
    "token": "YOUR_TOKEN",
    "userId": "YOUR_USER_ID"
  },
  "getShiptypesByCountryRequestInfo": {
    "country": "US",
    "weight": "0.5",
    "length": "10",
    "width": "10",
    "height": "10",
    "divisionId": "1"
  }
}
```

## POST style (channel rates)

Many HTTPS methods accept POST to the same `http-api` URL with `apiName` + `parameter` (see PHP `curl` samples on the official page). Example `apiName`: `getRatesByShip`.

Always verify the exact request body on:

https://www.sendfromchina.com/api

## Checklist

1. Credentials load from env  
2. JSON is valid and URL-encoded when used in query  
3. Inspect `method_code` / fee fields before calling `addOrder`
