# Legacy customer WebService

Use this guide for the SFC customer WebService covered by this skill.

- HTTPS endpoint (preferred where the method is documented):
  `https://www.sendfromchina.com/ishipsvc/http-api`
- SOAP WSDL: `https://www.sendfromchina.com/ishipsvc/web-service?wsdl`
- Official documentation: the WSDL above is the field-level schema;
  https://www.sendfromchina.com/webservice (Chinese) carries SOAP examples for
  `getShipTypes`, `getRates`, `addOrder`, and `searchOrder`.
  https://www.sendfromchina.com/api is the portal of the separate Fulfillment
  REST API v3 and does not document this WebService.
- Field-level source: the WSDL above is the authoritative field table for this
  WebService (`HeaderRequest{userId, appKey, token}`, `addOrderRequestInfo`, …).
- Warning: https://fulfill.sendfromchina.com/file/Cff-API-3.0.pdf documents a
  **different service** (the SFC Fulfillment API v3 — warehouse fulfillment with
  `customerId`/`appToken` auth and methods like `createOrder`/`createProduct`).
  Do not use it for this WebService's endpoint, auth, or field names.

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
`parameter`. For this customer workflow, use the verified GET form:

```text
GET https://www.sendfromchina.com/ishipsvc/http-api?apiName=getShiptypesByCountry&parameter=<URL-encoded JSON string>
```

The service code also accepts form parameters on POST: with placeholder
credentials, GET and form-encoded POST both reach the credential check
identically. POST behavior with real credentials is account- and
environment-dependent, though — one verified integration saw form-encoded POST
fail authentication while GET succeeded with the same credentials. JSON request
bodies are rejected as an unknown `apiName` because the dispatcher only reads
form/query parameters. Default to GET unless SFC confirms and tests POST for
your account. Do not assume every SOAP method has an HTTP equivalent.

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

## Response envelope and error handling

The `http-api` endpoint returns **HTTP 200 for every business outcome**, with
`Content-Type: text/html` even though the body is JSON. Never judge success by
the HTTP status; parse the body instead.

Failure bodies use a `{code, msg}` envelope:

| Body | Trigger |
|------|---------|
| `{"code":404,"msg":"apiName参数错误,api不存在"}` | unknown or missing `apiName` |
| `{"code":500,"msg":"Sorry an error was caught executing your request:<reason>"}` | a service fault: invalid credentials (`invalid userId, token and appKey`), missing fields (`userId is null`), empty result sets, and similar |
| `{"code":500,"msg":"数据解析错误（data deal error）"}` | malformed or empty `parameter` JSON |

Chinese `msg` text arrives `\u`-escaped inside the JSON.

Success bodies have **no uniform envelope** — each method returns its own
payload: `getShiptypesByCountry` and `getRates` return a plain array of
methods/rates, `searchOrder` returns `{"orderInfo": {...}}`, and a few methods
return `{"code":200,"data":...}`. Practical rule: if a `code` field is present,
treat only `200` as success and `404`/`500` as failure; if it is absent,
validate the expected payload (for example a non-empty shipping-method list).

Edge cases that are not JSON:

- An over-long GET URL produces a server-level HTML error page (`500`, or
  `414` for very large requests) instead of the envelope.
- The label print page answers `200 text/html` with a plain-text error such as
  `找不到订单!` for an unknown order. Always confirm the response is actually a
  PDF before treating a label as printed.

## SOAP example

**Transport security**: the WSDL's advertised `soap:address` is plaintext
`http://api.sfcservice.com/ishipsvc/web-service`. PHP `SoapClient` posts every
call to that address unless the `location` option overrides it, so the example
below pins the HTTPS location — otherwise `appKey` / `token` / `userId` travel
unencrypted even though the WSDL itself was fetched over HTTPS.

```php
$client = new SoapClient(
    'https://www.sendfromchina.com/ishipsvc/web-service?wsdl',
    [
        'location' => 'https://www.sendfromchina.com/ishipsvc/web-service',
        'exceptions' => true,
    ]
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
`addOrder`, labels, rates, and order queries, read the matching WSDL section or
official method page before sending a request. Do not guess fields from another
SFC API — in particular, the Fulfillment API v3 PDF uses different auth names
and method names and does not apply here.

## Legacy operation selection

| Goal | Common documented name | Safety |
|---|---|---|
| List methods | `getShipTypes`, `getShiptypesByCountry` | Read-only |
| Quote | `getRates`, `getRatesByShip` | Read-only |
| Create shipment | `addOrder` | Changes data; confirm first |
| Find an order | `searchOrder` | Read-only |
| Order status / tracking number | `searchOrder` (legacy has no scan-level tracking method) | Read-only |
| Remove/change an order | `deleteOrder`, update methods | Confirm exact order first |

Names, fields, and protocol support vary by legacy document version. The official
method schema is authoritative.
