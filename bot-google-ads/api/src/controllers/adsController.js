const axios = require('axios');
const { getConnection, sql } = require('../config/database');

const BOT_URL = process.env.BOT_URL || 'http://localhost:8000';

// Gera anúncios com IA
async function gerarAnuncios(req, res) {
  try {
    const { imovel_id, campaign_type = 'search', budget } = req.body;

    if (!imovel_id) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID do imóvel é obrigatório'
      });
    }

    // Busca dados do imóvel
    const pool = await getConnection();
    const imovelResult = await pool.request()
      .input('id', imovel_id)
      .query('SELECT * FROM Imoveis WHERE id = @id');

    if (imovelResult.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Imóvel não encontrado'
      });
    }

    const imovel = imovelResult.recordset[0];

    // Chama o bot para gerar anúncios
    const response = await axios.post(`${BOT_URL}/ads/generate`, {
      imovel,
      campaign_type,
      budget
    }, {
      timeout: 60000 // 60 segundos para IA processar
    });

    // Salva os anúncios gerados no banco
    const ads = response.data.ads;
    const insertResult = await pool.request()
      .input('imovel_id', sql.Int, imovel_id)
      .input('campaign_type', sql.VarChar, campaign_type)
      .input('headlines', sql.NVarChar, JSON.stringify(ads.headlines))
      .input('descriptions', sql.NVarChar, JSON.stringify(ads.descriptions))
      .input('keywords', sql.NVarChar, JSON.stringify(ads.keywords))
      .input('audience', sql.NVarChar, JSON.stringify(ads.audience))
      .input('budget', sql.Decimal(10, 2), budget || 0)
      .input('status', sql.VarChar, 'draft')
      .query(`
        INSERT INTO Ads (
          imovel_id, campaign_type, headlines, descriptions, 
          keywords, audience, budget, status, criado_em
        )
        VALUES (
          @imovel_id, @campaign_type, @headlines, @descriptions,
          @keywords, @audience, @budget, @status, GETDATE()
        );
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const adId = insertResult.recordset[0].id;

    res.json({
      sucesso: true,
      mensagem: 'Anúncios gerados com sucesso',
      ad_id: adId,
      anuncios: ads
    });
  } catch (err) {
    console.error('Erro ao gerar anúncios:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao gerar anúncios',
      erro: err.response?.data?.detail || err.message
    });
  }
}

// Preview de anúncio
async function previewAnuncio(req, res) {
  try {
    const { ad_id } = req.body;

    if (!ad_id) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID do anúncio é obrigatório'
      });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('id', ad_id)
      .query(`
        SELECT 
          a.*,
          i.titulo as imovel_titulo,
          i.imagem_principal
        FROM Ads a
        JOIN Imoveis i ON a.imovel_id = i.id
        WHERE a.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Anúncio não encontrado'
      });
    }

    const ad = result.recordset[0];

    res.json({
      sucesso: true,
      preview: {
        id: ad.id,
        imovel: {
          id: ad.imovel_id,
          titulo: ad.imovel_titulo,
          imagem: ad.imagem_principal
        },
        headlines: JSON.parse(ad.headlines),
        descriptions: JSON.parse(ad.descriptions),
        keywords: JSON.parse(ad.keywords),
        audience: JSON.parse(ad.audience),
        budget: ad.budget,
        status: ad.status,
        criado_em: ad.criado_em
      }
    });
  } catch (err) {
    console.error('Erro ao buscar preview:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar preview',
      erro: err.message
    });
  }
}

// Publica anúncio no Google Ads
async function publicarAnuncio(req, res) {
  try {
    const { ad_id } = req.body;

    if (!ad_id) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID do anúncio é obrigatório'
      });
    }

    // Busca dados do anúncio
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', ad_id)
      .query('SELECT * FROM Ads WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Anúncio não encontrado'
      });
    }

    const ad = result.recordset[0];

    // Chama o bot para publicar no Google Ads
    try {
      const response = await axios.post(`${BOT_URL}/ads/publish`, {
        ad_id: ad.id,
        headlines: JSON.parse(ad.headlines),
        descriptions: JSON.parse(ad.descriptions),
        keywords: JSON.parse(ad.keywords),
        budget: ad.budget
      }, {
        timeout: 30000
      });

      // Atualiza status no banco
      await pool.request()
        .input('id', ad_id)
        .input('google_ads_id', response.data.google_ads_id || null)
        .query(`
          UPDATE Ads 
          SET status = 'published', 
              google_ads_id = @google_ads_id,
              publicado_em = GETDATE()
          WHERE id = @id
        `);

      res.json({
        sucesso: true,
        mensagem: 'Anúncio publicado com sucesso',
        google_ads_id: response.data.google_ads_id
      });
    } catch (publishErr) {
      // Se não tem credenciais do Google Ads, mantém como draft
      if (publishErr.response?.status === 501) {
        await pool.request()
          .input('id', ad_id)
          .query(`
            UPDATE Ads 
            SET status = 'ready_to_publish'
            WHERE id = @id
          `);

        res.json({
          sucesso: true,
          mensagem: 'Anúncio pronto para publicação (aguardando credenciais Google Ads)',
          preview_mode: true
        });
      } else {
        throw publishErr;
      }
    }
  } catch (err) {
    console.error('Erro ao publicar anúncio:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao publicar anúncio',
      erro: err.response?.data?.detail || err.message
    });
  }
}

// Lista todos os anúncios
async function listarAnuncios(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          a.id,
          a.imovel_id,
          i.titulo as imovel_titulo,
          i.imagem_principal,
          a.campaign_type,
          a.budget,
          a.status,
          a.google_ads_id,
          a.criado_em,
          a.publicado_em
        FROM Ads a
        JOIN Imoveis i ON a.imovel_id = i.id
        ORDER BY a.criado_em DESC
      `);

    res.json({
      sucesso: true,
      total: result.recordset.length,
      anuncios: result.recordset
    });
  } catch (err) {
    console.error('Erro ao listar anúncios:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar anúncios',
      erro: err.message
    });
  }
}

// Busca detalhes de um anúncio
async function buscarAnuncio(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT 
          a.*,
          i.titulo as imovel_titulo,
          i.tipo as imovel_tipo,
          i.bairro,
          i.cidade,
          i.imagem_principal
        FROM Ads a
        JOIN Imoveis i ON a.imovel_id = i.id
        WHERE a.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Anúncio não encontrado'
      });
    }

    const ad = result.recordset[0];

    res.json({
      sucesso: true,
      anuncio: {
        ...ad,
        headlines: JSON.parse(ad.headlines),
        descriptions: JSON.parse(ad.descriptions),
        keywords: JSON.parse(ad.keywords),
        audience: JSON.parse(ad.audience)
      }
    });
  } catch (err) {
    console.error('Erro ao buscar anúncio:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar anúncio',
      erro: err.message
    });
  }
}

// Busca performance de um anúncio
async function buscarPerformance(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input('ad_id', id)
      .query(`
        SELECT 
          ad_id,
          data,
          impressoes,
          cliques,
          ctr,
          custo,
          conversoes,
          custo_por_conversao
        FROM AdPerformance
        WHERE ad_id = @ad_id
        ORDER BY data DESC
      `);

    res.json({
      sucesso: true,
      performance: result.recordset
    });
  } catch (err) {
    console.error('Erro ao buscar performance:', err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar performance',
      erro: err.message
    });
  }
}

module.exports = {
  gerarAnuncios,
  previewAnuncio,
  publicarAnuncio,
  listarAnuncios,
  buscarAnuncio,
  buscarPerformance
};
