import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Key, MessageSquare, Bot, HelpCircle, Copy, Check } from 'lucide-react';

interface TelegramConfig {
  hasBotToken: boolean;
  botTokenMasked: string;
  chatId: string;
  autoNotifyOnTelemetry: boolean;
}

interface TelegramNotificationCardProps {
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export function TelegramNotificationCard({ addToast }: TelegramNotificationCardProps) {
  const [config, setConfig] = useState<TelegramConfig>({
    hasBotToken: false,
    botTokenMasked: '',
    chatId: '',
    autoNotifyOnTelemetry: true
  });

  const [inputBotToken, setInputBotToken] = useState('');
  const [inputChatId, setInputChatId] = useState('');
  const [autoNotify, setAutoNotify] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [pcFilters, setPcFilters] = useState<{ blockedPcs: string[]; allPcs: any[] }>({ blockedPcs: [], allPcs: [] });

  const fetchConfig = async () => {
    try {
      const resp = await fetch('/api/telegram-config');
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setConfig(data);
          setInputChatId(data.chatId || '');
          setAutoNotify(data.autoNotifyOnTelemetry !== false);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch Telegram config:', e);
    }
  };

  const fetchPcFilters = async () => {
    try {
      const resp = await fetch('/api/telegram-pc-filters');
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setPcFilters(data);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchConfig();
    fetchPcFilters();
  }, []);

  const handleTogglePcBlock = async (pcKey: string, isCurrentlyBlocked: boolean) => {
    const action = isCurrentlyBlocked ? 'allow' : 'block';
    try {
      const resp = await fetch('/api/telegram-pc-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pcKey, action })
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        const msg = `✅ PC ${pcKey} successfully ${action === 'block' ? 'blocked / muted' : 'allowed'} for Telegram alerts.`;
        setStatusMsg({ type: 'success', text: msg });
        if (addToast) addToast(msg, "success");
        fetchPcFilters();
      }
    } catch (e: any) {
      const errMsg = e.message || 'Failed to update PC filter.';
      setStatusMsg({ type: 'error', text: errMsg });
      if (addToast) addToast(errMsg, "error");
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setStatusMsg(null);
    try {
      const resp = await fetch('/api/telegram-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: inputBotToken ? inputBotToken.trim() : undefined,
          chatId: inputChatId.trim(),
          autoNotifyOnTelemetry: autoNotify
        })
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        const msg = '✅ Telegram Bot configuration saved successfully!';
        setStatusMsg({ type: 'success', text: msg });
        if (addToast) addToast(msg, "success");
        setInputBotToken('');
        fetchConfig();
      } else {
        const errMsg = data.error || 'Failed to save configuration.';
        setStatusMsg({ type: 'error', text: errMsg });
        if (addToast) addToast(errMsg, "error");
      }
    } catch (e: any) {
      const errMsg = e.message || 'Server error while saving.';
      setStatusMsg({ type: 'error', text: errMsg });
      if (addToast) addToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestAlert = async () => {
    setIsSendingTest(true);
    setStatusMsg(null);
    try {
      const resp = await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🛡️ <b>E-VEDHIKA CENTRAL TELEMETRY TEST</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `✅ <b>Status:</b> Telegram Gateway is Live & Connected!\n` +
            `🌐 <b>Portal:</b> www.e-vedhika.in\n`,
          botToken: inputBotToken.trim() || undefined,
          chatId: inputChatId.trim() || undefined
        })
      });
      const data = await resp.json();
      if (resp.ok && (data.success || data.ok)) {
        const msg = '🚀 Telegram Test message delivered successfully!';
        setStatusMsg({ type: 'success', text: msg });
        if (addToast) addToast(msg, "success");
      } else {
        const errMsg = data.error || 'Failed to dispatch Telegram message.';
        setStatusMsg({ type: 'error', text: errMsg });
        if (addToast) addToast(errMsg, "error");
      }
    } catch (e: any) {
      const errMsg = e.message || 'Network error sending message.';
      setStatusMsg({ type: 'error', text: errMsg });
      if (addToast) addToast(errMsg, "error");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div id="telegram-reports-gateway-card" className="bg-white rounded-[32px] border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-200 shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              ✈️ Telegram Live Telemetry & Diagnostic Reports Gateway
            </h3>
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
              config.hasBotToken && config.chatId
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {config.hasBotToken && config.chatId ? '🟢 Telegram Active' : '⚪ Setup Required'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-13">
            Configure Telegram Bot credentials, automated live telemetry forwarding, and individual PC muting rules.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl text-xs font-bold border ${statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Telegram Bot Token</label>
            <input
              type="password"
              value={inputBotToken}
              onChange={(e) => setInputBotToken(e.target.value)}
              placeholder={config.botTokenMasked ? `Configured (${config.botTokenMasked}) - enter new to update` : "e.g. 7123456789:AAHkL1v-XYZ"}
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Telegram Chat ID</label>
            <input
              type="text"
              value={inputChatId}
              onChange={(e) => setInputChatId(e.target.value)}
              placeholder="e.g. 431228008"
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-slate-900 block uppercase">Auto-Forward Live Telemetry Reports</span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Turn automatic Telegram alerts ON or OFF instantly from this switch.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotify}
                onChange={(e) => setAutoNotify(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all shadow-md shadow-sky-600/20"
            >
              <span>{isSaving ? 'Saving...' : 'Save Telegram Config'}</span>
            </button>
            <button
              onClick={handleSendTestAlert}
              disabled={isSendingTest}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all shadow-md"
            >
              <span>🚀 Send Test Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* PC Allow / Block (Mute) Manager */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">🛡️ టెలిగ్రామ్ PC అనుమతి & మ్యూట్ మేనేజర్ (Allow / Mute PC)</h4>
          <span className="text-xs font-bold text-slate-400">Total Registered PCs: {pcFilters.allPcs.length}</span>
        </div>
        
        {pcFilters.allPcs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-slate-200">
            No registered PCs found yet. Once UBD clients ping the server, they will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pcFilters.allPcs.map((pc: any) => (
              <div key={pc.pcId || pc.pcName} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${pc.isBlocked ? 'bg-rose-50/80 border-rose-200' : 'bg-emerald-50/80 border-emerald-200'}`}>
                <div className="min-w-0">
                  <div className="font-black text-slate-900 text-xs truncate">{pc.pcName}</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{pc.officeLocation || pc.district || 'Grama Panchayat'}</div>
                </div>
                <button
                  onClick={() => handleTogglePcBlock(pc.pcId || pc.pcName, pc.isBlocked)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shrink-0 cursor-pointer shadow-xs ${pc.isBlocked ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
                >
                  {pc.isBlocked ? 'Allow' : 'Mute'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
