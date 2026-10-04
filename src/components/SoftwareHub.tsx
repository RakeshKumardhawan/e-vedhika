import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  HardDrive,
  Download,
  Search,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Fingerprint,
  Type,
  ShieldCheck,
  X,
  Edit2,
  Trash2,
  AlertCircle,
  Info,
  Laptop,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Link,
  Upload,
  Loader2,
  Settings,
  Folder,
  FolderOpen,
  FolderPlus,
  Globe,
  FileCode,
  FileText,
  FileArchive,
  Layers,
  Filter,
} from "lucide-react";
import { db, storage } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export type SoftwareItemType = "file" | "link";

export interface SoftwareFolder {
  id: string;
  name: string;
  descriptionTelugu?: string;
  iconName?: string;
  colorTheme?: "indigo" | "rose" | "amber" | "emerald" | "blue" | "purple" | "cyan";
  order?: number;
  allowedRoles?: string[]; // e.g. ["admin", "super admin", "editor", "user"] or empty for all
  createdAt?: string;
  updatedAt?: string;
}

export interface SoftwareItem {
  id: string;
  name: string;
  category: "biometric" | "fonts" | "office" | "portal" | "other";
  version: string;
  fileSize: string;
  supportedOS: string;
  descriptionTelugu: string;
  downloadUrl: string;
  installationGuide?: string;
  isOfficial?: boolean;
  isCustom?: boolean;
  tags?: string[];
  lastUpdated?: string;
  updatedAtTimestamp?: number;
  folderId?: string;
  itemType?: SoftwareItemType;
  fileFormat?: string;
  isR2Storage?: boolean;
  r2Key?: string;
}

// Byte and Size Helpers
export const parseSizeToBytes = (sizeStr?: string): number => {
  if (!sizeStr || sizeStr === "N/A") return 0;
  const cleaned = sizeStr.trim().toUpperCase();
  const match = cleaned.match(/^([0-9.]+)\s*(BYTES|B|KB|MB|GB|TB)?$/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  if (isNaN(value)) return 0;
  const unit = match[2] || "B";
  switch (unit) {
    case "TB":
      return value * 1024 * 1024 * 1024 * 1024;
    case "GB":
      return value * 1024 * 1024 * 1024;
    case "MB":
      return value * 1024 * 1024;
    case "KB":
      return value * 1024;
    case "BYTES":
    case "B":
    default:
      return value;
  }
};

export const formatBytes = (bytes: number): string => {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const DEFAULT_SOFTWARE_FOLDERS: SoftwareFolder[] = [
  {
    id: "folder-biometric",
    name: "Biometric & RD Services (Biometric Devices)",
    descriptionTelugu: "Mantra, Morpho, Startek biometric scanner drivers & certified RD services",
    iconName: "Fingerprint",
    colorTheme: "rose",
    order: 1,
  },
  {
    id: "folder-fonts",
    name: "Telugu Fonts & Typing Tools",
    descriptionTelugu: "Google Input Tools, Anu Script, and standard government Unicode fonts pack",
    iconName: "Type",
    colorTheme: "amber",
    order: 2,
  },
  {
    id: "folder-dsc",
    name: "DSC & Digital Signature Utilities (DSC & PKI Tools)",
    descriptionTelugu: "ePass 2003 Dongle, Java 8 Runtime (JRE), e-Procurement and CFMS signing tools",
    iconName: "ShieldCheck",
    colorTheme: "emerald",
    order: 3,
  },
  {
    id: "folder-office",
    name: "Office, Scanner & PDF Utilities",
    descriptionTelugu: "7-Zip Extractor, AnyDesk remote support, Adobe Acrobat Reader and essential system tools",
    iconName: "Laptop",
    colorTheme: "blue",
    order: 4,
  },
  {
    id: "folder-portals",
    name: "Secretariat & Meeseva Portals (Portals & Web Links)",
    descriptionTelugu: "Secretariat, Meeseva, eGramSwaraj, CFMS, and official government portal links",
    iconName: "Globe",
    colorTheme: "purple",
    order: 5,
  },
  {
    id: "folder-r2",
    name: "Cloud R2 Files & Archives (Cloudflare R2 Storage)",
    descriptionTelugu: "Files and backups published directly from Cloudflare R2 global cloud storage",
    iconName: "HardDrive",
    colorTheme: "cyan",
    order: 6,
  },
];

export const DEFAULT_SOFTWARE_LIST: SoftwareItem[] = [
  {
    id: "mantra-mfs100-rd",
    name: "Mantra MFS100 RD Service & Driver",
    category: "biometric",
    folderId: "folder-biometric",
    itemType: "file",
    fileFormat: "EXE",
    version: "v1.0.8",
    fileSize: "28.4 MB",
    supportedOS: "Windows 7/8/10/11",
    descriptionTelugu: "Official RD Service and USB drivers for Mantra MFS100 Biometric Fingerprint Scanner used in Andhra Pradesh Secretariats.",
    downloadUrl: "https://download.mantratecapp.com/",
    installationGuide: "1. Uninstall any older driver versions first.\n2. Restart your computer.\n3. Right-click installer and select 'Run as Administrator'.\n4. Plug in the device; notification should display 'Framework is ready to use'.",
    isOfficial: true,
    tags: ["Mantra", "Biometric", "RD Service", "Aadhaar"],
    lastUpdated: "2024",
  },
  {
    id: "morpho-rd-service",
    name: "Morpho MSO 1300 E3 RD Service (Localhost)",
    category: "biometric",
    folderId: "folder-biometric",
    itemType: "file",
    fileFormat: "ZIP",
    version: "v2.0.1.60",
    fileSize: "32.1 MB",
    supportedOS: "Windows 8.1/10/11",
    descriptionTelugu: "Certified RD Service for Morpho MSO 1300 E3 biometric scanners. Mandatory for AePS payments and portal authentications.",
    downloadUrl: "https://rdserviceonline.com/",
    installationGuide: "1. Extract ZIP file and install Windows-RD-Service.exe.\n2. Verify Communication Mode in C:\\MorphoRDServiceL0Soft config.\n3. Device light will blink indicating readiness.",
    isOfficial: true,
    tags: ["Morpho", "RD Service", "Biometric", "Iris"],
    lastUpdated: "2024",
  },
  {
    id: "startek-fm220-rd",
    name: "Startek FM220U RD Service Setup",
    category: "biometric",
    folderId: "folder-biometric",
    itemType: "file",
    fileFormat: "EXE",
    version: "v1.0.4",
    fileSize: "19.5 MB",
    supportedOS: "Windows 7/10/11",
    descriptionTelugu: "Complete certified driver and service installer for Startek FM220U fingerprint scanner.",
    downloadUrl: "https://www.acpl.ind.in/download.html",
    installationGuide: "1. Run Startek FM220 RD Service Setup as administrator.\n2. Confirm 'ACPL FM220 Registered Device Service' is running in Services.msc.",
    isOfficial: true,
    tags: ["Startek", "FM220", "Biometric"],
    lastUpdated: "2024",
  },
  {
    id: "google-input-tools-telugu",
    name: "Google Input Tools Telugu (Offline Installer)",
    category: "fonts",
    folderId: "folder-fonts",
    itemType: "file",
    fileFormat: "EXE",
    version: "v1.3.0",
    fileSize: "14.2 MB",
    supportedOS: "Windows 7/8/10/11",
    descriptionTelugu: "Offline phonetic typing installer to easily type in Telugu with an English keyboard (e.g. typing 'panchayath' yields 'పంచాయత్').",
    downloadUrl: "https://archive.org/details/google-input-tools-telugu-offline-installer",
    installationGuide: "1. First install GoogleInputUpdate.exe.\n2. Next install GoogleInputTelugu.exe.\n3. Press Alt + Shift to toggle between English and Telugu typing.",
    isOfficial: true,
    tags: ["Telugu", "Typing", "Google", "Fonts", "Unicode"],
    lastUpdated: "2024",
  },
  {
    id: "anu-script-telugu-fonts",
    name: "Anu Script Manager & Popular Telugu Fonts Pack",
    category: "fonts",
    folderId: "folder-fonts",
    itemType: "file",
    fileFormat: "ZIP",
    version: "v7.0",
    fileSize: "45.8 MB",
    supportedOS: "Windows 7/10/11",
    descriptionTelugu: "Comprehensive collection of Anu Script, Unicode, and standard Telugu fonts (Pothana, Gautami, Mandali, etc.) for official circulars and notices.",
    downloadUrl: "https://fonts.google.com/?subset=telugu",
    installationGuide: "1. Extract the ZIP archive.\n2. Select all .ttf font files, right-click and select 'Install for all users'.",
    isOfficial: true,
    tags: ["Anu Script", "Fonts", "Pothana", "Unicode"],
    lastUpdated: "2024",
  },
  {
    id: "epass2003-dsc-driver",
    name: "ePass 2003 Auto DSC Token Driver (PKI)",
    category: "portal",
    folderId: "folder-dsc",
    itemType: "file",
    fileFormat: "EXE",
    version: "v2.0",
    fileSize: "18.3 MB",
    supportedOS: "Windows 10/11 64-bit",
    descriptionTelugu: "PKI Token driver for ePass 2003 USB dongles used for digital signature verification across eGramSwaraj, CFMS, and e-Procurement portals.",
    downloadUrl: "https://egramswaraj.gov.in/",
    installationGuide: "1. Unplug the ePass 2003 Dongle from your PC.\n2. Run the driver installer as administrator.\n3. Plug in the token and confirm certificate visibility in ePass Token Manager.",
    isOfficial: true,
    tags: ["DSC", "eGramSwaraj", "Digital Signature", "ePass"],
    lastUpdated: "2024",
  },
  {
    id: "java-runtime-dsc",
    name: "Java 8 Runtime Environment (JRE 32-bit & 64-bit)",
    category: "portal",
    folderId: "folder-dsc",
    itemType: "file",
    fileFormat: "EXE",
    version: "8u381",
    fileSize: "78.2 MB",
    supportedOS: "Windows 10/11",
    descriptionTelugu: "Standard Java 8 Runtime Environment (JRE) required for DSC Signer software and e-Tendering government portals.",
    downloadUrl: "https://www.java.com/en/download/",
    installationGuide: "1. Run setup and click Next to finish installation.\n2. In Windows Control Panel -> Java -> Security tab, add portal URLs to the Exception Site List.",
    isOfficial: true,
    tags: ["Java", "JRE", "DSC", "eSign"],
    lastUpdated: "2024",
  },
  {
    id: "7zip-utility",
    name: "7-Zip File Archiver & Extractor (64-bit)",
    category: "office",
    folderId: "folder-office",
    itemType: "file",
    fileFormat: "EXE",
    version: "v24.08",
    fileSize: "1.5 MB",
    supportedOS: "Windows 10/11",
    descriptionTelugu: "Lightweight and powerful open-source archive manager for opening and compressing ZIP, RAR, 7Z, and TAR archives.",
    downloadUrl: "https://www.7-zip.org/download.html",
    installationGuide: "Quick installation: Run installer and click 'Install'.",
    isOfficial: true,
    tags: ["7-Zip", "Compress", "Extractor", "Utility"],
    lastUpdated: "2024",
  },
  {
    id: "anydesk-remote-support",
    name: "AnyDesk Remote Desktop Client",
    category: "office",
    folderId: "folder-office",
    itemType: "file",
    fileFormat: "EXE",
    version: "v8.0.10",
    fileSize: "4.8 MB",
    supportedOS: "Windows All",
    descriptionTelugu: "Portable remote desktop tool to connect with technical support teams for rapid troubleshooting and installation help.",
    downloadUrl: "https://anydesk.com/en/downloads/windows",
    installationGuide: "No installation required. Double click the downloaded file to run immediately.",
    isOfficial: true,
    tags: ["AnyDesk", "Remote", "Support", "Desktop"],
    lastUpdated: "2024",
  },
  {
    id: "adobe-acrobat-reader-offline",
    name: "Adobe Acrobat Reader DC (Offline Installer)",
    category: "office",
    folderId: "folder-office",
    itemType: "file",
    fileFormat: "EXE",
    version: "2024.x",
    fileSize: "260 MB",
    supportedOS: "Windows 10/11",
    descriptionTelugu: "Standard PDF reader for viewing, annotating, and printing government orders, circulars, and official reports.",
    downloadUrl: "https://get.adobe.com/reader/enterprise/",
    installationGuide: "Run the offline installer and follow on-screen instructions.",
    isOfficial: true,
    tags: ["PDF", "Adobe", "Reader", "Office"],
    lastUpdated: "2024",
  },
];

interface SoftwareHubProps {
  user?: any;
  userProfile?: any;
  addToast?: (msg: string, type?: string) => void;
  onOpenAdminPanel?: () => void;
}

export const SoftwareHub: React.FC<SoftwareHubProps> = ({
  user,
  userProfile,
  addToast,
  onOpenAdminPanel,
}) => {
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>(DEFAULT_SOFTWARE_LIST);
  const [folders, setFolders] = useState<SoftwareFolder[]>(DEFAULT_SOFTWARE_FOLDERS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Navigation & View Mode: 'folders' or 'all'
  const [viewMode, setViewMode] = useState<"folders" | "all">("folders");
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "file" | "link">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);

  // Check admin privileges
  const userEmail = (user?.email || userProfile?.email || "").toLowerCase();
  const isAdmin =
    userProfile?.role === "admin" ||
    userProfile?.role === "super admin" ||
    userProfile?.role === "administrator" ||
    userProfile?.role === "editor" ||
    userEmail === "rakeshkumardhawan123@gmail.com";

  // Quick Update Link Modal
  const [quickUpdateItem, setQuickUpdateItem] = useState<SoftwareItem | null>(null);
  const [quickLinkUrl, setQuickLinkUrl] = useState("");
  const [quickItemType, setQuickItemType] = useState<SoftwareItemType>("file");
  const [quickFolderId, setQuickFolderId] = useState<string>("folder-biometric");
  const [quickUploadProgress, setQuickUploadProgress] = useState<number | null>(null);
  const [isQuickUploading, setIsQuickUploading] = useState(false);
  const [isSavingQuick, setIsSavingQuick] = useState(false);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Firestore sync for Folders
  useEffect(() => {
    const unsubFolders = onSnapshot(
      collection(db, "software_folders"),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SoftwareFolder[] = [];
          snapshot.forEach((d) => {
            list.push({ ...(d.data() as SoftwareFolder), id: d.id });
          });
          list.sort((a, b) => (a.order || 99) - (b.order || 99));
          setFolders(list);
        } else {
          setFolders(DEFAULT_SOFTWARE_FOLDERS);
        }
      },
      (err) => {
        console.error("Folders sync error:", err);
        setFolders(DEFAULT_SOFTWARE_FOLDERS);
      }
    );

    return () => unsubFolders();
  }, []);

  // Real-time Firestore sync for Items
  useEffect(() => {
    setLoading(true);
    const unsubItems = onSnapshot(
      collection(db, "software_repository"),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: SoftwareItem[] = [];
          snapshot.forEach((d) => {
            items.push({ ...(d.data() as SoftwareItem), id: d.id });
          });
          setSoftwareList(items);
        } else {
          setSoftwareList(DEFAULT_SOFTWARE_LIST);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore sync error:", err);
        setSoftwareList(DEFAULT_SOFTWARE_LIST);
        setLoading(false);
      }
    );

    return () => unsubItems();
  }, []);

  // Format Helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const uploadFileToStorage = async (
    file: File,
    onProgress: (p: number) => void,
    onSuccess: (url: string, sizeFormatted: string) => void,
    onError: () => void
  ) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageRef = ref(storage, `software_hub/${Date.now()}_${safeName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(p);
      },
      (err) => {
        console.error("Upload error:", err);
        onError();
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const size = formatBytes(file.size);
          onSuccess(url, size);
        } catch (e) {
          console.error(e);
          onError();
        }
      }
    );
  };

  const handleCopyLink = (item: SoftwareItem) => {
    navigator.clipboard.writeText(item.downloadUrl);
    setCopiedId(item.id);
    if (addToast) addToast(`'${item.name}' link copied to clipboard!`, "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Quick Link / File Update Handler
  const handleOpenQuickUpdate = (item: SoftwareItem) => {
    setQuickUpdateItem(item);
    setQuickLinkUrl(item.downloadUrl || "");
    setQuickItemType(getItemType(item));
    setQuickFolderId(item.folderId || getDefaultFolderForCategory(item.category));
    setQuickUploadProgress(null);
  };

  const handleSaveQuickUpdate = async () => {
    if (!quickUpdateItem) return;
    if (!quickLinkUrl.trim()) {
      if (addToast) addToast("Please provide a valid download or web URL.", "error");
      return;
    }

    setIsSavingQuick(true);
    try {
      await updateDoc(doc(db, "software_repository", quickUpdateItem.id), {
        downloadUrl: quickLinkUrl.trim(),
        itemType: quickItemType,
        folderId: quickFolderId,
        lastUpdated: new Date().toLocaleDateString("en-IN"),
        updatedAtTimestamp: Date.now(),
      });
      if (addToast) addToast(`'${quickUpdateItem.name}' updated in real-time!`, "success");
      setQuickUpdateItem(null);
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to update.", "error");
    } finally {
      setIsSavingQuick(false);
    }
  };

  const handleDeleteSoftware = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}'?`)) {
      try {
        await deleteDoc(doc(db, "software_repository", id));
        if (addToast) addToast(`'${name}' has been deleted.`, "success");
      } catch (e) {
        console.error(e);
        if (addToast) addToast("Failed to delete item.", "error");
      }
    }
  };

  // Helper to get fallback folder for category
  const getDefaultFolderForCategory = (category: string) => {
    switch (category) {
      case "biometric":
        return "folder-biometric";
      case "fonts":
        return "folder-fonts";
      case "portal":
        return "folder-dsc";
      case "office":
      default:
        return "folder-office";
    }
  };

  // Helper to determine if an item is a file or web link
  const getItemType = (item: SoftwareItem): SoftwareItemType => {
    if (item.itemType) return item.itemType;
    const url = (item.downloadUrl || "").toLowerCase();
    if (
      url.endsWith(".exe") ||
      url.endsWith(".zip") ||
      url.endsWith(".msi") ||
      url.endsWith(".rar") ||
      url.endsWith(".pdf") ||
      url.includes("firebasestorage") ||
      url.includes("r2.cloudflarestorage") ||
      url.includes("r2.dev")
    ) {
      return "file";
    }
    return "link";
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "External Link";
    }
  };

  // Filter folders based on user permissions:
  // Admins see all folders. For regular users, if allowedRoles is specified and not empty, check if user's role matches.
  const visibleFolders = useMemo(() => {
    if (isAdmin) return folders;
    const currentRole = (userProfile?.role || "user").toLowerCase();
    return folders.filter((f) => {
      if (!f.allowedRoles || f.allowedRoles.length === 0) return true;
      return f.allowedRoles.map((r) => r.toLowerCase()).includes(currentRole);
    });
  }, [folders, isAdmin, userProfile?.role]);

  // Folders map & counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    visibleFolders.forEach((f) => (counts[f.id] = 0));
    softwareList.forEach((item) => {
      const fId = item.folderId || getDefaultFolderForCategory(item.category);
      if (counts[fId] !== undefined) {
        counts[fId] = (counts[fId] || 0) + 1;
      }
    });
    return counts;
  }, [visibleFolders, softwareList]);

  // Folders storage size calculation
  const folderStorage = useMemo(() => {
    const byteMap: Record<string, number> = {};
    visibleFolders.forEach((f) => (byteMap[f.id] = 0));
    softwareList.forEach((item) => {
      const fId = item.folderId || getDefaultFolderForCategory(item.category);
      const b = parseSizeToBytes(item.fileSize);
      byteMap[fId] = (byteMap[fId] || 0) + b;
    });
    const formatted: Record<string, string> = {};
    Object.keys(byteMap).forEach((id) => {
      formatted[id] = formatBytes(byteMap[id]);
    });
    return { byteMap, formatted };
  }, [visibleFolders, softwareList]);

  // Total software storage
  const totalSoftwareBytes = useMemo(() => {
    return softwareList.reduce((acc, item) => acc + parseSizeToBytes(item.fileSize), 0);
  }, [softwareList]);

  const totalSoftwareStorage = useMemo(() => {
    return formatBytes(totalSoftwareBytes);
  }, [totalSoftwareBytes]);

  // Active folder object
  const currentFolder = useMemo(() => {
    if (!activeFolderId) return null;
    return visibleFolders.find((f) => f.id === activeFolderId) || null;
  }, [visibleFolders, activeFolderId]);

  // Filtered List
  const filteredList = useMemo(() => {
    return softwareList.filter((item) => {
      // Folder filter
      if (viewMode === "folders" && activeFolderId) {
        const itemFolder = item.folderId || getDefaultFolderForCategory(item.category);
        if (itemFolder !== activeFolderId) return false;
      }

      // Type filter (file vs link)
      const detectedType = getItemType(item);
      if (filterType !== "all" && detectedType !== filterType) {
        return false;
      }

      // Category filter (in All view)
      if (viewMode === "all" && selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.descriptionTelugu?.toLowerCase().includes(q) ||
        item.version.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [softwareList, viewMode, activeFolderId, filterType, selectedCategory, searchQuery]);

  const getFolderIcon = (iconName?: string) => {
    switch (iconName) {
      case "Fingerprint":
        return <Fingerprint size={22} />;
      case "Type":
        return <Type size={22} />;
      case "ShieldCheck":
        return <ShieldCheck size={22} />;
      case "Laptop":
        return <Laptop size={22} />;
      case "Globe":
        return <Globe size={22} />;
      case "HardDrive":
        return <HardDrive size={22} />;
      default:
        return <Folder size={22} />;
    }
  };

  const getFolderColorClasses = (colorTheme?: string) => {
    switch (colorTheme) {
      case "rose":
        return {
          card: "border-rose-200 hover:border-rose-400 bg-gradient-to-br from-white to-rose-50/40",
          iconBg: "bg-rose-100 text-rose-600",
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          accent: "text-rose-600",
        };
      case "amber":
        return {
          card: "border-amber-200 hover:border-amber-400 bg-gradient-to-br from-white to-amber-50/40",
          iconBg: "bg-amber-100 text-amber-600",
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          accent: "text-amber-600",
        };
      case "emerald":
        return {
          card: "border-emerald-200 hover:border-emerald-400 bg-gradient-to-br from-white to-emerald-50/40",
          iconBg: "bg-emerald-100 text-emerald-600",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          accent: "text-emerald-600",
        };
      case "blue":
        return {
          card: "border-blue-200 hover:border-blue-400 bg-gradient-to-br from-white to-blue-50/40",
          iconBg: "bg-blue-100 text-blue-600",
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          accent: "text-blue-600",
        };
      case "purple":
        return {
          card: "border-purple-200 hover:border-purple-400 bg-gradient-to-br from-white to-purple-50/40",
          iconBg: "bg-purple-100 text-purple-600",
          badge: "bg-purple-50 text-purple-700 border-purple-200",
          accent: "text-purple-600",
        };
      case "cyan":
        return {
          card: "border-cyan-200 hover:border-cyan-400 bg-gradient-to-br from-white to-cyan-50/40",
          iconBg: "bg-cyan-100 text-cyan-600",
          badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
          accent: "text-cyan-600",
        };
      case "indigo":
      default:
        return {
          card: "border-indigo-200 hover:border-indigo-400 bg-gradient-to-br from-white to-indigo-50/40",
          iconBg: "bg-indigo-100 text-indigo-600",
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          accent: "text-indigo-600",
        };
    }
  };

  const getCategoryIcon = (category: SoftwareItem["category"]) => {
    switch (category) {
      case "biometric":
        return <Fingerprint className="text-rose-600" size={18} />;
      case "fonts":
        return <Type className="text-amber-600" size={18} />;
      case "portal":
        return <ShieldCheck className="text-emerald-600" size={18} />;
      case "office":
      default:
        return <Laptop className="text-blue-600" size={18} />;
    }
  };

  const getCategoryLabel = (category: SoftwareItem["category"]) => {
    switch (category) {
      case "biometric":
        return "Biometric";
      case "fonts":
        return "Telugu Fonts";
      case "portal":
        return "DSC & Portal";
      case "office":
      default:
        return "Office Tool";
    }
  };

  // Check if item was updated recently (within 48 hours)
  const isRecentlyUpdated = (item: SoftwareItem) => {
    if (item.updatedAtTimestamp && Date.now() - item.updatedAtTimestamp < 48 * 60 * 60 * 1000) {
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-16 text-left">
      {/* Top Banner with Real-time Sync indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Cloud Sync Active</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium border border-white/10">
              <HardDrive size={13} className="text-cyan-400" />
              <span>Storage Bank: <strong className="text-cyan-300 font-mono font-bold">{totalSoftwareStorage}</strong></span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Software Hub & Drivers Directory
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Windows OS styled directory of essential biometric scanner drivers, Telugu fonts, 
            DSC signing utilities, and official portal links. Direct download packages and web links organized by folders.
          </p>
        </div>

        {isAdmin && onOpenAdminPanel && (
          <div className="z-10 shrink-0">
            <button
              onClick={onOpenAdminPanel}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-lg shadow-indigo-900/40 flex items-center gap-2 transition-all active:scale-95 border border-indigo-400/30"
            >
              <Settings size={17} className="animate-spin-slow" />
              <span>Admin Management Panel</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Mode Bar & Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software by name, driver, version, tag or keyword..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Folders vs All */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => {
                setViewMode("folders");
                setActiveFolderId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "folders" && !activeFolderId
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Folder size={14} />
              <span>Folders</span>
            </button>
            <button
              onClick={() => {
                setViewMode("all");
                setActiveFolderId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "all"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers size={14} />
              <span>All Software ({softwareList.length})</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter: Direct Files vs Web Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter size={12} /> Type:
            </span>
            {[
              { id: "all", label: "All Items", icon: Layers },
              { id: "file", label: "💾 Direct Files (.EXE, .ZIP)", icon: Download },
              { id: "link", label: "🌐 Portals & Drive Links", icon: Globe },
            ].map((t) => {
              const active = filterType === t.id;
              const TIcon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <TIcon size={13} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-500">
            Total: <span className="text-indigo-600 font-mono">{filteredList.length}</span> items
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation when inside a Folder */}
      {viewMode === "folders" && activeFolderId && currentFolder && (
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-950 flex-wrap">
            <button
              onClick={() => setActiveFolderId(null)}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              <Folder size={15} />
              <span>All Folders (Root)</span>
            </button>
            <span className="text-indigo-300">/</span>
            <div className="flex items-center gap-1.5 text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-xs">
              <FolderOpen size={15} className="text-indigo-600" />
              <span>{currentFolder.name}</span>
            </div>
            <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
              <HardDrive size={11} className="text-indigo-600" />
              <span>{filteredList.length} items • {folderStorage.formatted[currentFolder.id] || "0 B"}</span>
            </span>
          </div>

          <button
            onClick={() => setActiveFolderId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition-colors shrink-0 shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Folders</span>
          </button>
        </div>
      )}

      {/* VIEW MODE 1: FOLDERS GRID (when at root of folders mode and no search query) */}
      {viewMode === "folders" && !activeFolderId && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Folder className="text-indigo-600" size={20} />
                <span>Software Directory Folders</span>
              </h2>
              <p className="text-xs text-slate-500">
                Click on any folder to open its files, drivers, and official portal links.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleFolders.map((folder) => {
              const count = folderCounts[folder.id] || 0;
              const colorStyle = getFolderColorClasses(folder.colorTheme);
              const hasAccessRestricted = folder.allowedRoles && folder.allowedRoles.length > 0;

              return (
                <div
                  key={folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`p-5 rounded-2xl border ${colorStyle.card} shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between text-left relative overflow-hidden`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${colorStyle.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                        {getFolderIcon(folder.iconName)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasAccessRestricted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/80 flex items-center gap-1" title={`Allowed roles: ${folder.allowedRoles?.join(", ")}`}>
                            🔒 Restricted
                          </span>
                        )}
                        <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${colorStyle.badge} flex items-center gap-1.5`}>
                          <span>{count} files</span>
                          <span className="opacity-40">•</span>
                          <span>{folderStorage.formatted[folder.id] || "0 B"}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {folder.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {folder.descriptionTelugu || "Software items and links in this folder."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-indigo-600">
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                      <HardDrive size={12} className="text-slate-400" />
                      <span>Storage: <strong className="text-slate-700 font-bold">{folderStorage.formatted[folder.id] || "0 B"}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>Open Folder</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ITEMS LIST / GRID (Inside a Folder OR in All Items View OR when Searching) */}
      {(viewMode === "all" || activeFolderId || searchQuery) && (
        <div>
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Loader2 size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
              <p className="text-xs font-bold text-slate-600">Loading software and drivers...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Search size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800">No software or links found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No matching software items found for the active filter, search query, or folder.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                  setSelectedCategory("all");
                  setActiveFolderId(null);
                }}
                className="text-xs font-bold text-indigo-600 hover:underline pt-2 inline-block"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredList.map((item) => {
                const isGuideOpen = expandedGuideId === item.id;
                const isCopied = copiedId === item.id;
                const itemType = getItemType(item);
                const isFile = itemType === "file";
                const isRecent = isRecentlyUpdated(item);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
                  >
                    {/* Live Recent Update Pulse Ribbon */}
                    {isRecent && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold px-3 py-0.5 text-center flex items-center justify-center gap-1.5 shadow-xs">
                        <Sparkles size={11} />
                        <span>Recently Updated (Real-Time)</span>
                      </div>
                    )}

                    {/* Card Top Section */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                              isFile
                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                : "bg-purple-50 text-purple-600 border border-purple-100"
                            }`}
                          >
                            {isFile ? <Download size={20} /> : <Globe size={20} />}
                          </div>
                          <div>
                            {/* Type Differentiation Badge */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isFile ? (
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <HardDrive size={10} />
                                  <span>Direct File ({item.fileFormat || "EXE"})</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Globe size={10} />
                                  <span>Web / Drive Link</span>
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {getCategoryLabel(item.category)}
                              </span>
                            </div>

                            <h3 className="text-sm font-black text-slate-900 leading-tight mt-1 line-clamp-1">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        {/* Admin Actions directly on card */}
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenQuickUpdate(item)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Update link or file"
                            >
                              <Link size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteSoftware(item.id, item.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Badges: Version, Size, OS */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                          {item.version}
                        </span>
                        {isFile && (
                          <span className="bg-indigo-50/70 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md font-bold">
                            {item.fileSize}
                          </span>
                        )}
                        {!isFile && (
                          <span className="bg-purple-50/70 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                            <Globe size={10} />
                            {getDomainFromUrl(item.downloadUrl)}
                          </span>
                        )}
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                          {item.supportedOS}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.descriptionTelugu}
                      </p>

                      {/* Installation Guide Toggle */}
                      {item.installationGuide && (
                        <div className="pt-1">
                          <button
                            onClick={() => setExpandedGuideId(isGuideOpen ? null : item.id)}
                            className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 transition-colors"
                          >
                            <Info size={13} />
                            <span>{isGuideOpen ? "Hide Guide ▲" : "Installation Guide ▼"}</span>
                          </button>

                          {isGuideOpen && (
                            <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                              <p className="font-bold text-amber-900 mb-1 flex items-center gap-1 text-[11px]">
                                <AlertCircle size={12} /> Step-by-Step Instructions:
                              </p>
                              {item.installationGuide}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Clear Distinction Actions */}
                    <div className="bg-slate-50/80 p-3 px-5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopyLink(item)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95 shrink-0"
                        title="Copy Link to share"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                      </button>

                      {isFile ? (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all active:scale-95"
                          title="Direct File Download"
                        >
                          <Download size={14} />
                          <span>Download File ({item.fileSize})</span>
                        </a>
                      ) : (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all active:scale-95"
                          title="Open official portal or drive link"
                        >
                          <Globe size={14} />
                          <span>Open Portal</span>
                          <ExternalLink size={12} className="opacity-80" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QUICK UPDATE LINK/FILE MODAL */}
      {quickUpdateItem && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="text-cyan-400" size={20} />
                <div>
                  <h3 className="text-sm sm:text-base font-black">Update Download Link or File</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{quickUpdateItem.name}</p>
                </div>
              </div>
              <button
                onClick={() => setQuickUpdateItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Type Selection: File vs Web Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Item Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickItemType("file")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      quickItemType === "file"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Download size={14} />
                    <span>💾 Direct File (.exe, .zip)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickItemType("link")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      quickItemType === "link"
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Globe size={14} />
                    <span>🌐 Web / Drive Link</span>
                  </button>
                </div>
              </div>

              {/* Folder Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination Folder
                </label>
                <select
                  value={quickFolderId}
                  onChange={(e) => setQuickFolderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Option */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Upload size={14} className="text-indigo-600" />
                    Upload new file from computer (.exe, .zip, .rar)
                  </span>
                </div>
                <input
                  type="file"
                  ref={quickFileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsQuickUploading(true);
                      setQuickUploadProgress(1);
                      uploadFileToStorage(
                        file,
                        (p) => setQuickUploadProgress(p),
                        (url, sizeFormatted) => {
                          setQuickLinkUrl(url);
                          setQuickItemType("file");
                          setIsQuickUploading(false);
                          if (addToast) addToast(`File uploaded successfully! (${sizeFormatted})`, "success");
                        },
                        () => {
                          setIsQuickUploading(false);
                          if (addToast) addToast("File upload failed.", "error");
                        }
                      );
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={isQuickUploading}
                  onClick={() => quickFileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isQuickUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-indigo-600" />
                      <span>Uploading... {quickUploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Select File (Upload to Cloud)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct URL / Google Drive Paste */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Download Link or Google Drive URL:
                </label>
                <input
                  type="url"
                  value={quickLinkUrl}
                  onChange={(e) => setQuickLinkUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://pub-xxx.r2.dev/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Cloudflare R2, Google Drive ("Anyone with link"), or official direct links can be provided here.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickUpdateItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingQuick || isQuickUploading}
                  onClick={handleSaveQuickUpdate}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingQuick ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                  <span>Save in Real-Time</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
