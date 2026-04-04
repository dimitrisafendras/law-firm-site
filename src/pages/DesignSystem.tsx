import { colors, fonts, fontSizes, lineHeights, letterSpacings, spacing, radii, breakpoints, layout, transitions, colorVarNames } from '../theme';

const sectionStyle: React.CSSProperties = {
  padding: '48px 0',
  textAlign: 'left',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '16px',
};

const swatchStyle = (bg: string): React.CSSProperties => ({
  padding: '16px',
  borderRadius: '4px',
  background: bg,
  border: '1px solid var(--border)',
  minHeight: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: '4px',
});

const monoSmall: React.CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: '12px',
  lineHeight: '1.4',
  wordBreak: 'break-all',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--label)',
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  opacity: 0.6,
};

const tokenRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid var(--border)',
};

function contrastColor(hex: string): string {
  if (hex.startsWith('rgba') || hex.startsWith('var')) return 'var(--text)';
  const c = hex.replace('#', '');
  if (c.length < 6) return '#000';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#002B49' : '#F5F5F5';
}

function ColorSwatches({ mode, tokens }: { mode: string; tokens: Record<string, string> }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--label)', fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
        {mode}
      </h3>
      <div style={gridStyle}>
        {Object.entries(tokens).map(([key, value]) => {
          const varName = colorVarNames[key] || `--${key}`;
          return (
            <div key={key} style={swatchStyle(value)}>
              <span style={{ ...monoSmall, color: contrastColor(value), fontWeight: 600 }}>{key}</span>
              <span style={{ ...monoSmall, color: contrastColor(value), opacity: 0.7 }}>{varName}</span>
              <span style={{ ...monoSmall, color: contrastColor(value), opacity: 0.5 }}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenTable({ title, tokens }: { title: string; tokens: Record<string, string> }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontFamily: 'var(--label)', fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {title}
      </h3>
      {Object.entries(tokens).map(([key, value]) => (
        <div key={key} style={tokenRowStyle}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px' }}>{key}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', opacity: 0.6 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DesignSystem() {
  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 32px', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <span style={labelStyle}>Design System</span>
        <h1 style={{ fontSize: '48px', fontFamily: 'var(--heading)', letterSpacing: '-1.5px', margin: '8px 0 16px' }}>
          The Monolithic Sanctuary
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '640px', lineHeight: '1.6', opacity: 0.7 }}>
          All design tokens for the law firm website. Values are defined once in <code>src/theme/tokens.ts</code> and injected as CSS custom properties at runtime.
        </p>
      </div>

      {/* Colors */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>Colors</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <ColorSwatches mode="Light" tokens={colors.light} />
          <ColorSwatches mode="Dark" tokens={colors.dark} />
        </div>
      </section>

      {/* Typography */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>Typography</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
          {Object.entries(fonts).map(([key, family]) => (
            <div key={key} style={{ padding: '24px', background: 'var(--surface)', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <span style={labelStyle}>{key} &mdash; <code style={{ background: 'none', padding: 0, fontSize: '11px' }}>var(--{key})</code></span>
              <p style={{ fontFamily: family, fontSize: '28px', marginTop: '12px', letterSpacing: '-0.5px' }}>
                The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ ...monoSmall, marginTop: '8px', opacity: 0.5 }}>{family}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <TokenTable title="Font Sizes" tokens={fontSizes} />
          <TokenTable title="Line Heights" tokens={lineHeights} />
          <TokenTable title="Letter Spacings" tokens={letterSpacings} />
        </div>
      </section>

      {/* Spacing */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>Spacing</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', width: '30px' }}>{key}</span>
              <div style={{ width: value, height: '24px', background: 'var(--accent)', borderRadius: '2px', minWidth: '2px' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', opacity: 0.5 }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Radii */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>Border Radii</h2>
        <div style={{ display: 'flex', gap: '24px' }}>
          {Object.entries(radii).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--accent)', borderRadius: value, marginBottom: '8px' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{key}</span>
              <br />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', opacity: 0.5 }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Layout & Misc */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>Layout &amp; Misc</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          <TokenTable title="Breakpoints" tokens={breakpoints} />
          <TokenTable title="Layout" tokens={layout} />
          <TokenTable title="Transitions" tokens={transitions} />
        </div>
      </section>
    </div>
  );
}
