import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MapaClientesChart = ({ data = [] }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    { region: 'Centro', clientes: 0, cartera: 0, crecimiento: 0 },
    { region: 'Norte', clientes: 0, cartera: 0, crecimiento: 0 },
    { region: 'Sur', clientes: 0, cartera: 0, crecimiento: 0 },
    { region: 'Este', clientes: 0, cartera: 0, crecimiento: 0 },
    { region: 'Oeste', clientes: 0, cartera: 0, crecimiento: 0 }
  ];

  // Transformar datos de Supabase al formato esperado por el gráfico
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return defaultData;
    
    return data.map(item => ({
      region: item.region || 'Sin región',
      clientes: item.cantidad || 0,
      cartera: item.cantidad * 1000, // Estimado basado en cantidad de clientes
      crecimiento: Math.random() * 20 // Estimado por ahora
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Clientes:</span> {(payload[0]?.value || 0).toLocaleString()}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Cartera:</span> ${(payload[1]?.value || 0).toLocaleString()}
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Crecimiento:</span> {payload[2]?.value || 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="region" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="clientes"
            fill="#3b82f6"
            fillOpacity={0.3}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cartera"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MapaClientesChart;
