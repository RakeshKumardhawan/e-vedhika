/**
 * Cloudflare Worker for E-Vedhika Portal
 * Purpose:
 * 1) Receive UBD Deployment Tool (C# .NET 4.8) telemetry.
 * 2) Persist records to Firebase Firestore.
 * 3) Serve live consolidated fleet summary JSON.
 * 4) [NEW] e-Panchayat Automation Proxy — Indian Edge IP → epanchayat.telangana.gov.in
 *    Routes: /api/epanchayat/captcha  /api/epanchayat/login  /api/epanchayat/verify-otp
 *            /api/epanchayat/session-status  /api/epanchayat/data/*
 */

// ─── MD5 (pure JS, needed for e-Panchayat password hashing) ─────────────────
function md5(inputStr) {
  function safeAdd(x, y) { const lsw = (x & 0xffff) + (y & 0xffff); const msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xffff); }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a,b,c,d,x,s,t){return md5cmn((b&c)|((~b)&d),a,b,x,s,t);}
  function md5gg(a,b,c,d,x,s,t){return md5cmn((b&d)|(c&(~d)),a,b,x,s,t);}
  function md5hh(a,b,c,d,x,s,t){return md5cmn(b^c^d,a,b,x,s,t);}
  function md5ii(a,b,c,d,x,s,t){return md5cmn(c^(b|(~d)),a,b,x,s,t);}
  const str = unescape(encodeURIComponent(inputStr));
  const bytes = Array.from({length: str.length}, (_, i) => str.charCodeAt(i));
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLen = (inputStr.length * 8);
  bytes.push(bitLen & 0xff,(bitLen>>8)&0xff,(bitLen>>16)&0xff,(bitLen>>24)&0xff,0,0,0,0);
  const M = [];
  for (let i = 0; i < bytes.length; i += 4) M.push(bytes[i]|(bytes[i+1]<<8)|(bytes[i+2]<<16)|(bytes[i+3]<<24));
  let [a,b,c,d] = [0x67452301,0xefcdab89,0x98badcfe,0x10325476];
  for (let i = 0; i < M.length; i += 16) {
    const [oA,oB,oC,oD] = [a,b,c,d];
    const m = M.slice(i, i+16);
    a=md5ff(a,b,c,d,m[0],7,-680876936);d=md5ff(d,a,b,c,m[1],12,-389564586);c=md5ff(c,d,a,b,m[2],17,606105819);b=md5ff(b,c,d,a,m[3],22,-1044525330);
    a=md5ff(a,b,c,d,m[4],7,-176418897);d=md5ff(d,a,b,c,m[5],12,1200080426);c=md5ff(c,d,a,b,m[6],17,-1473231341);b=md5ff(b,c,d,a,m[7],22,-45705983);
    a=md5ff(a,b,c,d,m[8],7,1770035416);d=md5ff(d,a,b,c,m[9],12,-1958414417);c=md5ff(c,d,a,b,m[10],17,-42063);b=md5ff(b,c,d,a,m[11],22,-1990404162);
    a=md5ff(a,b,c,d,m[12],7,1804603682);d=md5ff(d,a,b,c,m[13],12,-40341101);c=md5ff(c,d,a,b,m[14],17,-1502002290);b=md5ff(b,c,d,a,m[15],22,1236535329);
    a=md5gg(a,b,c,d,m[1],5,-165796510);d=md5gg(d,a,b,c,m[6],9,-1069501632);c=md5gg(c,d,a,b,m[11],14,643717713);b=md5gg(b,c,d,a,m[0],20,-373897302);
    a=md5gg(a,b,c,d,m[5],5,-701558691);d=md5gg(d,a,b,c,m[10],9,38016083);c=md5gg(c,d,a,b,m[15],14,-660478335);b=md5gg(b,c,d,a,m[4],20,-405537848);
    a=md5gg(a,b,c,d,m[9],5,568446438);d=md5gg(d,a,b,c,m[14],9,-1019803690);c=md5gg(c,d,a,b,m[3],14,-187363961);b=md5gg(b,c,d,a,m[8],20,1163531501);
    a=md5gg(a,b,c,d,m[13],5,-1444681467);d=md5gg(d,a,b,c,m[2],9,-51403784);c=md5gg(c,d,a,b,m[7],14,1735328473);b=md5gg(b,c,d,a,m[12],20,-1926607734);
    a=md5hh(a,b,c,d,m[5],4,-378558);d=md5hh(d,a,b,c,m[8],11,-2022574463);c=md5hh(c,d,a,b,m[11],16,1839030562);b=md5hh(b,c,d,a,m[14],23,-35309556);
    a=md5hh(a,b,c,d,m[1],4,-1530992060);d=md5hh(d,a,b,c,m[4],11,1272893353);c=md5hh(c,d,a,b,m[7],16,-155497632);b=md5hh(b,c,d,a,m[10],23,-1094730640);
    a=md5hh(a,b,c,d,m[13],4,681279174);d=md5hh(d,a,b,c,m[0],11,-358537222);c=md5hh(c,d,a,b,m[3],16,-722521979);b=md5hh(b,c,d,a,m[6],23,76029189);
    a=md5hh(a,b,c,d,m[9],4,-640364487);d=md5hh(d,a,b,c,m[12],11,-421815835);c=md5hh(c,d,a,b,m[15],16,530742520);b=md5hh(b,c,d,a,m[2],23,-995338651);
    a=md5ii(a,b,c,d,m[0],6,-198630844);d=md5ii(d,a,b,c,m[7],10,1126891415);c=md5ii(c,d,a,b,m[14],15,-1416354905);b=md5ii(b,c,d,a,m[5],21,-57434055);
    a=md5ii(a,b,c,d,m[12],6,1700485571);d=md5ii(d,a,b,c,m[3],10,-1894986606);c=md5ii(c,d,a,b,m[10],15,-1051523);b=md5ii(b,c,d,a,m[1],21,-2054922799);
    a=md5ii(a,b,c,d,m[8],6,1873313359);d=md5ii(d,a,b,c,m[15],10,-30611744);c=md5ii(c,d,a,b,m[6],15,-1560198380);b=md5ii(b,c,d,a,m[13],21,1309151649);
    a=md5ii(a,b,c,d,m[4],6,-145523070);d=md5ii(d,a,b,c,m[11],10,-1120210379);c=md5ii(c,d,a,b,m[2],15,718787259);b=md5ii(b,c,d,a,m[9],21,-343485551);
    a=safeAdd(a,oA);b=safeAdd(b,oB);c=safeAdd(c,oC);d=safeAdd(d,oD);
  }
  return [a,b,c,d].map(n=>[n&0xff,(n>>8)&0xff,(n>>16)&0xff,(n>>24)&0xff]).flat().map(b=>b.toString(16).padStart(2,'0')).join('');
}

// SHA-256 using Web Crypto (available in Cloudflare Workers)
async function sha256hex(str) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(str));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// e-Panchayat password hash: SHA256(SHA256(MD5(MD5(pwd))) + SALT)
async function hashEpanchayatPassword(plainPwd, salt) {
  const SALT = salt || '1D4FD6FED4247F26092DABE774AB6619';
  const md5Once = md5(plainPwd);
  const md5Twice = md5(md5Once);
  const sha1 = await sha256hex(md5Twice);
  return await sha256hex(sha1 + SALT);
}

// Cookie management helpers
function parseCookieHeader(setCookieStr) {
  if (!setCookieStr) return {};
  const result = {};
  const parts = setCookieStr.split(/,(?=[^;]+=[^;]*;? )/);
  for (const part of parts) {
    const [kv] = part.trim().split(';');
    const idx = kv.indexOf('=');
    if (idx > 0) result[kv.slice(0, idx).trim()] = kv.slice(idx + 1).trim();
  }
  return result;
}

function mergeCookies(existing, newHeader) {
  const map = {};
  if (existing) for (const pair of existing.split(';')) {
    const idx = pair.indexOf('='); if (idx > 0) map[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
  }
  const parsed = parseCookieHeader(newHeader || '');
  Object.assign(map, parsed);
  return Object.entries(map).map(([k, v]) => `${k}=${v}`).join('; ');
}

function cookieStringFromHeader(header) {
  if (!header) return '';
  return header.split(/,(?=[^ ])/).map(c => c.trim().split(';')[0]).join('; ');
}

// In-memory session store (Workers are stateless but survive short bursts)
// For production: use Cloudflare KV (bind as SESSIONS)
const epSessions = new Map();

const EP_BASE = 'https://epanchayat.telangana.gov.in';
const EP_HEADERS_BASE = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,te;q=0.8',
};

function encodeStatelessToken(obj) {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeStatelessToken(token) {
  if (!token || typeof token !== 'string' || token.length < 20) return null;
  try {
    let b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
  } catch {
    return null;
  }
}

// ─── e-Panchayat Automation Handler ─────────────────────────────────────────
async function handleEpanchayat(url, request, corsHeaders, env) {
  const path = url.pathname;

  // GET /api/epanchayat/captcha  → fetch captcha image + dynamic salt + return base64
  if (path === '/api/epanchayat/captcha' && request.method === 'GET') {
    try {
      // Step 1: load main page to get session cookie & dynamic salt
      const mainResp = await fetch(`${EP_BASE}/cs`, {
        headers: EP_HEADERS_BASE,
        redirect: 'follow'
      });
      let cookieStr = cookieStringFromHeader(mainResp.headers.get('set-cookie'));
      const mainHtml = await mainResp.text();
      const saltMatch = mainHtml.match(/SHA256_hash\(hash\)\s*\+\s*["']([A-Fa-f0-9]{16,64})["']/);
      const salt = saltMatch ? saltMatch[1] : '1D4FD6FED4247F26092DABE774AB6619';

      // Step 2: fetch captcha image
      const capResp = await fetch(`${EP_BASE}/CaptchaServlet?${Math.random()}`, {
        headers: { ...EP_HEADERS_BASE, 'Cookie': cookieStr, 'Referer': `${EP_BASE}/cs` }
      });
      cookieStr = mergeCookies(cookieStr, capResp.headers.get('set-cookie'));
      const imgBuf = await capResp.arrayBuffer();
      const bytes = new Uint8Array(imgBuf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = btoa(binary);
      const capSessionData = { cookie: cookieStr, salt, ts: Date.now() };
      const tempId = encodeStatelessToken(capSessionData);
      epSessions.set('cap_' + tempId, capSessionData);
      if (env && env.SESSIONS) {
        await env.SESSIONS.put('cap_' + tempId, JSON.stringify(capSessionData), { expirationTtl: 600 });
      }

      return Response.json({ tempId, captchaBase64: b64, mimeType: 'image/jpeg' }, { headers: corsHeaders });
    } catch (e) {
      return Response.json({ error: 'captcha_fetch_failed', detail: String(e) }, { status: 500, headers: corsHeaders });
    }
  }

  // POST /api/epanchayat/login  → { userId, password, tempId, captchaCode }
  if (path === '/api/epanchayat/login' && request.method === 'POST') {
    try {
      const { userId, password, tempId, captchaCode } = await request.json();
      if (!userId || !password || !captchaCode) {
        return Response.json({ success: false, error: 'User ID, Password మరియు Captcha అన్నీ అవసరం.', code: 'missing_fields' }, { status: 400, headers: corsHeaders });
      }

      let cookieStr = '';
      let salt = '1D4FD6FED4247F26092DABE774AB6619';
      let capSession = epSessions.get('cap_' + tempId) || decodeStatelessToken(tempId);
      if (!capSession && env && env.SESSIONS && tempId) {
        const kvCap = await env.SESSIONS.get('cap_' + tempId);
        if (kvCap) capSession = JSON.parse(kvCap);
      }
      if (capSession) {
        cookieStr = capSession.cookie;
        if (capSession.salt) salt = capSession.salt;
        epSessions.delete('cap_' + tempId);
      }

      const hashedPwd = await hashEpanchayatPassword(password, salt);
      const formBody = new URLSearchParams({ uname: userId, pwd: hashedPwd, cp: captchaCode });

      const loginResp = await fetch(`${EP_BASE}/login`, {
        method: 'POST',
        headers: {
          ...EP_HEADERS_BASE,
          'Cookie': cookieStr,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${EP_BASE}/cs`,
          'Origin': EP_BASE
        },
        body: formBody.toString(),
        redirect: 'manual'
      });

      cookieStr = mergeCookies(cookieStr, loginResp.headers.get('set-cookie'));
      const location = loginResp.headers.get('location') || '';
      let bodyText = await loginResp.text();

      if (location) {
        const nextUrl = location.startsWith('http') ? location : `${EP_BASE}${location.startsWith('/') ? '' : '/'}${location}`;
        const nextResp = await fetch(nextUrl, {
          headers: { ...EP_HEADERS_BASE, 'Cookie': cookieStr, 'Referer': `${EP_BASE}/cs` },
          redirect: 'follow'
        });
        cookieStr = mergeCookies(cookieStr, nextResp.headers.get('set-cookie'));
        bodyText = await nextResp.text();
      }

      const pvalsMatch = bodyText.match(/id=["']pvals["'][^>]*>([\s\S]*?)<\/p>/i);
      const pvalsText = pvalsMatch ? pvalsMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      // Check for captcha / credential error
      if (/invalid captcha/i.test(pvalsText) || /invalid captcha/i.test(bodyText)) {
        return Response.json({ success: false, error: 'Captcha తప్పుగా ఉంది. దయచేసి కొత్త Captcha ఎంటర్ చేయండి.', code: 'captcha_invalid', retry: true }, { status: 400, headers: corsHeaders });
      }
      if (/invalid credentials/i.test(pvalsText) || /invalid credentials|wrong password/i.test(bodyText)) {
        return Response.json({ success: false, error: 'User ID లేదా Password తప్పుగా ఉంది.', code: 'credentials_invalid' }, { status: 401, headers: corsHeaders });
      }

      // Extract masked mobile from #pvals or OTP message
      const mobileMatch = (pvalsText || bodyText).match(/(\*{4,}|x{4,}|X{4,})(\d{4})/i)
        || (pvalsText || bodyText).match(/registered mobile[^0-9]*(\d{10})/i)
        || (pvalsText || bodyText).match(/OTP[^0-9]*sent[^0-9]*(\d{10})/i);
      const maskedMobile = mobileMatch
        ? `xxxxxx${mobileMatch[2] || mobileMatch[1].slice(-4)}`
        : 'xxxxxx....';

      const sessionData = { cookie: cookieStr, userId, salt, ts: Date.now(), verified: false };
      const sessionId = encodeStatelessToken(sessionData);
      epSessions.set(sessionId, sessionData);
      if (env && env.SESSIONS) await env.SESSIONS.put(sessionId, JSON.stringify(sessionData), { expirationTtl: 3600 });

      return Response.json({
        success: true,
        sessionId,
        maskedMobile,
        mobile_number: maskedMobile,
        otp_message: pvalsText || undefined,
        otpSent: true
      }, { headers: corsHeaders });
    } catch (e) {
      return Response.json({ success: false, error: 'login_failed', detail: String(e) }, { status: 500, headers: corsHeaders });
    }
  }

  // POST /api/epanchayat/verify-otp  → { sessionId, otp }
  if (path === '/api/epanchayat/verify-otp' && request.method === 'POST') {
    try {
      const { sessionId, otp } = await request.json();
      let session = epSessions.get(sessionId) || decodeStatelessToken(sessionId);
      if (!session && env && env.SESSIONS) {
        const kv = await env.SESSIONS.get(sessionId);
        if (kv) session = JSON.parse(kv);
      }
      if (!session) return Response.json({ error: 'session_not_found' }, { status: 404, headers: corsHeaders });

      let cookieStr = session.cookie;

      // Submit OTP to /deptLoginVerified
      const otpFormBody = new URLSearchParams({ otp: String(otp), uname: session.userId });
      const otpResp = await fetch(`${EP_BASE}/deptLoginVerified`, {
        method: 'POST',
        headers: {
          ...EP_HEADERS_BASE,
          'Cookie': cookieStr,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${EP_BASE}/login`,
          'Origin': EP_BASE
        },
        body: otpFormBody.toString(),
        redirect: 'follow'
      });
      cookieStr = mergeCookies(cookieStr, otpResp.headers.get('set-cookie'));
      const dashBody = await otpResp.text();

      if (/invalid otp/i.test(dashBody)) {
        return Response.json({ success: false, error: 'చెల్లని OTP. దయచేసి సరైన 6-అంకెల OTP ఎంటర్ చేయండి.' }, { status: 400, headers: corsHeaders });
      }

      // Extract officer details from dashboard header
      const gpMatch = dashBody.match(/(?:GP|Gram Panchayat|Village Panchayat)[:\s]+([A-Za-z\s]+?)(?:<|\s{2,}|,)/i)
        || dashBody.match(/id="gpName"[^>]*>([^<]+)/i)
        || dashBody.match(/class="[^"]*gp[^"]*"[^>]*>([^<]+)/i);
      const mandalMatch = dashBody.match(/(?:Mandal)[:\s]+([A-Za-z\s]+?)(?:<|\s{2,}|,)/i)
        || dashBody.match(/id="mandalName"[^>]*>([^<]+)/i);
      const districtMatch = dashBody.match(/(?:District)[:\s]+([A-Za-z\s]+?)(?:<|\s{2,}|,)/i)
        || dashBody.match(/id="districtName"[^>]*>([^<]+)/i);
      const officeIdMatch = dashBody.match(/(?:Office ID|officeId)[:\s"]+([a-z]+\d+)/i);

      const userId = session.userId;
      const userLevel = /^mpo/i.test(userId) ? 'mandal' : /^dpo/i.test(userId) ? 'district' : 'gp';
      const officeId = officeIdMatch?.[1]?.trim() || userId;
      const gpName = gpMatch?.[1]?.trim() || userId.toUpperCase();
      const mandal = mandalMatch?.[1]?.trim() || 'Telangana';
      const district = districtMatch?.[1]?.trim() || 'Telangana';

      const result = {
        success: true,
        authenticated: true,
        officeId,
        user_id: officeId,
        gpName,
        gp_name: gpName,
        mandal,
        mandal_name: mandal,
        district,
        district_name: district,
        userLevel,
        user_level: userLevel,
        sessionId
      };

      // Update session
      const updated = { ...session, cookie: cookieStr, verified: true, ...result };
      epSessions.set(sessionId, updated);
      if (env && env.SESSIONS) await env.SESSIONS.put(sessionId, JSON.stringify(updated), { expirationTtl: 3600 });

      return Response.json(result, { headers: corsHeaders });
    } catch (e) {
      return Response.json({ error: 'otp_verify_failed', detail: String(e) }, { status: 500, headers: corsHeaders });
    }
  }

  // GET /api/epanchayat/session-status?sessionId=xxx
  if (path === '/api/epanchayat/session-status' && request.method === 'GET') {
    const sid = url.searchParams.get('sessionId');
    if (!sid) return Response.json({ active: false }, { headers: corsHeaders });
    let session = epSessions.get(sid);
    if (!session && env && env.SESSIONS) {
      const kv = await env.SESSIONS.get(sid);
      if (kv) session = JSON.parse(kv);
    }
    if (!session) return Response.json({ active: false }, { headers: corsHeaders });
    return Response.json({
      active: true,
      verified: session.verified || false,
      officeId: session.officeId || session.userId,
      gpName: session.gpName,
      mandal: session.mandal,
      district: session.district,
      userLevel: session.userLevel
    }, { headers: corsHeaders });
  }

  // GET /api/epanchayat/data/balance?sessionId=xxx  → GP Bank Balance
  if (path === '/api/epanchayat/data/balance' && request.method === 'GET') {
    const sid = url.searchParams.get('sessionId');
    let session = epSessions.get(sid);
    if (!session && env && env.SESSIONS) { const kv = await env.SESSIONS && env.SESSIONS.get(sid); if (kv) session = JSON.parse(kv); }
    if (!session || !session.verified) return Response.json({ error: 'not_authenticated' }, { status: 401, headers: corsHeaders });

    try {
      const balResp = await fetch(`${EP_BASE}/cs/bankbalance`, {
        headers: { ...EP_HEADERS_BASE, 'Cookie': session.cookie }
      });
      const html = await balResp.text();
      // Simple table row extraction
      const rows = [];
      const rowReg = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let m;
      while ((m = rowReg.exec(html)) !== null) {
        const cells = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(c => c[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim());
        if (cells.length >= 3) rows.push(cells);
      }
      return Response.json({ success: true, rows, source: 'epanchayat_live' }, { headers: corsHeaders });
    } catch (e) {
      return Response.json({ error: 'balance_fetch_failed', detail: String(e) }, { status: 500, headers: corsHeaders });
    }
  }

  return null; // Not an epanchayat route
}

const CACHE_TTL_SECONDS = 60;
const FIREBASE_PROJECT_ID = "e-vedhika-258f2";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

const ALLOWED_ORIGINS = [
  "https://www.e-vedhika.in",
  "https://e-vedhika.in",
  "https://rakeshkumardhawan.github.io",
  "https://e-vedhika.rakeshkumardhawan123.workers.dev",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

function parseUbdHtml(html, isDeath, officeCode) {
  const gpMatch = html.match(/Gram Panchayat:\s*(?:&nbsp;)?\s*([^<\r\n]+?)\s*as\s+on/i);
  const gpName = gpMatch ? gpMatch[1].replace(/&nbsp;/g, " ").trim() : `Gram Panchayat #${officeCode}`;

  const distMatch = html.match(/District:\s*([A-Za-z\s]+)/i);
  const district = distMatch ? distMatch[1].trim() : "TELANGANA";

  const rows = [];
  const rowRegex = /<tr style="border: 1px"\s*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rowHtml = match[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    const cells = [];
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      cells.push(tdMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim());
    }
    if (cells.length >= 8) {
      if (isDeath) {
        rows.push({
          sno: cells[0],
          regNo: cells[1],
          regYear: cells[2],
          regDate: cells[3],
          dod: cells[4],
          gender: cells[5],
          deceasedName: cells[6],
          relativeName: cells[7]
        });
      } else {
        rows.push({
          sno: cells[0],
          regNo: cells[1],
          regYear: cells[2],
          regDate: cells[3],
          dob: cells[4],
          gender: cells[5],
          childName: cells[6],
          motherName: cells[7],
          fatherName: cells[8] || ""
        });
      }
    }
  }

  return { gpName, district, records: rows, totalRecords: rows.length };
}

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".run.app") ||
    origin.endsWith(".github.io") ||
    origin.endsWith(".workers.dev");

  return {
    "Access-Control-Allow-Origin": isAllowed && origin ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Admin-Token, X-EVedhika-Client",
    "Access-Control-Max-Age": "86400",
    ...(isAllowed && origin ? { "Access-Control-Allow-Credentials": "true", Vary: "Origin" } : {})
  };
}

function decodeBase64Payload(rawB64) {
  if (typeof rawB64 !== "string") return null;
  const trimmed = rawB64.trim();
  if (!trimmed) return null;
  try {
    let normalized = trimmed.replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4 !== 0) normalized += "=";
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const decoded = new TextDecoder("utf-8").decode(bytes).trim();
    if (!decoded || (!decoded.startsWith("{") && !decoded.startsWith("["))) return null;
    const parsed = JSON.parse(decoded);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function extractIncomingTelemetryPayload(request, url) {
  const queryObj = {};
  url.searchParams.forEach((v, k) => {
    queryObj[k] = v;
  });

  let bodyObj = {};
  const method = request.method.toUpperCase();
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const contentType = (request.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      try {
        bodyObj = await request.json();
      } catch {
        bodyObj = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((v, k) => {
        bodyObj[k] = String(v);
      });
    } else {
      const rawText = await request.text();
      try {
        bodyObj = JSON.parse(rawText);
      } catch {
        const params = new URLSearchParams(rawText);
        params.forEach((v, k) => {
          bodyObj[k] = v;
        });
      }
    }
  }

  const merged = { ...queryObj, ...(bodyObj && typeof bodyObj === "object" ? bodyObj : {}) };
  const b64 = merged.payload_b64 || merged.payloadB64 || merged.data_b64 || merged.b64;
  const decodedB64 = decodeBase64Payload(b64);
  return decodedB64 ? { ...merged, ...decodedB64 } : merged;
}

function clampPct(val, fallback) {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function classifyHealth(scoreInput, statusInput) {
  const score = clampPct(scoreInput, 100);
  const st = String(statusInput || "").toUpperCase();
  if (score < 50 || st.includes("ERROR") || st.includes("CRITICAL") || st.includes("FAIL")) return "critical";
  if (score < 70 || st.includes("WARN")) return "warning";
  return "healthy";
}

function parseFirestoreDoc(doc) {
  const f = doc?.fields || {};
  const getVal = (k, def = "") => {
    const entry = f[k];
    if (!entry || typeof entry !== "object") return def;
    if (entry.stringValue !== undefined) return entry.stringValue;
    if (entry.integerValue !== undefined) return Number(entry.integerValue);
    if (entry.doubleValue !== undefined) return Number(entry.doubleValue);
    if (entry.booleanValue !== undefined) return entry.booleanValue;
    return def;
  };
  const docId = String(getVal("id") || getVal("eventId") || doc.name?.split("/").pop() || "");
  if (!docId || docId.startsWith("TEL-SEED") || docId.startsWith("SEED")) return null;

  const pcId = String(getVal("pcId") || getVal("machineId") || docId);
  const healthScore = clampPct(getVal("healthScore", 100), 100);
  const ramUsagePct = clampPct(getVal("ramUsagePct", 45), 45);
  const status = String(getVal("status") || "SUCCESS");
  const lastHeartbeatEpoch = Number(getVal("lastHeartbeatEpoch", 0)) || 0;
  const nowEpoch = Math.floor(Date.now() / 1000);
  const isOnline = lastHeartbeatEpoch > 0 && Math.abs(nowEpoch - lastHeartbeatEpoch) <= 180;

  return {
    id: docId,
    pcId,
    machineId: pcId,
    pcName: String(getVal("pcName") || "GP-OFFICE-PC"),
    userName: String(getVal("userName") || "Operator"),
    officeLocation: String(getVal("officeLocation") || "Grama Panchayat Office"),
    healthScore,
    healthSeverity: classifyHealth(healthScore, status),
    ramUsagePct,
    dscStatus: String(getVal("dscStatus") || "USB Token Active"),
    edgeIeMode: String(getVal("edgeIeMode") || getVal("edgePolicy") || "IE5 Quirks Active"),
    edgePolicy: String(getVal("edgePolicy") || getVal("edgeIeMode") || "IE5 Quirks Active"),
    status,
    overallStatus: isOnline ? "ONLINE" : String(getVal("overallStatus") || "OFFLINE"),
    isOnline,
    appVersion: String(getVal("appVersion") || "v1.0.9"),
    lastSeen: String(getVal("lastSeen") || "Synced"),
    lastHeartbeatEpoch
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const corsHeaders = getCorsHeaders(request);

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ─── e-Panchayat Automation (Indian Edge IP Proxy) ───────────────────────
    if (url.pathname.startsWith('/api/epanchayat/')) {
      const epResult = await handleEpanchayat(url, request, corsHeaders, env);
      if (epResult) return epResult;
    }

    // 0. LIVE UBDMIS DIRECT SEARCH & PARSER (Zero Sleep, 24/7 Edge Gateway)
    if (url.pathname === "/api/ubd/search" || url.pathname === "/api/ubd/live" || url.pathname === "/api/ubd") {
      try {
        let unitId = url.searchParams.get("unitId") || url.searchParams.get("officeCode") || "";
        let registerType = url.searchParams.get("type") || url.searchParams.get("section") || "BIR";

        if ((method === "POST" || method === "PUT") && !unitId) {
          try {
            const body = await request.json();
            unitId = body.unitId || body.officeCode || "";
            registerType = body.type || body.section || registerType;
          } catch (_) {}
        }

        unitId = String(unitId || "").trim();
        if (!unitId || !/^\d+$/.test(unitId)) {
          return new Response(JSON.stringify({ success: false, error: "Please enter a valid numeric Reg.Unit ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          });
        }

        const isDeath = registerType === "DEA" || registerType === "Death" || String(registerType).toLowerCase().includes("death");
        const targetUrl = isDeath
          ? `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDEA_Details.do?officeCode=${unitId}&status=A&rlb_type=3&pstcode=35&style=bluetheme`
          : `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDetails.do?officeCode=${unitId}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;

        const ubdResp = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
        });

        if (!ubdResp.ok) {
          return new Response(JSON.stringify({ success: false, error: `Official UBDMIS portal returned HTTP ${ubdResp.status}` }), {
            status: 502,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          });
        }

        const html = await ubdResp.text();
        const parsed = parseUbdHtml(html, isDeath, unitId);

        return new Response(JSON.stringify({
          success: true,
          unitId,
          gpName: parsed.gpName,
          district: parsed.district,
          registerType: isDeath ? "DEA" : "BIR",
          totalRecords: parsed.totalRecords,
          records: parsed.records,
          rawHtml: html,
          source: "official_telangana_ubdmis_live"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=120",
            ...corsHeaders
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message || "Failed to fetch from UBDMIS server" }), {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
        });
      }
    }

    const isReportingReceiver = url.pathname === "/api/reporting/receiver";
    const isTelemetryEndpoint =
      isReportingReceiver ||
      url.pathname === "/admin/ubd_monitoring" ||
      url.pathname === "/admin/ubd_monitoring/" ||
      url.pathname === "/admin/ubd_monitoring.php" ||
      url.pathname === "/api/telemetry" ||
      url.pathname === "/api/deployment-logs";

    const actionParam = (url.searchParams.get("action") || "").toLowerCase();

    // 1A. CLOUD PING CONNECTIVITY CHECK (Zero Firebase Load)
    if (isTelemetryEndpoint && actionParam === "ping") {
      return new Response(
        JSON.stringify({
          success: true,
          status: "INGEST_OK",
          message: "INGEST_OK",
          database: "firebase-firestore",
          edge: "cloudflare-worker",
          version: "v1.0.9",
          resourceBuild: "2026.11.12.R4",
          time: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
        }
      );
    }

    // 1B. UBD OTA VERSION CHECK AT EDGE (Zero Firebase Load)
    if (
      isTelemetryEndpoint &&
      (actionParam === "ota_check" || actionParam === "check_update" || actionParam === "version")
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          appName: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
          executableName: "EVedhika_Setup_v1.0.9.exe",
          currentVersion: "v1.0.9",
          latestVersion: "v1.0.9",
          latestResourceBuild: "2026.11.12.R4",
          resourceBuild: "2026.11.12.R4",
          manifestVersion: "2026.11.12.R4",
          versionCode: 10090,
          releaseDate: "2026-11-12",
          downloadSize: "8.5 MB",
          downloadUrl: "https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_v1.0.9.exe",
          githubRepo: "https://github.com/RakeshKumardhawan/UBDTOOLS",
          updateRequired: false,
          silent: false,
          sha256: "4d54ba00f532b15793a70e0d4c03ca03d81b1cc23f0e6a1fa0cba4860f0720c9",
          signatureStatus: "Verified (E-Vedhika Authenticode)",
          telemetryRelayUrl: "https://e-vedhika.rakeshkumardhawan123.workers.dev/api/reporting/receiver"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=60",
            ...corsHeaders
          }
        }
      );
    }

    // 1C. TELEMETRY INGEST (Raw JSON POST, Base64 URL-Encoded POST, Base64 GET Query)
    const hasIngestAttempt =
      isTelemetryEndpoint &&
      (method === "POST" ||
        url.searchParams.has("payload_b64") ||
        url.searchParams.has("pcId") ||
        url.searchParams.has("pcName") ||
        url.searchParams.has("PcName") ||
        actionParam === "ingest_report");

    if (hasIngestAttempt) {
      try {
        const data = await extractIncomingTelemetryPayload(request, url);
        const pcName = String(data.pcName || data.PcName || data.pc_name || data.computerName || data.machineName || "").trim();
        const machineId = String(data.pcId || data.PcId || data.pc_id || data.deviceInstallationId || data.machineId || "").trim();

        if (!pcName && !machineId) {
          return new Response(JSON.stringify({ success: false, message: "Invalid Payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          });
        }

        const resolvedPcId = machineId || pcName.toUpperCase().replace(/[^A-Z0-9_-]/g, "-");
        const resolvedPcName = pcName || resolvedPcId;
        const nowIso = new Date().toISOString();
        const istDate = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().replace("T", " ").substring(0, 19);
        const nowEpoch = Math.floor(Date.now() / 1000);

        const healthScore = clampPct(data.healthScore ?? data.HealthScore ?? data.health_score, 100);
        const ramUsagePct = clampPct(data.ramUsagePct ?? data.RamUsagePct ?? data.ram_usage_pct, 45);
        const userName = String(data.userName || data.UserName || data.user_name || data.operatorName || "Operator").trim();
        const officeLocation = String(data.officeLocation || data.OfficeLocation || data.office_location || data.office || "Grama Panchayat Office").trim();
        const os = String(data.osVersion || data.os || "Windows 10/11 Pro").trim();
        const buildNumber = String(data.winBuild || data.buildNumber || "Build 22631").trim();
        const appVersion = String(data.appVersion || data.version || "v1.0.9").trim();
        const resourceBuild = String(data.resourceBuild || "2026.11.12.R4").trim();
        const reportType = String(data.reportType || data.eventType || "LIVE_MONITORING").trim();
        const status = String(data.status || data.Status || "SUCCESS").trim();
        const appState = String(data.appState || "RUNNING").toUpperCase().trim();
        const stepsVerified = String(data.verification || data.stepsVerified || "17/17 Passed").trim();
        const dscStatus = String(data.dscStatus || data.DscStatus || data.dsc_status || "USB Token Active").trim();
        const edgePolicy = String(data.edgeIeMode || data.EdgeIeMode || data.edge_ie_mode || data.edgePolicy || "IE5 Quirks Active").trim();
        const sitesXml = String(data.sitesXml || "Validated").trim();
        const details = String(data.details || data.remarks || data.summary || "Report synchronized from C# Desktop Application.").trim();
        const eventId = String(data.eventId || data.reportId || `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

        const docId = eventId.replace(/[^a-zA-Z0-9_-]/g, "_");
        const firestoreUrl = `${FIRESTORE_BASE_URL}/telemetryLogs/${docId}`;

        const firestorePayload = {
          fields: {
            id: { stringValue: docId },
            eventId: { stringValue: eventId },
            reportId: { stringValue: eventId },
            reportType: { stringValue: reportType },
            recordSource: { stringValue: "LIVE_RECEIVED" },
            pcId: { stringValue: resolvedPcId },
            machineId: { stringValue: resolvedPcId },
            pcName: { stringValue: resolvedPcName },
            userName: { stringValue: userName },
            officeLocation: { stringValue: officeLocation },
            os: { stringValue: os },
            osVersion: { stringValue: os },
            buildNumber: { stringValue: buildNumber },
            appVersion: { stringValue: appVersion },
            version: { stringValue: appVersion },
            resourceBuild: { stringValue: resourceBuild },
            status: { stringValue: status },
            overallStatus: { stringValue: "ONLINE" },
            appState: { stringValue: appState },
            healthScore: { integerValue: String(healthScore) },
            ramUsagePct: { integerValue: String(ramUsagePct) },
            stepsVerified: { stringValue: stepsVerified },
            verification: { stringValue: stepsVerified },
            dscStatus: { stringValue: dscStatus },
            edgeIeMode: { stringValue: edgePolicy },
            edgePolicy: { stringValue: edgePolicy },
            sitesXml: { stringValue: sitesXml },
            details: { stringValue: details },
            remarks: { stringValue: details },
            lastSeen: { stringValue: istDate },
            timestampIst: { stringValue: `${istDate} IST` },
            timestampUtc: { stringValue: nowIso },
            lastHeartbeatEpoch: { integerValue: String(nowEpoch) }
          }
        };

        const fsRes = await fetch(firestoreUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(firestorePayload)
        });

        if (!fsRes.ok) {
          const fsErrText = await fsRes.text();
          return new Response(
            JSON.stringify({ success: false, message: "Firestore write failed", detail: fsErrText }),
            { status: 502, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "INGEST_OK",
            database: "firebase-firestore",
            eventId,
            pcId: resolvedPcId,
            pcName: resolvedPcName,
            healthScore,
            resourceBuild
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            error: err && err.message ? err.message : "Failed to process telemetry ingest"
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          }
        );
      }
    }

    // 1D. LIVE FLEET SUMMARY READ FROM FIREBASE FIRESTORE (Edge-Cached 60s to prevent 429 Quota spikes)
    if (isReportingReceiver && method === "GET") {
      const cache = caches.default;
      const cacheKey = new Request(`${url.origin}/api/reporting/receiver`, { method: "GET" });
      const cached = await cache.match(cacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
        return new Response(cached.body, { status: cached.status, headers });
      }

      try {
        const fsRes = await fetch(`${FIRESTORE_BASE_URL}/telemetryLogs?pageSize=60`);
        if (fsRes.status === 429) {
          return new Response(
            JSON.stringify({ success: false, code: 429, message: "Firestore daily read quota exceeded (429)" }),
            { status: 429, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders } }
          );
        }
        if (!fsRes.ok) throw new Error(`Firestore HTTP ${fsRes.status}`);
        const fsJson = await fsRes.json();
        const docs = Array.isArray(fsJson?.documents) ? fsJson.documents : [];
        const byPc = {};

        for (const doc of docs) {
          const parsed = parseFirestoreDoc(doc);
          if (!parsed) continue;
          const prev = byPc[parsed.pcId];
          if (!prev || Number(parsed.lastHeartbeatEpoch || 0) >= Number(prev.lastHeartbeatEpoch || 0)) {
            byPc[parsed.pcId] = parsed;
          }
        }

        const sevRank = (r) => (r.healthSeverity === "critical" ? 0 : r.healthSeverity === "warning" ? 1 : 2);
        const fleetSummary = Object.values(byPc).sort((a, b) => {
          const aLive = a.isOnline ? 0 : 1;
          const bLive = b.isOnline ? 0 : 1;
          if (aLive !== bLive) return aLive - bLive;
          const diff = sevRank(a) - sevRank(b);
          return diff !== 0 ? diff : Number(b.lastHeartbeatEpoch || 0) - Number(a.lastHeartbeatEpoch || 0);
        });

        const response = new Response(
          JSON.stringify({
            success: true,
            database: "firebase-firestore",
            edge: "cloudflare-worker",
            totalLivePcs: fleetSummary.length,
            activeNodes: fleetSummary.filter((p) => p.isOnline || String(p.status).toUpperCase().includes("SUCCESS")).length,
            fleetSummary,
            receiverTimestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`,
              "X-EVedhika-Cache": "EDGE-FIRESTORE-60S",
              ...corsHeaders
            }
          }
        );

        ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, message: "Firestore read error", error: err?.message }),
          { status: 500, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders } }
        );
      }
    }

    // 2. DYNAMIC MUTATIONS & AUTHENTICATED CALLS -> Bypass Cache Completely
    const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const hasAuthHeader =
      request.headers.has("Authorization") ||
      request.headers.has("X-Admin-Auth") ||
      request.headers.has("X-Admin-Key") ||
      request.headers.has("X-Admin-Token");
    const isBypassPath =
      url.pathname.startsWith("/api/admin/") ||
      url.pathname.startsWith("/api/upload") ||
      url.pathname.startsWith("/api/chat") ||
      url.pathname.startsWith("/api/comments") ||
      url.pathname.startsWith("/api/like") ||
      url.pathname.includes("/auth/");

    if (isMutation || hasAuthHeader || isBypassPath) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return fetch(request, { cf: { cacheEverything: false } });
    }

    // 3. READ-HEAVY API ENDPOINTS -> Cache at Cloudflare Edge
    if (url.pathname.startsWith("/api/")) {
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);

      let response = await cache.match(cacheKey);
      if (!response) {
        response = env && env.ASSETS ? await env.ASSETS.fetch(request) : await fetch(request);

        if (response.status === 200) {
          const headers = new Headers(response.headers);
          headers.set("Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`);
          headers.set("X-EVedhika-Cache", "HIT-CLOUDFLARE-EDGE");

          response = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
          });

          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
      }
      return response;
    }

    // 4. STATIC ASSETS
    const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|exe|msi|zip|woff2|ttf|eot)$/i.test(url.pathname);
    if (isStaticAsset) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return fetch(request, {
        cf: { cacheEverything: true, cacheTtl: 31536000, edgeCacheTtl: 31536000 }
      });
    }

    // 5. HTML / PAGE ROUTING
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return fetch(request);
  }
};
