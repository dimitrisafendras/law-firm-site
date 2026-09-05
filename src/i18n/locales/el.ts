import type en from './en';

// Typed against the English locale (source of truth): a missing or extra key,
// or a non-string value, is a compile error. Keeps the two locales in lockstep.
const el = {
  // ─── Navbar ──────────────────────────────────────────────────────────────────
  firmName: 'NOMOS',
  firmTagline: 'Νομικές Υπηρεσίες',
  navPractice: 'Τομείς Δικαίου',
  navTeam: 'Η Ομάδα μας',
  navAbout: 'Σχετικά',
  navTestimonials: 'Μαρτυρίες',
  navContact: 'Επικοινωνία',
  navCta: 'Κλείστε Ραντεβού',

  // ─── Hero ────────────────────────────────────────────────────────────────────
  heroOverline: 'Η Τομή Κληρονομιάς & Καινοτομίας',
  heroTitleLine1: 'Υπέρτατη',
  heroTitleLine2: 'Νομική Συμβουλευτική',
  heroTitle: 'Υπέρτατη Νομική Συμβουλευτική',
  heroSubtitle:
    'Ένα δικηγορικό γραφείο νέας γενιάς που συνδυάζει βαθιά εξειδίκευση σε ακίνητα, χρηματοδότηση startups, ναυτικό δίκαιο και κρυπτονομίσματα. Σχεδιασμένο για φιλόδοξους επαγγελματίες.',
  heroCta: 'Εκκίνηση Πρωτοκόλλου',
  heroSecondaryCta: 'Ανάλυση Πληροφοριών',

  // ─── Practice Areas ──────────────────────────────────────────────────────────
  practiceOverline: 'Τομείς Δικαίου',
  practiceTitle: 'Η Εξειδίκευσή μας',
  practiceSubtitle:
    'Τέσσερις πυλώνες εξειδίκευσης για πελάτες που χρειάζονται ακρίβεια και βάθος.',

  // `num` is the roman numeral of the card (I..IV), supplied by PracticeGrid.
  practiceDomainNum: 'Τομέας {{num}}',
  practiceExploreDomain: 'Δείτε τον Τομέα',

  practiceRealEstateTitle: 'Ακίνητα',
  practiceRealEstateDesc:
    'Ολοκληρωμένη νομική κάλυψη ακινήτων \u2014 αγορές, άδειες ανάπτυξης, έλεγχοι τίτλων, δομή μισθώσεων και διασυνοριακές συναλλαγές σε Ελλάδα και ΕΕ.',

  practiceStartupTitle: 'Startups & Επιχειρηματικά Κεφάλαια',
  practiceStartupDesc:
    'Από το seed στο Series C και πέρα. SAFE notes, συμφωνίες μετόχων, δομή κεφαλαιακών πινάκων, διαπραγματεύσεις με επενδυτές και κανονιστική συμμόρφωση.',

  practiceMaritimeTitle: 'Ναυτικό Δίκαιο',
  practiceMaritimeDesc:
    'Ναυτιλιακή χρηματοδότηση, διαφορές ναυλοσυμφώνων, απαιτήσεις φορτίων, συμμόρφωση σημαίας και περιβαλλοντικοί κανονισμοί. Δεκαετίες εμπειρίας στον Πειραιά.',

  practiceCryptoTitle: 'Κρυπτονομίσματα & Ψηφιακά Περιουσιακά',
  practiceCryptoDesc:
    'Έκδοση tokens, συμμόρφωση DeFi, κανονιστικό πλαίσιο MiCA, αδειοδότηση ανταλλακτηρίων, δομές διακυβέρνησης DAO και επίλυση διαφορών ψηφιακών περιουσιακών.',

  // ─── Team / Attorneys ────────────────────────────────────────────────────────
  teamOverline: 'Φιλοσοφία Εταίρων',
  teamTitle: 'Οι Εταίροι μας',
  partnerEthosLine1: 'Αρχιτεκτονική',
  partnerEthosLine2: 'Νομολογία',
  partnerQuote: 'Ο νόμος δεν είναι αντιδραστικό φράγμα· είναι το σχέδιο πάνω στο οποίο χτίζονται αυτοκρατορίες.',
  teamSubtitle:
    'Δύο δικηγόροι, δύο οράματα, μία δέσμευση να σας ωθήσουμε μπροστά.',

  attorney1Name: 'Δημήτρης Αφένδρας',
  attorney1Title: 'Ιδρυτικός Εταίρος',
  attorney1Bio:
    'Ο Δημήτρης φέρνει οξεία συναλλακτική ενστικτο στους πελάτες ακινήτων και startups. Γνωστός για τη δόμηση σύνθετων συμφωνιών ακινήτων και την καθοδήγηση ιδρυτών σε κρίσιμα ορόσημα χρηματοδότησης.',
  attorney1Spec1: 'Ακίνητα',
  attorney1Spec2: 'Χρηματοδότηση Startups',
  attorney1Spec3: 'Επιχειρηματικά Κεφάλαια',
  attorney1Focus: 'Συναλλακτική Στρατηγική',
  attorney1Origin: 'Αθήνα',

  attorney2Name: 'Αλεξάνδρα Μαρινάκη',
  attorney2Title: 'Ιδρυτική Εταίρος',
  attorney2Bio:
    'Η Αλεξάνδρα πλοηγείται στη διασταύρωση παραδοσιακού ναυτικού δικαίου και ψηφιακών περιουσιακών. Η διπλή εξειδίκευσή της επιτρέπει στους πελάτες να κινούνται με σιγουριά.',
  attorney2Spec1: 'Ναυτικό Δίκαιο',
  attorney2Spec2: 'Κρυπτονομίσματα',
  attorney2Spec3: 'Ψηφιακά Περιουσιακά',
  attorney2Focus: 'Διασυνοριακή Ρύθμιση',
  attorney2Origin: 'Πειραιάς',

  teamFocusLabel: 'Εστίαση',
  teamOriginLabel: 'Καταγωγή',

  // ─── Network / Map ──────────────────────────────────────────────────────────
  networkOverline: 'Η Εμβέλειά μας',
  networkTitle: 'Παγκόσμιο Δίκτυο',
  networkSubtitle: 'Στρατηγική παρουσία σε κρίσιμες δικαιοδοσίες για διασυνοριακή συμβουλευτική.',

  networkAthensLabel: 'Ευρωπαϊκά Κεντρικά',
  networkAthensCity: 'Αθήνα, GR',
  networkAthensItem1: 'Ακίνητα & Δίκαιο Startups',
  networkAthensItem2: 'Κανονιστική Συμμόρφωση ΕΕ',
  networkAthensItem3: 'Δόμηση Επιχειρηματικών Κεφαλαίων',

  networkPiraeusLabel: 'Ναυτιλιακός Κόμβος',
  networkPiraeusCity: 'Πειραιάς, GR',
  networkPiraeusItem1: 'Ναυτικές Διαφορές & Χρηματοδότηση',
  networkPiraeusItem2: 'Συμμόρφωση Σημαίας',
  networkPiraeusItem3: 'Συμβουλευτική Ναυτιλιακού Διαδρόμου',

  networkDigitalLabel: 'Ψηφιακή Δικαιοδοσία',
  networkDigitalCity: 'Αποκεντρωμένο',
  networkDigitalItem1: 'Ρύθμιση Κρυπτονομισμάτων',
  networkDigitalItem2: 'Συμμόρφωση Πρωτοκόλλων DeFi',
  networkDigitalItem3: 'Δομές Διακυβέρνησης DAO',

  networkConnectNode: 'Σύνδεση Κόμβου',
  // Caption on the map pin.
  networkPinLabel: 'Αθήνα',

  // ─── Stats ───────────────────────────────────────────────────────────────────
  statClients: 'Πελάτες',
  statTransactions: 'Σε Συναλλαγές',
  statYears: 'Χρόνια Συνολικής Εμπειρίας',
  statJurisdictions: 'Δικαιοδοσίες',

  // Stat figures. StatsBar counts up to the leading digits and prints whatever
  // trails them verbatim, so '2δισ.+' animates 0 -> 2 and then reads '2δισ.+'.
  statClientsValue: '500+',
  statTransactionsValue: '2δισ.+',
  statYearsValue: '30+',
  statJurisdictionsValue: '12',

  // ─── Testimonials ────────────────────────────────────────────────────────────
  testimonialsOverline: 'Τι Λένε οι Πελάτες',
  testimonialsTitle: 'Μαρτυρίες Πελατών',
  testimonialsSubtitle: 'Εμπιστοσύνη από φιλόδοξους επαγγελματίες σε κάθε κλάδο.',

  testimonial1Quote:
    'Η NOMOS καθοδήγησε το Series A μας από term sheet σε κλείσιμο σε 6 εβδομάδες. Η κατανόησή τους του ελληνικού και ευρωπαϊκού πλαισίου μας γλίτωσε μήνες.',
  testimonial1Author: 'Γιάννης Παπαδόπουλος',
  testimonial1Role: 'CEO, Hellas Fintech',

  testimonial2Quote:
    'Η ναυτιλιακή ομάδα χειρίστηκε μια σύνθετη διαφορά ναύλωσης που τρία άλλα γραφεία δεν μπορούσαν να επιλύσουν. Επαγγελματισμός και βαθιά γνώση.',
  testimonial2Author: 'Καπτ. Νίκος Σταυρίδης',
  testimonial2Role: 'Διευθυντής Στόλου, Aegean Shipping Co.',

  testimonial3Quote:
    'Όταν χρειαστήκαμε να δομήσουμε την tokenized πλατφόρμα ακινήτων μας υπό το MiCA, ήταν το μόνο γραφείο στην Αθήνα που μπορούσε να χειριστεί και τα δύο \u2014 δίκαιο ακινήτων και κανονισμό κρυπτονομισμάτων.',
  testimonial3Author: 'Ελένη Κωνσταντίνου',
  testimonial3Role: 'Ιδρύτρια, PropChain',

  testimonial4Quote:
    'Ολοκληρώσαμε την αγορά έξι ακινήτων σε Αθήνα και Κυκλάδες σε λιγότερο από τέσσερις μήνες. Ο έλεγχος τίτλων ήταν άψογος και κάθε ζήτημα αδειοδότησης τέθηκε προτού προλάβει να γίνει πρόβλημα.',
  testimonial4Author: 'Μαρίνα Βλάχου',
  testimonial4Role: 'Διευθύνουσα Σύμβουλος, Astrea Estates',

  testimonial5Quote:
    'Η αδειοδότηση του ανταλλακτηρίου μας υπό το MiCA ήταν αχαρτογράφητο έδαφος για όλους. Χάραξαν τον οδικό χάρτη, κράτησαν τη γραμμή απέναντι στον επόπτη και τήρησαν το χρονοδιάγραμμα που δεσμεύτηκαν.',
  testimonial5Author: 'Θάνος Βεργής',
  testimonial5Role: 'Συνιδρυτής, Meridian Digital Assets',

  testimonial6Quote:
    'Ανασχεδίασαν τον κεφαλαιακό μας πίνακα πριν τον γύρο seed και μας γλίτωσαν από μια δομή που θα μας στοίχιζε τον έλεγχο της εταιρείας δύο χρόνια αργότερα. Συμβουλευτική που σκέφτεται τρεις κινήσεις μπροστά.',
  testimonial6Author: 'Σοφία Ανδρέου',
  testimonial6Role: 'Ιδρύτρια, Kyma Robotics',

  // Carousel accessibility strings. These reach the user through ARIA
  // attributes, so they are read by assistive technology rather than rendered.
  testimonialsCarouselRole: 'καρουζέλ',
  testimonialsSlideRole: 'διαφάνεια',
  testimonialsSlidePosition: '{{current}} από {{total}}',
  testimonialsPrevLabel: 'Προηγούμενη μαρτυρία',
  testimonialsNextLabel: 'Επόμενη μαρτυρία',
  testimonialsGoToLabel: 'Μετάβαση στη μαρτυρία {{index}}',

  // ─── CTA ──────────────────────────────────────────────────────────────────────
  ctaTitle: 'Έτοιμοι να Εξασφαλίσετε\nτο Μέλλον σας;',
  ctaSubtitle: 'Η πρωτοπορία είναι αμείλικτη για τους απροετοίμαστους. Συνεργαστείτε με τους αρχιτέκτονες κυρίαρχης ανάπτυξης σήμερα.',
  ctaButton: 'Εκκίνηση Πρωτοκόλλου Τώρα',

  // ─── Contact ─────────────────────────────────────────────────────────────────
  contactOverline: 'Επικοινωνία',
  contactTitle: 'Επικοινωνήστε',
  contactSubtitle:
    'Συμφωνία, εγχείρημα ή κανονιστική πλοήγηση \u2014 είμαστε έτοιμοι.',
  contactAddress: 'Λεωφ. Βασιλίσσης Σοφίας 12, Αθήνα 10674, Ελλάδα',
  contactEmail: 'info@nomos.legal',
  contactPhone: '+30 210 123 4567',

  // Contact form. Labels and placeholders reach the DOM as element text and
  // attributes on Input / Textarea, so they stay plain t() lookups.
  contactFormName: 'Ονοματεπώνυμο',
  contactFormNamePlaceholder: 'Γιώργος Παπαδόπουλος',
  contactFormEmail: 'Email',
  contactFormEmailPlaceholder: 'giorgos@example.com',
  contactFormPhone: 'Τηλέφωνο',
  contactFormPhonePlaceholder: '+30 694 123 4567',
  contactFormMessage: 'Πώς μπορούμε να βοηθήσουμε;',
  contactFormMessagePlaceholder: 'Περιγράψτε συνοπτικά την υπόθεσή σας…',
  contactFormSubmit: 'Αίτημα Συνάντησης',

  // ─── Footer ──────────────────────────────────────────────────────────────────
  footerPractice: 'Τομείς',
  footerFirm: 'Γραφείο',
  footerConnect: 'Σύνδεση',
  footerAbout: 'Σχετικά με εμάς',
  footerCareers: 'Καριέρα',
  footerPrivacy: 'Πολιτική Απορρήτου',
  footerLinkedIn: 'LinkedIn',
  footerEmail: 'Email',
  footerCopyright: '\u00A9 2026 NOMOS Νομικές Υπηρεσίες. Με επιφύλαξη παντός δικαιώματος. Αθήνα, Ελλάδα.',

  // ─── Design System page ──────────────────────────────────────────────────────
  designSystem: 'Σύστημα Σχεδιασμού',
  designSystemTitle: 'Το Μονολιθικό Καταφύγιο',
  designSystemDescription:
    'Όλα τα design tokens για την ιστοσελίδα του δικηγορικού γραφείου. Οι τιμές ορίζονται μία φορά στο <code>src/theme/tokens.ts</code> και εισάγονται ως CSS custom properties κατά την εκτέλεση.',
  light: 'Ανοιχτό',
  dark: 'Σκοτεινό',
  colors: 'Χρώματα',
  typography: 'Τυπογραφία',
  pangram: 'Ξεσκεπάζω τη βαθιά ψυχοφθόρα σας αντίληψη',
  fontSizes: 'Μεγέθη Γραμματοσειράς',
  lineHeights: 'Ύψη Γραμμής',
  letterSpacings: 'Αποστάσεις Γραμμάτων',
  spacing: 'Αποστάσεις',
  borderRadii: 'Ακτίνες Περιγράμματος',
  layoutMisc: 'Διάταξη & Διάφορα',
  breakpoints: 'Σημεία Αλλαγής',
  layout: 'Διάταξη',
  transitions: 'Μεταβάσεις',
  glassTokens: 'Glass Tokens',
  themeSystem: 'σύστημα',
  themeLight: 'ανοιχτό',
  themeDark: 'σκοτεινό',
  themeLabel: 'Θέμα: {{mode}}. Κλικ για αλλαγή.',
  components: 'Στοιχεία',
  designSystemDescriptionFull:
    'Όλα τα design tokens και τα στοιχεία για την ιστοσελίδα του δικηγορικού γραφείου. Οι τιμές ορίζονται μία φορά στο <code>src/theme/tokens.ts</code> και εισάγονται ως CSS custom properties κατά την εκτέλεση.',
  language: 'Γλώσσα',

  // ─── Authentication ──────────────────────────────────────────────────────────
  authLogin: 'Σύνδεση',
  authSignup: 'Δημιουργία Λογαριασμού',
  authLogout: 'Αποσύνδεση',
  authEmail: 'Email',
  authPassword: 'Κωδικός πρόσβασης',
  authConfirmPassword: 'Επιβεβαίωση κωδικού',
  authSubmitLogin: 'Σύνδεση',
  authSubmitSignup: 'Δημιουργία Λογαριασμού',
  authSwitchToSignup: 'Δεν έχετε λογαριασμό; Δημιουργήστε έναν',
  authSwitchToLogin: 'Έχετε ήδη λογαριασμό; Συνδεθείτε',
  authOrContinueWith: 'Ή συνεχίστε με',
  authProviderGoogle: 'Google',
  authProviderGithub: 'GitHub',
  authProviderApple: 'Apple',
  authProviderLinkedin: 'LinkedIn',
  authErrorGeneric: 'Κάτι δεν πήγε καλά. Δοκιμάστε ξανά.',
  authErrorInvalidCredentials: 'Το email ή ο κωδικός πρόσβασης δεν είναι σωστός.',
  authErrorPasswordMismatch: 'Οι δύο κωδικοί δεν ταυτίζονται.',
  authErrorPasswordShort: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.',
  authCheckEmail:
    'Ελέγξτε τα εισερχόμενά σας \u2014 στείλαμε σύνδεσμο για την επιβεβαίωση της διεύθυνσής σας.',
  authAccountTitle: 'Ο Λογαριασμός σας',
  authAccountEmail: 'Email',
  authAccountRole: 'Ρόλος',
  authRoleAdmin: 'Διαχειριστής',
  authRoleUser: 'Πελάτης',
  authBackToSite: 'Επιστροφή στον ιστότοπο',
  authAdminHint: 'Ως διαχειριστής μπορείτε να επεξεργαστείτε απευθείας κάθε κείμενο του ιστότοπου.',

  // ─── Inline content editor ───────────────────────────────────────────────────
  editSave: 'Αποθήκευση',
  editCancel: 'Ακύρωση',
  editSaving: 'Αποθήκευση\u2026',
  editError: 'Η αλλαγή δεν αποθηκεύτηκε. Δοκιμάστε ξανά.',

  // ─── Attorney 3 (crypto) ─────────────────────────────────────────────────────
  // PLACEHOLDER NAME — replace with the real partner's details.
  attorney3Name: 'Σταύρος Λεβέντης',
  attorney3Title: 'Εταίρος',
  attorney3Bio:
    'Ο Σταύρος συμβουλεύει ιδρυτές και επενδυτικά σχήματα που δραστηριοποιούνται στο ρυθμιστικό μέτωπο των ψηφιακών περιουσιακών στοιχείων. Δομεί εκδόσεις tokens, καθοδηγεί πρωτόκολλα στην αδειοδότηση MiCA και χειρίζεται διαφορές όπου ο κώδικας συναντά το δίκαιο των συμβάσεων.',
  attorney3Spec1: 'Ψηφιακά Περιουσιακά Στοιχεία',
  attorney3Spec2: 'DeFi & Web3',
  attorney3Spec3: 'Συμμόρφωση MiCA',
  attorney3Focus: 'Ρυθμιστική Αρχιτεκτονική',
  attorney3Origin: 'Αθήνα',

  // ─── Admin: user management ──────────────────────────────────────────────────
  adminUsersTitle: 'Εγγεγραμμένοι Χρήστες',
  adminUsersSubtitle: 'Όλοι όσοι έχουν λογαριασμό και τα δικαιώματά τους.',
  adminUsersEmail: 'Email',
  adminUsersRole: 'Ρόλος',
  adminUsersCreated: 'Εγγραφή',
  adminUsersActions: 'Ενέργειες',
  adminUsersPromote: 'Ορισμός ως διαχειριστή',
  adminUsersDemote: 'Αφαίρεση διαχειριστή',
  adminUsersEmpty: 'Δεν υπάρχουν λογαριασμοί ακόμη.',
  adminUsersLoading: 'Φόρτωση λογαριασμών\u2026',
  adminUsersError: 'Η φόρτωση των λογαριασμών απέτυχε. Δοκιμάστε ξανά.',
  adminUsersUpdateError: 'Η αλλαγή δεν αποθηκεύτηκε. Δοκιμάστε ξανά.',
  adminUsersForbidden: 'Η σελίδα αυτή είναι μόνο για διαχειριστές.',
  adminUsersSelf: 'Εσείς',
  adminUsersLastAdmin: 'Δεν μπορείτε να αφαιρέσετε τον τελευταίο διαχειριστή.',
  navAdminUsers: 'Χρήστες',
  menuOpen: 'Μενού λογαριασμού',
  menuEditMode: 'Λειτουργία επεξεργασίας',
  menuLanguage: 'Γλώσσα',

  // ─── Section chapter labels ──────────────────────────────────────────────────
  chapterExpertise: 'Κεφάλαιο 01 / Εξειδίκευση',
  chapterTeam: 'Κεφάλαιο 02 / Ομάδα',
  chapterNetwork: 'Κεφάλαιο 03 / Δίκτυο',
  chapterTestimonials: 'Κεφάλαιο 04 / Μαρτυρίες',
  chapterContact: 'Κεφάλαιο 05 / Επικοινωνία',

  // ─── Design System showcase labels ───────────────────────────────────────────
  dsAuthComponents: 'Ταυτοποίηση & Επεξεργασία Κειμένου',
  dsAuthFormLogin: 'AuthForm — σύνδεση',
  dsAuthFormSignup: 'AuthForm — εγγραφή',
  dsProviderButtons: 'ProviderButtons',
  dsEditableText: 'EditableText',
  dsAuthNavControl: 'AuthNavControl',
  dsAuthNavControlNote:
    'Ο έλεγχος ταυτοποίησης στη γραμμή πλοήγησης. Εμφανίζει σύνδεσμο σύνδεσης όταν ο χρήστης δεν είναι συνδεδεμένος, τον λογαριασμό όταν είναι, και σήμανση διαχειριστή. Δεν εμφανίζει τίποτα όσο εκκρεμεί ο έλεγχος συνεδρίας.',
  dsSpawnText: 'SpawnText',
  dsSpawnTextNote:
    'Χωρίζει ένα ήδη μεταφρασμένο κείμενο σε χαρακτήρες ή λέξεις για την είσοδο του hero. Με μειωμένη κίνηση εμφανίζεται ολοκληρωμένο.',
  dsEditableTextNote:
    'Για τους επισκέπτες αποδίδει απλό μεταφρασμένο κείμενο. Σε σύνδεση ως διαχειριστής αποκτά δυνατότητα άμεσης επεξεργασίας και γράφει στον πίνακα site_content.',
} as const satisfies Record<keyof typeof en, string>;

export default el;
