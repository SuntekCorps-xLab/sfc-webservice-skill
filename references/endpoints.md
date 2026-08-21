# Endpoint catalog

Canonical docs: https://www.sendfromchina.com/api  
Prefer **HTTPS** when both SOAP and HTTPS exist.

Base URLs:

- HTTPS: `https://www.sendfromchina.com/ishipsvc/http-api`
- SOAP: `https://www.sendfromchina.com/ishipsvc/web-service?wsdl`

## Channels & rates

| Capability | SOAP method | HTTPS `apiName` (when documented) |
|------------|-------------|-------------------------------------|
| Ship type list | `getShipTypes` | `getShipTypes` / `getShiptypesByCountry` |
| Rates | `getRates` | `getRates` / `getRatesByShip` |

## Orders

| Capability | SOAP method | HTTPS `apiName` (when documented) |
|------------|-------------|-------------------------------------|
| Create order | `addOrder` | (see official page; many stacks still use SOAP) |
| Update ship type | — | `updateOrderShipType` |
| Update volume/weight | `updateOrderVolumeWeight` | — |
| Delete order | `deleteOrder` | `deleteOrder` |
| Update order status | `updateOrderStatus` | `updateOrderStatus` |
| Search order | `searchOrder` | `searchOrder` |
| Fee by order | `getFeeByOrderCode` | `getFeeByOrderCode` |
| Orders in time range | SOAP time-range methods | HTTPS fee list variants on official page |

## Labels, tracking, carriers

| Capability | Notes |
|------------|--------|
| Address label print | HTTPS page URL under `/order/print/index/` with `orderCodeList`, `printType`, `print_type`, `printSize` — see official docs |
| Tracking (new) | HTTPS `getTrack` |
| Carrier by number | HTTPS on official page |
| Tracking / label upload | HTTPS on official page |

## Delivery, proofs, exceptions

| Capability | Protocol |
|------------|----------|
| Domestic delivery note | SOAP |
| Ship / POD proofs | HTTPS |
| Reship fee | HTTPS |
| Problem parcels | HTTPS |
| Pickup request | HTTPS |

## Agent rule

Field-level schemas change and are lengthy. For any method you implement:

1. Open the matching section on https://www.sendfromchina.com/api  
2. Copy required/optional fields from there  
3. Do not invent `apiName` values not listed officially  

This file is a map, not a full OpenAPI substitute.
