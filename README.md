# CsvtoFlatfile

`CsvtoFlatfile` is an easy way to convert your CSV data to Flatfile workbook format.

It serves as an [auto-map](https://flatfile.com/docs/plugins/automations/automap) alternative when you know exactly what you want your data to look like.

## Notes
`csvtoflatfile` is a ECMAScript modules (ESM) library.

 Non-essential fields are automatically generated if not provided.

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
    let importedCsv: string = await readFile("./mydata.csv", 'utf8');

    // create a workbook
    const workbook = convertCsvToWorkbook({
      csv: importedCsv, // your csv file
      hasColumnHeaders: true, // whether or not your csv data includes headers
      workbookName: 'Zillow', // the name of your newly created workbook
      sheetName: 'coolSheet#1' // the sheet name for your data
    });
    console.log(workbook)
}
```

## Advanced Usage

🚧 Demo code coming soon. See demo/example.ts for more advanced usage.

## Roadmap

The `csvtoflatfile` project is currently under active development. Here's some of things being worked on

1. **CSV to Workbook Conversion:** ✔️ Complete!

2. **File Upload / Record insertion:** ✔️ Complete!

3. **Downloadable Workbook:** 🚧 Work In Progress.

4. **Edit workbook:** 🚧 Work In Progress.

5. Automap integration https://flatfile.com/docs/plugins/automations/automap
