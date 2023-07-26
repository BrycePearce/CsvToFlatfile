import { readFile } from 'fs/promises';
import { parse, stringify, transform } from 'csv/sync';

import { createWorkbook } from './api/createWorkbook.js';

import type { ParseCsv } from './types/ParseCsv.js';


export const parseCsv = ({ csv, hasColumnHeaders = false, columnHeaders, options = {
    escapeCharacter: '\\',
    ltrim: true,
    rtrim: true
} }: ParseCsv) => {
    // columns true makes it a cool obj notation
    const parsedRecords: string[][] = parse(csv, { columns: false, relax_quotes: true, escape: options.escapeCharacter, ltrim: options.ltrim, rtrim: options.rtrim });
    // console.log('parsedRecords', parsedRecords)
    const headers = getHeaders(parsedRecords, hasColumnHeaders, columnHeaders);
    console.log('headers', headers)
    // const refinedRecords = transform(rawRecords, (data: string[]) => {
    //     return data.map((value) => {
    //         // console.log('value', value)
    //         return value.toUpperCase();
    //     });
    // });

    // const output = stringify(refinedRecords);

    // try {
    //     const meme = await createWorkbook();
    //     console.log(meme)

    // } catch (ex) {
    //     console.log(ex)
    // }
}

const getHeaders = (parsedRecords: string[][], hasColumnHeaders: boolean, columnHeaders?: string[]) => {
    if (columnHeaders) return columnHeaders;
    if (hasColumnHeaders) return parsedRecords[0];

    // otherwise, generate some default headers
    return parsedRecords[0].map((_, i) => (i + 1).toString());
}