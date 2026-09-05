import React, { useState, useRef, useEffect } from 'react';
import { Package, UploadCloud, Server, CheckCircle2, FileDigit, Clock, Database, Download } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { storage, db } from '../../../firebase';

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ExeDeploymentManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [releases, setReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'exe_releases'), orderBy('timestamp', 'desc'), limit(15));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReleases(data);
    } catch (error) {
      console.error("Error fetching releases: ", error);
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.exe')) {
      alert("Please upload only .exe files.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    startUpload(file);
  };

  const startUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    
    // Auto-generate a version number 
    const newVersion = `v1.5.${Math.floor(Date.now() / 1000).toString().slice(-4)}`;
    const storageRef = ref(storage, `deployments/EVedhikaUBDDeploymentTool_${newVersion}.exe`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progressVal = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progressVal));
      }, 
      (error) => {
        console.error("Upload error:", error);
        alert("Upload failed. Please try again.");
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save metadata to Firestore
          await addDoc(collection(db, 'exe_releases'), {
            version: newVersion,
            fileName: file.name,
            size: file.size,
            downloadUrl: downloadURL,
            timestamp: serverTimestamp()
          });
          
          await fetchReleases();
        } catch (err) {
          console.error("Error saving release metadata:", err);
        }
        
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    );
  };

  const activeRelease = releases.length > 0 ? releases[0] : null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Package size={20} className="text-indigo-600" /> Deployment (.exe Manager)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Upload and manage .exe binary files to Firebase Storage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Upload Section */}
        <div className="flex flex-col">
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UploadCloud size={16} className="text-indigo-600" /> Upload New Build (.exe)
           </h4>
           
           <input 
             type="file" 
             accept=".exe" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileChange}
           />

           <div 
             onClick={() => !isUploading && fileInputRef.current?.click()}
             className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all ${
               isUploading ? 'border-indigo-300 bg-indigo-50/50 cursor-not-allowed' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer'
             }`}
           >
             {isUploading ? (
               <div className="w-full max-w-xs space-y-4">
                 <div className="flex justify-between text-xs font-bold text-indigo-700">
                   <span>Uploading to Firebase Storage...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-indigo-600 transition-all duration-300"
                     style={{ width: `${progress}%` }}
                   ></div>
                 </div>
                 <p className="text-[10px] text-indigo-500 font-medium animate-pulse">Please do not close this window.</p>
               </div>
             ) : (
               <>
                 <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                   <FileDigit size={32} />
                 </div>
                 <p className="text-sm font-black text-slate-700 mb-1">Click to browse or drag .exe here</p>
                 <p className="text-xs text-slate-500 font-medium max-w-[250px]">
                   Must be a valid .exe Windows binary file.
                 </p>
                 <button className="mt-6 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-md">
                   Select File
                 </button>
               </>
             )}
           </div>
           
           {/* Current Active Release */}
           {activeRelease && (
             <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3">
                 <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wide">
                   <CheckCircle2 size={12} /> Live
                 </span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                   <Package size={24} />
                 </div>
                 <div>
                   <h5 className="text-sm font-black text-slate-900 truncate pr-16">{activeRelease.fileName}</h5>
                   <p className="text-xs text-slate-500 font-bold font-mono mt-0.5">Version: <span className="text-indigo-600">{activeRelease.version}</span></p>
                 </div>
               </div>
             </div>
           )}
        </div>

        {/* History Table */}
        <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Version History
            </h4>
          </div>
          <div className="overflow-x-auto flex-1 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <th className="p-3">Version</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Uploaded At</th>
                  <th className="p-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold">Loading history...</p>
                    </td>
                  </tr>
                ) : releases.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <Clock size={20} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold">No deployments found.</p>
                    </td>
                  </tr>
                ) : (
                  releases.map((release, idx) => (
                    <tr key={release.id} className={`hover:bg-slate-50 transition-colors ${idx === 0 ? 'bg-emerald-50/30' : ''}`}>
                      <td className="p-3">
                        <span className={`font-mono font-bold ${idx === 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                          {release.version}
                        </span>
                        {idx === 0 && <span className="ml-2 text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-black uppercase">Active</span>}
                      </td>
                      <td className="p-3 font-medium text-slate-600">{formatBytes(release.size || 0)}</td>
                      <td className="p-3 text-slate-500">
                        {release.timestamp?.toDate ? release.timestamp.toDate().toLocaleString() : 'Just now'}
                      </td>
                      <td className="p-3 text-right">
                        <a 
                          href={release.downloadUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Download this version"
                        >
                          <Download size={16} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
