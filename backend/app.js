// backend/app.js

const express = require('express');
const cors = require('cors');
require('./models/db');

const accountsRoutes = require('./routes/accountsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/accounts', accountsRoutes);
app.use('/transactions', transactionsRoutes);

app.get('/', (req, res) => {
  res.send('💰 CoinProgram API is running.');
});

module.exports = app;
