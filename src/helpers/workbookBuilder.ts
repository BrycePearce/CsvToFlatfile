import { Action, Field, FlatfileWorkbook, Sheet } from '../types/Flatfile.js';
import { strToSlug, toCamelCaseNoSpecialChars } from './helpers.js';

type CsvToWorkbookProps = { actions?: Action[], fieldKeys?: string[], fieldTypes?: string[], labels: string[], sheetName: string, records: string[][], slugName?: string, workbookName: string }

export const mapCsvToWorkbook = ({ actions, fieldKeys, fieldTypes, labels, records, slugName, sheetName, workbookName }: CsvToWorkbookProps): FlatfileWorkbook => {
    // load record types, in case the user did not provide them
    const recordTypes = records[0].map((record) => typeof record); // todo: need to convert these to flatfile compatible types

    // generate a slugName if they user did not provide one
    const slug = slugName ? slugName : strToSlug(sheetName)

    // generate sheet
    const sheet: Sheet = {
        name: sheetName,
        slug,
        fields: mapLabelsToFields(labels, recordTypes, fieldKeys, fieldTypes)
    }

    // generate actions
    const defaultAction: Action = { "operation": "submitAction", "mode": "foreground", "label": "Submit", "description": "Submit data to webhook.site", "primary": true }
    const userActions = actions ? actions : [defaultAction];

    return {
        name: workbookName,
        sheets: [sheet],
        actions: userActions
    }
};


const mapLabelsToFields = (labels: string[], recordTypes: string[], fieldKeys?: string[], fieldTypes?: string[]): Field[] => (
    labels.map((label, labelIndex) => {
        const fieldLabel = label;
        const fieldKey = fieldKeys ? fieldKeys[labelIndex] : toCamelCaseNoSpecialChars(fieldLabel);
        const fieldType = fieldTypes ? fieldTypes[labelIndex] : recordTypes[labelIndex];

        return {
            key: fieldKey,
            type: fieldType,
            label: fieldLabel
        }
    })
);