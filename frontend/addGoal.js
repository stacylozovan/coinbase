document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  const fundForm = document.getElementById('futurefund-form');
  const fundMsg = document.getElementById('result-msg');

  fundForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(fundForm).entries());

    const data = {
      goal_name: raw.goal,
      target_amount: Number(raw.target),
      saved_amount: Number(raw.saved) || 0
    };

    fetch('http://localhost:3000/futurefunds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(response => {
        if (response.id) {

          window.location.href = 'futurefund.html';
        } else {
          fundMsg.textContent = '❌ Failed to add goal.';
        }
      })
      .catch(err => {
        fundMsg.textContent = '❌ Server error.';
        console.error(err);
      });
  });
});
