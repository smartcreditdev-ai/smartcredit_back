import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PortfolioTrendChart = () => {
  const data = [
    { month: 'Ene', cartera: 2100000, mora: 85000, recuperado: 120000 },
    { month: 'Feb', cartera: 2200000, mora: 92000, recuperado: 135000 },
    { month: 'Mar', cartera: 2350000, mora: 78000, recuperado: 150000 },
    { month: 'Abr', cartera: 2400000, mora: 85000, recuperado: 165000 },
    { month: 'May', cartera: 2450000, mora: 72000, recuperado: 180000 },
    { month: 'Jun', cartera: 2500000, mora: 68000, recuperado: 195000 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Tendencia de Cartera</h3>
        <div className="text-sm text-gray-500">
          Últimos 6 meses
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorCartera" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMora" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cartera"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorCartera)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="mora"
              stroke="#EF4444"
              fillOpacity={1}
              fill="url(#colorMora)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            ${data[data.length - 1].cartera.toLocaleString()}
          </div>
          <div className="text-sm text-blue-800">Cartera Actual</div>
          <div className="text-xs text-green-600 mt-1">
            +{((data[data.length - 1].cartera - data[0].cartera) / data[0].cartera * 100).toFixed(1)}% vs inicio
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            ${data[data.length - 1].mora.toLocaleString()}
          </div>
          <div className="text-sm text-red-800">Mora Actual</div>
          <div className="text-xs text-green-600 mt-1">
            -{((data[0].mora - data[data.length - 1].mora) / data[0].mora * 100).toFixed(1)}% vs inicio
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${data[data.length - 1].recuperado.toLocaleString()}
          </div>
          <div className="text-sm text-green-800">Recuperado Este Mes</div>
          <div className="text-xs text-green-600 mt-1">
            +{((data[data.length - 1].recuperado - data[0].recuperado) / data[0].recuperado * 100).toFixed(1)}% vs inicio
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTrendChart;
