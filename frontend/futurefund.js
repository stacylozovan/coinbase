document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  const fundList = document.getElementById('future-fund-list');
  const fundForm = document.getElementById('future-fund-form');
  const fundMsg = document.getElementById('fund-msg');

  function loadFunds() {
    fetch('http://localhost:3000/futurefunds')
      .then(res => res.json())
      .then(funds => {
        fundList.innerHTML = '';

        if (!funds.length) {
          fundList.innerHTML = '<p>No future goals yet.</p>';
          return;
        }

        funds.forEach(fund => {
          const card = document.createElement('div');
          card.className = 'card';
          card.style.marginBottom = '1rem';

          const progress = (fund.current_amount / fund.target_amount) * 100;

          card.innerHTML = `
            <h3>${fund.title}</h3>
            <p>Saved €${fund.current_amount} of €${fund.target_amount}</p>
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

          fundList.appendChild(card);
        });

        attachDeleteHandlers();
      })
      .catch(err => {
        fundList.innerHTML = '<p>⚠️ Could not load funds.</p>';
        console.error(err);
      });
  }

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

  fundForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(fundForm).entries());

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
          fundMsg.textContent = '❌ Failed to add.';
        }
      })
      .catch(err => {
        fundMsg.textContent = '❌ Server error.';
        console.error(err);
      });
  });

  loadFunds();
});
