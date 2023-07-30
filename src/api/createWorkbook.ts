import got from "got";
import { flatfileRootUrl } from "../constants.js";
// import { getFlatfileClient } from "./flatfileClient.js";

import type { FlatfileWorkbook, InsertRecordResponse, WorkbookResponse, Record } from "../types/Flatfile.js";

const endpoints = {
    records: (sheetId: string) => `${flatfileRootUrl}/sheets/${sheetId}/records`,
    workbooks: `${flatfileRootUrl}/workbooks`
}

export const createWorkbook = async (workbook: FlatfileWorkbook, token: string) => {
    return await got.post(endpoints.workbooks, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        json: workbook
    }).json<WorkbookResponse>();
}

export const insertRecordsIntoSheet = async (sheetId: string, records: Record[], token: string) => {
    return await got.post(endpoints.records(sheetId), {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        json: records
    }).json<InsertRecordResponse>();
}