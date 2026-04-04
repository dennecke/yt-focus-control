// Wartet, bis die Seite komplett geladen ist
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get('reason');
  
  const headline = document.getElementById('headline');
  const message = document.getElementById('message');
  const icon = document.getElementById('icon');

  if (reason === 'time') {
    // Modus: Sleep Mode
    document.body.classList.add('sleep-mode');
    icon.textContent = "🌙";
    headline.textContent = "SLEEP MODE";
    message.textContent = "YouTube is currently in sleep mode. Go do something else!";
  } else {
    // Modus: Shorts Blocker
    icon.textContent = "🛑";
    headline.textContent = "STOP!";
    message.textContent = "Just go back, shorts are not worth your time.";
  }
});