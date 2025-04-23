// backend/models/transactionModel.js

const db = require('./db');

const Transaction = {
  getAll: (callback) => {
    db.all('SELECT * FROM transactions', [], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM transactions WHERE id = ?', [id], callback);
  },

  getByAccountId: (account_id, callback) => {
    db.all('SELECT * FROM transactions WHERE account_id = ?', [account_id], callback);
  },

  create: (data, callback) => {
    const { account_id, amount, category, description, date } = data;
    db.run(
      'INSERT INTO transactions (account_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)',
      [account_id, amount, category, description, date || new Date().toISOString().split('T')[0]],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM transactions WHERE id = ?', [id], callback);
  }
};

module.exports = Transaction;
