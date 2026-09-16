# Division centers

These are the two account categories currently used by this customer workflow:

- `1`: domestic customer distribution center
- `17`: overseas customer distribution center

Try `1` first and then `17` only if the first lookup does not return a valid
non-empty shipping-method list. Do not assume both are enabled, and do not guess
another ID. The active value must be confirmed by a successful read-only lookup.

The values below are historical/common SFC IDs and must not override the discovery
process above.

| Division ID | Chinese | English |
|-------------|---------|---------|
| 1 | 深圳分公司 | Shenzhen |
| 2 | 广州分公司 | Guangzhou |
| 14 | 上海分公司 | Shanghai |
| 17 | 海外销售组 | Overseas Sales Group |
| 30 | FBA | FBA |
| 31 | 义乌分公司 | Yiwu |
| 34 | 杭州分公司 | Hangzhou |
| 37 | 义乌仓储 | Yiwu Warehouse |

Names above are historical/common labels; the authoritative name and availability
of each division for a given contract come from SFC. A division's physical
shipping warehouse may differ from its name (for example, overseas-group parcels
may be handed over through the Huizhou warehouse). Always obtain the receiving
warehouse address from SFC or the account instructions — never guess an address
from a `divisionId`.

Pass as `divisionId` / `opDivision` according to each method's schema. Confirm with your account manager which divisions your contract can use.
