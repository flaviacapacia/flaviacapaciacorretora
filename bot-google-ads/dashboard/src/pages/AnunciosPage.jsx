import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { adsAPI } from '../services/api';

const AnunciosPage = () => {
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarAnuncios();
  }, []);

  const carregarAnuncios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adsAPI.listar();
      setAnuncios(response.data.anuncios || []);
    } catch (err) {
      console.error('Erro ao carregar anúncios:', err);
      setError('Erro ao carregar anúncios');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho' },
      ready_to_publish: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pronto' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Publicado' },
      paused: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pausado' }
    };

    const badge = badges[status] || badges.draft;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <Loading message="Carregando anúncios..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={carregarAnuncios}
            className="mt-2 text-red-600 hover:text-red-800 font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Anúncios Criados</h1>
          <p className="mt-2 text-gray-600">
            Gerencie seus anúncios do Google Ads
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          + Criar Novo Anúncio
        </button>
      </div>

      {anuncios.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum anúncio criado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando seu primeiro anúncio com IA
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Criar Primeiro Anúncio
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {anuncios.map((anuncio) => (
                <tr key={anuncio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {anuncio.imagem_principal && (
                        <img
                          src={anuncio.imagem_principal}
                          alt={anuncio.imovel_titulo}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {anuncio.imovel_titulo}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {anuncio.imovel_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {anuncio.campaign_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(anuncio.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {anuncio.budget?.toLocaleString('pt-BR') || '0,00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(anuncio.criado_em).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/anuncio/${anuncio.id}`)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnunciosPage;
