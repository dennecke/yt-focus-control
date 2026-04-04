const storageKey = 'yt_focus_settings';

const elements = {
  blockShorts: document.getElementById('blockShorts'),
  enableSchedule: document.getElementById('enableSchedule'),
  startTime: document.getElementById('startTime'),
  endTime: document.getElementById('endTime'),
  enableLimit: document.getElementById('enableLimit'),
  limitHours: document.getElementById('limitHours'),
  limitMins: document.getElementById('limitMins'),
  timeLeft: document.getElementById('timeLeft')
};

function updateTimeLeftDisplay() {
  chrome.storage.local.get(['minutesUsed', storageKey], (data) => {
    const s = data[storageKey] || {};
    let used = data.minutesUsed || 0;
    
    let h = parseInt(elements.limitHours.value) || 0;
    let m = parseInt(elements.limitMins.value) || 0;
    let totalAllowed = (h * 60) + m;
    
    let left = Math.max(0, totalAllowed - used);
    let hLeft = Math.floor(left / 60);
    let mLeft = left % 60;
    
    if (s.enableLimit) {
      elements.timeLeft.textContent = `Left: ${hLeft}h ${mLeft}m`;
    } else {
      elements.timeLeft.textContent = "Off";
      elements.timeLeft.style.color = "#888";
    }
  });
}

chrome.storage.local.get([storageKey], (result) => {
  const s = result[storageKey];
  if (s) {
    if (s.blockShorts !== undefined) elements.blockShorts.checked = s.blockShorts;
    if (s.enableSchedule !== undefined) elements.enableSchedule.checked = s.enableSchedule;
    if (s.startTime) elements.startTime.value = s.startTime;
    if (s.endTime) elements.endTime.value = s.endTime;
    if (s.enableLimit !== undefined) elements.enableLimit.checked = s.enableLimit;
    if (s.limitHours !== undefined) elements.limitHours.value = s.limitHours;
    if (s.limitMins !== undefined) elements.limitMins.value = s.limitMins;
  }
  updateTimeLeftDisplay();
});

function saveAllSettings() {
  const newSettings = {
    blockShorts: elements.blockShorts.checked,
    enableSchedule: elements.enableSchedule.checked,
    startTime: elements.startTime.value,
    endTime: elements.endTime.value,
    enableLimit: elements.enableLimit.checked,
    limitHours: elements.limitHours.value,
    limitMins: elements.limitMins.value
  };
  chrome.storage.local.set({ [storageKey]: newSettings });
  updateTimeLeftDisplay();
}

Object.values(elements).forEach(el => {
  if (el && el !== elements.timeLeft) {
    el.addEventListener('change', saveAllSettings);
  }
});