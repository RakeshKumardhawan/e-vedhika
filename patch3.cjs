const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const searchInArticle = `{siteConfig?.ads?.adsenseEnabled && siteConfig.ads.adsenseClient && siteConfig.ads.adsenseSlotInArticle && canShowAds(siteConfig) && (
          <AdsenseUnit client={siteConfig.ads.adsenseClient} slot={siteConfig.ads.adsenseSlotInArticle} className="w-full my-4 flex justify-center items-center" />
        )}`;

const replaceInArticle = searchInArticle + `
        {siteConfig?.ads?.customAdsEnabled && siteConfig.ads.customAdCodeInArticle && canShowAds(siteConfig) && (
          <CustomAdUnit id="in-article-custom-ad" code={siteConfig.ads.customAdCodeInArticle} className="my-4" />
        )}`;

content = content.replace(searchInArticle, replaceInArticle);

const searchSidebar = `{siteConfig?.ads?.adsenseEnabled && siteConfig.ads.adsenseClient && siteConfig.ads.adsenseSlotSidebar && canShowAds(siteConfig) && (
          <AdsenseUnit client={siteConfig.ads.adsenseClient} slot={siteConfig.ads.adsenseSlotSidebar} className="w-full flex items-center justify-center" />
        )}`;

const replaceSidebar = searchSidebar + `
        {/* Custom Ad Placeholder */}
        {siteConfig?.ads?.customAdsEnabled && siteConfig.ads.customAdCodeSidebar && canShowAds(siteConfig) && (
          <CustomAdUnit id="sidebar-custom-ad" code={siteConfig.ads.customAdCodeSidebar} className="w-full flex items-center justify-center" />
        )}`;

content = content.replace(searchSidebar, replaceSidebar);

fs.writeFileSync('src/App.tsx', content);
console.log('Success patch3');
