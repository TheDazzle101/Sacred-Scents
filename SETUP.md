# Sacred Scents — Launch Setup

Everything here is ordered so you can be **taking real payments today**.
Steps 1–4 are the critical path. Steps 5–8 make it hold up.

You only ever edit one file for content: **`js/config.js`**.

---

## Step 1 — Put the site online (10 minutes)

The site is plain HTML/CSS/JS. No build step, no server, no dependencies.
Pick one:

| Host | How | Cost |
|---|---|---|
| **Netlify Drop** *(fastest)* | Go to [app.netlify.com/drop](https://app.netlify.com/drop), drag this whole folder in | Free |
| **Cloudflare Pages** | Connect this GitHub repo, framework preset "None", output dir `/` | Free |
| **Vercel** | Import the repo, framework preset "Other" | Free |

All three give you HTTPS immediately, which Stripe requires.

**To preview locally first:**
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Step 2 — Point your domain at it

In your host's dashboard: *Domains → Add custom domain → `sacredscents.com`*.
They give you two DNS records to paste at your registrar. Propagation is usually
minutes.

Then set your real domain in `js/config.js`:

```js
brand: {
  email: "hello@sacredscents.com",
  url:   "https://sacredscents.com"
}
```

> **Set up a real business inbox before launch.** `hello@yourdomain.com` via
> Google Workspace ($7/mo) converts measurably better than a gmail address, and
> Stripe looks at it during review.

---

## Step 3 — Stripe: create the subscriptions (30 minutes)

This is the part that makes money. No code required.

### 3a. Create the account
[dashboard.stripe.com/register](https://dashboard.stripe.com/register) → choose
**Company / LLC**, enter your EIN and business details. Verification is usually
same-day.

### 3b. Create one product per tier

*Product catalogue → Add product.* Make four:

| Product name | Price | Billing period |
|---|---|---|
| Sacred Scents — The Votive | $58.00 | Monthly, recurring |
| Sacred Scents — The Vigil | $162.00 | Monthly, recurring |
| Sacred Scents — The Altar | $294.00 | Monthly, recurring |
| Sacred Scents — The Sanctuary | $440.00 | Monthly, recurring |

Make sure **Recurring** is selected, not One-off. This is the single most
common setup mistake.

### 3c. Create a Payment Link for each

*Payment links → New → select the product.* For each link, turn on:

- **Collect shipping address** — required, you are mailing physical goods
- **Collect phone number** — carriers need it for delivery exceptions
- **Allow promotion codes** — you will want this for launch and for win-backs
- Under *After payment* → **Confirmation page**, write a custom message telling
  them exactly when their first box ships

Copy each `https://buy.stripe.com/...` URL.

### 3d. Paste the links into `js/config.js`

```js
tiers: [
  { id: "votive",    ..., stripeLink: "https://buy.stripe.com/xxxxx" },
  { id: "vigil",     ..., stripeLink: "https://buy.stripe.com/yyyyy" },
  { id: "altar",     ..., stripeLink: "https://buy.stripe.com/zzzzz" },
  { id: "sanctuary", ..., stripeLink: "https://buy.stripe.com/wwwww" }
]
```

Save, re-deploy, done. **The buttons flip from "Join the waitlist" to
"Begin — $58/mo" automatically** as soon as a link is present, so you can launch
the page before Stripe finishes verifying you and lose nothing.

### 3e. Turn on the customer portal — do not skip this

*Settings → Billing → Customer portal.* Enable:

- **Cancel subscriptions** — immediately
- **Pause subscriptions** — this is your "skip a month"
- **Update payment method** and **Update shipping address**

Your site, your Terms, and your FAQ all promise two-click cancellation. The
portal is what makes that true. It is also what keeps chargebacks and card
network complaints near zero — a dispute costs you $15 plus the sale, and enough
of them will get your account frozen.

Then turn on the receipt email (*Settings → Emails → Successful payments*) —
the portal link is included in it automatically.

---

## Step 4 — Fill in the blanks the page is waiting on

Search the project for `TODO` and `[BRACKETED]`. Specifically:

- **`index.html`** — the FAQ answer *"What are the candles actually made of?"*
  Replace the vague placeholder with your real specs: size in oz, wax type, wick
  type, burn hours, vessel. **This answer converts.** Be specific.
- **`index.html`** — the shipping FAQ: confirm your zones.
- **`legal/*.html`** — every `[DATE]`, `[LEGAL ENTITY NAME, LLC]`,
  `[MAILING ADDRESS]`, `[YOUR STATE]`, shipping cost decision.
- **`js/config.js`** — `drop.teaser`, `drop.number`, and `proof` numbers.

> The legal pages are **starting templates, not legal advice.** They cover the
> structure Stripe expects from a subscription merchant. Have an attorney read
> them before you are doing serious volume.

---

## Step 5 — Capture emails from day one

Every visitor who is not ready to buy today is worth money later. The form
already works — it just needs somewhere to send.

**Fastest option (2 minutes):** [formspree.io](https://formspree.io) → new form →
copy the endpoint → paste into `js/config.js`:

```js
emailEndpoint: "https://formspree.io/f/xxxxxxx"
```

**Better long-term:** Kit (ConvertKit), Beehiiv, or Mailchimp — all accept a
POST endpoint and let you actually send the monthly reveal email.

If you leave `emailEndpoint` empty, the form falls back to opening the visitor's
email client addressed to you. It works, but you will lose leads — set this up.

---

## Step 6 — Pre-launch checklist

- [ ] Every Stripe link tested with a **real card**, then refunded
- [ ] Customer portal cancellation tested end to end
- [ ] Confirmation email says when the first box ships
- [ ] Legal pages have no remaining `[BRACKETS]`
- [ ] Waitlist form submits and the address lands somewhere you check
- [ ] Site opened on an actual phone, not just a narrow browser window
- [ ] Shipping supplies on hand for your realistic first-month volume
- [ ] You know your cost per candle, boxed and shipped

---

## Step 7 — The monthly rhythm

| When | What |
|---|---|
| Weeks 1–3 | Sample at the Selection Table |
| ~20th | Choose the scent. Update `drop` in `js/config.js`. Re-deploy. |
| **25th** | Orders close. Pull the Stripe subscriber list. |
| Last week | Pour, cure, label, box |
| **Week 1** | Ship everything. Send the reveal email. |

Changing the cutoff? Edit `drop.cutoffDay` in `js/config.js` — the countdown,
the FAQ, and the shipping copy all update from that one number.

---

## Step 8 — The math on $500k/month

Worth knowing precisely what the goal requires. With a realistic tier mix
(40% Votive / 30% Vigil / 22% Altar / 8% Sanctuary), average revenue per member
is about **$172/month**.

```
$500,000 ÷ $172  ≈  2,900 active members
```

That is the whole target: **under three thousand people.** Not a mass-market
number — a "fill a mid-size theatre" number. It is reachable.

The thing that will actually decide it is **churn**, not acquisition. At 8%
monthly churn you lose ~230 members every month and have to replace them before
you grow at all. At 4% churn you only have to replace ~115.

Which means the highest-leverage work is not ads. It is:

1. **The box experience** — The Scent Letter, the unboxing, the feeling that a
   decision was made on their behalf by someone who cares.
2. **Never shipping a scent you are not proud of.** One bad month churns people
   who would have stayed two years.
3. **Making skip effortless.** A member who skips is worth vastly more than a
   member who cancels because skipping was hard.

Acquisition brings them in. Retention is the business.
