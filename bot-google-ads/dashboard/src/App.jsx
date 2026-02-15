import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImoveisPage from './pages/ImoveisPage';
import GerarAnuncioPage from './pages/GerarAnuncioPage';
import AnunciosPage from './pages/AnunciosPage';
import DetalheAnuncioPage from './pages/DetalheAnuncioPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<ImoveisPage />} />
          <Route path="/gerar-anuncio/:id" element={<GerarAnuncioPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/anuncio/:id" element={<DetalheAnuncioPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
