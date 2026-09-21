/* ============================================================
   SACRED SCENTS — page logic
   Reads everything from js/config.js
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.SACRED_CONFIG;
  if (!cfg) return;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

  /* ---------- sticky header ---------- */
  var header = $(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  var revealables = $$(".reveal");
  if (revealables.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -60px" });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------- shipping cycle maths ----------
     Members who join on or before `cutoffDay` get the NEXT
     month's drop. After the cutoff, they roll to the month after. */
  function cycle() {
    var now    = new Date();
    var cutDay = cfg.drop.cutoffDay || 25;
    var cutoff = new Date(now.getFullYear(), now.getMonth(), cutDay, 23, 59, 59);

    // If this month's cutoff has passed, the live cutoff is next month's.
    if (now > cutoff) {
      cutoff = new Date(now.getFullYear(), now.getMonth() + 1, cutDay, 23, 59, 59);
    }

    // Candles ship the first week of the month AFTER the active cutoff.
    var ship = new Date(cutoff.getFullYear(), cutoff.getMonth() + 1, 1);

    var days = Math.max(0, Math.ceil((cutoff - now) / 86400000));

    return {
      daysLeft:  days,
      cutoffDay: cutDay,
      shipMonth: MONTHS[ship.getMonth()],
      shipYear:  ship.getFullYear()
    };
  }

  var c = cycle();

  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  $$("[data-cycle]").forEach(function (el) {
    var key = el.getAttribute("data-cycle");
    if (key === "days")       el.textContent = c.daysLeft;
    if (key === "daysword")   el.textContent = c.daysLeft === 1 ? "day" : "days";
    if (key === "cutoff")     el.textContent = ordinal(c.cutoffDay);
    if (key === "shipmonth")  el.textContent = c.shipMonth;
    if (key === "shipyear")   el.textContent = c.shipYear;
  });

  /* ---------- proof numbers ---------- */
  $$("[data-proof]").forEach(function (el) {
    var v = cfg.proof[el.getAttribute("data-proof")];
    if (v != null) el.textContent = v;
  });

  /* ---------- this month's drop ---------- */
  var dropNum = $("[data-drop-number]");
  if (dropNum) dropNum.textContent = cfg.drop.number;

  var dropTeaser = $("[data-drop-teaser]");
  if (dropTeaser) {
    dropTeaser.textContent = (cfg.drop.revealed && cfg.drop.name)
      ? cfg.drop.name
      : "“" + cfg.drop.teaser + "”";
  }

  var dropSampled = $("[data-drop-sampled]");
  if (dropSampled) dropSampled.textContent = cfg.drop.sampled;

  /* ---------- tiers ---------- */
  var grid = $("[data-tiers]");
  if (grid) {
    grid.innerHTML = "";

    cfg.tiers.forEach(function (t) {
      var card = document.createElement("article");
      card.className = "tier reveal" + (t.featured ? " is-featured" : "");

      var live = typeof t.stripeLink === "string" && t.stripeLink.indexOf("http") === 0;

      var cta = live
        ? '<a class="btn btn-primary btn-block" href="' + t.stripeLink +
          '" data-tier="' + t.id + '">Begin — $' + t.price + '/mo</a>'
        : '<a class="btn btn-ghost btn-block" href="#join" data-tier="' + t.id +
          '">Join the waitlist</a>';

      card.innerHTML =
        (t.featured ? '<span class="tier-flag">Most chosen</span>' : '') +
        '<header>' +
          '<h3 class="tier-name">' + t.name + '</h3>' +
          '<p class="tier-count">' + t.candles + ' candle' + (t.candles > 1 ? 's' : '') + ' &middot; monthly</p>' +
        '</header>' +
        '<p class="tier-blurb">' + t.blurb + '</p>' +
        '<div class="tier-price">' +
          '<span class="amount">$' + t.price + '</span>' +
          '<span class="per">per month</span>' +
        '</div>' +
        '<p class="tier-each">$' + t.perCandle + ' per candle</p>' +
        '<ul class="tier-features">' +
          t.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') +
        '</ul>' +
        cta;

      grid.appendChild(card);
    });

    // Newly-built cards need observing too.
    $$(".tier.reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- waitlist form ---------- */
  var form = $("[data-form]");
  if (form) {
    var msg = $("[data-form-msg]", form.parentNode) || $("[data-form-msg]");

    var say = function (text, isError) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.toggle("is-error", !!isError);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var input = $("input[type=email]", form);
      var email = (input && input.value || "").trim();
      if (!email) return;

      var endpoint = cfg.emailEndpoint;

      // No endpoint configured yet — fall back to the customer's mail client
      // so no lead is ever lost on day one.
      if (!endpoint) {
        var subject = encodeURIComponent("Sacred Scents — waitlist");
        var body    = encodeURIComponent("Add me to the list: " + email);
        window.location.href = "mailto:" + cfg.brand.email +
                               "?subject=" + subject + "&body=" + body;
        say("Opening your email app — hit send and you’re on the list.");
        return;
      }

      var btn = $("button[type=submit]", form);
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      say("");

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email: email, source: "sacred-scents-landing" })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          say("You’re on the list. Watch your inbox before the " + ordinal(c.cutoffDay) + ".");
        })
        .catch(function () {
          say("Something went wrong. Email " + cfg.brand.email + " and we’ll add you by hand.", true);
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Join"; }
        });
    });
  }

  /* ---------- contact links ---------- */
  $$("[data-brand-email]").forEach(function (el) {
    el.textContent = cfg.brand.email;
    if (el.tagName === "A") el.href = "mailto:" + cfg.brand.email;
  });
  $$("[data-brand-email-href]").forEach(function (el) {
    el.href = "mailto:" + cfg.brand.email;
  });
  $$("[data-brand-instagram]").forEach(function (el) {
    el.href = cfg.brand.instagram;
    if (el.dataset.brandInstagram === "handle") el.textContent = cfg.brand.instagramHandle;
  });

  /* ---------- current year ---------- */
  $$("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
