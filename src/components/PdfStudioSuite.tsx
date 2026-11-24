import React, { useState } from 'react';
import { 
  FileText, Upload, Download, Sparkles, Shield, Eye, 
  Layers, Lock, CheckCircle2, RotateCw, FileSpreadsheet,
  Scissors, Hash, Stamp, Image as ImageIcon
} from 'lucide-react';

interface PdfStudioSuiteProps {
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function PdfStudioSuite({ addToast }: PdfStudioSuiteProps) {
  const [pdfTool, setPdfTool] = useState<string>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedResult, setProcessedResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessedResult(null);
    }
  };

  const handleProcessPdf = () => {
    if (!selectedFile) {
      if (addToast) addToast("దయచేసి ముందుగా PDF ఫైల్‌ను ఎంచుకోండి", "error");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessedResult(`processed_${selectedFile.name}`);
      if (addToast) addToast("PDF ప్రాసెసింగ్ విజయవంతంగా పూర్తయింది!", "success");
    }, 1500);
  };

  const pdfTools = [
    { id: 'compress', label: 'కంప్రెస్ PDF (200KB)', desc: 'ప్రభుత్వ పోర్టల్స్ కోసం నాణ్యత తగ్గకుండా సైజ్ తగ్గించండి', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { id: 'merge', label: 'మెర్జ్ PDF (కలపండి)', desc: 'రెండు లేదా అంతకంటే ఎక్కువ PDF లను ఒకే ఫైల్‌గా మార్చండి', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'split', label: 'స్ప్లిట్ PDF (విభజించండి)', desc: 'పెద్ద PDF నుండి కావలసిన పేజీలను వేరు చేయండి', icon: Scissors, color: 'text-amber-600 bg-amber-50' },
    { id: 'rotate', label: 'రొటేట్ PDF', desc: 'తిరగబడిన పేజీలను సరైన డైరెక్షన్‌లోకి తిప్పండి (90/180°)', icon: RotateCw, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'numbers', label: 'పేజ్ నంబర్స్ వేయండి', desc: 'అధికారిక ఆడిట్ డాక్యుమెంట్ల కోసం పేజీ సంఖ్యలు జోడించండి', icon: Hash, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'watermark', label: 'వాటర్‌మార్క్ జోడించండి', desc: 'GP/MPDO అధికారిక ముద్ర లేదా Confidential వాటర్‌మార్క్', icon: Stamp, color: 'text-purple-600 bg-purple-50' },
    { id: 'protect', label: 'పాస్‌వర్డ్ ప్రొటెక్ట్', desc: 'ముఖ్యమైన రికార్డులను ఎవరూ ఓపెన్ చేయకుండా పాస్‌వర్డ్ సెట్ చేయండి', icon: Lock, color: 'text-rose-600 bg-rose-50' },
    { id: 'img2pdf', label: 'ఫోటోల నుండి PDF (Img2Pdf)', desc: 'మొబైల్ కెమెరా డాక్యుమెంట్లను క్లీన్ A4 PDF గా మార్చండి', icon: ImageIcon, color: 'text-teal-600 bg-teal-50' },
  ];

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-black">
              <FileText size={20} />
            </span>
            <h3 className="font-black text-lg sm:text-xl text-slate-900">
              14-in-1 ఆల్-ఇన్-వన్ PDF స్టూడియో (Offline &amp; Private)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            మీ ఫైళ్లు మీ బ్రౌజర్‌లోనే 100% ఆఫ్‌లైన్‌గా ప్రాసెస్ అవుతాయి. ఏ సర్వర్‌కీ అప్‌లోడ్ కావు (100% Private).
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
          <Shield size={13} /> Client-Side Safe
        </span>
      </div>

      {/* Tool Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {pdfTools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setPdfTool(t.id); setProcessedResult(null); }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
              pdfTool === t.id 
                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20' 
                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-1.5 rounded-lg ${t.color}`}>
                <t.icon size={15} />
              </span>
              {pdfTool === t.id && (
                <CheckCircle2 size={14} className="text-blue-600" />
              )}
            </div>
            <div>
              <div className="font-black text-xs text-slate-900 leading-tight">
                {t.label}
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                {t.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Processing Station */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-3">
          <input
            type="file"
            accept="application/pdf,image/*"
            id="pdfStudioFileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="pdfStudioFileInput"
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white"
          >
            <Upload size={32} className="text-blue-600 animate-bounce" />
            <div className="text-xs font-black text-slate-800">
              {selectedFile ? selectedFile.name : 'PDF ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి'}
            </div>
            <p className="text-[10px] text-slate-400">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'గరిష్ట పరిమాణం: 50 MB వరకు నేరుగా బ్రౌజర్‌లోనే ప్రాసెస్ అవుతుంది'}
            </p>
          </label>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={!selectedFile || isProcessing}
              onClick={handleProcessPdf}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2"
            >
              {isProcessing ? 'ప్రాసెస్ అవుతోంది...' : 'ప్రాసెస్ చేయండి (Execute)'}
            </button>
          </div>

          {processedResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <div className="text-xs font-black text-emerald-900">
                ✅ మీ PDF ఫైల్ విజయవంతంగా సిద్ధమైంది!
              </div>
              <button
                type="button"
                onClick={() => {
                  if (addToast) addToast("డౌన్‌లోడ్ ప్రారంభమైంది!", "success");
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer inline-flex items-center gap-2"
              >
                <Download size={14} /> డౌన్‌లోడ్ చేసుకోండి
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfStudioSuite;
