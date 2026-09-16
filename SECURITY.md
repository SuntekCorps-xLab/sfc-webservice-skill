# Security Policy

## Reporting a vulnerability

Do not open a public issue for credentials, authentication defects, or a vulnerability. Report privately through either channel:

1. GitHub private vulnerability reporting (enabled for this repository): Security tab → Advisories → "Report a vulnerability" at https://github.com/SuntekCorps-xLab/sfc-webservice-skill/security/advisories/new
2. Email SFC IT Support: IT_Support@SendFromChina.com (the official support contact also published on https://www.sendfromchina.com/api)

Never include live `appKey`, `token`, `userId`, customer records, shipment records, or production request/response payloads in an issue or pull request.

## Supported versions

Only the latest published release receives documentation and security corrections. The Skill does not store or transmit credentials by itself; integrations must keep secrets in an environment variable or secret manager.
