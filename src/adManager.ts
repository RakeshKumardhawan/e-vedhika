export const canShowAds = (siteConfig?: any): boolean => {
    if (siteConfig?.ads?.globalAdsEnabled === false) return false;
    if (siteConfig?.ads?.globalAdsMutedUntil && siteConfig.ads.globalAdsMutedUntil > Date.now()) return false;
    
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
