import fs from 'fs';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1)) {
  const wb1 = xlsxLib.readFile(f1);
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];

  // Let's get unique by Name & Father
  const uniqueRows: any[] = [];
  const seen = new Set();
  
  for (const row of r1) {
    const name = String(row['Farmer Name'] || '').trim();
    const father = String(row['Identifier Name'] || '').trim();
    const key = `${name.toLowerCase()}||${father.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRows.push(row);
    }
  }

  // Sort them alphabetically by 'Farmer Name' using localeCompare
  uniqueRows.sort((a, b) => {
    const nameA = String(a['Farmer Name'] || '').trim();
    const nameB = String(b['Farmer Name'] || '').trim();
    return nameA.localeCompare(nameB, 'te');
  });

  console.log("Locale alphabetical sort (first 15):");
  uniqueRows.slice(0, 15).forEach((x, idx) => {
    console.log(`${idx + 1}: ${x['Farmer Name']} | ${x['Identifier Name']}`);
  });

  console.log("\nLocale alphabetical sort (rows 50 to 70):");
  uniqueRows.slice(50, 70).forEach((x, idx) => {
    console.log(`${idx + 51}: ${x['Farmer Name']} | ${x['Identifier Name']}`);
  });
}
