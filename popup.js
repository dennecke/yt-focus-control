const storageKey = 'yt_focus_settings';

document.addEventListener('DOMContentLoaded', () => {
  const shortsToggle = document.getElementById('blockShorts');

  chrome.storage.local.get([storageKey], (result) => {
    const settings = result[storageKey] || { blockShorts: true };
    shortsToggle.checked = settings.blockShorts;
  });

  shortsToggle.addEventListener('change', () => {
    const settings = {
      blockShorts: shortsToggle.checked
    };
    chrome.storage.local.set({ [storageKey]: settings });
  });
});