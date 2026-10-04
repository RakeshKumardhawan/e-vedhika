import React, { useState, useEffect } from "react";
import { auth, storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata, deleteObject } from "firebase/storage";
import { supabase, SUPABASE_DEFAULT_BUCKET } from "../supabase";
import { Trash2, ExternalLink, HardDrive, File, Image as ImageIcon, Archive, FileText, FileCode2, Copy, RefreshCw, AlertCircle, Database } from "lucide-react";
import Swal from "sweetalert2";

interface StorageFile {
  key: string;
  size: number;
  lastModified: string;
  url: string;
  source: 'cloudflare' | 'firebase' | 'supabase';
}

interface Props {
  storageConfig: "cloudflare" | "firebase" | "supabase";
}

export const CloudStorageManager: React.FC<Props> = ({ storageConfig }) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      if (storageConfig === "cloudflare") {
        await new Promise(r => { const u = auth.onAuthStateChanged(user => { if (user) { u(); r(user); } }); setTimeout(() => { r(auth.currentUser); }, 1500); });
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/storage/files", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch files");
        
        setFiles((data.files || []).map((f: any) => ({
          ...f,
          source: 'cloudflare' as const
        })));
      } else if (storageConfig === "supabase") {
        // Supabase Storage Listing
        const { data: sbFiles, error: sbErr } = await supabase.storage
          .from(SUPABASE_DEFAULT_BUCKET)
          .list('uploads', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (sbErr) {
          // If default bucket doesn't exist, try public-uploads
          const { data: pubFiles, error: pubErr } = await supabase.storage
            .from('public-uploads')
            .list('uploads', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

          if (pubErr) throw new Error(sbErr.message);

          const mapped = (pubFiles || []).map((f) => {
            const { data } = supabase.storage.from('public-uploads').getPublicUrl(`uploads/${f.name}`);
            return {
              key: `uploads/${f.name}`,
              size: f.metadata?.size || 0,
              lastModified: f.created_at || new Date().toISOString(),
              url: data?.publicUrl || "",
              source: 'supabase' as const
            };
          });
          setFiles(mapped);
        } else {
          const mapped = (sbFiles || []).map((f) => {
            const { data } = supabase.storage.from(SUPABASE_DEFAULT_BUCKET).getPublicUrl(`uploads/${f.name}`);
            return {
              key: `uploads/${f.name}`,
              size: f.metadata?.size || 0,
              lastModified: f.created_at || new Date().toISOString(),
              url: data?.publicUrl || "",
              source: 'supabase' as const
            };
          });
          setFiles(mapped);
        }
      } else {
        // Firebase Storage Listing
        const listRef = ref(storage, 'uploads');
        const res = await listAll(listRef);
        
        const filePromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const meta = await getMetadata(itemRef);
          return {
            key: itemRef.fullPath,
            size: meta.size,
            lastModified: meta.timeCreated,
            url: url,
            source: 'firebase' as const
          };
        });
        
        const firebaseFiles = await Promise.all(filePromises);
        firebaseFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        setFiles(firebaseFiles);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [storageConfig]);

  const handleDelete = async (file: StorageFile) => {
    const res = await Swal.fire({
      title: "ఖచ్చితంగా తొలగించాలా?",
      text: "ఈ ఫైల్ శాశ్వతంగా తొలగించబడుతుంది!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "అవును, తొలగించండి (Delete)",
      cancelButtonText: "రద్దు (Cancel)",
      confirmButtonColor: "#ef4444"
    });

    if (res.isConfirmed) {
      try {
        if (file.source === 'cloudflare') {
          await new Promise(r => { const u = auth.onAuthStateChanged(user => { if (user) { u(); r(user); } }); setTimeout(() => { r(auth.currentUser); }, 1500); });
          const token = await auth.currentUser?.getIdToken();
          const response = await fetch("/api/storage/files", {
            method: "DELETE",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ key: file.key })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
        } else if (file.source === 'supabase') {
          await supabase.storage.from(SUPABASE_DEFAULT_BUCKET).remove([file.key]);
        } else {
          const fileRef = ref(storage, file.key);
          await deleteObject(fileRef);
        }
        
        setFiles(files.filter(f => f.key !== file.key));
        Swal.fire("విజయవంతం!", "ఫైల్ తొలగించబడింది.", "success");
      } catch (err: any) {
        Swal.fire("లోపం", err.message, "error");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'కాపీ అయింది!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <ImageIcon size={20} className="text-blue-500" />;
    if (['zip', 'rar', 'tar', 'gz', 'exe', 'msi'].includes(ext || '')) return <Archive size={20} className="text-amber-500" />;
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) return <FileText size={20} className="text-red-500" />;
    if (['js', 'jsx', 'ts', 'tsx', 'json', 'bat', 'sh'].includes(ext || '')) return <FileCode2 size={20} className="text-emerald-500" />;
    return <File size={20} className="text-slate-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f => f.key.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStorageDisplayName = () => {
    switch (storageConfig) {
      case 'cloudflare':
        return 'Cloudflare R2 (Global Edge)';
      case 'supabase':
        return 'Supabase Storage (3rd Fallback / PostgreSQL)';
      case 'firebase':
      default:
        return 'Firebase Storage (Hot)';
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden flex flex-col h-[750px] relative z-10 w-full max-w-[100%] mx-auto block" style={{width: "100%", display: "block"}}>
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HardDrive className="text-indigo-500" />
            Cloud Storage Manager
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Managing files in <span className="font-bold text-indigo-600">{getStorageDisplayName()}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 min-w-[200px]"
          />
          <button 
            onClick={fetchFiles}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50/50 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-indigo-500 space-y-3">
            <RefreshCw size={32} className="animate-spin" />
            <p className="text-sm font-bold text-slate-600">Loading files...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 p-6 text-center space-y-3">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-sm font-bold">{error}</p>
            <p className="text-xs text-slate-500">Storage provider: {getStorageDisplayName()}</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100/50 text-slate-500 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">File Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Provider</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Size</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Last Modified</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => (
                  <tr key={file.key} className="hover:bg-white transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.key)}
                        <span className="font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-[400px]">
                          {file.key.split('/').pop()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        file.source === 'cloudflare' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : file.source === 'supabase'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {file.source === 'cloudflare' ? 'Cloudflare R2' : file.source === 'supabase' ? 'Supabase' : 'Firebase'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {formatSize(file.size)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(file.lastModified).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyToClipboard(file.url)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy size={16} />
                        </button>
                        <a 
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View / Download"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button 
                          onClick={() => handleDelete(file)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete File"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredFiles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                      No files found in {getStorageDisplayName()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
