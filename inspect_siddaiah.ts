import fs from 'fs';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1)) {
  const wb1 = xlsxLib.readFile(f1);
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];

  console.log("Searching for siddaiah / bakkakka in FILE 1:");
  console.log(r1.filter(x => {
    const s = JSON.stringify(x).toLowerCase();
    return s.includes('siddaiah') || s.includes('bakkakka') || s.includes('lalitha') || s.includes('lasmakka');
  }));
}
