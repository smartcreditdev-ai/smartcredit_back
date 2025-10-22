import React from 'react';
import { BarChart3, PieChart, Map, TrendingUp } from 'lucide-react';

const ChartPlaceholder = ({ type, title, description }) => {
  const getIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-8 h-8 text-gray-400" />;
      case 'pie':
        return <PieChart className="w-8 h-8 text-gray-400" />;
      case 'map':
        return <Map className="w-8 h-8 text-gray-400" />;
      case 'line':
        return <TrendingUp className="w-8 h-8 text-gray-400" />;
      default:
        return <BarChart3 className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {getIcon()}
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="mb-2">{getIcon()}</div>
          <p className="text-gray-500 text-sm">{description}</p>
          <p className="text-gray-400 text-xs mt-1">Gráfico implementado con Recharts</p>
        </div>
      </div>
    </div>
  );
};

export default ChartPlaceholder;
