const db = require('./db');

const FutureFund = {
  // Get all goals
  getAll: (callback) => {
    db.all('SELECT * FROM future_fund', [], callback);
  },

  // Create a new goal
  create: (data, callback) => {
    const { goal_name, target_amount, saved_amount } = data;
    db.run(
      `INSERT INTO future_fund (goal_name, target_amount, saved_amount)
       VALUES (?, ?, ?)`,
      [goal_name, target_amount, saved_amount || 0],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  // Update an existing goal
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

  // Delete a goal
  delete: (id, callback) => {
    db.run('DELETE FROM future_fund WHERE id = ?', [id], callback);
  }
};

module.exports = FutureFund;
