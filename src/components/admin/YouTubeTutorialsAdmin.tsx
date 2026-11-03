import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  RotateCcw, 
  Check, 
  Search, 
  ExternalLink,
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { db } from '../../../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ToolTutorial, DEFAULT_TOOL_TUTORIALS, parseYouTubeEmbedUrl } from '../../utils/youtube';

export const YouTubeTutorialsAdmin: React.FC = () => {
  const [tutorials, setTutorials] = useState<ToolTutorial[]>(DEFAULT_TOOL_TUTORIALS);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<ToolTutorial | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Load from Firestore or use defaults
  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, 'tool_tutorials'));
        if (!querySnapshot.empty) {
          const loaded: ToolTutorial[] = [];
          querySnapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as ToolTutorial);
          });
          
          // Merge with default list for any missing tool keys
          const merged = [...DEFAULT_TOOL_TUTORIALS];
          loaded.forEach((item) => {
            const index = merged.findIndex((d) => d.id === item.id);
            if (index !== -1) {
              merged[index] = { ...merged[index], ...item };
            } else {
              merged.push(item);
            }
          });
          setTutorials(merged);
        } else {
          setTutorials(DEFAULT_TOOL_TUTORIALS);
        }
      } else {
        setTutorials(DEFAULT_TOOL_TUTORIALS);
      }
    } catch (err) {
      console.warn('Firestore tutorials fetch failed, using default tutorials:', err);
      setTutorials(DEFAULT_TOOL_TUTORIALS);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (itemToSave: ToolTutorial) => {
    const embed = parseYouTubeEmbedUrl(itemToSave.youtubeUrl);
    const updatedItem: ToolTutorial = {
      id: String(itemToSave.id || 'tool'),
      toolName: String(itemToSave.toolName || 'టూల్ ట్యుటోరియల్'),
      category: String(itemToSave.category || 'టూల్స్'),
      youtubeUrl: String(itemToSave.youtubeUrl || '').trim(),
      embedUrl: String(embed || '').trim(),
      description: String(itemToSave.description || '').trim(),
      steps: Array.isArray(itemToSave.steps) ? itemToSave.steps : [],
      updatedAt: new Date().toISOString()
    };

    // Update local state
    const newTutorials = tutorials.map((t) => (t.id === updatedItem.id ? updatedItem : t));
    if (!tutorials.some((t) => t.id === updatedItem.id)) {
      newTutorials.push(updatedItem);
    }
    setTutorials(newTutorials);
    setEditingItem(null);

    // Broadcast update across the application
    window.dispatchEvent(new CustomEvent('tutorial-updated', { detail: updatedItem }));

    // Save to Firestore if available
    try {
      if (db) {
        await setDoc(doc(db, 'tool_tutorials', updatedItem.id), updatedItem);
        showMessage('success', `${updatedItem.toolName} ట్యుటోరియల్ భద్రపరచబడింది!`);
      } else {
        showMessage('info', 'లోకల్ సేవ్ పూర్తయింది.');
      }
    } catch (err) {
      console.error('Save to firestore failed:', err);
      showMessage('error', 'Firestore సేవ్ చేయడంలో సమస్య వచ్చింది.');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`మీరు నిశ్చయంగా "${name}" ట్యుటోరియల్ లింక్ ని తొలగించాలనుకుంటున్నారా?`)) return;

    const filtered = tutorials.filter((t) => t.id !== id);
    setTutorials(filtered);

    try {
      if (db) {
        await deleteDoc(doc(db, 'tool_tutorials', id));
        showMessage('success', 'ట్యుటోరియల్ తొలగించబడింది.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('అన్ని యూట్యూబ్ ట్యుటోరియల్ లింక్‌లను డిఫాల్ట్ స్థితికి రీసెట్ చేయాలనుకుంటున్నారా?')) return;
    setTutorials(DEFAULT_TOOL_TUTORIALS);
    try {
      if (db) {
        for (const item of DEFAULT_TOOL_TUTORIALS) {
          await setDoc(doc(db, 'tool_tutorials', item.id), item);
        }
      }
      showMessage('success', 'అన్ని ట్యుటోరియల్స్ డిఫాల్ట్‌కి పునరుద్ధరించబడ్డాయి.');
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const categories = Array.from(new Set(tutorials.map((t) => t.category).filter(Boolean)));

  const filteredTutorials = tutorials.filter((t) => {
    const matchesSearch = 
      t.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 rounded-2xl border border-red-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40">
              <Youtube className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">అడ్మిన్ మేనేజర్</span>
          </div>
          <h2 className="text-2xl font-bold text-white">టూల్ యూట్యూబ్ ట్యుటోరియల్స్ మేనేజ్‌మెంట్</h2>
          <p className="text-sm text-slate-300 mt-1">
            వెబ్‌సైట్‌లోని అన్ని టూల్స్ వద్ద కనిపించే "వాచ్ ట్యుటోరియల్" యూట్యూబ్ వీడియో లింక్‌లను మరియు వర్ణనలను నిర్వహించండి.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
            title="డిఫాల్ట్‌కి రీసెట్ చేయి"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>రీసెట్</span>
          </button>

          <button
            onClick={() =>
              setEditingItem({
                id: `tool_${Date.now()}`,
                toolName: 'కొత్త టూల్ ట్యుటోరియల్',
                category: 'సాధారణ',
                youtubeUrl: '',
                embedUrl: '',
                description: 'ఈ కొత్త టూల్ ఉపయోగించే విధానం.',
                steps: ['పద్ధతి 1', 'పద్ధతి 2']
              })
            }
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>కొత్త ట్యుటోరియల్ జోడించు</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
            : statusMessage.type === 'error'
            ? 'bg-red-950/60 border-red-500/40 text-red-300'
            : 'bg-blue-950/60 border-blue-500/40 text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="టూల్ పేరు లేదా ID తో వెతకండి..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 shrink-0">కేటగిరీ:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            అన్ని ({tutorials.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Form Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base">ట్యుటోరియల్ ఎడిట్ చేయండి ({editingItem.toolName})</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">టూల్ కీ ID (Unique Identifier)</label>
                <input
                  type="text"
                  value={editingItem.id}
                  onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">టూల్ పేరు (Tool Name)</label>
                <input
                  type="text"
                  value={editingItem.toolName}
                  onChange={(e) => setEditingItem({ ...editingItem, toolName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">కేటగిరీ (Category)</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">యూట్యూబ్ URL (Watch/Share/Shorts Link)</label>
                  <input
                    type="text"
                    value={editingItem.youtubeUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-red-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">వివరణ (Description)</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">ముఖ్యమైన మార్గదర్శక సూత్రాలు (పాయింట్ పరంగా కామాలతో ఇవ్వండి)</label>
                <input
                  type="text"
                  value={editingItem.steps ? editingItem.steps.join(', ') : ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      steps: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="దశ 1, దశ 2, దశ 3"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              {/* Video Preview */}
              {editingItem.youtubeUrl && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-medium">వీడియో ముందస్తు వీక్షణం (Embed Live Preview):</span>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-800">
                    <iframe
                      src={parseYouTubeEmbedUrl(editingItem.youtubeUrl)}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                రద్దు చేయి
              </button>
              <button
                onClick={() => handleSaveItem(editingItem)}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>సేవ్ చేయి (Save Tutorial)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Preview Modal for quick test */}
      {previewUrl && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-full max-w-3xl space-y-3">
            <div className="flex justify-between items-center text-white">
              <h4 className="font-bold text-sm">లైవ్ వీడియో ప్రివ్యూ</h4>
              <button onClick={() => setPreviewUrl(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe src={parseYouTubeEmbedUrl(previewUrl)} className="w-full h-full border-0" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* Tutorials Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Youtube className="w-8 h-8 animate-bounce mx-auto text-red-500 mb-2" />
            <span>ట్యుటోరియల్స్ లోడ్ అవుతున్నాయి...</span>
          </div>
        ) : filteredTutorials.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <span>ఎటువంటి ట్యుటోరియల్ ఫైల్ లభించలేదు.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">టూల్ & కేటగిరీ</th>
                  <th className="px-4 py-3.5">యూట్యూబ్ లింక్</th>
                  <th className="px-4 py-3.5">వివరణ</th>
                  <th className="px-4 py-3.5 text-right">చర్యలు (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTutorials.map((tut) => (
                  <tr key={tut.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{tut.toolName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                          {tut.id}
                        </span>
                        <span className="text-[11px] text-red-400 font-medium">
                          {tut.category}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 max-w-xs truncate text-xs text-red-300">
                        <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="truncate">{tut.youtubeUrl}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-sm">
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {tut.description || 'వివరణ ఇవ్వబడలేదు.'}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewUrl(tut.youtubeUrl)}
                          className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                          title="ప్రివ్యూ చూడండి"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(tut)}
                          className="p-2 text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 rounded-lg border border-blue-800/40 transition-all"
                          title="సవరించండి (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(tut.id, tut.toolName)}
                          className="p-2 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 rounded-lg border border-red-800/40 transition-all"
                          title="తొలగించండి"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
