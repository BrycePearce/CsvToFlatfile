# CsvtoFlatfile

`CsvtoFlatfile` is a powerful and easy-to-use npm package that converts your CSV data to Flatfile workbook format. It supports all Flatfile customization options, making it a flexible solution for. Non-essential fields are automatically generated if they're not provided, simplifying the process even further.

It serves as an auto-map alternative when you know exactly what you want your data to look like.

## Notes
`csvtoflatfile` is written using ECMAScript modules (ESM).

## Installation

Follow these steps to install and use `csvtoflatfile` in your project:

1. **Install the package via npm:**

```bash
npm install csvtoflatfile
```

2. **Import the package**

```javascript
const { convertCsvToWorkbook } = require('csvtoflatfile')
```

## Basic Usage

```javascript
const { convertCsvToWorkbook } = require('csvtoflatfile')

const loadCsvWithHeaders = async () => {
    let importedCsv: string;
    try {
        importedCsv = await readFile("./testData/zillow.csv", 'utf8')
    } catch {
        throw new Error('Failed to load the CSV file.');
    }

    if (!importedCsv) return null;

    // create a workbook
    const workbook = convertCsvToWorkbook({ csv: importedCsv, hasColumnHeaders: true, workbookName: 'Zillow', sheetName: 'coolSheet#1' })
    console.log(workbook)
}
```

## Advanced Usage (every customization option)

```javascript
const { convertCsvToWorkbook } = require('csvtoflatfile')

const loadCsvWithReferenceAndEnum = async () => {
    // load your csv
    let importedCsv: string;
    try {
        importedCsv = await readFile("./testData/nile.csv", 'utf8')
    } catch {
        throw new Error('Failed to load the CSV file.');
    }

    if (!importedCsv) return null;

    // get the Flatfile workbook with your specified options
    const workbook = convertCsvToWorkbook({
        csv: importedCsv,
        hasColumnHeaders: true,
        workbookName: 'TestData',
        sheetName: 'Nile with a reference and enum field type',
        sheetAccess: ["add", "edit", "delete", "import"],
        fieldTypes: [{
            type: "reference",
            config: {
                ref: "parents",
                key: "email",
                relationship: "has-one"
            }
        }, {
            type: "enum",
            config: {
                allow_custom: false,
                options: [{
                    value: "active",
                    label: "Active"
                }, {
                    value: "inactive",
                    label: "Disabled",
                    color: "#ff0000",
                    icon: "fa fa-ban",
                    metadata: {
                        foo: "bar"
                    }
                }]
            }
        }]
    });

    console.log(workbook);
}

```

## Roadmap

The `csvtoflatfile` project is currently under active development. Here's some of things being worked on

1. **CSV to Workbook Conversion:** ✔️ Complete!

2. **File Upload:** 🚧 Work In Progress.

3. **Downloadable Files:** 🚧 Work In Progress.

4. Automap integration https://flatfile.com/docs/plugins/automations/automap
