const storageKey = 'yt_focus_settings';

chrome.alarms.create("checkLimitTimer", { periodInMinutes: 1 });
chrome.alarms.create("resetDailyTimer", { when: getNextMidnight(), periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkLimitTimer") {
    chrome.storage.local.get([storageKey], (res) => {
      const s = res[storageKey];
      if (!s || !s.enableLimit) return;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes("youtube.com") && !tabs[0].url.includes("blocked.html")) {
          
          chrome.storage.local.get(['minutesUsed'], (data) => {
            let used = (data.minutesUsed || 0) + 1;
            chrome.storage.local.set({ minutesUsed: used });

            let h = parseInt(s.limitHours) || 0;
            let m = parseInt(s.limitMins) || 0;
            let totalAllowed = (h * 60) + m;

            if (used >= totalAllowed) {
              blockAllYouTubeTabs();
            }
          });
        }
      });
    });
  } else if (alarm.name === "resetDailyTimer") {
    chrome.storage.local.set({ minutesUsed: 0 });
  }
});

function blockAllYouTubeTabs() {
  const blockedUrl = chrome.runtime.getURL('blocked.html?reason=limit');
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.url.includes("youtube.com") && !tab.url.includes("blocked.html")) {
        chrome.tabs.update(tab.id, { url: blockedUrl });
      }
    });
  });
}

function getNextMidnight() {
  let date = new Date();
  date.setHours(24, 0, 0, 0);
  return date.getTime();
}