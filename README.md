# Sacred Scents

Landing page and membership storefront for Sacred Scents — a monthly candle
membership where hundreds of scents are sampled each cycle and exactly one is
chosen, poured, and shipped the first week of the month.

**→ To launch, follow [`SETUP.md`](SETUP.md).**

---

## Running locally

No build step, no dependencies.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html            The landing page
css/style.css         All styling (design tokens at the top)
js/config.js          ← the only file you edit day-to-day
js/main.js            Renders tiers, cycle dates, form handling
assets/               Logo mark, full logo, favicon (SVG)
legal/                Terms, Privacy, Shipping & Returns
SETUP.md              Launch guide: hosting, Stripe, email capture
```

## Editing content

Almost everything lives in **`js/config.js`**:

- **`brand`** — email, Instagram, domain
- **`tiers`** — names, prices, features, and the Stripe Payment Link per tier
- **`drop`** — this month's number, teaser, and the order cutoff day
- **`emailEndpoint`** — where the waitlist form posts
- **`proof`** — the three numbers in the stat strip

The page derives its dates from `drop.cutoffDay`. Change that one number and the
hero countdown, the FAQ, and the shipping copy all follow.

## How the checkout works

Each tier's button reads `stripeLink` from the config:

- **Empty string** → the button becomes *"Join the waitlist"* and scrolls to the
  email form.
- **A `https://buy.stripe.com/...` URL** → the button becomes *"Begin — $58/mo"*
  and goes straight to Stripe Checkout.

So the site is safe to publish before Stripe finishes verifying your account —
it collects emails until you paste the links in, then starts collecting money.

## Design notes

- Dark, gold, and typographic by design, so it looks finished **before you have
  product photography**. Swap the `.plate` blocks for real photos when you have
  them; they hold a 4:5 ratio.
- Fonts: Cormorant Garamond (display) + Inter (body), via Google Fonts.
- All colour is defined as tokens in `:root` at the top of `css/style.css`.
- Text contrast is verified at WCAG AA across the page.
- Respects `prefers-reduced-motion`.

## Before you go live

Search the project for `TODO` and `[BRACKETED]` — those mark every value that
still needs your real information, including candle specs, shipping zones, and
the legal entity details in `legal/`.

The files in `legal/` are **starting templates, not legal advice.** They cover
the structure Stripe expects from a subscription merchant. Have an attorney
review them.
