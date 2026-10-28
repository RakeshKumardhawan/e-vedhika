/**
 * Telegram Notification Service for E-Vedhika
 * Ensures 100% real-time notifications for:
 * 1. Post updates (created, updated, approved, rejected, deleted)
 * 2. User updates (new registration, profile edited, role updated)
 * 3. UBD Tool updates (master data sync, office search, certificate generated, live telemetry)
 * 4. Website & system updates (emergency broadcasts, CMS, suggestions, support tickets)
 */

export interface TelegramNotificationPayload {
  category: "post" | "user" | "ubd" | "website" | "system" | "support";
  action?: string;
  title: string;
  details?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    uid?: string;
    location?: string;
  };
  meta?: Record<string, any>;
  link?: string;
}

export async function sendTelegramAlert(
  payloadOrMessage: string | TelegramNotificationPayload
): Promise<boolean> {
  try {
    const body =
      typeof payloadOrMessage === "string"
        ? { message: payloadOrMessage, type: "system" }
        : payloadOrMessage;

    const res = await fetch("/api/telegram/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("[TELEGRAM SERVICE] Non-OK response:", err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[TELEGRAM SERVICE EXCEPTION]:", error);
    return false;
  }
}

/**
 * 1. పోస్ట్ అప్‌డేట్ నోటిఫికేషన్ (Post Updates)
 */
export async function notifyPostUpdate(data: {
  action: "created" | "updated" | "approved" | "rejected" | "deleted";
  postTitle: string;
  author?: string;
  category?: string;
  postId?: string;
  status?: string;
  url?: string;
}) {
  const actionTelugu: Record<string, string> = {
    created: "New Post Created",
    updated: "Post Updated",
    approved: "Post Approved & Published",
    rejected: "Post Rejected",
    deleted: "Post Deleted"
  };

  const actionEmoji: Record<string, string> = {
    created: "📝",
    updated: "✏️",
    approved: "✅",
    rejected: "❌",
    deleted: "🗑️"
  };

  const emoji = actionEmoji[data.action] || "📢";
  const heading = actionTelugu[data.action] || data.action;

  const html =
    `${emoji} <b>[E-VEDHIKA] ${heading}</b>\n\n` +
    `📌 <b>Title:</b> ${escapeHtml(data.postTitle)}\n` +
    `👤 <b>Author:</b> ${escapeHtml(data.author || "User")}\n` +
    (data.category ? `📂 <b>Category:</b> ${escapeHtml(data.category)}\n` : "") +
    (data.status ? `📊 <b>Status:</b> <code>${data.status}</code>\n` : "") +
    (data.postId ? `🆔 <b>Post ID:</b> <code>${data.postId}</code>\n` : "") +
    `🕒 <b>Time:</b> ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `🔗 <a href="${data.url || "https://www.e-vedhika.in"}">View on e-Vedhika Website</a>`;

  return sendTelegramAlert({
    category: "post",
    action: data.action,
    title: heading,
    details: html
  });
}

/**
 * 2. User Profile & Account Update Notification
 */
export async function notifyUserProfileUpdate(data: {
  action: "registered" | "profile_updated" | "role_changed" | "suspended" | "restored";
  user: {
    name?: string;
    surname?: string;
    username?: string;
    email?: string;
    mobile?: string;
    district?: string;
    mandal?: string;
    village?: string;
    designation?: string;
    role?: string;
    uid?: string;
    [key: string]: any;
  };
  changes?: string;
}) {
  const actionMap: Record<string, { label: string; emoji: string }> = {
    registered: { label: "New User Registered", emoji: "🎉" },
    profile_updated: { label: "User Profile Updated", emoji: "👤" },
    role_changed: { label: "User Role Changed", emoji: "🛡️" },
    suspended: { label: "User Account Suspended", emoji: "🚨" },
    restored: { label: "User Account Restored", emoji: "✅" }
  };

  const info = actionMap[data.action] || { label: "User Update", emoji: "👤" };
  const u = data.user;
  const fullName = [u.surname, u.name].filter(Boolean).join(" ") || u.email || "User";
  const location = [u.village, u.mandal, u.district].filter(Boolean).join(", ");

  const html =
    `${info.emoji} <b>[E-VEDHIKA] ${info.label}</b>\n\n` +
    `👤 <b>Name:</b> <b>${escapeHtml(fullName)}</b>\n` +
    (u.username ? `🏷️ <b>Username:</b> <code>@${escapeHtml(u.username)}</code>\n` : "") +
    (u.designation ? `💼 <b>Designation:</b> ${escapeHtml(u.designation)}\n` : "") +
    (u.email ? `✉️ <b>Email:</b> ${escapeHtml(u.email)}\n` : "") +
    (u.mobile ? `📞 <b>Mobile:</b> <code>${escapeHtml(u.mobile)}</code>\n` : "") +
    (location ? `📍 <b>Location:</b> ${escapeHtml(location)}\n` : "") +
    (u.role ? `🛡️ <b>Role:</b> <code>${escapeHtml(u.role)}</code>\n` : "") +
    (data.changes ? `📝 <b>Details:</b> ${escapeHtml(data.changes)}\n` : "") +
    `🕒 <b>Time:</b> ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString()}`;

  return sendTelegramAlert({
    category: "user",
    action: data.action,
    title: info.label,
    details: html
  });
}

/**
 * 3. UBD Tool Update Notification (Activities & Updates)
 */
export async function notifyUbdUpdate(data: {
  action: "master_data_uploaded" | "office_searched" | "certificate_generated" | "live_telemetry" | "portal_check" | "note_saved";
  details?: string;
  user?: any;
  officeCode?: string;
  gpName?: string;
  mandal?: string;
  district?: string;
  registerType?: "BIR" | "DEA";
  count?: number;
}) {
  const actionMap: Record<string, { label: string; emoji: string }> = {
    master_data_uploaded: { label: "UBD Master Data Uploaded", emoji: "🏛️" },
    office_searched: { label: "UBD Office Code Search", emoji: "🔍" },
    certificate_generated: { label: "UBD Certificate Downloaded", emoji: "📄" },
    live_telemetry: { label: "UBD Live Telemetry Log", emoji: "🖥️" },
    portal_check: { label: "UBD Portal Status Check", emoji: "🌐" },
    note_saved: { label: "UBD Note Saved", emoji: "📝" }
  };

  const info = actionMap[data.action] || { label: "UBD Tool Update", emoji: "🏛️" };
  const loc = [data.gpName, data.mandal, data.district].filter(Boolean).join(", ");
  const regLabel = data.registerType === "BIR" ? "Birth Registration" : data.registerType === "DEA" ? "Death Registration" : "";

  const html =
    `${info.emoji} <b>[E-VEDHIKA] ${info.label}</b>\n\n` +
    (data.officeCode ? `🏢 <b>Office ID / Code:</b> <code>${escapeHtml(data.officeCode)}</code>\n` : "") +
    (loc ? `📍 <b>Gram Panchayat:</b> <b>${escapeHtml(loc)}</b>\n` : "") +
    (regLabel ? `📋 <b>Register Type:</b> ${regLabel}\n` : "") +
    (data.count ? `📊 <b>Number of Records:</b> <b>${data.count}</b>\n` : "") +
    (data.details ? `📝 <b>Details:</b> ${escapeHtml(data.details)}\n` : "") +
    (data.user?.email || data.user?.displayName ? `👤 <b>Operator / User:</b> ${escapeHtml(data.user?.displayName || data.user?.email)}\n` : "") +
    `🕒 <b>Time:</b> ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `🔗 <a href="https://www.e-vedhika.in/?tab=ubd_tracker">View on UBD Tool Live Tracker</a>`;

  return sendTelegramAlert({
    category: "ubd",
    action: data.action,
    title: info.label,
    details: html
  });
}

/**
 * 4. Website & System Content Update Notification
 */
export async function notifyWebsiteUpdate(data: {
  section: string;
  title: string;
  updatedBy?: string;
  details?: string;
}) {
  const html =
    `🌐 <b>[E-VEDHIKA] Website Content Update</b>\n\n` +
    `📁 <b>Section:</b> <b>${escapeHtml(data.section)}</b>\n` +
    `📝 <b>Update Name:</b> ${escapeHtml(data.title)}\n` +
    (data.updatedBy ? `👤 <b>Updated By:</b> ${escapeHtml(data.updatedBy)}\n` : "") +
    (data.details ? `📌 <b>Details:</b> ${escapeHtml(data.details)}\n` : "") +
    `🕒 <b>Time:</b> ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `🔗 <a href="https://www.e-vedhika.in">Visit e-Vedhika Website</a>`;

  return sendTelegramAlert({
    category: "website",
    title: "Website Content Update",
    details: html
  });
}

/**
 * 5. Emergency Broadcast Notification
 */
export async function notifyEmergencyBroadcast(data: {
  message: string;
  adminName?: string;
}) {
  const html =
    `🚨 <b>[E-VEDHIKA] Emergency Alert / Broadcast</b>\n\n` +
    `📢 <b>Message (Broadcast Alert):</b>\n<i>"${escapeHtml(data.message)}"</i>\n\n` +
    (data.adminName ? `👤 <b>Issued By:</b> ${escapeHtml(data.adminName)}\n` : "") +
    `🕒 <b>Time:</b> ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `⚠️ This alert is displayed live to all Panchayat and Mandal operators on the portal.`;

  return sendTelegramAlert({
    category: "system",
    action: "emergency_broadcast",
    title: "Emergency Alert (Broadcast)",
    details: html
  });
}

/**
 * Helper to escape HTML characters for safe Telegram parse_mode
 */
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
