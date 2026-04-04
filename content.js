const storageKey = 'yt_focus_settings';
const blockedUrl = chrome.runtime.getURL('blocked.html');
const styleId = 'yt-focus-style-hide-shorts';

function isSleepModeActive(settings) {
  if (!settings || !settings.enableSchedule) return false;
  
  const now = new Date();
  const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();
  const [startH, startM] = settings.startTime.split(':').map(Number);
  const [endH, endM] = settings.endTime.split(':').map(Number);
  const startTotal = (startH * 60) + startM;
  const endTotal = (endH * 60) + endM;

  if (startTotal > endTotal) {
    return (currentTotalMinutes >= startTotal || currentTotalMinutes < endTotal);
  } else {
    return (currentTotalMinutes >= startTotal && currentTotalMinutes < endTotal);
  }
}

function applyShortsStyles(shouldBlock) {
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
      ytd-reel-shelf-renderer { display: none !important; }
    `;
  } else if (styleEl) {
    styleEl.remove();
  }
}

function checkFocus() {
  if (window.location.href.includes(chrome.runtime.id)) return;

  chrome.storage.local.get([storageKey], (result) => {
    const s = result[storageKey] || { blockShorts: true, enableSchedule: false, startTime: "22:00", endTime: "08:00" };

    if (isSleepModeActive(s)) {
      window.location.href = blockedUrl + "?reason=time";
      return; 
    }

    applyShortsStyles(s.blockShorts);
    if (s.blockShorts && window.location.href.includes('/shorts/')) {
      window.location.href = blockedUrl;
    }
  });
}

function init() {
  checkFocus();
  setInterval(checkFocus, 30000); 

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="/shorts/"]');
    if (link) {
      chrome.storage.local.get([storageKey], (res) => {
        const s = res[storageKey] || { blockShorts: true, enableSchedule: false, startTime: "22:00", endTime: "08:00" };
        
        if (isSleepModeActive(s)) {
          e.preventDefault();
          window.location.href = blockedUrl + "?reason=time";
          return;
        }

        if (s.blockShorts) {
          e.preventDefault();
          window.location.href = blockedUrl;
        }
      });
    }
  }, true);
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes[storageKey]) {
    checkFocus();
  }
});

init();