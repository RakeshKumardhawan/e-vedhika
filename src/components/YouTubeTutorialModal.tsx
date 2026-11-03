import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, PlayCircle, BookOpen, CheckCircle2, 
  Sparkles, Youtube, Edit3, Save, RotateCcw, Plus, Trash2, 
  Eye, AlertCircle, Check 
} from 'lucide-react';
import { ToolTutorial, parseYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../utils/youtube';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

interface YouTubeTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: ToolTutorial | null;
  isAdmin?: boolean;
}

export const YouTubeTutorialModal: React.FC<YouTubeTutorialModalProps> = ({
  isOpen,
  onClose,
  tutorial,
  isAdmin = false
}) => {
  const [currentTutorial, setCurrentTutorial] = useState<ToolTutorial | null>(tutorial);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputDescription, setInputDescription] = useState<string>('');
  const [inputSteps, setInputSteps] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (tutorial) {
      // Clean any legacy dummy links
      const cleanUrl = (tutorial.youtubeUrl && !tutorial.youtubeUrl.includes('dQw4w9WgXcQ')) 
        ? tutorial.youtubeUrl 
        : '';
      const cleanEmbed = (tutorial.embedUrl && !tutorial.embedUrl.includes('dQw4w9WgXcQ')) 
        ? tutorial.embedUrl 
        : parseYouTubeEmbedUrl(cleanUrl);

      const cleaned = {
        ...tutorial,
        youtubeUrl: cleanUrl,
        embedUrl: cleanEmbed
      };
      setCurrentTutorial(cleaned);
      setInputUrl(cleanUrl);
      setInputDescription(tutorial.description || '');
      setInputSteps((tutorial.steps || []).join('\n'));
      setIsEditing(false);
    }
  }, [tutorial, isOpen]);

  if (!isOpen || !currentTutorial) return null;

  const embedUrl = parseYouTubeEmbedUrl(currentTutorial.youtubeUrl || currentTutorial.embedUrl);
  const thumbnailUrl = getYouTubeThumbnailUrl(currentTutorial.youtubeUrl || currentTutorial.embedUrl);
  const previewEmbedUrl = parseYouTubeEmbedUrl(inputUrl);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentTutorial) return;

    setIsSaving(true);
    try {
      const cleanEmbed = parseYouTubeEmbedUrl(inputUrl);
      const stepsArr = inputSteps
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const finalSteps = stepsArr.length > 0 
        ? stepsArr 
        : (Array.isArray(currentTutorial.steps) ? currentTutorial.steps : []);

      const finalDescription = (inputDescription.trim() || currentTutorial.description || '').trim();

      const updatedTutorial: ToolTutorial = {
        id: String(currentTutorial.id || 'tool'),
        toolName: String(currentTutorial.toolName || 'టూల్ ట్యుటోరియల్'),
        category: String(currentTutorial.category || 'వీడియో ట్యుటోరియల్'),
        youtubeUrl: inputUrl.trim(),
        embedUrl: cleanEmbed,
        description: finalDescription,
        steps: finalSteps,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to Firestore if available
      if (db) {
        await setDoc(doc(db, 'tool_tutorials', updatedTutorial.id), updatedTutorial).catch((err) => {
          console.warn('Firestore tutorial save warning (persisting locally):', err);
        });
      }

      // 2. Broadcast update to App and other views
      window.dispatchEvent(new CustomEvent('tutorial-updated', { detail: updatedTutorial }));

      // 3. Update local state
      setCurrentTutorial(updatedTutorial);
      setIsEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'లింక్ సేవ్ చేయబడింది!',
        text: `${updatedTutorial.toolName} కి యూట్యూబ్ వీడియో విజయవంతంగా జతచేయబడింది.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'సేవ్ చేయడంలో లోపం',
        text: err?.message || 'దయచేసి మళ్లీ ప్రయత్నించండి.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLink = async () => {
    const res = await Swal.fire({
      title: 'వీడియో లింక్ తొలగించాలా?',
      text: 'ఈ టూల్ నుండి ప్రస్తుత యూట్యూబ్ వీడియో లింక్ తొలగించబడుతుంది.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'అవును, తొలగించు',
      cancelButtonText: 'రద్దు'
    });

    if (res.isConfirmed) {
      setInputUrl('');
      const finalSteps = Array.isArray(currentTutorial.steps) ? currentTutorial.steps : [];
      const updatedTutorial: ToolTutorial = {
        id: String(currentTutorial.id || 'tool'),
        toolName: String(currentTutorial.toolName || 'టూల్ ట్యుటోరియల్'),
        category: String(currentTutorial.category || 'వీడియో ట్యుటోరియల్'),
        youtubeUrl: '',
        embedUrl: '',
        description: String(currentTutorial.description || ''),
        steps: finalSteps,
        updatedAt: new Date().toISOString()
      };

      if (db) {
        await setDoc(doc(db, 'tool_tutorials', updatedTutorial.id), updatedTutorial).catch(() => {});
      }
      window.dispatchEvent(new CustomEvent('tutorial-updated', { detail: updatedTutorial }));
      setCurrentTutorial(updatedTutorial);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'వీడియో లింక్ తొలగించబడింది',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[85vh] my-auto overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3 pr-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
              <Youtube className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-medium">
                  {currentTutorial.category || 'వీడియో ట్యుటోరియల్'}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">E-VEDHIKA Guide</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 leading-snug truncate">
                {currentTutorial.toolName}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Admin Direct Edit Button in Modal Header */}
            {isAdmin && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
                title="వీడియో లింక్ ఎడిట్ చేయండి"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ఎడిట్ లింక్</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50 cursor-pointer"
              title="మూసివేయి (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* EDIT FORM (Visible when Admin clicks "Edit Link" or "Add Video Link") */}
          {isEditing ? (
            <div className="bg-slate-800/60 border border-amber-500/40 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                  <Edit3 className="w-5 h-5" />
                  <span>యూట్యూబ్ ట్యుటోరియల్ లింక్ అమర్చండి (Manage Video Link)</span>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  రద్దు చేయి (Cancel)
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    యూట్యూబ్ వీడియో URL (YouTube Video Link) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... లేదా https://youtu.be/..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 pr-10"
                      required
                    />
                    <Youtube className="w-5 h-5 text-red-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    YouTube సాధారణ లింక్, షేర్ లింక్ (youtu.be) లేదా Shorts లింక్ ఏదైనా ఇక్కడ పేస్ట్ చేయవచ్చు.
                  </p>
                </div>

                {/* Live Preview Box */}
                {inputUrl.trim() && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      లైవ్ వీడియో ప్రివ్యూ (Live Preview):
                    </span>
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-700">
                      {previewEmbedUrl ? (
                        <iframe
                          src={`${previewEmbedUrl}?rel=0`}
                          title="Preview"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                          చెల్లుబాటు అయ్యే YouTube URL నమోదు చేయండి.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    టూల్ వివరణ (Description - ఐచ్ఛికం)
                  </label>
                  <textarea
                    rows={2}
                    value={inputDescription}
                    onChange={(e) => setInputDescription(e.target.value)}
                    placeholder="టూల్ గురించి మరియు వీడియోలో వివరించిన ముఖ్య విషయాలు..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Steps */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    ముఖ్యమైన దశలు / Steps (ఒక్కో లైన్‌లో ఒక్కో స్టెప్ రాయండి)
                  </label>
                  <textarea
                    rows={3}
                    value={inputSteps}
                    onChange={(e) => setInputSteps(e.target.value)}
                    placeholder="1. ఫైల్ అప్‌లోడ్ చేయండి&#10;2. వివరాలు సరిచూసుకోండి&#10;3. రిపోర్ట్ డౌన్‌లోడ్ చేసుకోండి"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                  {currentTutorial.youtubeUrl ? (
                    <button
                      type="button"
                      onClick={handleRemoveLink}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>లింక్ తీసివేయి</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      రద్దు (Cancel)
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'భద్రపరుస్తోంది...' : 'సేవ్ చేయండి (Save Link)'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* REGULAR VIEW MODE */
            <>
              {/* Video Player or Empty State */}
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
                {embedUrl ? (
                  <iframe
                    src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
                    title={currentTutorial.toolName}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300 p-6 text-center">
                    <div className="p-4 rounded-full bg-red-600/15 border border-red-500/30 text-red-500 mb-3 shadow-inner">
                      <Youtube className="w-12 h-12" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                      ఈ టూల్‌కు ఇంకా ట్యుటోరియల్ వీడియో లింక్ చేయబడలేదు
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
                      అడ్మిన్ ద్వారా సంబంధిత YouTube వీడియోను లింక్ చేసిన తర్వాత ఇక్కడ నేరుగా వీక్షించవచ్చు.
                    </p>

                    {isAdmin ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ఇక్కడే YouTube వీడియో లింక్ జోడించండి (Add Video)</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/50">
                        త్వరలోనే వీడియో అందుబాటులోకి వస్తుంది
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ఈ ట్యుటోరియల్ ద్వారా టూల్ వినియోగం సులభంగా అర్థమవుతుంది.</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{currentTutorial.youtubeUrl ? 'వీడియో మార్చు' : 'వీడియో జోడించు'}</span>
                    </button>
                  )}

                  {currentTutorial.youtubeUrl && (
                    <a
                      href={currentTutorial.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg transition-all shadow-md shadow-red-900/30"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>యూట్యూబ్‌లో ఓపెన్ చేయి</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tutorial Details & Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      వివరణ (Description)
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentTutorial.description || 'ఈ టూల్ ఎలా ఉపయోగించాలో స్పష్టంగా తెలుసుకోవడానికి ఈ మార్గదర్శకాలు సహాయపడతాయి.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      ముఖ్యమైన దశలు (Steps)
                    </h4>
                    {currentTutorial.steps && currentTutorial.steps.length > 0 ? (
                      <ul className="space-y-2.5">
                        {currentTutorial.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/50 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="mt-0.5">{step}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">వీడియో ఆధారంగా మార్గదర్శకాలు చూడగలరు.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isAdmin && <span className="text-amber-400 font-medium">★ అడ్మిన్ యాక్సెస్ యాక్టివ్‌గా ఉంది</span>}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
