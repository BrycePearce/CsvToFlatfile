import type { FormattedRecordData } from "../types/Flatfile.js";

// "Input": "Hello 2 World" "Output: "hello2World"
export function toCamelCaseNoSpecialChars(str: string) {
    return str
        // Remove leading and trailing whitespace
        .trim()
        // Remove special characters
        .replace(/[^a-zA-Z0-9\s]/g, '')
        // Split the string into words
        .split(/\s+/)
        // Convert the first word to lowercase and the rest to capitalized
        .map((word, i) => {
            const lowerCaseWord = word.toLowerCase();
            return i === 0 ? lowerCaseWord : lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
        })
        // Join all words together
        .join('');
}

// lowercases everything and replaces spaces with hypens
export const strToSlug = (str: string) => (str
    // Convert to lowercase
    .toLowerCase()
    // Remove special characters
    .replace(/[^a-z0-9\s]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove any leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
);

export const formatCsvToPublicRecord = (csvData: string[][], headers: string[]): FormattedRecordData[][] => {
    return csvData.map((csvValueList) => {
        return csvValueList.map((value, index) => ({ header: headers[index], value }))
    });
}