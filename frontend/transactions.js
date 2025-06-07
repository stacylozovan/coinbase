document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const container = document.getElementById('all-transactions');
  const filterForm = document.getElementById('filter-form');
  const filterToggle = document.getElementById('filterToggle');
  const filterPopup = document.getElementById('filterPopup');
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('edit-form');
  const cancelEdit = document.getElementById('cancelEdit');
  const clearFilterBtn = document.getElementById('clearFilter');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  async function loadTransactions(query = '') {
    try {
      const res = await fetch(`http://localhost:3000/transactions${query}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const transactions = await res.json();

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

      attachActionButtons();

    } catch (err) {
      container.innerHTML = '<li>Error loading transactions</li>';
      console.error('Fetch error:', err);
    }
  }

  function attachActionButtons() {
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this transaction?')) {
          try {
            const res = await fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            loadTransactions();
          } catch (err) {
            alert('Error deleting transaction');
            console.error(err);
          }
        }
      });
    });

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        try {
          const res = await fetch(`http://localhost:3000/transactions/${id}`);
          const tx = await res.json();
          if (!tx) return;

          editForm.setAttribute('data-id', tx.id);
          editForm.amount.value = tx.amount;
          editForm.category.value = tx.category;
          editForm.description.value = tx.description;
          editForm.date.value = tx.date;

          editModal.style.display = 'block';
        } catch (err) {
          console.error('Failed to load transaction for editing:', err);
        }
      });
    });
  }

  if (cancelEdit) {
    cancelEdit.addEventListener('click', () => {
      editModal.style.display = 'none';
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const data = Object.fromEntries(formData.entries());
      const id = editForm.getAttribute('data-id');

      try {
        const res = await fetch(`http://localhost:3000/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Update failed');

        editModal.style.display = 'none';
        loadTransactions();
      } catch (err) {
        alert('Error updating transaction');
        console.error(err);
      }
    });
  }

  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(filterForm);
      const query = new URLSearchParams(data).toString();
      if (filterPopup) filterPopup.style.display = 'none';
      loadTransactions('?' + query);
    });
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', () => {
      filterForm.reset();
      loadTransactions();
    });
  }

  if (filterToggle && filterPopup) {
    filterToggle.addEventListener('click', () => {
      const isOpen = filterPopup.style.display === 'block';
      filterPopup.style.display = isOpen ? 'none' : 'block';
    });
  }

  loadTransactions();
});
