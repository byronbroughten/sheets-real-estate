# Rules for `src/businessEndpoints/`

- **Real-estate logic lives only here and in `src/businessEndpoints.ts`.** The numbered tiers stay domain-free.
- **Framework code comes only from `@byronbroughten/sheets-framework`, and in tests also from `@byronbroughten/sheets-framework/testing`**: see [`src/AGENTS.md`](../AGENTS.md).
- **One endpoint, one file: each exports a single `Endpoint`** that `src/businessEndpoints.ts` imports and wires to its key; the registry holds no inline body.
- **An endpoint body is module-private helpers by default; once unwieldy, a business operator in `BusinessOperators/` behind a one-line action**, as `buildLedger.ts` and `addPropertyExpense.ts` are.
- **An operator scoped to the occupancy row is deliberately absent**: its one reader takes three plain cells.
- Why each layout rule holds: [`docs/endpoint-layout.md`](../../docs/endpoint-layout.md).
- **A business Operator's public verbs come from [GLOSSARY.md](../../GLOSSARY.md).** Use the glossary's word; if it has none, raise the gap rather than invent one.
- **An endpoint that appends into its own sheet is initiated and reports from another sheet**, or its feedback stamps rows it is still creating.
- The ledger's build behavior: [`docs/occupancy-ledger.md`](../../docs/occupancy-ledger.md). Dispatch and run states: [the framework's `endpoint-dispatch.md`](https://github.com/byronbroughten/sheets-framework/blob/master/docs/architecture/endpoint-dispatch.md).
