const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

const container = document.getElementById('all-transactions');

fetch('http://localhost:3000/transactions')
  .then(res => {
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  })
  .then(transactions => {
    container.innerHTML = '';

    if (!transactions.length) {
      container.innerHTML = '<li>No transactions found.</li>';
      return;
    }

    transactions.forEach(tx => {
      const li = document.createElement('li');
      li.style.padding = '0.75rem 1rem';
      li.style.borderBottom = '1px solid #ddd';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';

      li.innerHTML = `
    <span><strong>${tx.category}</strong> - ${tx.description || ''}</span>
    <span style="display: flex; align-items: center; gap: 1rem;">
      <span style="color: ${tx.amount < 0 ? 'var(--danger)' : 'var(--success)'};">
        ${tx.amount} €
      </span>
      <button class="header-button" style="padding: 0.25rem 0.5rem;" data-id="${tx.id}">🗑️</button>
    </span>
  `;
      container.appendChild(li);
    });

    setTimeout(() => {
      container.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this transaction?')) {
            fetch(`http://localhost:3000/transactions/${id}`, {
              method: 'DELETE'
            })
              .then(res => {
                if (!res.ok) throw new Error('Delete failed');
                btn.closest('li').remove(); // Remove the item from UI
              })
              .catch(err => {
                alert('Error deleting transaction');
                console.error(err);
              });
          }
        });
      });
    }, 0);
  })
  .catch(err => {
    container.innerHTML = '<li>Error loading transactions</li>';
    console.error('Fetch error:', err);
  });
