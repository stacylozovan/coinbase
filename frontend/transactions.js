document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const container = document.getElementById('all-transactions');
  const filterForm = document.getElementById('filter-form');
  const filterToggle = document.getElementById('filterToggle');
  const filterPopup = document.getElementById('filterPopup');
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('edit-form');
  const cancelEdit = document.getElementById('cancelEdit');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  // 🔃 Load transactions (optional query)
  function loadTransactions(query = '') {
    fetch(`http://localhost:3000/transactions${query}`)
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
              <button class="header-button edit-btn" style="padding: 0.25rem 0.5rem;" data-id="${tx.id}">✏️</button>
              <button class="header-button delete-btn" style="padding: 0.25rem 0.5rem;" data-id="${tx.id}">🗑️</button>
            </span>
          `;
          container.appendChild(li);
        });

        // Add event listeners to the new buttons
        attachActionButtons();
      })
      .catch(err => {
        container.innerHTML = '<li>Error loading transactions</li>';
        console.error('Fetch error:', err);
      });
  }

  // 🧩 Attach listeners to delete & edit buttons
  function attachActionButtons() {
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this transaction?')) {
          fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' })
            .then(res => {
              if (!res.ok) throw new Error('Delete failed');
              loadTransactions();
            })
            .catch(err => {
              alert('Error deleting transaction');
              console.error(err);
            });
        }
      });
    });

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        fetch(`http://localhost:3000/transactions/${id}`)
          .then(res => res.json())
          .then(tx => {
            if (!tx) return;

            editForm.id.value = tx.id;
            editForm.account_id.value = tx.account_id;
            editForm.amount.value = tx.amount;
            editForm.category.value = tx.category;
            editForm.description.value = tx.description;
            editForm.date.value = tx.date;

            editModal.style.display = 'block';
          });
      });
    });
  }

  // 🧼 Cancel Edit
  if (cancelEdit) {
    cancelEdit.addEventListener('click', () => {
      editModal.style.display = 'none';
    });
  }

  // 💾 Submit Edit
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(editForm).entries());
      const id = data.id;

      fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => {
          if (!res.ok) throw new Error('Update failed');
          return res.json();
        })
        .then(() => {
          editModal.style.display = 'none';
          loadTransactions();
        })
        .catch(err => {
          alert('Error updating transaction');
          console.error(err);
        });
    });
  }

  // 🔍 Filter form
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(filterForm);
      const query = new URLSearchParams(data).toString();
      loadTransactions('?' + query);
    });
  }

  // 🎛️ Show/Hide Filter Popup
  if (filterToggle && filterPopup) {
    filterToggle.addEventListener('click', () => {
      const isOpen = filterPopup.style.display === 'block';
      filterPopup.style.display = isOpen ? 'none' : 'block';
    });
  }

  // 🟢 Initial load
  loadTransactions();
});
