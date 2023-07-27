import { parse } from 'csv/sync';
import { createWorkbook } from './api/createWorkbook.js';
import { mapCsvToWorkbook } from './helpers/workbookBuilder.js';

import type { ParseCsv } from './types/ParseCsv.js';

export const parseCsv = async ({ csv, hasColumnHeaders = false, columnHeaders, flatfileKey, actions, fieldKeys, fieldTypes, slugName, sheetName, workbookName, options = {
    escapeCharacter: '\\',
    ltrim: true,
    rtrim: true
} }: ParseCsv) => {
    // columns true makes it a cool obj notation
    const rawRecords: string[][] = parse(csv, { columns: false, relax_quotes: true, escape: options.escapeCharacter, ltrim: options.ltrim, rtrim: options.rtrim });
    const headers = getHeaders(rawRecords, hasColumnHeaders, columnHeaders);
    const formattedRecords = hasColumnHeaders ? rawRecords.slice(1) : rawRecords;

    if (headers?.length === 0) {
        throw new Error('Invalid headers')
    }

    const workbook = mapCsvToWorkbook({ workbookName: workbookName, records: formattedRecords, labels: headers, actions, fieldKeys, fieldTypes, slugName, sheetName })
    console.log('workbook', JSON.stringify(workbook))

    try {
        // const meme = await createWorkbook(flatfileKey);
        // console.log(meme)
    } catch (ex) {
        // console.log(ex)
    }
}

const getHeaders = (parsedRecords: string[][], hasColumnHeaders: boolean, columnHeaders?: string[]) => {
    if (columnHeaders) return columnHeaders;
    if (hasColumnHeaders) return parsedRecords[0];

    // otherwise, generate some default headers
    return parsedRecords[0].map((_, i) => (i + 1).toString());
}