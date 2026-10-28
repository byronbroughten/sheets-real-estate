# Endpoint layout

The why behind [`src/businessEndpoints/AGENTS.md`](../src/businessEndpoints/AGENTS.md)'s layout rules. Open it only when you're changing a rule, or the rule's line doesn't decide your case.

## One endpoint, one file

`src/businessEndpoints.ts` stays a registry: each entry's body lives in `businessEndpoints/<name>.ts` as a single exported `Endpoint<"thatSheet">` the registry imports and assigns to its key. An endpoint's size then never crowds its neighbours, and the registry's plain `: Endpoints` annotation still catches a key naming a column that doesn't exist. `businessEndpoints/buildLedger.ts` is the reference. `businessEndpoints/addPropertyExpense.ts` was the last inline entry, an empty action with nothing to move, and arrived as a file of its own with the work behind it (#24), so no entry is inline any more.

## Two shapes for an endpoint body

The default is module-private helpers around the entry. Once a body turns unwieldy the logic moves onto a business operator under `businessEndpoints/BusinessOperators/`, and the entry keeps a one-line action delegating to it. Both current endpoints have that shape: `buildLedger.ts` behind `OccupancyLedgerOperator` (#22), and `addPropertyExpense.ts` behind `PropertyExpenseOperator` (#24). No endpoint holds the default shape today.

The threshold between them is the framework's ["Coordinator classes"](https://github.com/byronbroughten/sheets-framework/blob/master/docs/code-style/class-shape.md#coordinator-classes), with `buildLedger.ts` as its worked example. That section was mined from the framework tiers and otherwise doesn't govern endpoints.

## No operator scoped to the occupancy row

Building a ledger reads exactly three cells off the occupancy row: its id, its name and its ledger start date. Three plain reads aren't a domain query, so such a class would be created empty and do nothing a getter doesn't. `OccupancyLedgerOperator` is the row's only reader. Build one when a caller needs behaviour on the row itself, such as validating or writing its cells, or when a second caller reads it.
