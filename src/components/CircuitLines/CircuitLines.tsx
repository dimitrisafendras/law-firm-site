import './CircuitLines.css';

/*
 * Each variant is a unique hand-placed arrangement of lines and nodes
 * so sections feel organic rather than repetitive.
 */
const patterns: Record<string, React.ReactNode> = {
  // Top-right cluster + bottom-left accent
  a: (
    <>
      <line x1="600" y1="50" x2="950" y2="50" strokeWidth="0.5" opacity="0.15" />
      <line x1="700" y1="150" x2="1000" y2="150" strokeWidth="0.5" opacity="0.1" />
      <line x1="550" y1="100" x2="800" y2="100" strokeWidth="0.5" opacity="0.07" />
      <line x1="850" y1="0" x2="850" y2="250" strokeWidth="0.5" opacity="0.08" />
      <line x1="750" y1="30" x2="750" y2="180" strokeWidth="0.5" opacity="0.06" />
      <line x1="950" y1="50" x2="850" y2="150" strokeWidth="0.5" opacity="0.12" />
      <line x1="700" y1="150" x2="600" y2="50" strokeWidth="0.5" opacity="0.06" />
      {/* bottom-left accent */}
      <line x1="0" y1="320" x2="280" y2="320" strokeWidth="0.5" opacity="0.08" />
      <line x1="120" y1="280" x2="120" y2="400" strokeWidth="0.5" opacity="0.06" />
      <line x1="120" y1="320" x2="200" y2="380" strokeWidth="0.5" opacity="0.05" />
      <circle cx="950" cy="50" r="2.5" opacity="0.18" />
      <circle cx="850" cy="150" r="2" opacity="0.12" />
      <circle cx="700" cy="150" r="1.5" opacity="0.1" />
      <circle cx="750" cy="100" r="1.5" opacity="0.08" />
      <circle cx="120" cy="320" r="2" opacity="0.1" />
    </>
  ),
  // Bottom-left cluster + top-right accent
  b: (
    <>
      <line x1="0" y1="350" x2="400" y2="350" strokeWidth="0.5" opacity="0.12" />
      <line x1="50" y1="250" x2="350" y2="250" strokeWidth="0.5" opacity="0.08" />
      <line x1="0" y1="300" x2="200" y2="300" strokeWidth="0.5" opacity="0.06" />
      <line x1="150" y1="200" x2="150" y2="400" strokeWidth="0.5" opacity="0.1" />
      <line x1="300" y1="220" x2="300" y2="380" strokeWidth="0.5" opacity="0.06" />
      <line x1="300" y1="250" x2="400" y2="350" strokeWidth="0.5" opacity="0.08" />
      <line x1="150" y1="250" x2="300" y2="350" strokeWidth="0.5" opacity="0.05" />
      {/* top-right accent */}
      <line x1="750" y1="60" x2="1000" y2="60" strokeWidth="0.5" opacity="0.07" />
      <line x1="880" y1="20" x2="880" y2="120" strokeWidth="0.5" opacity="0.06" />
      <circle cx="150" cy="350" r="2.5" opacity="0.15" />
      <circle cx="300" cy="250" r="2.5" opacity="0.12" />
      <circle cx="400" cy="350" r="2" opacity="0.1" />
      <circle cx="150" cy="250" r="1.5" opacity="0.08" />
      <circle cx="880" cy="60" r="2" opacity="0.08" />
    </>
  ),
  // Right-center spread + left accent
  c: (
    <>
      <line x1="700" y1="80" x2="1000" y2="80" strokeWidth="0.5" opacity="0.1" />
      <line x1="650" y1="200" x2="980" y2="200" strokeWidth="0.5" opacity="0.12" />
      <line x1="750" y1="320" x2="1000" y2="320" strokeWidth="0.5" opacity="0.07" />
      <line x1="900" y1="30" x2="900" y2="260" strokeWidth="0.5" opacity="0.08" />
      <line x1="780" y1="60" x2="780" y2="230" strokeWidth="0.5" opacity="0.06" />
      <line x1="750" y1="80" x2="650" y2="200" strokeWidth="0.5" opacity="0.07" />
      <line x1="900" y1="200" x2="1000" y2="320" strokeWidth="0.5" opacity="0.05" />
      {/* left accent */}
      <line x1="30" y1="180" x2="250" y2="180" strokeWidth="0.5" opacity="0.06" />
      <line x1="100" y1="130" x2="100" y2="250" strokeWidth="0.5" opacity="0.05" />
      <circle cx="900" cy="80" r="2.5" opacity="0.12" />
      <circle cx="650" cy="200" r="2" opacity="0.1" />
      <circle cx="900" cy="200" r="2" opacity="0.14" />
      <circle cx="780" cy="200" r="1.5" opacity="0.08" />
      <circle cx="100" cy="180" r="1.5" opacity="0.07" />
    </>
  ),
  // Left-center + right accent
  d: (
    <>
      <line x1="0" y1="100" x2="380" y2="100" strokeWidth="0.5" opacity="0.1" />
      <line x1="100" y1="250" x2="500" y2="250" strokeWidth="0.5" opacity="0.12" />
      <line x1="50" y1="180" x2="300" y2="180" strokeWidth="0.5" opacity="0.06" />
      <line x1="250" y1="30" x2="250" y2="300" strokeWidth="0.5" opacity="0.08" />
      <line x1="400" y1="80" x2="400" y2="280" strokeWidth="0.5" opacity="0.06" />
      <line x1="380" y1="100" x2="250" y2="250" strokeWidth="0.5" opacity="0.08" />
      <line x1="100" y1="100" x2="250" y2="250" strokeWidth="0.5" opacity="0.05" />
      {/* right accent */}
      <line x1="750" y1="300" x2="1000" y2="300" strokeWidth="0.5" opacity="0.07" />
      <line x1="870" y1="250" x2="870" y2="380" strokeWidth="0.5" opacity="0.06" />
      <circle cx="250" cy="100" r="2.5" opacity="0.12" />
      <circle cx="250" cy="250" r="2" opacity="0.1" />
      <circle cx="500" cy="250" r="2" opacity="0.08" />
      <circle cx="400" cy="180" r="1.5" opacity="0.06" />
      <circle cx="870" cy="300" r="2" opacity="0.08" />
    </>
  ),
  // Scattered wide — fills large areas
  e: (
    <>
      <line x1="80" y1="60" x2="350" y2="60" strokeWidth="0.5" opacity="0.08" />
      <line x1="600" y1="160" x2="950" y2="160" strokeWidth="0.5" opacity="0.12" />
      <line x1="150" y1="300" x2="450" y2="300" strokeWidth="0.5" opacity="0.1" />
      <line x1="700" y1="340" x2="950" y2="340" strokeWidth="0.5" opacity="0.07" />
      <line x1="750" y1="30" x2="750" y2="210" strokeWidth="0.5" opacity="0.08" />
      <line x1="300" y1="30" x2="300" y2="180" strokeWidth="0.5" opacity="0.06" />
      <line x1="350" y1="60" x2="600" y2="160" strokeWidth="0.5" opacity="0.06" />
      <line x1="450" y1="300" x2="700" y2="340" strokeWidth="0.5" opacity="0.05" />
      <line x1="200" y1="60" x2="150" y2="300" strokeWidth="0.5" opacity="0.04" />
      <circle cx="350" cy="60" r="2" opacity="0.1" />
      <circle cx="750" cy="160" r="2.5" opacity="0.12" />
      <circle cx="300" cy="300" r="2" opacity="0.08" />
      <circle cx="950" cy="340" r="1.5" opacity="0.08" />
      <circle cx="600" cy="160" r="1.5" opacity="0.07" />
    </>
  ),
  // Top-left + bottom-right corners
  f: (
    <>
      <line x1="30" y1="50" x2="350" y2="50" strokeWidth="0.5" opacity="0.12" />
      <line x1="0" y1="140" x2="280" y2="140" strokeWidth="0.5" opacity="0.08" />
      <line x1="80" y1="90" x2="200" y2="90" strokeWidth="0.5" opacity="0.06" />
      <line x1="180" y1="0" x2="180" y2="200" strokeWidth="0.5" opacity="0.1" />
      <line x1="300" y1="20" x2="300" y2="170" strokeWidth="0.5" opacity="0.06" />
      <line x1="180" y1="50" x2="280" y2="140" strokeWidth="0.5" opacity="0.07" />
      {/* bottom-right */}
      <line x1="700" y1="310" x2="1000" y2="310" strokeWidth="0.5" opacity="0.08" />
      <line x1="750" y1="370" x2="950" y2="370" strokeWidth="0.5" opacity="0.06" />
      <line x1="850" y1="270" x2="850" y2="400" strokeWidth="0.5" opacity="0.07" />
      <line x1="850" y1="310" x2="950" y2="370" strokeWidth="0.5" opacity="0.05" />
      <circle cx="180" cy="50" r="2.5" opacity="0.14" />
      <circle cx="280" cy="140" r="2" opacity="0.1" />
      <circle cx="350" cy="50" r="1.5" opacity="0.12" />
      <circle cx="850" cy="310" r="2" opacity="0.1" />
      <circle cx="950" cy="370" r="1.5" opacity="0.07" />
    </>
  ),
};

interface CircuitLinesProps {
  variant?: keyof typeof patterns;
}

export function CircuitLines({ variant = 'a' }: CircuitLinesProps) {
  return (
    <svg
      className="circuit-lines"
      viewBox="0 0 1000 400"
      fill="none"
      stroke="var(--accent)"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <g fill="var(--accent)">{patterns[variant]}</g>
    </svg>
  );
}
