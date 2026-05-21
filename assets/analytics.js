(function () {
  "use strict";

  var config = window.MEDERAK_ANALYTICS_CONFIG || {};
  var storageKey = config.consentStorageKey || "mederak_google_consent_v1";
  var tagIds = normalizeTagIds(config.googleTagIds || [config.googleTagId, config.googleAdsId]);
  var privacyUrl = config.privacyUrl || "/apps/excel-backlog-importer-for-jira/privacy.html";
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
  } else if (tagIds.length) {
    injectConsentStyles();
    renderManageButton();
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

  function selectedConsent(analytics, ads) {
    return {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: ads ? "granted" : "denied",
      ad_user_data: ads ? "granted" : "denied",
      ad_personalization: ads ? "granted" : "denied"
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
    renderManageButton();
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
      ".mederak-consent{position:fixed;right:16px;bottom:16px;z-index:1000;max-width:520px;border:1px solid #d8e1ec;border-radius:14px;background:#fff;color:#102033;box-shadow:0 24px 70px rgba(16,32,51,.22);padding:18px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
      ".mederak-consent__copy strong{display:block;margin-bottom:6px;font-size:16px}",
      ".mederak-consent__copy p{margin:0 0 8px;color:#5c6b7c;font-size:14px;line-height:1.45}",
      ".mederak-consent__copy a{color:#0747a6;font-weight:800}",
      ".mederak-consent__choices{display:grid;gap:8px;margin:12px 0;color:#33475f;font-size:14px}",
      ".mederak-consent__choices label{display:flex;gap:8px;align-items:center}",
      ".mederak-consent__actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:14px}",
      ".mederak-consent button,.mederak-consent-manage{min-height:38px;border:1px solid #d8e1ec;border-radius:8px;background:#fff;color:#102033;padding:0 12px;font:inherit;font-weight:800;cursor:pointer}",
      ".mederak-consent button.primary{border-color:#0c66e4;background:#0c66e4;color:#fff}",
      ".mederak-consent-manage{position:fixed;left:12px;bottom:12px;z-index:999;min-height:32px;background:rgba(255,255,255,.92);font-size:12px;box-shadow:0 10px 30px rgba(16,32,51,.12)}",
      "@media(max-width:640px){.mederak-consent{right:10px;bottom:10px;left:10px;max-width:none;padding:14px}.mederak-consent__actions{display:grid;grid-template-columns:1fr}.mederak-consent button{width:100%}}"
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
    banner.setAttribute("aria-label", "Privacy preferences");
    banner.innerHTML = [
      '<div class="mederak-consent__copy">',
      "<strong>Privacy preferences</strong>",
      "<p>We use Google Analytics and, when enabled, Google Ads measurement to understand website performance and campaign results. You can accept all, reject optional measurement, or choose categories.</p>",
      '<a href="' + privacyUrl + '">Privacy Policy</a>',
      "</div>",
      '<div class="mederak-consent__choices" hidden>',
      '<label><input type="checkbox" data-consent-analytics checked> Analytics measurement</label>',
      '<label><input type="checkbox" data-consent-ads> Ads measurement and personalization</label>',
      "</div>",
      '<div class="mederak-consent__actions">',
      '<button type="button" data-consent-reject>Reject optional</button>',
      '<button type="button" data-consent-customize>Customize</button>',
      '<button type="button" class="primary" data-consent-accept>Accept all</button>',
      "</div>"
    ].join("");

    document.body.appendChild(banner);

    banner.querySelector("[data-consent-accept]").addEventListener("click", function () {
      acceptConsent(grantedConsent());
    });

    banner.querySelector("[data-consent-reject]").addEventListener("click", function () {
      acceptConsent(deniedConsent());
    });

    banner.querySelector("[data-consent-customize]").addEventListener("click", function () {
      var choices = banner.querySelector(".mederak-consent__choices");
      if (choices.hidden) {
        choices.hidden = false;
        this.textContent = "Save choices";
        return;
      }
      acceptConsent(selectedConsent(
        banner.querySelector("[data-consent-analytics]").checked,
        banner.querySelector("[data-consent-ads]").checked
      ));
    });
  }

  function renderManageButton() {
    if (document.querySelector(".mederak-consent-manage")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "mederak-consent-manage";
    button.textContent = "Privacy settings";
    button.addEventListener("click", renderConsentBanner);
    document.body.appendChild(button);
  }

  function removeConsentUi() {
    document.querySelectorAll(".mederak-consent, .mederak-consent-manage").forEach(function (element) {
      element.remove();
    });
  }
}());
