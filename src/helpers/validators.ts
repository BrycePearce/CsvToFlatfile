import type { FormattedRecordData } from "../types/Flatfile.js";
import type { ParseCsv } from "../types/ParseCsv.js";

export const isValidParameters = (params: Partial<ParseCsv> & { records: FormattedRecordData[][] | undefined, headers: string[] }) => {
    const { records, fieldKeys, headers, fieldTypes } = params;

    // rule: there must be at least one csv item to parse
    if (!records || records.length === 0) return { hasError: true, message: 'Invalid csv provided, or there were no records to parse.' }

    // rule: all param sub-arrays that are inserted into rows must be of equal length to the number of column headers
    const totalHeaders = headers.length;
    const arraysToMatchHeaderLength = [fieldKeys, records[0], fieldTypes];

    const isValidPropLengths =
        arraysToMatchHeaderLength
            .filter((arrayParam) => arrayParam !== undefined) // filter out undefined values, since some of these params are optional
            .every((param) => (param?.length === totalHeaders));

    if (!isValidPropLengths) {
        return { hasError: true, message: 'Invalid param length. A sub-array provided did not match the length of the csv headers' };
    }

    return { hasError: false, message: '' }
}