// frontend/script.js

const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');

if (transactionList) {
  fetch('http://localhost:3000/transactions')
    .then((res) => res.json())
    .then((transactions) => {
      transactionList.innerHTML = '';

      let total = 0;

      transactions.slice(-5).forEach(tx => {
        const li = document.createElement('li');
        li.textContent = `${tx.category} - ${tx.amount}€ on ${tx.date}`;
        transactionList.appendChild(li);
        total += tx.amount;
      });

      if (balanceDisplay) {
        balanceDisplay.textContent = `${total.toFixed(2)} €`;
      }
    })
    .catch((err) => {
      transactionList.innerHTML = '<li>Error loading transactions</li>';
      console.error(err);
    });
}
