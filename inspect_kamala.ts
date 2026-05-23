import fs from 'fs';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1)) {
  const wb1 = xlsxLib.readFile(f1);
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];

  console.log("Searching for 'కమల':");
  console.log(r1.filter(x => String(x['Farmer Name'] || '').includes('కమల')));

  console.log("\nSearching for 'అన్నరపు':");
  console.log(r1.filter(x => String(x['Farmer Name'] || '').includes('అన్నరపు')));
  
  console.log("\nSearching for 'అన్నారపు':");
  console.log(r1.filter(x => String(x['Farmer Name'] || '').includes('అన్నారపు')));
}
