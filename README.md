# SFC WebService Skill

Integration guide for the **SFC customer logistics WebService** — shipping methods, rates, orders, labels, tracking, and related operations.

Canonical documentation (field-level schemas):

- https://www.sendfromchina.com/api

This repository summarizes the API surface and recommended call order. It does **not** replace the official page, and it does **not** include production credentials or private pricing rules.

## Access

Every request requires:

| Field | Meaning |
|-------|---------|
| `appKey` | Key issued by SFC |
| `token` | Token issued by SFC |
| `userId` | Customer code |

Ask your SFC account manager for credentials. Keep them in environment variables (see `.env.example`).

## Base URLs

| Protocol | URL | Notes |
|----------|-----|--------|
| **HTTPS** (preferred) | `https://www.sendfromchina.com/ishipsvc/http-api` | Pass `apiName` + JSON `parameter` |
| SOAP | `https://www.sendfromchina.com/ishipsvc/web-service?wsdl` | Still used for several order methods |

Official guidance: prefer HTTPS when both protocols exist for the same capability.

## Recommended flow

```text
getShipTypes / getShiptypesByCountry
        ↓
getRates / getRatesByShip
        ↓
addOrder
        ↓
label print / getTrack / fee & order query
```

Before creating orders, load ship types and rates (and confirm channel choice with your account manager). Business process overview: https://www.sendfromchina.com/help

## API overview

### Channels & rates

| Capability | SOAP | HTTPS `apiName` |
|------------|------|-----------------|
| List ship types | `getShipTypes` | `getShipTypes`, `getShiptypesByCountry` |
| Quote rates | `getRates` | `getRates`, `getRatesByShip` |

### Orders

| Capability | SOAP | HTTPS `apiName` |
|------------|------|-----------------|
| Create order | `addOrder` | see official docs (many integrations still use SOAP) |
| Change ship type | — | `updateOrderShipType` |
| Update weight / dimensions | `updateOrderVolumeWeight` | — |
| Delete order | `deleteOrder` | `deleteOrder` |
| Update order status | `updateOrderStatus` | `updateOrderStatus` |
| Search order | `searchOrder` | `searchOrder` |
| Fee by order code | `getFeeByOrderCode` | `getFeeByOrderCode` |
| Orders / fees by time range | SOAP time-range methods | HTTPS variants on official page |

### Labels, tracking & carriers

| Capability | How |
|------------|-----|
| Address label print | HTTPS print URL (`/order/print/index/…`) — `orderCodeList`, `printType`, `print_type`, `printSize` |
| Tracking (new API) | HTTPS `getTrack` |
| Carrier lookup by number | HTTPS (official page) |
| Tracking number / label upload | HTTPS (official page) |

### Delivery, proofs & exceptions

| Capability | Protocol |
|------------|----------|
| Domestic delivery note | SOAP |
| Ship / POD proofs | HTTPS |
| Reship fee | HTTPS |
| Problem parcels | HTTPS |
| Pickup request | HTTPS |

Full method map: [references/endpoints.md](references/endpoints.md)  
Division IDs: [references/divisions.md](references/divisions.md)  
Auth header: [references/auth.md](references/auth.md)

## Examples in this repo

- [examples/https-rates.md](examples/https-rates.md) — HTTPS ship types / rates
- [examples/soap-ship-types.md](examples/soap-ship-types.md) — SOAP `getShipTypes`

Always verify request/response fields on the official webservice page before production use.

## Related project

Shopify storefront reference (App Proxy), separate product:

https://github.com/SendFromChina/shopify-sfc-shipping-tools

## License

Apache License 2.0 — see [LICENSE](LICENSE).
