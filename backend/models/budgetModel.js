
const db = require('./db');

const Budget = {
  getAll: (callback) => {
    db.all('SELECT * FROM budgets', [], callback);
  },

  create: (data, callback) => {
    const { category, amount } = data;
    db.run(
      'INSERT INTO budgets (category, amount) VALUES (?, ?)',
      [category, amount],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  update: (id, data, callback) => {
    const { category, amount } = data;
    db.run(
      'UPDATE budgets SET category = ?, amount = ? WHERE id = ?',
      [category, amount, id],
      callback
    );
  },


  delete: (id, callback) => {
    db.run('DELETE FROM budgets WHERE id = ?', [id], callback);
  }
};

module.exports = Budget;
