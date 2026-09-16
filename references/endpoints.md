# Endpoint catalog

Canonical field-level docs: the WSDL at https://www.sendfromchina.com/ishipsvc/web-service?wsdl  
(https://www.sendfromchina.com/api is the Fulfillment REST API v3 portal — a different service)  
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
| Address label print | PDF page commonly under `https://www.sfcservice.com/order/print/index/` with URL-encoded `orderCodeList`, `printType=1`, `print_type=pdf`, `printSize=1` (10×15 cm); use this default unless SFC gives the account a different instruction. The print page is unauthenticated — treat the URL as a bearer link (private channels only, never log it) and prefer unguessable customer order codes |
| Tracking | No scan-level tracking method exists on the legacy WebService (neither `http-api` nor the WSDL). Use `searchOrder` for order status plus `trackNumber`; scan-level events come from the carrier's site or the Fulfillment v3 API `GET https://fulfill.sendfromchina.com/v3/trackings/{trackingNumber}` with its own `ApiKeyAuth` / `SignatureAuth` credentials. A new label may have no scan yet |
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

1. Open the matching operation in the WSDL at https://www.sendfromchina.com/ishipsvc/web-service?wsdl (Chinese SOAP examples: https://www.sendfromchina.com/webservice)  
2. Copy required/optional fields from there  
3. Do not invent `apiName` values not listed officially  

This file is a map, not a replacement for the official field-level specification.
