const form = document.getElementById('transaction-form');
const result = document.getElementById('result-msg');
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      if (response.id) {
        result.textContent = "✅ Transaction added successfully!";
        form.reset();
      } else {
        result.textContent = "❌ Failed to add transaction.";
      }
    })
    .catch(err => {
      console.error(err);
      result.textContent = "❌ An error occurred.";
    });
});
