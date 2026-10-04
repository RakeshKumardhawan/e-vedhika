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
    created: "కొత్త పోస్ట్ సమర్పించబడింది (New Post Created)",
    updated: "పోస్ట్ అప్‌డేట్ చేయబడింది (Post Updated)",
    approved: "పోస్ట్ ఆమోదించబడింది (Post Approved & Published)",
    rejected: "పోస్ట్ తిరస్కరించబడింది (Post Rejected)",
    deleted: "పోస్ట్ తొలగించబడింది (Post Deleted)"
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
    `📌 <b>శీర్షిక (Title):</b> ${escapeHtml(data.postTitle)}\n` +
    `👤 <b>రచయిత (Author):</b> ${escapeHtml(data.author || "User")}\n` +
    (data.category ? `📂 <b>వర్గం (Category):</b> ${escapeHtml(data.category)}\n` : "") +
    (data.status ? `📊 <b>స్టేటస్ (Status):</b> <code>${data.status}</code>\n` : "") +
    (data.postId ? `🆔 <b>Post ID:</b> <code>${data.postId}</code>\n` : "") +
    `🕒 <b>సమయం:</b> ${new Date().toLocaleDateString("te-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `🔗 <a href="${data.url || "https://www.e-vedhika.in"}">e-Vedhika వెబ్‌సైట్‌లో చూడండి</a>`;

  return sendTelegramAlert({
    category: "post",
    action: data.action,
    title: heading,
    details: html
  });
}

/**
 * 2. యూజర్ అకౌంట్ & ప్రొఫైల్ అప్‌డేట్ నోటిఫికేషన్ (User Profile & Account Updates)
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
    registered: { label: "కొత్త యూజర్ నమోదు (New User Registered)", emoji: "🎉" },
    profile_updated: { label: "యూజర్ ప్రొఫైల్ అప్‌డేట్ (Profile Updated)", emoji: "👤" },
    role_changed: { label: "యూజర్ రోల్ మార్పు (User Role Changed)", emoji: "🛡️" },
    suspended: { label: "యూజర్ ఖాతా నిలిపివేత (User Suspended)", emoji: "🚨" },
    restored: { label: "యూజర్ ఖాతా పునరుద్ధరణ (User Restored)", emoji: "✅" }
  };

  const info = actionMap[data.action] || { label: "యూజర్ అప్‌డేట్ (User Update)", emoji: "👤" };
  const u = data.user;
  const fullName = [u.surname, u.name].filter(Boolean).join(" ") || u.email || "User";
  const location = [u.village, u.mandal, u.district].filter(Boolean).join(", ");

  const html =
    `${info.emoji} <b>[E-VEDHIKA] ${info.label}</b>\n\n` +
    `👤 <b>పేరు (Name):</b> <b>${escapeHtml(fullName)}</b>\n` +
    (u.designation ? `💼 <b>హోదా (Designation):</b> ${escapeHtml(u.designation)}\n` : "") +
    (u.email ? `✉️ <b>ఈమెయిల్ (Email):</b> ${escapeHtml(u.email)}\n` : "") +
    (u.mobile ? `📞 <b>మొబైల్ (Mobile):</b> <code>${escapeHtml(u.mobile)}</code>\n` : "") +
    (location ? `📍 <b>స్థానం (Location):</b> ${escapeHtml(location)}\n` : "") +
    (u.role ? `🛡️ <b>రోల్ (Role):</b> <code>${escapeHtml(u.role)}</code>\n` : "") +
    (data.changes ? `📝 <b>వివరాలు:</b> ${escapeHtml(data.changes)}\n` : "") +
    `🕒 <b>సమయం:</b> ${new Date().toLocaleDateString("te-IN")} ${new Date().toLocaleTimeString()}`;

  return sendTelegramAlert({
    category: "user",
    action: data.action,
    title: info.label,
    details: html
  });
}

/**
 * 3. UBD టూల్ అప్‌డేట్ నోటిఫికేషన్ (UBD Tool Activities & Updates)
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
    master_data_uploaded: { label: "UBD మాస్టర్ డేటా అప్‌డేట్ (Master Data Uploaded)", emoji: "🏛️" },
    office_searched: { label: "UBD ఆఫీస్ కోడ్ శోధన (Office Code Search)", emoji: "🔍" },
    certificate_generated: { label: "UBD సర్టిఫికేట్ జనరేషన్ (Certificate Downloaded)", emoji: "📄" },
    live_telemetry: { label: "UBD లైవ్ డయాగ్నస్టిక్ రికార్డ్ (Live Telemetry Log)", emoji: "🖥️" },
    portal_check: { label: "UBD పోర్టల్ స్టేటస్ చెక్ (Portal Status)", emoji: "🌐" },
    note_saved: { label: "UBD నోట్స్ అప్‌డేట్ (UBD Note Saved)", emoji: "📝" }
  };

  const info = actionMap[data.action] || { label: "UBD టూల్ అప్‌డేట్ (UBD Tool Update)", emoji: "🏛️" };
  const loc = [data.gpName, data.mandal, data.district].filter(Boolean).join(", ");
  const regLabel = data.registerType === "BIR" ? "జనన నమోదు (Birth Registration)" : data.registerType === "DEA" ? "మరణ నమోదు (Death Registration)" : "";

  const html =
    `${info.emoji} <b>[E-VEDHIKA] ${info.label}</b>\n\n` +
    (data.officeCode ? `🏢 <b>Office ID / కోడ్:</b> <code>${escapeHtml(data.officeCode)}</code>\n` : "") +
    (loc ? `📍 <b>గ్రామ పంచాయతీ:</b> <b>${escapeHtml(loc)}</b>\n` : "") +
    (regLabel ? `📋 <b>రిజిస్టర్ రకం:</b> ${regLabel}\n` : "") +
    (data.count ? `📊 <b>రికార్డుల సంఖ్య:</b> <b>${data.count}</b>\n` : "") +
    (data.details ? `📝 <b>వివరాలు:</b> ${escapeHtml(data.details)}\n` : "") +
    (data.user?.email || data.user?.displayName ? `👤 <b>ఆపరేటర్ / యూజర్:</b> ${escapeHtml(data.user?.displayName || data.user?.email)}\n` : "") +
    `🕒 <b>సమయం:</b> ${new Date().toLocaleDateString("te-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `🔗 <a href="https://www.e-vedhika.in/?tab=ubd_tracker">UBD Tool లైవ్ ట్రాకర్‌లో చూడండి</a>`;

  return sendTelegramAlert({
    category: "ubd",
    action: data.action,
    title: info.label,
    details: html
  });
}

/**
 * 4. వెబ్‌సైట్ & సిస్టమ్ కంటెంట్ అప్‌డేట్ నోటిఫికేషన్ (Website & CMS Content Updates)
 */
export async function notifyWebsiteUpdate(data: {
  section: string;
  title: string;
  updatedBy?: string;
  details?: string;
}) {
  const html =
    `🌐 <b>[E-VEDHIKA] వెబ్‌సైట్ కంటెంట్ అప్‌డేట్ (Website Update)</b>\n\n` +
    `📁 <b>విభాగం (Section):</b> <b>${escapeHtml(data.section)}</b>\n` +
    `📝 <b>అప్‌డేట్ పేరు:</b> ${escapeHtml(data.title)}\n` +
    (data.updatedBy ? `👤 <b>అప్‌డేట్ చేసినవారు:</b> ${escapeHtml(data.updatedBy)}\n` : "") +
    (data.details ? `📌 <b>వివరాలు:</b> ${escapeHtml(data.details)}\n` : "") +
    `🕒 <b>సమయం:</b> ${new Date().toLocaleDateString("te-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `🔗 <a href="https://www.e-vedhika.in">e-Vedhika వెబ్‌సైట్ చూడండి</a>`;

  return sendTelegramAlert({
    category: "website",
    title: "వెబ్‌సైట్ కంటెంట్ అప్‌డేట్",
    details: html
  });
}

/**
 * 5. అత్యవసర అలర్ట్ / బ్రాడ్‌కాస్ట్ (Emergency Broadcast Notification)
 */
export async function notifyEmergencyBroadcast(data: {
  message: string;
  adminName?: string;
}) {
  const html =
    `🚨 <b>[E-VEDHIKA] అత్యవసర హెచ్చరిక / బ్రాడ్‌కాస్ట్ (Emergency Broadcast)</b>\n\n` +
    `📢 <b>సందేశం (Broadcast Alert):</b>\n<i>"${escapeHtml(data.message)}"</i>\n\n` +
    (data.adminName ? `👤 <b>జారీ చేసినవారు:</b> ${escapeHtml(data.adminName)}\n` : "") +
    `🕒 <b>సమయం:</b> ${new Date().toLocaleDateString("te-IN")} ${new Date().toLocaleTimeString()}\n\n` +
    `⚠️ ఈ అలర్ట్ పోర్టల్‌లో ఉన్న అందరు పంచాయతీ కార్యదర్శులకు లైవ్‌గా ప్రదర్శించబడుతుంది.`;

  return sendTelegramAlert({
    category: "system",
    action: "emergency_broadcast",
    title: "అత్యవసర హెచ్చరిక (Emergency Broadcast)",
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
