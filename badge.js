/**
 * IDR Shield Badge — v4.0
 * Institute of Digital Remediation · IDR-BRAND-2026-01
 *
 * Usage:
 *   <script src="https://idrshield.com/badge.js"
 *           data-store="yourstore.com"
 *           data-id="IDR-REG-2026-XXXXXXXX"
 *           data-theme="dark"
 *           data-size="52"
 *           data-tier="founding">
 *   </script>
 *
 * data-theme:  "dark"     — dark seal, light backgrounds (white/cream/beige)
 *              "outline"  — gold outline, dark backgrounds (black/navy/charcoal)
 *
 * data-size:   72 | 52 | 40 | 28
 *              28px = icon only, no caption
 *              40px+ = IDR VERIFIED caption shown
 *
 * data-tier:   "founding" — Founding Member gold seal (first 500 stores)
 *              "member"   — Standard member badge (default)
 *
 * States:
 *   active     — gold — score ≥ 80, no critical violations
 *   monitoring — silver — enrolled, open violations being remediated
 *   expired    — grey — membership cancelled or payment failed
 */

(function () {
  'use strict';

  var BACKEND  = 'https://idr-backend-production.up.railway.app';
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@600;700&display=swap';

  // ── Find this script tag ─────────────────────────────────────────────────────
  var scripts = document.querySelectorAll('script[data-store]');
  var tag = scripts[scripts.length - 1];
  if (!tag) return;

  var domain = (tag.getAttribute('data-store') || '').replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
  var regId  = tag.getAttribute('data-id') || tag.getAttribute('data-registry') || '';
  var theme  = (tag.getAttribute('data-theme') || 'dark').toLowerCase();
  var tier   = (tag.getAttribute('data-tier') || 'member').toLowerCase();
  var size   = parseInt(tag.getAttribute('data-size') || '52', 10);
  if ([28, 40, 52, 72].indexOf(size) === -1) size = 52;
  if (!domain) return;

  var verifyUrl = 'https://idrshield.com/verify/' + domain;

  // ── Load fonts once ──────────────────────────────────────────────────────────
  if (!document.getElementById('idr-badge-fonts')) {
    var lnk = document.createElement('link');
    lnk.id  = 'idr-badge-fonts';
    lnk.rel = 'stylesheet';
    lnk.href = FONT_URL;
    document.head.appendChild(lnk);
  }

  // ── Styles ───────────────────────────────────────────────────────────────────
  if (!document.getElementById('idr-badge-css')) {
    var st = document.createElement('style');
    st.id = 'idr-badge-css';
    st.textContent =
      '.idr-badge-wrap{display:inline-flex;flex-direction:column;align-items:center;cursor:pointer;text-decoration:none;border:none;background:none;padding:0;-webkit-tap-highlight-color:transparent;}' +
      '.idr-badge-wrap:focus{outline:2px solid #C9A84C;outline-offset:3px;border-radius:50%;}' +
      '.idr-badge-wrap svg{display:block;transition:transform .22s ease,filter .22s ease;}' +
      '.idr-badge-wrap:hover svg{transform:scale(1.05);}' +
      '.idr-badge-active:hover svg{filter:drop-shadow(0 0 8px rgba(201,168,76,.5));}' +
      '.idr-badge-cap{font-family:"Montserrat",sans-serif;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-top:7px;display:block;text-align:center;line-height:1;}' +
      '.idr-cap-default{display:block;}' +
      '.idr-cap-hover{display:none;}' +
      '.idr-badge-wrap:hover .idr-cap-default{display:none;}' +
      '.idr-badge-wrap:hover .idr-cap-hover{display:block;}' +
      '@keyframes idr-ring-pulse{0%,100%{opacity:.95}50%{opacity:.45}}' +
      '@keyframes idr-dot-spin{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-200}}';
    document.head.appendChild(st);
  }

  // ── Colour palettes ──────────────────────────────────────────────────────────
  function palette(theme, status, tier) {
    if (status === 'active' && tier === 'founding') {
      // Founding member active — richest gold
      return {
        bg:      theme === 'outline' ? 'none' : '#0A0E1A',
        outerRing: '#C9A84C', outerOp: '1', outerW: '2',
        innerRing: '#C9A84C', innerOp: '0.3',
        monogram:  '#C9A84C',
        line:      '#8A6F2E',
        status:    '#E2C97E',
        statusOp:  '0.85',
        topArc:    '#C9A84C', topOp: '0.95',
        botArc:    '#C9A84C', botOp: '0.5',
        capColor:  '#C9A84C',
        pulseClass: 'idr-ring-pulse',
      };
    }
    if (status === 'active') {
      return {
        bg:      theme === 'outline' ? 'none' : '#0A0E1A',
        outerRing: '#C9A84C', outerOp: '0.9', outerW: '1.5',
        innerRing: '#C9A84C', innerOp: '0.22',
        monogram:  '#C9A84C',
        line:      '#8A6F2E',
        status:    '#C9A84C',
        statusOp:  '0.75',
        topArc:    '#C9A84C', topOp: '0.85',
        botArc:    '#C9A84C', botOp: '0.4',
        capColor:  '#C9A84C',
        pulseClass: 'idr-ring-pulse',
      };
    }
    if (status === 'monitoring') {
      return {
        bg:      theme === 'outline' ? 'none' : '#0A0E1A',
        outerRing: '#C8C8D8', outerOp: '0.7', outerW: '1.5',
        innerRing: '#C8C8D8', innerOp: '0.18',
        monogram:  '#C8C8D8',
        line:      '#888898',
        status:    '#C8C8D8',
        statusOp:  '0.6',
        topArc:    '#C8C8D8', topOp: '0.7',
        botArc:    '#C8C8D8', botOp: '0.35',
        capColor:  '#C8C8D8',
        pulseClass: '',
      };
    }
    // expired
    return {
      bg:      theme === 'outline' ? 'none' : '#0A0E1A',
      outerRing: '#555', outerOp: '0.45', outerW: '1.5',
      innerRing: '#555', innerOp: '0.15',
      monogram:  '#555',
      line:      '#444',
      status:    '#555',
      statusOp:  '0.5',
      topArc:    '#555', topOp: '0.5',
      botArc:    '#555', botOp: '0.3',
      capColor:  '#555',
      pulseClass: '',
    };
  }

  // ── SVG seal builder ─────────────────────────────────────────────────────────
  function buildSeal(size, theme, status, tier) {
    var p    = palette(theme, status, tier);
    var half = size / 2;
    var outerR  = half - 1.5;
    var innerR  = outerR - (size * 0.11);
    var textR   = outerR - 4;   // arc radius for circular text
    var idrSize = Math.round(size * 0.29);
    var lineY   = half + Math.round(size * 0.075);
    var lineW   = Math.round(size * 0.29);
    var stY     = half + Math.round(size * 0.20);
    var stSize  = Math.max(4, Math.round(size * 0.078));
    var stLS    = Math.round(size * 0.024 * 10) / 10;

    // Arc paths
    var topPath = 'M ' + (half - textR) + ',' + half + ' A ' + textR + ',' + textR + ' 0 0,1 ' + (half + textR) + ',' + half;
    var botPath = 'M ' + (half - textR) + ',' + half + ' A ' + textR + ',' + textR + ' 0 0,0 ' + (half + textR) + ',' + half;

    var uid    = 'idr' + Math.random().toString(36).slice(2, 7);
    var topId  = uid + 'T';
    var botId  = uid + 'B';

    // Top arc text
    var topLabel = tier === 'founding'
      ? 'INSTITUTE OF DIGITAL REMEDIATION'
      : 'INSTITUTE OF DIGITAL REMEDIATION';
    // Bottom arc text
    var botLabel = tier === 'founding'
      ? 'FOUNDING MEMBER'
      : 'IDR PROTOCOL REGISTRY';

    // Status label
    var statusLabel = status === 'active'
      ? (tier === 'founding' ? 'FOUNDING MEMBER' : 'IDR VERIFIED')
      : status === 'monitoring' ? 'MONITORING' : 'UNVERIFIED';

    // Arc font sizes scale with badge
    var arcTopSize = Math.max(3.5, Math.round(size * 0.060));
    var arcTopLS   = Math.max(0.8, Math.round(size * 0.015 * 10) / 10);
    var arcBotSize = Math.max(3, Math.round(size * 0.052));
    var arcBotLS   = Math.max(0.7, Math.round(size * 0.018 * 10) / 10);
    var topDy      = -Math.max(2, Math.round(size * 0.04));   // push away from ring
    var botDy      = Math.max(6, Math.round(size * 0.08));    // pull away from ring downward

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="IDR Shield ' + statusLabel + ' badge">' +
      '<defs>' +
        '<path id="' + topId + '" d="' + topPath + '"/>' +
        '<path id="' + botId + '" d="' + botPath + '"/>' +
      '</defs>' +

      // Background fill
      (p.bg !== 'none' ? '<circle cx="' + half + '" cy="' + half + '" r="' + (half - 0.5) + '" fill="' + p.bg + '"/>' : '') +

      // Outer ring
      '<circle cx="' + half + '" cy="' + half + '" r="' + outerR + '" fill="none" stroke="' + p.outerRing + '" stroke-width="' + p.outerW + '" opacity="' + p.outerOp + '"' + (p.pulseClass ? ' style="animation:idr-ring-pulse 3s ease infinite"' : '') + '/>' +

      // Inner ring
      '<circle cx="' + half + '" cy="' + half + '" r="' + innerR + '" fill="none" stroke="' + p.innerRing + '" stroke-width="0.7" opacity="' + p.innerOp + '"/>';

    // Circular text — only at 52px and above
    if (size >= 52) {
      svg +=
        '<text font-family="Montserrat,sans-serif" font-size="' + arcTopSize + '" font-weight="700" letter-spacing="' + arcTopLS + '" fill="' + p.topArc + '" opacity="' + p.topOp + '">' +
          '<textPath href="#' + topId + '" startOffset="50%" text-anchor="middle" dy="' + topDy + '">' + topLabel + '</textPath>' +
        '</text>' +
        '<text font-family="Montserrat,sans-serif" font-size="' + arcBotSize + '" font-weight="600" letter-spacing="' + arcBotLS + '" fill="' + p.botArc + '" opacity="' + p.botOp + '">' +
          '<textPath href="#' + botId + '" startOffset="50%" text-anchor="middle" dy="' + botDy + '">' + botLabel + '</textPath>' +
        '</text>';
    }

    svg +=
      // IDR Monogram
      '<text x="' + half + '" y="' + (half - Math.round(size * 0.03)) + '" font-family="\'Playfair Display\',Georgia,serif" font-size="' + idrSize + '" font-weight="700" fill="' + p.monogram + '" text-anchor="middle" dominant-baseline="middle">IDR</text>' +

      // Separator
      '<line x1="' + (half - lineW) + '" y1="' + lineY + '" x2="' + (half + lineW) + '" y2="' + lineY + '" stroke="' + p.line + '" stroke-width="0.8" opacity="0.65"/>';

    // Status text — only at 40px+
    if (size >= 40) {
      svg += '<text x="' + half + '" y="' + stY + '" font-family="Montserrat,sans-serif" font-size="' + stSize + '" font-weight="600" fill="' + p.status + '" text-anchor="middle" letter-spacing="' + stLS + '" opacity="' + p.statusOp + '">' + statusLabel + '</text>';
    }

    svg += '</svg>';
    return svg;
  }

  // ── Caption ──────────────────────────────────────────────────────────────────
  function buildCaption(size, status, tier) {
    if (size < 40) return '';
    var p = palette('dark', status, tier);
    var capSize = Math.max(7, Math.round(size * 0.11));
    var defaultTxt = tier === 'founding' && status === 'active' ? 'FOUNDING MEMBER' : 'IDR VERIFIED';
    return '<span class="idr-badge-cap" style="font-size:' + capSize + 'px;color:' + p.capColor + ';">' +
      '<span class="idr-cap-default">' + defaultTxt + '</span>' +
      '<span class="idr-cap-hover">VIEW RECORD \u2192</span>' +
      '</span>';
  }

  // ── Create anchor ────────────────────────────────────────────────────────────
  var wrap = document.createElement('a');
  wrap.href      = verifyUrl;
  wrap.target    = '_blank';
  wrap.rel       = 'noopener noreferrer';
  wrap.className = 'idr-badge-wrap idr-badge-monitoring';
  wrap.setAttribute('aria-label', 'IDR Shield badge — click to verify compliance record for ' + domain);
  wrap.title = 'IDR Shield · Accessibility Monitored · Click to verify';
  wrap.innerHTML = buildSeal(size, theme, 'monitoring', tier) + buildCaption(size, 'monitoring', tier);
  tag.parentNode.insertBefore(wrap, tag.nextSibling);

  // ── Fetch live status ────────────────────────────────────────────────────────
  fetch(BACKEND + '/api/badge/' + domain, { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var status = (d.status || 'expired').toLowerCase();
      wrap.className = 'idr-badge-wrap idr-badge-' + status;
      wrap.href      = d.registry_url || verifyUrl;
      wrap.innerHTML = buildSeal(size, theme, status, tier) + buildCaption(size, status, tier);
    })
    .catch(function () { /* keep monitoring placeholder */ });

})();
