const form = document.getElementById('transaction-form');
const result = document.getElementById('result-msg');
const themeToggle = document.getElementById('themeToggle');

// Theme toggle
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

// Set today's date as default
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
}

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const response = await res.json();

    if (response.id) {
      result.textContent = "✅ Transaction added successfully! Redirecting...";
      setTimeout(() => {
        window.location.href = 'transactions.html';
      }, 1000);
    } else {
      result.textContent = "❌ Failed to add transaction.";
    }

  } catch (err) {
    console.error(err);
    result.textContent = "❌ An error occurred.";
  }
});
