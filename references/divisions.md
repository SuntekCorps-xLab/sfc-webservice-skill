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
| 17 | 海外销售组 | Huizhou Warehouse |
| 30 | FBA | FBA |
| 31 | 义乌分公司 | Yiwu |
| 34 | 杭州分公司 | Hangzhou |
| 37 | 义乌仓储 | Yiwu Warehouse |
| 41 | Y | Y |

Pass as `divisionId` / `opDivision` according to each method's schema. Confirm with your account manager which divisions your contract can use.
