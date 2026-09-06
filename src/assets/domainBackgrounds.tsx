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

/** Corporate — Doric capital crowning a holding-and-subsidiary tree */
export function CorporateBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Capital over the parent entity */}
      <path d="M226 62h68" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      <path d="M234 62c0 12 8 14 8 22h36c0-8 8-10 8-22" stroke="currentColor" strokeWidth="1.25" opacity="0.28" />
      <path d="M242 84h36" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      {/* Holding company */}
      <rect x="222" y="96" width="76" height="34" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="236" y1="113" x2="284" y2="113" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      {/* Spine and first-tier bus */}
      <line x1="260" y1="130" x2="260" y2="164" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="120" y1="164" x2="360" y2="164" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* First-tier subsidiaries */}
      {[120, 240, 360].map((x) => (
        <g key={x}>
          <circle cx={x} cy="164" r="2.5" fill="currentColor" opacity="0.3" />
          <line x1={x} y1="164" x2={x} y2="182" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
          <rect x={x - 34} y="182" width="68" height="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1={x - 22} y1="199" x2={x + 22} y2="199" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        </g>
      ))}
      {/* Second-tier holdings, elbowed off the outer branches */}
      {[[120, 82, 158], [360, 318, 372]].map(([px, a, b]) => (
        <g key={px}>
          <line x1={px} y1="214" x2={px} y2="236" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1={a} y1="236" x2={b} y2="236" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1={a} y1="236" x2={a} y2="252" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1={b} y1="236" x2={b} y2="252" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <rect x={a - 22} y="252" width="44" height="28" stroke="currentColor" strokeWidth="1" opacity="0.28" />
          <rect x={b - 22} y="252" width="44" height="28" stroke="currentColor" strokeWidth="1" opacity="0.28" />
        </g>
      ))}
      {/* Dormant vehicle under the middle branch */}
      <line x1="240" y1="214" x2="240" y2="266" stroke="currentColor" strokeWidth="0.75" opacity="0.2" strokeDasharray="4 5" />
      <circle cx="240" cy="276" r="10" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      {/* Share register */}
      {[316, 330, 344, 358].map((y, i) => (
        <g key={y} opacity={0.16 - i * 0.02}>
          <circle cx="204" cy={y} r="2" fill="currentColor" />
          <line x1="214" y1={y} x2="384" y2={y} stroke="currentColor" strokeWidth="0.75" />
        </g>
      ))}
      <line x1="40" y1="380" x2="384" y2="380" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

/** Commercial — a contract's clause structure under a counter-signed wax seal */
export function CommercialBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Counterpart sheet behind */}
      <rect x="118" y="88" width="196" height="244" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      {/* Executed sheet */}
      <rect x="142" y="104" width="204" height="248" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      {/* Title and rule */}
      <line x1="162" y1="122" x2="242" y2="122" stroke="currentColor" strokeWidth="2.5" opacity="0.28" />
      <line x1="162" y1="136" x2="326" y2="136" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Numbered clauses, each running short on its last line */}
      {[150, 206, 268].map((y, c) => (
        <g key={y}>
          <line x1="152" y1={y} x2="164" y2={y} stroke="currentColor" strokeWidth="2" opacity="0.35" />
          {[0, 1, 2].map((r) => (
            <line
              key={r}
              x1="172"
              y1={y + r * 14}
              x2={r === 2 ? 262 + c * 20 : 326}
              y2={y + r * 14}
              stroke="currentColor"
              strokeWidth="1"
              opacity={0.28 - r * 0.05}
            />
          ))}
        </g>
      ))}
      {/* Indented sub-clause */}
      {[246, 256].map((y) => (
        <g key={y}>
          <circle cx="184" cy={y} r="1.5" fill="currentColor" opacity="0.2" />
          <line x1="192" y1={y} x2="312" y2={y} stroke="currentColor" strokeWidth="0.75" opacity="0.16" />
        </g>
      ))}
      {/* Signature and counter-signature rules */}
      <line x1="164" y1="326" x2="244" y2="326" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="254" y1="326" x2="296" y2="326" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <path d="M172 322c8-10 14 6 22-2s12 4 20-4" stroke="currentColor" strokeWidth="1.25" opacity="0.3" />
      <path d="M258 322c6-6 10 4 16-1" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      {/* Wax seal over the corner */}
      <circle cx="336" cy="352" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="336" cy="352" r="20" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <circle cx="336" cy="352" r="5" fill="currentColor" opacity="0.25" />
      {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => {
        const t = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={336 + Math.cos(t) * 20}
            y1={352 + Math.sin(t) * 20}
            x2={336 + Math.cos(t) * 30}
            y2={352 + Math.sin(t) * 30}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.22"
          />
        );
      })}
      {/* Two obligations, interlocked */}
      <circle cx="66" cy="300" r="28" stroke="currentColor" strokeWidth="1.25" opacity="0.2" />
      <circle cx="104" cy="300" r="28" stroke="currentColor" strokeWidth="1.25" opacity="0.15" />
    </svg>
  );
}

/** Mergers — two forms converging into one, over a diligence list and a deal timeline */
export function MergersBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* The two entities */}
      <circle cx="170" cy="196" r="92" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <circle cx="286" cy="196" r="92" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      {/* The combined entity — the lens where they overlap */}
      <path d="M228 124.6A92 92 0 0 0 228 267.4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M228 124.6A92 92 0 0 1 228 267.4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="228" cy="196" r="12" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="228" cy="196" r="4" fill="currentColor" opacity="0.35" />
      {/* Consideration flowing inward */}
      <line x1="40" y1="330" x2="182" y2="330" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M190 330l-16-8v16z" fill="currentColor" opacity="0.3" />
      <line x1="392" y1="330" x2="282" y2="330" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M274 330l16-8v16z" fill="currentColor" opacity="0.3" />
      <line x1="228" y1="212" x2="228" y2="320" stroke="currentColor" strokeWidth="0.75" opacity="0.15" strokeDasharray="5 5" />
      {/* Due diligence checklist */}
      {[44, 64, 84].map((y, i) => (
        <g key={y} opacity={0.22 - i * 0.05}>
          <rect x="296" y={y - 7} width="14" height="14" stroke="currentColor" strokeWidth="1" />
          <path d={`M299 ${y}l3 4 6-8`} stroke="currentColor" strokeWidth="1" />
          <line x1="318" y1={y} x2="378" y2={y} stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      {/* Deal timeline */}
      <line x1="40" y1="374" x2="384" y2="374" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {[70, 140, 210, 280, 350].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="366" x2={x} y2="382" stroke="currentColor" strokeWidth="1" opacity={0.18 + i * 0.04} />
          <circle cx={x} cy="374" r={2 + i * 0.5} fill="currentColor" opacity={0.2 + i * 0.05} />
        </g>
      ))}
    </svg>
  );
}

/** Privacy — a shield and keyhole over a lattice of records, with consent gates and a cipher */
export function PrivacyBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Cipher strip */}
      {[[60, 8], [74, 3], [84, 3], [94, 14], [114, 3], [124, 8], [138, 3], [148, 14], [168, 3], [178, 8], [192, 3]].map(
        ([x, w]) => (
          <line key={x} x1={x} y1="96" x2={x + w} y2="96" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
        ),
      )}
      {/* Record lattice, redacted row by row */}
      {[140, 192, 244, 296, 348].map((y, r) => (
        <g key={y} opacity={0.3 - r * 0.035}>
          {[110, 166, 222, 278, 334].map((x) => (
            <rect key={x} x={x} y={y} width="22" height="22" stroke="currentColor" strokeWidth="0.75" />
          ))}
          <line x1="104" y1={y + 11} x2="368" y2={y + 11} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" />
        </g>
      ))}
      {/* Shield */}
      <path
        d="M250 140l82 36v86c0 50-38 82-82 98-44-16-82-48-82-98v-86z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M250 156l68 30v74c0 42-32 68-68 82-36-14-68-40-68-82v-74z"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.18"
      />
      {/* Keyhole */}
      <circle cx="250" cy="238" r="15" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <path d="M243 252l-5 36h24l-5-36" stroke="currentColor" strokeWidth="1.5" opacity="0.45" strokeLinejoin="round" />
      <circle cx="250" cy="238" r="4" fill="currentColor" opacity="0.25" />
      {/* Consent gates */}
      {[120, 190, 260, 330].map((x, i) => (
        <g key={x} opacity={0.28 - i * 0.04}>
          <line x1={x} y1="376" x2={x} y2="394" stroke="currentColor" strokeWidth="1.25" />
          <line x1={x + 34} y1="376" x2={x + 34} y2="394" stroke="currentColor" strokeWidth="1.25" />
          <line x1={x} y1="386" x2={x + 34} y2="386" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
        </g>
      ))}
    </svg>
  );
}

/** Disputes — a beam out of balance over a mediation table, with opposing arrows */
export function DisputesBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Opposing positions, stopped short of each other */}
      <line x1="90" y1="120" x2="198" y2="120" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <path d="M206 120l-14-7v14z" fill="currentColor" opacity="0.35" />
      <line x1="390" y1="120" x2="302" y2="120" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M294 120l14-7v14z" fill="currentColor" opacity="0.3" />
      <line x1="250" y1="104" x2="250" y2="138" stroke="currentColor" strokeWidth="0.75" opacity="0.2" strokeDasharray="4 4" />
      {/* Mediation table, seen from above */}
      <ellipse cx="230" cy="352" rx="140" ry="34" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <ellipse cx="230" cy="352" rx="112" ry="24" stroke="currentColor" strokeWidth="0.75" opacity="0.12" />
      {[[130, 322], [190, 312], [270, 312], [330, 322], [130, 382], [190, 392], [270, 392], [330, 382]].map(
        ([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" stroke="currentColor" strokeWidth="0.75" opacity="0.18" />
        ),
      )}
      {/* Standard and base */}
      <line x1="250" y1="196" x2="250" y2="320" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      <path d="M214 320h72" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M224 330h52" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      {/* Beam, tipped */}
      <line x1="140" y1="170" x2="360" y2="222" stroke="currentColor" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
      <circle cx="250" cy="196" r="5" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
      {/* Risen pan */}
      <line x1="140" y1="170" x2="140" y2="214" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="140" y1="170" x2="112" y2="214" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="140" y1="170" x2="168" y2="214" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <path d="M112 214h56" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M112 214c0 18 13 28 28 28s28-10 28-28" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      {/* Weighted pan */}
      <line x1="360" y1="222" x2="360" y2="278" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      <line x1="360" y1="222" x2="332" y2="278" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="360" y1="222" x2="388" y2="278" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <path d="M332 278h56" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <path d="M332 278c0 18 13 28 28 28s28-10 28-28" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <circle cx="360" cy="292" r="5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

/** Family — the oikos: a hearth burning inside a walled courtyard beside the threshold */
export function FamilyBg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Courtyard wall, in plan */}
      <path d="M70 342l120-46 202 34-120 54z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinejoin="round" />
      <path d="M92 341l99-38 179 30-101 42z" stroke="currentColor" strokeWidth="0.75" opacity="0.15" strokeLinejoin="round" />
      {/* Ground the household gathers on */}
      <ellipse cx="200" cy="302" rx="72" ry="20" stroke="currentColor" strokeWidth="0.75" opacity="0.12" />
      <ellipse cx="200" cy="302" rx="104" ry="29" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      {/* Hearth */}
      <rect x="160" y="286" width="80" height="12" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
      <rect x="168" y="274" width="64" height="12" stroke="currentColor" strokeWidth="1.25" opacity="0.3" />
      <rect x="178" y="220" width="44" height="54" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      <rect x="172" y="212" width="56" height="8" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="190" y="242" width="20" height="32" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <circle cx="196" cy="264" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="204" cy="258" r="1.5" fill="currentColor" opacity="0.22" />
      {/* Smoke */}
      <path d="M200 212c-10-16 12-28 2-46s12-30 6-46" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M186 214c-8-14 8-24 0-40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M214 214c8-14-8-24 0-40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* Threshold */}
      <rect x="306" y="186" width="76" height="10" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <line x1="312" y1="182" x2="376" y2="182" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="316" y1="196" x2="316" y2="330" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="372" y1="196" x2="372" y2="330" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="344" y1="204" x2="344" y2="330" stroke="currentColor" strokeWidth="0.75" opacity="0.12" />
      <rect x="304" y="330" width="80" height="7" stroke="currentColor" strokeWidth="1.25" opacity="0.3" />
      <line x1="298" y1="337" x2="390" y2="337" stroke="currentColor" strokeWidth="0.75" opacity="0.18" />
    </svg>
  );
}
