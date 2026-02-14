const axios = require('axios');
const { getConnection } = require('../config/database');

const BOT_URL = process.env.BOT_URL || 'http://localhost:8000';

// Lista posts do blog (via scraping no bot)
async function listarPosts(req, res) {
  try {
    const response = await axios.get(`${BOT_URL}/blog/scrape`, {
      timeout: 30000
    });
    
    res.json({
      sucesso: true,
      total: response.data.posts?.length || 0,
      posts: response.data.posts || []
    });
  } catch (err) {
    console.error('Erro ao buscar posts do blog:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar posts do blog',
      erro: err.message
    });
  }
}

// Busca tendências do blog
async function buscarTendencias(req, res) {
  try {
    const response = await axios.get(`${BOT_URL}/blog/trends`, {
      timeout: 30000
    });
    
    res.json({
      sucesso: true,
      tendencias: response.data.trends || []
    });
  } catch (err) {
    console.error('Erro ao buscar tendências:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar tendências',
      erro: err.message
    });
  }
}

module.exports = {
  listarPosts,
  buscarTendencias
};
