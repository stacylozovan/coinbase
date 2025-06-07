const db = require('./db');

const Transaction = {
  getAll: (callback) => {
    db.all('SELECT * FROM transactions', [], callback);
  },

  getFiltered: (filters, callback) => {
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category LIKE ?';
      params.push(`%${filters.category}%`);
    }

    if (filters.min) {
      query += ' AND amount >= ?';
      params.push(Number(filters.min));
    }

    if (filters.max) {
      query += ' AND amount <= ?';
      params.push(Number(filters.max));
    }

    db.all(query, params, callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM transactions WHERE id = ?', [id], callback);
  },

  getByAccountId: (account_id, callback) => {
    db.all('SELECT * FROM transactions WHERE account_id = ?', [account_id], callback);
  },

  create: (data, callback) => {
    const { date, amount, category, description } = data;

    db.run(
      'INSERT INTO transactions (date, amount, category, description) VALUES (?, ?, ?, ?)',
      [date || new Date().toISOString().split('T')[0], amount, category, description],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM transactions WHERE id = ?', [id], callback);
  },

    update: (id, data, callback) => {
    const { amount, category, description, date } = data;
    db.run(
      `UPDATE transactions
       SET amount = ?, category = ?, description = ?, date = ?
       WHERE id = ?`,
      [amount, category, description, date, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  }
};

module.exports = Transaction;
