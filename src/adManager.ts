export const isAdsMuted = (siteConfig?: any): boolean => {
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
    if (isAdsMuted(siteConfig)) return false;

    const limit = siteConfig?.ads?.adLimitPerUser;
    if (!limit) return true;

    const today = new Date().toDateString();
    let data;
    try {
        data = JSON.parse(localStorage.getItem("adStats") || "{}");
    } catch {
        data = {};
    }
    if (data.date !== today) {
        data = { date: today, count: 0 };
    }
    return data.count < limit;
};

export const recordAdImpression = () => {
    const today = new Date().toDateString();
    let data;
    try {
        data = JSON.parse(localStorage.getItem("adStats") || "{}");
    } catch {
        data = {};
    }
    if (data.date !== today) {
        data = { date: today, count: 1 };
    } else {
        data.count += 1;
    }
    localStorage.setItem("adStats", JSON.stringify(data));
};

