import type { FlatfileWorkbook, Record, FormattedRecordData } from "../types/Flatfile.js";

export const mapWorkbookToRecords = (workbook: FlatfileWorkbook, sheetIndex: number, formattedRecords: FormattedRecordData[][]): Record[] => {
    const headerKeys = workbook.sheets[sheetIndex].fields.map((field) => field.key);

    const records: Record[] = formattedRecords.map((formattedRecordSet) => {
        return formattedRecordSet.reduce((accumulator, formattedRecord, index) => {
            // eslint-disable-next-line no-unused-vars
            const { header, ...recordData } = formattedRecord; // header is a helper property we add so that users can better map their data, so exclude it from our record data
            const headerKey = headerKeys[index];

            return { ...accumulator, [headerKey]: recordData }
        }, {} as Record)
    });

    return records;
}