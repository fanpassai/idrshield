/**
 * IDR Shield — HHS Badge v3.0
 * Institute of Digital Remediation · IDR-BRAND-2026-01
 *
 * Healthcare-sector compliance badge. Zero conflict with badge.js (e-commerce).
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   <script src="https://idrshield.com/hhs_badge.js"
 *           data-domain="yourclinic.com"
 *           data-theme="dark"
 *           data-size="52">
 *   </script>
 *
 *   data-theme    "dark"    — dark seal on light backgrounds
 *                 "outline" — gold outline on dark backgrounds
 *   data-size     72 | 52 | 40 | 28
 *
 * ─── STATES ──────────────────────────────────────────────────────────────────
 *   not_monitored  gray    no enrollment   → seal: UNVERIFIED
 *   on_record      gold    $497 audit      → seal: VERIFIED  (static — snapshot has no heartbeat)
 *   active         gold    $49/mo active   → seal: MONITORED (three expanding pulse rings)
 */

(function () {
  'use strict';

  var BACKEND     = 'https://idr-backend-production.up.railway.app';
  var VERIFY_BASE = 'https://idrshield.com/hhs-verify/';
  var FONT_URL    = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@600;700&display=swap';
  var VALID_SIZES = [28, 40, 52, 72];

  var scripts = document.querySelectorAll('script[data-domain]');
  var tag     = scripts[scripts.length - 1];
  if (!tag) return;

  var domain = (tag.getAttribute('data-domain') || '')
    .replace(/^https?:\/\//i, '').split('/')[0].toLowerCase().trim();
  var theme  = (tag.getAttribute('data-theme') || 'dark').toLowerCase();
  var size   = parseInt(tag.getAttribute('data-size') || '52', 10);
  if (VALID_SIZES.indexOf(size) === -1) size = 52;
  if (!domain) return;

  var verifyUrl = VERIFY_BASE + domain;

  /* ─── FONTS ── */
  if (!document.getElementById('idr-hhs-fonts')) {
    var lnk = document.createElement('link');
    lnk.id = 'idr-hhs-fonts'; lnk.rel = 'stylesheet'; lnk.href = FONT_URL;
    document.head.appendChild(lnk);
  }

  /* ─── CSS ── */
  if (!document.getElementById('idr-hhs-css')) {
    var st = document.createElement('style');
    st.id  = 'idr-hhs-css';
    st.textContent =
      '.idr-hhs-wrap{display:inline-flex;flex-direction:column;align-items:center;' +
      'text-decoration:none;border:none;background:none;padding:0;cursor:pointer;' +
      '-webkit-tap-highlight-color:transparent;position:relative;}' +

      '.idr-hhs-wrap:focus{outline:2px solid rgba(201,168,76,0.7);outline-offset:10px;border-radius:50%;}' +
      '.idr-hhs-wrap:focus:not(:focus-visible){outline:none;}' +

      /* overflow:visible is critical — rings must expand beyond badge bounds */
      '.idr-hhs-pulse-wrap{position:relative;display:flex;align-items:center;' +
      'justify-content:center;overflow:visible;}' +

      /* Rings: invisible at rest — no static halos */
      '.idr-hhs-ring{position:absolute;top:50%;left:50%;border-radius:50%;' +
      'border:1.5px solid rgba(201,168,76,0.6);box-sizing:border-box;' +
      'transform:translate(-50%,-50%) scale(1);opacity:0;pointer-events:none;}' +

      /* Only .idr-hhs-active fires the rings */
      '.idr-hhs-active .idr-hhs-ring-1{animation:idr-hhs-ripple 2.8s ease-out infinite 0s;}' +
      '.idr-hhs-active .idr-hhs-ring-2{animation:idr-hhs-ripple 2.8s ease-out infinite 0.93s;}' +
      '.idr-hhs-active .idr-hhs-ring-3{animation:idr-hhs-ripple 2.8s ease-out infinite 1.86s;}' +

      /* Start invisible, snap visible at 5%, expand, fade — zero static halo */
      '@keyframes idr-hhs-ripple{' +
      '0%{transform:translate(-50%,-50%) scale(1.0);opacity:0;}' +
      '5%{opacity:0.70;}' +
      '100%{transform:translate(-50%,-50%) scale(1.9);opacity:0;}}' +

      '@-webkit-keyframes idr-hhs-ripple{' +
      '0%{-webkit-transform:translate(-50%,-50%) scale(1.0);opacity:0;}' +
      '5%{opacity:0.70;}' +
      '100%{-webkit-transform:translate(-50%,-50%) scale(1.9);opacity:0;}}' +

      '.idr-hhs-wrap svg{display:block;position:relative;z-index:2;' +
      'transition:transform 0.24s ease,filter 0.24s ease;}' +

      /* Outer ring breathes for active state */
      '@keyframes idr-hhs-breathe{0%,100%{opacity:1;}50%{opacity:0.38;}}' +
      '@-webkit-keyframes idr-hhs-breathe{0%,100%{opacity:1;}50%{opacity:0.38;}}' +

      /* Hover effects */
      '.idr-hhs-wrap:hover svg{transform:scale(1.07);}' +
      '.idr-hhs-active:hover svg{filter:drop-shadow(0 0 12px rgba(201,168,76,0.65));}' +
      '.idr-hhs-on-record:hover svg{filter:drop-shadow(0 0 7px rgba(201,168,76,0.4));}' +
      '.idr-hhs-not-monitored:hover svg{filter:drop-shadow(0 0 5px rgba(80,80,100,0.22));}' +

      /* Caption */
      '.idr-hhs-cap{font-family:"Montserrat",Arial,sans-serif;font-weight:700;' +
      'letter-spacing:0.14em;text-transform:uppercase;margin-top:7px;display:block;' +
      'text-align:center;line-height:1;white-space:nowrap;}' +
      '.idr-hhs-cap-d{display:block;}' +
      '.idr-hhs-cap-h{display:none;}' +
      '.idr-hhs-wrap:hover .idr-hhs-cap-d{display:none;}' +
      '.idr-hhs-wrap:hover .idr-hhs-cap-h{display:block;}' +

      '@media(hover:none){' +
      '.idr-hhs-wrap:hover svg{transform:none!important;filter:none!important;}' +
      '.idr-hhs-wrap:hover .idr-hhs-cap-d{display:block;}' +
      '.idr-hhs-wrap:hover .idr-hhs-cap-h{display:none;}}' +

      '@media(prefers-reduced-motion:reduce){' +
      '.idr-hhs-ring{animation:none!important;}' +
      '.idr-hhs-wrap svg{transition:none!important;}}';

    document.head.appendChild(st);
  }

  /* ─── PALETTES ── */
  function palette(state) {
    var out = (theme === 'outline');
    if (state === 'active') return {
      bg: out ? 'none' : '#0A0E1A',
      outerStroke: '#C9A84C', outerOp: '1', outerW: '2', outerAnim: true,
      innerStroke: '#C9A84C', innerOp: '0.26',
      mono: '#C9A84C', monoOp: '1',
      line: '#8A6F2E', lineOp: '0.72',
      stFill: '#E2C97E', stOp: '0.90',
      arcFill: '#C9A84C', arcTopOp: '0.88', arcBotOp: '0.50',
      cap: '#C9A84C', capHov: '#E2C97E'
    };
    if (state === 'on_record') return {
      bg: out ? 'none' : '#0A0E1A',
      outerStroke: '#C9A84C', outerOp: '0.80', outerW: '1.5', outerAnim: false,
      innerStroke: '#C9A84C', innerOp: '0.17',
      mono: '#C9A84C', monoOp: '0.86',
      line: '#8A6F2E', lineOp: '0.58',
      stFill: '#C9A84C', stOp: '0.68',
      arcFill: '#C9A84C', arcTopOp: '0.76', arcBotOp: '0.38',
      cap: '#C9A84C', capHov: '#E2C97E'
    };
    return { /* not_monitored — deliberately lifeless */
      bg: out ? 'none' : '#0A0E1A',
      outerStroke: '#4E4E60', outerOp: '0.24', outerW: '1.2', outerAnim: false,
      innerStroke: '#4E4E60', innerOp: '0.10',
      mono: '#4E4E60', monoOp: '0.26',
      line: '#303040', lineOp: '0.40',
      stFill: '#4E4E60', stOp: '0.26',
      arcFill: '#4E4E60', arcTopOp: '0.20', arcBotOp: '0.15',
      cap: 'rgba(110,110,130,0.34)', capHov: 'rgba(201,168,76,0.50)'
    };
  }

  /* ─── SVG BUILDER ── */
  function buildSVG(state) {
    var p    = palette(state);
    var half = size / 2;

    /* Core geometry */
    var outerR   = half - 1.8;
    var innerR   = outerR * 0.758;
    var idrSz    = (size * 0.282).toFixed(1);
    var idrY     = (half - size * 0.028).toFixed(2);
    var lineY    = (half + size * 0.076).toFixed(2);
    var lineHalf = (size * 0.268).toFixed(2);
    var stY      = (half + size * 0.196).toFixed(2);
    var stSz     = Math.max(4, size * 0.076).toFixed(1);
    /* ON RECORD is 9 chars vs 6 for ACTIVE/INACTIVE — tighter spacing to fit the circle */
    var stLS     = (state === 'on_record'
      ? Math.max(0.1, size * 0.008)
      : Math.max(0.5, size * 0.022)).toFixed(2);

    /* Arc text geometry
     * textR = midpoint of ring gap = (outerR + innerR) / 2
     * arcTopSz / arcBotSz chosen so text FITS within half-circumference.
     * Verified: at these values, text width < arc length for all sizes.
     * 52px: text≈60px < arc≈67px  72px: text≈77px < arc≈94px */
    var textR    = ((outerR + innerR) / 2).toFixed(2);
    var arcTopSz = Math.max(2.5, size * 0.044).toFixed(2);
    var arcTopLS = Math.max(0.15, size * 0.005).toFixed(2);
    var arcBotSz = Math.max(2.2, size * 0.040).toFixed(2);
    var arcBotLS = Math.max(0.30, size * 0.008).toFixed(2);
    var topDy    = -(Math.max(2, size * 0.04)).toFixed(1);
    var botDy    =  (Math.max(6, size * 0.08)).toFixed(1);

    /* Arc paths — semicircles for textPath */
    var topPath = 'M ' + (half - textR) + ',' + half
      + ' A ' + textR + ',' + textR + ' 0 0,1 '
      + (half + textR) + ',' + half;
    var botPath = 'M ' + (half - textR) + ',' + half
      + ' A ' + textR + ',' + textR + ' 0 0,0 '
      + (half + textR) + ',' + half;

    /* Unique IDs — prevent collision if multiple badges on same page */
    var uid = 'ihhs' + Math.random().toString(36).slice(2, 8);

    /* Labels by state */
    var stLabel  = state === 'active'    ? 'ACTIVE'
                 : state === 'on_record' ? 'ON RECORD'
                 : 'INACTIVE';
    var botLabel = state === 'not_monitored' ? 'NOT MONITORED'
                 : 'HHS \u00B7 SECTION 504';

    var outerStyle = p.outerAnim
      ? ' style="animation:idr-hhs-breathe 2.8s ease-in-out infinite;"'
      : '';

    var s = '<svg xmlns="http://www.w3.org/2000/svg"'
      + ' width="' + size + '" height="' + size + '"'
      + ' viewBox="0 0 ' + size + ' ' + size + '"'
      + ' role="img" aria-label="IDR HHS badge \u2014 ' + stLabel + '">';

    if (size >= 52) {
      s += '<defs>'
        + '<path id="' + uid + 'T" d="' + topPath + '"/>'
        + '<path id="' + uid + 'B" d="' + botPath + '"/>'
        + '</defs>';
    }

    /* Background */
    if (p.bg !== 'none') {
      s += '<circle cx="' + half + '" cy="' + half + '" r="' + (half - 0.5) + '" fill="' + p.bg + '"/>';
    }

    /* Outer ring */
    s += '<circle cx="' + half + '" cy="' + half + '" r="' + outerR.toFixed(2) + '"'
      + ' fill="none" stroke="' + p.outerStroke + '" stroke-width="' + p.outerW + '"'
      + ' opacity="' + p.outerOp + '"' + outerStyle + '/>';

    /* Inner ring */
    s += '<circle cx="' + half + '" cy="' + half + '" r="' + innerR.toFixed(2) + '"'
      + ' fill="none" stroke="' + p.innerStroke + '" stroke-width="0.65"'
      + ' opacity="' + p.innerOp + '"/>';

    /* Arc text — 52px and above only */
    if (size >= 52) {
      s += '<text font-family="Montserrat,Arial,sans-serif"'
        + ' font-size="' + arcTopSz + '" font-weight="700"'
        + ' letter-spacing="' + arcTopLS + '"'
        + ' fill="' + p.arcFill + '" opacity="' + p.arcTopOp + '">'
        + '<textPath href="#' + uid + 'T" startOffset="50%"'
        + ' text-anchor="middle" dy="' + topDy + '">'
        + 'INSTITUTE OF DIGITAL REMEDIATION'
        + '</textPath></text>';

      s += '<text font-family="Montserrat,Arial,sans-serif"'
        + ' font-size="' + arcBotSz + '" font-weight="600"'
        + ' letter-spacing="' + arcBotLS + '"'
        + ' fill="' + p.arcFill + '" opacity="' + p.arcBotOp + '">'
        + '<textPath href="#' + uid + 'B" startOffset="50%"'
        + ' text-anchor="middle" dy="' + botDy + '">'
        + botLabel
        + '</textPath></text>';
    }

    /* IDR monogram */
    s += '<text x="' + half + '" y="' + idrY + '"'
      + ' font-family="\'Playfair Display\',Georgia,serif"'
      + ' font-size="' + idrSz + '" font-weight="700"'
      + ' fill="' + p.mono + '" opacity="' + p.monoOp + '"'
      + ' text-anchor="middle" dominant-baseline="middle">IDR</text>';

    /* Separator line */
    s += '<line x1="' + (half - lineHalf) + '" y1="' + lineY + '"'
      + ' x2="' + (half + lineHalf) + '" y2="' + lineY + '"'
      + ' stroke="' + p.line + '" stroke-width="0.75" opacity="' + p.lineOp + '"/>';

    /* Status label — 40px and above */
    if (size >= 40) {
      s += '<text x="' + half + '" y="' + stY + '"'
        + ' font-family="Montserrat,Arial,sans-serif"'
        + ' font-size="' + stSz + '" font-weight="600"'
        + ' fill="' + p.stFill + '" text-anchor="middle"'
        + ' letter-spacing="' + stLS + '" opacity="' + p.stOp + '">'
        + stLabel + '</text>';
    }

    return s + '</svg>';
  }

  /* ─── PULSE RINGS ── */
  function buildRings() {
    var r = '';
    for (var i = 1; i <= 3; i++) {
      r += '<span class="idr-hhs-ring idr-hhs-ring-' + i + '"'
        + ' style="width:' + size + 'px;height:' + size + 'px;" aria-hidden="true"></span>';
    }
    return r;
  }

  /* ─── CAPTION ── */
  function buildCaption(state) {
    if (size < 40) return '';
    var p     = palette(state);
    var capSz = Math.max(7, Math.round(size * 0.108));
    var lbl   = state === 'active'    ? 'ACTIVE'
              : state === 'on_record' ? 'ON RECORD'
              : 'INACTIVE';
    return '<span class="idr-hhs-cap" style="font-size:' + capSz + 'px;color:' + p.cap + ';">'
      + '<span class="idr-hhs-cap-d">' + lbl + '</span>'
      + '<span class="idr-hhs-cap-h" style="color:' + p.capHov + ';">VIEW RECORD \u2192</span>'
      + '</span>';
  }

  /* ─── FULL RENDER ── */
  function render(state) {
    return '<div class="idr-hhs-pulse-wrap" style="width:' + size + 'px;height:' + size + 'px;">'
      + buildRings() + buildSVG(state) + '</div>' + buildCaption(state);
  }

  function ariaLabel(state) {
    var lbl = state === 'active'    ? 'Active'
            : state === 'on_record' ? 'On Record'
            : 'Inactive';
    return 'IDR HHS Compliance — ' + lbl + ' — ' + domain + '. Click to verify.';
  }

  function mapStatus(raw) {
    var r = (raw || '').toLowerCase().trim();
    if (r === 'active' || r === 'monitoring')                    return 'active';
    if (r === 'manual_verified' || r === 'verified' || r === 'on_record') return 'on_record';
    return 'not_monitored';
  }

  /* ─── MOUNT ── */
  var wrap       = document.createElement('a');
  wrap.href      = verifyUrl;
  wrap.target    = '_blank';
  wrap.rel       = 'noopener noreferrer';
  wrap.className = 'idr-hhs-wrap idr-hhs-not-monitored';
  wrap.setAttribute('aria-label', ariaLabel('not_monitored'));
  wrap.title     = 'IDR HHS Compliance — click to verify';
  wrap.innerHTML = render('not_monitored');
  tag.parentNode.insertBefore(wrap, tag.nextSibling);

  /* ─── FETCH LIVE STATUS ── */
  fetch(BACKEND + '/api/registry/' + encodeURIComponent(domain), { cache: 'no-store' })
    .then(function (r) {
      if (r.status === 404) return { status: 'not_monitored' };
      if (!r.ok) throw new Error('registry ' + r.status);
      return r.json();
    })
    .then(function (d) {
      var state = mapStatus(d.status);
      wrap.className = 'idr-hhs-wrap idr-hhs-' + state.replace(/_/g, '-');
      wrap.href      = d.registry_url || verifyUrl;
      wrap.setAttribute('aria-label', ariaLabel(state));
      wrap.innerHTML = render(state);
    })
    .catch(function () { /* silent — stays not_monitored */ });

})();
