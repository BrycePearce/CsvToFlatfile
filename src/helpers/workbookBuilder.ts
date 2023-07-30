import { strToSlug, toCamelCaseNoSpecialChars } from './helpers.js';

import type { Action, Field, FlatfileWorkbook, Sheet } from '../types/Flatfile.js';
import type { EnumConfig, FieldType, ReferenceConfig, SheetAccessOptions } from '../types/ParseCsv.js';

type CsvToWorkbookProps = { actions?: Action[], fieldKeys?: string[], fieldTypes?: FieldType[], labels: string[], sheetName: string, records: string[][], slugName?: string, workbookName: string, sheetAccess?: SheetAccessOptions[], workbookEnvironmentId?: string, workbookSpaceId?: string, }

export const mapCsvToWorkbook = ({ actions, fieldKeys, fieldTypes, labels, records, slugName, sheetName, workbookName, sheetAccess, workbookEnvironmentId, workbookSpaceId, }: CsvToWorkbookProps): FlatfileWorkbook => {
    // load record types, in case the user did not provide them
    const recordTypes = records[0].map((record) => typeof record); // todo: need to convert these to flatfile compatible types

    // generate a slugName if they user did not provide one
    const slug = slugName ? slugName : strToSlug(sheetName)

    // generate sheet
    const sheet: Sheet = {
        name: sheetName,
        slug,
        ...(workbookEnvironmentId && { workbookEnvironmentId }),
        ...(workbookSpaceId && { workbookSpaceId }),
        ...(sheetAccess && { access: sheetAccess }),
        fields: mapLabelsToFields(labels, recordTypes, fieldKeys, fieldTypes)
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


const mapLabelsToFields = (labels: string[], recordTypes: string[], fieldKeys?: string[], fieldTypes?: FieldType[]): Field[] => (
    labels.map((label, labelIndex) => {
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
);