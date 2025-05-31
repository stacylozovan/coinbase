const FutureFund = require('../models/futureFundModel');

// GET all future fund goals
exports.getAll = (req, res) => {
  FutureFund.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// POST a new goal
exports.create = (req, res) => {
  FutureFund.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Goal created', id: result.id });
  });
};

// PUT to update a goal
exports.update = (req, res) => {
  const id = req.params.id;
  FutureFund.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Goal updated', id });
  });
};


exports.delete = (req, res) => {
  const id = req.params.id;
  FutureFund.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Goal deleted', id });
  });
};
