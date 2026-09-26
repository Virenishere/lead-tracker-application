import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultCsvPath = path.join(__dirname, "customers-100000.csv");

/**
 * Parses a CSV file from disk into typed JS objects using Node streams & PapaParse
 */
export function parseCSVFile<T = any>(filePath: string = defaultCsvPath): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`CSV file not found at path: ${filePath}`));
    }

    const fileStream = fs.createReadStream(filePath, "utf-8");

    Papa.parse<T>(fileStream, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        console.log(`Parsed ${results.data.length} rows from CSV file.`);
        resolve(results.data);
      },
      error: (error: Error) => {
        console.error("Error parsing CSV file:", error);
        reject(error);
      },
    });
  });
}

// Auto-run if executed directly via node / tsx
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  parseCSVFile()
    .then((data) => {
      console.log("Sample first 3 rows:", data);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
