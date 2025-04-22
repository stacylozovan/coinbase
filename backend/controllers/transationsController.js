const db = require('../models/db');

exports.getAll = (req, res) => {
  const { account_id, category } = req.query;
  let query = "SELECT * FROM transactions";
  let conditions = [];
  let values = [];

  if (account_id) {
    conditions.push("account_id = ?");
    values.push(account_id);
  }
  if (category) {
    conditions.push("category = ?");
    values.push(category);
  }

  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }

  db.all(query, values, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
