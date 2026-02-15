import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImovelCard = ({ imovel }) => {
  const navigate = useNavigate();

  const formatPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {imovel.imagem_principal ? (
          <img
            src={imovel.imagem_principal}
            alt={imovel.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {imovel.tipo}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {imovel.titulo}
        </h3>

        <p className="text-gray-600 text-sm mb-3">
          📍 {imovel.bairro}, {imovel.cidade}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary-600">
            {formatPreco(imovel.preco)}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          {imovel.quartos && (
            <span className="flex items-center">
              🛏️ {imovel.quartos}
            </span>
          )}
          {imovel.banheiros && (
            <span className="flex items-center">
              🚿 {imovel.banheiros}
            </span>
          )}
          {imovel.area && (
            <span className="flex items-center">
              📐 {imovel.area}m²
            </span>
          )}
        </div>

        <button
          onClick={() => navigate(`/gerar-anuncio/${imovel.id}`)}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ✨ Criar Anúncio com IA
        </button>
      </div>
    </div>
  );
};

export default ImovelCard;
