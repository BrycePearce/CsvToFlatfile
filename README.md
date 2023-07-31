# CsvtoFlatfile

`CsvtoFlatfile` is an easy way to convert your CSV data to Flatfile workbook format. It fully supports all available customization options allowing you full control over your data.

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
import { readFile } from "fs/promises";
import { convertCsvToWorkbook } from 'csvtoflatfile';

const generateFlatfile = async () => {
    const importedCsv: string = await readFile("./mydata.csv", 'utf8');

    // create a workbook
    const { workbook, recordData } = convertCsvToWorkbook({
      csv: importedCsv, // your csv file
      hasColumnHeaders: true, // whether or not your csv data includes headers
      workbookName: 'Zillow', // the name of your newly created workbook
      sheetName: 'coolSheet#1' // the sheet name for your data
    });

    // create the Flatfile
    const flatfile = await createFlatfile({ workbook, recordData, flatfileApiKey: process.env.yourKey });

   return flatfile; // Flatfile contains the flatfile and record creation response
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
