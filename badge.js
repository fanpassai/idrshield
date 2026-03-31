/**
 * IDR Shield — Verified Badge Embed
 * Institute of Digital Remediation
 * Drop into any store footer. Self-contained. No dependencies.
 *
 * Usage:
 * <script src="https://idrshield.com/badge.js"
 *   data-store="yourstore.com"
 *   data-registry="IDR-REG-2026-XXXXXXXX">
 * </script>
 */

(function () {
  'use strict';

  var API = 'https://idr-backend-production.up.railway.app';

  // Find this script tag
  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var domain = thisScript.getAttribute('data-store');
  var registryId = thisScript.getAttribute('data-registry');

  if (!domain) {
    console.warn('[IDR Badge] data-store attribute required');
    return;
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  var CSS = [
    '.idr-badge-wrap {',
    '  display: inline-block;',
    '  font-family: Arial, Helvetica, sans-serif;',
    '  text-decoration: none;',
    '  cursor: pointer;',
    '}',

    '.idr-badge {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 8px;',
    '  padding: 7px 12px 7px 10px;',
    '  background: #080d1a;',
    '  border: 1px solid #C4A052;',
    '  border-radius: 4px;',
    '  transition: border-color 0.2s;',
    '}',

    '.idr-badge:hover {',
    '  border-color: #d4b062;',
    '}',

    '.idr-badge-seal {',
    '  width: 28px;',
    '  height: 28px;',
    '  flex-shrink: 0;',
    '}',

    '.idr-badge-text {',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 1px;',
    '}',

    '.idr-badge-label {',
    '  font-size: 8px;',
    '  font-weight: 700;',
    '  letter-spacing: 0.12em;',
    '  text-transform: uppercase;',
    '  color: rgba(196,160,82,0.7);',
    '  line-height: 1;',
    '}',

    '.idr-badge-name {',
    '  font-size: 11px;',
    '  font-weight: 700;',
    '  color: #F0E8D8;',
    '  line-height: 1;',
    '  letter-spacing: 0.02em;',
    '}',

    '.idr-badge-status {',
    '  display: inline-block;',
    '  padding: 1px 6px;',
    '  border-radius: 10px;',
    '  font-size: 7.5px;',
    '  font-weight: 700;',
    '  letter-spacing: 0.1em;',
    '  text-transform: uppercase;',
    '  margin-top: 2px;',
    '  line-height: 1.4;',
    '}',

    '.idr-status-active   { background: #27AE60; color: #fff; }',
    '.idr-status-monitoring { background: #E67E22; color: #fff; }',
    '.idr-status-expired  { background: #555; color: #fff; }',
    '.idr-status-loading  { background: #333; color: #888; }',
  ].join('\n');

  // ── Seal SVG (mini IDR institutional mark) ────────────────────────────────

  var SEAL_SVG = [
    '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">',
    '  <circle cx="20" cy="20" r="19" fill="#080d1a" stroke="#C4A052" stroke-width="1.2"/>',
    '  <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(196,160,82,0.3)" stroke-width="0.6"/>',
    '  <text x="20" y="17" text-anchor="middle" font-family="Arial" font-size="5.5"',
    '    font-weight="700" fill="rgba(196,160,82,0.6)" letter-spacing="0.5">IDR</text>',
    '  <text x="20" y="24" text-anchor="middle" font-family="Arial" font-size="9"',
    '    font-weight="700" fill="#C4A052">✓</text>',
    '</svg>',
  ].join('');

  // ── Inject styles ─────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById('idr-badge-styles')) return;
    var style = document.createElement('style');
    style.id = 'idr-badge-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ── Build badge DOM ───────────────────────────────────────────────────────

  function buildBadge(status, score, registryUrl) {
    var statusClass = {
      'active':     'idr-status-active',
      'monitoring': 'idr-status-monitoring',
      'expired':    'idr-status-expired',
    }[status] || 'idr-status-monitoring';

    var statusLabel = {
      'active':     'Active',
      'monitoring': 'Monitoring',
      'expired':    'Expired',
    }[status] || 'Monitoring';

    var scoreText = score != null ? ' · ' + score + '/100' : '';

    var wrap = document.createElement('a');
    wrap.className = 'idr-badge-wrap';
    wrap.href = registryUrl || ('https://idrshield.com/verify/' + domain);
    wrap.target = '_blank';
    wrap.rel = 'noopener noreferrer';
    wrap.title = 'IDR Shield — Accessibility Compliance Verified';
    wrap.setAttribute('aria-label',
      'IDR Shield accessibility compliance badge — ' + statusLabel);

    wrap.innerHTML = [
      '<div class="idr-badge">',
      '  <div class="idr-badge-seal">' + SEAL_SVG + '</div>',
      '  <div class="idr-badge-text">',
      '    <span class="idr-badge-label">Institute of Digital Remediation</span>',
      '    <span class="idr-badge-name">IDR Shield</span>',
      '    <span class="idr-badge-status ' + statusClass + '">' + statusLabel + scoreText + '</span>',
      '  </div>',
      '</div>',
    ].join('');

    return wrap;
  }

  function buildLoadingBadge() {
    var wrap = document.createElement('div');
    wrap.className = 'idr-badge-wrap';
    wrap.innerHTML = [
      '<div class="idr-badge">',
      '  <div class="idr-badge-seal">' + SEAL_SVG + '</div>',
      '  <div class="idr-badge-text">',
      '    <span class="idr-badge-label">Institute of Digital Remediation</span>',
      '    <span class="idr-badge-name">IDR Shield</span>',
      '    <span class="idr-badge-status idr-status-loading">Verifying…</span>',
      '  </div>',
      '</div>',
    ].join('');
    return wrap;
  }

  // ── Fetch live status and render ──────────────────────────────────────────

  function render() {
    injectStyles();

    // Create container and insert after this script tag
    var container = document.createElement('div');
    container.id = 'idr-badge-container-' + domain.replace(/\./g, '-');
    thisScript.parentNode.insertBefore(container, thisScript.nextSibling);

    // Show loading state immediately
    container.appendChild(buildLoadingBadge());

    // Fetch live data from IDR API
    var xhr = new XMLHttpRequest();
    xhr.open('GET', API + '/api/badge/' + encodeURIComponent(domain), true);
    xhr.timeout = 5000;

    xhr.onload = function () {
      try {
        var data = JSON.parse(xhr.responseText);
        var status = data.status || 'monitoring';
        var score = data.score != null ? data.score : null;
        var regUrl = data.registry_url ||
          ('https://idrshield.com/verify/' + domain);

        container.innerHTML = '';
        container.appendChild(buildBadge(status, score, regUrl));
      } catch (e) {
        container.innerHTML = '';
        container.appendChild(buildBadge('monitoring', null, null));
      }
    };

    xhr.onerror = function () {
      // On network error, show monitoring badge — never show broken state
      container.innerHTML = '';
      container.appendChild(buildBadge('monitoring', null, null));
    };

    xhr.ontimeout = function () {
      container.innerHTML = '';
      container.appendChild(buildBadge('monitoring', null, null));
    };

    xhr.send();
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
