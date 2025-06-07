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

  const editGoalModal = document.getElementById('editGoalModal');
  const editGoalForm = document.getElementById('edit-goal-form');
  const cancelGoalEdit = document.getElementById('cancelGoalEdit');

  async function loadFunds() {
    try {
      const res = await fetch('http://localhost:3000/futurefunds');
      const funds = await res.json();
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
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="header-button edit-fund"
              data-id="${fund.id}"
              data-title="${fund.goal_name}"
              data-target="${fund.target_amount}"
              data-saved="${fund.saved_amount}">✏️ Edit</button>
            <button class="header-button delete-fund" data-id="${fund.id}">🗑️ Delete</button>
          </div>
        `;

        fundList.appendChild(li);
      });

      attachDeleteHandlers();
      attachEditHandlers();
    } catch (err) {
      fundList.innerHTML = '<li>⚠️ Could not load goals.</li>';
      console.error(err);
    }
  }

  function attachDeleteHandlers() {
    document.querySelectorAll('.delete-fund').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm('Delete this goal?')) {
          try {
            await fetch(`http://localhost:3000/futurefunds/${id}`, {
              method: 'DELETE'
            });
            loadFunds();
          } catch (err) {
            alert('Failed to delete.');
            console.error(err);
          }
        }
      });
    });
  }

  function attachEditHandlers() {
    document.querySelectorAll('.edit-fund').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, title, target, saved } = btn.dataset;
        editGoalForm.setAttribute('data-id', id);
        editGoalForm.title.value = title;
        editGoalForm.target.value = target;
        editGoalForm.saved.value = saved;
        editGoalModal.style.display = 'block';
      });
    });
  }

  if (fundForm) {
    fundForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const raw = Object.fromEntries(new FormData(fundForm).entries());

      const data = {
        goal_name: raw.goal,
        target_amount: Number(raw.target),
        saved_amount: Number(raw.saved) || 0
      };

      try {
        const res = await fetch('http://localhost:3000/futurefunds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const response = await res.json();

        if (response.id) {
          fundMsg.textContent = '✅ Goal added!';
          fundForm.reset();
          loadFunds();
        } else {
          fundMsg.textContent = '❌ Failed to add goal.';
        }
      } catch (err) {
        fundMsg.textContent = '❌ Server error.';
        console.error(err);
      }
    });
  }

  editGoalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editGoalForm.getAttribute('data-id');
    const raw = Object.fromEntries(new FormData(editGoalForm).entries());

    const updated = {
      goal_name: raw.title,
      target_amount: Number(raw.target),
      saved_amount: Number(raw.saved)
    };

    try {
      await fetch(`http://localhost:3000/futurefunds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      editGoalModal.style.display = 'none';
      loadFunds();
    } catch (err) {
      alert('Failed to update goal.');
      console.error(err);
    }
  });

  cancelGoalEdit.addEventListener('click', () => {
    editGoalModal.style.display = 'none';
  });

  loadFunds();
});
