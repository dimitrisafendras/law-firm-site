/**
 * Greek-themed SVG background illustrations for practice domain cards.
 * Positioned absolute, decorative only.
 */

/** Real Estate — Greek temple with detailed columns */
export function RealEstateBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Foundation */}
      <path d="M50 360h300" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M60 350h280" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M70 340h260" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Columns */}
      {[100, 150, 200, 250, 300].map((x) => (
        <g key={x}>
          <line x1={x} y1="340" x2={x} y2="180" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          {/* Column fluting */}
          <line x1={x - 4} y1="340" x2={x - 4} y2="180" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <line x1={x + 4} y1="340" x2={x + 4} y2="180" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          {/* Capital */}
          <rect x={x - 10} y="176" width="20" height="6" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
          {/* Base */}
          <rect x={x - 8} y="338" width="16" height="4" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        </g>
      ))}
      {/* Entablature */}
      <path d="M80 176h240" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path d="M80 170h240" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      {/* Pediment */}
      <path d="M80 170l120-70 120 70" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path d="M110 170l90-52 90 52" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      {/* Pediment ornament */}
      <circle cx="200" cy="130" r="8" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      {/* Greek key border */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map((x) => (
        <path key={x} d={`M${60 + x} 370h15v-6h-10v3h6`} stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      ))}
    </svg>
  );
}

/** Startup Funding — ascending trajectory with milestones */
export function StartupBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Grid lines */}
      {[360, 300, 240, 180, 120].map((y) => (
        <line key={y} x1="40" y1={y} x2="380" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      ))}
      {[100, 180, 260, 340].map((x) => (
        <line key={x} x1={x} y1="60" x2={x} y2="370" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      ))}
      {/* Main trajectory */}
      <path d="M60 360 C100 350 130 320 160 280 S220 180 280 120 S340 70 370 50" stroke="currentColor" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
      {/* Shadow trajectory */}
      <path d="M60 360 C100 350 130 320 160 280 S220 180 280 120 S340 70 370 50" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="6 4" />
      {/* Milestone markers */}
      <circle cx="60" cy="360" r="4" fill="currentColor" opacity="0.2" />
      <circle cx="60" cy="360" r="8" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
      <circle cx="160" cy="280" r="5" fill="currentColor" opacity="0.35" />
      <circle cx="160" cy="280" r="10" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="280" cy="120" r="6" fill="currentColor" opacity="0.45" />
      <circle cx="280" cy="120" r="12" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <circle cx="370" cy="50" r="7" fill="currentColor" opacity="0.55" />
      <circle cx="370" cy="50" r="14" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Laurel wreath at peak */}
      <path d="M340 35 C350 25 365 28 372 40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M375 45 C370 35 378 26 388 30" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M340 65 C350 75 365 72 372 60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Upward arrows */}
      <path d="M280 120l-6-12h12z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

/** Maritime — detailed ship with waves and compass */
export function MaritimeBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ship hull */}
      <path d="M100 220 L120 270 H290 L310 220" stroke="currentColor" strokeWidth="2" opacity="0.45" strokeLinejoin="round" />
      <path d="M130 270 L140 285 H270 L280 270" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      {/* Main mast */}
      <line x1="210" y1="100" x2="210" y2="220" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* Crow's nest */}
      <rect x="200" y="100" width="20" height="6" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      {/* Main sail */}
      <path d="M210 110 L280 200 H210" stroke="currentColor" strokeWidth="1.5" opacity="0.35" fill="currentColor" fillOpacity="0.03" />
      {/* Jib sail */}
      <path d="M210 120 L150 200 H210" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="currentColor" fillOpacity="0.02" />
      {/* Rigging lines */}
      <line x1="210" y1="100" x2="280" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="210" y1="100" x2="150" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="210" y1="130" x2="130" y2="220" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      {/* Waves */}
      <path d="M0 305 C30 290 60 315 100 300 S160 285 200 300 S260 315 300 300 S360 285 400 300" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <path d="M-20 325 C20 312 50 335 90 322 S150 310 190 322 S250 335 290 322 S350 310 400 322" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M-10 345 C30 335 60 350 100 340 S160 330 200 340 S260 350 300 340 S360 330 400 340" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      {/* Compass rose */}
      <circle cx="65" cy="140" r="28" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="65" cy="140" r="20" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="65" y1="108" x2="65" y2="172" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="33" y1="140" x2="97" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* Compass diagonals */}
      <line x1="45" y1="120" x2="85" y2="160" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="85" y1="120" x2="45" y2="160" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      {/* N marker */}
      <path d="M65 108l-4 10h8z" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

/** Crypto — blockchain network with hexagons and nodes */
export function CryptoBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Hexagonal grid */}
      {[
        [200, 140, 0.45], [260, 175, 0.4], [260, 245, 0.4], [200, 280, 0.45],
        [140, 245, 0.4], [140, 175, 0.4], [320, 210, 0.25], [80, 210, 0.25],
        [200, 70, 0.2], [200, 350, 0.2], [320, 140, 0.15], [320, 280, 0.15],
        [80, 140, 0.15], [80, 280, 0.15],
      ].map(([cx, cy, op], i) => (
        <polygon
          key={i}
          points={`${cx},${(cy as number) - 30} ${(cx as number) + 26},${(cy as number) - 15} ${(cx as number) + 26},${(cy as number) + 15} ${cx},${(cy as number) + 30} ${(cx as number) - 26},${(cy as number) + 15} ${(cx as number) - 26},${(cy as number) - 15}`}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={op}
        />
      ))}
      {/* Connection lines between hexagons */}
      {[
        [226, 155, 234, 160], [226, 265, 234, 260], [174, 155, 166, 160], [174, 265, 166, 260],
        [260, 175, 320, 210], [260, 245, 320, 210], [140, 175, 80, 210], [140, 245, 80, 210],
        [200, 140, 200, 70], [200, 280, 200, 350],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      ))}
      {/* Center node */}
      <circle cx="200" cy="210" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="200" cy="210" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="200" cy="210" r="22" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      {/* Pulse rings on outer nodes */}
      <circle cx="320" cy="210" r="4" fill="currentColor" opacity="0.2" />
      <circle cx="80" cy="210" r="4" fill="currentColor" opacity="0.2" />
      {/* Data flow dots */}
      {[
        [230, 165], [170, 165], [230, 255], [170, 255], [200, 105], [200, 315],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" opacity="0.25" />
      ))}
      {/* Greek meander at bottom */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
        <path key={x} d={`M${20 + x} 385h14v-6h-9v3h5`} stroke="currentColor" strokeWidth="0.6" opacity="0.12" />
      ))}
    </svg>
  );
}
