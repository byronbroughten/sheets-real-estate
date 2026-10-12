import { makeValueConfigs } from "../../../framework/src/01_SpreadsheetSchema/configReaders/makeConfigs";

export const valueConfigs = makeValueConfigs({
  "householdName": {
    "kind": "liveReference"
  },
  "listChargeOnetimeDescription": [
    "Security deposit",
    "Late fee",
    "Damage, waste, or service"
  ],
  "occupancyName": {
    "kind": "liveReference"
  },
  "listPaymentStatus": [
    "Verified",
    "Guaranteed"
  ],
  "listPayerCategory": [
    "Household",
    "Non-occupant",
    "Security deposit"
  ],
  "nonOccupantPayerName": {
    "kind": "liveReference"
  },
  "propertyName": {
    "kind": "liveReference"
  },
  "unitName": {
    "kind": "liveReference"
  },
  "billerName": {
    "kind": "liveReference"
  },
  "listExpenseCategory": [
    "Repairs",
    "Supplies",
    "Cleaning & maintenance",
    "Depreciation expense or depletion",
    "Utilities",
    "Insurance",
    "Taxes",
    "Mortgage interest paid to banks",
    "Legal & professional",
    "Advertising",
    "Auto and travel",
    "Mgmt fees",
    "Commissions",
    "Other interest",
    "Other",
    "Principal"
  ],
  "listResidenceTaxAdjust": [
    "Minus primary space",
    "Primary residence",
    "Half primary residence",
    "Minus primary time space"
  ],
  "listReceiptFormat": [
    "Electronic",
    "Physical",
    "Cash ledger",
    "Text message",
    "Biller website",
    "Email",
    "Cash App",
    "Venmo",
    "Unknown",
    "Tax return"
  ],
  "splitReceiptName": {
    "kind": "liveReference"
  },
  "listChargeReduceDescription": [
    "Forgiveness"
  ],
  "nonOccupantPayerId": {
    "kind": "liveReference"
  },
  "listYesOrNo": [
    "Yes",
    "No"
  ],
  "listChargeDescription": [
    "Base rent",
    "Utilities",
    "Pet rent",
    "Caretaker rent reduction",
    "Security deposit",
    "Late fee",
    "Damage, waste, or service"
  ],
  "listFormOfPayment": [
    "Payment",
    "Caretaking",
    "Cash App",
    "Venmo",
    "Check"
  ],
  "subsidyAgreementId": {
    "kind": "liveReference"
  },
  "propertyId": {
    "kind": "liveReference"
  },
  "furnaceId": {
    "kind": "liveReference"
  },
  "householdId": {
    "kind": "liveReference"
  },
  "listPaymentAllocationDefault": [
    "Earliest unaccounted charge",
    "Next or latest unaccounted charge"
  ],
  "listPaymentAllocateWhat": [
    "Full payment",
    "Full charge",
    "Lesser amount"
  ]
});
