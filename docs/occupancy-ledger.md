# Building an occupancy ledger

How the occupancy ledger is built, beyond [`GLOSSARY.md`](../GLOSSARY.md)'s definitions of its words, which hold the prior balance's sign, the issuers, and that a ledger line carries no identifier because nothing points at it. The endpoint is `src/businessEndpoints/buildLedger.ts`, behind `OccupancyLedgerOperator`.

## Rebuilt from scratch, one occupancy at a time

A build rebuilds the page from scratch for one occupancy, so nothing a previous build left behind can survive into the next one.

## The ledger start date cuts the page

When that occupancy names a ledger start date, the page begins that day rather than at the beginning of the tenancy. The **prior balance** is dated the start date, issued by Property management, and described as "Prior balance".

## Line order

The lines run in the order things happened, with a charge shown before anything that settled it the same day.

## Amount owed and the letterhead are formulas

Building a ledger never writes the Amount owed column. The letterhead's cells are formulas, and they read the occupancy and the date that building the ledger writes into the Variable sheet. Building a ledger is what makes the letterhead say the right household.

## How each issuer is written

A charge or a forgiveness is issued by Property management, and a payment made on the household's behalf names the payer. A payment the household made says "Household" plainly rather than repeating the tenant's name down the page. Money taken from the deposit says "Security deposit", because a draw is real money settling a bill rather than the landlord paying it, and a **security deposit draw** is named after the charge it settled.

## One line per bank transaction

The ledger shows a payment rather than its allocations, so one line matches one bank transaction.
