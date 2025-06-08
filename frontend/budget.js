const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

const budgetList = document.getElementById('budget-list');
const budgetForm = document.getElementById('budget-form');
const budgetMsg = document.getElementById('budget-msg');
const editBudgetModal = document.getElementById('editBudgetModal');
const editBudgetForm = document.getElementById('edit-budget-form');
const cancelBudgetEdit = document.getElementById('cancelBudgetEdit');

async function loadBudgets() {
  try {
    const [budgetsRes, transactionsRes] = await Promise.all([
      fetch('http://localhost:3000/budgets'),
      fetch('http://localhost:3000/transactions')
    ]);

    const budgets = await budgetsRes.json();
    const transactions = await transactionsRes.json();

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
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
          <button class="header-button edit-btn" data-id="${budget.id}" data-category="${budget.category}" data-amount="${budget.amount}">✏️ Edit</button>
          <button class="header-button delete-btn" data-id="${budget.id}">🗑️ Delete</button>
        </div>
      `;

      budgetList.appendChild(card);

      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', async () => {
        const confirmDelete = confirm(`Delete budget for ${budget.category}?`);
        if (confirmDelete) {
          try {
            await fetch(`http://localhost:3000/budgets/${budget.id}`, {
              method: 'DELETE'
            });
            loadBudgets();
          } catch (err) {
            alert('❌ Failed to delete.');
            console.error(err);
          }
        }
      });

      const editBtn = card.querySelector('.edit-btn');
      editBtn.addEventListener('click', () => {
        const { id, category, amount } = editBtn.dataset;
        editBudgetForm.id.value = id;
        editBudgetForm.category.value = category;
        editBudgetForm.amount.value = amount;
        editBudgetModal.style.display = 'block';
      });
    });

  } catch (err) {
    budgetList.innerHTML = '<p>⚠️ Failed to load budgets.</p>';
    console.error(err);
  }
}


editBudgetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = editBudgetForm.id.value;
  const data = Object.fromEntries(new FormData(editBudgetForm).entries());

  try {
    await fetch(`http://localhost:3000/budgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    editBudgetModal.style.display = 'none';
    loadBudgets();

  } catch (err) {
    alert('❌ Failed to update budget.');
    console.error(err);
  }
});

cancelBudgetEdit.addEventListener('click', () => {
  editBudgetModal.style.display = 'none';
});
budgetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(budgetForm).entries());

  try {
    const res = await fetch('http://localhost:3000/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const response = await res.json();

    if (response.id) {
      budgetMsg.textContent = '✅ Budget added!';
      budgetForm.reset();
      loadBudgets();
    } else {
      budgetMsg.textContent = '❌ Failed to add budget.';
    }

  } catch (err) {
    console.error(err);
    budgetMsg.textContent = '❌ Server error.';
  }
});

loadBudgets();
