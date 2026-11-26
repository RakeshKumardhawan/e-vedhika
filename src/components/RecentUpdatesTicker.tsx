import React, { useEffect, useState } from "react";
import { collection, collectionGroup, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Sparkles,
  Folder,
  HardDrive,
  Globe,
  FileText,
  MessageSquare,
  Zap,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";

export interface RecentUpdateItem {
  id: string;
  title: string;
  subtitle: string;
  source: "Software Hub" | "Folder" | "Portal Link" | "Post" | "Comment" | "New Feature";
  timestamp: number;
  dateLabel: string;
  targetTab: string;
}

interface RecentUpdatesTickerProps {
  posts?: any[];
  onNavigateTab: (tab: string) => void;
}

function parseTimestampMs(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val > 1e12 ? val : val * 1000;
  if (typeof val === "string") {
    const n = Number(val);
    if (!Number.isNaN(n) && n > 0) return n > 1e12 ? n : n * 1000;
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val === "object") {
    if (typeof val.toMillis === "function") return val.toMillis();
    if (typeof val.seconds === "number") return val.seconds * 1000;
  }
  return 0;
}

const PLATFORM_NEW_FEATURES: RecentUpdateItem[] = [
  {
    id: "feat_sw_dragdrop",
    title: "Software Hub: Drag & Drop Bulk Upload + Cloudflare R2",
    subtitle: "New Feature • ఫోల్డర్లు & ఫైల్స్ నేరుగా క్లౌడ్‌లో అప్‌లోడ్",
    source: "New Feature",
    timestamp: Date.parse("2026-11-26T21:50:00+05:30"),
    dateLabel: "26/11/2026",
    targetTab: "software_hub",
  },
  {
    id: "feat_recent_ticker",
    title: "Live Recent Updates Feed on Home Page",
    subtitle: "New Feature • పోస్టులు, కామెంట్లు, సాఫ్ట్‌వేర్ అప్‌డేట్స్ లైవ్ రోలింగ్",
    source: "New Feature",
    timestamp: Date.parse("2026-11-26T22:00:00+05:30"),
    dateLabel: "26/11/2026",
    targetTab: "home",
  },
];

export function RecentUpdatesTicker({ posts = [], onNavigateTab }: RecentUpdatesTickerProps) {
  const [swUpdates, setSwUpdates] = useState<RecentUpdateItem[]>([]);
  const [folderUpdates, setFolderUpdates] = useState<RecentUpdateItem[]>([]);
  const [linkUpdates, setLinkUpdates] = useState<RecentUpdateItem[]>([]);
  const [commentUpdates, setCommentUpdates] = useState<RecentUpdateItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Live Software Hub updates
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "software_repository"),
      (snap) => {
        const list: RecentUpdateItem[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          const ts = parseTimestampMs(data.updatedAtTimestamp || data.updatedAt);
          list.push({
            id: `sw_${d.id}`,
            title: String(data.name || "Software Update"),
            subtitle: `${data.version || "v1.0"} • ${data.fileSize || "File"} (${data.fileFormat || "EXE"})`,
            source: "Software Hub",
            timestamp: ts,
            dateLabel: String(data.lastUpdated || (ts ? new Date(ts).toLocaleDateString("en-IN") : "Updated")),
            targetTab: "software_hub",
          });
        });
        setSwUpdates(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // 2. Live Folder updates
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "software_folders"),
      (snap) => {
        const list: RecentUpdateItem[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          const ts = parseTimestampMs(data.updatedAt);
          if (ts > 0) {
            list.push({
              id: `fld_${d.id}`,
              title: String(data.name || "Folder"),
              subtitle: String(data.descriptionTelugu || "Software Hub Folder"),
              source: "Folder",
              timestamp: ts,
              dateLabel: new Date(ts).toLocaleDateString("en-IN"),
              targetTab: "software_hub",
            });
          }
        });
        setFolderUpdates(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // 3. Live Online Portal link updates (NEVER expose raw sensitive URLs)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "epanchayat_portal_links"),
      (snap) => {
        const list: RecentUpdateItem[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          const ts = parseTimestampMs(data.createdAt);
          list.push({
            id: `lnk_${d.id}`,
            title: String(data.title || "Portal Update"),
            subtitle: String(data.subtitle || "Online Reporting Update"),
            source: "Portal Link",
            timestamp: ts,
            dateLabel: ts ? new Date(ts).toLocaleDateString("en-IN") : "New",
            targetTab: "online_portal",
          });
        });
        setLinkUpdates(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // 4. Live Comments across all posts via collectionGroup
  useEffect(() => {
    const unsub = onSnapshot(
      collectionGroup(db, "comments"),
      (snap) => {
        const list: RecentUpdateItem[] = [];
        snap.forEach((d) => {
          const c = d.data() as any;
          const txt = String(c.text || c.comment || "").replace(/https?:\/\/\S+/gi, "").trim();
          if (!txt && !c.imageUrl) return;
          const ts = parseTimestampMs(c.createdAt || c.time || c.timestamp);
          const author = String(c.userName || c.author || "User");
          list.push({
            id: `cmt_${d.id}`,
            title: `${author}: ${txt ? txt.slice(0, 80) : "Shared a photo"}`,
            subtitle: "New Comment on Post",
            source: "Comment",
            timestamp: ts,
            dateLabel: ts ? new Date(ts).toLocaleDateString("en-IN") : "Recent",
            targetTab: "home",
          });
        });
        list.sort((a, b) => b.timestamp - a.timestamp);
        setCommentUpdates(list.slice(0, 6));
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // 5. Recent Posts + Legacy embedded comments inside posts
  const postUpdates: RecentUpdateItem[] = [];
  const legacyCommentUpdates: RecentUpdateItem[] = [];

  (posts || []).forEach((p) => {
    const st = String(p.status || "").toLowerCase();
    if (st === "rejected" || st === "deleted" || st === "pending") return;

    const ts = parseTimestampMs(p.updatedAtTimestamp || p.updatedAt || p.createdAt || p.time || p.timestamp);
    postUpdates.push({
      id: `post_${p.id}`,
      title: String(p.title || p.content || "New Post").slice(0, 85),
      subtitle: `${p.userName || p.author || "Member"} • ${p.category || "Community Post"}`,
      source: "Post",
      timestamp: ts,
      dateLabel: ts ? new Date(ts).toLocaleDateString("en-IN") : "Recent",
      targetTab: "home",
    });

    if (Array.isArray(p.comments)) {
      p.comments.forEach((c: any, idx: number) => {
        const txt = String(c.text || c.comment || "").replace(/https?:\/\/\S+/gi, "").trim();
        if (!txt && !c.imageUrl) return;
        const cTs = parseTimestampMs(c.createdAt || c.time || c.timestamp);
        legacyCommentUpdates.push({
          id: `lcmt_${p.id}_${c.id || idx}`,
          title: `${c.userName || c.author || "Member"}: ${txt ? txt.slice(0, 80) : "Shared a photo"}`,
          subtitle: `Comment on "${String(p.title || "Post").slice(0, 35)}"`,
          source: "Comment",
          timestamp: cTs,
          dateLabel: cTs ? new Date(cTs).toLocaleDateString("en-IN") : "Recent",
          targetTab: "home",
        });
      });
    }
  });

  // Merge, deduplicate comments by id, and sort newest first across all categories
  const topPosts = postUpdates.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  const topComments = [...commentUpdates, ...legacyCommentUpdates]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const allUpdates = [
    ...PLATFORM_NEW_FEATURES,
    ...topPosts,
    ...topComments,
    ...swUpdates.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4),
    ...folderUpdates.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3),
    ...linkUpdates.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 15);

  if (allUpdates.length === 0) return null;

  const shouldRoll = allUpdates.length > 2;
  const trackItems = shouldRoll ? [...allUpdates, ...allUpdates] : allUpdates;
  const durationSeconds = Math.max(20, allUpdates.length * 3.2);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const getBadgeStyle = (source: RecentUpdateItem["source"]) => {
    switch (source) {
      case "Software Hub":
        return {
          pill: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
          iconBox: "bg-indigo-100/80 text-indigo-600",
          icon: <HardDrive size={14} />,
        };
      case "Folder":
        return {
          pill: "bg-purple-50 text-purple-700 border-purple-200/80",
          iconBox: "bg-purple-100/80 text-purple-600",
          icon: <Folder size={14} />,
        };
      case "Portal Link":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
          iconBox: "bg-emerald-100/80 text-emerald-600",
          icon: <Globe size={14} />,
        };
      case "Comment":
        return {
          pill: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
          iconBox: "bg-cyan-100/80 text-cyan-600",
          icon: <MessageSquare size={14} />,
        };
      case "New Feature":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-200/80",
          iconBox: "bg-rose-100/80 text-rose-600",
          icon: <Zap size={14} />,
        };
      default:
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200/80",
          iconBox: "bg-amber-100/80 text-amber-600",
          icon: <FileText size={14} />,
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-left">
      {/* Sleek Professional Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-xs sm:text-sm font-black tracking-wide">
            Recent Updates
          </span>
          <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">
            • పోస్టులు, కామెంట్లు, సాఫ్ట్‌వేర్లు &amp; కొత్త ఫీచర్లు
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
            LIVE • {allUpdates.length}
          </span>
          {shouldRoll && (
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer transition-colors"
              title={isPaused ? "Resume Rolling" : "Pause Rolling"}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          )}
        </div>
      </div>

      {/* Smooth Continuous Vertical Rolling Viewport */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative h-[192px] overflow-hidden bg-gradient-to-b from-slate-50/40 via-white to-slate-50/40"
      >
        <div className="pointer-events-none absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent z-10" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white to-transparent z-10" />

        <div
          className="ev-vertical-roll-track divide-y divide-slate-100"
          style={
            shouldRoll
              ? {
                  animation: `evRollTopToBottom ${durationSeconds}s linear infinite`,
                  animationPlayState: isPaused ? "paused" : "running",
                }
              : undefined
          }
        >
          {trackItems.map((item, idx) => {
            const badge = getBadgeStyle(item.source);
            const isNew = item.timestamp >= sevenDaysAgo;
            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onNavigateTab(item.targetTab)}
                className="h-[64px] px-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-indigo-50/60 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badge.iconBox}`}>
                    {badge.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 truncate transition-colors">
                        {item.title}
                      </span>
                      {isNew && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border shrink-0 ${badge.pill}`}>
                        {item.source}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">{item.subtitle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 hidden sm:inline">
                    {item.dateLabel}
                  </span>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes evRollTopToBottom {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(0, 0%, 0);
          }
        }
      `}</style>
    </div>
  );
}
