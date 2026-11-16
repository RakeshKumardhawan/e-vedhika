export const DEFAULT_DAILY_AD_LIMIT = 3;
export const MIN_AD_COOLDOWN_MS = 45 * 1000; // Minimum 45 seconds between ad displays
export const THIRD_PARTY_TAG_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours cooldown for MultiTag

export const isLegacyWindows = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || "";
    const isLegacy = ua.includes("Windows NT 6.") || 
                     ua.includes("Windows NT 5.") || 
                     ua.includes("MSIE") || 
                     ua.includes("Trident") || 
                     ua.includes("Windows 7") || 
                     ua.includes("Windows 8") ||
                     ua.includes("Chrome/10") || // Chrome 100-109
                     ua.includes("Chrome/9") ||  // Chrome 90-99
                     ua.includes("Chrome/8") ||  // Chrome 80-89
                     ua.includes("Chrome/7");    // Chrome 70-79
    if (isLegacy) console.log("Legacy environment detected: Ads disabled for stability.");
    return isLegacy;
};

export const isAdsMuted = (siteConfig?: any): boolean => {
    if (isLegacyWindows()) return true;
    // 1. Check local storage override first
    try {
        const localMute = localStorage.getItem("e_vedhika_ad_mute_until");
        if (localMute && Number(localMute) > Date.now()) {
            return true;
        }
        const savedConfig = localStorage.getItem("e_vedhika_ad_config");
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            if (parsed.globalAdsEnabled === false) return true;
            if (parsed.globalAdsMutedUntil && Number(parsed.globalAdsMutedUntil) > Date.now()) {
                return true;
            }
        }
    } catch (e) {}

    // 2. Check siteConfig from firestore
    if (siteConfig?.ads?.globalAdsEnabled === false) return true;
    if (siteConfig?.ads?.globalAdsMutedUntil && Number(siteConfig.ads.globalAdsMutedUntil) > Date.now()) {
        return true;
    }

    return false;
};

export const getMuteRemainingSeconds = (siteConfig?: any): number => {
    let maxMutedUntil = 0;
    try {
        const localMute = localStorage.getItem("e_vedhika_ad_mute_until");
        if (localMute) {
            maxMutedUntil = Math.max(maxMutedUntil, Number(localMute));
        }
        const savedConfig = localStorage.getItem("e_vedhika_ad_config");
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            if (parsed.globalAdsMutedUntil) {
                maxMutedUntil = Math.max(maxMutedUntil, Number(parsed.globalAdsMutedUntil));
            }
        }
    } catch (e) {}

    if (siteConfig?.ads?.globalAdsMutedUntil) {
        maxMutedUntil = Math.max(maxMutedUntil, Number(siteConfig.ads.globalAdsMutedUntil));
    }

    const remainingMs = maxMutedUntil - Date.now();
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
};

export const muteAdsLocally = (minutes: number): number => {
    const mutedUntil = Date.now() + minutes * 60 * 1000;
    try {
        localStorage.setItem("e_vedhika_ad_mute_until", String(mutedUntil));
        const saved = localStorage.getItem("e_vedhika_ad_config");
        const config = saved ? JSON.parse(saved) : {};
        config.globalAdsMutedUntil = mutedUntil;
        localStorage.setItem("e_vedhika_ad_config", JSON.stringify(config));
    } catch (e) {}
    return mutedUntil;
};

export const unmuteAdsLocally = (): void => {
    try {
        localStorage.removeItem("e_vedhika_ad_mute_until");
        const saved = localStorage.getItem("e_vedhika_ad_config");
        if (saved) {
            const config = JSON.parse(saved);
            config.globalAdsMutedUntil = null;
            localStorage.setItem("e_vedhika_ad_config", JSON.stringify(config));
        }
    } catch (e) {}
};

export const canShowAds = (siteConfig?: any): boolean => {
    if (typeof window === "undefined") return false;
    if (isLegacyWindows()) return false;
    if (isAdsMuted(siteConfig)) return false;

    // Never render ads on private, admin, account-only, or utility workspace pages
    const pathname = (window.location.pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
    const search = (window.location.search || "").toLowerCase();

    const privatePathPrefixes = [
        "/admin",
        "/evdka",
        "/my_activity",
        "/priority_services/my_activity",
        "/chat",
        "/logs",
        "/union",
        "/workspace",
        "/farmer_registry",
        "/excel-a4-print",
        "/pdf-compress",
        "/vault",
    ];

    if (privatePathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
        return false;
    }

    const privateTabParams = [
        "tab=admin",
        "tab=editor",
        "tab=my_activity",
        "tab=logs",
        "tab=chat",
        "tab=union",
        "tab=workspace",
    ];
    if (privateTabParams.some((param) => search.includes(param))) {
        return false;
    }

    if (siteConfig && (siteConfig.isMaintenanceMode || siteConfig.governanceMode === "MAINTENANCE")) {
        return false;
    }

    // Read configured limit or enforce low-ad default (3 ads per user per day)
    let configuredLimit = siteConfig?.ads?.adLimitPerUser;
    if (!configuredLimit) {
        try {
            const saved = localStorage.getItem("e_vedhika_ad_config");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.adLimitPerUser) configuredLimit = parsed.adLimitPerUser;
            }
        } catch {}
    }
    const limit = Number(configuredLimit) > 0 ? Number(configuredLimit) : DEFAULT_DAILY_AD_LIMIT;

    const today = new Date().toDateString();
    let data: { date?: string; count?: number; lastAt?: number };
    try {
        data = JSON.parse(localStorage.getItem("adStats") || "{}");
    } catch {
        data = {};
    }
    if (data.date !== today) {
        data = { date: today, count: 0, lastAt: 0 };
    }
    if ((data.count || 0) >= limit) {
        return false;
    }
    if (data.lastAt && Date.now() - data.lastAt < MIN_AD_COOLDOWN_MS) {
        return false;
    }
    return true;
};

export const recordAdImpression = () => {
    const today = new Date().toDateString();
    let data: { date?: string; count?: number; lastAt?: number };
    try {
        data = JSON.parse(localStorage.getItem("adStats") || "{}");
    } catch {
        data = {};
    }
    if (data.date !== today) {
        data = { date: today, count: 1, lastAt: Date.now() };
    } else {
        data.count = (data.count || 0) + 1;
        data.lastAt = Date.now();
    }
    try {
        localStorage.setItem("adStats", JSON.stringify(data));
    } catch {}
};

export const canLoadThirdPartyAdTag = (siteConfig?: any, isAdmin?: boolean): boolean => {
    if (typeof window === "undefined") return false;
    if (isAdmin) return false;
    if (!canShowAds(siteConfig)) return false;

    // Disabled by default unless explicitly enabled in Admin -> Ad Management
    let enabled = siteConfig?.ads?.thirdPartyTagEnabled === true;
    if (!siteConfig?.ads && typeof localStorage !== "undefined") {
        try {
            const saved = localStorage.getItem("e_vedhika_ad_config");
            if (saved) enabled = JSON.parse(saved).thirdPartyTagEnabled === true;
        } catch {}
    }
    if (!enabled) return false;

    // Only allow on public article detail views (never Home feed, login, or tool pages)
    const pathname = (window.location.pathname || "/").toLowerCase();
    if (!pathname.startsWith("/home/post/")) return false;

    try {
        const lastLoaded = Number(localStorage.getItem("e_vedhika_tag_last_loaded") || "0");
        if (lastLoaded && Date.now() - lastLoaded < THIRD_PARTY_TAG_COOLDOWN_MS) {
            return false;
        }
    } catch {}

    return true;
};

export const markThirdPartyAdTagLoaded = () => {
    try {
        localStorage.setItem("e_vedhika_tag_last_loaded", String(Date.now()));
    } catch {}
};
