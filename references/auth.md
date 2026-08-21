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

## Failure modes

- Wrong / expired credentials → auth or permission errors from the API.
- Missing `HeaderRequest` → request rejected.
- Using another customer's `userId` with your key → treat as a security incident; do not retry with guessed IDs.
