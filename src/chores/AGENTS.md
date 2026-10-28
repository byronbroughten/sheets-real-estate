# Rules for the app's `src/chores/`

- **`npm run app:chore <name>` is a dry run and always safe**: the Node host adapter suppresses its writes.
- **`npm run app:chore <name> -- --send` writes to the live real-estate sheet, and runs only after this session dry-ran that chore.** Google's version history is its undo; the root's [tier list](https://github.com/byronbroughten/byro-repo/blob/master/docs/targets-and-gates.md#which-tier-an-action-is-in) gates it.
- **Verify a dry run's preview before handing it over**: compare the rendered requests with what the chore was meant to do, and call out anything wrong or larger than intended.
- **`oneOff/` is for transient chores, deleted in the commit that records their run.** A chore needed again belongs here or in the framework. Homes: [the framework's `chores.md`](https://github.com/byronbroughten/sheets-framework/blob/master/docs/architecture/chores.md).
