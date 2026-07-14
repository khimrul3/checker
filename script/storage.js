(function () {
  'use strict';

  window.__LYNIX_STORAGE_LOADED = true;

  // ============= CENTRALIZED KEY DEFINITIONS =============
  // Single source of truth for ALL storage key names.
  // Every file MUST reference these constants instead of hardcoded strings.
  var K = {
    TOKEN: 'lynix_token',
    USER_ID: 'lynix_user_id',
    FIRST_NAME: 'lynix_first_name',
    SAVED_BINS: 'lynix_saved_bins',
    SAVED_ID: 'lynix_saved_id',
    CUSTOM_NAME: 'lynix_custom_name',
    CUSTOM_EMAIL: 'lynix_custom_email',
    ADDR_STREET: 'lynix_addr_street',
    ADDR_CITY: 'lynix_addr_city',
    ADDR_ZIP: 'lynix_addr_zip',
    ADDR_COUNTRY: 'lynix_addr_country',
    BG_COLOR: 'lynix_bg_color',
    HAS_CUSTOM_COLOR: 'lynix_has_custom_color',
    BG_ENABLED: 'lynix_bg_enabled',
    PAGE_BG_COLOR: 'lynix_page_bg_color',
    PAGE_HAS_CUSTOM: 'lynix_page_has_custom_color',
    TOGGLE_HIT_SOUND: 'lynix_toggle_hit_sound',
    TOGGLE_AUTO_SS: 'lynix_toggle_auto_ss',
    TOGGLE_TG_FORWARD: 'lynix_toggle_tg_forward',
    LOGS: 'lynix_logs',
    LOGS_CLEARED_AT: 'lynix_logs_cleared_at',

    MUSIC_NAME: 'lynix_music_name',
    MUSIC_DATA: 'lynix_music_data',
    LAST_SEEN_BIN_TIME: 'lynix_last_seen_bin_time',
    CARD_HISTORY: 'lynix_card_history',
  };

  // Expose globally so page-context scripts can use it
  window.LynixKeys = K;

  window.LynixStorage = window.LynixStorage || {};
  var LynixStorage = window.LynixStorage;

  // ============= MIGRATION: old keys -> new keys =============
  // Maps old key names to the new unified key name. Run once on first load.
  var MIGRATION_MAP = {
    // User session (3 old variants -> 1 new)
    'lynixUserToken': K.TOKEN,
    'lynixAutoX_token': K.TOKEN,
    'lynixUserId': K.USER_ID,
    'lynixAutoX_userId': K.USER_ID,
    'cardGenerator_ID': K.USER_ID,
    'lynixUserFirstName': K.FIRST_NAME,
    'lynixAutoX_firstName': K.FIRST_NAME,
    'lynixAutoX_userFirstName': K.FIRST_NAME,
    // BINs
    'lynixSavedBINs': K.SAVED_BINS,
    'cardGenerator_BINs': K.SAVED_BINS,
    // Settings
    'lynixSavedId': K.SAVED_ID,
    'lynixCustomName': K.CUSTOM_NAME,
    'lynixAutoX_customName': K.CUSTOM_NAME,
    'lynixCustomEmail': K.CUSTOM_EMAIL,
    'lynixAutoX_customEmail': K.CUSTOM_EMAIL,
    'lynixBackgroundColor': K.BG_COLOR,
    'lynixUserHasSetColor': K.HAS_CUSTOM_COLOR,
    'lynixAutoX_bgColorEnabled': K.BG_ENABLED,
    'lynixAutoX_pageBgColor': K.PAGE_BG_COLOR,
    'lynixAutoX_hasCustomColor': K.PAGE_HAS_CUSTOM,
    // Toggles
    'lynixToggle_hitSound': K.TOGGLE_HIT_SOUND,
    'hitSoundEnabled': K.TOGGLE_HIT_SOUND,
    'lynixToggle_autoSS': K.TOGGLE_AUTO_SS,
    'autoSSEnabled': K.TOGGLE_AUTO_SS,
    'lynixToggle_tgForward': K.TOGGLE_TG_FORWARD,
    'tgForwardEnabled': K.TOGGLE_TG_FORWARD,
    'lynixAutoX_tgForward': K.TOGGLE_TG_FORWARD,
    // Misc
    'lynixAutoX_logs': K.LOGS,
    'lynixAutoX_logsClearedAt': K.LOGS_CLEARED_AT,
    'lynixAutoX_customMusicName': K.MUSIC_NAME,
    'lynixCustomMusicData': K.MUSIC_DATA,
    'lynixAutoX_lastSeenBinTime': K.LAST_SEEN_BIN_TIME,
    'lynixCardHistory': K.CARD_HISTORY,
  };

  // Generate unique request IDs
  var requestCounter = 0;
  var pendingRequests = new Map();

  function storageRequest(action, data) {
    data = data || {};
    return new Promise(function (resolve) {
      var requestId = 'storage_' + (++requestCounter) + '_' + Date.now();

      var handler = function (event) {
        if (event.data && event.data.type === 'LYNIX_STORAGE_RESPONSE' && event.data.requestId === requestId) {
          window.removeEventListener('message', handler);
          pendingRequests.delete(requestId);
          resolve(event.data.result);
        }
      };

      pendingRequests.set(requestId, handler);
      window.addEventListener('message', handler);

      window.postMessage({
        type: 'LYNIX_STORAGE_REQUEST',
        requestId: requestId,
        action: action,
        data: data
      }, '*');

      // Timeout fallback
      setTimeout(function () {
        if (pendingRequests.has(requestId)) {
          window.removeEventListener('message', handler);
          pendingRequests.delete(requestId);
          resolve(null);
        }
      }, 3000);
    });
  }

  // ============= ONE-TIME MIGRATION =============
  // Reads all old keys, copies values to new keys, then deletes old keys.
  LynixStorage.runMigration = function (callback) {
    var oldKeys = Object.keys(MIGRATION_MAP);
    storageRequest('GET', { keys: oldKeys }).then(function (result) {
      result = result || {};
      var toSet = {};
      var toRemove = [];

      for (var i = 0; i < oldKeys.length; i++) {
        var oldKey = oldKeys[i];
        var newKey = MIGRATION_MAP[oldKey];
        var val = result[oldKey];
        if (val !== undefined && val !== null && val !== '') {
          // Only set if the new key doesn't already have a value
          if (toSet[newKey] === undefined) {
            toSet[newKey] = val;
          }
          toRemove.push(oldKey);
        }
      }

      // Also migrate localStorage old keys
      var lsOldKeys = [
        'lynixAutoX_token', 'lynixAutoX_userId', 'lynixAutoX_userFirstName',
        'lynixAutoX_customName', 'lynixAutoX_customEmail',
        'lynixAutoX_tgForward', 'lynixAutoX_logs', 'lynixAutoX_logsClearedAt',
        'lynixAutoX_customMusicName', 'lynixAutoX_bgColorEnabled',
        'lynixAutoX_pageBgColor', 'lynixAutoX_hasCustomColor',
        'lynixAutoX_lastSeenBinTime',
        'cardGenerator_BINs', 'cardGenerator_BIN', 'cardGenerator_ID'
      ];
      for (var j = 0; j < lsOldKeys.length; j++) {
        var lsOld = lsOldKeys[j];
        var lsNew = MIGRATION_MAP[lsOld];
        if (lsNew) {
          var lsVal = localStorage.getItem(lsOld);
          if (lsVal !== null) {
            localStorage.setItem(lsNew, lsVal);
            localStorage.removeItem(lsOld);
          }
        }
      }

      var hasData = Object.keys(toSet).length > 0;
      if (hasData) {
        storageRequest('SET', toSet).then(function () {
          if (toRemove.length > 0) {
            storageRequest('REMOVE', { keys: toRemove }).then(function () {
              if (callback) callback();
            });
          } else {
            if (callback) callback();
          }
        });
      } else {
        if (callback) callback();
      }
    });
  };

  // ============= RANDOM BACKGROUND =============

  var RANDOM_BG_COLORS = [
    "#1a1a2e", "#16213e", "#0f3460", "#1b262c", "#2c3e50",
    "#1f1f38", "#2d2d44", "#1e3a5f", "#2b2b52", "#1c1c3c"
  ];

  LynixStorage.getRandomBgColor = function () {
    return RANDOM_BG_COLORS[Math.floor(Math.random() * RANDOM_BG_COLORS.length)];
  };

  // ============= SYNC STORAGE METHODS =============

  LynixStorage.loadBackgroundColor = function (callback) {
    storageRequest('GET', { keys: [K.BG_COLOR, K.HAS_CUSTOM_COLOR] }).then(function (result) {
      result = result || {};
      var color = result[K.BG_COLOR] || LynixStorage.getRandomBgColor();
      var userSet = result[K.HAS_CUSTOM_COLOR] || false;
      callback(color, userSet);
    });
  };

  LynixStorage.saveBackgroundColor = function (color, userSet) {
    var data = {};
    data[K.BG_COLOR] = color;
    data[K.HAS_CUSTOM_COLOR] = userSet !== false;
    storageRequest('SET', data);
  };

  LynixStorage.loadCustomNameEmail = function (callback) {
    storageRequest('GET', { keys: [K.CUSTOM_NAME, K.CUSTOM_EMAIL] }).then(function (result) {
      result = result || {};
      callback(result[K.CUSTOM_NAME] || '', result[K.CUSTOM_EMAIL] || '');
    });
  };

  LynixStorage.saveCustomName = function (name) {
    var data = {};
    data[K.CUSTOM_NAME] = name;
    storageRequest('SET', data);
  };

  LynixStorage.saveCustomEmail = function (email) {
    var data = {};
    data[K.CUSTOM_EMAIL] = email;
    storageRequest('SET', data);
  };

  LynixStorage.loadCardHistory = function (callback) {
    storageRequest('GET', { keys: [K.CARD_HISTORY] }).then(function (result) {
      result = result || {};
      var history = result[K.CARD_HISTORY] || [];
      callback(Array.isArray(history) ? history : []);
    });
  };

  LynixStorage.saveCardHistory = function (history) {
    var data = {};
    data[K.CARD_HISTORY] = history.slice(-100);
    storageRequest('SET', data);
  };

  LynixStorage.addToCardHistory = function (entry, callback) {
    LynixStorage.loadCardHistory(function (history) {
      history.push(entry);
      LynixStorage.saveCardHistory(history);
      if (callback) callback(history);
    });
  };

  LynixStorage.loadSavedBINs = function (callback) {
    storageRequest('GET', { keys: [K.SAVED_BINS] }).then(function (result) {
      result = result || {};
      var bins = result[K.SAVED_BINS] || [];
      callback(Array.isArray(bins) ? bins : []);
    });
  };

  LynixStorage.saveBINs = function (bins) {
    var data = {};
    data[K.SAVED_BINS] = bins;
    storageRequest('SET', data);
  };

  LynixStorage.loadToggleState = function (toggleType, callback) {
    // Map toggle type to unified key
    var keyMap = {
      'hitSound': K.TOGGLE_HIT_SOUND,
      'autoSS': K.TOGGLE_AUTO_SS,
      'tgForward': K.TOGGLE_TG_FORWARD
    };
    var key = keyMap[toggleType] || ('lynix_toggle_' + toggleType);
    storageRequest('GET', { keys: [key] }).then(function (result) {
      result = result || {};
      callback(result[key] !== undefined ? result[key] : true);
    });
  };

  LynixStorage.saveToggleState = function (toggleType, value) {
    var keyMap = {
      'hitSound': K.TOGGLE_HIT_SOUND,
      'autoSS': K.TOGGLE_AUTO_SS,
      'tgForward': K.TOGGLE_TG_FORWARD
    };
    var key = keyMap[toggleType] || ('lynix_toggle_' + toggleType);
    var data = {};
    data[key] = value;
    storageRequest('SET', data);
  };

  LynixStorage.loadUserSession = function (callback) {
    storageRequest('GET', { keys: [K.TOKEN, K.USER_ID, K.FIRST_NAME] }).then(function (result) {
      result = result || {};
      callback({
        token: result[K.TOKEN] || '',
        userId: result[K.USER_ID] || '',
        firstName: result[K.FIRST_NAME] || ''
      });
    });
  };

  LynixStorage.saveUserSession = function (token, userId, firstName) {
    var data = {};
    data[K.TOKEN] = token;
    data[K.USER_ID] = userId;
    data[K.FIRST_NAME] = firstName;
    storageRequest('SET', data);
  };

  LynixStorage.clearUserSession = function () {
    storageRequest('REMOVE', { keys: [K.TOKEN, K.USER_ID, K.FIRST_NAME] });
  };

  LynixStorage.loadSavedId = function (callback) {
    storageRequest('GET', { keys: [K.SAVED_ID] }).then(function (result) {
      result = result || {};
      callback(result[K.SAVED_ID] || '');
    });
  };

  LynixStorage.saveId = function (id) {
    var data = {};
    data[K.SAVED_ID] = id;
    storageRequest('SET', data);
  };

  // ============= ALL DATA SYNC =============

  LynixStorage.loadAllData = function (callback) {
    var allKeys = [];
    var kNames = Object.keys(K);
    for (var i = 0; i < kNames.length; i++) {
      allKeys.push(K[kNames[i]]);
    }
    storageRequest('GET', { keys: allKeys }).then(function (result) {
      result = result || {};
      callback(result);
    });
  };


  // ============= GENERIC GET / SET =============
  // For arbitrary keys not covered by specialized helpers.
  // Usage: LynixStorage.get(['key1','key2']).then(result => ...)
  //        LynixStorage.set({ key1: val1, key2: val2 })
  LynixStorage.get = function (keys) {
    return storageRequest('GET', { keys: Array.isArray(keys) ? keys : [keys] });
  };

  LynixStorage.set = function (data) {
    return storageRequest('SET', data);
  };

  // ============= AUTO-RUN MIGRATION ON LOAD =============
  // Runs once per session: migrates old keys to new unified keys.
  // Uses a flag in chrome.storage to avoid running repeatedly.
  (function autoMigrate() {
    storageRequest('GET', { keys: ['lynix_migration_done'] }).then(function (result) {
      if (result && result.lynix_migration_done) return; // already migrated
      LynixStorage.runMigration(function () {
        storageRequest('SET', { lynix_migration_done: true });
      });
    });
  })();

})();
