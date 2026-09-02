# Legacy customer WebService

Use this guide for the SFC customer WebService covered by this skill.

- HTTPS endpoint (preferred where the method is documented):
  `https://www.sendfromchina.com/ishipsvc/http-api`
- SOAP WSDL: `https://www.sendfromchina.com/ishipsvc/web-service?wsdl`
- Official documentation: https://www.sendfromchina.com/api
- Legacy PDF: https://fulfill.sendfromchina.com/file/Cff-API-3.0.pdf

## Authentication

Legacy calls use this nested object, with credentials issued by SFC:

```json
{
  "HeaderRequest": {
    "appKey": "YOUR_APP_KEY",
    "token": "YOUR_TOKEN",
    "userId": "YOUR_USER_ID"
  }
}
```

Some older SFC documents use the names `customerId` and `appToken` instead. These
are not interchangeable. Use the names shown by the account's WSDL or integration
agreement. Ask SFC if unclear.

## HTTPS request shape

The HTTP endpoint takes the exact method name in `apiName` and a JSON-encoded
`parameter`. For a GET request, URL-encode the JSON. For POST, follow the exact
encoding shown for that method in the official docs; do not assume a JSON object and
do not assume every SOAP method has an HTTP equivalent.

Example read-only request structure:

```text
GET https://www.sendfromchina.com/ishipsvc/http-api?apiName=getShiptypesByCountry&parameter=<URL-encoded JSON>
```

The JSON before URL encoding may look like:

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
    "divisionId": "YOUR_CONFIRMED_DIVISION_ID"
  }
}
```

`getShiptypesByCountry` and SOAP `getShipTypes` are different names and must not be
silently substituted. Shipping type and division values come from the account and
SFC; never hard-code the example values in production.

## SOAP example

```php
$client = new SoapClient(
    'https://www.sendfromchina.com/ishipsvc/web-service?wsdl',
    ['exceptions' => true]
);
$result = $client->getShipTypes([
    'HeaderRequest' => [
        'appKey' => getenv('SFC_APP_KEY'),
        'token' => getenv('SFC_TOKEN'),
        'userId' => getenv('SFC_USER_ID'),
    ],
    'divisionId' => getenv('SFC_DIVISION_ID'),
]);
```

Use SOAP only with the fields and response shape documented for that method. For
`addOrder`, labels, tracking, and rates, read the matching official method page or
PDF section before sending a request. Do not guess fields from another SFC API.

## Legacy operation selection

| Goal | Common documented name | Safety |
|---|---|---|
| List methods | `getShipTypes`, `getShiptypesByCountry` | Read-only |
| Quote | `getRates`, `getRatesByShip` | Read-only |
| Create shipment | `addOrder` | Changes data; confirm first |
| Find an order | `searchOrder` | Read-only |
| Track | `getTrack` | Read-only |
| Remove/change an order | `deleteOrder`, update methods | Confirm exact order first |

Names, fields, and protocol support vary by legacy document version. The official
method schema is authoritative.
