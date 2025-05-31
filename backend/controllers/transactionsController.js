const Transaction = require('../models/transactionModel');

exports.getAll = (req, res) => {
  const { category, min, max } = req.query;

  Transaction.getFiltered({ category, min, max }, (err, rows) => {
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

// Delete a transaction by ID
exports.delete = (req, res) => {
  const id = req.params.id;
  Transaction.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Transaction deleted', id });
  });
};
// Get a transaction by ID (used by edit button)
exports.getById = (req, res) => {
  const id = req.params.id;
  Transaction.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Transaction not found' });
    res.json(row);
  });
};

// Update a transaction by ID
exports.update = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  Transaction.update(id, updatedData, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Transaction updated', id });
  });
};

