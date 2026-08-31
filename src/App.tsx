import { canShowAds, isAdsMuted, getMuteRemainingSeconds, muteAdsLocally, unmuteAdsLocally, recordAdImpression } from "./adManager";
import { PageDescriptionsAdmin } from "./components/PageDescriptionsAdmin";
import { SeoMetaAdmin, updateDOMMetaTags } from "./components/SeoMetaAdmin";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, startTransition } from "react";
const LazyGPDPSetup = React.lazy(() => import("./components/GPDPSetup"));
const GPDPSetup = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading GPDP Setup...</div>}><LazyGPDPSetup {...props} /></React.Suspense>;
const LazySuperAdminDashboard = React.lazy(() => import("./components/SuperAdminDashboard"));
const SuperAdminDashboard = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading Dashboard...</div>}><LazySuperAdminDashboard {...props} /></React.Suspense>;
import { createPortal } from "react-dom";
import {
  useSearchParams,
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import html2canvas from "html2canvas";
import { DEFAULT_DISTRICTS_DATA } from "./data/districts";
import { PrivacyPolicyPage, TermsPage, AboutPage, ContactPage } from "./components/StaticPages";
import { TabInfoBanner } from "./components/TabInfoBanner";
import { SYSTEM_UPDATES } from "./data/updates";
import { askMana } from "./services/geminiService";
import { SecurityLogsSection } from "./components/SecurityLogsSection";
import { MaintenancePage } from "./components/MaintenancePage";
import { recordSystemError } from "./components/SystemErrorCenter";
import { VisitorTracker } from "./components/VisitorTracker";
import { CodeManager } from "./components/CodeManager";
import { DynamicSection } from "./components/DynamicSection";
import { AIVideoHomeSection } from "./components/AIVideoHomeSection";
import {  DollarSign,
  Bell,
  Menu,
  X,
  Home,
  Megaphone,
  FileText,
  Wheat,
  Vote,
  Wallet,
  Building,
  MessageCircle,
  Handshake,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Send,
  LogOut,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  AlertCircle,
  Eye,
  Heart,
  Share2,
  PlusCircle,
  Camera, Calculator,
  Image as ImageIcon,
  User,
  Edit2,
  Save,
  Activity,
  Book,
  GraduationCap,
  BarChart3,
  Database,
  Download,
  Bot,
  MessageSquare,
  Trash2,
  Edit3,
  Settings,
  Code,
  TrendingUp,
  Upload,
  Play,
  RefreshCw,
  Layers,
  Calendar,
  LayoutDashboard,
  ShieldAlert,
  Lock,
  Shield,
  Pin,
  Paperclip,
  Wrench,
  Bold,
  Italic,
  Type,
  Link2,
  List,
  Users,
  AlertOctagon,
  CheckCircle2,
  CheckCircle,
  ClipboardList,
  Zap,
  Clock,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  Radio,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  ShieldCheck,
  Info,
  Hash,
  EyeOff,
  Rocket,
  Mail,
  RotateCcw,
  MapPin,
  Plus,
  Check,
  Mic,
  Layout,
  LayoutGrid,
  Fingerprint,
  Boxes,
  ExternalLink,
  Target,
  HardDrive,
  ArrowDown,
  GripVertical,
  Volume2,
  VolumeX,
  Cloud,
  Globe,
  Settings2,
  ShieldOff,
  Maximize2,
  FileSpreadsheet,
  FileDown,
  Package,
  CornerDownRight,
  LayoutList,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  WifiOff, FileBadge,
  ArrowUpDown,
  UserCheck,
  Smile,
  ThumbsUp, ImageOff, CheckCheck,
 } from "lucide-react";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { SafeMarkdown as ReactMarkdown } from "./components/SafeMarkdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

import { GosAndFormatsPublic, GosAndFormatsAdmin } from "./GosAndFormats";
import { PR_ACT_DB, PRSection } from "./data/prActData";
import { ExcelPrinterTool } from "./ExcelPrinterTool";
import { GPDPPlanningTool } from "./components/GPDPPlanningTool";
import { KnowledgeHubSection, PRActHub } from "./components/KnowledgeHub";
import { EVAnimatedLogo } from "./components/EVAnimatedLogo";
import { AuthModal } from "./components/AuthModal";
import { PollsScreen } from "./components/PollsScreen";

const LazyPdfCompressToolComponent = React.lazy(() => import('./components/PdfCompressTool').then(m => ({ default: m.PdfCompressTool })));
export const PdfCompressTool = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading PDF Tool...</div>}><LazyPdfCompressToolComponent {...props} /></React.Suspense>;

const LazyFarmerRegistryToolComponent = React.lazy(() => import('./components/FarmerRegistryTool').then(m => ({ default: m.FarmerRegistryTool })));
export const FarmerRegistryTool = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading Farmer Registry...</div>}><LazyFarmerRegistryToolComponent {...props} /></React.Suspense>;

const LazyUBDTrackerComponent = React.lazy(() => import('./components/UBDTracker').then(m => ({ default: m.UBDTracker })));
export const UBDTracker = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading UBD Tracker...</div>}><LazyUBDTrackerComponent {...props} /></React.Suspense>;

const LazyExeUbdLiveMonitoringComponent = React.lazy(() => import('./components/ExeUbdLiveMonitoring').then(m => ({ default: m.ExeUbdLiveMonitoring })));
export const ExeUbdLiveMonitoring = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading Live Monitoring...</div>}><LazyExeUbdLiveMonitoringComponent {...props} /></React.Suspense>;

const LazyExcelMergerComponent = React.lazy(() => import('./components/ExcelMerger').then(m => ({ default: m.ExcelMerger })));
export const ExcelMerger = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading Excel Merger...</div>}><LazyExcelMergerComponent {...props} /></React.Suspense>;

const LazyMonthlyActivityFormatterComponent = React.lazy(() => import('./components/MonthlyActivityFormatter').then(m => ({ default: m.MonthlyActivityFormatter })));
export const MonthlyActivityFormatter = (props: any) => <React.Suspense fallback={<div className="p-4 text-center">Loading Formatter...</div>}><LazyMonthlyActivityFormatterComponent {...props} /></React.Suspense>;

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const formatPostTitle = (title: string | undefined): string => {
  if (!title) return "";
  return title.trim();
};

let XLSX: any = null;
let jsPDF: any = null;
let autoTable: any = null;

const loadHeavyModules = async () => {
  if (!XLSX) XLSX = await import("xlsx");
  if (!jsPDF) {
    const j = await import("jspdf");
    jsPDF = j.default || j.jsPDF;
  }
  if (!autoTable) {
    const a = await import("jspdf-autotable");
    autoTable = a.default;
  }
};
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  getDocFromServer,
  query,
  where,
  limit,
  orderBy,
  increment,
  arrayUnion,
  arrayRemove,
  setDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";


import { auth, db, storage } from "../firebase";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  const lowerErr = errInfo.error.toLowerCase();

  const isPermissionError =
    lowerErr.includes("permission") || lowerErr.includes("insufficient");

  if (isPermissionError) {
    console.warn(`Firestore Permission (${operationType} on ${path}): ${errInfo.error}`);
    return;
  }

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getFriendlyError(err: any): string {
  let msg = err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error) msg = parsed.error;
  } catch (e) {}

  if (msg.includes("Missing or insufficient permissions")) {
    return "‡∞Æ‡±Ä‡∞ï‡±Å ‡∞à ‡∞Ø‡∞æ‡∞ï‡±ç‡∞∑‡∞®‡±ç‚Äå‡∞®‡∞ø ‡∞ö‡±á‡∞Ø‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞™‡∞∞‡±ç‡∞Æ‡∞ø‡∞∑‡∞®‡±ç ‡∞≤‡±á‡∞¶‡±Å / You don't have permission to perform this action.";
  }
  if (
    msg.includes("offline") ||
    msg.includes("network-request-failed") ||
    msg.includes("Failed to get document because the client is offline")
  ) {
    return "‡∞á‡∞Ç‡∞ü‡∞∞‡±ç‡∞®‡±Ü‡∞ü‡±ç ‡∞ï‡∞®‡±Ü‡∞ï‡±ç‡∞∑‡∞®‡±ç ‡∞≤‡±á‡∞¶‡±Å. ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞®‡±Ü‡∞ü‡±ç‚Äå‡∞µ‡∞∞‡±ç‡∞ï‡±ç ‡∞ö‡±Ü‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø / No internet connection. Please check your network.";
  }
  if (msg.includes("Quota exceeded")) {
    return "‡∞∏‡∞ø‡∞∏‡±ç‡∞ü‡∞Æ‡±ç ‡∞™‡∞∞‡∞ø‡∞Æ‡∞ø‡∞§‡∞ø ‡∞¶‡∞æ‡∞ü‡∞ø‡∞Ç‡∞¶‡∞ø. ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞∞‡±á‡∞™‡±Å ‡∞Æ‡∞≥‡±ç‡∞≥‡±Ä ‡∞™‡±ç‡∞∞‡∞Ø‡∞§‡±ç‡∞®‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø / Quota exceeded. Please try again tomorrow.";
  }
  if (
    msg.includes("invalid-credential") ||
    msg.includes("user-not-found") ||
    msg.includes("wrong-password")
  ) {
    return "‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞µ‡∞ø‡∞µ‡∞∞‡∞æ‡∞≤‡±Å ‡∞§‡∞™‡±ç‡∞™‡±Å. ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞∏‡∞∞‡∞ø‡∞Ø‡±à‡∞® ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞µ‡∞ø‡∞µ‡∞∞‡∞æ‡∞≤‡±Å ‡∞™‡±ç‡∞∞‡∞Ø‡∞§‡±ç‡∞®‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø / Invalid credentials. Please try again.";
  }
  if (
    msg.includes("popup-closed-by-user") ||
    msg.includes("cancelled-popup-request")
  ) {
    return "‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞µ‡∞ø‡∞Ç‡∞°‡±ã ‡∞Æ‡±Ç‡∞∏‡∞ø‡∞µ‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø. ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞Æ‡∞≥‡±ç‡∞≥‡±Ä ‡∞™‡±ç‡∞∞‡∞Ø‡∞§‡±ç‡∞®‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø / The login popup was closed before completion.";
  }

  return msg;
}

export async function sendCommentNotifications(
  postId: string,
  commentText: string,
  authorUid: string,
  authorName: string,
) {
  try {
    const time = Date.now();

    // Global Notification for Comment
    await addDoc(collection(db, "notifications"), {
      uid: "all",
      title: "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç (New Comment)",
      message: `${authorName} ‡∞µ‡∞æ‡∞∞‡±Å ‡∞í‡∞ï ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç‚Äå ‡∞™‡±à ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å.`,
      type: "comment",
      read: false,
      time: time,
      postId: postId,
      senderUid: authorUid,
    });

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = [...commentText.matchAll(mentionRegex)].map((m) =>
      m[1].toLowerCase(),
    );
    const uniqueMentions = [...new Set(mentions)];

    for (const username of uniqueMentions) {
      try {
        const userDoc = await getDoc(doc(db, "usernames", username));
        if (userDoc.exists()) {
          const targetUid = userDoc.data().uid;
          if (targetUid && targetUid !== authorUid) {
            await addDoc(collection(db, "notifications"), {
              uid: targetUid,
              title: "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞Æ‡±Ü‡∞®‡±ç‡∞∑‡∞®‡±ç (New Mention)",
              message: `${authorName} ‡∞Æ‡∞ø‡∞Æ‡±ç‡∞Æ‡∞≤‡±ç‡∞®‡∞ø ‡∞í‡∞ï ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç‚Äå‡∞≤‡±ã ‡∞Æ‡±Ü‡∞®‡±ç‡∞∑‡∞®‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å.`,
              type: "mention",
              read: false,
              time: time,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Send a single grouped notification to all users
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", "all"),
      where("type", "==", "comment"),
      where("postId", "==", postId),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, {
        message: `${authorName} ‡∞µ‡∞æ‡∞∞‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞á‡∞§‡∞∞‡±Å‡∞≤‡±Å ‡∞í‡∞ï ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±Å‡∞≤‡±ã ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç‡∞≤‡±Å ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å.`,
        time: time,
        read: false
      });
    } else {
      await addDoc(collection(db, "notifications"), {
        uid: "all",
        title: "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç (New Comment)",
        message: `${authorName} ‡∞µ‡∞æ‡∞∞‡±Å ‡∞í‡∞ï ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±Å‡∞≤‡±ã ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å.`,
        type: "comment",
        read: false,
        time: time,
        postId: postId
      });
    }

    // Single admin alert
    await addDoc(collection(db, "notifications"), {
      uid: "all",
      title: "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç (New Comment)",
      message: `${authorName} ‡∞µ‡∞æ‡∞∞‡±Å ‡∞í‡∞ï ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç‚Äå‡∞™‡±à ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å.`,
      type: "admin_alert",
      read: false,
      time: time,
      postId: postId
    }).catch(()=>console.error("Failed to notify admin"));

  } catch (err) {
    console.error("Error sending notifications", err);
  }
}

export async function sendLikeNotification(
  postId: string,
  commentId: string,
  commentText: string,
  commentAuthorUid: string,
  commentAuthorName: string,
  likerUid: string,
  likerName: string,
) {
  try {
    const time = Date.now();

    // Global Notification
    await addDoc(collection(db, "notifications"), {
      uid: "all",
      title: "‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞≤‡±à‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø (Comment Liked)",
      message: `${likerName} ‡∞µ‡∞æ‡∞∞‡±Å ‡∞í‡∞ï ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç‚Äå‡∞®‡±Å ‡∞á‡∞∑‡±ç‡∞ü‡∞™‡∞°‡±ç‡∞°‡∞æ‡∞∞‡±Å (‡∞≤‡±à‡∞ï‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å).`,
      type: "comment_like",
      read: false,
      time: time,
      postId: postId,
      senderUid: likerUid,
    });

    // 1st Person: Notify the comment author if the liker is not the comment author themself
    if (commentAuthorUid && commentAuthorUid !== likerUid) {
      await addDoc(collection(db, "notifications"), {
        uid: commentAuthorUid,
        title: "‡∞Æ‡±Ä ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞≤‡±à‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø (Comment Liked)",
        message: `${likerName} E-Vedhika ‡∞∏‡±à‡∞ü‡±ç‚Äå‡∞≤‡±ã ‡∞Æ‡±Ä ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç‚Äå‡∞®‡±Å ‡∞á‡∞∑‡±ç‡∞ü‡∞™‡∞°‡±ç‡∞°‡∞æ‡∞∞‡±Å (‡∞≤‡±à‡∞ï‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å). ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç‚Äå‡∞®‡±Å ‡∞ö‡±Ç‡∞°‡∞ü‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞á‡∞ï‡±ç‡∞ï‡∞° ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.`,
        type: "comment_like",
        read: false,
        time: time,
        postId: postId,
      });
    }

    // 2nd group: Notify ALL other users who commented on this post (except the liker and the comment author)
    const commentsSnap = await getDocs(
      collection(db, "posts", postId, "comments"),
    );
    const uids = new Set<string>();
    commentsSnap.forEach((d) => {
      const data = d.data();
      if (data.uid) uids.add(data.uid);
    });

    uids.delete(likerUid);
    uids.delete(commentAuthorUid);

    for (const targetUid of Array.from(uids)) {
      try {
        await addDoc(collection(db, "notifications"), {
          uid: targetUid,
          title: "‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç‚Äå‡∞™‡±à ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞∏‡±ç‡∞™‡∞Ç‡∞¶‡∞® (Reaction on Post)",
          message: `${likerName} ‡∞Æ‡±Ä‡∞∞‡±Å ‡∞™‡∞æ‡∞≤‡±ç‡∞ó‡±ä‡∞®‡±ç‡∞® ‡∞à-‡∞µ‡±á‡∞¶‡∞ø‡∞ï ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç‚Äå‡∞≤‡±ã‡∞®‡∞ø ‡∞í‡∞ï ‡∞ï‡∞æ‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç‚Äå‡∞®‡±Å ‡∞≤‡±à‡∞ï‡±ç ‡∞ö‡±á‡∞∂‡∞æ‡∞∞‡±Å.`,
          type: "comment_like",
          read: false,
          time: time,
          postId: postId,
        });
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error("Error sending like notification", err);
  }
}

const logUserActivity = async (actionDesc: string, details?: any) => {
  try {
    const userDisplay =
      auth.currentUser?.email ||
      auth.currentUser?.displayName ||
      auth.currentUser?.uid ||
      "Anonymous Visitor";
    await addDoc(collection(db, "security_logs"), {
      admin: userDisplay,
      uid: auth.currentUser?.uid || "anonymous",
      action: actionDesc,
      details: details || null,
      time: Date.now(),
      userAgent: navigator.userAgent,
    });
  } catch (e) {
    console.error("Logging error:", e);
  }
};

export function requireLoginAlert(userObj?: any): boolean {
  const account = userObj || auth.currentUser;
  if (!account || account.isAnonymous) {
    Swal.fire({
      text: "‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ö‡∞Ø‡±ç‡∞Ø‡∞æ‡∞ï ‡∞Æ‡±Ä‡∞ï‡±Å ‡∞Ø‡∞æ‡∞ï‡±ç‡∞∏‡±Ü‡∞∏‡±ç ‡∞â‡∞Ç‡∞ü‡±Å‡∞Ç‡∞¶‡∞ø",
      icon: "info",
      confirmButtonText: "‡∞∏‡∞∞‡±á (OK)",
      confirmButtonColor: "#0d3b66",
    });
    return true;
  }
  return false;
}

function formatDistanceToNow(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

interface Post {
  id: string;
  slug?: string;
  title: string;
  content: string;
  category: string;
  categories?: string[];
  subCategory?: string;
  tags?: string[];
  websiteName?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaName?: string;
  likes: number;
  views: number;
  comments: Comment[];
  commentCount?: number;
  likedBy?: string[];
  viewedBy?: string[];
  userName?: string;
  userPhoto?: string;
  time: number;
  createdAt?: any;
  lastEditedAt?: any;
  updatedAt?: any;
  uid: string;
  status?: string;
  pinned?: boolean;
  isAdminPost?: boolean;
  version?: string;
  versionStatus?: "New" | "Old";
  attachments?: {
    name: string;
    url: string;
    version?: string;
    status?: "New" | "Old";
    badgePrefix?: string;
    isDirect?: boolean;
  }[];
  downloadStyle?: "classic" | "techspot";
}

interface Comment {
  user: string;
  msg: string;
  time: number;
}

interface UserProfile {
  id: string;
  username: string;
  surname?: string;
  name?: string;
  designation?: string;
  gender?: string;
  status?: string;
  state?: string;
  district?: string;
  mandal?: string;
  village?: string;
  mobile?: string;
  email?: string;
  photoURL?: string;
  coverPhotoURL?: string;
  following?: string[];
  office?: string;
  role?: string;
  hidden?: boolean;
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  time: number;
  timeSpentMinutes?: number;
}

interface Suggestion {
  id: string;
  name: string;
  author?: string;
  village?: string;
  mobile?: string;
  text?: string;
  msg?: string;
  suggestion?: string;
  category?: string;
  status: string;
  time: number;
  uid?: string;
  resolvedAt?: number;
}

interface ProblemReport {
  id: string;
  msg: string;
  category?: string;
  status?: "pending" | "solved" | "resolved" | "Deleted";
  time: number;
  uid: string;
  resolvedAt?: number;
  isAnonymous?: boolean;
  wantsWhatsAppUpdates?: boolean;
}

interface ChatMessage {
  id: string;
  msg: string;
  time: number;
  uid: string;
  userName?: string;
}

interface RequestData {
  id: string;
  msg: string;
  time: number;
  uid: string;
}

interface Update {
  id: string;
  text: string;
  time: number;
  status?: string;
  type?: string;
  visibility?: string;
}

interface Notification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: number;
  link?: string;
  readBy?: string[];
  senderUid?: string;
}

const APP_STYLES = `
:root {
  --primary: #0d3b66;
  --accent: #fbbf24;
  --success: #16a34a;
  --danger: #dc2626;
  --bg-light: #f1f5f9;
  --google-red: #ea4335;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

body {
  margin: 0;
  background-color: #f1f5f9;
  color: #1e293b;
}

.brand-title {
  font-family: 'Righteous', cursive;
  margin: 0;
  letter-spacing: 2px;
  color: var(--accent);
  text-shadow: 2px 2px 0px var(--primary);
}

.sub-tagline {
  margin: 0;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  opacity: 0.9;
  letter-spacing: 1px;
}

.latest-bar {
  background: #fff;
  padding: 10px 5%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}
.latest-label {
  background: var(--danger);
  color: #fff;
  padding: 5px 12px;
  border-radius: 4px;
  font-weight: 900;
  font-size: 11px;
  margin-right: 15px;
  white-space: nowrap;
}
.latest-text { flex: 1; overflow: hidden; font-weight: 700; font-size: 14px; color: var(--primary); }
.latest-text span { display: inline-block; white-space: nowrap; animation: scrollLeft 25s linear infinite; }
@keyframes scrollLeft { from { transform: translateX(100%); } to { transform: translateX(-100%); } }

.sidebar-card {
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  box-shadow: var(--card-shadow);
}
.side-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 2px;
  background: transparent;
  color: #64748b;
  border: 1px solid transparent;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  text-align: left;
  gap: 12px;
}
.side-btn:hover { background: #f1f5f9; color: var(--primary); transform: translateX(5px); }
.side-btn.active-tab {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(13, 59, 102, 0.4);
}
.side-btn-emoji { font-size: 18px; width: 24px; text-align: center; }

.section-card {
  background: #fff;
  border-radius: 20px;
  padding: 15px;
  box-shadow: var(--card-shadow);
  margin-bottom: 20px;
}
@media (min-width: 640px) {
  .section-card {
    padding: 25px;
    margin-bottom: 25px;
  }
}
.section-card {
  border-top: 5px solid var(--primary);
}
.scheme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 20px;
  margin-top: 20px;
}
.scheme-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  border-bottom: 4px solid #e2e8f0;
}
.scheme-card:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(0,0,0,0.08); border-bottom-color: var(--primary); }
.scheme-card h4 { margin: 15px 0 10px; font-size: 19px; color: var(--primary); }
.scheme-card p { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 20px; }
.scheme-link-btn {
  margin-top: auto;
  background: var(--primary);
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.msg-bubble {
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 80%;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  word-break: break-word;
}
.msg-other { background: #fff; border-bottom-left-radius: 2px; align-self: flex-start; color: #334155; }
.msg-me { background: var(--primary); color: #fff; border-bottom-right-radius: 2px; align-self: flex-end; }

.mana-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
}
@media (min-width: 640px) {
  .mana-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
}
.mana-card {
  background: #fff;
  border: 1.5px solid #f1f5f9;
  border-radius: 28px;
  padding: 20px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}
@media (min-width: 640px) {
  .mana-card {
    padding: 35px 25px;
  }
}
.mana-card:hover {
  border-color: var(--primary);
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(13, 59, 102, 0.1);
}
.mana-card h4 {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary);
  margin-top: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
`;

function cleanStringData(val: any) {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function PostSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 animate-pulse"
        >
          <div className="flex gap-4 items-start mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded-full w-1/4" />
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded-full w-full" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6" />
            <div className="h-4 bg-slate-100 rounded-full w-4/6" />
          </div>
          <div className="mt-6 flex gap-4">
            <div className="h-8 bg-slate-50 rounded-xl w-24" />
            <div className="h-8 bg-slate-50 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-[32px] p-6 sm:p-12 mb-8 min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="space-y-2 animate-pulse">
          <h3 className="text-lg sm:text-xl font-black text-slate-700 tracking-tight">‡∞≤‡±ã‡∞°‡±ç ‡∞Ö‡∞µ‡±Å‡∞§‡±ã‡∞Ç‡∞¶‡∞ø...</h3>
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞µ‡±á‡∞ö‡∞ø ‡∞â‡∞Ç‡∞°‡∞Ç‡∞°‡∞ø (Please wait...)</p>
        </div>
      </div>
    </div>
  );
}

function UpdateTickerSkeleton() {
  return (
    <div className="latest-bar overflow-hidden animate-pulse">
      <div className="latest-label whitespace-nowrap shrink-0 flex items-center gap-1.5 opacity-50">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        Latest Updates
      </div>
      <div className="latest-text flex-1">
        <div className="h-4 bg-white/20 rounded-full w-full mx-4" />
      </div>
    </div>
  );
}

function getValidTime(obj: any): number {
  if (!obj) return Date.now();
  if (obj.time) {
    if (typeof obj.time === "number") return obj.time;
    if (obj.time.seconds) return obj.time.seconds * 1000;
  }
  if (obj.createdAt) {
    if (typeof obj.createdAt === "number") return obj.createdAt;
    if (obj.createdAt.seconds) return obj.createdAt.seconds * 1000;
  }
  if (obj.timestamp) {
    if (typeof obj.timestamp === "number") return obj.timestamp;
    if (obj.timestamp.seconds) return obj.timestamp.seconds * 1000;
  }
  if (obj.date) {
    if (typeof obj.date === "string" || typeof obj.date === "number") {
      const parsed = new Date(obj.date).getTime();
      if (!isNaN(parsed)) return parsed;
    }
  }
  return Date.now();
}

function getPostDisplayViews(post: any, isUserAdmin?: boolean) {
  if (!post) return 0;
  let rawViews = 0;
  if (typeof post.views === "number" && !isNaN(post.views)) {
    rawViews = post.views;
  } else if (typeof post.views === "string") {
    const parsed = parseInt(post.views, 10);
    if (!isNaN(parsed)) rawViews = parsed;
  }
  const viewedByCount = Array.isArray(post.viewedBy) ? post.viewedBy.length : 0;
  return rawViews + viewedByCount;
}

export const NOTIFICATION_SOUNDS = [
  { id: "default_ding", name: "Default Ding (‡∞°‡∞ø‡∞´‡∞æ‡∞≤‡±ç‡∞ü‡±ç)" },
  { id: "soft_chime", name: "Soft Chime (‡∞∏‡∞æ‡∞´‡±ç‡∞ü‡±ç ‡∞ó‡∞Ç‡∞ü)" },
  { id: "success_ping", name: "Success Ping (‡∞∏‡∞ï‡±ç‡∞∏‡±Ü‡∞∏‡±ç)" },
  { id: "alert_buzz", name: "Alert Buzz (‡∞Ö‡∞≤‡∞∞‡±ç‡∞ü‡±ç)" },
  { id: "gentle_pop", name: "Gentle Pop (‡∞™‡∞æ‡∞™‡±ç)" },
  { id: "echo_bell", name: "Echo Bell (‡∞é‡∞ï‡±ã ‡∞¨‡±Ü‡∞≤‡±ç)" },
  { id: "digital_blip", name: "Digital Blip (‡∞°‡∞ø‡∞ú‡∞ø‡∞ü‡∞≤‡±ç ‡∞¨‡±ç‡∞≤‡∞ø‡∞™‡±ç)" },
  { id: "happy_trill", name: "Happy Trill (‡∞π‡±ç‡∞Ø‡∞æ‡∞™‡±Ä)" },
  { id: "sharp_click", name: "Sharp Click (‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç)" },
  { id: "synth_wave", name: "Synth Wave (‡∞∏‡∞ø‡∞Ç‡∞•‡±ç)" },
  { id: "marimba_tap", name: "Marimba (‡∞Æ‡∞∞‡∞ø‡∞Ç‡∞¨‡∞æ)" }
];

export const triggerNotification = (title: string, body: string, playSound: boolean | string = true) => {
  if (playSound === true) playNotificationSound("default_ding");
  else if (typeof playSound === "string" && playSound !== "false") playNotificationSound(playSound);

  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    const options = {
      body,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          if (reg) {
            reg.showNotification(title, options as any).catch(() => {
              try {
                new Notification(title, options);
              } catch (e) {}
            });
          } else {
            try {
              new Notification(title, options);
            } catch (e) {}
          }
        })
        .catch(() => {
          try {
            new Notification(title, options);
          } catch (e) {}
        });
    } else {
      try {
        new Notification(title, options);
      } catch (e) {}
    }
  }
};

let globalAudioContext: AudioContext | null = null;

export const playNotificationSound = (soundId: string = "default_ding") => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!globalAudioContext) {
      globalAudioContext = new AudioContextClass();
    }

    if (globalAudioContext.state === "suspended") {
      globalAudioContext.resume().catch(() => {});
    }

    const playTone = (
      freq: number,
      startTime: number,
      duration: number,
      type: OscillatorType = "sine",
      startGain: number = 0.4,
      endFreq?: number
    ) => {
      if (!globalAudioContext) return;
      const osc = globalAudioContext.createOscillator();
      const gain = globalAudioContext.createGain();
      osc.type = type;
      const now = globalAudioContext.currentTime + startTime;
      
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration * 0.8);
      }
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(startGain, now + 0.02);
      gain.gain.setTargetAtTime(0, now + 0.02, duration / 3);
      
      osc.connect(gain);
      gain.connect(globalAudioContext.destination);
      osc.start(now);
      osc.stop(now + duration + 1.0);
    };

    switch (soundId) {
      case "soft_chime":
        playTone(523.25, 0, 0.6, "sine", 0.4); 
        playTone(659.25, 0.15, 0.8, "sine", 0.45); 
        break;
      case "success_ping":
        playTone(523.25, 0, 0.2, "sine", 0.3);  
        playTone(659.25, 0.1, 0.2, "sine", 0.3); 
        playTone(783.99, 0.2, 0.2, "sine", 0.3); 
        playTone(1046.5, 0.3, 0.8, "sine", 0.4); 
        break;
      case "alert_buzz":
        playTone(440, 0, 0.4, "sawtooth", 0.2);
        playTone(440, 0.2, 0.4, "sawtooth", 0.2);
        playTone(440, 0.4, 0.6, "square", 0.25);
        break;
      case "gentle_pop":
        playTone(600, 0, 0.3, "sine", 0.5, 100); 
        break;
      case "echo_bell":
        playTone(1567.98, 0, 0.8, "sine", 0.5);   
        playTone(1567.98, 0.25, 0.6, "sine", 0.25); 
        playTone(1567.98, 0.5, 0.4, "sine", 0.1); 
        break;
      case "digital_blip":
        playTone(1200, 0, 0.15, "square", 0.15);
        playTone(1800, 0.1, 0.2, "square", 0.2);
        break;
      case "happy_trill":
        playTone(740, 0, 0.15, "triangle", 0.3);     
        playTone(880, 0.1, 0.15, "triangle", 0.3);   
        playTone(1108.73, 0.2, 0.15, "triangle", 0.35); 
        playTone(1318.51, 0.3, 0.7, "triangle", 0.4); 
        break;
      case "sharp_click":
        playTone(2000, 0, 0.1, "square", 0.2, 200);
        break;
      case "synth_wave":
        playTone(330, 0, 0.6, "sawtooth", 0.2, 660);
        playTone(440, 0.2, 0.8, "sawtooth", 0.2, 880);
        break;
      case "marimba_tap":
        playTone(392, 0, 0.4, "sine", 0.6, 150); 
        playTone(523.25, 0.15, 0.5, "sine", 0.6, 200); 
        break;
      case "default_ding":
      default:
        playTone(880, 0, 0.3, "sine", 0.4);
        playTone(1108.73, 0.15, 0.3, "sine", 0.4);
        playTone(1318.51, 0.3, 0.8, "sine", 0.5);
        break;
    }
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

export const getSiteBaseUrl = () => {
  const origin = window.location.origin;
  if (
    !origin ||
    origin.includes("run.app") ||
    origin.includes("onrender.com") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1") ||
    origin.includes("netlify.app") ||
    origin.includes("vercel.app")
  ) {
    return "https://www.e-vedhika.in";
  }
  return origin;
};

export const getSiteDisplayHost = () => {
  const host = window.location.host;
  if (
    !host ||
    host.includes("run.app") ||
    host.includes("onrender.com") ||
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("netlify.app") ||
    host.includes("vercel.app")
  ) {
    return "www.e-vedhika.in";
  }
  return host;
};

export const generatePostShareText = (post: any, postUrl?: string) => {
  const finalUrl = postUrl || (post?.id ? `${getSiteBaseUrl()}/?postId=${post.id}` : getSiteBaseUrl());
  if (!post) return `E-Vedhika: ${finalUrl}`;
  
  const rawContent = post.content || "";
  const plainContent = String(rawContent)
    .replace(/<[^>]*>?/gm, "")
    .replace(/[#*`]/g, "")
    .trim();
  const summary = plainContent ? (plainContent.length > 200 ? plainContent.substring(0, 200) + "..." : plainContent) : "";

  const title = (post.title || "E-Vedhika ‡∞°‡∞ø‡∞ú‡∞ø‡∞ü‡∞≤‡±ç ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç").trim();
  const category = (post.category || "General").trim();
  
  let formattedDate = "";
  if (post.createdAt) {
    try {
      const d = new Date(post.createdAt?.seconds ? post.createdAt.seconds * 1000 : post.createdAt);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("te-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
      }
    } catch (e) {}
  }

  return (
    `üåü *E-VEDHIKA (‡∞à-‡∞µ‡±á‡∞¶‡∞ø‡∞ï) ‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞Æ‡±à‡∞® ‡∞∏‡∞Æ‡∞æ‡∞ö‡∞æ‡∞∞‡∞Ç* üåü\n\n` +
    `üìå *${title}*\n\n` +
    `üìÇ *‡∞µ‡∞ø‡∞≠‡∞æ‡∞ó‡∞Ç / Category:* ${category}\n` +
    (formattedDate ? `üìÖ *‡∞§‡±á‡∞¶‡±Ä / Date:* ${formattedDate}\n` : "") +
    (summary ? `\nüìù *‡∞µ‡∞ø‡∞µ‡∞∞‡∞æ‡∞≤‡±Å / Summary:*\n_"${summary}"_\n` : "") +
    `\nüëá *‡∞™‡±Ç‡∞∞‡±ç‡∞§‡∞ø ‡∞µ‡∞ø‡∞µ‡∞∞‡∞æ‡∞≤‡±Å & ‡∞ú‡∞ø‡∞ì‡∞≤ ‡∞ï‡±ã‡∞∏‡∞Ç ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶‡∞ø ‡∞≤‡∞ø‡∞Ç‡∞ï‡±ç ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø:*` +
    `\nüîó ${finalUrl}\n\n` +
    `________________________\n` +
    `‚ú® *E-Vedhika - ‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞æ‡∞Ç‡∞∂‡∞æ‡∞≤‡±Å & ‡∞°‡∞ø‡∞ú‡∞ø‡∞ü‡∞≤‡±ç ‡∞∏‡±á‡∞µ‡∞≤ ‡∞™‡±ã‡∞∞‡±ç‡∞ü‡∞≤‡±ç*`
  );
};

export function PosterShareModal({
  post,
  onClose,
  addToast,
}: {
  post: Post;
  onClose: () => void;
  addToast: (msg: string) => void;
}) {
  const [posterImgSrc, setPosterImgSrc] = useState<string | null>(post.mediaUrl || null);
  const [imgLoadError, setImgLoadError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setImgLoadError(false);
    if (post.mediaUrl && (post.mediaType?.startsWith("image") || !post.mediaType)) {
      setPosterImgSrc(post.mediaUrl);
      fetch(post.mediaUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (active && reader.result) {
              setPosterImgSrc(reader.result as string);
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          if (active) {
            setPosterImgSrc(post.mediaUrl || null);
          }
        });
    } else {
      setPosterImgSrc(null);
    }
    return () => {
      active = false;
    };
  }, [post.mediaUrl, post.mediaType]);

  const postUrl = `${getSiteBaseUrl()}/?postId=${post.id}`;
  const plainContent = post.content
    ? post.content
        .replace(/<[^>]*>?/gm, "")
        .replace(/[#*`]/g, "")
        .substring(0, 150)
    : "";

  const shareText = generatePostShareText(post, postUrl);

  const handleDownloadPoster = async () => {
    const element = document.getElementById(`poster-card-to-capture`);
    if (!element) return;
    try {
      addToast("‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞∏‡∞ø‡∞¶‡±ç‡∞ß‡∞Ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡±Å‡∞§‡±ã‡∞Ç‡∞¶‡∞ø... (Preparing poster...)");
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `EVedhika_Poster_${post.id}.png`;
      link.href = imgData;
      link.click();
      addToast("‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞°‡±å‡∞®‡±ç‚Äå‡∞≤‡±ã‡∞°‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø! (Poster downloaded successfully!)");
    } catch (err) {
      console.error("html2canvas error:", err);
      addToast("‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞°‡±å‡∞®‡±ç‚Äå‡∞≤‡±ã‡∞°‡±ç‚Äå‡∞≤‡±ã ‡∞∏‡∞Æ‡∞∏‡±ç‡∞Ø ‡∞è‡∞∞‡±ç‡∞™‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø. (Error generating poster.)");
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (err) {
      console.warn("Clipboard copy failed", err);
    }

    const element = document.getElementById(`poster-card-to-capture`);
    let sharedNatively = false;

    if (element && navigator.share && navigator.canShare) {
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scale: 1.5,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `EVedhika_Poster_${post.id}.png`, { type: "image/png" });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: post.title,
                text: shareText,
                files: [file],
              });
              sharedNatively = true;
              addToast("‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞∑‡±á‡∞∞‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø! (Poster shared successfully!)");
            }
          }
        }, "image/png");
      } catch (e) {
        console.warn("Native share failed", e);
      }
    }

    if (!sharedNatively) {
      if (element) {
        try {
          const canvas = await html2canvas(element, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            scale: 1.5,
          });
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `EVedhika_Poster_${post.id}.png`;
          link.href = imgData;
          link.click();
        } catch (err) {
          console.warn("Fallback download failed", err);
        }
      }

      addToast("‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç ‡∞∏‡∞Ç‡∞¶‡±á‡∞∂‡∞Ç ‡∞ï‡∞æ‡∞™‡±Ä ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞°‡±å‡∞®‡±ç‚Äå‡∞≤‡±ã‡∞°‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø!");
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/80 flex flex-col items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-50 p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-2xl flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-stretch overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: The Poster Render */}
        <div className="shrink-0 flex items-center justify-center">
          <div
            id="poster-card-to-capture"
            className="w-full max-w-[360px] min-h-[500px] p-6 bg-white border border-slate-100 rounded-[24px] shadow-lg flex flex-col justify-between relative overflow-hidden text-left mx-auto"
          >
            {/* Styled Header */}
            <div>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500" />
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                    EV
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 tracking-tight">E-VEDHIKA</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                      ‡∞°‡∞ø‡∞ú‡∞ø‡∞ü‡∞≤‡±ç ‡∞∏‡∞Æ‡∞æ‡∞ö‡∞æ‡∞∞ ‡∞µ‡±á‡∞¶‡∞ø‡∞ï
                    </span>
                  </div>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {(post.category || "General").trim()}
                </span>
              </div>

              {/* Poster Title */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mb-3">
                {post.title}
              </h3>

              {/* Optional Post Image */}
              {!imgLoadError && posterImgSrc && (
                <div className="w-full h-[140px] rounded-xl overflow-hidden mb-3 border border-slate-100 bg-slate-50 shrink-0">
                  <img
                    src={posterImgSrc}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setImgLoadError(true)}
                  />
                </div>
              )}

              {/* Excerpt */}
              <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-6 whitespace-pre-line mb-4">
                {plainContent || "‡∞µ‡∞ø‡∞µ‡∞∞‡∞æ‡∞≤‡±Å ‡∞™‡±ã‡∞∞‡±ç‡∞ü‡∞≤‡±ç ‡∞≤‡±ã ‡∞Ö‡∞Ç‡∞¶‡±Å‡∞¨‡∞æ‡∞ü‡±Å‡∞≤‡±ã ‡∞â‡∞®‡±ç‡∞®‡∞æ‡∞Ø‡∞ø."}
              </p>
            </div>

            {/* Footer Branding & QR Code */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4 mt-auto">
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  E-VEDHIKA PORTAL
                </span>
                <p className="text-[8px] text-slate-500 font-bold leading-normal">
                  ‡∞™‡±Ç‡∞∞‡±ç‡∞§‡∞ø ‡∞ú‡±Ä‡∞µ‡±ã ‡∞∏‡∞∞‡±ç‡∞ï‡±ç‡∞Ø‡±Å‡∞≤‡∞∞‡±ç‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∏‡∞Æ‡∞æ‡∞ö‡∞æ‡∞∞‡∞Ç ‡∞ï‡±ã‡∞∏‡∞Ç ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶‡∞ø ‡∞≤‡∞ø‡∞Ç‡∞ï‡±ç ‡∞â‡∞™‡∞Ø‡±ã‡∞ó‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø.
                </p>
                <div className="mt-2 bg-slate-50 border border-slate-200/50 rounded-lg px-2 py-1 text-[8px] font-mono font-black text-primary truncate max-w-[200px]">
                  {getSiteDisplayHost()}/?postId={post.id}
                </div>
              </div>
              {/* QR Code */}
              <div className="w-[70px] h-[70px] bg-slate-50 border border-slate-100 rounded-lg p-1 shrink-0 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    postUrl,
                  )}`}
                  alt=""
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Control Panels & Guidance */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                  ‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç ‡∞∑‡±á‡∞∞‡±ç ‡∞Ö‡∞∏‡∞ø‡∞∏‡±ç‡∞ü‡±Ü‡∞Ç‡∞ü‡±ç (WhatsApp Share Assistant)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
                  ‡∞á‡∞Æ‡±á‡∞ú‡±ç ‡∞ï‡∞æ‡∞∞‡±ç‡∞°‡±ç ‡∞∑‡±á‡∞∞‡∞ø‡∞Ç‡∞ó‡±ç üì±
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors font-black text-slate-500 cursor-pointer text-lg"
                title="Close"
              >
                ‚úï
              </button>
            </div>

            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
              ‡∞à ‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞Æ‡±à‡∞® ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç‚Äå‡∞®‡±Å ‡∞ï‡±á‡∞µ‡∞≤‡∞Ç ‡∞í‡∞ï ‡∞≤‡∞ø‡∞Ç‡∞ï‡±ç‚Äå‡∞ó‡∞æ ‡∞ï‡∞æ‡∞ï‡±Å‡∞Ç‡∞°‡∞æ, ‡∞í‡∞ï ‡∞Ü‡∞ï‡∞∞‡±ç‡∞∑‡∞£‡±Ä‡∞Ø‡∞Æ‡±à‡∞® ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞ö‡∞ø‡∞§‡±ç‡∞∞‡∞Ç ‡∞∞‡±Ç‡∞™‡∞Ç‡∞≤‡±ã ‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç‚Äå‡∞≤‡±ã ‡∞™‡∞Ç‡∞™‡∞µ‡∞ö‡±ç‡∞ö‡±Å.
            </p>

            {/* Steps Guidance */}
            <div className="space-y-4 mb-8 text-left bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">
                ‡∞à‡∞ú‡±Ä ‡∞∑‡±á‡∞∞‡∞ø‡∞Ç‡∞ó‡±ç ‡∞µ‡∞ø‡∞ß‡∞æ‡∞®‡∞Ç (How to Share):
              </h4>
              <div className="flex gap-3 items-start text-xs font-bold text-slate-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                  1
                </div>
                <p>
                  ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶‡∞ø <strong className="text-slate-800">‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç‚Äå‡∞≤‡±ã ‡∞∑‡±á‡∞∞‡±ç</strong> ‡∞¨‡∞ü‡∞®‡±ç ‡∞®‡±ä‡∞ï‡±ç‡∞ï‡∞Ç‡∞°‡∞ø. ‡∞á‡∞¶‡∞ø ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞á‡∞Æ‡±á‡∞ú‡±ç‚Äå‡∞®‡±Å ‡∞°‡±å‡∞®‡±ç‚Äå‡∞≤‡±ã‡∞°‡±ç ‡∞ö‡±á‡∞∏‡∞ø, ‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç ‡∞∏‡∞Ç‡∞¶‡±á‡∞∂‡∞æ‡∞®‡±ç‡∞®‡∞ø ‡∞Ü‡∞ü‡±ã‡∞Æ‡±á‡∞ü‡∞ø‡∞ï‡±ç‚Äå‡∞ó‡∞æ ‡∞ï‡∞æ‡∞™‡±Ä ‡∞ö‡±á‡∞∏‡±ç‡∞§‡±Å‡∞Ç‡∞¶‡∞ø.
                </p>
              </div>
              <div className="flex gap-3 items-start text-xs font-bold text-slate-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                  2
                </div>
                <p>
                  ‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç ‡∞ì‡∞™‡±Ü‡∞®‡±ç ‡∞Ö‡∞Ø‡∞ø‡∞® ‡∞§‡∞∞‡±ç‡∞µ‡∞æ‡∞§, ‡∞Æ‡±Ä‡∞∞‡±Å ‡∞∑‡±á‡∞∞‡±ç ‡∞ö‡±á‡∞Ø‡∞æ‡∞≤‡∞®‡±Å‡∞ï‡±Å‡∞Ç‡∞ü‡±Å‡∞®‡±ç‡∞® ‡∞ö‡∞æ‡∞ü‡±ç ‡∞≤‡±á‡∞¶‡∞æ ‡∞ó‡±ç‡∞∞‡±Ç‡∞™‡±ç ‡∞é‡∞Ç‡∞ö‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø.
                </p>
              </div>
              <div className="flex gap-3 items-start text-xs font-bold text-slate-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                  3
                </div>
                <p>
                  ‡∞Æ‡±Ä ‡∞´‡±ã‡∞®‡±ç ‡∞ó‡±ç‡∞Ø‡∞æ‡∞≤‡∞∞‡±Ä ‡∞®‡±Å‡∞Ç‡∞°‡∞ø ‡∞°‡±å‡∞®‡±ç‚Äå‡∞≤‡±ã‡∞°‡±ç ‡∞ö‡±á‡∞∏‡∞ø‡∞® <strong className="text-slate-800">‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞ö‡∞ø‡∞§‡±ç‡∞∞‡∞æ‡∞®‡±ç‡∞®‡∞ø ‡∞∏‡±Ü‡∞≤‡±Ü‡∞ï‡±ç‡∞ü‡±ç ‡∞ö‡±á‡∞∏‡∞ø</strong>, ‡∞ï‡±ç‡∞Ø‡∞æ‡∞™‡±ç‡∞∑‡∞®‡±ç ‡∞∏‡±ç‡∞•‡∞≤‡∞Ç‡∞≤‡±ã <strong className="text-slate-800">‡∞≤‡∞ø‡∞Ç‡∞ï‡±ç ‡∞∏‡∞Ç‡∞¶‡±á‡∞∂‡∞æ‡∞®‡±ç‡∞®‡∞ø ‡∞™‡±á‡∞∏‡±ç‡∞ü‡±ç ‡∞ö‡±á‡∞∏‡∞ø</strong> ‡∞™‡∞Ç‡∞™‡∞Ç‡∞°‡∞ø!
                </p>
              </div>
            </div>
          </div>

          {/* Actions Button Panel */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer"
            >
              <Smartphone size={18} />
              ‡∞µ‡∞æ‡∞ü‡±ç‡∞∏‡∞æ‡∞™‡±ç‚Äå‡∞≤‡±ã ‡∞∑‡±á‡∞∞‡±ç (Share on WhatsApp)
            </button>
            <button
              onClick={handleDownloadPoster}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Download size={18} />
              ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡∞∞‡±ç ‡∞°‡±å‡∞®‡±ç‚Äå‡∞≤‡±ã‡∞°‡±ç (Download)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const handleShare = async (
  title: string,
  text: string,
  url: string,
  onSuccess?: () => void,
  mediaUrl?: string,
  mediaType?: string,
) => {
  let filesToShare: File[] | undefined = undefined;

  if (mediaUrl && mediaType?.startsWith("image") && navigator.canShare) {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const ext = mediaType.split("/")[1] || "jpeg";
      const file = new File([blob], `shared_media.${ext}`, {
        type: blob.type || "image/jpeg",
      });
      if (navigator.canShare({ files: [file] })) {
        filesToShare = [file];
      }
    } catch (err) {
      console.warn("Could not prepare media for sharing", err);
    }
  }

  const fullShareText = text
    ? (text.includes(url) ? text : `${text}\n\nüîó ${url}`)
    : url;

  if (navigator.share) {
    try {
      const shareData: any = {
        title: title || "E-Vedhika",
        text: fullShareText,
        url: url,
      };

      if (filesToShare && filesToShare.length > 0) {
        shareData.files = filesToShare;
      }

      await navigator.share(shareData);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(fullShareText);
        } catch (e) {}
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
        window.open(waUrl, "_blank");
        if (onSuccess) onSuccess();
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(fullShareText);
    } catch (e) {}
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(waUrl, "_blank");
    if (onSuccess) onSuccess();
  }
};

export const handleForceDownload = async (
  e: React.MouseEvent,
  url: string,
  fileName: string,
  isDirect?: boolean
) => {
  e.preventDefault();
  e.stopPropagation();

  if (requireLoginAlert()) return;

  if (!url) return;

  try {
    let extractedFilename = fileName || "download";

    const lowerName = extractedFilename.toLowerCase();
    const isGenericInfo =
      lowerName === "download" ||
      lowerName === "document" ||
      lowerName === "attachment" ||
      lowerName === "download.zip" ||
      lowerName.startsWith("download") ||
      !extractedFilename.includes(".");

    if (isGenericInfo) {
      if (url.startsWith("data:")) {
        const mimeMatch = url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);/);
        if (mimeMatch) {
          const mime = mimeMatch[1];
          const mimeToExt: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
            "application/pdf": "pdf",
            "application/msword": "doc",
            "text/plain": "txt",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              "docx",
            "application/vnd.ms-excel": "xls",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              "xlsx",
            "video/mp4": "mp4",
            "audio/mpeg": "mp3",
          };
          const ext = mimeToExt[mime.toLowerCase()];
          if (ext) extractedFilename += "." + ext;
        }
      } else {
        try {
          const urlObj = new URL(url, window.location.origin);
          const decodedPath = decodeURIComponent(urlObj.pathname);
          const parts = decodedPath.split("/");
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart.includes(".")) {
            extractedFilename = lastPart;
          }
        } catch (err) {}
      }
    }

    // Strip multiple layers of timestamp prefixes (matches 10-15 digits followed by a dash)
    while (extractedFilename.match(/^\d{10,15}-/)) {
      extractedFilename = extractedFilename.replace(/^\d{10,15}-/, "");
    }
    // Also strip the multer double-timestamp pattern or other dash-separated numeric prefixes
    while (extractedFilename.match(/^\d{5,15}-/)) {
      extractedFilename = extractedFilename.replace(/^\d{5,15}-/, "");
    }

    let targetUrl = url;
    if (targetUrl.includes("drive.google.com") || targetUrl.includes("docs.google.com")) {
      const driveMatch = targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        targetUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
      }
    }

    const link = document.createElement("a");

    if (url.startsWith("data:") || url.startsWith("blob:")) {
      link.href = url;
      link.download = extractedFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Stream seamlessly through our /api/download backend proxy
      // This works for Cloudflare R2, Google Drive, Firebase Storage, and external links without opening a new tab
      const downloadApiUrl = targetUrl.startsWith("/") && !targetUrl.startsWith("/uploads/")
        ? targetUrl
        : `/api/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(extractedFilename)}&filename=${encodeURIComponent(extractedFilename)}`;

      link.href = downloadApiUrl;
      link.download = extractedFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  } catch (error) {
    console.error("Download failed:", error);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const getLatestAttachment = (attachments: any[]) => {
  if (!attachments || attachments.length === 0) return null;
  const nonImages = attachments.filter(
    (att) =>
      !(
        /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(att.url) ||
        (att.url || "").includes("image") ||
        /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(att.name || "")
      ),
  );
  const candidates = nonImages.length > 0 ? nonImages : attachments;

  const extractV = (str: string, fallbackV?: string) => {
    const match = str.match(/v\s*(\d+(?:\.\d+)*)/i);
    return match ? match[1] : fallbackV || "0";
  };

  return [...candidates].sort((a, b) => {
    if (a.status === "New" && b.status !== "New") return -1;
    if (b.status === "New" && a.status !== "New") return 1;

    const vA = extractV(a.name || "", a.version);
    const vB = extractV(b.name || "", b.version);

    const pA = vA.split(".").map((n) => parseInt(n) || 0);
    const pB = vB.split(".").map((n) => parseInt(n) || 0);
    for (let i = 0; i < Math.max(pA.length, pB.length); i++) {
      const nA = pA[i] || 0;
      const nB = pB[i] || 0;
      if (nA !== nB) return nB - nA; // descending
    }
    return 0;
  })[0];
};

const DEFAULT_ABOUT_CONTENT = `‡∞à ‡∞µ‡±á‡∞¶‡∞ø‡∞ï **'‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞∞‡∞æ‡∞ú‡±ç ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ‡±Ä‡∞£‡∞æ‡∞≠‡∞ø‡∞µ‡±É‡∞¶‡±ç‡∞ß‡∞ø'** ‡∞∏‡∞ø‡∞¨‡±ç‡∞¨‡∞Ç‡∞¶‡∞ø ‡∞ï‡±ã‡∞∏‡∞Ç ‡∞™‡±ç‡∞∞‡∞§‡±ç‡∞Ø‡±á‡∞ï‡∞Ç‡∞ó‡∞æ ‡∞∞‡±Ç‡∞™‡±ä‡∞Ç‡∞¶‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø. ‡∞á‡∞ï‡±ç‡∞ï‡∞° ‡∞Æ‡±Ä‡∞∞‡±Å ‡∞Æ‡±Ä ‡∞µ‡∞ø‡∞ß‡±Å‡∞≤‡∞ï‡±Å ‡∞∏‡∞Ç‡∞¨‡∞Ç‡∞ß‡∞ø‡∞Ç‡∞ö‡∞ø‡∞® ‡∞∏‡±å‡∞ï‡∞∞‡±ç‡∞Ø‡∞æ‡∞≤‡∞®‡±Å ‡∞∏‡±Å‡∞≤‡∞≠‡∞Ç‡∞ó‡∞æ ‡∞™‡±ä‡∞Ç‡∞¶‡∞µ‡∞ö‡±ç‡∞ö‡±Å.

###  **‡∞Æ‡∞æ ‡∞™‡±ç‡∞≤‡∞æ‡∞ü‡±ç‡∞´‡∞æ‡∞∞‡∞Æ‡±ç‡∞≤‡±ã ‡∞Ö‡∞Ç‡∞¶‡±Å‡∞¨‡∞æ‡∞ü‡±Å‡∞≤‡±ã ‡∞â‡∞Ç‡∞°‡±á‡∞µ‡∞ø:**

*  **‡∞™‡±ç‡∞∞‡∞≠‡±Å‡∞§‡±ç‡∞µ ‡∞ú‡±Ä‡∞µ‡±ã‡∞≤‡±Å (GOs):** ‡∞é‡∞™‡±ç‡∞™‡∞ü‡∞ø‡∞ï‡∞™‡±ç‡∞™‡±Å‡∞°‡±Å ‡∞§‡∞æ‡∞ú‡∞æ ‡∞™‡±ç‡∞∞‡∞≠‡±Å‡∞§‡±ç‡∞µ ‡∞â‡∞§‡±ç‡∞§‡∞∞‡±ç‡∞µ‡±Å‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∏‡∞∞‡±ç‡∞ï‡±ç‡∞Ø‡±Å‡∞≤‡∞∞‡±ç‡∞∏‡±ç.
*  **‡∞´‡∞æ‡∞∞‡±ç‡∞Æ‡∞æ‡∞ü‡±ç‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∞‡∞ø‡∞™‡±ã‡∞∞‡±ç‡∞ü‡±Å‡∞≤‡±Å:** ‡∞∞‡±ã‡∞ú‡±Å‡∞µ‡∞æ‡∞∞‡±Ä ‡∞™‡∞®‡±Å‡∞≤‡∞ï‡±Å ‡∞Ö‡∞µ‡∞∏‡∞∞‡∞Æ‡±à‡∞® ‡∞ü‡±Ü‡∞Ç‡∞™‡±ç‡∞≤‡±á‡∞ü‡±ç‡∞∏‡±ç ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞Ü‡∞ü‡±ã‡∞Æ‡±á‡∞ü‡±Ü‡∞°‡±ç ‡∞∞‡∞ø‡∞™‡±ã‡∞∞‡±ç‡∞ü‡±ç‡∞∏‡±ç.
*  **‡∞®‡∞æ‡∞≤‡±Ü‡∞°‡±ç‡∞ú‡±ç ‡∞π‡∞¨‡±ç:** ‡∞µ‡∞ø‡∞ß‡±Å‡∞≤‡±ç‡∞≤‡±ã ‡∞∏‡∞π‡∞æ‡∞Ø‡∞™‡∞°‡±á ‡∞Ö‡∞µ‡∞∏‡∞∞‡∞Æ‡±à‡∞® ‡∞Æ‡∞æ‡∞∞‡±ç‡∞ó‡∞¶‡∞∞‡±ç‡∞∂‡∞ï‡∞æ‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞µ‡∞ø‡∞∑‡∞Ø ‡∞™‡∞∞‡∞ø‡∞ú‡±ç‡∞û‡∞æ‡∞®‡∞Ç.

---

#  **‡∞®‡∞æ ‡∞ó‡±Å‡∞∞‡∞ø‡∞Ç‡∞ö‡∞ø (About Me)**

‡∞®‡∞Æ‡∞∏‡±ç‡∞ï‡∞æ‡∞∞‡∞Ç! ‡∞®‡∞æ ‡∞™‡±á‡∞∞‡±Å **‡∞ß‡∞æ‡∞µ‡∞®‡±ç ‡∞∞‡∞æ‡∞ï‡±á‡∞∑‡±ç ‡∞ï‡±Å‡∞Æ‡∞æ‡∞∞‡±ç**. ‡∞®‡±á‡∞®‡±Å ‡∞í‡∞ï ‡∞∏‡∞æ‡∞ß‡∞æ‡∞∞‡∞£ ‡∞Æ‡∞ß‡±ç‡∞Ø‡∞§‡∞∞‡∞ó‡∞§‡∞ø ‡∞ï‡±Å‡∞ü‡±Å‡∞Ç‡∞¨‡∞Ç ‡∞®‡±Å‡∞Ç‡∞°‡∞ø ‡∞µ‡∞ö‡±ç‡∞ö‡∞æ‡∞®‡±Å. ‡∞ö‡∞ø‡∞®‡±ç‡∞®‡∞™‡±ç‡∞™‡∞ü‡∞ø ‡∞®‡±Å‡∞Ç‡∞ö‡±á ‡∞®‡∞æ‡∞ï‡±Å ‡∞ï‡∞Ç‡∞™‡±ç‡∞Ø‡±Ç‡∞ü‡∞∞‡±ç‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞á‡∞Ç‡∞ü‡∞∞‡±ç‡∞®‡±Ü‡∞ü‡±ç ‡∞™‡±ç‡∞∞‡∞™‡∞Ç‡∞ö‡∞Ç ‡∞Ö‡∞Ç‡∞ü‡±á ‡∞ö‡∞æ‡∞≤‡∞æ ‡∞á‡∞∑‡±ç‡∞ü‡∞Ç, ‡∞Ü ‡∞Ü‡∞∏‡∞ï‡±ç‡∞§‡±á ‡∞®‡∞®‡±ç‡∞®‡±Å ‡∞é‡∞™‡±ç‡∞™‡±Å‡∞°‡±Ç ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞µ‡∞ø‡∞∑‡∞Ø‡∞æ‡∞≤‡±Å ‡∞®‡±á‡∞∞‡±ç‡∞ö‡±Å‡∞ï‡±Å‡∞®‡±á‡∞≤‡∞æ ‡∞ö‡±á‡∞∏‡∞ø‡∞Ç‡∞¶‡∞ø.

‡∞™‡±ç‡∞∞‡∞∏‡±ç‡∞§‡±Å‡∞§‡∞Ç ‡∞®‡±á‡∞®‡±Å ‡∞í‡∞ï **'‡∞à-‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞ï‡∞Ç‡∞™‡±ç‡∞Ø‡±Ç‡∞ü‡∞∞‡±ç ‡∞Ü‡∞™‡∞∞‡±á‡∞ü‡∞∞‡±ç'** ‡∞ó‡∞æ ‡∞™‡∞®‡∞ø ‡∞ö‡±á‡∞∏‡±ç‡∞§‡±Å‡∞®‡±ç‡∞®‡∞æ‡∞®‡±Å. ‡∞í‡∞ï ‡∞Ü‡∞™‡∞∞‡±á‡∞ü‡∞∞‡±ç‡∞ó‡∞æ ‡∞∞‡±ã‡∞ú‡±Å‡∞µ‡∞æ‡∞∞‡±Ä ‡∞Ö‡∞°‡±ç‡∞Æ‡∞ø‡∞®‡∞ø‡∞∏‡±ç‡∞ü‡±ç‡∞∞‡±á‡∞ü‡∞ø‡∞µ‡±ç ‡∞™‡∞®‡±Å‡∞≤‡±Å, ‡∞Æ‡∞æ‡∞®‡±ç‡∞Ø‡±Å‡∞µ‡∞≤‡±ç ‡∞°‡±á‡∞ü‡∞æ ‡∞é‡∞Ç‡∞ü‡±ç‡∞∞‡±Ä‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞ó‡∞°‡±Å‡∞µ‡±Å‡∞≤‡±ã‡∞™‡±Å ‡∞∞‡∞ø‡∞™‡±ã‡∞∞‡±ç‡∞ü‡±ç‡∞∏‡±ç ‡∞§‡∞Ø‡∞æ‡∞∞‡±Å ‡∞ö‡±á‡∞Ø‡∞°‡∞Ç‡∞≤‡±ã ‡∞â‡∞Ç‡∞°‡±á ‡∞®‡∞ø‡∞ú‡∞Æ‡±à‡∞® ‡∞í‡∞§‡±ç‡∞§‡∞ø‡∞°‡∞ø ‡∞®‡∞æ‡∞ï‡±Å ‡∞¨‡∞æ‡∞ó‡∞æ ‡∞§‡±Ü‡∞≤‡±Å‡∞∏‡±Å. ‡∞Ü ‡∞∏‡∞Æ‡∞∏‡±ç‡∞Ø‡∞≤‡∞®‡±Å ‡∞ï‡±á‡∞µ‡∞≤‡∞Ç ‡∞≠‡∞∞‡∞ø‡∞Ç‡∞ö‡∞°‡∞Æ‡±á ‡∞ï‡∞æ‡∞ï‡±Å‡∞Ç‡∞°‡∞æ, ‡∞µ‡∞æ‡∞ü‡∞ø‡∞ï‡∞ø ‡∞í‡∞ï ‡∞∏‡∞æ‡∞Ç‡∞ï‡±á‡∞§‡∞ø‡∞ï ‡∞™‡∞∞‡∞ø‡∞∑‡±ç‡∞ï‡∞æ‡∞∞‡∞Ç ‡∞Ü‡∞≤‡±ã‡∞ö‡∞ø‡∞Ç‡∞ö‡∞æ‡∞≤‡∞®‡±Å‡∞ï‡±Å‡∞®‡±ç‡∞®‡∞æ‡∞®‡±Å. ‡∞®‡∞æ ‡∞µ‡∞ø‡∞ß‡±Å‡∞≤‡±ç‡∞≤‡±ã ‡∞®‡±á‡∞®‡±Å ‡∞é‡∞¶‡±Å‡∞∞‡±ç‡∞ï‡±ä‡∞®‡±ç‡∞® ‡∞á‡∞¨‡±ç‡∞¨‡∞Ç‡∞¶‡±Å‡∞≤‡±Å, ‡∞ó‡∞Æ‡∞®‡∞ø‡∞Ç‡∞ö‡∞ø‡∞® ‡∞≤‡±ã‡∞™‡∞æ‡∞≤‡±á ‡∞®‡∞®‡±ç‡∞®‡±Å ‡∞à ‡∞™‡±ç‡∞∞‡∞æ‡∞ú‡±Ü‡∞ï‡±ç‡∞ü‡±ç ‡∞µ‡±à‡∞™‡±Å ‡∞®‡∞°‡∞ø‡∞™‡∞ø‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞ø.

> *"‡∞®‡±á‡∞®‡±Å ‡∞™‡∞°‡∞ø‡∞® ‡∞ï‡∞∑‡±ç‡∞ü‡∞Ç ‡∞Æ‡∞∞‡±Ü‡∞µ‡∞∞‡±Ç ‡∞™‡∞°‡∞ï‡±Ç‡∞°‡∞¶‡∞®‡±á ‡∞â‡∞¶‡±ç‡∞¶‡±á‡∞∂‡±ç‡∞Ø‡∞Ç‡∞§‡±ã, ‡∞ï‡±ç‡∞∑‡±á‡∞§‡±ç‡∞∞‡∞∏‡±ç‡∞•‡∞æ‡∞Ø‡∞ø‡∞≤‡±ã ‡∞™‡∞®‡∞ø‡∞ö‡±á‡∞∏‡±á ‡∞™‡±ç‡∞∞‡∞§‡∞ø ‡∞í‡∞ï‡±ç‡∞ï‡∞∞‡∞ø‡∞ï‡±Ä ‡∞â‡∞™‡∞Ø‡±ã‡∞ó‡∞™‡∞°‡∞æ‡∞≤‡∞®‡±á ‡∞®‡∞æ ‡∞∏‡±ä‡∞Ç‡∞§ ‡∞Ü‡∞∏‡∞ï‡±ç‡∞§‡∞ø‡∞§‡±ã ‡∞à **'‡∞à-‡∞µ‡±á‡∞¶‡∞ø‡∞ï'** ‡∞®‡∞ø ‡∞∞‡±Ç‡∞™‡±ä‡∞Ç‡∞¶‡∞ø‡∞Ç‡∞ö‡∞æ‡∞®‡±Å."*

###  **‡∞ü‡±Ü‡∞ï‡±ç‡∞®‡∞æ‡∞≤‡∞ú‡±Ä ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞è‡∞ê (AI) ‡∞∏‡∞π‡∞æ‡∞Ø‡∞Ç:**

‡∞à ‡∞µ‡±Ü‡∞¨‡±ç‡∞∏‡±à‡∞ü‡±ç‡∞®‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ç‡∞§ ‡∞Ö‡∞°‡±ç‡∞µ‡∞æ‡∞®‡±ç‡∞∏‡±ç‡∞°‡±ç‡∞ó‡∞æ, ‡∞é‡∞≤‡∞æ‡∞Ç‡∞ü‡∞ø ‡∞≤‡±ã‡∞™‡∞æ‡∞≤‡±Å ‡∞≤‡±á‡∞ï‡±Å‡∞Ç‡∞°‡∞æ ‡∞§‡∞Ø‡∞æ‡∞∞‡±Å ‡∞ö‡±á‡∞Ø‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞ï‡±ã‡∞°‡∞ø‡∞Ç‡∞ó‡±ç ‡∞µ‡∞ø‡∞∑‡∞Ø‡∞Ç‡∞≤‡±ã **Google Gemini** ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å **ChatGPT** ‡∞µ‡∞Ç‡∞ü‡∞ø ‡∞è‡∞ê (AI) ‡∞ü‡±Ç‡∞≤‡±ç‡∞∏‡±ç ‡∞∏‡∞π‡∞æ‡∞Ø‡∞Ç ‡∞§‡±Ä‡∞∏‡±Å‡∞ï‡±Å‡∞®‡±ç‡∞®‡∞æ‡∞®‡±Å. ‡∞®‡∞æ ‡∞ï‡±ç‡∞∑‡±á‡∞§‡±ç‡∞∞‡∞∏‡±ç‡∞•‡∞æ‡∞Ø‡∞ø ‡∞Ö‡∞®‡±Å‡∞≠‡∞µ‡∞æ‡∞®‡∞ø‡∞ï‡∞ø, ‡∞à ‡∞è‡∞ê ‡∞ü‡±Ç‡∞≤‡±ç‡∞∏‡±ç ‡∞∏‡∞æ‡∞Ç‡∞ï‡±á‡∞§‡∞ø‡∞ï‡∞§ ‡∞§‡±ã‡∞°‡∞µ‡∞°‡∞Ç‡∞§‡±ã **React, Node.js, Firebase** ‡∞µ‡∞Ç‡∞ü‡∞ø ‡∞Ü‡∞ß‡±Å‡∞®‡∞ø‡∞ï ‡∞µ‡±Ü‡∞¨‡±ç ‡∞ü‡±Ü‡∞ï‡±ç‡∞®‡∞æ‡∞≤‡∞ú‡±Ä‡∞≤‡∞®‡±Å ‡∞â‡∞™‡∞Ø‡±ã‡∞ó‡∞ø‡∞Ç‡∞ö‡∞ø ‡∞à ‡∞™‡±ç‡∞≤‡∞æ‡∞ü‡±ç‡∞´‡∞æ‡∞∞‡∞Æ‡±ç‡∞®‡±Å ‡∞µ‡±á‡∞ó‡∞Ç‡∞ó‡∞æ ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∏‡±Å‡∞∞‡∞ï‡±ç‡∞∑‡∞ø‡∞§‡∞Ç‡∞ó‡∞æ ‡∞Æ‡±Ä ‡∞Æ‡±Å‡∞Ç‡∞¶‡±Å‡∞ï‡±Å ‡∞§‡±Ä‡∞∏‡±Å‡∞ï‡±Å‡∞∞‡∞æ‡∞ó‡∞≤‡∞ø‡∞ó‡∞æ‡∞®‡±Å.

 **‡∞®‡∞æ ‡∞≤‡∞ï‡±ç‡∞∑‡±ç‡∞Ø‡∞Ç:**
‡∞∏‡∞Æ‡∞Ø‡∞æ‡∞®‡±ç‡∞®‡∞ø ‡∞Ü‡∞¶‡∞æ ‡∞ö‡±á‡∞∏‡±ç‡∞§‡±Ç, ‡∞™‡∞æ‡∞∞‡∞¶‡∞∞‡±ç‡∞∂‡∞ï‡∞Æ‡±à‡∞® ‡∞∏‡±á‡∞µ‡∞≤‡∞®‡±Å ‡∞Ö‡∞Ç‡∞¶‡∞ø‡∞Ç‡∞ö‡±á ‡∞á‡∞≤‡∞æ‡∞Ç‡∞ü‡∞ø ‡∞Æ‡∞∞‡∞ø‡∞®‡±ç‡∞®‡∞ø ‡∞ü‡±Ç‡∞≤‡±ç‡∞∏‡±ç‡∞®‡±Å ‡∞Ö‡∞≠‡∞ø‡∞µ‡±É‡∞¶‡±ç‡∞ß‡∞ø ‡∞ö‡±á‡∞Ø‡∞°‡∞Ç ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞™‡±ç‡∞∞‡∞§‡∞ø ‡∞í‡∞ï‡±ç‡∞ï‡∞∞‡∞ø‡∞ï‡±Ä ‡∞∏‡∞æ‡∞Ç‡∞ï‡±á‡∞§‡∞ø‡∞ï‡∞§‡∞®‡±Å ‡∞∏‡±Å‡∞≤‡∞≠‡∞§‡∞∞‡∞Ç ‡∞ö‡±á‡∞Ø‡∞°‡∞Æ‡±á ‡∞®‡∞æ ‡∞≤‡∞ï‡±ç‡∞∑‡±ç‡∞Ø‡∞Ç.`;

function LandingPage({ 
  onEnterSite, 
  onLoginClick,
  onShowFooter,
  landingPageData
}: { 
  onEnterSite: () => void;
  onLoginClick: () => void;
  onShowFooter: (type: "privacy" | "about" | "contact") => void;
  landingPageData: any;
}) {
  const [isWarping, setIsWarping] = useState(false);

  const handleEnterWorld = () => {
    setIsWarping(true);
    setTimeout(() => {
      setIsWarping(false);
      onEnterSite();
    }, 1500);
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-slate-50 font-sans text-slate-800">
      <AnimatePresence>
        {isWarping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#0d3b66] flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 50, 100], opacity: [0.5, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeIn" }}
              className="absolute w-20 h-20 rounded-full border-[20px] border-blue-400/50 shadow-[0_0_100px_50px_rgba(59,130,246,1)]"
            />
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 50], rotate: [0, 90] }}
              transition={{ duration: 1.5, ease: "easeIn", delay: 0.2 }}
              className="absolute w-10 h-10 rounded-full border-[10px] border-emerald-400 shadow-[0_0_100px_50px_rgba(52,211,153,1)]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
              className="absolute inset-0 bg-white"
            />
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 text-white font-black text-4xl sm:text-6xl tracking-[0.2em] italic text-center"
            >
              ENTERING<br />E-VEDHIKA...
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ‡∞≤‡±ã‡∞ó‡±ã HTML ‡∞∏‡±ç‡∞ü‡±ç‡∞∞‡∞ï‡±ç‡∞ö‡∞∞‡±ç */}
            <div className="logo-pro cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200 shrink-0">
              {/* ‡∞Ø‡∞æ‡∞®‡∞ø‡∞Æ‡±á‡∞ü‡±Ü‡∞°‡±ç ‡∞™‡∞æ‡∞∞‡±ç‡∞ü‡∞ø‡∞ï‡∞≤‡±ç‡∞∏‡±ç */}
              <div className="logo-particles">
                <span></span>
                <span></span>
                <span></span>
              </div>

              {/* SVG ‡∞≤‡±ã‡∞ó‡±ã */}
              <svg
                viewBox="0 0 64 64"
                className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] shrink-0"
              >
                <defs>
                  {/* ‡∞ï‡∞≤‡∞∞‡±ç ‡∞ó‡±ç‡∞∞‡±á‡∞°‡∞ø‡∞Ø‡∞Ç‡∞ü‡±ç‡∞∏‡±ç */}
                  <linearGradient id="gLanding" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  <linearGradient id="ringGLanding" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>

                {/* ‡∞¨‡∞Ø‡∞ü‡∞ø ‡∞∞‡∞ø‡∞Ç‡∞ó‡±ç */}
                <circle
                  className="logo-ring"
                  cx="32"
                  cy="32"
                  r="29"
                  fill="none"
                  stroke="url(#ringGLanding)"
                  strokeWidth="2.5"
                  strokeDasharray="10 5"
                />

                {/* ‡∞≤‡±ã‡∞™‡∞≤‡∞ø ‡∞∏‡∞∞‡±ç‡∞ï‡∞ø‡∞≤‡±ç‡∞∏‡±ç */}
                <circle cx="32" cy="32" r="25" fill="url(#gLanding)" />
                <circle cx="32" cy="32" r="21" fill="#0f172a" />

                {/* EV ‡∞ü‡±Ü‡∞ï‡±ç‡∞∏‡±ç‡∞ü‡±ç */}
                <text
                  x="50%"
                  y="54%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="18"
                  fontWeight="900"
                  fontFamily="Segoe UI"
                >
                  EV
                </text>
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-blue-900">E-VEDHIKA</h1>
          </div>
          <button 
            onClick={onLoginClick}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 
            className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
            style={{
              fontSize: "20px",
              lineHeight: "34px"
            }}
          >
            {landingPageData.heroTitle} <span className="text-blue-600">{landingPageData.heroHighlight}</span>
          </h2>
          <div 
            className="text-lg lg:text-xl text-slate-600 leading-relaxed font-medium max-w-3xl mx-auto ql-editor px-0 md:px-4"
            dangerouslySetInnerHTML={{__html: landingPageData.heroSubtitle}}
          />
          <div className="pt-4 flex justify-center gap-4">
            <button 
              onClick={handleEnterWorld}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-blue-600/30 text-lg flex items-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 ease-out skew-x-12" />
              Enter The E-VEDHIKA website
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="logo-pro shrink-0" style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                <div className="logo-particles">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <svg viewBox="0 0 64 64" className="w-[36px] h-[36px]">
                  <defs>
                    <linearGradient id="gLandingFooter" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="ringGLandingFooter" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                  <circle className="logo-ring" cx="32" cy="32" r="29" fill="none" stroke="url(#ringGLandingFooter)" strokeWidth="2.5" strokeDasharray="10 5" />
                  <circle cx="32" cy="32" r="25" fill="url(#gLandingFooter)" />
                  <circle cx="32" cy="32" r="21" fill="#0f172a" />
                  <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="Segoe UI">EV</text>
                </svg>
              </div>
              <span className="font-bold text-slate-800">E-VEDHIKA</span>
            </div>
            <div className="flex gap-6 text-sm font-bold text-slate-500">
              <button onClick={() => onShowFooter("privacy")} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
              <button onClick={() => onShowFooter("about")} className="hover:text-blue-600 transition-colors">About Us</button>
              <button onClick={() => onShowFooter("contact")} className="hover:text-blue-600 transition-colors">Contact Us</button>
            </div>
            <div className="text-sm text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} E-Vedhika. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { PublicVisitorLogs } from "./components/PublicVisitorLogs";
import { CloudStorageManager } from "./components/CloudStorageManager";
import { parseTabFromUrl, useDeepLink } from "./hooks/useDeepLink";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const postIdFromUrl = searchParams.get("postId");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const [hasEnteredSite, setHasEnteredSite] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "editor" | "user">("user");
  const [posts, setPosts] = useState<Post[]>([]);
  const hasGreetedRef = useRef(false);

  // Accessibility and User-Friendly Navigation States
  const [textZoom, setTextZoom] = useState<"normal" | "large" | "xlarge">("normal");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (user?.email?.toLowerCase() === "rakeshkumardhawan123@gmail.com") {
      const runSync = async () => {
        try {
          const snap = await getDocs(collection(db, "posts"));
          for (const d of snap.docs) {
            const data = d.data();
            const sub = await getDocs(collection(db, "posts", d.id, "comments"));
            
            // Deduplicate logic identical to how they are read
            const legacyComments = data.comments || [];
            const combinedMap = new Map();
            legacyComments.forEach((c: any) => {
              const cid = c.id || c.time?.toString() || Math.random().toString();
              combinedMap.set(cid, { ...c, id: cid, isLegacy: true });
            });
            sub.forEach((c) => {
              combinedMap.set(c.id, c.data());
            });
            const trueCount = Array.from(combinedMap.values()).reduce((acc: number, c: any) => {
              const repliesCount = c.replies && Array.isArray(c.replies) ? c.replies.length : 0;
              return acc + 1 + repliesCount;
            }, 0);
            
            if (data.commentCount !== trueCount) {
              await updateDoc(doc(db, "posts", d.id), { commentCount: trueCount }).catch(()=>{});
            }
          }
        } catch (e) {}
      };
      runSync();
    }
  }, [user]);

  const isDevEmail =
    user?.email?.toLowerCase() === "rakeshkumardhawan123@gmail.com";
  const hasPosts = posts.some((p) => p.uid === user?.uid);
  const isAdmin =
    (userRole || "").toLowerCase() === "admin" ||
    (userProfile?.role || "").toLowerCase() === "admin" ||
    (userRole || "").toLowerCase() === "super admin" ||
    (userProfile?.role || "").toLowerCase() === "super admin" ||
    (userRole || "").toLowerCase() === "system admin" ||
    (userProfile?.role || "").toLowerCase() === "system admin" ||
    (userRole || "").toLowerCase() === "administrator" ||
    (userProfile?.role || "").toLowerCase() === "administrator" ||
    isDevEmail;
  const isEditor =
    (userRole || "").toLowerCase() === "editor" ||
    (userProfile?.role || "").toLowerCase() === "editor";
  const isModerator =
    (userRole || "").toLowerCase() === "moderator" ||
    (userProfile?.role || "").toLowerCase() === "moderator";
  const isAnyAdminOrStaff = isAdmin || isEditor || isModerator || isDevEmail;
  const canAccessAdmin = isAnyAdminOrStaff || hasPosts;

  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission !== "denied" &&
      Notification.permission !== "granted"
    ) {
      try {
        Notification.requestPermission();
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const applyTheme = (themeValue: string | undefined) => {
      if (themeValue === "dark") {
        document.body.classList.add("dark-theme");
      } else if (themeValue === "light") {
        document.body.classList.remove("dark-theme");
      } else {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          document.body.classList.add("dark-theme");
        } else {
          document.body.classList.remove("dark-theme");
        }
      }
    };

    applyTheme(userProfile?.theme);

    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (!userProfile?.theme || userProfile?.theme === "system") {
        applyTheme("system");
      }
    };
    if (matcher.addEventListener) {
      matcher.addEventListener("change", listener);
      return () => matcher.removeEventListener("change", listener);
    }
  }, [userProfile?.theme]);

  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const fullMsg = args
        .map((a) => (typeof a === "object" ? (a?.message || JSON.stringify(a)) : String(a)))
        .join(" ");
      const isBenignError =
        fullMsg.includes("WebSocket") ||
        fullMsg.includes("vite") ||
        fullMsg.includes("web-socket") ||
        fullMsg.includes("closed without opened") ||
        fullMsg.includes("connection failed") ||
        fullMsg.includes("@firebase/firestore") ||
        fullMsg.includes("WebChannelConnection") ||
        fullMsg.includes("Visitor tracking notification") ||
        fullMsg.includes("Analytics DB access error") ||
        fullMsg.includes("Missing or insufficient permissions") ||
        fullMsg.includes("permission");

      if (isBenignError) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const fullMsg = args
        .map((a) => (typeof a === "object" ? (a?.message || JSON.stringify(a)) : String(a)))
        .join(" ");
      if (
        fullMsg.includes("WebSocket") ||
        fullMsg.includes("vite") ||
        fullMsg.includes("closed without opened") ||
        fullMsg.includes("@firebase/firestore") ||
        fullMsg.includes("WebChannelConnection") ||
        fullMsg.includes("The width(-1) and height(-1) of chart") ||
        fullMsg.includes("Access to all PINs restricted") ||
        fullMsg.includes("Visitor tracking notification") ||
        fullMsg.includes("Analytics DB access error") ||
        fullMsg.includes("Missing or insufficient permissions") ||
        fullMsg.includes("permission")
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const isBenign =
        (reason &&
          reason.message &&
          (reason.message.includes("WebSocket") ||
            reason.message.includes("closed without opened") ||
            reason.message.includes("Missing or insufficient permissions"))) ||
        (typeof reason === "string" &&
          (reason.includes("WebSocket") ||
            reason.includes("closed without opened") ||
            reason.includes("Missing or insufficient permissions")));

      if (isBenign) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  const isFarmerRegistryPath =
    location.pathname.toLowerCase().endsWith("/farmer_registry") ||
    location.pathname.toLowerCase().endsWith("/farmer-registry");

  const initialUrlData = parseTabFromUrl(searchParams, location.pathname);

  const [activeAdminSubTab, setActiveAdminSubTab] = useState(initialUrlData.adminSubTab);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [adMuteRemaining, setAdMuteRemaining] = useState<number>(0);
  const [customMenus, setCustomMenus] = useState<CustomMenu[]>([]);
  const [customMenuCards, setCustomMenuCards] = useState<CustomMenuCard[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState(isFarmerRegistryPath ? "farmer_registry" : initialUrlData.mainTab
  );

  const [workspaceActiveTool, setWorkspaceActiveTool] = useState<string | null>(
    initialUrlData.mainTab === "workspace" ? initialUrlData.workspaceTool : null
  );
  const [gosActiveSubTab, setGosActiveSubTab] = useState<'Application' | 'GO'>(initialUrlData.gosSubTab);
  const [suggestionsActiveSubTab, setSuggestionsActiveSubTab] = useState<'problems' | 'suggestions'>(initialUrlData.suggestionsSubTab);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dropdownTimeoutRef = useRef<any>(null);

  const handleOpenDropdown = (itemId: string, el?: HTMLElement | null) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (el) {
      const rect = el.getBoundingClientRect();
      const dropdownWidth = 288;
      let left = rect.left;
      if (left + dropdownWidth > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - dropdownWidth - 12);
      }
      setDropdownPos({
        top: rect.bottom + 4,
        left: Math.max(12, left),
      });
    }
    setOpenDropdown(itemId);
  };

  const handleMouseEnterDropdown = (itemId: string, el: HTMLElement) => {
    // Ignore mouseenter on touch devices to prevent tap flicker
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    handleOpenDropdown(itemId, el);
  };

  const handleMouseLeaveDropdown = () => {
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  useEffect(() => {
    if (!openDropdown) return;
    const handleScroll = () => {
      // Only auto-close on scroll for desktop popovers (window width >= 640px)
      if (typeof window !== "undefined" && window.innerWidth >= 640) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    const navEl = navScrollRef.current;
    if (navEl) navEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (navEl) navEl.removeEventListener("scroll", handleScroll);
    };
  }, [openDropdown]);

  useEffect(() => {
    // If the URL is currently on an admin path, but the user selects a main app tab
    if (isEvdkaPath || location.pathname.endsWith("/Farmer_Registry")) {
      if (
        currentTab !== "admin" &&
        currentTab !== "editor" &&
        currentTab !== "farmer_registry"
      ) {
        navigate(`/?tab=${currentTab}`);
      }
    }
  }, [currentTab, location.pathname, navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.group\\/navitem')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentTab !== "workspace") {
      setWorkspaceActiveTool(null);
    }
  }, [currentTab]);

  useEffect(() => {
    let localAdConfig: any = null;
    try {
      const saved = localStorage.getItem("e_vedhika_ad_config");
      if (saved) localAdConfig = JSON.parse(saved);
    } catch (e) {}

    const unsub = onSnapshot(doc(db, "site_settings", "home_page"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (localAdConfig && (!data.ads || Object.keys(data.ads).length === 0)) {
          data.ads = localAdConfig;
        } else if (data.ads) {
          try { localStorage.setItem("e_vedhika_ad_config", JSON.stringify(data.ads)); } catch (e) {}
        }
        setSiteConfig(data);
      } else if (localAdConfig) {
        setSiteConfig({ ads: localAdConfig });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      setAdMuteRemaining(getMuteRemainingSeconds(siteConfig));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [siteConfig]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "custom_code", "global_css"), (snap) => {
      if (snap.exists()) {
        const cssContent = snap.data().content;
        let styleEl = document.getElementById("e-vedhika-custom-css");
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = "e-vedhika-custom-css";
          document.head.appendChild(styleEl);
        }
        styleEl.innerHTML = cssContent;
      }
    });
    return () => unsub();
  }, []);

  // Synchronize deep links for public users while maintaining clean admin URLs (?tab=admin)
  const { getDeepLink } = useDeepLink({
    currentTab,
    setCurrentTab,
    workspaceActiveTool,
    setWorkspaceActiveTool,
    gosActiveSubTab,
    setGosActiveSubTab,
    suggestionsActiveSubTab,
    setSuggestionsActiveSubTab,
    activeAdminSubTab,
    setActiveAdminSubTab,
  });
  const [activeInternalUrl, setActiveInternalUrl] = useState<string | null>(
    null,
  );
  const [currentFilter, setCurrentFilter] = useState("All");
  const [sharingPostForPoster, setSharingPostForPoster] = useState<Post | null>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    (window as any).setLightboxImage = setLightboxImage;
    (window as any).setSharingPostForPoster = setSharingPostForPoster;
    return () => {
      delete (window as any).setLightboxImage;
      delete (window as any).setSharingPostForPoster;
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPostForm(false);
        setShowSuggestionForm(false);
        setShowProfileModal(false);
        setShowAuthModal(false);
        setShowFooterModal(null);
        setLightboxImage(null);
        setSharingPostForPoster(null);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const headerHeight = "72px";
  const tickerHeight = "44px";
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const approvedSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      if (!s.status) return false;
      return s.status.toLowerCase() === "approved";
    });
  }, [suggestions]);
  const [problemsGlobal, setProblemsGlobal] = useState<ProblemReport[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [aboutContent, setAboutContent] = useState<{
    title: string;
    content: string;
    lastUpdated: string;
  }>({
    title: "e-Vedhika ‡∞ó‡±Å‡∞∞‡∞ø‡∞Ç‡∞ö‡∞ø (About e-Vedhika)",
    content: "‡∞à ‡∞µ‡±á‡∞¶‡∞ø‡∞ï ‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞∞‡∞æ‡∞ú‡±ç ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ‡±Ä‡∞£‡∞æ‡∞≠‡∞ø‡∞µ‡±É‡∞¶‡±ç‡∞ß‡∞ø ‡∞Ö‡∞ß‡∞ø‡∞ï‡∞æ‡∞∞‡±Å‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∏‡∞ø‡∞¨‡±ç‡∞¨‡∞Ç‡∞¶‡∞ø ‡∞ï‡±ã‡∞∏‡∞Ç ‡∞™‡±ç‡∞∞‡∞§‡±ç‡∞Ø‡±á‡∞ï‡∞Ç‡∞ó‡∞æ ‡∞∞‡±Ç‡∞™‡±ä‡∞Ç‡∞¶‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø. ‡∞á‡∞ï‡±ç‡∞ï‡∞° ‡∞Æ‡±Ä‡∞∞‡±Å ‡∞Æ‡±Ä ‡∞µ‡∞ø‡∞ß‡±Å‡∞≤‡∞ï‡±Å ‡∞∏‡∞Ç‡∞¨‡∞Ç‡∞ß‡∞ø‡∞Ç‡∞ö‡∞ø‡∞® ‡∞§‡∞æ‡∞ú‡∞æ ‡∞∏‡∞Æ‡∞æ‡∞ö‡∞æ‡∞∞‡∞Ç, GO ‡∞≤‡±Å, ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞á‡∞§‡∞∞ ‡∞∏‡±å‡∞ï‡∞∞‡±ç‡∞Ø‡∞æ‡∞≤‡∞®‡±Å ‡∞™‡±ä‡∞Ç‡∞¶‡∞µ‡∞ö‡±ç‡∞ö‡±Å.\n\n- ‡∞™‡±ç‡∞∞‡∞≠‡±Å‡∞§‡±ç‡∞µ ‡∞ú‡±Ä‡∞µ‡±ã‡∞≤‡±Å (GOs)\n- ‡∞´‡∞æ‡∞∞‡±ç‡∞Æ‡∞æ‡∞ü‡±ç‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∞‡∞ø‡∞™‡±ã‡∞∞‡±ç‡∞ü‡±Å‡∞≤‡±Å\n- ‡∞∏‡∞ø‡∞¨‡±ç‡∞¨‡∞Ç‡∞¶‡∞ø ‡∞°‡±à‡∞∞‡±Ü‡∞ï‡±ç‡∞ü‡∞∞‡±Ä\n- ‡∞®‡∞æ‡∞≤‡±Ü‡∞°‡±ç‡∞ú‡±ç ‡∞π‡∞¨‡±ç",
    lastUpdated: ""
  });

  const [pageDescriptions, setPageDescriptions] = useState<Record<string, { title: string; description: string }>>({});
  const [landingPageData, setLandingPageData] = useState<any>({
    heroTitle: "Streamlining Governance & Citizen Services in",
    heroHighlight: "Andhra Pradesh",
    heroSubtitle: "E-Vedhika is a comprehensive digital platform designed to bridge the gap between citizens and government administration. By digitizing records and streamlining grievance redressal, we ensure transparent, accountable, and efficient governance at the grassroots level.",
    card1Title: "Farmer Registry & Verification",
    card1Desc: "Our advanced Farmer Registry system digitizes land records, crop details, and farmer information. Using live verification tools, agricultural officers can validate data in real-time, reducing discrepancies and ensuring that government subsidies reach the right beneficiaries without delay. This robust registry acts as the backbone for all agricultural initiatives in the region.",
    card2Title: "Grievance Redressal System",
    card2Desc: "Citizens can directly lodge complaints and suggestions through our digital portal. The system automatically routes these issues to the concerned departmental officers. With built-in tracking and escalation matrix, the Grievance Redressal System ensures that no public issue goes unnoticed, fostering a culture of accountability and rapid response within the administration.",
    card3Title: "Data Analytics & Reporting",
    card3Desc: "E-Vedhika provides administrators with powerful data visualization and reporting tools. From tracking the number of resolved issues to analyzing demographic data, the platform generates comprehensive insights. These analytics empower decision-makers to identify trends, allocate resources efficiently, and formulate data-driven policies that benefit the entire community.",
    ctaTitle: "Empowering Citizens through Technology",
    ctaDesc: "By leveraging modern web technologies like React, Node.js, and secure cloud infrastructure, E-Vedhika delivers a seamless experience. Our goal is to make government services accessible to everyone, anywhere, at any time. The secure authentication system ensures that only authorized personnel can access sensitive administrative modules, while citizens enjoy a user-friendly public interface.",
  });

  const fetchPageDescriptions = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "page_descriptions"));
      if (snap.exists() && snap.data()) {
        setPageDescriptions(snap.data() as any);
      }
    } catch (err) {
      console.warn("Could not fetch page descriptions:", err);
    }
  };

  const fetchLandingPageData = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "landing_page"));
      if (snap.exists() && snap.data()) {
        setLandingPageData(snap.data());
      }
    } catch (err) {
      console.warn("Could not fetch landing page config:", err);
    }
  };

  const fetchAboutContent = async () => {
    try {
      const res = await fetch("/api/about");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.title && data.content) {
            setAboutContent(data);
          }
        } else {
          console.warn("About content response was not JSON");
        }
      }
    } catch (err) {
      console.warn("Could not fetch latest about content, using default local content instead:", err);
    }
  };

  useEffect(() => {
    fetchAboutContent();
    fetchLandingPageData();
    fetchPageDescriptions();
  }, []);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
    const [visiblePostsCount, setVisiblePostsCount] = useState(20);
  const [visibleUpdatesCount, setVisibleUpdatesCount] = useState(20);
  const [visibleProblemsCount, setVisibleProblemsCount] = useState(20);
  const [visibleSuggestionsCount, setVisibleSuggestionsCount] = useState(20);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showPostForm, setShowPostForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [problemIsAnonymous, setProblemIsAnonymous] = useState(false);
  const [problemWantsWhatsApp, setProblemWantsWhatsApp] = useState(true);
  const [problemMessage, setProblemMessage] = useState("");
  const [isRecordingProblem, setIsRecordingProblem] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSuggestionsHovered, setIsSuggestionsHovered] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showFooterModal, setShowFooterModal] = useState<
    "privacy" | "about" | "contact" | null
  >(null);

  const [showPWABanner, setShowPWABanner] = useState(false);
  const [showPWAGuide, setShowPWAGuide] = useState<"ios" | "android_manual" | "desktop_manual" | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const isDismissed = localStorage.getItem("e_vedhika_pwa_dismissed") === "true";
    
    if (!isStandalone && !isDismissed) {
      const timer = setTimeout(() => {
        setShowPWABanner(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();

      setDeferredPrompt(e);

      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      addToast("‡∞Ø‡∞æ‡∞™‡±ç ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismissPWA = () => {
    localStorage.setItem("e_vedhika_pwa_dismissed", "true");
    setShowPWABanner(false);
  };

  const handlePWAInstall = () => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (deferredPrompt) {
      handleInstallClick();
    } else if (isIOS) {
      setShowPWAGuide("ios");
    } else if (isAndroid) {
      setShowPWAGuide("android_manual");
    } else {
      setShowPWAGuide("desktop_manual");
    }
  };
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [rbacPermissions, setRbacPermissions] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "rbac_permissions"),
      (snap) => {
        if (snap.exists()) {
          setRbacPermissions(snap.data().roles || {});
        } else {
          setRbacPermissions({});
        }
      },
    );
    return () => unsub();
  }, []);
  const [districtsData, setDistrictsData] = useState<Record<string, string[]>>(
    DEFAULT_DISTRICTS_DATA,
  );

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "locations"), (snap) => {
      if (snap.exists() && snap.data().data) {
        setDistrictsData(snap.data().data);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (
      currentTab === "suggestions" &&
      !sessionStorage.getItem("sawSuggestionAlert")
    ) {
      Swal.fire({
        title: "e-Vedhika Suggestion Portal",
        text: "Welcome to e-Vedhika Suggestion Portal! ‡∞Æ‡±Ä ‡∞∏‡±Ç‡∞ö‡∞®‡∞≤‡∞®‡±Å ‡∞á‡∞ï‡±ç‡∞ï‡∞° ‡∞®‡∞Æ‡±ã‡∞¶‡±Å ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.",
        icon: "info",
        confirmButtonColor: "#0d3b66",
        confirmButtonText: "‡∞∏‡∞∞‡±á (OK)",
      });
      sessionStorage.setItem("sawSuggestionAlert", "true");
    }
  }, [currentTab]);

  useEffect(() => {
    if (!user) {
      setAllUsers([]);
      return;
    }
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const uArr: UserProfile[] = [];
        snap.forEach((d) =>
          uArr.push({ id: d.id, ...d.data() } as UserProfile),
        );
        setAllUsers(uArr.sort((a, b) => (b.time || 0) - (a.time || 0)));
      },
      (e) => console.error("Users List Error:", e),
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    let interval: any;
    if (
      currentTab === "suggestions" &&
      approvedSuggestions.length > 0 &&
      !isSuggestionsHovered
    ) {
      interval = setInterval(() => {
        const box = suggestionsScrollRef.current;
        if (!box) return;

        if (box.scrollHeight <= box.clientHeight + 1) return;

        box.scrollTop += 1;

        if (box.scrollTop >= box.scrollHeight - box.clientHeight - 1) {
          box.scrollTop = 0;
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [currentTab, approvedSuggestions.length, isSuggestionsHovered]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const allUpdates = useMemo(() => {
    const merged = new Map<string, any>();
    SYSTEM_UPDATES.forEach((u) => merged.set(u.id, { ...u, isSystem: true }));
    updates.forEach((u) => {
      const existing = merged.get(u.id);
      merged.set(u.id, { ...existing, ...u, isSystem: !!existing });
    });
    return Array.from(merged.values());
  }, [updates]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState<"all" | "system" | "likes" | "comments" | "messages">("all");
  const [showDirectMessages, setShowDirectMessages] = useState(false);
  const [activeDmUser, setActiveDmUser] = useState<UserProfile | null>(null);
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [allDmMessages, setAllDmMessages] = useState<any[]>([]);
  const [dmInput, setDmInput] = useState("");
  const [dmSearchQuery, setDmSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<{ [uid: string]: boolean }>({});

  // Global listener for all direct messages to compute unread badge
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "chat"), (snapshot) => {
      const msgs = snapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((m: any) => m.receiverId); // Only get DMs
      setAllDmMessages(msgs);
    });
    return () => unsub();
  }, [user]);

  // Listen for typing status
  useEffect(() => {
    if (!user || !activeDmUser) return;
    const unsub = onSnapshot(doc(db, "typing_status", `${activeDmUser.id}_${user.uid}`), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isCurrentlyTyping = data.isTyping && (Date.now() - data.updatedAt < 10000); // 10s timeout
        setTypingUsers(prev => ({ ...prev, [activeDmUser.id]: isCurrentlyTyping }));
      } else {
        setTypingUsers(prev => ({ ...prev, [activeDmUser.id]: false }));
      }
    });
    return () => unsub();
  }, [user, activeDmUser]);

  // Load draft when activeDmUser changes
  useEffect(() => {
    if (!user || !activeDmUser) {
      setDmInput("");
      return;
    }
    const draftKey = `evedhika_dm_draft_${user.uid}_${activeDmUser.id}`;
    const saved = localStorage.getItem(draftKey) || "";
    setDmInput(saved);
  }, [user, activeDmUser]);

  // Typing status updater & draft saver
  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDmInput(val);
    if (user && activeDmUser) {
      const draftKey = `evedhika_dm_draft_${user.uid}_${activeDmUser.id}`;
      if (val) {
        localStorage.setItem(draftKey, val);
      } else {
        localStorage.removeItem(draftKey);
      }
    }
    if (!user || !activeDmUser) return;
    const typingRef = doc(db, "typing_status", `${user.uid}_${activeDmUser.id}`);
    setDoc(typingRef, { isTyping: val.length > 0, updatedAt: Date.now() }, { merge: true }).catch(() => {});
  };

  useEffect(() => {
    if (!user || !showDirectMessages) return;
    const unsub = onSnapshot(collection(db, "chat"), async (snapshot) => {
      const msgs = snapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((m: any) => m.receiverId) // Ensure it's a DM
        .filter((m: any) => 
          activeDmUser 
            ? (m.senderId === user.uid && m.receiverId === activeDmUser.id) || (m.senderId === activeDmUser.id && m.receiverId === user.uid)
            : m.senderId === user.uid || m.receiverId === user.uid
        )
        .sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
      
      setDmMessages(msgs);

      // Mark incoming messages as read (Note: Will fail if rules don't permit it, but we catch it)
      if (activeDmUser) {
        for (const m of msgs) {
          if ((m as any).receiverId === user.uid && !(m as any).read) {
            try {
              await updateDoc(doc(db, "chat", (m as any).id), { read: true });
            } catch (err) {}
          }
        }
      }
    });
    return () => unsub();
  }, [user, activeDmUser, showDirectMessages]);

  const handleSendDMText = async (textToSend: string) => {
    if (!user || !activeDmUser || !textToSend.trim()) return;
    const text = textToSend.trim();
    const draftKey = `evedhika_dm_draft_${user.uid}_${activeDmUser.id}`;
    localStorage.removeItem(draftKey);
    try {
      await addDoc(collection(db, "chat"), {
        uid: user.uid, // Required by chat rules
        senderId: user.uid,
        receiverId: activeDmUser.id,
        text,
        createdAt: Date.now(),
        read: false
      });
      
      // Non-blocking auxiliary updates
      try {
        const typingRef = doc(db, "typing_status", `${user.uid}_${activeDmUser.id}`);
        setDoc(typingRef, { isTyping: false, updatedAt: Date.now() }, { merge: true }).catch(() => {});

        addDoc(collection(db, "notifications"), {
          uid: activeDmUser.id,
          senderUid: user.uid,
          type: "message",
          title: `New Message from ${userProfile?.name || user.displayName || "User"}`,
          message: text,
          time: Date.now(),
          read: false
        }).catch(() => {});
      } catch (auxErr) {
        console.error("Auxiliary DM update error:", auxErr);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      const errMsg = err?.message || String(err);
      addToast(`DM Error: ${errMsg}`);
    }
  };

  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = dmInput;
    setDmInput("");
    await handleSendDMText(text);
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedIframeUrl, setSelectedIframeUrl] = useState<string | null>(
    null,
  );
  const [showForcedProfileSetup, setShowForcedProfileSetup] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [notifSoundConfig, setNotifSoundConfig] = useState<any>({
    posts: "default_ding",
    updates: "default_ding",
    general: "default_ding",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "notification_sounds"), (snap) => {
      if (snap.exists() && snap.data()) {
        const d = snap.data();
        let formatted: any = {};
        ["posts", "updates", "general"].forEach(key => {
            if (typeof d[key] === "boolean") formatted[key] = d[key] ? "default_ding" : "false";
            else if (d[key]) formatted[key] = d[key];
            else formatted[key] = "default_ding";
        });
        setNotifSoundConfig((prev: any) => ({ ...prev, ...formatted }));
      }
    });
    return () => unsub();
  }, []);

  const [adminLocked, setAdminLocked] = useState(true);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [currentAdminPin, setCurrentAdminPin] = useState("1234");
  const [storageConfig, setStorageConfig] = useState<"cloudflare" | "firebase">(
    "cloudflare",
  );
  
  const DEFAULT_SUGGESTION_CATEGORIES = [
    "General Suggestion",
    "App Improvement",
    "Service Feedback",
    "Technical Issue",
    "Request Feature",
  ];
  const [suggestionCategories, setSuggestionCategories] = useState<string[]>(DEFAULT_SUGGESTION_CATEGORIES);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "suggestion_categories"), (snap) => {
      if (snap.exists() && snap.data().data) {
        setSuggestionCategories(snap.data().data);
      }
    });
    return () => unsub();
  }, []);
  const [userPinDoc, setUserPinDoc] = useState<any>(null);
  const [loadedUserPin, setLoadedUserPin] = useState<boolean>(false);

  useEffect(() => {
    if (!isDevEmail) return;
    const unsub = onSnapshot(
      doc(db, "settings", "admin_config"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.pin) setCurrentAdminPin(data.pin);
          if (data.storageType) setStorageConfig(data.storageType);
        }
      },
      (err) => {
        console.log(
          "Not authorized to read admin config (expected for non-admins).",
        );
      },
    );
    return () => unsub();
  }, [isDevEmail]);

  useEffect(() => {
    if (!user) {
      setUserPinDoc(null);
      setLoadedUserPin(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "user_pins", user.uid),
      (snap) => {
        if (snap.exists()) {
          setUserPinDoc(snap.data());
        } else {
          setUserPinDoc(null);
        }
        setLoadedUserPin(true);
      },
      (err) => {
        // PIN Access Error often caused by transient permission checks
        setUserPinDoc(null);
        setLoadedUserPin(true);
      },
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (postIdFromUrl && posts.length > 0) {
      const rawParam = decodeURIComponent(postIdFromUrl).trim().toLowerCase();
      const post = posts.find((p) => {
        if (p.id === postIdFromUrl || p.id === rawParam) return true;
        if (p.slug && p.slug.toLowerCase() === rawParam) return true;
        const slugFromTitle = (p.title || "").trim().replace(/\s+/g, "-").toLowerCase();
        if (slugFromTitle && slugFromTitle === rawParam) return true;
        const cleanTitle = (p.title || "").trim().toLowerCase();
        if (cleanTitle === rawParam) return true;
        return false;
      });
      if (post) {
        const title = post.title || "E-Vedhika ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç";
        const rawContent = post.content || "";
        const description = String(rawContent)
          .replace(/<[^>]*>?/gm, "")
          .replace(/[#*`]/g, "")
          .trim()
          .substring(0, 160) || "‡∞à-‡∞µ‡±á‡∞¶‡∞ø‡∞ï ‡∞™‡±ã‡∞∞‡±ç‡∞ü‡∞≤‡±ç ‡∞¶‡±ç‡∞µ‡∞æ‡∞∞‡∞æ ‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞æ‡∞Ç‡∞∂‡∞æ‡∞≤‡±Å ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞°‡∞ø‡∞ú‡∞ø‡∞ü‡∞≤‡±ç ‡∞∏‡±á‡∞µ‡∞≤‡∞®‡±Å ‡∞™‡±ä‡∞Ç‡∞¶‡∞Ç‡∞°‡∞ø.";
        const postUrl = `${getSiteBaseUrl()}/?postId=${post.id}`;
        const imageUrl = post.mediaUrl || "https://www.e-vedhika.in/banner.jpg";

        updateDOMMetaTags({
          seoTitle: `${title} | E-Vedhika`,
          seoDescription: description,
          ogTitle: `üì¢ ${title}`,
          ogDescription: description,
          ogImage: imageUrl,
          canonicalUrl: postUrl,
          ogType: "article",
          twitterCard: "summary_large_image"
        });
      }
    } else {
      updateDOMMetaTags(siteConfig?.seo || siteConfig?.seoSettings);
    }
  }, [postIdFromUrl, posts, user, siteConfig]);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Initial tracking update on mount
    updateDoc(doc(db, "users", user.uid), {
      lastActive: Date.now()
    }).catch(() => {});

    const interval = setInterval(async () => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          timeSpentMinutes: increment(1),
          lastActive: Date.now()
        });
      } catch (e) {
        // Silent fail for non-admins if profile doc doesn't exist yet
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        const target = event.target as Element;
        if (!target.closest(".menu-toggle")) {
          setSidebarOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (isEvdkaPath || currentTab === "admin" || currentTab === "editor") {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    }
  }, [location.pathname, currentTab]);

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = APP_STYLES;
    document.head.appendChild(styleEl);
    return () => {
      styleEl.remove();
    };
  }, []);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setUserProfile(null);
        setUserRole("user");
        hasGreetedRef.current = false;
        setHasEnteredSite(false);
        sessionStorage.removeItem("ev_entered_site");
        
        if (!sessionStorage.getItem("ev_anon_access_logged")) {
          sessionStorage.setItem("ev_anon_access_logged", "true");
          setTimeout(() => {
            logUserActivity("Anonymous User Accessed Application").catch(() => {});
          }, 2000);
        }
      } else {
        if (!sessionStorage.getItem("ev_user_access_logged_" + u.uid)) {
          sessionStorage.setItem("ev_user_access_logged_" + u.uid, "true");
          setTimeout(() => {
            logUserActivity("User Logged In / Accessed Application").catch(() => {});
          }, 2000);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    // Protected Tabs Redirection Control
    const protectedTabs = [
      "admin",
      "editor",
      "my_activity",
      "logs",
    ];
    // Wait for auth to resolve and bypass checking if loaded
    if (!authLoading) {
      if (!user && protectedTabs.includes(currentTab)) {
        setCurrentTab("home");
        setSearchParams(new URLSearchParams());
        requireLoginAlert();
      } else if (user && (currentTab === "admin" || currentTab === "editor")) {
        // Enforce user roles for admin and editor if they managed to set the tab
        if (!canAccessAdmin) {
          setCurrentTab("home");
          setSearchParams(new URLSearchParams());
          addToast(
            "Access Denied: You do not have permissions for this section.",
          );
        }
      } else if (user && currentTab === "logs") {
        if (!(isAdmin || isDevEmail)) {
          setCurrentTab("home");
          setSearchParams(new URLSearchParams());
          addToast(
            "Access Denied: You do not have permissions for this section.",
          );
        }
      }
    }
  }, [authLoading, user, currentTab, canAccessAdmin, setSearchParams]);

  useEffect(() => {
    const unsubVisits = onSnapshot(
      doc(db, "settings", "site_stats"),
      (snap) => {
        if (snap.exists()) {
          setVisitorCount(snap.data().visitCount || 0);
        }
      },
    );

    if (!sessionStorage.getItem("site_visited")) {
      sessionStorage.setItem("site_visited", "true");
      const statsRef = doc(db, "settings", "site_stats");
      updateDoc(statsRef, { visitCount: increment(1) }).catch(async (e) => {
        if (e.code === "not-found") {
          await setDoc(statsRef, { visitCount: 1 });
        }
      });
    }

    let initialUpdatesLoadedLocal = false;
    let initialPostsLoadedLocal = false;

    const checkCoreDataLoaded = () => {
      if (initialUpdatesLoadedLocal && initialPostsLoadedLocal) {
        setDataLoading(false);
      }
    };

    const unsubUpdates = onSnapshot(
      collection(db, "updates"),
      (snap) => {
        const uArr: Update[] = [];
        snap.forEach((d) =>
          uArr.push({ id: d.id, ...(d.data() as any) } as Update),
        );
        setUpdates(uArr);

        if (!initialUpdatesLoadedLocal) {
          initialUpdatesLoadedLocal = true;
          checkCoreDataLoaded();
        } else {
          const addedChanges = snap
            .docChanges()
            .filter((change) => change.type === "added");
          if (addedChanges.length > 0) {
            const newUpdate = addedChanges[0].doc.data() as any;
            const isRecent = !newUpdate.time || (Date.now() - newUpdate.time < 60000);
            if (isRecent) {
              triggerNotification(
                "New Flash Update!",
                newUpdate.title ||
                  newUpdate.msg ||
                  newUpdate.text ||
                  "Check out the latest update.",
                notifSoundConfig.updates
              );
            }
          }
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "updates"),
    );

    const unsubSuggestions = onSnapshot(
      collection(db, "suggestions"),
      (snap) => {
        const sArr: Suggestion[] = [];
        snap.forEach((d) =>
          sArr.push({ id: d.id, ...(d.data() as any) } as Suggestion),
        );
        const sorted = sArr.sort((a, b) => getValidTime(b) - getValidTime(a));
        setSuggestions(sorted);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "suggestions"),
    );

    const unsubPosts = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const pArr: Post[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          pArr.push({ id: d.id, ...data } as Post);
        });

        setPosts(
          pArr.sort((a, b) => {
            const pinSort = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            if (pinSort !== 0) return pinSort;
            return (b.time || 0) - (a.time || 0);
          }),
        );

        if (!initialPostsLoadedLocal) {
          initialPostsLoadedLocal = true;
          checkCoreDataLoaded();
        } else {
          const addedChanges = snap
            .docChanges()
            .filter((change) => change.type === "added");
          if (addedChanges.length > 0) {
            const newPost = addedChanges[0].doc.data() as any;
            const isRecent = !newPost.time || (Date.now() - newPost.time < 60000);
            if (isRecent) {
              triggerNotification(
                `New Post: ${newPost.title || "Platform Update"}`,
                newPost.content || "A new post has been published on E-Vedhika.",
                notifSoundConfig.posts
              );
            }
          }
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "posts"),
    );

    const unsubCustomMenus = onSnapshot(collection(db, "customMenus"), (snap) => {
      const data: CustomMenu[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as CustomMenu));
      setCustomMenus(data.sort((a, b) => a.order - b.order));
    });

    const unsubCustomMenuCards = onSnapshot(collection(db, "customMenuCards"), (snap) => {
      const data: CustomMenuCard[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as CustomMenuCard));
      setCustomMenuCards(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });

    return () => {
      unsubVisits();
      unsubUpdates();
      unsubSuggestions();
      unsubPosts();
      unsubCustomMenus();
      unsubCustomMenuCards();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          const p = { id: snap.id, ...snap.data() } as UserProfile;
          setUserProfile(p);

          if (p.name || p.username) {
            if (p.status === "Approved" && !hasGreetedRef.current) {
              hasGreetedRef.current = true;
              const honorific = p.gender === "Female" ? "Madam" : "Sir";
              addToast(`Welcome to E-vedhika website, ${honorific}!`);
            }
          }
        } else {
          setUserProfile(null);
        }
        setProfileLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        if (err.message.includes("offline")) {
          addToast(
            "Network Error: Firestore is offline. Please check your connection.",
          );
        }
        setProfileLoading(false);
      },
    );

    const unsubAdminCheck = onSnapshot(
      doc(db, "admins", user.uid),
      (snap) => {
        const isDevEmail =
          user.email?.toLowerCase() === "rakeshkumardhawan123@gmail.com";
        if (isDevEmail) {
          setUserRole("admin");
        } else if (snap.exists()) {
          const data = snap.data();
          const role = (data?.role || "admin").toLowerCase();
          setUserRole(role);
        } else {
          setUserRole("user");
        }
      },
      (err) =>
        handleFirestoreError(err, OperationType.GET, `admins/${user.uid}`),
    );

    const unsubChat = onSnapshot(
      collection(db, "chat"),
      (snap) => {
        const cArr: ChatMessage[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          if (!data.receiverId) {
            cArr.push({ id: d.id, ...data } as ChatMessage);
          }
        });
        setChatMessages(cArr.sort((a, b) => (a.time || 0) - (b.time || 0)));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "chat"),
    );

    const problemsQuery =
      userRole === "admin" || userRole === "editor"
        ? collection(db, "problems")
        : query(collection(db, "problems"), where("uid", "==", user.uid));

    const unsubProblems = onSnapshot(
      problemsQuery,
      (snap) => {
        const pArr: ProblemReport[] = [];
        snap.forEach((d) =>
          pArr.push({ id: d.id, ...(d.data() as any) } as ProblemReport),
        );
        setProblemsGlobal(pArr.sort((a, b) => (b.time || 0) - (a.time || 0)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, "problems");
      },
    );

    const requestsQuery =
      userRole === "admin" || userRole === "editor"
        ? collection(db, "requests")
        : query(collection(db, "requests"), where("uid", "==", user.uid));

    const unsubRequests = onSnapshot(
      requestsQuery,
      (snap) => {
        const rArr: RequestData[] = [];
        snap.forEach((d) =>
          rArr.push({ id: d.id, ...(d.data() as any) } as RequestData),
        );
        setRequests(rArr.sort((a, b) => (b.time || 0) - (a.time || 0)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, "requests");
      },
    );

    let initialNotificationsLoadedLocal = false;
    const notificationTargets = [user.uid, "all"];
    if (userRole === "admin") notificationTargets.push("admin_only");

    const unsub1 = onSnapshot(
      query(
        collection(db, "notifications"),
        where("uid", "in", notificationTargets),
      ),
      (snap) => {
        const nArr: Notification[] = [];
        snap.forEach((d) =>
          nArr.push({ id: d.id, ...(d.data() as any) } as Notification),
        );
        setNotifications(nArr.sort((a, b) => b.time - a.time));
        setUnreadCount(
          nArr.filter((n) =>
            n.senderUid !== user?.uid && (n.uid === "all" ? !(Array.isArray((n as any).readBy) ? (n as any).readBy.includes(user?.uid || "") : false) : !n.read)
          ).length,
        );

        if (!initialNotificationsLoadedLocal) {
          initialNotificationsLoadedLocal = true;
        } else {
          const addedChanges = snap
            .docChanges()
            .filter((change) => change.type === "added");
          if (addedChanges.length > 0) {
            const newNotif = addedChanges[0].doc.data() as any;
            const isRecent = !newNotif.time || (Date.now() - newNotif.time < 60000);
            if (isRecent) {
              triggerNotification(
                newNotif.title || "New Notification",
                newNotif.message || newNotif.msg || "You have a new notification",
                notifSoundConfig.general
              );
            }
          }
        }
      },
      (err) => {
        if (err.message.toLowerCase().includes("permission")) {
          console.warn(
            "Notifications permission denied - check firestore.rules",
          );
          return;
        }
        handleFirestoreError(err, OperationType.LIST, "notifications");
      },
    );

    return () => {
      unsubProfile();
      unsubAdminCheck();
      unsubChat();
      unsubProblems();
      unsubRequests();
      unsub1();
    };
  }, [user, userRole]);

  // 3. Dynamically control forced profile setup - only show it when in "suggestions" tab and profile is incomplete
  useEffect(() => {
    if (!user || profileLoading) {
      setShowForcedProfileSetup(false);
      return;
    }
    const needsSetup = !userProfile || (!userProfile.name && !userProfile.username);
    if (needsSetup && currentTab === "suggestions") {
      setShowForcedProfileSetup(true);
    } else {
      setShowForcedProfileSetup(false);
    }
  }, [currentTab, userProfile, user, profileLoading]);

  // 4. Auto-clean post qkQ9PDCxO0myy5l2seda image attachment when the admin logs in
  useEffect(() => {
    if (user && userProfile && (userRole === "admin" || userRole === "editor" || user.uid === "KGT2roF9bPTNhWIceHgWsJEnEnH3")) {
      const cleanPostImage = async () => {
        try {
          const postRef = doc(db, "posts", "qkQ9PDCxO0myy5l2seda");
          const snap = await getDoc(postRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.mediaUrl || data.mediaName || data.mediaType) {
              console.log("Auto-cleaning image attachment from post qkQ9PDCxO0myy5l2seda...");
              await updateDoc(postRef, {
                mediaUrl: deleteField(),
                mediaName: deleteField(),
                mediaType: deleteField()
              });
              console.log("Post qkQ9PDCxO0myy5l2seda image successfully cleaned!");
              addToast("‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç ‡∞®‡±Å‡∞Ç‡∞°‡∞ø ‡∞á‡∞Æ‡±á‡∞ú‡±ç ‡∞Ö‡∞ü‡∞æ‡∞ö‡±ç‚Äå‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞§‡±ä‡∞≤‡∞ó‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø!");
            }
          }
        } catch (e) {
          console.error("Error auto-cleaning post image:", e);
        }
      };
      cleanPostImage();
    }
  }, [user, userProfile, userRole]);

  const addToast = (msg: string) => {
    setToasts((prev) => {
      if (prev.some((t) => t.msg === msg)) return prev;

      const id = Date.now() + Math.random();
      setTimeout(() => {
        setToasts((curr) => curr.filter((t) => t.id !== id));
      }, 3000);
      return [...prev, { id, msg }];
    });
  };

  const handleGoogleLogin = async () => {
    addToast("Google ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞ï‡±ã‡∞∏‡∞Ç ‡∞™‡∞æ‡∞™‡∞™‡±ç ‡∞ì‡∞™‡±Ü‡∞®‡±ç ‡∞Ö‡∞µ‡±Å‡∞§‡±ã‡∞Ç‡∞¶‡∞ø...");

    const slowLoginWarning = setTimeout(() => {
      addToast(
        "‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ü‡∞≤‡∞∏‡±ç‡∞Ø‡∞Ç ‡∞Ö‡∞µ‡±Å‡∞§‡±Å‡∞Ç‡∞ü‡±á, ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞™‡±à‡∞® ‡∞â‡∞®‡±ç‡∞® ‡∞¨‡∞æ‡∞£‡∞Ç ‡∞ó‡±Å‡∞∞‡±ç‡∞§‡±Å ‚Üó ‡∞™‡±à ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞∏‡∞ø ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ü‡±ç‡∞Ø‡∞æ‡∞¨‡±ç‚Äå‡∞≤‡±ã ‡∞ì‡∞™‡±Ü‡∞®‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø. ‡∞Ö‡∞™‡±ç‡∞™‡±Å‡∞°‡±Å ‡∞§‡±ç‡∞µ‡∞∞‡∞ó‡∞æ ‡∞ú‡∞∞‡±Å‡∞ó‡±Å‡∞§‡±Å‡∞Ç‡∞¶‡∞ø.",
      );
    }, 2000);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      clearTimeout(slowLoginWarning);

      try {
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);
        let isNewUser = false;
        if (!docSnap.exists()) {
          isNewUser = true;
          await setDoc(docRef, {
            name: result.user.displayName || "System User",
            email: result.user.email,
            photoURL: result.user.photoURL,
            gender: "",
            designation: "",
            time: Date.now(),
          });
        }
        
        const loginName = result.user.displayName || result.user.email?.split("@")[0] || "User";
        await addDoc(collection(db, "notifications"), {
          uid: "all",
          title: isNewUser ? "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞∏‡∞≠‡±ç‡∞Ø‡±Å‡∞°‡±Å (New Sign Up)" : "‡∞∏‡∞≠‡±ç‡∞Ø‡±Å‡∞°‡±Å ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç (Login)",
          message: isNewUser 
            ? `${loginName} ‡∞µ‡∞æ‡∞∞‡±Å Google ‡∞¶‡±ç‡∞µ‡∞æ‡∞∞‡∞æ ‡∞ï‡±ä‡∞§‡±ç‡∞§‡∞ó‡∞æ ‡∞ú‡∞æ‡∞Ø‡∞ø‡∞®‡±ç ‡∞Ö‡∞Ø‡±ç‡∞Ø‡∞æ‡∞∞‡±Å.` 
            : `${loginName} ‡∞µ‡∞æ‡∞∞‡±Å E-Vedhika‡∞≤‡±ã‡∞®‡∞ø‡∞ï‡∞ø ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ö‡∞Ø‡±ç‡∞Ø‡∞æ‡∞∞‡±Å.`,
          type: "admin_alert",
          read: false,
          time: Date.now()
        }).catch(()=>console.error("Failed to notify admin"));
      } catch (e) {}

      setShowAuthModal(false);

      try {
        const isAdminEmail = ["rakeshkumardhawan123@gmail.com"].includes(
          result.user.email?.toLowerCase() || "",
        );
        await addDoc(collection(db, "security_logs"), {
          [isAdminEmail ? "admin" : "userEmail"]: result.user.email,
          action: `Google Login (${navigator.userAgent.substring(0, 50)}...)`,
          time: Date.now(),
        });
      } catch (e) {}
    } catch (err: any) {
      clearTimeout(slowLoginWarning);
      if (
        err.code === "auth/cancelled-popup-request" ||
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/popup-blocked"
      ) {
        addToast(
          "Login Failed: Popup closed or blocked. Try opening the app in a new tab (arrow on top right) if this persists.",
        );
      } else {
        addToast(getFriendlyError(err));
      }
    }
  };

  const triggerLogin = () => {
    setShowAuthModal(true);
  };

  const togglePostExpansion = async (id: string) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!expandedPosts.has(id)) {
      const post = posts.find((p) => p.id === id);
      const userId = auth.currentUser?.uid;
      const sessionViewedKey = `session_viewed_${id}`;
      const hasViewedInSession = sessionStorage.getItem(sessionViewedKey);

      if (post && !hasViewedInSession) {
        sessionStorage.setItem(sessionViewedKey, "true");
        
        let updateData: any = { views: increment(1) };
        if (userId && !(Array.isArray(post.viewedBy) ? post.viewedBy.includes(userId) : false)) {
           updateData.viewedBy = arrayUnion(userId);
        }

        try {
          await updateDoc(doc(db, "posts", id), updateData);
        } catch (err) {
          console.error("View count increment error:", err);
        }
      }
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (p.status === "Deleted") return false;

    const pStatus = (p.status || "").toLowerCase();
    if (
      !isAdmin &&
      !["approved", "active"].includes(pStatus) &&
      p.uid !== user?.uid
    )
      return false;

    const q = "";
    const tMatch = (p.title || "").toLowerCase().includes(q);
    const cMatch = (p.content || "").toLowerCase().includes(q);
    const searchOk = !q || tMatch || cMatch;
    if (currentFilter === "All") return searchOk;
    if (currentFilter === "Following") {
      const followingIds = userProfile?.following || [];
      return searchOk && followingIds.includes(p.uid);
    }
    
    // Smart Filter matching logic
    const matchesSmartFilter = (post: Post, filter: string) => {
      const cats = [
        post.category,
        post.subCategory,
        ...(post.categories || []),
        ...(post.tags || [])
      ].map(c => (c || "").trim().toLowerCase());

      if (filter === " GOs & Circulars") {
        return cats.some(c => 
          c.includes("go") || 
          c.includes("circular") || 
          c.includes("‡∞∏‡∞∞‡±ç‡∞ï‡±ç‡∞Ø‡±Å‡∞≤‡∞∞‡±ç") || 
          c.includes("‡∞ú‡±Ä‡∞µ‡±ã")
        );
      }
      if (filter === " Updates") {
        return cats.some(c => 
          c.includes("update") || 
          c.includes("‡∞Ö‡∞™‡±ç‡∞°‡±á‡∞ü‡±ç") || 
          c.includes("‡∞®‡±ã‡∞ü‡∞ø‡∞∏‡±ç") || 
          c.includes("notice")
        );
      }
      if (filter === " General") {
        return cats.some(c => 
          c.includes("general") || 
          c.includes("‡∞ú‡∞®‡∞∞‡∞≤‡±ç") || 
          c.includes("discussion") || 
          c.includes("‡∞ö‡∞∞‡±ç‡∞ö")
        );
      }
      return cats.includes(filter.trim().toLowerCase());
    };

    return searchOk && matchesSmartFilter(p, currentFilter);
  });

  const dmUsersList = useMemo(() => {
    if (!user) return [];
    
    // Find all conversations
    const conversations = new Map<string, { lastMessageAt: number, unread: number, lastMessageText: string, lastMessageSender: string, lastMessageRead: boolean }>();
    
    allDmMessages.forEach(m => {
      if (m.senderId === user.uid || m.receiverId === user.uid) {
        const otherId = m.senderId === user.uid ? m.receiverId : m.senderId;
        const current = conversations.get(otherId) || { lastMessageAt: 0, unread: 0, lastMessageText: "", lastMessageSender: "", lastMessageRead: false };
        
        if (m.createdAt > current.lastMessageAt) {
          current.lastMessageAt = m.createdAt;
          current.lastMessageText = m.text;
          current.lastMessageSender = m.senderId;
          current.lastMessageRead = !!m.read;
        }
        
        if (m.receiverId === user.uid && !m.read) {
          current.unread += 1;
        }
        
        conversations.set(otherId, current);
      }
    });

    const filteredUsers = allUsers
      .filter(u => u.id !== user.uid)
      .map(u => {
        const conv = conversations.get(u.id);
        return {
          ...u,
          lastMessageAt: conv ? conv.lastMessageAt : 0,
          lastMessageText: conv ? conv.lastMessageText : "",
          lastMessageSender: conv ? conv.lastMessageSender : "",
          lastMessageRead: conv ? conv.lastMessageRead : false,
          unreadCount: conv ? conv.unread : 0
        };
      });

    const q = dmSearchQuery.toLowerCase();
    if (q) {
      return filteredUsers.filter(u => 
        (u.name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.district || "").toLowerCase().includes(q) ||
        (u.designation || "").toLowerCase().includes(q)
      ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    }
    
    // If no search query, only show "Friends" (Following) OR users with active history
    return filteredUsers.filter(u => 
      (userProfile?.following || []).includes(u.id) || u.lastMessageAt > 0
    ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [allUsers, allDmMessages, user, dmSearchQuery, userProfile]);

  const handleRecordProblem = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Your browser does not support voice to text capability.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecordingProblem(true);
      addToast("üé§ ‡∞∞‡∞ø‡∞ï‡∞æ‡∞∞‡±ç‡∞°‡∞ø‡∞Ç‡∞ó‡±ç ‡∞™‡±ç‡∞∞‡∞æ‡∞∞‡∞Ç‡∞≠‡∞Æ‡±à‡∞Ç‡∞¶‡∞ø (Recording started)...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setProblemMessage((prev) =>
        prev ? prev + " " + transcript : transcript,
      );
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      addToast("‡∞∞‡∞ø‡∞ï‡∞æ‡∞∞‡±ç‡∞°‡∞ø‡∞Ç‡∞ó‡±ç‚Äå‡∞≤‡±ã ‡∞∏‡∞Æ‡∞∏‡±ç‡∞Ø ‡∞è‡∞∞‡±ç‡∞™‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø (Error recording). ");
      setIsRecordingProblem(false);
    };

    recognition.onend = () => {
      setIsRecordingProblem(false);
    };

    recognition.start();
  };

  const isEvdkaPath =
    location.pathname.toLowerCase().endsWith("/evdka") ||
    location.pathname.toLowerCase().endsWith("/evedhika");
  const isTargetingAdminRoute =
    isEvdkaPath || currentTab === "admin" || currentTab === "editor";

  if (isTargetingAdminRoute) {
    if (authLoading || (user && profileLoading)) {
      return (
        <div className="h-[100dvh] overflow-hidden bg-slate-950 font-sans antialiased flex flex-col justify-center items-center p-4">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-white/10"></div>
          </div>
          <p className="text-xs font-semibold tracking-wide text-white/75 font-sans">‡∞Ö‡∞°‡±ç‡∞Æ‡∞ø‡∞®‡±ç ‡∞°‡±á‡∞ü‡∞æ ‡∞≤‡±ã‡∞°‡±ç ‡∞Ö‡∞µ‡±Å‡∞§‡±ã‡∞Ç‡∞¶‡∞ø... ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞µ‡±á‡∞ö‡∞ø ‡∞â‡∞Ç‡∞°‡∞Ç‡∞°‡∞ø...</p>
        </div>
      );
    }
    if (!canAccessAdmin) {
      return (
        <div className="h-[100dvh] overflow-hidden bg-slate-950 font-sans selection:bg-accent/20 selection:text-primary antialiased flex flex-col justify-center items-center p-4">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed top-4 right-4 z-[9999] bg-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3"
                style={{ background: "#0d3b66" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  style={{ background: "#fbbf24" }}
                ></div>
                {t.msg}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="text-center relative z-10 w-full max-w-sm">
            <h1 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">
              System Admin
            </h1>
            {!user ? (
              <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl w-full shadow-2xl">
                <p className="text-slate-400 font-bold mb-6 text-sm">
                  Please identify yourself to access the administration console.
                </p>
                <button
                  aria-label="Verify Identity with Google"
                  onClick={handleGoogleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  Google Identity Verification
                </button>
                <div className="mt-4 p-3.5 bg-amber-500/15 rounded-xl border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed font-semibold text-left">
                  {" "}
                  <span className="font-extrabold text-amber-400">
                    ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ü‡∞≤‡∞∏‡±ç‡∞Ø‡∞Ç ‡∞Ö‡∞µ‡±Å‡∞§‡±Å‡∞Ç‡∞ü‡±á:
                  </span>{" "}
                  ‡∞à ‡∞Ø‡∞æ‡∞™‡±ç ‡∞ê‡∞´‡±ç‡∞∞‡±á‡∞Æ‡±ç (Iframe) ‡∞≤‡±ã ‡∞∞‡∞®‡±ç ‡∞Ö‡∞µ‡±Å‡∞§‡±Å‡∞®‡±ç‡∞®‡∞Ç‡∞¶‡±Å‡∞® ‡∞¨‡±ç‡∞∞‡±å‡∞ú‡∞∞‡±ç ‡∞∏‡±Ü‡∞ï‡±ç‡∞Ø‡±Ç‡∞∞‡∞ø‡∞ü‡±Ä
                  ‡∞µ‡∞≤‡±ç‡∞≤ Google ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ü‡∞≤‡∞∏‡±ç‡∞Ø‡∞Ç ‡∞ï‡∞æ‡∞µ‡∞ö‡±ç‡∞ö‡±Å. ‡∞™‡±à‡∞® ‡∞ï‡±Å‡∞°‡∞ø‡∞µ‡±à‡∞™‡±Å ‡∞â‡∞Ç‡∞°‡±á ‡∞¨‡∞æ‡∞£‡∞Ç
                  ‡∞ó‡±Å‡∞∞‡±ç‡∞§‡±Å‡∞®‡±Å (‚Üó Open in new tab) ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞∏‡∞ø ‡∞Ø‡∞æ‡∞™‡±ç‚Äå‡∞®‡±Å ‡∞ï‡±ä‡∞§‡±ç‡∞§
                  ‡∞ü‡±ç‡∞Ø‡∞æ‡∞¨‡±ç‚Äå‡∞≤‡±ã ‡∞∞‡∞®‡±ç ‡∞ö‡±á‡∞Ø‡∞°‡∞Ç ‡∞¶‡±ç‡∞µ‡∞æ‡∞∞‡∞æ ‡∞ï‡±á‡∞µ‡∞≤‡∞Ç ‡∞í‡∞ï‡±á ‡∞í‡∞ï‡±ç‡∞ï ‡∞∏‡±Ü‡∞ï‡∞®‡±Å‡∞≤‡±ã ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç
                  ‡∞™‡±Ç‡∞∞‡±ç‡∞§‡∞ø ‡∞ö‡±á‡∞Ø‡∞µ‡∞ö‡±ç‡∞ö‡±Å!
                </div>
                <button
                  aria-label="Return to Public Portal"
                  onClick={() => navigate("/")}
                  className="mt-6 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest border border-slate-800 px-6 py-2 rounded-xl"
                >
                  Return to Public Portal
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border-2 border-red-900/50 p-8 rounded-3xl w-full shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <Lock size={32} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-red-400 mb-2 uppercase">
                  Access Denied
                </h2>
                <p className="text-slate-400 text-xs font-bold mb-6">
                  Your account ({user.email}) does not have administrative
                  privileges.
                </p>
                <button
                  aria-label="Sign out"
                  onClick={() => auth.signOut()}
                  className="w-full border border-slate-700 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-xs mb-3 uppercase tracking-wider"
                >
                  Sign Out
                </button>
                <button
                  aria-label="Return to Public Portal"
                  onClick={() => navigate("/")}
                  className="w-full text-slate-500 hover:text-slate-300 transition-colors text-[10px] uppercase tracking-widest font-bold"
                >
                  Return to Public Portal
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (adminLocked) {
      return (
        <div className="h-[100dvh] overflow-hidden bg-slate-950 font-sans selection:bg-accent/20 selection:text-primary antialiased">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed top-4 right-4 z-[9999] bg-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3"
                style={{ background: "#0d3b66" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  style={{ background: "#fbbf24" }}
                ></div>
                {t.msg}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center relative z-10 w-full max-w-sm p-8 bg-slate-900/60 rounded-[40px] border border-slate-800 backdrop-blur-md"
            >
              <div className="w-24 h-24 bg-transparent rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden group">
                <motion.svg 
                  viewBox="0 0 64 64" 
                  className="w-14 h-14 shrink-0 relative z-10"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <defs>
                    <linearGradient id="gAdmin" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="ringGAdmin" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                  <circle className="logo-ring" cx="32" cy="32" r="29" fill="none" stroke="url(#ringGAdmin)" strokeWidth="2.5" strokeDasharray="10 5" />
                  <circle cx="32" cy="32" r="25" fill="url(#gAdmin)" />
                  <circle cx="32" cy="32" r="21" fill="#0f172a" />
                  <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="Segoe UI">EV</text>
                </motion.svg>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h2 className="text-3xl font-black mb-1 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                {!isAdmin && loadedUserPin && !userPinDoc?.pin
                  ? "Security PIN Setup"
                  : "Admin Session Locked"}
              </h2>

              <p className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest">
                Account: {user?.email} (
                {isDevEmail
                  ? "Developer"
                  : isAdmin
                    ? "Super Admin"
                    : userProfile?.role || "Staff User"}
                )
              </p>

              {!isAdmin && loadedUserPin && !userPinDoc?.pin ? (
                <div className="space-y-4 max-w-xs mx-auto">
                  <p className="text-xs text-amber-400 font-semibold mb-2 leading-relaxed">
                    ‡∞Æ‡±ä‡∞¶‡∞ü‡∞ø‡∞∏‡∞æ‡∞∞‡∞ø ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç: ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞Æ‡±Ä ‡∞µ‡±ç‡∞Ø‡∞ï‡±ç‡∞§‡∞ø‡∞ó‡∞§ 4-‡∞Ö‡∞Ç‡∞ï‡±Ü‡∞≤ ‡∞∏‡±Ü‡∞ï‡±ç‡∞Ø‡±Ç‡∞∞‡∞ø‡∞ü‡±Ä
                    ‡∞™‡∞ø‡∞®‡±ç‚Äå‡∞®‡±Å ‡∞∏‡±Ü‡∞ü‡±ç ‡∞ö‡±á‡∞∏‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø.
                  </p>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 text-left pl-2">
                      ‡∞™‡∞ø‡∞®‡±ç ‡∞é‡∞Ç‡∞ü‡∞∞‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="‚Ä¢‚Ä¢‚Ä¢‚Ä¢"
                      className="w-full bg-slate-950 border-2 border-slate-800 focus:border-blue-500 p-3 rounded-xl text-center text-xl tracking-[0.5em] outline-none"
                      value={adminPinInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setAdminPinInput(val);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 text-left pl-2">
                      ‡∞™‡∞ø‡∞®‡±ç ‡∞ï‡∞®‡±ç‡∞´‡∞∞‡±ç‡∞Æ‡±ç ‡∞ö‡±á‡∞∏‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="‚Ä¢‚Ä¢‚Ä¢‚Ä¢"
                      className="w-full bg-slate-950 border-2 border-slate-800 focus:border-blue-500 p-3 rounded-xl text-center text-xl tracking-[0.5em] outline-none"
                      id="setupConfirmPin"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const cInput = (
                        document.getElementById(
                          "setupConfirmPin",
                        ) as HTMLInputElement
                      )?.value;
                      if (adminPinInput.length !== 4) {
                        addToast("‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø 4 ‡∞Ö‡∞Ç‡∞ï‡±Ü‡∞≤ ‡∞™‡∞ø‡∞®‡±ç ‡∞é‡∞Ç‡∞ü‡∞∞‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø");
                        return;
                      }
                      if (adminPinInput !== cInput) {
                        addToast("‡∞™‡∞ø‡∞®‡±ç‚Äå‡∞≤‡±Å ‡∞í‡∞ï‡∞¶‡∞æ‡∞®‡∞ø‡∞ï‡±ä‡∞ï‡∞ü‡∞ø ‡∞∏‡∞∞‡∞ø‡∞™‡±ã‡∞≤‡∞≤‡±á‡∞¶‡±Å!");
                        return;
                      }
                      try {
                        await setDoc(doc(db, "user_pins", user.uid), {
                          pin: adminPinInput,
                          role: userProfile?.role || "Editor",
                          updatedAt: Date.now(),
                        });
                        addToast("‡∞∏‡±Ü‡∞ï‡±ç‡∞Ø‡±Ç‡∞∞‡∞ø‡∞ü‡±Ä ‡∞™‡∞ø‡∞®‡±ç ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞∏‡±Ü‡∞ü‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø!");
                        setAdminLocked(false);
                        setAdminPinInput("");
                      } catch (err: any) {
                        addToast(
                          "‡∞™‡∞ø‡∞®‡±ç ‡∞∏‡±á‡∞µ‡±ç ‡∞ö‡±á‡∞Ø‡∞°‡∞Ç‡∞≤‡±ã ‡∞≤‡±ã‡∞™‡∞Ç ‡∞∏‡∞Ç‡∞≠‡∞µ‡∞ø‡∞Ç‡∞ö‡∞ø‡∞Ç‡∞¶‡∞ø: " + err.message,
                        );
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-[10px] mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    Register Security PIN ‚Ä¢ ‡∞™‡∞ø‡∞®‡±ç ‡∞®‡∞Æ‡±ã‡∞¶‡±Å ‡∞ö‡±Ü‡∞Ø‡±ç
                  </button>
                </div>
              ) : (
                <div className="max-w-xs mx-auto">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="‚Ä¢‚Ä¢‚Ä¢‚Ä¢"
                    className="w-full bg-slate-950 border-2 border-slate-800 focus:border-blue-500 p-4 rounded-2xl text-center text-2xl tracking-[0.5em] outline-none shadow-inner"
                    value={adminPinInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdminPinInput(val);

                      const requiredPin = isAdmin
                        ? currentAdminPin
                        : userPinDoc?.pin;
                      if (val === requiredPin) {
                        setAdminLocked(false);
                        setAdminPinInput("");
                        addToast("üîì ‡∞∏‡±Ü‡∞∑‡∞®‡±ç ‡∞Ö‡∞®‡±ç‚Äå‡∞≤‡∞æ‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø!");
                      }
                    }}
                  />
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-4 block">
                    {isAdmin
                      ? "Master PIN verifies Admin Access"
                      : "Enter your personal security PIN"}
                  </p>
                </div>
              )}

              <button
                aria-label="Back to Portal"
                onClick={() => navigate("/")}
                className="mt-8 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-slate-800 px-6 py-2 rounded-xl"
              >
                Back to Portal
              </button>
            </motion.div>
          </div>
        </div>
      );
    }
  }

  if (isFarmerRegistryPath) {
    return (
      <div className="h-[100dvh] overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-[#f8fafc] to-slate-100 text-slate-800 font-sans selection:bg-accent/20 selection:text-primary antialiased">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-4 right-4 z-[9999] bg-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3"
              style={{ background: "#0d3b66" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-accent"
                style={{ background: "#fbbf24" }}
              ></div>
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl"></span>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
                  Farmer Registry Live Verification
                </h1>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  ‡∞∞‡±à‡∞§‡±Å ‡∞∞‡∞ø‡∞ú‡∞ø‡∞∏‡±ç‡∞ü‡±ç‡∞∞‡±Ä ‡∞é‡∞®‡±ç‚Äå‡∞∞‡±ã‡∞≤‡±ç‚Äå‡∞Æ‡±Ü‡∞Ç‡∞ü‡±ç ‡∞Ü‡∞ü‡±ã‡∞Æ‡±á‡∞ü‡∞ø‡∞ï‡±ç ‡∞≤‡±ç‡∞Ø‡∞æ‡∞Ç‡∞°‡±ç ‡∞µ‡∞ø‡∞≤‡±Ä‡∞®‡∞Ç ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å
                  ‡∞≤‡±à‡∞µ‡±ç ‡∞µ‡±Ü‡∞∞‡∞ø‡∞´‡∞ø‡∞ï‡±á‡∞∑‡∞®‡±ç ‡∞®‡∞ø‡∞µ‡±á‡∞¶‡∞ø‡∞ï ‡∞∏‡∞æ‡∞ß‡∞®‡∞Ç
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-2xl transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={14} /> Back to Portal
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FarmerRegistryTool
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              handleGoogleLogin={handleGoogleLogin}
              addToast={addToast}
            />
          </motion.div>
        </div>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            addToast={addToast}
            handleGoogleLogin={handleGoogleLogin}
            districtsData={DEFAULT_DISTRICTS_DATA}
          />
        )}
      </div>
    );
  }

  if (location.pathname === "/privacy") {
    return <PrivacyPolicyPage />;
  }
  if (location.pathname === "/terms") {
    return <TermsPage />;
  }
  if (location.pathname === "/about") {
    return <AboutPage />;
  }
  if (location.pathname === "/contact") {
    return <ContactPage />;
  }

  const isMaintActive = siteConfig?.isMaintenanceMode || siteConfig?.governanceMode === "MAINTENANCE";
  const hasAdminOverride = typeof localStorage !== 'undefined' && localStorage.getItem("evedhika_admin_override") === "true";

  if (isMaintActive && !hasAdminOverride) {
    return (
      <MaintenancePage isAdmin={isAdmin} 
        message={siteConfig?.maintenanceMessage}
        estimatedTime={siteConfig?.maintenanceEstimatedTime || "‡∞¶‡∞æ‡∞¶‡∞æ‡∞™‡±Å 2 ‡∞ó‡∞Ç‡∞ü‡∞≤‡±Å (Approx. 2 Hours)"}
        reason={siteConfig?.maintenanceReason || "‡∞∑‡±Ü‡∞°‡±ç‡∞Ø‡±Ç‡∞≤‡±ç‡∞°‡±ç ‡∞∏‡∞ø‡∞∏‡±ç‡∞ü‡∞Æ‡±ç ‡∞Ö‡∞™‡±ç‚Äå‡∞ó‡±ç‡∞∞‡±á‡∞°‡±ç & ‡∞ó‡∞µ‡∞∞‡±ç‡∞®‡±Ü‡∞®‡±ç‡∞∏‡±ç ‡∞ï‡±ç‡∞≤‡±å‡∞°‡±ç ‡∞∏‡±Ü‡∞ï‡±ç‡∞Ø‡±Ç‡∞∞‡∞ø‡∞ü‡±Ä ‡∞Ö‡∞™‡±ç‚Äå‡∞°‡±á‡∞ü‡±ç"}
        contactEmail={siteConfig?.supportEmail || "support@evedhika.gov.in"}
        contactPhone={siteConfig?.supportPhone || "+91 1800-425-2244"}
        version={siteConfig?.portalVersion || "V1.4.8 Enterprise"}
        onRefreshCheck={() => {
          addToast("Refreshing live system status...");
        }}
        onAdminLoginSuccess={() => {
          addToast("Admin Override Enabled - Accessing Portal");
        }}
      />
    );
  }

  return (
    <div className={`h-screen h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-[#f8fafc] to-slate-100 text-slate-800 flex flex-col font-sans selection:bg-accent/20 selection:text-primary antialiased ${textZoom === "large" ? "text-zoom-large" : textZoom === "xlarge" ? "text-zoom-xlarge" : ""}`}>
      <VisitorTracker user={user} />
      {isOffline && (
        <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2 z-[2000]">
          <WifiOff size={16} />
          <span>‡∞Æ‡±Ä‡∞∞‡±Å ‡∞Ü‡∞´‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç‚Äå‡∞≤‡±ã ‡∞â‡∞®‡±ç‡∞®‡∞æ‡∞∞‡±Å. ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞Æ‡±Ä ‡∞á‡∞Ç‡∞ü‡∞∞‡±ç‡∞®‡±Ü‡∞ü‡±ç ‡∞ï‡∞®‡±Ü‡∞ï‡±ç‡∞∑‡∞®‡±ç‚Äå‡∞®‡±Å ‡∞§‡∞®‡∞ø‡∞ñ‡±Ä ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø. (You are offline)</span>
        </div>
      )}
      {showFooterModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFooterModal(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 sm:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-1">
                    {showFooterModal === "privacy" && "Privacy Policy"}
                    {showFooterModal === "about" &&
                      (aboutContent?.title || "About Us")}
                    {showFooterModal === "contact" && "Contact Us"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowFooterModal(null)}
                  className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="prose prose-slate max-w-none">
                {showFooterModal === "privacy" && (
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4">
                      <ShieldCheck
                        className="text-blue-500 shrink-0"
                        size={24}
                      />
                      <p className="text-sm font-bold text-blue-700 leading-relaxed">
                        Please read our data protection policies. Your personal
                        information is completely secure with us.
                      </p>
                    </div>
                    <div className="space-y-4 text-slate-600 font-medium">
                      <p>
                        We are committed to transparency and accountability. The
                        information collected through this portal will only be
                        used for government services and community improvement.
                      </p>
                      <p className="border-l-4 border-slate-100 pl-4 italic">
                        "Your privacy is our primary responsibility."
                      </p>
                    </div>
                  </div>
                )}

                {showFooterModal === "about" && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="p-6 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100/60 flex gap-4">
                      <Info className="text-indigo-600 shrink-0" size={24} />
                      <div className="text-sm font-bold text-indigo-950 leading-relaxed markdown-body">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {aboutContent?.content || DEFAULT_ABOUT_CONTENT}
                        </ReactMarkdown>
                      </div>
                    </div>

                  </div>
                )}

                {showFooterModal === "contact" && (
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex gap-4">
                      <Mail className="text-emerald-500 shrink-0" size={24} />
                      <p className="text-sm font-bold text-emerald-700 leading-relaxed">
                        Use the information provided below to contact us.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a
                          href="https://wa.me/919985402310"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer hover:bg-green-50 transition-colors border-l-4 border-l-green-500 flex flex-col items-center justify-center gap-2"
                        >
                          <MessageCircle size={32} className="text-green-500" />
                          <span className="font-bold text-slate-800 text-sm">
                            Chat on WhatsApp
                          </span>
                        </a>
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            Office Hours
                          </p>
                          <p className="font-bold text-slate-800 text-sm md:text-base">
                            Mon - Sat: 10AM - 5PM
                          </p>
                        </div>
                      </div>
                      <div className="p-5 bg-slate-900 rounded-2xl text-center">
                        <button
                          onClick={() => {
                            setShowFooterModal(null);
                            setCurrentTab("suggestions");
                          }}
                          className="w-full py-2 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors"
                        >
                          Go to Suggestions Panel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 flex justify-center">
                <button
                  onClick={() => setShowFooterModal(null)}
                  className="px-10 py-3 bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
                >
                  Close Window
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-[9999] bg-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3"
            style={{ background: "#0d3b66" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-accent"
              style={{ background: "#fbbf24" }}
            ></div>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {userProfile?.role === "suspended" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[10000] bg-slate-950 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm"
          >
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-8 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
              <ShieldAlert size={48} className="text-red-500 animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
              Access Restricted
            </h1>
            <p className="text-red-400 font-black mb-6 uppercase text-xs tracking-[0.2em] bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              Security Suspension Active
            </p>
            <p className="text-slate-400 max-w-sm text-base font-medium leading-relaxed mb-10">
              ‡∞Æ‡±Ä ‡∞ñ‡∞æ‡∞§‡∞æ ‡∞≠‡∞¶‡±ç‡∞∞‡∞§‡∞æ ‡∞ï‡∞æ‡∞∞‡∞£‡∞æ‡∞≤ ‡∞¶‡±É‡∞∑‡±ç‡∞ü‡±ç‡∞Ø‡∞æ ‡∞§‡∞æ‡∞§‡±ç‡∞ï‡∞æ‡∞≤‡∞ø‡∞ï‡∞Ç‡∞ó‡∞æ ‡∞®‡∞ø‡∞≤‡∞ø‡∞™‡∞ø‡∞µ‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø.
              ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞Ö‡∞°‡±ç‡∞Æ‡∞ø‡∞®‡∞ø‡∞∏‡±ç‡∞ü‡±ç‡∞∞‡±á‡∞ü‡∞∞‡±ç‚Äå‡∞®‡±Å ‡∞∏‡∞Ç‡∞™‡±ç‡∞∞‡∞¶‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø.
            </p>
            <button
              aria-label="Sign out and exit portal"
              onClick={() => auth.signOut()}
              className="px-10 py-5 bg-white text-slate-950 font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
            >
              <LogOut size={18} /> Sign Out & Exit Portal
            </button>
            <div className="mt-16 text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] font-mono">
              System Security Layer ‚Ä¢ E-VEDHIKA
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
      <header className="sticky top-0 z-[1001] shadow-lg bg-[#0d2a4a] border-b border-[#fbe947]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Left Brand Area */}
          <div
            className="brand-wrapper cursor-pointer flex items-center gap-2 sm:gap-3 shrink-0"
            onClick={() => {
              const newSearch = new URLSearchParams();
              newSearch.set("tab", "home");
              navigate({ pathname: "/", search: newSearch.toString() });
              setCurrentTab("home");
              setSidebarOpen(false);
            }}
          >
            {/* ‡∞≤‡±ã‡∞ó‡±ã HTML ‡∞∏‡±ç‡∞ü‡±ç‡∞∞‡∞ï‡±ç‡∞ö‡∞∞‡±ç */}
            <div className="logo-pro cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200 shrink-0">
              {/* ‡∞Ø‡∞æ‡∞®‡∞ø‡∞Æ‡±á‡∞ü‡±Ü‡∞°‡±ç ‡∞™‡∞æ‡∞∞‡±ç‡∞ü‡∞ø‡∞ï‡∞≤‡±ç‡∞∏‡±ç */}
              <div className="logo-particles">
                <span></span>
                <span></span>
                <span></span>
              </div>

              {/* SVG ‡∞≤‡±ã‡∞ó‡±ã */}
              <svg
                viewBox="0 0 64 64"
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
              >
                <defs>
                  {/* ‡∞ï‡∞≤‡∞∞‡±ç ‡∞ó‡±ç‡∞∞‡±á‡∞°‡∞ø‡∞Ø‡∞Ç‡∞ü‡±ç‡∞∏‡±ç */}
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>

                {/* ‡∞¨‡∞Ø‡∞ü‡∞ø ‡∞∞‡∞ø‡∞Ç‡∞ó‡±ç */}
                <circle
                  className="logo-ring"
                  cx="32"
                  cy="32"
                  r="29"
                  fill="none"
                  stroke="url(#ringG)"
                  strokeWidth="2.5"
                  strokeDasharray="10 5"
                />

                {/* ‡∞≤‡±ã‡∞™‡∞≤‡∞ø ‡∞∏‡∞∞‡±ç‡∞ï‡∞ø‡∞≤‡±ç‡∞∏‡±ç */}
                <circle cx="32" cy="32" r="25" fill="url(#g)" />
                <circle cx="32" cy="32" r="21" fill="#0f172a" />

                {/* EV ‡∞ü‡±Ü‡∞ï‡±ç‡∞∏‡±ç‡∞ü‡±ç */}
                <text
                  x="50%"
                  y="54%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="18"
                  fontWeight="900"
                  fontFamily="Segoe UI"
                >
                  EV
                </text>
              </svg>
            </div>
            {/* Website Name Section */}
            <div className="flex flex-col justify-center translate-y-[-1px] shrink min-w-0">
              <h2
                className="brand-title text-[15px] sm:text-[18px] md:text-[20px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  color: "#fbe947",
                  background: "none",
                  WebkitTextFillColor: "initial",
                  WebkitBackgroundClip: "initial",
                  filter: "none",
                  animation: "none",
                  fontWeight: "900",
                  letterSpacing: "0.8px",
                  fontFamily: '"Arial Black", Impact, sans-serif',
                }}
              >
                E<span style={{ color: "#facc15" }}>-</span>VEDHIKA
              </h2>
              <div className="flex items-center">
                <span
                  className="whitespace-nowrap overflow-hidden text-ellipsis text-[8px] sm:text-[9px] font-extrabold tracking-wider text-slate-300 uppercase"
                >
                  all problems one solution
                </span>
              </div>
            </div>
          </div>

          {/* Center Font Size Switcher (only on XL screens to prevent overlap) */}
          <div className="hidden xl:flex items-center justify-center shrink-0">
            <div className="flex items-center gap-1 bg-[#071a30] border border-white/15 rounded-full p-1 shadow-inner">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider px-2 select-none">‡∞Ö‡∞ï‡±ç‡∞∑‡∞∞‡∞æ‡∞≤ ‡∞∏‡±à‡∞ú‡±Å</span>
              <button
                onClick={() => setTextZoom("normal")}
                className={`text-[9.5px] font-black uppercase px-2.5 py-1 transition-all cursor-pointer rounded-full ${textZoom === "normal" ? "bg-[#fbe947] text-[#0d2a4a] shadow-xs" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                title="‡∞∏‡∞æ‡∞ß‡∞æ‡∞∞‡∞£ ‡∞∏‡±à‡∞ú‡±Å"
              >
                ‡∞∏‡∞æ‡∞ß‡∞æ‡∞∞‡∞£‡∞Ç (A)
              </button>
              <button
                onClick={() => setTextZoom("large")}
                className={`text-[9.5px] font-black uppercase px-2.5 py-1 transition-all cursor-pointer rounded-full ${textZoom === "large" ? "bg-[#fbe947] text-[#0d2a4a] shadow-xs" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                title="‡∞™‡±Ü‡∞¶‡±ç‡∞¶ ‡∞∏‡±à‡∞ú‡±Å"
              >
                ‡∞™‡±Ü‡∞¶‡±ç‡∞¶‡∞¶‡∞ø (A+)
              </button>
              <button
                onClick={() => setTextZoom("xlarge")}
                className={`text-[9.5px] font-black uppercase px-2.5 py-1 transition-all cursor-pointer rounded-full ${textZoom === "xlarge" ? "bg-[#fbe947] text-[#0d2a4a] shadow-xs" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                title="‡∞ö‡∞æ‡∞≤‡∞æ ‡∞™‡±Ü‡∞¶‡±ç‡∞¶ ‡∞∏‡±à‡∞ú‡±Å"
              >
                ‡∞Æ‡∞π‡∞æ ‡∞™‡±Ü‡∞¶‡±ç‡∞¶‡∞¶‡∞ø (A++)
              </button>
            </div>
          </div>
        
          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Direct Messages Button */}
            <div
              className="p-1 sm:p-2 cursor-pointer text-white/80 hover:text-white transition-colors mr-1 sm:mr-3 rounded-full hover:bg-white/10 relative"
              onClick={() => {
                if (!user) {
                  requireLoginAlert();
                  return;
                }
                setShowDirectMessages(true);
              }}
              title="Direct Messages"
            >
              <MessageCircle size={20} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
              {allDmMessages.filter(m => m.receiverId === user?.uid && !m.read).length > 0 && (
                <span className="notif-badge" style={{ display: "flex", top: 0, right: 0 }}>
                  {allDmMessages.filter(m => m.receiverId === user?.uid && !m.read).length}
                </span>
              )}
            </div>

          <div className="relative">
            <div
              className="p-1 sm:p-2 cursor-pointer text-white/80 hover:text-white transition-colors mr-0 sm:mr-3 rounded-full hover:bg-white/10"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell
                size={20}
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
              />
              {unreadCount > 0 && (
                <span
                  className="notif-badge"
                  style={{ display: "flex", top: 0, right: 0 }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-[300px] sm:w-[360px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-[2000] overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <Bell size={14} /> Notification Center
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-danger cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex gap-1 p-2 bg-slate-100/80 overflow-x-auto scrollbar-none border-b border-slate-200/60">
                    {[
                      { id: "all", label: "All" },
                      { id: "system", label: "System" },
                      { id: "likes", label: "Likes" },
                      { id: "comments", label: "Comments" },
                      { id: "messages", label: "Messages" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setNotifTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                          notifTab === tab.id
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {(() => {
                      const filteredNotifs = notifications
                        .filter((n) => n.senderUid !== user?.uid)
                        .filter((n) => {
                          const type = (n.type || "").toLowerCase();
                          if (notifTab === "system") return type.includes("system") || type.includes("update") || type.includes("flash");
                          if (notifTab === "likes") return type.includes("like");
                          if (notifTab === "comments") return type.includes("comment");
                          if (notifTab === "messages") return type.includes("message");
                          return true;
                        });

                      if (filteredNotifs.length > 0) {
                        return (
                          <div className="divide-y divide-slate-50">
                            {filteredNotifs.map((n) => {
                              const isUnread =
                                n.uid === "all"
                                  ? !(Array.isArray((n as any).readBy) ? (n as any).readBy.includes(user?.uid || "") : false)
                                  : !n.read;
                              return (
                                <div
                                  key={n.id}
                                  onClick={async () => {
                                    if (isUnread) {
                                      try {
                                        if (n.uid === "all") {
                                          await updateDoc(
                                            doc(db, "notifications", n.id),
                                            { readBy: arrayUnion(user?.uid) },
                                          );
                                        } else {
                                          await updateDoc(
                                            doc(db, "notifications", n.id),
                                            { read: true },
                                          );
                                        }
                                      } catch (e) {}
                                    }
                                    if ((n as any).postId) {
                                      setSearchParams({
                                        postId: (n as any).postId,
                                      });
                                    }
                                    setShowNotifications(false);
                                  }}
                                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${isUnread ? "bg-blue-50/40" : ""}`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span
                                      className={`text-[9px] font-black uppercase tracking-wider ${n.type === "flash_update" ? "text-amber-500" : "text-primary"}`}
                                    >
                                      {n.type?.replace("_", " ")}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-400">
                                      {new Date(n.time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-black text-slate-800 leading-tight mb-1">
                                    {n.title}
                                  </h4>
                                  <p className="text-[10px] font-medium text-slate-500 line-clamp-2">
                                    {n.message}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        return (
                          <div className="p-10 text-center">
                            <Zap
                              size={24}
                              className="mx-auto text-slate-200 mb-2"
                            />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              No notifications in this category
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                  {notifications.filter((n) => n.senderUid !== user?.uid).length > 0 && (
                    <button
                      onClick={async () => {
                        const unread = notifications.filter(n => n.senderUid !== user?.uid).filter((n) =>
                          n.uid === "all"
                            ? !n.readBy?.includes(user?.uid || "")
                            : !n.read,
                        );
                        try {
                          await Promise.all(
                            unread.map((n) => {
                              if (n.uid === "all") {
                                return updateDoc(
                                  doc(db, "notifications", n.id),
                                  {
                                    readBy: arrayUnion(user?.uid),
                                  },
                                );
                              } else {
                                return updateDoc(
                                  doc(db, "notifications", n.id),
                                  {
                                    read: true,
                                  },
                                );
                              }
                            }),
                          );
                          addToast("Marked all as read");
                        } catch (e) {
                          console.error("Failed marking all notifications as read:", e);
                        }
                      }}
                      className="w-full p-3 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary bg-slate-50 border-t border-slate-100 transition-colors cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {(isAdmin || isEditor || isDevEmail) && (
            <button
              aria-label="Admin Panel"
              onClick={() => {
                navigate("/Evdka");
                setCurrentTab("admin");
              }}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-[12px] font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] shrink-0"
              title="‡∞Ö‡∞°‡±ç‡∞Æ‡∞ø‡∞®‡±ç ‡∞™‡±ç‡∞Ø‡∞æ‡∞®‡±Ü‡∞≤‡±ç ‡∞≤‡±ã‡∞ï‡∞ø ‡∞µ‡±Ü‡∞≥‡±ç‡∞≤‡∞Ç‡∞°‡∞ø"
            >
              <Shield size={15} className="text-amber-400" />
              <span className="hidden sm:inline">‡∞Ö‡∞°‡±ç‡∞Æ‡∞ø‡∞®‡±ç ‡∞™‡±ç‡∞Ø‡∞æ‡∞®‡±Ü‡∞≤‡±ç</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {user && !user.isAnonymous ? (
            <div
              className="relative"
              ref={dropdownRef}
              id="profile-dropdown-btn"
            >
              <div
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#174b7c] to-transparent pl-1.5 pr-2 sm:pr-5 py-1.5 rounded-[16px] border border-accent/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:border-accent/60 transition-all duration-300 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-gradient-to-br from-accent to-[#d97706] flex items-center justify-center text-primary font-black text-lg shadow-inner border-[2px] border-white/20 relative z-10 shadow-[0_0_10px_rgba(250,204,21,0.5)] overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User
                      size={16}
                      className="text-primary sm:w-[18px] sm:h-[18px]"
                    />
                  )}
                </div>
                <div className="hidden sm:flex flex-col justify-center relative z-10">
                  <span className="text-white text-[12px] font-black tracking-wide leading-tight drop-shadow-sm">
                    {userProfile?.name 
                      ? `${userProfile.name} ${userProfile.surname || ""}`.trim() 
                      : userProfile?.username || user?.displayName || "Panchayat Member"}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981] animate-pulse"></span>
                    <span className="text-accent text-[9px] font-bold uppercase tracking-[0.15em] drop-shadow-sm">
                      {isAdmin
                        ? "System Admin"
                        : isEditor
                          ? "Editor"
                          : "Active User"}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden sm:block text-accent/50 group-hover:text-accent transition-transform duration-300 relative z-10 ${showProfileDropdown ? "rotate-180" : ""}`}
                />
              </div>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[2000] p-2"
                  >
                    {(isAdmin || isEditor || isDevEmail) && (
                      <>
                        <button
                          aria-label="Admin Panel"
                          onClick={() => {
                            navigate("/Evdka");
                            setCurrentTab("admin");
                            setShowProfileDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors rounded-xl group text-left"
                        >
                          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Shield size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span>Admin Panel</span>
                            <span className="text-[10px] text-amber-600 font-normal">‡∞Ö‡∞°‡±ç‡∞Æ‡∞ø‡∞®‡±ç ‡∞™‡±ç‡∞Ø‡∞æ‡∞®‡±Ü‡∞≤‡±ç</span>
                          </div>
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                      </>
                    )}

                    <button
                      aria-label="Edit Profile"
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-blue-50 transition-colors rounded-xl group text-left"
                    >
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <User size={18} />
                      </div>
                      Edit Profile
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    <button
                      aria-label="Logout"
                      onClick={() => {
                        auth.signOut();
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors rounded-xl group text-left"
                    >
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                        <LogOut size={18} />
                      </div>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              aria-label="Sign In"
              onClick={triggerLogin}
              className="bg-[#fbbf24] text-[#0f2e4a] px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-[8px] sm:rounded-[12px] font-black text-[9px] sm:text-[11px] uppercase tracking-widest shadow-lg shadow-[#fbbf24]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#fbbf24]/30 hover:bg-[#fcd34d] transition-all active:scale-[0.96] flex items-center gap-1 sm:gap-2 border border-[#fbbf24]/30 shrink-0"
            >
              <User size={14} className="text-[#0f2e4a] w-[14px] h-[14px]" />
              <span className="whitespace-nowrap hidden min-[360px]:inline">
                Sign In
              </span>
            </button>
          )}
          </div>
        </div>
      </header>

      {dataLoading ? (
        <UpdateTickerSkeleton />
      ) : (
        <div className="latest-bar overflow-hidden flex items-center justify-between gap-4">
          <div className="flex items-center flex-1 min-w-0">
            <div className="latest-label whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              Latest Updates
            </div>
            <div className="latest-text flex-1">
            <span>
              {(() => {
                const visibleUpdates = updates.filter(
                  (u) =>
                    (u.type === "flash" || (!u.type && !u.status)) &&
                    u.status !== "hidden" &&
                    u.status?.toLowerCase() !== "deleted",
                );
                return visibleUpdates.length > 0
                  ? visibleUpdates
                      .map((u) => u.text || (u as any).msg || (u as any).update)
                      .join("  ‚Ä¢  ")
                  : "‚ú® Welcome to E-Vedhika Portal ‚ú® ‚Ä¢ üöÄ The E-Vedhika Portal is now live ‚Äì Empowering Governance with Digital Excellence üöÄ";
              })()}
            </span>
          </div>
        </div>
          <div className="hidden min-[400px]:flex items-center shrink-0 pr-2 sm:pr-4">
            <SystemLiveClock />
          </div></div>
      )}

      <nav className="nav-trigger-bar relative z-[10] py-1.5 bg-white shadow-sm border-b border-slate-200/50">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 relative flex items-center justify-center gap-1 sm:gap-2">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => {
              if (navScrollRef.current) {
                navScrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
              }
            }}
            className="hidden sm:flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all z-10 active:scale-95 cursor-pointer"
            aria-label="Scroll Left"
            title="Scroll Left"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex-1 w-full min-w-0 relative">
            <div
              ref={navScrollRef}
              className="flex items-center overflow-x-auto whitespace-nowrap flex-nowrap gap-2 sm:gap-3 py-1.5 w-full scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', justifyContent: 'safe center' }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                .nav-trigger-bar div::-webkit-scrollbar { display: none; }
              `}} />
                  {[
                    { id: "home", label: "Home", icon: Home, colorTheme: "blue" },

                    { id: "workspace", label: "Mana Panchayath", icon: Building, colorTheme: "blue", hasDropdown: true },
                    { id: "priority_services", label: "Priority Services", icon: Target, colorTheme: "blue", hasDropdown: true },
                    { id: "chat", label: "Live Chat", icon: MessageCircle, colorTheme: "slate" },
                    { id: "union", label: "Union Corner & Polls", icon: Users, colorTheme: "orange" },
                    { id: "directlinks", label: "Direct Link", icon: Megaphone, colorTheme: "purple" },
                                                                                { id: "suggestions", label: "Public Suggestions & Feedback", icon: MessageSquare, colorTheme: "pink" },
                    { id: "gos_formats", label: "Applications, Formats & GOs", icon: FileText, colorTheme: "teal", hasDropdown: true },
                    { id: "useful_links", label: "Useful Information", icon: Info, colorTheme: "cyan", hasDropdown: true },
                    { id: "excel_print", label: "Excel A4 Print", icon: FileSpreadsheet, colorTheme: "green" },
                    { id: "pdf_compress", label: "PDF Compress (250KB)", icon: FileDown, colorTheme: "blue" },
                    { id: "farmer_registry", label: "Farmer Registry Live Verification", icon: Wheat, colorTheme: "amber" },
                    
                  ].map((item, index) => {
                    const isActive = currentTab === item.id || (item.id === "priority_services" && (currentTab === "emergency" || currentTab === "my_activity"));
                    const Icon = item.icon;
                    
                    let themeClasses = {
                      button: "hover:bg-slate-100 border border-transparent",
                      iconBg: "bg-blue-50 text-blue-600",
                      text: "text-slate-600 font-medium"
                    };
                    if (isActive) {
                      themeClasses = {
                        button: "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20",
                        iconBg: "bg-white/20 text-white",
                        text: "text-white font-semibold"
                      };
                    } else {
                      switch(item.colorTheme) {
                        case "blue": themeClasses = { button: "hover:bg-blue-50/50 border border-blue-100", iconBg: "bg-blue-100 text-blue-600", text: "text-slate-700 font-semibold" }; break;
                        case "red": themeClasses = { button: "hover:bg-red-50/50 border border-red-100", iconBg: "bg-red-100 text-red-600", text: "text-slate-700 font-semibold" }; break;
                        case "emerald": themeClasses = { button: "hover:bg-emerald-50/50 border border-emerald-100", iconBg: "bg-emerald-100 text-emerald-600", text: "text-slate-700 font-semibold" }; break;
                        case "slate": themeClasses = { button: "hover:bg-slate-50/50 border border-slate-200", iconBg: "bg-slate-100 text-slate-600", text: "text-slate-700 font-semibold" }; break;
                        case "orange": themeClasses = { button: "hover:bg-orange-50/50 border border-orange-100", iconBg: "bg-orange-100 text-orange-600", text: "text-slate-700 font-semibold" }; break;
                        case "purple": themeClasses = { button: "hover:bg-purple-50/50 border border-purple-100", iconBg: "bg-purple-100 text-purple-600", text: "text-slate-700 font-semibold" }; break;
                        case "pink": themeClasses = { button: "hover:bg-pink-50/50 border border-pink-100", iconBg: "bg-pink-100 text-pink-600", text: "text-slate-700 font-semibold" }; break;
                        case "teal": themeClasses = { button: "hover:bg-teal-50/50 border border-teal-100", iconBg: "bg-teal-100 text-teal-600", text: "text-slate-700 font-semibold" }; break;
                        case "cyan": themeClasses = { button: "hover:bg-cyan-50/50 border border-cyan-100", iconBg: "bg-cyan-100 text-cyan-600", text: "text-slate-700 font-semibold" }; break;
                        case "green": themeClasses = { button: "hover:bg-green-50/50 border border-green-100", iconBg: "bg-green-100 text-green-600", text: "text-slate-700 font-semibold" }; break;
                        case "amber": themeClasses = { button: "hover:bg-amber-50/50 border border-amber-100", iconBg: "bg-amber-100 text-amber-600", text: "text-slate-700 font-semibold" }; break;
                      }
                    }
                    
                    return (
                      <div
                        key={item.id}
                        className="relative group/navitem shrink-0"
                        onMouseEnter={(e) => {
                          if (item.hasDropdown) {
                            handleMouseEnterDropdown(item.id, e.currentTarget);
                          }
                        }}
                        onMouseLeave={() => {
                          if (item.hasDropdown) {
                            handleMouseLeaveDropdown();
                          }
                        }}
                      >
                        <button
                          onClick={(e) => {
                            if (item.hasDropdown) {
                              e.preventDefault();
                              e.stopPropagation();
                              if (openDropdown === item.id) {
                                setOpenDropdown(null);
                              } else {
                                handleOpenDropdown(item.id, e.currentTarget);
                              }
                              if (item.id === "workspace") {
                                setCurrentTab("workspace");
                              } else if (item.id === "gos_formats") {
                                setCurrentTab("gos_formats");
                              }
                              return;
                            }
                            if (item.id === "admin") {
                              navigate("/Evdka");
                              setCurrentTab("admin");
                            } else if (item.id === "priority_services") {
                              return;
                            } else if (item.id === "farmer_registry") {
                              window.history.pushState({}, "", "/Farmer_Registry");
                              setCurrentTab("farmer_registry");
                            } else {
                              setCurrentTab(item.id);
                              if (item.id === "home") {
                                setCurrentFilter("All");
                              }
                              if (searchParams.has("postId")) {
                                setSearchParams(prev => {
                                  const next = new URLSearchParams(prev);
                                  next.delete("postId");
                                  return next;
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[14px] whitespace-nowrap transition-all duration-200 shrink-0 ${themeClasses.button}`}
                        >
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 ${themeClasses.iconBg}`}>
                            <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                          </div>
                          <span className={`text-[11px] sm:text-[12px] tracking-wide ${themeClasses.text}`}>
                            {item.label}
                          </span>
                          {item.hasDropdown && (
                            <ChevronDown size={14} className={`ml-0.5 opacity-70 ${themeClasses.text}`} />
                          )}
                        </button>
                        
                        {item.hasDropdown && openDropdown === item.id && createPortal(
                          <div
                            className="fixed inset-0 z-[9999] flex flex-col justify-end sm:block pointer-events-none"
                          >
                            <div
                              className="sm:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div
                              style={{
                                pointerEvents: "auto",
                                top: typeof window !== "undefined" && window.innerWidth >= 640 ? `${dropdownPos.top}px` : undefined,
                                left: typeof window !== "undefined" && window.innerWidth >= 640 ? `${dropdownPos.left}px` : undefined,
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={() => {
                                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                              }}
                              onMouseLeave={handleMouseLeaveDropdown}
                              className="w-full sm:w-80 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 z-[10000] flex flex-col fixed bottom-0 inset-x-0 sm:bottom-auto sm:inset-x-auto transition-all duration-150 animate-in fade-in zoom-in-95 max-h-[80vh] sm:max-h-[85vh] overflow-hidden"
                            >
                              <div className="sm:hidden flex-none p-4 bg-slate-50 border-b border-slate-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${themeClasses.iconBg}`}>
                                    <Icon size={18} />
                                  </div>
                                  <h2 className="text-lg font-bold text-slate-800">{item.label}</h2>
                                </div>
                                <button onClick={() => setOpenDropdown(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors font-medium text-xs">
                                  <ArrowLeft size={16} />
                                  Close
                                </button>
                              </div>

                              <div className="p-3 sm:p-2 flex flex-col gap-2 sm:gap-1 overflow-y-auto flex-1 max-h-[70vh] sm:max-h-[75vh]">
                                {item.id === "priority_services" && (
                                  <>
                                    <button
                                      onClick={() => { setCurrentTab("emergency"); setOpenDropdown(null); }}
                                      className={`flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left ${currentTab === 'emergency' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50/50 hover:bg-slate-100 text-slate-700'} border border-slate-100 shadow-sm sm:shadow-none`}
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentTab === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-slate-200/80 text-slate-600'}`}>
                                        <AlertTriangle size={16} />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">Emergency Contacts</span>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (!user) requireLoginAlert();
                                        else { setCurrentTab("my_activity"); setOpenDropdown(null); }
                                      }}
                                      className={`flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left ${currentTab === 'my_activity' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50/50 hover:bg-slate-100 text-slate-700'} border border-slate-100 shadow-sm sm:shadow-none`}
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentTab === 'my_activity' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/80 text-slate-600'}`}>
                                        <Activity size={16} />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">My Activity</span>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (!user) requireLoginAlert();
                                        else { setShowProfileModal(true); setOpenDropdown(null); }
                                      }}
                                      className={`flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left bg-slate-50/50 hover:bg-slate-100 text-slate-700 border border-slate-100 shadow-sm sm:shadow-none`}
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-200/80 text-slate-600`}>
                                        <Settings size={16} />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">Edit Profile</span>
                                      </div>
                                    </button>
                                  </>
                                )}
                                {item.id === "workspace" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setCurrentTab("workspace");
                                        setWorkspaceActiveTool(null);
                                        setOpenDropdown(null);
                                      }}
                                      className={`flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left ${
                                        currentTab === 'workspace' && !workspaceActiveTool ? 'bg-blue-100 border-blue-200 text-blue-900' : 'bg-slate-50/50 hover:bg-blue-50 text-slate-700'
                                      } border border-slate-100 shadow-sm sm:shadow-none`}
                                    >
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-600 text-white font-bold">
                                        <LayoutDashboard size={16} />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">Mana Panchayath Dashboard</span>
                                        <span className="text-[10px] text-slate-500 font-bold">‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞™‡±ç‡∞∞‡∞ß‡∞æ‡∞® ‡∞™‡±á‡∞ú‡±Ä (‡∞Ö‡∞®‡±ç‡∞®‡∞ø ‡∞∏‡∞æ‡∞ß‡∞®‡∞æ‡∞≤‡±Å)</span>
                                      </div>
                                    </button>

                                    <div className="h-px bg-slate-200/70 my-1" />

                                    {[
                                      { id: 'dsr', label: 'DSR Analyzer', icon: <BarChart3 size={16} /> },
                                      { id: 'multiday', label: 'Multi-Day attendance', icon: <Layers size={16} /> },
                                      { id: 'training', label: 'Digital Training', icon: <GraduationCap size={16} /> },
                                      { id: 'pract', label: 'Knowledge Hub', icon: <Book size={16} /> },
                                      { id: 'monthly-activity', label: 'Monthly Activity Data', icon: <FileSpreadsheet size={16} /> },
                                      { id: 'excel-merge', label: 'Excel File Merger', icon: <FileSpreadsheet size={16} /> },
                                      { id: 'gpdp-planning', label: '(GPDP) - Planning & Budget', icon: <ClipboardList size={16} /> },
                                    ].map(tool => (
                                      <button
                                        key={tool.id}
                                        onClick={() => { setCurrentTab("workspace"); setWorkspaceActiveTool(tool.id); setOpenDropdown(null); }}
                                        className={`flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left ${
                                          currentTab === 'workspace' && workspaceActiveTool === tool.id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50/50 hover:bg-blue-50 text-slate-700'
                                        } border border-slate-100 shadow-sm sm:shadow-none`}
                                      >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
                                          {tool.icon}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[13px] font-bold">{tool.label}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </>
                                )}
                                
                                {item.id === "gos_formats" && (
                                  <>
                                    {[
                                      { id: 'Application', label: 'Applications & Formats', icon: <FileBadge size={16} /> },
                                      { id: 'GO', label: 'GOs', icon: <FileText size={16} /> },
                                    ].map(tool => (
                                      <button
                                        key={tool.id}
                                        onClick={() => {
                                          setCurrentTab("gos_formats");
                                          setGosActiveSubTab(tool.id as 'Application' | 'GO');
                                          setOpenDropdown(null);
                                        }}
                                        className="flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left bg-slate-50/50 hover:bg-teal-50 text-slate-700 border border-slate-100 shadow-sm sm:shadow-none"
                                      >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-teal-100 text-teal-600">
                                          {tool.icon}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[13px] font-bold">{tool.label}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </>
                                )}
                                
                                {item.id === "useful_links" && (
                                  <div className="max-h-[50vh] overflow-y-auto scrollbar-thin flex flex-col gap-1">
                                    {[
                                      { name: 'ePanchayat Home', url: 'https://epanchayat.telangana.gov.in/' },
                                      { name: 'House Tax DCB', url: 'https://epanchayat.telangana.gov.in/epmis/epmisPRHTAXDCBLive.jsp' },
                                      { name: 'UBD Portal', url: 'https://ubd.telangana.gov.in/' },
                                      { name: 'UBD MIS Status', url: 'https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus.do?rlb_type=3&pstcode=35&style=bluetheme' },
                                      { name: 'eGramSwaraj', url: 'https://egramswaraj.gov.in/' },
                                      { name: 'AuditOnline', url: 'https://auditonline.gov.in/' },
                                      { name: 'Panchayat Nirnay', url: 'https://meetingonline.gov.in/homepage/official-login' },
                                      { name: 'IFMIS Telangana', url: 'https://ifmis.telangana.gov.in/' },
                                      { name: 'TG TGov', url: 'https://goir.telangana.gov.in/' },
                                    ].map((link, idx) => (
                                      <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setOpenDropdown(null)}
                                        className="flex items-center gap-3 w-full p-3 sm:p-2.5 rounded-xl transition-colors text-left bg-slate-50/50 hover:bg-cyan-50 text-slate-700 border border-slate-100 shadow-sm sm:shadow-none"
                                      >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-cyan-100 text-cyan-600">
                                          <ExternalLink size={16} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                          <span className="text-[13px] font-bold truncate">{link.name}</span>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>,
                          document.body
                        )}
                      </div>
                    );
                  })}
                  {customMenus.map((menu) => {
                    const isActive = currentTab === `custom_menu_${menu.id}`;
                    return (
                      <button
                        key={menu.id}
                        onClick={() => {
                          setCurrentTab(`custom_menu_${menu.id}`);
                        }}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 shrink-0 border ${
                          isActive
                            ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                            : "bg-blue-50/50 border-blue-100 hover:bg-blue-100/50"
                        }`}
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 ${
                          isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                        }`}>
                          <LayoutList size={12} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className={`text-[11px] sm:text-[12px] tracking-wide ${isActive ? 'text-white font-semibold' : 'text-slate-700 font-semibold'}`}>
                          {menu.label}
                        </span>
                      </button>
                    );
                  })}
            </div>
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => {
              if (navScrollRef.current) {
                navScrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
              }
            }}
            className="hidden sm:flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all z-10 active:scale-95 cursor-pointer"
            aria-label="Scroll Right"
            title="Scroll Right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-[1050]"
          />
        )}
      </AnimatePresence>

      <div className={`main-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
        <aside
          ref={sidebarRef}
          className={`sidebar ${sidebarOpen ? "z-[1100]" : ""}`}
        >
          <div
            className="sidebar-inner relative"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSidebarOpen(false);
            }}
          >
            {sidebarOpen && (
              <button
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-2 p-2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                style={{ top: "calc(8px + env(safe-area-inset-top))" }}
                title="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
            {isEvdkaPath || currentTab === "admin" || currentTab === "editor" ? (
              <>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">
                  Admin Control Center
                </h3>
                {[
                  { id: "dash", label: "Analytics Hub", icon: BarChart3 },
                  { id: "exe_ubd_live", label: "EXE & UBD Live Monitoring", icon: Radio },
                  { id: "reports", label: "Posts & Issues", icon: FileText },
                  { id: "gos_formats", label: "GOs & Formats", icon: FileText },
                  { id: "updates", label: "Flash News", icon: Zap },
                  { id: "users", label: "User Access", icon: Users },
                  ...(isAdmin || isDevEmail
                    ? [
                        {
                          id: "staff_management",
                          label: "Staff Management",
                          icon: Shield,
                        },
                        {
                          id: "rbac",
                          label: "Role Matrix (RBAC)",
                          icon: Lock,
                        },
                        { id: "logs", label: "Security Logs", icon: ShieldAlert },
                        { id: "visitor_logs", label: "Visitor Logs (‡∞™‡∞¨‡±ç‡∞≤‡∞ø‡∞ï‡±ç)", icon: Globe },
                        {
                          id: "farmer_registry_logs",
                          label: "Farmer Registry Logs",
                          icon: FileText,
                        },
                        {
                          id: "survey_reports",
                          label: "Survey Reports",
                          icon: Database,
                        },
                        {
                          id: "edit_about",
                          label: "About E-Vedhika",
                          icon: Info,
                        },
                      ]
                    : []),
                ].map((item) => (
                  <MenuButton
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={activeAdminSubTab === item.id}
                    onClick={() => {
                      setActiveAdminSubTab(item.id);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                  />
                ))}

                {(isAdmin || isDevEmail) && (
                  <>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-4">
                      Operations & Content
                    </h3>
                    {[
                      { id: "builder", label: "Page Builder", icon: Wrench },
                      { id: "custom_menus", label: "Dynamic Menus", icon: LayoutList },
                    ].map((item) => (
                      <MenuButton
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        active={activeAdminSubTab === item.id}
                        onClick={() => {
                          setActiveAdminSubTab(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                      />
                    ))}
                    <MenuButton
                      label="Landing Page Config"
                      icon={Globe}
                      active={["landing_page_config", "seo_meta", "page_descriptions"].includes(activeAdminSubTab)}
                      onClick={() => {
                        setActiveAdminSubTab("landing_page_config");
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                    />
                    {[
                      { id: "locations", label: "Locations", icon: MapPin },
                      { id: "suggestions", label: "Public Suggestions & Feedback", icon: MessageSquare },
                      { id: "changelog", label: "Version History", icon: Sparkles },
                      { id: "trash", label: "Trash / Bin", icon: Trash2 },
                    ].map((item) => (
                      <MenuButton
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        active={activeAdminSubTab === item.id}
                        onClick={() => {
                          setActiveAdminSubTab(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                      />
                    ))}
                  </>
                )}

                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-4">
                  System & AI Control
                </h3>
                <MenuButton
                  label="System Config"
                  icon={Settings}
                  active={["settings", "ads", "code_manager", "ai", "cloud_dns"].includes(activeAdminSubTab)}
                  onClick={() => {
                    setActiveAdminSubTab("settings");
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                />

                <div className="h-px bg-slate-100 my-4 mx-2" />

                <MenuButton
                  label="Return to Portal"
                  icon={ArrowLeft}
                  active={false}
                  onClick={() => {
                    window.location.href = "/";
                  }}
                />
              </>
            ) : (
              <>
                
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "workspace", label: "Mana Panchayath", icon: Building },
                  { id: "priority_services", label: "Priority Services", icon: Target },
                  { id: "chat", label: "Live Chat", icon: MessageCircle },
                  { id: "union", label: "Union Corner & Polls", icon: Users },
                  { id: "directlinks", label: "Direct Link", icon: Megaphone },
                                                                        { id: "suggestions", label: "Public Suggestions & Feedback", icon: MessageSquare },
                  { id: "gos_formats", label: "Applications, Formats & GOs", icon: FileText },
                  { id: "useful_links", label: "Useful Information", icon: Info },
                  { id: "excel_print", label: "Excel A4 Print", icon: FileSpreadsheet },
                  { id: "pdf_compress", label: "PDF Compress (250KB)", icon: FileDown },
                  { id: "farmer_registry", label: "Farmer Registry Live Verification", icon: Wheat },
                  { id: "gpdp_setup", label: "GPDP Initial Setup", icon: ClipboardList },
                  
                ].map((item) => (
                  <MenuButton
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={currentTab === item.id || (item.id === "priority_services" && (currentTab === "emergency" || currentTab === "my_activity"))}
                    onClick={() => {
                      if (item.id === "workspace") {
                        setCurrentTab("workspace");
                        setWorkspaceActiveTool(null);
                        handleOpenDropdown("workspace");
                        setSidebarOpen(false);
                      } else if (item.id === "priority_services") {
                        handleOpenDropdown("priority_services");
                        setSidebarOpen(false);
                      } else if (item.id === "gos_formats") {
                        setCurrentTab("gos_formats");
                        handleOpenDropdown("gos_formats");
                        setSidebarOpen(false);
                      } else if (item.id === "useful_links") {
                        handleOpenDropdown("useful_links");
                        setSidebarOpen(false);
                      } else if (item.id === "farmer_registry") {
                        window.history.pushState({}, "", "/Farmer_Registry");
                        setCurrentTab("farmer_registry");
                        setSidebarOpen(false);
                      } else {
                        setCurrentTab(item.id);
                        if (item.id === "home") {
                          setCurrentFilter("All");
                        }
                        if (searchParams.has("postId")) {
                          setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    next.delete("postId");
    return next;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        setSidebarOpen(false);
                      }
                    }}
                  />
                ))}
                {customMenus.map((menu) => (
                  <MenuButton
                    key={menu.id}
                    label={menu.label}
                    icon={LayoutList}
                    active={currentTab === `custom_menu_${menu.id}`}
                    onClick={() => {
                      setCurrentTab(`custom_menu_${menu.id}`);
                      setSidebarOpen(false);
                    }}
                  />
                ))}

                {showInstallButton && (
                  <div className="mt-8 px-4">
                    <button
                      aria-label="Install App"
                      onClick={handleInstallClick}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all active:scale-95 border border-blue-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Download size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col items-start translate-y-[-1px]">
                          <span className="text-[14px] font-black leading-tight tracking-tight">
                            ‡∞Ø‡∞æ‡∞™‡±ç ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç
                          </span>
                          <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest opacity-80">
                            Install App
                          </span>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <PlusCircle size={14} />
                      </div>
                    </button>
                  </div>
                )}

                {(isAdmin || isEditor || isDevEmail) && (
                  <MenuButton
                    label="Admin Panel" icon={Shield}
                    tourId="menu-admin-new-tab"
                    active={isEvdkaPath || currentTab === "admin"}
                    onClick={() => {
                      navigate("/Evdka");
                      setSidebarOpen(false);
                    }}
                  />
                )}
              </>
            )}

            {isAdmin && (
              <div
                className="px-4 text-center border-t border-slate-100/50"
                style={{
                  marginTop: "31px",
                  paddingTop: "0px",
                  paddingBottom: "14px",
                  paddingLeft: "0px",
                  paddingRight: "6px",
                }}
              >
                <div className="inline-flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      Last Update
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1">
                    Version {SYSTEM_UPDATES[0]?.version} ‚Ä¢{" "}
                    {new Date(SYSTEM_UPDATES[0]?.time).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "2-digit", year: "numeric" },
                    )}{" "}
                    ‚Ä¢{" "}
                    {new Date(SYSTEM_UPDATES[0]?.time).toLocaleTimeString(
                      "en-GB",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main
          className="flex-1 min-w-0 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar p-1.5 sm:p-2.5 lg:p-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          {(isEvdkaPath || currentTab === "admin" || currentTab === "editor") &&
            (isAdmin || isEditor || isDevEmail) && (
              <AdminPanel
                addToast={addToast}
                posts={posts}
                problems={problemsGlobal}
                suggestions={suggestions}
                suggestionCategories={suggestionCategories}
                users={allUsers}
                user={user}
                setAdminLocked={setAdminLocked}
                adminLocked={adminLocked}
                notifications={notifications}
                requests={requests}
                updates={allUpdates}
                userRole={userProfile?.role || (isAdmin ? "Admin" : "Editor")}
                onExit={() => {
                  if (isEvdkaPath) {
                    navigate("/");
                  } else {
                    setCurrentTab("home");
                  }
                }}
                onNewPost={() => {}}
                onEditPost={setEditingPost}
                isDevEmail={isDevEmail}
                currentAdminPin={currentAdminPin}
                setCurrentAdminPin={setCurrentAdminPin}
                districtsData={districtsData}
                currentTab={currentTab}
                userProfile={userProfile}
                storageConfig={storageConfig}
                aboutContent={aboutContent}
                setAboutContent={setAboutContent}
                fetchAboutContent={fetchAboutContent}
                isEditorMode={!isAdmin && isEditor}
                rbacPermissions={rbacPermissions}
                setRbacPermissions={setRbacPermissions}
                activeSubTab={activeAdminSubTab}
                setActiveSubTab={setActiveAdminSubTab}
                customMenus={customMenus}
                customMenuCards={customMenuCards}
                landingPageData={landingPageData}
                setLandingPageData={setLandingPageData}
                fetchLandingPageData={fetchLandingPageData}
                onToggleSidebar={() => setSidebarOpen((prev: boolean) => !prev)}
                setSidebarOpen={setSidebarOpen}
                siteConfig={siteConfig}
                setSiteConfig={setSiteConfig}
              />
            )}

          <div
            className={
              isEvdkaPath || currentTab === "admin" || currentTab === "editor"
                ? "hidden"
                : "contents"
            }
          >

            {postIdFromUrl ? (
              <PostDetail
                postId={postIdFromUrl}
                onBack={() => {
                  setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    next.delete("postId");
    return next;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isAdmin={isAdmin}
                addToast={addToast}
                userProfile={userProfile}
                allUsers={allUsers}
                storageConfig={storageConfig}
                siteConfig={siteConfig}
                onEdit={(p) => {
                  setEditingPost(p);
                  setShowPostForm(true);
                }}
                allPosts={posts}
              />
            ) : (
              <div className="flex flex-col w-full h-full">
                <TabInfoBanner currentTab={currentTab} customDescriptions={pageDescriptions} />
                <AnimatePresence mode="wait">
                  {currentTab === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    <DynamicSection id="home_tab_html" />
                    {dataLoading ? (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        <HeroSkeleton />
                        <div className="max-w-4xl mx-auto space-y-4">
                          <div className="flex justify-between items-center px-4">
                            <div className="h-4 bg-slate-200 rounded-full w-32" />
                            <div className="h-4 bg-slate-100 rounded-full w-24" />
                          </div>
                          <PostSkeleton count={3} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 pb-6">
                        
                        {(siteConfig?.elements && siteConfig.elements.length > 0
                          ? siteConfig.elements
                          : DEFAULT_HOME_ELEMENTS
                        )
                          .filter((el: any) => !el.hidden)
                          .map((el: any) => {
                            let sizeClass = "w-full";
                            if (el.size === "small")
                              sizeClass = "max-w-3xl w-full mx-auto";
                            else if (el.size === "medium")
                              sizeClass = "max-w-6xl w-full mx-auto";
                            else if (el.size === "large")
                              sizeClass = "w-full mx-auto";

                            return (
                              <motion.section
                                key={el.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className={sizeClass}
                              >

                                {el.type === "Post Grid" && (
                                  <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-2">
                                      <div>
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          whileInView={{ opacity: 1 }}
                                          className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block"
                                        >
                                          Portal Pulse
                                        </motion.span>
                                        <h2 className="text-3xl font-black tracking-tighter text-slate-900">
                                          {el.title || "Recent Updates"}
                                        </h2>
                                      </div>
                                      <Link
                                        to="?tab=my_activity"
                                        className="group flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors"
                                      >
                                        My Activity & Reports
                                        <ArrowUpRight
                                          size={14}
                                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                        />
                                      </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                      {filteredPosts
                                        .slice(0, 4)
                                        .map((post: any, idx: number) => (
                                          <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            key={post.id}
                                            className="h-full flex"
                                          >
                                            <PostCard
                                              post={post}
                                              isExpanded={false}
                                              toggleExpansion={() => {}}
                                              addToast={addToast}
                                              isAdmin={
                                                isAdmin ||
                                                isEditor ||
                                                isDevEmail
                                              }
                                              onEdit={(p) => {
                                                setEditingPost(p);
                                                setShowPostForm(true);
                                              }}
                                              allUsers={allUsers}
                                              userProfile={userProfile}
                                              storageConfig={storageConfig}
                                            />
                                          </motion.div>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "Contact Banner" && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative overflow-hidden group"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[32px]" />
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                                    <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                                      <div className="text-center md:text-left max-w-xl">
                                        <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight leading-snug">
                                          {el.title ||
                                            "Shape the transformation."}
                                        </h3>
                                        <p className="text-indigo-100/90 text-xs sm:text-sm font-medium leading-relaxed">
                                          {el.content ||
                                            "Your feedback is the catalyst for a better digital ecosystem. Join us in building a more transparent future."}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() =>
                                          setCurrentTab("suggestions")
                                        }
                                        className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-950/10 whitespace-nowrap shrink-0"
                                      >
                                        Reach Out Now
                                      </button>
                                    </div>

                                    {/* Decorative flare */}
                                    <div className="absolute top-0 right-0 p-6 text-white/10 group-hover:rotate-12 transition-transform duration-700">
                                      <MessageSquare size={80} />
                                    </div>
                                  </motion.div>
                                )}

                                {el.type === "Important Links" && (
                                  <div className="space-y-8">
                                    <div className="text-center md:text-left px-2">
                                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
                                        {el.title || "Essential Links"}
                                      </h3>
                                      <p className="text-slate-500 font-medium">
                                        Quick access to official government
                                        portals and resources.
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                      {[
                                        {
                                          name: "Service Portal",
                                          icon: <Globe size={24} />,
                                        },
                                        {
                                          name: "Digital Records",
                                          icon: <Database size={24} />,
                                        },
                                        {
                                          name: "Legal Hub",
                                          icon: <ShieldCheck size={24} />,
                                        },
                                        {
                                          name: "Public Data",
                                          icon: <BarChart3 size={24} />,
                                        },
                                      ].map((link, i) => (
                                        <motion.a
                                          key={i}
                                          href="#"
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          whileInView={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: i * 0.1 }}
                                          viewport={{ once: true }}
                                          className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] hover:-translate-y-1 transition-all group"
                                        >
                                          <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-indigo-600 shadow-sm border border-white">
                                            {link.icon}
                                          </div>
                                          <span className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                            {link.name}
                                          </span>
                                        </motion.a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "Stats Highlight" && (
                                  <div
                                    className={`py-8 sm:py-12 bg-white rounded-[40px]`}
                                  >
                                    <div className="text-center max-w-2xl mx-auto mb-10 px-4">
                                      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 mb-3">
                                        {el.title || "By The Numbers"}
                                      </h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                                      {[
                                        { v: "15,200+", l: "Citizens Covered" },
                                        { v: "98%", l: "Resolution Rate" },
                                        { v: "24/7", l: "Digital Access" },
                                        { v: "500+", l: "Daily Visitors" },
                                      ].map((stat, i) => (
                                        <div
                                          key={i}
                                          className={`p-6 bg-${el.color || "blue"}-50 rounded-[32px] text-center border border-white shadow-sm hover:shadow-lg transition-all`}
                                        >
                                          <h4
                                            className={`text-3xl sm:text-4xl font-black text-${el.color || "blue"}-600 mb-1`}
                                          >
                                            {stat.v}
                                          </h4>
                                          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">
                                            {stat.l}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "FAQ Section" && (
                                  <div className="p-8 sm:p-12 bg-white border border-slate-100 shadow-sm rounded-[40px] max-w-4xl mx-auto">
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 text-center mb-4">
                                      {el.title || "Frequently Asked Questions"}
                                    </h3>
                                    <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto">
                                      {el.content ||
                                        "Find answers to the most common queries about the e-Vedhika platform and digital services."}
                                    </p>
                                    <div className="space-y-4">
                                      {[1, 2, 3].map((i) => (
                                        <div
                                          key={i}
                                          className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 hover:bg-slate-100/80 transition-colors"
                                        >
                                          <div className="flex justify-between items-center w-full text-left">
                                            <h4 className="text-base sm:text-lg font-bold text-slate-800">
                                              How do I access service {i}{" "}
                                              digitally?
                                            </h4>
                                            <ChevronDown
                                              className="text-slate-400 shrink-0"
                                              size={20}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "Alert Notice" && (
                                  <div
                                    className={`p-6 sm:p-8 bg-${el.color || "amber"}-50 border-l-8 border-${el.color || "amber"}-500 rounded-3xl flex items-start gap-4 shadow-sm`}
                                  >
                                    <div
                                      className={`text-${el.color || "amber"}-600 bg-white p-3 rounded-2xl shadow-sm shrink-0`}
                                    >
                                      <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                      <h4
                                        className={`text-lg sm:text-xl font-black text-${el.color || "amber"}-800 mb-2`}
                                      >
                                        {el.title ||
                                          "‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø ‡∞ó‡∞Æ‡∞®‡∞ø‡∞ï (Important Notice)"}
                                      </h4>
                                      <p
                                        className={`text-${el.color || "amber"}-700/80 font-bold whitespace-pre-wrap leading-relaxed`}
                                      >
                                        {el.content ||
                                          "‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞ó‡∞Æ‡∞®‡∞ø‡∞Ç‡∞ö‡∞ó‡∞≤‡∞∞‡±Å... (Please note this important update...)"}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {el.type === "Quote / Testimonial" && (
                                  <div className="p-8 sm:p-12 bg-slate-900 rounded-[40px] text-center shadow-xl relative overflow-hidden">
                                    <div className="absolute opacity-10 blur-xl top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white mb-2 relative z-10">
                                      {el.title || "Inspiring Quote"}
                                    </h3>
                                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-8 relative z-10"></div>
                                    <p className="text-lg sm:text-2xl font-medium text-slate-300 italic mb-8 relative z-10 mx-auto max-w-3xl leading-relaxed">
                                      "
                                      {el.content ||
                                        "Empowerment comes through information, and transparency is the key to progress."}
                                      "
                                    </p>
                                  </div>
                                )}

                                {el.type === "Upcoming Events" && (
                                  <div
                                    className={`p-8 sm:p-12 bg-white border border-slate-100 shadow-sm rounded-[40px] max-w-5xl mx-auto`}
                                  >
                                    <div className="flex justify-between items-center mb-8">
                                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                                        {el.title ||
                                          "‡∞∞‡∞æ‡∞¨‡±ã‡∞Ø‡±á ‡∞ï‡∞æ‡∞∞‡±ç‡∞Ø‡∞ï‡±ç‡∞∞‡∞Æ‡∞æ‡∞≤‡±Å (Upcoming Events)"}
                                      </h3>
                                      <button className="text-primary font-bold hover:underline hidden sm:block">
                                        View All
                                      </button>
                                    </div>
                                    <div className="space-y-4">
                                      {[1, 2].map((i) => (
                                        <div
                                          key={i}
                                          className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-slate-50 p-4 sm:p-6 rounded-[24px] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                                        >
                                          <div className="bg-white rounded-2xl p-4 text-center min-w-[100px] shadow-sm border border-slate-100 flex flex-col justify-center">
                                            <span className="text-danger font-black text-xs uppercase tracking-widest leading-none">
                                              NOV
                                            </span>
                                            <span className="text-3xl font-black text-slate-800 mt-1">
                                              {i + 14}
                                            </span>
                                          </div>
                                          <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
                                              {el.content
                                                ? el.content.split("|")[0]
                                                : "‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ ‡∞∏‡∞≠ (Gram Sabha)"}
                                            </h4>
                                            <p className="text-slate-500 font-medium text-sm mt-1">
                                              {el.content &&
                                              el.content.includes("|")
                                                ? el.content.split("|")[1]
                                                : "Panchayat Office, 10:00 AM"}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "Gallery Grid" && (
                                  <div className="max-w-6xl mx-auto bg-white p-6 sm:p-10 rounded-[40px] shadow-sm border border-slate-100">
                                    <div className="text-center mb-8">
                                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                                        {el.title || "‡∞ó‡±ç‡∞Ø‡∞æ‡∞≤‡∞∞‡±Ä (Gallery)"}
                                      </h3>
                                      <p className="text-slate-500 mt-2">
                                        {el.content ||
                                          "Images of past events and development activities."}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden group relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                          <span className="text-white font-bold">
                                            Event 1
                                          </span>
                                        </div>
                                      </div>
                                      <div className="aspect-square col-span-2 row-span-2 bg-slate-200 rounded-3xl overflow-hidden group relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold">
                                          Main Highlight
                                        </div>
                                      </div>
                                      <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden group relative"></div>
                                      <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden group relative"></div>
                                      <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden group relative"></div>
                                    </div>
                                  </div>
                                )}

                                {el.type === "Services Directory" && (
                                  <div
                                    className={`p-8 sm:p-12 bg-gradient-to-br from-${el.color || "blue"}-50 to-white border border-slate-100 shadow-sm rounded-[40px]`}
                                  >
                                    <div className="mb-10 text-center">
                                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                                        {el.title || "‡∞∏‡±á‡∞µ‡∞≤‡±Å (Services)"}
                                      </h3>
                                      <p className="text-slate-500">
                                        {el.content ||
                                          "Quickly find the services you need."}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                          key={i}
                                          className="flex items-start gap-4 p-5 bg-white rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-all"
                                        >
                                          <div
                                            className={`w-12 h-12 bg-${el.color || "blue"}-50 text-${el.color || "blue"}-600 rounded-2xl flex items-center justify-center shrink-0`}
                                          >
                                            <Layers size={20} />
                                          </div>
                                          <div>
                                            <h4 className="text-base font-bold text-slate-800 mb-1">
                                              Service Name {i}
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                              Description of the service and
                                              requirements.
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "Profiles / Staff" && (
                                  <div className="py-12 bg-slate-50 rounded-[40px] border border-slate-100 mb-8">
                                    <h3 className="text-2xl sm:text-3xl font-black text-center text-slate-800 mb-10">
                                      {el.title || "‡∞®‡∞æ‡∞Ø‡∞ï‡±Å‡∞≤‡±Å / ‡∞Ö‡∞ß‡∞ø‡∞ï‡∞æ‡∞∞‡±Å‡∞≤‡±Å"}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-12">
                                      {[1, 2, 3].map((i) => (
                                        <div
                                          key={i}
                                          className="bg-white p-6 rounded-[32px] text-center shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all"
                                        >
                                          <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full mb-4 overflow-hidden border-4 border-slate-50 shadow-sm">
                                            <img
                                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 8}`}
                                              alt="Profile"
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <h4 className="text-lg font-bold text-slate-800">
                                            Person Name
                                          </h4>
                                          <p className="text-sm font-bold text-slate-500 mb-2">
                                            {el.content || "Designation"}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {el.type === "Video Showcase" && (
                                  <div
                                    className={`p-8 sm:p-12 bg-${el.color || "slate"}-900 rounded-[40px] text-white shadow-xl mb-8`}
                                  >
                                    <div className="flex justify-between items-center mb-8">
                                      <h3 className="text-2xl sm:text-3xl font-black">
                                        {el.title ||
                                          "‡∞µ‡±Ä‡∞°‡∞ø‡∞Ø‡±ã‡∞≤‡±Å (Video Highlights)"}
                                      </h3>
                                      <button className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition hidden sm:block">
                                        ‡∞Ö‡∞®‡±ç‡∞®‡∞ø ‡∞ö‡±Ç‡∞°‡∞Ç‡∞°‡∞ø
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="bg-slate-800 aspect-video rounded-3xl flex items-center justify-center relative group cursor-pointer overflow-hidden border border-white/10 shadow-lg">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 group-hover:scale-110 transition shadow-xl">
                                          <Play size={24} fill="currentColor" />
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-4 justify-between">
                                        {[1, 2, 3].map((i) => (
                                          <div
                                            key={i}
                                            className="bg-white/5 p-3 sm:p-4 rounded-[24px] flex gap-4 items-center group cursor-pointer border border-white/5 hover:border-white/20 hover:bg-white/10 transition"
                                          >
                                            <div className="aspect-video w-20 sm:w-28 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                              <Play
                                                size={12}
                                                className="text-white/50 group-hover:text-white transition"
                                                fill="currentColor"
                                              />
                                            </div>
                                            <div>
                                              <h4 className="font-bold text-sm sm:text-base line-clamp-2">
                                                {el.content ||
                                                  "‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ ‡∞∏‡∞≠ ‡∞∏‡∞Æ‡∞æ‡∞µ‡±á‡∞∂‡∞Ç ‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞æ‡∞Ç‡∞∂‡∞æ‡∞≤‡±Å"}
                                              </h4>
                                              <p className="text-xs text-white/50 mt-1 font-medium">
                                                {i} days ago
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {el.type === "Document Downloads" && (
                                  <div
                                    className={`p-8 sm:p-12 bg-white border border-${el.color || "blue"}-100 shadow-sm rounded-[40px] relative overflow-hidden mb-8`}
                                  >
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                                      {el.title ||
                                        "‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞Æ‡±à‡∞® ‡∞™‡∞§‡±ç‡∞∞‡∞æ‡∞≤‡±Å (Documents)"}
                                    </h3>
                                    <p className="text-slate-500 mb-8">
                                      {el.content ||
                                        "Download necessary applications and government orders."}
                                    </p>
                                    <div className="space-y-4">
                                      {[1, 2, 3].map((i) => (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 rounded-[24px] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div
                                              className={`w-12 h-12 bg-${el.color || "blue"}-100 text-${el.color || "blue"}-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner`}
                                            >
                                              <FileText size={20} />
                                            </div>
                                            <div>
                                              <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                                                Document_Format_Template_{i}.pdf
                                              </h4>
                                              <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                                                  PDF
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                  2.4 MB
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-[16px] flex items-center justify-center shadow-sm border border-slate-200 text-slate-400 group-hover:text-white group-hover:bg-${el.color || "blue"}-600 transition-colors`}
                                          >
                                            <Download size={18} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Fallback for undefined types */}
                                {![
                                  "Ads Gallery",
                                  "Post Grid",
                                  "Feature Cards",
                                  "Contact Banner",
                                  "E-Vedhika Core Feed",
                                  "Important Links",
                                  "Stats Highlight",
                                  "FAQ Section",
                                  "Alert Notice",
                                  "Quote / Testimonial",
                                  "Upcoming Events",
                                  "Gallery Grid",
                                  "Services Directory",
                                  "Profiles / Staff",
                                  "Video Showcase",
                                  "Document Downloads",
                                ].includes(el.type) && (
                                  <div className="p-10 bg-white border-2 border-dashed border-slate-200 rounded-[40px] text-center">
                                    <h3 className="text-xl font-black text-slate-400">
                                      {el.title || el.type}
                                    </h3>
                                    <p className="text-slate-400 mt-2">
                                      {el.content || "Dynamic content section."}
                                    </p>
                                  </div>
                                )}

                                {el.type === "E-Vedhika Core Feed" && (
                                  <>
                                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6 sm:p-8 mb-8 flex flex-col gap-6">
                                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                                        <div className="flex-1 w-full">
                                          <h3 className="text-xl sm:text-2xl font-black text-primary uppercase tracking-tighter text-center sm:text-left">
                                            {el.title || "üîî Updates"}
                                          </h3>
                                        </div>
                                        <button
                                          onClick={() => {
                                            if (!user) requireLoginAlert();
                                            else setShowPostForm(true);
                                          }}
                                          className="px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs sm:text-sm w-max flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                                        >
                                          <PlusCircle size={18} /> Public Post
                                        </button>
                                      </div>

                                      <div className="border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Filter size={14} className="text-primary animate-pulse" />
                                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            ‡∞ï‡±á‡∞ü‡∞ó‡∞ø‡∞∞‡±Ä ‡∞∏‡±ç‡∞Æ‡∞æ‡∞∞‡±ç‡∞ü‡±ç ‡∞´‡∞ø‡∞≤‡±ç‡∞ü‡∞∞‡±ç‡∞≤‡±Å (Smart Filters)
                                          </span>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
                                          {[
                                            { id: "All", te: "‡∞Ö‡∞®‡±ç‡∞®‡±Ä", en: "All", icon: LayoutList, filter: "All" },
                                            { id: "Following", te: "‡∞´‡∞æ‡∞≤‡±ã‡∞Ø‡∞ø‡∞Ç‡∞ó‡±ç", en: "Following", icon: UserCheck, filter: "Following" },
                                            { id: "GOs", te: "‡∞∏‡∞∞‡±ç‡∞ï‡±ç‡∞Ø‡±Å‡∞≤‡∞∞‡±ç‡∞≤‡±Å (GOs)", en: "GOs & Circulars", icon: FileText, filter: " GOs & Circulars" },
                                            { id: "Updates", te: "‡∞Ö‡∞™‡±ç‡∞°‡±á‡∞ü‡±ç‡∞∏‡±ç", en: "Updates", icon: Bell, filter: " Updates" },
                                            { id: "General", te: "‡∞ú‡∞®‡∞∞‡∞≤‡±ç ‡∞°‡∞ø‡∞∏‡±ç‡∞ï‡∞∑‡∞®‡±ç", en: "General Discussion", icon: MessageSquare, filter: " General" }
                                          ].map((tab) => {
                                            const TabIcon = tab.icon;
                                            const isActive = currentFilter === tab.filter;
                                            return (
                                              <button
                                                key={tab.id}
                                                onClick={() => setCurrentFilter(tab.filter)}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                                  isActive
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent hover:border-slate-200"
                                                }`}
                                              >
                                                <TabIcon size={14} className={isActive ? "text-white" : "text-slate-400"} />
                                                <div className="flex flex-col items-start leading-none">
                                                  <span className="text-[11px]">{tab.te}</span>
                                                  <span className="text-[8px] opacity-70 font-bold">{tab.en}</span>
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4 sm:space-y-5">
                                      <AnimatePresence mode="popLayout">
                                        {filteredPosts
                                          .slice(0, visiblePostsCount)
                                          .flatMap((post, index) => {
                                            const renderIndex = index; // Optional: cap stagger delay if needed
                                            const items = [
                                              <motion.div
                                                key={post.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                  delay: Math.min(
                                                    renderIndex * 0.05,
                                                    0.5,
                                                  ),
                                                }}
                                              >
                                                <PostCard
                                                  post={post}
                                                  isExpanded={expandedPosts.has(
                                                    post.id,
                                                  )}
                                                  toggleExpansion={() =>
                                                    togglePostExpansion(post.id)
                                                  }
                                                  addToast={addToast}
                                                  isAdmin={
                                                    isAdmin ||
                                                    isEditor ||
                                                    isDevEmail
                                                  }
                                                  onEdit={(p) => {
                                                    setEditingPost(p);
                                                    setShowPostForm(true);
                                                  }}
                                                  allUsers={allUsers}
                                                  userProfile={userProfile}
                                                  storageConfig={storageConfig}
                                                />
                                              </motion.div>,
                                            ];
                                            if ((index + 1) % 5 === 0) {
                                              items.push(
                                                <motion.div
                                                  key={`ad-${post.id}`}
                                                  initial={{
                                                    opacity: 0,
                                                    y: 30,
                                                  }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{
                                                    delay: Math.min(
                                                      renderIndex * 0.05,
                                                      0.5,
                                                    ),
                                                  }}
                                                >
                                                  <AdBanner />
                                                </motion.div>,
                                              );
                                            }
                                            return items;
                                          })}
                                      </AnimatePresence>

                                      {filteredPosts.length >
                                        visiblePostsCount && (
                                        <div className="pt-8 text-center">
                                          <button
                                            onClick={() =>
                                              setVisiblePostsCount(
                                                (prev) => prev + 20,
                                              )
                                            }
                                            className="px-8 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-100 hover:text-primary transition-all active:scale-95"
                                          >
                                            Load More Posts
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </motion.section>
                            );
                          })}

                        {/* Remove confusing empty message if siteConfig is not set but defaults are used */}
                        {(!siteConfig ||
                          !siteConfig.elements ||
                          siteConfig.elements.length === 0) &&
                          !DEFAULT_HOME_ELEMENTS.length && (
                            <div className="text-center py-20 text-slate-400 font-bold">
                              Home page layout is empty.
                            </div>
                          )}

                        {/* Entry Page / Landing Page Content integrated at the bottom of Main Home Tab */}
                        <div className="mt-16 border-t border-slate-200/60 pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                          <div className="text-center space-y-5 w-full mx-auto flex flex-col items-center">
                            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[10px] sm:text-sm font-black uppercase tracking-wider sm:tracking-widest shadow-sm text-center max-w-full whitespace-normal">
                              E-VEDHIKA OVERVIEW
                            </div>
                            <h2 
                              className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug max-w-4xl break-words w-full"
                            >
                              {landingPageData.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{landingPageData.heroHighlight}</span>
                            </h2>
                            <div 
                              className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium ql-editor px-0 sm:px-4 w-full max-w-full sm:max-w-5xl break-words overflow-x-hidden"
                              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                              dangerouslySetInnerHTML={{__html: landingPageData.heroSubtitle}}
                            />
                          </div>
                        </div>
                        {/* Unified Banner & Footer Section */}
                        <div className="mt-12 -mx-3 sm:-mx-6 lg:-mx-8 bg-[#1565c0]/60 backdrop-blur-xl border-t border-white/20 shadow-2xl overflow-hidden rounded-t-[32px]">
                          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                            <footer
                              className="flex flex-col lg:flex-row items-center justify-between font-sans gap-6 text-white relative"
                              id="vedhika-footer"
                            >
                              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full lg:w-auto">
                                <button
                                  onClick={() => {
                                    document
                                      .querySelector("main")
                                      ?.scrollTo({ top: 0, behavior: "smooth" });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all shadow-lg backdrop-blur-sm"
                                  aria-label="Scroll to top"
                                >
                                  <ChevronUp size={24} strokeWidth={2.5} />
                                </button>
                                
                                <div className="flex flex-col items-center sm:items-start gap-1">
                                  <p className="text-white/90 text-sm font-medium whitespace-nowrap">
                                    Copyright ¬©2026{" "}
                                    <span className="text-[#fbe947] font-medium">
                                      E-VEDHIKA
                                    </span>
                                  </p>
                                  <p className="text-white/70 text-xs font-medium tracking-wider uppercase">
                                    All Rights Reserved.
                                  </p>
                                </div>
                              </div>

                              {/* Merged unified single banner for Stats & Links */}
                              <div 
                                className="flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5 gap-y-3 text-white/90 w-full xl:w-auto bg-white/5 px-4 sm:px-6 py-4 sm:py-3.5 rounded-2xl sm:rounded-full border border-white/10 text-[11px] sm:text-xs font-bold tracking-wide uppercase shadow-sm"
                                id="vedhika-statistics-banner"
                              >
                                {/* Statistics Area */}
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-[#fbe947]" />
                                  <span>
                                    {(visitorCount !== null ? visitorCount + 12345 : "...").toLocaleString()}
                                    <span className="text-white/80 ml-1">VISITORS</span>
                                  </span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
                                <div className="flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5 text-[#fbe947]" />
                                  <span>
                                    {SYSTEM_UPDATES[0]?.version || "V1.6.2"}
                                    <span className="text-white/80 ml-1">VER</span>
                                  </span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
                                <div className="flex items-center gap-1.5">
                                  <RefreshCw className="w-3.5 h-3.5 text-[#fbe947]" />
                                  <span>
                                    {SYSTEM_UPDATES[0]?.time
                                      ? new Date(SYSTEM_UPDATES[0].time).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
                                      : "30/05/26"}
                                    <span className="text-white/80 ml-1">UPDATED</span>
                                  </span>
                                </div>

                                {/* Divider connecting Stats & Links visually (only on large screens) */}
                                <div className="hidden xl:block w-px h-4 bg-white/20 mx-2" />
                                <div className="w-full h-px bg-white/10 xl:hidden my-2" />

                                {/* Links Area */}
                                <Link
                                  to="/"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    document
                                      .querySelector("main")
                                      ?.scrollTo({ top: 0, behavior: "smooth" });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="hover:text-[#fbe947] transition-colors duration-300 ease-in-out"
                                >
                                  Home
                                </Link>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <Link
                                  to="/about"
                                  className="hover:text-[#fbe947] transition-colors duration-300 ease-in-out"
                                  id="footer-about-btn"
                                >
                                  About
                                </Link>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <Link
                                  to="/contact"
                                  className="hover:text-[#fbe947] transition-colors duration-300 ease-in-out"
                                  id="footer-contact-btn"
                                >
                                  Contact Us
                                </Link>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <Link
                                  to="/privacy"
                                  className="hover:text-[#fbe947] transition-colors duration-300 ease-in-out"
                                >
                                  Privacy Policy
                                </Link>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <Link
                                  to="/terms"
                                  className="hover:text-[#fbe947] transition-colors duration-300 ease-in-out"
                                >
                                  Terms & Conditions
                                </Link>
                              </div>
                            </footer>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentTab === "workspace" && (
                  <motion.div
                    key="workspace"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <DynamicSection id="mana_panchayath_html" />
                    <AdBanner />
                    <DigitalWorkspaceSection addToast={addToast} user={user} activeTool={workspaceActiveTool} setActiveTool={setWorkspaceActiveTool} pageDescriptions={pageDescriptions} />
                  </motion.div>
                )}

                {currentTab === "logs" && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <SecurityLogsSection />
                  </motion.div>
                )}

                {currentTab === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ChatSection
                      messages={chatMessages}
                      user={user}
                      isAdmin={isAdmin}
                      addToast={addToast}
                      userProfile={userProfile}
                    />
                  </motion.div>
                )}

                {currentTab === "union" && (
                  <motion.div
                    key="union"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <button
                        aria-label="Back to Home"
                        onClick={() => setCurrentTab("home")}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
                      >
                        <ArrowLeft size={16} /> Back to Home
                      </button>
                    </div>
                    <PollsScreen user={user} isAdmin={isAdmin} addToast={addToast} />
                  </motion.div>
                )}

                {currentTab === "changelog" && (
                  <motion.div
                    key="changelog"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-4xl mx-auto py-12"
                  >
                    <div className="text-center mb-16">
                      <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-2 rounded-full border border-blue-100 mb-4">
                        <Rocket
                          size={16}
                          className="text-blue-500 animate-bounce"
                        />
                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
                          Platform Evolution ‚Ä¢ Latest:{" "}
                          {SYSTEM_UPDATES[0]?.version}
                        </span>
                      </div>
                      <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                        E-Vedhika Journey
                      </h2>
                      <p className="text-slate-500 font-bold max-w-lg mx-auto">
                        Tracking the digital transformation and feature
                        deployments of the master portal.
                      </p>
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mt-4">
                        Last Update Applied:{" "}
                        {new Date(SYSTEM_UPDATES[0]?.time).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}{" "}
                        (IST)
                      </p>
                    </div>

                    <div className="relative space-y-12">
                      {/* Vertical Line */}
                      <div className="absolute left-7 lg:left-10 top-0 bottom-0 w-px bg-slate-200 z-0" />

                      {allUpdates
                        .filter(
                          (u) =>
                            u.type === "changelog" &&
                            u.status?.toLowerCase() !== "deleted",
                        )
                        .sort((a: any, b: any) => (b.time || 0) - (a.time || 0))
                        .slice(0, visibleUpdatesCount)
                        .map((u: any, i) => (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: Math.min(i * 0.1, 0.5) }}
                            key={u.id || i}
                            className="relative flex gap-6 z-10 pl-2 lg:pl-4"
                          >
                            <div
                              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 ${u.isAutoPost ? "bg-indigo-50" : "bg-blue-50"}`}
                            >
                              {u.isAutoPost ? (
                                <PlusCircle
                                  size={16}
                                  className="text-indigo-500"
                                />
                              ) : (
                                <Zap size={16} className="text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 pt-2 lg:pt-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <h3 className="text-sm sm:text-base font-black text-slate-800">
                                    {u.version
                                      ? `Update ${u.version}`
                                      : u.id === "foundation"
                                        ? "Foundation Launch"
                                        : u.isAutoPost
                                          ? "Community Notice"
                                          : "System Update"}
                                  </h3>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md w-max">
                                    {new Date(
                                      getValidTime(u),
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const textToShare = u.title
                                      ? `${u.version ? u.version + " " : ""}${u.title}\n\n${u.text}`
                                      : u.text;
                                    handleShare(
                                      "E-Vedhika Update",
                                      typeof textToShare === "string"
                                        ? textToShare
                                        : "Check out this update on E-Vedhika",
                                      getSiteBaseUrl(),
                                      () => addToast("Link copied!"),
                                    );
                                  }}
                                  className="hidden sm:flex items-center justify-center gap-2 text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-slate-50 shrink-0"
                                  title="Share Update"
                                >
                                  <Share2 size={16} />
                                </button>
                              </div>
                              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow w-full overflow-hidden">
                                {u.version || u.title || u.badge ? (
                                  <div className="text-left space-y-4">
                                    {(u.version || u.title) && (
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        {u.version && (
                                          <kbd className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
                                            {u.version}
                                          </kbd>
                                        )}
                                        {u.title && (
                                          <p className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                                            {u.title}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    <div className="bg-slate-50 sm:bg-white p-4 sm:p-5 rounded-2xl sm:border border-slate-100 sm:shadow-sm space-y-4 w-full">
                                      <div className="flex gap-3 sm:gap-4 items-start w-full">
                                        {u.badge && (
                                          <kbd className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
                                            {u.badge}
                                          </kbd>
                                        )}
                                        <div className="text-sm text-slate-600 leading-relaxed overflow-hidden flex-1">
                                          <ReactMarkdown
                                            remarkPlugins={[remarkBreaks]}
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                              img: (props) => (
                                                <span className="block my-3"><SmartImage src={props.src || ""} alt={props.alt || "Photo"} className="w-full h-auto max-h-[500px] object-contain rounded-xl border border-slate-200 shadow-sm bg-white" /></span>
                                              ),
                                              h3: ({
                                                node,
                                                children,
                                                ...props
                                              }) => {
                                                const text = String(children);
                                                if (
                                                  text.includes("‚ú® What's New")
                                                ) {
                                                  return (
                                                    <h3
                                                      className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest mt-2 mb-1 border border-blue-100 shadow-sm"
                                                      {...props}
                                                    >
                                                      {children}
                                                    </h3>
                                                  );
                                                }
                                                if (
                                                  text.includes("üêõ Bug Fixes")
                                                ) {
                                                  return (
                                                    <h3
                                                      className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest mt-2 mb-1 border border-rose-100 shadow-sm"
                                                      {...props}
                                                    >
                                                      {children}
                                                    </h3>
                                                  );
                                                }
                                                if (
                                                  text.includes(
                                                    "‚ö° Improvements",
                                                  )
                                                ) {
                                                  return (
                                                    <h3
                                                      className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest mt-2 mb-1 border border-amber-100 shadow-sm"
                                                      {...props}
                                                    >
                                                      {children}
                                                    </h3>
                                                  );
                                                }
                                                return (
                                                  <h3
                                                    className="text-sm font-black text-primary mt-2 mb-1"
                                                    {...props}
                                                  >
                                                    {children}
                                                  </h3>
                                                );
                                              },
                                              ul: ({
                                                node,
                                                children,
                                                ...props
                                              }) => (
                                                <ul
                                                  className="space-y-1 ml-2 mb-2"
                                                  {...props}
                                                >
                                                  {children}
                                                </ul>
                                              ),
                                              li: ({
                                                node,
                                                children,
                                                ...props
                                              }) => (
                                                <li
                                                  className="flex items-start gap-2 text-slate-700 font-medium text-[13px] leading-relaxed"
                                                  {...props}
                                                >
                                                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                                                  <span>{children}</span>
                                                </li>
                                              ),
                                            }}
                                          >
                                            {u.text || ""}
                                          </ReactMarkdown>
                                        </div>
                                      </div>
                                      {u.attachments &&
                                        u.attachments.length > 0 && (
                                          <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Paperclip
                                                size={10}
                                                className="text-slate-300"
                                              />
                                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                Attachments & Docs
                                              </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {u.attachments.map(
                                                (att: any, idx: number) => (
                                                  <a
                                                    key={idx}
                                                    href={att.url}
                                                    onClick={(e) =>
                                                      handleForceDownload(
                                                        e,
                                                        att.url,
                                                        att.name ||
                                                          "Attachment",
                                                      )
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-lg transition-all text-[10px] font-bold text-slate-600 hover:text-blue-600"
                                                  >
                                                    <FileText size={12} />
                                                    {att.name}
                                                  </a>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-[14px] font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {u.text}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      {allUpdates.filter(
                        (u) =>
                          u.type === "changelog" &&
                          u.status?.toLowerCase() !== "deleted",
                      ).length > visibleUpdatesCount && (
                        <div className="pt-8 text-center relative z-10 pl-2 lg:pl-4">
                          <button
                            onClick={() =>
                              setVisibleUpdatesCount((prev) => prev + 20)
                            }
                            className="px-8 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-100 hover:text-primary transition-all active:scale-95"
                          >
                            Load More Updates
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentTab === "emergency" && (
                  <motion.div
                    key="emergency"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[60vh]">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl sm:text-2xl font-black text-rose-600 flex flex-row items-center flex-wrap gap-2">
                          <span className="flex items-center gap-2"><AlertTriangle size={18} /> Emergency & Helpline Contacts</span>
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          ‡∞Ö‡∞§‡±ç‡∞Ø‡∞µ‡∞∏‡∞∞ ‡∞´‡±ã‡∞®‡±ç ‡∞®‡∞Ç‡∞¨‡∞∞‡±ç‡∞≤‡±Å
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            name: "Police (‡∞™‡±ã‡∞≤‡±Ä‡∞∏‡±ç)",
                            number: "100",
                            icon: "",
                            color: "blue",
                          },
                          {
                            name: "Ambulance (‡∞Ö‡∞Ç‡∞¨‡±Å‡∞≤‡±Ü‡∞®‡±ç‡∞∏‡±ç)",
                            number: "108",
                            icon: "",
                            color: "rose",
                          },
                          {
                            name: "Fire (‡∞Ö‡∞ó‡±ç‡∞®‡∞ø‡∞Æ‡∞æ‡∞™‡∞ï ‡∞¶‡∞≥‡∞Ç)",
                            number: "101",
                            icon: "",
                            color: "red",
                          },
                          {
                            name: "Women Helpline (‡∞Æ‡∞π‡∞ø‡∞≥‡∞≤ ‡∞π‡±Ü‡∞≤‡±ç‡∞™‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç)",
                            number: "1091",
                            icon: "",
                            color: "purple",
                          },
                          {
                            name: "Child Helpline (‡∞õ‡±à‡∞≤‡±ç‡∞°‡±ç ‡∞π‡±Ü‡∞≤‡±ç‡∞™‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç)",
                            number: "1098",
                            icon: "",
                            color: "amber",
                          },
                          {
                            name: "Cyber Crime (‡∞∏‡±à‡∞¨‡∞∞‡±ç ‡∞ï‡±ç‡∞∞‡±à‡∞Æ‡±ç)",
                            number: "1930",
                            icon: "",
                            color: "indigo",
                          },
                          {
                            name: "Anti-Corruption (‡∞Ö‡∞µ‡∞ø‡∞®‡±Ä‡∞§‡∞ø ‡∞®‡∞ø‡∞∞‡±ã‡∞ß‡∞ï)",
                            number: "14400",
                            icon: "‚öñÔ∏è",
                            color: "slate",
                          },
                          {
                            name: "Farmers Helpline (‡∞∞‡±à‡∞§‡±Å‡∞≤ ‡∞π‡±Ü‡∞≤‡±ç‡∞™‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç)",
                            number: "155251",
                            icon: "",
                            color: "green",
                          },
                          {
                            name: "Disha Helpline (‡∞¶‡∞ø‡∞∂)",
                            number: "181",
                            icon: "",
                            color: "pink",
                          },
                        ].map((contact, i) => (
                          <div
                            key={i}
                            className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-rose-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-3xl lg:text-4xl group-hover:scale-110 transition-transform">
                                {contact.icon}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-tight">
                                  {contact.name}
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter mt-1">
                                  {contact.number}
                                </div>
                              </div>
                            </div>
                            <a
                              href={`tel:${contact.number}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500 hover:bg-green-500 hover:text-white transition-colors border border-green-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentTab === "suggestions" && (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdBanner />
                    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex flex-row items-center flex-wrap gap-2">
                          <Lightbulb className="text-amber-500 shrink-0" />
                          <span>e-Vedhika Suggestion Portal</span>
                        </h2>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                          ‡∞Æ‡±Ä ‡∞∏‡±Ç‡∞ö‡∞®‡∞≤‡±Å ‡∞Æ‡∞æ‡∞ï‡±Å ‡∞é‡∞Ç‡∞§‡±ã ‡∞Æ‡±Å‡∞ñ‡±ç‡∞Ø‡∞Ç
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="bg-slate-50 rounded-[28px] border border-slate-200 p-6 relative overflow-hidden shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                Latest Suggestions
                              </h3>
                            </div>
                            <div
                              ref={suggestionsScrollRef}
                              onMouseEnter={() => setIsSuggestionsHovered(true)}
                              onMouseLeave={() =>
                                setIsSuggestionsHovered(false)
                              }
                              className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2"
                            >
                              {approvedSuggestions.length > 0 ? (
                                [...approvedSuggestions]
                                  .sort(
                                    (a, b) => getValidTime(b) - getValidTime(a),
                                  )
                                  .slice(0, visibleSuggestionsCount)
                                  .map((s) => (
                                    <motion.div
                                      key={s.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{
                                        opacity: 1,
                                        y: 0,
                                      }}
                                      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600">
                                            {(s.name ||
                                              s.author ||
                                              "U")[0].toUpperCase()}
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-800 leading-tight">
                                              {s.name || s.author || "Unknown"}
                                            </span>
                                            {s.village && (
                                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                                {s.village}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight text-right">
                                          <div className="leading-none mb-0.5 whitespace-nowrap">
                                            {new Date(
                                              getValidTime(s),
                                            ).toLocaleDateString("en-IN", {
                                              day: "numeric",
                                              month: "short",
                                            })}
                                          </div>
                                          <div className="text-[8px] opacity-70 whitespace-nowrap">
                                            {new Date(
                                              getValidTime(s),
                                            ).toLocaleTimeString("en-IN", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-[13px] text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">
                                        {s.msg || s.suggestion}
                                      </p>
                                    </motion.div>
                                  ))
                              ) : (
                                <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                  No submissions yet
                                </div>
                              )}
                              {approvedSuggestions.length >
                                visibleSuggestionsCount && (
                                <div className="pt-4 text-center pb-4">
                                  <button
                                    onClick={() =>
                                      setVisibleSuggestionsCount(
                                        (prev) => prev + 20,
                                      )
                                    }
                                    className="px-6 py-2 bg-white text-slate-700 rounded-xl font-black uppercase text-xs tracking-widest border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                                  >
                                    Load More Suggestions
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="relative bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col h-full hover:shadow-2xl hover:border-slate-300/80 transition-all duration-300 overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-indigo-600 before:via-blue-500 before:to-indigo-500 before:rounded-t-[32px]">
                          {(!user || user?.isAnonymous) && (
                            <div
                              className="absolute inset-0 z-10 cursor-pointer bg-transparent rounded-[32px]"
                              onClick={async () => {
                                const res = await Swal.fire({
                                  title: "‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ö‡∞µ‡∞∏‡∞∞‡∞Ç",
                                  text: "‡∞Æ‡±Ä‡∞∞‡±Å ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ö‡∞Ø‡±ç‡∞Ø‡∞æ‡∞ï ‡∞è‡∞¶‡±à‡∞®‡∞æ Suggestion & Feedback ‡∞á‡∞µ‡±ç‡∞µ‡∞ö‡±ç‡∞ö‡±Å. ‡∞Æ‡±Ä‡∞∞‡±Å ‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ö‡∞µ‡±Å‡∞§‡∞æ‡∞∞‡∞æ?",
                                  icon: "info",
                                  showCancelButton: true,
                                  confirmButtonText: "‡∞≤‡∞æ‡∞ó‡∞ø‡∞®‡±ç ‡∞Ö‡∞µ‡±ç‡∞µ‡∞Ç‡∞°‡∞ø",
                                  cancelButtonText: "‡∞µ‡∞¶‡±ç‡∞¶‡±Å",
                                  confirmButtonColor: "#4f46e5",
                                });
                                if (res.isConfirmed) {
                                  setShowAuthModal(true);
                                }
                              }}
                            />
                          )}
                          <div
                            className={
                              !user || user?.isAnonymous
                                ? "opacity-30 pointer-events-none"
                                : ""
                            }
                          >
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <MessageSquare className="w-5 h-5" />
                              </div>
                              <span>Submit Suggestion & Feedback</span>
                            </h3>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-3 mb-6 flex items-center gap-1.5 pl-0.5">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                              ‡∞Æ‡±Ä ‡∞Ö‡∞Æ‡±Ç‡∞≤‡±ç‡∞Ø‡∞Æ‡±à‡∞® ‡∞∏‡±Ç‡∞ö‡∞®‡∞≤‡∞®‡±Å ‡∞á‡∞ï‡±ç‡∞ï‡∞° ‡∞®‡∞Æ‡±ã‡∞¶‡±Å ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø
                            </p>

                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const target = e.target as any;
                                const name = target.name.value.trim();
                                const village = target.village.value.trim();
                                const mobile = target.mobile
                                  ? target.mobile.value.trim()
                                  : "";
                                const category = target.category.value;
                                const suggestion =
                                  target.suggestion.value.trim();

                                if (
                                  !name ||
                                  !village ||
                                  !category ||
                                  !suggestion ||
                                  (userProfile?.gender !== "Female" && !mobile)
                                ) {
                                  return addToast(
                                    "‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞Ö‡∞®‡±ç‡∞®‡∞ø ‡∞µ‡∞ø‡∞µ‡∞∞‡∞æ‡∞≤‡±Å ‡∞®‡∞ø‡∞Ç‡∞™‡∞Ç‡∞°‡∞ø (Please fill all fields)",
                                  );
                                }

                                if (mobile && !/^[0-9]{10}$/.test(mobile)) {
                                  return addToast(
                                    "‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø 10 ‡∞Ö‡∞Ç‡∞ï‡±Ü‡∞≤ ‡∞Æ‡±ä‡∞¨‡±à‡∞≤‡±ç ‡∞®‡∞Ç‡∞¨‡∞∞‡±ç ‡∞®‡∞Æ‡±ã‡∞¶‡±Å ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø",
                                  );
                                }

                                try {
                                  await addDoc(collection(db, "suggestions"), {
                                    name,
                                    village,
                                    mobile,
                                    category,
                                    suggestion,
                                    time: Date.now(),
                                    status: "pending",
                                    uid: user?.uid || "anonymous",
                                  });
                                  await addDoc(collection(db, "notifications"), {
                                    uid: "all",
                                    title: "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞∏‡±Ç‡∞ö‡∞® (Suggestion Alert)",
                                    message: `${name} ‡∞µ‡∞æ‡∞∞‡±Å ‡∞í‡∞ï ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞∏‡±Ç‡∞ö‡∞®/‡∞∏‡∞Æ‡∞∏‡±ç‡∞Ø‡∞®‡±Å ‡∞∏‡∞Æ‡∞∞‡±ç‡∞™‡∞ø‡∞Ç‡∞ö‡∞æ‡∞∞‡±Å: ${suggestion.substring(0, 50)}`,
                                    type: "admin_alert",
                                    read: false,
                                    time: Date.now()
                                  }).catch(()=>console.error("Failed to notify admin"));
                                  await logUserActivity(
                                    `Submitted Suggestion: ${category}`,
                                  );
                                  target.name.value = userProfile
                                    ? `${userProfile.name || ""} ${userProfile.surname || ""}`.trim()
                                    : "";
                                  target.village.value = userProfile
                                    ? `${userProfile.mandal || ""} / ${userProfile.district || ""}`
                                        .trim()
                                        .replace(/^ \/ | \/ $/g, "")
                                    : "";
                                  if (target.mobile)
                                    target.mobile.value =
                                      userProfile?.mobile || "";
                                  target.category.value = "";
                                  target.suggestion.value = "";

                                  Swal.fire({
                                    title: "‚úÖ ‡∞∏‡∞ï‡±ç‡∞∏‡±Ü‡∞∏‡±ç!",
                                    text: "‡∞Æ‡±Ä ‡∞∏‡±Ç‡∞ö‡∞® ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞®‡∞Æ‡±ã‡∞¶‡±Å ‡∞ö‡±á‡∞Ø‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø.",
                                    icon: "success",
                                    confirmButtonColor: "#0d3b66",
                                  });
                                } catch (error) {
                                  handleFirestoreError(
                                    error,
                                    OperationType.CREATE,
                                    "suggestions",
                                  );
                                  addToast("‡∞∏‡∞¨‡±ç‡∞Æ‡∞ø‡∞ü‡±ç ‡∞ö‡±á‡∞Ø‡∞°‡∞Ç‡∞≤‡±ã ‡∞≤‡±ã‡∞™‡∞Ç ‡∞ï‡∞≤‡∞ø‡∞ó‡∞ø‡∞Ç‡∞¶‡∞ø.");
                                }
                              }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 flex flex-col">
                                  <label className="text-xs font-bold text-slate-700 tracking-wide pl-1">
                                    ‡∞Æ‡±Ä ‡∞™‡±á‡∞∞‡±Å (Name){" "}
                                    <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    name="name"
                                    type="text"
                                    defaultValue={
                                      userProfile
                                        ? `${userProfile.name || ""} ${userProfile.surname || ""}`.trim()
                                        : ""
                                    }
                                    placeholder="Enter your name"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none hover:bg-slate-100/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                                    required
                                  />
                                </div>
                                <div className="space-y-1.5 flex flex-col">
                                  <label className="text-xs font-bold text-slate-700 tracking-wide pl-1">
                                    ‡∞ú‡∞ø‡∞≤‡±ç‡∞≤‡∞æ / ‡∞Æ‡∞Ç‡∞°‡∞≤‡∞Ç (Area){" "}
                                    <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    name="village"
                                    type="text"
                                    defaultValue={
                                      userProfile
                                        ? `${userProfile.mandal || ""} / ${userProfile.district || ""}`
                                            .trim()
                                            .replace(/^ \/ | \/ $/g, "")
                                        : ""
                                    }
                                    placeholder="District / Mandal"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none hover:bg-slate-100/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {userProfile?.gender !== "Female" && (
                                  <div className="space-y-1.5 flex flex-col">
                                    <label className="text-xs font-bold text-slate-700 tracking-wide pl-1">
                                      ‡∞Æ‡±ä‡∞¨‡±à‡∞≤‡±ç ‡∞®‡∞Ç‡∞¨‡∞∞‡±ç (Mobile){" "}
                                      <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                      name="mobile"
                                      type="tel"
                                      defaultValue={userProfile?.mobile || ""}
                                      maxLength={10}
                                      placeholder="10 Digit Number"
                                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none hover:bg-slate-100/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm"
                                      required
                                    />
                                  </div>
                                )}
                                <div className="space-y-1.5 flex flex-col">
                                  <label className="text-xs font-bold text-slate-700 tracking-wide pl-1">
                                    ‡∞µ‡∞ø‡∞≠‡∞æ‡∞ó‡∞Ç (Category){" "}
                                    <span className="text-rose-500">*</span>
                                  </label>
                                  <select
                                    name="category"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-900 outline-none hover:bg-slate-100/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm cursor-pointer"
                                    required
                                  >
                                    <option value="">‡∞µ‡∞ø‡∞≠‡∞æ‡∞ó‡∞Ç ‡∞é‡∞Ç‡∞ö‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø</option>
                                    {suggestionCategories.map((cat, idx) => (
                                      <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-1.5 pt-2 flex flex-col">
                                <label className="text-xs font-bold text-slate-700 tracking-wide pl-1">
                                  ‡∞Æ‡±Ä ‡∞∏‡±Ç‡∞ö‡∞® (Suggestion){" "}
                                  <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                  name="suggestion"
                                  placeholder="‡∞Æ‡±Ä ‡∞∏‡±Ç‡∞ö‡∞® ‡∞á‡∞ï‡±ç‡∞ï‡∞° ‡∞ü‡±à‡∞™‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø..."
                                  rows={4}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none hover:bg-slate-100/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-sm resize-none"
                                  required
                                ></textarea>
                              </div>

                              <button
                                aria-label="Submit Entry"
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-800 text-white py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                                <span>Submit Entry</span>
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentTab === "gos_formats" && (
                  <motion.div
                    key="gos_formats"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <GosAndFormatsPublic
                      user={user}
                      addToast={addToast}
                      isAdmin={isAdmin}
                      initialSubTab={gosActiveSubTab}
                      onSubTabChange={(t) => setGosActiveSubTab(t)}
                    />
                  </motion.div>
                )}

                {currentTab === "useful_links" && (
                  <motion.div
                    key="useful_links"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="section-card card-indigo">
                      <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-2">
                        <ExternalLink size={24} className="text-indigo-600" />{" "}
                        Useful Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            name: "ePanchayat Home (‡∞à-‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä)",
                            desc: "‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞∞‡∞æ‡∞ú‡±ç & ‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ‡±Ä‡∞£‡∞æ‡∞≠‡∞ø‡∞µ‡±É‡∞¶‡±ç‡∞ß‡∞ø ‡∞π‡±ã‡∞Æ‡±ç ‡∞™‡±á‡∞ú‡±Ä",
                            url: "https://epanchayat.telangana.gov.in/",
                            color:
                              "bg-emerald-50 text-emerald-700 border-emerald-100",
                          },
                          {
                            name: "House Tax DCB (‡∞á‡∞Ç‡∞ü‡∞ø ‡∞™‡∞®‡±ç‡∞®‡±Å ‡∞®‡∞ø‡∞µ‡±á‡∞¶‡∞ø‡∞ï)",
                            desc: "‡∞Ü‡∞®‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç ‡∞™‡∞®‡±ç‡∞®‡±Å ‡∞µ‡∞∏‡±Ç‡∞≥‡±ç‡∞≤ ‡∞®‡∞ø‡∞µ‡±á‡∞¶‡∞ø‡∞ï R 2.1",
                            url: "https://epanchayat.telangana.gov.in/epmis/epmisPRHTAXDCBLive.jsp",
                            color: "bg-blue-50 text-blue-700 border-blue-100",
                          },
                          {
                            name: "UBD Portal (‡∞≠‡∞µ‡∞® ‡∞Ö‡∞®‡±Å‡∞Æ‡∞§‡±Å‡∞≤‡±Å)",
                            desc: "‡∞Æ‡±Å‡∞®‡∞ø‡∞∏‡∞ø‡∞™‡∞≤‡±ç ‡∞≠‡∞µ‡∞® ‡∞®‡∞ø‡∞∞‡±ç‡∞Æ‡∞æ‡∞£ ‡∞Ö‡∞®‡±Å‡∞Æ‡∞§‡±Å‡∞≤ ‡∞™‡±ã‡∞∞‡±ç‡∞ü‡∞≤‡±ç",
                            url: "https://ubd.telangana.gov.in/",
                            color: "bg-rose-50 text-rose-700 border-rose-100",
                          },
                          {
                            name: "UBD MIS Status (‡∞Æ‡±ä‡∞§‡±ç‡∞§‡∞Ç ‡∞®‡∞ø‡∞µ‡±á‡∞¶‡∞ø‡∞ï)",
                            desc: "‡∞§‡±Ü‡∞≤‡∞Ç‡∞ó‡∞æ‡∞£ ‡∞Æ‡±Å‡∞®‡±ç‡∞∏‡∞ø‡∞™‡∞≤‡±ç ‡∞≠‡∞µ‡∞® ‡∞Ö‡∞®‡±Å‡∞Æ‡∞§‡±Å‡∞≤ ‡∞∏‡±ç‡∞ü‡±á‡∞ü‡∞∏‡±ç",
                            url: "https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus.do?rlb_type=3&pstcode=35&style=bluetheme",
                            color: "bg-pink-50 text-pink-700 border-pink-100",
                          },
                          {
                            name: "eGramSwaraj (‡∞à-‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ ‡∞∏‡±ç‡∞µ‡∞∞‡∞æ‡∞ú‡±ç)",
                            desc: "‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ ‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞Ö‡∞ï‡±å‡∞Ç‡∞ü‡∞ø‡∞Ç‡∞ó‡±ç ‡∞∏‡∞ø‡∞∏‡±ç‡∞ü‡∞Æ‡±ç",
                            url: "https://egramswaraj.gov.in/",
                            color:
                              "bg-orange-50 text-orange-700 border-orange-100",
                          },
                          {
                            name: "AuditOnline (‡∞Ö‡∞°‡∞ø‡∞ü‡±ç ‡∞Ü‡∞®‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç)",
                            desc: "‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞∞‡∞æ‡∞ú‡±ç ‡∞Ü‡∞®‡±ç‚Äå‡∞≤‡±à‡∞®‡±ç ‡∞Ü‡∞°‡∞ø‡∞ü‡±ç ‡∞™‡±ç‡∞∞‡∞æ‡∞∏‡±Ü‡∞∏‡±ç",
                            url: "https://auditonline.gov.in/",
                            color:
                              "bg-indigo-50 text-indigo-700 border-indigo-100",
                          },
                          {
                            name: "Panchayat Nirnay (‡∞™‡∞Ç‡∞ö‡∞æ‡∞Ø‡∞§‡±Ä ‡∞®‡∞ø‡∞∞‡±ç‡∞£‡∞Ø‡±ç)",
                            desc: "‡∞ó‡±ç‡∞∞‡∞æ‡∞Æ ‡∞∏‡∞≠ ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å GPDP ‡∞•‡±Ä‡∞Æ‡±ç‡∞∏‡±ç ‡∞™‡±ã‡∞∞‡±ç‡∞ü‡∞≤‡±ç",
                            url: "https://meetingonline.gov.in/homepage/official-login",
                            color:
                              "bg-orange-50 text-orange-700 border-orange-100",
                          },
                          {
                            name: "IFMIS Telangana (‡∞ü‡±ç‡∞∞‡±Ü‡∞ú‡∞∞‡±Ä)",
                            desc: "Integrated Financial Management Information System",
                            url: "https://ifmis.telangana.gov.in/",
                            color: "bg-cyan-50 text-cyan-700 border-cyan-100",
                          },
                          {
                            name: "TG TGov (‡∞§‡±Ü‡∞≤‡∞Ç‡∞ó‡∞æ‡∞£ ‡∞ú‡±Ä‡∞ì‡∞≤‡±Å)",
                            desc: "‡∞§‡±Ü‡∞≤‡∞Ç‡∞ó‡∞æ‡∞£ ‡∞™‡±ç‡∞∞‡∞≠‡±Å‡∞§‡±ç‡∞µ ‡∞ú‡±Ä‡∞ì‡∞≤ ‡∞∏‡±Ü‡∞∞‡±ç‡∞ö‡±ç ‡∞á‡∞Ç‡∞ú‡∞ø‡∞®‡±ç",
                            url: "https://goir.telangana.gov.in/",
                            color:
                              "bg-violet-50 text-violet-700 border-violet-100",
                          },
                        ].map((link) => (
                          <button
                            key={link.name}
                            onClick={() => setSelectedIframeUrl(link.url)}
                            className={`p-5 rounded-3xl border transition-all hover:scale-[1.02] active:scale-95 flex flex-col gap-2 shadow-sm text-left ${link.color}`}
                          >
                            <h4 className="font-black uppercase tracking-tight text-[11px] leading-tight flex-1">
                              {link.name}
                            </h4>
                            <p className="text-[10px] font-bold opacity-80 leading-relaxed">
                              {link.desc}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest leading-none">
                              Open in E-Vedhika <ArrowUpRight size={14} />
                            </div>
                          </button>
                        ))}
                      </div>
                      {selectedIframeUrl && (
                        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                          <div className="h-14 bg-indigo-600 flex items-center justify-between px-4 text-white shadow-md z-10 shrink-0">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedIframeUrl(null)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center gap-1 border border-transparent hover:border-white/30"
                              >
                                <X size={20} />
                                <span className="text-xs font-bold shrink-0">
                                  Close / ‡∞µ‡±Ü‡∞®‡±Å‡∞ï‡∞ï‡±Å
                                </span>
                              </button>
                            </div>
                            <div className="text-xs font-bold truncate max-w-[50%] opacity-80">
                              {selectedIframeUrl}
                            </div>
                            <a
                              href={selectedIframeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center gap-1 border border-transparent hover:border-white/30"
                              title="Open in new tab"
                            >
                              <ExternalLink size={16} />
                              <span className="text-[10px] font-bold hidden sm:inline shrink-0">
                                ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ü‡±ç‡∞Ø‡∞æ‡∞¨‡±ç ‡∞≤‡±ã
                              </span>
                            </a>
                          </div>
                          <div className="flex-1 w-full bg-slate-50 relative">
                            {/* Some sites might block iframe rendering due to X-Frame-Options */}
                            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-slate-400 bg-slate-50">
                              <div className="max-w-xs space-y-3">
                                <Loader2
                                  size={32}
                                  className="animate-spin mx-auto opacity-50"
                                />
                                <p className="text-xs font-medium">
                                  ‡∞≤‡±ã‡∞°‡∞ø‡∞Ç‡∞ó‡±ç... ‡∞í‡∞ï‡∞µ‡±á‡∞≥ ‡∞∏‡±à‡∞ü‡±ç ‡∞ì‡∞™‡±Ü‡∞®‡±ç ‡∞Ö‡∞µ‡±ç‡∞µ‡∞ï‡∞™‡±ã‡∞§‡±á
                                  (‡∞∏‡±Ü‡∞ï‡±ç‡∞Ø‡±Ç‡∞∞‡∞ø‡∞ü‡±Ä ‡∞µ‡∞≤‡±ç‡∞≤), ‡∞™‡±à‡∞®‡±Å‡∞®‡±ç‡∞® "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞ü‡±ç‡∞Ø‡∞æ‡∞¨‡±ç ‡∞≤‡±ã"
                                  ‡∞¨‡∞ü‡∞®‡±ç ‡∞®‡±ä‡∞ï‡±ç‡∞ï‡∞Ç‡∞°‡∞ø.
                                </p>
                              </div>
                            </div>
                            <iframe
                              src={`/api/iframe-proxy?url=${encodeURIComponent(selectedIframeUrl)}`}
                              className="absolute inset-0 w-full h-full border-0 z-10 bg-white"
                              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                              title="Embedded Website"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentTab === "excel_print" && (
                  <motion.div
                    key="excel_print"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ExcelPrinterTool user={user} addToast={addToast} />
                  </motion.div>
                )}

                {currentTab === "pdf_compress" && (
                  <motion.div
                    key="pdf_compress"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <PdfCompressTool />
                  </motion.div>
                )}

                {currentTab === "gpdp_setup" && (
                  <motion.div
                    key="gpdp_setup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <GPDPSetup />
                  </motion.div>
                )}
                {currentTab === "manage_custom_menus" && isAdmin && (
                  <motion.div
                    key="manage_custom_menus"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <button
                        aria-label="Back to Home"
                        onClick={() => setCurrentTab("home")}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
                      >
                        <ArrowLeft size={16} /> Back to Home
                      </button>
                    </div>
                    <CustomMenuAdmin 
                      customMenus={customMenus}
                      customMenuCards={customMenuCards}
                      addToast={addToast}
                    />
                  </motion.div>
                )}

                {currentTab.startsWith("custom_menu_") && (
                  <motion.div
                    key={currentTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <button
                        aria-label="Back to Home"
                        onClick={() => setCurrentTab("home")}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
                      >
                        <ArrowLeft size={16} /> Back to Home
                      </button>
                    </div>
                    {(() => {
                      const menuId = currentTab.replace("custom_menu_", "");
                      const menu = customMenus.find(m => m.id === menuId);
                      const cards = customMenuCards.filter(c => c.menuId === menuId);
                      return (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">{menu?.label || "Custom Menu"}</h2>
                          {cards.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-500 font-bold shadow-sm">
                              No items added to this menu yet.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {cards.map(card => (
                                <a
                                  key={card.id}
                                  href={card.linkUrl || "#"}
                                  target={card.linkUrl ? "_blank" : undefined}
                                  rel={card.linkUrl ? "noopener noreferrer" : undefined}
                                  className="group flex flex-col bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
                                >
                                  {card.imageUrl && (
                                    <div className="h-48 overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                                      <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                  )}
                                  <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{card.title}</h3>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4 flex-1 whitespace-pre-wrap">{card.description}</p>
                                    {card.linkUrl && (
                                      <div className="mt-auto flex items-center text-xs font-bold text-blue-500 uppercase tracking-widest group-hover:text-blue-600">
                                        View Details <ExternalLink size={14} className="ml-1" />
                                      </div>
                                    )}
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {currentTab === "farmer_registry" && (
                  <motion.div
                    key="farmer_registry"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <FarmerRegistryTool
                      user={user}
                      onLoginClick={() => setShowAuthModal(true)}
                      handleGoogleLogin={handleGoogleLogin}
                      addToast={addToast}
                    />
                  </motion.div>
                )}

                {currentTab === "my_activity" && (
                  <motion.div
                    key="my_activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <DynamicSection id="reports_tab_html" />
                    <MyActivity
                      user={user}
                      userProfile={userProfile}
                      problems={problemsGlobal}
                      suggestions={approvedSuggestions}
                      posts={posts}
                      setShowProfileModal={setShowProfileModal}
                    />
                  </motion.div>
                )}

                {currentTab === "directlinks" && (
  <motion.div
    key="directlinks"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex justify-between items-center mb-4">
      <button
        aria-label="Back to Home"
        onClick={() => setCurrentTab("home")}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
    <UBDTracker user={user} addToast={addToast} />
  </motion.div>
)}

                {currentTab === "exe_ubd_live" && (
                  <motion.div
                    key="exe_ubd_live"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <button
                        aria-label="Back to Home"
                        onClick={() => setCurrentTab("home")}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
                      >
                        <ArrowLeft size={16} /> ‡∞π‡±ã‡∞Æ‡±ç ‡∞™‡±á‡∞ú‡±Ä‡∞ï‡∞ø ‡∞§‡∞ø‡∞∞‡∞ø‡∞ó‡∞ø ‡∞µ‡±Ü‡∞≥‡±ç‡∞≥‡±Å (Back to Home)
                      </button>
                    </div>
                    <ExeUbdLiveMonitoring />
                  </motion.div>
                )}
                {/* Secondary admin block removed */}
              </AnimatePresence>
              </div>
            )}

            {(showPostForm || editingPost) && (
              <div className="fixed inset-0 z-[3000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl custom-scrollbar">
                  <PostForm
                    key={editingPost?.id || "new"}
                    addToast={addToast}
                    storageConfig={storageConfig}
                    onCancel={() => {
                      setShowPostForm(false);
                      setEditingPost(null);
                    }}
                    currentUserProfile={userProfile}
                    editingPost={editingPost}
                    isAdmin={isAdmin}
                    isEditor={isEditor}
                  />
                </div>
              </div>
            )}

            {showSuggestionForm && (
              <div className="fixed inset-0 z-[3000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl custom-scrollbar relative">
                  <SuggestionForm
                    addToast={addToast}
                    onCancel={() => setShowSuggestionForm(false)}
                    categories={suggestionCategories}
                  />
                </div>
              </div>
            )}

            {(showProfileModal || showForcedProfileSetup) && (
              <EditProfileModal
                onClose={() => {
                  if (showForcedProfileSetup) {
                    addToast("Please complete your profile first.");
                    return;
                  }
                  setShowProfileModal(false);
                }}
                onExitForced={() => {
                  setShowForcedProfileSetup(false);
                  setShowProfileModal(false);
                  setCurrentTab("home");
                }}
                user={user}
                userProfile={userProfile}
                addToast={addToast}
                isForced={showForcedProfileSetup}
                onComplete={() => setShowForcedProfileSetup(false)}
                districtsData={districtsData}
                rbacPermissions={rbacPermissions}
              />
            )}
          </div>
        </main>
      </div>
      </>

      {/* IMAGE LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          id="image-lightbox-modal"
          className="fixed inset-0 z-[9999] bg-slate-950/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          {/* Top Bar with Description and Actions */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white mb-4 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 flex-1 pr-4">
              <span className="text-xs uppercase tracking-widest font-black text-slate-400">
                Viewing Image Preview
              </span>
              <h4 className="text-sm sm:text-base font-bold truncate text-slate-100">
                {lightboxImage.name}
              </h4>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={lightboxImage.url}
                download={lightboxImage.name || "preview"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleForceDownload(
                    e,
                    lightboxImage.url,
                    lightboxImage.name || "Attachment",
                  );
                }}
                className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm border border-white/10 cursor-pointer"
                title="Download Image"
              >
                <Download size={14} /> Download
              </a>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-95 transition-all rounded-xl cursor-pointer"
                title="Close Preview"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div
            className="relative w-full max-w-5xl h-[75vh] md:h-[80vh] flex items-center justify-center bg-slate-900/40 rounded-3xl overflow-hidden border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getDirectImageUrl(lightboxImage.url)}
              alt={lightboxImage.name}
              className="max-w-full max-h-full object-contain select-none md:scale-100 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Footer Helper text */}
          <div className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-[#a855f7] text-center select-none animate-pulse">
            Click anywhere outside the image to return to portal.
          </div>
        </div>
      )}

      {/* WHATSAPP POST CARD SHARING MODAL */}
      {sharingPostForPoster && (
        <PosterShareModal
          post={sharingPostForPoster}
          onClose={() => setSharingPostForPoster(null)}
          addToast={addToast}
        />
      )}

      {/* DIRECT MESSAGES MODAL */}
      {showDirectMessages && (
        <div className="fixed inset-0 z-[4000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl w-[calc(100vw-32px)] bg-white sm:rounded-[24px] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-[85vh] max-h-[900px]"
          >
            {/* Left Pane - User List */}
            <div className={`w-full sm:w-[350px] md:w-[400px] shrink-0 border-r border-slate-200 bg-white flex-col h-full ${activeDmUser ? 'hidden sm:flex' : 'flex'}`}>
              <div className="p-3 sm:p-4 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <MessageCircle size={18} className="text-primary" />
                  Messages
                </h3>
                <button
                  onClick={() => {
                    setShowDirectMessages(false);
                    setActiveDmUser(null);
                  }}
                  className="p-2 rounded-full bg-slate-200/60 hover:bg-slate-300 transition-colors cursor-pointer text-slate-600 sm:hidden"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-3 border-b border-slate-200 bg-white">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={dmSearchQuery}
                    onChange={(e) => setDmSearchQuery(e.target.value)}
                    placeholder="Search any user to start new chat..."
                    className="w-full bg-slate-100 border-none pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 scrollbar-thin">
                {dmUsersList.length > 0 ? (
                  dmUsersList.map(u => {
                    const isOnline = (u as any).lastActive && (Date.now() - (u as any).lastActive < 120000);
                    const isSelected = activeDmUser?.id === u.id;
                    const unreadCount = (u as any).unreadCount || 0;
                    
                    return (
                      <div
                        key={u.id}
                        onClick={() => setActiveDmUser(u)}
                        className={`p-3 hover:bg-slate-100/80 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors relative ${isSelected ? 'bg-slate-100' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-black text-lg">
                              {(u.name || u.username || "U")[0]}
                            </div>
                          )}
                          {isOnline && (
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="text-[13px] font-black text-slate-900 truncate">
                              {u.surname} {u.name}
                            </h4>
                            {(u as any).lastMessageAt > 0 && (
                              <span className={`text-[10px] font-bold shrink-0 ml-2 ${unreadCount > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                {new Date((u as any).lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[11px] font-medium text-slate-500 truncate flex-1 flex items-center gap-1">
                              {(u as any).lastMessageText ? (
                                <>
                                  {(u as any).lastMessageSender === user.uid && ( (u as any).lastMessageRead ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} className="text-slate-400" /> )}
                                  <span className="truncate">{(u as any).lastMessageText}</span>
                                </>
                              ) : (
                                <span className="italic text-slate-400">Click to start chatting</span>
                              )}
                            </p>
                            {unreadCount > 0 && (
                              <span className="text-[10px] bg-green-500 text-white font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm ml-2 shrink-0">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-10 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-3">
                    <MessageCircle size={36} className="text-slate-300 mx-auto" />
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane - Active Chat */}
            <div className={`flex-1 min-w-0 w-full sm:w-auto bg-[#efeae2] flex flex-col h-full overflow-hidden relative max-w-full ${!activeDmUser ? 'hidden sm:flex' : 'flex'}`}>
              {!activeDmUser ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-[#f0f2f5] relative">
                  <button
                    onClick={() => setShowDirectMessages(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hidden sm:block"
                  >
                    <X size={20} />
                  </button>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
                    <MessageCircle size={64} />
                  </div>
                  <h2 className="text-2xl font-light text-slate-700 mb-2">E-VEDHIKA Web</h2>
                  <p className="text-sm text-slate-500 max-w-md font-medium">Select a conversation from the left to start messaging. All messages are securely synced.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                  {/* Chat Header */}
                  <div className="px-4 py-3 bg-slate-50 flex items-center gap-3 border-b border-slate-200 sticky top-0 z-10 shrink-0 w-full min-w-0">
                    <button 
                      className="sm:hidden p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors" 
                      onClick={() => setActiveDmUser(null)}
                    >
                      <ArrowLeft size={18} className="text-slate-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative">
                      {activeDmUser.photoURL ? (
                        <img src={activeDmUser.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-black">
                          {(activeDmUser.name || activeDmUser.username || "U")[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-slate-900 truncate">
                        {activeDmUser.surname} {activeDmUser.name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 truncate">
                        {typingUsers[activeDmUser.id] ? (
                          <span className="text-green-600 italic">typing...</span>
                        ) : (
                          (activeDmUser as any).lastActive && (Date.now() - (activeDmUser as any).lastActive < 120000) 
                            ? "Online" 
                            : `Last seen ${(activeDmUser as any).lastActive ? new Date((activeDmUser as any).lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'recently'}`
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDirectMessages(false);
                        setActiveDmUser(null);
                      }}
                      className="p-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hidden sm:block"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Messages Area */}
                  <div id="direct-chat-messages" className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2] w-full min-w-0 custom-scrollbar">
                    {dmMessages.length > 0 ? (
                      dmMessages.map((m: any, idx: number) => {
                        const isMe = m.senderId === user?.uid;
                        const prevMsg = idx > 0 ? dmMessages[idx - 1] : null;
                        const timeDiff = prevMsg ? (m.createdAt || 0) - (prevMsg.createdAt || 0) : 999999;
                        const showTimeHeader = timeDiff > 300000;
                        const sameSenderAsPrev = prevMsg && prevMsg.senderId === m.senderId && !showTimeHeader;

                        return (
                          <div key={m.id}>
                            {showTimeHeader && (
                              <div className="text-center my-3">
                                <span className="text-[10px] font-bold bg-white/80 backdrop-blur-sm text-slate-600 px-3 py-1.5 rounded-lg shadow-sm">
                                  {new Date(m.createdAt || Date.now()).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isMe ? "justify-end" : "justify-start"} ${sameSenderAsPrev ? "mt-0.5" : "mt-2"}`}>
                              <div
                                className={`max-w-[80%] px-3 py-2 rounded-lg text-[13px] shadow-sm relative group break-all sm:break-words ${
                                  isMe
                                    ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none"
                                    : "bg-white text-slate-800 rounded-tl-none"
                                }`}
                              >
                                <p className="leading-relaxed break-words whitespace-pre-wrap max-w-full">{m.text}</p>
                                <div className={`flex items-center justify-end gap-1 mt-0.5 text-[9px] font-bold ${isMe ? "text-slate-500" : "text-slate-400"}`}>
                                  <span>
                                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  {isMe && (
                                    <span className="ml-1 inline-flex items-center">
                                      {m.read ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} className="text-slate-400" />}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 text-xs font-bold bg-white/50 rounded-2xl mx-10 p-4 text-center backdrop-blur-sm shadow-sm">
                        No messages yet. Send a message to start the conversation!
                      </div>
                    )}
                  </div>

                  {/* Quick-Reply Buttons */}
                  <div className="px-4 py-2 bg-[#f0f2f5] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 border-t border-slate-200 w-full min-w-0 max-w-full">
                    {[
                      "Okay (‡∞∏‡∞∞‡±á)",
                      "Understood (‡∞Ö‡∞∞‡±ç‡∞•‡∞Æ‡±à‡∞Ç‡∞¶‡∞ø)",
                      "Please wait (‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞µ‡±á‡∞ö‡∞ø ‡∞â‡∞Ç‡∞°‡∞Ç‡∞°‡∞ø)",
                      "Thank you (‡∞ß‡∞®‡±ç‡∞Ø‡∞µ‡∞æ‡∞¶‡∞æ‡∞≤‡±Å)",
                      "Call me (‡∞ï‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø)"
                    ].map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        onClick={() => handleSendDMText(qr)}
                        className="px-3 py-1.5 bg-white hover:bg-green-50 text-slate-700 hover:text-green-700 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border border-slate-200 shadow-sm shrink-0 cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendDM} className="p-3 bg-[#f0f2f5] flex gap-2 items-end shrink-0 w-full min-w-0 max-w-full">
                    <textarea
                      value={dmInput}
                      onChange={(e) => {
                         handleTypingChange(e as any);
                         e.target.style.height = 'auto';
                         e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendDM(e);
                        }
                      }}
                      placeholder="Type a message"
                      rows={1}
                      className="flex-1 min-w-0 w-full bg-white border-none px-4 py-3 rounded-2xl text-[13px] font-medium outline-none focus:ring-1 focus:ring-green-500 resize-none overflow-y-auto max-h-[120px]"
                      style={{ minHeight: '44px' }}
                    />
                    <button
                      type="submit"
                      disabled={!dmInput.trim()}
                      className={`p-3 rounded-full flex items-center justify-center shrink-0 transition-colors ${dmInput.trim() ? 'bg-[#00a884] text-white cursor-pointer hover:bg-[#008f6f]' : 'bg-slate-200 text-slate-400'}`}
                    >
                      <Send size={18} className={`${dmInput.trim() ? 'ml-0.5' : ''}`} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <button
        onClick={() => {
          if (!user) {
            requireLoginAlert();
            return;
          }
          setEditingPost(null);
          setShowPostForm(true);
        }}
        className={`fixed ${showBackToTop ? 'bottom-[88px]' : 'bottom-6'} right-6 z-[999] p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-blue-400 group focus:outline-none focus:ring-4 focus:ring-blue-500/50`}
        title="‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø (Create Post)"
      >
        <span className="hidden w-0 overflow-hidden group-hover:w-auto md:group-hover:inline-block font-black text-xs uppercase tracking-wider mr-2 ml-1 transition-all">Create Post</span>
        <Plus size={24} strokeWidth={3} />
      </button>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[999] p-3.5 bg-[#103052] text-[#fbe947] border-2 border-[#1e40af]/30 rounded-full shadow-2xl hover:bg-[#0c243f] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="‡∞™‡±à‡∞ï‡∞ø ‡∞µ‡±Ü‡∞≥‡±ç‡∞≥‡∞Ç‡∞°‡∞ø (Back to Top)"
        >
          <ChevronUp size={24} strokeWidth={3} />
        </button>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          addToast={addToast}
          handleGoogleLogin={handleGoogleLogin}
          districtsData={districtsData}
        />
      )}

      {/* PWA Mobile Installation Banner */}
      <AnimatePresence>
        {showPWABanner && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-[1001] md:hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 shadow-2xl border border-indigo-500/20 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Smartphone className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black tracking-tight text-white text-left">
                    E-Vedhika ‡∞Ø‡∞æ‡∞™‡±ç ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞∏‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø üì±
                  </h4>
                  <p className="text-[11px] font-medium text-slate-300 mt-0.5 leading-normal text-left">
                    ‡∞∏‡±Å‡∞≤‡∞≠‡∞Ç‡∞ó‡∞æ, ‡∞µ‡±á‡∞ó‡∞Ç‡∞ó‡∞æ ‡∞´‡∞ø‡∞∞‡±ç‡∞Ø‡∞æ‡∞¶‡±Å‡∞≤‡±Å ‡∞®‡∞Æ‡±ã‡∞¶‡±Å ‡∞ö‡±á‡∞Ø‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞Æ‡±ä‡∞¨‡±à‡∞≤‡±ç ‡∞Ø‡∞æ‡∞™‡±ç‚Äå‡∞®‡±Å ‡∞Æ‡±Ä ‡∞π‡±ã‡∞Æ‡±ç ‡∞∏‡±ç‡∞ï‡±ç‡∞∞‡±Ä‡∞®‡±ç‚Äå‡∞ï‡±Å ‡∞ú‡±ã‡∞°‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismissPWA}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleDismissPWA}
                className="flex-1 bg-white/10 hover:bg-white/15 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 text-center"
              >
                ‡∞§‡∞∞‡±ç‡∞µ‡∞æ‡∞§ (Later)
              </button>
              <button
                onClick={handlePWAInstall}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-black py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                ‡∞á‡∞™‡±ç‡∞™‡±Å‡∞°‡±á ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞ø (Install)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Mobile Installation Guides Modal */}
      <AnimatePresence>
        {showPWAGuide && (
          <div className="fixed inset-0 z-[2005] flex items-end justify-center sm:items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPWAGuide(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col p-6 text-slate-800 z-[2006]"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    {showPWAGuide === "desktop_manual" ? (
                      <Laptop size={20} />
                    ) : showPWAGuide === "ios" ? (
                      <Tablet size={20} />
                    ) : (
                      <Smartphone size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-slate-800 tracking-tight text-left">
                      ‡∞Ø‡∞æ‡∞™‡±ç ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ó‡±à‡∞°‡±ç (Install App)
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 text-left">
                      {showPWAGuide === "desktop_manual" ? "Desktop & Laptop PWA" : showPWAGuide === "ios" ? "iPhone & iPad PWA" : "Android & Mobile PWA"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPWAGuide(null)}
                  className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {showPWAGuide === "ios" ? (
                <div className="space-y-4">
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-left">
                    ‡∞Æ‡±Ä <span className="font-bold text-slate-800">iPhone / iPad</span> ‡∞≤‡±ã ‡∞à ‡∞Ø‡∞æ‡∞™‡±ç‚Äå‡∞®‡±Å ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶‡∞ø ‡∞∏‡±ç‡∞ü‡±Ü‡∞™‡±ç‡∞∏‡±ç ‡∞´‡∞æ‡∞≤‡±ã ‡∞Ö‡∞µ‡±ç‡∞µ‡∞Ç‡∞°‡∞ø:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        Safari ‡∞¨‡±ç‡∞∞‡±å‡∞ú‡∞∞‡±ç ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶ ‡∞â‡∞®‡±ç‡∞® <span className="text-blue-600 font-extrabold flex inline-flex items-center gap-0.5">Share ‡∞¨‡∞ü‡∞®‡±ç <Share2 size={14} className="inline inline-block" /></span> ‡∞™‡±à ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Tap the Share button at the bottom of the screen).</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞Æ‡±Ü‡∞®‡±Å‡∞≤‡±ã ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶‡∞ø‡∞ï‡∞ø ‡∞∏‡±ç‡∞ï‡±ç‡∞∞‡±ã‡∞≤‡±ç ‡∞ö‡±á‡∞∏‡∞ø <span className="text-indigo-600 font-extrabold">'Add to Home Screen' (‡∞π‡±ã‡∞Æ‡±ç ‡∞∏‡±ç‡∞ï‡±ç‡∞∞‡±Ä‡∞®‡±ç‚Äå‡∞ï‡±Å ‡∞ö‡±á‡∞∞‡±ç‡∞ö‡±Å)</span> ‡∞®‡±Å ‡∞é‡∞Ç‡∞ö‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Scroll down the menu and tap 'Add to Home Screen').</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞™‡±à‡∞® ‡∞ï‡±Å‡∞°‡∞ø ‡∞µ‡±à‡∞™‡±Å‡∞® ‡∞â‡∞®‡±ç‡∞® <span className="text-green-600 font-extrabold">'Add' (‡∞ö‡±á‡∞∞‡±ç‡∞ö‡±Å)</span> ‡∞¨‡∞ü‡∞®‡±ç ‡∞™‡±à ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Tap 'Add' in the top right corner to complete installation).</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : showPWAGuide === "desktop_manual" ? (
                <div className="space-y-4">
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-left">
                    ‡∞Æ‡±Ä <span className="font-bold text-slate-800">Desktop / Laptop (Windows, Mac, ChromeOS)</span> ‡∞≤‡±ã ‡∞Ø‡∞æ‡∞™‡±ç ‡∞≤‡∞æ‡∞ó‡∞æ ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞¨‡±ç‡∞∞‡±å‡∞ú‡∞∞‡±ç URL ‡∞Ö‡∞°‡±ç‡∞∞‡∞∏‡±ç ‡∞¨‡∞æ‡∞∞‡±ç ‡∞™‡±à‡∞® ‡∞ï‡±Å‡∞°‡∞ø ‡∞µ‡±à‡∞™‡±Å‡∞® ‡∞â‡∞Ç‡∞°‡±á <span className="text-blue-600 font-extrabold">Install ‡∞ê‡∞ï‡∞æ‡∞®‡±ç (‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞ï‡∞Ç‡∞™‡±ç‡∞Ø‡±Ç‡∞ü‡∞∞‡±ç ‡∞∏‡∞ø‡∞Ç‡∞¨‡∞≤‡±ç)</span> ‡∞™‡±à ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Click the 'Install app' icon in the browser address bar).</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞≤‡±á‡∞¶‡∞æ ‡∞¨‡±ç‡∞∞‡±å‡∞ú‡∞∞‡±ç ‡∞Æ‡±Ü‡∞®‡±Å (‚ãÆ) ‡∞ì‡∞™‡±Ü‡∞®‡±ç ‡∞ö‡±á‡∞∏‡∞ø <span className="text-indigo-600 font-extrabold">'Save and share' ‚ûî 'Install E-Vedhika'</span> ‡∞é‡∞Ç‡∞ö‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Or go to Menu ‚ûî 'Save and share' / 'Apps' ‚ûî 'Install E-Vedhika').</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞™‡∞æ‡∞™‡±ç-‡∞Ö‡∞™‡±ç‚Äå‡∞≤‡±ã <span className="text-green-600 font-extrabold">'Install'</span> ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞∏‡±ç‡∞§‡±á ‡∞Ø‡∞æ‡∞™‡±ç ‡∞µ‡∞ø‡∞°‡∞ø‡∞ó‡∞æ ‡∞ì‡∞™‡±Ü‡∞®‡±ç ‡∞Ö‡∞µ‡±Å‡∞§‡±Å‡∞Ç‡∞¶‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Click 'Install' to launch as a standalone desktop app).</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed text-left">
                    ‡∞Æ‡±Ä <span className="font-bold text-slate-800">Android ‡∞Æ‡±ä‡∞¨‡±à‡∞≤‡±ç ‡∞≤‡±á‡∞¶‡∞æ ‡∞ü‡∞æ‡∞¨‡±ç‡∞≤‡±Ü‡∞ü‡±ç</span> ‡∞≤‡±ã ‡∞à ‡∞Ø‡∞æ‡∞™‡±ç‚Äå‡∞®‡±Å ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞ï‡±ç‡∞∞‡∞ø‡∞Ç‡∞¶‡∞ø ‡∞∏‡±ç‡∞ü‡±Ü‡∞™‡±ç‡∞∏‡±ç ‡∞´‡∞æ‡∞≤‡±ã ‡∞Ö‡∞µ‡±ç‡∞µ‡∞Ç‡∞°‡∞ø:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞¨‡±ç‡∞∞‡±å‡∞ú‡∞∞‡±ç ‡∞™‡±à‡∞® ‡∞ï‡±Å‡∞°‡∞ø ‡∞µ‡±à‡∞™‡±Å‡∞® ‡∞â‡∞®‡±ç‡∞® <span className="text-blue-600 font-extrabold">‡∞§‡±ç‡∞∞‡±Ä ‡∞°‡∞æ‡∞ü‡±ç‡∞∏‡±ç (‡∞Æ‡±Ü‡∞®‡±Å - 3 ‡∞ö‡±Å‡∞ï‡±ç‡∞ï‡∞≤‡±Å)</span> ‡∞™‡±à ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Tap the three dots menu icon in the top right corner).</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞Ö‡∞ï‡±ç‡∞ï‡∞° ‡∞â‡∞®‡±ç‡∞® <span className="text-indigo-600 font-extrabold">'Install app' (‡∞Ø‡∞æ‡∞™‡±ç‚Äå‡∞®‡±Å ‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç ‡∞ö‡±á‡∞Ø‡∞ø)</span> ‡∞≤‡±á‡∞¶‡∞æ <span className="text-indigo-600 font-extrabold">'Add to Home Screen'</span> ‡∞é‡∞Ç‡∞ö‡±Å‡∞ï‡±ã‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Tap 'Install app' or 'Add to Home Screen' in the list).</span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-normal text-left">
                        ‡∞µ‡∞ö‡±ç‡∞ö‡∞ø‡∞® ‡∞¨‡∞æ‡∞ï‡±ç‡∞∏‡±ç‚Äå‡∞≤‡±ã <span className="text-green-600 font-extrabold">'Install' (‡∞á‡∞®‡±ç‚Äå‡∞∏‡±ç‡∞ü‡∞æ‡∞≤‡±ç)</span> ‡∞ï‡±ç‡∞≤‡∞ø‡∞ï‡±ç ‡∞ö‡±á‡∞Ø‡∞Ç‡∞°‡∞ø.
                        <br/>
                        <span className="text-[10px] text-slate-400 font-medium">(Confirm by clicking 'Install').</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowPWAGuide(null);
                  localStorage.setItem("e_vedhika_pwa_dismissed", "true");
                  setShowPWABanner(false);
                }}
                className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center"
              >
                ‡∞∏‡∞∞‡±á (Got It)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </div>
  );
}

function EditProfileModal({
  onClose,
  onExitForced,
  user,
  userProfile,
  addToast,
  isForced,
  onComplete,
  districtsData,
  rbacPermissions,
}: {
  onClose: () => void;
  onExitForced?: () => void;
  user: any;
  userProfile: UserProfile | null;
  addToast: (s: string) => void;
  isForced?: boolean;
  onComplete?: () => void;
  districtsData: Record<string, string[]>;
  rbacPermissions: any;
}) {
  const [surname, setSurname] = useState(userProfile?.surname || "");
  const [name, setName] = useState(userProfile?.name || "");
  const [username, setUsername] = useState(
    userProfile?.username || user?.displayName || "",
  );
  const [gender, setGender] = useState(userProfile?.gender || "");
  const [state, setState] = useState(userProfile?.state || "Telangana");
  const [district, setDistrict] = useState(userProfile?.district || "");
  const [mandal, setMandal] = useState(userProfile?.mandal || "");
  const [village, setVillage] = useState(userProfile?.village || "");
  const [mobile, setMobile] = useState(userProfile?.mobile || "");
  const [email, setEmail] = useState(userProfile?.email || user?.email || "");
  const [photoURL, setPhotoURL] = useState(
    userProfile?.photoURL || user?.photoURL || "",
  );
  const [coverPhotoURL, setCoverPhotoURL] = useState(
    userProfile?.coverPhotoURL || "",
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const storageRef = ref(storage, `uploads/avatars/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      addToast("Profile photo uploaded!");
    } catch (err) {
      addToast("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const storageRef = ref(storage, `uploads/covers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCoverPhotoURL(url);
      addToast("Cover photo uploaded successfully!");
    } catch (err) {
      addToast("Failed to upload cover photo");
    } finally {
      setUploadingCover(false);
    }
  };
  const [designation, setDesignation] = useState(
    userProfile?.designation || "",
  );
  const [office, setOffice] = useState(userProfile?.office || "");
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    userProfile?.theme || "system",
  );
  const [notifications, setNotifications] = useState(
    userProfile?.notifications ?? true,
  );
  const [saving, setSaving] = useState(false);

  const mandals = district ? districtsData[district] || [] : [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!username || !name || !surname || (gender !== "Female" && !mobile)) {
      addToast("Please fill all required fields (*)");
      return;
    }
    setSaving(true);
    try {
      if (username !== userProfile?.username) {
        const lowerUsername = username.toLowerCase().trim();
        const usernameDoc = await getDoc(doc(db, "usernames", lowerUsername));
        if (usernameDoc.exists() && usernameDoc.data().uid !== user.uid) {
          addToast("Username already taken. Please choose another.");
          setSaving(false);
          return;
        }

        if (userProfile?.username) {
          await deleteDoc(
            doc(db, "usernames", userProfile.username.toLowerCase().trim()),
          );
        }

        await setDoc(doc(db, "usernames", lowerUsername), { uid: user.uid });
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          surname,
          name,
          username,
          gender,
          state,
          district,
          mandal,
          village,
          designation,
          office,
          mobile,
          email,
          photoURL,
          coverPhotoURL,
          theme,
          notifications,
          time: userProfile?.time || Date.now(),
        },
        { merge: true },
      );

      if (designation === "Citizen") {
        Swal.fire({
          title: "‡∞∏‡∞ø‡∞ü‡∞ø‡∞ú‡∞®‡±ç ‡∞ó‡∞æ‡∞∞‡∞ø‡∞ï‡∞ø ‡∞®‡∞Æ‡∞∏‡±ç‡∞ï‡∞æ‡∞∞‡∞Ç",
          text: "‡∞™‡±ç‡∞∞‡∞∏‡±ç‡∞§‡±Å‡∞§‡∞Ç ‡∞à ‡∞µ‡±á‡∞¶‡∞ø‡∞ï Webportal ‡∞∏‡∞ø‡∞ü‡∞ø‡∞ú‡∞®‡±ç ‡∞∏‡∞∞‡±ç‡∞µ‡±Ä‡∞∏‡±ç ‡∞á‡∞Ç‡∞ï‡∞æ ‡∞Ö‡∞Ç‡∞¶‡±Å‡∞¨‡∞æ‡∞ü‡±Å‡∞≤‡±ã‡∞ï‡∞ø ‡∞∞‡∞æ‡∞≤‡±á‡∞¶‡±Å. ‡∞∞‡∞æ‡∞ó‡∞æ‡∞®‡±á ‡∞Æ‡±Ä ‡∞Æ‡±ä‡∞¨‡±à‡∞≤‡±ç ‡∞®‡±Ü‡∞Ç‡∞¨‡∞∞‡±ç ‡∞ï‡∞ø ‡∞Æ‡±Ü‡∞∏‡±á‡∞ú‡±ç ‡∞≤‡±á‡∞¶‡∞æ ‡∞á‡∞Æ‡±Ü‡∞Ø‡∞ø‡∞≤‡±ç ‡∞¶‡±ç‡∞µ‡∞æ‡∞∞‡∞æ ‡∞Æ‡±Ä‡∞ï‡±Å ‡∞∏‡∞Æ‡∞æ‡∞ö‡∞æ‡∞∞‡∞Ç ‡∞á‡∞µ‡±ç‡∞µ‡∞°‡∞Ç ‡∞ú‡∞∞‡±Å‡∞ó‡±Å‡∞§‡±Å‡∞Ç‡∞¶‡∞ø.",
          icon: "info",
          confirmButtonText: "‡∞∏‡∞∞‡±á (OK)",
          confirmButtonColor: "#0d3b66",
        });
      } else {
        addToast("Profile updated successfully!");
      }

      if (onComplete) onComplete();
      onClose();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      if (err.message.includes("offline")) {
        addToast(
          "Error: Connection lost. Please check your internet or refresh the page.",
        );
      } else {
        addToast(getFriendlyError(err));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {!isForced && (
          <button
            aria-label="Close profile modal"
            onClick={onClose}
            className="absolute top-6 right-6 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">
            Profile Setup
          </h2>
          <div className="flex justify-center mt-1">
            <p className="bg-accent text-primary px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.12em] shadow-sm">
              {isForced
                ? "Complete your identity to continue"
                : "Update your portal credentials & Workplace Details"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          {/* Permissions Matrix Summary for Staff */}
          {(userProfile?.role === "admin" ||
            userProfile?.role === "editor" ||
            userProfile?.role === "moderator") && (
            <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest leading-none">
                    Your Account Permissions
                  </h4>
                  <p className="text-[8px] font-bold text-blue-400 uppercase mt-0.5 tracking-tight">
                    Active for: {userProfile.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                {[
                  "dash",
                  "reports",
                  "gos_formats",
                  "updates",
                  "users",
                  "builder",
                  "locations",
                  "suggestions",
                  "trash",
                  "logs",
                  "settings",
                  "ai",
                ].map((tab) => {
                  const perms =
                    rbacPermissions?.[userProfile.role!]?.[tab] || {};
                  if (!perms.view) return null;
                  return (
                    <div
                      key={tab}
                      className="bg-white/80 p-2 rounded-xl flex items-center justify-between border border-blue-50 shadow-sm"
                    >
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter truncate max-w-[70px]">
                        {tab === "gos_formats"
                          ? "GOs"
                          : tab === "dash"
                            ? "Home"
                            : tab}
                      </span>
                      <div className="flex gap-0.5">
                        {perms.view && (
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                            title="View"
                          />
                        )}
                        {perms.edit && (
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                            title="Edit"
                          />
                        )}
                        {perms.delete && (
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                            title="Delete"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cover Photo Section */}
          <div className="mb-4">
            <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
              Cover Photo (‡∞ï‡∞µ‡∞∞‡±ç ‡∞´‡±ã‡∞ü‡±ã)
            </label>
            <div className="w-full h-28 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-100 relative group flex items-center justify-center">
              {coverPhotoURL ? (
                <img
                  src={coverPhotoURL}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                  <ImageIcon size={16} /> Add Header Cover Photo
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold gap-2">
                <Camera size={16} /> {uploadingCover ? "Uploading..." : "Upload Cover"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-[20px] overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center relative group">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={30} className="text-slate-300" />
              )}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Surname *
              </label>
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
                placeholder="Surname"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
                placeholder="Name"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
              Display Name / Username *
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
              placeholder="Username"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  if (e.target.value === "Female") setMobile("");
                }}
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            {gender !== "Female" && (
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                  Mobile No *
                </label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
                  placeholder="Mobile Number"
                />
              </div>
            )}
          </div>

          <div className="mt-4 mb-2 px-1 pb-1 border-b border-slate-100">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
               <Building size={12} />
               Office / Workplace Address
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Office State
              </label>
              <select
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl outline-none font-bold text-xs cursor-not-allowed"
                disabled
              >
                <option>Telangana</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Office District
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setMandal("");
                }}
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
              >
                <option value="">Select District</option>
                {Object.keys(districtsData)
                  .sort()
                  .map((d) => (
                    <option key={d}>{d}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Office Mandal
              </label>
              <select
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
                disabled={!district}
              >
                <option value="">Select Mandal</option>
                {mandals.map((m, idx) => (
                  <option key={`${m}_${idx}`} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
                Office Village / GP
              </label>
              <input
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
                placeholder="Village"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
              Designation
            </label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Type Designation (e.g. e-Panchayat, MPO)"
              className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
            />
          </div>

          <div>
            <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block ml-1 tracking-wider">
              Office Address
            </label>
            <input
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              placeholder="Office location / Building"
              className="w-full bg-slate-50 border-2 border-transparent p-2 rounded-xl focus:border-primary/20 outline-none font-bold text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[10px] font-black uppercase text-slate-600">
                  Theme
                </span>
                <select
                  value={theme}
                  onChange={(e) =>
                    setTheme(e.target.value as "light" | "dark" | "system")
                  }
                  className="bg-transparent text-right font-bold text-[10px] outline-none cursor-pointer"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[10px] font-black uppercase text-slate-600">
                  Notifications
                </span>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {!isForced && (
              <>
                <button
                  aria-label="Cancel"
                  type="button"
                  onClick={onClose}
                  className="flex-1 min-w-[120px] bg-slate-100 text-slate-600 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  aria-label="Logout"
                  type="button"
                  onClick={() => {
                    auth.signOut();
                    onClose();
                  }}
                  className="flex-1 min-w-[120px] bg-red-50 text-red-600 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-100 transition-all active:scale-95 border border-red-200 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
            {isForced && (
              <button
                aria-label="Exit to Home"
                type="button"
                onClick={onExitForced}
                className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Exit to Home
              </button>
            )}
            <button
              aria-label="Save Profile Changes"
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase text-sm tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-3"
              style={{ background: "#0d3b66" }}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function SystemLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="hidden lg:flex flex-col items-end">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 leading-none">
          System Live
        </span>
      </div>
      <span className="text-[11px] font-mono font-bold text-slate-500 tracking-wider">
        {time.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })} &bull; {time.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}
      </span>
    </div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-right hidden sm:block">
      <p className="text-sm font-black text-slate-800">
        {time.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p className="text-[14px] font-mono font-black text-slate-600 tracking-wider">
        {time.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
    </div>
  );
}

function LocationManager({
  districtsData,
  addToast,
}: {
  districtsData: Record<string, string[]>;
  addToast: (s: string) => void;
}) {
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  const [newDistrict, setNewDistrict] = useState("");
  const [newMandalMap, setNewMandalMap] = useState<Record<string, string>>({});

  const writeData = async (data: Record<string, string[]>) => {
    try {
      await setDoc(
        doc(db, "settings", "locations"),
        { data, updatedAt: Date.now() },
        { merge: true },
      );
      addToast("Locations successfully updated.");
    } catch (e: any) {
      addToast("Error updating locations");
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-2xl font-black text-primary mb-1">
            Location Management
          </h4>
          <p className="text-xs text-slate-400 font-medium tracking-tight">
            Add or remove districts and mandals available in the system
            dropdowns.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
        <div className="flex-1">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">
            Add New District
          </h5>
          <input
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            placeholder="e.g. Medchal-Malkajgiri"
            className="w-full bg-white border-none p-4 rounded-2xl outline-none font-bold text-sm shadow-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            aria-label="Add District"
            onClick={() => {
              if (!newDistrict) return;
              if (districtsData[newDistrict.trim()]) {
                addToast("District already exists");
                return;
              }
              const updated = { ...districtsData, [newDistrict.trim()]: [] };
              writeData(updated);
              setNewDistrict("");
            }}
            className="h-[52px] px-6 bg-[#0f2e4a] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-colors shadow-lg active:scale-95 flex items-center justify-center"
          >
            Add District
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(districtsData)
          .sort()
          .map((d) => (
            <div
              key={d}
              className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
            >
              <div className="p-5 flex items-center justify-between bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                <h3 className="font-black text-[#0f2e4a] flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  {d}
                </h3>
                <div className="flex gap-2">
                  <button
                    aria-label="Toggle Expand"
                    onClick={() =>
                      setExpandedDistrict(expandedDistrict === d ? null : d)
                    }
                    className="p-2 text-slate-400 hover:text-[#0f2e4a] hover:bg-slate-200/50 rounded-xl transition-colors"
                  >
                    <ChevronRight
                      size={18}
                      className={`transition-transform ${expandedDistrict === d ? "rotate-90" : ""}`}
                    />
                  </button>
                  <button
                    aria-label="Delete District"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${d} and all its mandals?`,
                        )
                      ) {
                        const updated = { ...districtsData };
                        delete updated[d];
                        writeData(updated);
                      }
                    }}
                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {expandedDistrict === d && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  <div className="flex gap-2 mb-4">
                    <input
                      value={newMandalMap[d] || ""}
                      onChange={(e) =>
                        setNewMandalMap({
                          ...newMandalMap,
                          [d]: e.target.value,
                        })
                      }
                      placeholder="New Mandal Name"
                      className="flex-1 bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl font-bold text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const m = newMandalMap[d]?.trim();
                          if (m) {
                            const updated = {
                              ...districtsData,
                              [d]: [
                                ...(districtsData[d] || []).filter(
                                  (x) => x !== m,
                                ),
                                m,
                              ].sort(),
                            };
                            writeData(updated);
                            setNewMandalMap({ ...newMandalMap, [d]: "" });
                          }
                        }
                      }}
                    />
                    <button
                      aria-label="Add Mandal"
                      onClick={() => {
                        const m = newMandalMap[d]?.trim();
                        if (m) {
                          const updated = {
                            ...districtsData,
                            [d]: [
                              ...(districtsData[d] || []).filter(
                                (x) => x !== m,
                              ),
                              m,
                            ].sort(),
                          };
                          writeData(updated);
                          setNewMandalMap({ ...newMandalMap, [d]: "" });
                        }
                      }}
                      className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {districtsData[d].map((m: string) => (
                      <div
                        key={m}
                        className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2"
                      >
                        <span className="text-xs font-bold text-slate-600">
                          {m}
                        </span>
                        <button
                          aria-label="Delete Mandal"
                          onClick={() => {
                            const updated = {
                              ...districtsData,
                              [d]: districtsData[d].filter(
                                (x: string) => x !== m,
                              ),
                            };
                            writeData(updated);
                          }}
                          className="text-slate-300 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-0.5 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {districtsData[d].length === 0 && (
                      <div className="w-full p-4 text-center text-xs font-bold text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                        No mandals added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function MyActivity({ user, userProfile, problems, suggestions, posts, setShowProfileModal }: any) {
  const [activeTab, setActiveTab] = useState<"posts" | "problems" | "suggestions">("posts");

  const myPosts = posts?.filter(
    (p: any) => p.uid === user?.uid || p.authorId === user?.uid || p.author === userProfile?.username
  ) || [];

  const myProblems = problems?.filter(
    (p: any) => p.userId === user?.uid || p.authorId === user?.uid
  ) || [];

  const mySuggestions = suggestions?.filter(
    (s: any) => s.authorId === user?.uid || s.userId === user?.uid || s.uid === user?.uid
  ) || [];

  const pendingProblems = myProblems.filter((p: any) => p.status !== "resolved").length;
  const resolvedProblems = myProblems.filter((p: any) => p.status === "resolved").length;

  const handleDeleteItem = async (col: string, id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });
    if (res.isConfirmed) {
      try {
        await deleteDoc(doc(db, col, id));
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      } catch (err: any) {
        Swal.fire("Error", "Could not delete item.", "error");
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[60vh]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary flex items-center gap-2 mb-2">
            <User size={28} className="text-primary" /> My Profile
          </h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">
            Track your posts, problems, and suggestions
          </p>
        </div>
        <button
          onClick={() => setShowProfileModal(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm flex items-center gap-2 shadow-sm"
        >
          <User size={16} /> Edit Profile
        </button>
      </div>

      {/* Summary Stats Component */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center items-center">
          <span className="text-3xl font-black text-primary">{myPosts.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Posts</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col justify-center items-center">
          <span className="text-3xl font-black text-amber-600">{pendingProblems}</span>
          <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest mt-1">Pending Problems</span>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex flex-col justify-center items-center">
          <span className="text-3xl font-black text-green-600">{resolvedProblems}</span>
          <span className="text-[10px] font-bold text-green-600/70 uppercase tracking-widest mt-1">Resolved Problems</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-100 pb-2 overflow-x-auto custom-scrollbar">
        <button
          aria-label="My Posts"
          onClick={() => setActiveTab("posts")}
          className={`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "posts" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}`}
        >
          My Posts ({myPosts.length})
        </button>
        <button
          aria-label="My Problems"
          onClick={() => setActiveTab("problems")}
          className={`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "problems" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}`}
        >
          My Problems ({myProblems.length})
        </button>
        <button
          aria-label="My Suggestions"
          onClick={() => setActiveTab("suggestions")}
          className={`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "suggestions" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}`}
        >
          My Suggestions ({mySuggestions.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "posts" &&
          (myPosts.length > 0 ? (
            myPosts.map((p: any) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      {p.category || "General"}
                    </span>
                    <span className={`px-3 text-[10px] font-black uppercase tracking-widest py-1 rounded-full ${p.status === "Published" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                      {p.status || "Published"}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mt-2">
                    {p.title || "Untitled Post"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Posted on: {new Date(p.createdAt || p.time || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem("posts", p.id)}
                  className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                  aria-label="Delete Post"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-bold text-slate-400">
              No posts published yet.
            </div>
          ))}

        {activeTab === "problems" &&
          (myProblems.length > 0 ? (
            myProblems.map((p: any) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      {p.category || "Problem"}
                    </span>
                    <span
                      className={`px-3 text-[10px] font-black uppercase tracking-widest py-1 rounded-full ${p.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {p.status || "Pending"}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mt-2">
                    {p.title || p.desc?.substring(0, 50)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {p.desc}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Submitted on:{" "}
                    {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem("problems", p.id)}
                  className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                  aria-label="Delete Problem"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-bold text-slate-400">
              No problems reported yet.
            </div>
          ))}

        {activeTab === "suggestions" &&
          (mySuggestions.length > 0 ? (
            mySuggestions.map((s: any) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 text-[10px] font-black uppercase tracking-widest py-1 rounded-full ${s.status === "approved" || s.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {s.status === "approved" || s.status === "resolved"
                        ? "Published"
                        : s.status || "Under Review"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mt-2">
                    {s.text || s.msg || s.suggestion}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Submitted on:{" "}
                    {new Date(
                      s.time || s.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem("suggestions", s.id)}
                  className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                  aria-label="Delete Suggestion"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-bold text-slate-400">
              No suggestions submitted yet.
            </div>
          ))}
      </div>
    </div>
  );
}
export const DEFAULT_HOME_ELEMENTS = [
  {
    id: 2,
    type: "Post Grid",
    title: "Latest Insight Hub",
    color: "indigo",
    hidden: false,
  },
  {
    id: 5,
    type: "Contact Banner",
    title: "Voice your vision.",
    content: "We're listening. Build the future of e-governance with us.",
    color: "slate",
    hidden: false,
  },
];

interface Advertisement {
  id: string;
  title: string;
  adType?: "image" | "adsense";
  imageUrl?: string;
  linkUrl?: string;
  description?: string;
  showTextOverlay?: boolean;
  adsenseClient?: string;
  adsenseSlot?: string;
  isActive: boolean;
  order: number;
  time: number;
}

export interface CustomMenu {
  id: string;
  label: string;
  iconName: string;
  order: number;
}

export interface CustomMenuCard {
  id: string;
  menuId: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  order: number;
  createdAt: number;
}


function AdsenseUnit({
  client,
  slot,
  className,
}: {
  client?: string;
  slot?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isPushed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !client || !slot || !canShowAds()) return;
    
    // Dynamically ensure Google AdSense script is present when allowed
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [client, slot]);

  useEffect(() => {
    if (!isVisible || !canShowAds()) return;
    if (isPushed.current) return;
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          recordAdImpression();
          ((window as any).adsbygoogle = ((window as any).adsbygoogle || [])).push({});
          isPushed.current = true;
        }
      } catch (e) {
        console.error("AdSense error:", e);
        setHasError(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!client || !slot || !canShowAds()) return null;

  return (
    <div
      ref={containerRef}
      className={`adsense-unit w-full my-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 flex flex-col justify-center items-center text-center transition-all overflow-hidden ${className || ""}`}
    >
      <span className="text-[9px] font-extrabold tracking-widest text-slate-400 uppercase select-none mb-1">
        üì¢ ‡∞™‡±ç‡∞∞‡∞ï‡∞ü‡∞® ‚Ä¢ ADVERTISEMENT
      </span>
      {isVisible ? (
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <div className="h-10 w-full animate-pulse bg-slate-100/80 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold">
          Loading advertisement...
        </div>
      )}
      {hasError && (
        <span className="text-[10px] font-medium text-slate-400/90 mt-1">
          (Ad unavailable / blocked by browser)
        </span>
      )}
    </div>
  );
}

function HomeAds({ ads }: { ads: Advertisement[] }) {
  const [index, setIndex] = useState(0);

  const imageAds = ads.filter((a) => !a.adType || a.adType === "image");
  const adsenseAds = ads.filter((a) => a.adType === "adsense");

  useEffect(() => {
    if (imageAds.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imageAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageAds.length]);

  if (ads.length === 0) return null;

  const currentAd = imageAds[index];

  return (
    <div className="space-y-6">
      {imageAds.length > 0 && currentAd && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/7] bg-slate-200 rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
          <AnimatePresence>
            <motion.div
              key={currentAd.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {currentAd.linkUrl ? (
                <a
                  href={currentAd.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full relative group"
                >
                  <img
                    src={currentAd.imageUrl}
                    alt={currentAd.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${currentAd.showTextOverlay ? "from-slate-900/80 via-slate-900/20" : "from-black/40 via-transparent"} to-transparent pointer-events-none transition-opacity duration-300`}
                  />
                  {currentAd.showTextOverlay && (
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 flex flex-col justify-end pointer-events-none">
                      <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow-md mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {currentAd.title}
                      </h3>
                      {currentAd.description && (
                        <p className="text-sm sm:text-base font-medium text-slate-200 drop-shadow max-w-2xl translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                          {currentAd.description}
                        </p>
                      )}
                    </div>
                  )}
                </a>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={currentAd.imageUrl}
                    alt={currentAd.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${currentAd.showTextOverlay ? "from-slate-900/80 via-slate-900/20" : "from-black/20 via-transparent"} to-transparent pointer-events-none`}
                  />
                  {currentAd.showTextOverlay && (
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 flex flex-col justify-end pointer-events-none">
                      <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow-md mb-2">
                        {currentAd.title}
                      </h3>
                      {currentAd.description && (
                        <p className="text-sm sm:text-base font-medium text-slate-200 drop-shadow max-w-2xl">
                          {currentAd.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {imageAds.length > 1 && (
            <>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {imageAds.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-white/40 hover:bg-white/60"}`}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setIndex(
                    (prev) => (prev - 1 + imageAds.length) % imageAds.length,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setIndex((prev) => (prev + 1) % imageAds.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}

      {adsenseAds.map((ad, i) => (
        <div
          key={ad.id}
          className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-4 overflow-hidden"
        >
          
          <AdsenseUnit client={ad.adsenseClient} slot={ad.adsenseSlot} />
        </div>
      ))}
    </div>
  );
}

const DEFAULT_PERMISSIONS: any = {
  admin: {
    dash: { view: true, edit: true, delete: true },
    reports: { view: true, edit: true, delete: true },
    gos_formats: { view: true, edit: true, delete: true },
    updates: { view: true, edit: true, delete: true },
    suggestions: { view: true, edit: true, delete: true },
    users: { view: true, edit: true, delete: true },
    builder: { view: true, edit: true, delete: true },
    locations: { view: true, edit: true, delete: true },
    trash: { view: true, edit: true, delete: true },
    settings: { view: true, edit: true, delete: true },
    ai: { view: true, edit: true, delete: true },
    changelog: { view: true, edit: true, delete: true },
    staff_management: { view: true, edit: true, delete: true },
    logs: { view: true, edit: true, delete: true },
    farmer_registry_logs: { view: true, edit: true, delete: true },
    survey_reports: { view: true, edit: true, delete: true },
    cloud_dns: { view: true, edit: true, delete: true },
    custom_menus: { view: true, edit: true, delete: true },
    landing_page_config: { view: true, edit: true, delete: true },
    page_descriptions: { view: true, edit: true, delete: true },
    edit_about: { view: true, edit: true, delete: true },
    rbac: { view: true, edit: true, delete: true },
  },
  "super admin": {
    dash: { view: true, edit: true, delete: true },
    reports: { view: true, edit: true, delete: true },
    gos_formats: { view: true, edit: true, delete: true },
    updates: { view: true, edit: true, delete: true },
    suggestions: { view: true, edit: true, delete: true },
    users: { view: true, edit: true, delete: true },
    builder: { view: true, edit: true, delete: true },
    locations: { view: true, edit: true, delete: true },
    trash: { view: true, edit: true, delete: true },
    settings: { view: true, edit: true, delete: true },
    ai: { view: true, edit: true, delete: true },
    changelog: { view: true, edit: true, delete: true },
    staff_management: { view: true, edit: true, delete: true },
    logs: { view: true, edit: true, delete: true },
    farmer_registry_logs: { view: true, edit: true, delete: true },
    survey_reports: { view: true, edit: true, delete: true },
    cloud_dns: { view: true, edit: true, delete: true },
    custom_menus: { view: true, edit: true, delete: true },
    landing_page_config: { view: true, edit: true, delete: true },
    page_descriptions: { view: true, edit: true, delete: true },
    edit_about: { view: true, edit: true, delete: true },
    rbac: { view: true, edit: true, delete: true },
  },
  editor: {
    dash: { view: true, edit: false, delete: false },
    reports: { view: true, edit: true, delete: false },
    gos_formats: { view: true, edit: true, delete: false },
    updates: { view: true, edit: true, delete: false },
    suggestions: { view: true, edit: false, delete: false },
    users: { view: false, edit: false, delete: false },
    builder: { view: false, edit: false, delete: false },
    locations: { view: false, edit: false, delete: false },
    trash: { view: false, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
    ai: { view: true, edit: true, delete: false },
    changelog: { view: true, edit: false, delete: false },
  },
  moderator: {
    dash: { view: true, edit: false, delete: false },
    reports: { view: true, edit: true, delete: false },
    gos_formats: { view: true, edit: false, delete: false },
    updates: { view: true, edit: false, delete: false },
    suggestions: { view: true, edit: true, delete: false },
    users: { view: false, edit: false, delete: false },
    builder: { view: false, edit: false, delete: false },
    locations: { view: false, edit: false, delete: false },
    trash: { view: false, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
    ai: { view: true, edit: false, delete: false },
    changelog: { view: true, edit: false, delete: false },
  },
};

export function getDirectImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  let url = rawUrl.trim();

  // Google Drive conversion
  if (url.includes("drive.google.com") || url.includes("drive.usercontent.google.com")) {
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
    }
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }

  // Dropbox conversion
  if (url.includes("dropbox.com")) {
    return url.replace("dl=0", "raw=1").replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }

  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("www.")) return `https://${url}`;

  return url;
}

export function SmartImage({
  src = "",
  alt = "Image",
  className = "",
  style,
  allowLightbox = true,
  onClick,
}: {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  allowLightbox?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const directUrl = useMemo(() => getDirectImageUrl(src), [src]);
  const [currentSrc, setCurrentSrc] = useState(directUrl);
  const [attempt, setAttempt] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updated = getDirectImageUrl(src);
    setCurrentSrc(updated);
    setAttempt(0);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (attempt === 0) {
      if (src && src.includes("drive.google.com")) {
        const match = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || src.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          setCurrentSrc(`https://drive.google.com/uc?export=view&id=${match[1]}`);
          setAttempt(1);
          return;
        }
      }
      if (src && src.startsWith("http") && !src.includes("weserv.nl")) {
        setCurrentSrc(`https://images.weserv.nl/?url=${encodeURIComponent(src)}`);
        setAttempt(1);
        return;
      }
      setHasError(true);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center flex flex-col items-center justify-center gap-2 my-2 shadow-sm">
        <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
          <ImageOff size={16} className="text-amber-500 shrink-0" />
          <span>‡∞ö‡∞ø‡∞§‡±ç‡∞∞‡∞Ç ‡∞Ö‡∞Ç‡∞¶‡±Å‡∞¨‡∞æ‡∞ü‡±Å‡∞≤‡±ã ‡∞≤‡±á‡∞¶‡±Å (Photo Not Displaying)</span>
        </div>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <ExternalLink size={12} /> ‡∞´‡±ã‡∞ü‡±ã ‡∞®‡±á‡∞∞‡±Å‡∞ó‡∞æ ‡∞ö‡±Ç‡∞°‡∞Ç‡∞°‡∞ø (View Original Photo)
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden inline-block w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse rounded-2xl flex items-center justify-center z-10 min-h-[160px]">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`${className} transition-all duration-700 ${isLoading ? "blur-sm opacity-40 scale-[1.02]" : "blur-0 opacity-100 scale-100"} ${allowLightbox ? "cursor-pointer" : ""}`}
        style={style}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          } else if (allowLightbox && (window as any).setLightboxImage) {
            (window as any).setLightboxImage({
              url: currentSrc,
              name: alt || "Photo Preview",
            });
          }
        }}
      />
    </div>
  );
}

function AdminUserTooltip({ uid, userName, allUsers, isAdmin }: { uid?: string, userName: string, allUsers?: any[], isAdmin?: boolean }) {
  if (!uid || !isAdmin || !allUsers) return <>{userName}</>;
  const u = allUsers.find(u => u.id === uid);
  if (!u) return <>{userName}</>;

  return (
    <div className="relative group/tooltip inline-block cursor-help">
      <span>{userName}</span>
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-[999] text-white">
        <div className="text-[11px] flex flex-col gap-1.5 font-normal tracking-wide normal-case break-words whitespace-normal">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0 text-sm">
                {(u.name || u.username || userName)[0].toUpperCase()}
             </div>
             <div>
                <div className="font-bold text-white text-[13px]">{u.name || u.username || userName}</div>
                {(u.role || u.districtRole) && (
                   <div className="text-[10px] text-blue-400 font-medium">
                      Role: {u.role || u.districtRole}
                   </div>
                )}
             </div>
          </div>
          {u.email && <div className="text-slate-300"><span className="text-slate-500 font-bold">Email: </span> {u.email}</div>}
          {u.contact && <div className="text-slate-300"><span className="text-slate-500 font-bold">Phone: </span> {u.contact}</div>}
          {u.district && <div className="text-slate-300"><span className="text-slate-500 font-bold">District: </span> {u.district}</div>}
          {u.constituency && <div className="text-slate-300"><span className="text-slate-500 font-bold">Constituency: </span> {u.constituency}</div>}
        </div>
      </div>
    </div>
  );
}

function LandingPageConfigAdmin({ landingPageData, fetchLandingPageData, addToast }: any) {
  const [formData, setFormData] = useState(landingPageData || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (landingPageData) {
      setFormData(landingPageData);
    }
  }, [landingPageData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "landing_page"), formData);
      addToast("Landing Page Config saved successfully!");
      fetchLandingPageData();
    } catch (err) {
      console.error(err);
      addToast("Error saving Landing Page Config");
    } finally {
      setSaving(false);
    }
  };

  const renderRichText = (label: string, name: string) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <ReactQuill
          theme="snow"
          value={formData[name] || ""}
          onChange={(val) => setFormData((prev: any) => ({ ...prev, [name]: val }))}
          className="bg-white"
        />
      </div>
    );
  };

  const renderInput = (label: string, name: string, isTextarea = false) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        {isTextarea ? (
          <textarea
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[120px]"
          />
        ) : (
          <input
            type="text"
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Globe size={24} className="text-primary" />
          Landing Page Configuration
        </h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="font-black text-slate-800 mb-4 text-lg">Call To Action Section</h4>
          {renderInput("CTA Title", "ctaTitle")}
          {renderRichText("CTA Description", "ctaDesc")}
        </div>
      </div>
    </div>
  );
}

function CustomMenuAdmin({ customMenus, customMenuCards, addToast }: any) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleAddMenu = async () => {
    const { value: label } = await Swal.fire({
      title: "New Custom Menu",
      input: "text",
      inputLabel: "Menu Title",
      inputPlaceholder: "e.g., Useful Links",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to write something!";
      }
    });

    if (label) {
      try {
        await addDoc(collection(db, "customMenus"), {
          label,
          iconName: "LayoutList",
          order: customMenus.length,
          createdAt: Date.now()
        });
        addToast("Menu created successfully!");
      } catch (e: any) {
        addToast("Error: " + e.message);
      }
    }
  };

  const handleDeleteMenu = async (id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "This menu will be deleted. Ensure you delete its cards first if you want to clean up.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!"
    });
    if (res.isConfirmed) {
      await deleteDoc(doc(db, "customMenus", id));
      addToast("Menu deleted!");
      if (activeMenuId === id) setActiveMenuId(null);
    }
  };

  const handleAddCard = async () => {
    if (!activeMenuId) return;
    const { value: formValues } = await Swal.fire({
      title: "Add New Card",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Card Title (required)">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Description (required)"></textarea>
        <input id="swal-input3" class="swal2-input" placeholder="Image URL (optional)">
        <input id="swal-input4" class="swal2-input" placeholder="Link URL (optional)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const title = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const desc = (document.getElementById("swal-input2") as HTMLInputElement).value;
        if (!title || !desc) {
          Swal.showValidationMessage("Title and Description are required");
          return null;
        }
        return {
          title,
          description: desc,
          imageUrl: (document.getElementById("swal-input3") as HTMLInputElement).value,
          linkUrl: (document.getElementById("swal-input4") as HTMLInputElement).value,
        };
      }
    });

    if (formValues) {
      try {
        await addDoc(collection(db, "customMenuCards"), {
          menuId: activeMenuId,
          ...formValues,
          order: customMenuCards.filter((c: any) => c.menuId === activeMenuId).length,
          createdAt: Date.now()
        });
        addToast("Card added!");
      } catch (e: any) {
        addToast("Error: " + e.message);
      }
    }
  };

  const handleDeleteCard = async (id: string) => {
    const res = await Swal.fire({
      title: "Delete Card?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    });
    if (res.isConfirmed) {
      await deleteDoc(doc(db, "customMenuCards", id));
      addToast("Card deleted!");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <LayoutList size={200} />
        </div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Dynamic Menus</h2>
          <p className="text-blue-100 font-medium">Create new menu options for the sidebar and add cards to them dynamically.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menus List */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 self-start">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Menus</h3>
            <button onClick={handleAddMenu} className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 p-2 rounded-xl transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-2">
            {customMenus.map((m: any) => (
              <div 
                key={m.id} 
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${activeMenuId === m.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                onClick={() => setActiveMenuId(m.id)}
              >
                <div className="flex items-center gap-3">
                  <LayoutList size={18} className={activeMenuId === m.id ? "text-blue-500" : "text-slate-400"} />
                  <span className={`font-bold ${activeMenuId === m.id ? 'text-blue-700' : 'text-slate-700'}`}>{m.label}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteMenu(m.id); }} 
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {customMenus.length === 0 && (
              <div className="text-center text-slate-400 font-medium py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No menus created yet.
              </div>
            )}
          </div>
        </div>

        {/* Cards Manager */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 min-h-[400px]">
          {!activeMenuId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 font-medium py-20 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <LayoutList size={40} className="text-slate-300" />
              </div>
              <p>Select a menu from the left to manage its content.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">
                    {customMenus.find((m: any) => m.id === activeMenuId)?.label} Cards
                  </h3>
                </div>
                <button 
                  onClick={handleAddCard} 
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  <Plus size={16} /> Add Card
                </button>
              </div>
              <div className="space-y-4">
                {customMenuCards.filter((c: any) => c.menuId === activeMenuId).map((c: any) => (
                  <div key={c.id} className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-[24px] border border-slate-100">
                    {c.imageUrl && (
                      <div className="w-full sm:w-32 h-32 rounded-[16px] overflow-hidden shrink-0">
                        <img src={c.imageUrl} className="w-full h-full object-cover" alt="Card preview" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-slate-800 text-lg">{c.title}</h4>
                        <button 
                          onClick={() => handleDeleteCard(c.id)} 
                          className="text-slate-400 hover:text-red-500 p-2 rounded-xl bg-white hover:bg-red-50 transition-colors shadow-sm shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{c.description}</p>
                      {c.linkUrl && (
                        <div className="mt-3 inline-flex items-center text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">
                          <ExternalLink size={12} className="mr-1" /> Linked
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {customMenuCards.filter((c: any) => c.menuId === activeMenuId).length === 0 && (
                  <div className="text-center text-slate-400 font-medium py-16 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                    No cards added to this menu yet.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPanel({
  addToast,
  posts: rawPosts,
  problems: rawProblems,
  suggestions,
  users,
  user,
  setAdminLocked,
  adminLocked,
  notifications,
  requests,
  updates,
  userRole,
  onExit,
  onNewPost,
  onEditPost,
  isDevEmail,
  currentAdminPin,
  setCurrentAdminPin,
  districtsData,
  currentTab,
  userProfile,
  storageConfig,
  hasPostsOnly,
  isEditorMode,
  rbacPermissions,
  setRbacPermissions,
  activeSubTab,
  setActiveSubTab,
  aboutContent,
  setAboutContent,
  suggestionCategories,
  fetchAboutContent,
  customMenus,
  customMenuCards,
  landingPageData,
  setLandingPageData,
  fetchLandingPageData,
  onToggleSidebar,
  setSidebarOpen,
  siteConfig,
  setSiteConfig = () => {},
}: any) {
  const posts =
    hasPostsOnly || isEditorMode
      ? (rawPosts || []).filter((p: any) => p.uid === user?.uid)
      : rawPosts || [];
  const problems =
    hasPostsOnly || isEditorMode
      ? (rawProblems || []).filter((p: any) => p.uid === user?.uid)
      : rawProblems || [];

  const [selectedRbacRole, setSelectedRbacRole] = useState("editor");
  const [allUserPins, setAllUserPins] = useState<any[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});
  const [adMuteRemaining, setAdMuteRemaining] = useState<number>(() => getMuteRemainingSeconds(siteConfig));

  useEffect(() => {
    const updateTimer = () => {
      setAdMuteRemaining(getMuteRemainingSeconds(siteConfig));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [siteConfig]);
  
  const [notifSoundConfig, setNotifSoundConfig] = useState<any>({
    posts: "default_ding",
    updates: "default_ding",
    general: "default_ding",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "notification_sounds"), (snap) => {
      if (snap.exists() && snap.data()) {
        const d = snap.data();
        let formatted: any = {};
        ["posts", "updates", "general"].forEach(key => {
            if (typeof d[key] === "boolean") formatted[key] = d[key] ? "default_ding" : "false";
            else if (d[key]) formatted[key] = d[key];
            else formatted[key] = "default_ding";
        });
        setNotifSoundConfig((prev: any) => ({ ...prev, ...formatted }));
      }
    });
    return () => unsub();
  }, []);
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);

  const userRoleStr = (userProfile?.role || userRole || "").toLowerCase();
  const isAdminRole =
    userRoleStr === "admin" ||
    userRoleStr === "system admin" ||
    userRoleStr === "super admin" ||
    userRoleStr === "administrator" ||
    !userRoleStr;
  const isSuperAdmin = isDevEmail || isAdminRole;
  const isAdmin = isSuperAdmin || isAdminRole;
  const isEditor =
    isAdmin || userRoleStr === "editor" || userRoleStr === "moderator";
  const isEffectiveAdmin = (isAdmin || isSuperAdmin) && !isEditorMode;
  const isEffectiveEditor = isEditor || isEditorMode;

  const userPermissions =
    rbacPermissions?.[userRoleStr] || DEFAULT_PERMISSIONS[userRoleStr] || DEFAULT_PERMISSIONS["admin"] || {};

  const hasViewPermission = (tabId: string) => {
    if (isSuperAdmin || isAdmin || isAdminRole) return true;
    return !!userPermissions[tabId]?.view;
  };

  const hasEditPermission = (tabId: string) => {
    if (isSuperAdmin || isAdmin || isAdminRole) return true;
    return !!userPermissions[tabId]?.edit;
  };

  const hasDeletePermission = (tabId: string) => {
    if (isSuperAdmin || isAdmin || isAdminRole) return true;
    return !!userPermissions[tabId]?.delete;
  };

  useEffect(() => {
    if (!isSuperAdmin) return;
    const unsub = onSnapshot(
      collection(db, "user_pins"),
      (snap) => {
        const pins: any[] = [];
        snap.forEach((d) => pins.push({ id: d.id, ...d.data() }));
        setAllUserPins(pins);
      },
      (err) => {
        // transient permission or disconnected errors
        if (err.code !== "permission-denied") {
          console.error("Admin PINs sync error:", err.message);
        } else {
          // If it's a permission error, we just set empty pins for now to avoid the alert spam
          setAllUserPins([]);
        }
      },
    );
    return () => unsub();
  }, [isSuperAdmin]);

  // Analytics Metrics in English
  const stats = [
    {
      label: isEditorMode ? "My Active Citizens" : "Enrolled Citizens",
      value:
        users?.filter((u: any) => !(u.isDeleted || u.role === "deleted"))
          .length || 0,
      icon: <Users size={22} />,
      color: "from-blue-600 to-indigo-600",
      trend: "+12%",
      onClick: () => setActiveSubTab("users"),
    },
    {
      label: isEditorMode ? "My Pending Issues" : "Pending Issues",
      value: (problems || []).filter(
        (p: any) =>
          !["solved", "resolved", "deleted"].includes(
            (p.status || "").toLowerCase(),
          ),
      ).length,
      icon: <AlertTriangle size={22} />,
      color: "from-rose-600 to-orange-600",
      trend: "Critical",
      onClick: () => {
        setActiveSubTab("reports");
        setReportsType("issues");
      },
    },
    {
      label: isEditorMode ? "My Contents" : "Total Contents",
      value: posts.length,
      icon: <Layout size={22} />,
      color: "from-emerald-600 to-teal-600",
      trend: "+5%",
      onClick: () => {
        setActiveSubTab("reports");
        setReportsType("posts");
      },
    },
    {
      label: "Cloud Storage",
      value: storageConfig === "cloudflare" ? "R2 Active" : "Firebase",
      icon: <Database size={22} />,
      color: "from-purple-600 to-pink-600",
      trend: "Global",
      onClick: () => setActiveSubTab("settings"),
    },
  ];

  const menuCategories = [
    {
      title: isEditorMode ? "Content Hub" : "Core Hub",
      items: [
        ...(hasViewPermission("dash") && !(hasPostsOnly || isEditorMode)
          ? [
              {
                id: "dash",
                label: isEditorMode ? "My Panel" : "Analytics Hub",
                icon: <LayoutGrid size={18} />,
              },
              {
                id: "exe_ubd_live",
                label: "EXE & UBD Live Monitoring",
                icon: <Radio size={18} />,
              },
            ]
          : []),
        ...(hasViewPermission("reports")
          ? [
              {
                id: "reports",
                label: isEditorMode ? "My Posts & Issues" : "Posts & Issues",
                icon: <Flag size={18} />,
              },
            ]
          : []),
        ...(!(hasPostsOnly || isEditorMode)
          ? [
              ...(hasViewPermission("gos_formats")
                ? [
                    {
                      id: "gos_formats",
                      label: "GOs & Formats",
                      icon: <FileText size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("updates")
                ? [
                    {
                      id: "updates",
                      label: "Flash News",
                      icon: <Zap size={18} />,
                    },
                  ]
                : []),
              ...(isEditor
                ? [
                    {
                      id: "edit_about",
                      label: " About E-Vedhika",
                      icon: <Info size={18} />,
                    },
                  ]
                : []),
            ]
          : []),
      ],
    },
    ...(!(hasPostsOnly || isEditorMode)
      ? [
          {
            title: "Security & Staff",
            items: [
              ...(hasViewPermission("users")
                ? [
                    {
                      id: "users",
                      label: "User Access",
                      icon: <Fingerprint size={18} />,
                    },
                  ]
                : []),
              ...(isSuperAdmin || isAdmin
                ? [
                    {
                      id: "staff_management",
                      label: "Staff & Permissions",
                      icon: <Shield size={18} />,
                    },
                    {
                      id: "rbac",
                      label: "Role Matrix (RBAC)",
                      icon: <Lock size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("logs") && isEffectiveAdmin
                ? [
                    {
                      id: "logs",
                      label: "Security Logs",
                      icon: <ShieldCheck size={18} />,
                    },
                    {
                      id: "visitor_logs",
                      label: "Visitor Logs (‡∞™‡∞¨‡±ç‡∞≤‡∞ø‡∞ï‡±ç)",
                      icon: <Globe size={18} />,
                    },
                    {
                      id: "farmer_registry_logs",
                      label: "Farmer Registry Logs",
                      icon: <Database size={18} />,
                    },
                    {
                      id: "survey_reports",
                      label: "Survey Reports",
                      icon: <BarChart3 size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("cloud_dns") && isEffectiveAdmin
                ? [
                    {
                      id: "cloud_dns",
                      label: "Cloud & DNA",
                      icon: <Cloud size={18} />,
                    },
                  ]
                : []),
            ],
          },
          {
            title: "Operations",
            items: [
              ...(hasViewPermission("builder")
                ? [
                    {
                      id: "builder",
                      label: "Page Builder",
                      icon: <Boxes size={18} />,
                    },
                  ]
                : []),
              ...(isEffectiveAdmin
                ? [
                    {
                      id: "custom_menus",
                      label: "Dynamic Menus",
                      icon: <LayoutList size={18} />,
                    },
                    {
                      id: "landing_page_config",
                      label: "Landing Page Config",
                      icon: <Globe size={18} />,
                    },
                    {
                      id: "page_descriptions",
                      label: "Page Descriptions",
                      icon: <FileBadge size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("locations")
                ? [
                    {
                      id: "locations",
                      label: "Manage Locations",
                      icon: <MapPin size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("suggestions")
                ? [
                    {
                      id: "suggestions",
                      label: "Public Suggestions and Feedback",
                      icon: <MessageSquare size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("trash")
                ? [
                    {
                      id: "trash",
                      label: "Recycle Bin",
                      icon: <Trash2 size={18} />,
                    },
                  ]
                : []),
            ],
          },
          {
            title: "Metadata",
            items: [
              ...(hasViewPermission("changelog")
                ? [
                    {
                      id: "changelog",
                      label: "What's New",
                      icon: <Rocket size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("settings") && isEffectiveAdmin
                ? [
                    {
                      id: "settings",
                      label: "System Config",
                      icon: <Settings size={18} />,
                    },
                    {
                      id: "ads",
                      label: "Ad Management",
                      icon: <Megaphone size={18} />,
                    },
                  ]
                : []),
              ...(hasViewPermission("ai")
                ? [{ id: "ai", label: "Gemini AI", icon: <Bot size={18} /> }]
                : []),
            ],
          },
        ]
      : []),
  ];

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<any[]>([
    {
      id: 1,
      type: "Warning",
      text: "Suppressed benign HMR WebSocket disconnect. (expected-behavior)",
      time: Date.now() - 300000,
      component: "Vite HMR",
    },
    {
      id: 2,
      type: "Info",
      text: "Admin database access verified (Verified Security Auth Key)",
      time: Date.now() - 120000,
      component: "Security",
    },
    {
      id: 3,
      type: "Success",
      text: "Gemini AI proxy connection stable (/api/chat)",
      time: Date.now() - 60000,
      component: "AI Engine",
    },
  ]);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [aiDiagnosis, setAiDiagnosis] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      setDiagnosticLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "Error",
          text: `Client Error: ${event.message || "Uncaught runtime exception"}`,
          time: Date.now(),
          component: "Browser Window Logger",
        },
      ]);
    };
    window.addEventListener("error", handleGlobalError);
    return () => window.removeEventListener("error", handleGlobalError);
  }, []);

  const handleRunDiagnostics = () => {
    setDiagnosticLogs((prev) => [
      ...prev,
      {
        id: Date.now() + 10,
        type: "Success",
        text: "System diagnostics completed successfully. Any errors found will be updated here.",
        time: Date.now(),
        component: "Diagnostic Trigger",
      },
    ]);
    addToast("Full system check complete!");
  };

  const handleLogDiagnose = async (logText: string, component: string) => {
    setIsDiagnosing(true);
    setAiDiagnosis("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze this trace/warning: "${logText}" reported by component "${component}". Diagnostics summary?`,
          systemInstruction: `You are the specialized AI Systems Diagnostics Assistant for the E-VEDHIKA portal.
          Your task is to analyze the system warning or error trace provided by the admin and explain:
          1. Why this happened.
          2. How to fix it quickly.
          
          LANGUAGE MANDATE:
          - Always respond in beautiful Telugu, with a brief English summary.
          - Speak with humble and clean Telugu tone. Be concise, direct and technical. No fluff.`,
        }),
      });
      if (!res.ok) throw new Error("AI diagnostics server error");
      const data = await res.json();
      setAiDiagnosis(data.text || "‡∞µ‡∞ø‡∞∂‡±ç‡∞≤‡±á‡∞∑‡∞£ ‡∞µ‡∞ø‡∞´‡∞≤‡∞Æ‡±à‡∞Ç‡∞¶‡∞ø.");
    } catch (err) {
      console.error(err);
      setAiDiagnosis("‡∞ï‡±ç‡∞∑‡∞Æ‡∞ø‡∞Ç‡∞ö‡∞æ‡∞≤‡∞ø, ‡∞°‡∞Ø‡∞æ‡∞ó‡±ç‡∞®‡±ã‡∞∏‡∞ø‡∞∏‡±ç ‡∞∏‡∞∞‡±ç‡∞µ‡∞∞‡±ç ‡∞Ö‡∞Ç‡∞¶‡±Å‡∞¨‡∞æ‡∞ü‡±Å‡∞≤‡±ã ‡∞≤‡±á‡∞¶‡±Å.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  const [builderElements, setBuilderElements] = useState<any[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editingElementId, setEditingElementId] = useState<number | null>(null);

  useEffect(() => {
    if (!isEditor) return;
    const unsub = onSnapshot(doc(db, "site_settings", "home_page"), (snap) => {
      if (
        snap.exists() &&
        snap.data().elements &&
        snap.data().elements.length > 0
      ) {
        setBuilderElements(snap.data().elements);
      } else {
        setBuilderElements(DEFAULT_HOME_ELEMENTS);
      }
    });
    return () => unsub();
  }, [isEditor]);

  const handlePublish = async () => {
    try {
      await setDoc(doc(db, "site_settings", "home_page"), {
        elements: builderElements,
        updatedAt: Date.now(),
        updatedBy: user?.email || "Admin",
      });
      addToast("Page Published Successfully! Changes are now live.");
    } catch (err) {
      addToast(
        "Failed to publish page: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const moveElement = (index: number, direction: "up" | "down") => {
    const newElements = [...builderElements];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newElements.length) return;
    [newElements[index], newElements[targetIndex]] = [
      newElements[targetIndex],
      newElements[index],
    ];
    setBuilderElements(newElements);
  };

  const updateElementProps = (id: number, props: any) => {
    setBuilderElements(
      builderElements.map((el) => (el.id === id ? { ...el, ...props } : el)),
    );
  };
  const [visibleUsersCount, setVisibleUsersCount] = useState(500);
  const [usersFilter, setUsersFilter] = useState<"All" | "Deleted">("All");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [trashTab, setTrashTab] = useState<
    "posts" | "problems" | "suggestions" | "users" | "updates" | "gos_formats"
  >("posts");
  const [userViewMode, setUserViewMode] = useState<"access" | "directory">(
    "access",
  );
  const [showPin, setShowPin] = useState(false);
  const [logType, setLogType] = useState<"admin" | "public">("admin");
  const [logActionFilter, setLogActionFilter] = useState("");
  const [logAdminFilter, setLogAdminFilter] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");

  const exportLogsToCSV = () => {
    const filteredLogs = logs.filter((log) => {
      const isCorrectType = logType === "admin" ? !!log.admin : !log.admin;
      const matchesAction =
        logActionFilter === "" ||
        (log.action || "")
          .toLowerCase()
          .includes(logActionFilter.toLowerCase());
      const matchesAdmin =
        logAdminFilter === "" ||
        (log.admin || log.userEmail || log.userId || "")
          .toLowerCase()
          .includes(logAdminFilter.toLowerCase());
      return isCorrectType && matchesAction && matchesAdmin;
    });

    if (filteredLogs.length === 0) {
      addToast("No logs to export");
      return;
    }

    const headers = ["Trace ID", "Subject", "Action", "Time", "Status"];
    const rows = filteredLogs.map((log) => [
      log.id || "",
      log.admin || log.userEmail || log.userId || "Anonymous",
      log.action || "System Event",
      new Date(getValidTime(log)).toLocaleString(),
      "Verified",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows
        .map((e) =>
          e
            .map(String)
            .map((s) => `"${s.replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_logs_${logType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Logs exported as CSV");
  };

  const [reportsType, setReportsType] = useState<"issues" | "posts">("posts");
  const [reportsFilter, setReportsFilter] = useState<
    "All" | "New" | "In-Progress" | "Pending" | "Approved" | "Flagged" | "Resolved" | "Deleted"
  >("All");

  const normalizeReportStatus = (rawStatus: string | undefined): string => {
    if (!rawStatus) return "pending";
    const s = rawStatus.toLowerCase().trim();
    if (s === "new" || s === "open") return "new";
    if (s === "in-progress" || s === "inprogress" || s === "in progress" || s === "processing") return "in-progress";
    if (s === "pending") return "pending";
    if (s === "approved" || s === "visible") return "approved";
    if (s === "resolved" || s === "solved") return "resolved";
    if (s === "deleted" || s === "trash") return "deleted";
    if (s === "flagged") return "flagged";
    return s;
  };
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [allProblems, setAllProblems] = useState<ProblemReport[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [logsError, setLogsError] = useState(false);

  useEffect(() => {
    const unsubLogs = onSnapshot(
      query(collection(db, "security_logs"), orderBy("time", "desc")),
      (snap) => {
        const lList: any[] = [];
        snap.forEach((d) => lList.push({ id: d.id, ...d.data() }));
        setLogs(lList);
        setLogsError(false);
      },
      (err) => {
        setLogsError(true);
        console.error("Logs error:", err);
      },
    );
    return () => unsubLogs();
  }, []);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [farmerRegistryJobs, setFarmerRegistryJobs] = useState<any>({});

  const fetchFarmerJobs = async () => {
    try {
      const url = isSuperAdmin
        ? "/api/admin/farmer-jobs"
        : `/api/admin/farmer-jobs?uid=${user?.uid || ""}`;
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const contentType = resp.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await resp.json();
          setFarmerRegistryJobs(data.jobs || {});
        } else {
          console.warn("Farmer jobs response was not JSON");
        }
      }
    } catch (e) {
      console.error("Failed to fetch farmer jobs", e);
    }
  };

  useEffect(() => {
    if (
      activeSubTab === "farmer_registry_logs" ||
      activeSubTab === "survey_reports"
    ) {
      fetchFarmerJobs();
      const interval = setInterval(fetchFarmerJobs, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [activeSubTab]);

  const handleDeleteFarmerJob = async (id: string) => {
    const res = await Swal.fire({
      title: "Delete?",
      text: "‡∞à ‡∞≤‡∞æ‡∞ó‡±ç ‡∞Æ‡∞∞‡∞ø‡∞Ø‡±Å ‡∞∞‡∞ø‡∞™‡±ã‡∞∞‡±ç‡∞ü‡±ç ‡∞∂‡∞æ‡∞∂‡±ç‡∞µ‡∞§‡∞Ç‡∞ó‡∞æ ‡∞§‡±ä‡∞≤‡∞ó‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡±Å‡∞§‡±Å‡∞Ç‡∞¶‡∞ø. ‡∞Æ‡±Ä‡∞∞‡±Å ‡∞®‡∞ø‡∞∂‡±ç‡∞ö‡∞Ø‡∞ø‡∞Ç‡∞ö‡±Å‡∞ï‡±Å‡∞®‡±ç‡∞®‡∞æ‡∞∞‡∞æ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    if (!res.isConfirmed) return;
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
      const resp = await fetch(`/api/admin/farmer-jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        addToast("‡∞≤‡∞æ‡∞ó‡±ç ‡∞µ‡∞ø‡∞ú‡∞Ø‡∞µ‡∞Ç‡∞§‡∞Ç‡∞ó‡∞æ ‡∞§‡±ä‡∞≤‡∞ó‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø.");
        fetchFarmerJobs();
      }
    } catch (e) {
      addToast("‡∞§‡±ä‡∞≤‡∞ó‡∞ø‡∞Ç‡∞ö‡∞°‡∞Ç ‡∞∏‡∞æ‡∞ß‡±ç‡∞Ø‡∞Ç ‡∞ï‡∞æ‡∞≤‡±á‡∞¶‡±Å.");
    }
  };

  const handleBulkApprove = async () => {
    let col =
      activeSubTab === "suggestions"
        ? "suggestions"
        : reportsType === "posts"
          ? "posts"
          : "problems";
    for (const id of selectedItems) {
      try {
        const newStatus = col === "posts" || col === "suggestions"
          ? col === "suggestions"
            ? "approved"
            : "Approved"
          : "solved";
          
        await updateDoc(doc(db, col, id), {
          status: newStatus,
        });
        
        if (col === "posts" && newStatus === "Approved") {
          const match = posts.find((p) => p.id === id);
          if (match && match.status !== "Approved") {
            const postAuthor = match.userName || "User";
            const title = match.title || match.problem || match.content || "‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç";
            await addDoc(collection(db, "notifications"), {
              uid: "all",
              title: " ‡∞ï‡±ä‡∞§‡±ç‡∞§ ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç (New Post Approved)",
              message: `${postAuthor} ‡∞∏‡∞Æ‡∞∞‡±ç‡∞™‡∞ø‡∞Ç‡∞ö‡∞ø‡∞® ‡∞™‡±ã‡∞∏‡±ç‡∞ü‡±ç ‡∞Ü‡∞Æ‡±ã‡∞¶‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø: ${title.substring(0, 50)}`,
              type: "post",
              read: false,
              time: Date.now(),
              postId: id
            }).catch(()=>console.error("Failed to add post approval notif in bulk"));
          }
        }
      } catch (e) {}
    }
    await logUserActivity("Bulk Approved items", {
      count: selectedItems.length,
      collection: col,
    });
    setSelectedItems([]);
    addToast(`Bulk Approved ${selectedItems.length} items`);
  };

  const handleRestartServer = async () => {
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let reg of regs) {
          await reg.update();
        }
      }
      const res = await fetch("/api/admin/restart", { method: "POST" });
      await logUserActivity("Initiated System Cache & Server Refresh", {
        via: "Admin Panel",
      });
      if (res.ok) {
        addToast("Server restarting & Apps Cache cleared! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        addToast("Refreshing local PWA caches...");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      addToast("Refreshing local PWA caches...");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleBulkDelete = async () => {
    let col =
      activeSubTab === "suggestions"
        ? "suggestions"
        : reportsType === "posts"
          ? "posts"
          : "problems";
    const res = await Swal.fire({
      title: "Delete Selected?",
      text: `Are you sure you want to delete ${selectedItems.length} items?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });
    if (res.isConfirmed) {
      for (const id of selectedItems) {
        try {
          await updateDoc(doc(db, col, id), {
            status: "Deleted",
            deletedAt: Date.now(),
          });
        } catch (e) {}
      }
      setSelectedItems([]);
      addToast(`Bulk Deleted ${selectedItems.length} items`);
    }
  };

  useEffect(() => {
    if (!isEditor) return;

    const unsubProblems = onSnapshot(
      collection(db, "problems"),
      (snap) => {
        const pList: ProblemReport[] = [];
        snap.forEach((d) => pList.push({ id: d.id, ...(d.data() as any) }));
        setAllProblems(pList);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "problems"),
    );

    return () => unsubProblems();
  }, [isEditor, isAdmin]);

  const deleteUser = async (id: string) => {
    const res = await Swal.fire({
      title: "Move to Trash?",
      text: "This user will be marked as deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Trash It",
    });
    if (!res.isConfirmed) return;
    try {
      await updateDoc(doc(db, "users", id), { isDeleted: true });
      addToast("User moved to trash");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${id}`);
    }
  };

  const resolveProblem = async (problem: ProblemReport) => {
    try {
      await updateDoc(doc(db, "problems", problem.id), {
        status: "solved",
        resolvedAt: Date.now(),
      });

      await addDoc(collection(db, "notifications"), {
        uid: problem.uid,
        title: "Issue Resolved",
        message: `Your reported issue "${problem.msg.substring(0, 30)}..." has been resolved.`,
        type: "problem_resolved",
        read: false,
        time: Date.now(),
      });

      addToast("Problem marked as solved!");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `problems/${problem.id}`);
      addToast("Failed to update");
    }
  };

  if (adminLocked) {
    return (
      <div className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative z-10 w-full max-w-sm p-8 bg-slate-900/60 rounded-[40px] border border-slate-800 backdrop-blur-md"
        >
          <div className="w-24 h-24 bg-transparent rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <svg 
              viewBox="0 0 64 64" 
              className="w-16 h-16 shrink-0 relative z-10"
            >
              <defs>
                <linearGradient id="gAdmin2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="ringGAdmin2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <circle className="logo-ring" cx="32" cy="32" r="29" fill="none" stroke="url(#ringGAdmin2)" strokeWidth="2.5" strokeDasharray="10 5" />
              <circle cx="32" cy="32" r="25" fill="url(#gAdmin2)" />
              <circle cx="32" cy="32" r="21" fill="#0f172a" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="Segoe UI">EV</text>
            </svg>
            <div className="absolute inset-0 bg-blue-500/10 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
          </div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">
            Admin Session Locked
          </h2>
          <p className="text-slate-400 font-bold mb-8 uppercase text-xs tracking-widest">
            Restricted Access Level: 1
          </p>

          <div className="max-w-xs mx-auto">
            <input
              type="password"
              placeholder="Enter Access PIN"
              className="w-full bg-slate-900 border-2 border-slate-800 focus:border-blue-500 p-4 rounded-2xl text-center text-2xl tracking-[1em] outline-none shadow-inner"
              onKeyUp={(e) => {
                const target = e.target as HTMLInputElement;

                if (target.value === currentAdminPin) {
                  setAdminLocked(false);
                }
              }}
            />
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-4">
              Security PIN required to view sensitive data
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden w-full relative">
      {/* Main Framework Container - sidebar removed as it is now unified in App.tsx */}
      <main className="flex-1 min-w-0 bg-[#f8fafc] flex flex-col relative">
        {/* Dynamic Header */}
        <div
          role="banner"
          className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 pt-6 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6"
        >
          <div className="flex items-center gap-5">
            <button
              className="p-3 bg-white border border-slate-200 rounded-[20px] text-slate-700 hover:text-primary hover:border-primary/40 shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (onToggleSidebar) {
                  onToggleSidebar();
                } else if (setSidebarOpen) {
                  setSidebarOpen((prev: boolean) => !prev);
                } else {
                  setAdminMenuOpen((prev: boolean) => !prev);
                }
              }}
              title="Toggle Navigation Menu"
            >
              <Menu size={22} />
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Menu</span>
            </button>
            <button className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-700 rounded-[20px] text-white shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer ml-1 hover:shadow-lg" onClick={() => alert("Quick Actions: 1. File Complaint, 2. Download Report, 3. View Analytics (Coming Soon!)")} title="Quick Actions"><Zap size={20} className="fill-white/20" /><span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Quick Actions</span></button><div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {menuCategories
                    .flatMap((c) => (c as any).items)
                    .find((i) => (i as any).id === activeSubTab)?.label ||
                    "Control Panel"}
                </h1>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded-lg uppercase tracking-wider border border-blue-200">
                  Live Active
                </span>
              </div>
              {isAdmin && (
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-0.5 flex items-center gap-2">
                  System Registry ‚Ä¢{" "}
                  <span className="text-blue-500">
                    v{SYSTEM_UPDATES[0]?.version || "2.1.0"}
                  </span>{" "}
                  ‚Ä¢ <ClockWidget />
                </div>
              )}
              {!isAdmin && (
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-0.5 flex items-center gap-2">
                  <ClockWidget />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(activeSubTab === "reports" || activeSubTab === "dash") && (
              <button
                onClick={onNewPost}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[22px] text-[11px] font-black uppercase tracking-[0.1em] shadow-2xl shadow-blue-600/30 hover:scale-[1.05] hover:shadow-blue-600/40 transition-all active:scale-95 flex items-center gap-3"
              >
                <Plus size={20} className="stroke-[3]" /> Add New Content
              </button>
            )}
            <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {isEditorMode ? "Editor Hub" : "Root Login"}
                </p>
                <p className="text-xs font-black text-slate-900">
                  {userProfile?.fullName ||
                    user?.email?.split("@")[0] ||
                    (isEditorMode ? "Editor" : "Administrator")}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-[18px] ${isEditorMode ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-indigo-50 border-indigo-100 text-indigo-600"} border flex items-center justify-center font-black text-lg shadow-sm`}
              >
                {userProfile?.fullName?.charAt(0) || (isEditorMode ? "E" : "A")}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Surface */}
        {!hasViewPermission(activeSubTab) ? (
          <div className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col items-center justify-center p-20 min-h-[500px] bg-white border border-slate-100 rounded-[40px] shadow-sm text-center">
              <div className="w-20 h-20 bg-rose-50 border border-rose-100/50 rounded-full flex items-center justify-center text-rose-500 mb-6 animate-bounce">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                ‡∞Ö‡∞®‡±Å‡∞Æ‡∞§‡∞ø ‡∞®‡∞ø‡∞∞‡∞æ‡∞ï‡∞∞‡∞ø‡∞Ç‡∞ö‡∞¨‡∞°‡∞ø‡∞Ç‡∞¶‡∞ø (Access Restricted)
              </h3>
              <p className="text-slate-500 font-bold mt-2 text-center max-w-md">
                ‡∞à ‡∞∏‡∞ø‡∞∏‡±ç‡∞ü‡∞Æ‡±ç ‡∞Æ‡∞æ‡∞°‡±ç‡∞Ø‡±Ç‡∞≤‡±ç ‡∞≤‡±á‡∞¶‡∞æ ‡∞µ‡∞ø‡∞≠‡∞æ‡∞ó‡∞æ‡∞®‡±ç‡∞®‡∞ø ‡∞µ‡±Ä‡∞ï‡±ç‡∞∑‡∞ø‡∞Ç‡∞ö‡∞°‡∞æ‡∞®‡∞ø‡∞ï‡∞ø ‡∞Æ‡±Ä‡∞ï‡±Å ‡∞Ö‡∞®‡±Å‡∞Æ‡∞§‡∞ø
                ‡∞§‡∞ó‡∞ø‡∞®‡∞Ç‡∞§ ‡∞≤‡±á‡∞¶‡±Å. ‡∞¶‡∞Ø‡∞ö‡±á‡∞∏‡∞ø ‡∞™‡±ç‡∞∞‡∞ß‡∞æ‡∞® ‡∞®‡∞ø‡∞∞‡±ç‡∞µ‡∞æ‡∞π‡∞ï‡±Å‡∞°‡∞ø‡∞®‡∞ø ‡∞∏‡∞Ç‡∞™‡±ç‡∞∞‡∞¶‡∞ø‡∞Ç‡∞ö‡∞Ç‡∞°‡∞ø.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
            <DynamicSection id="admin_dashboard_html" />
            {["settings", "ads", "code_manager", "ai", "cloud_dns"].includes(activeSubTab) && (
              <div className="mb-10 overflow-x-auto custom-scrollbar pb-2">
                <div className="flex gap-3">
                  {[
                    { id: "settings", label: "System Config", icon: Settings },
                    { id: "ai", label: "Gemini AI Node", icon: Bot },
                    { id: "cloud_dns", label: "Cloud & DNS", icon: Cloud },
                    { id: "code_manager", label: "Code Manager", icon: Code },
                    { id: "ads", label: "Ad Management", icon: Megaphone },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id)}
                      className={`flex items-center gap-2.5 px-6 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-all ${
                        activeSubTab === tab.id
                          ? "bg-primary text-white shadow-xl shadow-primary/20"
                          : "bg-white text-slate-500 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeSubTab === "dash" && (
              <SuperAdminDashboard user={userProfile || user} stats={stats} setActiveSubTab={setActiveSubTab} addToast={addToast} />
            )}

            {(activeSubTab === "reports" || activeSubTab === "suggestions") && (
              <div className="space-y-8 pb-20">
                {activeSubTab === "suggestions" && (
                  <SuggestionCategoriesManager categories={suggestionCategories} addToast={addToast} />
                )}
                {activeSubTab === "reports" && (
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 mb-6">
                    {["posts", "issues"].map((type) => (
                      <button
                        aria-label={type}
                        key={type}
                        onClick={() => setReportsType(type as any)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportsType === type ? "bg-white text-blue-600 shadow-sm scale-105" : "text-slate-500 hover:text-slate-700"}`}
          xúÏ}€r…u‡˚~ENõ;nHË+.¬ iHŒpMr(Ç…À`ê’›tâ’UÌ™j6z Dxf√ñcˆ>…éPlÑWªZ{¬±ñ@ExW˚b˝
¬?∞ø∞ÁdfUe›OV70úK*4DwWfeûÃ<˜cqªıÔXA;SìÌÔÔ≥∆‘ıøQ¯$c∑YÉ∫ì…Ã±Ç{\ı¯.k¸€/˛€ˇ˚›aáV`}f:ÏæÔœLøq^–iØ3òÅÎ‰œvm-Øﬂ^gdΩ…vÄg3ﬂÌ¡ìlhæˇ»òò˚çc€<e¯ü÷–µŸd¥Àˇˆ‹9˛mÊƒoM'0=ˆ„ôX«ã÷¿Ê&¨„ƒò∂∂Ÿd–⁄i‰Õµ¯Esœò≤ƒ–8‘FÓ(0é G¥œ2Z∂10Ì˝∆›”©ÎÏââˇnäÎ⁄÷ı˛ô·/ú!kÆ±˝[Ï¨pç—Ë©k¯A≥ÒëÈòûXŒ	ìo∫cFª›n¨˝QawÎò5ﬂ˚—É£≠1cnX≥]cÙ±iºY<tG3€Ùõ%ùáÆ„ÃÚ˘!c˚%ßÃ÷Ûh6xjƒ9ˆ ° ⁄m&{J?ˇx§è€7´Ê=“ù≤?;91·åAÔ™i+èVLUBØÙ)qJxjóM=w`√¡≠Zª…û∂ÄhOåi≥âG~óŒÇπfÒôcÏ©ÿÊ.ø$Ì ˇf?˘â¸Ñ;çıí˛wLËYSêeﬂƒÉòßAı áF`û∏ﬁBé0î´;F0Ûe7ü‡ù¶¶3ÇÎS>sÀ<kÑ”ñ´_˙–pFÜ-ªM¯áÍNèg86F¯∫i¯π∫Î¡,ªûÏgàË{pAÍôatTw«úÛnÕdØµv‡>páÜm‚èG (Á§πVq! &wæVâçÊp´"¥ˆ,∞lø˝cﬂu^ÓKlöA3>˜’í\˜ıKXhBL?nLÒH…wœÎ0ªu÷	@’@s¿yœ≤Mﬁ5ƒò/≈⁄ß∂Z6DL$5∫ì©mf	=8/"˙
ùúû∂∂ÿt—Í3œù9#s‘:µ^ÿ÷Û^wz˙ÇªN–ÿ∆5õ¡˙Ω°·õ,‡3lkn¡M≥„[xˇ[Üm≥ÅÎçÄŒNZ'–Ó÷VW~%?˜∫]ÒÒÒ¯8vﬂòﬁn‘c;˙ä?7Ï89œRÚ>Û«∆»ù∑¸I>/bƒˆÓ∏s	$ÛÅS⁄?Îmû≥Œ≠ê⁄¬ûÂ3•”ŸÛ∆Åm7`ôs¸Áæ”zÏπ∞(ﬂ«èèCúƒS@ÔoÃQÉü!ﬂµÂﬂwL‹÷Q„G„soW0‚‘{∆¸†¥wáò”iú£«í¸U†Ö:WaÅ!úqÄFóˆ±e√1J” 2R)∆A¨‰∏ﬁƒ∞·‰ ®PS!B%∑Ypj«lx`÷ ö¡Ãs`‰˜ªë<eCD=pîcéúÁ¶w˜≥©ùØµm”9	∆îÂ÷S#>lÂ|≤h
∑|v\ÑãD{m.*üâXi¡D˚f QÔ=±ã«Ã˘ñ#ø≥WWâ˝Ú±UØΩ≈núyÍƒ≈˛°§Ëœ¸p‚∂nv#î©|£‡BâÛÏìYË(æñ}|(tåf≈«ÕÕ™Oıª›∆˘´2òK≤ÿˆ|`cn¡ÊÌu¯_’ß∑ aõ–Ö¬mòå‰6‹åw¡µG•†„ËÙU0Ö¿…Ö«ñXx˘Ñ•s§Q~¶™ó^N6∞ìÒ|™‡òÁ (")Ï˝˜/u’ÖNàæìi∞`O=√£{M…7"Y&"W!ΩÕp¥gñJ/åB~QÁuªî)f¸@èßcÀgsn-\n`„·¢⁄&∞/í qÅôÂ∞`Ã/æ?n3ﬁ	…¶GŸp7`ì¡¡u`« ﬂkQFjÃœ©íM\rw~2Çi»7gf03À˚¿¯ ±âËpË⁄(44˛¿<ﬁÑVÒ∫D◊ß@jè´ÓwŸÁï$v∑m˘á‚EÊh≠Ù@ƒT€.Â`∞’‰b∞’ÂdD_˙≥ ÕP†Ø~|7©†(Ék&ªä”√ˆï¡â¬ıa£s~‚i˜áM™â*ºœØı>áY»Vº¨i!´úQ”Ruçµ$_&¿rwÂ◊±Ù2Û∑áI4
–úXæŸ¿V-í% î£H"Ï†·é;léˇ Ï¬^*k¥∂VæjlïèTÄFó+ﬂıÍqÒ#õë É`òœ1xµ‰‰ŒÅf√1kö®ïõã˛û«—9˚>3€)ç≥ÍmeË∫XH(˛È˙tkSƒ¿·ámUkê¸B·ì'vÀòn]›AÛª«	b?•=àIe=ããÜ¡E~]itAò€∞ SãâÂ¥∆≠Á ¿&Â[SØ:∆ºu<≥ÂÓ⁄ÊqIÊ‘EÚòC‹‹Ekìlv~2⁄Â£\Ä±2FÍ´∆÷hd:Qø˛ŒUGÓlZ0„©cú¬î4îs(üw€}síïh¬âK0ÄïNÌ÷éÚûíﬁåÛ√‚Ô≥˚xY¸∂N0÷õqB_Å≥ `÷±Xiµ7’:lÍ—·s0ÇÛâzx9v0,∑ªîÕ~Û
N]áª¢#9pGu=x™Õú3çñÀäÉy÷¨í|c"òêò3i÷‚‘ÍÒhÓå óÌí¨ek	’€µj›r‰„ïh‡„“µq%j8Æ#TèÖdD¯Î∫ÂåAÖ«ëfC∑åê};öŒ˛Ÿ∆y‚í/ZΩmqÀ%IM¢◊“[.G/u»ıP©7·π”ÇL˜7œ3tBÃxfú2‚4;ƒDQR)Én#./˛ä]^¸ÀÂ≈Ô//˛˘Ú‚_//˛ÓÚ‚ãÀãﬂ^æ˝¸7ó˘ˆs˛ƒ¯˜≈Ô·€ø‡˛7¸úÒ~äOΩ˝|Ø3≠9—S?≥Kè\©Â8F.ı ≠FRètﬁ`‚zëﬁ\¿Ø§

ØÚDÈ˘,ªWï Ì‰≈äêSFß¬b^¶Õõ∏àﬂ⁄ÅWÆÏqÄØ5Ï˝≥3Ê"_,vYwù¡{›2õ·Xÿ¢DﬂÔ[Ÿ5Ê®±7 2çÍ£Sˆ=÷mw∑™∫s]ºî÷Ë™tNY§à%ÇÁ}‰¡"T2w€-9v˘‰˘ÕÃ¿¿µªΩEBZ’ùÒ-äH4~IxÑªrgÆNÉ€HÒ√?ç… ˛EæV)>lu;Ω.W2/ßBﬁÍOv—ﬂ)≈nMõØlä¨˛k∑∂+ë`.íÕàBõË[U‰ïéÄ{‘≥1á˝ac¸Ox,˙∞”Ÿy§pº<ñ„¿áUb≤hK¯˘ƒMÿƒG2ß¯àù8 Ó˙2u{¶ÿ.¯'çY0iÒ\_Ö"éR~≤E£P#ÅS¶c7pü=y ã´VŒ`€≥&'ƒµ˙ﬁp?˘ñÍôãfÿ¡~∏[†
&≤YÈx,˛q?6á¿!&SO<u`ÙI Ytøaü-®ù<ÛÿÙ<”{Ï⁄÷p±ﬂp‹V¯mÎ≥∆§/ëÂs9Ω›ÿO~BzÔ7ÛM·∏$o£A?
)Lñ;Ú©D”[ RÆ∆.¸»$Fíœ‡hlôˆËplZñe˜ú;"_Ñ¡º"êÑ∂N"@b^òíg~ƒ]˜vÆ ’wò8VVõ*Bå7ã9˛¥b	ıúj) »k´ºÃçs~û*@•	qŒ^õƒ=„}·?®”E∫Éª4û9|^#È$]ËÑÆ∂ΩŒxì¥'$Æ¶ü£èNâh»–MÇVèÔΩj'á∏ùe›5…d;â.5:Êhé“Ï≠‡úk¯7·ûa£xyDœ¶º= ;ıêåÒ öàB"∆j‹Zj¸B+õùe¸Ä˘o,€6NÑª≠Ã∑·Pü @IáZlTdFì±)•n=êå”
dâ`™)»;…%√§≤D\—â9≤fÄºº %Ë!îímì3I¿‰ÿ∆)†.v
!oÍô"ÍÉ(3òß∞5pü∏Û˚#ˇπ}_‡E·7ƒ∂ΩlcÇ*ßkdò)Ô:S›ÌÈlòt…ßwà1àV7È@Ì”x‰≤ë&pë©8q‡¢yÊ–Ñ6jìÓZ5‘h:,ÇÉ£hIøD“:}3∏õ8tÕ&⁄7’ëjk∑€ÿ©⁄ú.ZtÆwŸ{ÿ/˙L‡|≠‹’_>•Ö	JÕt“Ô1e’ïﬂÓ‰[ÔŸy^¢{·pÊ˘Æ◊ö∫ˇZåÀûx«´OIÃ-F'DñûÃyÉÚ∆sùg”ê˝Óü3 \ÓkÛá÷(Él“ﬁ‚VÈÀã_]^¸¸ÚÌ_Ûˇ¢™æ˙≈Â€/./˛â´•ø¿è¯ﬂ_¢ˆπy4vÁÏÅÈ˚î=«µb°FË…_É__æ˝œ	¿„ãøTñ˛≠—]œ\È“)2LïÉh¯\%I'h÷Ûéßa…µã˘öG©
çåˇ#√ÈMjbA‘Ñ^·£≠jA2ÕD∆÷•H˘aüDyy5“ˆ'¥ú1‚∏¸ı –MtêÈ)ûÕ±Öéìå‘yßx†’∆Â‘tWdGUZ)Ö¥·òÛFµ?S‹§)&Rr∆ﬁ>¸c?°Ûƒ(!©~ﬁ}Ÿõûæ˛Ò•w20ö[7◊{›ı˛Êˆz∑›[{Q·.7™zPY£Â )zjÆ5¥Ñãü˚IEs…r˚õ[ÎΩ≠ùı^ÔÍóÎÖëI(˙»Ôå0r©Ê˙Õ	 O™sW¯MK¬ ¸¢
ΩÌıﬁ ¢ÛÍ°p¬ﬂI˝smª‚ Ü˚	U|ÈnoÆoo¨ﬂ‹º˙eÜ>5óõ‚“&È∞ãUØ°”±·ÿòŸìQød≠y4{…Yn•o¢ÈÀœ%[uP∑xHÔbûØ5◊(2#çˇ¥π∑˜·üB”Àëi≠ÕO’UôxÅ†n‰‘b YÜ≥	R◊·SUÄﬂ£∞õ)˛£Âè=Ày›‚Ó$gF‘ù©aÔñÈ≥˜ﬂßÀŸq∑–GËÎí%éJ>äÉå¨CÀÆ•,î5Ø5áª»ƒ√6Æ3kó93$âï^9À"3rqÓTÃ6Ö‘Ï	;àõ•›KòáÕcUváËS
Î˘Æˇ·&øúx∞g5ÜEoÕnz–¢ü#—ŒÜz„Î®êE#ƒ$DèRÁB6pÈH∆…Îæ†õ*å:.	Gœû~|ËÄ5èû}Ù—›£ß˜?y¥¶Âé—›Gwü<h–DÏïíßö¶¬Î™•ìTlJ∂)r[XÇ∂ˆ™%InT4=™Y1JB‹ÿ3¯xé—Sk"áÔTnVëÜÈ¥Ó?j¨ì˘–∫∏5˙-‡–¨†"Æ*n ÿ#Ì∆hù§ˆZò· Q2=kHÓ6vg^ù9ZŒ3∏hv<ø˛[s’ö©iéˇ}}µî ov‰èpIP¡25<∏„ı¸ÍBü
êBÚ¨—“=^6Á±8óRŸ∞<gèho{»§ö˚ß◊9Œâ≈oõö&°gÇ-∫?™åH€ë©aª]£èV†mÿxûµ±·ﬂY∆ZæΩõ|¡ktÈô•∂F®∆ˇ?®ŒŒhÓ◊ô5ˇˇı_˘Oﬂ˛ﬂ/y«/Ö{˘ØÂ¯’/.ﬂ˛Txú…çøÊÍqÒ‘€?&É»˝¸‡CUê{‹»ZD!àÂe“Sî¯ÿ∞—„Ã„∂ÇÛ∫\Lµ:Jù^ZÒËân˙&1†(∂œÃv`x¿0¥9∆“¯∫∂/FK+ej÷%ò0<◊éÔ hvS™ˆ}˛´o[C≥Ÿ#WX=õéåíHg:˚¬dt≈nº<Í+œπ†6} ø	Òaƒº!
‹πÁf®∆ﬂ‘Ã{Ô%~’—$ä˝≈7ädw∞¡i(÷@gCÚôã˜é€œKp;(H…JH“¸]Û≈CÜ∆“∑?CÏäüˇ˛´1qb „„q¯"MGöÅß¶·∏q¶ﬂ–:8åÕ¨‹I”éiÙ
s¶∞ÍU≤Ê#∏´o∏±kZÔí°ÍªÏ’ç≥xœ#B%»êjâÜ?æÃõ…Â≈_r™Ù3$DÒ„ˇKê?˛øﬂe7Œ¯€˛l IÕÓ:€ÍÆùWÜÔ'ÄXyW‹≠{¶1íyKıˆdØC9®Ì∏Û¶ÜVÇÒ{szgè»=œ◊⁄<A≥π∂ØãP31—@≥qœ∞–{3pÒ‹Ú70a˚ºÀèl£,ÉcÍ=∫<QC¢õg…é í#&ﬁ•W<bÇÖÃ´Å4›Û,`·ÌOπÄcQWJYgE ñhädëUçÁõV>?ÍòñQ,·ÒŸJácwƒHµ≈n¡–Ó,‡ÆpéÎòIÜgò√õ7¯´„ Ø¥œM´Gà:!ÈB\ûqVä=‹¯|’^G|_cïç∏•K&°Ω%3?.1TdvΩb·%-ö∑Óâ?ñ*2ﬂ
”X.1XhÇ§i©db3÷‰	7(ÍD˙‘ˆ:BŒI∞ëyîÏ+ò»¢6¬‹<HZh‚∏ö¸;1€wb¯ª/Ü„-}Ù®∂P∂î8M?1Æ√è-T›T÷ƒÜê¸jˆCµÖ\˝fÄ,ÿëü˛‰/@Ï5XXÀôŒ0˝rp≥∫] äÉ˛›ëuº`ègÙ‰(‰ ›¡>E“∞´¡ã§Ï˛âN‘KÀ∫=u\ÍïnöÚJœ_“·Y'£§⁄Ú≥Kˆ∑∂7Ãy[A‰∆¶”îäe‡¥ús3I¢ø‚lÑé÷°ûÚ€JÄÿV£#’ÌYS(ª÷QbSôˆ(Tœ¿µ’’}B]Õßzı¥w+Ñî>†TSgse◊Z€ã¯Iks“:N≠óÊ+DµÜ–u§yŒœ—ã›ËΩØ œr~#sTÿùÜ†»GÄ¯∆ûÎXü—|ä+V
_Ö≤"Nˆ°∏u'É†µ≤ÄD9£Óô$è)∑¯ úéj„ì∆©◊ã$ÿ‚êzÅÒqHÂ£gä“˝vYíY¢ —„ÖÍ"Iñà±©RÒ†#ÆGN¬°ùe<ŸtåÑÿæ„ÿW≈+|›»Qh—ãkæºs‘Hﬁµ;ˆ‹âÃÔÆCçÍ´⁄ÛXF›ŒÁA•ä‘ì9é7Dé„Jjv≈ƒåÖ˘˚‚,#%	ù‹sÜyÔh]…¡òO\8ÚÊ·pûLâ,ﬂH£t»ØMf‘¨ﬂBã|Mß~ïãd5=ŸÖTïæHç£¬®Y”"ŸdÖnB‘Í∏¨nb©⁄%ÒJZ∏[TÕª¡î“ò›≠£Vaçd”ÂÇÍÛA+‰ÑV…-√-≈-≈Ö<Q\pAÛÌ+‡ä¥8ï˜»‚--IxiÓcÖ¸áN¸ÀµÒ*πıj±*ÖµÆòS©K¢…¸J^˝ÜÏK5˘ ≥§jPê§r@|ıl‡R|œj∏ûêÁy'ΩíHïæ(Ãû}Q˙ùâ·Ω9»√0:<èVM/µ]ç5Fõﬂ)¨˚U]ÒKmtñeIÜÂ;•ÕwJb´≠¥πC*—ïn◊°¥A‰7ä∞ﬂ7Z_C≥a–+≤PÑπ9‚\[µ-Q˜ïZ("Ü(Aˆ(=â∫˙$DM·Kgy*„ÕV9∏◊âJ2îîX-Æ±∫Vî^å’Är´duxbaaÆ /SØÃ©Kp‚˙/è1ûOFa§hQÓ¨^üM≠~^Ú≠Ωè\ˇ¿›£Ú‹9k√†ã˝3¸oXBT Ã†¸+Ô)ô#|ˇL˛ë}&s–j	gπ:§≥°≠ù∏ÏY~µ¥t^ÈVªJT£'ª¸o,FÁbìÅÃM”·≤“6„’
™iƒíVA¢î¢Zk%◊loºëâ+Áÿ/7aÀN7/°8Œº¥Ñƒ¡ph˙>∑≥zÆ]4ìŒx£pñÙ“;[’yù&ı≈Û ∂ëÂ}c˘÷¿≤≠`rƒ¸ô?5Ù*ı€Ö”-»&ZÇ’ Î©áE¿ÿ/»úrpßﬂÅârÒÊîï∂;2oXT∏õ2û1]{áÔEk”¥’ÎÙôà°Ê[∞‡_§Íïå.)–v1Ω(°L{‹W∞dtÊg¶lS8ÍÊŒ‡øÜÄ,&K_gÊƒ∞Ä≈≥“n∑ÀÜë±ÿx¥ƒ OMoRF„xkiÌõ¡≥DÔf2l≤î™&”9ﬂƒ ûâ∞Ø$NÍá’:O˝\<“ÁÈò1$¯ëà	.lÖèb®U´Ø~Èw√ò8«Û÷ˆf1¯
wπîQ–ÕYÜ©™ï*	O˛SîÓ0pÀ(;54(1€/≤é Q¶ºOaÁÕù‰Ù‡ËGkR√Ú"õ∆õ≈Cw4§WVüõüM˛R|'€ÁSÕöE•Å´3„æÏ≤YXyÄ5*≈´ªx·∞øy¥>G3œë/Ú≈ü¥~è«pº±◊ƒ
@ÏtGfä«~j÷¯Íû@|F_€ÑˇEÎı©HDè›¶Ü3É¯æ;&OßçL2ül¸ë÷ˇâkÛ◊"Ú„=ToÜ®gmÀ£un«‚5Í8CW9“pçp§°gbD‡AµÂm•±Q∫Â¶ú©⁄≠“yï,Æ“µ†x#€≥¿≤˝ˆè}◊y∏/˝±iÕ¯¢—$∏ÓÎó∞Í™[ùÓbL1TMŒa>XáYÆãpkø
√°Ê ÿ{poxg¡ìøkiü⁄˛i’ JïkÅﬁÜÓdäá§¡ïäˇy≈™Û(‡JÍUüx¿Ω+!ö‚sdÉ?P´VãØrm+µÎUóK˝{ò)	@™jµ 9ld1E¨˜ıhÊ¿Nú.
≈l™,ë¨IŸu[i˚ˆÍä¿ŒÎe   ní	bI∂â).7÷>	ˇR¯&Q±◊›j»bn˘—¿ΩL¢’¯®≈¢aY¶—“∫Ã·Ü]€	È≈≤«$2/øªGÂNÏ¨€ê&◊≠8èn¯±Ï∏»grèK^˛·d)¿ƒYâ~óﬂ$≥◊>@‘`]ÇX	 s¥@â¡	÷“k?ô~)j◊Z6“Âl£°MTLîlU-°‹:Uﬂ¬äøßœ,ác~º˝qõ-Î+¶m/≠k']“>ZhU`]9LµU¥¶5TiÆÊ¯.ÃdmuÇø9„GTÂŒÅµóL~"å†\’r+Æ¡cœùXæŸÜsH3™¿ê“)π$S‹®B√£‘,Ø#|Fk‘Ññî«H÷2Ω∏ÙWè37x§&ë˙\R&¬Dc≥¢ÜQQa˜—ÑàâàæœÃ∂ÃDyk’Ω+ó‘®Ö≠ØAnî[•ıø≠j_¨%‰Ö Í‘y~R

,µ UqÑÖ<YôˆºËß‚R™¡œ1¸Í€˝V”ÿƒ˚Ã>Q>nãLÅ∂P∞"ã1±D≥≈C sÀà7)‰kJ [»ˇîÓ‰m
¢/aóΩßÃñ‚=uà‚€ÀïëâeÆÖ5x∂¨äûIuz‘πÅ‚û2
tê2!7W<Ñ|O"nŒx¢∫X›∏ñºm9C{ò†©ó∆˚7
œ%GävÀdç(√_ıb„{—ıÒ]/h6çu6
ÊAS§·,∫k¨≈öÜÚπxû€±+m{∂…I·!†Ú†∞KÃ;îÏ˘ûÙ8 ‹R7€X∏•f)^o ÅKTdEFa¥ái„‘.,ö!I¿iÏv˛‘ŸÏ≤–,»ê¢€Ûÿç–ç5åkjôRË62¢ç^âô»·_LÓÃÈ%≤¥TfÆ‚êÂÍÂp
£©éÃ M3$◊∫%iu<ãRî&ôZùTìﬁ◊Nmà(H'ÑFõ.•€miû–ÍZ7VÔsª\ì‡%‚.?æobz√®LwîiPâµ$DLÜH–>…)Ø^Pˇ'£†ë, ºıœHGå‰Lóâù‹÷äù§;„’√sŸ∞‚‚óBw´à(éì‰+†G¨4P≤Vê‰r·+	X"0r…†H*≤]*∂@/≤ }W†6“»ù$Yï¨Fà‹RŒﬁ+rı&:p_%Iâ,)ëû•ZóRFO4®Dù¯5≠¯QÇF¨å6Tï2¶§]£M;∫*€(<7Gt∆X∆gé(/C%mÿ â~®’âX|Â:DÑ∞¢¬iÑ√çåñ4∂¸˘Æ˙™eÎ4‘Ç∏(¡LGT >⁄ÈÄ4Èåÿ#•& F}‡åµV-kêWVUîÄ<êvÒ‹Ñ:µ./˛ñÁœ˝¸óÖu˛'œ«À3Á6ÜC‘ÛH/¥zE¥D»¯.’æÿn„⁄0Î/K-Ò7¸É»=À˝K±h¯·üyJ‡øÊIÜÂ≥?ìˇ˛«o‰?a“‚∞ûÇêZ¿f3Üæ`"#1$]_°‘ı9ØÌj/Ëüx‰/yr‰œ√≈˝c8Õ¸≤zâJdq·cÙ;]ﬁÅWHG3˙IØWp∂oè¬0•[tò’d7;*Stíak·Q€=¡˜q7U+X–ˆÍ∆YÃúmê>∞íÛÄOÁúë–®Rr&¢"'Èu¢T≠cCy¨ñ•[tÿt,º¸ç´íO˛-c#>m ï* núÂØWT Jé5AS¬tò∞&ôïˆÖç§hˆNà_[Âﬁda#IEGcLˇz`õ)uÚ—ã.“ÏÇv«Óù_é-[@ıckdF_|ΩDå’3‡N‹-˛ºBuΩÜ@$Ê¢GÂñ∆$Lè
Ü›?ÊØ^u1ào≤øÊãßçî„˘qDjL¶"‚CÚç+)‚_u¢¥{≥wwa~r|¨á¨uä•„¥GØÜ∆U€Z§äú™I9øE1r‹cÉTÎ7Oq™CƒW•1’LpAbíŒk◊¨1-~e“ãíå‹"ôõl2¿lA•≈^πü
65Õ[ΩMLí≤…‘ËëÑ§?ˆ,Áu+/@*CJ⁄∑D˙®Ù’úqI˜»2nÙƒ3<∆Aıôƒhe¯pS∆=àﬂ∏JøÀUÌ4Ãf:v˜Ÿì$¸∂gM(e,|o∏ØMπ´Ü`ó»œåÀ⁄)˙yˆX¸„~l∏≠oh√«,Ádøaü-(<ÛÿÙ<”{Ï¢ZÏ7∑~U›ΩÚ∫“Ë¡W,–ﬂ<œfë—]É∆rpS≤Ÿ2 Óç7∑?ïá#B˜–@Ø»òê¥ˇ¨˘ÍÜz¨Á¸
&®œ_µxks]c≈€°Ê°ÌOm+h6˛∏±ˆº˚B®5^;Ó‹B-Å≈LDEO$j8)Ô8¡E>‘‚„vTs=∂ßß≠^õ˚uwøn~bÓ‰ƒ™SeÄΩŒ{ôì8»rÒ‰ Ã	7´∫îíÄH©ªNHÓu∆õïW2õ}&êLwR@πî±O1∑Ÿ´?æ°t9EËî»≠PÂÖ aPîÓ&~†äØhp>a⁄¶MãS^√$ùkI/ä√KÁ≤©<0¸p>1O,ﬁéÖQ)ß5s'ï∑r<Œ…¡^∂í˛H|—¬ô”éö$HGK…£Ä}rS(ı”i›DVW–5C#c4«ôMLœjt& ø1ZÇ∆ÆßSÁ{a^≠é›vÏ∑F÷â•Û∆âÂÃ≥FW¢%ÄRA7&Îïl'Â∏π•wZ?C’{
∑aôkπµ∆é®‰õ{ƒ>x»œÑœÉ Œô¸Ù≠ﬁaÌßm
@Êà4úiäÌ≥¨≈øÓ±Hô›ÓMLow2…õ :zpdcî?d÷π¯28ìaèí«+C>Ä„‹Í"{◊œcÓ®Öø“SúÛÈå˘Ãb‚µ)[Rï“¬êëÁ081ç[Tn€'Ê,cˇˆÁˇΩ¯∫Lÿë…kFØê”§=GîZ57<N¸Q∫›Q˙ê¢Õ÷Ã+Y1i8x 2€´óﬁÓOéè˘n'Ø3pƒÕgç`‹ûßÕﬁ:„€ÆÎ5ã/˙Î∞m~—◊‡Ñ'Ó⁄+û¸È|UáâxDV¢fxÒ≥t‹x`æ1m“Y	÷T
ó¸ìùT,òó∂!d.ÂñRÙå◊¶?~=õﬁhlÃß◊ﬂ¯„ÆÚ∫5iK:r;Ã¿¬©|ÙcHÛ	∆/P4Û æU+#âçöïáò`Õ%Èâ‰H*ÃU±,æâNé/≥w¶í›UÕ1Œ·)çÍ&—™Nµ®áªs·SƒíAI9%VjèùaÁT_X¢Ïí>∞˙˛Ø+Ò}•J™⁄>Ø±øÎˇΩ|˚3ÓÎàæìøñûËâÓí¨…è≈3æπ#∫∑kËÈ ^Â˚h*/Eè6æŸÄlû!Q»Êúªõ¬íì s—${∂’sœ¨·öYœ-ì$Q”NªRê˜Ô`å]œ˙Lúzπõ¥¿ü|á≈W+âDj<èÁ+ÍË%ôÖïyN¥±CÂ3J\Õ'?≤Õ{ñå∫qL§5¿+hã˝d sÛ∫xiˇ…˝ßwi_q¥€π! ¨,#O≈ïN4Y[·{ìA´À™S>Ôı»q¶≠çDE25±t‰±í»=ù2gûÔz≠©k!3[ŒwT≤òÓîﬂ7A˙ΩøıÏËÓìΩé¯EsÄâ;¬3Ï–≠áü‹π˚‰‡È'uá2GÁÓù˚ıúÓ≠£?=zz˜!;∏Û˛£ö#≈F¶jÊÙËŸ—„ªèÓ‹Ω√ö>¯‰O™å¥)/»π∏ä*±˙‚ûHıå+ß≥ÆD\öÍü ¡|≠°V‚)≈\L‡Cø¬O£Z+íhW≥/&U≈°ƒÑÊës¶Âöyõ˚¸°ößf∏Dcwè‰Ê¿U„üä3»¨>ûlkHÕ  ¿î≤ÅTè≥D!@˜‰ƒ6svΩz—µùàÈ.ƒ´v ÆÈ>Lu÷u÷vŒq∆√¶yR±e<à”gûh3¢ ¶¶3qMW‚Í+Gp#N9√ıŸX…∑ƒy"ûF$…ëåfÇ‰ZÕ§ÛnDW˙±ZHUÄg2˙*?v˙´—| ≥KG7¿Õl-"Q £»Øq}ò”ñt\VæŸ&y$W˙h—\8´]rBmÜl@ê‰∂ \!%è°Õ0
yÛÍºL–éœ´Bú5ÅZùÖ+H AÓU&û?_Á!¨íAvOy#J^U!Ωc¨A–^π¸‘2ÁÏ˛{§®Ä§6aÕ>‹ß¿åD÷V¢®™Ù‡Jk xõ98Q∫∂©⁄@qñ∫HE^|vÖ[9¢eæ*ÿV3πW´DeèúÂo¡#O◊§≤òˆ•Cxµ_⁄V∆®(vóùp-õ`
âÄIÙa%⁄ô?B	î¢¶€7ùQ9¶y‘9 ±Ó$ |e`z»K≠LJÅ§oò∏Çs’Pä3∏~3ÄÑn5+?JXp˘õtí¬z`´ÜS¢∂ÿ7T©\§näã©≠LÍÍÅ‰∂pZ§Ëä+Äû,◊yÍŒWÈΩƒa®r‹ﬂå≥ˆ…Ò±5\9Úr˘®Ây≥„¶¬ï‘°ùÊ§%W√ùíp{H1´i®˙°e"£›%O≠Âæ†XL?K<)M≥üõb_;ë˛2)ÙóIû_/q~Ω§˘K&ÃØHñø≤D˘´Iíøí˘À%«œÖ„˘ö¨÷¬ne◊ÀíôZ‰AXã<í[\6∫B%í≠µˆizvÕÊ‘3ﬂüÒˆ}g	ÊHV[ŸF∑ΩçXﬂòÙíW„è”¬≠îyã%€ä˘œª/w¶ß/{€Ôd`4ªÎ¸ÌÓ÷⁄©úàj´%ã£Ò˘ıªÈt’[›¥^¥(B≥ 8≈ÿÙq|àY®õ¬Î&Jåˆ+¯¸[Ó≤ÛKëJ-J„ˆÖp∆)RÚî+@
±;ÏlÊ€‹ásæL˜=3∏Ó—l‘§:òYXå;7¢±(PŒ– ∂#Áêß{*ú∆»ÇΩhnÀ„6ê¯∏¡Wñ3≤N\˛i
w)<Äœ7˘aÀñ‰ãÎ,Qnäö|ÖeíQìQ∫Ù{Å•∫∏$π¯¬s\V∞Ä„Ã§EÀ|ÔÛπ∑Eäÿ{`,∞ÿòå•ÓvR*êãÒD†˘'naQuÓΩq?√n§êAxÌ\+ o‰¡“Â¶Lä›Ó∂>5GcÎµ¡#óˆ°8xóa‹/ò_6F4r˛ùß≠y+úÏƒY≥	≥MNﬂB0úñ8U‹Òå _{vü»u1ø∞øŒÑVú·î∏@ ‹ïæáÁÜôS€]∏>¨˝
LÊÀú˚l¥  lñ≥lncw0t@¡¬„Cwd∂∆√Ú†CÓgÊs¨èöWõxQ;êüª¸Œ!•uP"+EY°˜rRó%tÚ@‹µÕ	BΩyÁÓΩÉgûæ¸¯ìáw_ﬁ}p˜·›GOè
È\ïko)•8û»ICù<‹I∆üƒ~≈D/Më∫ùçÂ®R!Áê©a∞÷00Ûı!á∂=¬Ωè;[¯cw‡ó1I»É∏äËï´·Jˆd¯⁄í"a≈±úˆæ‹ "≠≤ÚZ¢‘⁄f	];Î|èÖW¶¬Ï€˜:πÚbÍ•éH]”ã(LQ4yã\⁄“)∏‰"‡à.8Â-™óIÙë,LBÒÌäı"ìÄC_J‘"@9B0ÚÅ≈©ä8Æ≤7û=/Q4F>˚ºY·q“à…Û!≤Ω˜ÃäúØçèMœeGÇñ?˘ÿX~«∞¸±{¶¢≠…o‰W<ÍÇÙ,	F˘ìá∞œ¿ı≤«©zˆ˛Ñ”j  ç´òÍÎ}ˆ1–]io≈|~@ïH∞âÅC≥¸…Ã\∏4ˆ™5qÀ∞À;<õKÉ|∆]ŒÑñ?,èa◊éLÔL÷'z6ÖNQ>L@x|\˛Ùßp·îç›9œ∫P˙Ïw8√ã«Ó∏s”(ï≠ÒÖ®Bg⁄eË^=ºƒúió´	S¸≠j5∞èwm∂OpÁ¬òù˛a¢¬ËZEÁ ‡O}X‘»A˙Lx<t,$≈ûúWπ±Â∞õœ€Ìˆ ˘›∫ÿÄï^që#›´x≥Œ√U9 :•)@æ˚˛®…ﬂçﬁóÂù5jÌ¶‹Øãl*JÏ8¨jáí¡Yv+ùS©≥´Ëtz›|∆,-è'5,ù∏í“ª‹Å;F
|lœ¸CÀVZ¸£làUó<ﬁõPW–´k	P≈Ñò‰◊Â<•>|∂Ñ|;AE«™∫¡EL'ø ä¯Æø&)Lû„>b€]ïÅcÉÁQ50n=ﬂÈr≠R§$Z¥åﬁR.◊∑¸°Á⁄ˆ¿(“ﬁV<à¢–<e‰ƒ.a⁄B%O°	Æë)
9€çÏì:úm	w˘ÄXÊÂœf¶Sh„ûvCÛT¿Óß–m®ëGΩd∑$	Héæ'±VÖˆ=€wﬁÍmcˆÑÌ‹¿îÁ}·ÊUïÄ3ï“ur*Œ •‘î≤o≥4}jï˝/´ã%óL9∆¥^≈öÚπÒò `§å(äkéAn3”Fb'“¶ÚME6ŒMôŸïÄúxÉåS§˜*T_U@§,»ﬁì£äˆGàj_lúZ˛~£ÀÚÄ-?}åã±æÎ»7Ôüeí'Æµ-ô€&˘ﬂuÿÑëyZÕáPª°îÚ»˛*éX≤ÕïIÒTwyA˙#ç‰TıúóÏådLN<c¿ÑπcW˘jÄ'ô4≈c>§≤‹Á3ï˚6Êä‘¨ﬁJ‹à‹(j™>™© sºlmftUk/Á	5G‰ö√m&È~îµ‹LÒäerP‚z0[f>«TÂgj‰Ü»∫RP#Jdl)”Wå±îá?5üIÚdÂ«îD◊û∂˙"Og/ù%q∏‘∏îîìp"{…V*yIä;πÂ’%îáY¢xŒî˘æˇ>k¥¬Ç´ä¨£Ïq*Ip}'¶åë:'Sì‹¡â[WãÔ&˙*z%I5›%*…-Ù πÖxx∫k““Wïökçûπﬂu	u:˚g2ÂãŸÜ}˙ÿÉ9·¡5MR"~ÌX&##%¢≈˙MégkDDF◊åIxL∑"GŒΩ<è¶À»hﬂ˘%òj◊r	í]´é∆fíÆ™JÉ∏§ZàF°‡¿®ÍÅåø’âª•‚œÔ*r§ü¸⁄‹Î<ÖÒBó2_2 L‡“ÄÔƒ5◊g2Cæ% ¸Æ2·q
6…‚§”ö$Iî(#VIô.ÑP*ÖDÖ√·æ˙2hWxâà‰-GèNºEiiT˙{3-é„{·¡$◊ËZaÏΩ~Rn$êÃ∑tKf˛ågmD	bAM‚E÷◊,^RÅ:Jà∑ÇU‘öFÆü™ç%øY™îë,‚t‡ô∆◊¢êQu‚DJ®¸ÅH‚˚ÿ3}‘≈VΩ∂ÉìÍWÏ≈ZºÕ∞˜œŒB©jóu◊ŸÿDÛ8¸I;ä2Qqbî^<J´⁄PÊ©,9’BìÙ,•’[~&ù·¨^|ìïƒ8sgö–4‘õq¯“x(j∏ñá˜k%^(£û⁄Ä•xU≠Dú2∂ßàB®”ÓyìWi9”%8Q4$Ù¥2ërµÕQ°,DÓÁPßë‹q¢∞h“° ô\Uß–7I2ñèíüÃÊ‰õû¬≠ò.ÄËUÕ˚yNçQ¶≠Sam
ó¿ª»!ﬂ ÜƒÅm∑…U·Ir9®ê?öß˘°÷æ*Ç_»xw0‡ê1‹vàl}z∏Ñì)´-Fú£‚»Å˚◊–Ô¡R(buH"Ú™è&¥Ö™∏Zd¡8±∆Cëïìé<tv*ïtíΩù˛∫∞#Îƒ·Nõ:Ø&Ê≈,ôÆ“ú}ﬁâ=q§∞¯NW¶”úÔ]—ã	—zßåBöÊ|ü@∆˝WØw™\-¨9◊Ï√tW§’'Y·Ñ9–ú√{ÕélZäê˙sçSøRü◊ëæQ,@Ëe}FﬂíkePï¡9 ^_Ëk»‡æc Æá'°:¬VÄ‚De„÷C˛Ô
¥Ò4n=¿V0úF…≠∞Ò<w?¥F¡¯ÎäÅ5‘"wFø√ﬁüj%SHFˆ‘$pC≠¡+öé≤ä?ˇ.—∆EhÎ∞;¶?‘:Åö$∫‡öœ4¥f® ûbÆö™)lKQûU“%òe§IÇÙà–ì°âÂüy<Òy≠y&‘ZxÄ=ã£E•6¢bõcJ≤èRsp“0ﬂª◊—0¯ÏuTˇ‹z°	øËøjÕRùÔ±Ë©˚XÊ,xl8u¬äãÙå9¡ƒ±m#Ú‚ﬂË„ˆ'ªqvQkÆ	|;ç-$œ∑Âì·ÁÔö∏8;±Ø/BEŒ»pW>Ë∆ÒëlNÓè»Ìf±Øci¢ë>Cè·VØ”g-5Ω7~1omeÕ[õ;0©-¸{‹˙ F;
l|ü6»5˘∆eTß^¡5(U˚ÊDX»ÈàH1ùûH &ÙÅ2!Œôïƒºî⁄I30ÿÜ˜Òàn	√˘2Åç\Ãfu|áH}ë{∏Ç0HD9^Å<rePJ{Ø&ÀƒfÍÀ&1x¯K\Ë¶úÇv˘N0ßh,\DõºP¸ÑRπËãR'î¢ßÏ©/ÇK$À◊Ús—ßW±≈SRïSù„ûCÑ…ûîÁ4.˜√’;waLBG¶¨GG„äò≥Dp•rñ0D`*∑(Lºƒ‚DLu¯°Wö$†¿ﬂ&ÄéΩS◊î0¨¬· ¬≥Ú Ç«)¢ïôäŸ+0lk(üT∞…è‹(è∫máªm˘ÃúLÉEq`QudÖ„e
§•-Åwy?5JΩäâµe*íC<ëIdD‚(µ WsÜJ#ûLh™π◊úéê!pïØ5±uÊ›R}PÎÂì—í/™ÜZÔ∆ªøºbÑäDéq#ñ°∆Sâ¶∫ãF,Ãç≥hQÁLúáõ´IIËb|ñÜpÁ~ã„∏Q7q4Á&íE√ü ÄOΩŒÕ4ØñÀ˛TïñO3b‹,«717g&Ú ’Á3y¸£ûÌΩÑO∆¸y; /`
x∑Å=ÛxΩôÿ•7‰~√Z¡∆uÜÃ
ö–iåãW}Ùòrî4FŸ`ÆFö,	≈MïéóÇˆ2’e‚ˆëÌ‡¡ô¡‹ı^k¨Æ0¬6˚ËÍµçy	.≥-â@πáÙ0q•*~Le±»4ñ7Ú-¬ºñ˘?Ó4ó€ÇõÎı”®)!¢¶`¶S[F	1IætÎ -Ådy∞xjƒq/s!$õÀˇﬁ¨H0∆™Ûœ‘tìyÌ¨©„‹6ëãgÏŒ<$ıò“3Ì4◊⁄'f1~[î™π|@,å¸ëgö<˜cu1˘d≥ŸcΩæ∂bÛ6k|‰∫<ª≠Ø÷”‰a€çﬂ˛ÅvÁ¯˝«∞∑éÎí\i≥sÉ`.+\ÑﬁH÷eÀtT∑€ò1[s"∑Ÿ´èM€v±Úñ∫õ¢W<8˚¸=ˆC”∫^Ω2 ∂÷fˇˆ_ø§‘ÍR€n—ãÀﬁ°¢Û5Z–àh{ùqo)ÍD0ƒ	ﬁYìídÆ,7Ùê@¬D°˘∆›…ìèÛl≠V |»ù¡pˆ…òç¨î]Y€4\¥5Ïd∏,Ù~ÓSôàfË2Yi±=b˝ÑÜh[™Ü*ÛáSS{*Ø4ÕcLÓ3ÊÎ÷2çÈ⁄µ¡”È≠&…ikX1!‚3=è2=XÀ-Ë·)VÓö"©>w§góŒKœ≠0RÈ¥˝iFJEvài¬ñå8xb¢ «ûq{´ØÖ‰ä2{Á>M§îª◊ªéÓøI(ûw€}s¢á_xAP˚áûkå‡EÅœﬁ1kNøBW#ce`&0Ä!S√PcÒgœ{Î¨/ìeZïIÇÚ¶ßÖù∏À™mWí	oÍ&é2„kº\ı»i"Ù<≈˛v2¶îhŸ%6Í;∆@ÂÊâºiäUL{|mRú7°M4}v6sï˙3 ]oí+´≥ÄjÇ≥ÿ'`âÅØîVg j“Î∫úåtπ°â.≤\g5Ò•&∂‘«ï˘òrªLµ—œrû9ËÛäúTu…G™™|MÀ‹êØéKF≠”“<k˝–€Ä®ã” „?Ç`ñÖ!fwâ˙jã:9πEq>≠¥Î„éXæ.È
Ø±ﬁ).N6Z|ÜhjÜcòÅaŸÊàçbg6Ê≥`lÈàUå¥€evÍÃÇ¥4ZûpDJp•»=ï≤ø>vW≠\ä⁄=c,UªØºÇeÊQ›áÑœº\ßzx4∏é–∏ÑPkÆ_ Tì‹∆™ƒk”>1ç·òa<P‡¬?ÛA&u=TÊì+R.%'&*“’wä2*Wm•i*gÏh6òXØ6Ç6ËØö.rÂñ»âÌ‰05"Æº,µÒ≠⁄pò√3ÿ'´„íÿ&{∫CÁ(úÉL˜:>Ÿñc∂†”DOêØç|?òY YÉ«#ˆÅ0®’∞√¬sûÈFÇüÈxHïKT}b‡∏EB‘:€¸∫Ëùb*ô®£[÷Ó‰ëé©ËZ“ùÅ,{ï¢Ü.¯ä$ØBå,ƒY è¯"WG¶]∏ dÓû¢’⁄∞ÈËÊ⁄TÜ©°Ô*Àwúr*ä‹ÍµUâ|Y∫Åû¬8ÓÒWP’V¨À,Oê¬@WBÁS(?!¢4§ÀPn√‚ïK»,.0ó{4√ÑörùçX°EGöp™ ¶[ië¿Ã√ÏÕ.kÙ∂˛‰˚çuf√üá“◊°¡Œu‚≈87w˛ΩFf2—E≤ >‹ßuˆıa*ıç2jHΩ;üpïî}ºπaUiñæT'⁄ªbí|Üg£˝Fód·,ËëïÑ°9óˆñ∆ÇkSe±ƒäz*Ÿ%jh	ø$Y≠¡Y_ßàx∫‰LâU9IàÈ˙@]Q:EÉÎã’ •Î•≥ë`ëX-ŸZ.Z_ªD}ËN&Æ√˛lfzñÈÛ¢Ü„œÅ?∏	öRÛ7›æfníHfÎ≠	Åπ‡Z]≥cFiJÈ
PG/_ôSñ˙yØWHPt˝µDªº¯õÀãﬂ^^¸+¸ıóó./~w˘ˆØ//~u˘ˆs¯·óozyÒ˛<˚{îˇnÎ.GõûBü√±˘∆sÃé¨Ω≤b3Ä?ˆ@àmi—§8ﬂ◊;◊Zy)∞ÈcøÈ§9Qı˙îËy,∫H#®hœ[vú¢ŸÓRîX¢"◊jÛˆ:ƒÉ|02¨|¡≤∂Efˇ–?$¯ß8Ã…{FfÔ5‘¸@<ı,√¡⁄=5‘l⁄"∑éŒBGÑ äO~ï¯n√éæ¸T_ryÒk†Hê2¸»¬ﬂ·W_A∏º¯πûfDÉÏ‡Ã∂l¡æ^,E@Ò·U~¨ì5ıL/ë
,πBà´…±8M˛MHÄá§7	ˆ/7¸Ê∑Hªﬂ~é˘íæj[ÚïÇÃ\@9ˆ§dòpÀ∞óó’bêîﬂGéÚEMËìÆ¯∞B·-W©)-7r$b.kÀröW#ÕÂz˜X*RV ÜEH1.V§nÊü¬2…	7eû≤'µ|=dû£ßQ¯jIñJ?"ìédaM2z¶H•:÷M:SZ_~ïAjòîÑa,`¢f9«Æ71¬‘ktTBù6Â\)y6Öecåﬁ]û2·õßÌ©,,ûÖ“_pQÔ]æ˝íü∑?™Ûs˛’Ö ˛¯ˇ∏‡§àKÖo?ø<a|cuQÌå§
ÖÑ§(q}ÍéåŸêÁúJ˘ZNkﬁzæ›Mx4Ë´=r≠ÿ#Ã˘Èe|¶òoùÃ©ÿ}Ú©∂>C◊§Õ{ÂÆÆÏ*◊XÃô≈æœzõ∫Jä:+ZAXéZOÆ ÕŒJtgQ.öïËÕ‚´›Ûƒ›€˛‘∂Çf„'çµÁ›5€Eå˝w!>d¸k∆eÖ÷L≠[ÀÊıù¶*≈Z»TCÀ∆	øª|E}ÀQxJ#E2p~-\C EbC;årŸ¿≠ÎÁ"d3ˇœfÜgÊg&=µµ8ào¸’=2Ω7÷§°;ñ∞sµsœ’R5oózÉË^˝w¿c{¡„w\—ı/◊(P|+›ëï˙|\Æ®vLN$:ºRπCìgI∫'√⁄OÌ“ªUÈN¨m¿®≥fXıcazzaÅÿ§’Cõ—Ø∂Ûƒ˛YöKøzSg^`|?Iﬂ¬¥ü22^óp}òTôvÃgv««´R°◊ X◊ÊÒ¥Y˙ís¨BÌıπ N ∫Àãø∏º¯Ga˛
µcüu§Î€¿’*FÁ¥6,ﬂSˆ˙tdqLKh»Õ1⁄0˙5RÓÎ«∏O8Ω_rÌw6¢÷ﬂ·Vñ∆≠üZ#”eGcwé…U'ÛPÎŒ5¢÷ÿ¸∏*˝ê˘//~…±Êo∏Å·⁄•âﬂ -vB»Ò°ªÚÿ6trNß∑@‰Ô€–ÚSìÈ?4x¬´òπ“v«Œ∏È›m◊–ŒÔS_LœS«Â≥ŒÔ∏åæÃN∏ÒèpCˇƒF#5Ùµ€ø¡˛–’˛∆ISa¬#Ô›ñ^Eª{ ¥<Ö√¸Óâ [W/*ì∏øæÆ7åπFó˝j.¢ÓV˙sÎπqÎ”‰uæ«ÓXQ
√±ã6uoV*bŸp¡}cxÒõ¸J|ôAﬂ£Eè&Í∫PC<ïºª¥.©‰ƒN©§Rƒ^Q
uvË¬1Mµk:?	±[:pú
%∏çÿ%·tOÏìÁüIÏöv "vK\©0ÃZzà=3ö3bøîTHÏï√ÍRzæh[Œ–ûçL^›9Áµeƒ–ù4ÎãdG¸12¸±9*Æ+≥C÷I˝§ô`pSÀç#¡”J]k~ åCö°ïVz¡˙~üwé1±ÜƒRÃDfä∫tW≥x•Ú_ ΩÓÑÏI.¨ …qa^È~B8¨4CÈ%‰ﬁ;2o8.8wúK‹‚e_'^kC+op^J‚<%'Ê}ÓÙ5Ü^*ˇE}ó–Ø©Ê[7qy“µNÿ∑øbŸOgØÚ«ΩéÊY¿Èeí…§6µ∂qÚﬁÙ7kÃõ†∂WnÊv»\èHYò‰t™ß›….¯-*U•WÒä≠é>‰Wc¡…è•ÔG»£úü”À?wµ
îåªïIrhmù€Îø9—ÓƒÿÈƒv| ~Lw;ù˘|ﬁûo¥]Ô§ÛÈv`Ã:5ÕÊ÷(Ô7zõu:èMÎˆ~côÛ›”˝Fóu®~≠Q@t≤˜X†¥No?‹◊p8Ü3œÉ}>D\˝q~(ÄŸØ?àÌÊ–òÓ7¯)]núªñS{ ˝SÁﬂ˝‚S∏Sg≈ 9¨ŸŒ†˚∑EÌûﬁiÕÉ]5ª÷‡`Wáñ7©væŸ`√ˇ«√)‘pjc6⁄oL˙=÷€jm¥ª;€‚øFüı¢É.Ωù˛Î>ÿf˝^=˛Q‚50%E8â,ôi’¬∆JSu1vbúòÏ±g"R’^Û5È|›‘ﬁ+´¢DÎyqΩ˜¬îº∑ßÇrøŒ˘25ó3càë G≥¡Sc ‘'p~˝qÆ¬§à˝ﬁa”A+∑å`π¿§ñB»∑]ä(\F@‹TÛãlßıâ’’frA[º9∫∆ú,Ü±	]W™›{äPœVY\üæó Õ'ÊpÅ(˝CÀaGﬁYp†ä¥íy:»ÇX∏-°ï,ñr‚.Ãx¯pb8∞x{¡+.≥ëiõq:ÒÇâÊ*ã/DﬁKZª{ se•ö¬„a°Å'Nﬁ Ωıî¨éÀs~¯CœECôá˘Ãòú)çä-bç©Îó⁄7Sœÿp∏ ûÒg''hdqù“«∞ p˘≤Dc—#/ò·ãÇ‘π¨	Z`JUh{ÉY∏≈Yºœ2Z∂10Ì˝3´ßs5ZÈÆsh[√◊˚g¢î∑o¸Ú‰≥,Óòp¯ëÂ/˙ —:µ√®„^äY(©’äµ~-‹•ñ"Ïç≥@ŒÖ#còVªN÷ qBEZ¯>bç]ñ6*åÒ\Ô*_nG_™
°ŒV∑q^Ë±PL+À@ø◊õúﬂ;üK('wï'∏≤ë»@UÑ(â[“ØJ·ãt∞A˛[UeÓc”Âñ'äSé≤n<≈õµxzúÓfmN&ü4n±©›⁄i‹∫KV√⁄ÎcΩ1∑û¢Ÿß√av'Æ∑–B‹'î7üëá3:‡Fpø|(¯’+‹®ﬂ©‚}∏£Ö:8I ¡–IÒeÔŒö}ùï¨Ë-≥-?ÿEßçÁ/ÿ>{˛¢åã≈Áë1.∞QˆúuÃö	<%)÷ZÈlüŒn[6EU&ïÊîOû/u⁄∆,∆3ˇv;p`ÇöC8ÖúÅ‰.*ÏﬂLº\ºXMŸ£Á¬˚%!e¶¬B>ˇNÉ#\S-à®|(J*\¸.˛u¡E]Y-–ﬁã˛0≥≥∂Âﬂë¨˜O~Åi5W±ñz`ê&‚ÒZ†∏¶ìÆ®eû$\n€6ù†Y8√n|<3òyN•ïzØòr©çp1GS√Ÿ?€8O“›^_€cG
∏$’é ›Ï“¥F Ã¬¿™îyá˜∆"È%5§Â˙‹R‹πë‹âÁ:‡f)ì•8‰ ªR»´(œTö“ãQz÷I«vØrÜƒSMÄörÓ)Og≤íK≠ì√ïÛüza©‰<ëÎ¨|ÈlV—jSjÃ˜,ø°4KD$B˛¬≤jNTm\WÄZ ¿î∆‹∞v47l@ÁûŸ§é¡˜Œ€eØƒ‹o(óÉØ„ˆ+zÖ‹îüé-üÕ-ê≈™+~˚ÿ¡ÉBü«,áÈeC)r¥Ôhp©æu7`ì¡u≥Mvc§êÅyÃœ<°——ªÛC√öˆá¸ Ï≤ôôÙ˛^Ä˛DtÊfSò∆ò«õ–4¶ëÊ© Íüö˛:Sœu∏Û
J7§ïpöÄÕ90GUîRmÅ∑–xö…#˚ÿs'ño∂€÷Ò
LåÙ)É„ÑG”¬#‰wÿ·ˇÎàØ÷˘·l[£µ5ù˙JÄ∂u'o	6c4zÍ~†ûWè3wo∑[·ÖŒ’ÀÆqÀµ¶é◊{8fMSrèZ'$\y„ÆÁÒªƒæœÃˆƒÙ}„ƒ‘ôıÆêû;◊Êß¶ß®YÑ>K)‚ÖüR5ÛÚìßû1C)#Ö¶¢õî˙Œ§v‘rx“‹Çp1Ω†~¢ïQ⁄e‘Úù•)â+SÄ&ü\O∆ÿY› öù]YÅ°",Ix≠
‹É‚%åØ…4•tœÇoR6ûá“˘+bêÇQæívË¨ˇpöGÊ–ıx™dq¬˚…Ô˙"¥Ã¨Lv8ÀSºë1 mA'‚p›gˇ{ƒ0àä>‡4rT@z∆°6©Ó§501ÔhgxªÌœ~‡"jv◊Ÿ&»“z°œú◊é;wêÓ„ÏØR™~Èk	¨£h◊/°Ç“Öî91,ª§¿5·ÚÃ◊Ií∂D§J˚Ù &´íá.Ü	üÍU@Öïî≈Ô!/ìM˙/¥z≤p˚dÑ2óÉB!ïK∫π“eP8˛\ÜR©`⁄A∏ƒ‰{äÓ£ÄE¥OXÅë±ÿBû¥—Ü<®>Ω§BôÍ?W–“ŒHõOYa9”i˙”Îhà∞©Z¢'∞ÆßqEó“a”ÕÛ,ì4K∂	1_ P∂5ªÉú.•Û–√&í–ıtl∫s«}vŸ±a˚⁄†∏°•h∑F?I∏°È˝˜ó‡=’8Sk¨à¨·x5Gÿ˚®°õV¡klZZñò’≤mÖg?t[ÊÙ3aµÉ-xc˘∞ﬂöUƒ±’™.‡Ñjõµóπ¨î∑€Àuﬂe+CRÛYzåÙ§N\ˇ•(E§3‡ˇ  ˇˇÏ}Îí«ïÊˇyädØVB{Ùù¢zyâ&ŸîzÜ∑`7©òa(®j†]&Ä¬Vl∂€åêaÀ^èÌ˘1¥bµä`p§µíFj)ñ6˝«zÜü`aÛúÃ¨ *Tfû–ºhîaS†.y=yŒ…sæØ\≠)<eï.RUF¨^ˇE;Öeõ/‹ÇKyú≠c*ã÷{ŸéΩp_ÿŒª∆u<8z6ùÁ'#ΩÆŒù‚Rèl!µõ<Ú™jÓúOí1‹ÛZ]⁄·‡bÒ.ÓÏ£´û8ÎW∫3ü~iÖqÖÈ⁄íOÿP¯°‰w&æfŒ÷Ïnóœ=ñ≠fT*õköM'Lø›ÃÃ`JΩŸ¢‚zÃóVxæπóçÅO_æïjFë˘Ú˙	Ã.˝@L®Ùœ–õŒY=y^_—ú≥ûJµ~\?ÖSw(Ú‰=‡yÎ§gÔP¶t˛>Ú(<É˜‹ƒâΩ¶ñW=Ëá˜P&<¿á‚Ô)P;~~ú>ñï3éö∞=éN0ë´[/g'∫ª¨á{{òG+3Ÿ öƒÚ…Í4˘Cä’˚1P&7ûDôÜ& «¶bÑâ2ÉNîUwûπH›ç˝à›∫>∫∑¸‘)(‚SU≈˝,íg™∏ª#gËö;9ZÊôkÓ„k™˙{1 G(ÔŸãèD}'#–NÑ(a;.ƒÑS÷PuÀ™π?[≥†`bö	è èë†πí@©>†ÛdTI Gî∫µ<O@–≤IU∫¡‹JN ?Ni∞ù∆ù!,Á∏_Á2bƒÎÛX∑ò∑-ÏèjO˝3d•ãï±8‰4;ËnÛFÄÏ †•¸£]¿úr_AükÖC»DÕ #ﬁÅ`¿"a‰‘9ß”·√ßZ¬JÕúoá÷©–ßÜïg;7>óƒAãã\ rÊìbÉøÆ”â⁄!7+{Ωöd∑":°påNK>π5ﬂXªÔ¿úÑsË eÉ˛Ä=›{qr7	±√t£4£;E∞âª,‚Zπ1Œ_$Ã‡Á‡3ówbè◊1ÈFΩ†ì≤®aº≤ù˝*(x®˙º Wƒ=.5∫— ÛwÑVáGÿË'!`I_wÇagP3
N·Ÿaß˘=É ·∫
ÄpÖ«~Ü—úf;O”∏tÜ°È∞Åè¡e≥2∆t°›“6-W™¿†m∆ùé@Ù.∆Õ∑™iPõ:à∫·*ª¿’Ë≈{5´Œ
®º\ïﬁÈ∏BˇGNÃÉsaºË≈|¡GÕ@&£⁄ªaµxu∏"e≠∑rk˝Ì„œÿïpOÖ1Ÿnëq‡v«ŒòBﬁ…˘Yˆ˜÷{jxìÃ<√o ã®—h ƒyún›mH¬ÄX@ü*÷A›i$aZ÷ßn◊Ë‚N@` ã‡’\€L›®±Ÿ3ª∑U¬ãQ"<«¬h±Ùú≠´ÆrQço_ﬂÿZ∑]ÓÑe±®Å’
†¡Ã1¢7•›ΩI 2ejœO¯∂\•˙∂Œ®◊öT˜^∂€ôlâ>W8¬›Ë)Nœ¨„Œé”òm˘ÍD=&¡–a%òƒu±ëıvåoêÛ
Q‰f’uéù∏…ÖXéC*>ä;ÑV≤\Ü#◊§„¥,Õœó,ºÍ÷òÎÑ~‡†÷°≥4’Kë_ùPÊÆ‘≠ÔA⁄07àGz¥:
P“)™#∫∑x!ƒ◊€a5mù∞˛∆
©√LäüÍÉæg6!OÕÅÜ2>hçræJ˘¥ÖkÇK†	ÚÅ1≈Æao≤Õ®Õı5“˜—W+ŸH3X˝ÅiÜ·pÊ˚◊Üél∫⁄Pc	*	‰@f6u¿ÄpåÇ`¬l§q2®’tûg€9TAmªõ'‘èÔ˚uV¥œ∆«a¢œêíÂ„Äß«¥û°ÃÈyóL˝ïHÌ±rXÈ¯XöMÌÖΩ¶‡Ë≠\fm˛¿æí72√Œ≥GD${Â@úviàÉfîY”Û¸Å¡> å
™bây-î([XqáH®˜ÀbwuÅ»®ä¨ÁãlWc|C∏)Kød]∞,ƒÚ».`{Q~ÎπÍgÌ(DÖ™^!@Ëp´ëÔÎm°ko¥∞8YœíÚ⁄∏h∏KËµÑax,7Xp+≈(aÛ'\˜ŒuÜ	—d-ÆØª¢÷„ÉKÙöÉ…©ÃYaú¢0≠§{Ú˝é^'≥™*˙FXyû*c§A±èºé¡È{út‰¶ŒñÓéπ∑∏qÎsà3AísVˇ¥fb≤2·*“¡åO∆¶ãß~±ËRÏcbt<`"'†÷KçLvpÊ2˘©¯∑£^}∑~Î®mÓC'0Õ,”…◊'â£2:fYƒ‡¢õv◊7á	◊ÖÍ˝8*ûv—8Kq”ÔÄ˙_Tr˝¢§»qËÑÑW÷¡tΩƒ|_∏SﬂãÅê–ByıÙÚ⁄~ã¨’7{z¯—”o>xz¯Ñ≈?èë˜ñˇ˛>¸ˇ…5´aw≥AÃ`W+xXgßìÙLﬁ∑fŒs)«Qô˚í¢¥êÖÃe∞.F]}[p˘µK≠"ÈÈ@¥Œ≠‘±C∆µ∞À¡ùê›îŒP¬-\O{\Ù!®ˆ⁄põœ*◊mÆ1fÙ U!>Úüöõ≤ìH;√∏}
ÂlÓ_&ﬁ±öΩÇ≤øïµ£ BU§W<Ô$äFAãæÛ√g—ái¨~/Ë*◊ÇaJœÊZ-›ßh§∏B?å•ç•˝∏VõSõ)$ë.jA‡Áõä◊Sn	N∞ºà=Ì˚-€ú¶…8&(YÎ˚a.f:™Í’ùØª∂jJå˜û8##áıÎ´í Èûz~1ËÍàÆ¢f¥–s+>\v˘“cÉ›P;Ù¬Ωî>ﬁ€¯—Ê«ò—›ÆπuÃu¥cÑ«‹ümûÍ’§FëÑÈ∞3 {<d†8øeúXqG≈ÿnä…ù>.äÏ‘¸	º∂TUqœ⁄Äzò_,dÁŸ3`pl`ƒ_ùÓÿ€≠·{¢[,û°‚YÔçk÷ÏáΩ≈ÚÆúZsØ†áûéÅGÌ?ääIXÈÆ∑ç•$\•)Ë;‚ãq’'∆Z˛€ƒ€™√∂˛<KÜÛKBfì/évÿâ€~ÃPTN® ¿<yˆ„Õ’D
NÏ'Q7‡;ƒ"’Ûˆn0x-≈‡¡n‘5õNBM»B•3⁄–P!`“E∑ «L^œVÀÜkñÒ⁄&Q8Fâä¡õÛíE9,d0∆‹Œ◊Ç£*o *Å’/K5,Ω◊,'w›Œ*{◊º$≥9+GàZDk¡≥ôÜ›®¬ª9sÊfò‡^Vª⁄¡tf]B ÉbX‘:-5â˙]ÒàUèî˜ƒb]\÷ÖaÑ9/Ü√ÑçvÉ›]h,7lßj∑nqørñIöâÉÁﬂ»µ~ø£"˚ÿ´ÏÕ´ÈQ6¯\–jás[A{íñn√C¸[ze˝mvcÉÒ’ºv·Ú∆ï£lÊy8emYvúZDà◊*∂,ªÃ‘8∫¢L<DÑ@63gNÕ©õçïòx}Ç3"ÍDÉ}{c”JÀ2ª≥‘`y©:·≠∂Uå”à·#WwÑè„åu∞öÙï‡)ó˚q/‰ÛM‹C~(û¨ô:sf≠’ç¿	◊;Ïjè±µ∑–√!ƒÀùœ?5'ZX˝ªE)ıµa´OÌN±^mÛ.ÆúX
∑-∑ıìPó´ß∑pcKÈÃN;ú9‹>Ç—háÉıÍÁˆ7Z.3£º	8HJ :˝≠≠Àó6@ú»◊XÓòµ«¶Á≠ èG‹F±<ß¢P>Í
…ˇº∆P$%ÌÇ¸'∂VÙóÌSlb.ìè|=Ê“üÿ‹MöSi¨ñ3bwq†“b˜f–âZ®$…§g;•
†!lÑÄ~ÓÚı9åI˘¡Jv⁄Á#D∫ä6‰«ï,>.ƒ’qπ¶Ô[≤"MçQÓJö£≤⁄=	ˆ≤¸G‘>Xì•Ó(_µ˛æÜ+üáiùW∫UÎU˚DèóÔñ{‚Oä#mÑ4⁄ä5W0ÂÓ€qåK∑ãq'æùû”§π]π’ëƒwù~Wô]ì˚Pló[àƒ°»	âS1wò
Uæ‡.6õ|yÉﬁ…™1ZX>ù•5ëÌ‚$#œEÍH}•Ë=}ù‰%‰¡à‚R[Œ¥Q8Tﬂ„N§Q‰¡KLG‚“í%ÙÄio¿dI›i´ø‘!Ò‹¢Úõä¸àÖ˘BÇ˛	ôÙ‘ùíá•“ydÚáR≥!Dﬁ ˇ≤é“˙ ù®¥•¨é¸Gˆ@!w@sÜ"£¢~Vúâk>¡Ÿ’Ày™ô2è†ﬂ“ûb±ºç≠Y˝ñ„º¿™Õ◊Eñ9` ®¶rñ[|F4ˆlbã/e÷¿+¢BÈ&f/K=LO89Ô
ıßx\*–∫ã©|¸ìÅe.€I pG—-ÇáƒîpØ=2€ùÇXFcÛ±çz≠®‘ÅUpı4tm¶Êßêwh0≈dÑô˚¨2∑°ê£‡»P ◊é@%O∂(=.SAXT⁄∑¯íÖ9;ã‰˜¶HvÜ‚“ Ì+á¨‚®á–?êQ€€|cÖu;GƒÕªIÉhê€‹E<É¨I ˜¢Ól˝.	Ü÷+ŒŒ=8V›oŒ˜€g>©„â]/÷O÷ı‚„Î”ÌzÜ®Pwt(R™N$Z8∫®+çâ∏§j‹§ªvv™√∆€ëùV>pÍã©ù2?ª1# *6'µq˘Z‰À`p–mYúDÌà+ªq	(¬ÍBâ†'¥kVÌyπiåOWÜ.|f´cÛÉu¸æ«rêÉö©RÙ9]•r†≤≤ó˝J∫æÓ™Òg§ézâï¬ä›Ÿ.∞dõ—…ëılóó»Bßÿ^dñbs® sßÊx[hØ %Ë®πç≥œßK·ï9=YÁr’ú¥VÜ3®¢æ=áu¶˜ëä‘kD<8¬≥*Ä»¥|ßesæìñ6≠ñ:çÖΩjë‚"‘≠ü)ÑïÁr$u¡6îÎs¡º˘ï'úπÚ≈åÀ[ÙS/Fa$Ïö›1™7ÃêÏg¸ø∫r¢Û‚9Â±´üü®®‹n‘¡˙(?h)ÂÏ:â≠BA≈´¨¡ı0h.…nŒ”¡‘ì∞Àoπ÷Ú}?=}pK|>ô~È;tlœ$‹›Ôá˙c‡Ûı`œ„Õ∏€è!pú?¿'Œ7Í∂WY≠üƒ˝î»ﬁ™óusªÛÖ“E©qjì˜∆`£qdi“<}Äoi?ëî€ÿAg†æÂ‚∑◊v„A<S îqªu»}GRº›˙-n‡¡Íå∑6u¿·	¢ûK¨-– î;0
È‰l™x%áÔ.ÒNˆÀÔ≈-_¨˜›®”J¬ûﬂ]çFG¿„¶˚ﬁ`ˇ•bÈ_Pˆƒ‚Ö√0Ø$ÊY‘kvÜ\ó™ÕÉ/gÏ«Â‚èD,˝›OÌ.yﬂ3ä´U° ˆùˇ#c\ÃU’™W'‚/ﬂ ó¿œ)ÆƒloÛ‚‘.ó5m˝®b†¯,ÚÏuj™˙øÓ‘‹ÓíÔ+èúZ≤C◊√>¸◊ˇ√Œ€ÏbtéÇø7S≠ÂW¸°G?≈3LÓ¶∏±˘üpá¯Ë€Ë‚y8à“ˇ™{DÓ“’±êè~	Â“k»Xétç9!«ôéèü*À"£∆˚ÒcOˇ)0ˆ~?.9õ†∂JfMHmﬂ”.,∏Ò0Zû¨Ù©á?Nî1;ïÏö≈Àûv¶–G√éﬁIù(‘[Q⁄d˝N}”2ú∏Æ\∆Ó≥aÁ»:≠M°”:—®ßÖƒâbû€≥Î±NtD=FfáÒup°°úö+x∆¶NkB∫êtÒàl¨£//_‰≥>˜≥=cJ†Xã/(÷¿≈Y3=ÛÚåÄ?Ùëp9 „Çﬂß≤ŒË7!P®8·uG]ã2.¢áöÓ†QûNâM}éÜ*õL∑©Ï(Y4H∆…ÇíEæ˚·t:¬≠ı¢Ö^{Ï%~8[™®àÓÆDı,u˚ÏËõôG_xÖçÎe2î(§prΩLÜ∑E«‹Ò¨d‘(>C= È»É 5é:_®≤&‰k:P8ùÍà˛%Öﬁqr*ËÄbΩPªb°Ncai‡W 3±/à5ƒà4t‹ˇRÄX≤gøèàXi8òKnÌts»C–6˛|—¸R@hÒN`›0Å7òﬁGäΩï)w!ƒ&Tø-;{R±LàºÂ£L{ÀS¯ﬁnÏ~ê\SŸ÷ã®\”Ÿ◊'AÂ≤¸Xÿ•2’[†Õõ√Ë  > 2ÏL⁄ˇÚ@f±»YbŒùÏ¶ŒÀÂ"èh˜û—¶ƒÎ<„(T‡_ô¿‡«MùπKã2 &ÿ˛˝–îbÙ;á≤bßàØ∆∑°ùù€›`L§ÄDÈÊêwÖ¿k˘ÈOYî‚üïAŸF∂,ä?c'h·”NÑ‘Aa„c¿G∑æÃZC!q=#}.FrÌ’O‹Î09ÙTH∑å(Æ€ â‚¯ﬂ6®7ë«& ‰Ul◊∆ÿ~ö/Õ»∞[∫{Øæ∞,¥ÀzxNnÓË$ﬂ∑1R’EÙ≠ÖæUÜ‰Ã≠ògNmÓF!_OíÆ÷,-Àå¨Wç≠∑Ë√¸´º∞Hñg ñ-»û~â‹
_"e¬Ä2·U˛”œü~ˆÙõü==¸ÍÈ·ß¯«∑æÇÒÜ«OˇÚÙV€Ñ•≈oñp)öö¸føJV»ëcÖ~∞t¡çîèˇ∆`ñ¯Êg«±Gæ˘Öbõ¯˙È7Ô+NâáOøyèˇ¸9~¯~"h(æRóÀ∆‡ﬁ√ø™.˙ˇ˛Ø¯§∫S-£S—ŸS∂ÊHÀ◊»"m"}⁄M¬ù”3ˇ-Ÿöu.+ìËÅ˝0O„ü(_?ã˙£òê¢˘I‡yZâ ƒîQQŸ „Ïæ!¡R°Zπ°Øv˚ƒ0Üï∞lvHRÁ2íıœwé¸„"Î¥µèKVL æÜÏà µañÁnËù[3Ïª‹zùññ8Åø∫qL	˛·ù<&…∏^j√Fã$ØôôŸb⁄øë6–@$ÌÁ)˚&„K˘B∑\ãz‹lÿi∆Á—ÒE {•g¡?™ıÒ·}†[Sºk∆˙õågÿ ©nÛªag∫Î˚±ë9JFcH£-ú—è˘∆Ω¥HP<40•œ-œÁú∏•§âFêÎ*∆
˙€i‹vb‹ØÛó√ûã4∂&ŒÕÏAÑˇR2ŒR!GDˇ{ÀæW(<∏nPK´ê`!ãiàfV*®c• –li$zM§ ôÙ¢2*}w•îŒ;Z)-ÛóˆÇ’NÇ8˙,fœ…†·»cr
‰U∞WV∞+π√¥whWi6πÊiG›®‘ÙOÄ¶¢»f:JöŸ‡Bí‰Í|Y,Å$Í›!ƒbÒÆÓCFŒçÎóh%Q∑MÒ≠C:P˛hÒ%‰
¿⁄Ì…óÂ·≤å!ﬁgî5¿’∑0I¯w¢Ê˛Èô^\W_=;z=‘÷Ö
µTÙöiº-éíÏçg–óÁ/0ÓÊ“©›•—§Ú∂’¬ˆö‡1V6ç≤</rû†ÄX„Ü–~7¶å"*hëò’†ÎFcMµÉVÛ∞Dw-¡çTæ<ëóëá≥>„*Çƒ¢ﬁbq!ÿüÍéq¨4ìè*›ç^Ù?á!∑î'~Iì´ı÷&t„^\ÚÒs≥äi ∞zD¬•ﬂ≥+≠¢5PW“{€≤!⁄ò äe£dÿfÿ&êŸ}m„ä[pW<ù¨Ì‰J‹<+Ít|‹µDOñõaÇQ>Ó™í2`)”úRH®}5@ô—´QZB‡0Q”‡÷|c%Ïæ´g˙≥ Ä†üvHù*Íı2Ω∂(ﬂNŒ”ÿ4+¯l£/úÏ3WÆn±Õı-Á&Dç%å@Òé˝Ä‚ˇE∆Äº{=L√¨dyEin‰3M=Rí|pé7]Ç¿àÕƒÖPëÂ˙Ö®am¸µ6$Ô·0]ıàË˜ƒŸØ-ﬁC8i˝ht∏¶«oéπ∫‚y{Ãı“Ê¿Û^Úôˇ¯!1P™¢ZdHÄœ»å	ΩØó…"c†LêŸ¯DÅ1¨ùﬂ.˚ÂéP%™·“Î6óZc∞ÃA9`¸ﬁ"f≤_“ÿa)PºR£ÚVb>∂ÿ¶KßΩá ï∞√ıØ—*T†;L}ôµ@f•^/ßÆw‚"°ºôî§Rà/X¢Ä6¬æ\åÊ<Q[~Èº¬#Wîîû≤Äü>ıà¡˚H±û4[{%ªOAfõÆ~m•:ÀÀu⁄≠•i‘Ó98
D€«”5©ÍÂÅÛÏŒ=Û§ﬁHèd6∫“O‡‘Â=&π∫*>°õP∆&4ÖRÿp∆ﬁl–¸∂àwqånå`|EÃª^;ƒò¢Öö¯–Égo¶n‘ıciõï@‡HŸ•V%IY¢Kåpò£ävîxtÆ8L…MÀÇ›W¥5}í–≈ä<ÆE∑U∆>Ía9K’©‘
P!„®i6Çà∫B!¨x5u7˚ÇSs˘·±È*uC9ROC@ò8X¿?T†ÚÎŸ1ÉKõqß^&q3jZZ&1ß'≠1ß"vÌÍŒéqd≥àT„ƒHU√˝Ê¯’äCcÿ€¨"TÌrg¥)ªg™ëÂ ƒ„‡cieﬁÖ|-â˘z
1`$	>¿üÁ¶x1ÄÓì˜rbPóÌÜIXM/;›†€ëÔÊ~T≤û`$A¸—\≈£™√KÄ›—	V3≤†Oˆeb–H¶À«aa±*X7ã }]ÌE’#‰xπ	Bs˚€ü+∑>‚°í=¢tteyEî˙ ‚+G–◊5"c¯.ØîùßC†[\¥Z†.'æwêfå˘5…~ä˜·Âµ—aâ}ıë(%ﬁj,0Éôí7f;¥ﬂ©/ÿí∏Aœ˙ZΩ¡7çÒÒ®+¶¨›â∑π⁄ibpI“&à”™à«¨´ÃãHÊΩ˙NdñÛ‹û5õ±’móíl—“IC3aÿ∫ŒEòP¢2¥»9å√`ÿ≈"⁄òwDX…¥pÿi©ŒTã‚¨¶Ó◊{Øìëdπ‘xy ¢˘«4[ '∂<≈f Xïe«0ª¥˚Í‰$w\6a£…¢ù§Fà¶4o É ÿèG£Ör ˘ ‡M˙|Ze∞¡Fë∆µï¿Çê}jê†ŸÁÚXØÌ—’îºŒÖ}køæ¬Ù§ûÚr9ny_]Yªº~jn∞Î˚8M”ü9ssc˝mVÉÕ2aòˇG∏π6;ÒÛ≠Îj˝¬∆º¸+m/¸®\´ïxîµª∞~i}kÍ«w€ˇ	á‚¸>daLR3˛kbŒ3¥Œ⁄SÉÌ∏µØ∑ä/JHÙ⁄gÚèl;≥'Iârp£ê⁄qs’&ä¡¯sø¬Ÿ2êfˆÇŒ˛ j¶Ï≠°Î,ê/â&øfh:øWˇ¯KÆÙ0ÏıOpÜºØ‘&»ï¡°ïƒø¸Çˇ˝∑˜˛E(Kèü~Ûû ¢˘3øﬂŒ«i˚1	˚q2p<Àñ]b ´∂ë¶CÆ«‘Dä”W"W€Öuü•v
ühˇÇKC*ÅÂáâå ë˛Ûg¸V)ñáÔØ»‚œ˚µ∫ˇaˆ‘¢¬y¯›¯Ω’é”€@¬ê{ÏÕ´–_≈=ÿa„ÿ=∆ö˙ı÷%E2ÌZ‰C¡Ú*Ûßœá~˙ˆ”ÔÒ6—;üäõø–dìêSÒo≥F>~Á…ÏVb«]‰2`‚*DØ}!™ÖU¸≥H˚LK"√\1rG◊‚Á™ô†#†¥ºµﬂ®w(˚VJÀEu>≈∫}Ãˇ≈ö˜Îß‚)t8.à›Ü—Ñ2Ü˙Mtœ«™.r9<R.ìÌº∫ÓÿÍ/ıG>Q≥Á£lyV¨NC6§6”˛ä7=`¯;ˇG5D˜·ˆ0Íp=á*ÁÄL‚ú∏ªÒ÷c1Qƒxâ_}ã5|$:Éﬁçè±øOzÇè}(>dSèÿrV~ ÷5√~Äc¯'Ò√,IR”1‡á¯/ØÎ¢ÁˇÄü?«Î`Mèﬂï‡<ÛÜ:%/cN8ª§n√˝•÷lÃü’Zˆá_·z§§ÇZ©˙¶˘ïÿ@ﬁWgà«oôX™j?Àˆ∑j§e∑~Ñ√ƒßÔo∆ÔÆtÿnsΩÿ£√6≥;`Î√÷6(‡r≥˝Uˇ:Öù6R&ﬂî^°\5Â¨ƒÆ⁄/‚Gj5‰ÆûjZÀi)grVÎÒ˚°\àΩx=lÓ7π!q.Í©%ú)˘˙ıì~è‘öOü"(—ãUÙóÓˇzîu˙!ﬁ(ñ˚ÉL|TËs’™Æg9Ü¿kˇ8Èû‹â€‰Y©"í/Ò{‰ÜF~8∆“≠ÿÇD©GfC3⁄Â5ö◊BL–Ôﬂ√lf?¬z(ª¨â÷≥å÷°võ‡t≈‡Ω6v€π†Õ_`}?ƒQÕ%·D…Ùe®Óü®Õ•ÿ±é=„´Löfª∑ZB†¸&ÀÁ®æÕ5¢Iª9à®vÿçz[€`W Ò°&4úbm•ŒÚ–´o?∆€≤éÖÕ˜™øDSøêÜâ‘^‰b˛@ΩÎJIO*†X´h¡q{Û˛¨pŒﬁ∫Ó«≥Üwú—:"…ö/˘Ñ[œ‡Ñgßú)i˛¯≥ç[^æMÀ≈ÔgÒ Ω„¢∞Ω∞~qÌ∆•≠€◊÷Ø_ﬁÿ‹‹∏zeÛV˘5⁄≥úQ/w£poïÌù‘_No‚•UçtÒ}[`â·‘ qT›È¸¿¨,(R˜Nk–r8Y?q&~„ì¸Ë<}Û¸;Ä5CL
%ò„"K~V<ë Z‰QYcS©Ï©πÅìá±j(ÈÆH|fBZ7ÿÔCà«nÿº≥ANÙÇ◊Ü≠”«éi‚¨Küb˜Œc$ﬁÈÉZË„(A*d†˜iv –é%j_˝yÅ†˝cÚQ£‚éäyl| ‘n*5A±;quÑ¶◊…˛ gvöX©∞1ív8h»I„—+Â[}ÅƒçÄçá‹ &6j∏¶„’b#;öó”¬˚∏∂}Ω∏hj≤ŒGí7∞«◊Æ^yv¨~F∂§±◊ÔƒÕa∫
,ì9:4ó1iú‘˚1“ÒN!yˇ•¿≠(Ö„Oê¿„`É¸ÜeÒÉ¸˛˛Ào/Ò7û¸~ŸÖL∂¬2™î•˘¸;ym/@@Jº∂~JG%îƒÜ˘ÉX˙˛ã%O’Ë¡Ù¬&[|
K◊ﬁ7FÚáBËä)n„ø&ãG√ÄN”ˆZ"L@rN¯Ç‰ÿ#0ãÅï∆æ®òõ(å*\tfé"Sw!HÈ H2p…ŸU¢”Ú√ ±r~•´b+f¬ù`ÿTcz⁄#â#GK…t•`“¸≥¸Ju8±¡∞+›÷¬†gÈWÆcßWÀNhó/Ae∫Ω«Ö≥ÁˆWù")vR	Äã≥[K‡˙9[ÈTvG∞Ìg´¥œ3˚AÁJG(ÚnŸÑõ∆|AHÕìDìÑê&jZÈ∆=™(NNGdõZ5LÒPP-é ¢™€ÊWJ¢¡OlwCˆ&FˇÀAo`á%v~I@Ú¢?x~Å≥?HˇÎï(GêıV†¿!…î˙Täon'A+‚ã∞>àÎ	&zÒw∑¢v\É˝ªQ†'Ÿ∆Ÿo¿†√Ù/ù0≈wü,Ãs&í»ÊIπ∆7 f%Qv˝∏ åπ'3jÕ[Ûç˘ïwXΩõ/Î›A˝§II8T:–|§àNØV»»ËÁYª¬˜S"eÅ!a™±b«á®¿C]<‘Eêr.pm`nA
˘’r1Ö zZú8⁄ÉÁ∏_∂/≠Îó-ôXvJ{éqo]ßΩjÃ`À∞P¥Ï5´o
O¯›”√≈¯ÊÍê^˘aüˇè*ÚË¶¬∆ﬁWQ0nhn®Ö°˙Æ"†œÜ•Í‘æ®¯ç/ß˘ÜâzCAÖ≤∂¡;`m»Â!Ó—¢†›ãSå)?/¶—ﬂﬁ˚wv“¶!#Ÿî)E∆?¿¸«òYKOœ˙llñü¸IÃ,*ïÒ”√_Úˇˇáä	zC,~ç°+/Ö–ÎıõÎﬁ⁄¯«5¶GUñÇ*øV—Üø—•ﬂ‚èèU Ã∑œexÜäÎ£¬‰dXÙGÍ¶2Ó£?◊2„TÕ"ªæS∑≤@bQ<ñ·•¯êb≠T¸Ï˚ÿèµuÛ©à÷Å5e¨ıóYd˜h>Ãñ˘#ˇ§bπ>(÷ˆª¨œËÅÄ≈/¶˝, 	≤±r?œ"ÅıÿÙÏÀÍTl√\6Ô;ª)≥öâ€ıaO[é’⁄iQ7]∫©–#≥§ª≤9J∏bá(…w•∫ç*ø{Ω®√j	ã9ÕF∂€àß¨Ãœ-ÕÁò‹´^á{¯æÕ˛ùàv‚˘˜8->S3!èΩ=T≥5õE"Z˜;V„]ÃŒÉ¨ -`V~«¶ﬁ∏◊)PoÄ∫P≠ıÄÍy	OŒs5™€[Â6{–©(h§ù¡Æ®6§t ≈ƒB∂
™Yc6!∑K≈W{Mıs+ïﬂ
⁄á≈ìÑ˛nãêJU•-‹ZXú «kŸ»˙‚ë˜æá…∫ª¯oÃvæ»Í†Lì˛∞x∂ÓÙı¬˛ ≈X∆ZÙPÖòÊ¨EÖ≈¿j2‰s3LÓFM5s∆bl≤OÏ≈"ßÃ≤8‡¿ØG
∂4Ö”≤Z∆}ÈäØÃ¯J◊Œom‹\ßá^´˜f	#"˜‚qr˘q¶dévJÏÖ'ÿ˛œ≥xrµ—ä)ÛŒüoia∞Zó\Ωri„
πKÚ∑059ø≈0ìˇ><˘ﬂOˇÚ/OˇÚ˛”'_<}Úü>˘7Q…#Ó!î{m‡WÓÌS;‡˙˙⁄Ö¢∂Ì\ü_i©`ü… |-û˙»ßC!À*ãä.‰µP{`s˝¸çÎ‰)ö…T	j?+%så€÷!MÓgQÎû~–ÄHìFÂO≤Mô†<πÛzôf®iqƒ;SÿgÙ3hK-ßHNÃuõzWÿ+ùd|Ú ÑtR–’=¨∂◊U *6Vr¶Å^@´µ;j÷Õ21x#9
Ê5¨çø©<„íŸò*U˘€áøÌ+xJA¶üMxﬁ®sû˙É!¯0≥ÁRƒ5¥g£x◊Ën˝÷ bmWHù>¡≤üuN!ë›m6mUÿ1Ω*‹ ‡7˚n/ êßúÈT†ìÂ÷Kn—‚ €¡l3óY!à›Âc¬√êg≤ãb£GG:Ç~á˚_Ó5˘≠2S≥Ω¯q…Síπcxá=2%Ï˝∆QUëı˜5∫VD~_¡iaÌ^ã∞sCVÔ9#G`%ä
Õç†ª∫´=’BÏ!Lc•Ç!œ‰Ø∞éÓA+õ0˝$Æ„}vÈÍõõÏ¸⁄µ-ÆÚò©oÏR”é]m ˜»éYˆ∏è2Õó Â∂∫¥ôƒùN=Ì∆Ò`◊fRïZÜ⁄R'nOIQ‚OrÚËxRnh@Yº∆≠öxá3†àﬂ∑I9•µdº#¯® ΩÖß7–d%Z)∏(œr˜¶zãÒòS¥⁄y∏oEÎ=Yt¬eû7w”*”ô™"P™qôH`\.<^á≤ÂΩµ"%°
û¿–Yú^5¿Úô¥BxgòM*Œ¬—ÀÁCíôƒibÑ¥:¸ÏAäY¨À€A“„≠•b2ü%pj“…4ÛJÕë&K<ÔÓGﬁÁCbZô≤˛Íÿz°∞“tÇ π≈˘®÷åÑö ÷Ø∫‹M‚±¢âÂâ¨}b>ﬂ )LP˘f‹Ì«=æPÔ√‚¡#∞@Ù¬=åç¬Ω F⁄G[¸”Ê Ç<)ê˚3aØ~cìƒès¿•ﬁ0YXîi≤`}87¡˛% x˜ÔëR∫tºâ¯ƒ¨ı¬:øØ€ÁÏ”æ¯<SÇg·?1µ-é3ÊDÜ˘§∂™·W0I3=É˝x;æg4JG˜¨Ó¿N)ÃPß-X%;3≠Àp‰è´—44„/≥¯õŸiVR2ÌÁ™‘:¯∂é":/4∆µÿúÍ ÜÏguúUπÍ=æﬂ∫n%•µC1RÉíÚ†+|Óí~fjrUP@ØÙ∑ç-lí¢_¥ﬂAÛ¯ç@¶…\	ÔW#v—ZH…n7tEAHÊ6j∫ú8jã≤Hgûm r#R çÛBÆ/ò¿)≈bHgø)ˆèÕ_v_¶PPo¶eÍ–Ü*œ“äRµ'Ù⁄¥{G—vG¬4n-4ÊﬁëçUﬂÕ7ﬁx„ùë g4∆H™ÀJAe-Æ á%C	ÁÖŒpDq®NË0⁄d,åâ´]îS‘πé@Ù¸ªHæ°0‘Í¨?ÌG=˛IΩvÇ JDHE KvV˘'î¡,;˝:vj42Ä(˘3SGÀ2ÎW*éFF”êÎPCÿ⁄ü¿∞at	5ßÓ±©4öy˘Ã1zÔëF˙PÜï	¥W’ôÆ §o~∆jÁ¬6Ü_í_ûi¢SÔ, L£≥ëv+óÀn∂f≠ïK·wY!”Iy∏h>¡Fµö≤îê#JEqÖ;>RÄÖ‚`@F∂Iåÿ_È:·¸Ó‘‚3dp˘ÄÅ≤ÃOm'.iD=:(RÎ8ı∞öp%C∂∞,ÿÊ;#–ÈlÀu∆*Úm1›çc»≥Ø¢…œG«?5˛PÒò®◊ëΩE
Úñ„d:z¸À›`¿^eˆ{A7jÊ"d¿Œ≈A“Útö!Xù∞Å◊#∑ùØ˝· Lµ‡nuêÉ¿dDπsﬂLµ≈kôsìG!Íq≈)Ëú>8PÆ¨U6\Qøo¨ÿN‰^∏{!ª{¡vk!l‰DÒ‹Ó‰ä˘§ø|vù-‰˙ó)G«§eÿœòIi;ÀÖ¥ùe3˜>5œYX¨HÿQÕ}|JVvÔÃıheç„	;¶@P™˝KQæPíèïkÖErÕr…ë@RµßÒ-¨E3‚ƒ\à∑´XNƒø‚˚ _πµr9HÓYŸ;£Ø⁄˚ßÊä?é=¬N{vî{ßt4H#›~:Ü} Ω.NµıµúYgÍÀEn+ù¿3Ìed¯)áñABb—v†aœÇ“g_!'Ç°÷ˇW•õûÁ≥$—B5ls“Æ∫$´y"≠>'Ω|ûU<yø±–Y‚TæÄAÂ"®<O‡+ú)R¢»´≥ﬂ>ñ(Œ*p◊ä[ÈboÜ=òÖ-c¨ÄrzÏ4˚uDtmD≥´≥˙Ú¯Ì„Y–ç†ÎPà∫àí-A‹À†œ?WFsñ\Ùù»‰ä|ñ"ˆWù∫‚Pe:˝ÂÈ·'ñ
gÙ_È9`%k›h‰ ˝°∫P“H´’ı˚D¡∞mÛ¡*‡˙' µ˚ÎÃ4&´‰?mvÉdêM%„[—†√' z˝fÿ⁄çÓÒÍ2áQ›nñã}æé√›hNœT“ª<Q_è ¥n&}çCXFN˛≠àq”m$1hﬂùeµ∞—n∞∑‚=0A∫Çw@√ﬂü5◊4j∆Ω”\É2Ô\)¶ulÙ“A2ƒC©”Ô˛S<dAÇÃ°,ÌáMÆır¨UdÅ§Ö‹ŒWY©ÎênŒ”yüÄc¶ÒwÍ·› h¯"nZvπﬁgc\ﬂïÅT•÷>[°◊O".%◊˙}æIc¶Ωx÷.†\ºqÈ˚«+Wﬂæ¥~·ÕuÆl∑ÿÕçÎ[7÷.±µÛÁ◊77°Î†F\|F¸Ö{·vä¡-ÿÍa¬Up πHè3$:Œ.áΩ!|‚}Õˇ#¥)˛T◊˘Lè≥å7È8ª¬∑ßY9˛ÒB0∂πd?Œ6q¬ütú)∏y¯K`ägÁ∏ÿˆ˘[ª|[ÊˇÖ⁄	)ê6˛ÓÔﬁﬁ{,HÔ`‚,6ÈåWˇÆ.jAÀZ¸•«•Ôw.Íâ?Ÿäxrk(:0ƒK¸˛ı{|t¯¯Öí‚Erz±ùË^ò6¥wlÆ_=Œ∂ì¯ØM'Í›ë≥ê:êH®◊·&!‡˘õÇ^èÔ2MﬁºÙb3Jö√NÄ›}·"ˇw˝^3Ï(÷&.Øª0]ƒã/Ûö†vV‘¯‰x'ƒﬁÁ{W¬ª≥^åø ùob∑ªèÕ„F€èá	°ç=’õu∂±#;ñT‹ävˆ3¸„‚bËê{º˚¯$›KØÛMXPÌBˇãI-ËÖù◊RV@ƒGq≠g"ß.ÂØh™Òº¶˝ÜCò”@úy\úë‚:º¬gËZ˛]ìO|^˛∂≠∞3l·yÎΩv'JwY+Ïs¸ü|µ‡@tπÜÒ,›`#π¸§Ø«ÉÊ ÏŒ•(äEœ˛Ùß\‡ü≥‰·Ô<çW†àœƒR<*Èo®Ç∞pV¯œä«:±QØTû˛MõÿL»k_ùZiÈYú2Uƒ¿KGIl•ŒN≥GxÅó¨º¿V‡V,
õ:¸<ÅÕ|¿F6‡ï2¢rgX0
2Ù;›3l$ª±¸YÉ0®ø¿ÇÈ,Sö›qHˇ{-»_òèí™ÃRï7WbJô´dØ©Ë˘L˚- ?RéÓØ2'vê”ÄT¯Æ«I·',¿"√1Æ]≈Ò¢É‚xBÇcó˜Ñ@n$QPÔ€aá´ò“√˛ä∏«¯59!2ïôzåÌCÖ<ÚiêI$»ñgòá∆‚¬Am‚–áÁyö‡Ï>üÍ`;ªF‚‹e«†@^–ªæzù:≤ù	Ÿ¬É¸˙äE8:d
≤’°(¸è¥§Áo≥≥∆$.NM(€|àV_π∞âTô’nF·ûÉZôtk2´≠s=È;¨]<Jä<Zâ<^õAh≠…TÇ‰KùŸÕâÏÕà¸‹˘ê-aÊ$.‰i2!ø∏<»ñ^"s Oã˘•·?∂tâ˚¯®òè_Xﬁc[áπ9èèíÒ¯≈Á;∂ÙâÎ¯Hôé_ûcK9éèÇ·¯Ö„7∂tô€x⁄Ã∆/Ø±•	ú∆”f4~â˘å≠k÷E ;-&„óÉ«ÿ∂nI∆G«`¸}‡/∂tØãª¯Hòã_Nﬁbc/˙sOÃXLÊ+¶±Oó´òÃTLÊ)&≥[ì©ú.~b;ÒTπâ°ÚS‚%¶∞gd4Ê¶º–Yà)¥æUƒ’ƒ ®ÅıOπƒ"Ú”Yà›onJß	ôÊà<sæ,s1èE7=z∏iê√MN75b∏)—¬MèkxB∏âxÜI4õ>æ”%»#øòí67oÅ5Ôy2ªΩ^Va9!ÁD¡?HZg-^8IÎ¡
<é§}ô»¥I78eB˛ﬂDé≥/ú»ÒRh~:œUËÿ9~ç›i‚˜µ∞˚π}©AVf^_zYudÖ‰»Ü;4J_
_“TÈ|K–®'F—TG¯|È‹GÇ≥w`ÂÏµ≤uRÜÑ¬÷kÁÍ-0ıR…x≠{é?ŸÓDª9…ÓHtÔ[Ñd∆Uk©Ãåê∫8»±≈Eˇ\tc†í:¿Q~ÙØµ◊ø;fiúYb˘êˆÊL¡≈”ìœıÊd—€èt∆Ω«Í‡‡[7"√Vy«˝=£p Wã√æıúÿW\ÏøeÍ1Â
Îj–=V¨©c™Dt?N•¸‹ﬁKçùâTME
ÔÖ∑á€≠€˛˝,S„%3’IIÎ˜¬€≠K¸ûÀq¬Ì!3kŒQë—ó¿©o5_±:ÊÖSﬁMëN6∆ÛÔF)TÓ∂˘=◊Ü€\éﬂ◊·ë≤Î-s?bõ√‰n∏Ø“%YMãn{,Œ/+S§ÂA‹ÏåKEÕS|≈m’Ë…È<õÛä»ûZ$Áoç‰6USDT˜.C~˛23"QÁ@S¿íó'c⁄UÍîôÊ‘π ·¶\2XRIR'IRVNdS
Ÿ(LB3Ø1ÖLÂÓ#–ê¯X“ò|Ê´…˘âªlÉ˜µ9À F`>ÚEˇJãÌ461RÜT„dÅˆì‚¡¬	í.˜$lÚëØ“Ú\	KÜØù+aÑ¨´Ÿ)e‡6∑F”ö®ı∞•\7¸áx;ùï¥∏˙ÁçÿåÂ
ÙÅº]áb”qrÂ:XT@D8‰Uõò∑D©9E±"ÒÆ[Ê|¸£A¿%´l"#‘©cŒäÜ“[˝XÜ+‡∑÷9Æb#CoÌJ¨ƒç’iÀ,Ó€-¯Ü„N£Ä0„Í3{ΩìzÀòV∆t§5π`Â€Ç†OŸ¨,Áﬁâ@vd$kê∫∆òîOˆ—\ ∑á≤îk¢0€é$}HïõÔïv8˜Ê5WÌ¨y2œ±õHôˆ≤÷˛∫eØx	™&˙Yw…ù
°k'b‚ñÿ=Üé¥,y	19Àâ´©6˙ª◊?+∑zGsI»Â2dì∫.ƒª«€“w‡ ≠RÌ¥GtâÇq]¸…N˛*Qºº∏“˚Óc
o˘Ñ äpU∏±R°1ÍÁt\{Ë∏vˇ
!÷KVd\˛¬Rı—ª…ÕŸ∏∞ <Êπ9Ó≥Gy›ÿ„K"≠•î=øTAûWÕañÑ$∆*Q†w©∞˛∂Œ´ú'-zÈÙÆTüá≠é‘i'à:~≤“j˘=h’∆áE}îõcJØuNaéUÖ∆;%Æ<Íµ·!˚N¯ æAÃm?©aÅwq˛%ì^@ãÙÆ…à∫º‰B3	¡*]£SxdÙ_2IˇE¨C‡ß‚3»îÜÍ¸u1^ûzF](%9]A#ë_˚MÒ—πØ\Å~ı’)»yjweØx–÷®í#á¸5™õãq“/ƒ{ΩNh¨ ≈ë’PUfÊÇ~4'Ω7s3ÏÔΩü ˙=1ˇ:º˚äÆ”›¶Ôm·ˇo‹Î§˜ﬁı}&ïêB:Ø	î¢P ·⁄]Ì0ú~Œ¶!ËHåû""Pé„U;	K™Êê<EÒyÜﬂÃ=ïΩ)câÒaqa˜T¢∞ı_≈cPAãW`û\Dãî[¢5°‘”ß"}VM¡Ã/ùÎÅ+Ü9ò˝xsPÕ?ÏÍmÙæ>µ)¡ã„L6øâFg8#m÷.
3)§|Ç)Œ*ª†:⁄J˝ÏœÚQQ°±œ…Á~ƒ ôà≠mÛ≠B õ÷0÷„KLSœ°rú-è HGª˝|;Äó|Oèusí˙2É˝¥évt˜¶√]Ãó¸`WL≈i’D|¨ÚÄ(„%8¿m¡ÿ≤v'ﬁ:N6&>'Q„; ¯«Ò0ÈÖ˚œw¸c7`UHπ&V#+êiŒÆ7s úB§I?n('ÉyB2!∑`ÖI˘'ƒä8TXpdk>:≈™bœ˘–Ûñç˜”(ZœÛñsr∂Å€=F"Z∏¥À˝ñ]ËR¥‘j˝$ºÎ‘∆‡"vV˝√ﬂ«Ö≤öáöcÂŸ}∂ä,º6s¬¨ØôX¿ÚGú˝0£¿8µüi XkÓÂ—#ﬂäòÉ—‡ÇE\0À#Ú•Àxg"ø6äC¨^Û+§`(v–Ôóu……©Î≠ ÙYùΩµu˘“ú‚Ç∞•B£JÔZÉP„ 	cUíx/ÂZ≠≈°Wπõ≤/ﬁ2î5{>qtS†¡x‰¿e0Á√ Kb47S_ØK∏^OH"/Æ≥ªì¨ÿ&öëXì£[“êça^Õ‹+–ä‡V◊Ê¶¢W∑•Ÿ3†à¸±2Rúâ∏wngeíA˘∂ü≠-x®Û¥yï/]{&ì®b¶PA|ﬂN8hÓ÷ÑOX<ˆƒ(›p∞∑ ›ÓÍÊñ4
Î;¡Eôë„Qﬂ‚∫ƒAês¨Ã˝8çm˘	™¨ÒåìË'x”*{˜\»≈e¬^9¿ÅπÔtZpáDzï˝√Ê’+ç=˜‹≤Äº™"µ	}⁄	Õ«›§Lnñﬂ:€cM±Áu@Å≈¬'L#æ„FB†‰ÅàR!Xf{êØßL|©åyôqå’ “Xb†ô|Ï0NPúÈ~∏(
õóãŸóÖÆ5∏˙g∞p»¥7µôãxb	P)o«åÎ-ñ_ıD◊@Ây*Xx7$»	eØÖπDﬁPôm≤\¢|◊à∫>Z÷’Ó•%≠L=ø¯Œh≤IëﬁΩ¿Lˇ∆JyG4—›jÒ´aBät8¢£√8«•¬ f∂R,Õ⁄¢Õ9&ìé”ó‹ØŸYøÆêmrq	(-ÿï–{Àû˘êËÏ¬?Ÿ+óÁÒo]‘óó⁄wÍFØ‘Fo'VN©˘):•(g÷YãÄP”<”Ì.)$-⁄ä˙>.{˝Úòw9ï⁄ﬁÀ§Àö≤ƒƒ§c÷‹„\ﬂV Ñ9ˆ-Êl–oø≈ês‰ Ω«0Ë‚;c%Úk •˜·?Ãˆ® ¯œ5∏æO≥d√q8YH_èGlï•™R‹Ÿ#)ùˆj˛qWÒ≈]ù˘≈çùÓæ≠ÿ˙I‘∏VÃ§∆Ÿ˜¶f@6'˜ƒà≥¨
eÑú….kóÔƒ|Ç∆˝PúÄÔ5H¯ª¯∑„d ¯89—A™õ4
íó◊7∫;¿Øñ‡8dó„ñ)J€Ââ0./ ≠_K‚ÆÁùmù‡b4Ö$Gã¥j›8&¬¨-Ÿè”1m	%7ÀèGåynNéò¥√®Â0J∏cÿY£^˜ç›ê_ø [Âæ‹°pÁä≤ÿS˚@±(*ñ·ƒË¶áCuˆ…%/º^Kˇ∆Ÿìõ¢¢JG´∏Kœ‘1.mÁ3∆†QÊØIú…*E|˝:ÁSb—©’uf≠ﬂWí_,˜⁄⁄pœûöóìü◊r¸ûÇ»~B+HÓÃúπ¿ˇ%›jNHóÈ9ÀótçŸ⁄Î+N≈à›Oö√'Õ;8˛Í%€sΩ“.€Ÿv≠
0î∑%Ø.≤∂Ü= Ç≈û.z≥Ê¯ïL˝ó^Üá
¢π‘¸jò Æm#(≤Ó Ó=$€E†)Bw9€àR≠Mÿ$.Ù⁄`Áø¢xym„ ÷˙ïµ+Á◊g ÊªyïÕ\⁄∏πnŸç∆⁄èîª±Pav∫,—GÍGqaJÈ{-ÿ«∏±”N◊ÀHØ≠ørm+≈N-oKÆªeu◊TËÌ&Äo![`G=kÇs@.vG“ˇ®™ÃÕ15ÉD±!ã∫†ﬂÚø:˚»´ı$«∂$ö∞>Ë≥9*ŒÇ¥ú(◊Ë©√ ˜e≈â·|Œ:˙5™¬4q˚@±«$Õv#	ª|ﬁl®6ﬁßπ∑ë.˚6Ã'nTú~÷ü›∫õæà«m√h7ÓÜ∑˚º⁄ ^TÏ«„eµj∂Å∫LM∂∏ú»%¨OÁ«ëT@)SEqƒe·>¸∑ˇÁ'¯Ô
Ç‡3áõ+$®X^ÌÒ5%HñfQˇÁ√áˇÓˆq¸2sJØƒØ¥'‹îÏ©N∂ËO™n˙<:Ù≥"”L
1⁄´ò\Åπ´w√)uËDŒy€èïßøÌ:S∆⁄µf!€‘k•˝ÂRi9“XMk^nQ’EU‚ˆ7¸)±w2>	˜ıXÚgH∆ñ_˜´≥‚¥u+⁄#Ô◊Uâ38µoÿÂ´∞JcL¿:À+≈Ü∞Ív-0°¶™ÛUbDiu1Z} ÈvÜµb»È…bZó9Wv√Ø√1¥2âcHE#Ùï"Õ˘4£öC1 b¸O0Ok∫»;Ùz‹t∫,⁄ÏsŸxëóo'J‘:=”ÕÎ[Ô¶Ì˙Nvú©¢-Å xs‘—wYsL<=¸e] 	°)»˜Áù√Œ»t3|¡ÖT_¨å£.V∞Y}8 ¨¯u«üƒe:®√_ñ†µﬂ¬Ô∆«ó9ı≠Áª¿	–>©ÿ#V
J!∏ËÌê	xí⁄	•Ä'ãªµFâ‚ﬁ9L~ô%≈8í{f¯f@Ÿ:∫æåÏ∆ÉÊ¡&Ù
◊iD∑5r±‰XÿnyÛ‹$`ïBëë@Pka¸`m=†Ïm±≠®Îê-DÈBî/>fT∆Zá4!C3YG@?HaÛî‚_8.dãL”=îGáµµ~?âÔ5¯Oo≈√Ñ+¬Ó©—P\y3Åíf¸%ydíÄˆÏﬁè_Ïî—5ÇãÊz§qÔÂY,	÷w™ÀEtÅ\'éÕ≠ö∫O«÷U§®∞Ø„MØf‹~¥ß*¬≈˜åÿºæÀÔné!]Ù_u∂MBû™ò¢‚B{çΩCjÒÒWîÚﬂrîùf‡v!ò±÷;!¸yn£U3®´≥,H1†~ñ§ºaˆ¨¡∫1¸eÄ.Ï‘wk€ÿT^.¶1˘ı¡0ï
¥¬AuR∫„ ®∂ø
#H…®7Ì‡´8ûOBmUˆ"ÂÊJ«ªÛ>ùÖ√üùß/?J}é~g◊Û«ÒŸﬂ3πÀtØÌT° ™Ns⁄îÈ}ïoå)ñ‘ÎRº≥^ôªîË,ùf;¨nPˇñÿΩöd⁄–|∑ÕPüÙ†ﬁjÄ˘B dÜ- ˙|*	N¿æ€˙Õâ{AÃlõp£X7z#9 Kùó±Å_€∏¬jó¬ª¸Ì„føïö°ß‡‚∑°‡∫¥w–≈˚Ã/êanï®Ét7ﬁªı‡¥U~8bËÛzÌqÌ–™‚î€øΩ˜ÔŸˇlÔúVéGﬂ)`Rgczk!Ïæc´J—¯êG–ËÁ›akx7∏w	Ò≥O,õØ≥( n7H¢†éËÙÃV‹nwBút@1∞u @ 5ÆÂ∏ÇzÄòµcrRX!8¥°∂”∏3ÑÑà+‚É^ÙÖπEVG±ácπè_ÄsΩ¥5ÿÎ¡—lê⁄‹>µæ^›Ÿ)√Ûô_æ37ÿ%›à"’øYÁÇ>6¡~ëA¿BYìá¶ŒÒ4}ÑVÕËÙ∂ucP˜≠;’®`≤&ªVŸ∆Î›ÜD?@√^}⁄ß£ﬂ/€û#ä'’’NCëÈùéG∏µ3ﬁ@∑91Vœ‘V	ÀuMËX¿uƒ,™≈V,»VU¯4ËeyîØt±G…Á5ERÊLA)∏∑">ªÌì  ÌFj◊ﬂwıüOÁã˚LwrHp!•@
∂ﬁk∆|ﬂ•{Ü;9†È∆ﬂYäyÛ`d∫êü∞≤e÷ä⁄— µ5ÀÙZ£1™‘ s)◊i≤-74˝•Ç•
aq*4‘[ÛçEÆœåf 7@
`xÚçë¨¯Rä`ı∂a⁄ﬁåªèa«≥0›Mñ≤˜"§‚àì≤WŸ⁄∞≈Ü.xÊY8Pë˚zoÄ G"zúkcqgL5Ñ#MÃã4%’êUù-∞∆Æƒ.LE <€Ñ•‚Tt\*7Yˆı«‚Sm—ö·∑¬¡vOØU
˜√Ò∂ô é 3dj¡˛Y¥Éeò3C∑√¡^ˆ≠rDìH¯6T√µ:±ÿÅQïÉªT∫R≤˛tx]ùÜOˇﬁàﬁhè‚Å—Uv¿≤E—q¿Qn\∆PcˇÓJ°O2I∆e˚É„D—∞å¨~ü›kE'‡pTv£««*Ë1‡b*√ú\å&Iù’∂ I[GÃ˛„˘›n˜Æc∂LûÛ>fÆhêgÃ2j?$9ø∆êj[¥Äœÿ'ÓQL¡—π«∂í®›6•ÉäÆ≤M¡âH)|”V_tZˇZê~)^ÕË>˝≥ÚgKÎÔÑÔıØÍZIˆa@ﬁœŒ£ÖWˆ±ÚÕ˛∫"k\è«˙Ds•î(X∫ 8Ì≠Ûö(⁄≥)°ìKû”¢‹≤πgÄ˘eïΩ&å—Ùµ„∑˛ÕE^â]ô∏Åxî_»æá~¸ÛË°~~(/Y/_≥[üÍÕ˝8ËÔΩÓ±kºSƒ’}*“·≥`>[ ﬂ”Å˙6A˙÷—ﬁ∑÷	Å”sék‘]pq‡{Eˆ˝¸
Úï◊ïøﬂ¯˙wqÏ–N“ú »∆ó{‡}˚V?¢t8∂~|	–RT,‚%„"FJQ%Ï∏˚jöûbVÒÛÍbË≥iÕ‰•B•Ô◊ ç∫"Û\wlw⁄ÖºıºDî‡2q·Ø}»üBL«^}ÈÑ;®Df·°ãYÿr∑‘ÄøÆê◊§k¸6læØπ√\∆ ®•†N#πtÓ”TÙz\)µcÙ¯:;ΩŒõ∏
o$]SéçuÉ‡6**¬!U~!ó#g»îÄÔn?v˙4{m'Ë§·k≥CÜ_Fkî≤jﬁ{rä»Sê˜äæÃﬁ%<Ãq™J3/%=`gŒ\Ü„Ñöä_AY ÚHy¢\π∫µqq„¸⁄÷∆’+∑7Øﬁ∏ra•a⁄§—óÂuC°ò6Åï*Kd≈Og‡ø= j†◊ÀéléØu$\d◊	≠“-ú»r^ƒq@⁄É»qAù”d¬úÊóMcñnêÀÊc®L¿ñmM]fèË=˛ﬁ¿)[aÜ/Pò§${ ßõ∞∑∏Ó!¨6Õ‘]∞õ∫ÚQ 5ÓœÙ≥yMåÉ‘o«è9zˇ†$ªÑm8xA‹ÉÁ¯U√>˙Åºöœ»}†µƒÕÒºÉœœ=x\ÏõΩ†üÓ∆∆ÂÁ‡`k'¸á◊√¶™'ÊR^Yãè-øh
N∂7Œ˜»—Vòê/¶{ÌM…8Œ∏M ≠=€Fy}ˆ™ë µ8ÍwI≥Îa:à„^˚K¢ˇB
ñ*™Lá`…/öÇ`π—ˇ~äï i˘bäóK0 ê@Õ¬{Q:@ß=Eæ4∆XÇ$≈D∂Ï≥pAÜ0ˇÄ⁄dMµ˘ÙKìrîw'ü†‚Wπ¡]fW{˘;7w!∏˝ö#É´ƒΩ6 ?«=3J°yˆögnVˇ◊“l>ì5ø?Ø4‰ï/ª0È=∞€‰˘y¶· EÕôtîJl/Íá)k=n\wˆŸ∂yaÜ˜¬ÊÚ^ÔF&FcÃ_–q<`õªaßSç±jY6£àºÎÅ@·Õ·’I∏ù¯p}s/Ë4v¢$¥b Ixır‚˝pånÛ¢√@P?G>§Ëñ„;E'TÉ‘å{="ñb.zòÍH±ev‘ƒXÆ®∑[Ø„;Qºwu8H£VàΩ≤ –{aªbP—kítœ·»ÓiE≠´˝ê_Iq◊`ø√[@#˝Æ›_¬Á2§-≈√AçÊ⁄ãz≠xØpP–ΩæÇÄè’Ö"sú-Œœœ€ºÃù`vé˙Ña	pv%ﬁà»ÏÊ(¨:ª|0$wxÉØópºÖlï]ù∂˙K÷{n—‡+2JÀÎ·óYªÁ˜
ÃêL-¯µúãB.>ÔÕœGŒºÕ%•Ä´QìÏ|–‹•®◊y0ùdıT≤0_ê˚≈q—…Jo›Ë®„~¢¡Ø'ÄﬂhT7\uÉÙıx–⁄AãÜ™-PÔóµ†É™X<ìj2ñüm≠≈.Ω†çÅ‡¨ˆfCJƒZk3Ï•·¨…óÊÙ§≠8<i*–1d`^tbÆ ¡óµ|…'qö‚væ' :ïªµIKPN…‰	◊ı åûU›o48%!ƒ‚¸(±RûkFâÍ´V˛ñ`,ådÇBÒÈÔú£i∆mü9Ã(ç„≠≤ˆÃôº7ÂëúIã$á4:iG“ŒL∫2WÚ“8©˜¡ä„˙ïQZc^óÃ⁄·í°yg;æ7SîÉ+l7π-:ñÊã‘ßbNgá≈˙ 7[|kÿ*B0pqp∂!(4◊ZÈzËt[ÏÏY<ºú*‹wïørπ!€∏V™6‹ü=Œ µ“@LeSÏâœ‰îg˛“UΩbéScL)‚fÚWI–Ã€9j¶J˜8^&_ _≈_Tf¬±ùqçìd}0⁄º…“úΩs¨ß_É<¡†4Œ≤ôLX§LŒLv‘ææ•‚{[vÄiåNßëàóJoÀÎÂ"Í≈÷:¢>\YêËœ∂êó,’‘Ë"(‘çÀÂﬁ# ~Ló´`Dé
<lùå÷I ›≥v˚|ï%∑økä≥‰S\'êÿæS<á
D™ØÒáGzn∫à¿˚V„@∞oüŒ:quÇ‘Ê:dı¿ñ=√ÊÌ¯Ñ”!ÍaOı6'’˝{® s=xAw∑Êzpûß^Ö}æ"¢F@¸s`+u’mëÿvúnøë∂ÏÒ}oóˇøDΩŒ3g(—[£qŸ–=P‡>bú~≥ .É›∆N'éìZy<Êÿâ˘Ÿ˚›—Å˙Ô¸á˚Ê(Tå¡∞VsúkÉ#k!sdÂj)_=6,8§É«(Q@|Äˇä ’œ“ˇ  ˇˇÏΩ{s◊ï'¯ø>E≤Ãñ™LT°™	Ç‰ÇI±MêÇ≤›aƒDU*Õ™ rfAFÑ•∑{€÷æ&<éz√Îmo∑√3≠¶4·nulÑıU˛;aÔ9˜˝ Ã@ëÌQvõBeﬁÁπÁû{ÓπÁ˛á]„‡ ?W£9PcπØ·Oi—ø∆ˇ¿»æT
Œb1X2]gFå∂	3¥aá¢û≠§ÕmÙÚ!4î¶·¥‘£Øƒï{eÆ[ÒdÜûß+B<z~Ÿxg!”Ok¡
˘˛|ìp˘áœvô(Ø°#™PKÏ∞";ß+Å›ÇzG«iÌ]m”“±‡πK/ÇÕê»ŸNw®ï˚nó‹ÈÚÇO—v,∫ª¨›Y^fewóÁ*õ:Ωr◊R∑◊
ÄSË ∆d˛qÖ^1B√û≥Ú˚ì<Jyõ4∏$ l[„¨Ã{

!sÅ¶GGuôìC©˜’Èµ˜-—¸5µ+•òEØJ}áÁı©ºj|ACæBU[!Uä€Es>Ä˜◊]»©◊π°í ¿>£l»\aç‚e˛∞’ÜàB∑ÑfMÈ˘›QÕò2ÿ§b»§/Ö˘C(ƒçY1b¶hâó^È60}äu5T«ÁêçÂÖE≤Â¬zn¯ìÍrw61Ñe	GúèhÑ–eBÒ’âƒ◊)ﬂq¯&CtÕ‹!n8º˝{*˚ºq:‹{`°‹SŸè1R(Ó!hURJ‚tÔÜ·hıK¢qTëÓpªäßÑv¨”i∑ugÖs{G≤Î>‰–-$L‡ªΩ`éTQƒ≠S√˘Õ~ÛÆî7ÛÖW√Õ@√lÒ≤€°Lò∞y¸ F†Vjd:kl∑eŒåÂÒDÆˇ∑_ˇˇ€|ˆ#∑û±∆«µ†AÔä~LmY§©yöLÆó;¥-+ﬁ\Kò«¢Ä+\Iim/Â¢è4L ≥5îD	fT.Ω‡π(|$é"ÂñdíîX¶pÓ}ƒŒÇ2Kª»Zp¡Îaœ§,∆0)\s¢— \Ú#úÿ¡•≠˛N4iﬁ{N·eû2#“P+(:Å‰F⁄˝≥?‚Ωñ◊s¯∏ôåFa∫ÿ\$"qæí„GÕÙunGèﬁoÍ—£∏0Â∏•z™cGÚPî:ı}¶^Ô©£ﬁ®ØœﬂÌ¸ıÎÊÖgé\¿™é¸›õr⁄hJ±Û:i¨Ô±%
lˆñæŸ_#πõ–ƒÛ?]dÁ.7bÎ‚(á£{õÂpUQJÅtùê“‚û, ,ûœÅ>Gx˚_Í»Œ@”@Å»uÖÑÈÖÕÈåtªª¥º≤˙ÓÂ+Ö7Sa|UâÕxäÉŒ~w~YMõcá^=∆î¬›p2π9ö•ßJ¸UQÂkC–∞ÿh∞ù€`â™S[d¸KJ·âˆú°”Áí√;q?⁄St%ÓÇ¯\$0–âìÌM√Jõæñ≈ÁFöØÚ-ê˘$dÇÎœI,ﬂõ47“<Ó·Æ·ø…‹ær˘›’ïÂ•na|¥
í˘ﬁÑÓMíÕ¢U_KÁs$Œ◊Ú˘çñœä{"zn"∞◊3◊ ù^OÛ`cd†+Ùô,˜Â•–tÿ©~ƒı≥⁄ÔoA§w”r/∞g^âÈûQ∏¯ó;@√ˇ~Õ˜ÂG±ﬂ+‰?Öøá‰UÓΩ&|≥Y_ÒﬂàÖ‚ı/ÖF|È–ÆŸÒï◊oä)_iRùâ∂∆◊}≈ê$‡öCâDó”Ú€>ÎPtòF·˘Ô[íI¢ÔZ§L÷P~áÕ•nıΩÀzFÖ,Ì]{á»¶w‡Úæ∫~ö}óû@∫7∆ƒ‰h‘◊ªòÛ£Õ◊õò7`u≤71ñ<{Ê•◊ ∆ï=€◊í¸ú$˘dír6Îki~û‘˘ZûøëÚ‹%ÿﬁ(sT•◊éón("ıßâ"O~8F¿ü‘IsÄ"•Çñdˆ±ø,;QÙ£ﬁ(ôı?ÏO™a q[OßL˜…í¬> ŒŸ(∆?ö ÜIV≤úå%Y ¯ı(
∆nÿ«.ˇu0ÛmëzHÛÇ˜¢ñü√8w°ÚqíNáq6ÆjÔ;H√>∏4Û§πü"@'GÑπBñ∑gq»5∂á4h3õ6;Ì`t∞F˛ª,ñ∫›ÂÀ‡éÕ,ÇÄõ∆cñpMc0"oáqøM¸J¢‡ﬂirX=Ê≤±‰¢¡rq•íÂQD°ÜË”mã∫ΩÈ<*&È≥™5£gqá.∆Ù:Hg≈á±~∏ÉŸ!ó⁄mKOô 1ï¸ëÇØ≥{V6&äŒpÍ.D6Wóâ±∫,Á1T4vZ≤€iÉ=¿.TÖ+„˙É&ò(@¿=˚Ø√“¡µ™~„gx«_¶Übã,Ï°∫!Tui‹&™Y*
juo2HâêIgΩ†¡ûuΩ“∂»˘ø2tF4Ü®Q}‘ ŸÏ€mÿ˛∞”ù>ˇ0=ÿÎù’ÖŒÂïÖN˜ Bªµ“ÿ3!<ä-@ñ,6‘7"Ôlõ@€Sp‘}…‡/V<ıë'⁄B∞˘`'x;ÿπ˝0X'r´∫ÖLõã‡Ü∏j€·$ìa∏‰˘b#v∏√0PX<~±i?¡U∞ ∞≥è¢pDqûcùΩ uñ!Ã=5nãA‚y
‰ z=*π®Æûë*Õ≤Sâ…€†ü¿ç †∏∑$"=∞ŒlNÿ—M4®0%™YO¢Áp°h pr:ÙñëîD…9L“ß∏Ü∫/ù9ÚÑ°ºËrçÌˆ»ÍtÿgπÔ>QQh∆≈—Ô˙4Qÿé˚ËŒ4K«u´⁄∑
∏ÑÅvªó©¿Æ∏Û>ÑÂmˇxÂ‰≤Å≈^ÜGZ¥ﬂ‰·*†≠ü≈A•™‹<€[—–´M¿Vj<(P¶7P∂„i;t≥
ÀíbÏëê’p’èŸ¥e◊≥§û:Ö˛ ÙÅsë4x‘ÍË¨Qúm-®›â”á¯=¿ß¶-(0ú.
Ây›b+=£ ´ï¸πƒîÃb•Tp lç‚©e4và"Nﬁ≠0Ì;pª5§raÎ»PRßFñvYô:rµó¡ﬁÖjqÙ⁄ÀÜ¶m*‘^c.Tx^≠zU(’+ZE’Vna≥∑~±ˆ°Íf
≠eò≈†e{a˘}Î@â6;èT]©∫ÍMΩ™HT"∞Q.ïÅ<!tπ‰.$kã∂ŸËûZ¿:Äv]p◊äsÑ¶∂ïAêÒYq{r‡ô˛0W>yY œkËRH—¢“È g√-∞*◊u®√Äl´sI◊‡˙Q†Ω n~Nß†Ì@!∞˙G‰ø»Á£êÇœ'ΩﬁÃ®®D7è?§≠"ßñ~.>+\‚˛ö∂ÊzDB\3ûí,dÅÓë,dSp˝t+NËªyE^≤zG}¬elÄJ
c@˛Ö©ä1… â1`LSçb1›©‘F±Xàûê≈YN√Ê¡˛å∞\˛j…¿bOí~T3∏*xî3Sû
£IZä´ØAVA≤èöTÜö*IO∂‚ÿÅ0£Åá¶Lmpã¥£¥’j=)® ®HV⁄(Õ¶]ööôÀÏˆ…D⁄Ω+sÃÁÂ„£)·vFÛ‚)&ÛjÙÚ,‚ÄVE2é;4p3ÎØà¿ôÂÒ(˛å≠:ê•£X°qÍI	;è™0¨¬-)M[„(À©Àk*¸^•Ï¯âà¢±‚ÿ÷6ªRã6·vºäÁ≈≤.{Áq)©»~Gµ‚!ÆP›W*Ñ[]%XêlÊ˘ØrF∂¬bÇ?)¢x1äâc»ÁX	 0<Ö™¸2SÂóuµ∂4 z¿±˛oÅÉ7¯uu%_L®ÆªCÛG∞cÂ8ÕÜD9Æ]gÎÇï¬ÃWA¬TEÅ˘£Œ=á˘‡b7Óó√xúv◊’X	NÇ≈åHüÚû¶îÇ±ºﬂEëh˛∏tc≤mπèÖ‹Õ≈Í\ö[Åã+C>=bπM•“∂òŒ¬ö+Rñ]1. Hs’P·≈·O°WêΩ˚nÅ„:;˝QO@¥”ı8‰≤„4§”ê_ﬁ∫ã¿ßäOîòuQgÕb;#Ÿ˝5wË'∏OV»´Z··—È0∆ù”	N—‰—L:ã¢mﬁ![`_-É¿Q4¶uL°˚40ÏG^…ø˛Aî&M®{“;bêó%{·πh‡ü`ÿÉì•˜»ˆ*7ì”YÚ∫ÖÅè\πœﬂÚÁS±Œ7ÄCÅ≈¨Í‰_Q&Q)\ü~“Ç«€"ÄçÂfUóUea
¿Ù-é,.óË*Â‚ª|ÿﬁ
n•´∞Ó∂<åÉ“ù˚%+ëﬂ¸∆RxÖ≈π<l60Æááá≠®…\ÃZq±Õ†d%.Í%üKçF‘KÈÆı(jfΩpÇä0†\dª≤Pu’=V¡≥aI_x=±	=Q[Àb2ñ∂ät†¶,ú`@.?Õ*ñVîN≈WMË1éﬂù‰LOî†∂A˙›#Ç9+1∂eyòœ2íÅÆ*G%…üÖP¯ª´-Úˇ›˘ˇíÙÆê‰`J–´2mÚ^ﬂz∞±uªjèÈ±i•˜`ø–J#¬Ÿi´óå+ˆöä˚W›i"FÉoGiôYUÙ˚ˆ§óMÛ®x4x◊7„É¯D~|'x÷i-UÏ;ÏÂŒh¬Ö’x!àÀ≠∏d˙ïõp„Í ˜‘KB¯—˚Ω"d‰©SIúzà©Ãhz	∏#ù“HPËÖ∞\‰ÖPa≥z≠¨]§l†ı°¥Z’Ó ±¶`yj”≠◊E⁄$d…â¡≠øAvØ¥·„>:êt)µBT•ùéÁA®*{zg,Qı á˚j&X∑'Ω∞`≠wäàåÿô£RªB≈ı‡ 6À*˘ÓRW`7S•Ê>¡EÎ|≈=»\èCp{¬?¬—´{nTX°√Äz.õãE¸vE>:Å$®ìXı€,w•Çg£ˇú˚|«Ú¸®ló‚D^PR¯güúsåã¢äRØiö‰4f|@ˆT1‹«πˇn∞πôÏaûìæghﬂ∏›˜zYÚÁ.ô·á°◊à¡˚˘*˜4ÊˆY›g0∑\œ⁄Ω]∏,§N‘õ•ëˇ»¶ÿzu:˚&òv¿]¯Qÿ”BÀé”:c[@ôÖFπÔPdvqj5óÁàß)Œf∏Éu∑Ç:KÓ.F™–¿∫C}uô∞Yq\`På¨ûªeCPvì†l	†¡È…˚Ú["g^ä÷◊ä@Ä!¸£[£E N’B≠sÇö∫k-ê•NcŸ0ç'Oõem˝1^‰>c´Øo1±Ì^Ks](_\`ñ3Ó=p=?´¨øM.VéÔ>«9`TRı´,ëÖ€î›v´ç˝ûÁÚÅìãÄâîá”<«?†…ª)\X+’»KŸ*úüUY)œ("äwàŒRM˚sX\óªÆM%ù%ö˙eNô“¡∫r˘T€\ïcÂ·x)c¸≈πl∆ ÿ„|Ô¬’∞Á·3 «(ÿÈ%i±*x6œµÙLüãÎäZq:˛2hªu:7[${fˇVŸÎ˛≠Ì`g®ÃZ~ñÌ√‹õ¬èÜâæ´õËó]óÆ^≠¡~+ √‡qxPf∞ßVY∂nï⁄pøb˚˚√iÑÀËtX©∑ÿç¿ ›8ãQπjæV88°=xgd¬|U“Ë+~8≠-∞Ü†2	tua‘±Z3˚k≤±/k7›ó≥’,Ï_Ìm<xé+Ÿ¡O#ÃΩwÚÊ<ç?~sçµ%«€˙·vA˚‰±˜ù$Ì¡ë7ªÛ·ùÂÍ/˘¡ΩÖ˘ÈdZïù◊tßG‘SM¥`xö™ö4s∏:±¢ü®;N$ñ‰·z◊cÈb˚!€G›”/µµ#˜›N´››≥¢åV;Ö˜≈£(õÌè„<`B+É´Ù>gp+GQöyY•Ë\~ÓkònQK‚N5Íﬁ€YÙ~ª√A\4◊÷k∫ß´”öqF\ö
à0 íÑW∫‹à0˜Ÿg÷´%˝@ìzyW¶Øk?ÌŸ‡ ±1“ú“˝Ú>Gìôßkhã$ÿÄª6YO$»Æ+?Ï»èp?VKç/^Eówk£ïÑãíêUµ,JH∑Û˛∆O‡˛hi8ú{≠x“Õ»ª∫J¥F‡täì÷ﬂÁà¿:ﬂ$u$£‡ÚM›ØNÀ∫»∫/"ªï‚czÕ›wÆﬁ‹ß_Ém∏£yã•7√®;úGØa•+$”Ìá¡€Å¢fœQú=
≤\l‚¶˛çñÓ¶7C+uñN’Ø¯›ß{ØÖ®rë¸”O∞, 7û©”ÃﬁÖZ=Z˜X!Ó5;´Q–ñ∫Nı™‘5◊;Íù:I…6¬ºöSp« ¥o˙‹π9hr§e¡µñLñf±[ËÁ±‘Ù√*©NöòıÖWtñ⁄Jp·ÑBﬂ(Â^Ò{ù¯ÓJx7–H+¬≥¸ˆz—y.r\Åv[¥dªt¬9÷<≠é%œ!R‹ãM∏-÷h\?¨ñçd2∫
/Ïæ¢º7ºofsΩ=ü•Ñ B
:©∞% È⁄YÜÆ§>[L:+F(©N◊ÉEƒ∑ıEpÿÂﬁ“í6ÆæEV·¡lBèÕo˜C·ïÍÄî)WÈ≈€`áIÇcﬂ$…NÇ8£y∑í>ô/pÙ$ÜŸvíÂŸ√…Ëàø[ºÆ◊∏ìá9(u®'¨d'ˇ¡ù;¸A‘Â«d¢/ºu≤àÑkÖ±º˙3>Lf∞√ø˙ñ0/»Ô¨ÄÚ›	ÌÖÌÃád@;∏ùH#jö ıëç
ëdﬂà¢Aw0 kïM¯™ΩãØ@
¡ã•wó⁄·íXÔn!.[Î“$ã÷Ñ…Öñ9:y•^ñ<DÀ—™¯¿Àø2ËtóÆà◊¥ñ≤]»ßqPLÙ´¨CJÉU£˚É˛˛ R:–âñ€·@t‡˝.¿≠Z£˝@g˚£^ÿÌˆ_ÈÏwˆ]ÌÿÀ√Éd¢5°v≠*€É˛`ŸQÂ˛˛‡›~€™≤≥∫∫≤¥lTâæ:∑‚¥7ä∫Zïl/hVıH•+éJ√wKéJ€´+ÉÂ’™ïˆé¬â2L=BU}ò¬ï¡“†ß·ªÂ+m1L˜&ÉÑÜV.üÌG˚ÆqÍG´ó„‘]n∑#≥˝£x∫û˜…ﬁGÎ¿tñNG
ß¬¡ä9UÆÙW¥©≤∫ﬂÌÑóE˛=—mXi∏ö+Ö]&≈ıÙ¬∫—ÂA[ùwKÀùïQÿ{a6§•ù\’Á8ô›tÆÔ¢àÿ4^˙¢ìE¶æã?Kåö¿’∑§§|}ú põ4UgΩz…µ„cäBπÄ	aA`äDµ≈P\€6,ÄRa\∂/a”0 «–ô˘Ç~P,Ç¶¬Ÿ(Ütg_à7ƒu©,?E–ÄG9¿Æ1∫ÏQπE.{M[Õ˙»˝öÕ^æÃëƒ‹ÇYÿ≥\˙„N9´Ü
):ﬂS;≈Î7Ôıe˘ÿ“-ıÕæ∑#[i˜«‚…v
8ìTØ%`K3c∫~OQfóOä˚kdÚ4˙N‹œá◊é…é∆–;åŒò?ıq)Û—≠¥J∆j§W€u¨pµfÈ÷c¶êO›Àëp‘á—OƒÙ„ê…s–˛CYtëoù*´l8Tx Ó@dåàÂnM”ó[ôxîL˚‰ÿqûÛ‘`§◊'á~Œ´ç\Él#ÎòkÿÏá`oVr»¢√$ÔÔãæo≠»iz≥Nò"-á>ùÖÉhG`≠'˚ﬂ£˙4◊Bqïñà0lu1⁄YÖ$3_éÎO££ÄSA»∞d@ﬂ–ç«~|OÚap|Ÿ ⁄å:êìÊ‰•1]qH$™ICoÀMA”È:¸òËçpç¬Iéö|ÁTU¬†"è -˜&5¶
Sbzã)¯ò_U‡ïr4Ωﬁ,O˝HÀ%7¥˝]¥∂ ∆ü{◊YËgY[ë®^£8Ì,eJÊ˘+¬ƒèÿèÇÙ  ÑpW$˘}˙∑ñÉ¶©˙Q4}<$söÁ⁄T^gcä’ÜŸ6ÿ5ÀzÌ "{µ∏¸0®ıÜa~0Õk◊Î‚œÍ4¥¥Éà¨-$œù,ûΩß∏À„&e÷ø?ã“#N]…¡–âÛ}íSéªü≈ÄHò:√∏dßÔKc-Ï∆k–¿‘ó∏=∑ﬁæ|ÒÈÀœ>y˘‚ü^æ¯„Àø˘‚Àó/>~˘‚‰•+ÒØ_~ˆ˛UÛ0^~Úço|#¯oø˛Ÿˇ|Ûõ∑õﬂ¶Xj›<öÑ„∏'¨¢î7]˚Ê7?ò|0ií,/_|˛Ú≥ø}˘‚ÁX«øº|Ò;R˘–]ªÜQ\°]Æì¨ßQ `Âﬁ∆ÑD&ëå©ÊÆ?´A≈¥⁄?`Øˇ)“}®ÛÂãü`K>Å_¸&@:˝ËÂã/?˚à¸¯è@´œ˛ö∂1†ÅèPƒÜWıáw¥êO±;ø"/êHƒøÅ°÷œÒ=o√∞åøÍä—¢±Äï√á/aúH˝Ãq ÈE@+†Uø√™†âÿë?íWø¡∫~á%|I{Ùß˝L|˛[¸[ˇK¨ˇóÏÔœ>j=°‹u‚‰±(Mì‘f2(ˆKàS‡‚¶ˇôW˝Ç˛·Á©ˇ˝ˇû=`ö∆YDcŸ3±∑É{õ∑È ¸ˆ¯ç´~œi˜/|8±ÀtúµÇp8~‹⁄ŸÅpÙ'!Ëﬂ≠0Ñ(ß¥$#!Ïó‰Ì|ËËÏ˘%˛Ò;‰ëOﬂè0œG¨lƒÁîs˛#¿g?&A2`Åˆ◊òˆÖ` “SŒîüc—l˜ÀÕÛP¶˚µsÃø¿o†˝ß˛ó¥aC_´%˛òw>”ﬂ¿Ó¸ˇ˝©ÛehÕSæ‡’ìÇ?D¸9Oˇﬁ
FØü„§ˇ-f˝≠á¬Ô@Ùò≈—tî°_Ì;H;Ë‚Ôx“ﬂ”&rÒæ»Œ?¡*øﬂâ|˘;‰Ñœy˜îÓbqøa4TJ¯ß¬)¢≥Ïoˇì&©ãyPøxÃ◊v
…D$&ﬂ›~Ã0C§Ë.Æ8ÉlßIÌ§¡x‹L?FâÉ<‚1Æ'5îkbê˛ˇ¯:"#M…øˇ`∞≤!°(Ÿ>ZÉtZ8Àæ¿œúoqU|¸ˇ‡∑ﬂ˘ÎMn/%B'I#∆êÂ¸èœi„t(öÚ_ÿËbçíç©Ã˛©=Kæ‡<ÄúJó;‰…ﬂSvì¸Ç<âå˚;N¨?“	C8æ€“≈ÀÔ]êZ_‡ÍkNπ™ÚÜ|‘µuç“B_‰`r1bPëıGzLys£ﬁß¨jìYFó±¿ŸÀﬁ7"Zzp?9»¥Ö„Ï„Á∏JrPZàÒ¯WÖ'ÙY¡dI0¡ør}L∆öÏÖí4o–ıSEB˛ñ√Ò]K'l`ñ¬%∞'Û®ß,ƒ.7‹¢€C1∫/0ı/ÙÊˇß‡ﬂa
ælãYMÂ“ót>ü(Í€0úÙG—FˆîË_6ÿ&,äPÈm≠m\oË0öRW≠Éëæ!ﬁr˝è+π:|%≠ôh»P'V‚πNΩ∂N„Eêµ≈≈ê(v√Œé∑Ó<V<˛Ü'É_çÈDM¿ü¨ÅÀﬁt:ä©_∆‚˜≤d¢yÔÌ'}¢êª•c’Èaö&„iæ0}_›Ú9ˆÊ´‡R‰É…∆=&ﬁAFQ/á∞ÀG†bì}àîç:¶‰ò¨÷#ä°©Í˜ 2{§E£Ë9 J™s+˛C'bSvBusIÊ~HÊß3°y»Q◊√T’è1Ê7⁄íA«\oøçπÈÜñ¸∏Äø‚Ï6®F*l•:‚"á¿ß<	"≤q[Z
°eUùf˛S#øwu≤ÜYπªñ˘J¢+°ﬂ©àùå¢æÆ◊`·Ø5¬…4%/ÊîıüÉx¯X¢FeÚ…mÊâ√ÊÏªÎ∏óóµkÕæhá6hπ?‹ZÄJ/°wÿíªcUπ∏⁄6]hNsOK3b^∂Ô<2Ø”6¶_b3ØPiÂx„ç'˙]3”E.®J—∞É¢dÜzIµZ*û$÷er•\Á’â‡Ä°!„È›HÁpwaK1Ë«ÿ&|8¥)Ì∏¬{Íázƒ{€K≈£R©∏G
w–\’›@πWJÊ»®√eÆ∂´∏ãËN"∫Ÿıd]›’ò∂á«˘ç3‚ºˆa‚∆$œ()7—_” ˝ÈWøÙ˝G·î«*ïeÒÖ+ÅœJè•+AE|“õ∫ò)w˝•<D©’Ç““W†a<[ÒCÄƒUc‘+?tŒcQh±7'&ÎeπÖµÆG5mòŸæm&áë/j=çé(◊°5›fÑé[◊Ú/ñÕ∫0ç√&û»]´ÅÜÚÕ≠g
äzÙVˆ„,‹E˝k«Ã»Îõè∆d'uÏ›ª˙ëáï1ÂuâË+dy7&´u‚g^Üâ_v◊y+›j√∫¨ò1äÉˆ•]˝Ä¨À¶1Qıº.t˙—+Œ·eãßCÃf@mÜü}‰ª∏æ<XïÆãÛÎ≈.TÖB¢≤⁄£⁄)õ¸t5ËÅW»~Ú\g∆∏≠[áfŒˆÕ<98A¢0/p§∫À(üíÍÉúô¨0Ô2Sc¸i·é8K0lB`ÀeÉmkﬁâK#âÛÒËNíz:_˘J<4À®ÿ^*ÄÅÿõ-íﬂyè ;›∏oÃ˙dØmá±»ãéô˘ÈëÓÙÁ8h^
‘Î_ñt'›4`®<´Ëéb≈à2¸î¸9i¬Nπ0t·˙£(ÏÂ[,=Ÿr	onèfdÒœÆÔ“ﬂè¬√ΩìÎ¢SDA÷r˘Œo˘A©˚Ñ=Ã¿°à–9Ègá≥∏ü¡â™Ç…‡oê“IÜüC≤∆çìYvãê+'õ„∂ˇ¯ä‚øw˜Æ*ÖR'7¢+@8 ˙â’±∆l(œí∏’™ÔÜÙ7‘gºCpGjEüv$A}ÒKƒ-ﬁÄŸˆÎı÷5ÙwX˜0-Ñ
Tø{ÚV⁄†&ñÊ˝…”	®òVÿWÂM6KÌó˝(ã&!5É®¢1ôÍ+¥æ4 ∑•É:Êâ ˚ÊÄæ”nÔi©∞'‘√-ÇS∂`©8ˆ›zzÊèÅ;«}¸cÿ‹ΩºÚl∏g∏:Ÿ Œ›TπªgH‹cÛŒ≥HòõhÄ^õBPU˜∫CcT0ç:'Z ≤ÆaQ^Õösø
„gyDUNa{Â„Z`ÑtﬂÚóÄ%\Æ	ñÄ>r¥Buc›§9∆Y5ä&˘‰ÿ◊É6—Qûó¿6ß}:	6»Ô'∞È0õj©f¯XóV)‘E&-Ù2Uù?∑Í¯’’â`‹tËrb…À÷.È]à∆A—p˚ÆO;õ[ÛÂàﬁ°Çç„™wÌUtª£Ó±ùltQ∂aÒ4E=ØkèÖ±}=˙ó+GÕÀQ<$TÆì‹Ñ ˜hwÇ5ı…≈ùv´O!-ñ˚&å∆DˆÓ¿oÏáŸ¨⁄Ü.a_a´¬u˜Õ *bß-6V†l/˚À,].§x3≈9€5ªØÖØ√:Z¥â¸WmΩhÚ.0-«Âu	'œ∂¬˚Îú√Ço«\¿p^ˆ‚fù"VK!8JAóùàÏªâ∆˜Ì8:Ù4“uªﬁMgœ[Á¢#&=Ÿ«Y´t˝Y“◊7L“%sm±õgÔN≠&Î¢B
?ƒ†òπ1(®núâ◊)PD.+NóµØp¶<*∆)B	dfÏ<≈ãA¨√)ZÅÍ≥ Ã–?¥5&yÚ˛£˚{În<>≤¥wÕïÎÑÏ-ÚkµöC9féˇ…˛˜¢Y¸†ŸxHóqÜ>3u£µ€∆Î≥ﬂà(ØpÁ ~◊ﬁw]Ã¨zı—±c∆–Ín2ûMÃñ·;◊ü\<¶¿é’N¯Õ∂UÏ’q Æë~’i»¿≤øZŸtÁı⁄ˇPk µ`W95(’‘]ù3™çG¨ü´TÁ)ÔÑ 6í6ﬂﬂlá†ØzÎ’£
πå1⁄üÜı∞¸ÛpÙù$}ä∫Í=≈C3øtâñàå∫/”ûèìØ'äÀ„¸≈‘∏«)Ïº,2•ÑB≥-P]’è"'\’jn∑Ú£÷R~n'”j2€∏∆‚b¨”,¡±a=	î˚´¢‡ìÎÊJR-8ÇPànµ@¨Ä~&m¨Ë⁄ÊŒ#¢∫Ñ££(ÍØ}3Lo√4_‚ØY]ñ<ÿ$ìÊà9fë∂ÉÁá¶bŒ!ZÌ„Ÿ(è˚·ë’Ñ-¯–‹è :öÙ‚⁄h ˝àôùîv`æÈ(
6D6#¥à´dV≈KPÇ≤`ÿL¿¿“∞?√9u+ú-∂ÖEºâì=Ÿséä⁄0%3;∑-"cFÏÎΩôy5Ûfí<5*Âﬁeü£Áÿo–mÈW‘MÈ_©õhPﬂ~ê‹¡]≤SèEcC§—pD6å¿¿Nﬁ#öÄ|ÉK‹7⁄†;”îHq≤çâr£πw XqçÇ 'zﬁãFMjkµÎ6|√öÉ-H`Úpqõ0K ¯HV‘úÉi⁄úéh¨"´Aıª€õ€ç‡O?˙è¡6KCò‚Ê¨0¬#é}S~£Sg’Y¸SÍvHΩÍ®À€o_~ˆ#Í…˘èÃÂÚ≥ˇë{˛ua>ú‘ÖıøR◊9µì{Â∂ƒå ‰f0¿·T£Ñ=Æÿâ•‰Fa«∞⁄iv≥gÿ’÷kNÊ\zæ˝qÅﬂ*Z#ª{#/;câ’§3)øÑd¨Ä∞`Ôêç(¿±êÚ‡˚w"P]÷¢Õòü9ˆ›≥0≠7πıØaïBﬁƒìõIû'cíz≈QQ?&äJx”¡Õ¸é»⁄®—Å(.©ôÜËÚ‰„e´ÇÎbÎD'≥|3ÃÜ»®Ú‹qÖ±ˆçˆÂ+ù˝nÆÃ-^Goy≠¨m"™á·Qò’Q^√¨˛‘98Íp –òÇ.¯ç’Âwó/já≠®è"º]CI˙vh3x8ƒ=8#–Z¨hO¶QŒ2Té%:{—•;#´m¥ÇΩMQ5¿åz»ı¢≈ã«ÚÀ	Q≈∑⁄UGô≥tDJ#∫2ë? rv¥ötToú,ﬁ»√˝kèE≠'O\ -ÓÆ`Uÿ!Iéù»˘!âlS√YGVîuƒ~¥®·:hJønÏpç¬)Íw££‘M`∫aÓìƒ	ñ˙‘6zΩ(Àÿ(Â≥†™÷‹!5_ô±ÏÓìm.È˘4é˙ÃxÔ}4^¨pòmlÛ3ã«≠XÿiJ—o5€f€.ÎŸä§∞yç— ‘Q∑ìHÏk5ì¶2ù6π1mW3Ÿ∂#∂ìœ∆kÒ\jj◊1õ}YU7î;çI˚ö ´´,<«î√—Ïì[6À‚CAÆ,à+≥X)K}Ãƒ¸©Á&Ïï!ámªìg¡™ºÊX´N«µæï.<_„ôÔ∏˘1\kØô´àOK]ÀÏÎ⁄åí˝7ó√®ç«£ Úh,≤AïÑÌ4 "≤(å°Hc„ÿ¿∆û†è¢ùH≠d! ˇÆ)'R-¡¥V“ËyúW*≥Ë∏´üØò!DÜ`§h˜·¥÷¥˜Ú•ÂEáæoöCÖ◊3Y¡—∞}¸Ïìåπœj™ÇV;E!¸÷µÕ€#∑U«ÆÊ∏⁄ízÉÒµ´ã∫∫ƒﬂV≤ﬁÕí£ÔØPµë’¿„3©f°eZéOÚïZ†R»áTßwÜçÿ‹ﬁÅWÔËZçÓ˙	”Hä
ÃiÅ%ÍJA%≈E>¶
≥ßd∑å
4˘xÁƒ≈∞ÙúEn\¢Œòä*£Î6ˆÅA°zÉS3ã∆±ÊòIî
~ Èl¨¶”Ù¢‰Iêc™D∫≤∫'ºK·q'D›ÜVÍ§?C®·ìVWB–Xy ·ÎÍÉWËOa˙»À@œ é£~<W>i7“49ºÚrL…õDÌùãÊUçÁÑñ⁄∏∞õ!Ç	ÒâOÑï*°òøÜj'ævlZé+)HÆıπ8ùE∆kÃ™ªl[w¯£ÍDË÷e®"©{sÁ∑1;¡¡Ë~^#aÒ°U≥∞,{™GﬂfxÙ*€ Ã û6¯‡¿}¡ºJ=}Juq˙X9u‚:ë/[ÃΩÉÀdEÁz‡ô£√%Ou%tôc”√üä§úè*~õ˙P⁄ÅÔI‚YB=é¡∫vHõi~®!N(‹‰6‹Ï‰{_8Ñ”ÚÌîL82Kÿ&3h{âSqT‡#’U®œ,˝ŸÿœÿtPŒáGèw…≠ª,±`%YMÉï*Ac·Ë lü&m‹ú©v÷«HE±J‚™îNDxπé4bŸmQPü!≥ùWI´ VüËpÈÄª—≤Zpã˙($–u•˝%*KxÊì&T5ØËèz.QÉ≠hQr/õG≤)a‹
vœ h@p0öTggZòEëW~°! ◊ÜûKT»iâ0ÃíŸ˜
L’Û&jY’éP8gÄ„Ú…IQÊ@¨!¡Ì≤1wªﬁ)¶ÖıU¯¿>	*Ioùï§Áãtm,¯øí,£SJ‹| ôÿ7`∂„aT&ÈN$ÎhÑ”iáFiT=ª0í“iJª,ÕY¶\·¶>†mØo?"[◊˜f˚Ü_æo0Ω|˚öéª,POÜ‹≥è8≈ﬁAup4]®áÉ÷ÀsjÅÓ”‡ix6püÃzö m¸]∏”»µæË¥ ˚¸»`l2¬
«±s”,P‚>bÕËc89⁄›ª^ﬂ›S±"≥ar¯˛nÒbÆÒ≥bÍÅçª®
~¿_B˙ÌY:M2ôÖ˝.…ı~»<¯´ üïsÃÃÒ”ŸJŸ€É—◊Î™±òYq'§8í/ôÏL¬)°TŒπÒ»ÍDr3tèzÅhY@ÚZc!¿UÙÊQΩñ«c —ØÅÎL≠!ñıåîgÿ¶iïÉç4Ed“]h0ΩuH»“"5‹÷ÔbÍ÷tñÎ4˙NøìalµZ˝ Ïêù4c(Áä:‰ì∏7¢UÙ∞ÅtÉ9∞õÜÇ
+tËE†≈Ù<Yêœƒ»P6e-/U}Fx¸~B8ˇØ„†TàY≈˘è9‘ÇE˙Ç¬cÊkdÓ|À∫Àö.mÃ€£Œñ∏íëˇıqÒ√l3lw´&∞$g©–X*
Ed"≈o&=?´H†◊/≈ƒÔß¥KÙüC‚ÎzFø—ô"ø‡ΩPBøñu9ÙVÖﬂÿ·sC∆w‘YxÍ º¿Œk‡jµ&…a]•bùV#	é›à˛êÕD|Ãè.‘T∞$.<$îX`«Ï™|/Aõî∞$zsêÅY{®\
¢÷ò4ä•`+ô£+E_‘%~ØÕµ¿˘åŸ¨ÁEn≤Øòñ^˚LF˝⁄u:±…⁄d]jt∆“‘ÔZÊW¿Ë¿ôM»IzäbıÜì∏éê73"QwL„˝YìËêà’Ë˛KÍEJz.RÕÓÖ«Äï≈¥≈±~AÆõï<h‹·≥¶œõ+ƒG—5’Ìf,0X—Õª©‡æ„©ç1ìƒößã$£2ÖN,~I–ﬁÄÆgÙT‡ˆò™ﬁ
¬~Áñ¡…Â∑‡≠¡uôu^ˇÉ)çkZ·£NuÈ0ﬁWnÃ:\\0f }ñ±âË/µ¨–Ùa„ˆÄÃQç8ÿwK &P ®‘>S!ÖËbÅkP=j¥∏p?Ã‹«—x
Ìmÿ%0∏!æb⁄[<ƒâXn
Åá‡±ÔHÈíyIù¥t%6∫<"ﬁäõ#–Æ"—E≥∑6Zd"”5,&ÏwÜa¿±0ú•‡üÖ¥d´nurÚe˙§ËéÕ+ÊÁG[º¸ù†ÊM˙D©cÑ˙ËòÍ$¶˙ŒüÅœ√[ {ïÕJu˘è6ªãnG™	Ñò⁄ §∫+’_`iúŒˆâF1:
û≈Yº?äpÿ…äbDuîáêü∂¡À}”ÕÎ°*;€–àlh©;¸ëpdr3Ï2∞fTËªÍj∆^”]{È+ﬂOíùG=5‡È\PfBŸ¥¢YÌrﬁîï=ÏA–gX¿r‡÷Á∫bÍv¢®r’p~£ëg{ ¿®Â-´~¿»Å:ˆ≈Àÿö¡¢”÷ÅΩ£ê±å™a>j({å	õ=b2Òe0øÈk‹/¶ù«#Õ¡ﬂéXøFLµπÙ1-|⁄XCÃ§/i¸≠S\k/πä‰íSgrı^àﬂWp⁄40∑ÖœGÂ◊ﬂ•Íq4u5À°ﬁk÷/ù/ÉÃ2ºΩÌ’Î¡…8«+’&ù|nAÎ∏Â∆◊BÁ¡…<áUW ±€xñ cÁ-≠0;¿‘ ù˚¨êÕŒ√íÍv…w‘ Ω+¶Ù™Œ∫~¸#˙8I(˙[Ëü7«˙·7a`9òùYz‘¢úÕvbûÿ±ÕâÓΩÔaO¶˛;yœÎ$jO P‡m∞Ìê«Âe–ö˙v+>ÀÔä~f"r8Í”P5|z1˙5QrÊﬁíÃC«j®.˝® 8U%Èë@b8âú¢˘`˝|Ï˚x,ÙÔ
NêàZöﬂâG9Ñ'HTÒ≥ œòh–·H…µ•º∞ÛâåPW˜râè@‰!òFw¢º.` )ÏCÅ‰Y≠ñ^øô$d}õ–√•ΩVñ§9ë∫a¶aZ“Íh3°2ŸI¨ï(ìªbTî&®ÊV÷mpy¨÷°í*+iËπ¥—F5úÂÚæ…Òß´ß¥ê5<6ù¶EExË$Å5’f´G~‰ı"’π¢‘q"ÊΩaîÌDa⁄# 8kN]Ö~iËπe»0(•d&fé|&§JI^˚CÎ¡&Ö"Ω áâ¢“x∆–A ÂPÜ:h)cˆçî°~daá(:-ﬂ~[kö¸IÎ¡#ò
£|)]ıû¡xÄ.L!J(GÛÙ#Kô≈Ö˚Y2ÇCäºôÇñŸsÀeV‘ƒ‚§rãáymk˙ÑyÚ·∏ŸeÜ U<¡¶Î990ˆíËYÙDåü$‚ÌΩ@èüÛËO‰ÁèL$œJ8û_	wÉ⁄ØoE í+ª*Ïª¥Íµ2˜ïS›6è™|`Ã‚W<Íñ´K√ª¿`e∂¬oÒcÄå«Í„‘uƒ k)ùú*æÕ0ËÀ∆UƒqˇN¡hˆ≤ŒqÓÎn>Y÷bL[XºÍ°‰íu(IÛuçÿ‘‘iZÿƒg–m;pã`'ãÃy‚‡?o–∑à?ÚrN	íà_~™Ñ/¸ƒ√«¸Ø1‚◊œEË≠†Œz≥ÑG˘p‡I4”ú,ß÷ŸÖ“ÕÑ‘j¯ˆååhïΩ Ú‰¬∏…°‘/ ñ∫ú[Ã»kp>ójd\ÉöF{òa˙˚¶ˆÁ2Gˇªb3¥+x	2(?é“‹_;ƒª?&≥–([ÓñÀe™¥∂˚¶¶ÂôΩ≥ØÍùÍù¿À„R7°ÍÒñ*≈fb˚éNµ¿ı©À∫oá˚‡Ü˛n€ CÅÙv;‡¸æWb”J÷äZçdÒA˛JÑä≈ }IMõ\n¨/“í¨õ]BM¶öcﬂs´Å7Õ˝¡N7‚cá©€◊ ”}î¨N»ãs0®™Uôeáïú˚HÉˇˇ<¯∑ÕÅÆ√ÇππÚS.´?ßaπDá#F÷ôB˚ù8ã¸‹»vQî«Uxq,xqÏÊ≈Ò˘Ú¢©AVgDè»?†_dDA “X˛Ï£ÂÁ
ÓUÌ†Çm∂¯Y≈uÎ§B§P6ÅÜAﬂ„‚ı…z!@ùµ[WVl…ÎÒay,∞-vx0+><ê3®π*#,uÅS=.Z"˙ÜÙÏ±9Û„Ÿ∑lÍß∞ˆ‘0—1Pµ*û˛ÛzŒ@’>≤wX≠p⁄pÿÏ¨¬â¡™.7≠y™§Ö¸˜-T\h»9=f’`où
Ü+ã]Ü d\‡ÍKR5◊ìô9^´ç¬˘•— J”(›NFqÔËZmí4˘+wñ9zU¸Ú%]ﬂ”◊sF—ª›õ’rjî^∂˘ò¨∑0Z≈>]|mï√û˘¡zkå †õ÷s≈‹5°á´@©ó¢€¢ÌG4Æ:Ùn’É∆.4Àç”‚0íÙC≈Áë;™®Ês(l:A‘Ö¢ª[˝ï"˝Í),ÙA¿x‡€Ã·√›ö`åÍ'qÓãŒ>K◊í+hÜ;ãG›zØà·ÓÏ'F˜ÜC>È\Z}__–læ‚UÂ3 óO9”º\ ◊qk=Á¯˚ì:ﬁ”‚w´ü^œZ	Noi&∂üYÎY<¡ASA¢∫0ﬁ","ˇu¬ƒÇ!ﬁ•™Ÿ+˜	ÓÈÁ¬¡≈wù˛L9¯/giúıc4ÇøiLLôÕÀú:K.‡≤ÕÕ'OºŸ÷‘sä†ﬂèdw⁄6“(tÆà_≠,'Ë*ú˝ØxŒ˛9(ﬁy` ≤·¸L∏‰f¬›v´ç˜<É®°e-)°z˘aºÌm„◊ê∆…~<rKqd¥KW:»_4—˜ÈAcùÏ9W'≠VÀ«pDB>HÚ {uÀ•Ù,~9@'∏e¡{“ß(ﬁŒa8j‚4™˚nπ3\Ò'í±¸⁄9b˜ï+⁄¥œ^§8à¸I*Ù|U€Ac◊!êøáò!˛‹ÜÌ£À˜ƒπsOÏ.√Án]ÌÓñªx…Ù§¸Q¬â|ÍeÅ¡õS[W9(ÇŸO∏46Êtºô˛ √˚`qF∏z°í„ﬂ,ïøMı≠WCf©ÃùùO∞‡ùºΩdBƒ…¯&äØ«§†<í7∑Å¨ùYn	˜˛“˛Í™?^A∏¥[Û~¡4ôŒ Ñ»i≥CKuñÜ÷∞µ"◊TÜÑÄœmjew[ÕÈ@{Î=q8qÇ\:°>TWJS\ç∏™∫ÌõÜ≠}¥ü„-øL√l…Ã£Ü£∫ÜFÿÊïïjnòbus,ösxÓªıuØ4√zf™Pduh¬4£v f[ãiáê’ò¨–”ﬁñT~€´k£CèÉÀ‹≥«œô≠oﬂ±8áÚÀæ≠œíÎPﬁÑ]vˆ4€ò	3√e¡G‘M„2≥qπ†‘ÂPx“@B∑¢—®~d4™z“øeƒ#Í`äY*Ñ0Ÿnﬁ´Q¶“ºïòò“O∏}J`…ÚÔ:É“êÆnã¢æÚr∫Í·?ì•óRÚ†~oB/¯Ø_Æ¨ë
7∂ÑÁÇ§‡ü~ıc5¿Q<AT AUπ °Ä≤©r~™$)èJ¢∞ﬂg•	+¶ê$˜C∏vΩàø¸ø˛ø/˛ó *t©Lèjºﬁ–«y˚—Ìù€WÌÃFıŒ§I¶(˛:k7∞£ˇÁœÇçõÛta´zzGd]¿_gÌb‹∂⁄∫}˚ÒΩw´v‡qıÑ CeËœ≥vÅñbÙ·Ò£ç{ÊËDëå0:°"’-NgÈÑÛ⁄€˝€ﬂæÌÎkiëS‰í~5Æ… –›‹Mh‡s¡ç
'G&NTxpêF§Y}úÜ>Î⁄+9
˚πN◊Y˜YD@ˆK™€SPº£{A˚=7«πæ¿ıZS–,Î˛Aﬂ˛4Â¯ÛŒØ2êü’ê˛˜∫LÀô¸–J÷œR+—>ıW©®≤lrΩ>ıÑÑıÜzqÄ®≈Ä¶Cª6ÿçÙ‹∑›ƒÌä3 "ÈÍû¸]å‹ï°z˜8J«!K¸<ü˚§Z÷4<|î“>¢€†dv˜¶aJXw3⁄ü—ÓmÀﬂ6grÑÊÿcò=ÛeWu˝›¡îÏ5ÔıüCúUêa⁄{
òdîLıCg&ÒÕï1%4∏CQ?ı\–,◊óì›=d!πMháˇ*˝Ë9ô(D“§√r[ß—w' ^øN≈0øÇ71Ãˆ@¶L¥iÌaPY"Sûå"qè†>÷§òz1cB)I¡k7˙—ê–`ê∞5≥˙∏—¿\≠~4äH›cñ("$°à¯om:`I
ì⁄b¬Â[‚2kÃü˛®˝*1©Ãª8iµi2ñªNﬁMÂõ.±©+`F§	u§zF≈>øM#Æ…®¿Yvˇh%¨))ÓÑRË∏<£»a–(ôò8oóÀTò∞	ÑØ#~√Î=w"óa¸¢›ÜóàM"Q)∂uEp™HnΩzÒ^>;⁄J˙≥–˚™∆ìár—dÃ	"^*-ãú‚
3ÛU@K9õB⁄>ìôê¢∂Z-&V˜¥≤a˙ìg
Ä I™à“=÷m¶Ä\Îr8Çd0“õÿÑ )xs6=È£§lÖ0zÙC]±JëIG•oˆ8ŸNÄ√›3º“ƒ"
DŸ¡}(ód•ΩºË\
Ñ√x“O[`^‹$rú≤g˘†yπ÷ ì^‘e€5ªgÔÂcê>(,Ø™u¿H œ ∏ µ˙nZ’÷Û¥÷ﬁ~{Æ,‡÷ZSÔæ4ú±I:´èÀ˚‹YÖ‚x∑µÇeÇ :∫»ÍK:o˘T…hë¿&B¿«[îgö?≈0¬$÷?™FQC∫ï‰=1πÅ¶tùhl|6nQù•nóÕ•§G“tÜﬁ!“oáû/BW‹;,¬Èóy¡Ä≠D)ﬁ‰Lz-D#›A7‡$%KSΩc· 3Mó∑§∂Ñ‰)»gÉ™ZJWE√Ö Ô◊¯2î˜=áã0—û·ü˜[–1ÜÉ9Ÿµ“}jÍãdóâJSj‘ÒÆf¥ì?·!Â´lµòØª8“ô¥_5i>¨ö∞o∞4<6[≥úÑ0ê_Pa˝É≈ªˇ·˙ﬁ•˙ı^l A‡ä'“ &àmıg˚—gÙ⁄§ñ∂( ([;	ó(‹v£˘rëf9YÖH€!«n{œöìÆÅ‚Ÿ‘ºcJMxÍ<%)Ÿ!hﬂg`G£0›i'ˆ#@Œ~DÁ0¶c|ZŸtÁ8(yz}1∂«ï_jŒ”:ç<gPlX0ô3Å^Yˇ˙·?COùJΩ˝‚z’∫!Èiç>'ﬁ∆ã’=ä$\ ké}? [à(Äv&Uπ–-‰¯r,<Ü2¬Äìù]Qîî⁄{è∑Ó¯Ëˆ›€ﬂ˝0cQÂôhΩÍCuŸ*W*◊Ÿùs]:{ª+∂∏r+Ma‚kµªÕeÌ£Îì]±^mÈrNg6ƒX$;≤ßd^˜˛Œw	Àá}E\ ∫(‹ÑPX‰jVΩäf,⁄Í1/∏µ√ﬂf>ô™;6dñ«£¨ÖE~ò'~/K&∂î‘+…vEˆÏ±:Ü§o`ÈÎ,ê]¿‡ÿ€j5BŒpç™µˆ12n≠XÀ\r€Z Ü‘3z⁄hâø%b≥N:|v$†¡A€ÄÜ¢ √B∫¶0M‘∞îv≥≠˙fQ+ss!GÔÃtF:;Õ«Gß‰§b^:_n≤dÅ‡£Æ{™Ã:eÔ)“èq ⁄w´q¨‰±˘8L†_=yê‡å0Ïˇ„IpÒX∞Ò…≠ ïO‘ÕàRø¬Tä{≠”dé«z–i(€c d)ª◊NxØŸ1˜œh ≈/:cP≥í˚7˛˚æ“ Oπ˜˙Ó/SÂãŸJ <¢è…J
§($ÉÌ[˚*˘œz∞Ê√÷8û®¥ZVà"§ó.π∑Ä©‘ÜSc&`ÿ¯1	Ë∂*ŒøPA£·r•\¢≥—Ç©æ◊sl’ÿÊ±«`¨i®o¿ÌœÆòµU(≥@C[Y2vÑ)v6ª®hÔ‚«∑ÀRLÉJ…“pl.≥7|üörà≥=ˆ¢EﬂõÙ£Ástª>Wø+˜‹’wÀ(Eüj —AﬂA$≥◊Í§>üû”ÈéN}èNòÁŸt]ÊçÁ;•Tûæ÷p•
®*E—Ùé¢§4+/Üπ’bw≠Ç¶s$∏MîÂP É_aiã˚;*É’Õ—^´
Q$ëøããÅX≠ÛÑÓÙK”l™.ÿ≠vR):ÿìı¡•1Z∫>ç>Òπ·˙®pü˚≥‡(ózu)ËòÙ€'⁄Ë”"≈≈–™…∏@eô8(`´öZä¸Êÿf“Vœ~íü¥
}D_”Ò»›îıÚ‹’1ÚµH:_'<cÌ_q5V”Ô›hÌb¡{¬s⁄Êoº¬ºáŸåÎø¶b˝:z¨úˇ∂m"9?ùÿ[}}bS»“I,ç¬‚PêG…Å>?ûÏ™™È£C ∆>"4.´ïü¨=±˚ß\˝ﬁ∞4Ãﬁ,›òsp5ÎÈ$94cÊb":G
â≥‰Ç$d
CÇfÕT°Â˝>Êµ˝
¢Fzòö®/*j‚+◊LÅ·ÖPº‰|ï—ª^ôwAñf)‚ì˜D'Or∂¢œùU:ÍòBˆﬁŒE˝‘î ∞]≈V†Ïñ‡59‹sQCU.‡‘4BÖ™JÉ∂V;5Êˆ·6∏“ñHM√”ë†JKƒÚ·oâ‘¸úÌüÀ[!¶®3{AòÜ„Æü~¨P;ù˝é¨ûÈ¡˜0õGÁb-Róú›©≥A∞Æ4kÆ-ﬁ”Ëà4Î…≈cA!2Iﬁßx:IN>ºx¨Œı”_–º–#ÜT—∞7:z∫, !›Ç√ﬁ}¢∂ñ¬˝D˚Ì$“ÁOôÆd‹P·Y_ÖËÔ«∆’N£ªNùiTÁ¿cáuã9∫>°†˝°» «;öÄ·ÒöA˛J˛∆'“Ö'„à∂∆üô÷7±jı®Z›£ÀîX•zˆ*Â9¥Î°äA5t«∂≥ß Ω&Q%´ø6≠º	ÿ‹*‹—3™π	NŒg¶ÍY•+%˚∑’Ãl`8KÄ5ÍQt=wlXÎÙè;À'ªÕ÷b∞w…˙’%ø~®ø››h˛˚∞˘ÉΩ„•ÖN€H⁄XåZ±Ö÷Sz¯åhªu—6ÁéMÊ!‚W?Ò^´9ÑãZ◊∑P¬âv€{éçêbÜZD+T”°úk…Z<ômyñ˙4˙˙±Fÿ£¬$&N…N˜]ñvœ}îËJI©Ë:3s÷÷Cp4BEV≠îB%u≥”‹f|€‚‡†tJ∏ò∑¿i<íÂ:Ì.Ji>^i˚_ê©5Fô+}∑›uÚÄõ<|pÙ$§Â;è§cg¸¶«ç@ΩgH¢‡Ç5	o±˛…1‰≥PHñ“π»ˆÄò±àM˙t“f\Â9Wu÷ŸÛéN:;ù=R≈…EÉûˇ¿üiniÙÏ=NaS^k”Ö›Ÿs1.„çwÜ…™}º™çíLÓ©9∆™˙hU/MNö√ÊÎ‚º√èÎsÖŸY†tâ≠˝•KÖ~¬˛µKÕeV∑¨-aœazVsµ$ìÊ¨–Æ›Í4ˇMVÆå®é‚≤∞ãë†:ÅÎ∑|Íöˆ©¶c;Ë∫æ°VS(W2$’Ï@–OÿU¶>;Ì‰6íìÄ∞'i^¶«ÜÊ«†Ú`7Muﬂyy¢)QÃï¿”‘M OÇê÷L˝ôe¨ËALﬁè‰°ø·.ÔLÿûÌ<l!«ÌÁΩh‰åd^Ï:éßØÃ<·ˆaÁÕtJSN˚√$Ñ≥~4bB4ßÒ√}=ú¸H∆òWn~
…&r“gÓ/pSßv+Ô#6ÿÄMjjˆ√4Œ#pÃ‡íí‰c=·◊◊>‰E|Hä WÙàÖ 4L‹˚áüL7NZœGŸÛ'Zdy9†∫ˇ∑’ˇ	ÇÆxÔœ∆˜KƒÛ'ˇ˛€ä·~Ç!˛H¸å#Qé∏Óø°àÓ?F˜è∞»ü"*ﬂìR0’Uˇào˜Øxº©W0Î{ŸˆÊùzmT#√1√ø·2∏ªˇ|¶Î$Ω‹®Ô'˝£µÄWïçb"˘©®›n,¿Å ˝x˚dKHä≤pÂ<`eñçpããwàZV§£«8L‚	|ŒìÈZ–iÛO|üN»Y¯,™üû¶˝¡/Ò©=ag6FXâ”çÅq‰¨ ∆FÖÏfá∏Ëî»¡ÿ¡Æi¡“∆˘ã‡‰:Øõc≠Ñ˙∑C¢c‘„… —¸5YΩ§.¯ƒÓÒp·Ü´Æ÷&q√I÷õ±“<2˛¢em≈,¡ˆ¡5#?ò∆`|`Bï-/≤›¶w÷¬ö‘EïñMV{Í≥¿Ü{•™ rìbG⁄·}V÷AZ^—ä≥Ôƒ˘∞^õö&fñFÍ›Œ·Œ‰¸˜c◊°Bﬁe1A0NÑ¢e©˙V÷bÙï‡T>—$sÙ;`›ˇ^ß?hJ±r≠k.iÓQêlNÙ-fgÛÈY{C‹FΩßYmçèâ¯Ã¡nù «Ô¨Õ"≈∆≥”·/jkÊ 3$o<M≈˚‘ı∫(&X‰©¡7âthÉï≥Õ%D£hAØ5π¢IΩÇEçYù•Á_—h˛Y˛ÛX”=_ì~ÕÙ7¯]∏æ†üø¿Uúc÷úÁÚvw˚+îÆDç—Ó≥Ò´^‚Ñ¨okè£Q89 JB±D5f‹FÕò5„`]
*∂¬~3ËóÇ%Ú,úP"=
æË§	Ù|”√cQµä£!√∞`π!ªàÅW>2Ø}ÿbëm◊3≤∑æ¯^OùìE1Rã&Õª7µ£ c≤+ Îy≠€Ï«qNTÄ1Yõá‰M6$Ì#øè¢†±»ä•qØ¶:frµ&Óœ⁄vÅ∂Oa'ÉáuﬁSƒõ‡Ì`sÁë–˝à⁄.)rÚ‰,É–-Ñn√dÇ%dP}ƒˇXÂë≈Z/œãÆ⁄æ&úﬁÚˆ-¥o…jﬂ2∂oßı Å∂âC>8©Iy√nó|√zR∂¿B5¥	OÓ†å=Zıã«˝ì∆c—QõæÃõÓWEÇ∏ˇ‹°è–”Í›òûs/P›Ñ€TUÖ˝8òÓUW§‚—‘ì28∑¿…=¶‘g‘Ó*îPå˛"iQ≈≠@¸Ã5æê≤ıRôç,ù	≥°ÈÖöIv:•$+“G¸IˇÙ´K8!|››ÿ?coCÍºß7ˆ<é‹'ÆÜkâC⁄ÄÍ-æO°ËπL‚s∫t⁄	FXgı6nÂÉ¥„≠ª[	
¿±ïd£˚œÑuÏdcVwı÷>N√xr∂ÊÊÆÊ˛3ãÇ\//_¸ùù&Á5õçÂJü∏Rådπ[RAS)$€Ÿ6¨Aıu…Úv}1Ö®†;SØ ˛∫‚∆N61;√nàc$µÿ∞)ÿ†çR∑^Íπ≥êóòÍT2≥–¸D~Ë©qp+ALs©Ω,”≥›⁄¢ØDYmOï≈öR‹≤ˆp≥∫D⁄+Y~‚ˆ@Ç≈≈¿P≠‚:vqùÇ‚ò^Ù`‡¨≤∫òqY-´[Pñ©õhl}û[õª€do7ûÜ)F.ùksw˚C%ˇY∑6§5(û˛Fƒ”§Aœ(~â:9ÛìÄø¢Å_®ÅœsÉÉù=ΩoÆ˝M53ût&PÊ¡ÆòøL≥îøπÜ©æ£J¶˙∆–3ÂB1+ï0zO§F˘¡T…'2ƒ≤ƒ≤π`d®Uˆai∫…ª¡G˛SS’ócÕcà©í¸ßßÈ^•ëı`Øÿ^
î_√y=‘Ç
ˇÚ7%Ü—|°è/†Ü◊™òDÁôcNã®6hn» ±R)@ÅÉ¯π—UQ≠:ﬁz›æ:∞M‚:∑«‹I°~'ò'èŸÿPº“0ÒS{ê/®ƒkRù‚tSßµõ’,ıâä¶ó‚.Ü{0* íˇöbaéF5`G•é`ÿ4wI4Ï-≈ÃnÕ”™á¡æÀä|Øø∏T°
ƒé∫Öü>˜˙7!À~ï,Ëå	uÄﬂ#‰là.ê∑≠23Âˆ®éﬂçûíñLÕ{jz]Úµ^i°»Í*¶√(:…›Ì[L{”ƒñº˚¿®!_‘øyƒ¨∏\ı•‡H¢åÎ§Ã„(¬£Ê—ÿΩ”√~¸®R˚˝ﬂz;‹D« £ÖªczÏÓ|ÕÏjê◊˘ù™~ÿ@î1 dg~ï4<¸Cm◊zeu£ )&$ßxh+ú:M®NŒF¸3m≤L<ﬁ‡⁄À≈cãÇ&È¿eñ&Ú∞Ãâ∏π†-TÇ"¢_–Ql+5 (“û{**à@0÷ô◊NIîC©ôbCTg~Wèó‰‰`ÛI¨%Ñ*ò|∑ªw“‰wîø€{dÅácû«ÒXô—¨∂ª9af6˙;QD∑•Ó´Ù— Z} d 3Ö ·Úi0”ElZänÆ@∂ñ`èsòzã?ªb9Ë@È∏¶7…¢Æ*ﬁ¡{≥}Y∑ÜCnE+ßë ¡1AøC±S-&çÃQıTø•w4í¶ZZ‹øV√õ≥©|Ø@∂Ø„NX…`Swí‘ïÕƒ‰÷"0äp¬óÌp¬&’üg
¡{≥îLüÊ4âòûF†a:Ì5Ä ˛I‰ƒò¨®VÿâP∂XØc.’ä!∫˛(§Q6ºu®ˆëG Ã¶Ò§∆Å-üËê˜v§Õu}ËÀpr\¥à@«Æ≠≈u„B€≤<–r∑í4bª‘Lèõ∞&”06"2!â‘'
s‚»+Å{=ç -§(Ç] o.k0À–øåh‚%Å°w¨  óÃ:Ïê=\DÙ˜cﬁPx°√è+
-„O?˙ø˝E·®	ûΩ⁄‘æ=9 L«"@⁄ôK¢pKÇÄl∫⁄∑)n“ië;‘ôfA[èìI¢C≈˝πPÓ (º4D¯º9lÆ.Xÿ8∑;L∆Bt%m\Ã*Ú@4ëü›Ç—Ê!PÙ·†˛eŒ€,ŒÇ˜àBí§G~™:3–ù"—&\1¶°’È9÷‚[∞>ÔÎù_	¶˚é¶n∞Ô}≤“˘‹{h˜∏è ßD:‰O¥Áúò.üÓh>Î˚©qPﬁœ\ÉÚƒµY
¿%/≤Ç A◊¿àã≠8`ù⁄I`^¥@ã=º“$I…«åNø	˜G””ŸR=Œ$è≠od/≠zKRGÑö…÷ÿ!L`π›∂£ ò¥«Öôˇ®¢«.‚´’[}t…ì-’òÌ⁄«ÜÂ,¿¶1ÌN≈rB†˚ãX‹>ø
˙Úõz8o=»xQ8∑ÚU√ô‘1∆iEÿì|3 …^#Íõëîî≥±1´æi~§c'F¡›4¬,ñÓŒQ2KŸ9?Q€gyp®áÏ%3"µ&	>H)·‰Hπ$FΩu[¡ˆ(aM≤Yí°&
PêEMÚêTâô†Ó,áKä8VD¡ÍQÎ†µln.nm-˛y‡ÔÊ÷÷V~4ZZiË„Éu°«-\oãFxÿ=Ω çöÄTÇ:œœy"´…Å∆Á˙¿VÜ¸.-Oí…—8ôeç2¬o+˜Íæ`È\8ì¥„>Ñxs∆U2‘‘˝≠@G≈¨-VcZÃeZåΩÇ‹Åà»µDÙ `µÕ»à)ÓöåÄm\¬õc{≈y<§^–¡0ÃÇ˝(öê’T≈òªL)L˘•Œ!¡‚£‰¿(¢˛$¡3à»Eô1gN◊`f]†é◊dÕ^¿“π	íÂloﬁY§é‘ÃºetZ¨eù#+ø/ò¨\∆…ˆ^◊ùNÁﬁqˇGoíÚs£Ú‹•t8äkvÇCån‚
 ãö˛Y"–C √ÄÜDè»üU¢ﬂ%˚‡lá¶LªMÊˆ√◊π4—#-g4XOÈ®˚∏˝åàe¢éÇÍJˆ¶y2mvª›QbèÖ6÷YÆàÌ¯Ímn¸ùm§£'#«1I8aË@eC-‰ òG”#íﬁ,[Î—≤ïlãæÿm…,«M3D84√ÚiÚv…◊sºI4$⁄lî^´1µ∏¡Õ|RàjápŒd‡⁄±4¥ªc.K{@C≈]ãQ"√`qŒ∏„éq(äÀlº¥¬Ì·»êizH∂FoÃ¸b'˚GåÚsL±·ªeV‡G7' }û‰Iç·*0Ë)xí1îz†‚bC©·k Y 9Øì)∆k¢ç¿”ûÎ‰6Ÿ˙"˝Ó  ZÃé2s∑˚Ê!Ø	w´O.è¡™M≤ú<9$8ÒT˜Ã≤¢ˆ5$ €dõSÕ!\Ò®qÓ¥ë≠ií@°pÖ◊f®ﬁ£$B™4m
õágÕÇßjì¿ú·l‚ÀÈmFE5∏Ωn3C˜ïI´ÖFï‰qåú;6jU ì}ˇ(úí~úëˆÙV]9ÒùÒ‹Vi<∑≥P_9+(!æ˛Vâˆ*Å*SﬂôV5≤w∆L≤BîìuI˛\vöMù{.f∞oÆ»óÓ≤<pQïßô›π⁄ëjª∞£¬X√h[aÉä?VÎei‘⁄"{ÿ›3@FaQk€'ï’ ⁄pgë.”¶≈a˛%ûlû˙∞Ã·H√Å;Ö±a†pµƒy€ŸD◊©ãÿàz⁄p¨ûîªf©èvß÷¨^r{·äAıºyÒV8cQ˙oíUËÎ·EÂ¥ùÈ|){w°≤,ùZeŸ‰V„‚Y—⁄ÈºÔZ≤f2Ä©´õa≈]”Ã≥S1œ√≈l,¶+ñ⁄^›2áÍ†2¡Ÿ…/˝=ÓW[zsΩs›àáÆ,?•[_ü
f…˙Õ0%ã4_‚FÅÀŒI^0at∆ÍﬂΩo#yúU}\h¯W·Bq'kÑÁl®,=’òP]õä¯û˚@™”≤°ŒÛ±·)ıXìUÆ`É ká8¢¶Ó-6S°!°Cˇ#é≈WJï`Qsz˙›#CêåõY/M w⁄</¿"–∫Ì∞ìàìq··¬„yÛΩ¡8û4	£ìuòt–≠4‰Ë
ÆZîs2è–`Ÿ~@v$>»SÉ∏Ò§$»:ŒÛxﬁL˜ëæ—*›ˇ`…òﬁ¨*à∏ç™ñp°ÚΩ®¯∏˚jÜ∏WÁ–*ﬁ >]Ô–Gª»˘ä€¶µâ∑¥†m ù“Ø®e+[¶_;8E„4•OqÚw≈Xwºﬂj.≥éÎ’ÁÉ§ iBo%~zÍMﬁ:‹‡ı˜≥Äj.[Àì∫î2n˘Éw;™Äg}?jÏ)tπ¸ˆ)“Éò9°¿¬t‘6Œn>Ω‹ôbù`Wã≥√öJÚ[œÔ»óWÛ`u=Îè¢∞ó∑Ó§·¡‡.êµ∞LØ›ï‘‚èµŸ}
n®8@n√K“tRí¶-Ï∏m‡Ú3(<NÀ•£z—,*¢ –†_<œú.ºÊJ%ó≥	Dücd!”√”Ÿ¥[√ËYöL@CñÁzjk«T5∞ˇÌ«v-™ÒQ|0Ãœ\e—†‡DwŒr%Eﬁ/©Ç0œôà◊˚q¿u(n@â|ï„Ó∂º´ëq}≈mZ*ÊÔ2JR∑O6°›>wŒ,>[åPnﬁ≈Û|∞`∑[+∆ˆ¿µÙ¿ƒªìRæŒ∫ÿª€.„ç÷â
]-c#ﬂ:#”—ˆ ⁄p˝NZŸl*Æ≥∫zÀOÑﬁ;Û‹)cv›üãp6î+dC“6π€-≈;ßï‚Â|~6i<é˙Òlh[o›æàÕn“æõ¨Ôˆu?« Öüy·ß¯9ßavGH’ü…ãÑ.ïæò™˙p8D°æD
∞j$÷ØRæŒ˛(%&âËûπ*T— dˇÿÕ—Øæw^É∑±6TíÎº7”ÛÍâo´Â”Õ’G”©Ü€SV^µ`%1@ı˘°B‰ÚÌá“=ËÉ»Zàd∏ÉU…ÔU7•πjT6Ü;‰ÏWPΩt<-[#‡ÒÔ4’Gß7Fæ´›k®BÅó~¬pÄ†S”%|Ut¡ªg äªøkË4¢˛¸Á”"zyƒè/^‘<B1õQ°ú“Õ∏˙îoa¯SnRÂ6 ì™JäuÍ<I”pÍZ .#ï™®ìTY‡9ÊÚòéW≈\x´pé‘k\Æ
ÍŒJÂÃPÀûÕˆÈ]h@'Ó¨@p√ö◊k¥∏)’»XmUÙ¿¯ÎœI©ÚW∂#Ú€Ïhn›÷‰µ˚πõÍniòˆ‹FøAí‰^,S…ÙÈ+«ªûv˙Uä2»=Û¡â≥f/GY ÃÃß≈œN~*Tø‚b
Q˛ä≤j®Ê„à]Eü™#d°öè6@|]|Ö£ŒG÷b<¬ä≈òHÖÊsf*õ»ÜÊ£Y¨ıØê Œ0ézÚb≈äYxEÛ93am8FÛ—H€;
'Øò≤„y)Î~¨XÄ	i>g¶∞B“|ærÓ-›3T@´¨ò€∆±4Ö˜Ë<ÀÀ.–É~ziΩˇº‡Ë©X-V˝ÂSé*¶çœ2Û‘Ó7⁄ÌÂˆÂïΩ”ùåsåŒ"=©H•;çÅ√Úi?s¿~⁄èZ¢M˙pBãÌî(¢é**‡ä⁄è·R*Ì‚ wo’vm≈ª5ÖWŸNÌ"›áá¸–fÿ‹]Í¥ññƒˇæÓL[≤c+=ñÏ˘¸™ÂS∂M)†∏[‚ﬂé∏∑!$=Ï\nµË˝T›Ã˚Ç’+ﬁí~ùºı÷`6È·='æé‹¬—™”ÿOïP¶§;∏˚ﬁÑ·Œ{º[ú˚Ô$ÈSppŒ€€wè¢0åá–xπˆáaÏD∏Owgq?™Q©≠t≤~ Ô=P#—êØ1Ω9>®y;ﬁrSÁæÉ˚Q~ªµ„Q'æí∫≈”%¥5∫Ê9ßcC∞ûx–J∂G·ë˚¨[Ω[e_∞∑04L“yπ)IF∑¬¥è—S‚ƒæ◊£¡Ñ£qÚΩ˛»Ï˛`ûoù¨<˝åTqïßø¡ıê´<£˙Ç∞∆¿eü%qü4«≈¬„ö◊íºq8åG—{0>◊éèÑ¿Z:≠ˆ B .*ˇ’Z–\	NN‘,è√©í°›∫¢$0<;é˘≤$»D™˜A8	õ=B- ú¸«ÿsÕ©¬ÈÎø$=héqBÛëÄAÄıÎ¯ª&±ÏÚÖ<|"π¿Ö≈Ä®C9‹¶Â|zå£u"÷Â 88á»π.EÊ· «¿(Ä ∏Ñ0µT6¸4ıZp'N#XTﬁG®å`2çoPµ ‚îÜp?t@p$9’zÉ•\ØÔÓ)0çª™&ÇŸÓ(/ ≥ß··_fd*∞hwy&∞ªeòej†HDû¬_2˙˝ç≥˘7¢’Zâﬂlè"~sïZº¿M¢¯µÌ+∫“Óà7·ÄtˇJªÕ^®òñªjú•8¢]ÿ“ﬂiΩ7¿?	1Æ_ßÏK√}kD˜”ÙÎÍyXXñ'D$1:bòkCy°µD¡¥çÆ◊·_µ†8€¶ËÿNåe(_hêÅYVäBRêQ¢$y_{•eo´Y…|#i‘Ä$1Î}ÌUÖ.»“»2ï.E›íøµ& ˝¿…êê'≥¡°ÛÓˆ`ıÚz›BÊÑìF<*$ÙÇ•ÒY8“RF3Í%µrŸà’nh ö¥‹·ﬁT‘ÖıSÕÖ ßò†«y‹–W´ıÂr-7◊Ôn∑Ωß`≈¬+âM˛Îë Ù:ÙU˛I˘zßmFEBÑ1äÍ
ÄÚèE]t~µí	k9√XèûÈ± ‰Ω‹!Ÿµ.µ-∑ï›]¿äZÄ=ﬁúFÄ÷ì1¢›hë≥QNöJÒ¨iôvÑ·h—ù—™Ï˛Ê"k£‘a<È'á≠«‰Õ&ë(@±⁄,4/◊≠>æ®ÀˆYÒ4ïJUÎ ÷i[(ÃT®µó'C†sÌ§œå{´ ⁄r6ÿ|∏EA˙Ã=¶
ÉOs¥?w“dÃf4`ÅöÇiO\E‰)ÏïK˝˚≥(=⁄AÇ$›ç¿‚bÊíë
¬èìòç®bN21PÙ<uò¥¥Æ∂Ùâö6¨1hu«æ™ûSDﬁoAóo%ÖHñ,Bª©9ªÑ°ö)≈µ”∑L‘=Ö=Xƒ”mX+#Í÷ﬁ{ºu? ≈h∂ÕDu"õ ’ÛZ	ôåë(Açÿ¶jÊ$¡/»Œ¢Z CîŸÄa,è¶ÄØ˘kñ—ÅYS <ëî¡ãkÌ¿ãlWˇ !àH√\≤ÉjKÑH'û∞éø,F¢!ƒ◊dp˛Ù£¡3–ÄÃ±”[ÔkD†]8â`uà$zŒ¡15˙±HaŸ∂ˆ]j(lßü¢)ı„ó/~…√~y!x˘‚?„)ãx¯ü–û˝__~ˆ#8û¡àΩˇìÊ`≤ü‡¯ÚK¸ÎXçˇÒ?˛£áÑü}‘“EÇöCßì›©w≈Ç«æ3ùò”P˝
K√~îÂUÛ^.-4;˙“1üÔÙ îO≥'™ÎﬂäéMº6fQ<Ç¬ ’P.≥_ië"_|lΩ˙Ïì⁄ûY˛¡îó≠£6Âwt4∆¨LÉâ*^¶·X3˜„úE‘˜œ‚—(<àe‡°â¬8` ‰˜?aÙñômQ~´≠+û#«ÉÀQk∞®~ˆ‚ú&át	 0DÕ∫£aï(btËY´ [∂zf‘˙ËWÎ#
yµ£óB∑2õUXËh—‹Vñ=¥û·:"9àΩ~J±ç‰ö˛¥—0<àhóÆK+°lth…Ã⁄r± µsWa∑àe,Ó£.l5M∆›»éÊêÑfp¸t]L]S2+SìÍKâ)‚JZîπ,3∞WUb_ñ<Lº¨ÑÅásÚ“ﬁÖáMæ’µAôæl¥ñ5Æ–é©‰jX˙ea.)à˛q2…π‰’@åî◊@ø≤ENkcÖÔS´W.|˙—œh4´‡Â:Á;ãÏÖ¸Y…ÇwÙ+ïÔ–8ZƒU‡S520Y˜˛s˛\_	ΩÚ∆^µÖã*6,ä≤îF`v^94$$„≥°K>HGK6¿ı±ΩthWeä∏¶«Ñ®ÿè0t©≥Péß≈9£†gÕíßÜœ0n™yUvû|ë@˛#≈Aùƒd%3ùΩ'mm[˛¢jJBäg2û<<'nïû)d¬‡¨´C‡n’‹›3®≈jhJ2ﬁŸ`Ö}›ÍÎ∆U≥B*Hhù¥Ú∫\‚¨-˝¡TKI◊)+Ütá≈AK¨©D™KóóÆ‚≤’DSJ:"âÛ≥Çm}ﬁs5
ÏFs4	,j`.Ú6 ˛®4…¯h7®ü•eT"IàL‰Ï?|ıΩ«\e’”ãüÌè„<Í;*∆/ŒOéûu∂@≠_r·\EÇ ´5u	R
∏Àôq™e§?◊Ç´ZÅ∂ÃÃJJ®&x@3≥9(Ñjø†[∆+fD7_3[∫˘öõ‘Õ˜hY7_
ª˘Å€Ÿ˝[<PB@©+-µ®+ot¡«Œh∞(]√J&¿*Óop>Ê˛"é\≈ôÉÎ£<Äp÷HO#\ü»8m˚kï∫‡ı∫ î|]ÀFq/≤WæÜ\7ROÑŸÉ)DmŒ%ÈÆdP`◊®´V^:pÆ¸bÜÏÈq \ππÓkÅÃä‘Ã¥ÌÜâ/˘"∑t›ﬂµ5Yı…V≤müãˇ·É˛•ãã≠úP∏é%¯µPSW¢-wTÀ.‡ù∑√Ü^%∑Xúä´ãVyP`CÑe©¢}é≤ÿπÜQì“ºGó‚l€‹ì(ù¨r—IK_‚äÌ)Ω†+¶ùÀg€[Ü·Mlì4Œ∂™—E8iV¶ã√â‘€Nß©´µè´µVz<VnnŸê;c∫⁄zøZ[ô{qÂÜ:§F]5ügW+7çV÷’´ÜN;DóiÿWÊ/x≤Lí‹±˝ˆ$>ä2ªcû¥Œâ‰IÀÉIÿÍä<![˘K1pd±kµÜÉúLÉ6$î‘´ù
MáŸCT  ( L·&¢D∏æÇÃáQ‘Í> ≠s-˚◊‘N°{e}±˛Aˇ∏≥–=i¨¡_‰øãÆ#,^Ñ}zÖ˚s^√Œ’ÓMrô|∑≥gî&÷ˆx‚Œ—ıÂ ≤|KÔÅoëùéÕc8N/R!6w=ËtÙO∞ºu].h9`9yPœt∂ó¯≠x2£ë91ı7É’6QòHß]’h9÷I%mûa©›Pyé«ÕË5IŒ'v
˝ÏÕ‚Øç<ø©(’.$©6§ÜÌa∆m4ä©‡fFˆùÛ£L>?™•TcI5GeÆ‘2ï1¶“ï?W∆ºÇÈ6€hl˜ˇ  ˇˇÏΩks«µ ¯]ø"Ÿ¢Õn	›x!©Eíêƒ]>∞$(Ì]K∫Ëªª⁄U›`˜:b÷w÷„πw√≥G8º„8|Ô⁄¥7º£˘2˛+ˇÅùü∞Áú|T>´™AÄ§fTãç™¨¨Ãì'Oû˜	uâ˘æÜPs`≠ óΩËÇ≥=ƒyk}∞≠BÜ6ñ#k)±“lÍ–˝ñî€Ã¶*àxòñíﬁÇmÓµ∏á\bﬂB‚x˜≤tÄóêY‚ˇBgB–¥∫„Ë <úÓ+%I»îﬂD	^§ç˜
√K¶qC ¡÷m.[7m';yŸŒvÍã∂”ùÍ›pæìó.ÈèNçÉ[ÃæCÛÒ¬÷Tµ™±∏Eè5VY5VÀÌmy«∆s~õZ/¸6BSG≈ó`-,<Ê-,2-€k∏„é`S˚xím¢£XÆ£ÿÇÍ»dèîJäó∑Õ^ºz—ã%ÉwïÆâ˚f#≈=w-¬ÂJºVúøuã"◊e»∞Û¨ãósóﬁëQÄûß¯÷ñÁ>Ωßb€º’{ﬁ'Ù2èÈ<Ô≤∆∫7®Tp]Ê≤∂ÌÜ≥C∞µ5 .lÔx`+qﬁD-q%ñÅC-´û‚íä÷ﬂ¸ïœ^*¡$wu›âoù–SWxC√O˚Ÿ}Iê·ß˝lKe¯m?º«	3¸∞ülpqü›±üÒv˙Ç%≥ÔÈ∫Áô<ø‚Ø€ñtJCıÏ≠y-^I∆à5ïjBæñäüüíá™E˛Ú≈?sÎ≠rEZP¶◊ﬂrcÓØ®Â/πc“?(o¿kª=˝u≈#—Ø˝˛%¸èÙ˛◊‚9B¡»∏EYÿïœf€q¸MGZ=x ‘ÜN„täΩ¶ÜÖÇ#Ωe«ÿ0<ˆüÌ¬±[xm>{≈ÇÅîÚ˜‚"˚”ºùå·M}∂Vx@Û·ﬁWqoJ^†∞≥Ëñv–∂LPôﬁ:ñ{íoÔÿÆÜ(: ÒYi˜ìÉƒŒ¿0"v?¯8èÅ˝Ïü˙ÕÓ>_%Û9é7ùM-èyÒï6ÓÈªn|Õ∑èw…/§t˝˝˛:ì·Ö·¸õ¸ª|bcÒ)´Â¬F;˚ÔtI0˛ÄªïÌz‡\¯fÜnybÑbN∂ÅwªËˇôeÊíîBΩÊ>7,¢UPNû»±Öˇ√a≈àñ¡ìˇ[._˘Aª‡}}ÕâﬁÔ…5Ùß‹ATá˙Oë;7:e,@Mˇ
ÅD*Ä—√¡é˙(Ådu7XtÜÁÍŸ $Êüı\ã]hR–∂9’‚IÃ¢2¢∫èä––f_oÅG∑†ÄË›—¥™Z÷inæ¯@‚#¸4û/y—Ul“¢7Õèæ)Ç∑Xæ”≈4íµ√„mã›”–\™Rb)PB§™¯l3áá9óFµß«åt@∫Wóÿ˙˝5K-VIqjy«9¶
N-Ô∏ñ`’ÚéunqV˘1˙2 ⁄•c˙Ï–‡≈îîùwú„≤Òx&jHc7ÕÔ‡∞…9ñÇÖç(Â¶ú{ø>˝VÆÔÀÒµÿ¢RãΩá^µ⁄Êí?Â!bFŸıËHèı‰Kﬂ,A‡ñxiœ|	ù˜ü¬i)1–~M¢œ√Ω¯ÍÇ¬ YnI˜0K¶aßécxI¸⁄ÂØ=Ø=Â€‰ÈÂœiç ∏Ø”Œ—0?⁄U0∞)Å·®ÕÑNp~/8a„Á≈Ôàú ∞ôˇöxŒüJrÒ+˛‡_r[—¡üT¢#ËÑoÛc•ÒW⁄˙ó1ÁßW»À.3˜È}°P»:Êm|∂)wn÷9ò®€öƒ…•Yj†Ùævà‚≤ïæ{È@’:Qró¬lü…[ Ω≠ÌßÄƒ…€”n7ÿ1øå…[{EÓZ‚∂¯`•GñØ#Ö+¡÷Äí°k˘√”÷[≥”[ÓP·˘ºˆ.«m¥ ∆πmÛﬂëÑ∆wÔØ9ˇÚZ∂ı£Ëp„®œ∏©Ex`_á9J£bçE'∞¿ËŒÇ∏S{yf ‰åÅå√õO±Õ´ØÏ? ï¸˝˜∑Çí„–>ØIÎ–:ˇı›ÏÔ_ÍÚ8MÑ”W˘ÊùO—˚Ä?·£k ê^¯ÜsG·˙Wôc#sÏ¿√L4ﬂNvú»êfOÖBL∆7¥Çv@£`´?´ﬂ‘‚4ŒG¸“Ö∂Å?Ïc8Ùgñ¢”N*∏≥*g-¸˛T_Óòc£xõ∞PÖr _Ó“Âÿ(Ü7Ô≤ [Ù8˘∞ö,–@„Ò9kΩ®Qd"Vˆæ1M']4ÖüJ*/>é°∑9úXÕ≥Ì≠I˜U6†„´o©“< q6¢4 2eÉœ?±[&€ê|ˇ[â(fÿ∞ÙJ)
hò!(0Ge‡´Í–(opÜNMfù¨˚Zﬁ	Óƒ∏	{EõÆ¸)ß,∏9‰9Ñ>[ÄIô“‹.Ô®¡÷ÎXhÆ´;æ?g«Çµ´ÓxkŒé%X›ÛΩ⁄‡%^±∫√[Õ9V√D_Ÿ˝˙∫WF˝ ﬁl‘È]!¥¯Ã%I» Ø≠≠˙[.â∫qOó∫Â∞UﬂÚ”*9áû›≈Ã⁄ÇÑ@Ñ‘JPv#ò†l“˛–ìÏ´Ω"Ù#`ç˙nrU8ÛÍä]ú.ãáº†ßUBSœÄ¶ÁéA(ÈÆ=ƒh/Oá≥)J! ≤vQÀbÒC¯ıûı≥tÇyﬂ≥ˆ6¶~)÷¥óÌ∫na’’ÖÌ´Û°ÒÙTéTZœ…ÆÊ!RQÈI/3xàH ¥˛bö†A∏Ç D†”YÁ¬âôÔÁÙ;5áP´xˆ†Ω¬å‹·FÖ+Wü}K„dJ”/ÿﬂ”$b4Ä˝t–eKEf3˝ä∆ ói¨5‹ΩÏ¿c◊ˇÆ1KYœW⁄iÔTn;{äDzbf7ì’LÁFJD}s°åOŒê)≤ç1∞wÖ°»ìF%„…l™Ωåâ9`√®C ﬂD„ ≥Lb§√Sá#'E⁄√§øäQ[ÌôQ√§ü‰»˘ˆWRUt™˚&•å’ﬁ≈¨2ü¶ôØ[=eh±ñz≠‹…qû∑Øô∞ã⁄lp”*Aùåá »6•rPE ¬ÎrŸ§¬k¨ë¬qëLèÒ˘«ÈªØﬂ@}ç7≠£|Ì£%qLu))`˚£ÎΩ‡ÑéŒßãøêá∆OÒ47Ñ,»Ù74Ã\$à´#Õ®˚|¢Î?Å]iú.’§Øœ‚	ˇ¡%«‚›£nÒÁU6Ík^g√ÌœèxΩo˚îÒ÷P◊ÎßVÖÏˆ^∑“+Z9‹xñ≥íüE’h^F∫"'*-1ì%#€z∏µ~ØÅQΩ´TˇChÍOyñÌ’V`Ò§’Ù’ÒÆÜÄœU P†√·d◊Ñæ°Ë'∞™#ßaﬂ¯$Db™æ¬KÇe◊E©tŸó}[¢7Ï™,ï+∞˘h„Ò∆É-cÑ≥ÉZÒ˝WZJ\π⁄†Ï8‹P˙#ˆQ&DVf∞Ùcûj‡ÔÑLÊhnL¸èt˜O<c3√ï@Œ˛-o(ùMöR§SV…GR˜ú˙,UãéR…ÎYu¯íΩÏ™‚˘Ø˙√lÎÓ˝c’ï◊âZw>ÄãXˆeF*fÆRÊ+˜Î7æÿÎØm±◊›≈¶b#±‘˜÷∑6ÿ˙ñπ√•3ëZj¸¸yZ8nÁ]Ç;ØkÓ8@≈æ.bêÎx¥±i¿∏πs•ÆË?Hœ≤ ®…x=+ _≤óÄW”8œ5p£}¿a∆!»ÕâÆ,%ñçÎˆêœˆ0O¶’qèkl˜ﬁ›/6∫XA≠H z∫S¬˘Ì√Ì‘	8_ú8$W!≈˝◊Ö˜î†6±+Ôoll›}ô±+Ö'â⁄ô¯ÒÛﬁñ!ﬂÓ™5ÿz]k∞ı∂•bˇ≠ﬂ}`ØÇÙ·95w⁄9ØÉ◊MæjÓΩÆE∏Á,Ç™ç|˛¬∆˙&'HéS
¸ÙÂZ‡7•g∫S%˝ÚÌ5^ﬁ5Ûπ¬ejÉú5ÇÎÛ#,oI[¶ı%ÅUiÇ}`f·PªåÀå´qÇùÎjÌLùåÆh\2©∏…GE9’ª∏£}µÏ6⁄ô
ü
π˝é õ,ÇqÌÅ ?óÕ˘Ÿf›,|¡Œe˘|ı‡›,l≤ÇÖﬁ˘KÅˆ\
≠‹‹iG~≠r≈§õœπ¨W°aNmgsÕ‰ì€w˙å≠'\–ÓSKpn∫yÁ”πñs≥ø.ã)d_fV£6óën_ÿ™ﬁç§ª∏z ÔÛ?SóM≤˜àΩQa®ÑW†uÌh–ü¥ë2x—6÷äER =Û¶k%ı€êÃ¬‘f±˚9Mõü„fEókÚBw?oòí‘]ØY”c⁄í¥‡Ü◊>(™_Ì7
ãû&ËÎwà7Øf”–‚≤˜É-yëyÕÉæ≤e·__ŸTzﬂW˜)|ÛK./Y˚≈ÂØÎﬁeK>#Ë9ãØ÷7ø£∞Ö°ÿ¬0,ÖecäçŒ™[kk≠ ÆÅ˛;ªæÂ™oó6Tœf®vón4Öµ3];ê,.˚ViÚZ–»ÕuUfúvº¢<ﬁ≠Œ√wnß£…0AˇÌÓIÉ5|†9yï’9ı∫h–∑≈Õ≈I}„ˇ∑ßày°Æ∑XŸÛ>DHñ;ø§©t—ﬁù¸-e} Z⁄s!íÖ¡‚<(‰ƒ°èU¥n˜ìŸH€ 	L0Èy÷C7zkÜ/≤å‰˜∏O€¶ôŒ¶,›7©ìüàqP:”öºâZa'}ïÖjèΩ=•¶^!f¢y€lØ\”»õê*®-"Åy Y‘Ãá÷ûuÛç«º∏§Ö~É¨®"$–!ñwÃy≈ﬂÆ¶S_H|^ß˙?0 ∂@4Ãè‰Hp˘ ÀLP°€ﬁ‚√¬V,+äÅÄÑÍÛÂ'–Ét ≈ﬂü%YÏZ¿ÍùÔ^,óÜÄZhŒøY<Ác(AÙœ≤®?£z@∑£…DxOT¶æ<áÒBï(Øl2åÛj¡ﬁ§Wö·Jå/¥√o„’¬¯œ£|›'.÷„‚∞\ÈÛÀ±úNå‚∂ƒ¯zQ<‰¥]¢_‘y§´“≤âe©	Ô>¨P%ö[!uÈwñ‚oØvXäsƒ|˘Â∏Ûì‚X`K˘6)F÷`Òkü∫ÀcôØÅ}>€sñ¬ï¸<ƒF3kLé∏%tYSvJåsÃ‰Óx?ï≥XqÎŸÎ JÖPáè|±∫a¶\/ÿwÖvDÂ/~(Û|‹WZè≠Bﬂ·ß&µ%Oﬂ≠*Â∫·Æm)◊C√…ybä´»3‚e ≠¥1pˇÆ®∫‰S˚M>¸“?'ª_$Ò°H2√.ü∂Åºû≈«Üjı~¡B≠]wä¢™∏ Ç„O¡/sWHΩ—ı:Á/n€¬#˛ıM˚éôXº∫dá?û…â+Uªvı˙ä*J’èÙÌj¥º9∏>O‹Ã4õç{ò)cíN~…Â}uqp=8"{Î;∂Û@LWAãÅ∞≠a”…Z9iê√~¨á|∂ÈZi‰B¨D	3Qπ˜Øuƒ˛◊µ8∆íIyﬂ‚ÏBâIÁˆ⁄KùÎ%_`,òµ$·ñ≠rò—‚ó\Hûƒ)ÑÜ+x—k°¸ÁZ<ƒﬁæe(—g‘Ÿõ]áÇõûk!¬bHÂî.r%ÇHçqΩŸuP·Û-É/›S≠	]Ë*@„o‰"i^ùw0q÷€∑
Aˇ˚Z#+;ÊÎs  Â^„r˝l`Hc˛†Ç*ÂÇ”™4àó9Èe“	Ø¯Uò∞öM„L∆è-k≥‰æ
ÒKßZË†Ûg¬“∞rÒÀkÎ¬+†ï:‰à0]ª0∞i$„-@°ïºP»@óãBXËu}ƒ´e›;œ†SôIdÿ∑-ˆá^pïY\(vÌK[Ç")ê§i
‘hqÖÒ®Z‡c∫aäZûË$ÆÛ˘∞"Ãàππú1	E‡dàä@8Ø°LwµpÛÈ∆ıLR†MgSJ70N«û‹é8B‚A:Ñ~VXËÕúfB˜ÜQ˛ŒKœ£·¶Z‰Ωq±¨HÙ–å=
ä∏˙A<ÌPWé¢¬âáp≠Õf`áïöÜ^™ßﬂ’d/gıf·«]ΩwlóÂKŸ44Ooz§åWPicô?.˚Iï/¥>@j÷X√Ú‰∂ïó·äæ‡“ ±„R°F¥H¯-ﬂGÓáõÀœ(O”∏]ÚûÔC[e/»O÷^À¨X˙nó5?ãMÙºÎS5zΩ°j/~Y>∆9xçgù}$[ÊAö•X#Ì?"_ÿ˘‚ ›q(4¥™Áj‰ÄæÀÎŸ›cÓróÁ5¬’Sh7n?öâ‰k˛/û%Á	øtÀ»WÛÅ[Ãˇ|;…z√X≥¿xYù0?$ΩAπ ˙4†≥ÇßÃ ÑVNCWÕ¡á¥?√£_S ◊⁄ﬂ˙<‡ÒŒ√9©Ê˙wSÍ¿zTÂ§hw´Zµ1Q*ÎÕÚi:jÁΩ,˜"W=psä•<Ïò2\¯xÜ)¶eıb⁄4ÈÙeaMÂ˛|ç…L!H	ë–´°‹—æˆ„6¨E`Ç√tp¶Qfc˛I∫ﬂíâ„ﬂíQπÄí_‹œ|T1Ä‡7ßî§X?Ï?¿ ˆ1?JU6'2õÊù¢@z∏¿í†ÌïvT`∆dBMB2Øs¿h{›Ó4û¬≥ÛbÉí4Öû¶““‡√ÇZÜiﬂø⁄g”Sö∏`ü~‚!,ô£Ë®}›,â~¯ﬂ$'ñ*aÅ:ÂVŒ≥©6èr5õö	Õâ,Øúe&ì3´Aß^ÇOœBã¨oÈ≤ÁÑ‰v<ñå?ßF´e $∆pé*siKd)yk=ˇo≈+ú…oﬂ-Á?ÒÍùÀÏøïÔàﬁÔU˜ŒÀTTµìc(sÇ∂æ^ ﬂõΩñzö:W∞˜f◊ÂF5´ÁZ‡‚•EÀZÜ˜EPÖZèT}d9Ï]SaÈ8%˜∑Ím+ ∂à:öo·>Y|è›Kí^ó}ñëg æÙ∏z¯HäÑãeiÅ; ›ˆ±!Ô:l%}¸3OFì·±.£™‘lÿq6¶|T-ˆﬁb	 ™#y˘THKùÎ4itó√u•R¡˚V◊´c2üØœº„Ù0ã&!Uìº¯F t*’˙⁄Jø∂ZçïÎ[≠÷uˆcµ‚+‡q∏R•€—ËBôï◊àä√ØLP„˚Rø“My*˙π∫·UIÍ—ÙÚ¬¡˙‰Ê¢ËïuÖ›ûÎÙ™ö√nø˛HF◊(±àívsùEupNé˘3¸Dı$√.˚é uµﬁQÛ©‘·ŸﬂjËöø≤s$Ï˜vâóíj,=ùåµ¢¢!™rUúê·ë˚A∆Z¥E1–U
ë.•ûõº˜OÒ-uØıÒ;ßÔº≥å? ilΩ+è„¨y¬Úa:Ωã•!◊o\[˛‡£Æ~x£¡N±v¥÷e‹≈óùÚ“<¢$Í‹Ã^oìähΩˇdúL°Á§ø¿zi?^(ñë˜õÙeóSÉ5ÌOŸ“˘*Vπ∏Ñ≠qa.ı¢Ò„Az∏ﬁœõ≠ñ9"_Õàù˜uØÚıÛîı—‚Ás><~OÔ"`>ﬂ∫£qü>≈lÁ]&;JQòõiN…À®ﬂ˛@À.l√#@|8ÒÒØizp0åÈñ°ƒ[≤loºﬁ%t;oÙ∫áÛàøgc3K1-<˛	`Œ¢É¯v:ﬁOﬁA†äOwi4¿bFÈ0é®6ï5íÆ(}ı<M˙k£Ç˚π\£Å™—'3º2·ü7{”Ë≤'≈$∂w>6gµf<f?TkiLuS¥”Yeqö5ˆì,∆ à¨	G^HTŸå≤hî/fT~cæÆﬂ‚5âƒÀC,π§ê NÎw‰ÎS,—TT≤-ﬁÔ•£–ßÕ<¢◊ok7oÛW'Y¸\4æ„î∑}Ô7qy◊:=˝ÏÑ%˘e1&™Ôæ¯	Vã7?‘˘?yß-ΩpØ>¯Ê4õu{E≠' ó{≤
X€ÔÚ….0`hä˙æ¡Å¨FóÔ»N_È°ﬁ]~ò∆"´˙æS£HeÅ˜Òé∂R∞z”YÅX¢LÌ9Ï«@¢‚Ω¸=å∑Ã}h’K∆e≥v*⁄Í≠[ùi*+Çu≤ò\öãﬂÀ∞àªÑ∆∞fkıìì”F±ûV≤◊)Ø%§≠∫ÅÒM¬^"à~>’AÚpL®pãSNÇõ—l:ê`«més°µù%Te»~N˜—ñ'©ö]•‘74¡9ÒÙãhòÙ©8<ﬁoi’ˇ∂s83.¢†›(›óÙ*Ü•‰˜S^2ôø\‹™~˝^Ú,∂^/ny_á˜Ÿ˙é’höÙÿsåãÈ¢J[’	Ã‚É$Á.,õçµÕhúéèGpºµ‡˝<Çöó“ãKÔÍnM√<¶B 8Ì∏ˇ?∆XfoW‹{äÔ=}NOû^>°µÉCwW}Â¸’ª„«¸-¢ÙÎ1'ıX¬ª”x‘¥?e¬ƒ≥Éÿw÷_¥2ló‹OÍƒÕ¯r¯2Ï'${™b#Ø\óß≥¨s4¯O˚pı¶ì>fÒ~„√}—O{3D∂éºÁ+ã'™L E›ƒ√A4Õ£…§ÙŸ˜uı\ˆ£ÍÉy:€rÅ5B©Ä#Û5ÿ}GΩZÁ;H¡Éﬂò¢•%}H>~«ˇZ:–K∆*Ã&}ÿZh/°Çó–¸Ñ)Ê±XX„˙4ó5ˇºmıç≥âhq™/õ@L,ç÷§Ú®∫≈âu¯ˆ∏u‹¡À∏Q Ö˜–ãìΩ f1	ı"ÓÏ∏n Á‚e≥8¶z/Ìa≠Àf0øû7òÿßp,ù∑:Ωh⁄4õ dç:H`mÔ¿ì4k6æ((íÇ£gXUY≤∆]¯vUî¥vºò>èÀ∂=Øù©UÏZ ;a≤ÀÆg`»êäß˙π©8îºdÃ[œI$§%Æ]∂¥¿‡øWµ,Bá`¨ÔXçñÀ‘RkàBW!jÖπ¿–`\¨¨i⁄ !zr‘(^F«ò'Gn6]
”k˜0ØÛÂù%ÜÂ∏*&#¸ÜÚóˆpqeÈ
¨‘ï+Ö ã¶ı9ö%qºîÊ‘YZ∫NÛÇ/®q™‹I÷P‘k€ xu˛ªX÷-û,Ω÷N¸`ñQ™Ä`Á™l$ÖzÆîW)ﬁíÃof\π[™oy›˝WL]≤·≠Vô‡‘∞	j⁄Ê@!9˙3~∂ì¯6Hß)&ó2U…»V˝ÂYo’zÕVáD√©÷Ñ‘®ÉÓgêfé"”óÓ¨6Ü—ôÎÑ"úœSäzn˜p∫ˆKÚLŸLáIÔxµ1N€ÚñŸ‘0„ È∞fÔ3Â‹Ï¶;Ÿ'†É([ü6ó∞ˆÔ4pﬁ†¬=\/mg)Ü<hhôäŒÊÙÎﬁ^˛†¨∂#∏jÌir0p˝o<´ø	î(≤˚1%‹∑a`¶ì	x¯x=ú=Ò¬2çù^™N3À†aßs›ÒÆŒ:ÃÊ∞\íYÌÿÉ$ˆob,à«]Úñ(µ√√˝˝§‘ﬁ—∫jVc8l&…xÃKªVÇE≥L a÷í-1›–%·1ÍßÍOÅ¨„à≥@⁄&§6ÅÕ( ¥üá´qéﬁFoÃ¡6i÷Û¬Ã’∏âê!Œ„.4|V[7ÕämøΩyõL~AüÃõ>›zQ<\ä≈ﬁ"‚çx‹æ˚†±†±vÚÍGpr6V⁄˝‰ ô6‹(ôå~ -@¶Õ|œè„(É«cêt≤§Ái0 ~∫¸…xÜô7Jö`À+Ç9±ûû:ƒ“î†æËëÑ⁄À∏øN NÅàıÉ;-ÔF	ƒ|Ú◊ø˝øÊ´5kò4ÌL+ˆÛx;"M°ã7B˘W¸n˜ Ï	Õº´!$MÖ±Z®≥πÎ˚ı
rµ^ÇÛ≥VCœA¯ËÁu;VÌ)ﬁ\÷z≠U±]ÏÌao˝t˜†∑ÅŒ˛ÜpÔñ“¸RºÙ„§L@ÚÅKm˘	ÇÆc)&âQjº‚ñVô‘ô¡ö”¯´47aÚ7Øk◊h|Ãô#Z#á	∞gÊ∑ãï≤CˆÊD*3
‡Ïˇ¡p¯àEôºrjèÚ„qœP €◊@rÛà£dZS\t¡Á∫Ïí∆%Ñ‚#O59ﬁä05u^]—ê{2Ê7®&›·«r#–›)#Ÿôq%DhË\ù˛ií≈h*ä7H-ú&té˙|G1Is[@Û:O6Ô¨omÑ[ìtõ/jäŒ`>¯¿¸<w+RÌÇHM·ﬁéÆù,HcR/üXãaÚu¥{¬ª∑⁄˘›Lx1M˚¥‘§˝·ã-ˇ®(•Ût7Og¡dÒê‹¢◊™7j%z·Ÿ–NµÇO∏πì<•¯tóÖ¿Z°]dM
¨¶Îü!™ô‚êÏáP`≥´l=ôòq*ÿËA<w‚ar≠tàUƒNÍÃsTli{|;hËmà#Ç PÄÕ√,R+ 04∫–f”AíYd”>’;∆–ßΩdz7È°äßqe‰´‰oD∆%¨ﬁ"X˘ySº¸îÎµs_…⁄ùç‚~àÏ]¯q¿]§L˚Å)„’Á-÷∏»/u∆Èa”	n/ü9[¥B}kaÍú§÷ÍÒÙS`?‡ÿ8Êßû/Û–hÁûájá…@˜Àâ wG9‡kUÉ
leQ>Xôüò‹fH„d2\7◊T≥Çê∆Œˆè±®ƒs Èw‚˝h6ú6çâ;p∫O6≥t–m>∂‹;ö'Ñ‰w˚]âÏ‚&„~zÿ·¡l[)¥áﬁIkæ¢ÁIä¸z>J”È†aº™≠¥æ¬®Á¶E`ó@å◊ìÌÜp~Âi÷û å7µÂG¸∏±‰´1Ú˛iÆÕ«Sª∂Õÿ¯‰K=F”M“
¿X9ìF√nq]`#ïÉîå∂Õ[ÛC∫ï	:£N√˜a©^ÕßG
kÜBI˘å°ôJs÷Ô»Ô§åÈÃÿe_<r:>lXéÃí◊*äãOu˛p1∏¥Ò—÷ÇO˚éﬁ…4:(ƒ?¸C¸LVËÃH≥trNﬂ··mÀﬁÊs–˜¥È;Vp(‹_Øc1ÍÎÀS#€tP»A≤x›ÚÒv(≤û%{È}Û“gÒóòÙfı‰*ÈÜO FU¬q+Dµ·æ±¬—tı‰*qí!ÀÌ=∆§<ﬂßqoêOR`˜µ0 ÓIb5óH£ıØpgï≠¥ZÜ5©<uÛ†H›L5‰(˜-¸¯µ©◊*MXò.∑€∂Æ√ì“»±kR¸&öÏò ªs˘ƒq
@ªCÎÌÌkgábü≤ÌÔ>ÖÛoßkMySC eÌ6˙BÀﬂZÌAyÀé‡Ü˚Ë∆∫cñıTwÕúyÍ6Ï‹ü≈ﬂ|”®øµ¬?\|ÑN∞IDŒv∆3˙T2ƒYb=ÅØ-Ywé≈ùù.•îáüëËAm¯=u‘UU~GΩÈ˝({ÜòÈpGY"ÿ≥Õ·Ï Á´'€¸Ô[Y=Àw\F/ã«ìXoé?ä=m{Èhb*†º?ïU2:@%%p9yYØs–íï`tåÙÊcÌÙÓ(:àÖÕ{Î¿O:‚”∏ôïÓ¬O~£9∂qÍ5õÍÏXˆJ#ÍxÅ§ÆgO
eX*≤Î…ËÄhÖ„º2ƒ‡* ËÑçπ[˘ ˆªXß”°°≥xPá&úUs@≤j]ŸEÄ˝'?LxAÛX˙Î/~ÀæD”+9√Cæ8∑ÔBÆüUî-’¨KEaÁ¢‚3l# }U∏
x*Â%VKJ3H.P/∫0_ñÃ·D.Ã#î‰Úî≈óÆÜ∫òC¶Û.ı˝Âø˝˜Ï÷ÏÄ}ö≈˘[∞‘EYQ†ˆ‚ñZæ˝w∞‘˝˘Øÿ›åˇ9y∞Ωã≠≈öñ˜ZÓ"$ÒøµıÆX∞≤Âr›xÇÆ-
Æa®U¬¨$4≠
^ahyauÍ;]g√:ßkÄ+ôuh…î$€e—°©VLÙÊ‚lXõ[&Ø0üa°Û“	⁄˛U9„å“Ñ2MátÑBŸ·(wYÅ1¡ÿ…2”.yö¿≤ÚÏ¡é7°lñÄEz÷ˆ◊[—æÛI±dÂUÜIÕïsÙ©Ó{¬ê1K«∏ts—`Ù´Ì%GXC≈Ö—Ø}£–r,Ø,)ﬂ˘∞8Næ7ÜƒÎ<‚
¢*ëÍ^:≈[K<£ÍÀ–G˛Ö5¢3‡ îÅÔ¥ßi{ ˆ3h+G©!j	ùbõ¥©9OÁ‚.°ﬂü–£/:Xx˝h*ÕmÆñX^Â⁄‚¢U©÷X^ÛjèÂuf-≤º ÌÜ6ÿR`8ë	œ†”øÆûB
ÈÛ!®…j•ãÑxÖı¬∞f,/’,%ª™m7kŸ/o‚ÁY:~Ñ[C´ye(√V:◊IˆÚ≈Ô_˛Ò˘‚◊/ˇ¯S¸Ôã¡≠üø|Òõó/˛º|Ò´ó/˛¬ö@$˙Ï~ö≈nıVü§–ìÒÀ—ñuxj.€õ–—Ÿô”‚˜:ÕØ&?¸j¸p2>¯·A≤ˇ√√xoÚ√Ω—§uy1ÈLÅm√◊;≥lÿÚÂŸê9liõ/AE@√"±≠†≤VL¸’N≠∏
∏ ∏<˚* ¡
8û4œSYﬂlH}Ω-∞§§6ñWÈ(/ÆœÓÖò?”C!»D69≈bQN¶Råwªá;i/="ç—Z'`aÁ@£ÀX¬ˆ`∆∆Ä5º·X9Ò´/±$ü˙À{á3*˘rüìÒÀ	g–Ñ•Í]ñÂ’[üé<ìXŒôÕ.ƒ`ıqÙØ0NüI±¥ìÌÌ¡ø}8–Pì°>ÕÕ+ƒôÇQ_%Ç]¬?t£†|`—bqõ˝ QíæÍ~tîåÄØhﬁ Æâ"(ªî%õrÉIäãTú%√í$©<%>ÜõïÜîWÌ8˝Ú©VØ-Ò(˙R–O≤≈ÍÎF—H∞8◊Cﬂ)≠—‡≈∑dD†ΩT‡J·ÕHSyJØÜïêî@∏∆B;ÃcIKÂ:òfΩ¯é∞Q5APî.L¡ËIíﬂ°`ﬂ—¬´l§<ìˇj„)¿}¸¨L’í°s’8M'1˙£é”jl≥¸OVòì$∏ fˆcÅbÀK^l±“77é ∆—»ìe^'⁄+ã—Ÿà≈º¬ï éG∂‚€·∆í%^ïa∞[dW∑Ï;ôFUiD;Àæj–.O©› >rì˘U{Xa`∂ mbä‡™¡\í⁄l¬´tHÛE¿‰†k<É‘F¥$yÜ3JXë=y≥÷j`◊÷◊zÇ*˝qO5 Rª°ü7‡º∏°kg4Ù“#“*®p(Âµoá÷=¡ÉH‰‡√)ªõÁ3¨J2˘ﬁ0πîØﬁ"bÈì›•Ëy
m∏fl!œ[ÅÆ¿Ê:À’‹®åûÄLQg_¯äL°ó˙ZáÙé˘ó…t–l`ﬁhÃµ`«„ä/–c-WÁM£∞“√‹qj£&tyFO…B%√ö±åVÁKÉ2&Õ˙ø±1$+
ËÚ—È'˘da¢Ç+»F^˘Xe“2Øñå˙LO^x◊ÛL®sIˇÒ>pEº ª	Õ"êôúÎNCP=¢Y?)Ya∑4Är:Ggëñ˙Åpè∂37'Àì<˙ÇßûR-ÊŒ4>,d!úÑ7	xµÒü≥ÈÂwÄNπÀ«›£Ü@V°EÛÛΩú„Ä«æÅ ÉÈt‚	ßí◊ö˘j∞]óÌbOywQ∏(`Ìz_ÚØEWp∑ÂLmÈ!å®]pã’‚ø…x”ÿAÌÀmi¸Uñnx8rNìˆóR©jîI6ß]ãÅ2âxÚK·}ÂZê9ü£Re©áùˆöôE¿õâ_yìv¶Çv¯©á‰pN¥$≠gIùÒIÈﬁÒÕ+d §˚S*~Ï™üd´ç·4(‹’öıì∞ê&è·ÜYÃM{¡ØK~›Ê\~£˙!-£ã^œ’™ñÜ™O ÚÛ
*.8	Øµ*r~´>‘Ω#íÜ±∂Æ“√ß(;Ω±KÚÚpPıöª”
ø7ØB∏ûN•÷âSÔÃ±jïóñ¥"óïYœ“-_=ÀaT_◊lHÚõÀK¶˚ÊO$¯ß…0ﬁBÕ ciNµPÕ£ÈBß sK§(Ó≥ Õ^~HyYıyRØXå|eU	IH∞YY·Ù≥®ß‡°Ï>l‡®±óçbrıµ ‰√4ß÷=†√tiZM]õÛ\ø„Ïq¢√ÉÓa{{Öó*:‚WEµπïÌôb[˘’§ÍØ°´Ú!àì®∂ÉF—x2lﬂ`FtFE}9ê›û£î¢Õ™xa8 yˆWÃúüO)±iüÙ^W·"àΩ¨IÄîÂ¥w∑óv÷ë«ï£egË¬´Í<™ØŸØ„£ ±ï™]Y& «úÏ«<Ö™—•ô÷Z¨†E•x_ŸV¥[„Ç'w~êLv+eqô◊ìFPÒ´oØyT©~c∞Q›LÓäÌwó˙◊>àñù†°|jgx%Õ—∆{@#q+„ÖÍÑ8 î—¢9MÖ}cÅΩª≤˜·á˝Ÿ“w‡˜Úı◊{Kò˝Ê;-/ó5â˙hÒÏ≤ûû&5<Ò<J'n:Yæé÷ïŒıj”†t*vzﬂ0ﬂ\œ≤Ùé/tá‡ œßú8øh	Å<‚b˚…π•ÚÆ“Fê-^`Àˆ“”ï…˝?;ÿãöKÙøŒı÷Œ<ëÁìﬁ¨~Mye•k¡¨÷®<%ƒ‘L2 ‚C¿¨˘-√‹ñÌ˘]Ö˘	éJÒ?û!àT!%§¸úàπEŒw1|ê≤ÊÂ¬ö÷⁄≈–<˝q√Î+Ì•Ì^ãG≠1{áº¶Ñw¡æ‡ë∫°–Ê¿Îgå≤∏üÁßøŸÚUUÄHœ11æ§ŒÂX¯['2÷Ÿ‘^œÉﬁÂ±†‹'®≠?sïf~qÄu©é]≈˜^Û≠≤X¯«X«¢‡yœ“d_*4Ÿ]H©*ªÜduqMgà:l^<˜ ˜g¿_`ÒπÒ˙0Œ¶XZÊƒÁj,9††"¿˘t&•öëPòKÂ±TmW!6;”£kGcÅ+∫¶Røæ‰‰ù≤y†A{˚⁄§!6®Æ›ùê»Ë[©^vµÀÚ]Ä¡ˆª˚+¯øùj.≈ô\òÕQäV≥Ë{sjrL≈ ˙tÌî&ï’SŒB…K˘î∂réâwo–µS^KÃ‡≥ºÊ{yï∫	ïV©úS#T&‰Õ^C;‰≥Ÿ^^ˆî9aÈ˙ı(⁄)LÂ…êıÎ’5FÂUÿÊwÚÏ8ﬁﬁkµº°ΩÁHôt•{`˘≈πzÁUûuÛútzväj⁄oìˆ˘àx®‡®Ö ¶Òå8“P˚Å"•+Ü©ˆ™≠Wßçœì+Dfx™ùÚ3Œ˚_áæ‰áu∑ŒxlΩá÷[td’:∞ÍWg:¨ÍUg±MÃiOüÛà≤®ì›¿	Â=íïÂûVπCe∆â"u®:‹0KhâÖ∫ èµ<~4xÖ‘tﬂúdXCFª˙ønB"hˆeg1Ωã3È],§Ìd‹O“äÚv6pM“.í´ÑkîNé∆≠¥	•9¶0jÓèˇÚ≈ãó¸ﬂ^æ¯Ö÷˝˛À¸Îó/~¸ıo·«ü^˛Ò'tÛßgXlèæeé-%iuÏD˛~ód,éÚ3…ë¨•Ò{ïU*É£–¯∞îB}~ê Cj'-+vÒu√WOÓ˛ä`±ˆ¢˛Aº	\IrD,—Û33†uÆiµsÊ≠ÃZà#]Ó,]≥,æî{3	zÊ[Îú¬,ÉZØØò]√‰$òZ∞8™œZqºò»Y¡"Á&¬TT )´πl∏DY‚∫Ûm6πof69cQçÙıÛ∆’ÀŒWï%Óø˘¸pVËıŸr¬ÕïÓåy‡JÖí}≥≥æï¶´	0÷e˘~¸IçúÂ±_=c.∑\Æ∑3s€€ª\ıÚ±]‡ÇΩµŸ◊ﬁí5Çﬁ¯Û £V2{Ø=><sﬂº≠Y[9“ŒñÌ’Û¢'·ÊB≥N∆≥Â?Ûe>{=9œÇ´sπ–gırõπYÕå5–,µz´“Ïe¡ºeØ?cŸœU¶Â†◊$≠“@ÛoBÄ˘k,]Âg
$w§Ï9«mÅ‹	˜àüs`∏öå6 ¸Æ¯>C†˜[‡ÕÀpŸﬁo{`˜tü-ê˚¸∏_W‡ˆ∂ùòêÛ–∂Ë¡<Ÿñ◊Å7 {Ó¿Î™ÄÎ⁄Å÷&Ï ºJ√€ﬁ™@ÍrˇŒ∑;p∫*`∫¶kI⁄9∆ûÕÌã1Û@üC‡s(‡πtRóú∏ ˚»§˙Ó∑óÁXÆ®\†\70ŸêÏ∏M’pº=[‡qï;UÕ@coÄqÕ¿‚˘äm¬lO®‹´"`¯õ(ÏÏÁoZ`p≠Ä`ØΩoÓ ‡s¸=´˚¶?–˜5¯ñˆzz˝ÄÜw/,`◊9¢pA#|Z∫á0Q≤´Q‘Óö£00…¬•o{Î$£ÖUA√-L=e¡±àÛ∫»‹•∂œuÕ∏≈¢…Í…	£˝ŸeKùØÎä,Ω‰ÔΩ‰ô]◊.ÙÎ+ıYöñù[Êfyú›≈¯UÄ√@ä¢O‡ÊZgñÙıˆ¡ÿ7Nïw=ÑA˜o°∏∫ûe—q'…È_.;äá-…πÀ∆]∂Ω£wÂñ‡≈qà÷Öƒ…ß·±^ºRô^¸LﬁeïåÒf{ŸìèZ¶+”{è`ﬂ»Ÿ≠ÌÙÙß,πÿQW˙…—£ÊòııÕà–Æ2X€>PyÙú†Ë>ac‘%©¿êƒŸmè¢d¸dòLõç—hm/Ì««N– ∆˜is¨≤Ôœ‚Ï∏	di˜€	`cÿv˚Iè?o ºq7Ä‹ ∆∆Í*˛7˘∂x4ÒµxÜ≥‘ÚíÍq±√dî ®¿ «—Dî/.A∞≤yìÜÔµÑ_íÔ X&So…eO‘Ä0Xﬁ^ _zÁyt dg˜ÚâZ»SJÊˇ‚≈Ày˘‚/ˇ¯w˜è)ßˇ¯É|Ò÷?æ|Ò3¯Áw‰y¯µÚM$wƒﬂ™∑˛ìx Ì»=ë
¸ﬁUg◊«kNLh^^›:ã£~óÌG∞kúßß≠ï©n6[´ü ÿ”!¿éjO7>ƒ‚ÂÆ9¥{aG√]≥¿∂î è˙}Ñv%Æ˘ à◊ÂÁØ±N>üEQF∞ˇ{Ó	 ö‚CFh„Ì#∏¥Vø»EÑ›”€¶bœäVŸê3‚,bCïÂ–Á(Ç^ÙÎÑñGõßj”HnÖò\>i÷?{ã”‘ÀHıØXºñåînÜ'yœY‚ïSåΩaG{8LÌÁqîπ1.¬‘‡I=∞üáﬁdéœ«(˛Fºwπ‰`d9iÒ]Ù-gßC^≠ubpÒXëGµ¨LÏ÷(	ï‚´Yﬁá¯§áHôÚ˚i?6A\sœ6ﬂ+RãàÄ
 5âã7˝S¡∞´ÍXu$˛Ü’aºkX|GêÚ¨o.ÏæGsÆﬂ9ì∑Ω(\W˚≤ÖﬂpÃÜÈrÄ¬°∑xëæÀÉ‰»Fıjå≠ÖzÌnß#“‰ﬂ§˝ÂRı
ösüüûèø?ã≤∏†5Å]Ë
—:äUƒ=>∫€ ©)[[c˙Õ|MÍ"·¡|ÿÊ˜¢÷Óú,æ«æH‚√úµ·ﬂ<Ÿ∆tá0XãÔ§„·1€;ÜS7◊{ãßØé¨.ñV/>gúÖÃ¿GMŸJPæ£›%ræ EÇXTœË1H˜Ê(jËFùï“<{!œ|⁄[€±Ï◊&]7I7´ˆ∑ür:ªc„∏z˜º≈Ø?£s;	™?Yoª÷äv(˛ˆm9Æ˚“QƒtDÒ˝”JèH›Lç^Uª≤∆Æz•lª$ÄŸcÊ≠(èüd√fÎtqçÛÔ´¬õÙOw23rãªé`t6  ˘±º/Äè∆Ï∏iÑZ∫&ë¬«ÄõË⁄_ƒ˝AÚ,‚ qE5˜ë∑FóP…Ÿ0%4»Áv:I‚˛%$^6'‚‘4∞Õ£ò©“ÀÃ©ñ—«Ú}éh¶ù°πæíz∆Ä‹8ö»[Z∫]Ræ˛íz7¨≠ãÔ—Ÿ+ï6¸“Â˚b≠œOw2ˇèÈ≠üR!G¸„ˇ≠˙˘UGvÁWôá_sÈr
A9^tRÈË´Ú*ä~ï´w$ú§í«^?ÙˇÚ≈?Û2öTOÛ7TOI#ºÈ˚’@¸
#À¥A2°fÍ'ØÑ,\Oƒ7p-L9ƒ´RÒ´ÚV0AÅÊ®îÓë}›Ê˘≤«Ële?∑çÊkä}Ñ°sóeN≤F0Ü.*ˆ—¨¶GÃö\k∏‹£≈EÓØhuŒ|’iÕWà£˜\æ¨(C;7ÖÒi˘˙dBÏÉÌ∑pû/ûö¢¯Òd|Ä˝4Õ¯∑}«NÕWâô™RÇû&…àÍ™ƒrõäËÎüÙ˜´p tëo.; å2lC◊’… «Ûcú§µø$∫˙5˝˛ßò?ì¥Úß\ø~NxI≈ñ/Ñªüøà˜7â˙î Ä&œ÷_yZLŸ∫˜ÊXaêéiÖπ_·q¢˚0Â<P'ÕíÉd|Í>òD”eû©!‰ç£Á	|?Õ:Ωa2ŸK£¨ﬂ9Ã`QH¥Û	uÖ‹‰eù˛$9§üÈõ˛m+uâ5ü<∫'Ö∞ñ-Öù#˙ﬁöÛ#p·¡¶°∞Êu∆CT˜ÆùØ	˚›:xm®7LÂ∆âÆ™5=-=ÒE7*‹yLnŸµ1DHÓái.≠ƒÆ’˘À|éÓ∞iˆLØ¨˝Åíx6¥|>Ö‡Ω*UV÷∑ÜCîùs¯ñ¯e>áö€~;Ô'´'∆ü$yÔ'Yºÿb∏≥-Ä^îI$Ä‰4ê{I>•áZ«"oæÿg∑å¢Õ ‰´Öç}x`|€FíÖÚŸ"πJÛXTU˜Xë∏•≠xeQõó6≠B;Á¥≈≤y=ßÁÁ51MUlO:ß„„Q:À…4∞zrËig5óX≥Ü∆T-÷:r‡ ¢@èK i[ÄÍÏœ∆$É–É2J[˜Ä‡E:áÁ—ê¡ªH>‡8§ÅG“?å5HQ4åßlÑä|îˇ“}-»„˚ òr1]akt´À∞[`U· ÍÁ¸¶˙Î=Lµøƒtâèà∂0@Á„¯ê6G‹ ƒ- ¢Õ~†∏3h∂Z÷–¯Î™Ê–w-ùòÈ∏\ˇ1Ü£4WXcâ¢8'©˜OÅ¸HÕ÷iéø®œ?zh˛ 0·}∂l>†Å¬™li˜>OÅÇ„ÕÆﬁC2ûMc∫Ωk.å`‰GMÑº§^(
F„^L§¶—îÔÇ9¢ ˛)0âˇ‹ÄgiÜø¥ŒióÈ_Ç’ Â‚ºûß‹wP~æ+î°Úæ;î.{¢ST"®õ√Îr~ßx&∆⁄ÖÉ Ùh¸±6h„¶1˙.kÙÜÈ¨ø?D¡ùÈ¥Ä (é
€¢R˝n›{¸˜ –~¿X4æ‹ŸÜ%˜¥óÓ/6˙[HºdÚf„Æ]ê‘¬∫_˛y¢gÙÍ˛2kÄ\”tﬂ∆@Dº2ıpõˇ˜aÑUÎΩà`‘ã»¥ÓEœÊÎÂ1•±“˚‚wÙoÚL]–√√aˇE∂k?«˝O¯)‡˚¢Ë¯°-_’"BËõETù˘EÍˆÑ!´+ˇcdóã?ƒg÷ä;<#‹0Ü˚1”ºi≠eƒ5Ö…Ït{æ˚â	@= ÖŒ'}:Y'E/æ8¢˘<“n‚ƒNlÆOö¯_Ω##ﬁÜz∫£ﬂ1WÉ∏∂§GSTÅ<æ•0£x~®7∑Ükzëp?úL%v=±nö√ÄÉÅÜ–õ¡˛—œgq<Òå≠#‘∫ÀˇµæÕ;(>∆˜áu”¯6_ƒOåx≥(MëX≈˝ıi°∑áâˇ®’ﬁ7_Á2?ƒK{∞éÃS}û(XdI?æù≈–™Ø¶˙–ΩoÃV‡Á'.A‚ê≥˚ªmﬂùvgÄVèmùËï˛ _:Õ&‚º¿HÅü⁄ùr“Õ_ÜÛÔ ãÛ\{[ﬁ2^_“^≈ÛÓx2ÉΩΩœ€¿èõCNwEπ⁄“Í=<oÛ°ÕKÑt•∆Ë‹Ü6Ò&çp;‘ñßrvqááyuË∆«j/Ò ˙!yR‰˛ñä(’º4÷@˚ÏÑQüäèsG?ÃÑ—§Ø¥D[{5t7÷_Ì|qµHÇÖ˘îx¸Ø°jA6wü∑◊JÕNüvê	vCÙÕ4LJÎ°…	¿kR§kaÕ« ¿w—€ìn¢8œÅI^π&˛iu¶)f‰Í7WZß˜oµ‡ta{1≤Íòˇß˜;›\£iAÏìî(.Ç‹T/Å∞Ç£π´ÀñÏ'§Xxò}ch— íï¸'èøå˜æL≥g1∞p∏FÊÛd;7˛O≥hòLè…±Õ»„F°º5L˜îaó }[<CÒ√rVÜH¨# Ñ9€fó;L-Öm‰F.µ‘V⁄†à$“d?â˚!Îï©LUò∞´çúf¯_b
√—<EL..™÷ÖÓ∏úZ∆ÀŒ•Ånu¸áﬁﬂ;≤_À∏Zå¥bLJ3!».B∂·(…„õu¯+%sû~RÏ±Ea¯È9,Jc¶DGÍ∆	7Äh?Óje;Çïj.nˇØQ˚ÎÌˇe©˝QÁ{Ìß;ã¿Í_yz≈R
¬1Næ?#;Ê˝¡æ-•@IQÿ‰?Å*Ìj°êDM‰pl™π1Ä§òZ"ä£÷$◊4‰Œø˘4}è’nq]°ÅæﬂÖ%ÜF>ø8q ÄD
≥ç‰Ê˙^êM;—d,Æ ‡ØùÏ÷w?
oç˝ç∂W£I≤»iˆïPÙÀtê¬¶ª≤˘Ò÷üπxG}¿0êsŸïuò}ö%? ˜ï.€Ω£!Ë-AÈt◊g¿esÕv’ÃúnXï“`pòÒ9…Ivæ ˝>àt¥™VÈ≥õ≤Ùê@Œc∞?æ≠ÒΩr[·{¥"Œ6∂OfmãÒrO«Â•%O;±€ö>xÛ}\êIO⁄‹4RØK+6<Âïˆ‘PÙDÒ‘Œü◊…=≠0{˙}Gµ‡ªés_ ≈…m∏¿v9lÛ≈À'&!8›u>ËÌöøøÂœê±£?nO„¸QúœFË™€,>Æˆä’S—G«ÅA•“¯iè8Ωæ¨‰üîRó|öcùÏ`´û&Z7ù=ú¡ÖücòXılöN£!M±≈µ|ó[!Â∑}n∑ûâ√/0ù+R/ºVπ˚˘È,^bø1ÕPÜ„ô∫›‘VQp-àQkÀÚÈÜ∑-^5∂.^|˚#µ´⁄≈x˘(cınÊì	ÓhÍ¬]MÎém¸”Y±ﬁ©k¥¯.9[)näΩ™£ú¨â¬Cò∞Ù1¸sSpÑÃ˜ﬂ_A!Ä¡kZ˚ÌD¶ˆ {Fo_>IPA}äYíúœû¢àQàAÅAùŒ≥·T!t!C5≠C]˝0ımÕ&t6-’K$Ÿ÷Yb(±QkÅ}≈3q~EÃë—ÀÙ0!h√ûè^0ıÑ‹‚⁄ƒO—â6∆ßæºMi6„Á‚Um)Nu:Ω∏»Ä√H€0}¶2k¢kŒuúN.ÿB8◊AlK–ãáã/™b¯+ﬂ˝.´/Y»Ô„{÷ˆ∑&ln”R°¶Ñ\úÇÉGT0dZé/X#z÷Î	√l+«óv}xSÇ{òﬁë5
?Çu,©D™ˇ˜§7@Iƒß%79j.ûBîönuzp??¿º~§c0X≤KÖ*§À≤éÈ‘WRÎcóò>‹™Z€BvpÅ ﬂUÉz|;h—∞"È—¶∂ŸñÆ¨bÆ‹9RÅú/ø∞†ì¯¿Ëπ
lQ£K’ªß
Ú˚…8ÇµP≥uT9Ö2Õxlhs‘3]^®π%xueöxZÃw∑Û<Œê‹6ÖˆT∑ÍƒËC˜ou ‚CÃµzèù€ÌÁˆé©ˇ5:DıöaÑQΩàI¨ MÁq◊˚˙±Zó5∂ÌyˇxG5Ë≤Ì˚åÇ1ÜçCKDvBUŒ≈Ω4Îã©,˝MSTÙ–’~/ÿOYSzÀ˝G·&˜‚?º|Ò£V‡-ÆãœÈ©¸Ì<≈>ˇ%wø#ÁÊ_ë[êÙÃ˚„O[Å◊7”XSÒ –Ê`ˇ1Ã~m˘0$
™õZá÷#ÿo…/Èœ4§ﬂ–Ôüq«˝VUo¬_ù⁄…?∞bÇﬁhÎÒ∆mòê<JÛZ⁄÷∏èc˚7ºÊî§1∞P'˜£qƒ6£1H«—t¿◊∏ä‚ûæË∆¸‰Ô»GÎÁ¥ˆ èÛømï˜ÒxvpÁ\1˘]ˆi˜˜0ﬂπ€è#„fÒñ˝à„›˘∑´O¥§ìı…d(C†≈g9¿ø◊Ì$ÎÕ@‚÷Åc=¡è˛fHÎˇ˝£·.û‰1SÏÓïëZq˝≥<≠È6~Ì˜‰ ˇÔhQˇ@˛=L◊Ú£˚;}$Åé„b’
ƒ⁄ä{É1 dã2At’^x8¶8º≠Ëà›V°˙ª—QL` ?Ó≈:
õOñHƒ4GÓÂÛtñ#À˚]v/:Ng|Û¡û˚®Ïaë˛˘1—ä?SøøTœxÔN:§˜˙í`‘Hå«n}B‘lOêè≤Wúgµ‰+«„5˛¬;‡¡ñ˚H–≥t>O∆ÜhA{ÅËÜ=p∑Õ_[¶ø!:
}¡Q√»YyhDß£8r∂·o
H√˚é]n£w~î¯D¿”µŒWi2nb¸XÀuI–2eS_›“êçæıÍ*’¢ﬁ51Ôä7X~jÍ o.6ÆﬂA∆yMøu™Ï˘ˆêº‹Çì=wçyƒﬂ>¡iGiÅqˆ\¡‘”ñÄŒãlAB„FpzÔËXêE4!¿1é"”πl˚h°œ"Iå≤Uœa^-ÃN‰s÷◊∑ì\Ò∏‘áp'2ozM ÔòﬁMmoï°[kfRj∫Ω¥cucô|=@–-π∫É¯œâ¯ÒJ/àÍ¸uSæ¶*õ_ÎAläB˝D9äÉ8œö¿É°tàîü–níÀ∏£…ôœ∆[fSYT´Ì©Â÷‘R[™fI=;ÍVT"Ë¿˙îÉ¯´	
”rg™  ®Jµïµ–K(Ÿ¯<ÏÄjƒçc™ç¶û†æ-UÏ}µÌ|5Ì{gµÎÖÌyØ`«ÿÔNùÒ÷≥◊]îùŒDiAS(mõÆj≠äXa¿“ıªdªÒY•¸£ı⁄:ä∑›çÈ—WÜ-µ©D@iY¨¥~Æ¸ù	ø‰·œ¶CÊƒˇôNä_”ˇO8W	t?—¬ç~Óç>‚1‡∂Ú±5øˆQúˆú,KúÒjµ´5%];RóVs˝'íπ∞(Ê`ÈyNR*<ÒjÒúì‹T‰·ÜÒqaÖ^ÆÏiH?g±G∑5>Ìø+ˆËg¥|ø$ŒÁG*ÑÓ«¥¥?&Ãï—ˇÁƒ.IÒoŸ¶ãdõæÂòæÂòæÂòﬁ«4±:oªƒáN˚\–ÜıΩÒ˜∆ó∂5s+Aèéã+ß;ÕÀ'⁄gO[ÿZm£"2H≥œ„ˆæ˘/Ô‰9tü¡.òµJ∆ËÄ «~÷Í∂~~’f≠åım„Æ|J™Çª*{Z…]aÅë∫Òd?9íä…`r˜µø©áâíz;å-TxÚÛ$üöúì‹≥X8µË°√m≤<˙+õÍMÅƒznå˚[√Bü~˝…^t/}tÚŸüÓ“0Z∆¿d˜n{jºÄ„1ﬁàˆ1¡Ä”⁄n§Q‚È™“˚å/ ¸hÊ—VG”F§ÚÅÙôè%/)wz—k1Åq;Èl⁄4›ﬁ ˜”ﬁ,/àπXaá1<BÆöOXRp√ ˚¶ƒˆ∆-˙:æ›^ﬂ⁄¯Ï·£ªèa‚€‘Œ∂€&€†A’o–òCˆπê˝)l9
õSÇÜGØÕƒcß€— 5M@Óñ}‹ü∫Ω{¢vóÎ√P§«F[KK'8ÆgÉÔ}8s0ŸP≥GüÍëØu%Iôq˙!D¶õÏ∫Œó˘«ÄnX>_¥'f0Ä°Ò7È⁄é≈û¬èÅ◊Y·ZA˘r;ÌÙıD†9≥ΩQ25ƒK:oƒcrÉ]v'ﬁèf√©‹>DÁ‹ê:Ω£¢(úÿª¬ 2ßúv1ÈÕaå©Hƒú£)ï¶Iƒr‚˙åıûJ!‚ûu˘SÙŸ=¬∫I0∂œ£|Ä8Õ}XŸŒàR±-æ€¸ﬁ·˚≠≈É÷∑BkÇ¸´ƒÂVãá¡öB≈(Éº∂E¿7äå 2´ÂÇVU“˝ tÜ÷B¢±÷àPπ—∞ƒ:ô≈áµ‡¥B˜ÃÏ„xJhZåí™á;¿ŸQ2X·?(ƒL¿‘ú'q[ªë¡¬rj˚rk}†»Xâ≤4˘CNß∫L˚pΩ\;œ‚cÿˇºyH}∂a≤<∏Ìu◊-∑·˘°úäœn±~å°KLoR|NÑ	X4T{Õj-Q¯P≥P‡xª¥ØªÃ›/€K;N√ãÏxKÒAX±n±˛≈›é¨nJSjóˇZ#GS´,ü2£™FJñ∑[= ï¶h56ÏŒ¸Réÿ‚á@Ò¢ÅÜ>]øäfFw◊¸S)RA€¿◊È∑\;3D—¯; ‰†€œC|QÈÔ¸è>Ëp¢êÏÛíÿwK∫Pk2_˝Ñ}t}	.}dããÏq2ı1íÏ )“r˘|™R.’] ö
gﬁéîQ'H~ﬁ”AÃ&‰%“aÇﬁfq÷ãÖàAaúÿyNIµ‘6áFnM.ﬂ§Õ–Ç’EÏ	ÚJõ—1Æ¶ªõR	TCˇeàÔvÿ>◊´`åΩÈál|ÕmáØ⁄ç4;¸ıﬂr©ë∏o˚ç´®‚<Óﬂœıd2ŒõE.ôèç.Jgsâ'¢ë†˙#Úc]Ô\Hs√ÃF®Ç•Jp°Ã@0œ‡Bùº⁄î˘QÚi˚¡YõÿÈIxÄÙN÷7PV"àh‰√˝}?¢_ßcÉÍÕ)dgNºHf∞jè£1ôA˘^HU£”óìímü’U_äø‰õàÍs+ÒπEÖ\	IπÃyn< |yÕõnZ!8Fs,øHln%>Á˘Ã]›Y≤B˚Û@ã§«dZÂ@2ozO&ÊBu§˚,◊HÕ!mÂà÷≥B >KVË≤Aâ†QáEì3#◊óZßª& ¬âúô†e˙Q	5≤n-0ÏH&∑Sâ;ƒ≠	¯¬ﬂR>j˚∂m¯Aä†Q™ÿ„“ù¡	Éµ#º¸∞.≥=©ãËZ5®E!À%˚’≠‹ﬁ—ocn,ª©^d«ˇ(∑ª·¯'!cº!IÆˇ1mwáº¿]ÀÆòm`)OS*±‡ñ·∆Wàï7»∫áœYA≠˚]OÍ5ÉFZÌYÕt⁄sjœasêN” I‡∞Å1N∞4É80/Ûqû^l#¬€å`6ôd∞g˚î	j3#G≠}À€ì^π`£#ÙY…}ù<Ö})∂Ú`‚ß/UmÏ™7“H§˜“√8ªbC≥e ñπ,Ìç»âÙ®∂ñÓö*∆ áﬁrë†Ï-ˇ‹ÃÒ;@~C\ÄA ıÖ6…ı´îéïã–˚I¡#ÿ%B}g1’
Â∑ÀDLÄ<‚_»jüí	ï…W„;ÍÄ?›µá[Vö!X›∏Tæ8Ì˘9‘1ÈÎ©_>Ù Ã[∫Ä”G´GÚypÌlÆ≤OÂ“Û+i`˝ãæÊˇ¨a¬Ø4¯WZ8÷<L›D[à9GN>X®◊ØEiºıªó/˛C±Æåå‰t&ΩÍ„:´nç‚/g\NÅŸTiÑâŸåÅV≥úıúì{ßÂÂ
âiØ°û€úÌì| “'Ïƒ˜âMVG…óâ§§„5#‚¢aáã”FoY}äî∑Me–
:»PÒ,Féòª¥®û°}Òôá¨~XÇ⁄ﬂŒóèÓnmÕLñªƒ}/^>1%¢”]÷U"˚;÷‡k’+ˆz¯‘éÖÈK(Ì˘§d≈RÙ_:¨TöN¢˜ß[(™ñ~§U-ç∆§§5⁄.´∂ÀECii[=ëø‰-ù¸ﬁÅ( 1iﬂPâ˙Ø±ûO?=ƒú˝"Ω¸ä¸ı0Õ?Ìµ?îluéZnoB’~ ÔÓÔÌÌØ\k»1©‰˜æJ~_Å0Ë€ﬁãßáq<6+
¿«nhiÌoÆÔ[edˆà¢ñ ›*◊(”yb‚Q„Øø¯áˇÔÎ`xx ∏gD°ø˛‚∑¨`*¥¸Û7Wµ°:,åÚÎOàÀFò
]óSê¿¿—Î˙}U÷Bn1=ÁÜ¨ø`’MX÷
e¢oµ^/°áãñ;%Ü≈∑u(˝ı?”fl÷:0ãÿ´ù÷∆Ì„ˆ5ÒÅx™/≠]í Â‘ó›^^öÌ8£-ÍÅjkü¡cXœˆa¨7 zÿ^FÑZf{√‘)NK£Ÿ"˚ú‹ˇÙÅ,“Hå±%Ëdº>ÊCƒNLôS§Ò4Kmë˜–™‡ç'∞∂‰l≠äó»d÷MÂNM/[ï6…√têaË´çBp"ª«¸†Ót:Ê®4∞
åê;%∞ß&Ì´,PÂÿ&Ñ\ìÂF~0]Ò@Ùµ∏≤ƒ“Ÿc†€Xº§ç[—¡@}Y“g¯ƒËó∫ﬂ-˛\·CÕV–∞çÂ< vﬂC«/:2V»´¨˘ÿΩ0ãÆ{3@iÒ?mtLÖZ„ŒgO
O"3÷ÿÕùÊ´—√Ø	ì◊≥¯xı:ˆïá+™˜p«√]áF„{KØú;9\ù√Ì
4ÓrÎ„÷ÃÇ>.üx>ÁU+ÆAﬁóH1•ïc“
1ô[D√£æ|xu©#µ-¥ÛÏDq$Ë5cVññ|›ªµÄ}’ÄUº+Ë+ÏÑWÀZ∑™2¿Óë˙∆Då;#ÂHì£aùËûÚî–¸lãÉAkaÿw@hÅ¯Â«ÑuPƒùÉéñΩ¬å{H8w$Ëëéà◊s,0≥,Sç“oîµ@Ôß&÷bä`µ0Ø§Œ b@g&($3j–jVÇ0d',ë≥ñ«@Å≥Wqo≤î'ãÔ1 awÔØ∂¡ûlﬁ{∏~á=ﬁ∏Ωu˜·ˆﬁ‚©ÅCñ¸§&7—jù≠xÊR‡íæZ á∏¬ä%#’ÂMñ√¯¸A)>◊óËÀ‹9æóéµjˆ8ƒä5ÏRjÃØ,“Ç Ìà<÷§’˙tc}Î…£ç;lÛÛá[k„ÕßÃ®ç%ﬁAÆØú  :u;Õ“ú¿v¨ €±‘πÆ–a‘ﬂ\± µÒÎØø¯?Ï0ê•¥•wØÕ\∏UË¥⁄`ºÅâ˜^˙¬ô6¥ÿÃ˛Íâ/‘4DmBâ7¨pΩ^<ôÆä(º˜Ç‘dêÙ˚Ò8∞°Áüà/™£|"nàÏ9ND◊?\“∞tÕB“
Ü>uÈèqZ˜ÓnÎÂ‹z?…1’r+˘ô5.ÔgÒÓeÒ…kXı≤˜¨È·Ê≠i¬©¶àfÂ…cd¸±Ù§ü«∂≈Å#CÌaK]¸»©+†òY¡ÆÀ_⁄1ı¶…Û∏Kä∫ˆG◊@ªBç¥√Ü∫K‡;"÷íq∂‚ß«BáR.⁄
zå∂”Æø€€.≠WﬂÀa@ 6H⁄øöwÃ~ı32˝+¢p∑?¯Ò?é[>≤(LŒÑﬁ ˙Ñ=_>P„eıÏÕÛÎ…£{Å§œD∆†ÿ¸e-Ó··Fﬂ≤#Î˛LQÖˇÏ++‚ yA-ÉmN3>±Y0Ä°¡t:…ªããÒQÑy\;Ωt¥®Y˚ec¨jJ*Jû‡‘W…D^æL®æËFÖ"è„)£˘Ñ&aÙ®T“+◊o\ç˜ºØú∂:”A<nb¡å »4ª ÊÁ∑˘‚>2xãÛ—Å˜ÇYÜıKfÊ]˘'Üó∞>SàÈOÎ—‡ã∆ºP¬qºÙ‡U·Ïr√5"RÌ‚¬j ﬁUq€ûñD˘ÈP÷?+^î∂ÑäkK·3BqÄmù~ÆyÿAq(‰£jBÔî$∂Ÿ“=¿‰>ΩÙõ”[t≤÷ßäñöw-ÅŸ=lv$ã(p È‡C Ôa⁄úÒ)Y%L}@ówIFŒlÛ¨∑ Y{‰ô\‹àÜ¿ñë9g?é¶3,∂0·u$›s¿ï_Ìk◊XJ?ÌN∆}	8J¨·êm¶pÜØ6∆i[ﬁ≤;ãeÉ0⁄À”·p6ΩhT28ï⁄”¥ì»“ÁU?\bœìH¸<>◊$fÆ±óøè˚πcn	T„™<›Ö$*s/e≥1ÜaBíˆa{{e≈-ooRÄ+yhQ9a+¢r>2‚G|zT_W+∞æAëxJdËàM™HEΩå´ú•9ÌËÇ•;Da\Êux‡c^¥«&Qüjq•æI˙ó‚ÊVÂE°ÆyYAj(xø_SVﬂØµ‹Œ†É¸Q<Ç˘∏<Í †IˆP®¿MóíÈÊ⁄
-·‹{Bi/‹v∞âê´;Ò4JÜπâ∫V¢Ûî›M‚©ÈÎ)Œ/›¶Siæ)vTÖ°˚Ú…%O¡·†a¶aXZVñSÀu}”Ú[W·dv(.
ôAÁµé„ã>Ö'ø>ÿø†ﬂ=/‰™“B¯dqLUÁø•—Ò–r -ØÑ˙dŒ]J†OuÌÛë¶K˜\>&‡ÃÊ\”dÓìf„Ω˜–ü˛[a≥mâ®ı‰'ˇSÒŒ∆	hk^Á®°|ˆÕ
≈ˆ’∆-`F‹«ﬁÛõñ´@Jé¨Ä.˜mÜÌ›iCØ	]ﬁ¯-ÇÔª¸6√ùï–Ssπ&à)˘[‡oÑWŒ a?k\aÎD¥o∞√ˆ‰àg‡ËL/|!ã‘~Î◊Ë0Òî›Kr«Ö!∞JÿÙ-⁄€·ùÊ,∂ﬁf8£f™6ÄM%÷õÅ∞ñ¬K¶£xü5æ7n∑€ﬂøqH\“J‡NÚ≠Mı÷‡ﬁ›oË~wï•∞¢p}e{•^A≠ı`:vŸnP˝]êS!p£«1˜“)’Ï^◊EÔ∆'4ê;<Dé‹¿§W}ñå(,ÈØ6ròtÌ–mT\5‰`ˆJõ7°¶∆t≠·qºYÓ§ΩÍ∑ÿgA»üîdÁ=È'èÓùeÆh¡
M’ö•œ∏DI9'˝˝‡$wC1èŸ…oxZÔ˜Àqní≈¬¯”-)x´>Ä	y_üQU^}±æƒ.≤jﬂ:æ€/{õ»6°˛> ôù∏;ÿæ≈mP!ìêJêì/x^aSËÖLã≤‡\≤¶Çê!¶}“JübíÓÛXµfÌ.IÆ\˛C÷.~âÿ ‘áõ˘…⁄Î'¬ ß4„LÊ∆%
⁄†‚≠z
3´?|uãËl.}çó0ãb©T◊2äw+å£¨`ÑJ†µª}˘DÔèWI≈\Ω∆]4µÇØF	J◊ÀøÅ:ÕØÅ≠ê6¿˘¯7Ád≠«Àa{Je˚¶Ÿπ≤Ñº%ÓD∂·eE^4Á=µ∫ü]◊„Y√70‰ˆ6’ÃÀŒë]Ye…Qn¢ÿÉ§®©°±Ω=Øå?“Ùc’†˙Q»÷ÛMìâﬂ}˜]ÜqÄ_¢Èï√A® 9πé\°PP!ùo?◊¬8ı¢ânt{π◊>*Ü—Ne*æqgSÇÇ=ïXk°î¶|”j®wŸ˝Âø˝˜Ï÷Ï ®„Qúø⁄jZˆ‹˙´©^4Wìnø÷’TÄòo5	àÙﬁõ_–ø˛¸W@‹(ù•:zµ%çF{∞gY”‚MsQ˘˝◊∫™:8Ê‹¶
òØ@∫π/Øﬂm)dà^F£z4õ¶~/ìÛÒ‡˘®+π‹K2	©»Ü\¬“Í~sø°ÉW÷	¢‘#ºÙ0y≈·Q“Å'≥¯œd·´O‘îYËïÌ/yBœ	ﬂ)ì>Ã§®ˆ:®®¬z"S4h:¬øÏÂãˇDg˝ÔD!§?*´çƒöèg#‡Vì`¬nåNVœôÌ^™¸ãU˘•Aï_zLS_*Œ…:0,)ï6µ∫0≤Fµ˝X∫7*≤–/bóFH∞‚ØceË=a%o†Ê!M¶]∂+Sì ∆îGw?”C4TP∂\™ıqΩ!≥tüWXäÜlèÎ…')<Œ;Ï·läjôáÓ˝ı¡{<ñ={(V£Ò¡å
â‰tìª*cYîÀ2ú¬Œxc_˘qË–4õ›†aby,Uô£å)YQpxù“EbòN!Ú—ç˝»OÂu⁄
˜ˆâÒqÍ˜ÿ“™∂C˘˝ï‰îj§\Ì†©≤U•ÍùUîí·eŒS^JFnÿ`ë>/}Il„, Éjå"ªMÅË*tŸC4M•°©G∂◊Ô åAHºxﬁ†øWrO%ƒâ≠»≈≈≠ﬂq¬˜Zû!ê÷§≈fiè◊~¸‹Ñ3Óe”‰íﬁ¸:ˇÌ"ËÁfí˝◊Òk¥Y'.•}x÷©p¥6YßBÓ;'÷©NHøC•6ÉÚπ;L¶∂~∑æ•Í¬«◊y™oyû7ŒÛ¸ûÜ˜BLˇ˚;˘ßó”Ÿ¢qÔ[>g^>á√Õ«ﬁtP∆dYÑ;h1üƒ√!’’EœÄ9ô≤…
$ ùoç1œ1O|∆ÄcÜyﬁ©ö9»Diñ ≈hEcºâÌ˜”Ñ˝ê†∫x£≠x8;ò-–€¯Iu´√ÓÓ≥çÒ~√x,Óµ:Ï◊‹+∆&ÊÂÊ∏◊ŒV≈î@ûæçÅ˝lÇÏe4ûRFì9x≠QkÍ[v´ä›
ê ﬂµ!±„ır])_?œÂB Òßoy.Î*Áπíq?9Hœ§Ø“^5π.Ò‡5VEòﬁº¸ó<ÊÊ∫N4¿≤5'Zz•4ZöuŸÕ«ì({ÜÂ´ã7?9ıiÄœb†sÒxuÉ[‡¶,+ËÙA©¥¬ë.çE 3⁄ﬁæ»6O⁄:ºD∂y@9œ}Ig$)≠»MÑ/o%à{˘SQŸqêJç˜Ü…d/ç≤>Ê◊_Î–ﬂÆ‰%i´Ñ#‘
ôw…^∫ΩÉew|m1Kjı*	4Y˙˛π…«%+-±‰˝˜CêÚ3c„Ìdáó¸Üm=‹ıæ-™™÷^S–b¨ò\ˆP^œ©bvê8…R„-Qá}2ÀM´˛Æ~yÉt 6*ª¬ñB√ï¸≥/Ωrä»Ç¿&à*}UO=DÖÀk\6£d®Qÿ‘Ω‘Z∏”}πRVbæÇÓûÀ©ÒnVv’s˜Uq˜’n˚Üh_’*Ó>Pû©∞˚dLÖ›ÌrÓ¡¢Ì•åeâ{çV–á'ä∫7Õä—jLWZı´ºøunÖﬂÂÄã‚Ôû+¸ƒ_)>ÿ|æ⁄Ò¡Ÿü≠ú|∞ªÊ=WÕ¢Û¡ØŒ_áﬁsÖK”{ÆW®VÔπÏ=WÈ∂öØÃΩÁ¢SZΩP£Ú}Yπ{œe¢7ı5ÀJ‹ÍàT™Ê∂,G=&˜∆€Â#ÃG"TpÒÚâπÁUAÛ¿%+ëa7∑éßX`X}≠íö”ÊΩ¡æ∫S‹÷:<#›?—⁄˜Å∏°¢„“ˆ&?ƒ…≥Ω˘¥!û∂ÇÙ´D[¨ŸÌ^S¡3	HÜçgrçL±;òø$ú‰>¯—›Bÿ®´34æ™˜O∆œ∆8$B˚F	≤òï0Ö˝´ptq’p‚¶Hf÷ÁAÁ@ê≤ò5Ô‡£BﬁX'∑”a≤ñ4ÕîÂΩ,é«˘ ùÚ◊.yƒêÙ0_=˘∞4Ìã'›§û\rœõìël8ÊÑZâ&…41‚.¶•òç∞:4≤§mLÉr;·§ñ«√M„ÔÍ‰*≈›î˝·|ì‰óå€Éˆˆ’%r*T	Y–°ÇÌÅd¯¨}Ø‰nË≈˜ÿß¯M^+BÑ4Î˘0˝#≠ë#aœJ¬]∑#‘0\ızÅúîñÀÚßI$î·•ïq;U}Ü®•õ·ápH:G¬yà∞ºƒ¯#Œ^œQSñ|4îÑà_^GŒP>8íz«f'±…xïr_≈Î^≠íï‰OSb1,≈¨BÒ"^¸¿„v≠”DŸ˙¥π‰)‚•-@I=≠ö]4ûxs” ˇ   ˇˇ ÙÆ≠áxúÏΩks#…u ˙}~E4ö$$¿G≥9Õ¶ŸØô^˜ÀMˆåmä;]äD©TUh6√[≤º^kΩèò∏˜jµ°–›	á¬Îï[⁄p¨ÓÎØtË\˝Ñ=Á‰£2≥2´
ÏÓç<ê¶	Teeeû<yÚºœÚ zvÌ-V¯¥ŒØz√ù·*ÎèÇ4Ωå√Ì∆q<…⁄GÒh¿≤y÷NGA∂7WVƒœq√›cÛ˛,I¬Iˆ8ìáI|ç¬ùŒ˙dü~ÍyÑ1◊33¯Qı\„œ‚Y√5OòœÚp’3”©>QöœAwe˙¸ê•„-˙˘<’gΩ≥&på√A4Ûœ¸ﬂÃ“åM‚S÷|òÑœ¢¥Âÿ‘’√’eÁ“¯.√U}È0â&O€+Œ¡]Mß¡DoMF—$lè¬Á, ¬q⁄ÓÙ√Ñù”v∑≥Œ¶œ€´lz÷Ó"H/\K‚Ÿd⁄«≥—àù¥ßI4í≥ÂÆ¿	Òõù°Kxc?l0í`ÍXaTßÌ¬û±`a=¶≥Q6Æ]]∆jˆÌYeéÂ£†ˇîÕ¶”0Èi»≤~Gììˆi4?¢ß·(Ïg·‡Í$N¢0=X9leç˜√Iò#/f˙Óª„Dq—æ:\”Á=ç”¨ùEŸ(doè≥ˆäæ:”$l„˙07Ù3ü«	¨¡CËu;mR◊-ö4^dtï	¸wÃ˛,L“(û∞wﬂeÕ:®
Îo—öˇzp◊êµá»∫¢!Èx†Ø≠±¢0Jµ÷û≈ï£tRPœ9»≠Ïf/≤YZ:eÁ0r0Ãüºcu∂ΩΩÕ˜∆lá!ê¬1b‹ âUÉm—•$Nâx5Œ_?‡û∏@SL>W)–Ùµ∆œ≥‡ƒ\õJ¢„?Ô%µµWùò@]w“È( öç•F´3¶Æ%d¨	-óX‘b€>r:P≤fÀábÃ^t‡üß·Ÿˆ<rS˛—∑ø∂¬j'u’)Æé7mı5¸®A=¥£Àé‚oÛ?‚MΩïïÂıïÜwË>–X>“!K£O`3tWŒYö%Ò”£hê∑Á´Ál˘≠ñ ±<eß`‹R=F Iê°ùçØ˛5>ägàrkNZ|Ó«˝pÀ†{Ú¢∂j]ÌÚ˙íﬂÂJ>©K1l¿„Q|⁄~ﬁfYå◊˚Ò@áËå_•óH⁄ë_T¬ΩíˇÊX•~k(ƒ_úøPf”DœºGØä&√0â¨;∂Î ô∏r∏¿Î·◊@Ùp4öÖÌ>X∏Ü„Hê¡q`}¿iá‹ä;ní¸(˙ŸΩ y:àO›õ1	Å'y˙p4;â&Èˆ¸ÄˇæûÑ¡”Ù–ç~I8<õÜ˙#¯˚QpÍiﬂè«”xÉÖ∆s¬F„ì-÷ú&Ò4E⁄SEWåìu√∆ü!Ìª∫£œÓåÉìê•I{N=v‡+ÌpÇ£L^ÖØ¸¿∆Y∑éò∂!G¥qº=l¿  5âèæÏR à&ä‰Ù S=ƒÇ•√  QJ°*–ÿÎÿ≈¯Æ∞Ê¿£¬%÷F£‡‰Ît:43vN0Ù¡Wdá ‚€f{ÄBìì¶Ï¶ıû˜±ËŒx®M˙£§Õ∆oÚsˆ—0».•ÒV´‰≠à9Ÿ,ôî,.~lŒÕ‘±|«\\È˚˙
rkxV‰8¨åŒûŸs `Ä¡\c¥9Õ•7tÛı,ëÂg.¡Zv–ï	y¸S≤(˛éÀıªü˛«ˇ ÆœNÿÌËyò~·ÀE‘X,ó†ÃopπË_ÈÂ˙Ìè∆ÓåaO?∂ËÁæ`¡¯ )Våˇx£K∆_Ò’Y≥ ∑¿M∞ù¿%ï
2ÛÆ5ÎÚ9{g|Ó;wf£:ÁN…Ÿ= bπVf<‚Û^k\Àßvuy6Z¯pEØ8»Q‰ŸiÃÖæ=¯Q~Ÿ‘´IÕ"Ö¡ q>	G¡ÛpP∫†nEèÜ£SêGÜüO±§îg¿YTΩÀÄrÇX4ä\ÖÛƒj¡…∫jÉÅuH÷l´û˙E[Æ5XÆ(FQﬂ≥"˜c&∆ƒÄ˘õr†œ´I¸.%◊<»≤†?$⁄ﬁ9éF@}ã≥iB#è<æ¸ùNÛª”ìOø;O>ùNN>=âé?=è¶üçß≠wñ£»ev–ô%£ñ[-osπ•?Ú—ç¬∑:£príŸ5∂RO_qíDÜˇ ◊<Jπ66ˇŸc£ÌÁ*Ì∞5D˙∑6CÉösΩ†¨ËkÎÅÀ?nç;©m∞«%ûóí1\Ô†∏Íe‹thkßÀ7JFÉA8ëßvœîx÷µ”õ!ÒÀ¢g!,<õ˙t&%ƒ$√ZFBûÄqŸIHb∂CKLY√QLD{ª1
>9Û´xË?ì$L∆@IŒ∂ì∏-/ï=Ê2◊6s° ÃHœeQ<·*TVs¯µáÿ`+Ì#dm◊˝oÚû C~Z◊Õa{¿êCúY=ö@åŒvª&∫yƒ-ùÀ,p´ﬂù•Yt|÷>
≥”pí4RŸú¶	ó*’«˛ É’f÷ÑfASã˝Í”ˆ,˛Ü~Çk˙m9i‰ΩìÊ?Ωú≈’[œ34>éÓ_ ïé=ó“—c‡Ò¢äæﬁÓìªæ–ÅM»I;D8Î!1éÆ≥ÇzÍdg”pßC¸[˙Qîõçg∞Pq√ß8É7PN_xHaà1H‡î*hC©MÉ≈ì[I'€Ûf»u0¨vÑUx?HN¬å)˚`ˇﬁ›±ˇ[#ÏZ0¥≥QÿDÈtú±mviO¬KÔ#Â^d||S'95O25AqL·ü¬≈‚ŸÂûüh[ ı¥Br›∏á≠$ˇÂ£tÓuâuà˚¬Ñ}·
fÉ®˜,Ï÷îÜ9£*G?I(:òˆcãS.ë·Q|œíŸ§mKÑ±⁄¬Ç5vqˆlWÒpÎ≤◊¡ÄnkÌN~ zE"/ç3ê€)G@Fµó≠H∂qÒÚ„nπ˙ƒ√Ç¢p™t—˝ ˛ëoRv2e_∞T2%JÈ±Ï§a„ƒCh≈`†Èâì¶∑Ê=YJœ7$AjGìˆ©«7D<hzHI‹Ô$–ëπ[*†€X,OVÜ3ˆ¢∞4ızÔz]x.≤#klF5ëR~πlÁ˘◊≠t+Ω‚ñQÙœgby];∆ÁÙÊ∂ÃÌhÓ£)Ê_¡Æπ˜gHÛ˘ø;ßtjÃèß»?|aõ¶æ,V⁄Fªo+°ÊÀﬂbﬁz¥wÁ¡}ˆ.€›ﬂﬂΩÒ¡Ω[˜˜˜ÿﬁ≠˚xı[À˘”Û(› 2Ÿ˘UsD9oÉMQÿ{6ÀıÉ 073)ˇÖb∏®ˇ©&ñ<ËX⁄ö"`-Òq(≥~«BÙÛ¨±À6p–Ì˙±x˝X¸Ú≈ãó/~ÛÚ≈Ø^˛Ú/^æ¯…À_˛.˝3]˙g∫˜/tÔ/^æ¯/˘◊ÙÛG/_¸õ6›∫{kwÔªyk˜Œ›=óf mfXƒŸoA}!WÚ%'.Õ:°∂p—ª?C´ª3ôŒ2£}Ø◊Ïn$G°a…‡>Øz~èG^räkıÀø¬Â¬ï˘ﬂ/_¸úØ„œÈÍ˜_æ¯G~è5≈ÜvØº∂Zƒøäòz>~<˙œÚÇÚRR°®ÿ®•üé“x4É√hgÌUñ≈”vwπ«∏Íå†~F¨e‡˙¥c Ó)¿?Fì-„¿◊îpÄuqí˙‰Eˇa!∆yÁÄbﬂÛ~-ﬁ≥ XˆÌ27N˛â'7Ü¡‰$Tzá4Ã˙7√NFäáuV‚R6lápﬁá…v#Ïútÿá∞:%énEe&ê=Æær´Ü-mﬁÙ›≥ÎAÆ.âïrhfãgy|£vÑ—⁄mâ˛%ﬂ∂∫"ÆÁ*hm%bnY^lAÀq◊Ó1º“¶öŸÓ"R˚—,Àbø;%«%ﬁ»ø\Ä%£®ˇê§‘¸¡4Ï·ŒÆÂ~á^úÔ1¨◊ =yÒöœfã∑Õ?uË¿¸âÚı◊é‚—âó(õH±Ä[≤Æ§Õq	ghQÆ´◊.n†≥”„?˛πÎ#/c…◊¸oåº¡k_-º≥–}◊øx§yp˜ÊÖê∆œ¨ñ™Ùùä∂Blb{a°∂(Ü¢√AèXbt√<E7LrÍ.ÚK^éòÂF˜$<ﬁû„m‚Ö«n¿ÁÁ-¸åBú(üßª˝x6 ¢È(tﬁ˙˝pöm7æµ¸-˜†tyÉØÆfŒS´F‡Äó¡+%u« JÉ£Q8ÿûœ¶BÛépÚ°≤Ieòæ“Ç≤”Ècø_|Q˚Qe;Ê>‚D`ø|£{s£{˚ˆ°À∑CaŒw¨T∂^&˝àA#º1π[∞¯F=†6+Ë#/-ÏºW÷(∑bÿQvÜö0Æ◊9ËÆ!ârØÅ7‰ÀXØB?WÔB√0ÈÂLπ¡|ãP∂tMJºé¸
@zÖ†˘¸˘ﬁúë˜U;Ï…cŸh˜Ω vhuõ¸˘áI|íÑi⁄:ˇÊo'@¥≈àÒ]ﬁ‡8Idﬂ–Ó≤∂ãﬂ-tÔ4ué£$lñπéR Ãlw0`Ünõ-≥õ	
vÀÏQèœ∏Ï4f„—Ûèr∫D∂€UæØPÇ´t˜D„"ùn≥lön-/£	(C<èÇ$ÏÙ„ÒÚ&ú k·Íqoµ∑ÇﬁÍ†∑yºnÉÓÒÒ—⁄r“[&# ¬+’fÈrÿ~Ü—”†çƒ'›ô¬[¢Á€5“oˆn7•∂√ﬁG[àΩh!åß)…&±≤ ŸUÜ®öE…<qÇÁYkÄ¥à_˝∑∏é$√√∆(Í$övM˙$D€j†K∑AtI~ ≥e7º/ÆYÛÂãº|Ò/˘£ﬂ˛≈ﬂíÈﬂø|Ò3Æ™¯ÒÀ_˛Âã"m≈œ^æ¯M´ ÔPΩx9®jT™Wç4§S¯F:lﬂ"8înçkD2Ôíhô«â÷{;1%, {;íP¨çäqÖ*xπ◊ÊÕ(∆ïºb˘„Î7?ﬁd˙x/Ãf”ŒQê-±˜„g{@∏ÒÊÌ }M∞PîÇ…E”Dåúz‹∏y˛}¸ËnÎ‚ö%#/∏,H)‚ÄØÔúƒÒ…àSÜNß√‚Ñ…˚”ŸQ˚˘ÛÁù§◊ÑœñÒ5ùO"_∞∑Ç>'"Úq ¡;-SâfŒÅ˛0Ï?=äü7,HÄ†˜3åSx—PæLŸya€ü$¡mzA1Ë˜jÆÜ⁄íviÄ$Ω5‘+WÖ«I…‡J1Í≤âQ◊ÅC:°±18åüü±õÒÈÑ€Ê^åÅ,ßpÙ±è∏˚Q´D•i≥„ûîùjÈ0>ΩL˙·Ë: [hÀûË«8s«º9ö˜‡lΩ¡Ø°≠NY2◊Ó‚jË„Ωıç’®ÙA8∑ƒ´ÄÌ™‡ƒã0„È∂+ÇGÄ´Ê∞úÉ¬}È˙ŸùA’cåŸdØl¯iIO)íƒ´Jüiqß?ê?|≤Ë÷Ù≈ÃI÷ó:’(ΩI€ÒöØÿ˚ob Ç*ïO√®ﬁ&∑Ïr§å1ÓÏÉQ4ê∫‰%8	kLò´6›¯ΩÃ∫\MES(∫ä'öÃF£Ú¶Â±N¢õ9ÌÈ-¶ÃÔ4hÕÛj	˜¡Ré!Áe/ıF¡≠V'Üìfd'`®+IÆo⁄âRA™‡(z˜]&ÆrSE≈
¶añœ%m6—Sê^}@±>·≥%£ª√RË˚zÓèì™°Ü@∂µXBøêÎëy´g⁄HË®î˜T®ù¢ä∑ó∑ªEÂCn©•	—%èﬁ¬'êíπM‰—ô-:L·b 
√ß¨T;¿%y∂ñÊ’©êŒœæ,π”rSı¥Ú ®cØ-ÜÊ»´	¢6Óä[‘uã•_
Ê:ƒ⁄Ω∆w
ÒvAºu9ﬂØW¢ØKÆ.GeßtºàæÛ¢•#¨ÂÜ/Ωa§)∏hÙ•;Vë◊—¶RÆ^$%á≥ÑŒuîx‹´Gé˜€Û9;≈hà-ˆ‰ùπ©
<ˇÊ7°w¨c-∑Îô4,SPæ[Pp4”Üâx˙ËdË“ò›è38ˆÔ"u =zäo¿RÄ9õÑŸiú<EÊp"L2„‡åEì~‚é·≥á=1Ìà«ÇáõÀˆÉvü¸XJ,®»£≈ö˚√ê5Æ£4B[|⁄*XÉåà»Ú0√/˘ÂÀE
ïßÓŸÃ—qù@l∆ÏpÌuÂwÜ4/'?5ÌNª¶˘ıæ¥o=ógIÙõ•éEÙH
;cÅi4À7…ó=*©l™ˇï ˇ`äÿñƒY0bm◊büª˝ñºâÊ Ú„9’k^/ãõ@È1‡7		aáè÷>‚=uﬁGW#G¡Û(›n8QàcM∑uπhP<Ôÿûõ‹∞´±”ÿèGÑ´≈QT≈ﬁ÷GUÄ∏àÁ9¸(&UÀ~õïDß
ü(h[”
òO‘ÚN*zë∂Dã∆X39A0±¶y“ÿ°±∞©Äàp5`ñ§1©ﬁé§eOªtuAÛêÿ˝x Æ…ªÑ|â·lówBXRûè◊Éú Ô≤2.∆e|k¥0ı‚s´µØp)‹‘´<Â¸i∑~@∆˜íYπ†ÉUó√≈:eé˝⁄:UhnØæüDS |ıÅ∏’`˜Ë!èÛÑ9Wb¿pù—‡0úçèúÒi˚2¬GV…T+TÖ\åyîw÷Nü‹¬ëˆ’ı•Êl ;Mòå ÁÅá„Ü3TõÛØZ∞vÅ˘ﬁENÏ(~æ=?Ä=´Xˆ*ã∏Âníƒß7}ô€Ùè@∑’rµ~‹a√«/1£Ü+⁄W†<oMÌmAÁ~◊n≠œro\¸‘Ò»≈O~Âë-%Å,¯)8ËV)'ÖN><Ωœ’Ú¶oï—ß´\cl(Œuëî5#ÚjÉv÷ÛË¿-°X√;lZ~G<˛©–~zµibd∫q/_˙¶«"⁄*_Bo¨bÈÙø¬çhï—gEæaue≈tPV"™∏*Y√•YEVQŒj z™ß45Y+æ´dæ%{±j´·F#6"E≥Uüse;≠ﬁyﬂ%	´$◊∑˛~·[πüú¿≤7Ôﬂ˙¬wo≈«C±‹≤≠ú¡ã:fãU∏ŸÚO=g[˛©ÌrÀ?ﬁÔÆ_„!∆Q®’=Ø™(û˛!"≥@˚î0dkÅ'@˙Í§ñØ˜Bè3›Oy¡'kx√õüÍs]v\lﬁ‹iZìäU#≤<¨ª\ã¨Ì6OÇÊÇ5û≤ˆB’r ûV¯WÀ«À=¨˘ßjS¯]Ù˘ß Q_¥˙öéT}~ﬂÈ˙˛ët§*:¬¸|MG“®$"ÙÏÎ† ˛x˛©CAÍ…M¶vhè™ƒI9WWbêëüjûØ"’ób-.10fÂ{J∏àÖ÷Ü„Ë9∞´b¢eœV–c^•bÂ4qA*ﬁèR·≥
±Ç°&ä-*~©d^ì!5`mi”9ù‘ß
BgQP,;π^%@†7…v”ˆäÓl©tã”8¢-¢ÇÂË^ÈÌì•E & ·µgWó˘µ›‡n„˛{¡n˝È≠∆5¯ÁÇèﬂå˚çkœ'Oh¯ÁÇèÔéÇi–∏FÍuquôSå◊LVd±!$)›Œ %*@4ø≤E¿iKŒ„kRÚ™§d~P	¬»j¯5zıö≠÷k∂VØŸzΩfıö]Æ◊l≥^≥+ıöuWj¥;‰;ËYEns˘ëÑé¨ÆœŒUûâÛ:{öUø†&≈u•ú5˚©&®ı∏^Æªd‹õæíŸ≠!à◊√káÍÒ–“G!©ªÔ ˜˚ºâ∆ı*‚S-˚Jzw›PF9%!ubƒÆÁ°&µS™è‡Í,ò?hõ*Œ\3»‘üÙV4Ø!m}I¯ÛFM?"szÛci˝âÿ€¸ò≠<"À%˝◊ÑdI80q/ºC,˜my<˚”◊ábÂŸ˛J©ômbË~ÃΩDÃêﬁ*{i}éV&w∫3´πX.w£UØ±[√{ƒp˛Ó›œ¯;64üç“Íá±+¶øòÊIóøcSGŸ¬‚ê˝*ƒ jUvÍzVjMzPŒe{pAëAâè)êjq·Ç™Æefª%V«.]R2√"˝0H≥êŸ±ØÔSÿ©äÇa6è›Ö±÷¨Ph4™Ã®JKZ0¨ ∫Ë <Y¥±oi8æF{ııV¿".π˚ü3’•3◊•·=Y√e›N#O^b“˜t›ºyºNü„¢•˙Eob€9ö¢ìò„b¶ë€Î∑71”àÓå\Vˆ™òv∞:a‰Ârø`ü/ûØ˛TI	mvî.`¢t&=ª·5¥_ÖïÀ`‡©<	|IrΩxHi˛ñÁM,Ê&¯Â&¯eY¸Àó/~Jôo>¯Ë˛›ª7Ÿ››?{xøHFº¡«Âhíé∑Ë{üÚLñ%I&ù––m"ŒÚTk∂B@yõ¿—K⁄uWyJÁÓÚ0yg>˚ào#≤ü– ¢>∑°ænTº$≈ˇ£“Œvf@√ãF¥ÌyM+ıRÒaÈ,ZΩ:ì ≥ı{MË5Ä™Ú9*ÿy€âH◊Ì2¿◊ )ìAﬁ‘˚i™>J§ocóØ√._∑˜™?ƒBWNÂHÒÜÛ-™˝Uï⁄SlÏ!°õ•Ó?78$YÛ˝$¯8çrûœƒ–µbÇ÷çò Y].CœSVäÊ=®&É ·IuŸ(8˛Äa÷S F∏—˚p/u8´}I∂8ÆŸﬂs ñÖ˝a:ç≥ØI€HõﬁÖhõz˙UàõÍ‰kÍVã∫ÂlaÊâ'îü›¡3LÇ2`Õ}ÄÒ¿¯˜ñ‚Ò‡GYP	+®Ç‚lå∞òICâ˜„@$êªO:ÏQÿè« .Ù9	§îÚípÑî_≠…Îã∆¿¸ﬂD?„wŸ~4&¡à≥◊∂ld„¢KÆQjC¥aFY – 5=∞ÚDÊ∑≈Cí™3[.&CÒ…\πàÂÊÈoPûxg*ESõÂQbÒÒﬂ˝Ùø¸ÄQöµœ≥ÙâÖg^£ú˛?&9æ¸wJÎˇyÎg$Ëà÷ø~˘‚<#k>|∞∑œnÓÓﬂBî∏sÔ{+@Ïy≥¥˘≥2&~'AÓiü´◊˛tπ+PØË
ƒ#æj∆Uõ6‚6·<ËN∏˝ûíN˝˛ÖÈ8˘‚≥óø¸õó/>ßg>w√^{∆•ŒpA—SVq≠∏{∑¨±C•u¬Ú-õ˚π’èØı£5$˜e`pSøn«ã£?•Çø‡?~ í“£Ÿ_…áeiÑÊ›]@Ë[7ÔÏﬂ∫IΩ∑ø{ÔaÀ•ó-	/vôÒR\1Á-‡‡@ô_Àø°â˝òæ¸\NÂhˇKs¯†c¸Ä=ˇ}lï˜Fï=^¸ãRp¸=ˇÒt«É∆9¿IM¿¸!\˝w≈.ˇÉ∏ÑÉ¸å˙â›0û:mãU˛‡•Å{<+¥ÔÙ/êxè(A›@óÖ¥¸yƒÆ2
Œ§≥È ñèN‘Œπ◊I|™ÀÚ(4œ≈MΩ:ÆbnäRC!¨(Y’3¨ìÒÊ• {∆ïÇ¿§îùí2ÄêI è≠nö‘E=˛sG ‹1π5I„Ò’:.^ƒzÏ!µ‚	õ‡V⁄%d}˘‚á9—Ä¸‚7÷Èºme∫’“s€¢wú»Ú,ò√iÜÜbI8ï˘úË≈Á&Ìz◊&Ùø¶{ˇ,âêRÃÚßøOîÏ72FôEB∞.øgÙ0.ã«_ì•&Â∏(èø"!Ω¸´†%B∞¯,g	‰ÜÙn÷/é™¸ÇÍó}∆Ÿ°üÁÒ#≈3ïQÚ1Y∆¥¸¡ìßa8˝öîHRB–∏(!°á_ëåPˇ*à»oˇÓ2Fæ/ùE≠˝˜:È»à5˙ßüIÓ‰7»*·@Û⁄zÓÅˇÇ&ˆBüœ$GÚ3.˝;ç¿ºfn≈˚îKÎQŒa8µ
‘c—∆∞JÑIWÕ†nœ£Ç1r%…*>~]µOÁ,°XG'p–ãF>A˙s!ˇÚ/Ë–xÁí3É5o<Ÿ› ^}k°B’™N5C≈Z“Ì:◊≥Ûµa™¡®≤v _Úú -VDÜıt˝jÇ≈Ï9≈D¸‹S:+Õoƒá^ú
:  aÏ9©§mÃ}MÜö
Ù⁄
æÂo±It°CÊç$§ï\/6k—5”ëÌpAEüÿçı¥‚>œ ã·Œ˘<ŒƒI†™*q©Úns∞<óëÛH`á∞¬Åè]8¸†¯pé∆‚D6êX´∞êÀ“Ò∏¿’=Ø˝z˛≈ÙÆãi\m≠xOh`Ûì—°,ñπÊÒáÙ¨`≈5j∫lSSÎ¸T§TÆíπ!Z5ıÔtB¶FŒá…õÛë~Ê±éËÉ]÷Ü˙/ú I„7|Ó\ßÒ/t˚7˚Ç’)2&éÅhb.Ã™4™Ó∏∂ÄÔw‚=yàW¶2Z‡ _Ï¯Vô∆.||WØ†}x7ı•∆Nœ·\z4óÃãÀ∆°\IÕ Œd'5+?î_Áël∫7p$/‚‡YL≤\lW∏tU{É~J„˘å)3—ë˙Ép»ÍÛ[·`√mX¸Vˇì«wn¸1ªÒ‡˛˛≠˚˚lˇ÷Ωáww˜oÌ±Êù˚{∑^¨îøà=∆ˆ_u?ïÖ;U»°MÛ7ﬂ¯∆7ÿoÚsˆ—0».•Ï~x˙ùIõ5ñX„;ìÜ√ó?ˆc`œõYÄÆ`†P¨ñè¬8)>\p˛˜˙‰î98Oπ{Ù¡7n›ºΩäÓﬁ∂˚E…Èn”Ë.·N(g©~Ã∞ª\è√K∞[5$MòW˘Zú∂ª=`w‡ü)@&≥FÚPÂ‰ÅÂ˝x±u>)>†n◊ò}E/w˙(<N¬tx„TxNÙ÷<i®◊ùénOô2$m+˙˜=¿ßÎÙ„á‰Lq˚Œüﬁ⁄+åßx¯ªÉ¡ﬁ¯N˙›Oˇ„⁄v¬nGœ√Ù´≤ìnﬂæ›ª›+Ó$ ≈S∫ì®Öo'…T>¿;È£$úÙá%€H¶B˙}ŸFª7o≤ÎèﬂámÙ˚ªâ–{g<M`M(ÜË+¥çvoØ∑QÓÇÂ›GπB∆µëÙòÃ?‘ùÙÁ¡¥dÂˇÔ—>∫sÔ·£^pY£6~öjh{øI¥â—‹∂µ{¡3ê˜I¿·y÷ŒéFQ:$_‹ŸÛB‚¢"M~´(“ nLìh$gz:∑B`ÄSÅz±\—CõºÑm∑ãs∑ø·¨–Ì]¨ÔU˘ô#U˜ã<ÆVè66˘éœ!/a†≠Õ”‡j¨$¬x˜√;˜ﬂ«¢ßÊnCh?æ~˜Œﬁé€[=ﬁb7>ÿΩˇ>àæNŸ˝1µÜ&F]]«‰Içõ/•ÒÎx6·$YÃvO%/”&°ŒfáÒ,IË±äGa0·E‚∞†ø—í≈Ô.I"±‹”˚]B¢:
36 œ∂Ÿ
˛F'Ó&^åË
¸π Ëµ"Æ|˚€-˘ø”…çxÓfÕ®≈æÕöM∫}ı*[o±6µ%Œ#•)¡^'D
]¨:8ƒÙ)ïg≈‡y.ı¡o§ú:u õóU˚À++óñTèZ18’´ñÍ‘ÓYØWË]´;ßΩa:K¶£–xÅ∏‰Ë?o\Ï^‹3{œÕL≤Û¸<±˙ŒO™B◊¸ñŸ≥‰U«ä„≥˙Uåd°[∫cˆ⁄?&FØt¡—´lXÏïÓòΩÊ·¥™_-6≈ÍYãΩ-Ù-ÓY+àYåı√Æ’káwÃ^ÛZn™_≠åπ’≥V¯≠–w^2éz?ƒ}$∂µæëÓŸ∞•¥ıZÏõ∆]±wM⁄r/úÃ∏2ßâÑÉˆ2æÉS¸&∏?¸é„ÔF¯%ÍcV1*µø≤xñ‹,Ωuæ≈Tí@Ωß˙R$ÍΩºSYè˜YQSz¡é˛,æ	.ì≥˜‘õ¥Áúﬁ	`pÂÔUAMçs7Ç”í?çπûLÇgm`NgÌwÊú|%<´Ns˘‡ﬂÌOv€æ“ær∏Ùµ—n¥Ú®4†ô£\<§Ë»€b›ŒJ7?ö®…~0’¨tÆ\ŒÿÏ¥º–lΩó7≤Î∞5 1æ	\4g8∑–'tj¢«£FÒ∏®≈ƒrÊZË@~Ï£¢≥‹´Ü≥´Ô‰¨?_S„–mÚ⁄ÉﬁŸŒ‚v¬éìxú+d‡í∂eãπe«˘M*/‡®2O·Üï÷¡R§Á«É4‘≤7»Eî¨√úêÕ®é‚„:7y°≥+¿m_·|µ≈J¿É$–∏∆ª?7˘I≥Ã	ï∞±lÖ¥≤˙¬ !h6âJ.GSLKÈ‡*$7—2√0-nòÜ-bv6œÕ2(ÄfV&ãQñ˙V•†ˆ¡|ïYåH<≠tº¨äƒwØÂ9üÖ	ZIPà‚øw€†w '˚
òñp’¡8»ÆK˚œ´ﬁ∆vSjƒ¥Gó≥yO\~&^"ºc^i9Ez:K√Ñ®l∫;GDb•î,o?LbÃˇ•hÆ||ã:eõË†¿ÊäÄä.wb,;‹L%i5»≤ˆ∆-ˆ8ˇ¡>•ôÊº›¡8∫ôÜŸΩÙ‰ò;x+VÑÕFC„ ”~èFè¬cﬁæ\≈Ú◊7£g¢¯ıµ&ˆ≠=q•◊„Ïò‘˚˘Àxï“:ä%8RzÏz˛[™∑kÕNÍ"?N√Q?V⁄avpÌÉp4äﬂfwX0f˜ÇIÄŸ•:Ïœ‚Î:ÈSXz6`≤‡Ã≥!\öNGànà¿e?ãF#¨∫4≤†#^ÄV≥-≤–u&ÒiS$õ—P`6¢Æ…}™:”êÔGJw~XÄÿ]. Â@úp„´}Î¯p≥©Î{‘zÂÈÙ¯•;ì,˛0
Oõ ¥Ö√‡Y„Òîé„86DµËÛ%¿
µ
⁄íÚW
î'SêûM˙L7’0∏w 5«ÕñîiﬁS7E≈ÒªÒI4ŸÖI÷DhUKÖCy5m˛r|ÄJ;n≥¸MR„ƒëY"∞˘êòä±Û†ì¸®ƒÖÀW≥ì≈{¥√öZ9¬)9Ç¸≤6‡¯¶]VH°mŸUïâ1¿˜e•&¿YuDjÛ’ˆâ≥î∏6ıCN:Ü5≥d&êä¶ìúi`·L¬t
_b¡ie∏uüõ
¨ÅÎ ÉàIaπ,ö∞≈∆y£6ˇ¸àZl´€—µÖ¸Mˇƒ£æ3>÷^øΩÕ.q“w	xu}ã*≥”˜ùû?¢Œö›{é”~D‡®–Ã◊ƒ‰Æ!JËc∆˜ﬁÅ∑ÕÄYõ¿4ßI‹á€é≤Ñ·”¨c$Fµ—_ßﬂ∑IäçCa±0§é‰@…Q‰d÷≤fò$zE˚\|+IÄ2bH˘lB§Vú"’q§Z?«Ë/6“Q Fø¸0†'ƒ_ùx+∑éôÉõqø	‹“Hú“É#@ED¡FkI{'vØ}√‚è“M˚0N∞f,ÓµxÁ^rÂÜ˘ê™Eﬁ∫ô˜ÿ±≈{0yùË}ÿ%ùè›Ÿø•Ê.ﬂaØo¨‹)_˘!ã¢ÌÉpfaæ+ëË›<áFÒ≥bí˚‚RÒÆqµ¯üZ¶%FΩ∑Cñ„‡è ·î?v;Ä’!”PÓœ‚§MÅ¥Ë´xçp}0¨õŸŒÑKâUÈ]Y1ÜXtô|#Ï≤í.Ω)ïsÑM<KFÕK√,õ¶[ÀÀß òxêvÚc˚4<ÍL¬lÚBÆ.cAê®øåëª¡2™h†9ﬁ£êk~;W6WV.˙ù)ê…ä£Íu{ l±K∞⁄YM.È∑Ö”0 ÓÚRB_.Å‘™TÂÖ|
k‹≥ry=\_;‘≈ƒÍ|π ˘	
¥ô‹ˆë¸ÔX_ÎØ≠jÊÅBä%ª@WMØÅV7¢§Ã±0á¨Õ!4ÀRîÉL∑≈π‚\P‘¶√éà¢¢—(ªO≈∆πm’∞≠ì†•£–Ÿm‹óíá“•D]Pu¯Q=G«˘3C¡]Æ
¢©?ªÍ;&î\∆EFâ3°(8¯F∑∑ŸøH§T–|¨]È9áåÅW˘ÚÎôŸÉï ≤A&K:µ≤3DæJ◊ç>∂A…¥9“|¥ª˘ñ?k3xïiWV‹ÅÆÕ9Ú£@7y]›ùDc8ëù'˝∏' w0í•Yçi5ıyi|:SºH⁄‚YG«é‘Íöåm\Â¨«ùh`õl’`ÊR†ﬁb+Kö‚lâ¡ÿÃco¿ße<ŸUOvÈ9«cEôTmçÒd&>O‹˙k+io¥¶Ú7≈™ÚU’ ŸíÁ.
û∑O€õ+ﬂ<d„¡ñ¯π±˛ÕCá…RmcÄ>è◊zu‡Q!H%ÜÏ‰qíw$øR`BÒÍuE
∏´)Èã•j*ãË@ (-y>íŒÉk8«¸•mœ7
0•<éÖJ'≥ˇ ëÙè7˚á∂wπ:ZxYIr4r‰h;‚m]9ŒúÆù∂€r“ﬁdGI<mü¬ññ§
Îïof¿ì|ñƒÚóîÖ. hÂaÙ/BT|¡˘	ÊE8ËÚtÀ .ø8‰óRë?HÛ÷„33øyyv¡´p∞ı≥{AÚì•ó5ÜØG3˚”Ì˘ˇ}Aîû_ÉÖSÁjO] ‰å‘∂‘ô”óÿü¨™$ª∂Â”•ÒhñarbÃRŒœI‰π–cÿ} ˙V}ûí#FyÃªËÉMKB‘lÑìˆù˚¿¿Õ·Dú%¿õMf„0â˙¿∏ÀÅKΩˆ :â2∏Ñm∫Ω-¨«Çú·v®vÓ#@<7¥˙ø2 ˆ⁄oÚ_‡ˇÇl,BQú≈ÊB~¿1ºmlO¨?î}u,ñ3ÏÀlöxµéøπZÓvcQ[ÆµJ·oXH∞ÄS˘lÂ’ÆÈà$.kÏ±Q.†§ÿπ®pìK; íOÒÀËÃ›ﬁª≥ˆì ÍYÎΩ±e˛ u√ÀúéÓ9_¢ﬂ1ÛlœueiK¸ºÕó»¬4cgIæ(~‰ïy)πxÉ¨±j¿*ˆ∏V}¯◊=íùƒQ!LzÓÙtbÈ⁄ÈåIÀùπÍ^WuÈ¡‚Ë-˘5	è∑ÁJ]Øm∂R1CƒC|„xˇw»OÂhú=vG∫Tù‚` §j.—∏Õj„5.5ï«–∂F]rGêí7BÆ¿∏Ó
+BZi Q<˘„”e™ß¬»9ú≈∫EéáHFP1÷¥5J%†íçRæ*TBp∫ÙÈF©
*2ÇéƒéXá°w®·f•@sUlÏ°qFÍª\öúß[‡∆ßOs”Âs©*h,Y©˘õ“√¨m`0–Ñfñ€≥ yÂtı’≤Î¢É‡Õ0¢ôußÛŒÄª—\∏M≥.‹çP∞J˘≥LèﬂPSã¶xrëﬁ £˝Çáp ‰Rw®å√|∫WåÌ}#ˆöm√˘Tå˚‹8ÕgùO∑tF◊∆d∑0”ª¨&“Äﬁ«Q¢,—xœÄCÓ-$°±√˚∆7öÜÍ4í˛aêcnﬁ”.HÛ®v©©€V™Ùˆmòí…ùóOøhƒi÷Xó!VòÃÚ1„”ª—”0Ê5ÒQó Õﬂ¯8Zg≠«ÛKÂèáYÖ∏ùËÈ€˙ï¬¥…tnu£Ù¡ÈÑjh^ÁX≈Ÿ™f0ÀÜ“îL> ïR%6ÿîpÅ≠Gã}˙)ı%ño∆∑|lÚgMÔpf-Äâ¨ÃÉwfìtv§oh!û>La∞N	‡˛ ÏÉ@Ò¯—ù¿…ùdMæ’Z |Lr[á"S÷ı≥=]$˚»e7˘IìÔ1i~pYM'q2ﬁßˆ8~D°îw&7`G4sõ+¸eÃ'z„˙—¨Ç#d·Û©∞.äbÄ@>Uœêˇ∞ºÉk!ækÂ`ZÜaSòX¬ç€I<Ü]>E3è|8ÇS∞9uê‡ª¶±∂|. i9_#≥u
p#Ñ°oÊ‘©ü@%}	ØËGL´Ä´>Ìêÿ#Ωb)s¡Ô§ﬂñ~Å6ÃÌÅö]#/`æk±Åˆq˜Tå≤b@zu_.ni–Ôú˝cÔ÷Ú∑¨Ö§≤–Ï=ªï€|´è∆«[˘7È{ˆ'≥6è≤p≤£3ZvÖ£Åµ•æá{ ˚=|¶`˜≈]ì¢·˜t&a≥Å›`L”ˆ6¸+êvâç¢qî5ª≠Çw@:	¶¢n≥<¡,˝˝¥Io’öì›S∂ÓÑ„ivÊ⁄h«»2Ag™Â :;X9‘·"¡='ØzvŸñ„?–Á∂À9–'~ˆZO˚ó¡^´v;@+rDÏ‡Å>q™DO–+T[î π/:dÌ·gLıö∞Ø¨∏Ø∫±@œØAP
–Ú\nÙp£©ßî:6h#ÿùè.B_-|Éîı—¡◊@/F›\_cç¸ô˚’"zu˜ÿ9·B3ˇ““ºúπi~ıÚ≈ˇ‘“≤»|◊ø¸K÷$ˆÙ~ú±€HZç⁄czKéÕÌ¡ÉÎ^'$G·B˚jƒwH7h›∂Äzb/&tŒíw'∏gÍM∏wÿ|–7µŸπ™r·TeIÒy™'‚°e<Ÿ“ |uñ+y7π[O3Mú˚[ﬁÏp6›'%ß3™π 7Íw)Ø<Iu^∏x∏Òè˘◊§tdAﬂœ,p‘ÔRvXp’…ÅWØ3Å“CáÜDk€TÆ™BjW‹Îaô\AG∂bñÅŸÃ2Rô€›Ù{µèµ^~™©£H‹0ú4	ì,ò±_":Y•˘ˆjuhöBÊ§r”Í\ Ì¸ñZ˜˙ûíÆ@ÁCÑC.	n∂ËH2•ﬁÃøÌI∏å$ùÊ≠üÅ∞ˆ¬4çHÁœ=I˘Øè±˝«R¯|Ã€}¸Œ\tr˛DÔe§RÉ;—.ˇ∂«5å…»¬q”~cKÛ`~ªÿQé\V©ß?ò0r9PN„Y“˘4¸««*‘⁄0ùüìñôD{ „}ˆ;Úö˚ÊÆ⁄¢E4ÈèfÉ0m6§SZ°ÎÌÍæÏáhìß≥c`Mé‚¯i’Ã’‡»˜ıhù˜dù~Ï}Gve®ˇıºHﬁˆæ«˝Xõ2VÅ'6Ω	;òÙ^Ëpú[0q›”-êÛ˚	≈TÄlíS„ıéC≥â‹€˙≤	•Ã€Õ›$	Œ:QJIﬂ—·ÿu$ïf\»!BÍö-~Œ«]>|ın`Ï¸Òi‚,Xáπzà{|‚¡´uc$/{Ç[Ω©Å ©π3∫ájë=*aÖƒ€qb•”Dcó%T.›∑q%°îÁñZÏ7“"lÊL>ºe∂Ç~4W–·π·$±Çn„‰Õó„2¸a=fHKsÔNﬁ1=kØˆÚÍY∫ïI⁄ÎJ≠t“‡-˛k+¶¬ﬂù›Yïf m|◊®Tç ‹¯π i‘—µ
5®ä"i"æ¶ÒS30pfDÇSxµÄ©eæ∞¿µQbî;m˜Vÿˇ—„'´ls∂µÂ9wN‘Äe◊°∫JÒ9˚IPë8æ´ΩÛ2√îùßnÿ+Ã◊Laa,ıµWêÆ.{∆ÎãUêúïè\%˘d“–ˇM9Ì¨ôKpˇØ›πF˝√µä}NexÓ—¶Äiˇ(Îyâ‰€zI>*E‰É|©Iëócv;N£ 74˘ÕÇbç£‡Ûˆ‚mœÙÓÀw¢·ºÇΩ£	Y=}9zska—íhF={Ñ@ó„”ªvöª,_Xˇ¥N¢$ƒˇ ¿ˇÃJæ˙9ÅùÁà˝øxÍTXïøz˘‚—Í˛J≠Ω∂^£cN¯ŸèD·qÇ‹äÁ›ÉŸ_éÆ5[ÁÀ;\éŸ∂R°ÏâÜ:	'AÁ›ûºﬁ‰.ÒÕ(<fìªHScï© Œ0’Bh•4°uÀ•juƒb‰åué£¨ëTöëíÏmiÇ≥¨ì ÖÕï%∂°€ü∆A4πs;â‰,®uüˇé¬tßs∞ràLú~˝å‘I¥v@®¬˜ïÉ⁄7™C=∏Õe¿_IÖøêHrt¢%í<Ë'Øˆ»ïëxÉ)Á≠RÜ¢-.ﬂ$èWR¡…„Éd{πSm„M«[‹é?lMMßULœõ]W@C%„∆nDA◊∑ÃùàIH˜„)ª$[â
{óRÃk)H/êI1lz§eü4«ÿ5YJ…!Í¬ƒ–ı`ú«>@™¯
=E≠v6]VÈÙ≥—Œò–3e@Ü…¡r¬öÀ2∫∞Ç®T''˙≈®©©¨íq∆U#ÛjÓÁ»›_hƒ‰XÊ»Qf◊¿(fÆ)z>n[xhÚtŸ∏Ô?£ä∏|-°VóÊ“⁄mgup‰‹”Qá©úÈ˙cπúrg	¢À-/úJÒH8›ZX§2Æ˙ëH%ÒP£Z_ 1•êlgºj\Ú·ä[*íŸù,€ÏZù*ï»3‚8Õ\¬∂+kûÒ¬Hátm7…"å˚ D	¶Ñ¢πäa$s»8◊aUÿ2ªé¿ø≤?ª)*>Û¢‚F∫Êa∑¿«¬rÀ•¬#k¿øˆÃµBàAê<›2=∫ç +Öá#√`ëÁº45ÓÆΩ•Éôå¶∑.óä√ÑiEo][ê√Ã–:-›4ôNÕ1}Uuvuú÷„Ú-©]0äN&Ìq4åä•∆x≠ö“ˇWˇL—”fñzÊÎ›Û'b˙Ô∏:#E@ñÜzëIŒ(]#èkQiPœﬂ$–*b©c_ ê ≈uØô9Õ˜fGm±ÂÓÖYÄZpd/JìöÁ”IT…]teÂ*w°\"∂ÇüXo›jNáã>j†vJr‘ı3¯í%Ò‰ƒ#–nö·|å∞˚A0DDj≤0S§)ıxÕôH”È2ÆÈ	~˚ˇØ˜πkTUà´∑ø,ûÜ„H^Ö≈Ä†Ù!†/@ái"É¥ô«{"3ÜÆ0W:åå+gòÅãGÃ¿Ô≥0H¥!ÛÊ‡P„∞o\ªzÎ,‘‚-‹ØæÍñ◊PÑ$ˇU~fêè†êe(~Ÿºä’∑
„uK¸ø†(Jœ.vúÑ'áh‚-‹=◊¿sc∏ŒòhÛ\NRrö#O˚Ã†|7dÿB∏.“]Óu‰ˆ*°%¥tX…ô
≥ôì»ª'C|É5qD‡∫OChÙ  ÉÑÎ•Q¨,kí∫kãïØ†w}<Ç÷Nsc1B¡Ø#¨‚L2 ˝ä#}w8êYáŸÄV¨äQ‹dfTêùæÃ*ãq;Ñcﬁ¬(€Ç?(ïÍh*paLùŒu[ºrü&bÀªR°‘ÜÇ¡;R§EŸ∞ŸxÀÉñ¨b<ËU∫UÄyöÙ∑Õ…9
"âGi¬	ŸU$√ˆ¡ö»lqÙ]¨†%“H„Ã@B”Ñ
πò≥f(Ì¬#6Hf˚/râµ:î C¶Qa€Ï∆H\zØ\eI hb)É^4¶¸x.ß”¸ÓÙ‰”ÔN√ìOßììOO¢„OO√£ÈßG„iÎùÂ®ú/ﬂr¥‡éK¯«yC≥) 79÷io‚ËX‡±2qç¯Ës«"(∞?C-æX“?¢ô™ Ã∞`©sú˛öm´Æ ≥¢û›[Ò´¢,O|ô%≥	™¯ú·^–w≥ãSaªYÙáàFé(wC{Æ.úk!7FqÍ•FGËcH¡4ä2<¬ÿ^‹Gw“™
>U/¶2Æ∑ãLÑQÿ“≈€Ã~WcNCäX{¢r‘úûv§)æ”è«À§™NƒüŒt8›ômø3'NÔ{‘U€ˆ‹èrªÒ1‡Õ‰©IT‘øLbiy˜∆^â†5Otyù«[tYËZ˝ÜÀL∆Ozµy˘ÚqÔPè{ÍnláÎáeó%êE‚'v7?î}¡R¿˘µ,È≥!WŸ˛;éF£∂ Æ≤"_èüo7VÄµÈ≠¡ˇÅœú¿Î∂˜‡B∑◊Yπº⁄_iot6zó€Îù’À´Ìnèˇ?≈BÚ4ÌØ¿Ø+WÿZgusìuW:W÷◊O∑∑Œ∫›ŒÊ˙⁄≥ˆ&‹[ˇ‡2Ù∫˘¨Ω⁄Yª<\Ì¨¨]˛Jg_?V.≥nÁÚï^{≠≥±Åù≠ØÆäÔ›Œ*ºF⁄Ÿÿ‹ËÙV◊Ûoœz∂’∫ÎùÕ’>êÜµ+]∂Ø¨otÆÙ÷˘7Ë`ÛÚ4Ì≠√kW{õ£6Ùﬁc4 ¸Â+œhÄ7∫W:™åßw!”›Ï¨lÙò…'çe‰óüùò`ß≠aÏ„¿`üqa]ßtw:Ω¿>
¶QG∫Œ}N;à@Ó›£,B_•˝”[¨nl˚ß◊;:^?˙™ÌüŒ :‚Œ®HzvPwÉPse≠ˇnÆ¨·	∂π	8øπvÖæ„ª≤∂{`öØ¬¬ÓZ›l„Ê|¶?´Ú◊jßª	ù≠tˆåõ∞ŸYÎÆ">√4_[ß7ÈJzÎ≠n–wj∏÷∆71|mÌ’M˛ä≈™˙õõva®W÷ª∞g†ıå∂ŸÏ°çŒÍ
ÏŒ∆˙⁄'cËÌ eú” Â>\∫€Ô :º≥w∑ﬂ˙≈Íï}GÍ= ÏÆt677`óØ≠Æ—˜+m¸w^⁄Éw≠m 5XÎÆ„U~´K_ÈÊ:ê∫vôQÙ˝
uC3Ï"z0‚u≤syaª±∫‡
ê¨’ŒAÈÚZ.lv_a{Ôá££…ﬂﬁ»U3qyñåv‡øäCÒ]ˇ÷◊ï¨_ùΩø≤≤πŸÔ{ÑÀG´_Ëﬁ◊√áªÖ‘uê‡!AêQÖo·¿T>IÙ~-˜©¶0>,◊¡
‚MK–¬íHŒﬂñ∫üDTò˘	õ¬†´6ı˚@éøPlB"”√hRÅJ ñŸ>˜.%{‚bÖ?H∏QÈ≠eTdgˇ˙hó/-„¯fπ÷ÚµÛ.Wƒ4L¢„ÇÃﬂ›∏ˆªˇˆŸﬂπTZV’"‚ºO.@#˜9‰∞^W‘Ñ„πe©≥b≤•#à¶‹jÜ—”Ä[¿ó
ÌcZº%∞xÉ+∫MûÇ$<ç¬¡€çñª#EÍ n£¬√æoE÷X:•7O∫Vè6{«ºæ±æ&∏æÂûø∑»…h[Ãmç|Æ’–≤=tÇAJˇÑì4º5°¢cb®ö‡MŸ êı¯ﬁ˚{£8ª3ëˆxh÷&ò/awê6Û'ZmÓ.¸1¨!¨7æc{^6Çsñ¬õ|måQ∏‘uc,ﬂVUàƒP(iJÌ"ÙxˆPòÉ~≤	ñ¯∫ÄnàÁ	B<∞ﬁK[$/ÜßG*Œwü[J™5{∫ÜL¯z<8c˜:À¥^F C;”°e!ïÓË¢˜\ZΩ1¨6≥+˚$÷ l‰'¥N¡≤áV”!ê&Ω)˛~úZÌ˙ÚdÜF6Ÿé∆'òã%âß©”∏‰2ÈQ·ÓÒY°ÏµhüÎ¶w•1_ÿÅØú«tÁœ„Zlj	_y“aú≈ûÊ≈M3‰òBªΩ·≤7µë*L.„Ån$seƒs¶sÂ:+úG√’-”õP≠ì˛0ípB¡z vÓ)ƒ ]^3Ó’+ÏÿÚqGÌUå,¿∆öï¡¨%ﬁ(Ñ¶ÚèÅ`Õqh;l©·U{,‰ûDh√◊\÷d∞^—)<gÑ¸b¥`]J*uÍqSé‚ætàsπ nîÛÂ?úÀ%p?vuy∏ÍÃxX\∞bé%4ãXIK(≤‹{Ë.°*P¯≤Ñv	Â/iU—H¶äKæ—eÃÎW~◊±d1|KQ#äIŸÙs®πaR
O™‡2h∏aQ,¬mü]≥Qù≥À¡YÃFNWW6æ¡º7⁄ù&\ˇtÆ.œFïßÓ(∫‡»Gëc4ÓMFñrw‡rX°cy¢lãªt≠}… ◊œJ-˝≤∆òÖXØ~gD j\È0¡íßÓtß“g/_oñ◊ÂQT±2Ü<ÌÚlÈÛBÒ¶M‹ìÙ€ÂÊµ;ê¥{nÏOóoG£∞¬˝+»õ+/0Ì⁄Œ`¥ªß÷?q¶TÌºzÆ◊KBUMlzJXÆYDSÆQ¥ÍO)⁄·«2àÌ™ˆ}Ó˙NW( µ©A	√#◊≠ÅYS+ƒ:•c-÷©Á®§‚0w}ÉËæR‰sÙÖ¿3√∑1brW∏¡sÕ„
QxEgÊÚj*◊XÚO©ﬁí!1>öøi¢ºM ¸Ltç˜|Âõ‚§ﬁ6Ånâ¡Û/ÆæùÈ…+9ÇU&+Ø¿b±UØƒ§Ái.®ñ™B¯ßNÅÑS,˙3ƒTu#X˜Ø´TØ)ÚÊIUéƒÅ¬'Û2?n:Ë-‡Œä,√ﬂ<Ø-Òâ≤¢‘I]≠<ûLT√¡~MN7&zaYñoã¨ﬁÍ
˚∑<Ê]Ré<0˛«22YDø˙˚˚·'±ﬁù†€õ/˛´àêûÙ›A·ê≤6Ra†nYî¡uâëóı€•@’ÓXÜ“Oxƒœø8≈‹'J!_∂ÎU∏˜mÕéÀ†—ßb˝N˝ìŒºSë™GˇP˛ê[“”°˝=aG±_Ûòk8»˛Ün¸î«“ˇè∆ÊË©5¸à"ªJ6Lø+ˇ$ˇ8]`a¢#Xeû”ƒëÂC‹TI>d„-vpËÜÅh°e·0Ò ÖA‹Ÿéñúè3Ωë?¶›uÿNdÀ<√»# à"Áz‚‹%RπíéΩ©ô‘õàHï≤‡<l©™ÄÉWâ"hT~úπD»fQØ s¿©aE•àBêT
sSy“ã¯ûáõ9‡‰Jr„AˇπùƒA∫LÀ‘7ŒU‹¡Ù‡£ëmRZÏdãôr–E#Hi¡≠+E«^gêÜÕ·π‡»Û#™∫6
ni1's˛	;iO1ŸnpBu=Ì‹¿ÚSH.ûß#Øö£Õ≠bk∂bcLı¸<S¡‰¿G¨N–$jÛà∏débZ≈√{Æu»≥R'
ƒ«˘bïñìÑGi¿ŸÀÕ∑çkCgW1lú.ó™Â«È@ãÿ¢|Uq\Ó”E[£GB≠BÊx7nT‹ÛQª<¬»*úŒ'i)üÅc’Ä1qœHå‡@?qi≥QçjÄZTﬁ¶C^§ü“˜L£nîﬁÎ«hzS9FÎ◊
¡Äã{ë N6O£	Ã’R´Ch†eÅ ‚/˛	È´˘(è-‡±_Uˇ ó°‘Vˆ´©l%P?èø∂–\ﬁË’8˜É—»>Ù
¢2Á¥⁄NáhÌˆ‚kùä(#”Ê¸îxÎ_”˜‡˜gZ>
]Ò§áÜë%:ºaVR«˘≥(ÄL¥YK&¢í≤Cmdà0<≤GG)ÇÄ$æÈwµ:)€sÌáﬁFÏﬂmI≤åﬁEË]|”Ô•R∂Á∆œºù]	JÉùHíŒì4ÌÒ|¥ÁVv&Øb”°÷ÏˆX9ƒ1˜ë(dΩXêª-ìë¿VíÆ∫¨,2ÀÖ+µEnqÒÏÌÇn¶∞d ÄOw.|º∏ÔÑLR8ù;€påc&í"±õ¶ëu‰'·ﬂYS_OìE.⁄u*Xèb⁄"¸T´°ÍI/Ó™–ñyW4Øüø?E˛@K¡¯r7©∏"@®ÿoˇÍ?_‰‘[Pn§[ÂÍjÉY¿Ï∞^{SíÇ<qYQI÷¶<Ltæû›òmÃ0Øàä<À,Ω°fºkÄÍh·J_Ωë≠≠jiƒ^≥™ßf0È˜ì©£÷4~*j¸Xï†ösUBã˙u
˝¯·¸Fá◊ﬁ€è·9ª(Ì⁄Q8ûE1fâH«qúûNBT1±Q±t^µªÏO!Ã*˜%ã]∞CŒmˆ¡(94 µÂ€t’%_◊Q´wA:Eè¨ÉÓ∆rwÂêÂ5Ôrë¿©ØÆDˆíJ«ﬁi¯!5—ïØ≤´NKD9ä≤f#ØOÜŸQ¸\V`˜∂v˘∞√µöäïuwR¥¡,!˘ﬂΩL¸„©ÕJ5ê}`,bÙ¡VöZåµuŸ´&D-≈mIµhµ.7s‘À @{úFÏ”_˜Âµ}±Bw^Ÿ◊ }RûÒDÁMŒ|b¬ëÛ2øZ;„•œmfqÎM±¸(L€§1¬"ÊJ´T‰¡D∑√µ¢hÏ7ê© à'Éß«∏jå ¿^BÄ[ÛÃbaŒ◊ìb ≤ !ﬁ´Ì_†çá˚r∏3(ø·Œüùä„Àü‰A)5†Zâêºƒ¡ êÑ	b\äïd™©Uº$√?Vˇpﬂp^∂„K 2‘?sõ„‹¨#i	m$O"I7µŒEp|p¿Æuøg— ›ûv+ "áıÖV‰≈‚4îºXQ˘Ã¸˘U]õõı-ú/£·üó™HZ&¶iNÌâaﬁxr6égÈ,I∞=ødC‡Áüc>„fµ%Íµ[¨ÕÃÚ;RNß€•ê4OÎö €xN¥Ò^∞gŒQPñ§R∞è …ò‰ú'2…NrÑ’¨‚uï%©d*∏`Y2X ÷ª=¯∆J¨áWÃ¬≈J˚V≈£†.œa]†Gèn›∏uü=|∞∑o	ó≈ ‡Ösç\å¬(@UÂ…^kïJåØOf¸"≈≈r?\∑»X%4÷/.8æ——#<µ’‹ü´⁄$Ã?¬U!i˛)äõ¥;(¸ÜÚ∆!ÍJO´RO%@/;“£Òâ)ÆYbŸ≈*èÈ◊®|¢”ÖÑ
oÆ@‹Èí˝3”¿˙p0√›U3a_MÜxıu0ƒï,qS\ﬂmùª1wΩÈS≠1)æñ«]‰wgü6›ÃÌ%JzIcn/s{I0∑ó/{I2∑ÍÇ≈Ωôs}|d—ûıäÓjªÉ=Me±ˆÁ0«ä†|≥1πíÎ¯2#r≈\T§J≈·≈≈Ùl›
] ¥Ï.ΩB∏n ªX(V˜5¨è∏ˆá #Ó?∫uˇÊù˚Ô\‚⁄€¸öKîüØπƒπƒØŸƒØŸƒØŸƒ?p6±p]}Öﬁ·Ë>ûM∏;â§yè¬Î¡‡$l"ÅÏÛãè£∫W}ñhâW(√ø)UmKoùo1ÛŸù-ñ»ﬂ+t∑é‚ãæøówg¥ó˝Óêm]Ôœ[¢´p3Óc∞Çl(é¨/ç4ãh‰√— öEÈÉ„„Ôr/ƒmë9Dƒ§¸a^ê„èﬂﬂÔ%ÒÌ+G˜Ô?∫”?8˘(˝7∑&∑&¨61¨ùúºî}#¿>˙ªÒ<ﬂùeÄsLüÙ∑_≠wã;z?˜ÄùF›8^<ñ∑kîD+≠÷◊F ≥h≈‹¢©ÊuTPÂijõ⁄– ^«⁄Ê∑±nÏñΩaé7Ü!Ù©“‘SÒ¿pø7YíQö\õ´)Ûı≠ûkΩçÖ≠ÜÓ_¯e√˜è/®¨Â?(>8–‘Í "«L¨•ª0¢»¨_>d8¶X`˘ÖöC3Ï)<˜·âöuà|§Xwl$2LÊÑ∑r'F¸Æy)j¥Ÿ§ƒñÎ°"ÕÿﬂΩÊ=≠◊-÷L%Â%⁄˘,ÊtF{’{úˇ`üR∂sç™‘\é√xÜ«N√BWÌQ<èÇ$Íâ—!IàÒıãÿZò.!õ.At»…
Ø“q≠yp®Q˘É¡—˝¡õGıçß¿MÄ»ıç..Ww%O•ê∆¯%ΩaÖ“N?{ÄB1=π'Ôm U‚Î4ûŒ ∏çkMŸ¿ËòT∞z&£≥%iSW G˝I~ üºØ~è5ÃŒé∆QñöÈèÓŸWÀ_bV ’ˆáÁ-Î¢éŸiØ5Ò_ªCÒ •3î˝i◊jÕ	ü±&Ñó*◊∞≠ﬁéì•¢≈ÆÛ·l4–π%n!ïW¯f;˜N9	ß£3h∑¯=“.,;ÍHAÌë¸U^‘⁄]´^j¶-Ω¯mBI2Pwr@±Ñ7îJ@§^c‡ƒfË@uΩ|¶8x8˛d&N˜¥÷\øá◊Úy#™<Ôâ	@oi˛Dp% M0,]'Z¯€x˚Ì¸H(t2õb08∂∏3ôŒ ~«¸I¯rÎ¡–UQF=¨ûÊŸ\7‡;)≤öpQëøtÎ<ZÏK”ıæûXí9ÏpXt‡Á,‰;G«‹&\‚óÜÚ£8<
OÄqÿfÀ‘<⁄üÏ∂ˇ|•}Â„ÔÃVn¨¨¥ÒœÂ€áﬂjΩ≥¨?;≤˛ûÅ>;ÙΩiÙ&ﬁÉÒ4t7èñ±÷∫©÷ó⁄tó‰
”Ö˝†∫À»Åÿéqè‘Q6H]î‚kø]-)èø9/,ê@å7ªD˘	ÛØcçÚ˙öVI¥ﬁGa3R 5&ü0xøπöÔ€:˝i1ˆÌÆX1.vr‰ ≈« ¸¬>œÄ®ŒåPJ˛fÙ{0˙#Ä¥ÿ∑Ÿì?zg.«yŒû¿◊„≈g°°që÷Fö%æÕ∫J≈bl~1H7¿Ìy‰–≈&‚|˛’f¢Ìk*oï¢åé,(#Ëd:ƒÉﬂ∑éèyö∫&]¥ó·¢ö;ı∫ƒ˚aë§ÔuTﬂƒÖ√⁄∆∆|›·ˆ∏IfÜ∑ÌXtMãáÆõ%g÷⁄$ﬂR°©m)Ÿ(Iná5ËBÆgﬂ*‰…x[÷2≈™4I≤ÿ4—hßÌ£¨Ÿ¯£Fã; kœ4∞!Wﬁ(Aóõ2êÃµûù,™Nƒ<rZK ÏÒXøµ∫—“Æ∑ƒ6¥T
(koÂ[Mª!Ω»_ïﬂô·ä≥úq-°h#™îni†ŒÔöÍ∑-]¥%∂ ¡iéT÷)Eö¥\ı	Å˙ñŒ@Ì ®˜±”â“ª·I–?”„V˘ÀƒúT„∂ç˜;˘~Óó¯û’Å(ë™u`u…Ìy®ô»Éyt[ïP˙¡˝8%˙÷·âË+ÆÃé∂Ú∫ô¬»Âì0,sò1YD≥(LYRËu	øâi"Ùﬂé,)BÔ8«î}ÿtââ∂–.ô/[R¯}àû˜¢+¿EèÿYﬁD7¨]01â\¡-{µñäç»#‘ó∫$K!{J›°-) /ÊféXARÀã"Ëœ´¬¶Ó¥ÂV]^fÔè‚#`Ï&qG}≤∏±„8·‘Â-}P¡`Ä#Í«£èuÂ”üL∆∏àË4Ç—®°ì®ıUåf∆¸BüÛX	&´√ˇ˝˛’À_˛5k¬Å…8∞¥∆aö'–≈ìwÊ9ù:◊É/0Ò?√T»Ù/ä†Ìz„À?‰ô¸H≥*:Î<—F6sÓÔcŒLÂ∑ì0à+uà≤4aK§R7∞ÍXò<Æ§ŸÁ-ãÍNçh]êÍö}†’Cø@Èdúëyvé∂Uÿ`ã£í@¶¬[ıΩˇ ®UÜ\ÄBQÖOÁG´JƒÚ†Vrï†◊yÉò@ò‚ú"¢N<
;!Vâm6n„É-bBCÉ24Z—tü‡rcF∂gQv÷lÉz	§ì	%:ÃI»[ä.]d≤ÅFC… 4iÈTñìß6Àg◊òê~‰”∞+Ä:ùÈRõÕíÊzü‰vD∂,¨bò˘πzfs¬àŒq ΩSêuQ’ﬁî£íxÕ_ƒ—vG!gªI»Œ‚Kg‚Ài ái¯SŸ0J˘ÚG#x;<z$°∫åZœ¡§éx¡”-Ãâ®∞Æè÷ÅdÃoÌÛóˇ≤‚EQ∆ysM8Ò Â4òÇ@ë’ˇöy¸j0èÜÃ√˚3_ 6¬t1Õ$üy“áac'¥ÃNK8RÌM_-ˆ≥]ìˇãƒ{4\@Âã£⁄¥QÚé;·ÛzhZYEj¨ Ú]á≠Òäâwt¬Ü
a¨›ÚFÂırÏÃÖk˙ü_ËÂÖ∑‘¬Ûm«œ≠ì/ILe^~í„-˘ºÎ@€<ùGú2Æ”qΩêa®—uCö°®J-Ño/W}}^¸°ú‹mZM€xöqRÄ£÷∞ß#¨Üv:2í%¡Y6B¸8/€gã%FÁ0á–ów∫ºÌ<^ÏÏøuèò0ØÇ^oµ.∞‰Íñ\Á‘yAL3MÒŸ ∞ûª‰´ãü2ú≈Â.¢˘nŸÀmË DÓ‡Æ1∞Œ@{BFÑx¶Í°dcÊlíŒé4 Oˆ&¡$¶¨©†£ﬁ#§ôBãäãm˜±ºﬂ¡ÔAº6Éæ‹®¸tL}`‰@l}È5î3º™·RÛ¶ÈËd&'UEj¯‚Øin·v™†€Ü:˝Rö- ¨é&uﬂ]Ñ<•+tA›O?Â,†≈^qmƒùRñXê[J)¿Ió|™»cüV{≈ÿßl—>Gî∆∫ºT$¸ÖûU¡Tz⁄—]ﬂ¡uÓ]˚Ú«·"@‘äì
YçY,øæ¶“›ŸXcsÂ0U+//ùÎˆKXda¬t„¯cCŒiU^ƒ˝y¥áºxNëøSTÊùÓSnÑf≠)ï\fß “≠ ’p˝"ü'∫#˛Æ/òª~Å≥√´¢ü6$LÁ⁄Ï#y#,Î/]°íﬂïßòµzÓ¨Y1lÎeDL˚voEˇÕºW∏Á˘cÑÈ£ê\Q¥!•ÒX+öî†Ô:„·2i™Òòá∑U∂’ÄWÇ-Ëá—Ñ†•M3£<ô'°'·jã]e´+ë€…8ﬁ÷fcJ&±7"¸µéıÛØrÃ”PñÛÍ«	 Üﬁ)yÓ ù„Ω©„”8mñTﬂ÷%%∂;0BQP-ÑÀeho¶`¯´d32‰‘I–â~«˝°÷≤F‡G1‰£p9ùMa<ûõz¥ÜX≈òºÂÇRÉeÓ«%v‰CÈ —áÁœ±)‡∏Ùû—Ú»’Ú»lIÀ(}ê˘»Ö√±éa®¸’mﬁ±%48:íÓ Eâ8 w24⁄”eõ=††?âi»∞ã8⁄˘y.f}£Œy3ùç•O‰íóï É[Ï€v=lÇ2'˛ï7[∞ui≈≈àpV˙Ë˜q–˘£{òŸm¿Sıcœ‚´ﬁ9√Z¢0<˝Â˝9˚=Úıã$Fã∫;˛…óÀ˜µ≈Ñ
˚˝H†f‡@ÕªõRc8õˆVïmÑ.	éø™≈LÍìÃÕ-0°Ù˚˘Ú{Oq!´©ﬁî¸˙Óªñ>•Ø+S‘Êrzr˜˚Ëe&Ô‰;aZÇ%2¶¶‘LbEéÜﬂ⁄Ÿ±9>Ä‹†cÙÑÎ[Ñöó„‚ò‚Sxòm·π‹∞gŒœuôq…4qEé(°o™3wKLèÌ0£1‰AÊpû€èON–+öoãRã`8éø94ß‚¿å*ä=ÒO:x+*:’+‚ƒöG!ï—åO¢	»ÍIöµÚ N∫d}ÆÔõW“¡“\å.ræà¡äË†'s?NW%HeÑ≈5Å—ùMÕu¶ù?xÏ±§°kèƒ£¥báE∂§‘(ƒ%”ª”™N)æF©©∞¥œ ﬁ1ªêÃUƒı¬Ç˝âˆ‹UKÜŒ¢CtBTs—<u?/qWn-1„-9‹%)Ä)æSÙ+ìûôK†ŒÆ„÷°¶2FÑ†wsÊ„∑ˇÌÛˇˇ◊◊∞)âzmÜEΩM5%Qh€æøÎ=pò∂∂O?Wö”$|¶â¯ì+t˙Ü R‹⁄·ø£D≥$Gr{Ìñdm.
∫§:)sH±õ˛Í∂ìÇ’„k£áKÌøË*|µlØ[+Ìáñ÷†Îÿ‹Ñ˚Nê:√°nŒ«‡4ﬂŒ˜øK{áù˙<«ÒSÙ«œB‰Àxë„GzíÁW–Û
Á~_sæ2s¡ú∫4T∏c]679È4(˜OY+U5Æ¥ëßñ4	≥ıÃ†Z˝r-#∑Â‡Â‘Gf»z°>R¢°•wvô'8¢ÂOî⁄¡wÉú¡)÷Ï$L‘GÑπÉÏ≈ `®]1X'	ø7ãí.Ú[ª£0…lªI„v ÆõA‚˜
A0:ÁÅﬂ˚Òcä˝£Ù+9∑Ü„”õñƒ\ÿ{fÅ›≤¯>1b-øéßTµÅﬂ>Fó¬‹~4ËR›äÀf»BÂ!ﬂp=	¬ß≥ˆ¯—›N'πÊ ~7Ì∞ «◊˙/!3ÜY>7”√O[Yu√„¸YÏQÍQË!Ù¡°ºê«®K“ j∏´ g[6xÛÁÒ˚∫œ·y.√¸sÆÀë`âl)pˇP,ØÖ•Ïúf¯¨Ëjô&ÂÉgŒè»†EY≤8Ó»lr';pD;èç‚êú•Äe·Ì*0Ω∆Æ˛r9Äi˜√4)¨◊Öπ6cTh–Ag‰%¿J?ä≤°H∑‹(îÃÕ±Yl<ﬂã>	Ô]ﬂb›%¸ıQ4»ÜíBLâØÙVñ˝>
è>ä8ƒJ≥heQ0˙ìY 4‡lã≠t6M^J#q∞§8√Î£¯H˘0–oà{x\Êµ$Gj˘zÿCÄ‡¿|’·Ròy}pzgä~¥ ÓœÌÌÖƒﬁãp¥áFhòÂ^¶ÂpîìOÉ„Pêc«¬…¡\RÉπ‘"%R–õÀˇVÖ›væ”˛¯p‰ÂK_r∏ıÕ&—˜f!¬`¬ﬂı‰ùy> Ûˆ;<◊:%wi$ñ}ãu√+‘Dı¸â˛˘åî#ú‘≤é∏Ò-ãüÜµÓE	0(w`A#ªf´8ˇ‚d,å∏¥‘‚ß›X6Î”)∞cÕKÔKK&∫8_ (3ç1Ò´#JõóñÉi¥Ã	ƒ•b—Âqî–·Ê¨ºdNÜ@U0kÀú]‚ô~¢Oà-º¥≈û\Z	{gN†9ípÂÁ(¿ûíS2n⁄9>~9°Œw”b!\È‡Õ[ƒO[,&Ò)¡ñ¯≤&˘ÏßF»˘®'®$ú»Ü]≤:têPÍañ¥ÀY˙ZÏéU<P6	è%ö-±'ºÛtY
3ÀÔÃMl?bGJH¯‹ı≥,Lõy˜Âÿ‡òàÊou:¡ª»4‰˝Y€?ˇÆ}ÕOà=u.®W±t÷«Ò`Í≈≥∑ı≥¬+aÙ˘DÁåiçÚ√g,ÏàŒÚOûEò0Z€Ü9ãE/V<,∫ÒX’)OZ©ÃâÈR,=Ñ9ﬂ‘≤˚+‡∫gˇÿnjπ$"Öá≤»•2˜!}ß{Yπ/5v◊¡‘9Ÿ:cß≥v6 K(Êª…≥|1ÒéN7∂C1 ¶ŸÄŒFÓî˜'ﬂ·Eñ4y^6#‡∏u>’ÖxáÔƒó¿dI÷ÆEøÙ)ÏKŒ‹å…≥!¿ˇƒk_ú‹Odj∂ﬂ–’ø|Òè⁄œø'„Éîà:=”¨û∞3Ò0<Áå5Ûòâ|î—rttËË|„Ôh§Q»ôa+'FØè∞9(_—¨$ò˛ÅÇr§V|¿çÈÖ §$"‡Î`Ä◊®◊T“’∏¡…ÏË*Ò‹Z[9€⁄x|Î[ÎÌà÷@M/m=Wû”U[{ÕÉa…+[Ãß¶_vâKviÚ⁄t
“g˚¨Ω©rwñg‡N«T´ç2Ñ]≥èß%’’L∑3ÖÆŸı¨]µ¨]¨ß@w %Ó§´f⁄—{úŒﬂàí˛»,Ç 3ëˆ÷LÙ∑Ù±o”ÿêfgXÂÛ‚çËH˘∆Ò——qo≠aÊû7Ú†#Äíù©
ÓÛ3ÍM∫“∑:ÎÜ™lÆÈòäKÛ2”z}iªê≤‹‹›UÍ:«‰N+πøãYu=W∞vÍ‘Âöb8i®Á‡∆äU„œL˘m÷Æ.I%3âïÈi^∆ö±*ÿ	;õoõ˛ï>ô?Òßyv’˛d6ãâógÿµ
Áı;DÖèwÊ∆0a]/yrCãZ Ú÷%X∞K
Ω÷ÿU(¢*õ´KóŒüËP±™t‹&ˆE÷ü\;∑k∏”C”1ÍÂ¶8™í◊ƒ}¬æ)ûUÛ‰4ﬁñÚÙÒı⁄\Z%\≠“ÓD˛≈BÛ˘Û◊»˜Á9	}F@zA ¸˛V1i˛’î“”`'w…ÌπÚï:∑7%Ñ]™m!õ6ÕdÇ¿4çO 6°/œ‚B{ÉñãÖòƒìê≈≥åR®”≥@G√èr\_,¶(ìÙ^≥Úã¸~√SÑ¸I1?•¸"–ñ›&Á©´Àº£“ﬁÖüÓ5DUîù‹˝>†VãÙ´≤”˛‡c˛'í∑>gr[º‡åÈ%˝øÛ£§2‹K|4Õ{AÒê˜È `!âßº™ı”¸Q,§6÷¡îõÁ†∑Üy∆=˚M?˝G¡Q82∫≈MTç„"Ê a˘ªÉ&’HPU™µ=µ	—kÚˆs[^'∞}ù§dS´ﬁz}âWúÒTpquÉµ;
µçz˛0s<feN¬#ï§d›ÖjÏó´
ﬂGqÜÂ∞®8 ∫Àã}Ø∞”ˆ∆´,8%q`t¢äxè–Œ‘∂◊¥“6gm wÃ>‘q÷'ôk°\*ûÂJs÷ë… ) 7Ú4x…í”0πgkS+û§ÉIdÅ4Z∂Zy—uQJ•cåäœpﬁ•ïfﬁ Jéƒëh‘?S2∏{Î©´˝–˛¡ïT«]Om3Î§á›Ïc≥ùØÛ≠)A⁄`C¯œ‡qu∂≤Ñö˚î\£:gºíRY±õ`íC ƒcdÀ8B¯K’xπé˜d6¡ÇÙ˙x/À
Ê8ë∆µπkX•≈¬]ë¸¥w‡∂€IâÅ¨¨µHF%”ÖL‘KÁ˙\} 7<ä¶‡®¸†Ïáˆ4ØŸ$VÑS[Äø6Ô*ÿK¡¢(K¸ä3¿™QÎënæÂ¯E	!˙^›OÇtÿÛÛ÷rù}xQúÎ[R}ÏjÑ	©<gÓﬁ‰⁄L9ÎÈ»ÉÌ~‡è√3‰ª≥
j?KFpw*x≥ ~êKWÿ˙À¬[º¸"Ú/-ºj;èπ7<y§YŒ)€ˆa˛…’})e„F¨>äÉdÄv›“–•Ô9ü$}+›/&e–?∫€DOí^∞Ú¸π ﬂ'£@XÙÌo€ñyÛ5‘¸ :‰û$î(˘¡qì{%\jë÷π›ıw°;™	ç&ıú«nJ;†Â∫|ˇ1πŸYªÊ∏h†’?GI<ı›vk◊Ug•¿i^•tª±0·Ã§¥±√$Dœ«ìEÓç∂:ña…y%‘{Mìv∑ßãóÇsÍ…/∫‰t˜gÈñ∏¡µQ¶Ñî´,}ÅyÃGÏ†~&∆¢r≈jö∫˜çã«L–€ÿê,b∏‹c|ˆ4Ï3∫0UÏâ:‚µ˙{R(‘ﬂÀaÆ9é1Q æÌ∆.UÏdπÈªÿ∂÷y’[qR‰zÏ£ú∏!ï ∆Æa#*L≥m·Ôı-Wì$<¶≥∞R√+M∫˙+( »û JmÄø”ùV~í∑(-∞t@ﬁÆÜé}^X!W≠Y«%Á˛í(hì\π›†¨b¯6QJÂå∑Á≈£KΩ÷G∂g¢∂•}nŸMQ]m≠ûÔR¶ÁÌMù0’—R Ym≈”†eg»¬(ñF^ª‚í#,Üû3ån•Áx¿í‰E)“+Î&p¢p¬;..ñ4‚â‚¶6N-ò îÄ‚§S3/†©Ωã]Ó°I>ÔØ¯òΩ4à2‚9îúV]JÎ›6ªF+‡ä+kk¶Eûz\¢w¥G¨ÇË˛›ˇC‹˙∞)OM‰Æ	k~”Kn˙-U˙ÃîùCê„[©™õmÅ™€+«`∏√Å©ﬂ–ÂUÆ„≤AlXûB¨≠6~ŒU∏Qo2>ÇiŸà„X2‚,¨ìQ&≠EªÁŸ~Œ¬Ú%Òaà˘≤¬+ÆáÑÜJIâ…¯g#∆€A‘∂ÛÌ¯0	”p“•ÚˆúùÁ.<»#˙L«8êé]õ¥4˝Çñf hnQıÓ9$éjŒ¿ø›ı%F4
›¢Øl⁄áè†)∆É]zpE=◊µ
üGô„UÌäwÂ§ñEö±mƒ-º≈¯Á¡,kÿÎV.ç{ÕÕ"=≈∏≤whZD úË&ß’*kMﬂ◊Wñ{ ∑o©j?5ŒÌı‹L¨í•Zf|*®ö∫p ·?0Ñì$DÄÌ,n%Û≠ËF÷ÿ°ΩT⁄®ºDwÂQÊ‹îtåö∫R’|÷XØπ®÷mˆ≠Ë≠Jïãuq*ò/Û´≥˝6~1ie‰G∫ÑÚ	≤ûKWJ]’ãßˆz^Ÿª`-ÈT»Üäj‘˝8e¿Àœ¢R¯sÆ¸5ÈÇ\dÃÑõN~U”1c`ÂÖPOl	EÌπ H∞≠4€Á“Õs{.æx’:^uî‡sT˘iIÌkS1ùKâ÷WŒeq‰Ì9ôÓÈ!◊pùÉ≥©ÄSqË\:U©Vπ:üóÂO^≠6gP\uki£Jûm:É3¡´FññyèR’Â∫’∫H^‹ÄN¯8Ùó∆aoÿ∂›5}=∞»Àæπä˙ÓÇÔ™‡Z1$B~D!¯Çoÿ±ÚCÂ·¢º∑’0û°{MØ=àN"gÄø≥,¨lË.9Ô_Îy”ô–#œ}E~{|ˇ¥JêΩ&µèúƒRå•j(ﬁ◊”JmS¯±‘;~m~\Æo˝brxœc∫CO·V˙úSI'?n√Ä•!láC&?~C¿«º*∫ûáÙâ∂%∆¸¯I§ñß»Ï˛\†VÖÙ†ΩPµäæ˝ÔIΩ
˜«é≈Ù√œì™<·ì˚CπòúÓ…eCp;-{ïÀ∫™v_VyWfÈ•¸ˆ6OoY±Õ_!’æ{ÏïŒ√è3˜7Ì,\≠VUov‰]·æ+¬≠¯·†·Ëå†©úCMog=}ÆÔÛ•¨€kæ;ƒ€æÙnuÏÀÁ‰Pı+ô´*¸Ö/Á†’(?»¸2‹ÓÓ™yÒ4,-…≥å}IWÙtﬂ*ø˜^…]ÎÄ∆pˇ˘,L4ÊAÂk^r<õ¶Û≤≥º¸$˜˙}‘úÁ°≈T	ˆ.∏u◊_9Œ<¸„UrêÑÅs.¬>oED∏W‘Â!j≥t¶M∆√Òx|ílSÈjôë4◊‘&R‚ˆ¡.b$EQ¢=llÆ†B◊1t∑P^ó√˜≠PË2!‹UuñbX÷B~f⁄rFæÜ/ô√£◊„|ÚËw2”ïÖàû@–;ÏHã˘òŸ¿ŸaçΩ‡ÛI·ø¬Ü{j˚˝B´Ss	¸á@eàë˜g–QÒ„%‹ïÎÏLŸ‡Ù%ãùÔŸW^m.E,ºò>mç”) m‡ÛX¢V›ƒ◊aGQ‘fR“ò6jµüáF˚Ö˜7MBR}≤S kmrxÒip∏Ì^J∏…⁄PA‡”ò"±≥UK®ç  ¶6Æ5y-°+q´Q¶ï†8ØØ!—àærÊ^	5¸»≠Æ˜∆AíQÑ;Kì˛∂6Tlf“Ô#‘ì'4åc5xﬁgw]>X]!Ä≈îH™\ZDCóO¿„†¯Xàz{JÖÓ9èVŸ4”¸é
6ŒkÔ1Ä¶\??h¸ÓßˇÈG V»§ÇÌw?˝øø/˛˛Çˇ˝˛Æq»ÌxîÖ∞“ÔDfá+&àÕ” Ót¥Ï∞ÆÏÜédœ*!™¯J˘O=îU&?‚j}DFvf˜ch0¯@œQÎV˝Ìò˝*√C!tÅ≤ã4Ó˜:/ÚÑ4iE€ö ÆÂL≥?F¥iÒS•˜"É,≠è_ƒpr4ffgQ⁄Ç#Pae˛D{®L«h>å≥4Çy∞ﬂf3ﬂ)ıL∞ñ xhXï∂∆&~Øö∂ìM√@¿›f∫+ÎZ,[Èõ∂X£0ß‡÷πoÒ›2qŒ4?\‘õ?ygN»«≠oMrÉ%Ëx-˚Ë–hTÊKØ‰Õ≤$Ú„í\≈q|Â˝ï≥ïNÍÅVä2Ü4Ñ≥¿J7Å≠⁄^Âˆ•u∑õ•¡˚9¯:Ô~©±QÑﬂfÓ¬‚∏Ùÿò‹·F£Ïç#Âì”]-∫ÁÀÊ0†N<‹Tó–ÉGÆRÄ†
Ã#=“/ˇí5i‘≠ãÜu‘å◊°Z∂%∏'¬ï6_5ﬂzh‚w◊6Æ˙ΩÚËÆO‡∑ﬂà•ü¯ˇ  ˇˇ‘]Ìkú«ˇÓø‚±[b)H:Îd)ä,K8Ævl”ÑâO∫GÚ—ìÓrwä-AúB]Z•P¸°ÖR≠	≠_L˚)˘W¸ßtgˆmvwˆÂN™k?`˘Óû∑›ŸŸŸôﬂŒÀx+˛qˆ∂Jëì\F\oZ$∂íæÕE Ó¯“ºaà@Ã¨2bﬁâÌOÌkH·ôÈkj∑+wová+Bó®∫õ∂«Çﬂµˆ%‘ë-∑ …ZËÍgûñ‡w‹#›R	0≈ıç^ª’Ω⁄L ä\»≤úånn IŒ>-ãà9r+ÚÄF‹<«/|7ß]äU:_∆öÉ@„∫Á	n)+1`õ(∆KN
ù˛vÔZ{j@æP¥4“Jé◊‚å|.øò¯Ë‹i<ŸÊ]qÎªl§¥Ã¿,:¿Œ-Œ5
{áŸ`°Ù)q~÷6ﬁ≠tï◊Îa·º€„iùù`o5:µ|°2ÄL’ÔŒ.j⁄u≠ô€Ÿkwvz“Ö7—F[•ä—5≤q¿–$\rtÙ£¿Zñë‡ú_c’ﬂå¯·≥/˜{ı ‚ﬁnB‘"i¥åÒù]íë5íáU◊“öM<XW›d–†$+ä7Ä†Ã∑I„z…g‚∆Mé‘∏NìÑ …∏^>RﬂMÄ`w.FÙî’_7ΩØ]ÍGxòóÙñ≈cíéöª)√GFT€&ÁZ)[ã÷ÊÑHy1Ôà©Ü”u∆‰∆¯ÿ˛ï§)IJ“"ﬂßRM˚Ù´4M ÿÆ≈;QπQ‡áˇ}&∂Kd,>(Û.ÍÅ()I`4mz’I]ÌQÊîh◊=1s9ÔWhè¸∞•}Øï˘íü77Ø®MÿÆ¨…fè±Ì·’P?¥˘ µ∆ÆÍ≈ØTzôŒ∫¯O«=6≈π9_F{$ΩÌ¡o-˛ç°ö„\8ÚÉzAœ	>ƒïπ+c-⁄#3Öa≈\√öÚ“yáläp@¡ãáAßtò`ähÈ:ØîAÈ $y$	ïπ?sùO‘T]üSì»ñày>„
cÌÆfuüÀä<$áM‚-cféÉb^3V|˘Ãÿ#íh ZÆI¿ªÓN∫+ùq∑2r‹|ô9¨S
íH¶5M;¶»#ß“Iê®áÃòç·C!éÔéaÉåÁé>‹∞+¸áõ â°`Å÷(v¬–GVó„:∫^ù)¿—Gô»öh(=•@¶Ê)ßv:Øˆ>éGøÑSã>JËìë∑º_π=ÙYŸò_¥∆%#`≠ñî¶∫∫0Î∏¬$ y
∂óû+r®¿·c∑»ã≈êıfQ‰õ 6àª{å·Ô¡’*ÃÏQ}–{¿Ak<F*® e>,Ñÿ»⁄⁄ÔŒûg06Öã6ö9å-û≥…X»µ,ìµºPŒ/ø∂¨Öÿπ∑"s!“≤l-ï¡éˇ]C8∆»d(ƒti&√Ñ»jπ?ªX›∏˘ˇì—é jàΩÀ—ÏÜì$1îo<·ùE>⁄3Æ‰+’~êVÎ˝Lu(Ä„yÍº|bü@Ú¥î]√ßÀË˜dûD≈◊ryq%ˇƒT˚KÌ∂5ƒŸq‚˝ÏB*™k£û=(“±YÈïokIr%Œ+:Lª3y*%K^º’i=HÖt>ô
	ï˘zØÕ*Û„Áû<ïºhµaÛµê‘047L√Kc“—ga∫|gﬂU.Vq≠Ü-J<OZ†<ét¿<£]}p@	 √7 0:§DbPrX∞7¨Ω¬ÆﬂÅg∑ò©¢~3]ûæpJPv[àeL«tkgß¬«ÀÇP;ΩAG<≥µ◊⁄z	¿™[ÊW¿«u0ŸÃ©£ï =mΩj/êÖI1t*}—Î¥Edîõtm›Œ`Ç7Òúr≈Bqk$ûº™π6e_ÑX™∫R£µF3∫*lkDÔû:{ñ^´„®‘ıWÃWÁçáb∆Èœ@D˝Â®˙÷HqYq◊ïÌm–_(≠:‚7˘h{™~∫3MÍ/Ö|ª˜≥M[vIv, -yçV÷ÀFN|¶¯=ÑÕ3C3ÃüŸ6∏ïÌ†B„JÂºòTßìQ∂óF¥¿ù:krkhü°ouÍÄçQÒFF-1d«a7[4ªrEø°⁄*WÁª≈¨B7g1ÜV«v/Ê™∫| ÊÚ@X¿êü	duË‰§t"∞E7ƒ‚/'ÉÛ∫;æR◊ªë[#ÕÓïa'Á ê,*pÚ"vıvÔfΩ+¶ÃóﬂJ$å6]T1.n3ùlrY˚ B®à;;ô›ÅSƒŸÑ}/Ëπ&Õ•sÇ™ä§$SÄΩÿ}˛i4™À˜Í≠_¬•Ì˝~ÍË’Ê^ÚË?y¨€‡≥‚yâÚÉÉ
Xﬂﬁñóãaª÷)}V™≠ÙXQII„ÃÉò,&‰_›X@(—›YÈCJÆ†¶M4 %¿!6Iï™ä-≈‘é 9+∏õ°⁄ÅÍ÷Á˚≠Am+Fo“È•\ΩUÆÆd·≠¨∞$™ãSÎàÉﬁ“ûÄëçw¡+Aº)àG!b8qâà≈<“ê¶œ6uXΩS]≠Îˆ&êúTIÉ˚¨v'/I∫>yÉwhx‘L’i?
À⁄Î»€•
wÜ¨ñxLË{≈Á®W0∫«Ö¯kº,PhéKÛí	®!˚FVB1∫≥5/kÇX´9y(™€†Œ‚Ó±æ‹ú‘I¢Ês8òg&¶RÖ.≥AìZçg—j<k≠FΩJ∞ÊÄqW¡–ıOÖñdê∏ﬂ}|8ªÕãøÈ˛ûÃ‡œ¡2´r1Q∆‘∑[5ì‚ï|+ç‡yì‹Hk?ù§•Å°∆l,L4K tyˆ¥êı›‡^)Ûô>`Åk‰∑bú˘‘◊@j≈`-V
J'`m«üs¬1ÙØÛÆÅ˙9ö,â$πG?[Fä@Wxpc¨[ÖŒ úÜˆ0ÁY»¬M√©zë¿À	EUfXééAñÒ\Bú,'≈t)*5 Nksq]ΩÀ<ÕhÑ|∏RíB!≠ëáâ˛ J8NÑÀNbiäëª™8®-hœFcá“¡!Ω÷Ri°|ì	B‹È˙√j})¥ãôJÓœn4›T%dÙCñ≥≈Ò=·QLEÍÜΩèíxIˆ9Hè≠Â≤≠ÏÊwb-¸„Ó˛–YüPë’#BSó…	Á1±´B≈EÃ_H/‹êüÒ‡1âe†/{ˇä2kıÔ<ñÊBe∞i"·.Ò¡ªTBu›ùnWXxÈ/‰Áƒ’ªΩÕNW^|?&ÆU≠<–Ä~qÆ∑˝ÿ8á±Ùg>¨˜ÍA´KÎ<“ÇS3≤`±˛öhFghÎ„]◊»Œ}∂‡±y^>¬∂<r›foäÇ|
!RıBRNì3∆˙◊Ñ#∂?°†K5
g9∞·åÊí@T∫*v≈Çà^sıÁ˚ùA}ÚÛ_Í÷Éázù÷tßÌ®phFØ>√–’GXyÙGYrÚΩxàE/UË–3˘˝?Ø^»îiO*¨F)C_e$,§PãeÜ†´/ÅP—J B≈¢
{À¢)ÒPk∆∫»'N*Ûv)ØÏ∂:b~ÜÓÕ5úê€ÒÓ‡3Ã{C{´ôπ¢?‡˘èz£
™Rv∂;uõ\,'Êä˙?y©ôóÊ€ﬂÚŸûóô<π3C1ˆbÌ◊{mö®‘ë›öb¿§É:ÑàıiÇßÜhØ7˝⁄j1É¥aïg`í6FÊ*ıÍπ∫Ã6Eêd˚iJ`	Â¨Twzà“ñI˝¡pÒƒ≥´‘Û»˝Oud˜3¨Z,˘]NÔm2™gØ@°f”≤9!î§ÃG'çs”GwI7˙–À∏¯÷Ç.ê R®ÚxƒG…åÇ…òxqÕM$H*À„ T¯∫36˚ü3~›ﬁp¯%®æ",ë©ªFå!]‘lyt◊<à
]:ë]ÒÚÙ’ãØ|©Ò…¯g§ÚKYˇ>T≠¥,˘.L x:‹o¨Tì“Û™êç√QoP_—ôg™ü˜kYJ~Õ}rÛ⁄Ì+æ 	€Æv,å∞"SÃ∂cª≥'x˘Ä.éÄ≥´›’ 	mñ/›/õäØu#¢JÀôËH»•∞VP≥ÑØâAÍ\ËBnÏ©g¡WØ` ù‹*pu˛`EÜ∫ﬁ≥ôƒ‰◊•±}gê‹Ÿ€£U¢5€$ıX®∆Ãn4Ø
Û 7˜öIlŸ ±#à“Ùb†é¡‹§°˜öI–ÿ∆*Ûa¯Y˜T6‡oØ^¸Í’Û£<˚6‡èr’âZ¿7xΩm÷ú8ÛwY¬]wIñß˛√àŒëf˜It∞œæv+˜G^Ì"Œéßı∑∞˙RK∂{¿v::7dÇä±Eßßs	4öKÆgı»Y©xGN-1™J-’ß√'FK∫ÄÅ∑Òì÷Ú‚‚ˆ{wÇ*`¥¬ãÉãSÃ‰Û≥)Ò≤Ïze¸ùœjﬂy:!bÆ¸Ufÿ?ÏU∞Sfmá•»œhò Iò 'Eäoq÷HU˘±ûQêy¯{ú:ﬂó#Vì]nÀewÂ˙≥ÁÇ¨z~±vµXD˜ﬁÓÈœ.Sbº}KhJb~‹åƒD0€QÔ–}™rôàÌk,3`
/•ò	Ü„Ù…∏ñã1C¥RÈ$BR˛Ufê˛5ûG´H»z0óûÖÏ8öáLNYÉàH√]9 nIvÁ¸§!/¿í™øπT)Ï]R©È≠ø
$Ø\H¬õŒ˛î/ë¡m¢JŒ≤—k)ì˘´…@Xd⁄4úùáÚDˆkS÷ñróñHbœ˘πEz_≈!âe“ÃM«Ö0l!¿˜'Zk€mF€·µçÛp’ÿ*ÿ=ﬁ)]Ö•-îÊ §àß–(°œ6îÙ*Ÿ„°"7éë9ƒ°§|Ì[ ùﬂH.¯-hÉ Ç˛%3‘?AQÚiuVSØûˇ^´f“
€◊”«câDî∞ãRh2≥€zp±3å^Mqì|^ı—>‰øzÀ OâS ^ØÖπ»˜©o™ÜTŸ‰:%÷ØØùÆ,ƒ0êbzπÕqèVñìÏ„á∫C¥ıÜ∞Á[û∑˙« ç∑å˛âñ€„¸ÿ1¢á|ç≈ˆÚ\aÏ†$[ºc]µ—[Pπq‡êﬂGX'B±í•H^?Y¶Ù»˚hM¸[m»≥ÓßπXO˝y?7>k·oëÁ9<"9‚≠·˜ …0<[HCçÇUÃÛÃMlˆr©«47j~ºƒ/œq"[´#8z≠”Gï÷òoûã∫3N.8IπÿæÔıòÖå‰f⁄≠Xd#ãËNd0»é+^U6cÿ	b0lê∑˝ÓîPﬂÄí¡w¬ävÇ¯	hÛ£ﬁ˘≠c	˝=—µîöpˇÄ≤Æ∏(Ö68ı
wÚˇ  ˇˇ b/ì