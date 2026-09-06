import type en from './en';

// Typed against the English locale (source of truth): a missing or extra key,
// or a non-string value, is a compile error. Keeps the two locales in lockstep.
const el = {
  // ─── Navbar ──────────────────────────────────────────────────────────────────
  firmName: 'VKM',
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
  heroSecondaryCta: 'Γνωρίστε τους εταίρους',

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

  // ─── Σελίδες τομέων δικαίου (#practice/<slug>) ──────────────────────────────
  practiceAreaLabel: 'Τομέας Δικαίου',
  practiceBackToAreas: 'Όλοι οι τομείς',
  practiceOverviewLabel: 'Επισκόπηση',
  practiceServicesLabel: 'Τι αναλαμβάνουμε',
  practiceContactCta: 'Ζητήστε συνάντηση',

  practiceRealEstateDetail:
    'Οι υποθέσεις ακινήτων στην Ελλάδα σπάνια χάνονται στο συμβόλαιο· χάνονται σε ό,τι δεν ελέγχθηκε ποτέ. Αναλαμβάνουμε την αγορά από τον έλεγχο τίτλων και έπειτα \u2014 Υποθηκοφυλακείο και Κτηματολόγιο, πολεοδομική και δασική κατάσταση, βάρη και οφειλές \u2014 και στη συνέχεια χτίζουμε τη δομή που αντέχει: προσύμφωνα, συμβολαιογραφικές πράξεις, άδειες δόμησης και ανάπτυξης, και όρους μίσθωσης που επιβιώνουν μιας αλλαγής μισθωτή. Για αγοραστές εκτός Ελλάδας, τα ζητήματα διαμονής, φορολογίας και επαναπατρισμού κεφαλαίων απαντώνται στον ίδιο φάκελο και όχι σε δεύτερο.',
  practiceRealEstateService1: 'Αγοραπωλησίες ακινήτων',
  practiceRealEstateService2: 'Έλεγχος τίτλων & Κτηματολογίου',
  practiceRealEstateService3: 'Άδειες δόμησης & ανάπτυξης',
  practiceRealEstateService4: 'Μισθώσεις & διαφορές εκμισθωτών',

  practiceStartupDetail:
    'Από τη σύσταση μέχρι τον γύρο που αλλάζει τα πάντα. Συντάσσουμε seed και venture χρηματοδοτήσεις \u2014 SAFEs, μετατρέψιμα ομολογιακά, όρους προνομιούχων μετοχών \u2014 και κρατάμε τον κεφαλαιακό πίνακα ευανάγνωστο όσο η εταιρεία μεγαλώνει μέσα του: vesting ιδρυτών, option pools, παραχωρήσεις σε εργαζομένους και τη συμφωνία μετόχων που κρίνει ποιος ελέγχει πραγματικά μια έξοδο. Ο έλεγχος από την πλευρά του επενδυτή απαντάται μέσα από ένα data room που βοηθάμε να στηθεί πριν καν ζητηθεί.',
  practiceStartupService1: 'Σύσταση & συμφωνίες ιδρυτών',
  practiceStartupService2: 'SAFEs, ομολογιακά & γύροι',
  practiceStartupService3: 'Κεφαλαιακός πίνακας & options',
  practiceStartupService4: 'Έλεγχος επενδυτών & έξοδοι',

  practiceMaritimeDetail:
    'Ο Πειραιάς είναι η πρακτική, όχι ο ταχυδρομικός κώδικας. Ενεργούμε σε ναυτιλιακή χρηματοδότηση και υποθήκες, αγοραπωλησίες και ναυπηγήσεις, διαφορές ναυλοσυμφώνων, απαιτήσεις φορτίου και συγκρούσεις, καθώς και στη συμμόρφωση σημαίας και λιμένα που κρίνει αν το πλοίο θα αποπλεύσει. Η περιβαλλοντική έκθεση \u2014 από το EU ETS έως τα όρια θείου \u2014 αντιμετωπίζεται μέσα στον εμπορικό φάκελο και όχι δίπλα του, γιατί εκεί καταλήγει το κόστος.',
  practiceMaritimeService1: 'Ναυτιλιακή χρηματοδότηση & υποθήκες',
  practiceMaritimeService2: 'Αγοραπωλησίες & ναυπηγήσεις',
  practiceMaritimeService3: 'Ναυλοσύμφωνα & απαιτήσεις φορτίου',
  practiceMaritimeService4: 'Συμμόρφωση σημαίας & περιβάλλοντος',

  practiceCryptoDetail:
    'Ο MiCA μετέτρεψε τη νομική συμβουλευτική για τα κρυπτονομίσματα από συζήτηση περί αναλογιών σε άσκηση αδειοδότησης, και έτσι ακριβώς την αντιμετωπίζουμε. Οδηγούμε εκδότες και πλατφόρμες μέσα από white papers, αδειοδότηση CASP και τις επαφές με Τράπεζα της Ελλάδος και Επιτροπή Κεφαλαιαγοράς· δομούμε διανομές tokens και πρωτόκολλα DeFi που πρέπει να αντέξουν και τους ρυθμιστές τους και τη δική τους διακυβέρνηση· και παρεμβαίνουμε όταν η θεματοφυλακή, το ανταλλακτήριο ή το DAO καταλήγουν σε διαφορά. Η φορολογική μεταχείριση κρίνεται στον ίδιο φάκελο αντί να αναβάλλεται.',
  practiceCryptoService1: 'MiCA & αδειοδότηση CASP',
  practiceCryptoService2: 'Έκδοση tokens & white papers',
  practiceCryptoService3: 'Διακυβέρνηση DeFi & DAO',
  practiceCryptoService4: 'Θεματοφυλακή & διαφορές ψηφιακών περιουσιακών',

  // ─── Team / Attorneys ────────────────────────────────────────────────────────
  teamOverline: 'Φιλοσοφία Εταίρων',
  teamTitle: 'Οι Εταίροι μας',
  partnerEthosLine1: 'Αρχιτεκτονική',
  partnerEthosLine2: 'Νομολογία',
  partnerQuote: 'Ο νόμος δεν είναι αντιδραστικό φράγμα· είναι το σχέδιο πάνω στο οποίο χτίζονται αυτοκρατορίες.',
  teamSubtitle:
    'Τρεις δικηγόροι, τρεις ειδικότητες, μία δέσμευση να σας ωθήσουμε μπροστά.',

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
  teamViewProfile: 'Δείτε το προφίλ',

  // ─── Σελίδα εταίρου (#partner/<n>) ──────────────────────────────────────────
  partnerProfileLabel: 'Προφίλ Εταίρου',
  partnerBackToTeam: 'Όλοι οι εταίροι',
  partnerAboutLabel: 'Βιογραφικό',
  partnerSpecialtiesLabel: 'Εξειδικεύσεις',
  partnerContactCta: 'Ζητήστε συνάντηση',

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
    'Η VKM καθοδήγησε το Series A μας από term sheet σε κλείσιμο σε 6 εβδομάδες. Η κατανόησή τους του ελληνικού και ευρωπαϊκού πλαισίου μας γλίτωσε μήνες.',
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
  testimonialsPause: 'Παύση εναλλαγής μαρτυριών',
  testimonialsPlay: 'Συνέχιση εναλλαγής μαρτυριών',

  // ─── CTA ──────────────────────────────────────────────────────────────────────
  ctaTitle: 'Έτοιμοι να Εξασφαλίσετε\nτο Μέλλον σας;',
  ctaSubtitle: 'Η πρωτοπορία είναι αμείλικτη για τους απροετοίμαστους. Συνεργαστείτε με τους αρχιτέκτονες κυρίαρχης ανάπτυξης σήμερα.',
  ctaButton: 'Εκκίνηση Πρωτοκόλλου Τώρα',

  // ─── Contact ─────────────────────────────────────────────────────────────────
  contactOverline: 'Επικοινωνία',
  // Kept short on purpose: SectionHeader splits its <h2> per character for the
  // spawn animation, so a title wider than the heading column breaks mid-word.
  // 'Θα μας Βρείτε στην Αθήνα' did exactly that — "Αθή / να".
  contactTitle: 'Βρείτε μας στην Αθήνα',
  contactSubtitle:
    'Ένα γραφείο στη Βασιλίσσης Σοφίας, με τη ναυτιλιακή πλευρά λίγο πιο κάτω, στον Πειραιά \u2014 αρκετά κοντά ώστε να είναι η ίδια πινέζα σε αυτόν τον χάρτη. Πείτε μας ποια είναι η υπόθεση· θα σας πούμε αν είναι δική μας.',
  contactAddress: 'Λεωφ. Βασιλίσσης Σοφίας 12, Αθήνα 10674, Ελλάδα',
  contactEmail: 'info@vkm.legal',

  // Column headings inside the glass panel over the map.
  contactDetailsLabel: 'Απευθείας επικοινωνία',
  contactFormLabel: 'Στείλτε μήνυμα',

  // The one fact worth keeping from the three node cards the map used to carry.
  contactOfficeNote:
    'Οι υποθέσεις ακινήτων και επιχειρηματικών κεφαλαίων τρέχουν από το γραφείο της Αθήνας· οι ναυτιλιακές και οι ψηφιακές από τον Πειραιά, δέκα χιλιόμετρα πιο κάτω στην ίδια ακτή.',

  // The map pin, which is a copy-to-clipboard button.
  contactPinLabel: 'Αθήνα',
  contactPinCopy: 'Αντιγραφή διεύθυνσης',
  contactPinCopied: 'Η διεύθυνση αντιγράφηκε',
  contactPinFailed: 'Η αντιγραφή απέτυχε',
  contactPinCopiedAnnounce: 'Η διεύθυνση του γραφείου αντιγράφηκε στο πρόχειρο.',
  contactPinFailedAnnounce:
    'Δεν ήταν δυνατή η αντιγραφή στο πρόχειρο. Η διεύθυνση είναι {{address}} και εμφανίζεται τώρα κάτω από την πινέζα.',

  contactPromise1Label: 'Χρόνος απόκρισης',
  contactPromise1Value: 'Απαντάμε σε κάθε αίτημα εντός μίας εργάσιμης ημέρας.',
  contactPromise2Label: 'Η πρώτη συζήτηση',
  contactPromise2Value: 'Τριάντα λεπτά, χωρίς χρέωση — περιγράφετε την υπόθεση και σας λέμε αν είμαστε το κατάλληλο γραφείο και τι πιθανόν να απαιτηθεί.',
  contactPromise3Label: 'Εμπιστευτικότητα',
  contactPromise3Value: 'Ό,τι μας στέλνετε καλύπτεται από το δικηγορικό απόρρητο από το πρώτο μήνυμα, ανεξάρτητα από το αν αναλάβουμε την υπόθεση.',
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
  // PLACEHOLDER: the firm is not yet registered. Replace both with the real
  // Athens Bar Association number and VAT number before launch.
  footerBarRegistration: 'Δικηγορικός Σύλλογος Αθηνών — εκκρεμεί εγγραφή',
  footerVat: 'ΑΦΜ σε εκκρεμότητα',
  footerCopyright: '\u00A9 2026 VKM Νομικές Υπηρεσίες. Με επιφύλαξη παντός δικαιώματος. Αθήνα, Ελλάδα.',

  // ─── Design System page ──────────────────────────────────────────────────────
  designSystem: 'Σύστημα Σχεδιασμού',
  designSystemTitle: 'Το Μονολιθικό Καταφύγιο',
  designSystemDescription:
    'Όλα τα design tokens για την ιστοσελίδα του δικηγορικού γραφείου. Οι τιμές ορίζονται μία φορά στο <code>src/theme/tokens.ts</code> και εισάγονται ως CSS custom properties κατά την εκτέλεση.',
  light: 'Ανοιχτό',
  dark: 'Σκοτεινό',
  colors: 'Χρώματα',
  typography: 'Τυπογραφία',
  dsCapsTracking: 'Απόσταση κεφαλαίων',
  dsItalicTitle: 'Πραγματικά πλάγια',
  dsItalicBody: 'Η Jura δεν διαθέτει πλάγια γραφή, οπότε κάθε πλάγιο στον ιστότοπο ήταν συνθετικό — μια κεκλιμένη γεωμετρική grotesque. Η EB Garamond italic φορτώνεται για τα δύο σημεία όπου χρησιμοποιείται πραγματικά: τα αποσπάσματα πελατών και τους ρόλους των εταίρων.',
  dsFieldTitle: 'Πεδίο διάλυσης',
  dsFieldBody: 'Ένα σταθερό στρώμα πίσω από όλη τη σελίδα, που αντικαθιστά έξι SVG κυκλωμάτων ανά ενότητα. Η πυκνότητα είναι μεγαλύτερη πάνω δεξιά, όπου στέκεται το άγαλμα, και μειώνεται προς τα κάτω αριστερά. Η τοποθέτηση είναι ντετερμινιστική ώστε να ταιριάζει με το prerender.',
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
  liquidGlass: 'Υλικό Liquid Glass',
  liquidGlassIntro:
    'Τρία επίπεδα: μια λάμψη στην πάνω ακμή, ένας εσωτερικός φωτισμός που διαθλά το φόντο, και μια σκιά που το ξεχωρίζει από τον καμβά. Περάστε τον δείκτη πάνω από μια διαδραστική επιφάνεια για να δείτε τη διάθλαση.',
  materialRegular: 'Κανονικό',
  materialRegularUse: 'Η προεπιλογή. Ευανάγνωστο πάνω από οτιδήποτε.',
  materialClear: 'Διαυγές',
  materialClearUse: 'Λεπτότερο. Μόνο πάνω από φωτεινό υλικό — χρειάζεται σκίαστρο.',
  materialAccent: 'Τονισμού',
  materialAccentUse: 'Σχεδόν συμπαγής απόχρωση για επιφάνειες έμφασης.',
  materialInteractive: 'Διαδραστικό',
  materialInteractiveUse: 'Ανασηκώνεται και κορεννύεται στο πέρασμα του δείκτη.',
  elevation: 'Υψομετρία',
  typeScaleTitle: 'Τυπογραφική Κλίμακα',
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
  chapterTestimonials: 'Κεφάλαιο 03 / Μαρτυρίες',
  chapterContact: 'Κεφάλαιο 04 / Επικοινωνία',

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
  dsPartnerCard: 'PartnerCard',
  dsPartnerCardNote:
    'Η κάρτα της ενότητας ομάδας. Ολόκληρη η επιφάνεια οδηγεί στη σελίδα του εταίρου στο #partner/<n> μέσω ενός εκτεταμένου ::after πάνω στο όνομα, ώστε το προσβάσιμο όνομα να είναι το όνομα και να μην υπάρχει ένθετο διαδραστικό στοιχείο. Σε λειτουργία επεξεργασίας διαχειριστή ο σύνδεσμος αφαιρείται και το κείμενο γίνεται επεξεργάσιμο.',
  dsPracticeDomainCard: 'PracticeDomainCard',
  dsPracticeDomainCardNote:
    'Η κάρτα της ενότητας τομέων. Ολόκληρη η επιφάνεια οδηγεί στη σελίδα του τομέα στο #practice/<slug> μέσω ενός εκτεταμένου ::after πάνω στον τίτλο, ώστε το προσβάσιμο όνομα να είναι ο τομέας και να μην υπάρχει ένθετο διαδραστικό στοιχείο. Σε λειτουργία επεξεργασίας διαχειριστή ο σύνδεσμος αφαιρείται και το κείμενο γίνεται επεξεργάσιμο.',
} as const satisfies Record<keyof typeof en, string>;

export default el;
