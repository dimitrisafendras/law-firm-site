import './CircuitLines.css';

/*
 * Each variant is a unique hand-placed arrangement of lines and nodes
 * so sections feel organic rather than repetitive.
 *
 * Coordinates use percentages so the pattern adapts to any container
 * without distorting circles or stretching lines.
 * (Original 1000×400 grid → x/10 = x%, y/4 = y%)
 */
const patterns: Record<string, React.ReactNode> = {
  // Top-right cluster + bottom-left accent
  a: (
    <>
      <line x1="60%" y1="12.5%" x2="95%" y2="12.5%" strokeWidth="0.5" opacity="0.15" />
      <line x1="70%" y1="37.5%" x2="100%" y2="37.5%" strokeWidth="0.5" opacity="0.1" />
      <line x1="55%" y1="25%" x2="80%" y2="25%" strokeWidth="0.5" opacity="0.07" />
      <line x1="85%" y1="0%" x2="85%" y2="62.5%" strokeWidth="0.5" opacity="0.08" />
      <line x1="75%" y1="7.5%" x2="75%" y2="45%" strokeWidth="0.5" opacity="0.06" />
      <line x1="95%" y1="12.5%" x2="85%" y2="37.5%" strokeWidth="0.5" opacity="0.12" />
      <line x1="70%" y1="37.5%" x2="60%" y2="12.5%" strokeWidth="0.5" opacity="0.06" />
      {/* bottom-left accent */}
      <line x1="0%" y1="80%" x2="28%" y2="80%" strokeWidth="0.5" opacity="0.08" />
      <line x1="12%" y1="70%" x2="12%" y2="100%" strokeWidth="0.5" opacity="0.06" />
      <line x1="12%" y1="80%" x2="20%" y2="95%" strokeWidth="0.5" opacity="0.05" />
      <circle cx="95%" cy="12.5%" r="2.5" opacity="0.18" />
      <circle cx="85%" cy="37.5%" r="2" opacity="0.12" />
      <circle cx="70%" cy="37.5%" r="1.5" opacity="0.1" />
      <circle cx="75%" cy="25%" r="1.5" opacity="0.08" />
      <circle cx="12%" cy="80%" r="2" opacity="0.1" />
    </>
  ),
  // Bottom-left cluster + top-right accent
  b: (
    <>
      <line x1="0%" y1="87.5%" x2="40%" y2="87.5%" strokeWidth="0.5" opacity="0.12" />
      <line x1="5%" y1="62.5%" x2="35%" y2="62.5%" strokeWidth="0.5" opacity="0.08" />
      <line x1="0%" y1="75%" x2="20%" y2="75%" strokeWidth="0.5" opacity="0.06" />
      <line x1="15%" y1="50%" x2="15%" y2="100%" strokeWidth="0.5" opacity="0.1" />
      <line x1="30%" y1="55%" x2="30%" y2="95%" strokeWidth="0.5" opacity="0.06" />
      <line x1="30%" y1="62.5%" x2="40%" y2="87.5%" strokeWidth="0.5" opacity="0.08" />
      <line x1="15%" y1="62.5%" x2="30%" y2="87.5%" strokeWidth="0.5" opacity="0.05" />
      {/* top-right accent */}
      <line x1="75%" y1="15%" x2="100%" y2="15%" strokeWidth="0.5" opacity="0.07" />
      <line x1="88%" y1="5%" x2="88%" y2="30%" strokeWidth="0.5" opacity="0.06" />
      <circle cx="15%" cy="87.5%" r="2.5" opacity="0.15" />
      <circle cx="30%" cy="62.5%" r="2.5" opacity="0.12" />
      <circle cx="40%" cy="87.5%" r="2" opacity="0.1" />
      <circle cx="15%" cy="62.5%" r="1.5" opacity="0.08" />
      <circle cx="88%" cy="15%" r="2" opacity="0.08" />
    </>
  ),
  // Right-center spread + left accent
  c: (
    <>
      <line x1="70%" y1="20%" x2="100%" y2="20%" strokeWidth="0.5" opacity="0.1" />
      <line x1="65%" y1="50%" x2="98%" y2="50%" strokeWidth="0.5" opacity="0.12" />
      <line x1="75%" y1="80%" x2="100%" y2="80%" strokeWidth="0.5" opacity="0.07" />
      <line x1="90%" y1="7.5%" x2="90%" y2="65%" strokeWidth="0.5" opacity="0.08" />
      <line x1="78%" y1="15%" x2="78%" y2="57.5%" strokeWidth="0.5" opacity="0.06" />
      <line x1="75%" y1="20%" x2="65%" y2="50%" strokeWidth="0.5" opacity="0.07" />
      <line x1="90%" y1="50%" x2="100%" y2="80%" strokeWidth="0.5" opacity="0.05" />
      {/* left accent */}
      <line x1="3%" y1="45%" x2="25%" y2="45%" strokeWidth="0.5" opacity="0.06" />
      <line x1="10%" y1="32.5%" x2="10%" y2="62.5%" strokeWidth="0.5" opacity="0.05" />
      <circle cx="90%" cy="20%" r="2.5" opacity="0.12" />
      <circle cx="65%" cy="50%" r="2" opacity="0.1" />
      <circle cx="90%" cy="50%" r="2" opacity="0.14" />
      <circle cx="78%" cy="50%" r="1.5" opacity="0.08" />
      <circle cx="10%" cy="45%" r="1.5" opacity="0.07" />
    </>
  ),
  // Left-center + right accent
  d: (
    <>
      <line x1="0%" y1="25%" x2="38%" y2="25%" strokeWidth="0.5" opacity="0.1" />
      <line x1="10%" y1="62.5%" x2="50%" y2="62.5%" strokeWidth="0.5" opacity="0.12" />
      <line x1="5%" y1="45%" x2="30%" y2="45%" strokeWidth="0.5" opacity="0.06" />
      <line x1="25%" y1="7.5%" x2="25%" y2="75%" strokeWidth="0.5" opacity="0.08" />
      <line x1="40%" y1="20%" x2="40%" y2="70%" strokeWidth="0.5" opacity="0.06" />
      <line x1="38%" y1="25%" x2="25%" y2="62.5%" strokeWidth="0.5" opacity="0.08" />
      <line x1="10%" y1="25%" x2="25%" y2="62.5%" strokeWidth="0.5" opacity="0.05" />
      {/* right accent */}
      <line x1="75%" y1="75%" x2="100%" y2="75%" strokeWidth="0.5" opacity="0.07" />
      <line x1="87%" y1="62.5%" x2="87%" y2="95%" strokeWidth="0.5" opacity="0.06" />
      <circle cx="25%" cy="25%" r="2.5" opacity="0.12" />
      <circle cx="25%" cy="62.5%" r="2" opacity="0.1" />
      <circle cx="50%" cy="62.5%" r="2" opacity="0.08" />
      <circle cx="40%" cy="45%" r="1.5" opacity="0.06" />
      <circle cx="87%" cy="75%" r="2" opacity="0.08" />
    </>
  ),
  // Scattered wide — fills large areas
  e: (
    <>
      <line x1="8%" y1="15%" x2="35%" y2="15%" strokeWidth="0.5" opacity="0.08" />
      <line x1="60%" y1="40%" x2="95%" y2="40%" strokeWidth="0.5" opacity="0.12" />
      <line x1="15%" y1="75%" x2="45%" y2="75%" strokeWidth="0.5" opacity="0.1" />
      <line x1="70%" y1="85%" x2="95%" y2="85%" strokeWidth="0.5" opacity="0.07" />
      <line x1="75%" y1="7.5%" x2="75%" y2="52.5%" strokeWidth="0.5" opacity="0.08" />
      <line x1="30%" y1="7.5%" x2="30%" y2="45%" strokeWidth="0.5" opacity="0.06" />
      <line x1="35%" y1="15%" x2="60%" y2="40%" strokeWidth="0.5" opacity="0.06" />
      <line x1="45%" y1="75%" x2="70%" y2="85%" strokeWidth="0.5" opacity="0.05" />
      <line x1="20%" y1="15%" x2="15%" y2="75%" strokeWidth="0.5" opacity="0.04" />
      <circle cx="35%" cy="15%" r="2" opacity="0.1" />
      <circle cx="75%" cy="40%" r="2.5" opacity="0.12" />
      <circle cx="30%" cy="75%" r="2" opacity="0.08" />
      <circle cx="95%" cy="85%" r="1.5" opacity="0.08" />
      <circle cx="60%" cy="40%" r="1.5" opacity="0.07" />
    </>
  ),
  // Top-left + bottom-right corners
  f: (
    <>
      <line x1="3%" y1="12.5%" x2="35%" y2="12.5%" strokeWidth="0.5" opacity="0.12" />
      <line x1="0%" y1="35%" x2="28%" y2="35%" strokeWidth="0.5" opacity="0.08" />
      <line x1="8%" y1="22.5%" x2="20%" y2="22.5%" strokeWidth="0.5" opacity="0.06" />
      <line x1="18%" y1="0%" x2="18%" y2="50%" strokeWidth="0.5" opacity="0.1" />
      <line x1="30%" y1="5%" x2="30%" y2="42.5%" strokeWidth="0.5" opacity="0.06" />
      <line x1="18%" y1="12.5%" x2="28%" y2="35%" strokeWidth="0.5" opacity="0.07" />
      {/* bottom-right */}
      <line x1="70%" y1="77.5%" x2="100%" y2="77.5%" strokeWidth="0.5" opacity="0.08" />
      <line x1="75%" y1="92.5%" x2="95%" y2="92.5%" strokeWidth="0.5" opacity="0.06" />
      <line x1="85%" y1="67.5%" x2="85%" y2="100%" strokeWidth="0.5" opacity="0.07" />
      <line x1="85%" y1="77.5%" x2="95%" y2="92.5%" strokeWidth="0.5" opacity="0.05" />
      <circle cx="18%" cy="12.5%" r="2.5" opacity="0.14" />
      <circle cx="28%" cy="35%" r="2" opacity="0.1" />
      <circle cx="35%" cy="12.5%" r="1.5" opacity="0.12" />
      <circle cx="85%" cy="77.5%" r="2" opacity="0.1" />
      <circle cx="95%" cy="92.5%" r="1.5" opacity="0.07" />
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
      fill="none"
      stroke="var(--accent)"
      aria-hidden="true"
    >
      <g fill="var(--accent)">{patterns[variant]}</g>
    </svg>
  );
}
