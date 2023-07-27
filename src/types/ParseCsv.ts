import type { Action } from "./Flatfile.js";

export type CsvParseOptions = {
    ltrim?: boolean;
    rtrim?: boolean;
    escapeCharacter?: string;
}

// https://flatfile.com/docs/blueprint/field-types#overview
// todo: enum and reference are going to take some additional implementation
// you will have to append "config" key to the field element on the workbook. See docs. Not that hard, have user provide it
type FieldType = "string" | "number" | "enum" | "reference" | "boolean" | "date";

export type ParseCsv = {
    csv: string;
    flatfileKey: string;
    workbookName: string;
    sheetName: string;
    actions?: Action[]
    slugName?: string;
    fieldKeys?: string[];
    fieldTypes?: FieldType[];
    hasColumnHeaders: true;
    columnHeaders?: never;
    options?: CsvParseOptions
} | {
    csv: string;
    flatfileKey: string;
    workbookName: string;
    sheetName: string;
    actions?: Action[];
    slugName?: string;
    fieldKeys?: string[];
    fieldTypes?: string[];
    hasColumnHeaders: false;
    columnHeaders?: string[];
    options?: CsvParseOptions
}
