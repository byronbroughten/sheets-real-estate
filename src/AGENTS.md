# Rules for the app's `src/`

- **This package is the real-estate app; before adding a file, ask "would this make sense in a TypeScript project with no Sheets at all?"** Yes: `@byronbroughten/utils`, never started in the framework. Then "in a different Sheets-backed app?" Yes: `packages/framework`, generically named. No: here.
- **Import the framework only from `@byronbroughten/sheets-framework`, and `/testing` only in `*.test.ts` and the config setup file**; lint holds it. Utilities come from `@byronbroughten/utils/<module>`.
- `index.ts`: the Apps Script triggers, handing the generated `appConfigs` and `businessEndpoints` to `Api`. `businessEndpoints/`: every endpoint ([its rules](./businessEndpoints/AGENTS.md)). `chores/`: this spreadsheet's one-off jobs ([its rules](./chores/AGENTS.md)).
- **Regenerate, never hand-edit, `generated/`** (`npm run app:gen:configs`, gated by the root's `docs/targets-and-gates.md`). Outside it, import only `generated/appConfigs`; lint holds it. Grep `columnConfigs.ts` for the sheet key and read that one object.
- **The words are [GLOSSARY.md](../GLOSSARY.md)'s**, after the framework's. Code shape: the general style doc in `@byronbroughten/config`, then the framework's [rules](https://github.com/byronbroughten/sheets-framework/blob/master/docs/code-style.md).
