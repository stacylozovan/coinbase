const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income-amount');
const expenseDisplay = document.getElementById('expense-amount');
const assetsDisplay = document.getElementById('assets-amount');


const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}


if (transactionList) {
  fetch('http://localhost:3000/transactions')
    .then((res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then((transactions) => {
      transactionList.innerHTML = '';

      let balance = 0;
      let income = 0;
      let expense = 0;

      transactions.slice(-5).forEach(tx => {
        const li = document.createElement('li');
        li.textContent = `${tx.category} - ${tx.amount}€ on ${tx.date}`;
        transactionList.appendChild(li);
      });


      transactions.forEach(tx => {
        const amount = Number(tx.amount);
        balance += amount;
        if (amount > 0) income += amount;
        else expense += amount;
      });


      if (balanceDisplay) balanceDisplay.textContent = `${balance.toFixed(2)} €`;
      if (incomeDisplay) incomeDisplay.textContent = `${income.toFixed(2)} €`;
      if (expenseDisplay) expenseDisplay.textContent = `${expense.toFixed(2)} €`;
      if (assetsDisplay) assetsDisplay.textContent = `${(income + Math.abs(expense)).toFixed(2)} €`;
    })
    .catch((err) => {
      transactionList.innerHTML = '<li>Error loading transactions</li>';
      console.error('Fetch error:', err);
    });
}
const dashboardBudget = document.getElementById('dashboard-budget');

if (dashboardBudget) {
  fetch('http://localhost:3000/budgets')
    .then(res => res.json())
    .then(budgets => {
      dashboardBudget.innerHTML = '';

      budgets.forEach(budget => {
        dashboardBudget.innerHTML += `
          <div><strong>📂</strong> ${budget.category}: <span>€${budget.amount}</span></div>
        `;
      });
    })
    .catch(err => {
      dashboardBudget.innerHTML = '<p>⚠️ Failed to load budget data.</p>';
      console.error(err);
    });
}

