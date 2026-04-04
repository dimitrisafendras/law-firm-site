/**
 * SVG illustration components for the law firm website.
 * Half-digital Acropolis hero, practice area icons, and attorney avatars.
 */

// ─── Half-Digital Acropolis ──────────────────────────────────────────────────
// Left: classical Parthenon columns in warm stone tones
// Right: columns dissolve into circuit/data streams with glowing nodes

export function DigitalAcropolis({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Half-classical, half-digital Acropolis illustration"
    >
      <defs>
        {/* Stone gradient for classical side */}
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DDD0" />
          <stop offset="100%" stopColor="#C4B5A0" />
        </linearGradient>

        {/* Digital gradient for right side */}
        <linearGradient id="digital" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent, #89CFF0)" />
          <stop offset="100%" stopColor="var(--secondary, #002B49)" />
        </linearGradient>

        {/* Glow filter for digital nodes */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Stronger glow for accent nodes */}
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dissolve mask — classical fades, digital appears */}
        <linearGradient id="dissolve" x1="0.35" y1="0" x2="0.65" y2="0">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <mask id="classical-mask">
          <rect width="600" height="500" fill="url(#dissolve)" />
        </mask>
        <linearGradient id="dissolve-inv" x1="0.35" y1="0" x2="0.65" y2="0">
          <stop offset="0%" stopColor="black" />
          <stop offset="100%" stopColor="white" />
        </linearGradient>
        <mask id="digital-mask">
          <rect width="600" height="500" fill="url(#dissolve-inv)" />
        </mask>

        {/* Circuit pattern */}
        <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20h40M20 0v40" stroke="var(--accent, #89CFF0)" strokeWidth="0.5" opacity="0.15" />
          <circle cx="20" cy="20" r="1.5" fill="var(--accent, #89CFF0)" opacity="0.2" />
        </pattern>
      </defs>

      {/* ── Background elements ── */}
      {/* Digital grid background (right side) */}
      <rect x="300" y="0" width="300" height="500" fill="url(#circuit)" mask="url(#digital-mask)" />

      {/* ── CLASSICAL SIDE (left) ── */}
      <g mask="url(#classical-mask)">
        {/* Base platform / stylobate */}
        <rect x="40" y="380" width="520" height="16" rx="2" fill="url(#stone)" />
        <rect x="30" y="396" width="540" height="12" rx="2" fill="#B8A990" />
        <rect x="20" y="408" width="560" height="14" rx="2" fill="#A89880" />

        {/* Pediment (triangular roof) */}
        <polygon points="60,160 300,60 540,160" fill="url(#stone)" stroke="#B8A990" strokeWidth="2" />
        {/* Tympanum detail */}
        <polygon points="120,160 300,85 480,160" fill="#D4C9B8" opacity="0.5" />
        {/* Horizontal architrave */}
        <rect x="60" y="160" width="480" height="20" fill="url(#stone)" />
        <rect x="60" y="180" width="480" height="8" fill="#D4C9B8" />

        {/* Columns */}
        {[80, 140, 200, 260, 320, 380, 440, 500].map((x, i) => (
          <g key={i}>
            {/* Column shaft with fluting effect */}
            <rect x={x} y="188" width="24" height="192" rx="1" fill="url(#stone)" />
            {/* Fluting lines */}
            <line x1={x + 6} y1="194" x2={x + 6} y2="376" stroke="#B8A990" strokeWidth="0.5" opacity="0.6" />
            <line x1={x + 12} y1="194" x2={x + 12} y2="376" stroke="#B8A990" strokeWidth="0.5" opacity="0.6" />
            <line x1={x + 18} y1="194" x2={x + 18} y2="376" stroke="#B8A990" strokeWidth="0.5" opacity="0.6" />
            {/* Capital */}
            <rect x={x - 4} y="184" width="32" height="6" rx="1" fill="#D4C9B8" />
            {/* Base */}
            <rect x={x - 2} y="376" width="28" height="4" rx="1" fill="#D4C9B8" />
          </g>
        ))}

        {/* Decorative frieze details */}
        {[80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480].map((x, i) => (
          <rect key={i} x={x} y="162" width="8" height="16" rx="1" fill="#C4B5A0" opacity="0.7" />
        ))}
      </g>

      {/* ── DIGITAL SIDE (right) ── */}
      <g mask="url(#digital-mask)">
        {/* Digital columns — vertical data streams */}
        {[80, 140, 200, 260, 320, 380, 440, 500].map((x, i) => (
          <g key={i}>
            {/* Main stream line */}
            <line
              x1={x + 12} y1="188" x2={x + 12} y2="380"
              stroke="var(--accent, #89CFF0)"
              strokeWidth="2"
              opacity={0.4 + i * 0.08}
            />
            {/* Data flow dots (animated feel via positioning) */}
            {[210, 250, 290, 330, 360].map((y, j) => (
              <circle
                key={j}
                cx={x + 12}
                cy={y + (i * 7 + j * 3) % 20}
                r={1.5 + (j % 2)}
                fill="var(--accent, #89CFF0)"
                opacity={0.3 + (j % 3) * 0.2}
              />
            ))}
          </g>
        ))}

        {/* Digital architrave — glowing horizontal line */}
        <line x1="60" y1="188" x2="540" y2="188" stroke="var(--accent, #89CFF0)" strokeWidth="2" opacity="0.6" filter="url(#glow)" />
        <line x1="60" y1="380" x2="540" y2="380" stroke="var(--accent, #89CFF0)" strokeWidth="1.5" opacity="0.4" filter="url(#glow)" />

        {/* Digital pediment — triangular wireframe */}
        <polygon
          points="60,160 300,60 540,160"
          fill="none"
          stroke="var(--accent, #89CFF0)"
          strokeWidth="2"
          opacity="0.5"
          filter="url(#glow)"
        />
        {/* Inner wireframe triangle */}
        <polygon
          points="150,160 300,90 450,160"
          fill="none"
          stroke="var(--accent, #89CFF0)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Connection nodes at intersections */}
        {[
          [300, 60], [60, 160], [540, 160],
          [300, 188], [200, 160], [400, 160],
          [140, 188], [260, 188], [380, 188], [500, 188],
          [92, 280], [152, 320], [212, 260], [272, 340],
          [332, 250], [392, 310], [452, 270], [512, 350],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i < 3 ? 5 : 3.5}
            fill="var(--accent, #89CFF0)"
            opacity={i < 3 ? 0.9 : 0.7}
            filter={i < 3 ? 'url(#glow-strong)' : 'url(#glow)'}
          />
        ))}

        {/* Horizontal cross-connections between data streams */}
        {[240, 300, 350].map((y, i) => (
          <g key={i}>
            <line
              x1={200 + i * 40} y1={y} x2={340 + i * 40} y2={y}
              stroke="var(--accent, #89CFF0)"
              strokeWidth="1"
              opacity="0.25"
              strokeDasharray="4 4"
            />
          </g>
        ))}

        {/* Floating data particles */}
        {[
          [350, 120, 2], [420, 100, 1.5], [480, 140, 2.5],
          [520, 90, 1.5], [370, 440, 2], [440, 420, 1.5],
          [510, 450, 2], [490, 200, 1.5], [550, 300, 2],
          [400, 50, 1], [560, 130, 1.5],
        ].map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x} cy={y} r={r}
            fill="var(--accent, #89CFF0)"
            opacity={0.2 + (i % 4) * 0.1}
          />
        ))}

        {/* Digital base platform */}
        <rect x="40" y="396" width="520" height="3" rx="1" fill="var(--accent, #89CFF0)" opacity="0.4" filter="url(#glow)" />
        <rect x="30" y="408" width="540" height="2" rx="1" fill="var(--accent, #89CFF0)" opacity="0.25" />
      </g>

      {/* ── Transition zone particles (center) ── */}
      {[
        [280, 200, 2], [310, 240, 1.5], [290, 300, 2],
        [320, 170, 1.5], [285, 350, 2], [305, 270, 1],
      ].map(([x, y, r], i) => (
        <circle
          key={`trans-${i}`}
          cx={x} cy={y} r={r}
          fill="var(--accent, #89CFF0)"
          opacity={0.3 + (i % 3) * 0.15}
          filter="url(#glow)"
        />
      ))}
    </svg>
  );
}

// ─── Practice Area Icons ─────────────────────────────────────────────────────

export function RealEstateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="20" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M4 22L24 6L44 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="18" y="30" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="30" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="24" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="29" y="24" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function StartupFundingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Rocket body */}
      <path d="M24 4C24 4 16 14 16 28C16 32 19.6 36 24 36C28.4 36 32 32 32 28C32 14 24 4 24 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Window */}
      <circle cx="24" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
      {/* Fins */}
      <path d="M16 28L8 36L16 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 28L40 36L32 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Exhaust */}
      <path d="M20 36L24 44L28 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Growth dots */}
      <circle cx="24" cy="40" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function MaritimeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Hull */}
      <path d="M6 32L10 40H38L42 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Mast */}
      <line x1="24" y1="8" x2="24" y2="32" stroke="currentColor" strokeWidth="2.5" />
      {/* Main sail */}
      <path d="M24 10L38 28H24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Front sail */}
      <path d="M24 12L12 26H24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Flag */}
      <path d="M24 8L30 11L24 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Waves */}
      <path d="M2 44C6 42 10 44 14 42C18 40 22 42 26 44C30 42 34 40 38 42C42 44 46 42 48 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function CryptoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Hexagonal blockchain shape */}
      <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Inner hexagon */}
      <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" />
      {/* Chain links */}
      <circle cx="24" cy="4" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="42" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="42" cy="34" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="44" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="34" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Center node */}
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
      {/* Connection lines to center */}
      <line x1="24" y1="12" x2="24" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="29" x2="24" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="18" x2="19" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="29" y1="27" x2="34" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// ─── Attorney Avatar Placeholders ────────────────────────────────────────────
// Stylized geometric avatars — professional silhouettes with accent highlights

export function AvatarMale({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="avatar-bg-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent, #89CFF0)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--secondary, #002B49)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="suit-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--secondary, #002B49)" />
          <stop offset="100%" stopColor="#001A2E" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="320" height="420" fill="url(#avatar-bg-m)" />
      {/* Shoulders & suit */}
      <ellipse cx="160" cy="460" rx="140" ry="120" fill="url(#suit-m)" />
      {/* Shirt collar */}
      <path d="M130 340L160 370L190 340" fill="white" opacity="0.9" />
      {/* Tie */}
      <path d="M155 365L160 420L165 365L160 375Z" fill="var(--accent, #89CFF0)" />
      {/* Neck */}
      <rect x="145" y="290" width="30" height="55" rx="8" fill="#D4A574" />
      {/* Head */}
      <ellipse cx="160" cy="220" rx="62" ry="76" fill="#D4A574" />
      {/* Hair */}
      <ellipse cx="160" cy="168" rx="65" ry="40" fill="var(--secondary, #002B49)" />
      <rect x="97" y="170" width="18" height="40" rx="8" fill="var(--secondary, #002B49)" />
      <rect x="205" y="170" width="18" height="40" rx="8" fill="var(--secondary, #002B49)" />
      {/* Eyes */}
      <ellipse cx="138" cy="225" rx="6" ry="4" fill="var(--secondary, #002B49)" />
      <ellipse cx="182" cy="225" rx="6" ry="4" fill="var(--secondary, #002B49)" />
      {/* Eyebrows */}
      <path d="M128 215C132 212 142 212 148 214" stroke="var(--secondary, #002B49)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M172 214C178 212 188 212 192 215" stroke="var(--secondary, #002B49)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M156 232C156 242 164 242 164 232" stroke="#C0956C" strokeWidth="1.5" fill="none" />
      {/* Slight smile */}
      <path d="M142 252C150 260 170 260 178 252" stroke="#C0956C" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarFemale({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="avatar-bg-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--tertiary, #FFB775)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--accent, #89CFF0)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="suit-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--secondary, #002B49)" />
          <stop offset="100%" stopColor="#001A2E" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="320" height="420" fill="url(#avatar-bg-f)" />
      {/* Shoulders & blazer */}
      <ellipse cx="160" cy="460" rx="135" ry="115" fill="url(#suit-f)" />
      {/* Blouse neckline */}
      <path d="M130 345C145 365 175 365 190 345" fill="white" opacity="0.85" />
      {/* Necklace accent */}
      <circle cx="160" cy="350" r="4" fill="var(--tertiary, #FFB775)" />
      {/* Neck */}
      <rect x="147" y="288" width="26" height="55" rx="8" fill="#D4A574" />
      {/* Head */}
      <ellipse cx="160" cy="218" rx="58" ry="72" fill="#D4A574" />
      {/* Hair */}
      <ellipse cx="160" cy="172" rx="64" ry="48" fill="#3D2314" />
      <rect x="96" y="170" width="16" height="80" rx="8" fill="#3D2314" />
      <rect x="208" y="170" width="16" height="80" rx="8" fill="#3D2314" />
      {/* Hair sweep */}
      <path d="M100 180C100 150 130 130 160 128C190 130 220 150 220 180" fill="#3D2314" />
      {/* Eyes */}
      <ellipse cx="140" cy="223" rx="5.5" ry="4" fill="var(--secondary, #002B49)" />
      <ellipse cx="180" cy="223" rx="5.5" ry="4" fill="var(--secondary, #002B49)" />
      {/* Eyelashes */}
      <path d="M132 218C136 215 144 215 148 218" stroke="var(--secondary, #002B49)" strokeWidth="2" strokeLinecap="round" />
      <path d="M172 218C176 215 184 215 188 218" stroke="var(--secondary, #002B49)" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M157 230C157 238 163 238 163 230" stroke="#C0956C" strokeWidth="1.5" fill="none" />
      {/* Lips */}
      <path d="M144 248C152 256 168 256 176 248" stroke="#C48B72" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M148 248C155 252 165 252 172 248" fill="#C48B72" opacity="0.3" />
    </svg>
  );
}

// ─── Decorative Elements ─────────────────────────────────────────────────────

export function ScaleOfJustice({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Central pillar */}
      <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Top ornament */}
      <circle cx="24" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
      {/* Balance beam */}
      <line x1="6" y1="16" x2="42" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left pan */}
      <path d="M6 16L2 28H18L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 28C2 30 6 32 10 32C14 32 18 30 18 28" stroke="currentColor" strokeWidth="1.5" />
      {/* Right pan */}
      <path d="M34 16L30 28H46L42 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30 28C30 30 34 32 38 32C42 32 46 30 46 28" stroke="currentColor" strokeWidth="1.5" />
      {/* Base */}
      <rect x="14" y="42" width="20" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
