import { readFile } from "fs/promises";
import { convertCsvToWorkbook, createFlatfile } from "../index.js";

import "dotenv/config.js";

const loadCsvWithHeaders = async () => {
    let importedCsv: string;
    try {
        importedCsv = await readFile("./testData/zillow.csv", 'utf8')
    } catch {
        throw new Error('Failed to load the CSV file.');
    }

    if (!importedCsv) return null;

    const data = convertCsvToWorkbook({
        workbookName: "Zillow",
        csvConfigs: [{ csv: importedCsv, hasColumnHeaders: true, sheetName: 'zillow#1' }]
    });

    const flatfile = await createFlatfile({ workbook: data.workbook, recordDataList: data.recordData, flatfileApiKey: process.env?.flatfile ?? '' });
    console.log('flatfileResp', flatfile)
}

// const loadMultipleCsvsWithHeaders = async () => {
//     let importedCsv: string;
//     let importedCsv2: string;
//     let importedCsv3: string;
//     try {
//         importedCsv = await readFile("./testData/zillow.csv", 'utf8');
//         importedCsv2 = await readFile("./testData/nile.csv", 'utf8');
//         importedCsv3 = await readFile("./testData/trees.csv", 'utf8');
//     } catch {
//         throw new Error('Failed to load the CSV file.');
//     }

//     if (!importedCsv) return null;

//     const data = convertCsvToWorkbook({
//         workbookName: "Workbook",
//         workbookSpaceId: "space1",
//         csvConfigs: [{ csv: importedCsv, hasColumnHeaders: true, sheetName: 'zillow#1' }, { csv: importedCsv2, hasColumnHeaders: true, sheetName: 'nile#2' }, { csv: importedCsv3, hasColumnHeaders: true, sheetName: 'trees#3' }]
//     });

//     const flatfile = await createFlatfile({ workbook: data.workbook, recordDataList: data.recordData, flatfileApiKey: process.env?.flatfile ?? '' });
//     console.log('flatfileResp', flatfile)
// }

// const loadCsvWithoutHeaders = async () => {
//     let importedCsv: string;
//     try {
//         importedCsv = await readFile("./testData/example.csv", 'utf8')
//     } catch {
//         throw new Error('Failed to load the CSV file.');
//     }

//     if (!importedCsv) return null;

//     const data = convertCsvToWorkbook({ csv: importedCsv, hasColumnHeaders: false, workbookName: 'TestData', sheetName: 'Sheet', columnHeaders: ['Date', 'Measurement Total', 'Measurement', 'Product', 'Name', 'Delivery Point'] })
//     const flatfile = await createFlatfile({ workbook: data.workbook, recordData: data.recordData, flatfileApiKey: process.env?.flatfile ?? '' });
//     console.log('flatfileResp', flatfile)
// }

// const loadCsvWithAutoGeneratedHeaders = async () => {
//     let importedCsv: string;
//     try {
//         importedCsv = await readFile("./testData/nile.csv", 'utf8')
//     } catch {
//         throw new Error('Failed to load the CSV file.');
//     }

//     if (!importedCsv) return null;
//     const { workbook, recordData } = convertCsvToWorkbook({ csv: importedCsv, hasColumnHeaders: true, workbookName: 'TestData', sheetName: 'The Nile through time' });

//     // add messages to our data, this can be in the form of a warning, info, or error
//     const modifiedRecordData = recordData.map((parsedWeatherData) => {
//         return parsedWeatherData.map((weatherData) => {
//             // add a warning when floods exceed 11
//             if (Number(weatherData.value) > 11 && weatherData.header === 'Flood') return {
//                 ...weatherData, messages: [{
//                     type: "warn",
//                     message: "That's a lot of flooding!"
//                 }]
//             }
//             return { ...weatherData, updatedAt: new Date().toISOString() }; // you can also insert custom record data fields here that will be inserted into the flatile!
//         });
//     });

//     const flatfile = await createFlatfile({ workbook, recordData: modifiedRecordData, flatfileApiKey: process.env?.flatfile ?? '' });
//     console.log('flatfileResp', flatfile)
// }

// const loadCsvWithCustomFieldTypes = async () => {
//     let importedCsv: string;
//     try {
//         importedCsv = await readFile("./testData/nile.csv", 'utf8')
//     } catch {
//         throw new Error('Failed to load the CSV file.');
//     }

//     if (!importedCsv) return null;

//     const parsedCsv = convertCsvToWorkbook({
//         csv: importedCsv,
//         hasColumnHeaders: true,
//         workbookName: 'TestData',
//         sheetName: 'Nile with basic field types',
//         flatfileKey: process.env?.flatfile ?? '',
//         fieldTypes: [{ type: "number" }, { type: "string" }]
//     });
//     console.log('parsedCsv', parsedCsv)
// }

// const loadCsvWithReferenceAndEnum = async () => {
//     let importedCsv: string;
//     try {
//         importedCsv = await readFile("./testData/nile.csv", 'utf8')
//     } catch {
//         throw new Error('Failed to load the CSV file.');
//     }

//     if (!importedCsv) return null;

//     const parsedCsv = convertCsvToWorkbook({
//         csv: importedCsv,
//         hasColumnHeaders: true,
//         workbookName: 'TestData',
//         sheetName: 'Nile with a reference and enum field type',
//         sheetAccess: ["add", "edit", "delete", "import"],
//         fieldTypes: [{
//             type: "reference",
//             config: {
//                 ref: "parents",
//                 key: "email",
//                 relationship: "has-one"
//             }
//         }, {
//             type: "enum",
//             config: {
//                 allow_custom: false,
//                 options: [{
//                     value: "active",
//                     label: "Active"
//                 }, {
//                     value: "inactive",
//                     label: "Disabled",
//                     color: "#ff0000",
//                     icon: "fa fa-ban",
//                     metadata: {
//                         foo: "bar"
//                     }
//                 }]
//             }
//         }]
//     });

//     console.log(parsedCsv)

//     return parsedCsv;
// }


loadCsvWithHeaders()
// loadMultipleCsvsWithHeaders();
// loadCsvWithoutHeaders()
// loadCsvWithAutoGeneratedHeaders()
// loadCsvWithReference();
// loadCsvWithReferenceAndEnum();