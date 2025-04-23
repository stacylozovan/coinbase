const Transaction = require('../models/transactionModel');

exports.getAll = (req, res) => {
  Transaction.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  Transaction.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Transaction added', id: result.id });
  });
};

exports.getByAccount = (req, res) => {
  const id = req.params.id;
  Transaction.getByAccountId(id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
