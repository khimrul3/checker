document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var API = 'https://gold-newt-367030.hostingersite.com/api.php';
  var STRIPE_ICON = 'https://i.ibb.co/fVP9Z2nW/Stripe-icon-square.jpg';

  var $ = function (id) { return document.getElementById(id); };

  // Header
  var headerPfp = $('headerPfp');
  var headerDot = $('headerDot');

  // Help overlay
  var helpBtn = $('helpBtn');
  var helpOverlay = $('helpOverlay');
  var helpCloseBtn = $('helpCloseBtn');

  helpBtn.addEventListener('click', function () { helpOverlay.classList.add('active'); });
  helpCloseBtn.addEventListener('click', function () { helpOverlay.classList.remove('active'); });
  helpOverlay.addEventListener('click', function (e) {
    if (e.target === helpOverlay) helpOverlay.classList.remove('active');
  });

  // BIN Library overlay
  var binLibBtn = $('binLibBtn');
  var binLibOverlay = $('binLibOverlay');
  var binLibCloseBtn = $('binLibCloseBtn');
  var binLibBody = $('binLibBody');
  var binLibFilterAll = $('binLibFilterAll');
  var binLibFilterTop = $('binLibFilterTop');
  var binLibData = [];
  var binLibFilter = 'all';
  var binLibCount = $('binLibCount');

  binLibBtn.addEventListener('click', function () {
    binLibOverlay.classList.add('active');
    loadBinLibrary();
  });
  binLibCloseBtn.addEventListener('click', function () { binLibOverlay.classList.remove('active'); });
  binLibOverlay.addEventListener('click', function (e) {
    if (e.target === binLibOverlay) binLibOverlay.classList.remove('active');
  });

  binLibFilterAll.addEventListener('click', function () {
    binLibFilter = 'all';
    binLibFilterAll.classList.add('active');
    binLibFilterTop.classList.remove('active');
    renderBinLib();
  });
  binLibFilterTop.addEventListener('click', function () {
    binLibFilter = 'top';
    binLibFilterTop.classList.add('active');
    binLibFilterAll.classList.remove('active');
    renderBinLib();
  });

  function loadBinLibrary() {
    binLibBody.innerHTML = '<div class="binlib-empty"><div class="binlib-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>Loading BIN data...</div>';
    binLibCount.textContent = '--';
    apiFetch('bin-library', { user_id: userId }).then(function (res) {
      if (res.success && res.bins && res.bins.length > 0) {
        binLibData = res.bins;
        binLibCount.textContent = res.bins.length;
        renderBinLib();
      } else {
        binLibCount.textContent = '0';
        binLibBody.innerHTML = '<div class="binlib-empty"><div class="binlib-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>No BINs in library<br><span class="binlib-empty-sub">BINs are added via the Telegram bot</span></div>';
      }
    });
  }

  function renderBinLib() {
    var bins = binLibData.slice();
    if (binLibFilter === 'top') {
      bins.sort(function (a, b) { return (b.likes || 0) - (a.likes || 0); });
    } else {
      bins.sort(function (a, b) {
        var da = a.added_at ? new Date(a.added_at).getTime() : 0;
        var db = b.added_at ? new Date(b.added_at).getTime() : 0;
        return db - da;
      });
    }

    var html = '';
    bins.forEach(function (item, i) {
      var uploadDate = '--';
      if (item.added_at) {
        var d = new Date(item.added_at);
        if (!isNaN(d)) {
          var day = String(d.getDate()).padStart(2, '0');
          var mo = String(d.getMonth() + 1).padStart(2, '0');
          var yr = String(d.getFullYear()).slice(-2);
          var hrs = d.getHours();
          var ampm = hrs >= 12 ? 'pm' : 'am';
          hrs = hrs % 12 || 12;
          var mins = String(d.getMinutes()).padStart(2, '0');
          uploadDate = day + '|' + mo + '|' + yr + ' ' + hrs + ':' + mins + ampm;
        }
      }

      var credit = item.credit || 'N/A';
      if (credit.charAt(0) === '@') credit = credit.substring(1);

      var likes = item.likes || 0;
      var dislikes = item.dislikes || 0;

      html +=
        '<div class="binlib-card">' +
        '<div class="binlib-row">' +
        '<span class="binlib-lbl">Site:</span>' +
        '<span class="binlib-val">' + escHtml(item.site || 'N/A') + '</span>' +
        '</div>' +
        '<div class="binlib-row">' +
        '<span class="binlib-lbl">Bin:</span>' +
        '<span class="binlib-val binlib-val--bin">' + escHtml(item.bin || 'N/A') + '</span>' +
        '</div>' +
        '<div class="binlib-row">' +
        '<span class="binlib-lbl">C/r:</span>' +
        '<span class="binlib-val binlib-val--credit">@' + escHtml(credit) + '</span>' +
        '</div>' +
        '<hr class="binlib-sep">' +
        '<div class="binlib-foot">' +
        '<span class="binlib-foot-date">Uploaded on: ' + escHtml(uploadDate) + '</span>' +
        '<span class="binlib-foot-counts">' +
        '<span class="binlib-fc-like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' + likes + '</span>' +
        '<span class="binlib-fc-sep">|</span>' +
        '<span class="binlib-fc-dislike"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>' + dislikes + '</span>' +
        '</span>' +
        '</div>' +
        '</div>';
    });

    binLibBody.innerHTML = html;
  }

  // Dashboard
  var dashPfp = $('dashPfp');
  var dashPfpFallback = $('dashPfpFallback');
  var dashName = $('dashName');
  var dashId = $('dashId');
  var dashHits = $('dashHits');
  var dashGlobal = $('dashGlobal');
  var chipLicenseDot = $('chipLicenseDot');
  var chipLicense = $('chipLicense');
  var chipVersion = $('chipVersion');
  var versionBadge = $('versionBadge');
  var dashAttempts = $('dashAttempts');
  var dashRate = $('dashRate');

  // History
  var historyList = $('historyList');

  // Statistics
  var statUsers = $('statUsers');
  var statHits = $('statHits');
  var statToday = $('statToday');
  var statWeek = $('statWeek');
  var leaderboardList = $('leaderboardList');

  var token = '';
  var userId = '';
  var historyLoaded = false;
  var statsLoaded = false;

  // ── Tab switching ──
  var tabBtns = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.dataset.tab;
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('panel-' + tab).classList.add('active');
      if (tab === 'history' && !historyLoaded) loadHistory();
      if (tab === 'statistics' && !statsLoaded) loadStatistics();
    });
  });

  // ── API helper ──
  function apiFetch(action, params) {
    params = params || {};
    var qs = 'action=' + encodeURIComponent(action);
    for (var k in params) {
      if (params.hasOwnProperty(k) && params[k] != null) {
        qs += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      }
    }
    return fetch(API + '?' + qs)
      .then(function (r) { return r.json(); })
      .catch(function () { return { success: false }; });
  }

  // ── PFP helper ──
  function setPfp(imgEl, fallbackEl, url, name) {
    if (url && url.length > 5) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        imgEl.src = url;
        imgEl.style.display = 'block';
        if (fallbackEl) fallbackEl.style.display = 'none';
      };
      img.onerror = function () {
        imgEl.style.display = 'none';
        if (fallbackEl) {
          fallbackEl.style.display = 'flex';
          fallbackEl.textContent = (name || '?').charAt(0).toUpperCase();
        }
      };
      img.src = url;
    } else {
      imgEl.style.display = 'none';
      if (fallbackEl) {
        fallbackEl.style.display = 'flex';
        fallbackEl.textContent = (name || '?').charAt(0).toUpperCase();
      }
    }
  }

  function timeAgo(ts) {
    if (!ts) return '--';
    var diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return diff + 's ago';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  // Show full card: cc|mm|yy|cvv
  function formatCard(full) {
    if (!full) return '----';
    var parts = full.split('|');
    var cc = parts[0] || '----';
    var mm = parts[1] || '--';
    var yy = parts[2] || '--';
    var cvv = parts[3] || '---';
    return cc + '|' + mm + '|' + yy + '|' + cvv;
  }

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escAttr(s) { return escHtml(s); }

  // ── Set version from manifest ──
  (function setVersion() {
    var ver = 'v' + chrome.runtime.getManifest().version;
    if (versionBadge) versionBadge.textContent = ver;
    if (chipVersion) chipVersion.textContent = ver;
  })();

  // ── Init ──
  function init() {
    chrome.storage.local.get(
      ['lynix_token', 'lynix_user_id', 'lynix_first_name'],
      function (data) {
        token = data.lynix_token || '';
        userId = data.lynix_user_id || '';
        var firstName = data.lynix_first_name || '';

        dashName.textContent = firstName || '--';
        dashId.textContent = 'ID: ' + (userId || '--');

        if (token) {
          apiFetch('validate', { token: token }).then(function (res) {
            if (res.success) {
              var name = res.first_name || res.username || firstName || '--';
              dashName.textContent = name;
              dashId.textContent = 'ID: ' + (res.user_id || userId || '--');

              setPfp(headerPfp, null, res.pfp_url, name);
              setPfp(dashPfp, dashPfpFallback, res.pfp_url, name);

              dashHits.textContent = res.user_hits || res.hits || 0;
              dashGlobal.textContent = res.global_hits || 0;

              var hits = res.user_hits || res.hits || 0;
              var attempts = res.attempts || 0;
              dashAttempts.textContent = attempts;
              dashRate.textContent = attempts > 0 ? Math.round((hits / attempts) * 100) + '%' : '0%';

              chipLicenseDot.className = 'status-dot green';
              chipLicense.textContent = 'Valid';
              headerDot.className = 'status-dot-header valid';
            } else {
              chipLicenseDot.className = 'status-dot red';
              chipLicense.textContent = 'Invalid';
              headerDot.className = 'status-dot-header expired';
            }
          });
        } else {
          chipLicenseDot.className = 'status-dot red';
          chipLicense.textContent = 'No Token';
          headerDot.className = 'status-dot-header expired';
        }
      }
    );
  }

  // ── Auto-refresh dashboard every 10s ──
  function refreshDashboard() {
    if (!token) return;
    apiFetch('validate', { token: token }).then(function (res) {
      if (res.success) {
        dashHits.textContent = res.user_hits || res.hits || 0;
        dashGlobal.textContent = res.global_hits || 0;

        var hits = res.user_hits || res.hits || 0;
        var attempts = res.attempts || 0;
        dashAttempts.textContent = attempts;
        dashRate.textContent = attempts > 0 ? Math.round((hits / attempts) * 100) + '%' : '0%';
      }
    });
  }

  var refreshInterval = setInterval(refreshDashboard, 10000);


  // ── History ──
  var historyCount = $('historyCount');

  function loadHistory() {
    historyLoaded = true;
    if (!token) {
      historyList.innerHTML =
        '<div class="empty-state">' +
        '<div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
        '<div class="empty-state-text">Login required to view history</div>' +
        '</div>';
      historyCount.textContent = '';
      return;
    }

    historyList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    apiFetch('user-hits', { token: token, limit: 500 }).then(function (res) {
      if (!res.success || !res.hits || res.hits.length === 0) {
        historyList.innerHTML =
          '<div class="empty-state">' +
          '<div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>' +
          '<div class="empty-state-text">No hits recorded yet</div>' +
          '</div>';
        historyCount.textContent = '0';
        return;
      }

      var total = res.total_count || res.hits.length;
      historyCount.textContent = total + ' total';

      var html = '';
      res.hits.forEach(function (hit) {
        var card = formatCard(hit.full_card || hit.card);
        var amount = hit.amount || '0';
        var currency = (hit.currency || 'usd').toUpperCase();
        var merchant = hit.merchant || 'Unknown';
        var time = timeAgo(hit.timestamp);

        html +=
          '<div class="hit-item">' +
          '<div class="hit-item-icon"><img src="' + escAttr(STRIPE_ICON) + '" alt="Stripe"></div>' +
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
    });
  }

  // ── Statistics ──
  var statsFooter = $('statsFooter');
  var statsFooterRank = $('statsFooterRank');
  var statsFooterName = $('statsFooterName');
  var statsFooterHits = $('statsFooterHits');

  function loadStatistics() {
    statsLoaded = true;

    var statsP = apiFetch('popup-stats');
    var lbParams = { limit: 50 };
    if (userId) lbParams.user_id = userId;
    var lbP = apiFetch('leaderboard', lbParams);

    statsP.then(function (res) {
      if (res.success) {
        statUsers.textContent = res.total_users || 0;
        statHits.textContent = res.total_hits || 0;
        statToday.textContent = res.hits_today || 0;
        statWeek.textContent = res.hits_week || 0;
      }
    });

    lbP.then(function (res) {
      if (!res.success || !res.leaderboard || res.leaderboard.length === 0) {
        leaderboardList.innerHTML =
          '<div class="empty-state">' +
          '<div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div>' +
          '<div class="empty-state-text">No data yet</div>' +
          '</div>';
        return;
      }

      var html = '';
      var userRank = null;
      var userHits = 0;
      var userName = '';

      res.leaderboard.forEach(function (u, i) {
        var rank = i + 1;
        var name = u.first_name || u.username || 'Unknown';
        var uname = u.username ? '@' + u.username : '';
        var pfpUrl = u.pfp_url || '';
        var initial = name.charAt(0).toUpperCase();
        var rankClass = rank <= 3 ? 'rank-' + rank : 'rank-default';
        var isMe = userId && String(u.user_id) === String(userId);

        if (isMe) {
          userRank = rank;
          userHits = u.hits || 0;
          userName = name;
        }

        var pfpHtml;
        if (pfpUrl && pfpUrl.length > 5) {
          pfpHtml =
            '<img class="hitter-pfp" src="' + escAttr(pfpUrl) + '" alt="" style="display:block;">' +
            '<div class="hitter-pfp-fallback" style="display:none;">' + escHtml(initial) + '</div>';
        } else {
          pfpHtml = '<div class="hitter-pfp-fallback">' + escHtml(initial) + '</div>';
        }

        var meClass = isMe ? ' top-hitter--me' : '';

        html +=
          '<div class="top-hitter' + meClass + '">' +
          '<div class="rank-badge ' + rankClass + '">#' + rank + '</div>' +
          pfpHtml +
          '<div class="hitter-info">' +
          '<div class="hitter-name">' + escHtml(name) + (isMe ? ' <span style="font-size:8px;color:var(--accent);font-weight:700;">(You)</span>' : '') + '</div>' +
          '<div class="hitter-username">' + escHtml(uname) + '</div>' +
          '</div>' +
          '<div class="hitter-hits">' + (u.hits || 0) + '</div>' +
          '</div>';
      });

      leaderboardList.innerHTML = html;

      // Attach image error handlers (CSP-safe, no inline onerror)
      var pfpImgs = leaderboardList.querySelectorAll('.hitter-pfp');
      pfpImgs.forEach(function (img) {
        img.addEventListener('error', function () {
          img.style.display = 'none';
          var fallback = img.nextElementSibling;
          if (fallback) fallback.style.display = 'flex';
        });
      });

      // Show footer with user's place -- prefer API's my_rank (works beyond top 50)
      var myRank = res.my_rank || null;
      var footerRankNum = null;
      var footerName = '';
      var footerHits = 0;
      var footerPfp = '';

      if (myRank) {
        footerRankNum = myRank.rank;
        footerName = myRank.first_name || myRank.username || userName || 'You';
        footerHits = myRank.hits || 0;
        footerPfp = myRank.pfp_url || '';
      } else if (userRank !== null) {
        footerRankNum = userRank;
        footerName = userName;
        footerHits = userHits;
      }

      if (footerRankNum !== null) {
        // Rank badge
        statsFooterRank.textContent = '#' + footerRankNum;
        statsFooterRank.className = 'rank-badge ' + (footerRankNum <= 3 ? 'rank-' + footerRankNum : 'rank-default');

        // Profile picture
        var pfpWrap = $('statsFooterPfpWrap');
        var initial = footerName.charAt(0).toUpperCase() || 'U';
        if (footerPfp && footerPfp.length > 5) {
          pfpWrap.innerHTML =
            '<img class="hitter-pfp" src="' + escAttr(footerPfp) + '" alt="" style="display:block;">' +
            '<div class="hitter-pfp-fallback" style="display:none;">' + escHtml(initial) + '</div>';
          var pfpImg = pfpWrap.querySelector('.hitter-pfp');
          if (pfpImg) {
            pfpImg.addEventListener('error', function () {
              pfpImg.style.display = 'none';
              var fb = pfpImg.nextElementSibling;
              if (fb) fb.style.display = 'flex';
            });
          }
        } else {
          pfpWrap.innerHTML = '<div class="hitter-pfp-fallback">' + escHtml(initial) + '</div>';
        }

        // Name and hits
        statsFooterName.textContent = footerName;
        statsFooterHits.textContent = footerHits;
        statsFooter.style.display = 'flex';
      } else {
        statsFooter.style.display = 'none';
      }
    });
  }

  init();
});
