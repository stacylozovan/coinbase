// backend/routes/transactionsRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

// 👇 This is the route your frontend is calling
router.get('/', controller.getAll);

// Optional extras for later
router.post('/', controller.create);
router.get('/account/:id', controller.getByAccount);

module.exports = router;
