import React from 'react';

export const UBDLiveMonitoring: React.FC = () => {
  return (
    <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-xs max-w-4xl mx-auto my-6">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl">
        ⚡
      </div>
      <h2 className="text-xl font-black text-slate-900 mb-2">UBD Live Monitoring</h2>
      <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
        పాత కోడ్ మొత్తం తొలగించబడింది. మీరు వేయాలనుకుంటున్న కొత్త కోడ్‌ను (New Code) ఇక్కడ పంపండి, వెంటనే దాన్ని ఇంప్లిమెంట్ చేస్తాను.
      </p>
    </div>
  );
};

export default UBDLiveMonitoring;
