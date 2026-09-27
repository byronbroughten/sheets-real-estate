import { SpreadsheetBaseNamed } from "@byronbroughten/sheets-framework";
import {
  buildGridRows,
  EndpointRun,
  type FakeCell,
  type FakeCellValue,
  type FakeGridView,
  type FakeSheetProperties,
  stubLogger,
  stubSheetsService,
} from "@byronbroughten/sheets-framework/testing";
import { beforeEach, describe, expect, it } from "vitest";

import { Val } from "../appUtils/Val";
import { columnConfigs } from "../generated/columnConfigs";
import { sheetConfigs } from "../generated/sheetConfigs";
import { addPropertyExpense } from "./addPropertyExpense";

interface ColumnFixture {
  columnId: string;
  header: string;
}
type FakeRow<C> = Partial<Record<keyof C, FakeCell>>;

const topDataRowIndex = 4;
const stagingGid = sheetConfigs.addPropertyExpense.sheetGid;
const expenseGid = sheetConfigs.propertyExpense.sheetGid;
const receiptGid = sheetConfigs.splitReceipt.sheetGid;

const caseProperty = "r:prp:case";
const caseName = "140 Case";
const charlesProperty = "r:prp:charles";
const charlesName = "282 Charles";
const caseUnit = "r:unt:caseOne";
const caseUnitName = "140 Case, Unit 1";
const charlesUnit = "r:unt:charlesOne";
const charlesUnitName = "282 Charles, Unit 1";

const hardwareReceipt = "r:srct:hardware";
const hardwareReceiptName = "Hardware store, 3 Mar";
const lumberReceiptName = "Lumber yard, 4 Mar";

const dayOne = 45000;

const stagingColumnNames = [
  "date",
  "propertyName",
  "unitName",
  "billerName",
  "description",
  "amount",
  "expenseCategory",
  "taxAdjust",
  "receiptFormat",
  "notes",
  "runStatus",
  "splitReceiptName",
  "isUpfrontInvestment",
] as const;

const expenseColumnNames = [
  "expenseName",
  "id",
  "propertyId",
  "date",
  "year",
  "propertyYearId",
  "unitId",
  "billerName",
  "description",
  "expenseCategory",
  "receiptFormat",
  "amount",
  "taxDeductibleAmount",
  "taxAdjust",
  "isUpfrontInvestment",
  "notes",
  "splitReceiptId",
] as const;

type StagingRowValues = Record<
  (typeof stagingColumnNames)[number],
  FakeCellValue
>;
type ExpenseRow = Record<(typeof expenseColumnNames)[number], FakeCellValue>;

const stagingRunStatusColIndex = stagingColumnNames.indexOf("runStatus");
const receiptIdColIndex = 1;

interface SheetStubProps<C> {
  sheetName: keyof typeof sheetConfigs;
  config: C;
  columnNames: readonly (keyof C)[];
  dataRows: readonly FakeRow<C>[];
  // The title, not the config name, is what a refusal message quotes.
  title?: string;
}

function stubSheet<C extends Record<string, ColumnFixture>>({
  sheetName,
  config,
  columnNames,
  dataRows,
  title = sheetName,
}: SheetStubProps<C>): FakeSheetProperties {
  const columnOf = (columnName: keyof C): ColumnFixture =>
    Val.assert(config[columnName], `column "${String(columnName)}"`);
  return {
    sheetId: sheetConfigs[sheetName].sheetGid,
    title,
    rows: buildGridRows({
      0: columnNames.map((columnName) => columnOf(columnName).columnId),
      3: columnNames.map((columnName) => columnOf(columnName).header),
      ...Object.fromEntries(
        dataRows.map((row, index) => [
          topDataRowIndex + index,
          columnNames.map((columnName) => row[columnName] ?? null),
        ]),
      ),
    }),
    table: { endRowIndex: topDataRowIndex + dataRows.length },
  };
}

type StagingRow = FakeRow<typeof columnConfigs.addPropertyExpense>;

// Everything a person must type, so a test only has to say what it varies.
function typedRow(overrides: StagingRow = {}): StagingRow {
  return {
    date: dayOne,
    billerName: "Ace Hardware",
    description: "Furnace filters",
    amount: 24,
    expenseCategory: "Supplies",
    receiptFormat: "Physical",
    isUpfrontInvestment: false,
    ...overrides,
  };
}

function stubStaging(dataRows: readonly StagingRow[]): FakeSheetProperties {
  return stubSheet({
    sheetName: "addPropertyExpense",
    config: columnConfigs.addPropertyExpense,
    columnNames: stagingColumnNames,
    dataRows,
  });
}

function stubProperty(
  dataRows?: readonly FakeRow<typeof columnConfigs.property>[],
) {
  return stubSheet({
    sheetName: "property",
    title: "Property",
    config: columnConfigs.property,
    columnNames: ["name", "id"],
    dataRows: dataRows ?? [
      { name: caseName, id: caseProperty },
      { name: charlesName, id: charlesProperty },
    ],
  });
}

function stubUnit() {
  return stubSheet({
    sheetName: "unit",
    title: "Unit",
    config: columnConfigs.unit,
    columnNames: ["name", "id", "propertyId"],
    dataRows: [
      { name: caseUnitName, id: caseUnit, propertyId: caseProperty },
      { name: charlesUnitName, id: charlesUnit, propertyId: charlesProperty },
    ],
  });
}

// The second receipt has no id yet, which the run is expected to mint.
function stubSplitReceipt() {
  return stubSheet({
    sheetName: "splitReceipt",
    title: "Split Receipt",
    config: columnConfigs.splitReceipt,
    columnNames: ["name", "id"],
    dataRows: [
      { name: hardwareReceiptName, id: hardwareReceipt },
      { name: lumberReceiptName },
    ],
  });
}

const previousExpenseCount = 2;

// Two rows, so an append can never collapse into a blank-row reuse.
function stubPropertyExpense() {
  return stubSheet({
    sheetName: "propertyExpense",
    config: columnConfigs.propertyExpense,
    columnNames: expenseColumnNames,
    dataRows: [
      { id: "r:pex:old", propertyId: caseProperty, date: 44000, amount: 10 },
      {
        id: "r:pex:older",
        propertyId: charlesProperty,
        date: 44001,
        amount: 20,
      },
    ],
  });
}

interface ExpenseSpreadsheetProps {
  stagingRows: readonly StagingRow[];
  properties?: readonly FakeRow<typeof columnConfigs.property>[];
}

function stubExpenseSpreadsheet({
  stagingRows,
  properties,
}: ExpenseSpreadsheetProps) {
  return stubSheetsService({
    sheets: [
      stubStaging(stagingRows),
      stubProperty(properties),
      stubUnit(),
      stubSplitReceipt(),
      stubPropertyExpense(),
    ],
  });
}

function runAddPropertyExpense(): void {
  const run = new EndpointRun({
    ...SpreadsheetBaseNamed.initSpreadsheetNamedProps(),
    sheetName: "addPropertyExpense",
    entryColumnName: "runStatus",
    endpoint: addPropertyExpense,
  });
  run.sheet.identified.meta.ensureColumnIdsAreFetched();
  run.run(true);
}

function rowsOf<N extends string>(
  grid: FakeGridView,
  sheetGid: number,
  columnNames: readonly N[],
): Record<N, FakeCellValue>[] {
  return grid
    .sheet(sheetGid)
    .values({
      startRowIndex: topDataRowIndex,
      endColumnIndex: columnNames.length,
    })
    .map(
      (row) =>
        Object.fromEntries(
          columnNames.map((columnName, colIndex) => [
            columnName,
            row[colIndex] ?? null,
          ]),
        ) as Record<N, FakeCellValue>,
    );
}

// Formula columns stay empty in the fake, and the minted id is random, so both are left out.
function expensesAdded(grid: FakeGridView): Partial<ExpenseRow>[] {
  return rowsOf(grid, expenseGid, expenseColumnNames)
    .slice(previousExpenseCount)
    .map(({ id: _id, ...expense }) =>
      Object.fromEntries(
        Object.entries(expense).filter(([, value]) => value !== null),
      ),
    );
}

function stagingRows(grid: FakeGridView): StagingRowValues[] {
  return rowsOf(grid, stagingGid, stagingColumnNames);
}

function rowMessages(grid: FakeGridView): FakeCellValue[] {
  return stagingRows(grid).map((row) => row.runStatus);
}

function runStatusCells(grid: FakeGridView): FakeCell[] {
  return grid
    .sheet(stagingGid)
    .rows({
      startRowIndex: topDataRowIndex,
      startColumnIndex: stagingRunStatusColIndex,
      endColumnIndex: stagingRunStatusColIndex + 1,
    })
    .map(([cell]) => cell ?? null);
}

const warningColour = { red: 0.99, green: 0.85, blue: 0.7 };

beforeEach(() => {
  stubLogger();
});

describe("addPropertyExpense, a mixed batch", () => {
  const mixedBatch = [
    typedRow({ unitName: caseUnitName }),
    typedRow({ unitName: "140 Case, Unit 9" }),
    typedRow({ propertyName: charlesName, amount: null }),
  ];

  it("adds the good row and leaves the two bad ones where they are", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: mixedBatch,
    });

    runAddPropertyExpense();

    expect(expensesAdded(grid)).toEqual([
      {
        propertyId: caseProperty,
        unitId: caseUnit,
        splitReceiptId: "",
        date: dayOne,
        billerName: "Ace Hardware",
        description: "Furnace filters",
        amount: 24,
        expenseCategory: "Supplies",
        receiptFormat: "Physical",
        taxAdjust: "",
        isUpfrontInvestment: false,
        notes: "",
      },
    ]);
    expect(stagingRows(grid)).toMatchObject(mixedBatch.slice(1));
  });

  it("tells each refused row what is wrong with it, in its own cell", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: mixedBatch,
    });

    runAddPropertyExpense();

    expect(rowMessages(grid)).toEqual([
      'This row was not added: no row of Unit is named "140 Case, Unit 9".',
      "This row was not added: Amount is blank.",
    ]);
  });

  // Fails until #5: the run-level status never reaches the sheet.
  it.fails("ends in the warning state, saying how much of the batch went through", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: mixedBatch,
    });

    runAddPropertyExpense();

    expect(runStatusCells(grid)).toContainEqual({
      value: "Added 1 of 3 rows; the rest say why in their own cells.",
      backgroundColor: warningColour,
    });
  });

  it("reads every input sheet in one fetch cycle of its own", () => {
    const { getByDataFilterCalls } = stubExpenseSpreadsheet({
      stagingRows: mixedBatch,
    });

    runAddPropertyExpense();

    expect(getByDataFilterCalls).toHaveLength(3);
  });
});

describe("addPropertyExpense, naming the property and the unit", () => {
  it("takes the property from the unit when only a unit is named", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [typedRow({ unitName: charlesUnitName })],
    });

    runAddPropertyExpense();

    expect(expensesAdded(grid)[0]).toMatchObject({
      propertyId: charlesProperty,
      unitId: charlesUnit,
    });
  });

  it("leaves the unit blank when only a property is named", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [typedRow({ propertyName: caseName })],
    });

    runAddPropertyExpense();

    expect(expensesAdded(grid)[0]).toMatchObject({
      propertyId: caseProperty,
      unitId: "",
    });
  });

  it("accepts a row naming a unit and that unit's own property", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [
        typedRow({ unitName: caseUnitName, propertyName: caseName }),
      ],
    });

    runAddPropertyExpense();

    expect(expensesAdded(grid)[0]).toMatchObject({
      propertyId: caseProperty,
      unitId: caseUnit,
    });
  });

  it("refuses a row whose unit and property disagree", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [
        typedRow({ unitName: caseUnitName, propertyName: charlesName }),
      ],
    });

    runAddPropertyExpense();

    expect(expensesAdded(grid)).toEqual([]);
    expect(rowMessages(grid)[0]).toBe(
      'This row was not added: unit "140 Case, Unit 1" does not belong to property "282 Charles".',
    );
  });

  it("refuses a row naming neither a unit nor a property", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [typedRow()],
    });

    runAddPropertyExpense();

    expect(rowMessages(grid)[0]).toBe(
      "This row was not added: name a unit or a property.",
    );
  });

  it("refuses a name that matches more than one row, and says how many", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [typedRow({ propertyName: caseName })],
      properties: [
        { name: caseName, id: caseProperty },
        { name: caseName, id: "r:prp:caseAgain" },
      ],
    });

    runAddPropertyExpense();

    expect(rowMessages(grid)[0]).toBe(
      'This row was not added: 2 rows of Property are named "140 Case".',
    );
  });

  it("names both an unknown unit and an unknown property at once", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [
        typedRow({ unitName: "140 Case, Unit 9", propertyName: "9 Nowhere" }),
      ],
    });

    runAddPropertyExpense();

    expect(rowMessages(grid)[0]).toBe(
      'This row was not added: no row of Unit is named "140 Case, Unit 9"; no row of Property is named "9 Nowhere".',
    );
  });

  it("lists every fault on a row with more than one", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [typedRow({ amount: null, description: null })],
    });

    runAddPropertyExpense();

    expect(rowMessages(grid)[0]).toBe(
      "This row was not added: Description is blank; Amount is blank; name a unit or a property.",
    );
  });
});

describe("addPropertyExpense, the split receipt", () => {
  it("carries a named receipt's id across", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [
        typedRow({
          propertyName: caseName,
          splitReceiptName: hardwareReceiptName,
        }),
      ],
    });

    runAddPropertyExpense();

    expect(expensesAdded(grid)[0]).toMatchObject({
      splitReceiptId: hardwareReceipt,
    });
  });

  it("gives a receipt with no id one during the run, and uses it", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [
        typedRow({
          propertyName: caseName,
          splitReceiptName: lumberReceiptName,
        }),
      ],
    });

    runAddPropertyExpense();

    const mintedId = grid
      .sheet(receiptGid)
      .values({ startRowIndex: topDataRowIndex + 1 })[0]?.[receiptIdColIndex];
    expect(mintedId).toMatch(/^r:srct:/);
    expect(expensesAdded(grid)[0]).toMatchObject({
      splitReceiptId: mintedId,
    });
  });
});

describe("addPropertyExpense, what the sheet is left holding", () => {
  const cleanBatch = [
    typedRow({ unitName: caseUnitName }),
    typedRow({ propertyName: charlesName }),
  ];

  it("empties the staging sheet to one blank row after a clean batch", () => {
    const { grid } = stubExpenseSpreadsheet({ stagingRows: cleanBatch });

    runAddPropertyExpense();

    expect(stagingRows(grid)).toEqual([
      {
        ...Object.fromEntries(
          stagingColumnNames.map((columnName) => [columnName, ""]),
        ),
        runStatus: expect.any(String),
      },
    ]);
  });

  // Fails until #5: the run-level status never reaches the sheet.
  it.fails("says how many expenses a clean batch added", () => {
    const { grid } = stubExpenseSpreadsheet({ stagingRows: cleanBatch });

    runAddPropertyExpense();

    expect(rowMessages(grid)).toEqual(["Added 2 expenses."]);
  });

  it("says there was nothing to add when every row is blank", () => {
    const { grid } = stubExpenseSpreadsheet({
      stagingRows: [{}],
    });

    runAddPropertyExpense();

    expect(stagingRows(grid)).toEqual([
      {
        ...Object.fromEntries(
          stagingColumnNames.map((columnName) => [columnName, null]),
        ),
        runStatus: "There are no expenses to add.",
      },
    ]);
    expect(expensesAdded(grid)).toEqual([]);
  });
});
