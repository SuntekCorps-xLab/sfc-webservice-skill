# Changelog

All notable changes to this Skill are documented here.

## [Unreleased]

- Removed the nonexistent legacy `getTrack` method from the tracking workflow; documented `searchOrder` (order status and tracking number) and the Fulfillment v3 tracking API for scan-level events (#12).
- Stopped pointing field lookups at `Cff-API-3.0.pdf` (it documents the separate Fulfillment API v3); the ishipsvc WSDL is now the documented field-level source for `addOrder` and other methods (#13).
- Replaced the "canonical documentation" pointer to `https://www.sendfromchina.com/api` (Fulfillment REST API v3 portal, no legacy WebService content) with the ishipsvc WSDL and the `https://www.sendfromchina.com/webservice` example page (#14).

## [1.0.0] - 2026-08-21

- Added the initial SFC WebService integration Skill.
- Documented HTTPS and SOAP endpoints, authentication, divisions, and example requests.
- Defined the direct ERP / WMS / custom backend scope for the SFC customer WebService.

[Unreleased]: https://github.com/SuntekCorps-xLab/sfc-webservice-skill/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SuntekCorps-xLab/sfc-webservice-skill/releases/tag/v1.0.0
