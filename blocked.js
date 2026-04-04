document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get('reason');
  
  const headline = document.getElementById('headline');
  const message = document.getElementById('message');
  const icon = document.getElementById('icon');

  if (reason === 'time') {
    document.body.classList.add('sleep-mode');
    icon.textContent = "🌙";
    headline.textContent = "SLEEP MODE";
    headline.style.color = "#5cacee";
    message.textContent = "YouTube is currently in sleep mode. Go do something else!";
  } else if (reason === 'limit') {
    icon.textContent = "⌛";
    headline.textContent = "TIME'S UP!";
    headline.style.color = "#ffeb3b"; // Gelbe Farbe
    message.textContent = "You've reached your YouTube limit!";
  } else {
    icon.textContent = "🛑";
    headline.textContent = "STOP!";
    headline.style.color = "#cc0000";
    message.textContent = "Just go back, shorts are not worth your time.";
  }
});