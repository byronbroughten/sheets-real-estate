import { Api } from "@byronbroughten/sheets-framework";

import { businessEndpoints } from "./businessEndpoints.js";
import { appConfigs } from "./generated/appConfigs.js";

// Also the named level, perhaps check that table start rows are where you expect them all to be.
// sheet.validateSchemaIndexes()

const app = { configs: appConfigs, endpoints: businessEndpoints };

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Apps Script calls it as a global trigger
function triggerOnEdit(e: GoogleAppsScript.Events.SheetsOnEdit): void {
  Api.handleSheetEdit(app, e);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Apps Script calls it as a global trigger
function triggerOnChange(e: GoogleAppsScript.Events.SheetsOnChange): void {
  Api.handleSheetChange(app, e);
}
