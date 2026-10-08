import type { Endpoints } from "@byronbroughten/sheets-framework";

import { addPropertyExpense } from "./businessEndpoints/addPropertyExpense";
import { buildLedger } from "./businessEndpoints/buildLedger";

export const businessEndpoints: Endpoints = {
  addPropertyExpense_runStatus: addPropertyExpense,
  occupancy_buildLedgerTimeLastRan: buildLedger,
};
