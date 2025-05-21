const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');


router.get('/', controller.getAll);

router.post('/', controller.create);

router.get('/account/:id', controller.getByAccount);

router.delete('/:id', controller.delete);

module.exports = router;
