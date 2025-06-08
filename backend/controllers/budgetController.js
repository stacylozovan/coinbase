const Budget = require('../models/budgetModel');

exports.getAll = (req, res) => {
  Budget.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { category, amount } = req.body;
  Budget.create({ category, amount }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Budget category created', id: result.id });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { category, amount } = req.body;

  Budget.update(id, { category, amount }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Budget updated', id });
  });
};


exports.delete = (req, res) => {
  const id = req.params.id;
  Budget.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Budget deleted', id });
  });
};
