/**
 * Subtle Greek-themed SVG background illustrations for practice domain cards.
 * Positioned absolute, low opacity — decorative only.
 */

/** Real Estate — Greek column/building outline */
export function RealEstateBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Parthenon-style building outline */}
      <path d="M80 340h240M100 340V180M300 340V180" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M140 340V180M180 340V180M220 340V180M260 340V180" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      {/* Pediment */}
      <path d="M80 180h240M80 180l120-60 120 60" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M80 170h240" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      {/* Foundation steps */}
      <path d="M70 350h260M60 360h280" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      {/* Greek key pattern at base */}
      {[0, 40, 80, 120, 160, 200, 240].map((x) => (
        <path key={x} d={`M${90 + x} 370h20v-8h-12v4h8`} stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      ))}
    </svg>
  );
}

/** Startup Funding — ascending graph/rocket trajectory */
export function StartupBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ascending trajectory line */}
      <path d="M40 360 C100 340 140 300 180 240 S260 120 340 60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Milestone dots on trajectory */}
      <circle cx="100" cy="332" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="180" cy="240" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="260" cy="150" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="340" cy="60" r="5" fill="currentColor" opacity="0.6" />
      {/* Seed/Series labels — dashed horizontal lines */}
      <path d="M100 332h-60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" />
      <path d="M180 240h-140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" />
      <path d="M260 150h-220" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" />
      {/* Laurel wreath arc — Greek success motif */}
      <path d="M300 40 C320 30 340 35 350 50" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <path d="M355 55 C350 45 360 35 370 40" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
    </svg>
  );
}

/** Maritime — waves and ship silhouette */
export function MaritimeBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ship hull silhouette */}
      <path d="M120 200 L140 260 H280 L300 200" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinejoin="round" />
      {/* Mast */}
      <line x1="210" y1="120" x2="210" y2="200" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      {/* Sail */}
      <path d="M210 130 L270 190 H210" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <path d="M210 140 L160 190 H210" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Waves — layered, soft */}
      <path d="M0 290 C40 275 80 305 120 290 S200 275 240 290 S320 305 360 290 S400 275 440 290" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M-20 310 C20 295 60 325 100 310 S180 295 220 310 S300 325 340 310 S380 295 420 310" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <path d="M-10 330 C30 320 70 340 110 330 S190 320 230 330 S310 340 350 330 S390 320 430 330" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      {/* Compass rose hint */}
      <circle cx="60" cy="150" r="20" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="60" y1="130" x2="60" y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="40" y1="150" x2="80" y2="150" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
    </svg>
  );
}

/** Crypto — blockchain hexagons and connection nodes */
export function CryptoBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Hexagonal grid — blockchain motif */}
      {[
        [200, 140], [260, 175], [260, 245], [200, 280], [140, 245], [140, 175],
        [320, 210], [80, 210], [200, 70], [200, 350],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <polygon
            points={`${cx},${cy - 28} ${cx + 24},${cy - 14} ${cx + 24},${cy + 14} ${cx},${cy + 28} ${cx - 24},${cy + 14} ${cx - 24},${cy - 14}`}
            stroke="currentColor"
            strokeWidth="0.75"
            opacity={i < 6 ? 0.3 : 0.15}
          />
        </g>
      ))}
      {/* Connection lines between hexagons */}
      <line x1="224" y1="154" x2="236" y2="161" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="224" y1="266" x2="236" y2="259" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="176" y1="154" x2="164" y2="161" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="176" y1="266" x2="164" y2="259" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Center node glow */}
      <circle cx="200" cy="210" r="4" fill="currentColor" opacity="0.25" />
      <circle cx="200" cy="210" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      {/* Greek meander pattern at bottom — tradition meets digital */}
      {[0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320].map((x) => (
        <path key={x} d={`M${30 + x} 380h16v-8h-10v4h6`} stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      ))}
    </svg>
  );
}
