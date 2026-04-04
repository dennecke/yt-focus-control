const storageKey = 'yt_focus_settings';
const styleId = 'yt-focus-style-hide-shorts';

// 1. Sichere Sleep-Mode-Prüfung
function isSleepModeActive(settings) {
  if (!settings || !settings.enableSchedule) return false;
  
  const start = settings.startTime || "22:00";
  const end = settings.endTime || "08:00";
  const now = new Date();
  const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startTotal = (startH * 60) + startM;
  const endTotal = (endH * 60) + endM;

  if (startTotal > endTotal) {
    return (currentTotalMinutes >= startTotal || currentTotalMinutes < endTotal);
  } else {
    return (currentTotalMinutes >= startTotal && currentTotalMinutes < endTotal);
  }
}

// 2. Shorts sicher ausblenden
function applyShortsStyles(shouldBlock) {
  const block = shouldBlock !== false; 
  let styleEl = document.getElementById(styleId);
  
  if (block) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      a[title="Shorts"], 
      ytd-guide-entry-renderer:has(a[title="Shorts"]), 
      ytd-mini-guide-entry-renderer[aria-label="Shorts"],
      ytd-rich-shelf-renderer[is-shorts],
      ytd-reel-shelf-renderer { display: none !important; }
    `;
  } else if (styleEl) {
    styleEl.remove();
  }
}

// Hilfsfunktion: Nachricht an background.js schicken
function safeRedirect(urlSuffix) {
  chrome.runtime.sendMessage({ action: "redirect", url: urlSuffix });
}

// 3. Haupt-Check
function checkFocus() {
  if (window.location.href.includes(chrome.runtime.id)) return;

  chrome.storage.local.get([storageKey], (result) => {
    const s = result[storageKey] || {};

    // A: Ist Schlafenszeit?
    if (isSleepModeActive(s)) {
      safeRedirect("blocked.html?reason=time");
      return; 
    }

    // B: Falls nicht, greift der Shorts-Blocker
    const blockShorts = s.blockShorts !== false;
    applyShortsStyles(blockShorts);
    
    if (blockShorts && window.location.href.includes('/shorts/')) {
      safeRedirect("blocked.html");
    }
  });
}

// 4. Initialisierung & Überwachung
function init() {
  checkFocus();
  setInterval(checkFocus, 10000); 
  window.addEventListener('yt-navigate-finish', checkFocus);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="/shorts/"]');
    if (link) {
      chrome.storage.local.get([storageKey], (res) => {
        const s = res[storageKey] || {};
        
        if (isSleepModeActive(s)) {
          e.preventDefault();
          safeRedirect("blocked.html?reason=time");
          return;
        }

        if (s.blockShorts !== false) {
          e.preventDefault();
          safeRedirect("blocked.html");
        }
      });
    }
  }, true);
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes[storageKey]) checkFocus();
});

init();