import { createWorkbook, insertRecordsIntoSheet } from './api/createWorkbook.js';
import { mapWorkbookToRecords } from './helpers/recordBuilder.js';
import { mapCsvToWorkbook } from './helpers/workbookBuilder.js';
import { formatCsvToPublicRecord } from './helpers/helpers.js';
import { isValidParameters } from './helpers/validators.js';
import { CsvParseError } from './classes/CsvParseError.js';
import { parse } from 'csv/sync';

import type { ParseCsv } from './types/ParseCsv.js';
import type { FlatfileWorkbook, FormattedRecordData } from './types/Flatfile.js';

export const convertCsvToWorkbook = ({ actions, columnHeaders, csv, fieldKeys, workbookEnvironmentId, workbookSpaceId, fieldTypes, sheetAccess, sheetName, slugName, workbookName, hasColumnHeaders = false, options = {
    escapeCharacter: '\\',
    ltrim: true,
    rtrim: true
} }: ParseCsv) => {
    const rawRecords: string[][] = parse(csv, { columns: false, relax_quotes: true, escape: options.escapeCharacter, ltrim: options.ltrim, rtrim: options.rtrim });
    const headers = getHeaders(rawRecords, hasColumnHeaders, columnHeaders);
    const formattedRecords = formatCsvToPublicRecord(hasColumnHeaders ? rawRecords.slice(1) : rawRecords, headers);

    const validationObj = isValidParameters({ records: formattedRecords, fieldKeys, fieldTypes, headers });
    if (validationObj.hasError) {
        throw new CsvParseError(validationObj.message);
    }

    const workbook = mapCsvToWorkbook({ workbookName: workbookName, formattedRecords, labels: headers, actions, fieldKeys, fieldTypes, slugName, sheetName, sheetAccess, workbookEnvironmentId, workbookSpaceId, });
    return { workbook, recordData: formattedRecords };
}

export const createFlatfile = async ({ workbook, recordData, flatfileApiKey, }: { workbook: FlatfileWorkbook, recordData: FormattedRecordData[][], flatfileApiKey: string }) => {
    // create the workbook
    const workbookResponse = await createWorkbook(workbook, flatfileApiKey);
    const sheetId = workbookResponse.data.sheets[0].id;

    // map the custom record type to the type expected by the api
    const records = mapWorkbookToRecords(workbook, recordData);

    // call the api to add the records
    const recordInsertionResponse = await insertRecordsIntoSheet(sheetId, records, flatfileApiKey);

    return { workbookResponse, recordsResponse: recordInsertionResponse };
}

const getHeaders = (parsedRecords: string[][], hasColumnHeaders: boolean, columnHeaders?: string[]) => {
    if (columnHeaders) return columnHeaders;
    if (hasColumnHeaders) return parsedRecords[0];

    // otherwise, generate some default headers
    return parsedRecords[0].map((_, i) => (i + 1).toString());
}

export default {
    convertCsvToWorkbook,
    createFlatfile,
};