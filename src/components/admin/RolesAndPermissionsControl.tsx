import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, ShieldCheck, Lock, UserCheck, Key, RefreshCw, 
  Search, CheckCircle2, Save, User, ShieldAlert, Check, X, Filter, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';

interface RolesAndPermissionsControlProps {
  currentUser?: any;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
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

const MODULE_DEFINITIONS: Record<string, { name: string; telugu: string; desc: string }> = {
  dash: { name: "Analytics Hub", telugu: "అనలిటిక్స్ హబ్", desc: "ముఖ్యమైన గణాంకాలు & గ్రాఫ్‌ల వీక్షణ" },
  reports: { name: "Posts & Issues", telugu: "సమస్యలు & పోస్టులు", desc: "పౌరుల సమస్యల పరిష్కారం, మరియు పోస్టుల అనుమతి" },
  moderation: { name: "Pending Submissions", telugu: "మోడరేషన్ క్యూ", desc: "పెండింగ్ పోస్ట్‌ల సమీక్ష మరియు ఆమోదం" },
  gos_formats: { name: "GOs & Formats", telugu: "జీవోలు & ఫార్మాట్లు", desc: "సర్కారు జీవోలు, దరఖాస్తు ఫార్మాట్ల నియంత్రణ" },
  updates: { name: "Flash News", telugu: "ఫ్లాష్ న్యూస్ & నోటీసులు", desc: "ముఖ్యమైన ప్రకటనలు, స్క్రోలింగ్ తాజా వార్తలు" },
  users: { name: "User Access", telugu: "యూజర్ల అడ్మిన్", desc: "యూజర్ల వివరాలు మరియు డైరెక్టరీ నిర్వహణ" },
  roles: { name: "Roles & Permissions", telugu: "రోల్స్ & అనుమతులు", desc: "సిబ్బంది రోల్స్ & RBAC అనుమతుల నియంత్రణ" },
  cms: { name: "Content CMS", telugu: "విజువల్ CMS", desc: "కంటెంట్ ఎడిటర్ మరియు పబ్లికేషన్స్" },
  builder: { name: "Page Builder", telugu: "పేజ్ బిల్డర్", desc: "వెబ్‌సైట్ లేఅవుట్ మరియు సెక్షన్ల మార్పులు" },
  locations: { name: "Manage Locations", telugu: "లొకేషన్లు", desc: "జిల్లాలు, మండలాలు, గ్రామాల జాబితా నిర్వహణ" },
  support: { name: "Support Center", telugu: "సపోర్ట్ సిస్టమ్", desc: "పౌరుల సపోర్ట్ టికెట్లు & సహాయ సంభాషణలు" },
  admin_inbox: { name: "Admin Inbox", telugu: "అడ్మిన్ ఇన్‌బాక్స్", desc: "యూజర్ల డైరెక్ట్ సందేశాల రిసీవింగ్" },
  chat_mgmt: { name: "User Chat Mgmt", telugu: "చాట్ మేనేజ్‌మెంట్", desc: "యూజర్ చాట్ లాగ్స్ & కమ్యూనికేషన్ మానిటరింగ్" },
  suggestions: { name: "Suggestions & Feedback", telugu: "సలహాలు & ఫీడ్‌బ్యాక్", desc: "పౌరుల సలహాల స్వీకరణ మరియు పరిష్కారాలు" },
  trash: { name: "Recycle Bin", telugu: "రీసైకిల్ బిన్", desc: "తొలగించిన రికార్డుల వీక్షణ మరియు పునరుద్ధరణ" },
  logs: { name: "Security Logs", telugu: "సెక్యూరిటీ లాగ్స్", desc: "అడ్మిన్ లాగిన్, ఎడిట్ & యాక్టివిటీ లాగ్స్" },
  db_backup: { name: "Database Backups", telugu: "డేటాబేస్ బ్యాకప్", desc: "డేటా ఎక్స్‌పోర్ట్, బ్యాకప్ & రికవరీ" },
  settings: { name: "System Config", telugu: "సిస్టమ్ సెట్టింగ్స్", desc: "సిస్టమ్ పిన్స్, పోర్టల్ కాన్ఫిగరేషన్" },
  ai: { name: "Gemini AI Node", telugu: "జెమినీ AI అసిస్టెంట్", desc: "AI ఆటోమేషన్ & స్మార్ట్ అసిస్టెంట్" },
};

export function RolesAndPermissionsControl({ currentUser, addToast }: RolesAndPermissionsControlProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [userPins, setUserPins] = useState<Record<string, string>>({});
  const [rbacPermissions, setRbacPermissions] = useState<Record<string, any>>(DEFAULT_ROLE_PERMISSIONS);
  const [selectedRbacRole, setSelectedRbacRole] = useState<string>("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"users_roles" | "matrix">("users_roles");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <p><strong>User ID:</strong> <code class="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">${userItem.id}</code></p>
          <p class="mt-1">Current PIN: <strong>${existingPin || 'NOT CONFIGURED'}</strong></p>
        </div>
      `,
      input: "text",
      inputLabel: "Enter New 4-Digit Security PIN (4 అంకెల పిన్ నమోదు చేయండి)",
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

    if (roleFilter === "all") return true;
    if (roleFilter === "super_admin") return role === "super_admin" || role === "superadmin";
    if (roleFilter === "admin") return role === "admin";
    if (roleFilter === "editor") return role === "editor";
    if (roleFilter === "moderator") return role === "moderator";
    if (roleFilter === "user") return role === "user" || role === "citizen" || !role;
    if (roleFilter === "staff") return ["super_admin", "admin", "editor", "moderator"].includes(role);
    return true;
  });

  const staffCount = users.filter(u => ["super_admin", "admin", "editor", "moderator"].includes((u.role || "").toLowerCase())).length;

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

            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Users", count: users.length },
                { id: "staff", label: "All Staff", count: staffCount },
                { id: "super_admin", label: "Super Admin", count: users.filter(u => (u.role || '').toLowerCase() === 'super_admin').length },
                { id: "admin", label: "Admin", count: users.filter(u => (u.role || '').toLowerCase() === 'admin').length },
                { id: "editor", label: "Editor", count: users.filter(u => (u.role || '').toLowerCase() === 'editor').length },
                { id: "moderator", label: "Moderator", count: users.filter(u => (u.role || '').toLowerCase() === 'moderator').length },
                { id: "user", label: "User / Citizen", count: users.filter(u => !['super_admin', 'admin', 'editor', 'moderator'].includes((u.role || '').toLowerCase())).length },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setRoleFilter(rf.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    roleFilter === rf.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border border-slate-200/70 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {rf.label} ({rf.count})
                </button>
              ))}
            </div>
          </div>

          {/* User Role Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck size={16} className="text-blue-600" /> User Directory & Role Assignment
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time Firestore user profiles with direct role elevation & security credentials</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                Showing {filteredUsers.length} of {users.length} Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4 pl-6">User Details</th>
                    <th className="p-4">Contact / Location</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Security PIN</th>
                    <th className="p-4 text-right pr-6">Quick Role Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                        <RefreshCw className="animate-spin inline mr-2 text-blue-600" size={16} /> Loading user records from Firestore...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                        No users match the search criteria "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const fullName = getUserFullName(u);
                      const userRole = (u.role || "user").toLowerCase();
                      const pin = userPins[u.id];

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* 1. USER DETAILS: Actual Full Name + Avatar + User ID */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                                {u.photoURL || u.avatar ? (
                                  <img
                                    src={u.photoURL || u.avatar}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      // Fallback on image error
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="font-black text-xs text-blue-700">
                                    {getUserInitials(fullName)}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-900 text-sm leading-tight truncate">
                                  {fullName}
                                </p>
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md truncate max-w-[200px]" title={u.id}>
                                    ID: {u.id}
                                  </span>
                                  {u.designation && (
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {u.designation}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. CONTACT / LOCATION */}
                          <td className="p-4 text-slate-600">
                            <p className="font-semibold text-xs text-slate-800 truncate">{u.email || "No email"}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {u.mobile || u.phone ? `📱 ${u.mobile || u.phone}` : "No phone"}
                              {u.district ? ` • ${u.district}` : ""}
                            </p>
                          </td>

                          {/* 3. ASSIGNED ROLE: Only the role badge & selector */}
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                userRole === "super_admin"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : userRole === "admin"
                                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                                  : userRole === "editor"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : userRole === "moderator"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <Shield size={11} />
                              {userRole === "super_admin"
                                ? "Super Admin"
                                : userRole === "admin"
                                ? "Admin"
                                : userRole === "editor"
                                ? "Editor"
                                : userRole === "moderator"
                                ? "Moderator"
                                : "Citizen / User"}
                            </span>
                          </td>

                          {/* 4. SECURITY PIN */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black ${
                                pin ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                              }`}>
                                {pin || "NOT SET"}
                              </span>
                              <button
                                onClick={() => handleResetPin(u)}
                                title="Reset / Set 4-Digit Security PIN"
                                className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                              >
                                <Key size={13} />
                              </button>
                            </div>
                          </td>

                          {/* 5. ACTIONS: Direct Role Selection */}
                          <td className="p-4 text-right pr-6">
                            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
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
                                    onClick={() => handleAssignRole(u.id, userRole, r, fullName)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                                      isCurrent
                                        ? "bg-slate-900 text-white shadow-xs"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-white/80"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
                కార్యాచరణ అనుమతుల నియంత్రణ (RBAC Permissions Matrix)
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
                  <th className="py-4 text-center">VIEW (చూడవచ్చు)</th>
                  <th className="py-4 text-center">EDIT (మార్చవచ్చు)</th>
                  <th className="py-4 text-center">DELETE (తొలగింపు)</th>
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
                          {def.name} <span className="text-slate-400 font-normal">({def.telugu})</span>
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
