#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const analytics = fs.readFileSync(path.join(root, 'assets/analytics.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'assets/analytics-config.js'), 'utf8');
const product = 'excel-to-jira-importer-updater';

function element() {
  return { listeners: {}, children: [], removed: false,
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); },
    appendChild(child) { this.children.push(child); },
    setAttribute() {}, removeAttribute() {}, remove() { this.removed = true; },
    querySelector(selector) { return (this.controls ||= {})[selector] ||= element(); }
  };
}
function fixture(savedConsent) {
  const calls = [], storage = new Map();
  if (savedConsent) storage.set('mederak_google_consent_v1', JSON.stringify({ consent: savedConsent }));
  const document = Object.assign(element(), { head: element(), body: element(),
    createElement: element, querySelector: () => null,
    querySelectorAll: () => document.body.children.filter(x => !x.removed)
  });
  const window = { location: { href: 'https://example.invalid/isolated-test' },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    gtag: (...args) => calls.push(args)
  };
  const context = vm.createContext({ window, document });
  vm.runInContext(config, context); vm.runInContext(analytics, context);
  assert.equal(document.listeners.click.length, 1);
  // This fake DOM never loads appended Google scripts or makes a network request.
  return { calls, document, window, context, storage };
}
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2].replaceAll('&amp;', '&')]));
}
function links(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(m => ({ ...attrs(m[1]), text: m[2].replace(/<[^>]*>/g, '').trim() }));
}
function click(f, link, detail) {
  const before = f.calls.length;
  const target = { href: link.href, textContent: link.text,
    getAttribute: name => link[name] || null };
  let prevented = false;
  f.document.listeners.click[0]({ detail, target: { closest: () => target }, preventDefault: () => { prevented = true; } });
  const calls = f.calls.slice(before);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'event');
  assert.equal(calls[0][1], link['data-analytics-event']);
  assert.equal(calls[0][2].product, product);
  assert.equal(calls[0][2].link_url, link.href);
  assert.deepEqual(Object.keys(calls[0][2]).sort(), ['event_category', 'event_label', 'link_url', 'page_location', 'product']);
  assert.equal(prevented, false, 'Analytics must not cancel native navigation');
  assert(!JSON.stringify(calls).includes('PRIVATE_TEXT_TEST'));
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
(async () => {
  const { canonicalRoutes } = await import('../src/data/site-structure.mjs');
  const f = fixture(); let checked = 0;
  for (const file of walk(path.join(root, 'dist')).filter(p => p.endsWith('.html'))) {
    const route = '/' + path.relative(path.join(root, 'dist'), file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
    if (canonicalRoutes.has(route)) continue;
    for (const link of links(fs.readFileSync(file, 'utf8')).filter(l => /^https:\/\/marketplace\.atlassian\.com\/apps\/3429713184(?:[/?]|$)/.test(l.href))) {
      assert(link['data-analytics-event'], `${route}: missing event`);
      assert.equal(link['data-product'], product);
      click(f, link, 1); click(f, link, 0); checked++;
    }
  }
  assert(checked >= 67);
  const landing = fs.readFileSync(path.join(root, 'dist/apps', product, 'index.html'), 'utf8');
  for (const name of ['marketplace_trial_click_hero', 'marketplace_trial_click_final', 'pricing_click', 'docs_click', 'security_click', 'copy_admin_message', 'marketplace_admin_request_click']) {
    const match = [...landing.matchAll(/<(?:a|button)\b([^>]*)>([\s\S]*?)<\/(?:a|button)>/g)].find(m => attrs(m[1])['data-analytics-event'] === name);
    assert(match, `Preserve ${name}`);
    const link = { ...attrs(match[1]), text: match[2].replace(/<[^>]*>/g, '').trim() };
    click(f, link, 1); click(f, link, 0);
  }
  const flags = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'];
  for (const choice of ['reject', 'accept']) {
    const consent = fixture();
    assert(flags.every(k => consent.calls[0][2][k] === 'denied'));
    assert.equal(consent.calls[0][2].wait_for_update, 500);
    const banner = consent.document.body.children[0];
    banner.querySelector(`[data-consent-${choice}]`).listeners.click[0]();
    const update = consent.calls.find(c => c[0] === 'consent' && c[1] === 'update');
    const state = choice === 'accept' ? 'granted' : 'denied';
    assert(flags.every(k => update[2][k] === state));
    assert.equal(banner.removed, true);
    const stored = JSON.parse(consent.storage.get('mederak_google_consent_v1')).consent;
    const restored = fixture(stored);
    assert(flags.every(k => restored.calls[0][2][k] === state));
    assert.equal(restored.document.body.children.length, 0);
  }
  const dynamic = fixture();
  const form = element(), textarea = { value: 'Could not parse date/time format PRIVATE_TEXT_TEST' }, result = element();
  dynamic.document.querySelector = selector => ({ '[data-error-explainer-form]': form, '[data-error-text]': textarea, '[data-error-intent]': { value: 'dates' }, '[data-error-result]': result })[selector];
  dynamic.window.JiraCsvErrorMatcher = require('../tools/jira-csv-error-matcher.js');
  vm.runInContext(fs.readFileSync(path.join(root, 'tools/jira-csv-error-explainer.js'), 'utf8'), dynamic.context);
  form.listeners.submit[0]({ preventDefault() {} });
  const cta = links(result.innerHTML).find(l => l.href.includes('/apps/3429713184'));
  assert(cta); click(dynamic, cta, 1); click(dynamic, cta, 0);
  assert(!JSON.stringify(dynamic.calls).includes('PRIVATE_TEXT_TEST'));
  assert(!JSON.stringify(f.calls).includes('e2j_marketplace_try_click'));
  console.log(`CTA spy passed: ${checked} static links + dynamic result; single mouse/keyboard click events, native navigation, preserved events and consent. No network used.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
