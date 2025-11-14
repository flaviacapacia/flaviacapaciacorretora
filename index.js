const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração da conexão
const config = {
  user: 'seuUsuario',
  password: 'suaSenha',
  server: 'localhost',
  database: 'SeuBanco',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Rota para listar imóveis
app.get('/imoveis', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT TOP 10 * FROM dbo.Imoveis');
    res.render('lista', { imoveis: result.recordset });
  } catch (err) {
    res.send('Erro: ' + err.message);
  }
});

app.listen(5000, () => {
  console.log('Servidor rodando em http://localhost:5000');
});
