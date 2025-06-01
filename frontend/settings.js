// settings.js

document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function saveSettings() {
  const currency = document.getElementById('currency').value;
  const emailUpdates = document.getElementById('emailUpdates').checked;

  // Store settings locally (you can change this to use your backend later)
  localStorage.setItem('currency', currency);
  localStorage.setItem('emailUpdates', emailUpdates);

  document.getElementById('settingsMessage').textContent = '✅ Settings saved!';
}

function resetSettings() {
  localStorage.removeItem('currency');
  localStorage.removeItem('emailUpdates');
  document.getElementById('currency').value = 'EUR';
  document.getElementById('emailUpdates').checked = false;
  document.getElementById('settingsMessage').textContent = '🔁 Settings reset to default.';
}

// Load saved settings on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedCurrency = localStorage.getItem('currency');
  const savedEmail = localStorage.getItem('emailUpdates') === 'true';

  if (savedCurrency) document.getElementById('currency').value = savedCurrency;
  document.getElementById('emailUpdates').checked = savedEmail;
});
