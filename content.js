const storageKey = 'yt_focus_settings';
const styleId = 'yt-focus-style-injection';

function applySettings() {
  chrome.storage.local.get([storageKey], (result) => {
    const settings = result[storageKey] || { blockShorts: true };
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    let css = '';
    if (settings.blockShorts) {
      css += `
        ytd-rich-shelf-renderer[is-shorts], 
        ytd-reel-shelf-renderer, 
        a[title="Shorts"], 
        ytd-mini-guide-entry-renderer[aria-label="Shorts"],
        ytd-guide-entry-renderer:has(a[title="Shorts"]) { 
          display: none !important; 
        }
      `;
    }

    styleEl.textContent = css;
  });
}

applySettings();

chrome.storage.onChanged.addListener((changes) => {
  if (changes[storageKey]) {
    applySettings();
  }
});