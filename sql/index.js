const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'new123',
  server: '192.168.5.17',
  port: '1433',
  database: 'rsdbu',
  requestTimeout: 15000,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
  pool: {
    min: 0,
    idleTimeoutMillis: 3000,
  },
};

module.exports = () => new sql.ConnectionPool(config);
