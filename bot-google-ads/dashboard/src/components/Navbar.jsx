import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                Flávia Capacia
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
              >
                Imóveis
              </Link>
              <Link
                to="/anuncios"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive('/anuncios')}`}
              >
                Anúncios
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Google Ads Dashboard</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
