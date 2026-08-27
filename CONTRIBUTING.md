# Contributing

## Scope

Changes should improve the SFC customer WebService Skill without expanding it into the Shopify App Proxy product. Keep field names and endpoint names grounded in the official SFC documentation or an included reference.

## Before opening a pull request

```bash
npm ci
npm run check
```

Do not include SFC credentials, customer data, production payloads, private hostnames, or undocumented field names. Update `CHANGELOG.md` when behavior, scope, installation, or supported operations change.
