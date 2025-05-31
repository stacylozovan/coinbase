document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  const fundList = document.getElementById('futurefund-list');
  const fundForm = document.getElementById('futurefund-form');
  const fundMsg = document.getElementById('result-msg');

  // Load and render all goals
  function loadFunds() {
    fetch('http://localhost:3000/futurefunds')
      .then(res => res.json())
      .then(funds => {
        fundList.innerHTML = '';

        if (!funds.length) {
          fundList.innerHTML = '<li>No future goals yet.</li>';
          return;
        }

        funds.forEach(fund => {
          const progress = (fund.saved_amount / fund.target_amount) * 100;

          const li = document.createElement('li');
          li.className = 'card';
          li.style.marginBottom = '1rem';

          li.innerHTML = `
            <h3>${fund.goal_name}</h3>
            <p>Saved €${fund.saved_amount} of €${fund.target_amount}</p>
            <div style="height: 10px; background: #eee; border-radius: 1rem;">
              <div style="
                width: ${progress > 100 ? 100 : progress}%;
                background: ${progress >= 100 ? 'var(--success)' : 'var(--accent)'};
                height: 100%;
                border-radius: 1rem;
              "></div>
            </div>
            <button class="header-button delete-fund" data-id="${fund.id}" style="margin-top: 0.5rem;">🗑️ Delete</button>
          `;

          fundList.appendChild(li);
        });

        attachDeleteHandlers();
      })
      .catch(err => {
        fundList.innerHTML = '<li>⚠️ Could not load goals.</li>';
        console.error(err);
      });
  }

  // Delete goal
  function attachDeleteHandlers() {
    document.querySelectorAll('.delete-fund').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('Delete this goal?')) {
          fetch(`http://localhost:3000/futurefunds/${id}`, {
            method: 'DELETE'
          })
            .then(() => loadFunds())
            .catch(err => {
              alert('Failed to delete.');
              console.error(err);
            });
        }
      });
    });
  }

  // Add new goal
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
          fundMsg.textContent = '✅ Goal added!';
          fundForm.reset();
          loadFunds();
        } else {
          fundMsg.textContent = '❌ Failed to add goal.';
        }
      })
      .catch(err => {
        fundMsg.textContent = '❌ Server error.';
        console.error(err);
      });
  });

  // Initial load
  loadFunds();
});
