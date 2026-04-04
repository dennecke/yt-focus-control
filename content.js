const storageKey = 'yt_focus_settings';
const blockedUrl = chrome.runtime.getURL('blocked.html');
const styleId = 'yt-focus-style-hide-shorts';

function applyStyles(shouldBlock) {
  let styleEl = document.getElementById(styleId);
  
  if (shouldBlock) {
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
      ytd-reel-shelf-renderer { 
        display: none !important; 
      }
    `;
  } else if (styleEl) {
    // Wenn deaktiviert, löschen wir das CSS-Element einfach wieder
    styleEl.remove();
  }
}

function init() {
  // Initialen Status prüfen und CSS anwenden
  chrome.storage.local.get([storageKey], (result) => {
    const settings = result[storageKey] || { blockShorts: true };
    applyStyles(settings.blockShorts);
  });

  // Klick-Event-Handler
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="/shorts/"]');
    if (link) {
      chrome.storage.local.get([storageKey], (result) => {
        const settings = result[storageKey] || { blockShorts: true };
        if (settings.blockShorts) {
          event.preventDefault();
          event.stopPropagation();
          window.location.href = blockedUrl;
        }
      });
    }
  }, true);

  // URL-Check (für Direktzugriffe)
  const checkUrl = () => {
    if (window.location.href.includes('/shorts/')) {
      chrome.storage.local.get([storageKey], (result) => {
        if (result[storageKey]?.blockShorts !== false) {
          window.location.replace(blockedUrl);
        }
      });
    }
  };

  window.addEventListener('popstate', checkUrl);
  window.addEventListener('yt-navigate-finish', checkUrl);
  checkUrl();
}

// Auf Änderungen im Popup reagieren (Live-Update ohne Refresh)
chrome.storage.onChanged.addListener((changes) => {
  if (changes[storageKey]) {
    applyStyles(changes[storageKey].newValue.blockShorts);
  }
});

init();