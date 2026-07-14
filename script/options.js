document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var CART_ICON_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>';
    var $ = function (id) { return document.getElementById(id); };

    // ── Nav ──
    var headerPfp = $('headerPfp');
    var headerDot = $('headerDot');
    var versionBadge = $('versionBadge');
    var helpBtn = $('helpBtn');
    var helpOverlay = $('helpOverlay');
    var helpCloseBtn = $('helpCloseBtn');

    // ── Dashboard ──
    var dashName = $('dashName');
    var dashId = $('dashId');
    var dashHits = $('dashHits');
    var dashAttempts = $('dashAttempts');
    var dashRate = $('dashRate');
    var chipVersion = $('chipVersion');

    // ── History ──
    var historyList = $('historyList');
    var historyCount = $('historyCount');

    // ── Statistics ──
    var statHits = $('statHits');
    var statAttempts = $('statAttempts');
    var statRate = $('statRate');
    var statFirstHit = $('statFirstHit');

    // ── BIN Library ──
    var binLibBtn = $('binLibBtn');
    var binLibFilterAll = $('binLibFilterAll');
    var binLibFilterTop = $('binLibFilterTop');
    var binLibBody = $('binLibBody');
    var binLibCount = $('binLibCount');
    var binLibData = [];
    var binLibFilter = 'newest';
    var binLibLoaded = false;

    // ── Settings ──
    var settingTgForward = $('settingTgForward');
    var settingName = $('settingName');
    var settingEmail = $('settingEmail');

    var settingTgUserId = $('settingTgUserId');
    var settingsSaveBtn = $('settingsSaveBtn');
    var settingsSaveToast = $('settingsSaveToast');
    var settingsLoaded = false;

    var historyLoaded = false;
    var statsLoaded = false;

    // ═══════════════════════════════════
    // Tab switching
    // ═══════════════════════════════════
    var tabBtns = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.dataset.tab;
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            panels.forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            var panel = document.getElementById('panel-' + tab);
            if (panel) panel.classList.add('active');

            if (tab === 'history' && !historyLoaded) loadHistory();
            if (tab === 'statistics' && !statsLoaded) loadStatistics();
            if (tab === 'binlib' && !binLibLoaded) loadBinLibrary();
            if (tab === 'settings' && !settingsLoaded) loadSettings();
        });
    });

    // ═══════════════════════════════════
    // Help overlay
    // ═══════════════════════════════════
    if (helpBtn) helpBtn.addEventListener('click', function () { if (helpOverlay) helpOverlay.classList.add('active'); });
    if (helpCloseBtn) helpCloseBtn.addEventListener('click', function () { if (helpOverlay) helpOverlay.classList.remove('active'); });
    if (helpOverlay) helpOverlay.addEventListener('click', function (e) {
        if (e.target === helpOverlay) helpOverlay.classList.remove('active');
    });

    // ═══════════════════════════════════
    // Settings
    // ═══════════════════════════════════
    function loadSettings() {
        settingsLoaded = true;
        chrome.storage.local.get([
            'lynix_toggle_tg_forward',
            'lynix_custom_name',
            'lynix_custom_email',
            'lynix_addr_street',
            'lynix_addr_city',
            'lynix_addr_zip',
            'lynix_addr_country',
            'lynix_auto_checkout',
            'lynix_disable_dark_theme'
        ], function (d) {
            if (settingTgForward) settingTgForward.checked = d.lynix_toggle_tg_forward !== false;
            if (settingName) settingName.value = d.lynix_custom_name || '';
            if (settingEmail) settingEmail.value = d.lynix_custom_email || '';
            var addrStreet = $('settingAddrStreet');
            var addrCity = $('settingAddrCity');
            var addrZip = $('settingAddrZip');
            var addrCountry = $('settingAddrCountry');
            if (addrStreet) addrStreet.value = d.lynix_addr_street || '';
            if (addrCity) addrCity.value = d.lynix_addr_city || '';
            if (addrZip) addrZip.value = d.lynix_addr_zip || '';
            if (addrCountry) addrCountry.value = d.lynix_addr_country || '';

            var autoCheckout = document.getElementById('settingAutoCheckout');
            if (autoCheckout) autoCheckout.checked = !!d.lynix_auto_checkout;

            var disableDarkTheme = $('settingDisableDarkTheme');
            if (disableDarkTheme) disableDarkTheme.checked = !!d.lynix_disable_dark_theme;
        });
    }

    function showSaveToast() {
        if (!settingsSaveToast) return;
        settingsSaveToast.classList.add('show');
        setTimeout(function () { settingsSaveToast.classList.remove('show'); }, 2000);
    }

    if (settingsSaveBtn) {
        settingsSaveBtn.addEventListener('click', function () {
            var autoCheckout = document.getElementById('settingAutoCheckout');
            var addrStreet = $('settingAddrStreet');
            var addrCity = $('settingAddrCity');
            var addrZip = $('settingAddrZip');
            var addrCountry = $('settingAddrCountry');
            var disableDarkTheme = $('settingDisableDarkTheme');
            chrome.storage.local.set({
                lynix_toggle_tg_forward: settingTgForward ? settingTgForward.checked : true,
                lynix_custom_name: settingName ? settingName.value.trim() : '',
                lynix_custom_email: settingEmail ? settingEmail.value.trim() : '',
                lynix_addr_street: addrStreet ? addrStreet.value.trim() : '',
                lynix_addr_city: addrCity ? addrCity.value.trim() : '',
                lynix_addr_zip: addrZip ? addrZip.value.trim() : '',
                lynix_addr_country: addrCountry ? addrCountry.value.trim().toUpperCase() : '',
                lynix_auto_checkout: autoCheckout ? autoCheckout.checked : false,
                lynix_disable_dark_theme: disableDarkTheme ? disableDarkTheme.checked : false
            }, showSaveToast);
        });
    }



    var POPUP_ICONS = {
        success: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
        error: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    function showPopup(type, title, body) {
        var o = $('lynixPopupOverlay');
        if (!o) return alert(title + '\n' + body.replace(/<br>/g, '\n'));
        $('lynixPopupIcon').innerHTML = POPUP_ICONS[type] || POPUP_ICONS.info;
        $('lynixPopupTitle').textContent = title;
        $('lynixPopupBody').innerHTML = body;
        o.style.display = 'flex';
        var ok = $('lynixPopupOk');
        ok.onclick = function () { o.style.display = 'none'; };
        o.onclick = function (e) { if (e.target === o) o.style.display = 'none'; };
    }

    // ═══════════════════════════════════
    // Live Logs — Dashboard feed
    // ═══════════════════════════════════
    var liveLogsFeed = $('liveLogsFeed');
    var liveLogsCount = $('liveLogsCount');
    var clearLogsBtn = $('clearLogsBtn');

    function classifyLog(result) {
        if (!result) return 'muted';
        var r = String(result).toLowerCase();
        if (r === 'hit' || r === 'charged' || r === 'success' || r.includes('paid') || r.includes('authorized')) return 'hit';
        if (r.includes('decline') || r.includes('invalid') || r.includes('error') || r.includes('fraud') || r.includes('lost') || r.includes('stolen')) return 'error';
        if (r.includes('cvc') || r.includes('cvv') || r.includes('incorrect') || r.includes('expired') || r.includes('insufficient')) return 'warn';
        return 'muted';
    }

    function renderLogs(logs) {
        if (!liveLogsFeed) return;
        liveLogsCount.textContent = logs.length || '0';
        if (!logs.length) {
            liveLogsFeed.innerHTML =
                '<div class="logs-empty">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:28px;height:28px;opacity:.2;display:block;margin:0 auto 10px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
                'No logs yet — start hitting' +
                '</div>';
            return;
        }
        var html = '';
        var slice = logs.slice().reverse().slice(0, 100);
        slice.forEach(function (entry) {
            // Support new format (message/type/time) and legacy (fullCard/result/status)
            var card = entry.message || entry.fullCard || entry.card || '—';
            var entryType = entry.type || '';
            var cls;
            if (entryType === 'success' || entryType === 'hit') {
                cls = 'hit';
            } else if (entryType === 'error') {
                cls = 'error';
            } else if (entryType === 'warn') {
                cls = 'warn';
            } else {
                cls = classifyLog(entry.result || entry.status || entry.error || entryType || '');
            }
            var label;
            if (entry.message) {
                var typeLabels = { hit: 'HIT', success: 'OK', error: 'FAIL', warn: 'WARN', muted: 'INFO' };
                label = typeLabels[entryType] || 'INFO';
            } else {
                label = (entry.result || entry.status || entry.error || 'unknown').replace(/_/g, ' ');
            }
            var ts = entry.time || entry.timestamp;
            var age = ts ? timeAgo(typeof ts === 'string' ? Date.parse(ts) : ts) : '';
            html +=
                '<div class="log-item">' +
                '<div class="log-dot ' + cls + '"></div>' +
                '<div class="log-card">' + escHtml(card) + '</div>' +
                '<span class="log-status ' + cls + '">' + escHtml(label) + '</span>' +
                '<span class="log-time">' + escHtml(age) + '</span>' +
                '</div>';
        });
        liveLogsFeed.innerHTML = html;
    }

    function loadLogs() {
        chrome.storage.local.get(['lynix_logs', 'lynix_logs_cleared_at'], function (d) {
            var logs = d.lynix_logs || [];
            if (typeof logs === 'string') { try { logs = JSON.parse(logs); } catch (e) { logs = []; } }
            var clearedAt = d.lynix_logs_cleared_at;
            if (clearedAt) {
                var ct = typeof clearedAt === 'string' ? Date.parse(clearedAt) : clearedAt;
                logs = logs.filter(function (l) {
                    var t = l.time || l.timestamp;
                    return (typeof t === 'string' ? Date.parse(t) : t) > ct;
                });
            }
            renderLogs(logs);
        });
    }

    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', function () {
            chrome.storage.local.set({ lynix_logs_cleared_at: Date.now() }, function () {
                renderLogs([]);
            });
        });
    }

    // ═══════════════════════════════════
    // BIN Library — from local storage
    // ═══════════════════════════════════

    binLibFilterAll.addEventListener('click', function () {
        binLibFilter = 'newest';
        binLibFilterAll.classList.add('active');
        binLibFilterTop.classList.remove('active');
        renderBinLib();
    });
    binLibFilterTop.addEventListener('click', function () {
        binLibFilter = 'oldest';
        binLibFilterTop.classList.add('active');
        binLibFilterAll.classList.remove('active');
        renderBinLib();
    });

    function loadBinLibrary() {
        binLibLoaded = true;
        binLibBody.innerHTML = loadingHtml();
        binLibCount.textContent = '—';
        chrome.runtime.sendMessage({ type: 'GET_LOCAL_STATS' }, function (res) {
            var bins = (res && res.bins) ? res.bins : [];
            binLibData = bins;
            binLibCount.textContent = bins.length;
            renderBinLib();
        });
    }

    function renderBinLib() {
        var bins = binLibData.slice();
        if (binLibFilter === 'oldest') {
            bins.sort(function (a, b) { return (a.addedAt || 0) - (b.addedAt || 0); });
        }
        if (bins.length === 0) {
            binLibBody.innerHTML =
                '<div class="binlib-empty">' +
                '<div class="binlib-empty-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>' +
                'No BINs saved yet<br><span class="binlib-empty-sub">BINs are saved automatically when you get a hit</span>' +
                '</div>';
            return;
        }
        var html = '';
        bins.forEach(function (item) {
            var date = '--';
            if (item.addedAt) {
                var d = new Date(item.addedAt);
                date = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            html +=
                '<div class="binlib-card">' +
                '<div class="binlib-row"><span class="binlib-lbl">BIN:</span><span class="binlib-val binlib-val--bin">' + escHtml(item.bin || '—') + '</span></div>' +
                '<div class="binlib-row"><span class="binlib-lbl">Site:</span><span class="binlib-val">' + escHtml(item.site || '—') + '</span></div>' +
                '<hr class="binlib-sep">' +
                '<div class="binlib-foot"><span class="binlib-foot-date">' + escHtml(date) + '</span></div>' +
                '</div>';
        });
        binLibBody.innerHTML = html;
    }

    // ═══════════════════════════════════
    // Helpers
    // ═══════════════════════════════════
    function loadingHtml() {
        return '<div class="loading"><div class="spinner"></div></div>';
    }

    function timeAgo(ts) {
        if (!ts) return '--';
        var diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) return diff + 's ago';
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        return Math.floor(diff / 86400) + 'd ago';
    }

    function escHtml(s) {
        if (!s) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ═══════════════════════════════════
    // Version badge
    // ═══════════════════════════════════
    (function setVersion() {
        var ver = 'v' + chrome.runtime.getManifest().version;
        if (versionBadge) versionBadge.textContent = ver;
        if (chipVersion) chipVersion.textContent = ver;
    })();

    // ═══════════════════════════════════
    // Init — load from local storage
    // ═══════════════════════════════════
    function renderDashStats(stats) {
        var hits = stats.hits || 0;
        var attempts = stats.attempts || 0;
        dashHits.textContent = hits;
        dashAttempts.textContent = attempts;
        dashRate.textContent = attempts > 0 ? Math.round((hits / attempts) * 100) + '%' : '0%';
    }

    function init() {
        // User display name from storage (TG first name saved on hit)
        chrome.storage.local.get(
            ['lynix_first_name', 'lynix_user_id', 'lynix_total_hits', 'lynix_total_attempts'],
            function (data) {
                var firstName = data.lynix_first_name || 'Lynix User';
                var userId = data.lynix_user_id || '';
                dashName.textContent = firstName;
                dashId.textContent = userId ? 'ID: ' + userId : 'Local Mode';
                renderDashStats({ hits: data.lynix_total_hits || 0, attempts: data.lynix_total_attempts || 0 });
                // No server, always "active" status dot
                headerDot.className = 'nav-status-dot valid';
            }
        );

        loadLogs(); // initial log render
    }

    // Live updates via storage.onChanged
    chrome.storage.onChanged.addListener(function (changes) {
        if (changes.lynix_total_hits || changes.lynix_total_attempts) {
            chrome.storage.local.get(['lynix_total_hits', 'lynix_total_attempts'], function (d) {
                renderDashStats({ hits: d.lynix_total_hits || 0, attempts: d.lynix_total_attempts || 0 });
            });
        }
        // If BIN Library tab is open, refresh it
        if (changes.lynix_bin_library && binLibLoaded) {
            binLibLoaded = false;
            loadBinLibrary();
        }
        // If History tab is open, refresh it
        if (changes.lynix_hit_history && historyLoaded) {
            historyLoaded = false;
            loadHistory();
        }
        // Live logs — always refresh on change
        if (changes.lynix_logs || changes.lynix_logs_cleared_at) {
            loadLogs();
        }
    });


    // ═══════════════════════════════════
    // History — from local storage
    // ═══════════════════════════════════
    function loadHistory() {
        historyLoaded = true;
        historyList.innerHTML = loadingHtml();

        chrome.runtime.sendMessage({ type: 'GET_LOCAL_STATS' }, function (res) {
            var hits = (res && res.history) ? res.history : [];
            if (hits.length === 0) {
                historyList.innerHTML =
                    '<div class="empty-state">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
                    '<div class="empty-state-text">No hits recorded yet</div>' +
                    '</div>';
                historyCount.textContent = '0';
                var totalEl = $('totalDollars');
                if (totalEl) totalEl.textContent = '$0.00';
                return;
            }
            historyCount.textContent = hits.length + ' total';
            var totalDollars = 0;
            var html = '';
            hits.forEach(function (hit) {
                var card = hit.card || '----';
                var amount = hit.amount || '0';
                var currency = (hit.currency || 'usd').toUpperCase();
                var merchant = hit.merchant || 'Unknown';
                var time = timeAgo(hit.timestamp);
                totalDollars += parseFloat(amount) || 0;
                html +=
                    '<div class="hit-item">' +
                    '<div class="hit-item-icon">' + CART_ICON_SVG + '</div>' +
                    '<div class="hit-item-body">' +
                    '<div class="hit-item-card">' + escHtml(card) + '</div>' +
                    '<div class="hit-item-merchant">' + escHtml(merchant) + '</div>' +
                    '</div>' +
                    '<div class="hit-item-right">' +
                    '<div class="hit-item-amount">' + escHtml(amount) + ' ' + escHtml(currency) + '</div>' +
                    '<div class="hit-item-time">' + escHtml(time) + '</div>' +
                    '</div>' +
                    '</div>';
            });
            historyList.innerHTML = html;
            var totalEl = $('totalDollars');
            if (totalEl) totalEl.textContent = '$' + totalDollars.toFixed(2);
        });
    }

    // ═══════════════════════════════════
    // Statistics — personal only
    // ═══════════════════════════════════
    function loadStatistics() {
        statsLoaded = true;
        chrome.runtime.sendMessage({ type: 'GET_LOCAL_STATS' }, function (res) {
            var hits = (res && res.hits) || 0;
            var attempts = (res && res.attempts) || 0;
            var history = (res && res.history) || [];
            var rate = attempts > 0 ? Math.round((hits / attempts) * 100) + '%' : '0%';
            var firstHit = history.length > 0
                ? new Date(history[history.length - 1].timestamp).toLocaleDateString()
                : '—';
            statHits.textContent = hits;
            statAttempts.textContent = attempts;
            statRate.textContent = rate;
            statFirstHit.textContent = firstHit;
        });
    }


    // ═══════════════════════════════════
    // Cards tab — BIN / CC management
    // ═══════════════════════════════════
    (function initCardsTab() {
        var binBtn = document.getElementById('cardModeBin');
        var ccBtn = document.getElementById('cardModeCc');
        var binSection = document.getElementById('cardsBinSection');
        var ccSection = document.getElementById('cardsCcSection');
        var binContainer = document.getElementById('cardsBinContainer');
        var saveBinsBtn = document.getElementById('cardsSaveBinsBtn');
        var switchBinBtn = document.getElementById('cardsSwitchBinBtn');
        var openLibraryBtn = document.getElementById('cardsOpenLibrary');
        var loadCcBtn = document.getElementById('cardsLoadCcBtn');
        var clearCcBtn = document.getElementById('cardsClearCcBtn');
        var ccTextarea = document.getElementById('cardsCcTextarea');
        var ccCount = document.getElementById('cardsCcCount');

        if (!binBtn || !ccBtn) return;

        // Mode toggle
        binBtn.addEventListener('click', function () {
            binBtn.classList.add('active');
            binBtn.style.border = '1px solid var(--accent)';
            binBtn.style.background = 'var(--accent-soft)';
            binBtn.style.color = 'var(--accent)';
            ccBtn.classList.remove('active');
            ccBtn.style.border = '1px solid var(--border)';
            ccBtn.style.background = 'transparent';
            ccBtn.style.color = 'var(--text-muted)';
            binSection.style.display = '';
            ccSection.style.display = 'none';
            chrome.storage.local.set({ lynix_card_mode: 'bin' });
        });
        ccBtn.addEventListener('click', function () {
            ccBtn.classList.add('active');
            ccBtn.style.border = '1px solid var(--accent)';
            ccBtn.style.background = 'var(--accent-soft)';
            ccBtn.style.color = 'var(--accent)';
            binBtn.classList.remove('active');
            binBtn.style.border = '1px solid var(--border)';
            binBtn.style.background = 'transparent';
            binBtn.style.color = 'var(--text-muted)';
            binSection.style.display = 'none';
            ccSection.style.display = '';
            chrome.storage.local.set({ lynix_card_mode: 'cc' });
        });

        // Add BIN row
        function addBinRow(value) {
            var row = document.createElement('div');
            row.className = 'cards-bin-row';
            row.style.cssText = 'display:flex;gap:8px;align-items:center;';
            row.innerHTML = '<input type="text" class="cards-bin-input input-std" placeholder="Enter BIN" maxlength="30" value="' + (value || '') + '" style="flex:1;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text);font-family:var(--mono);font-size:13px;outline:none;">' +
                '<button style="width:36px;height:36px;border-radius:10px;border:1px solid var(--red);background:var(--red-soft);color:var(--red);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;" title="Remove">−</button>';
            row.querySelector('button').addEventListener('click', function () { row.remove(); updateSwitchVisibility(); });
            binContainer.appendChild(row);
            updateSwitchVisibility();
        }

        // + button on first row
        var addBtn = binContainer.querySelector('.cards-add-bin-btn');
        if (addBtn) addBtn.addEventListener('click', function () { addBinRow(''); });

        function updateSwitchVisibility() {
            var inputs = binContainer.querySelectorAll('.cards-bin-input');
            var filled = 0;
            inputs.forEach(function (i) { if (i.value.trim().length >= 6) filled++; });
            if (switchBinBtn) switchBinBtn.style.display = filled > 1 ? '' : 'none';
        }

        // Save BINs
        if (saveBinsBtn) {
            saveBinsBtn.addEventListener('click', function () {
                var inputs = binContainer.querySelectorAll('.cards-bin-input');
                var bins = [];
                inputs.forEach(function (i) {
                    var v = i.value.trim();
                    if (v && v.length >= 6) bins.push(v);
                });
                if (bins.length === 0) return;
                chrome.storage.local.set({ lynix_saved_bins: bins }, function () {
                    saveBinsBtn.textContent = '✓ Saved';
                    setTimeout(function () { saveBinsBtn.textContent = 'Save BINs'; }, 1500);
                });
                updateSwitchVisibility();
            });
        }

        // Switch BIN (cycle)
        if (switchBinBtn) {
            switchBinBtn.addEventListener('click', function () {
                chrome.storage.local.get('lynix_current_bin_index', function (d) {
                    var inputs = binContainer.querySelectorAll('.cards-bin-input');
                    var bins = [];
                    inputs.forEach(function (i) { if (i.value.trim().length >= 6) bins.push(i.value.trim()); });
                    if (bins.length < 2) return;
                    var idx = ((d.lynix_current_bin_index || 0) + 1) % bins.length;
                    chrome.storage.local.set({ lynix_current_bin_index: idx });
                    switchBinBtn.textContent = 'BIN ' + (idx + 1) + '/' + bins.length;
                    setTimeout(function () { switchBinBtn.textContent = 'Switch BIN'; }, 1500);
                });
            });
        }

        // Open BIN Library tab
        if (openLibraryBtn) {
            openLibraryBtn.addEventListener('click', function () {
                var libBtn = document.querySelector('[data-tab="binlib"]');
                if (libBtn) libBtn.click();
            });
        }

        // CC load
        if (loadCcBtn) {
            loadCcBtn.addEventListener('click', function () {
                var text = ccTextarea.value.trim();
                var lines = text.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });
                chrome.storage.local.set({ lynix_cc_list: lines }, function () {
                    if (ccCount) ccCount.textContent = lines.length;
                    loadCcBtn.textContent = '✓ Loaded';
                    setTimeout(function () { loadCcBtn.textContent = 'Load Cards'; }, 1500);
                });
            });
        }

        // CC clear
        if (clearCcBtn) {
            clearCcBtn.addEventListener('click', function () {
                ccTextarea.value = '';
                chrome.storage.local.set({ lynix_cc_list: [] });
                if (ccCount) ccCount.textContent = '0';
            });
        }

        // Load saved state
        chrome.storage.local.get(['lynix_saved_bins', 'lynix_cc_list', 'lynix_card_mode'], function (d) {
            var savedBins = d.lynix_saved_bins || [];
            if (savedBins.length > 0) {
                var firstInput = binContainer.querySelector('.cards-bin-input');
                if (firstInput) firstInput.value = savedBins[0];
                for (var i = 1; i < savedBins.length; i++) {
                    addBinRow(savedBins[i]);
                }
            }
            var savedCc = d.lynix_cc_list || [];
            if (savedCc.length > 0) {
                ccTextarea.value = savedCc.join('\n');
                if (ccCount) ccCount.textContent = savedCc.length;
            }
            if (d.lynix_card_mode === 'cc') {
                ccBtn.click();
            }
            updateSwitchVisibility();
        });
    })();

    // ═══════════════════════════════════
    // Telegram Settings Tab
    // ═══════════════════════════════════
    var tgBotToken = $('settingTgBotToken');
    var tgGroupId = $('settingTgGroupId');
    var tgUserChatId = $('settingTgUserChatId');
    var tgScreenshot = $('settingTgScreenshot');
    var tgSaveBtn = $('tgSaveBtn');
    var tgTestBtn = $('tgTestBtn');
    var tgSaveToast = $('tgSaveToast');
    var tgLoaded = false;

    function loadTelegramSettings() {
        tgLoaded = true;
        chrome.storage.local.get([
            'lynix_tg_bot_token',
            'lynix_tg_group_id',
            'lynix_tg_user_chat_id',
            'lynix_toggle_auto_ss'
        ], function (d) {
            if (tgBotToken) tgBotToken.value = d.lynix_tg_bot_token || '';
            if (tgGroupId) tgGroupId.value = d.lynix_tg_group_id || '';
            if (tgUserChatId) tgUserChatId.value = d.lynix_tg_user_chat_id || '';
            if (tgScreenshot) tgScreenshot.checked = d.lynix_toggle_auto_ss !== false;
        });
    }

    function showTgToast() {
        if (!tgSaveToast) return;
        tgSaveToast.classList.add('show');
        setTimeout(function () { tgSaveToast.classList.remove('show'); }, 2000);
    }

    if (tgSaveBtn) {
        tgSaveBtn.addEventListener('click', function () {
            chrome.storage.local.set({
                lynix_tg_bot_token: tgBotToken ? tgBotToken.value.trim() : '',
                lynix_tg_group_id: tgGroupId ? tgGroupId.value.trim() : '',
                lynix_tg_user_chat_id: tgUserChatId ? tgUserChatId.value.trim() : '',
                lynix_toggle_auto_ss: tgScreenshot ? tgScreenshot.checked : true
            }, showTgToast);
        });
    }

    if (tgTestBtn) {
        tgTestBtn.addEventListener('click', function () {
            var token = (tgBotToken ? tgBotToken.value.trim() : '') || '8744930514:AAFKJKN0ObcjieltRAne351QKH22Dnnz76U';
            var groupId = (tgGroupId ? tgGroupId.value.trim() : '') || '-1003907074478';
            tgTestBtn.disabled = true;
            tgTestBtn.textContent = 'Sending...';
            // Send test message directly via Telegram API
            var msg = '🐰 *MR TEST*\n━━━━━━━━━━━━━━\n✅ Telegram notifications are working\\!';
            fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: groupId, text: msg, parse_mode: 'MarkdownV2' })
            }).then(function (r) { return r.json(); }).then(function (res) {
                if (res.ok) {
                    showPopup('success', 'Test Sent', 'Check your Telegram group for the test message.');
                } else {
                    showPopup('error', 'Send Failed', res.description || 'Unknown error');
                }
            }).catch(function (err) {
                showPopup('error', 'Network Error', err.message);
            }).finally(function () {
                tgTestBtn.disabled = false;
                tgTestBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></svg> Test';
            });
        });
    }

    // ═══════════════════════════════════
    // Discord Settings Tab
    // ═══════════════════════════════════
    var dcWebhookUrl = $('settingDcWebhookUrl');
    var dcEnabled = $('settingDcEnabled');
    var dcSaveBtn = $('dcSaveBtn');
    var dcTestBtn = $('dcTestBtn');
    var dcSaveToast = $('dcSaveToast');
    var dcLoaded = false;

    function loadDiscordSettings() {
        dcLoaded = true;
        chrome.storage.local.get([
            'lynix_discord_webhook_url',
            'lynix_discord_enabled'
        ], function (d) {
            if (dcWebhookUrl) dcWebhookUrl.value = d.lynix_discord_webhook_url || '';
            if (dcEnabled) dcEnabled.checked = d.lynix_discord_enabled === true;
        });
    }

    function showDcToast() {
        if (!dcSaveToast) return;
        dcSaveToast.classList.add('show');
        setTimeout(function () { dcSaveToast.classList.remove('show'); }, 2000);
    }

    if (dcSaveBtn) {
        dcSaveBtn.addEventListener('click', function () {
            chrome.storage.local.set({
                lynix_discord_webhook_url: dcWebhookUrl ? dcWebhookUrl.value.trim() : '',
                lynix_discord_enabled: dcEnabled ? dcEnabled.checked : false
            }, showDcToast);
        });
    }

    if (dcTestBtn) {
        dcTestBtn.addEventListener('click', function () {
            var url = dcWebhookUrl ? dcWebhookUrl.value.trim() : '';
            if (!url) {
                showPopup('warning', 'Missing Webhook URL', 'Please enter your Discord webhook URL first.');
                return;
            }
            dcTestBtn.disabled = true;
            dcTestBtn.textContent = 'Sending...';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: '\ud83d\udc30 MR TEST',
                        description: '\u2705 Discord notifications are working!',
                        color: 0xF97316,
                        footer: { text: 'MR Checkouter' },
                        timestamp: new Date().toISOString()
                    }]
                })
            }).then(function (r) {
                if (r.ok || r.status === 204) {
                    showPopup('success', 'Test Sent', 'Check your Discord channel for the test message.');
                } else {
                    return r.json().then(function (err) {
                        showPopup('error', 'Send Failed', (err && err.message) || 'HTTP ' + r.status);
                    });
                }
            }).catch(function (err) {
                showPopup('error', 'Network Error', err.message);
            }).finally(function () {
                dcTestBtn.disabled = false;
                dcTestBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg> Test';
            });
        });
    }

    // Add telegram + discord tabs to lazy-load list
    var origTabClick = tabBtns[0] ? tabBtns[0].onclick : null;
    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (btn.dataset.tab === 'telegram' && !tgLoaded) loadTelegramSettings();
            if (btn.dataset.tab === 'discord' && !dcLoaded) loadDiscordSettings();
        });
    });

    // ═══════════════════════════════════
    // Music Player
    // ═══════════════════════════════════
    (function initMusicPlayer() {
        var musicPlayBtn = $('musicPlayBtn');
        var musicPlayIcon = $('musicPlayIcon');
        var musicProgressFill = $('musicProgressFill');
        var musicProgressBar = $('musicProgressBar');
        var musicTimeEl = $('musicTime');
        var musicIconWrap = $('musicIconWrap');
        if (!musicPlayBtn) return;

        var musicAudio = new Audio(chrome.runtime.getURL('sounds/music.mp3'));
        musicAudio.loop = true;
        musicAudio.volume = 0.5;
        var musicPlaying = false;

        function formatMusicTime(s) {
            var m = Math.floor(s / 60);
            var sec = Math.floor(s % 60);
            return m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        musicPlayBtn.addEventListener('click', function () {
            if (musicPlaying) {
                musicAudio.pause();
                musicPlayIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" />';
                if (musicIconWrap) musicIconWrap.classList.remove('playing');
            } else {
                musicAudio.play().catch(function (err) { console.warn('[Lynix] Music play error:', err); });
                musicPlayIcon.innerHTML = '<line x1="6" y1="4" x2="6" y2="20" /><line x1="18" y1="4" x2="18" y2="20" />';
                if (musicIconWrap) musicIconWrap.classList.add('playing');
            }
            musicPlaying = !musicPlaying;
        });

        musicAudio.addEventListener('timeupdate', function () {
            if (musicAudio.duration) {
                var pct = (musicAudio.currentTime / musicAudio.duration) * 100;
                if (musicProgressFill) musicProgressFill.style.width = pct + '%';
                if (musicTimeEl) musicTimeEl.textContent = formatMusicTime(musicAudio.currentTime) + ' / ' + formatMusicTime(musicAudio.duration);
            }
        });

        if (musicProgressBar) {
            musicProgressBar.addEventListener('click', function (e) {
                if (musicAudio.duration) {
                    var rect = musicProgressBar.getBoundingClientRect();
                    var pct = (e.clientX - rect.left) / rect.width;
                    musicAudio.currentTime = pct * musicAudio.duration;
                }
            });
        }
    })();

    // ═══════════════════════════════════
    // Mobile Sidebar Toggle
    // ═══════════════════════════════════
    (function initSidebar() {
        var menuBtn = $('mobileMenuBtn');
        var sidebar = $('mobileSidebar');
        var overlay = $('sidebarOverlay');
        var closeBtn = $('sidebarCloseBtn');
        var sidebarVersion = $('sidebarVersion');
        if (!menuBtn || !sidebar) return;

        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            menuBtn.classList.add('active');
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            menuBtn.classList.remove('active');
        }

        menuBtn.addEventListener('click', function () {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // Sidebar tab buttons → switch panels + sync with desktop tabs
        var sidebarBtns = document.querySelectorAll('.sidebar-tab-btn');
        sidebarBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tab = btn.dataset.tab;

                // Update sidebar active state
                sidebarBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                // Sync desktop tabs and panels
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                panels.forEach(function (p) { p.classList.remove('active'); });
                var desktopBtn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
                if (desktopBtn) desktopBtn.classList.add('active');
                var panel = document.getElementById('panel-' + tab);
                if (panel) panel.classList.add('active');

                // Trigger lazy-loads
                if (tab === 'history' && !historyLoaded) loadHistory();
                if (tab === 'statistics' && !statsLoaded) loadStatistics();
                if (tab === 'binlib' && !binLibLoaded) loadBinLibrary();
                if (tab === 'settings' && !settingsLoaded) loadSettings();
                if (tab === 'telegram' && !tgLoaded) loadTelegramSettings();
                if (tab === 'discord' && !dcLoaded) loadDiscordSettings();

                closeSidebar();
            });
        });

        // Sync version to sidebar footer
        if (sidebarVersion) {
            sidebarVersion.textContent = 'v' + chrome.runtime.getManifest().version;
        }
    })();

    // ═══════════════════════════════════
    // First-time disclaimer popup
    // ═══════════════════════════════════
    (function initDisclaimer() {
        var overlay = document.getElementById('disclaimerOverlay');
        var okBtn = document.getElementById('disclaimerOkBtn');
        if (!overlay || !okBtn) return;

        chrome.storage.local.get('lynix_disclaimer_accepted', function (data) {
            if (!data.lynix_disclaimer_accepted) {
                overlay.style.display = 'flex';
            }
        });

        okBtn.addEventListener('click', function () {
            chrome.storage.local.set({ lynix_disclaimer_accepted: true });
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.25s ease';
            setTimeout(function () { overlay.remove(); }, 250);
        });
    })();

    // ═══════════════════════════════════
    // Lazy scroll reveal (IntersectionObserver)
    // ═══════════════════════════════════
    (function initScrollReveal() {
        var revealTargets = document.querySelectorAll(
            '.card, .dash-hero, .stat-box, .live-logs-wrap, .music-card, .stats-layout, .history-section'
        );
        if (!revealTargets.length) return;

        revealTargets.forEach(function (el) {
            el.classList.add('scroll-reveal');
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function (el) { observer.observe(el); });
    })();

    init();
});
