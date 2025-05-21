// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetController');

// GET all budgets
router.get('/', controller.getAll);

// POST new budget
router.post('/', controller.create);

// PUT update budget by ID
router.put('/:id', controller.update);

// DELETE budget by ID
router.delete('/:id', controller.delete);

module.exports = router;
