const en = {
  // ─── Navbar ──────────────────────────────────────────────────────────────────
  firmName: 'NOMOS',
  firmTagline: 'Legal & Advisory',
  navPractice: 'Practice Areas',
  navTeam: 'Our Team',
  navAbout: 'About',
  navTestimonials: 'Testimonials',
  navContact: 'Contact',
  navCta: 'Book Consultation',

  // ─── Hero ────────────────────────────────────────────────────────────────────
  heroOverline: 'Modern Legal Practice in Athens',
  heroTitle: 'Where tradition meets the future of law',
  heroSubtitle:
    'A new-generation legal practice combining deep expertise in real estate, startup funding, maritime, and cryptocurrency law. Built for ambitious professionals navigating tomorrow\u2019s challenges.',
  heroCta: 'Schedule a Consultation',
  heroSecondaryCta: 'Explore Our Practice',

  // ─── Practice Areas ──────────────────────────────────────────────────────────
  practiceOverline: 'Practice Areas',
  practiceTitle: 'Focused expertise for a changing world',
  practiceSubtitle:
    'Four pillars of specialization designed for forward-thinking clients who need precision, speed, and strategic depth.',

  practiceRealEstateTitle: 'Real Estate',
  practiceRealEstateDesc:
    'Full-spectrum property counsel \u2014 acquisitions, development permits, title due diligence, lease structuring, and cross-border transactions across Greece and the EU.',

  practiceStartupTitle: 'Startup & Venture Capital',
  practiceStartupDesc:
    'Seed to Series C and beyond. SAFE notes, shareholder agreements, cap table structuring, investor negotiations, and regulatory compliance for tech ventures.',

  practiceMaritimeTitle: 'Maritime Law',
  practiceMaritimeDesc:
    'Ship finance, charter party disputes, cargo claims, flag state compliance, and environmental regulations. Decades of Piraeus shipping corridor experience.',

  practiceCryptoTitle: 'Cryptocurrency & Digital Assets',
  practiceCryptoDesc:
    'Token issuance, DeFi protocol compliance, MiCA regulatory frameworks, exchange licensing, DAO governance structures, and digital asset dispute resolution.',

  // ─── Team / Attorneys ────────────────────────────────────────────────────────
  teamOverline: 'Our Team',
  teamTitle: 'Partners who understand your world',
  teamSubtitle:
    'Two attorneys. Two complementary visions. One commitment to delivering results that move you forward.',

  attorney1Name: 'Dimitris Afendras',
  attorney1Title: 'Founding Partner',
  attorney1Bio:
    'Dimitris brings sharp transactional instinct to property and startup clients. Known for structuring complex real estate deals and guiding founders through critical funding milestones with clarity and precision.',
  attorney1Spec1: 'Real Estate',
  attorney1Spec2: 'Startup Funding',
  attorney1Spec3: 'Venture Capital',

  attorney2Name: 'Alexandra Marinaki',
  attorney2Title: 'Founding Partner',
  attorney2Bio:
    'Alexandra navigates the intersection of traditional maritime law and the digital asset frontier. Her dual expertise allows clients to move confidently through both high-seas disputes and blockchain regulation.',
  attorney2Spec1: 'Maritime Law',
  attorney2Spec2: 'Cryptocurrency',
  attorney2Spec3: 'Digital Assets',

  // ─── Stats ───────────────────────────────────────────────────────────────────
  statClients: 'Clients Served',
  statTransactions: 'In Transactions',
  statYears: 'Years Combined Experience',
  statJurisdictions: 'Jurisdictions',

  // ─── Testimonials ────────────────────────────────────────────────────────────
  testimonialsOverline: 'What Clients Say',
  testimonialsTitle: 'Trusted by ambitious professionals',

  testimonial1Quote:
    'NOMOS guided our Series A from term sheet to close in 6 weeks. Their understanding of both Greek and EU venture frameworks saved us months of back-and-forth.',
  testimonial1Author: 'Yiannis Papadopoulos',
  testimonial1Role: 'CEO, Hellas Fintech',

  testimonial2Quote:
    'The maritime team handled a complex charter dispute that three other firms couldn\u2019t resolve. Professional, relentless, and deeply knowledgeable.',
  testimonial2Author: 'Captain Nikos Stavridis',
  testimonial2Role: 'Fleet Manager, Aegean Shipping Co.',

  testimonial3Quote:
    'When we needed to structure our tokenized real estate platform under MiCA, they were the only firm in Athens that could handle both sides \u2014 property law and crypto regulation.',
  testimonial3Author: 'Elena Konstantinou',
  testimonial3Role: 'Founder, PropChain',

  // ─── Contact ─────────────────────────────────────────────────────────────────
  contactOverline: 'Get in Touch',
  contactTitle: 'Let\u2019s discuss your next move',
  contactSubtitle:
    'Whether you\u2019re closing a deal, launching a venture, or navigating regulatory waters \u2014 we\u2019re ready to help.',
  contactAddress: '12 Vasilissis Sofias Avenue, Athens 10674, Greece',
  contactEmail: 'info@nomos.legal',
  contactPhone: '+30 210 123 4567',

  // ─── Footer ──────────────────────────────────────────────────────────────────
  footerPractice: 'Practice',
  footerFirm: 'Firm',
  footerConnect: 'Connect',
  footerAbout: 'About Us',
  footerCareers: 'Careers',
  footerPrivacy: 'Privacy Policy',
  footerLinkedIn: 'LinkedIn',
  footerEmail: 'Email',
  footerCopyright: '\u00A9 2026 NOMOS Legal & Advisory. All rights reserved. Athens, Greece.',

  // ─── Design System page ──────────────────────────────────────────────────────
  designSystem: 'Design System',
  designSystemTitle: 'The Monolithic Sanctuary',
  designSystemDescription:
    'All design tokens for the law firm website. Values are defined once in <code>src/theme/tokens.ts</code> and injected as CSS custom properties at runtime.',
  light: 'Light',
  dark: 'Dark',
  colors: 'Colors',
  typography: 'Typography',
  pangram: 'The quick brown fox jumps over the lazy dog',
  fontSizes: 'Font Sizes',
  lineHeights: 'Line Heights',
  letterSpacings: 'Letter Spacings',
  spacing: 'Spacing',
  borderRadii: 'Border Radii',
  layoutMisc: 'Layout & Misc',
  breakpoints: 'Breakpoints',
  layout: 'Layout',
  transitions: 'Transitions',
  glassTokens: 'Glass Tokens',
  themeSystem: 'system',
  themeLight: 'light',
  themeDark: 'dark',
  themeLabel: 'Theme: {{mode}}. Click to change.',
  components: 'Components',
  designSystemDescriptionFull:
    'All design tokens and components for the law firm website. Values are defined once in <code>src/theme/tokens.ts</code> and injected as CSS custom properties at runtime.',
  language: 'Language',
} as const;

export default en;
