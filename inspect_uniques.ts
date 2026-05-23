import fs from 'fs';
import * as XLSX from 'xlsx';

const f1 = '/tmp/farmer-registry-private/1779471598805-233053-file1.xlsx';
const xlsxLib = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);

if (fs.existsSync(f1)) {
  const wb1 = xlsxLib.readFile(f1);
  const r1 = xlsxLib.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]) as any[];

  console.log(`Original FILE 1 length: ${r1.length}`);

  // Let's count unique based on different fields:
  const uniqueByNameAndFather = new Set();
  const uniqueByNameAndMobile = new Set();
  const uniqueByNameAndFatherAndSurvey = new Set();

  r1.forEach(row => {
    const name = String(row['Farmer Name'] || '').trim();
    const father = String(row['Identifier Name'] || '').trim();
    const mobile = String(row['Farmer Mobile Number'] || '').trim();
    const survey = String(row['Survey Number'] || '').trim();

    uniqueByNameAndFather.add(`${name}||${father}`);
    uniqueByNameAndMobile.add(`${name}||${mobile}`);
    uniqueByNameAndFatherAndSurvey.add(`${name}||${father}||${survey}`);
  });

  console.log(`Unique by Name & Father/Husband: ${uniqueByNameAndFather.size}`);
  console.log(`Unique by Name & Mobile: ${uniqueByNameAndMobile.size}`);
  console.log(`Unique by Name & Father & Survey: ${uniqueByNameAndFatherAndSurvey.size}`);

  // Let's see if 81 is exactly the number of unique entries by Name & Father!
}
