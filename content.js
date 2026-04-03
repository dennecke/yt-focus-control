const storageKey = 'yt_focus_settings';
const blockedUrl = chrome.runtime.getURL('blocked.html');

function init() {
  // 1. CSS: Sidebar & Startseite (Performant)
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  styleEl.textContent = `
    a[title="Shorts"], 
    ytd-guide-entry-renderer:has(a[title="Shorts"]), 
    ytd-mini-guide-entry-renderer[aria-label="Shorts"],
    ytd-rich-shelf-renderer[is-shorts],
    ytd-reel-shelf-renderer { 
      display: none !important; 
    }
  `;

  // 2. Observer: Sucht nach Shorts-Links und biegt sie um
  const observer = new MutationObserver(() => {
    chrome.storage.local.get([storageKey], (result) => {
      const settings = result[storageKey] || { blockShorts: true };
      if (!settings.blockShorts) return;

      // Finde alle Links, die zu Shorts führen
      const shortsLinks = document.querySelectorAll('a[href*="/shorts/"]');
      
      shortsLinks.forEach(link => {
        // Wir ändern das Link-Ziel direkt auf unsere Warnseite
        if (link.href !== blockedUrl) {
          link.href = blockedUrl;
          // Wir entfernen YouTube-interne Klick-Handler, damit er wirklich nur blocked.html lädt
          link.setAttribute('data-nav-id', ''); 
          link.onclick = (e) => {
            e.stopPropagation();
            window.location.href = blockedUrl;
          };
        }
      });

      // Falls wir DOCH auf einer Shorts-URL landen (Direktaufruf)
      if (window.location.href.includes('/shorts/')) {
        window.location.replace(blockedUrl);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

init();