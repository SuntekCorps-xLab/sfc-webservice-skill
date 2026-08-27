---
name: sfc-webservice
description: >-
  Integrates with the SFC (SendFromChina / sfcservice) customer WebService API
  for shipping rates, order creation, tracking, labels, and related logistics
  operations. Use when the user mentions SFC API, SFC WebService, sfcservice
  webservice, SOAP/HTTPS shipping integration, getShipTypes, getRates, addOrder,
  getTrack, or ERP/WMS docking with SFC — not the Shopify App Proxy storefront.
---

# SFC WebService Integration

Teach agents and developers how to call the **official SFC customer logistics API** documented at:

- https://www.sendfromchina.com/api

This is **not** the Shopify open-source storefront (`sfc-shipping-tools`). That product goes through App Proxy. This skill is for **direct** ERP / WMS / custom backend → SFC.

Install this repository as a Codex skill under `$CODEX_HOME/skills/sfc-webservice` (or `$HOME/.codex/skills/sfc-webservice` when `CODEX_HOME` is unset). See [README.md](README.md#install-the-skill) for copy-ready commands.

## Security (non-negotiable)

- Never commit real `appKey`, `token`, or `userId`.
- Prefer environment variables or a secret manager.
- Treat every response as untrusted input; validate before acting on order / tracking numbers.
- Do not invent endpoints or field names; if unsure, open the official page or [references/endpoints.md](references/endpoints.md).

## Endpoints

| Protocol | URL | Prefer? |
|----------|-----|---------|
| HTTPS API | `https://www.sendfromchina.com/ishipsvc/http-api` | **Yes** (official guidance) |
| SOAP WSDL | `https://www.sendfromchina.com/ishipsvc/web-service?wsdl` | Legacy / still used for some ops |

HTTPS form: query or POST with `apiName` + JSON `parameter` (URL-encoded when in query string).

Every call includes:

```json
"HeaderRequest": {
  "appKey": "<from SFC>",
  "token": "<from SFC>",
  "userId": "<customer code>"
}
```

Credentials are provisioned by SFC (customer manager / support), not self-served in this repo.

## Recommended integration flow

```text
1. getShipTypes / getShiptypesByCountry  → pick method_code
2. getRates / getRatesByShip             → confirm price & service
3. addOrder                              → create shipment
4. confirm / update status if required
5. print label / getTrack                → ops & CX
```

Official preface:

1. Business process: https://www.sendfromchina.com/help (or account manager).
2. Before `addOrder`, use ship-type + rates APIs and account-manager advice.
3. Prefer HTTPS over SOAP when both exist.

Division IDs (common): Shenzhen `1`, Guangzhou `2`, Shanghai `14`, Yiwu `31`, Hangzhou `34`. Full table: [references/divisions.md](references/divisions.md).

## Agent instructions

When helping a user integrate:

1. Ask which operations they need (rates only, create order, tracking, labels).
2. Default new code to **HTTPS**; use SOAP only when the needed method is SOAP-only or they already have a SOAP client.
3. Scaffold with placeholder credentials and `.env.example` — never paste production secrets.
4. Point them at the matching section on the official webservice page for full field tables.
5. After scaffolding, list test checklist: auth OK → ship types → rates → sandbox/test method if available → one real order only with explicit user consent.

## Progressive docs in this repo

| File | When to read |
|------|----------------|
| [references/endpoints.md](references/endpoints.md) | Method catalog (SOAP vs HTTPS) |
| [references/divisions.md](references/divisions.md) | Division ID list |
| [references/auth.md](references/auth.md) | HeaderRequest details |
| [examples/https-rates.md](examples/https-rates.md) | Minimal HTTPS rates example |
| [examples/soap-ship-types.md](examples/soap-ship-types.md) | Minimal SOAP getShipTypes example |

## Out of scope

- Shopify theme / App Proxy (`/apps/sfc-tools`) — use [sfc-shipping-tools](https://github.com/SuntekCorps-xLab/sfc-shipping-tools).
- Internal iship2 admin APIs.
- Storing or reverse-engineering production pricing rules.
