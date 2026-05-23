import fs from 'fs';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1)) {
  const wb1 = xlsxLib.readFile(f1);
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];

  console.log("Positions in FILE 1:");
  r1.forEach((x, idx) => {
    const name = String(x['Farmer Name'] || '').trim();
    if (["అంగల రేవతి", "అన్నరపు శ్రీనివాస్", "అన్నారపు కమల", "అన్నారపు సత్యయ్య", "అయిదే శంకరి"].includes(name)) {
      console.log(`- Row ${idx + 2} (Index ${idx}): ${name}`);
    }
  });
}
