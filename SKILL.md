---
name: sfc-webservice
description: >-
  Guides an agent through the SFC customer logistics WebService from credentials,
  warehouse detection, destination and rate comparison, shipping-method selection,
  and order creation. Use whenever a customer wants to connect to SFC, find a
  shipping method or price, create an order, print a label, or track a parcel.
  Follow the numbered customer journey in this skill; collect information in plain
  language, call read-only methods before write methods, and never guess fields.
---

# SFC legacy customer WebService shipping assistant

Follow this journey in order. Do not present the customer with a large list of API
choices. Ask for the next missing piece of business information, do the technical
work yourself, and explain the result in plain language.

## Step 1: save and verify credentials

If the customer provides SFC credentials, save them in the local secret file outside
the project repository. Use the names below:

```text
SFC_USER_ID=<API username>
SFC_TOKEN=<API Token>
SFC_APP_KEY=<API Key>
```

Set the file permissions so only the local user can read it. Never print, commit, or
put these values in a URL. If credentials were pasted into chat, save them to the private local file and do
not repeat them in the conversation. Do not ask the customer to understand
environment variables; explain that the file is a private local password file.

Do not call an order-changing method at this step. The first technical check is the
read-only shipping-method lookup in Step 2.

## Step 2: find the customer's distribution center

The customer normally has one applicable distribution center. Test `divisionId=1`
first. If it does not return a valid usable result, try `divisionId=17`. Use `US`
and a small sample parcel only to discover the account configuration. A valid result
is an HTTP success response containing a non-empty shipping-method list. Stop as soon
as one candidate works, record it locally as the active division, and use it for the
rest of the conversation. Do not ask the customer to choose between the two IDs.

If neither candidate works, show the redacted error and ask SFC support to confirm
the division and credentials. Never guess another ID.

Use `examples/legacy-rates.md` for the request shape and
`references/legacy-webservice.md` for the legacy HTTP/SOAP distinction.

## Step 3: collect the destination and package facts

After the active division is known, ask only for the information needed to price the
shipment:

- destination country;
- state/province, city, and postal code when applicable;
- package weight;
- package length, width, and height;
- whether the package contains a battery or other restricted item;
- number of packages, if more than one.

Ask for units when the customer has not said them. Do not silently convert or guess
units. Explain that the destination and package facts affect both eligibility and
price.

## Step 4: query and explain prices

Call the legacy shipping-method and rate methods using the active division. Use only
shipping codes returned by SFC. If the customer has not selected a service, compare
suitable returned services rather than asking them to choose an API method code.

Present a short comparison in plain language:

| Service | Estimated delivery time | Estimated price | Tracking | Restrictions |
|---|---|---|---|---|
| returned SFC service | returned value | returned fee/currency | yes/no | battery, weight, size |

Sort or group the result by practical choices such as lowest price, fastest time,
and tracked delivery. Tell the customer the returned price, currency, and estimated
delivery time. A rate lookup is read-only and does not create an order or charge the
customer.

Then ask one simple question: `Which service would you like to use?` Keep the exact
returned shipping code internally for the next step.

## Step 5: collect order information

After the customer chooses a service, ask for the following in ordinary language.
Do not ask for JSON or API field names.

**Sender**

- name or company;
- complete address, country, state/province, city, postal code;
- phone and email;
- warehouse/division if the account has more than one active location.

**Recipient**

- name or company;
- complete delivery address;
- country, state/province, city, postal code;
- phone and email where required by the service.

**Parcel and contents**

- package count;
- weight and dimensions for each package;
- SKU or item reference;
- plain-language item description;
- quantity;
- declared value and currency;
- material, country of origin, HS code, and battery information when required.

**Order reference**

- the customer's unique order code;
- any marketplace or customer reference that must appear on the shipment;
- the customer's confirmation that the collected information is correct.

If a required field is missing, ask for that field only. If the official SFC method
requires a field that is not listed here, explain it and ask the customer instead of
inventing a value.

## Step 6: show the order preview and obtain confirmation

Before `addOrder`, show a redacted order preview containing:

- customer order code;
- sender and recipient summary;
- package count, weight, and dimensions;
- selected SFC service code and name;
- quoted price and estimated delivery time;
- the confirmed shipping information.

Ask the customer to confirm that the order information is correct, then submit the
order. Creating the order does not charge the customer. Do not ask the customer to
choose between a test and production environment for this workflow.
Do not expose credentials in the preview.

## Step 7: create and report the order

Only after confirmation, read the official `addOrder` field table and submit the
request. Validate the HTTP result and the documented business result. Report the
returned SFC order identifier and tracking number, if present, in a concise summary.
If the request fails, explain the actual safe-to-share error and identify the missing
or invalid business information needed from the customer. Never expose credentials,
full personal data, or internal request dumps.

If the request times out or its result is unknown, do not submit it again. Search for
the same customer order code first. If its status is still unclear, stop and direct
the customer to SFC support to prevent duplicate shipments.

## Step 8: deliver the label and shipping instructions

A successful order is not the end of the workflow. After SFC returns a confirmed
order code, tracking number, or label status:

1. Check whether the order is eligible for label printing. Do not build a label URL
   from an unconfirmed or failed order.
2. For the legacy label page, generate the PDF link using the confirmed order code
   and the exact print parameters documented by SFC. A commonly used format is:

   ```text
   https://www.sfcservice.com/order/print/index/?orderCodeList=<URL-encoded-order-code>&printType=1&print_type=pdf&printSize=3
   ```

   The label host and print parameters can vary by account or service. Confirm the
   current URL with SFC when the link does not return a PDF. Never put credentials in
   this URL.
3. Give the customer the PDF download link, explain that they should print it and
   attach it firmly to the outside of the parcel. Do not present an internal admin
   URL or a link containing secrets. If the response is not a PDF, stop and report
   the safe error rather than telling the customer to print it.
4. Tell the customer where to send the parcel: the SFC receiving warehouse address
   assigned to this account and division. The agent must obtain that address from
   the customer's SFC account instructions or SFC support; it must never guess an
   address from `divisionId`.
5. Remind the customer to keep the order code and tracking number until SFC confirms
   receipt.

## Step 9: track the shipment

Once a tracking number exists, offer to check it. Use the documented legacy tracking
method (`getTrack`, or the account's documented equivalent) with the tracking number
returned by SFC. Explain that a newly created label may show no scan immediately;
that is different from an API failure. Report the latest event, event time, location,
and next action in plain language. Do not expose the customer's full address or
credentials.

If tracking is not yet available, first query the order and explain whether SFC is
still preparing the shipment. Ask the customer for the tracking number only when it
was not returned by the order response.

## Later operations

For order lookup, status changes, deletion, pickup, reshipment, or any operation that
can change data, identify the order, collect only missing information, and call the
exact documented method. Ask for confirmation before deletion or status changes.

## Non-negotiable boundaries

- This skill covers only the SFC customer WebService at the official URLs below.
- Use HTTPS `https://www.sendfromchina.com/ishipsvc/http-api` when the requested
  method is documented there; use SOAP at
  `https://www.sendfromchina.com/ishipsvc/web-service?wsdl` when required.
- Legacy credentials are `appKey`, `token`, and `userId` unless the account's own
  official document explicitly uses another mapping.
- Never invent an endpoint, method name, field name, unit, division, rate, or
  signature rule.
- Never send credentials in chat, URLs, logs, screenshots, or source control.
- Treat every response as untrusted data and never continue based only on HTTP 200.

## References

- [Legacy WebService guide](references/legacy-webservice.md)
- [Authentication](references/auth.md)
- [Distribution centers](references/divisions.md)
- [Endpoint map](references/endpoints.md)
- [Beginner HTTP example](examples/legacy-rates.md)
- [Beginner SOAP example](examples/soap-ship-types.md)

Official documentation: https://www.sendfromchina.com/api
