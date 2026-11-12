import { makeConditionalFormatConfigs } from "@byronbroughten/sheets-framework";

export const conditionalFormatConfigs = makeConditionalFormatConfigs({
  "tables": {
    "propertyYear": {
      "total | =${revenueOverride}<>\"\" | background #fff2cc": { "kind": "boolean", "tableId": "44437649", "columns": ["total"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${revenueOverride}<>\"\""}, "format": {"backgroundColor":"#fff2cc"} },
      "taxableExpenseTotalFromExpenseSheet | =${taxableExpenseTotalFromExpenseSheet}<>${taxableTotalFromBuckets} | background #f4cccc": { "kind": "boolean", "tableId": "44437649", "columns": ["taxableExpenseTotalFromExpenseSheet"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${taxableExpenseTotalFromExpenseSheet}<>${taxableTotalFromBuckets}"}, "format": {"backgroundColor":"#f4cccc"} }
    },
    "subPayAllocation": {
      "R5:R1054 | unmodelable {\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8509803921568627,\"green\":0.8235294117647058,\"blue\":0.9137254901960784}}}": { "kind": "unmodelable", "tableId": "1224077950", "ranges": ["R5:R1054"], "rawContent": "{\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8509803921568627,\"green\":0.8235294117647058,\"blue\":0.9137254901960784}}}" },
      "Q5:Q1054 | unmodelable {\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8117647058823529,\"green\":0.8862745098039215,\"blue\":0.9529411764705882}}}": { "kind": "unmodelable", "tableId": "1224077950", "ranges": ["Q5:Q1054"], "rawContent": "{\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8117647058823529,\"green\":0.8862745098039215,\"blue\":0.9529411764705882}}}" }
    },
    "subsidyPayment": {
      "H5:H148 | unmodelable {\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8509803921568627,\"green\":0.9176470588235294,\"blue\":0.8274509803921568}}}": { "kind": "unmodelable", "tableId": "1952041142", "ranges": ["H5:H148"], "rawContent": "{\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8509803921568627,\"green\":0.9176470588235294,\"blue\":0.8274509803921568}}}" },
      "I5:I148 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=I5<>G5\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "1952041142", "ranges": ["I5:I148"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=I5<>G5\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}" },
      "amountAllocated | =${amountAllocated}=${amount} | background #d9d2e9": { "kind": "boolean", "tableId": "1952041142", "columns": ["amountAllocated"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amountAllocated}=${amount}"}, "format": {"backgroundColor":"#d9d2e9"} },
      "K5:K148 | unmodelable {\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8117647058823529,\"green\":0.8862745098039215,\"blue\":0.9529411764705882}}}": { "kind": "unmodelable", "tableId": "1952041142", "ranges": ["K5:K148"], "rawContent": "{\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":\"Yes\"},\"format\":{\"backgroundColor\":{\"red\":0.8117647058823529,\"green\":0.8862745098039215,\"blue\":0.9529411764705882}}}" },
      "D4:D4,B5:B148 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(D:D, D4) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "1952041142", "ranges": ["D4:D4","B5:B148"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(D:D, D4) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}" }
    },
    "subsidyCharge": {
      "B4:B1085 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(B:B, B4) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "739360050", "ranges": ["B4:B1085"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(B:B, B4) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}" },
      "amountPaid | =${amountPaid}<${amount} | background #f4cccc": { "kind": "boolean", "tableId": "739360050", "columns": ["amountPaid"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amountPaid}<${amount}"}, "format": {"backgroundColor":"#f4cccc"} },
      "amountPaid | =${amountPaid}>${amount} | background #fce5cd": { "kind": "boolean", "tableId": "739360050", "columns": ["amountPaid"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amountPaid}>${amount}"}, "format": {"backgroundColor":"#fce5cd"} },
      "amountPaid | =${amount}=${amountPaid} | background #d9d2e9": { "kind": "boolean", "tableId": "739360050", "columns": ["amountPaid"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amount}=${amountPaid}"}, "format": {"backgroundColor":"#d9d2e9"} }
    },
    "occPayAllocation": {
      "chargeAndDesignationOccupancyMatches | NUMBER_EQ false | background #f4cccc": { "kind": "boolean", "tableId": "1422854287", "columns": ["chargeAndDesignationOccupancyMatches"], "condition": {"type":"NUMBER_EQ","value":false}, "format": {"backgroundColor":"#f4cccc"} },
      "filledOut | =OR(${filledOut}=\"\", ${filledOut}=FALSE) | background #f4cccc": { "kind": "boolean", "tableId": "1422854287", "columns": ["filledOut"], "condition": {"type":"CUSTOM_FORMULA","formula":"=OR(${filledOut}=\"\", ${filledOut}=FALSE)"}, "format": {"backgroundColor":"#f4cccc"} }
    },
    "occPayDesignation": {
      "A310:A310,C310:C310 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(A:A, A310) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "562516831", "ranges": ["A310:A310","C310:C310"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(A:A, A310) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}" },
      "amountAllocated | =${amountAllocated}<>${amount} | background #fce5cd": { "kind": "boolean", "tableId": "562516831", "columns": ["amountAllocated"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amountAllocated}<>${amount}"}, "format": {"backgroundColor":"#fce5cd"} }
    },
    "occPayment": {
      "N5:N1294 | unmodelable {\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":false},\"format\":{\"backgroundColor\":{\"red\":0.9882352941176471,\"green\":0.8980392156862745,\"blue\":0.803921568627451}}}": { "kind": "unmodelable", "tableId": "1111156219", "ranges": ["N5:N1294"], "rawContent": "{\"condition\":{\"type\":\"NUMBER_EQ\",\"value\":false},\"format\":{\"backgroundColor\":{\"red\":0.9882352941176471,\"green\":0.8980392156862745,\"blue\":0.803921568627451}}}" },
      "paymentStatus | TEXT_EQ \"Guaranteed\" | background #fff2cc": { "kind": "boolean", "tableId": "1111156219", "columns": ["paymentStatus"], "condition": {"type":"TEXT_EQ","value":"Guaranteed"}, "format": {"backgroundColor":"#fff2cc"} },
      "paymentStatus | TEXT_EQ \"Expected\" | background #f4cccc": { "kind": "boolean", "tableId": "1111156219", "columns": ["paymentStatus"], "condition": {"type":"TEXT_EQ","value":"Expected"}, "format": {"backgroundColor":"#f4cccc"} },
      "amountDesignated | =${amount}<>${amountDesignated} | background #f4cccc": { "kind": "boolean", "tableId": "1111156219", "columns": ["amountDesignated"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amount}<>${amountDesignated}"}, "format": {"backgroundColor":"#f4cccc"} },
      "amountAllocated | =${amount}<>${amountAllocated} | background #f4cccc": { "kind": "boolean", "tableId": "1111156219", "columns": ["amountAllocated"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amount}<>${amountAllocated}"}, "format": {"backgroundColor":"#f4cccc"} }
    },
    "occCharge": {
      "B4:B4,B270:B1199 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(B:B, B4) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "1283724627", "ranges": ["B4:B4","B270:B1199"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=COUNTIF(B:B, B4) > 1\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}" },
      "amountAccounted | =${amount}>${amountAccounted} | background #f4cccc": { "kind": "boolean", "tableId": "1283724627", "columns": ["amountAccounted"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amount}>${amountAccounted}"}, "format": {"backgroundColor":"#f4cccc"} },
      "amountAccounted | =${amount}<${amountAccounted} | background #fce5cd": { "kind": "boolean", "tableId": "1283724627", "columns": ["amountAccounted"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${amount}<${amountAccounted}"}, "format": {"backgroundColor":"#fce5cd"} }
    },
    "occupancy": {
      "C16:C16,E16:E16 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=$F16=\\\"No\\\"\"},\"format\":{\"backgroundColor\":{\"red\":0.8,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "1682085118", "ranges": ["C16:C16","E16:E16"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=$F16=\\\"No\\\"\"},\"format\":{\"backgroundColor\":{\"red\":0.8,\"green\":0.8,\"blue\":0.8}}}" },
      "all | =${isActive}=FALSE | background #999999": { "kind": "boolean", "tableId": "1682085118", "columns": "all", "condition": {"type":"CUSTOM_FORMULA","formula":"=${isActive}=FALSE"}, "format": {"backgroundColor":"#999999"} },
      "depositCharged | NUMBER_EQ 0 | background #f4cccc": { "kind": "boolean", "tableId": "1682085118", "columns": ["depositCharged"], "condition": {"type":"NUMBER_EQ","value":0}, "format": {"backgroundColor":"#f4cccc"} },
      "depositAccounted | =${depositAccounted}<>${depositCharged} | background #f4cccc": { "kind": "boolean", "tableId": "1682085118", "columns": ["depositAccounted"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${depositAccounted}<>${depositCharged}"}, "format": {"backgroundColor":"#f4cccc"} },
      "depositRemaining | NUMBER_LESS 0 | background #f4cccc": { "kind": "boolean", "tableId": "1682085118", "columns": ["depositRemaining"], "condition": {"type":"NUMBER_LESS","value":0}, "format": {"backgroundColor":"#f4cccc"} }
    },
    "household": {
      "M5:M1000 | unmodelable {\"condition\":{\"type\":\"NUMBER_LESS\",\"value\":\"=EOMONTH(TODAY())\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "1620950817", "ranges": ["M5:M1000"], "rawContent": "{\"condition\":{\"type\":\"NUMBER_LESS\",\"value\":\"=EOMONTH(TODAY())\"},\"format\":{\"backgroundColor\":{\"red\":0.9568627450980393,\"green\":0.8,\"blue\":0.8}}}" },
      "currentHhBalance | NUMBER_EQ 0 | background #d9ead3": { "kind": "boolean", "tableId": "1620950817", "columns": ["currentHhBalance"], "condition": {"type":"NUMBER_EQ","value":0}, "format": {"backgroundColor":"#d9ead3"} },
      "currentSubsidyBalance | NUMBER_EQ 0 | background #d9ead3": { "kind": "boolean", "tableId": "1620950817", "columns": ["currentSubsidyBalance"], "condition": {"type":"NUMBER_EQ","value":0}, "format": {"backgroundColor":"#d9ead3"} },
      "currentHhBalance | NUMBER_NOT_EQ 0 | background #f4cccc": { "kind": "boolean", "tableId": "1620950817", "columns": ["currentHhBalance"], "condition": {"type":"NUMBER_NOT_EQ","value":0}, "format": {"backgroundColor":"#f4cccc"} },
      "currentSubsidyBalance | NUMBER_NOT_EQ 0 | background #f4cccc": { "kind": "boolean", "tableId": "1620950817", "columns": ["currentSubsidyBalance"], "condition": {"type":"NUMBER_NOT_EQ","value":0}, "format": {"backgroundColor":"#f4cccc"} },
      "A6:A6 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=G5=\\\"No\\\"\"},\"format\":{\"backgroundColor\":{\"red\":0.8,\"green\":0.8,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "1620950817", "ranges": ["A6:A6"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=G5=\\\"No\\\"\"},\"format\":{\"backgroundColor\":{\"red\":0.8,\"green\":0.8,\"blue\":0.8}}}" },
      "all | =${isActive}=\"No\" | background #cccccc": { "kind": "boolean", "tableId": "1620950817", "columns": "all", "condition": {"type":"CUSTOM_FORMULA","formula":"=${isActive}=\"No\""}, "format": {"backgroundColor":"#cccccc"} }
    },
    "resident": {
      "all | =${isActive}=\"no\" | background #cccccc": { "kind": "boolean", "tableId": "308921952", "columns": "all", "condition": {"type":"CUSTOM_FORMULA","formula":"=${isActive}=\"no\""}, "format": {"backgroundColor":"#cccccc"} }
    },
    "unit": {
      "noticeDate+annualNoticeIsOverdue | =${annualNoticeIsOverdue} | background #fce5cd": { "kind": "boolean", "tableId": "2006787968", "columns": ["noticeDate","annualNoticeIsOverdue"], "condition": {"type":"CUSTOM_FORMULA","formula":"=${annualNoticeIsOverdue}"}, "format": {"backgroundColor":"#fce5cd"} },
      "AY5:AY15 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=AY5=$CC5\"},\"format\":{\"foregroundColor\":{\"red\":0.6,\"green\":0.6,\"blue\":0.6}}}": { "kind": "unmodelable", "tableId": "2006787968", "ranges": ["AY5:AY15"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=AY5=$CC5\"},\"format\":{\"foregroundColor\":{\"red\":0.6,\"green\":0.6,\"blue\":0.6}}}" },
      "AY5:AY15 | unmodelable {\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=AY5<>$CC5\"},\"format\":{\"backgroundColor\":{\"red\":1,\"green\":0.9490196078431372,\"blue\":0.8}}}": { "kind": "unmodelable", "tableId": "2006787968", "ranges": ["AY5:AY15"], "rawContent": "{\"condition\":{\"type\":\"CUSTOM_FORMULA\",\"formula\":\"=AY5<>$CC5\"},\"format\":{\"backgroundColor\":{\"red\":1,\"green\":0.9490196078431372,\"blue\":0.8}}}" }
    }
  },
  "tabs": {}
});
