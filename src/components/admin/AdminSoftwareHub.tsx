import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  HardDrive,
  Download,
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  Link,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  Fingerprint,
  Type,
  Laptop,
  ShieldCheck,
  RotateCcw,
  Eye,
  Copy,
  Check,
  FileText,
  Loader2,
  Sparkles,
  Info,
  Folder,
  FolderOpen,
  FolderPlus,
  Globe,
  Layers,
  Filter,
  RefreshCw,
  Cloud,
  CheckCircle,
  GripVertical,
  Lock,
} from "lucide-react";
import { db, storage, auth } from "../../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  SoftwareItem,
  SoftwareFolder,
  SoftwareItemType,
  DEFAULT_SOFTWARE_LIST,
  DEFAULT_SOFTWARE_FOLDERS,
  parseSizeToBytes,
  formatBytes,
} from "../SoftwareHub";

interface R2StorageFile {
  key: string;
  size: number;
  lastModified: string;
  url: string;
  source: "cloudflare" | "local";
}

interface AdminSoftwareHubProps {
  user?: any;
  userProfile?: any;
  addToast?: (msg: string, type?: string) => void;
  onViewPublicHub?: () => void;
}

export const AdminSoftwareHub: React.FC<AdminSoftwareHubProps> = ({
  user,
  userProfile,
  addToast,
  onViewPublicHub,
}) => {
  // Navigation Tabs in Admin:
  // 1: software (Items List & Links)
  // 2: folders (Folder Manager - Windows Style)
  // 3: r2_files (Cloudflare R2 Storage Browser & Publisher)
  const [adminTab, setAdminTab] = useState<"software" | "folders" | "r2_files">("software");

  // State: Software Items & Folders
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>([]);
  const [folders, setFolders] = useState<SoftwareFolder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFolderFilter, setSelectedFolderFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "file" | "link">("all");

  // Quick Link/File Update Modal State
  const [quickUpdateItem, setQuickUpdateItem] = useState<SoftwareItem | null>(null);
  const [newDownloadUrl, setNewDownloadUrl] = useState("");
  const [quickItemType, setQuickItemType] = useState<SoftwareItemType>("file");
  const [quickFolderId, setQuickFolderId] = useState<string>("folder-biometric");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingQuick, setIsSavingQuick] = useState(false);

  // Full Add/Edit Software Modal State
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SoftwareItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<SoftwareItem["category"]>("office");
  const [formFolderId, setFormFolderId] = useState("folder-office");
  const [formItemType, setFormItemType] = useState<SoftwareItemType>("file");
  const [formFileFormat, setFormFileFormat] = useState("EXE");
  const [formVersion, setFormVersion] = useState("v1.0");
  const [formFileSize, setFormFileSize] = useState("10 MB");
  const [formOS, setFormOS] = useState("Windows 10/11");
  const [formUrl, setFormUrl] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formGuide, setFormGuide] = useState("");
  const [formIsOfficial, setFormIsOfficial] = useState(true);
  const [isR2UploadMode, setIsR2UploadMode] = useState(false);

  // Folder Add/Edit Modal State (Windows Style)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<SoftwareFolder | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderDesc, setFolderDesc] = useState("");
  const [folderIcon, setFolderIcon] = useState("Folder");
  const [folderColor, setFolderColor] = useState<SoftwareFolder["colorTheme"]>("indigo");
  const [folderAllowedRoles, setFolderAllowedRoles] = useState<string[]>([]);

  // Drag and Drop state
  const [draggedSoftwareId, setDraggedSoftwareId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Cloudflare R2 Storage State
  const [r2Files, setR2Files] = useState<R2StorageFile[]>([]);
  const [loadingR2, setLoadingR2] = useState(false);
  const [r2SearchQuery, setR2SearchQuery] = useState("");
  const [r2UploadProgress, setR2UploadProgress] = useState<number | null>(null);
  const [isR2Uploading, setIsR2Uploading] = useState(false);
  const [r2AutoPublish, setR2AutoPublish] = useState(true);
  const [publishModalFile, setPublishModalFile] = useState<R2StorageFile | null>(null);
  const [r2Diagnostic, setR2Diagnostic] = useState<{
    configured?: boolean;
    connected?: boolean;
    missingVars?: string[];
    r2Error?: string | null;
    bucketName?: string;
    engine?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);
  const r2FileInputRef = useRef<HTMLInputElement>(null);

  // Real-time listener for Folders
  useEffect(() => {
    const unsubFolders = onSnapshot(
      collection(db, "software_folders"),
      async (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed default folders
          try {
            for (const f of DEFAULT_SOFTWARE_FOLDERS) {
              await setDoc(doc(db, "software_folders", f.id), f);
            }
          } catch (e) {
            console.error("Error seeding folders:", e);
            setFolders(DEFAULT_SOFTWARE_FOLDERS);
          }
        } else {
          const list: SoftwareFolder[] = [];
          snapshot.forEach((d) => {
            list.push({ ...(d.data() as SoftwareFolder), id: d.id });
          });
          list.sort((a, b) => (a.order || 99) - (b.order || 99));
          setFolders(list);
        }
      },
      (err) => {
        console.error("Firestore folders error:", err);
        setFolders(DEFAULT_SOFTWARE_FOLDERS);
      }
    );

    return () => unsubFolders();
  }, []);

  // Real-time listener on Firestore 'software_repository'
  useEffect(() => {
    setLoading(true);
    const colRef = collection(db, "software_repository");
    const unsub = onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed defaults
          try {
            for (const item of DEFAULT_SOFTWARE_LIST) {
              await setDoc(doc(db, "software_repository", item.id), item);
            }
          } catch (e) {
            console.error("Error seeding software defaults:", e);
            setSoftwareList(DEFAULT_SOFTWARE_LIST);
            setLoading(false);
            return;
          }
        } else {
          const items: SoftwareItem[] = [];
          snapshot.forEach((d) => {
            items.push({ ...(d.data() as SoftwareItem), id: d.id });
          });
          setSoftwareList(items);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore sync error:", err);
        setSoftwareList(DEFAULT_SOFTWARE_LIST);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Fetch Cloudflare R2 files
  const fetchR2Files = async () => {
    setLoadingR2(true);
    try {
      await new Promise((r) => {
        const u = auth.onAuthStateChanged((user) => {
          if (user) {
            u();
            r(user);
          }
        });
        setTimeout(() => r(auth.currentUser), 1500);
      });
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/storage/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch files from Cloudflare R2");
      setR2Files(data.files || []);
      setR2Diagnostic({
        configured: data.r2Configured,
        connected: data.r2Connected,
        missingVars: data.missingVars || [],
        r2Error: data.r2Error || null,
        bucketName: data.bucketName,
        engine: data.storageEngine
      });
    } catch (err: any) {
      console.error("R2 fetch error:", err);
      if (addToast) addToast(`Failed to load Cloudflare R2 files: ${err.message}`, "error");
    } finally {
      setLoadingR2(false);
    }
  };

  useEffect(() => {
    if (adminTab === "r2_files") {
      fetchR2Files();
      // Real-time poller for R2 files every 12 seconds when viewing R2 tab
      const interval = setInterval(() => {
        fetchR2Files();
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [adminTab]);

  // Storage Calculations across repository & Cloudflare R2
  const folderStorage = useMemo(() => {
    const byteMap: Record<string, number> = {};
    folders.forEach((f) => (byteMap[f.id] = 0));
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
  }, [folders, softwareList]);

  const totalSoftwareBytes = useMemo(() => {
    return softwareList.reduce((acc, item) => acc + parseSizeToBytes(item.fileSize), 0);
  }, [softwareList]);

  const totalSoftwareStorage = useMemo(() => {
    return formatBytes(totalSoftwareBytes);
  }, [totalSoftwareBytes]);

  const totalR2Bytes = useMemo(() => {
    return r2Files.reduce((acc, f) => acc + (f.size || 0), 0);
  }, [r2Files]);

  const totalR2Storage = useMemo(() => {
    return formatBytes(totalR2Bytes);
  }, [totalR2Bytes]);

  const largestR2File = useMemo(() => {
    if (r2Files.length === 0) return null;
    return [...r2Files].sort((a, b) => b.size - a.size)[0];
  }, [r2Files]);

  const r2FreeTierBytes = 10 * 1024 * 1024 * 1024; // 10 GB Monthly Free Tier
  const r2PercentUsed = Math.min(100, (totalR2Bytes / r2FreeTierBytes) * 100);

  // Helper for folder default
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

  // Helper to determine item type
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

  // Upload to Firebase Storage
  const handleFileUpload = (file: File, isQuickModal = false) => {
    const isQuick = isQuickModal;
    if (isQuick) {
      setIsUploading(true);
      setUploadProgress(1);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageRef = ref(storage, `software_hub/${Date.now()}_${safeName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (isQuick) setUploadProgress(p);
      },
      (error) => {
        console.error("Upload error:", error);
        if (isQuick) setIsUploading(false);
        if (addToast) addToast("Failed to upload file.", "error");
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const sizeFormatted = formatBytes(file.size);
          const ext = file.name.split(".").pop()?.toUpperCase() || "EXE";

          if (isQuick) {
            setNewDownloadUrl(downloadUrl);
            setQuickItemType("file");
            setIsUploading(false);
          } else {
            setFormUrl(downloadUrl);
            setFormFileSize(sizeFormatted);
            setFormFileFormat(ext);
            setFormItemType("file");
          }

          if (addToast) addToast(`File uploaded successfully! (${sizeFormatted})`, "success");
        } catch (err) {
          console.error(err);
          if (isQuick) setIsUploading(false);
          if (addToast) addToast("Failed to retrieve file URL.", "error");
        }
      }
    );
  };

  // Upload directly to Cloudflare R2 via /api/upload
  const handleUploadToR2 = async (file: File) => {
    setIsR2Uploading(true);
    setR2UploadProgress(10);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "R2 Upload failed");

      setR2UploadProgress(100);
      const publicUrl = data.url;
      const sizeStr = formatBytes(file.size);
      const ext = file.name.split(".").pop()?.toUpperCase() || "EXE";

      if (addToast) addToast(`File uploaded to Cloudflare R2! (${sizeStr})`, "success");

      // Auto publish to Software Hub if requested
      if (r2AutoPublish) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]/g, " ")
          .trim();
        const docId = `r2_${Date.now()}`;
        const newItem: SoftwareItem = {
          id: docId,
          name: cleanName,
          category: "office",
          folderId: "folder-r2",
          itemType: "file",
          fileFormat: ext,
          version: "v1.0",
          fileSize: sizeStr,
          supportedOS: "Windows 10/11",
          downloadUrl: publicUrl,
          descriptionTelugu: "Official download file stored directly in Cloudflare R2 cloud storage.",
          isOfficial: true,
          isR2Storage: true,
          r2Key: data.key,
          lastUpdated: new Date().toLocaleDateString("en-IN"),
          updatedAtTimestamp: Date.now(),
        };

        await setDoc(doc(db, "software_repository", docId), newItem);
        if (addToast) addToast(`'${cleanName}' automatically published to Software Hub!`, "success");
      }

      await fetchR2Files();
    } catch (err: any) {
      console.error(err);
      if (addToast) addToast(`Cloudflare R2 upload failed: ${err.message}`, "error");
    } finally {
      setIsR2Uploading(false);
      setR2UploadProgress(null);
    }
  };

  // Quick Link/File Update Handlers
  const handleOpenQuickUpdate = (item: SoftwareItem) => {
    setQuickUpdateItem(item);
    setNewDownloadUrl(item.downloadUrl || "");
    setQuickItemType(getItemType(item));
    setQuickFolderId(item.folderId || getDefaultFolderForCategory(item.category));
    setUploadProgress(null);
  };

  const handleSaveQuickUpdate = async () => {
    if (!quickUpdateItem) return;
    if (!newDownloadUrl.trim()) {
      if (addToast) addToast("Please provide a valid download URL or link.", "error");
      return;
    }

    setIsSavingQuick(true);
    try {
      await updateDoc(doc(db, "software_repository", quickUpdateItem.id), {
        downloadUrl: newDownloadUrl.trim(),
        itemType: quickItemType,
        folderId: quickFolderId,
        lastUpdated: new Date().toLocaleDateString("en-IN"),
        updatedAtTimestamp: Date.now(),
      });
      if (addToast) addToast(`'${quickUpdateItem.name}' updated in real-time!`, "success");
      setQuickUpdateItem(null);
    } catch (err) {
      console.error(err);
      if (addToast) addToast("Failed to update item.", "error");
    } finally {
      setIsSavingQuick(false);
    }
  };

  // Full Add/Edit Software Modal Handlers
  const handleOpenFullModal = (item?: SoftwareItem) => {
    if (item) {
      setEditingItem(item);
      setFormName(item.name);
      setFormCategory(item.category);
      setFormFolderId(item.folderId || getDefaultFolderForCategory(item.category));
      setFormItemType(getItemType(item));
      setFormFileFormat(item.fileFormat || "EXE");
      setFormVersion(item.version);
      setFormFileSize(item.fileSize);
      setFormOS(item.supportedOS);
      setFormUrl(item.downloadUrl);
      setFormDesc(item.descriptionTelugu);
      setFormGuide(item.installationGuide || "");
      setFormIsOfficial(item.isOfficial ?? true);
    } else {
      setEditingItem(null);
      setFormName("");
      setFormCategory("office");
      setFormFolderId("folder-office");
      setFormItemType("file");
      setFormFileFormat("EXE");
      setFormVersion("v1.0");
      setFormFileSize("15 MB");
      setFormOS("Windows 10/11");
      setFormUrl("");
      setFormDesc("");
      setFormGuide("");
      setFormIsOfficial(true);
    }
    setIsFullModalOpen(true);
  };

  const handleSaveFullSoftware = async () => {
    if (!formName.trim() || !formUrl.trim()) {
      if (addToast) addToast("Software name and download/web link are required.", "error");
      return;
    }

    const docId = editingItem ? editingItem.id : `sw_${Date.now()}`;
    const payload: SoftwareItem = {
      id: docId,
      name: formName.trim(),
      category: formCategory,
      folderId: formFolderId,
      itemType: formItemType,
      fileFormat: formItemType === "file" ? formFileFormat.toUpperCase() : "URL",
      version: formVersion.trim() || "v1.0",
      fileSize: formFileSize.trim() || "N/A",
      supportedOS: formOS.trim() || "Windows All",
      downloadUrl: formUrl.trim(),
      descriptionTelugu: formDesc.trim() || "Utility software for office and administrative workstation tasks.",
      installationGuide: formGuide.trim(),
      isOfficial: formIsOfficial,
      lastUpdated: new Date().toLocaleDateString("en-IN"),
      updatedAtTimestamp: Date.now(),
    };

    try {
      await setDoc(doc(db, "software_repository", docId), payload, { merge: true });
      if (addToast) {
        addToast(
          editingItem
            ? `'${formName}' updated in real-time!`
            : `'${formName}' added successfully!`,
          "success"
        );
      }
      setIsFullModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      if (addToast) addToast("Failed to save software details.", "error");
    }
  };

  const handleDeleteSoftware = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}'?`)) {
      try {
        await deleteDoc(doc(db, "software_repository", id));
        if (addToast) addToast(`'${name}' deleted.`, "success");
      } catch (err) {
        console.error(err);
        if (addToast) addToast("Failed to delete item.", "error");
      }
    }
  };

  // Folder Operations (Windows Explorer Style)
  const handleOpenFolderModal = (folder?: SoftwareFolder) => {
    if (folder) {
      setEditingFolder(folder);
      setFolderName(folder.name);
      setFolderDesc(folder.descriptionTelugu || "");
      setFolderIcon(folder.iconName || "Folder");
      setFolderColor(folder.colorTheme || "indigo");
      setFolderAllowedRoles(folder.allowedRoles || []);
    } else {
      setEditingFolder(null);
      setFolderName("");
      setFolderDesc("");
      setFolderIcon("Folder");
      setFolderColor("indigo");
      setFolderAllowedRoles([]);
    }
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = async () => {
    if (!folderName.trim()) {
      if (addToast) addToast("Please enter a folder name.", "error");
      return;
    }

    const fId = editingFolder ? editingFolder.id : `folder_${Date.now()}`;
    const payload: SoftwareFolder = {
      id: fId,
      name: folderName.trim(),
      descriptionTelugu: folderDesc.trim() || "Folder containing software and utility files.",
      iconName: folderIcon,
      colorTheme: folderColor,
      allowedRoles: folderAllowedRoles.length > 0 ? folderAllowedRoles : undefined,
      order: editingFolder ? editingFolder.order : folders.length + 1,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "software_folders", fId), payload, { merge: true });
      if (addToast) {
        addToast(
          editingFolder
            ? `'${folderName}' folder updated!`
            : `'${folderName}' folder created successfully!`,
          "success"
        );
      }
      setIsFolderModalOpen(false);
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to save folder.", "error");
    }
  };

  // Drag and drop: Move software item to folder
  const handleMoveSoftwareToFolder = async (softwareId: string, targetFolderId: string) => {
    const item = softwareList.find((s) => s.id === softwareId);
    const targetFolder = folders.find((f) => f.id === targetFolderId);
    if (!item || !targetFolder) return;

    if (item.folderId === targetFolderId) return;

    try {
      await updateDoc(doc(db, "software_repository", softwareId), {
        folderId: targetFolderId,
        updatedAt: new Date().toISOString(),
      });
      if (addToast) {
        addToast(`Moved '${item.name}' to '${targetFolder.name}' folder!`, "success");
      }
    } catch (err) {
      console.error("Move software error:", err);
      if (addToast) addToast("Failed to move file.", "error");
    }
  };

  const handleDeleteFolder = async (folderId: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete the folder '${name}'?\n(Files in this folder will be safely moved to General Tools)`
      )
    ) {
      try {
        await deleteDoc(doc(db, "software_folders", folderId));

        // Reassign any items in this folder to general folder
        const itemsToMove = softwareList.filter((item) => item.folderId === folderId);
        for (const item of itemsToMove) {
          await updateDoc(doc(db, "software_repository", item.id), {
            folderId: "folder-office",
          });
        }

        if (addToast) addToast(`Folder '${name}' deleted.`, "success");
      } catch (e) {
        console.error(e);
        if (addToast) addToast("Failed to delete folder.", "error");
      }
    }
  };

  // Publish Cloudflare R2 file into Software Hub
  const handlePublishR2File = (file: R2StorageFile) => {
    setPublishModalFile(file);
    const cleanName = file.key
      .split("/")
      .pop()
      ?.replace(/\.[^/.]+$/, "")
      .replace(/[_-]/g, " ") || "New Software";
    const ext = file.key.split(".").pop()?.toUpperCase() || "EXE";

    setFormName(cleanName);
    setFormUrl(file.url);
    setFormFileSize(formatBytes(file.size));
    setFormFileFormat(ext);
    setFormCategory("office");
    setFormFolderId("folder-r2");
    setFormItemType("file");
    setFormVersion("v1.0");
    setFormOS("Windows 10/11");
    setFormDesc("Official download file stored directly in Cloudflare R2.");
    setFormGuide("");
    setEditingItem(null);
    setIsFullModalOpen(true);
  };

  // Check if an R2 file is already published in Software Hub
  const getR2PublishedItem = (url: string, key: string) => {
    return softwareList.find(
      (item) =>
        item.downloadUrl === url ||
        (item.r2Key && item.r2Key === key) ||
        item.downloadUrl.includes(key)
    );
  };

  // Filter Software List
  const filteredSoftware = useMemo(() => {
    return softwareList.filter((item) => {
      // Category
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      // Folder
      if (selectedFolderFilter !== "all") {
        const itemFolder = item.folderId || getDefaultFolderForCategory(item.category);
        if (itemFolder !== selectedFolderFilter) return false;
      }
      // Type (file vs link)
      const t = getItemType(item);
      if (selectedTypeFilter !== "all" && t !== selectedTypeFilter) return false;

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.descriptionTelugu?.toLowerCase().includes(q) ||
        item.version.toLowerCase().includes(q) ||
        item.downloadUrl.toLowerCase().includes(q)
      );
    });
  }, [softwareList, selectedCategory, selectedFolderFilter, selectedTypeFilter, searchQuery]);

  // Filter R2 Files
  const filteredR2Files = useMemo(() => {
    const q = r2SearchQuery.toLowerCase().trim();
    if (!q) return r2Files;
    return r2Files.filter((f) => f.key.toLowerCase().includes(q) || f.url.toLowerCase().includes(q));
  }, [r2Files, r2SearchQuery]);

  // Folder helper icon
  const getFolderIcon = (iconName?: string) => {
    switch (iconName) {
      case "Fingerprint":
        return <Fingerprint size={20} />;
      case "Type":
        return <Type size={20} />;
      case "ShieldCheck":
        return <ShieldCheck size={20} />;
      case "Laptop":
        return <Laptop size={20} />;
      case "Globe":
        return <Globe size={20} />;
      case "HardDrive":
        return <HardDrive size={20} />;
      default:
        return <Folder size={20} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-16 text-left">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Admin Central Controller • Live Sync</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium border border-white/10">
              <HardDrive size={13} className="text-cyan-400" />
              <span>Software Hub & Folder Explorer</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Software Hub & Cloud Storage Manager
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Create, modify, and delete folders in an operating system file explorer layout. Manage direct download files (.exe, .zip)
            and web portal links. Publish files from Cloudflare R2 into the Software Hub with a single click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <button
            onClick={() => handleOpenFullModal()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Software / Tool
          </button>
          <button
            onClick={() => handleOpenFolderModal()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <FolderPlus size={16} /> New Folder
          </button>
          {onViewPublicHub && (
            <button
              onClick={onViewPublicHub}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 transition-all"
            >
              <Eye size={15} />
              <span>View Public Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setAdminTab("software")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === "software"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <Layers size={16} />
          <span>Software & Links ({softwareList.length} • {totalSoftwareStorage})</span>
        </button>

        <button
          onClick={() => setAdminTab("folders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === "folders"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <Folder size={16} />
          <span>Folder Explorer ({folders.length} folders)</span>
        </button>

        <button
          onClick={() => setAdminTab("r2_files")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === "r2_files"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <Cloud size={16} className="text-cyan-500" />
          <span>Cloudflare R2 Storage ({r2Files.length} • {totalR2Storage})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SOFTWARE & LINKS LIST */}
      {/* ======================================================== */}
      {adminTab === "software" && (
        <div className="space-y-4">
          {/* Quick Repository Storage Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HardDrive size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Software Storage</div>
                <div className="text-sm font-black text-slate-900 font-mono truncate">{totalSoftwareStorage}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Download size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Installers</div>
                <div className="text-sm font-black text-slate-900 font-mono truncate">
                  {softwareList.filter((s) => (s.itemType || "file") === "file").length} files
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Cloud size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cloudflare R2 Used</div>
                <div className="text-sm font-black text-slate-900 font-mono truncate">{totalR2Storage}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Folder size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Folders Configured</div>
                <div className="text-sm font-black text-slate-900 font-mono truncate">{folders.length} folders</div>
              </div>
            </div>
          </div>

          {/* Filter / Search Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search software by name, version, download link..."
                  className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Folder Filter Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedFolderFilter}
                  onChange={(e) => setSelectedFolderFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">📁 All Folders</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Type: All</option>
                  <option value="file">💾 Direct Files</option>
                  <option value="link">🌐 Web & Drive Links</option>
                </select>
              </div>
            </div>

            {/* Quick Drag & Drop Folder Targets Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <GripVertical size={13} className="text-slate-400" />
                <span>Drag to Folder (Drop Target):</span>
              </span>
              {folders.map((f) => {
                const isOver = dragOverFolderId === f.id;
                return (
                  <div
                    key={f.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverFolderId(f.id);
                    }}
                    onDragLeave={() => {
                      if (dragOverFolderId === f.id) setDragOverFolderId(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const sId = e.dataTransfer.getData("text/plain") || draggedSoftwareId;
                      if (sId) {
                        handleMoveSoftwareToFolder(sId, f.id);
                      }
                      setDragOverFolderId(null);
                      setDraggedSoftwareId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                      isOver
                        ? "bg-indigo-600 text-white border-indigo-700 scale-105 shadow-md animate-pulse"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>📁 {f.name.split("(")[0]}</span>
                    {f.allowedRoles && f.allowedRoles.length > 0 && (
                      <Lock size={10} className={isOver ? "text-amber-200" : "text-amber-600"} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Software Table */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Loader2 size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
              <p className="text-xs font-bold text-slate-600">Loading software catalog...</p>
            </div>
          ) : filteredSoftware.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <p className="text-sm font-bold text-slate-700">No software items found matching criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFolderFilter("all");
                  setSelectedTypeFilter("all");
                }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 w-8"></th>
                      <th className="py-3 px-4">Software & Type</th>
                      <th className="py-3 px-4">Folder</th>
                      <th className="py-3 px-4">Download / Web Link</th>
                      <th className="py-3 px-4">Size / OS</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSoftware.map((item) => {
                      const itemType = getItemType(item);
                      const isFile = itemType === "file";
                      const folderObj = folders.find((f) => f.id === item.folderId);
                      const isBeingDragged = draggedSoftwareId === item.id;

                      return (
                        <tr
                          key={item.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedSoftwareId(item.id);
                            e.dataTransfer.setData("text/plain", item.id);
                          }}
                          onDragEnd={() => {
                            setDraggedSoftwareId(null);
                          }}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isBeingDragged ? "opacity-40 bg-indigo-50/50" : ""
                          }`}
                        >
                          {/* Drag Handle */}
                          <td className="py-3.5 px-2 text-center text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                            <GripVertical size={14} className="mx-auto" />
                          </td>

                          {/* Name & Type */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  isFile
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "bg-purple-50 text-purple-600"
                                }`}
                              >
                                {isFile ? <Download size={16} /> : <Globe size={16} />}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 text-xs sm:text-sm">
                                  {item.name}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {isFile ? (
                                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 rounded">
                                      💾 File ({item.fileFormat || "EXE"})
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 rounded">
                                      🌐 Web Link
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {item.version}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Folder */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Folder size={12} className="text-indigo-500" />
                              <span>{folderObj ? folderObj.name.split("(")[0] : "General"}</span>
                            </span>
                          </td>

                          {/* Link Preview */}
                          <td className="py-3.5 px-4 max-w-xs truncate font-mono text-[11px] text-slate-600">
                            <a
                              href={item.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1 truncate"
                              title={item.downloadUrl}
                            >
                              <span className="truncate">{item.downloadUrl}</span>
                              <ExternalLink size={11} className="shrink-0" />
                            </a>
                          </td>

                          {/* Size / OS */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                            <div>{item.fileSize || "N/A"}</div>
                            <div className="text-[10px] text-slate-400">{item.supportedOS}</div>
                          </td>

                          {/* Last Updated */}
                          <td className="py-3.5 px-4 text-[11px] text-slate-500">
                            {item.lastUpdated || "N/A"}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenQuickUpdate(item)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Change download URL or file"
                              >
                                <Link size={14} />
                              </button>
                              <button
                                onClick={() => handleOpenFullModal(item)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit full details"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteSoftware(item.id, item.name)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FOLDER MANAGER (WINDOWS EXPLORER STYLE) */}
      {/* ======================================================== */}
      {adminTab === "folders" && (
        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-black text-indigo-950 flex items-center gap-2">
                <Folder className="text-indigo-600" size={18} />
                <span>Folder Directory & Access Controls (Windows Style Explorer)</span>
              </h3>
              <p className="text-xs text-indigo-800/80 mt-0.5">
                Create custom folders, modify metadata, set role-based access restrictions, or drag and drop software files.
              </p>
            </div>
            <button
              onClick={() => handleOpenFolderModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <FolderPlus size={14} />
              <span>+ Create New Folder</span>
            </button>
          </div>

          {/* Folder Storage Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Folder size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Folders</div>
                <div className="text-sm font-black text-slate-900 font-mono">{folders.length} configured</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HardDrive size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Repository Storage</div>
                <div className="text-sm font-black text-slate-900 font-mono">{totalSoftwareStorage}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average / Folder</div>
                <div className="text-sm font-black text-slate-900 font-mono">
                  {formatBytes(totalSoftwareBytes / (folders.length || 1))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => {
              const count = softwareList.filter(
                (s) => (s.folderId || getDefaultFolderForCategory(s.category)) === folder.id
              ).length;
              const isOver = dragOverFolderId === folder.id;
              const fBytes = folderStorage.byteMap[folder.id] || 0;
              const fFormatted = folderStorage.formatted[folder.id] || "0 B";
              const percent = totalSoftwareBytes > 0 ? ((fBytes / totalSoftwareBytes) * 100).toFixed(1) : "0";

              return (
                <div
                  key={folder.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverFolderId(folder.id);
                  }}
                  onDragLeave={() => {
                    if (dragOverFolderId === folder.id) setDragOverFolderId(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const sId = e.dataTransfer.getData("text/plain") || draggedSoftwareId;
                    if (sId) {
                      handleMoveSoftwareToFolder(sId, folder.id);
                    }
                    setDragOverFolderId(null);
                    setDraggedSoftwareId(null);
                  }}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isOver
                      ? "border-indigo-600 ring-2 ring-indigo-500 bg-indigo-50/40 scale-[1.02] shadow-lg"
                      : "border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        {getFolderIcon(folder.iconName)}
                      </div>
                      <div className="flex items-center gap-1">
                        {folder.allowedRoles && folder.allowedRoles.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md mr-1">
                            <Lock size={10} className="text-amber-600" />
                            <span>Restricted ({folder.allowedRoles.length})</span>
                          </span>
                        )}
                        <button
                          onClick={() => handleOpenFolderModal(folder)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Folder / Rename / Permissions"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder.id, folder.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Folder"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{folder.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {folder.descriptionTelugu || "Folder containing software and utility files."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>Files: <span className="text-indigo-600 font-mono font-black">{count}</span></span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700 font-mono font-bold">{fFormatted}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {percent}% of library
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFolderFilter(folder.id);
                        setAdminTab("software");
                      }}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold"
                    >
                      View Files →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CLOUDFLARE R2 STORAGE BROWSER & PUBLISHER */}
      {/* ======================================================== */}
      {adminTab === "r2_files" && (
        <div className="space-y-4">
          {/* R2 Banner with Direct Upload */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
                <Cloud size={13} /> Cloudflare R2 Storage (e-vedhika-files)
              </div>
              <h3 className="text-base sm:text-lg font-black">
                Cloudflare R2 Bucket Explorer & Publisher
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                Browse all cloud objects stored in Cloudflare R2. Upload new installers or packages directly,
                and publish any cloud file to the public Software Hub with 1-click.
              </p>
              {/* Real-time status indicator and Dashboard Quick Link */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-cyan-200">
                <span className="flex items-center gap-1.5 font-bold">
                  {r2Diagnostic.connected ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-emerald-300">R2 API Connected (Live)</span>
                    </>
                  ) : r2Diagnostic.missingVars && r2Diagnostic.missingVars.length > 0 ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-amber-300">R2 Keys Awaiting Config ({r2Diagnostic.missingVars.length} missing)</span>
                    </>
                  ) : r2Diagnostic.r2Error ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="text-rose-300">R2 Auth Error</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Checking R2 Status...</span>
                    </>
                  )}
                </span>
                <span className="text-cyan-400">•</span>
                <span>Bucket: <span className="font-mono font-bold text-white">e-vedhika-files</span></span>
                <span className="text-cyan-400">•</span>
                <a
                  href="https://dash.cloudflare.com/8ace4e3f2324eda23d28f8e8ddd1ffb4/r2/default/buckets/e-vedhika-files"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-400/30 font-bold transition-all"
                  title="Open Cloudflare R2 Console in new tab"
                >
                  <ExternalLink size={12} />
                  <span>Open Cloudflare Console</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="file"
                ref={r2FileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadToR2(file);
                }}
              />
              <button
                disabled={isR2Uploading}
                onClick={() => r2FileInputRef.current?.click()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isR2Uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Uploading... {r2UploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>+ Upload File to R2</span>
                  </>
                )}
              </button>
              <button
                onClick={fetchR2Files}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors"
                title="Refresh Files"
              >
                <RefreshCw size={16} className={loadingR2 ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Cloudflare R2 Storage Capacity & Free Tier Quota Dashboard */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <HardDrive size={16} className="text-cyan-600" />
                  <span>Cloudflare R2 Storage Quota & Capacity</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cloudflare R2 provides 10 GB/month free distributed object storage with zero egress bandwidth fees.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-lg">
                  {totalR2Storage} / 10 GB Tier
                </span>
                <a
                  href="https://dash.cloudflare.com/8ace4e3f2324eda23d28f8e8ddd1ffb4/r2/default/buckets/e-vedhika-files"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                  title="Open e-vedhika-files bucket in Cloudflare dashboard"
                >
                  <ExternalLink size={12} className="text-cyan-400" />
                  <span>Cloudflare Dashboard</span>
                </a>
              </div>
            </div>

            {/* Visual Storage Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-700 font-bold">
                  Storage Used: <span className="text-cyan-600">{r2PercentUsed.toFixed(2)}%</span>
                </span>
                <span className="text-slate-500">
                  Remaining Free: <span className="font-bold text-slate-700">{formatBytes(Math.max(0, r2FreeTierBytes - totalR2Bytes))}</span>
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0.6, r2PercentUsed)}%` }}
                />
              </div>
            </div>

            {/* Storage Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cloud Objects</div>
                <div className="text-sm font-black text-slate-900 font-mono">{r2Files.length} files</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Consumed</div>
                <div className="text-sm font-black text-cyan-700 font-mono">{totalR2Storage}</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average File Size</div>
                <div className="text-sm font-black text-slate-900 font-mono">
                  {formatBytes(totalR2Bytes / (r2Files.length || 1))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Largest Object</div>
                <div className="text-sm font-black text-slate-900 font-mono truncate" title={largestR2File?.key || "None"}>
                  {largestR2File ? formatBytes(largestR2File.size) : "0 B"}
                </div>
              </div>
            </div>
            {/* Diagnostic Alert if environment variables are not configured or connection warning */}
            {(r2Diagnostic.missingVars && r2Diagnostic.missingVars.length > 0) || r2Diagnostic.r2Error ? (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Cloud size={16} />
                  </span>
                  <div>
                    <div className="font-bold text-amber-900">
                      {r2Diagnostic.r2Error ? "Cloudflare R2 API Notice" : "Cloudflare R2 Configuration Required"}
                    </div>
                    <div className="text-amber-700 text-[11px] mt-0.5">
                      {r2Diagnostic.r2Error ? (
                        <span>{r2Diagnostic.r2Error}. (Cloudflare R2 requires a 32-character Access Key ID and Secret Access Key generated from R2 Manage API Tokens)</span>
                      ) : (
                        <span>
                          The server is currently running in local storage fallback mode because the following environment variables are not yet populated:{" "}
                          <span className="font-mono font-bold text-amber-900">{r2Diagnostic.missingVars?.join(", ")}</span>.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href="https://dash.cloudflare.com/8ace4e3f2324eda23d28f8e8ddd1ffb4/r2/default/buckets/e-vedhika-files"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px]"
                >
                  <ExternalLink size={12} />
                  <span>R2 API Credentials</span>
                </a>
              </div>
            ) : null}
          </div>

          {/* Search Bar for R2 */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                value={r2SearchQuery}
                onChange={(e) => setR2SearchQuery(e.target.value)}
                placeholder="Search files in Cloudflare R2 bucket..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-500">
              Total R2 Files: <span className="text-indigo-600 font-mono">{filteredR2Files.length}</span>
            </span>
          </div>

          {/* R2 Files Table */}
          {loadingR2 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Loader2 size={32} className="animate-spin mx-auto text-cyan-600 mb-3" />
              <p className="text-xs font-bold text-slate-600">Fetching files from Cloudflare R2...</p>
            </div>
          ) : filteredR2Files.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mx-auto text-cyan-600">
                <Cloud size={32} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-800">
                  {r2Diagnostic.missingVars && r2Diagnostic.missingVars.length > 0
                    ? "Cloudflare R2 Environment Variables Setup Required"
                    : r2Diagnostic.r2Error
                    ? "Cloudflare R2 Connection Notice"
                    : "No Files Found in R2 Bucket Yet"}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {r2Diagnostic.missingVars && r2Diagnostic.missingVars.length > 0 ? (
                    <>
                      R2 access keys are not yet configured in the environment settings:{" "}
                      <span className="font-mono text-amber-700 font-bold">
                        {r2Diagnostic.missingVars.join(", ")}
                      </span>
                      . Once configured in Cloud Run / Settings, files will sync automatically.
                    </>
                  ) : r2Diagnostic.r2Error ? (
                    <>
                      Cloudflare error: <span className="font-mono text-rose-600 font-bold">{r2Diagnostic.r2Error}</span>.
                      Please check R2 API Token permissions (Object Read & Write).
                    </>
                  ) : (
                    <>
                      Bucket <span className="font-mono font-bold text-slate-800">e-vedhika-files</span> has 0 objects right now.
                      Click the <strong>&quot;+ Upload File to R2&quot;</strong> button above or upload directly from the Cloudflare Dashboard to populate files.
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  disabled={isR2Uploading}
                  onClick={() => r2FileInputRef.current?.click()}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  <span>Upload First File to R2</span>
                </button>
                <a
                  href="https://dash.cloudflare.com/8ace4e3f2324eda23d28f8e8ddd1ffb4/r2/default/buckets/e-vedhika-files"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                >
                  <ExternalLink size={14} />
                  <span>Check Cloudflare Console</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">File Name (Key)</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Modified Date</th>
                      <th className="py-3 px-4">Software Hub Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredR2Files.map((file) => {
                      const publishedItem = getR2PublishedItem(file.url, file.key);

                      return (
                        <tr key={file.key} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <HardDrive size={15} className="text-cyan-600 shrink-0" />
                              <span className="truncate max-w-sm" title={file.key}>
                                {file.key.split("/").pop()}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {formatBytes(file.size)}
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(file.lastModified).toLocaleDateString("en-IN")}
                          </td>

                          {/* Software Hub Status */}
                          <td className="py-3.5 px-4">
                            {publishedItem ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle size={12} />
                                <span>Published ({publishedItem.name})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                <span>Not Published</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(file.url);
                                  if (addToast) addToast("R2 URL copied to clipboard!", "success");
                                }}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Copy R2 Download URL"
                              >
                                <Copy size={14} />
                              </button>

                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Download / Open"
                              >
                                <ExternalLink size={14} />
                              </a>

                              {!publishedItem ? (
                                <button
                                  onClick={() => handlePublishR2File(file)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                                >
                                  <Plus size={13} />
                                  <span>Publish to Hub</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteSoftware(publishedItem.id, publishedItem.name)}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all"
                                  title="Unpublish / Remove from Software Hub"
                                >
                                  <span>Unpublish</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* QUICK UPDATE LINK/FILE MODAL */}
      {/* ======================================================== */}
      {quickUpdateItem && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="text-cyan-400" size={20} />
                <div>
                  <h3 className="text-sm sm:text-base font-black">Quick Update Link / File</h3>
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
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Item Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickItemType("file")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      quickItemType === "file"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
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
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Globe size={14} />
                    <span>🌐 Web / Drive Link</span>
                  </button>
                </div>
              </div>

              {/* Folder Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Folder:
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
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Upload size={14} className="text-indigo-600" />
                  Upload new file (.exe, .zip, .rar):
                </span>
                <input
                  type="file"
                  ref={quickFileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, true);
                  }}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => quickFileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-indigo-600" />
                      <span>Uploading... {uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Browse & Upload to Cloud</span>
                    </>
                  )}
                </button>
              </div>

              {/* Download URL input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Download Link or Google Drive URL:
                </label>
                <input
                  type="url"
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://pub-xxx.r2.dev/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  disabled={isSavingQuick || isUploading}
                  onClick={handleSaveQuickUpdate}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingQuick ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Updates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FULL ADD / EDIT SOFTWARE MODAL */}
      {/* ======================================================== */}
      {isFullModalOpen && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-8 text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="text-cyan-400" size={20} />
                <h3 className="text-base font-black">
                  {editingItem ? `Edit '${editingItem.name}'` : "Add New Software or Link"}
                </h3>
              </div>
              <button
                onClick={() => setIsFullModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Item Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormItemType("file")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      formItemType === "file"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Download size={15} />
                    <span>💾 Direct File (.EXE, .ZIP, .MSI)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormItemType("link")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      formItemType === "link"
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Globe size={15} />
                    <span>🌐 Web Portal / Drive Link</span>
                  </button>
                </div>
              </div>

              {/* Name and Version */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Software / Tool Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Mantra MFS100 RD Service"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="v1.0.8"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Folder & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Folder *
                  </label>
                  <select
                    value={formFolderId}
                    onChange={(e) => setFormFolderId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="biometric">Biometric & RD Services</option>
                    <option value="fonts">Telugu Typing & Fonts</option>
                    <option value="portal">DSC & Portal Tools</option>
                    <option value="office">Office & System Utilities</option>
                    <option value="other">Other Utilities</option>
                  </select>
                </div>
              </div>

              {/* File Format & Size & OS (If File) */}
              {formItemType === "file" && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">File Format</label>
                    <select
                      value={formFileFormat}
                      onChange={(e) => setFormFileFormat(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    >
                      <option value="EXE">.EXE</option>
                      <option value="ZIP">.ZIP</option>
                      <option value="MSI">.MSI</option>
                      <option value="RAR">.RAR</option>
                      <option value="PDF">.PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">File Size</label>
                    <input
                      type="text"
                      value={formFileSize}
                      onChange={(e) => setFormFileSize(e.target.value)}
                      placeholder="28.4 MB"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Supported OS</label>
                    <input
                      type="text"
                      value={formOS}
                      onChange={(e) => setFormOS(e.target.value)}
                      placeholder="Windows 10/11"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* File Upload Box */}
              {formItemType === "file" && (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Upload size={14} className="text-indigo-600" />
                    Upload from Computer (.exe, .zip, .rar):
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload size={14} />
                    <span>Browse & Upload File</span>
                  </button>
                </div>
              )}

              {/* Download URL / External Link Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Download / Web URL *
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://pub-xxx.r2.dev/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Utility software used for administrative and desk operations..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Installation Guide */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Installation Guide (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formGuide}
                  onChange={(e) => setFormGuide(e.target.value)}
                  placeholder="1. First uninstall existing drivers...&#10;2. Run setup as administrator..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFullModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFullSoftware}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check size={15} />
                  <span>Save in Real-Time</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOLDER ADD / EDIT MODAL (WINDOWS EXPLORER STYLE) */}
      {/* ======================================================== */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-auto text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="text-cyan-400" size={20} />
                <h3 className="text-base font-black">
                  {editingFolder ? "Edit Folder Details" : "Create New Folder"}
                </h3>
              </div>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Folder Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Folder Name *
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Biometric Device Drivers"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Folder Description
                </label>
                <textarea
                  rows={2}
                  value={folderDesc}
                  onChange={(e) => setFolderDesc(e.target.value)}
                  placeholder="Brief description of files and software in this folder..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Folder Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "Folder", label: "Folder", icon: Folder },
                    { id: "Fingerprint", label: "Biometric", icon: Fingerprint },
                    { id: "Type", label: "Fonts", icon: Type },
                    { id: "ShieldCheck", label: "Security", icon: ShieldCheck },
                    { id: "Laptop", label: "Tools", icon: Laptop },
                    { id: "Globe", label: "Portal", icon: Globe },
                    { id: "HardDrive", label: "Storage", icon: HardDrive },
                  ].map((ic) => {
                    const IcComponent = ic.icon;
                    const isSelected = folderIcon === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setFolderIcon(ic.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <IcComponent size={18} />
                        <span>{ic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Color Theme
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: "indigo", bg: "bg-indigo-600" },
                    { id: "rose", bg: "bg-rose-600" },
                    { id: "amber", bg: "bg-amber-600" },
                    { id: "emerald", bg: "bg-emerald-600" },
                    { id: "blue", bg: "bg-blue-600" },
                    { id: "purple", bg: "bg-purple-600" },
                    { id: "cyan", bg: "bg-cyan-600" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFolderColor(c.id as any)}
                      className={`w-7 h-7 rounded-full ${c.bg} transition-all flex items-center justify-center ${
                        folderColor === c.id ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {folderColor === c.id && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Folder Access Permissions (allowedRoles) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock size={13} className="text-amber-600" />
                    <span>Access Permissions</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {folderAllowedRoles.length === 0 ? "Public (All Users)" : "Restricted"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                  Select which user roles are granted access to view this folder. Leaving this blank makes it accessible to all users.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "admin", label: "Admin" },
                    { id: "operator", label: "Operator" },
                    { id: "vro", label: "VRO / Revenue" },
                    { id: "panchayat_secretary", label: "Panchayat Secretary" },
                    { id: "citizen", label: "Citizen / Public" },
                  ].map((role) => {
                    const isChecked = folderAllowedRoles.includes(role.id);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFolderAllowedRoles(folderAllowedRoles.filter((r) => r !== role.id));
                          } else {
                            setFolderAllowedRoles([...folderAllowedRoles, role.id]);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all text-left ${
                          isChecked
                            ? "bg-amber-500/10 border-amber-500 text-amber-900"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{role.label}</span>
                        {isChecked ? (
                          <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFolder}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save Folder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
