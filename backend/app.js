// backend/app.js

const express = require('express');
const cors = require('cors');
require('./models/db');

const accountsRoutes = require('./routes/accountsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/accounts', accountsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/budgets', budgetRoutes);




app.get('/', (req, res) => {
  res.send('💰 CoinProgram API is running.');
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error caught by global handler:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

module.exports = app;
