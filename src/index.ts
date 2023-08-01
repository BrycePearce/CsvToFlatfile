import { parse } from 'csv/sync';
import { createWorkbook, insertRecordsIntoSheet } from './api/createWorkbook.js';
import { mapCsvToWorkbook } from './helpers/workbookBuilder.js';
import { mapWorkbookToRecords } from './helpers/recordBuilder.js';
import { formatCsvToPublicRecord } from './helpers/helpers.js';

import type { ParseCsv } from './types/ParseCsv.js';
import type { FlatfileWorkbook, FormattedRecordData } from './types/Flatfile.js';

const convertCsvToWorkbook = ({ actions, columnHeaders, csv, fieldKeys, workbookEnvironmentId, workbookSpaceId, fieldTypes, sheetAccess, sheetName, slugName, workbookName, hasColumnHeaders = false, options = {
    escapeCharacter: '\\',
    ltrim: true,
    rtrim: true
} }: ParseCsv) => {
    const rawRecords: string[][] = parse(csv, { columns: false, relax_quotes: true, escape: options.escapeCharacter, ltrim: options.ltrim, rtrim: options.rtrim });
    const headers = getHeaders(rawRecords, hasColumnHeaders, columnHeaders);
    const formattedRecords = formatCsvToPublicRecord(hasColumnHeaders ? rawRecords.slice(1) : rawRecords, headers);

    if (headers?.length === 0) {
        throw new Error('Invalid headers')
    }

    const workbook = mapCsvToWorkbook({ workbookName: workbookName, records: rawRecords, labels: headers, actions, fieldKeys, fieldTypes, slugName, sheetName, sheetAccess, workbookEnvironmentId, workbookSpaceId, });
    return { workbook, recordData: formattedRecords };
}

const createFlatfile = async ({ workbook, recordData, flatfileApiKey, }: { workbook: FlatfileWorkbook, recordData: FormattedRecordData[][], flatfileApiKey: string }) => {
    // create the workbook
    const workbookResponse = await createWorkbook(workbook, flatfileApiKey);
    const sheetId = workbookResponse.data.sheets[0].id;

    // map the custom record type to the type expected by the api
    const records = mapWorkbookToRecords(workbook, recordData);

    // call the api to add the records
    const recordInsertionResponse = await insertRecordsIntoSheet(sheetId, records, flatfileApiKey);

    return { workbookResponse, recordsResponse: recordInsertionResponse };
}

// todo: Create a method here that accepts a "FlatfileWorkbook" and invokes the creation api
// then it should populate the flatfile via the api methods from the data given 

const getHeaders = (parsedRecords: string[][], hasColumnHeaders: boolean, columnHeaders?: string[]) => {
    if (columnHeaders) return columnHeaders;
    if (hasColumnHeaders) return parsedRecords[0];

    // otherwise, generate some default headers
    return parsedRecords[0].map((_, i) => (i + 1).toString());
}

export default { convertCsvToWorkbook, createFlatfile };
