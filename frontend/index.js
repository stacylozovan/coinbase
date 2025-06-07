const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income-amount');
const expenseDisplay = document.getElementById('expense-amount');
const assetsDisplay = document.getElementById('assets-amount');
const dashboardBudget = document.getElementById('dashboard-budget');
const themeToggle = document.getElementById('themeToggle');

// Theme toggle
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

// 📄 Load recent transactions
async function loadTransactions() {
  if (!transactionList) return;

  try {
    const res = await fetch('http://localhost:3000/transactions');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const transactions = await res.json();

    transactionList.innerHTML = '';

    let balance = 0;
    let income = 0;
    let expense = 0;

    transactions.slice(-5).forEach(tx => {
      const li = document.createElement('li');
      const category = tx.category || 'Uncategorized';
      const amount = parseFloat(tx.amount).toFixed(2);
      const date = tx.date || 'Unknown date';
      li.textContent = `${category} - €${amount} on ${date}`;
      transactionList.appendChild(li);
    });

    transactions.forEach(tx => {
      const amount = parseFloat(tx.amount);
      balance += amount;
      if (amount > 0) income += amount;
      else expense += amount;
    });

    if (balanceDisplay) balanceDisplay.textContent = `${balance.toFixed(2)} €`;
    if (incomeDisplay) incomeDisplay.textContent = `${income.toFixed(2)} €`;
    if (expenseDisplay) expenseDisplay.textContent = `${expense.toFixed(2)} €`;
    if (assetsDisplay) assetsDisplay.textContent = `${(income + Math.abs(expense)).toFixed(2)} €`;

  } catch (err) {
    transactionList.innerHTML = '<li>⚠️ Error loading transactions</li>';
    console.error('❌ Fetch error:', err);
  }
}

// 💰 Load budget summary
async function loadBudgets() {
  if (!dashboardBudget) return;

  try {
    const res = await fetch('http://localhost:3000/budgets');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const budgets = await res.json();

    dashboardBudget.innerHTML = '';

    if (budgets.length === 0) {
      dashboardBudget.innerHTML = '<p>No budget categories found.</p>';
      return;
    }

    budgets.forEach(budget => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>📂</strong> ${budget.category}: <span>€${budget.amount}</span>`;
      dashboardBudget.appendChild(div);
    });

  } catch (err) {
    dashboardBudget.innerHTML = '<p>⚠️ Failed to load budget data.</p>';
    console.error('❌ Budget fetch error:', err);
  }
}

//  Load pie chart of expenses by category
async function loadCategoryChart() {
  try {
    const res = await fetch('http://localhost:3000/transactions');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();

    const categoryTotals = {};

    data.forEach(tx => {
      const category = tx.category || 'Other';
      const amount = parseFloat(tx.amount);
      if (!isNaN(amount) && amount < 0) {
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
      }
    });

    const categories = Object.keys(categoryTotals);
    const amounts = categories.map(cat => categoryTotals[cat]);

    if (categories.length === 0) {
      console.warn("📊 No expenses found to show in chart.");
      return;
    }

    const canvas = document.getElementById('categoryChart');
    if (!canvas) {
      console.error('🚫 categoryChart canvas not found in the DOM.');
      return;
    }

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: [
            '#8e44ad', '#3498db', '#e67e22', '#2ecc71', '#f1c40f', '#e74c3c'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Expenses by Category'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || 'Unknown';
                const value = context.parsed || 0;
                return `${label}: €${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });

    console.log("✅ Category chart loaded successfully.");
  } catch (err) {
    console.error('❌ Error loading category chart:', err);
  }
}

// Initialize dashboard
loadTransactions();
loadBudgets();
loadCategoryChart();
