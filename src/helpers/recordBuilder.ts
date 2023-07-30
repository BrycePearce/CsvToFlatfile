import type { FlatfileWorkbook, Record, Message, InputMessage } from "../types/Flatfile.js";

export const mapWorkbookToRecords = (workbook: FlatfileWorkbook, rawRecords: string[][], messages?: InputMessage[]): Record[] => {
    const headerKeys = workbook.sheets[0].fields.map((field) => field.key);

    const records = rawRecords.map(record => {
        // Initialize an object to hold the current record data
        const recordObject: Record = {};

        // Iterate over each header key
        for (let index = 0; index < headerKeys.length; index++) {
            // Get the current key and corresponding value
            const key = headerKeys[index];
            const value = record[index];

            // If messages exist, filter out the messages for the current key
            // and map them to a simpler format. If messages do not exist, use an empty array.
            const keyMessages: Message[] = messages?.filter(msg => msg.key === key)
                .map(({ type, message }) => ({ type, message })) || [];

            // Add the key, value, messages, and updatedAt to the record object
            recordObject[key] = {
                value,
                // messages: keyMessages, // todo: remap this per notes
                updatedAt: new Date().toISOString()
            };
        }

        return recordObject;
    });

    return records;
}