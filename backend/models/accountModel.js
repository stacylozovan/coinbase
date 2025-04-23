// backend/models/accountModel.js

const db = require('./db');

const Account = {
  getAll: (callback) => {
    db.all('SELECT * FROM accounts', [], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM accounts WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const { name, balance } = data;
    db.run(
      'INSERT INTO accounts (name, balance) VALUES (?, ?)',
      [name, balance || 0],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  update: (id, data, callback) => {
    const { name, balance } = data;
    db.run(
      'UPDATE accounts SET name = ?, balance = ? WHERE id = ?',
      [name, balance, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM accounts WHERE id = ?', [id], callback);
  }
};

module.exports = Account;
