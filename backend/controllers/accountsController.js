const Account = require('../models/accountModel');

/**
 * Get all accounts from the database.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
exports.getAll = (req, res) => {
  Account.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/**
 * Create a new account.
 * @param {Request} req - The HTTP request object containing account data.
 * @param {Response} res - The HTTP response object.
 */
exports.create = (req, res) => {
  Account.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Account created', id: result.id });
  });
};

/**
 * Update an existing account.
 * @param {Request} req - The HTTP request object containing updated account data.
 * @param {Response} res - The HTTP response object.
 */
exports.update = (req, res) => {
  const { id } = req.params;
  Account.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Account with ID ${id} updated` });
  });
};

/**
 * Delete an account by ID.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
exports.delete = (req, res) => {
  const { id } = req.params;
  Account.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Account with ID ${id} deleted` });
  });
};
