# CsvtoFlatfile

`CsvtoFlatfile` is a fast an easy way to convert your csv into a Flatfile. It fully supports all available customization options allowing you full control over your data.

It serves as an [auto-map](https://flatfile.com/docs/plugins/automations/automap) alternative when you know exactly what you want your data to look like.

## Notes
- `csvtoflatfile` is a Node.js ECMAScript modules (ESM) library.

- Non-essential fields are automatically generated if not provided.

## Installation

Follow these steps to install and use `csvtoflatfile` in your project:

1. **Install the package via npm:**

```bash
npm install csvtoflatfile
```

2. **Import the package**

```javascript
import { convertCsvToWorkbook, createFlatfile } from 'csvtoflatfile'; // or import csvtoflatfile from 'csvtoflatfile';

```

## Basic Usage

```javascript
import { readFile } from "fs/promises";
import { convertCsvToWorkbook, createFlatfile } from 'csvtoflatfile';

const generateFlatfile = async () => {
    const importedCsv: string = await readFile("./mydata.csv", 'utf8');

    // create a workbook
    const { workbook, recordData } = convertCsvToWorkbook({
      csv: importedCsv, // your csv file
      hasColumnHeaders: true, // whether or not your csv data includes headers
      workbookName: 'TestData', // the name of your newly created workbook
      sheetName: 'The Nile through time' // the sheet name for your data
    });

    // optionally, modify/customize your data. Any Flatfile supported record keys are supported.
    // In this case we'll add a warning message when the number of floods exceeds 11.
    const modifiedRecordData = recordData.map((parsedWeatherData) => {
        return parsedWeatherData.map((weatherData) => {
            // add a warning when floods exceed 11
            if (Number(weatherData.value) > 11 && weatherData.header === 'Flood') return {
                ...weatherData, messages: [{
                    type: "warn",
                    message: "That's a lot of flooding!"
                }]
            }
            return { ...weatherData, updatedAt: new Date().toISOString() }; // you can also insert custom record data fields here that will be inserted into the flatile!
        });
    });

    // create the Flatfile
    const flatfile = await createFlatfile({ workbook, recordData: modifiedRecordData, flatfileApiKey: process.env.yourKey });

   return flatfile; // Flatfile contains the flatfile and record creation response
}
```

### Result 

![image](https://github.com/BrycePearce/CsvToFlatfile/assets/16729071/9d7a62ef-33b9-4795-8b96-6a9a7fdca50b)


## Advanced Usage

🚧 Demo code coming soon. See demo/example.ts for more advanced usage.

## Roadmap

The `csvtoflatfile` project is currently under active development, but the core functionality has been added (#1 & #2). Here's the current roadmap:

1. **CSV to Workbook Conversion:** ✔️ Complete!

2. **File Upload / Record insertion:** ✔️ Complete!

3. **Add multiple sheets on initial Flatfile creation** 🚧 Work In Progress.

4. **Append new sheets to existing Flatfiles** 🚧 Work In Progress.

5. Automap integration https://flatfile.com/docs/plugins/automations/automap
