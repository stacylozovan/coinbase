const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.get('/', controller.getAll);
router.post('/', controller.create);

router.get('/account/:id', controller.getByAccount);
router.get('/:id', controller.getById);

router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/expenses/chart', controller.getExpensesByCategory);

module.exports = router;
