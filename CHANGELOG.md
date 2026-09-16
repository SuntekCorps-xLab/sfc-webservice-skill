# Changelog

All notable changes to this Skill are documented here.

## [Unreleased]

- Rewrote SKILL.md into the numbered nine-step customer journey (credentials → division discovery → destination and package facts → rate comparison → order information → preview and confirmation → `addOrder` → label and shipping instructions → tracking), and added `references/legacy-webservice.md`, the beginner HTTPS example, and the check assertions that pin the workflow (`efedb00`, `8663b90`, `b80d94b`).
- Documented verified legacy API behavior: HTTPS GET with `apiName` + URL-encoded `parameter` is the verified form for this workflow; form-encoded POST is account-dependent and must not be used unless SFC confirms and tests it for the account (`69aedb2`).
- Removed the nonexistent legacy `getTrack` method from the tracking workflow; documented `searchOrder` (order status and tracking number) and the Fulfillment v3 tracking API for scan-level events (#12).
- Stopped pointing field lookups at `Cff-API-3.0.pdf` (it documents the separate Fulfillment API v3); the ishipsvc WSDL is now the documented field-level source for `addOrder` and other methods (#13).
- Replaced the "canonical documentation" pointer to `https://www.sendfromchina.com/api` (Fulfillment REST API v3 portal, no legacy WebService content) with the ishipsvc WSDL and the `https://www.sendfromchina.com/webservice` example page (#14).
- SOAP examples and skill boundaries now pin the SoapClient `location` to HTTPS because the WSDL's `soap:address` is plaintext `http://api.sfcservice.com/...`; added transport-security guidance to `references/auth.md` (#15).
- Made division discovery self-contained: `SFC_DIVISION_ID` is documented as optional in SKILL.md Step 1, Step 2 records the discovered division under that name, the HTTP example probes `1` then `17` when it is unset, and the `.env.example` comment matches the discovery rule (#17).
- Removed the orphaned `examples/https-rates.md`; its verified GET request shape is covered by `examples/legacy-rates.md`, and its unverified POST guidance contradicted the skill's transport boundaries (#18).
- Rephrased the account-specific "POST returned authentication failure" claim as account-dependent behavior across SKILL.md, `references/legacy-webservice.md` and `examples/legacy-rates.md`; `verify.mjs` now pins the neutral GET-default guidance instead of the anecdote (#19).
- Fixed `references/divisions.md`: division 17's English name is now "Overseas Sales Group" (was the unrelated physical warehouse name "Huizhou Warehouse"), the placeholder row 41 was removed, and a note clarifies that authoritative names/availability come from SFC and warehouse addresses must never be guessed from a `divisionId` (#20).
- Documented the legacy `http-api` response envelope (HTTP 200 for all business outcomes, `{code,msg}` failure bodies, per-method success payloads, non-JSON edge cases); SKILL.md Steps 2/7 and the HTTP example now judge the parsed body instead of the HTTP status (#21).
- Fixed the credential-boundary scan in `scripts/verify.mjs`: it now matches the assignment formats the repository actually uses (`appKey`/`token`/`userId`/`SFC_*` with `:` or `=`, excluding `YOUR_*` and `<...>` placeholders), covers every Markdown file, and self-tests against realistic leak probes (#22).
- `npm run check` now lives up to the README description: link and credential scans run over every tracked Markdown file (`git ls-files '*.md'`, with a static fallback for tarballs), and JavaScript files in `scripts/` and `tests/` are syntax-checked with `node --check` (#23).
- Unified credential storage: SKILL.md Step 1 now names a concrete private file (`~/.config/sfc/credentials.env`, overridable via `SFC_ENV_FILE`) with permission commands, the HTTP example loads that file and falls back to environment variables with a clear error when credentials are missing, and README/`.env.example` match the same model (#24).
- Fixed a leftover sentence in SKILL.md Step 2 that pointed to the HTTP example "for the form-encoded POST request shape"; the example and the boundaries mandate GET (#25).
- Added an explicit transport rule against plaintext `http://`: the `http-api` host answers plain HTTP with normal business responses (no redirect, no HSTS), so SKILL.md boundaries and `references/auth.md` now require refusing any `http://` SFC URL, and the HTTP example asserts the `https://` scheme before sending (#26).
- SECURITY.md now names working private reporting channels (GitHub private vulnerability reporting — enabled for this repository — and IT_Support@SendFromChina.com) instead of pointing at admin-only repository settings (#28).

## [1.0.0] - 2026-08-21

- Added the initial SFC WebService integration Skill.
- Documented HTTPS and SOAP endpoints, authentication, divisions, and example requests.
- Defined the direct ERP / WMS / custom backend scope for the SFC customer WebService.

[Unreleased]: https://github.com/SuntekCorps-xLab/sfc-webservice-skill/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SuntekCorps-xLab/sfc-webservice-skill/releases/tag/v1.0.0
