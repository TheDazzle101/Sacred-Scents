/* ============================================================
   SACRED SCENTS — SITE CONFIG
   This is the only file you need to edit for day-to-day changes.
   See SETUP.md for step-by-step instructions.
   ============================================================ */

window.SACRED_CONFIG = {

  /* ---------- 1. CONTACT + SOCIAL ---------- */
  brand: {
    email: "hello@sacredscents.com",          // TODO: your real inbox
    instagram: "https://instagram.com/",      // TODO: your handle URL
    instagramHandle: "@sacredscents",
    url: "https://sacredscents.com"           // TODO: your live domain
  },

  /* ---------- 2. STRIPE PAYMENT LINKS ----------
     Create ONE Stripe Payment Link per tier (SETUP.md, Step 3)
     and paste the https://buy.stripe.com/... URL here.
     While a link is empty (""), that tier's button becomes a
     "Join the waitlist" button instead — so the page never breaks. */
  tiers: [
    {
      id: "votive",
      name: "The Votive",
      candles: 1,
      price: 58,
      perCandle: 58,
      blurb: "One candle. The full ritual, undiluted.",
      features: [
        "1 candle of the chosen scent",
        "Ships first week, every month",
        "The Scent Letter — origin, notes, intent",
        "Skip or cancel anytime"
      ],
      featured: false,
      stripeLink: ""   // TODO: paste Payment Link
    },
    {
      id: "vigil",
      name: "The Vigil",
      candles: 3,
      price: 162,
      perCandle: 54,
      blurb: "Keep one. Gift two. Scent travels.",
      features: [
        "3 candles of the chosen scent",
        "Ships first week, every month",
        "The Scent Letter — origin, notes, intent",
        "Gift note included free",
        "Skip or cancel anytime"
      ],
      featured: false,
      stripeLink: ""   // TODO: paste Payment Link
    },
    {
      id: "altar",
      name: "The Altar",
      candles: 6,
      price: 294,
      perCandle: 49,
      blurb: "Enough to scent a whole home — or a whole circle.",
      features: [
        "6 candles of the chosen scent",
        "Ships first week, every month",
        "The Scent Letter — origin, notes, intent",
        "Gift notes included free",
        "Early access to archive re-releases",
        "Skip or cancel anytime"
      ],
      featured: true,
      stripeLink: ""   // TODO: paste Payment Link
    },
    {
      id: "sanctuary",
      name: "The Sanctuary",
      candles: 10,
      price: 440,
      perCandle: 44,
      blurb: "For retailers, studios, and the truly devoted.",
      features: [
        "10 candles of the chosen scent",
        "Ships first week, every month",
        "The Scent Letter — origin, notes, intent",
        "Gift notes included free",
        "Early access to archive re-releases",
        "Direct line to the Selection Table",
        "Skip or cancel anytime"
      ],
      featured: false,
      stripeLink: ""   // TODO: paste Payment Link
    }
  ],

  /* ---------- 3. THIS MONTH'S DROP ----------
     Update this once a month. Keep the scent name secret until
     it ships — the mystery is the product. */
  drop: {
    number: "No. 001",
    revealed: false,                 // set true once you want to name it publicly
    name: "",                        // e.g. "Smoke & Fig Leaf" (shown only if revealed)
    teaser: "Resinous. Cold-pressed citrus peel over something older and darker underneath.",
    sampled: 300,                    // how many scents were tested this cycle
    cutoffDay: 25                    // join by this day of the month to get the next drop
  },

  /* ---------- 4. WAITLIST / EMAIL CAPTURE ----------
     Paste a form endpoint (Formspree, Mailchimp, ConvertKit, Kit,
     Beehiiv — anything that accepts a POST).
     Leave "" and the form falls back to opening the customer's
     email client addressed to you. See SETUP.md, Step 5. */
  emailEndpoint: "",

  /* ---------- 5. PROOF NUMBERS ---------- */
  proof: {
    yearsMaking: 10,
    scentsPerCycle: 300,
    chosenPerCycle: 1
  }
};
