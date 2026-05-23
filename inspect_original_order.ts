import fs from 'fs';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1)) {
  const wb1 = xlsxLib.readFile(f1);
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];

  console.log("Original order in FILE 1 (without consecutive duplicates of name+father):");
  const seen = new Set();
  let index = 1;
  for (const row of r1) {
    const name = String(row['Farmer Name'] || '').trim();
    const father = String(row['Identifier Name'] || '').trim();
    const key = `${name.toLowerCase()}||${father.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      console.log(`${index}: ${name} | ${father}`);
      index++;
    }
  }
}
