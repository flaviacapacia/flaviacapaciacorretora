const { getConnection } = require('../config/database');

// Lista todos os imóveis
async function listarImoveis(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          id,
          titulo,
          tipo,
          preco,
          localizacao,
          bairro,
          cidade,
          quartos,
          banheiros,
          area,
          vagas,
          descricao,
          status,
          imagem_principal,
          criado_em,
          atualizado_em
        FROM Imoveis
        WHERE status = 'ativo'
        ORDER BY criado_em DESC
      `);
    
    res.json({
      sucesso: true,
      total: result.recordset.length,
      imoveis: result.recordset
    });
  } catch (err) {
    console.error('Erro ao listar imóveis:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar imóveis',
      erro: err.message
    });
  }
}

// Busca detalhes de um imóvel específico
async function buscarImovel(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT 
          id,
          titulo,
          tipo,
          preco,
          localizacao,
          bairro,
          cidade,
          estado,
          cep,
          quartos,
          banheiros,
          suites,
          area,
          area_construida,
          vagas,
          descricao,
          caracteristicas,
          diferenciais,
          condominio,
          iptu,
          status,
          imagem_principal,
          imagens,
          video_url,
          tour_virtual_url,
          criado_em,
          atualizado_em
        FROM Imoveis
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Imóvel não encontrado'
      });
    }
    
    res.json({
      sucesso: true,
      imovel: result.recordset[0]
    });
  } catch (err) {
    console.error('Erro ao buscar imóvel:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar imóvel',
      erro: err.message
    });
  }
}

module.exports = {
  listarImoveis,
  buscarImovel
};
