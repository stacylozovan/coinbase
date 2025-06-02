const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

const budgetList = document.getElementById('budget-list');
const budgetForm = document.getElementById('budget-form');
const budgetMsg = document.getElementById('budget-msg');

// Load budgets from backend
function loadBudgets() {
  Promise.all([
    fetch('http://localhost:3000/budgets').then(res => res.json()),
    fetch('http://localhost:3000/transactions').then(res => res.json())
  ])
    .then(([budgets, transactions]) => {
      budgetList.innerHTML = '';

      budgets.forEach(budget => {

        const spent = transactions
          .filter(tx => tx.category.toLowerCase() === budget.category.toLowerCase())
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '1rem';

        card.innerHTML = `
          <h3>${budget.category}</h3>
          <p>€${spent} of €${budget.amount}</p>
          <div style="height: 10px; background: #eee; border-radius: 1rem; margin-top: 4px;">
            <div style="
              width: ${(spent / budget.amount) * 100}%;
              background: ${spent > budget.amount ? 'var(--danger)' : 'var(--success)'};
              height: 100%;
              border-radius: 1rem;
            "></div>
          </div>
          <button class="header-button delete-btn" data-id="${budget.id}" style="margin-top: 1rem;">🗑️ Delete</button>
        `;

        budgetList.appendChild(card);

        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
          const confirmDelete = confirm(`Delete budget for ${budget.category}?`);
          if (confirmDelete) {
            fetch(`http://localhost:3000/budgets/${budget.id}`, {
              method: 'DELETE'
            })
              .then(res => res.json())
              .then(() => loadBudgets())
              .catch(err => {
                alert('❌ Failed to delete.');
                console.error(err);
              });
          }
        });
      });
    })
    .catch(err => {
      budgetList.innerHTML = '<p>⚠️ Failed to load budgets.</p>';
      console.error(err);
    });
}


budgetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(budgetForm).entries());

  fetch('http://localhost:3000/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      if (response.id) {
        budgetMsg.textContent = '✅ Budget added!';
        budgetForm.reset();
        loadBudgets();
      } else {
        budgetMsg.textContent = '❌ Failed to add budget.';
      }
    })
    .catch(err => {
      console.error(err);
      budgetMsg.textContent = '❌ Server error.';
    });
});

// Load on page start
loadBudgets();
