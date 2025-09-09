import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleString('es-ES')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
