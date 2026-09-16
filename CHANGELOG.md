# Changelog

All notable changes to this Skill are documented here.

## [Unreleased]

- Removed the nonexistent legacy `getTrack` method from the tracking workflow; documented `searchOrder` (order status and tracking number) and the Fulfillment v3 tracking API for scan-level events (#12).
- Stopped pointing field lookups at `Cff-API-3.0.pdf` (it documents the separate Fulfillment API v3); the ishipsvc WSDL is now the documented field-level source for `addOrder` and other methods (#13).
- Replaced the "canonical documentation" pointer to `https://www.sendfromchina.com/api` (Fulfillment REST API v3 portal, no legacy WebService content) with the ishipsvc WSDL and the `https://www.sendfromchina.com/webservice` example page (#14).
- SOAP examples and skill boundaries now pin the SoapClient `location` to HTTPS because the WSDL's `soap:address` is plaintext `http://api.sfcservice.com/...`; added transport-security guidance to `references/auth.md` (#15).
- Made division discovery self-contained: `SFC_DIVISION_ID` is documented as optional in SKILL.md Step 1, Step 2 records the discovered division under that name, the HTTP example probes `1` then `17` when it is unset, and the `.env.example` comment matches the discovery rule (#17).
- Removed the orphaned `examples/https-rates.md`; its verified GET request shape is covered by `examples/legacy-rates.md`, and its unverified POST guidance contradicted the skill's transport boundaries (#18).
- Rephrased the account-specific "POST returned authentication failure" claim as account-dependent behavior across SKILL.md, `references/legacy-webservice.md` and `examples/legacy-rates.md`; `verify.mjs` now pins the neutral GET-default guidance instead of the anecdote (#19).

## [1.0.0] - 2026-08-21

- Added the initial SFC WebService integration Skill.
- Documented HTTPS and SOAP endpoints, authentication, divisions, and example requests.
- Defined the direct ERP / WMS / custom backend scope for the SFC customer WebService.

[Unreleased]: https://github.com/SuntekCorps-xLab/sfc-webservice-skill/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SuntekCorps-xLab/sfc-webservice-skill/releases/tag/v1.0.0
