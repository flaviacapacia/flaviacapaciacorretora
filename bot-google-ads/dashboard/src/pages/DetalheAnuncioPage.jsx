import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { adsAPI } from '../services/api';

const DetalheAnuncioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anuncio, setAnuncio] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [anuncioRes, perfRes] = await Promise.all([
        adsAPI.buscar(id),
        adsAPI.performance(id).catch(() => ({ data: { performance: [] } }))
      ]);

      setAnuncio(anuncioRes.data.anuncio);
      setPerformance(perfRes.data.performance || []);
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      setError('Erro ao carregar detalhes do anúncio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando detalhes..." />;
  }

  if (error || !anuncio) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Anúncio não encontrado'}</p>
          <button
            onClick={() => navigate('/anuncios')}
            className="mt-2 text-red-600 hover:text-red-800 font-semibold"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/anuncios')}
        className="mb-6 text-primary-600 hover:text-primary-800 flex items-center"
      >
        ← Voltar
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{anuncio.imovel_titulo}</h1>
            <p className="text-gray-600 mt-1">
              {anuncio.bairro}, {anuncio.cidade}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            anuncio.status === 'published' ? 'bg-green-100 text-green-800' :
            anuncio.status === 'draft' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {anuncio.status === 'published' ? 'Publicado' :
             anuncio.status === 'draft' ? 'Rascunho' : 'Pronto'}
          </span>
        </div>

        {anuncio.imagem_principal && (
          <img
            src={anuncio.imagem_principal}
            alt={anuncio.imovel_titulo}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Informações</h3>
            <div className="space-y-2">
              <p><strong>Tipo de Campanha:</strong> {anuncio.campaign_type}</p>
              <p><strong>Budget:</strong> R$ {anuncio.budget?.toLocaleString('pt-BR') || '0,00'}</p>
              <p><strong>Criado em:</strong> {new Date(anuncio.criado_em).toLocaleDateString('pt-BR')}</p>
              {anuncio.publicado_em && (
                <p><strong>Publicado em:</strong> {new Date(anuncio.publicado_em).toLocaleDateString('pt-BR')}</p>
              )}
              {anuncio.google_ads_id && (
                <p><strong>Google Ads ID:</strong> {anuncio.google_ads_id}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Headlines</h3>
            <div className="space-y-2">
              {anuncio.headlines?.map((headline, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                  <span className="text-blue-900 font-medium">{headline}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Descriptions</h3>
            <div className="space-y-2">
              {anuncio.descriptions?.map((desc, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
                  <span className="text-green-900">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Palavras-chave</h3>
            <div className="flex flex-wrap gap-2">
              {anuncio.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Público-Alvo</h3>
            <div className="bg-gray-50 rounded p-4">
              <p><strong>Faixa Etária:</strong> {anuncio.audience?.age_range}</p>
              <p><strong>Localização:</strong> {anuncio.audience?.location}</p>
              {anuncio.audience?.income_level && (
                <p><strong>Renda:</strong> {anuncio.audience.income_level}</p>
              )}
              <p className="mt-2"><strong>Interesses:</strong></p>
              <div className="flex flex-wrap gap-2 mt-1">
                {anuncio.audience?.interests?.map((interest, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {performance.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressões</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliques</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversões</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performance.map((perf, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm">{new Date(perf.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-sm">{perf.impressoes}</td>
                    <td className="px-4 py-3 text-sm">{perf.cliques}</td>
                    <td className="px-4 py-3 text-sm">{perf.ctr}%</td>
                    <td className="px-4 py-3 text-sm">R$ {perf.custo?.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-sm">{perf.conversoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalheAnuncioPage;
