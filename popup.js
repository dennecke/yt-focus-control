const storageKey = 'yt_focus_settings';
const checkbox = document.getElementById('blockShorts');

// Beim Öffnen den aktuellen Status laden
chrome.storage.local.get([storageKey], (result) => {
  const settings = result[storageKey] || { blockShorts: true };
  checkbox.checked = settings.blockShorts;
});

// Bei Änderung speichern
checkbox.addEventListener('change', () => {
  const newSettings = {
    blockShorts: checkbox.checked
  };
  chrome.storage.local.set({ [storageKey]: newSettings });
});