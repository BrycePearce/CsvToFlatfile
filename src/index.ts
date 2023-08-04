import { createWorkbook, insertRecordsIntoSheet } from './api/createWorkbook.js';
import { mapWorkbookToRecords } from './helpers/recordBuilder.js';
import { getSheet, mapCsvToWorkbook } from './helpers/workbookBuilder.js';
import { formatCsvToPublicRecord } from './helpers/helpers.js';
import { isValidParameters } from './helpers/validators.js';
import { CsvParseError } from './classes/CsvParseError.js';
import { parse } from 'csv/sync';

import type { ParseMultiCsv } from './types/ParseCsv.js';
import type { FlatfileWorkbook, FormattedRecordData, InsertRecordResponse, Sheet } from './types/Flatfile.js';

export const convertCsvToWorkbook = (sheetsData: ParseMultiCsv) => {
    const { actions, workbookName, workbookSpaceId, csvConfigs } = sheetsData;

    const { sheets, formattedRecords } = csvConfigs.reduce((accumulator, sheetData) => {
        const { csv, options } = sheetData;
        const csvConfig = { columns: false, relax_quotes: true, escape: options?.escapeCharacter ?? `\\`, ltrim: options?.ltrim ?? true, rtrim: options?.rtrim ?? true };
        const rawRecords = parse(csv, csvConfig);

        const { hasColumnHeaders, columnHeaders } = sheetData;
        const headers = getHeaders(rawRecords, hasColumnHeaders, columnHeaders);
        const formattedRecords = formatCsvToPublicRecord(hasColumnHeaders ? rawRecords.slice(1) : rawRecords, headers);

        const { fieldKeys, fieldTypes } = sheetData;
        const validationObj = isValidParameters({ records: formattedRecords, fieldKeys, fieldTypes, headers });
        if (validationObj.hasError) {
            throw new CsvParseError(validationObj.message);
        }

        const { sheetAccess, sheetName, slugName, workbookEnvironmentId } = sheetData;
        const sheet = getSheet({ fieldKeys, fieldTypes, formattedRecords, labels: headers, sheetAccess, sheetName, slugName, workbookEnvironmentId, workbookName, workbookSpaceId });

        accumulator.sheets.push(sheet);
        accumulator.formattedRecords.push(formattedRecords);

        return accumulator;
    }, { sheets: [] as Sheet[], formattedRecords: [] as FormattedRecordData[][][] });

    const workbook = mapCsvToWorkbook({ workbookName: workbookName, actions });
    workbook.sheets = sheets;

    return { workbook, recordData: formattedRecords };
}

export const createFlatfile = async ({ workbook, recordDataList, flatfileApiKey, }: { workbook: FlatfileWorkbook, recordDataList: FormattedRecordData[][][], flatfileApiKey: string }) => {
    // create the workbook
    let workbookResponse;
    try {
        workbookResponse = await createWorkbook(workbook, flatfileApiKey);
    } catch (error) {
        throw new CsvParseError(`Failed to create workbook. ${JSON.stringify(error)}`);
    }

    // todo: I'm assuming flatfile api is returning sheets in the correct order, at some point stop being lazy and add the slug to recordDataList so it can find the workbook name
    const workbookResponses = await Promise.allSettled(workbookResponse.data.sheets.map(async (sheet, sheetIndex) => {
        // map the custom record type to the type expected by the api
        const records = mapWorkbookToRecords(workbook, sheetIndex, recordDataList[sheetIndex]);

        try {
            // call the api to add the records
            const recordInsertionResponse: InsertRecordResponse = await insertRecordsIntoSheet(sheet.id, records, flatfileApiKey);
            return recordInsertionResponse;
        } catch (error) {
            return { error: `Failed to insert records into sheet ${sheet.id}.\n\n${JSON.stringify(error)}` };
        }
    }));

    return { workbookResponse, recordsResponse: workbookResponses };
}

const getHeaders = (parsedRecords: string[][], hasColumnHeaders: boolean, columnHeaders?: string[]) => {
    if (columnHeaders) return columnHeaders;
    if (hasColumnHeaders) return parsedRecords[0];

    // otherwise, generate some default headers
    return parsedRecords[0].map((_, i) => (i + 1).toString());
}

export default {
    createFlatfile,
    convertCsvToWorkbook
}