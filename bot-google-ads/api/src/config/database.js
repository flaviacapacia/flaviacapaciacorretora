const sql = require('mssql');

const config = {
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'flaviacapacia',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conectado ao SQL Server');
    }
    return pool;
  } catch (err) {
    console.error('❌ Erro ao conectar ao SQL Server:', err);
    throw err;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Conexão com SQL Server fechada');
    }
  } catch (err) {
    console.error('❌ Erro ao fechar conexão:', err);
  }
}

module.exports = {
  getConnection,
  closeConnection,
  sql
};
