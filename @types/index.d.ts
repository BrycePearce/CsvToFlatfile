import type { FlatfileWorkbook, FormattedRecordData, InsertRecordResponse, WorkbookResponse } from '../src/types/Flatfile.js';
import type { ParseCsv } from '../src/types/ParseCsv.js';

export type CreateFlatfile = { workbook: FlatfileWorkbook, recordData: FormattedRecordData[][], flatfileApiKey: string }

export type {
    CreateFlatfile,
    ParseCsv,
    FlatfileWorkbook,
    FormattedRecordData,
    WorkbookResponse,
    InsertRecordResponse
};