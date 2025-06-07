// Toggle theme
document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function saveSettings() {
  const currency = document.getElementById('currency')?.value || 'EUR';
  const emailUpdates = document.getElementById('emailUpdates')?.checked || false;

  localStorage.setItem('currency', currency);
  localStorage.setItem('emailUpdates', emailUpdates);

  const messageEl = document.getElementById('settingsMessage');
  if (messageEl) messageEl.textContent = '✅ Settings saved!';
}

function resetSettings() {
  localStorage.removeItem('currency');
  localStorage.removeItem('emailUpdates');

  const currencyEl = document.getElementById('currency');
  const emailEl = document.getElementById('emailUpdates');
  const messageEl = document.getElementById('settingsMessage');

  if (currencyEl) currencyEl.value = 'EUR';
  if (emailEl) emailEl.checked = false;
  if (messageEl) messageEl.textContent = '🔁 Settings reset to default.';
}

// Load saved settings on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedCurrency = localStorage.getItem('currency');
  const savedEmail = localStorage.getItem('emailUpdates') === 'true';

  const currencyEl = document.getElementById('currency');
  const emailEl = document.getElementById('emailUpdates');

  if (savedCurrency && currencyEl) currencyEl.value = savedCurrency;
  if (emailEl) emailEl.checked = savedEmail;
});
