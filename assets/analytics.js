(function () {
  "use strict";

  var config = window.MEDERAK_ANALYTICS_CONFIG || {};
  var storageKey = config.consentStorageKey || "mederak_google_consent_v1";
  var tagIds = normalizeTagIds(config.googleTagIds || [config.googleTagId, config.googleAdsId]);
  var privacyUrl = config.privacyUrl || "/apps/excel-to-jira-importer-uploader/privacy.html";
  var destinations = config.eventDestinations || {};

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  var savedConsent = readConsent();
  setDefaultConsent(savedConsent || deniedConsent(), savedConsent ? 0 : 500);

  if (tagIds.length) {
    loadGoogleTag(tagIds[0]);
    window.gtag("js", new Date());
    tagIds.forEach(function (tagId) {
      window.gtag("config", tagId);
    });
  }

  if (!savedConsent && tagIds.length) {
    injectConsentStyles();
    renderConsentBanner();
  }

  trackConfiguredClicks();

  function normalizeTagIds(ids) {
    return (ids || [])
      .filter(Boolean)
      .map(function (id) { return String(id).trim(); })
      .filter(function (id, index, all) {
        return id && id.indexOf("REPLACE") === -1 && all.indexOf(id) === index;
      });
  }

  function deniedConsent() {
    return {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    };
  }

  function grantedConsent() {
    return {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    };
  }

  function setDefaultConsent(consent, waitForUpdate) {
    window.gtag("consent", "default", Object.assign({}, consent, {
      wait_for_update: waitForUpdate
    }));
  }

  function updateConsent(consent) {
    window.gtag("consent", "update", consent);
  }

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw).consent : null;
    } catch (error) {
      return null;
    }
  }

  function saveConsent(consent) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        savedAt: new Date().toISOString(),
        consent: consent
      }));
    } catch (error) {
      // Consent still applies for the current page even if storage is unavailable.
    }
  }

  function acceptConsent(consent) {
    saveConsent(consent);
    updateConsent(consent);
    removeConsentUi();
  }

  function loadGoogleTag(tagId) {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(tagId);
    document.head.appendChild(script);
  }

  function injectConsentStyles() {
    if (document.querySelector("#mederak-consent-styles")) return;
    var style = document.createElement("style");
    style.id = "mederak-consent-styles";
    style.textContent = [
      ".mederak-consent{position:fixed;right:16px;bottom:16px;left:16px;z-index:1000;display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:980px;margin:0 auto;border:1px solid #d8e1ec;border-radius:10px;background:#fff;color:#102033;box-shadow:0 18px 54px rgba(16,32,51,.18);padding:12px 14px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
      ".mederak-consent__copy p{margin:0;color:#5c6b7c;font-size:13px;line-height:1.45}",
      ".mederak-consent__copy a{color:#0747a6;font-weight:800}",
      ".mederak-consent__actions{display:flex;flex:0 0 auto;gap:8px}",
      ".mederak-consent button{min-height:36px;border:1px solid #d8e1ec;border-radius:8px;background:#fff;color:#102033;padding:0 12px;font:inherit;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap}",
      ".mederak-consent button.primary{border-color:#0c66e4;background:#0c66e4;color:#fff}",
      "@media(max-width:640px){.mederak-consent{right:10px;bottom:10px;left:10px;display:grid;gap:10px;padding:12px}.mederak-consent__actions{display:grid;grid-template-columns:1fr 1fr}.mederak-consent button{width:100%}}"
    ].join("");
    document.head.appendChild(style);
  }

  function trackConfiguredClicks() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest("[data-analytics-event]");
      if (!link || typeof window.gtag !== "function") return;

      var eventName = link.getAttribute("data-analytics-event");
      var destination = destinations[eventName];
      var params = {
        event_category: "engagement",
        event_label: link.textContent.trim(),
        product: link.getAttribute("data-product") || undefined,
        link_url: link.href || undefined,
        page_location: window.location.href
      };

      if (destination) params.send_to = destination;
      window.gtag("event", eventName, params);
    });
  }

  function renderConsentBanner() {
    removeConsentUi();

    var banner = document.createElement("section");
    banner.className = "mederak-consent";
    banner.setAttribute("aria-label", "Cookie notice");
    banner.innerHTML = [
      '<div class="mederak-consent__copy">',
      '<p>We use optional Google measurement cookies to understand website performance. See the <a href="' + privacyUrl + '">Privacy Policy</a>.</p>',
      "</div>",
      '<div class="mederak-consent__actions">',
      '<button type="button" data-consent-reject>Reject</button>',
      '<button type="button" class="primary" data-consent-accept>Accept</button>',
      "</div>"
    ].join("");

    document.body.appendChild(banner);

    banner.querySelector("[data-consent-accept]").addEventListener("click", function () {
      acceptConsent(grantedConsent());
    });

    banner.querySelector("[data-consent-reject]").addEventListener("click", function () {
      acceptConsent(deniedConsent());
    });
  }

  function removeConsentUi() {
    document.querySelectorAll(".mederak-consent").forEach(function (element) {
      element.remove();
    });
  }
}());
