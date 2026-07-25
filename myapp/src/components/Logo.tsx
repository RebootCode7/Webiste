import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: { svg: 'w-8 h-8', textTitle: 'text-base', textSub: 'text-[8px]', gap: 'gap-2' },
    md: { svg: 'w-12 h-12', textTitle: 'text-xl', textSub: 'text-[10px]', gap: 'gap-3' },
    lg: { svg: 'w-16 h-16', textTitle: 'text-2xl', textSub: 'text-xs', gap: 'gap-4' },
    xl: { svg: 'w-24 h-24', textTitle: 'text-3xl', textSub: 'text-sm', gap: 'gap-5' },
  }[size];

  return (
    <div className={`flex items-center ${dimensions.gap} ${className}`}>
      {/* Exact SVG replica of Reboot Code Academy Logo */}
      <svg
        className={`${dimensions.svg} shrink-0`}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Arcs */}
        {/* Blue Left-Top Arc */}
        <path
          d="M 230 45 A 205 205 0 1 0 110 395"
          stroke="#3b82f6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        {/* Orange Right-Top Arc */}
        <path
          d="M 320 60 A 205 205 0 0 1 390 350"
          stroke="#f97316"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Floating Pixels on Left (Blue & Orange) */}
        <rect x="110" y="150" width="16" height="16" fill="#1e293b" />
        <rect x="140" y="170" width="16" height="16" fill="#3b82f6" />
        <rect x="120" y="190" width="16" height="16" fill="#2563eb" />
        <rect x="90" y="180" width="16" height="16" fill="#ea580c" />
        <rect x="100" y="225" width="22" height="22" fill="#3b82f6" />
        <rect x="135" y="215" width="18" height="18" fill="#1e293b" />
        <rect x="155" y="245" width="16" height="16" fill="#1e293b" />

        {/* Stylized R and Graduation Cap & Open Book Group */}
        {/* Graduation Cap (Dark Navy) */}
        <path
          d="M 250 80 L 370 135 L 250 190 L 130 135 Z"
          fill="#1e3a8a"
        />
        {/* Cap Bottom Ring */}
        <path
          d="M 180 148 L 180 170 C 180 185, 320 185, 320 170 L 320 148"
          fill="#1e3a8a"
        />
        {/* Cap Tassel */}
        <path
          d="M 345 142 L 350 200 C 350 215, 360 215, 360 200"
          stroke="#1e3a8a"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 342 205 L 358 205 L 358 230 L 342 230 Z"
          fill="#1e3a8a"
          rx="2"
        />

        {/* The Open Book at the bottom */}
        {/* Left Book Pages (Blue) */}
        <path
          d="M 250 375 C 200 345, 120 345, 90 370 L 90 395 C 120 370, 200 370, 250 400 Z"
          fill="#2563eb"
        />
        <path
          d="M 250 400 C 200 370, 120 370, 75 395 L 75 410 C 120 385, 200 385, 250 415 Z"
          fill="#1d4ed8"
        />
        {/* Right Book Pages (Orange & Dark) */}
        <path
          d="M 250 375 C 300 345, 380 345, 410 370 L 410 395 C 380 370, 300 370, 250 400 Z"
          fill="#1e3a8a"
        />
        <path
          d="M 250 400 C 300 370, 380 370, 425 395 L 425 410 C 380 385, 300 385, 250 415 Z"
          fill="#ea580c"
        />
        {/* Spine of Book */}
        <path
          d="M 246 375 L 254 375 L 254 416 L 246 416 Z"
          fill="#0f172a"
        />

        {/* Big Blue letter 'R' */}
        {/* R Vertical Left Stem */}
        <path
          d="M 190 190 L 235 190 L 235 375 L 190 375 Z"
          fill="#1e3a8a"
        />
        {/* R Curved Part and Leg */}
        <path
          d="M 235 190 C 290 190, 345 220, 345 280 C 345 320, 320 340, 280 345 L 340 375 L 290 375 L 245 342 L 235 342 L 235 190 Z"
          fill="#2563eb"
        />
        {/* Inner loop hole cutout for R */}
        <path
          d="M 235 215 L 260 215 C 290 215, 305 230, 305 255 C 305 280, 290 295, 260 295 L 235 295 Z"
          fill="#03091e"
        />

        {/* Orange Code brackets </> inside the R loop */}
        {/* Left Bracket < */}
        <path
          d="M 215 245 L 185 260 L 215 275"
          stroke="#ea580c"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right Bracket > */}
        <path
          d="M 255 245 L 285 260 L 255 275"
          stroke="#ea580c"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center Slash / */}
        <path
          d="M 245 235 L 225 285"
          stroke="#1e3a8a"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-black tracking-tight leading-none">
            <span className={`text-white uppercase ${dimensions.textTitle}`}>
              REBOOT
            </span>
            <span className={`text-[#ea580c] uppercase ${dimensions.textTitle}`}>
              CODE
            </span>
          </div>
          <span className={`font-bold tracking-widest text-slate-400 uppercase leading-none mt-1 ${dimensions.textSub}`}>
            ACADEMY
          </span>
        </div>
      )}
    </div>
  );
}
