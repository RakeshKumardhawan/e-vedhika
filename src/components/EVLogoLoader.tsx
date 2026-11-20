import React from 'react';

interface EVLogoLoaderProps {
  size?: number;
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

export function EVLogoLoader({
  size = 72,
  title = "మీ ప్రొఫైల్ వివరాలు తనిఖీ చేయబడుతున్నాయి...",
  subtitle = "దయచేసి వేచి ఉండండి (Verifying your profile details...)",
  fullScreen = true,
}: EVLogoLoaderProps) {
  const content = (
    <div className="flex flex-col justify-center items-center p-4 text-center select-none">
      {/* 🌟 EV Logo with Glowing Rings & Animation 🌟 */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Ambient Pulsing Glow behind Logo */}
        <div 
          className="absolute -inset-4 rounded-full opacity-60 blur-xl animate-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.4) 0%, rgba(34,197,94,0.3) 45%, rgba(250,204,21,0.2) 70%, transparent 80%)'
          }}
        />

        {/* Core Animated EV SVG Logo */}
        <div 
          className="logo-pro relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full drop-shadow-[0_0_16px_rgba(14,165,233,0.6)]"
          >
            <defs>
              <linearGradient id="evLoaderG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="evLoaderRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {/* Rotating dashed ring */}
            <circle
              className="logo-ring"
              cx="32"
              cy="32"
              r="29"
              fill="none"
              stroke="url(#evLoaderRing)"
              strokeWidth="2.8"
              strokeDasharray="10 5"
              strokeLinecap="round"
            />

            {/* Inner colorful circle */}
            <circle cx="32" cy="32" r="25" fill="url(#evLoaderG)" />
            {/* Center dark disc */}
            <circle cx="32" cy="32" r="21" fill="#0f172a" />

            {/* EV Bold Text */}
            <text
              x="50%"
              y="54%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="18"
              fontWeight="900"
              fontFamily="Segoe UI, -apple-system, system-ui, sans-serif"
              letterSpacing="0.5px"
            >
              EV
            </text>
          </svg>
        </div>
      </div>

      {title && (
        <p className="text-sm sm:text-base font-bold tracking-wide text-white mb-1.5 font-mandali drop-shadow-sm">
          {title}
        </p>
      )}
      {subtitle && (
        <p className="text-xs font-medium text-slate-400 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="h-[100dvh] overflow-hidden bg-slate-950 font-sans antialiased flex flex-col justify-center items-center">
        {content}
      </div>
    );
  }

  return content;
}
