const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace monetagEnabled condition
content = content.replace(
    /\{siteConfig\?\.ads\?\.monetagEnabled && \(/g,
    "{siteConfig?.ads?.monetagEnabled && canShowAds(siteConfig?.ads?.adLimitPerUser) && ("
);

// Replace adsenseEnabled condition
content = content.replace(
    /\{siteConfig\?\.ads\?\.adsenseEnabled && siteConfig\.ads\.adsenseClient && siteConfig\.ads\.adsenseSlotInArticle && \(/g,
    "{siteConfig?.ads?.adsenseEnabled && siteConfig.ads.adsenseClient && siteConfig.ads.adsenseSlotInArticle && canShowAds(siteConfig?.ads?.adLimitPerUser) && ("
);

content = content.replace(
    /\{siteConfig\?\.ads\?\.adsenseEnabled && siteConfig\.ads\.adsenseClient && siteConfig\.ads\.adsenseSlotSidebar && \(/g,
    "{siteConfig?.ads?.adsenseEnabled && siteConfig.ads.adsenseClient && siteConfig.ads.adsenseSlotSidebar && canShowAds(siteConfig?.ads?.adLimitPerUser) && ("
);

fs.writeFileSync('src/App.tsx', content);
