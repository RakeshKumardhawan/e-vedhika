import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Settings, Download, Trash2, CheckCircle2, ChevronRight, FileDown, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

// Set worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface FileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  status: 'pending' | 'compressing' | 'done' | 'error';
  progress: number;
}

export const PdfCompressTool: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<number>(60); // 0-100
  const [isCompressingAll, setIsCompressingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLevelChange = (level: number) => {
    setCompressionLevel(level);
    // Reset any 'done' or 'error' files so they can be re-compressed with the new level
    setFiles(prev => prev.map(f => {
      if (f.status === 'done' || f.status === 'error') {
        return { ...f, status: 'pending', progress: 0, compressedSize: undefined, compressedBlob: undefined };
      }
      return f;
    }));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        originalSize: file.size,
        status: 'pending' as const,
        progress: 0,
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
        .filter(file => file.type === 'application/pdf')
        .map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          originalSize: file.size,
          status: 'pending' as const,
          progress: 0,
        }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const compressSinglePDF = async (item: FileItem) => {
    setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'compressing', progress: 10 } : f));
    
    try {
      const arrayBuffer = await item.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      const pdfOut = new jsPDF('p', 'pt', 'a4');
      
      // Calculate quality and scale based on compressionLevel (0-100)
      // 100 = max compression (lowest quality), 0 = min compression (highest quality)
      // We will map 0-100 to quality 1.0 to 0.3
      const quality = Math.max(0.2, 1.0 - (compressionLevel / 100) * 0.8);
      const scale = compressionLevel > 75 ? 1.0 : (compressionLevel > 40 ? 1.5 : 2.0);

      for (let i = 1; i <= numPages; i++) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: 10 + Math.floor((i / numPages) * 80) } : f));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: ctx, viewport } as any).promise;
        const imgData = canvas.toDataURL('image/jpeg', quality);
        
        const pdfWidth = pdfOut.internal.pageSize.getWidth();
        const pdfHeight = (viewport.height * pdfWidth) / viewport.width;
        
        if (i > 1) pdfOut.addPage();
        pdfOut.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      const outBlob = pdfOut.output('blob');
      
      setFiles(prev => prev.map(f => f.id === item.id ? { 
        ...f, 
        status: 'done', 
        progress: 100,
        compressedSize: outBlob.size,
        compressedBlob: outBlob
      } : f));
      
    } catch (error) {
      console.error(error);
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', progress: 0 } : f));
    }
  };

  const compressAll = async () => {
    setIsCompressingAll(true);
    for (const file of files) {
      if (file.status !== 'compressing') {
        await compressSinglePDF(file);
      }
    }
    setIsCompressingAll(false);
  };

  const downloadFile = (item: FileItem) => {
    if (!item.compressedBlob) return;
    const url = URL.createObjectURL(item.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${item.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllZip = async () => {
    const zip = new JSZip();
    const doneFiles = files.filter(f => f.status === 'done' && f.compressedBlob);
    
    if (doneFiles.length === 0) return;
    
    doneFiles.forEach(file => {
      zip.file(`compressed_${file.name}`, file.compressedBlob!);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_pdfs.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileDown className="text-blue-600" size={32} />
            Compress PDF
          </h1>
          <p className="text-slate-500 font-medium mt-1">Compress PDF file to get the same PDF quality but less filesize.</p>
        </div>
      </div>

      {files.length === 0 ? (
        <div 
          className="bg-white border-2 border-dashed border-blue-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[400px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="text-blue-500" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Select PDF files</h2>
          <p className="text-slate-500 mb-8 max-w-md">or drop PDFs here</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg shadow-blue-200 transition-all active:scale-95">
            Select PDF files
          </button>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="application/pdf"
            multiple
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Workspace */}
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Selected Files ({files.length})</h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
              >
                + Add more files
              </button>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="application/pdf"
                multiple
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {files.map(file => (
                <div key={file.id} className="border border-slate-200 rounded-2xl p-4 relative group hover:border-blue-300 transition-colors bg-slate-50">
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="text-red-500" size={24} />
                    </div>
                    <div className="overflow-hidden w-full">
                      <p className="font-bold text-slate-700 truncate text-sm" title={file.name}>{file.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{formatSize(file.originalSize)}</p>
                      
                      {file.status === 'done' && file.compressedSize && (
                        <div className="mt-2 text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded-md">
                          New size: {formatSize(file.compressedSize)} 
                          <span className="text-green-500 ml-1">
                            (-{Math.round((1 - file.compressedSize / file.originalSize) * 100)}%)
                          </span>
                        </div>
                      )}
                      
                      {file.status === 'compressing' && (
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {file.status === 'done' && (
                    <button 
                      onClick={() => downloadFile(file)}
                      className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Download size={14} /> Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar / Settings */}
          <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-slate-500" />
                Compression Level
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Level: {compressionLevel}%</span>
                    <span className="text-xs font-medium text-slate-500">
                      {compressionLevel >= 80 ? 'Max (Smallest Size)' : compressionLevel <= 40 ? 'Less (High Quality)' : 'Recommended'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={compressionLevel} 
                    onChange={(e) => handleLevelChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    disabled={isCompressingAll || files.some(f => f.status === 'compressing')}
                  />
                  
                  {/* Quick preset buttons */}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleLevelChange(40)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold border transition-colors ${compressionLevel === 40 ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Good Quality<br/><span className="text-[9px] font-medium opacity-80">(~40%)</span>
                    </button>
                    <button 
                      onClick={() => handleLevelChange(65)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold border transition-colors ${compressionLevel === 65 ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                    >
                      Recommended<br/><span className="text-[9px] font-medium opacity-80">(~65%)</span>
                    </button>
                    <button 
                      onClick={() => handleLevelChange(85)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold border transition-colors ${compressionLevel === 85 ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                    >
                      Extreme (250KB)<br/><span className="text-[9px] font-medium opacity-80">(~85%)</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-4 font-medium leading-relaxed">
                    Higher compression reduces file size significantly but may reduce document quality. Target ~250KB usually needs Extreme (85%) level.
                  </p>
                </div>
                
                <button 
                  onClick={compressAll}
                  disabled={isCompressingAll || files.some(f => f.status === 'compressing')}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
                >
                  {isCompressingAll ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Compressing...
                    </>
                  ) : (
                    <>
                      Compress PDF <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {files.some(f => f.status === 'done') && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Done!</h3>
                <button 
                  onClick={downloadAllZip}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Download size={18} /> Download ZIP
                </button>
                <button 
                  onClick={() => setFiles([])}
                  className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
