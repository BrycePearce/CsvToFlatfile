// https://flatfile.com/docs/blueprint/field-types#overview
import type { Action } from "./Flatfile.js";

export type CsvParseOptions = {
    escapeCharacter?: string; // escape character processed by csv parse
    ltrim?: boolean; // trim left side of csv field
    rtrim?: boolean; // trim right side of csv field
}

export type EnumOption = {
    color?: string; // The value or ID of this option. This value will be sent in egress. Example: #ff0000
    icon?: string; // A reference pointer to a previously registered icon. Example: fa fa-ban
    label?: string; // A visual label for this option, defaults to "value" if not provided. 
    metadata?: Record<string, any>; // An arbitrary JSON object to be associated with this option and made available to hooks
    value: string; // The value or ID of this option. This value will be sent in egress. Example: "active"
}

export type EnumConfig = {
    allow_custom?: boolean; // Permit the user to create new options for this specific field.
    options: EnumOption[];
}

export type ReferenceConfig = {
    key: string;
    ref: string; // The full path reference to another Sheet/table configuration. Must be in the same Workbook.
    relationship: "has-one"; // flatfile only supports has-one
}

export type FieldType =
    | { type: "string" | "number" | "boolean" | "date" } // note: Date fields interpret incoming dates with Month (MM) preceding the Day (DD) in all formats.
    | { type: "enum"; config: EnumConfig }
    | { type: "reference"; config: ReferenceConfig };

export type SheetAccessOptions = "add" | "edit" | "delete" | "import";

type CommonCsvFields = {
    actions?: Action[];
    csv: string;
    fieldKeys?: string[];
    fieldTypes?: FieldType[];
    options?: CsvParseOptions;
    sheetAccess?: SheetAccessOptions[];
    sheetName: string;
    slugName?: string;
    workbookEnvironmentId?: string,
    workbookName: string;
    workbookSpaceId?: string
}

export type ParseCsv = CommonCsvFields & ({
    columnHeaders?: never;
    hasColumnHeaders: true;
} | {
    columnHeaders?: string[];
    hasColumnHeaders: false;
});

// excludes top level fields
export type CsvConfigWithoutWorkbookAndActions = Omit<CommonCsvFields, 'workbookName' | 'workbookSpaceId' | 'actions'> & (
    {
        columnHeaders?: never;
        hasColumnHeaders: true;
    } | {
        columnHeaders?: string[];
        hasColumnHeaders: false;
    }
);

export type ParseMultiCsv = {
    workbookName: string;
    workbookSpaceId?: string;
    actions?: Action[];
    csvConfigs: CsvConfigWithoutWorkbookAndActions[];
};