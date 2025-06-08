const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income-amount');
const expenseDisplay = document.getElementById('expense-amount');
const assetsDisplay = document.getElementById('assets-amount');
const dashboardBudget = document.getElementById('dashboard-budget');
const themeToggle = document.getElementById('themeToggle');
const categoryImages = {
  books: "resources/piggy_books.png",
  groceries: "resources/piggy_groceries.png",
  house: "resources/piggy_house.png",
  skincare: "resources/piggy_skincare.png",
  transport: "resources/piggy_transport.png",
  default: "resources/piggy_default.png"
};

// Theme toggle with smooth transition
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // Save theme preference
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
});

// Enhanced number formatting
function formatCurrency(amount) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
}

// Add visual feedback for value changes
function updateDisplayWithAnimation(element, value, isPositive = null) {
  if (!element) return;

  // Add loading state
  element.style.opacity = '0.5';

  setTimeout(() => {
    element.textContent = formatCurrency(value);

    // Apply positive/negative styling
    element.classList.remove('positive', 'negative', 'neutral');
    if (isPositive === null) {
      element.classList.add('neutral');
    } else if (isPositive) {
      element.classList.add('positive');
    } else {
      element.classList.add('negative');
    }

    // Restore opacity with smooth transition
    element.style.opacity = '1';

    // Add subtle pulse animation for updates
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);

  }, 100);
}

// Enhanced transaction loading with better error handling
async function loadTransactions() {
  if (!transactionList) return;

  try {
    // Add loading indicator
    transactionList.innerHTML = '<li class="loading">💫 Loading transactions...</li>';

    const res = await fetch('http://localhost:3000/transactions');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const transactions = await res.json();

    // Clear loading indicator
    transactionList.innerHTML = '';

    let balance = 0;
    let income = 0;
    let expense = 0;

    // Display recent transactions with better formatting
    const recentTransactions = transactions.slice(-5).reverse();

    if (recentTransactions.length === 0) {
      transactionList.innerHTML = '<li class="no-data">📝 No recent transactions</li>';
    } else {
      recentTransactions.forEach(tx => {
        const li = document.createElement('li');
        const category = tx.category || 'Uncategorized';
        const amount = parseFloat(tx.amount);
        const formattedAmount = formatCurrency(Math.abs(amount));
        const date = new Date(tx.date).toLocaleDateString('de-DE') || 'Unknown date';

        li.innerHTML = `
          <div class="transaction-item">
            <span class="category">${category}</span>
            <span class="amount ${amount >= 0 ? 'positive' : 'negative'}">
              ${amount >= 0 ? '+' : '-'}${formattedAmount}
            </span>
            <span class="date">${date}</span>
          </div>
        `;
        li.classList.add('transaction-entry');
        transactionList.appendChild(li);
      });
    }

    // Calculate totals
    transactions.forEach(tx => {
      const amount = parseFloat(tx.amount);
      if (!isNaN(amount)) {
        balance += amount;
        if (amount > 0) income += amount;
        else expense += Math.abs(amount);
      }
    });

    // Calculate assets (total money flow)
    const assets = income + expense;

    // Update displays with animations and proper styling
    updateDisplayWithAnimation(balanceDisplay, balance, balance >= 0);
    updateDisplayWithAnimation(incomeDisplay, income, true);
    updateDisplayWithAnimation(expenseDisplay, expense, false);
    updateDisplayWithAnimation(assetsDisplay, assets, true);

    console.log('✅ Transactions loaded successfully');

  } catch (err) {
    transactionList.innerHTML = `
      <li class="error">
        ⚠️ Error loading transactions
        <small>Please check your connection and try again</small>
      </li>
    `;
    console.error('❌ Fetch error:', err);

    // Set error states for displays
    [balanceDisplay, incomeDisplay, expenseDisplay, assetsDisplay].forEach(display => {
      if (display) {
        display.textContent = 'Error';
        display.classList.add('error-state');
      }
    });
  }
}

async function loadBudgets() {
  if (!dashboardBudget) return;

  try {
    dashboardBudget.innerHTML = '<div class="loading">💫 Loading budget data...</div>';

    const res = await fetch('http://localhost:3000/budgets');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const budgets = await res.json();

    dashboardBudget.innerHTML = '';

    if (budgets.length === 0) {
      dashboardBudget.innerHTML = `
        <div class="no-budget-data">
          <p>📊 No budget categories found</p>
          <small>Create your first budget to get started</small>
        </div>
      `;
      return;
    }

    budgets.forEach(budget => {
      const category = budget.category.toLowerCase();
      const imagePath = categoryImages[category] || categoryImages.default;
      const formattedAmount = formatCurrency(budget.amount);

      const budgetItem = document.createElement('div');
      budgetItem.className = 'budget-item';
      budgetItem.innerHTML = `
        <img src="${imagePath}" alt="${budget.category} icon" class="budget-icon-img">
        <div class="category">${budget.category}</div>
        <div class="amount">${formattedAmount}</div>
      `;

      dashboardBudget.appendChild(budgetItem);
    });

    console.log('✅ Budget data loaded successfully');
  } catch (err) {
    dashboardBudget.innerHTML = `
      <div class="error">
        ⚠️ Failed to load budget data
        <small>Please try refreshing the page</small>
      </div>
    `;
    console.error('❌ Budget fetch error:', err);
  }
}




function getBudgetIcon(category) {
  const icons = {
    'food': '🍽️',
    'transport': '🚗',
    'entertainment': '🎬',
    'shopping': '🛍️',
    'utilities': '⚡',
    'healthcare': '🏥',
    'education': '📚',
    'savings': '💰',
    'other': '📂'
  };

  return icons[category.toLowerCase()] || icons['other'];
}

// Enhanced category chart with better error handling
async function loadCategoryChart() {
  try {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) {
      console.error('🚫 categoryChart canvas not found in the DOM.');
      return;
    }

    const res = await fetch('http://localhost:3000/transactions');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();

    const categoryTotals = {};

    // Process expense data
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
      const ctx = canvas.getContext('2d');
      ctx.font = '16px Montserrat';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText('No expense data available', canvas.width / 2, canvas.height / 2);
      return;
    }

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: [
            '#ec4899', '#f8b6d2', '#7e57c2', '#9f7aea',
            '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
          ],
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Open Sans',
                size: 12
              },
              usePointStyle: true,
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Expenses by Category',
            font: {
              family: 'Montserrat',
              size: 16,
              weight: '600'
            },
            padding: 20
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || 'Unknown';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: 'rgba(236, 72, 153, 0.3)',
            borderWidth: 1
          }
        },
        cutout: '60%',
        // ✨ UPDATED ANIMATION SETTINGS - NO MORE MOVEMENT!
        animation: {
          duration: 0,           // No initial animation
          animateRotate: false,  // No rotation animation
          animateScale: false    // No scaling animation
        },
        hover: {
          animationDuration: 0   // No hover animations
        },
        responsiveAnimationDuration: 0  // No resize animations
      }
    });

    console.log("✅ Category chart loaded successfully");
  } catch (err) {
    console.error('❌ Error loading category chart:', err);
  }
}

// Initialize dashboard with proper sequencing
async function initializeDashboard() {
  console.log('🚀 Initializing LozFin Dashboard...');

  try {
    await Promise.all([
      loadTransactions(),
      loadBudgets(),
      loadCategoryChart()
    ]);

    console.log('✅ Dashboard initialization complete');
  } catch (error) {
    console.error('❌ Dashboard initialization failed:', error);
  }
}

// Start the dashboard
initializeDashboard();

