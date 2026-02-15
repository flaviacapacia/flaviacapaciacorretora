import React, { useState, useEffect } from 'react';
import ImovelCard from '../components/ImovelCard';
import Loading from '../components/Loading';
import { imoveisAPI } from '../services/api';

const ImoveisPage = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarImoveis();
  }, []);

  const carregarImoveis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await imoveisAPI.listar();
      setImoveis(response.data.imoveis || []);
    } catch (err) {
      console.error('Erro ao carregar imóveis:', err);
      setError('Erro ao carregar imóveis. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando imóveis..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={carregarImoveis}
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Imóveis Cadastrados</h1>
        <p className="mt-2 text-gray-600">
          Selecione um imóvel para criar anúncios otimizados com IA
        </p>
      </div>

      {imoveis.length === 0 ? (
        <div className="text-center py-12">
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum imóvel cadastrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Cadastre imóveis no sistema para começar a criar anúncios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImoveisPage;
