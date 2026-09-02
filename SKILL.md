---
name: sfc-webservice
description: >-
  Helps developers and non-technical users plan, test, and implement the official
  SFC (SendFromChina / SFC Service) customer logistics WebService. Use whenever the
  user mentions SFC API, SFC WebService, shipping rates, shipping methods, create
  order, tracking, labels, ERP/WMS, SOAP, HTTP API, or sfcservice. Follow the
  legacy customer WebService guide and never invent undocumented fields.
---

# SFC logistics integration

This skill helps an agent turn a user's shipping requirement into a safe, testable
SFC integration. It is written so the user does not need to know API terminology.
The agent must explain the next step in plain language, collect missing business
information, and show exactly what will happen before making a real request.

## First: confirm the operation

Ask one short question if the context is unclear: do they need shipping methods,
price quotes, order creation, order lookup, labels, or tracking? This skill covers
only the SFC customer WebService documented at https://www.sendfromchina.com/api.
Read `references/legacy-webservice.md` for the protocol and operation guide.

## Safe workflow for every request

1. Translate the user's goal into one operation: list shipping methods, quote a
   shipment, create an order, query an order, print a label, or track a parcel.
2. Ask for only the information needed for that operation. For a quote, collect
   origin country, destination country, and weight. For an order, also collect the
   customer's order code, recipient, items, shipping method, dimensions, declared
   values, and any customs information required by the selected method.
3. Identify the account type and credentials. Never ask the user to paste a secret
   into chat or commit it. Use environment variables or the user's secret manager.
4. Read the matching reference and official documentation before writing a request.
   The official links are the authority because fields and authentication are
   account-specific and can change.
5. Produce a **dry run first**: show the URL, HTTP method, non-secret headers,
   redacted body, and expected result. Do not create, update, intercept, or delete
   an order without explicit confirmation immediately before the request.
6. For a read-only call, execute only after the user confirms credentials are
   configured. For a write call, confirm the exact order code, shipping method,
   recipient, and whether the request is production or test.
7. Validate both HTTP status and the business response. Follow the response
   fields in the official method documentation; never continue to label, track, or
   order based only on HTTP 200.
8. On timeout or an unknown result from order creation, **do not retry blindly**.
   Query the order using the same order code first and ask SFC support if the result
   cannot be determined.
9. Report what happened, including the operation, SFC identifier returned, and any
   next action. Redact `appKey`, `token`, `customerId`, `appToken`, API keys, and
   signatures from logs and screenshots.

## Rules that prevent common failures

- Use the legacy customer WebService credentials and request format documented in
  `references/legacy-webservice.md`. Do not introduce another SFC API family.
- Do not invent a signature algorithm, endpoint, field, unit, sandbox, or success
  code. If the account manager has not supplied it, stop and ask SFC IT Support.
- Treat shipping type codes, warehouse/division IDs, countries, customs rules,
  weight/dimension units, and required order fields as account/method-specific.
- Keep all examples on placeholders. Never use a real recipient or production
  order in a tutorial.
- A rate quote is not an order. Present the quote and selected shipping method for
  confirmation before creating an order.

## Progressive reference map

| Need | Read |
|---|---|
| Legacy SOAP/HTTP API, credentials, and request format | `references/legacy-webservice.md` |
| Legacy authentication details | `references/auth.md` |
| Legacy warehouse/division IDs | `references/divisions.md` |
| Beginner copy-and-run examples | `examples/legacy-rates.md` and `examples/soap-ship-types.md` |

Official sources:

- API landing page: https://www.sendfromchina.com/api
- IT support: IT_Support@SendFromChina.com

## What to ask the user for

Use this checklist and mark unknown items as “needs SFC confirmation” rather than
guessing:

- Which SFC API and account credentials they have;
- read-only quote/tracking versus an order-changing operation;
- origin warehouse or division, destination country/address, package weight and
  dimensions;
- selected shipping type code, if already known;
- order code and item details for an order;
- whether the request is a dry run, an authorized production action, or a test
  account.

For a non-technical user, explain that an API key/token is like a password and ask
them to place it in their local secret configuration, not send it in chat.
