import { columnConfigs } from "./generated/columnConfigs";
import { sheetConfigs } from "./generated/sheetConfigs";
import { valueConfigs } from "./generated/valueConfigs";

export const appConfigs = {
  sheetConfigs,
  columnConfigs,
  valueConfigs,
};

declare module "@byronbroughten/sheets-framework" {
  interface Register {
    configs: typeof appConfigs;
  }
}
