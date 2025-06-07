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
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Expenses by Category'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
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

document.addEventListener('DOMContentLoaded', loadCategoryChart);
