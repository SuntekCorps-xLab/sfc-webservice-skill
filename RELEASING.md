# Releasing

This repository uses Semantic Versioning for the Skill package metadata and Git tags.

## Checklist

1. Update `package.json` `version` and add the corresponding entry to `CHANGELOG.md`.
2. Run `npm ci` and `npm run check` on Node.js 22 or newer.
3. Confirm that `SKILL.md` remains at the repository root and that installation commands still target `sfc-webservice`.
4. Create an annotated tag whose name is the version with a leading `v`, for example `v1.1.0`.
5. Push the commit and tag, then publish GitHub release notes from the matching changelog entry.

Release tags must match `package.json` exactly after removing the leading `v`.
