const fs = require('fs');
const file = 'src/components/ExeUbdLiveMonitoring.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add imports
const importTarget = `import { db } from '../../firebase';`;
const importNew = `import { db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';`;

if (code.includes(importTarget)) {
  code = code.replace(importTarget, importNew);
} else {
  console.log("Import target not found!");
}

// 2. Add state
const stateTarget = `const [otaSubTab, setOtaSubTab] = useState<'overview' | 'steps' | 'simulator' | 'csharp' | 'nodejs' | 'php'>('overview');`;
const stateNew = `const [otaSubTab, setOtaSubTab] = useState<'overview' | 'steps' | 'simulator' | 'csharp' | 'nodejs' | 'php'>('overview');
  
  const [uploadingExe, setUploadingExe] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedExeUrl, setUploadedExeUrl] = useState<string | null>(null);`;

if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateNew);
} else {
  console.log("State target not found!");
}

// 3. Add handleUpload function
const funcTarget = `// File Download Helper`;
const funcNew = `// Handle EXE Upload
  const handleExeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.exe') && !file.name.toLowerCase().endsWith('.zip')) {
      alert("దయచేసి .exe లేదా .zip ఫైల్‌ను మాత్రమే అప్‌లోడ్ చేయండి.");
      return;
    }

    setUploadingExe(true);
    setUploadProgress(0);

    const storageRef = ref(storage, \`releases/\${Date.now()}_\${file.name}\`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        alert("అప్‌లోడ్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.");
        setUploadingExe(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadedExeUrl(downloadURL);
        setUploadingExe(false);
        showToast("✅ ఫైల్ విజయవంతంగా అప్‌లోడ్ చేయబడింది!");
      }
    );
  };

  // File Download Helper`;

if (code.includes(funcTarget)) {
  code = code.replace(funcTarget, funcNew);
} else {
  console.log("Function target not found!");
}

// 4. Update JSX for Step 1
const step1Target = `<div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] break-all border border-slate-800">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">ఉదాహరణ లింక్:</span>
                      https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ఫైల్ సైజు: 5MB–25MB</span>
                    <button
                      onClick={() => handleCopyText("https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe", 'sample_url')}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>{copiedCode === 'sample_url' ? 'Copied' : 'లింక్ కాపీ'}</span>
                    </button>
                  </div>`;

const step1New = `<div className="mt-2">
                      <label className="relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/30 hover:bg-indigo-50 transition-colors cursor-pointer">
                        <input type="file" accept=".exe,.zip" onChange={handleExeUpload} disabled={uploadingExe} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                        <UploadCloud size={24} className={\`text-indigo-500 mb-2 \${uploadingExe ? 'animate-bounce' : ''}\`} />
                        <span className="text-xs font-bold text-slate-700">
                          {uploadingExe ? \`అప్‌లోడ్ అవుతోంది... \${uploadProgress}%\` : 'కొత్త EXE ఫైల్‌ను ఎంచుకోండి'}
                        </span>
                        {!uploadingExe && <span className="text-[10px] text-slate-500 mt-1">.exe or .zip (Max 25MB)</span>}
                      </label>
                    </div>

                    <div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] break-all border border-slate-800 mt-2 relative">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">{uploadedExeUrl ? 'మీ డౌన్‌లోడ్ లింక్:' : 'ఉదాహరణ లింక్:'}</span>
                      {uploadedExeUrl ? uploadedExeUrl : 'https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe'}
                      
                      {uploadingExe && (
                        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300 rounded-b-xl" style={{ width: \`\${uploadProgress}%\` }}></div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ఫైల్ సైజు: 5MB–25MB</span>
                    <button
                      onClick={() => handleCopyText(uploadedExeUrl || "https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe", 'sample_url')}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>{copiedCode === 'sample_url' ? 'Copied' : 'లింక్ కాపీ'}</span>
                    </button>
                  </div>`;

if (code.includes(step1Target)) {
  code = code.replace(step1Target, step1New);
} else {
  console.log("JSX Step 1 target not found!");
}

fs.writeFileSync(file, code);
console.log("Patch applied.");
