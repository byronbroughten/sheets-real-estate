# sheets-real-estate

An Apps Script app for managing rental properties — properties, units, households, leases, subsidies, charges and payments — on a Google Sheets spreadsheet that is both its database and its UI. It is a showcase of an app built on [`sheets-framework`](https://github.com/byronbroughten/sheets-framework), and is not published to npm.

## Building it

It builds only inside an npm workspace beside the framework: it depends on `@byronbroughten/sheets-framework` as `"*"`, which resolves only to a sibling workspace, since the framework isn't on npm. It has no CI for the same reason. Clone it and `sheets-framework` into a workspace root's `packages/`, then run `npm install` there.

## What's here

- `src/index.ts`: the Apps Script triggers, handing the app's configs and endpoints to the framework's `Api`.
- `src/businessEndpoints.ts` and `src/businessEndpoints/`: every endpoint, one file each, with the classes they need in `BusinessOperators/`.
- `src/chores/`: one-off jobs against this spreadsheet.
- `src/generated/`: the configs generated from the live spreadsheet; never hand-edited.
- [`CONTEXT.md`](./CONTEXT.md): this app's words, after the framework's. [`docs/occupancy-ledger.md`](./docs/occupancy-ledger.md): how the occupancy ledger is built.

## Commands

Run from the workspace root; each names the real-estate spreadsheet with `app:`.

| Command | Does |
| --- | --- |
| `npm run app:chore <name>` | Dry-runs a chore; `-- --send` applies it. |
| `npm run app:gen:configs` | Regenerates `src/generated/` from the live config sheets. **It writes to the live spreadsheet.** |
| `npm run app:probe` | One read-only Sheets request. |
| `npm run app:build` | Bundles the app and pushes it to its Apps Script project. |

## History

The history from before this package had its own repo is in [byronbroughten/byro-repo](https://github.com/byronbroughten/byro-repo).
