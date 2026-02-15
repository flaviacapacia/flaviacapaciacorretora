import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { imoveisAPI, adsAPI } from '../services/api';

const GerarAnuncioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [anuncios, setAnuncios] = useState(null);
  const [adId, setAdId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarImovel();
  }, [id]);

  const carregarImovel = async () => {
    try {
      setLoading(true);
      const response = await imoveisAPI.buscar(id);
      setImovel(response.data.imovel);
    } catch (err) {
      console.error('Erro ao carregar imóvel:', err);
      setError('Erro ao carregar imóvel');
    } finally {
      setLoading(false);
    }
  };

  const gerarAnuncios = async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await adsAPI.gerar({
        imovel_id: parseInt(id),
        campaign_type: 'search',
        budget: 500
      });

      setAnuncios(response.data.anuncios);
      setAdId(response.data.ad_id);
    } catch (err) {
      console.error('Erro ao gerar anúncios:', err);
      setError(err.response?.data?.mensagem || 'Erro ao gerar anúncios');
    } finally {
      setGenerating(false);
    }
  };

  const publicarAnuncio = async () => {
    if (!adId) return;

    try {
      setGenerating(true);
      await adsAPI.publicar(adId);
      alert('Anúncio publicado com sucesso!');
      navigate('/anuncios');
    } catch (err) {
      console.error('Erro ao publicar anúncio:', err);
      if (err.response?.status === 501) {
        alert('Anúncio salvo! Configure as credenciais do Google Ads para publicar.');
        navigate('/anuncios');
      } else {
        setError('Erro ao publicar anúncio');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando imóvel..." />;
  }

  if (error && !imovel) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-primary-600 hover:text-primary-800 flex items-center"
      >
        ← Voltar
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Gerar Anúncios com IA
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Dados do Imóvel</h2>
            <div className="space-y-2">
              <p><strong>Título:</strong> {imovel?.titulo}</p>
              <p><strong>Tipo:</strong> {imovel?.tipo}</p>
              <p><strong>Localização:</strong> {imovel?.bairro}, {imovel?.cidade}</p>
              <p><strong>Preço:</strong> R$ {imovel?.preco?.toLocaleString('pt-BR')}</p>
              {imovel?.quartos && <p><strong>Quartos:</strong> {imovel.quartos}</p>}
              {imovel?.area && <p><strong>Área:</strong> {imovel.area}m²</p>}
            </div>
          </div>

          {imovel?.imagem_principal && (
            <div>
              <img
                src={imovel.imagem_principal}
                alt={imovel.titulo}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {!anuncios && (
          <button
            onClick={gerarAnuncios}
            disabled={generating}
            className="mt-6 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {generating ? '🤖 Gerando anúncios com IA...' : '✨ Gerar Anúncios com IA'}
          </button>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {anuncios && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Anúncios Gerados ✨
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Headlines (Títulos)</h3>
              <div className="space-y-2">
                {anuncios.headlines?.map((headline, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                    <span className="text-blue-900 font-medium">{headline}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({headline.length} caracteres)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Descriptions (Descrições)</h3>
              <div className="space-y-2">
                {anuncios.descriptions?.map((desc, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
                    <span className="text-green-900">{desc}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({desc.length} caracteres)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Palavras-chave</h3>
              <div className="flex flex-wrap gap-2">
                {anuncios.keywords?.map((keyword, index) => (
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
                <p><strong>Faixa Etária:</strong> {anuncios.audience?.age_range}</p>
                <p><strong>Localização:</strong> {anuncios.audience?.location}</p>
                <p className="mt-2"><strong>Interesses:</strong></p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {anuncios.audience?.interests?.map((interest, index) => (
                    <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={publicarAnuncio}
                disabled={generating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg"
              >
                {generating ? 'Publicando...' : '📢 Publicar Anúncio'}
              </button>
              <button
                onClick={() => navigate('/anuncios')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
              >
                Ver Todos os Anúncios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerarAnuncioPage;
