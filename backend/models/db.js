// backend/models/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const db = new sqlite3.Database(path.join(__dirname, '..', 'finance.db'), (err) => {
  if (err) {
    return console.error('❌ Failed to connect to database:', err.message);
  }
  console.log('✅ Connected to the SQLite database.');
});

// Create Accounts table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          name TEXT NOT NULL,
                                          balance REAL DEFAULT 0
    )
  `);

  // Create Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              account_id INTEGER NOT NULL,
                                              amount REAL NOT NULL,
                                              category TEXT,
                                              description TEXT,
                                              date TEXT DEFAULT CURRENT_DATE,
                                              FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
  `);
});

module.exports = db;
