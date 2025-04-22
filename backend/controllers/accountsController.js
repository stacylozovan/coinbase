const Account = require('../models/accountModel');

exports.getAll = (req, res) => {
  Account.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  Account.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Account created', id: result.id });
  });
};

// Add update and delete as needed
