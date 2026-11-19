import React, { useEffect, useId, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  RectangleHorizontal,
  ExternalLink,
  Youtube,
  Target,
} from "lucide-react";
import { getYouTubeVideoId, parseYouTubeEmbedUrl } from "../utils/youtube";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
    __evYtApiCallbacks?: Array<() => void>;
    __evYtApiLoading?: boolean;
  }
}

function loadYouTubeIframeAPI(callback: () => void) {
  if (typeof window === "undefined") return;
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }
  if (!window.__evYtApiCallbacks) {
    window.__evYtApiCallbacks = [];
  }
  window.__evYtApiCallbacks.push(callback);

  if (!window.__evYtApiLoading) {
    window.__evYtApiLoading = true;
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === "function") prevReady();
      const cbs = window.__evYtApiCallbacks || [];
      window.__evYtApiCallbacks = [];
      cbs.forEach((cb) => {
        try {
          cb();
        } catch {
          // ignore callback errors
        }
      });
    };
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }
}

interface YouTubeInteractivePlayerProps {
  url: string;
  title?: string;
  websiteName?: string;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
  className?: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function YouTubeInteractivePlayer({
  url,
  title = "YouTube Video",
  websiteName,
  isTheaterMode = false,
  onToggleTheaterMode,
  className = "",
}: YouTubeInteractivePlayerProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const iframeId = `ev-yt-player-${reactId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const videoId = getYouTubeVideoId(url);
  const baseEmbed = parseYouTubeEmbedUrl(url);

  const embedSrc = (() => {
    if (!baseEmbed) return "";
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? encodeURIComponent(window.location.origin)
        : "";
    const params = [
      "enablejsapi=1",
      "controls=1",
      "fs=1",
      "rel=0",
      "playsinline=1",
      "modestbranding=0",
      "iv_load_policy=3",
      origin ? `origin=${origin}` : "",
    ]
      .filter(Boolean)
      .join("&");
    const sep = baseEmbed.includes("?") ? "&" : "?";
    return `${baseEmbed}${sep}${params}`;
  })();

  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : url;

  useEffect(() => {
    if (!embedSrc) return;
    let isMounted = true;

    loadYouTubeIframeAPI(() => {
      if (!isMounted) return;
      const el = document.getElementById(iframeId);
      if (!el || !window.YT?.Player) return;

      try {
        playerRef.current = new window.YT.Player(iframeId, {
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              try {
                setIsMuted(Boolean(event.target.isMuted?.()));
                const rate = event.target.getPlaybackRate?.();
                if (typeof rate === "number") setPlaybackRate(rate);
              } catch {
                // ignore
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              setIsPlaying(event.data === 1);
            },
            onPlaybackRateChange: (event: any) => {
              if (!isMounted) return;
              if (typeof event.data === "number") {
                setPlaybackRate(event.data);
              }
            },
          },
        });
      } catch {
        // Fallback silently to standard iframe controls
      }
    });

    return () => {
      isMounted = false;
      try {
        playerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [embedSrc, iframeId]);

  if (!embedSrc) return null;

  const handleTogglePlay = () => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    try {
      if (isPlaying) {
        p.pauseVideo?.();
      } else {
        p.playVideo?.();
      }
    } catch {
      // ignore
    }
  };

  const handleSeekBy = (seconds: number) => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    try {
      const current = Number(p.getCurrentTime?.() || 0);
      const duration = Number(p.getDuration?.() || 0);
      const next = Math.max(0, duration > 0 ? Math.min(duration, current + seconds) : current + seconds);
      p.seekTo?.(next, true);
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    try {
      if (isMuted) {
        p.unMute?.();
        setIsMuted(false);
      } else {
        p.mute?.();
        setIsMuted(true);
      }
    } catch {
      // ignore
    }
  };

  const handleSetSpeed = (rate: number) => {
    const p = playerRef.current;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (!p || !isReady) return;
    try {
      p.setPlaybackRate?.(rate);
    } catch {
      // ignore
    }
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`mb-4 rounded-2xl overflow-hidden border transition-all ${
        websiteName
          ? "bg-blue-50/70 border-blue-100"
          : "bg-slate-950 border-slate-200/80"
      } shadow-sm group ${className}`}
    >
      {websiteName && (
        <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-blue-100/50 transition-colors">
          <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-wider">
            <div className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center shrink-0">
              <ExternalLink size={12} strokeWidth={3} />
            </div>
            {websiteName} Issue / Problem
          </div>
          <Target
            size={14}
            className="text-primary/40 group-hover:text-primary transition-colors shrink-0"
          />
        </div>
      )}

      <div className={websiteName ? "px-1.5 pb-1.5" : ""}>
        <div
          ref={containerRef}
          className="rounded-xl overflow-hidden bg-black shadow-md flex flex-col"
        >
          {/* Full Widescreen 16:9 Video Screen */}
          <div
            className={`relative w-full aspect-video bg-black ${
              isTheaterMode
                ? "min-h-[260px] sm:min-h-[400px] lg:min-h-[500px]"
                : "min-h-[230px] sm:min-h-[320px] lg:min-h-[380px]"
            }`}
          >
            <iframe
              id={iframeId}
              src={embedSrc}
              title={title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Native YouTube-Style Interactive Control Toolbar */}
          <div className="bg-slate-900 text-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleTogglePlay}
                disabled={!isReady}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-[11px] transition-colors cursor-pointer"
                title={isPlaying ? "పాజ్ చేయండి (Pause)" : "ప్లే చేయండి (Play)"}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSeekBy(-10)}
                disabled={!isReady}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-[11px] transition-colors cursor-pointer"
                title="10 సెకన్లు వెనక్కి (-10s)"
              >
                <RotateCcw size={13} />
                <span>-10s</span>
              </button>

              <button
                type="button"
                onClick={() => handleSeekBy(10)}
                disabled={!isReady}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-[11px] transition-colors cursor-pointer"
                title="10 సెకన్లు ముందుకు (+10s)"
              >
                <span>+10s</span>
                <RotateCw size={13} />
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                disabled={!isReady}
                className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 transition-colors cursor-pointer"
                title={isMuted ? "అన్‌మ్యూట్ (Unmute)" : "మ్యూట్ (Mute)"}
              >
                {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} />}
              </button>

              {/* Playback Speed Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSpeedMenu((prev) => !prev)}
                  disabled={!isReady}
                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-mono font-bold text-[11px] transition-colors cursor-pointer"
                  title="వీడియో స్పీడ్ మార్చండి (Playback Speed)"
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full left-0 mb-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-30 min-w-[78px]">
                    {SPEED_OPTIONS.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSetSpeed(rate)}
                        className={`w-full text-left px-3 py-1.5 text-[11px] font-mono font-bold hover:bg-slate-800 transition-colors cursor-pointer ${
                          playbackRate === rate ? "text-red-400 bg-slate-800/80" : "text-slate-200"
                        }`}
                      >
                        {rate === 1 ? "1x (Normal)" : `${rate}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onToggleTheaterMode && (
                <button
                  type="button"
                  onClick={onToggleTheaterMode}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    isTheaterMode
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                  title={isTheaterMode ? "సాధారణ స్క్రీన్ (Default View)" : "పెద్ద స్క్రీన్ (Theater Mode)"}
                >
                  <RectangleHorizontal size={14} />
                  <span className="hidden sm:inline">
                    {isTheaterMode ? "సాధారణ స్క్రీన్" : "పెద్ద స్క్రీన్"}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleFullscreen}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                title="ఫుల్ స్క్రీన్ (Fullscreen)"
              >
                <Maximize size={13} />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>

              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600/90 text-slate-200 hover:text-white font-bold text-[11px] transition-colors"
                title="YouTube లో ఓపెన్ చేయండి"
              >
                <Youtube size={14} className="text-red-500 group-hover:text-white" />
                <span className="hidden md:inline">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
