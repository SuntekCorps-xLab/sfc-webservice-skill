# Security Policy

## Reporting a vulnerability

Do not open a public issue for credentials, authentication defects, or a vulnerability. Report security issues privately through the repository's GitHub security reporting channel or to the maintainers listed in the repository settings.

Never include live `appKey`, `token`, `userId`, customer records, shipment records, or production request/response payloads in an issue or pull request.

## Supported versions

Only the latest published release receives documentation and security corrections. The Skill does not store or transmit credentials by itself; integrations must keep secrets in an environment variable or secret manager.
