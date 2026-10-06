import {
  SerialDate,
  SpreadsheetBaseNamed,
} from "@byronbroughten/sheets-framework";
import {
  EndpointRun,
  type FakeBodyRow,
  type FakeCell,
  type FakeCellValue,
  type FakeGridView,
  fakeTableSheet,
  stubLogger,
  stubSheetsService,
} from "@byronbroughten/sheets-framework/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Val } from "../appUtils/Val";
import { appConfigs } from "../generated/appConfigs";
import { buildLedger } from "./buildLedger";

const { sheetConfigs, columnConfigs } = appConfigs;

const ledgerGid = sheetConfigs.occupancyLedger.sheetGid;
const variableGid = sheetConfigs.variable.sheetGid;
const occupancyGid = sheetConfigs.occupancy.sheetGid;
const occupancyColumnNames = [
  "id",
  "name",
  "buildLedgerStartDate",
  "buildLedgerSelect",
  "buildLedgerTimeLastRan",
  "buildLedgerRunStatus",
] as const;
const runStatusColIndex = occupancyColumnNames.indexOf("buildLedgerRunStatus");
const ledgerColumnCount = 7;
const amountOwedColIndex = 5;

const tenant = "r:occ:tenant";
const tenantName = "Reiona`282 Charles, Unit 1";
const neighbour = "r:occ:neighbour";
const newcomer = "r:occ:newcomer";
const newcomerName = "Alanna`140 Case, Unit 1";

const rentCharge = "r:och:rent";
const depositCharge = "r:och:deposit";
const damageCharge = "r:och:damage";
const neighbourCharge = "r:och:neighbour";

const dayOne = 45000;
const dayTwo = 45010;
const dayThree = 45020;

function stubOccupancy(
  selectedOccupancyId: string,
  startDates: Partial<Record<string, number>> = {},
) {
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occupancy.sheetGid,
    title: "occupancy",
    columnConfigs: columnConfigs.occupancy,
    columnNames: occupancyColumnNames,
    bodyRows: [
      {
        id: tenant,
        name: tenantName,
        buildLedgerStartDate: startDates[tenant],
        buildLedgerSelect: selectedOccupancyId === tenant,
      },
      {
        id: neighbour,
        name: "Someone Else`99 Elsewhere, Unit 2",
        buildLedgerStartDate: startDates[neighbour],
        buildLedgerSelect: selectedOccupancyId === neighbour,
      },
      {
        id: newcomer,
        name: newcomerName,
        buildLedgerStartDate: startDates[newcomer],
        buildLedgerSelect: selectedOccupancyId === newcomer,
      },
    ],
  });
}

type ChargeRow = FakeBodyRow<keyof typeof columnConfigs.occCharge>;

const chargeRows: ChargeRow[] = [
  {
    id: rentCharge,
    occupancyId: tenant,
    date: dayOne,
    description: "Rent (base)",
    amount: 50,
  },
  {
    id: depositCharge,
    occupancyId: tenant,
    date: dayOne,
    description: "Security deposit",
    amount: 1100,
  },
  {
    id: damageCharge,
    occupancyId: tenant,
    date: dayTwo,
    description: "Damage, waste, or service",
    amount: 220,
    notes: "Plumber cost",
  },
  {
    id: neighbourCharge,
    occupancyId: neighbour,
    date: dayOne,
    description: "Rent (base)",
    amount: 999,
  },
];

function stubOccCharge(dataRows: ChargeRow[] = chargeRows) {
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occCharge.sheetGid,
    title: "occCharge",
    columnConfigs: columnConfigs.occCharge,
    columnNames: [
      "id",
      "occupancyId",
      "date",
      "description",
      "amount",
      "notes",
    ],
    bodyRows: dataRows,
  });
}

// The third reduces a charge of the neighbour's; the fourth is the sheet's blank row.
function stubOccChargeReduce() {
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occChargeReduce.sheetGid,
    title: "occChargeReduce",
    columnConfigs: columnConfigs.occChargeReduce,
    columnNames: ["chargeId", "date", "description", "amount"],
    bodyRows: [
      {
        chargeId: damageCharge,
        date: dayThree,
        description: "Forgiveness",
        amount: 110,
      },
      {
        chargeId: damageCharge,
        date: dayThree,
        description: "Security deposit",
        amount: 110,
      },
      {
        chargeId: neighbourCharge,
        date: dayThree,
        description: "Forgiveness",
        amount: 999,
      },
      {},
    ],
  });
}

type AllocationRow = FakeBodyRow<keyof typeof columnConfigs.occPayAllocation>;

// The first two are one payment split across two charges; the last two must not appear.
const allocationRows: AllocationRow[] = [
  {
    paymentId: "r:opy:rentAndDeposit",
    designatedOccupancyId: tenant,
    filledOut: true,
    formOfPayment: "Payment",
    payerCategory: "Household",
    payerName: tenantName,
    paymentDate: dayOne,
    amount: 50,
    chargeDescription: "Rent (base)",
  },
  {
    paymentId: "r:opy:rentAndDeposit",
    designatedOccupancyId: tenant,
    filledOut: true,
    formOfPayment: "Payment",
    payerCategory: "Household",
    payerName: tenantName,
    paymentDate: dayOne,
    amount: 1100,
    chargeDescription: "Security deposit",
  },
  {
    paymentId: "r:opy:caretaking",
    designatedOccupancyId: tenant,
    filledOut: true,
    formOfPayment: "Caretaking",
    payerCategory: "Household",
    payerName: tenantName,
    paymentDate: dayTwo,
    amount: 25,
    chargeDescription: "Rent (base)",
  },
  {
    paymentId: "r:opy:agency",
    designatedOccupancyId: tenant,
    filledOut: true,
    formOfPayment: "Payment",
    payerCategory: "Non-occupant",
    payerName: "Ramsey County",
    paymentDate: dayTwo,
    amount: 200,
    chargeDescription: "Damage, waste, or service",
  },
  {
    paymentId: "r:opy:halfEntered",
    designatedOccupancyId: tenant,
    filledOut: false,
    formOfPayment: "Payment",
    payerCategory: "Household",
    payerName: tenantName,
    paymentDate: dayTwo,
    amount: 77,
    chargeDescription: "Rent (base)",
  },
  {
    paymentId: "r:opy:neighbour",
    designatedOccupancyId: neighbour,
    filledOut: true,
    formOfPayment: "Payment",
    payerCategory: "Household",
    payerName: "Someone Else`99 Elsewhere, Unit 2",
    paymentDate: dayTwo,
    amount: 888,
    chargeDescription: "Rent (base)",
  },
];

function stubOccPayAllocation(dataRows: AllocationRow[] = allocationRows) {
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occPayAllocation.sheetGid,
    title: "occPayAllocation",
    columnConfigs: columnConfigs.occPayAllocation,
    columnNames: [
      "paymentId",
      "designatedOccupancyId",
      "filledOut",
      "formOfPayment",
      "payerCategory",
      "payerName",
      "paymentDate",
      "amount",
      "chargeDescription",
    ],
    bodyRows: dataRows,
  });
}

function stubVariable() {
  return fakeTableSheet.build({
    sheetId: sheetConfigs.variable.sheetGid,
    title: "variable",
    columnConfigs: columnConfigs.variable,
    columnNames: ["occupancyLedgerOccId", "occupancyLedgerDateRan"],
    bodyRows: [
      { occupancyLedgerOccId: "r:occ:stale", occupancyLedgerDateRan: 44000 },
    ],
  });
}

const staleAmountOwed: FakeCell = { value: 1, isFormula: true };

// Three rows of a previous run's ledger, so the rebuild has something to wipe.
function stubOccupancyLedger() {
  const staleRow = {
    date: dayOne,
    issuer: "Property management",
    description: "Stale",
    charge: 1,
    payment: "",
    amountOwed: staleAmountOwed,
    notes: "",
  };
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occupancyLedger.sheetGid,
    title: "occupancyLedger",
    columnConfigs: columnConfigs.occupancyLedger,
    columnNames: [
      "date",
      "issuer",
      "description",
      "charge",
      "payment",
      "amountOwed",
      "notes",
    ],
    bodyRows: [staleRow, staleRow, staleRow],
  });
}

interface LedgerSpreadsheetProps {
  selectedOccupancyId?: string;
  charges?: ChargeRow[];
  allocations?: AllocationRow[];
  startDates?: Partial<Record<string, number>>;
  timeZone?: string;
}

function stubLedgerSpreadsheet({
  selectedOccupancyId = tenant,
  charges = chargeRows,
  allocations = allocationRows,
  startDates = {},
  timeZone,
}: LedgerSpreadsheetProps = {}) {
  return stubSheetsService({
    timeZone,
    sheets: [
      stubOccupancy(selectedOccupancyId, startDates),
      stubOccCharge(charges),
      stubOccChargeReduce(),
      stubOccPayAllocation(allocations),
      stubVariable(),
      stubOccupancyLedger(),
    ],
  });
}

function runBuildLedger(): void {
  const run = new EndpointRun({
    ...SpreadsheetBaseNamed.initSpreadsheetNamedProps(),
    tableName: "occupancy",
    entryColumnName: "buildLedgerTimeLastRan",
    endpoint: buildLedger,
  });
  run.sheet.identified.meta.ensureColumnIdsAreFetched();
  run.run(true);
}

function ledgerRows(grid: FakeGridView): FakeCell[][] {
  return grid.sheet(ledgerGid).bodyRows({ endColumnIndex: ledgerColumnCount });
}

// Every column but amount owed, the one the build leaves to the sheet's formula.
function ledgerLines(grid: FakeGridView): FakeCell[][] {
  return ledgerRows(grid).map((row) =>
    row.filter((_cell, colIndex) => colIndex !== amountOwedColIndex),
  );
}

function variableRow(grid: FakeGridView): FakeCellValue[] {
  return Val.assert(
    grid.sheet(variableGid).bodyValues()[0],
    "the Variable sheet's data row",
  );
}

function runStatus(grid: FakeGridView, occupancyId: string): FakeCellValue {
  return (
    grid
      .sheet(occupancyGid)
      .bodyValues({ endColumnIndex: occupancyColumnNames.length })
      .find((row) => row[0] === occupancyId)?.[runStatusColIndex] ?? null
  );
}

beforeEach(() => {
  stubLogger();
});

describe("buildLedger, the page it writes", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("writes every kind of line in date order, charge before payment on a shared day", () => {
    const { grid } = stubLedgerSpreadsheet();

    runBuildLedger();

    expect(ledgerLines(grid)).toEqual([
      [dayOne, "Property management", "Rent (base)", 50, "", ""],
      [dayOne, "Property management", "Security deposit", 1100, "", ""],
      [dayOne, "Household", "Payment", "", 1150, ""],
      [
        dayTwo,
        "Property management",
        "Damage, waste, or service",
        220,
        "",
        "Plumber cost",
      ],
      [dayTwo, "Household", "Caretaking", "", 25, ""],
      [dayTwo, "Ramsey County", "Payment", "", 200, ""],
      [dayThree, "Property management", "Forgiveness", -110, "", ""],
      [dayThree, "Security deposit", "Damage, waste, or service", "", 110, ""],
    ]);
  });

  it("keeps a household payment's form of payment when the whole amount funds the deposit", () => {
    const { grid } = stubLedgerSpreadsheet({
      charges: [
        {
          id: depositCharge,
          occupancyId: tenant,
          date: dayOne,
          description: "Security deposit",
          amount: 1100,
        },
      ],
      allocations: [
        {
          paymentId: "r:opy:deposit",
          designatedOccupancyId: tenant,
          filledOut: true,
          formOfPayment: "Payment",
          payerCategory: "Household",
          payerName: tenantName,
          paymentDate: dayOne,
          amount: 875,
          chargeDescription: "Security deposit",
        },
      ],
    });

    runBuildLedger();

    expect(ledgerLines(grid)).toEqual([
      [dayOne, "Property management", "Security deposit", 1100, "", ""],
      [dayOne, "Household", "Payment", "", 875, ""],
    ]);
  });

  it("leaves the amount owed column to the sheet's own formula", () => {
    const { grid } = stubLedgerSpreadsheet();

    runBuildLedger();

    expect(ledgerRows(grid).map((row) => row[amountOwedColIndex])).toEqual([
      staleAmountOwed,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  it("wipes the previous ledger down to one row and refills from there", () => {
    const { grid } = stubLedgerSpreadsheet();

    runBuildLedger();

    const ledger = grid.sheet(ledgerGid);
    expect(ledgerRows(grid)).toHaveLength(8);
    const tableEndRowIndex = ledger.tables[0]?.range?.endRowIndex;
    expect(ledger.values({ startRowIndex: tableEndRowIndex })).toEqual([]);
  });

  it("stamps the occupancy and the day it ran into the Variable sheet", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayTwo },
    });

    runBuildLedger();

    expect(variableRow(grid)).toEqual([
      tenant,
      SerialDate.fromYmd({ year: 2024, month: 6, day: 1 }),
    ]);
  });

  it("dates the run in the spreadsheet's own zone", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-03-15T02:30:00Z"));
    const { grid } = stubLedgerSpreadsheet({
      timeZone: "Asia/Tokyo",
    });

    runBuildLedger();

    expect(variableRow(grid)[1]).toBe(
      SerialDate.fromYmd({ year: 2024, month: 3, day: 15 }),
    );
  });

  it("reads every input sheet in one fetch cycle of its own", () => {
    const { getByDataFilterCalls } = stubLedgerSpreadsheet();

    runBuildLedger();

    expect(getByDataFilterCalls).toHaveLength(4);
  });

  it("opens a cut page with a prior balance, then only lines on or after the start date", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayTwo },
    });

    runBuildLedger();

    expect(ledgerLines(grid)).toEqual([
      [dayTwo, "Property management", "Prior balance", 0, "", ""],
      [
        dayTwo,
        "Property management",
        "Damage, waste, or service",
        220,
        "",
        "Plumber cost",
      ],
      [dayTwo, "Household", "Caretaking", "", 25, ""],
      [dayTwo, "Ramsey County", "Payment", "", 200, ""],
      [dayThree, "Property management", "Forgiveness", -110, "", ""],
      [dayThree, "Security deposit", "Damage, waste, or service", "", 110, ""],
    ]);
  });

  it("keeps a charge on the start date as its own line after the prior balance", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayTwo },
    });

    runBuildLedger();

    const rows = ledgerLines(grid);
    expect(rows[0]?.[2]).toBe("Prior balance");
    expect(rows[1]?.[2]).toBe("Damage, waste, or service");
    expect(rows[1]?.[0]).toBe(dayTwo);
  });

  it("writes the full ledger with no prior balance when the start date is before every line", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayOne - 1 },
    });

    runBuildLedger();

    expect(ledgerLines(grid).map((row) => row[2])).toEqual([
      "Rent (base)",
      "Security deposit",
      "Payment",
      "Damage, waste, or service",
      "Caretaking",
      "Payment",
      "Forgiveness",
      "Damage, waste, or service",
    ]);
  });

  it("is only the prior balance when the start date is after every line", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayThree + 1 },
    });

    runBuildLedger();

    expect(ledgerLines(grid)).toEqual([
      [dayThree + 1, "Property management", "Prior balance", -225, "", ""],
    ]);
  });

  it("still shows a $0 prior balance when history is paid", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayTwo },
      charges: [
        {
          id: depositCharge,
          occupancyId: tenant,
          date: dayOne,
          description: "Security deposit",
          amount: 1100,
        },
      ],
      allocations: [
        {
          paymentId: "r:opy:deposit",
          designatedOccupancyId: tenant,
          filledOut: true,
          formOfPayment: "Payment",
          payerCategory: "Household",
          payerName: tenantName,
          paymentDate: dayOne,
          amount: 1100,
          chargeDescription: "Security deposit",
        },
      ],
    });

    runBuildLedger();

    expect(ledgerLines(grid)).toEqual([
      [dayTwo, "Property management", "Prior balance", 0, "", ""],
    ]);
  });
});

describe("buildLedger, what it reports", () => {
  it("counts the lines it put on the page", () => {
    const { grid } = stubLedgerSpreadsheet();

    runBuildLedger();

    expect(runStatus(grid, tenant)).toBe(
      `Built ledger for ${tenantName}: 3 charges, 3 payments, 2 reductions.`,
    );
  });

  it("drops the s from a count of one", () => {
    const { grid } = stubLedgerSpreadsheet({
      charges: [
        {
          id: rentCharge,
          occupancyId: tenant,
          date: dayOne,
          description: "Rent (base)",
          amount: 50,
        },
      ],
      allocations: [
        {
          paymentId: "r:opy:rent",
          designatedOccupancyId: tenant,
          filledOut: true,
          formOfPayment: "Payment",
          payerCategory: "Household",
          payerName: tenantName,
          paymentDate: dayOne,
          amount: 50,
          chargeDescription: "Rent (base)",
        },
      ],
    });

    runBuildLedger();

    expect(runStatus(grid, tenant)).toBe(
      `Built ledger for ${tenantName}: 1 charge, 1 payment, 0 reductions.`,
    );
  });

  it("names the start date in the run status and ignores the prior balance in the counts", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayTwo },
    });

    runBuildLedger();

    expect(runStatus(grid, tenant)).toBe(
      `Built ledger for ${tenantName}, from 25 Mar 2023: 1 charge, 2 payments, 2 reductions.`,
    );
  });

  it("reports a prior-balance-only window as a built page of zeroes", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayThree + 1 },
    });

    runBuildLedger();

    expect(runStatus(grid, tenant)).toBe(
      `Built ledger for ${tenantName}, from 5 Apr 2023: 0 charges, 0 payments, 0 reductions.`,
    );
  });

  it("still carries from in the run status when the start date is before every line", () => {
    const { grid } = stubLedgerSpreadsheet({
      startDates: { [tenant]: dayOne - 1 },
    });

    runBuildLedger();

    expect(runStatus(grid, tenant)).toBe(
      `Built ledger for ${tenantName}, from 14 Mar 2023: 3 charges, 3 payments, 2 reductions.`,
    );
  });

  it("says so plainly when an occupancy has nothing billed or paid", () => {
    const { grid } = stubLedgerSpreadsheet({
      selectedOccupancyId: newcomer,
      startDates: { [newcomer]: dayTwo },
    });

    runBuildLedger();

    expect(runStatus(grid, newcomer)).toBe(
      `No charges or payments for ${newcomerName}.`,
    );
  });

  it("names the blank cell it hit and leaves the previous ledger alone", () => {
    const { grid } = stubLedgerSpreadsheet({
      charges: [{ id: rentCharge, occupancyId: tenant, amount: 50 }],
    });
    const previousLedger = ledgerRows(grid);

    runBuildLedger();

    expect(runStatus(grid, tenant)).toMatch(/"date".*"occCharge".*row 5\./);
    expect(previousLedger).toHaveLength(3);
    expect(ledgerRows(grid)).toEqual(previousLedger);
  });
});
