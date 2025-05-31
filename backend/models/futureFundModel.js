const db = require('./db');

const FutureFund = {
  getAll: (callback) => {
    db.all('SELECT * FROM future_fund', [], callback);
  },

  create: (data, callback) => {
    const goal_name = data.goal || data.goal_name;
    const target_amount = Number(data.target || data.target_amount);
    const saved_amount = Number(data.saved || data.saved_amount || 0);

    db.run(
      `INSERT INTO future_fund (goal_name, target_amount, saved_amount)
       VALUES (?, ?, ?)`,
      [goal_name, target_amount, saved_amount],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },


  update: (id, data, callback) => {
    const { goal_name, target_amount, saved_amount } = data;
    db.run(
      `UPDATE future_fund
       SET goal_name = ?, target_amount = ?, saved_amount = ?
       WHERE id = ?`,
      [goal_name, target_amount, saved_amount, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM future_fund WHERE id = ?', [id], callback);
  }
};

module.exports = FutureFund;
