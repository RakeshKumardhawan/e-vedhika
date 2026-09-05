import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, MousePointerClick, Eye, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const revenueData = [
  { date: 'Mon', revenue: 12.5, impressions: 4500, clicks: 120 },
  { date: 'Tue', revenue: 15.2, impressions: 5200, clicks: 145 },
  { date: 'Wed', revenue: 11.8, impressions: 4100, clicks: 95 },
  { date: 'Thu', revenue: 18.4, impressions: 6300, clicks: 190 },
  { date: 'Fri', revenue: 22.1, impressions: 7800, clicks: 240 },
  { date: 'Sat', revenue: 28.5, impressions: 9500, clicks: 310 },
  { date: 'Sun', revenue: 25.3, impressions: 8900, clicks: 280 },
];

const pagePerformanceData = [
  { page: '/home', ctr: 2.8, rpm: 3.45 },
  { page: '/articles', ctr: 3.5, rpm: 4.12 },
  { page: '/tools', ctr: 1.9, rpm: 2.30 },
  { page: '/about', ctr: 0.8, rpm: 1.10 },
];

export function RevenueAnalyticsHub() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-600" /> Google AdSense & Revenue Analytics
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Real-time monetization tracking, CTR, and page-level ad performance.</p>
          </div>
          <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Est. Earnings (7D)</span>
              <DollarSign size={14} className="text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-emerald-900">$133.80</h4>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp size={12} /> +12%</span>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Impressions</span>
              <Eye size={14} className="text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-blue-900">46.3K</h4>
              <span className="text-[10px] font-bold text-blue-600 flex items-center"><TrendingUp size={12} /> +8%</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-purple-700 uppercase">Total Clicks</span>
              <MousePointerClick size={14} className="text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-purple-900">1,380</h4>
              <span className="text-[10px] font-bold text-rose-600 flex items-center"><TrendingDown size={12} /> -2%</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Avg. Page CTR</span>
              <TrendingUp size={14} className="text-slate-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900">2.98%</h4>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp size={12} /> +0.4%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-slate-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-4">Daily Revenue & Impressions</h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-4">Page Performance (CTR / RPM)</h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pagePerformanceData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis dataKey="page" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="ctr" name="CTR (%)" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="rpm" name="RPM ($)" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
