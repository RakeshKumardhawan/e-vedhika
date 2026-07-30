import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Users, FileText, Lightbulb, AlertTriangle, Settings, 
  Code, Shield, Layers, ArrowRight, CornerDownLeft, Sparkles, Command,
  Compass, FileCode2, Sliders, Database, ExternalLink
} from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';

export interface SearchResultItem {
  id: string;
  category: 'User' | 'Report' | 'Post' | 'Suggestion' | 'Menu' | 'Settings' | 'Log' | 'Code';
  title: string;
  subtitle: string;
  icon: any;
  actionKey: string;
  extraData?: any;
}

// System Menus & Admin Settings pages index for instant search navigation
const SYSTEM_MENUS: SearchResultItem[] = [
  { id: 'm_overview', category: 'Menu', title: 'Live Admin Overview Dashboard', subtitle: 'Main analytics, quick metrics & system status', icon: Compass, actionKey: 'overview' },
  { id: 'm_health', category: 'Menu', title: 'Live System Health Center', subtitle: 'Database, Auth, API, Latency & Storage status', icon: Shield, actionKey: 'health' },
  { id: 'm_errors', category: 'Menu', title: 'Live System Error Center', subtitle: 'Track exceptions, reasons, user IP, possible fixes, retry & resolve', icon: AlertTriangle, actionKey: 'errors' },
  { id: 'm_users', category: 'Menu', title: 'User Management & Directory', subtitle: 'Manage employee, citizen & admin accounts', icon: Users, actionKey: 'users' },
  { id: 'm_codemanager', category: 'Menu', title: 'Enterprise Code Manager & IDE', subtitle: 'Live CSS, HTML, JS & JSON editor with rollback', icon: Code, actionKey: 'codemanager' },
  { id: 'm_reports', category: 'Menu', title: 'Reports & Complaints Management', subtitle: 'Review and resolve citizen & officer issues', icon: AlertTriangle, actionKey: 'problems' },
  { id: 'm_posts', category: 'Menu', title: 'Community Discussion Posts', subtitle: 'Manage news, updates & community wall posts', icon: FileText, actionKey: 'deployments' },
  { id: 'm_suggestions', category: 'Menu', title: 'Community Suggestions Hub', subtitle: 'Review public suggestions and upvotes', icon: Lightbulb, actionKey: 'suggestions' },
  { id: 'm_security', category: 'Menu', title: 'Security Audit & Visitor Logs', subtitle: 'Track IP, browser, login attempts & admin activity', icon: Shield, actionKey: 'security' },
  { id: 'm_settings', category: 'Menu', title: 'Global System Settings & Maintenance Mode', subtitle: 'Configure portal title, maintenance toggle & theme', icon: Settings, actionKey: 'settings' },
  { id: 'm_pagebuilder', category: 'Menu', title: 'Visual Page Builder & Layout Manager', subtitle: 'Customize homepage banners, cards & sections', icon: Layers, actionKey: 'builder' }
];

const CODE_FILES_INDEX: SearchResultItem[] = [
  { id: 'c_global_css', category: 'Code', title: 'Global Stylesheet (src/index.css)', subtitle: 'Custom CSS rules, glassmorphism & banners', icon: FileCode2, actionKey: 'codemanager', extraData: { fileId: 'global_css' } },
  { id: 'c_head_html', category: 'Code', title: 'Header Meta & Scripts (index.html <head>)', subtitle: 'SEO metadata, theme color & inline CSS', icon: FileCode2, actionKey: 'codemanager', extraData: { fileId: 'head_html' } },
  { id: 'c_footer_js', category: 'Code', title: 'Footer Custom Scripts (App.tsx Hook)', subtitle: 'Client-side runtime hooks & custom analytics', icon: FileCode2, actionKey: 'codemanager', extraData: { fileId: 'footer_js' } },
  { id: 'c_config_json', category: 'Code', title: 'System Runtime Configuration (data/config.json)', subtitle: 'Version flags, maintenance mode & theme variables', icon: FileCode2, actionKey: 'codemanager', extraData: { fileId: 'config_json' } }
];

export function AdminGlobalSearchModal({ 
  isOpen, 
  onClose, 
  onNavigate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (tabKey: string, extraData?: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [dbResults, setDbResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      fetchAllDatabaseData();
    }
  }, [isOpen]);

  // Handle Ctrl + K global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open modal
          const openEvent = new CustomEvent('open-admin-global-search');
          window.dispatchEvent(openEvent);
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch real data from database for live indexing
  const fetchAllDatabaseData = async () => {
    setIsSearching(true);
    const results: SearchResultItem[] = [];

    try {
      // 1. Fetch Users
      const usersSnap = await getDocs(query(collection(db, 'users'), limit(50)));
      usersSnap.docs.forEach(d => {
        const u = d.data();
        results.push({
          id: `u_${d.id}`,
          category: 'User',
          title: u.name || u.displayName || u.email || 'Unnamed Account',
          subtitle: `Role: ${u.role || u.designation || 'User'} • District: ${u.district || 'N/A'} • ${u.email || u.phone || ''}`,
          icon: Users,
          actionKey: 'users',
          extraData: { userId: d.id }
        });
      });

      // 2. Fetch Reports / Problems
      const probsSnap = await getDocs(query(collection(db, 'problems'), limit(40)));
      probsSnap.docs.forEach(d => {
        const p = d.data();
        results.push({
          id: `p_${d.id}`,
          category: 'Report',
          title: p.title || p.subject || 'Report/Issue',
          subtitle: `Status: ${(p.status || 'Pending').toUpperCase()} • Category: ${p.category || 'General'} • By: ${p.userName || p.author || 'Citizen'}`,
          icon: AlertTriangle,
          actionKey: 'problems',
          extraData: { reportId: d.id }
        });
      });

      // 3. Fetch Posts
      const postsSnap = await getDocs(query(collection(db, 'posts'), limit(30)));
      postsSnap.docs.forEach(d => {
        const p = d.data();
        results.push({
          id: `post_${d.id}`,
          category: 'Post',
          title: p.title || (p.content ? p.content.substring(0, 60) : 'Community Post'),
          subtitle: `By: ${p.author || 'User'} • Likes: ${p.likes || 0}`,
          icon: FileText,
          actionKey: 'deployments',
          extraData: { postId: d.id }
        });
      });

      // 4. Fetch Suggestions
      const suggsSnap = await getDocs(query(collection(db, 'suggestions'), limit(30)));
      suggsSnap.docs.forEach(d => {
        const s = d.data();
        results.push({
          id: `sugg_${d.id}`,
          category: 'Suggestion',
          title: s.text || s.title || 'Public Suggestion',
          subtitle: `Category: ${s.category || 'General'} • Upvotes: ${s.upvotes || s.likes || 0} • Author: ${s.author || 'Citizen'}`,
          icon: Lightbulb,
          actionKey: 'suggestions',
          extraData: { suggestionId: d.id }
        });
      });

      // 5. Fetch Security Logs
      const logsSnap = await getDocs(query(collection(db, 'security_logs'), limit(30)));
      logsSnap.docs.forEach(d => {
        const l = d.data();
        results.push({
          id: `log_${d.id}`,
          category: 'Log',
          title: `${l.action || l.type || 'Security Event'}`,
          subtitle: `User: ${l.user || l.email || 'System'} • Severity: ${l.severity || 'Info'} • IP: ${l.ip || 'N/A'}`,
          icon: Shield,
          actionKey: 'security',
          extraData: { logId: d.id }
        });
      });

      setDbResults(results);
    } catch (e) {
      console.warn("Global Search fetch warning:", e);
    } finally {
      setIsSearching(false);
    }
  };

  // Combine static indexes (Menus, Code, Settings) + Database live results
  const allIndexedItems: SearchResultItem[] = [
    ...SYSTEM_MENUS,
    ...CODE_FILES_INDEX,
    ...dbResults
  ];

  // Filter items based on search term & category filter
  const filteredResults = allIndexedItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    if (!matchesCategory) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.subtitle.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  });

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigate(item.actionKey, item.extraData);
    onClose();
  };

  // Keyboard arrow navigation
  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Header Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center gap-3 border-b border-slate-800 relative">
          <Search size={22} className="text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInput}
            placeholder="Search Users, Posts, Suggestions, Reports, Menus, Settings, Code, Logs... (Ctrl + K)"
            className="flex-1 bg-transparent text-base font-bold text-white placeholder-slate-400 outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl text-slate-300 font-mono text-xs border border-slate-700">
            <Command size={12} />
            <span>K</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all ml-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-xs font-bold text-slate-600">
          {['All', 'Menu', 'User', 'Report', 'Post', 'Suggestion', 'Code', 'Log'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-[#0B3D91] text-white shadow-xs' 
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cat === 'All' ? '🌐 All Results' : cat}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-400 font-mono shrink-0 font-bold">
            {filteredResults.length} matches
          </span>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {isSearching ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Sparkles size={28} className="animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-widest">Searching database & system indexes...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Search size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No matching results found for "{searchTerm}"</p>
              <p className="text-xs">Try searching for keywords like "User", "Report", "Code", "CSS", "Health", or "Settings"</p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                    isSelected 
                      ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      item.category === 'Menu' ? 'bg-blue-100 text-blue-700' :
                      item.category === 'User' ? 'bg-purple-100 text-purple-700' :
                      item.category === 'Report' ? 'bg-rose-100 text-rose-700' :
                      item.category === 'Code' ? 'bg-slate-900 text-emerald-400' :
                      item.category === 'Suggestion' ? 'bg-amber-100 text-amber-800' :
                      item.category === 'Log' ? 'bg-teal-100 text-teal-800' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      <Icon size={18} />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 hidden sm:inline">
                      Open Module
                    </span>
                    <ArrowRight size={16} className={isSelected ? 'text-indigo-600 font-bold' : 'text-slate-300'} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Keyboard Shortcuts Hint */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold">ESC</kbd>
              Close
            </span>
          </div>

          <span className="font-bold text-[#0B3D91] flex items-center gap-1">
            <Sparkles size={12} /> E-VEDHIKA Global Search
          </span>
        </div>
      </motion.div>
    </div>
  );
}
