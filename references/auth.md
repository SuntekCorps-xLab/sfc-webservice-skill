# Auth — HeaderRequest

Every SFC WebService call requires the same header object.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `appKey` | string | yes | Key issued by SFC |
| `token` | string | yes | Token issued by SFC |
| `userId` | string | yes | Customer code (user code) |

## How to obtain

Contact your SFC account manager or support. Do not invent credentials. Do not publish credentials in Git, screenshots, or public issues.

## Environment pattern

```bash
SFC_APP_KEY=
SFC_TOKEN=
SFC_USER_ID=
```

Load into `HeaderRequest` at runtime only.

## Transport security

Send credentials only over HTTPS. Note that the WSDL's advertised
`soap:address` is plaintext `http://api.sfcservice.com/ishipsvc/web-service`,
and SOAP clients post to that address by default. Always pin the client
`location` option to `https://www.sendfromchina.com/ishipsvc/web-service`
(the HTTPS `https://api.sfcservice.com/...` equivalent also works). Never call
the `http://` endpoints with real credentials.

The `http-api` host also serves the legacy API over plain `http://` with no
redirect and no HSTS: an `http://` request returns a normal business response
while the credentials in the query string travel in clear text. Build every
URL with `https://` and refuse any `http://` SFC URL.

## Failure modes

- Wrong / expired credentials → auth or permission errors from the API.
- Missing `HeaderRequest` → request rejected.
- Using another customer's `userId` with your key → treat as a security incident; do not retry with guessed IDs.
