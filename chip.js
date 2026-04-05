/**
 * IDR Shield Chip — Asset 03 — Inline Verification Chip
 * Institute of Digital Remediation · IDR-BRAND-2026-01
 *
 * Usage:
 *   <script src="https://idrshield.com/chip.js"
 *           data-store="yourstore.com"
 *           data-id="IDR-REG-2026-XXXXXXXX"
 *           data-format="pill"
 *           data-theme="dark"
 *           data-tier="founding">
 *   </script>
 *
 * data-format: "pill" — icon + label (default)
 *              "text" — dot + text, editorial use
 *
 * data-theme:  "dark" | "outline"
 * data-tier:   "founding" | "member"
 *
 * Placement: below Add to Cart, near price, in cart, at checkout
 */

(function () {
  'use strict';

  var BACKEND  = 'https://idr-backend-production.up.railway.app';
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@600;700&display=swap';

  var scripts = document.querySelectorAll('script[data-store]');
  var tag     = scripts[scripts.length - 1];
  if (!tag) return;

  var domain = (tag.getAttribute('data-store') || '').replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
  var format = (tag.getAttribute('data-format') || 'pill').toLowerCase();
  var theme  = (tag.getAttribute('data-theme')  || 'dark').toLowerCase();
  var tier   = (tag.getAttribute('data-tier')   || 'member').toLowerCase();
  if (!domain) return;

  var verifyUrl = 'https://idrshield.com/verify/' + domain;

  if (!document.getElementById('idr-chip-fonts')) {
    var lnk = document.createElement('link');
    lnk.id  = 'idr-chip-fonts'; lnk.rel = 'stylesheet'; lnk.href = FONT_URL;
    document.head.appendChild(lnk);
  }

  if (!document.getElementById('idr-chip-css')) {
    var st = document.createElement('style');
    st.id = 'idr-chip-css';
    st.textContent =
      '.idr-chip-a{display:inline-flex;align-items:center;gap:7px;text-decoration:none;border-radius:3px;padding:5px 12px 5px 5px;border:1px solid;transition:opacity .18s;-webkit-tap-highlight-color:transparent;}' +
      '.idr-chip-a:hover{opacity:.78;}' +
      '.idr-chip-a:focus{outline:2px solid #C9A84C;outline-offset:2px;}' +
      '.idr-chip-labels{display:flex;flex-direction:column;gap:1px;}' +
      '.idr-chip-name{font-family:"Montserrat",sans-serif;font-weight:700;font-size:9px;letter-spacing:.16em;text-transform:uppercase;line-height:1;}' +
      '.idr-chip-sub{font-family:"Montserrat",sans-serif;font-weight:600;font-size:7px;letter-spacing:.12em;text-transform:uppercase;line-height:1;opacity:.65;}' +
      '.idr-txt-a{display:inline-flex;align-items:center;gap:5px;text-decoration:none;font-family:"Montserrat",sans-serif;font-weight:600;font-size:10px;letter-spacing:.12em;text-transform:uppercase;transition:opacity .18s;-webkit-tap-highlight-color:transparent;}' +
      '.idr-txt-a:hover{opacity:.7;}' +
      '.idr-txt-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}' +
      '.idr-dot-active{animation:idr-dp 2s ease infinite;}' +
      '@keyframes idr-dp{0%,100%{opacity:1}50%{opacity:.25}}';
    document.head.appendChild(st);
  }

  function colors(theme, status, tier) {
    if (status === 'active') {
      var gold = tier === 'founding' ? '#E2C97E' : '#C9A84C';
      return { ring: '#C9A84C', text: gold, border: 'rgba(201,168,76,.38)', bg: 'rgba(201,168,76,.09)', dot: '#C9A84C', dotClass: 'idr-txt-dot idr-dot-active' };
    }
    if (status === 'monitoring') {
      return { ring: '#C8C8D8', text: '#C8C8D8', border: 'rgba(200,200,216,.28)', bg: 'rgba(200,200,216,.06)', dot: '#C8C8D8', dotClass: 'idr-txt-dot' };
    }
    return { ring: '#555', text: '#555', border: 'rgba(85,85,85,.22)', bg: 'rgba(85,85,85,.05)', dot: '#555', dotClass: 'idr-txt-dot' };
  }

  function miniSeal(theme, status, tier) {
    var s = 22; var h = s / 2; var r = h - 1.5;
    var c = colors(theme, status, tier);
    var uid = 'idrm' + Math.random().toString(36).slice(2, 6);
    var bg = theme === 'outline' ? 'none' : '#0A0E1A';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '" style="flex-shrink:0">' +
      (bg !== 'none' ? '<circle cx="' + h + '" cy="' + h + '" r="' + (h - 0.3) + '" fill="' + bg + '"/>' : '') +
      '<circle cx="' + h + '" cy="' + h + '" r="' + r + '" fill="none" stroke="' + c.ring + '" stroke-width="1.2" opacity="0.9"/>' +
      '<text x="' + h + '" y="' + (h + 1) + '" font-family="\'Playfair Display\',Georgia,serif" font-size="7.5" font-weight="700" fill="' + c.text + '" text-anchor="middle" dominant-baseline="middle">IDR</text>' +
      '</svg>';
  }

  function buildPill(status, tier, url) {
    var c       = colors(theme, status, tier);
    var subLbl  = status === 'active' ? (tier === 'founding' ? 'FOUNDING MEMBER' : 'IDR VERIFIED') : (status === 'monitoring' ? 'MONITORING' : 'INACTIVE');

    var a = document.createElement('a');
    a.className = 'idr-chip-a';
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.style.borderColor     = c.border;
    a.style.backgroundColor = c.bg;
    a.setAttribute('aria-label', 'IDR Shield ' + subLbl + ' — verify compliance record');
    a.innerHTML =
      miniSeal(theme, status, tier) +
      '<span class="idr-chip-labels">' +
        '<span class="idr-chip-name" style="color:' + c.text + '">IDR</span>' +
        '<span class="idr-chip-sub"  style="color:' + c.text + '">' + subLbl + '</span>' +
      '</span>';
    return a;
  }

  function buildText(status, tier, url) {
    var c    = colors(theme, status, tier);
    var lbl  = status === 'active' ? (tier === 'founding' ? 'IDR FOUNDING MEMBER' : 'IDR VERIFIED') : (status === 'monitoring' ? 'IDR MONITORING' : 'IDR INACTIVE');

    var a = document.createElement('a');
    a.className = 'idr-txt-a';
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.style.color = c.text;
    a.setAttribute('aria-label', lbl + ' — verify compliance record');
    a.innerHTML = '<span class="' + c.dotClass + '" style="background:' + c.dot + '"></span><span>' + lbl + ' \u2192</span>';
    return a;
  }

  // Create container
  var wrap = document.createElement('span');
  var ph   = format === 'text' ? buildText('monitoring', tier, verifyUrl) : buildPill('monitoring', tier, verifyUrl);
  wrap.appendChild(ph);
  tag.parentNode.insertBefore(wrap, tag.nextSibling);

  // Fetch live status
  fetch(BACKEND + '/api/badge/' + domain, { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var status = (d.status || 'expired').toLowerCase();
      var url    = d.registry_url || verifyUrl;
      var chip   = format === 'text' ? buildText(status, tier, url) : buildPill(status, tier, url);
      wrap.innerHTML = ''; wrap.appendChild(chip);
    })
    .catch(function () {});

})();
