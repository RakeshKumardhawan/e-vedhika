import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Send,
  Database
} from 'lucide-react';
import { BackupSnapshot } from '../types';
import { TelegramNotificationCard } from './TelegramNotificationCard';

interface BackupsViewProps {
  snapshots: BackupSnapshot[];
  onCreateSnapshot: (title: string, notes: string) => void;
  onRestoreSnapshot: (snapshotId: string) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  isRestoring: boolean;
}

export const BackupsView: React.FC<BackupsViewProps> = ({
  snapshots,
  onCreateSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  isRestoring,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'snapshots' | 'telegram'>('snapshots');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 🚀 Navigation Tabs Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Database & Control Center</h2>
            <p className="text-xs text-slate-500 font-medium">Registry Snapshots & Telegram Notification Gateway</p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button 
            onClick={() => setSelectedTab('snapshots')} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedTab === 'snapshots' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" /> 1. Registry Snapshots ({snapshots.length})
          </button>
          <button 
            onClick={() => setSelectedTab('telegram')} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedTab === 'telegram' 
                ? 'bg-white text-sky-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> 2. Telegram API
          </button>
        </div>
      </div>

      {selectedTab === 'telegram' && <TelegramNotificationCard />}

      {selectedTab === 'snapshots' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" /> Local Registry Snapshots
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">సిస్టమ్ డేటాబేస్ పునరుద్ధరణ పాయింట్లు మరియు బ్యాకప్‌లు</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 w-fit"
            >
              + Create Restore Point
            </button>
          </div>

          {snapshots.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <History className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">ఇప్పటివరకు ఎలాంటి రీస్టోర్ పాయింట్స్ సృష్టించలేదు.</p>
              <p className="text-xs text-slate-400 mt-1">కొత్త రికార్డును సేవ్ చేయడానికి పైన ఉన్న బటన్ క్లిక్ చేయండి.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {snapshots.map((snap) => (
                <div key={snap.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{snap.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{snap.notes || 'వివరాలు లేవు'}</p>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">ID: {snap.id}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => onRestoreSnapshot(snap.id)} 
                      disabled={isRestoring}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all disabled:opacity-50"
                    >
                      {isRestoring ? 'RESTORE...' : 'RESTORE'}
                    </button>
                    <button 
                      onClick={() => onDeleteSnapshot(snap.id)} 
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Snapshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full space-y-6">
            <h3 className="text-xl font-black text-slate-900">Create Restore Point</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Title / శీర్షిక</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  className="w-full p-3 rounded-2xl border border-slate-200 outline-none text-xs focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g. Pre-Update Backup" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Notes / వివరణ</label>
                <textarea 
                  value={newNotes} 
                  onChange={(e) => setNewNotes(e.target.value)} 
                  className="w-full p-3 rounded-2xl border border-slate-200 outline-none text-xs focus:ring-2 focus:ring-indigo-500 h-24" 
                  placeholder="వివరణ లేదా గమనికలు రాయండి..." 
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-xs text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  if (newTitle.trim()) {
                    onCreateSnapshot(newTitle, newNotes); 
                    setShowCreateModal(false); 
                    setNewTitle('');
                    setNewNotes('');
                  }
                }} 
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-md shadow-indigo-500/20 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
