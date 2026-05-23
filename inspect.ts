import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const f2 = '/tmp/farmer-registry-private/1779471598805-233053-file2.xlsx';

const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1) && fs.existsSync(f2)) {
  const wb1 = xlsxLib.readFile(f1);
  const wb2 = xlsxLib.readFile(f2);
  
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];
  const r2 = xlsxLib.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]]) as any[];

  console.log(`FILE 1 Rows total: ${r1.length}`);
  console.log(`FILE 2 Rows total: ${r2.length}`);
  
  console.log("\n--- First 5 rows of FILE 1 ---");
  console.log(JSON.stringify(r1.slice(0, 5), null, 2));

  // Let's check some specific names from the screenshot:
  // "అంగల రేవతి", "అన్నరపు శ్రీనివాస్", "అన్నరపు కమల", "అన్నరపు సత్యయ్య", "అయిదే శంకరి"
  const namesToCheck = ["అంగల రేవతి", "అన్నరపు శ్రీనివాస్", "అన్నరపు కమల", "అన్నరపు సత్యయ్య", "అయిదే శంకరి"];
  console.log("\nChecking if screenshot names exist in FILE 1:");
  for (const name of namesToCheck) {
    const found = r1.filter(x => String(x['Farmer Name'] || '').trim().includes(name));
    console.log(`- '${name}' in FILE 1: found ${found.length} matches.`);
    if (found.length > 0) {
      console.log(JSON.stringify(found, null, 2));
    }
  }

  console.log("\nChecking if screenshot names exist in FILE 2:");
  for (const name of namesToCheck) {
    const found = r2.filter(x => String(x['FarmerName_Tel'] || '').trim().includes(name));
    console.log(`- '${name}' in FILE 2: found ${found.length} matches.`);
  }

} else {
  console.log("Files do not exist!");
}
