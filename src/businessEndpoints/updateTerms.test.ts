import { SpreadsheetBaseNamed } from "@byronbroughten/sheets-framework";
import {
  EndpointRun,
  type FakeCell,
  type FakeCellValue,
  type FakeGridView,
  fakeTableSheet,
  stubLogger,
  stubSheetsService,
} from "@byronbroughten/sheets-framework/testing";
import { beforeEach, describe, expect, it } from "vitest";

import { Val } from "../appUtils/Val";
import { appConfigs } from "../generated/appConfigs";
import { updateTerms } from "./updateTerms";

type FakeRow<C> = Partial<Record<keyof C, FakeCell>>;

const { sheetConfigs, columnConfigs } = appConfigs;

const occupancyGid = sheetConfigs.occupancy.sheetGid;
const termsGid = sheetConfigs.occupancyTerms.sheetGid;

const tenant = "r:occ:tenant";
const neighbour = "r:occ:neighbour";
const tenantTerms = "r:otr:tenant";
const neighbourTerms = "r:otr:neighbour";

const occupancyColumnNames = [
  "id",
  "latestOccupancyTermsId",
  "updateTermsTimeLastRan",
  "updateTermsSelect",
  "updateTermsRunStatus",
  "nextTermsNoticeSentDate",
  "nextTermsStartDate",
  "nextTermsEndDate",
  "nextBaseRentChargeMonthly",
  "nextCaretakerRentReductionMonthly",
  "nextPetFeeMonthly",
  "nextGasWaterHeating",
  "nextGasHeating",
  "nextGasCooking",
  "nextElectricWaterHeating",
  "nextElectricHeating",
  "nextElectricCooking",
  "nextOtherElectric",
  "nextDistrictEnergyWaterHeating",
  "nextDistrictEnergyHeating",
  "nextWaterSewer",
  "nextTrashCollection",
  "nextTermsNotes",
] as const;

const termsColumnNames = [
  "id",
  "occupancyId",
  "paymentAllocationDefault",
  "lateFeePolicy",
  "noticeDate",
  "startDate",
  "endDate",
  "rentChargeMonthly",
  "caretakerRentReductionMonthly",
  "petFeeMonthly",
  "gasWaterHeating",
  "gasHeating",
  "gasCooking",
  "electricWaterHeating",
  "electricHeating",
  "electricCooking",
  "otherElectric",
  "districtEnergyWaterHeating",
  "districtEnergyHeating",
  "waterSewer",
  "trashCollection",
  "notes",
] as const;

type TermsRow = Record<(typeof termsColumnNames)[number], FakeCellValue>;

const runStatusColIndex = occupancyColumnNames.indexOf("updateTermsRunStatus");
const selectColIndex = occupancyColumnNames.indexOf("updateTermsSelect");

const tenantLatestStart = 45000;
const tenantLatestEnd = 45364;
const tenantNextStart = 45365;
const neighbourLatestStart = 44000;
const neighbourNextStart = 44500;

type OccupancyRow = FakeRow<typeof columnConfigs.occupancy>;

// Every next-terms value a person fills in, so a test says only what it varies.
function nextTerms(overrides: OccupancyRow = {}): OccupancyRow {
  return {
    nextTermsNoticeSentDate: 45300,
    nextTermsStartDate: tenantNextStart,
    nextTermsEndDate: 45729,
    nextBaseRentChargeMonthly: 1250,
    nextCaretakerRentReductionMonthly: 100,
    nextPetFeeMonthly: 25,
    nextGasWaterHeating: true,
    nextGasHeating: false,
    nextGasCooking: true,
    nextElectricWaterHeating: false,
    nextElectricHeating: true,
    nextElectricCooking: false,
    nextOtherElectric: true,
    nextDistrictEnergyWaterHeating: false,
    nextDistrictEnergyHeating: true,
    nextWaterSewer: true,
    nextTrashCollection: false,
    nextTermsNotes: "Rent up for the new year",
    ...overrides,
  };
}

interface OccupancyProps {
  tenantRow?: OccupancyRow;
  neighbourRow?: OccupancyRow;
}

function stubOccupancy({ tenantRow, neighbourRow }: OccupancyProps) {
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occupancy.sheetGid,
    title: "occupancy",
    columnConfigs: columnConfigs.occupancy,
    columnNames: occupancyColumnNames,
    bodyRows: [
      {
        id: tenant,
        latestOccupancyTermsId: tenantTerms,
        updateTermsSelect: true,
        ...(tenantRow ?? nextTerms()),
      },
      {
        id: neighbour,
        latestOccupancyTermsId: neighbourTerms,
        updateTermsSelect: false,
        ...(neighbourRow ??
          nextTerms({ nextTermsStartDate: neighbourNextStart })),
      },
    ],
  });
}

type ExistingTermsRow = FakeRow<typeof columnConfigs.occupancyTerms>;

function stubOccupancyTerms(tenantEndDate: number | null) {
  const existing: ExistingTermsRow[] = [
    {
      id: tenantTerms,
      occupancyId: tenant,
      startDate: tenantLatestStart,
      endDate: tenantEndDate,
    },
    {
      id: neighbourTerms,
      occupancyId: neighbour,
      startDate: neighbourLatestStart,
    },
  ];
  return fakeTableSheet.build({
    sheetId: sheetConfigs.occupancyTerms.sheetGid,
    title: "occupancyTerms",
    columnConfigs: columnConfigs.occupancyTerms,
    columnNames: termsColumnNames,
    bodyRows: existing,
  });
}

interface TermsSpreadsheetProps extends OccupancyProps {
  tenantEndDate?: number | null;
}

function stubTermsSpreadsheet({
  tenantEndDate = null,
  ...occupancyProps
}: TermsSpreadsheetProps = {}) {
  return stubSheetsService({
    sheets: [stubOccupancy(occupancyProps), stubOccupancyTerms(tenantEndDate)],
  });
}

function runUpdateTerms(): void {
  const run = new EndpointRun({
    ...SpreadsheetBaseNamed.initSpreadsheetNamedProps(),
    sheetName: "occupancy",
    entryColumnName: "updateTermsTimeLastRan",
    endpoint: updateTerms,
  });
  run.sheet.identified.meta.ensureColumnIdsAreFetched();
  run.run(true);
}

function termsRows(grid: FakeGridView): TermsRow[] {
  return grid
    .sheet(termsGid)
    .bodyValues({ endColumnIndex: termsColumnNames.length })
    .map(
      (row) =>
        Object.fromEntries(
          termsColumnNames.map((columnName, colIndex) => [
            columnName,
            row[colIndex] ?? null,
          ]),
        ) as TermsRow,
    );
}

// A minted id is random, so a row added by the run is read without it.
function termsAdded(grid: FakeGridView): Partial<TermsRow>[] {
  return termsRows(grid)
    .slice(2)
    .map(({ id: _id, ...terms }) =>
      Object.fromEntries(
        Object.entries(terms).filter(([, value]) => value !== null),
      ),
    );
}

function tenantTermsRow(grid: FakeGridView): TermsRow {
  return Val.assert(termsRows(grid)[0], "the tenant's latest terms row");
}

function occupancyCell(
  grid: FakeGridView,
  occupancyId: string,
  colIndex: number,
): FakeCellValue {
  return (
    grid
      .sheet(occupancyGid)
      .bodyValues({ endColumnIndex: occupancyColumnNames.length })
      .find((row) => row[0] === occupancyId)?.[colIndex] ?? null
  );
}

beforeEach(() => {
  stubLogger();
});

describe("updateTerms, a new term after an open-ended one", () => {
  it("ends the latest term the day before the next starts", () => {
    const { grid } = stubTermsSpreadsheet();

    runUpdateTerms();

    expect(tenantTermsRow(grid).endDate).toBe(tenantNextStart - 1);
  });

  it("appends one term carrying the next values and the two defaults", () => {
    const { grid } = stubTermsSpreadsheet();

    runUpdateTerms();

    expect(termsAdded(grid)).toEqual([
      {
        occupancyId: tenant,
        paymentAllocationDefault: "Earliest unaccounted charge",
        lateFeePolicy: "No late fees",
        noticeDate: 45300,
        startDate: tenantNextStart,
        endDate: 45729,
        rentChargeMonthly: 1250,
        caretakerRentReductionMonthly: 100,
        petFeeMonthly: 25,
        gasWaterHeating: true,
        gasHeating: false,
        gasCooking: true,
        electricWaterHeating: false,
        electricHeating: true,
        electricCooking: false,
        otherElectric: true,
        districtEnergyWaterHeating: false,
        districtEnergyHeating: true,
        waterSewer: true,
        trashCollection: false,
        notes: "Rent up for the new year",
      },
    ]);
  });

  it("reports success on the selected row and unticks it", () => {
    const { grid } = stubTermsSpreadsheet();

    runUpdateTerms();

    expect(occupancyCell(grid, tenant, runStatusColIndex)).toBe(
      "Occupancy terms updated",
    );
    expect(occupancyCell(grid, tenant, selectColIndex)).toBe(false);
  });

  it("leaves an unselected occupancy's terms alone", () => {
    const { grid } = stubTermsSpreadsheet();

    runUpdateTerms();

    expect(termsRows(grid)[1]).toMatchObject({
      id: neighbourTerms,
      startDate: neighbourLatestStart,
      endDate: null,
    });
    expect(termsAdded(grid)).toHaveLength(1);
  });
});

describe("updateTerms, a latest term that already has an end date", () => {
  it("keeps that end date and appends the next term", () => {
    const { grid } = stubTermsSpreadsheet({ tenantEndDate: tenantLatestEnd });

    runUpdateTerms();

    expect(tenantTermsRow(grid).endDate).toBe(tenantLatestEnd);
    expect(termsAdded(grid)).toHaveLength(1);
  });
});

describe("updateTerms, a next start that comes too early", () => {
  it("refuses a start on the latest term's start date", () => {
    const { grid } = stubTermsSpreadsheet({
      tenantRow: nextTerms({ nextTermsStartDate: tenantLatestStart }),
    });

    runUpdateTerms();

    expect(occupancyCell(grid, tenant, runStatusColIndex)).toBe(
      "Error: Start date of next occupancy terms is on or before start date of latest",
    );
    expect(termsRows(grid)).toHaveLength(2);
    expect(tenantTermsRow(grid).endDate).toBeNull();
  });

  it("refuses a start on the latest term's end date", () => {
    const { grid } = stubTermsSpreadsheet({
      tenantEndDate: tenantLatestEnd,
      tenantRow: nextTerms({ nextTermsStartDate: tenantLatestEnd }),
    });

    runUpdateTerms();

    expect(occupancyCell(grid, tenant, runStatusColIndex)).toBe(
      "Error: Start date of next occupancy terms is on or before end date of latest",
    );
    expect(termsRows(grid)).toHaveLength(2);
  });
});

describe("updateTerms, several selected occupancies", () => {
  it("adds a term for each", () => {
    const { grid } = stubTermsSpreadsheet({
      neighbourRow: {
        ...nextTerms({ nextTermsStartDate: neighbourNextStart }),
        updateTermsSelect: true,
      },
    });

    runUpdateTerms();

    expect(termsAdded(grid).map((row) => row.occupancyId)).toEqual([
      tenant,
      neighbour,
    ]);
  });

  it("writes nothing for any when one is refused", () => {
    const { grid } = stubTermsSpreadsheet({
      neighbourRow: {
        ...nextTerms({ nextTermsStartDate: neighbourLatestStart }),
        updateTermsSelect: true,
      },
    });

    runUpdateTerms();

    expect(termsRows(grid)).toHaveLength(2);
    expect(tenantTermsRow(grid).endDate).toBeNull();
  });
});
