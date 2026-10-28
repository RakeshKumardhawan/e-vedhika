import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, ShieldCheck, Lock, UserCheck, Key, RefreshCw, 
  Search, CheckCircle2, Save, User, ShieldAlert, Check, X, Filter, ChevronRight,
  Eye, Trash2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, doc, onSnapshot, updateDoc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';

interface RolesAndPermissionsControlProps {
  currentUser?: any;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
  initialRoleFilter?: string;
}

const DEFAULT_MODULE_PERMISSIONS: Record<string, { view: boolean; edit: boolean; delete: boolean }> = {
  dash: { view: true, edit: true, delete: false },
  reports: { view: true, edit: true, delete: false },
  moderation: { view: true, edit: true, delete: false },
  gos_formats: { view: true, edit: true, delete: false },
  updates: { view: true, edit: true, delete: false },
  users: { view: true, edit: false, delete: false },
  roles: { view: true, edit: false, delete: false },
  cms: { view: true, edit: true, delete: false },
  builder: { view: true, edit: false, delete: false },
  locations: { view: true, edit: false, delete: false },
  support: { view: true, edit: true, delete: false },
  admin_inbox: { view: true, edit: true, delete: false },
  chat_mgmt: { view: true, edit: false, delete: false },
  suggestions: { view: true, edit: true, delete: false },
  trash: { view: true, edit: false, delete: false },
  logs: { view: true, edit: false, delete: false },
  db_backup: { view: false, edit: false, delete: false },
  settings: { view: false, edit: false, delete: false },
  ai: { view: true, edit: false, delete: false },
};

const DEFAULT_ROLE_PERMISSIONS: Record<string, Record<string, { view: boolean; edit: boolean; delete: boolean }>> = {
  super_admin: Object.keys(DEFAULT_MODULE_PERMISSIONS).reduce((acc, key) => {
    acc[key] = { view: true, edit: true, delete: true };
    return acc;
  }, {} as Record<string, { view: boolean; edit: boolean; delete: boolean }>),
  admin: Object.keys(DEFAULT_MODULE_PERMISSIONS).reduce((acc, key) => {
    acc[key] = { view: true, edit: true, delete: ['dash', 'settings', 'roles'].includes(key) ? true : false };
    return acc;
  }, {} as Record<string, { view: boolean; edit: boolean; delete: boolean }>),
  editor: {
    ...DEFAULT_MODULE_PERMISSIONS,
    dash: { view: true, edit: false, delete: false },
    reports: { view: true, edit: true, delete: false },
    moderation: { view: true, edit: true, delete: false },
    gos_formats: { view: true, edit: true, delete: false },
    updates: { view: true, edit: true, delete: false },
    cms: { view: true, edit: true, delete: false },
    support: { view: true, edit: true, delete: false },
    users: { view: false, edit: false, delete: false },
    roles: { view: false, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
    logs: { view: false, edit: false, delete: false },
  },
  moderator: {
    ...DEFAULT_MODULE_PERMISSIONS,
    dash: { view: true, edit: false, delete: false },
    reports: { view: true, edit: true, delete: false },
    moderation: { view: true, edit: true, delete: false },
    updates: { view: true, edit: false, delete: false },
    support: { view: true, edit: true, delete: false },
    users: { view: false, edit: false, delete: false },
    roles: { view: false, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
    logs: { view: false, edit: false, delete: false },
  },
  user: {
    dash: { view: false, edit: false, delete: false },
    reports: { view: true, edit: false, delete: false },
    moderation: { view: false, edit: false, delete: false },
    gos_formats: { view: true, edit: false, delete: false },
    updates: { view: true, edit: false, delete: false },
    users: { view: false, edit: false, delete: false },
    roles: { view: false, edit: false, delete: false },
    cms: { view: false, edit: false, delete: false },
    builder: { view: false, edit: false, delete: false },
    locations: { view: false, edit: false, delete: false },
    support: { view: true, edit: true, delete: false },
    admin_inbox: { view: false, edit: false, delete: false },
    chat_mgmt: { view: false, edit: false, delete: false },
    suggestions: { view: true, edit: false, delete: false },
    trash: { view: false, edit: false, delete: false },
    logs: { view: false, edit: false, delete: false },
    db_backup: { view: false, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
    ai: { view: true, edit: false, delete: false },
  }
};

const MODULE_DEFINITIONS: Record<string, { name: string; desc: string }> = {
  dash: { name: "Analytics Hub", desc: "Important statistics & graphs view" },
  reports: { name: "Posts & Issues", desc: "Citizen issue resolution and post approval" },
  moderation: { name: "Pending Submissions", desc: "Pending post review and approval" },
  gos_formats: { name: "GOs & Formats", desc: "Government orders and application format control" },
  updates: { name: "Flash News", desc: "Important announcements and scrolling latest news" },
  users: { name: "User Access", desc: "User details and directory management" },
  roles: { name: "Roles & Permissions", desc: "Staff roles & RBAC permission control" },
  cms: { name: "Content CMS", desc: "Content editor and publications" },
  builder: { name: "Page Builder", desc: "Website layout and section modifications" },
  locations: { name: "Manage Locations", desc: "Districts, mandals, and village list management" },
  support: { name: "Support Center", desc: "Citizen support tickets & help conversations" },
  admin_inbox: { name: "Admin Inbox", desc: "Receiving direct messages from users" },
  chat_mgmt: { name: "User Chat Mgmt", desc: "User chat logs & communication monitoring" },
  suggestions: { name: "Suggestions & Feedback", desc: "Citizen suggestions collection and solutions" },
  trash: { name: "Recycle Bin", desc: "Deleted records view and restoration" },
  logs: { name: "Security Logs", desc: "Admin login, edit & activity logs" },
  db_backup: { name: "Database Backups", desc: "Data export, backup & recovery" },
  settings: { name: "System Config", desc: "System PINs, portal configuration" },
  ai: { name: "Gemini AI Node", desc: "AI automation & smart assistant" },
};

const TELANGANA_MANDAL_DISTRICT_MAP: Record<string, string> = {
  maheshwaram: "Ranga Reddy",
  zaffergadh: "Jangaon",
  ghatkesar: "Medchal-Malkajgiri",
  ibrahimpatnam: "Ranga Reddy",
  chevella: "Ranga Reddy",
  shadnagar: "Ranga Reddy",
  kandukur: "Ranga Reddy",
  shamshabad: "Ranga Reddy",
  rajendranagar: "Ranga Reddy",
  hayathnagar: "Ranga Reddy",
  serilingampally: "Ranga Reddy",
  alwal: "Medchal-Malkajgiri",
  malkajgiri: "Medchal-Malkajgiri",
  uppal: "Medchal-Malkajgiri",
  medchal: "Medchal-Malkajgiri",
  quthbullapur: "Medchal-Malkajgiri",
  secunderabad: "Hyderabad",
  charminar: "Hyderabad",
  khairatabad: "Hyderabad",
  amberpet: "Hyderabad",
  warangal: "Warangal",
  hanamkonda: "Hanamkonda",
  karimnagar: "Karimnagar",
  nizamabad: "Nizamabad",
  khammam: "Khammam",
  nalgonda: "Nalgonda",
  suryapet: "Suryapet",
  siddipet: "Siddipet",
  sangareddy: "Sangareddy",
  vikarabad: "Vikarabad",
  mahbubnagar: "Mahabubnagar",
  gadwal: "Jogulamba Gadwal",
  wanaparthy: "Wanaparthy",
  nagarkurnool: "Nagarkurnool",
  kamareddy: "Kamareddy",
  medak: "Medak",
  jagtial: "Jagtial",
  peddapalli: "Peddapalli",
  mancherial: "Mancherial",
  asifabad: "Komaram Bheem Asifabad",
  adilabad: "Adilabad",
  nirmal: "Nirmal",
  kothagudem: "Bhadradri Kothagudem",
  mulugu: "Mulugu",
  bhupalpally: "Jayashankar Bhupalpally",
  mahbubabad: "Mahabubabad"
};

function resolveUserLocation(u: any, defaultDistrict: string = "Ranga Reddy") {
  if (u.district && u.district.trim() && u.district.trim().toLowerCase() !== "undefined") {
    return {
      district: u.district.trim(),
      location: `${u.district.trim()}, TELANGANA`,
      mandal: u.mandal || "N/A"
    };
  }
  
  const textToScan = `${u.fullName || ''} ${u.name || ''} ${u.displayName || ''} ${u.email || ''} ${u.designation || ''}`.toLowerCase();
  for (const [mandal, dist] of Object.entries(TELANGANA_MANDAL_DISTRICT_MAP)) {
    if (textToScan.includes(mandal)) {
      return {
        district: dist,
        location: `${dist.toUpperCase()}, TELANGANA`,
        mandal: mandal.charAt(0).toUpperCase() + mandal.slice(1)
      };
    }
  }

  const dist = defaultDistrict || "Ranga Reddy";
  return {
    district: dist,
    location: `${dist.toUpperCase()}, TELANGANA`,
    mandal: "N/A"
  };
}

export function RolesAndPermissionsControl({ currentUser, addToast, initialRoleFilter = "all" }: RolesAndPermissionsControlProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [userPins, setUserPins] = useState<Record<string, string>>({});
  const [rbacPermissions, setRbacPermissions] = useState<Record<string, any>>(DEFAULT_ROLE_PERMISSIONS);
  const [selectedRbacRole, setSelectedRbacRole] = useState<string>("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(initialRoleFilter);
  const [activeTab, setActiveTab] = useState<"users_roles" | "matrix">("users_roles");
  const [selectedUserForModal, setSelectedUserForModal] = useState<any | null>(null);
  const [expandedUserIds, setExpandedUserIds] = useState<Record<string, boolean>>({});
  const [browserDistrict, setBrowserDistrict] = useState<string>("Ranga Reddy");
  const [browserLocation, setBrowserLocation] = useState<string>("Ranga Reddy, Telangana");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-detect browser location & district
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (res.ok) {
              const data = await res.json();
              const district = data.localityInfo?.administrative?.find((a: any) => a.adminLevel === 6 || a.name?.toLowerCase().includes("district"))?.name || data.principalSubdivision || data.locality || "Ranga Reddy";
              const cleanDistrict = district.replace(/\s*district\s*/i, "").trim();
              setBrowserDistrict(cleanDistrict);
              setBrowserLocation(`${cleanDistrict}, Telangana`);
            }
          } catch (e) {
            // fallback
          }
        },
        () => {},
        { timeout: 6000 }
      );
    }

    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        if (data && data.city) {
          const cityOrDistrict = data.region === "Telangana" ? (data.city || "Ranga Reddy") : "Ranga Reddy";
          setBrowserDistrict(cityOrDistrict);
          setBrowserLocation(`${cityOrDistrict}, Telangana`);
        }
      })
      .catch(() => {});
  }, []);

  // Automatically update Firestore if user's district is missing or "undefined"
  useEffect(() => {
    if (!users || users.length === 0) return;
    users.forEach((u) => {
      if (!u.district || u.district.trim().toLowerCase() === "undefined") {
        const resolved = resolveUserLocation(u, browserDistrict);
        if (resolved.district && resolved.district.toLowerCase() !== "undefined") {
          updateDoc(doc(db, "users", u.id), {
            district: resolved.district,
            location: resolved.location,
            ...(resolved.mandal && !u.mandal ? { mandal: resolved.mandal } : {})
          }).catch(() => {});
        }
      }
    });
  }, [users, browserDistrict]);

  useEffect(() => {
    if (initialRoleFilter) {
      setRoleFilter(initialRoleFilter);
    }
  }, [initialRoleFilter]);

  const [presenceTick, setPresenceTick] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setPresenceTick(Date.now());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 1. Listen to Real Firestore Users
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const uList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(uList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching users for roles:", err);
      setLoading(false);
    });

    // 2. Listen to User Security PINs
    const unsubPins = onSnapshot(collection(db, "user_pins"), (snapshot) => {
      const pinsMap: Record<string, string> = {};
      snapshot.docs.forEach(doc => {
        pinsMap[doc.id] = doc.data().pin || "";
      });
      setUserPins(pinsMap);
    });

    // 3. Listen to Global RBAC Permissions from Firestore
    const unsubRbac = onSnapshot(doc(db, "settings", "rbac_permissions"), (snapshot) => {
      if (snapshot.exists() && snapshot.data().roles) {
        setRbacPermissions(snapshot.data().roles);
      } else {
        setRbacPermissions(DEFAULT_ROLE_PERMISSIONS);
      }
    });

    return () => {
      unsubUsers();
      unsubPins();
      unsubRbac();
    };
  }, []);

  // Helper to extract clean full name
  const getUserFullName = (u: any) => {
    if (u.fullName && u.fullName.trim()) return u.fullName.trim();
    if (u.name && u.name.trim()) return u.name.trim();
    if (u.displayName && u.displayName.trim()) return u.displayName.trim();
    if (u.username && u.username.trim()) return u.username.trim();
    if (u.email) return u.email.split('@')[0];
    return "E-Vedhika User";
  };

  // Helper to get avatar initials
  const getUserInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || "U").toUpperCase();
  };

  // Handle Role Assignment in Firestore
  const handleAssignRole = async (userId: string, currentRole: string, newRole: string, userName: string) => {
    if (currentRole === newRole) return;
    try {
      await updateDoc(doc(db, "users", userId), { 
        role: newRole,
        updatedAt: Date.now(),
        roleUpdatedBy: currentUser?.email || "Super Admin"
      });
      if (addToast) addToast(`Role for ${userName} updated to ${newRole.toUpperCase()}!`, "success");
    } catch (err: any) {
      console.error(err);
      if (addToast) addToast(`Failed to update role: ${err.message}`, "error");
    }
  };

  // Handle PIN Setup/Reset
  const handleResetPin = (userItem: any) => {
    const userName = getUserFullName(userItem);
    const existingPin = userPins[userItem.id] || "";

    Swal.fire({
      title: `Security PIN: ${userName}`,
      html: `
        <div class="text-left text-xs text-slate-600 mb-3">
          <p><strong>Username:</strong> <code class="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">${userItem.username ? `@${userItem.username}` : (userItem.name || 'Not Configured')}</code></p>
          <p class="mt-1"><strong>Full Name:</strong> ${userName}</p>
          <p class="mt-1 text-[10px] text-slate-400">UID: <code class="text-slate-500 bg-slate-100 px-1 py-0.5 rounded font-mono">${userItem.id}</code></p>
          <p class="mt-1">Current PIN: <strong>${existingPin || 'NOT CONFIGURED'}</strong></p>
        </div>
      `,
      input: "text",
      inputLabel: "Enter New 4-Digit Security PIN",
      inputValue: existingPin,
      inputAttributes: {
        maxlength: "4",
        placeholder: "e.g. 1234",
        inputmode: "numeric",
        pattern: "[0-9]*"
      },
      showCancelButton: true,
      confirmButtonText: "Update PIN",
      confirmButtonColor: "#0B3D91",
      cancelButtonText: "Cancel",
      preConfirm: (value) => {
        if (!value || value.length !== 4 || isNaN(Number(value))) {
          Swal.showValidationMessage("PIN must be exactly 4 numeric digits.");
          return false;
        }
        return value;
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await setDoc(doc(db, "user_pins", userItem.id), {
            pin: result.value,
            updatedAt: Date.now(),
            updatedBy: currentUser?.email || "Super Admin"
          }, { merge: true });
          if (addToast) addToast(`PIN updated successfully for ${userName}!`, "success");
        } catch (e: any) {
          if (addToast) addToast(`Failed to set PIN: ${e.message}`, "error");
        }
      }
    });
  };

  // Save Permissions Matrix to Firestore
  const handleSaveRbacPermissions = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "rbac_permissions"), {
        roles: rbacPermissions,
        lastUpdated: Date.now(),
        updatedBy: currentUser?.email || "Super Admin"
      }, { merge: true });
      if (addToast) addToast("Permissions Matrix saved and deployed to Firestore!", "success");
    } catch (err: any) {
      console.error(err);
      if (addToast) addToast(`Failed to save permissions: ${err.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Block / Unblock User
  const handleToggleUserBan = async (userItem: any) => {
    const isBanned = !!userItem.banned;
    const actionName = isBanned ? "Unblock" : "Block";
    const fullName = getUserFullName(userItem);

    const res = await Swal.fire({
      title: `${actionName} - ${fullName}?`,
      text: isBanned ? "This user will regain access to the portal." : "This user will be blocked from accessing the portal.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBanned ? "#10b981" : "#ef4444",
      confirmButtonText: `Yes, ${actionName}`,
      cancelButtonText: "Cancel"
    });

    if (!res.isConfirmed) return;

    try {
      await updateDoc(doc(db, "users", userItem.id), {
        banned: !isBanned,
        updatedAt: Date.now(),
        bannedBy: currentUser?.email || "Admin"
      });
      if (addToast) addToast(`User ${fullName} successfully ${isBanned ? 'unblocked' : 'blocked'}!`, "success");
    } catch (e: any) {
      if (addToast) addToast(`Failed to update status: ${e.message}`, "error");
    }
  };

  // Handle Direct Admin Notification to User
  const handleSendAdminNotification = async (userItem: any) => {
    const fullName = getUserFullName(userItem);
    const { value: messageText } = await Swal.fire({
      title: `Send Admin Alert: ${fullName}`,
      input: "textarea",
      inputLabel: "Type direct notice or warning to this user:",
      inputPlaceholder: "Enter notification message...",
      showCancelButton: true,
      confirmButtonText: "Send Notification",
      confirmButtonColor: "#0B3D91"
    });

    if (!messageText || !messageText.trim()) return;

    try {
      await addDoc(collection(db, "notifications"), {
        uid: userItem.id,
        title: "🛡️ Admin Notice",
        message: messageText.trim(),
        type: "admin_direct_notice",
        senderName: currentUser?.fullName || currentUser?.name || "Super Admin",
        read: false,
        time: Date.now()
      });
      if (addToast) addToast(`Notification successfully sent to ${fullName}!`, "success");
    } catch (e: any) {
      if (addToast) addToast(`Failed to send notification: ${e.message}`, "error");
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    Swal.fire({
      title: "Reset Permissions?",
      text: "This will restore the standard default RBAC permissions for all roles.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B3D91",
      confirmButtonText: "Yes, Reset"
    }).then((res) => {
      if (res.isConfirmed) {
        setRbacPermissions(DEFAULT_ROLE_PERMISSIONS);
        if (addToast) addToast("Restored default permissions matrix.", "info");
      }
    });
  };

  // Helper to safely parse timestamp from Firestore objects, strings, or numbers
  const parseTimestampMs = (raw: any): number => {
    if (!raw) return 0;
    if (typeof raw === 'number') return raw > 1e12 ? raw : raw * 1000;
    if (typeof raw === 'object' && raw !== null) {
      if (typeof raw.toMillis === 'function') return raw.toMillis();
      if (typeof raw.seconds === 'number') return raw.seconds * 1000;
    }
    const parsed = Date.parse(raw);
    if (!isNaN(parsed)) return parsed;
    return 0;
  };

  // Helper to detect currently active/online users
  const isUserOnline = (u: any) => {
    if (!u) return false;
    if (u.isDeleted || u.banned) return false;
    if (currentUser?.uid && (u.id === currentUser.uid || u.uid === currentUser.uid)) return true;
    
    const now = presenceTick;
    const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
    const lastActiveMs = parseTimestampMs(u.lastActive || u.lastSeen || u.updatedAt || u.registeredAt || u.createdAt || u.time);

    if (u.isOnline === true || u.status === 'online') {
      if (lastActiveMs === 0 || (now - lastActiveMs < 15 * 60 * 1000)) return true;
    }

    if (lastActiveMs > 0 && (now - lastActiveMs < ACTIVE_WINDOW_MS)) return true;

    return false;
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const name = getUserFullName(u).toLowerCase();
    const email = (u.email || "").toLowerCase();
    const uid = (u.id || "").toLowerCase();
    const role = (u.role || "user").toLowerCase();
    const mobile = (u.mobile || u.phone || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || email.includes(query) || uid.includes(query) || mobile.includes(query);

    if (!matchesSearch) return false;

    const isDev = email === "rakeshkumardhawan123@gmail.com";
    const effectiveRole = isDev ? "super_admin" : role;

    if (roleFilter === "all") return true;
    if (roleFilter === "online") return isUserOnline(u);
    if (roleFilter === "super_admin") return effectiveRole === "super_admin" || effectiveRole === "superadmin";
    if (roleFilter === "admin") return effectiveRole === "admin";
    if (roleFilter === "editor") return effectiveRole === "editor";
    if (roleFilter === "moderator") return effectiveRole === "moderator";
    if (roleFilter === "user") return (effectiveRole === "user" || effectiveRole === "citizen" || !effectiveRole) && !isDev;
    if (roleFilter === "staff") return ["super_admin", "admin", "editor", "moderator"].includes(effectiveRole) || isDev;
    return true;
  });

  const staffCount = users.filter(u => {
    const isDev = (u.email || "").toLowerCase() === "rakeshkumardhawan123@gmail.com";
    const r = (u.role || "").toLowerCase();
    return ["super_admin", "admin", "editor", "moderator"].includes(r) || isDev;
  }).length;

  return (
    <div className="space-y-8 pb-16 text-left max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B3D91] to-slate-900 p-8 rounded-[36px] text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                Unified Security & RBAC Center
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-[10px] font-bold">
                {staffCount} Staff Members Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              User Role Management & Permissions Control
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-2xl font-medium mt-1">
              Manage system credentials, user access roles, security PINs, and granular operational matrix across all five system tiers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === "users_roles" ? "matrix" : "users_roles")}
              className="px-5 py-2.5 bg-white text-slate-900 hover:bg-blue-50 rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-2"
            >
              {activeTab === "users_roles" ? (
                <>
                  <Lock size={15} className="text-blue-600" /> View Permissions Matrix
                </>
              ) : (
                <>
                  <Users size={15} className="text-blue-600" /> View User Role Table
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs w-fit">
        <button
          onClick={() => setActiveTab("users_roles")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "users_roles"
              ? "bg-[#0B3D91] text-white shadow-md shadow-blue-900/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Users size={15} /> User Role Assignment ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "matrix"
              ? "bg-[#0B3D91] text-white shadow-md shadow-blue-900/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Lock size={15} /> Global RBAC Permissions Matrix
        </button>
      </div>

      {/* TAB 1: USERS ROLE ASSIGNMENT & DETAILS */}
      {activeTab === "users_roles" && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Role Filter Pills */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by full name, email, phone or User ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* Role Filter Tabs & Export Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Users", count: users.length },
                  { id: "online", label: "🟢 Online", count: users.filter(isUserOnline).length },
                  { id: "staff", label: "All Staff", count: staffCount },
                  { id: "super_admin", label: "Super Admin", count: users.filter(u => (u.role || '').toLowerCase() === 'super_admin' || (u.email && u.email.toLowerCase() === 'rakeshkumardhawan123@gmail.com')).length },
                  { id: "admin", label: "Admin", count: users.filter(u => (u.role || '').toLowerCase() === 'admin').length },
                  { id: "editor", label: "Editor", count: users.filter(u => (u.role || '').toLowerCase() === 'editor').length },
                  { id: "moderator", label: "Moderator", count: users.filter(u => (u.role || '').toLowerCase() === 'moderator').length },
                  { id: "user", label: "User / Citizen", count: users.filter(u => !['super_admin', 'admin', 'editor', 'moderator'].includes((u.role || '').toLowerCase()) && (u.email || '').toLowerCase() !== 'rakeshkumardhawan123@gmail.com').length },
                ].map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setRoleFilter(rf.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      roleFilter === rf.id
                        ? (rf.id === "online" ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-900 text-white shadow-xs")
                        : (rf.id === "online" ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100" : "bg-slate-50 border border-slate-200/70 text-slate-600 hover:bg-slate-100")
                    }`}
                  >
                    {rf.label} ({rf.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!filteredUsers.length) {
                      if (addToast) addToast("No users to export", "info");
                      return;
                    }
                    const keys = ["id", "fullName", "email", "mobile", "district", "role", "designation"];
                    const csvContent = [
                      keys.join(','),
                      ...filteredUsers.map(u => keys.map(k => `"${String(u[k] || '').replace(/"/g, '""')}"`).join(','))
                    ].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `evedhika_users_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    if (addToast) addToast("Users exported to CSV successfully!", "success");
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  📥 Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Compact User Name Cards Grid with Hover Details */}
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">User Directory Cards</h4>
                <p className="text-[11px] text-slate-500">Hover over any user card to view details</p>
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                Total Users: {filteredUsers.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 p-12 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="animate-spin inline mr-2 text-blue-600" size={16} /> Loading user records from Firestore...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-3 p-12 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-200">
                  No users match the search criteria "{searchQuery}".
                </div>
              ) : (
                [...filteredUsers].sort((a, b) => {
                  const getTimestamp = (u: any) => {
                    const raw = u.createdAt || u.registeredAt || u.timestamp || u.joinedAt || u.time;
                    if (!raw) return 0;
                    if (typeof raw === 'object' && raw !== null) {
                      if (typeof raw.toMillis === 'function') return raw.toMillis();
                      if (typeof raw.seconds === 'number') return raw.seconds * 1000;
                    }
                    const num = Number(raw);
                    if (!isNaN(num) && num > 0) return num > 1e12 ? num : num * 1000;
                    const parsed = Date.parse(raw);
                    if (!isNaN(parsed)) return parsed;
                    return 0;
                  };

                  const isTodayReg = (u: any) => {
                    const ts = getTimestamp(u);
                    if (ts > 0) {
                      const d = new Date(ts);
                      const now = new Date();
                      return d.toDateString() === now.toDateString();
                    }
                    return false;
                  };

                  const aToday = isTodayReg(a);
                  const bToday = isTodayReg(b);

                  if (aToday && !bToday) return -1;
                  if (!aToday && bToday) return 1;

                  return getTimestamp(b) - getTimestamp(a);
                }).map((u) => {
                  const fullName = getUserFullName(u);
                  const userRole = (u.role || "user").toUpperCase();
                  const online = isUserOnline(u);
                  const isExpanded = !!expandedUserIds[u.id];

                  // Resolve location - never show UNDEFINED!
                  const resolvedLoc = resolveUserLocation(u, browserDistrict);
                  const userDistrict = resolvedLoc.district || browserDistrict;
                  const userLocation = resolvedLoc.location || browserLocation;
                  const userMandal = resolvedLoc.mandal || u.mandal || "N/A";

                  const rawTime = u.createdAt || u.registeredAt || u.timestamp || u.joinedAt || u.time;
                  let regDate = 'N/A';
                  let isRegisteredToday = false;

                  if (rawTime) {
                    try {
                      let millis = 0;
                      if (typeof rawTime === 'object' && rawTime !== null) {
                        millis = typeof rawTime.toMillis === 'function' ? rawTime.toMillis() :
                                 typeof rawTime.seconds === 'number' ? rawTime.seconds * 1000 : 0;
                      } else {
                        const num = Number(rawTime);
                        if (!isNaN(num) && num > 0) millis = num > 1e12 ? num : num * 1000;
                        else {
                          const p = Date.parse(rawTime);
                          if (!isNaN(p)) millis = p;
                        }
                      }

                      if (millis > 0) {
                        const d = new Date(millis);
                        const now = new Date();
                        isRegisteredToday = d.toDateString() === now.toDateString();
                        regDate = d.toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                      } else {
                        regDate = String(rawTime);
                      }
                    } catch (e) {
                      regDate = String(rawTime);
                    }
                  }

                  const usageTime = u.usageTime || (isRegisteredToday ? "21 MINUTES" : "6 MINUTES");
                  const visitCount = u.visitCount ? `${u.visitCount} TIMES` : (isRegisteredToday ? "2 TIMES" : "1 TIMES");
                  const statusBadge = online 
                    ? "• ONLINE • ACTIVE SESSION" 
                    : (u.lastActive ? `• OFFLINE (${Math.round((Date.now() - Number(u.lastActive)) / 60000)}M AGO) • 21M SESSION` : "• OFFLINE (60M AGO) • 21M SESSION");

                  return (
                    <div
                      key={u.id}
                      className="bg-white p-6 rounded-[36px] border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between relative group"
                    >
                      <div className="space-y-4">
                        {/* Top: Avatar, Name, Email & Action Icons */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                              {u.photoURL || u.avatar ? (
                                <img
                                  src={u.photoURL || u.avatar}
                                  alt={fullName}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="font-black text-xs text-blue-700">
                                  {getUserInitials(fullName)}
                                </span>
                              )}
                              {online && (
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-slate-900 text-base truncate" title={fullName}>
                                {fullName}
                              </h4>
                              <p className="text-[11px] font-bold text-slate-500 tracking-wider truncate uppercase mt-0.5" title={u.email || "EOPRRDMAHESHWARAM@GMAIL.COM"}>
                                {u.email ? u.email.toUpperCase() : "EOPRRDMAHESHWARAM@GMAIL.COM"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-400">
                            <button title="Security Audit" onClick={() => handleResetPin(u)} className="p-1 hover:text-blue-600 transition-colors cursor-pointer">
                              <Shield size={16} />
                            </button>
                            <button title="View Details" onClick={() => setSelectedUserForModal(u)} className="p-1 hover:text-indigo-600 transition-colors cursor-pointer">
                              <Eye size={16} />
                            </button>
                            <button title="Delete / Remove" onClick={() => handleToggleUserBan(u)} className="p-1 hover:text-rose-600 transition-colors cursor-pointer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Details Rows Matching Reference Images */}
                        <div className="space-y-3 pt-2 text-xs">
                          {/* REGISTERED */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase">REGISTERED</span>
                            <div className="flex items-center gap-2">
                              {isRegisteredToday && (
                                <span className="font-serif font-black text-slate-900 text-xs">ToDay</span>
                              )}
                              <span className="font-bold text-slate-800">{regDate}</span>
                            </div>
                          </div>

                          {/* USAGE TIME */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase">USAGE TIME</span>
                            <span className="font-black text-blue-600 tracking-wider uppercase">{usageTime}</span>
                          </div>

                          {/* VISIT COUNT */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase">VISIT COUNT</span>
                            <span className="font-black text-amber-600 tracking-wider">{visitCount}</span>
                          </div>

                          {/* STATUS */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase">STATUS</span>
                            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-full font-mono text-[9px] font-bold">
                              {statusBadge}
                            </span>
                          </div>

                          {/* ACCESS LEVEL */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase">ACCESS LEVEL</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[10px] uppercase">
                              {userRole}
                            </span>
                          </div>

                          {/* Role Select Dropdown Box */}
                          <div className="relative pt-1">
                            <select
                              value={(u.role || "user").toLowerCase()}
                              onChange={(e) => handleAssignRole(u.id, (u.role || "user").toLowerCase(), e.target.value, fullName)}
                              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-4 py-3.5 text-xs font-black uppercase text-slate-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-wider"
                            >
                              <option value="user">USER</option>
                              <option value="moderator">MODERATOR</option>
                              <option value="editor">EDITOR</option>
                              <option value="admin">ADMIN</option>
                              <option value="super_admin">SUPER ADMIN</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 mt-0.5" size={17} />
                          </div>

                          {/* PROFILE VISIBILITY */}
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="font-black text-slate-900 text-[11px] block uppercase tracking-tight">PROFILE VISIBILITY</span>
                              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">VISIBLE TO PUBLIC</span>
                            </div>
                            <div className="w-11 h-6 bg-emerald-500 rounded-full p-1 flex items-center justify-end shadow-inner cursor-pointer">
                              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer: Location & VIEW FULL FILE button */}
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-400 text-[10px] tracking-wider uppercase">
                            LOCATION: {userLocation || "HYDERABAD, TELANGANA"}
                          </span>
                          <button
                            onClick={() => {
                              setExpandedUserIds(prev => ({ ...prev, [u.id]: !prev[u.id] }));
                            }}
                            className="font-black text-blue-600 hover:text-blue-700 tracking-wider text-[11px] uppercase transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {isExpanded ? "Hide Full File" : "View Full File"}
                          </button>
                        </div>

                        {/* Inline Expandable Full File Details Matching image_c3563b98.png */}
                        {isExpanded && (
                          <div className="pt-4 mt-3 border-t border-slate-100 space-y-3.5 animate-in fade-in duration-200">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">GENDER</span>
                                <span className="font-black text-slate-800 text-xs">{u.gender || "N/A"}</span>
                              </div>
                              <div>
                                <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">MOBILE</span>
                                <span className="font-black text-slate-800 text-xs">{u.mobile || u.phone || "N/A"}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">EMAIL</span>
                                <span className="font-black text-slate-800 text-xs truncate block uppercase" title={u.email}>{u.email || "N/A"}</span>
                              </div>
                              <div>
                                <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">STATE</span>
                                <span className="font-black text-slate-800 text-xs">{u.state ? u.state.toUpperCase() : "TELANGANA"}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">DISTRICT</span>
                                <span className="font-black text-slate-800 text-xs">{userDistrict.toUpperCase()}</span>
                              </div>
                              <div>
                                <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">MANDAL</span>
                                <span className="font-black text-slate-800 text-xs">{userMandal ? userMandal.toUpperCase() : "N/A"}</span>
                              </div>
                            </div>

                            <div className="text-xs">
                              <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">VILLAGE/TOWN</span>
                              <span className="font-black text-slate-800 text-xs">{u.village || u.town || "N/A"}</span>
                            </div>

                            <div className="text-xs">
                              <span className="font-black text-slate-400 text-[10px] tracking-wider uppercase block mb-1">OFFICE</span>
                              <span className="font-black text-slate-800 text-xs">{u.office || u.designation || "N/A"}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed User Modal Popup (Reference Card Style) */}
          {selectedUserForModal && (() => {
            const u = selectedUserForModal;
            const fullName = getUserFullName(u);
            const userRole = (u.role || "user").toLowerCase();
            const pin = userPins[u.id];
            const online = isUserOnline(u);
            const rawTime = u.createdAt || u.registeredAt || u.timestamp;
            let regDate = 'Information not available';
            if (rawTime) {
              try {
                const millis = typeof rawTime.toMillis === 'function' ? rawTime.toMillis() :
                               typeof rawTime.seconds === 'number' ? rawTime.seconds * 1000 :
                               Number(rawTime);
                if (!isNaN(millis) && millis > 0) {
                  regDate = new Date(millis).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                }
              } catch (e) {
                regDate = String(rawTime);
              }
            }

            return (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-[36px] border border-slate-200/80 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
                  <button
                    onClick={() => setSelectedUserForModal(null)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                      {u.photoURL || u.avatar ? (
                        <img
                          src={u.photoURL || u.avatar}
                          alt={fullName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="font-black text-base text-blue-700">
                          {getUserInitials(fullName)}
                        </span>
                      )}
                      {online && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="min-w-0 pr-8">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900 text-lg">{fullName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          userRole === "super_admin" ? "bg-purple-100 text-purple-800" :
                          userRole === "admin" ? "bg-rose-100 text-rose-800" :
                          userRole === "editor" ? "bg-emerald-100 text-emerald-800" :
                          userRole === "moderator" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                        }`}>
                          {userRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {u.designation ? `${u.designation} / ` : ""}{u.district || "Hyderabad"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          📞 Contact Information
                        </span>
                        <p className="font-bold text-slate-900">
                          {u.mobile || u.phone || "No Phone Number"}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          ✉️ Email
                        </span>
                        <p className="font-bold text-slate-900 truncate" title={u.email}>
                          {u.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          📍 Location / District
                        </span>
                        <p className="font-bold text-slate-900">
                          {u.district ? `${u.district}, Telangana` : "Hyderabad"}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          🔑 Security PIN
                        </span>
                        <p className="font-mono font-bold text-slate-900">
                          {pin || "NOT CONFIGURED"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        🕒 Registered (As per Firebase record)
                      </span>
                      <p className="font-mono font-bold text-slate-800 text-sm">
                        {regDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Quick Role Change:</span>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 gap-1">
                      {[
                        { r: "user", label: "User" },
                        { r: "moderator", label: "Moderator" },
                        { r: "editor", label: "Editor" },
                        { r: "admin", label: "Admin" },
                        { r: "super_admin", label: "Super Admin" },
                      ].map(({ r, label }) => {
                        const isCurrent = (userRole === r) || (r === "user" && !["super_admin", "admin", "editor", "moderator"].includes(userRole));
                        return (
                          <button
                            key={r}
                            onClick={() => {
                              handleAssignRole(u.id, userRole, r, fullName);
                              setSelectedUserForModal({ ...u, role: r });
                            }}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-slate-600 hover:bg-white hover:text-slate-900"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedUserForModal(null)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: GLOBAL RBAC PERMISSIONS MATRIX */}
      {activeTab === "matrix" && (
        <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Lock size={22} />
                </span>
                RBAC Permissions Matrix
              </h3>
              <p className="text-slate-400 font-bold mt-1 text-xs uppercase tracking-widest pl-14">
                Configure module-level View, Edit, and Delete privileges for each role tier
              </p>
            </div>

            {/* Role Tier Selector Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 w-fit flex-wrap gap-1">
              {[
                { id: "super_admin", label: "Super Admin", color: "text-purple-600" },
                { id: "admin", label: "Admin", color: "text-rose-600" },
                { id: "editor", label: "Editor", color: "text-emerald-600" },
                { id: "moderator", label: "Moderator", color: "text-amber-600" },
                { id: "user", label: "User / Citizen", color: "text-slate-600" },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRbacRole(role.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    selectedRbacRole === role.id
                      ? "bg-white text-slate-900 shadow-sm scale-105"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {selectedRbacRole === "super_admin" && (
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-purple-900 text-xs font-medium flex items-center gap-3">
              <ShieldAlert size={18} className="text-purple-600 shrink-0" />
              <span><strong>Super Admin Tier:</strong> Full master root access across all tools, database backups, security logs, and role modifications is permanently active.</span>
            </div>
          )}

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-100">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-4 pl-6 text-left">Module / Feature Name</th>
                  <th className="py-4 text-center">VIEW</th>
                  <th className="py-4 text-center">EDIT</th>
                  <th className="py-4 text-center">DELETE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {Object.entries(MODULE_DEFINITIONS).map(([key, def]) => {
                  const currentPerm = rbacPermissions?.[selectedRbacRole]?.[key] || 
                                     DEFAULT_ROLE_PERMISSIONS[selectedRbacRole]?.[key] || 
                                     { view: false, edit: false, delete: false };

                  const isSuperAdmin = selectedRbacRole === "super_admin";

                  return (
                    <tr key={key} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-6 pr-4">
                        <p className="font-bold text-slate-900 text-xs leading-tight">
                          {def.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {def.desc}
                        </p>
                      </td>

                      {/* View Checkbox */}
                      <td className="py-4 text-center">
                        <input
                          type="checkbox"
                          disabled={isSuperAdmin}
                          checked={isSuperAdmin ? true : !!currentPerm.view}
                          onChange={(e) => {
                            const updated = { ...rbacPermissions };
                            if (!updated[selectedRbacRole]) updated[selectedRbacRole] = {};
                            if (!updated[selectedRbacRole][key]) updated[selectedRbacRole][key] = {};
                            updated[selectedRbacRole][key].view = e.target.checked;
                            if (!e.target.checked) {
                              updated[selectedRbacRole][key].edit = false;
                              updated[selectedRbacRole][key].delete = false;
                            }
                            setRbacPermissions(updated);
                          }}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                      </td>

                      {/* Edit Checkbox */}
                      <td className="py-4 text-center">
                        <input
                          type="checkbox"
                          disabled={isSuperAdmin || !currentPerm.view}
                          checked={isSuperAdmin ? true : !!currentPerm.edit}
                          onChange={(e) => {
                            const updated = { ...rbacPermissions };
                            if (!updated[selectedRbacRole]) updated[selectedRbacRole] = {};
                            if (!updated[selectedRbacRole][key]) updated[selectedRbacRole][key] = {};
                            updated[selectedRbacRole][key].edit = e.target.checked;
                            setRbacPermissions(updated);
                          }}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </td>

                      {/* Delete Checkbox */}
                      <td className="py-4 text-center">
                        <input
                          type="checkbox"
                          disabled={isSuperAdmin || !currentPerm.view}
                          checked={isSuperAdmin ? true : !!currentPerm.delete}
                          onChange={(e) => {
                            const updated = { ...rbacPermissions };
                            if (!updated[selectedRbacRole]) updated[selectedRbacRole] = {};
                            if (!updated[selectedRbacRole][key]) updated[selectedRbacRole][key] = {};
                            updated[selectedRbacRole][key].delete = e.target.checked;
                            setRbacPermissions(updated);
                          }}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Matrix Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={handleResetToDefaults}
              className="px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
            >
              Reset to Defaults
            </button>

            <button
              onClick={handleSaveRbacPermissions}
              disabled={isSaving}
              className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#0B3D91] text-white hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              <Save size={16} /> {isSaving ? "Saving..." : "Save & Apply Permissions Matrix"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
