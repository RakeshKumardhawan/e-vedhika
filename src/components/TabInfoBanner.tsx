import React, { useState } from "react";
import { Info, Youtube, ListChecks, ShieldCheck, Users, Target, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Calendar } from "lucide-react";
import { DEFAULT_PAGE_DESCRIPTIONS, PageDescriptionEntry } from "../data/pageDescriptions";

interface TabInfoBannerProps {
  currentTab: string;
  customDescriptions?: Record<string, PageDescriptionEntry>;
  lang?: "en" | "te";
}

export function TabInfoBanner({ currentTab, customDescriptions = {}, lang = "en" }: TabInfoBannerProps) {
  const [showFullDocs, setShowFullDocs] = useState(true);
  if (!currentTab || currentTab === "home" || currentTab === "admin" || currentTab === "editor" || currentTab === "logs") {
    return null;
  }

  const defaultEntry = DEFAULT_PAGE_DESCRIPTIONS[currentTab];
  const customEntry = customDescriptions[currentTab];
  const isEn = lang === "en";

  const title = isEn
    ? (customEntry?.titleEn || defaultEntry?.titleEn || customEntry?.title || defaultEntry?.title)
    : (customEntry?.title || defaultEntry?.title);

  const description = isEn
    ? (customEntry?.descriptionEn || defaultEntry?.descriptionEn || customEntry?.description || defaultEntry?.description)
    : (customEntry?.description || defaultEntry?.description);

  const guideSteps = isEn
    ? (customEntry?.guideStepsEn && customEntry.guideStepsEn.length > 0 ? customEntry.guideStepsEn : defaultEntry?.guideStepsEn || customEntry?.guideSteps || defaultEntry?.guideSteps || [])
    : (customEntry?.guideSteps && customEntry.guideSteps.length > 0 ? customEntry.guideSteps : defaultEntry?.guideSteps || []);

  const purpose = isEn ? (customEntry?.purposeEn || defaultEntry?.purposeEn || customEntry?.purpose || defaultEntry?.purpose) : (customEntry?.purpose || defaultEntry?.purpose);
  const targetAudience = isEn ? (customEntry?.targetAudienceEn || defaultEntry?.targetAudienceEn || customEntry?.targetAudience || defaultEntry?.targetAudience) : (customEntry?.targetAudience || defaultEntry?.targetAudience);
  const realLifeUseCases = isEn ? (customEntry?.realLifeUseCasesEn || defaultEntry?.realLifeUseCasesEn || customEntry?.realLifeUseCases || defaultEntry?.realLifeUseCases || []) : (customEntry?.realLifeUseCases || defaultEntry?.realLifeUseCases || []);
  const limitations = isEn ? (customEntry?.limitationsEn || defaultEntry?.limitationsEn || customEntry?.limitations || defaultEntry?.limitations) : (customEntry?.limitations || defaultEntry?.limitations);
  const dataPrivacy = isEn ? (customEntry?.dataPrivacyEn || defaultEntry?.dataPrivacyEn || customEntry?.dataPrivacy || defaultEntry?.dataPrivacy) : (customEntry?.dataPrivacy || defaultEntry?.dataPrivacy);
  const officialReference = isEn ? (customEntry?.officialReferenceEn || defaultEntry?.officialReferenceEn || customEntry?.officialReference || defaultEntry?.officialReference) : (customEntry?.officialReference || defaultEntry?.officialReference);
  const lastVerified = isEn ? (customEntry?.lastVerifiedEn || defaultEntry?.lastVerifiedEn || customEntry?.lastVerified || defaultEntry?.lastVerified) : (customEntry?.lastVerified || defaultEntry?.lastVerified);

  if (!description) return null;

  const hasExtendedDocs = Boolean(purpose || targetAudience || realLifeUseCases.length > 0 || limitations || dataPrivacy || guideSteps.length > 0);

  return (
    <div className="mb-2.5 rounded-xl bg-gradient-to-r from-blue-50/95 via-indigo-50/80 to-slate-50 border border-blue-200/80 p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Info size={18} />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {title}
                </h2>
                {lastVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    <Calendar size={10} /> {isEn ? "Verified:" : "ధృవీకరించబడింది:"} {lastVerified}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
          {hasExtendedDocs && (
            <button
              type="button"
              onClick={() => setShowFullDocs((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl transition-all shadow-xs cursor-pointer"
              title={isEn ? "View full tool guide & documentation" : "టూల్ పూర్తి మార్గదర్శిని & డాక్యుమెంటేషన్ చూడండి"}
            >
              <ListChecks size={14} />
              <span>{showFullDocs ? (isEn ? "Collapse Guide" : "గైడ్ కుదించు") : (isEn ? "Full Guide & Details" : "పూర్తి గైడ్ & వివరాలు")}</span>
              {showFullDocs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <button
            type="button"
            onClick={() => triggerYouTubeTutorial(currentTab, title)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            title={isEn ? "Watch YouTube tutorial video" : "యూట్యూబ్ ట్యుటోరియల్ వీడియో చూడండి"}
          >
            <Youtube size={16} className="shrink-0" />
            <span>{isEn ? "Watch Tutorial" : "వాచ్ ట్యుటోరియల్"}</span>
          </button>
        </div>
      </div>

      {hasExtendedDocs && showFullDocs && (
        <div className="mt-4 pt-4 border-t border-blue-200/60 space-y-3">
          {/* Purpose & Target Audience Grid */}
          {(purpose || targetAudience) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {purpose && (
                <div className="bg-white/90 rounded-xl p-3.5 border border-blue-100 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-blue-900 uppercase tracking-wide mb-1.5">
                    <Target size={14} className="text-blue-600 shrink-0" />
                    <span>{isEn ? "Purpose of this Tool" : "ఈ టూల్ ఉపయోగం ఏమిటి? (Purpose)"}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {purpose}
                  </p>
                </div>
              )}
              {targetAudience && (
                <div className="bg-white/90 rounded-xl p-3.5 border border-blue-100 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase tracking-wide mb-1.5">
                    <Users size={14} className="text-indigo-600 shrink-0" />
                    <span>{isEn ? "Who Can Use It" : "ఎవరు ఉపయోగించవచ్చు? (Audience)"}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {targetAudience}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step-by-Step Guide */}
          {guideSteps.length > 0 && (
            <div className="bg-white/90 rounded-xl p-3.5 border border-blue-100 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-900 uppercase tracking-wide mb-2">
                <ListChecks size={15} className="text-blue-600 shrink-0" />
                <span>{isEn ? "Step-by-Step Workflow:" : "ఎలా ఉపయోగించాలి? దశలవారీ విధానం (Workflow):"}</span>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {guideSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/90 px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Real-Life Use Cases */}
          {realLifeUseCases.length > 0 && (
            <div className="bg-white/90 rounded-xl p-3.5 border border-emerald-100 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase tracking-wide mb-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>{isEn ? "Real-Life Practical Use Cases:" : "నిజ జీవిత వినియోగ సందర్భాలు (Use Cases):"}</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {realLifeUseCases.map((uc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span className="leading-relaxed font-medium">{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Limitations, Privacy & Official Reference */}
          {(limitations || dataPrivacy || officialReference) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {limitations && (
                <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/80 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-amber-900 mb-1">
                    <AlertCircle size={13} className="text-amber-600 shrink-0" />
                    <span>{isEn ? "Limitations & Notes" : "పరిమితులు & గమనిక"}</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                    {limitations}
                  </p>
                </div>
              )}
              {dataPrivacy && (
                <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200/80 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-emerald-900 mb-1">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>{isEn ? "Data Security & Privacy" : "డేటా భద్రత & గోప్యత"}</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/90 leading-relaxed font-medium">
                    {dataPrivacy}
                  </p>
                </div>
              )}
              {officialReference && (
                <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 mb-1">
                    <ExternalLink size={13} className="text-blue-600 shrink-0" />
                    <span>{isEn ? "Official Reference" : "అధికారిక రిఫరెన్స్"}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {officialReference}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function triggerYouTubeTutorial(tabKey: string, fallbackTitle?: string) {
  window.dispatchEvent(
    new CustomEvent("open-youtube-tutorial", {
      detail: { tabKey, fallbackTitle },
    })
  );
}
