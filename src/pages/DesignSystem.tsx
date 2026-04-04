import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { colors, fonts, fontSizes, lineHeights, letterSpacings, spacing, radii, glass, breakpoints, layout, transitions, colorVarNames } from '../theme';
import { setTheme } from '../theme';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher';
import {
  Button,
  Container,
  Section,
  Text,
  Heading,
  Badge,
  Divider,
  Input,
  Textarea,
  Navbar,
  Footer,
  Hero,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  AttorneyCard,
  PracticeAreaCard,
  TestimonialCard,
  ContactForm,
  GlassCard,
} from '../components';

// ─── Theme Toggle ────────────────────────────────────────────────────────────

type ThemeMode = 'system' | 'light' | 'dark';

function ThemeToggle() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ThemeMode>('system');

  function cycle() {
    const next: ThemeMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
    setMode(next);
    setTheme(next);
  }

  const icon = mode === 'light' ? '\u2600' : mode === 'dark' ? '\u263E' : '\u25D0';
  const label = mode === 'system' ? t('themeSystem') : mode === 'light' ? t('themeLight') : t('themeDark');

  return (
    <button
      onClick={cycle}
      aria-label={t('themeLabel', { mode: label })}
      style={{
        background: 'var(--accent-bg)',
        border: '1px solid var(--accent-border)',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontFamily: 'var(--label)',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--accent)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.3s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── Design System Helper Styles ─────────────────────────────────────────────

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
  opacity: 0.75,
};

const tokenRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid var(--border)',
};

const showcaseBox: React.CSSProperties = {
  padding: '32px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  marginBottom: '24px',
};

const showcaseLabel: React.CSSProperties = {
  fontFamily: 'var(--label)',
  fontSize: '11px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
  marginBottom: '16px',
  display: 'block',
};

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastColor(hex: string): string {
  if (hex.startsWith('rgba') || hex.startsWith('var')) return 'var(--text)';
  const c = hex.replace('#', '');
  if (c.length < 6) return '#000';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const lum = luminance(r, g, b);
  const whiteCR = contrastRatio(1, lum);
  const blackCR = contrastRatio(lum, 0);
  return blackCR >= whiteCR ? '#000000' : '#FFFFFF';
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
              <span style={{ ...monoSmall, color: contrastColor(value), opacity: 0.85 }}>{varName}</span>
              <span style={{ ...monoSmall, color: contrastColor(value), opacity: 0.75 }}>{value}</span>
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
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', opacity: 0.75 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DesignSystem() {
  const { t } = useTranslation();

  return (
    <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 32px', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px' }}>
        <div>
          <span style={labelStyle}>{t('designSystem')}</span>
          <h1 style={{ fontSize: '48px', fontFamily: 'var(--heading)', letterSpacing: '-1.5px', margin: '8px 0 16px' }}>
            {t('designSystemTitle')}
          </h1>
          <p style={{ fontSize: '18px', maxWidth: '640px', lineHeight: '1.6' }}>
            <Trans i18nKey="designSystemDescriptionFull">
              All design tokens and components for the law firm website. Values are defined once in <code>src/theme/tokens.ts</code> and injected as CSS custom properties at runtime.
            </Trans>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* ═══════════════════════ COMPONENTS ═══════════════════════ */}

      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('components')}</h2>

        {/* Button */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Button</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="glass">Glass</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        {/* Button Glass — on gradient */}
        <div style={{
          ...showcaseBox,
          background: 'var(--gradient-glass-a)',
        }}>
          <span style={{ ...showcaseLabel, color: '#fff' }}>Button — Glass on Gradient</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="glass" size="sm">Glass SM</Button>
            <Button variant="glass">Glass MD</Button>
            <Button variant="glass" size="lg">Glass LG</Button>
          </div>
        </div>

        {/* Text & Heading */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Heading & Text</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} aria-hidden="true">
            <Heading level={1}>Heading Level 1</Heading>
            <Heading level={2}>Heading Level 2</Heading>
            <Heading level={3}>Heading Level 3</Heading>
            <Heading level={4}>Heading Level 4</Heading>
            <Divider spacing="sm" />
            <Text variant="lead">Lead text — for introductory paragraphs and summaries.</Text>
            <Text variant="body">Body text — the default reading size for long-form content.</Text>
            <Text variant="small">Small text — used for captions and secondary information.</Text>
            <Text variant="label">Label Text</Text>
            <Text variant="overline">Overline Text</Text>
          </div>
        </div>

        {/* Badge */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Badge</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge>Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* Divider */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Divider</span>
          <Text variant="small">Small spacing</Text>
          <Divider spacing="sm" />
          <Text variant="small">Medium spacing</Text>
          <Divider spacing="md" />
          <Text variant="small">Large spacing</Text>
          <Divider spacing="lg" />
          <Text variant="small">Content below</Text>
        </div>

        {/* Input & Textarea */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Input & Textarea</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <Input label="Full Name" placeholder="John Smith" />
            <Input label="Email" type="email" placeholder="john@example.com" error="Please enter a valid email" />
            <Textarea label="Message" placeholder="Write something..." />
          </div>
        </div>

        {/* Section */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Section</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Section variant="default">
              <Container><Text variant="label">Default Section</Text></Container>
            </Section>
            <Section variant="surface">
              <Container><Text variant="label">Surface Section</Text></Container>
            </Section>
            <Section variant="accent">
              <Container><Text variant="label">Accent Section</Text></Container>
            </Section>
          </div>
        </div>

        {/* Card */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Card</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            <Card variant="bordered">
              <CardHeader><Heading level={3}>Bordered Card</Heading></CardHeader>
              <CardBody><Text variant="small">A card with a subtle border and structured sub-components.</Text></CardBody>
              <CardFooter><Button variant="ghost" size="sm">Learn More</Button></CardFooter>
            </Card>
            <Card variant="elevated">
              <CardHeader><Heading level={3}>Elevated Card</Heading></CardHeader>
              <CardBody><Text variant="small">A card with shadow elevation for emphasis.</Text></CardBody>
              <CardFooter><Button variant="primary" size="sm">Action</Button></CardFooter>
            </Card>
          </div>
        </div>

        {/* Glass Card */}
        <div style={{
          ...showcaseBox,
          background: 'var(--gradient-glass-a)',
          padding: 0,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 32px 0' }}><span style={{ ...showcaseLabel, color: '#fff' }}>Glass Card</span></div>
          <div style={{ padding: '16px 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            <GlassCard intensity="light">
              <Heading level={3} className="glass-demo-heading">Light Glass</Heading>
              <Text variant="small" className="glass-demo-text">A subtle frosted glass effect with a light blur — ideal for overlaying colorful backgrounds.</Text>
            </GlassCard>
            <GlassCard intensity="medium">
              <Heading level={3} className="glass-demo-heading">Medium Glass</Heading>
              <Text variant="small" className="glass-demo-text">The default intensity — balanced translucency and readability.</Text>
            </GlassCard>
            <GlassCard intensity="strong">
              <Heading level={3} className="glass-demo-heading">Strong Glass</Heading>
              <Text variant="small" className="glass-demo-text">Higher opacity and stronger blur for maximum content legibility.</Text>
            </GlassCard>
            <GlassCard intensity="medium" glow>
              <Heading level={3} className="glass-demo-heading">Glow Effect</Heading>
              <Text variant="small" className="glass-demo-text">Glass card with an ambient accent glow — great for featured items and CTAs.</Text>
            </GlassCard>
          </div>
        </div>

        {/* Card glass variants */}
        <div style={{
          ...showcaseBox,
          background: 'var(--gradient-glass-b)',
          padding: 0,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 32px 0' }}><span style={{ ...showcaseLabel, color: '#fff' }}>Card — Glass Variants</span></div>
          <div style={{ padding: '16px 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            <Card variant="glass">
              <CardHeader><Heading level={3} className="glass-demo-heading">Glass Card</Heading></CardHeader>
              <CardBody><Text variant="small" className="glass-demo-text">The standard Card component with the glass variant applied.</Text></CardBody>
              <CardFooter><Button variant="secondary" size="sm">Details</Button></CardFooter>
            </Card>
            <Card variant="glass-strong">
              <CardHeader><Heading level={3} className="glass-demo-heading">Glass Strong</Heading></CardHeader>
              <CardBody><Text variant="small" className="glass-demo-text">Stronger glass variant for higher contrast on busy backgrounds.</Text></CardBody>
              <CardFooter><Button size="sm">Contact Us</Button></CardFooter>
            </Card>
          </div>
        </div>

        {/* Hero */}
        <div style={{ ...showcaseBox, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 32px 0' }}><span style={showcaseLabel}>Hero</span></div>
          <Hero
            overline="Trusted Legal Counsel"
            title="Protecting Your Rights, Securing Your Future"
            subtitle="For over 30 years, our attorneys have provided dedicated legal representation to individuals and businesses across the nation."
            actions={
              <>
                <Button>Schedule Consultation</Button>
                <Button variant="secondary">Our Practice Areas</Button>
              </>
            }
          />
        </div>

        {/* Navbar */}
        <div style={{ ...showcaseBox, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 32px 0' }}><span style={showcaseLabel}>Navbar</span></div>
          <Navbar
            logo={<span>Mitchell & Associates</span>}
            links={[
              { label: 'About', href: '#' },
              { label: 'Practice Areas', href: '#' },
              { label: 'Attorneys', href: '#' },
              { label: 'Contact', href: '#' },
            ]}
            cta={<Button size="sm">Free Consultation</Button>}
          />
        </div>

        {/* PracticeAreaCard */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Practice Area Card</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            <PracticeAreaCard
              icon={<span>&#9878;</span>}
              title="Corporate Law"
              description="Comprehensive legal solutions for businesses of all sizes, from formation to mergers and acquisitions."
            />
            <PracticeAreaCard
              icon={<span>&#9879;</span>}
              title="Family Law"
              description="Compassionate representation in divorce, custody, and adoption proceedings."
            />
            <PracticeAreaCard
              icon={<span>&#9881;</span>}
              title="Intellectual Property"
              description="Protecting your innovations, trademarks, and creative works with vigorous legal defense."
            />
          </div>
        </div>

        {/* AttorneyCard */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Attorney Card</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            <AttorneyCard
              name="Sarah Mitchell"
              title="Managing Partner"
              specialties={['Corporate Law', 'M&A']}
              bio="20+ years of experience leading complex corporate transactions and litigation."
            />
            <AttorneyCard
              name="James Chen"
              title="Senior Associate"
              specialties={['Family Law', 'Mediation']}
              bio="Dedicated to achieving fair outcomes for families through compassionate legal counsel."
            />
            <AttorneyCard
              name="Elena Rodriguez"
              title="Partner"
              specialties={['IP', 'Technology']}
              bio="Specializing in patent prosecution and technology licensing agreements."
            />
          </div>
        </div>

        {/* TestimonialCard */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Testimonial Card</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            <TestimonialCard
              quote="They handled our acquisition with incredible precision and professionalism. Truly world-class counsel."
              author="David Park"
              role="CEO, TechVentures Inc."
            />
            <TestimonialCard
              quote="During the most difficult time of my life, this team gave me clarity and confidence. I cannot thank them enough."
              author="Maria Santos"
              role="Client"
            />
          </div>
        </div>

        {/* ContactForm */}
        <div style={showcaseBox}>
          <span style={showcaseLabel}>Contact Form</span>
          <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />
        </div>

        {/* Footer */}
        <div style={{ ...showcaseBox, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 32px 0' }}><span style={showcaseLabel}>Footer</span></div>
          <Footer
            logo={<span>Mitchell & Associates</span>}
            columns={[
              {
                title: 'Practice Areas',
                links: [
                  { label: 'Corporate Law', href: '#' },
                  { label: 'Family Law', href: '#' },
                  { label: 'Intellectual Property', href: '#' },
                ],
              },
              {
                title: 'Firm',
                links: [
                  { label: 'About Us', href: '#' },
                  { label: 'Our Attorneys', href: '#' },
                  { label: 'Careers', href: '#' },
                ],
              },
              {
                title: 'Contact',
                links: [
                  { label: '(555) 123-4567', href: 'tel:5551234567' },
                  { label: 'info@mitchell-law.com', href: 'mailto:info@mitchell-law.com' },
                  { label: '100 Legal Plaza, Suite 500', href: '#' },
                ],
              },
            ]}
            bottom={<span>&copy; 2026 Mitchell & Associates LLP. All rights reserved.</span>}
          />
        </div>
      </section>

      {/* ═══════════════════════ TOKENS ═══════════════════════ */}

      {/* Colors */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('colors')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <ColorSwatches mode={t('light')} tokens={colors.light} />
          <ColorSwatches mode={t('dark')} tokens={colors.dark} />
        </div>
      </section>

      {/* Typography */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('typography')}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
          {Object.entries(fonts).map(([key, family]) => (
            <div key={key} style={{ padding: '24px', background: 'var(--surface)', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <span style={labelStyle}>{key} &mdash; <code style={{ background: 'none', padding: 0, fontSize: '11px' }}>var(--{key})</code></span>
              <p style={{ fontFamily: family, fontSize: '28px', marginTop: '12px', letterSpacing: '-0.5px' }}>
                {t('pangram')}
              </p>
              <p style={{ ...monoSmall, marginTop: '8px', opacity: 0.75 }}>{family}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <TokenTable title={t('fontSizes')} tokens={fontSizes} />
          <TokenTable title={t('lineHeights')} tokens={lineHeights} />
          <TokenTable title={t('letterSpacings')} tokens={letterSpacings} />
        </div>
      </section>

      {/* Spacing */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('spacing')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', width: '30px' }}>{key}</span>
              <div style={{ width: value, height: '24px', background: 'var(--accent)', borderRadius: '2px', minWidth: '2px' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', opacity: 0.75 }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Radii */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('borderRadii')}</h2>
        <div style={{ display: 'flex', gap: '24px' }}>
          {Object.entries(radii).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--accent)', borderRadius: value, marginBottom: '8px' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{key}</span>
              <br />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', opacity: 0.75 }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Glass Tokens */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('glassTokens')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <TokenTable title={t('light')} tokens={glass.light} />
          <TokenTable title={t('dark')} tokens={glass.dark} />
        </div>
      </section>

      {/* Layout & Misc */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '32px', marginBottom: '32px' }}>{t('layoutMisc')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          <TokenTable title={t('breakpoints')} tokens={breakpoints} />
          <TokenTable title={t('layout')} tokens={layout} />
          <TokenTable title={t('transitions')} tokens={transitions} />
        </div>
      </section>
    </main>
  );
}
