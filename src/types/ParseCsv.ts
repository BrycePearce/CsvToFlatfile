export type ParseCsvOptions = {
    ltrim?: boolean;
    rtrim?: boolean;
    escapeCharacter?: string;
}

export type ParseCsv = {
    csv: string;
    hasColumnHeaders: true;
    columnHeaders?: never;
    options?: ParseCsvOptions
} | {
    csv: string;
    hasColumnHeaders: false;
    columnHeaders?: string[];
    options?: ParseCsvOptions
}
