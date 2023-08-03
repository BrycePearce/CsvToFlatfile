import { strToSlug, toCamelCaseNoSpecialChars } from './helpers.js';

import type { Action, Field, FlatfileWorkbook, FormattedRecordData, Sheet } from '../types/Flatfile.js';
import type { EnumConfig, FieldType, ReferenceConfig, SheetAccessOptions } from '../types/ParseCsv.js';

type CsvToWorkbookProps = { actions?: Action[], fieldKeys?: string[], fieldTypes?: FieldType[], labels: string[], sheetName: string, formattedRecords: FormattedRecordData[][], slugName?: string, workbookName: string, sheetAccess?: SheetAccessOptions[], workbookEnvironmentId?: string, workbookSpaceId?: string }

export const mapCsvToWorkbook = ({ actions, fieldKeys, fieldTypes, labels, formattedRecords, slugName, sheetName, workbookName, sheetAccess, workbookEnvironmentId, workbookSpaceId, }: CsvToWorkbookProps): FlatfileWorkbook => {
    // generate a slugName if they user did not provide one
    const slug = slugName ? slugName : strToSlug(sheetName)

    // generate sheet
    const sheet: Sheet = {
        name: sheetName,
        slug,
        ...(workbookEnvironmentId && { workbookEnvironmentId }),
        ...(workbookSpaceId && { workbookSpaceId }),
        ...(sheetAccess && { access: sheetAccess }),
        fields: mapLabelsToFields(labels, formattedRecords, fieldKeys, fieldTypes)
    }

    // generate actions
    const defaultAction: Action = { description: "Submit data to webhook.site", label: "Submit", mode: "foreground", operation: "submitAction", primary: true }
    const userActions = actions ? actions : [defaultAction];

    return {
        name: workbookName,
        sheets: [sheet],
        actions: userActions
    }
};

const mapLabelsToFields = (labels: string[], formattedRecords: FormattedRecordData[][], fieldKeys?: string[], fieldTypes?: FieldType[]): Field[] => {
    // load record types, in case the user did not provide them. Supported types are "string" | "number" | "boolean" | "date"
    const recordTypes = formattedRecords[0].map((record) => getRecordType(record.value)); // todo: this could probably be better than basing it off the first record, could find the first non null value for that record

    return labels.map((label, labelIndex) => {
        const fieldLabel = label;
        const fieldKey = fieldKeys ? fieldKeys[labelIndex] : toCamelCaseNoSpecialChars(fieldLabel);
        const fieldType = fieldTypes ? fieldTypes[labelIndex].type : recordTypes[labelIndex];

        // handle configuration objects
        const hasConfigObj = fieldTypes && (fieldTypes[labelIndex].type === 'reference' || fieldTypes[labelIndex].type === 'enum'); // only enum and reference currently support config objects
        const labelConfig = hasConfigObj ? (fieldTypes[labelIndex] as { config: ReferenceConfig | EnumConfig }).config : null;

        return {
            key: fieldKey,
            type: fieldType,
            label: fieldLabel,
            ...(labelConfig && { config: labelConfig })
        }
    })
};

const getRecordType = (str: string) => {
    // The function checks if the string is a boolean
    const isBoolean = (str: string) => {
        return str === 'true' || str === 'false';
    }

    // The function checks if the string is a number
    const isNumber = (str: string) => {
        return !isNaN(Number(str));
    }

    // The function checks if the string is a valid date in the format of 'YYYY-MM-DD'
    const isDateYYYYMMDD = (str: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(str);
    }

    if (isBoolean(str)) {
        return 'boolean';
    } else if (isNumber(str)) {
        return 'number';
    } else if (isDateYYYYMMDD(str)) {
        return 'date';
    } else {
        return 'string';
    }
}