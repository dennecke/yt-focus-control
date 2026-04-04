const storageKey = 'yt_focus_settings';

// Alle Elemente referenzieren
const elements = {
  blockShorts: document.getElementById('blockShorts'),
  enableSchedule: document.getElementById('enableSchedule'),
  startTime: document.getElementById('startTime'),
  endTime: document.getElementById('endTime')
};

// 1. Laden der Einstellungen beim Öffnen des Popups
chrome.storage.local.get([storageKey], (result) => {
  const settings = result[storageKey];
  
  if (settings) {
    // Nur zuweisen, wenn die Daten auch wirklich existieren
    if (settings.blockShorts !== undefined) elements.blockShorts.checked = settings.blockShorts;
    if (settings.enableSchedule !== undefined) elements.enableSchedule.checked = settings.enableSchedule;
    if (settings.startTime) elements.startTime.value = settings.startTime;
    if (settings.endTime) elements.endTime.value = settings.endTime;
  }
});

// 2. Funktion zum Speichern aller aktuellen Werte
function saveAllSettings() {
  const newSettings = {
    blockShorts: elements.blockShorts.checked,
    enableSchedule: elements.enableSchedule.checked,
    startTime: elements.startTime.value,
    endTime: elements.endTime.value
  };

  chrome.storage.local.set({ [storageKey]: newSettings }, () => {
    console.log("Settings saved:", newSettings);
  });
}

// 3. Event Listener für JEDE Änderung hinzufügen
elements.blockShorts.addEventListener('change', saveAllSettings);
elements.enableSchedule.addEventListener('change', saveAllSettings);
elements.startTime.addEventListener('change', saveAllSettings);
elements.endTime.addEventListener('change', saveAllSettings);