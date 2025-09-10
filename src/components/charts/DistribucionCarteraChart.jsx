import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DistribucionCarteraChart = ({ data = [] }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    { name: 'Personal', value: 45, amount: 1250000, color: '#3b82f6' },
    { name: 'Automotriz', value: 25, amount: 890000, color: '#10b981' },
    { name: 'Hipotecario', value: 20, amount: 2100000, color: '#f59e0b' },
    { name: 'Comercial', value: 10, amount: 450000, color: '#ef4444' }
  ];

  // Transformar datos de Supabase al formato esperado por el gráfico
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return defaultData;
    
    const totalMonto = data.reduce((sum, item) => sum + (item.monto || 0), 0);
    
    // Si no hay datos reales o el total es 0, usar datos por defecto
    if (totalMonto === 0) return defaultData;
    
    return data.map((item, index) => ({
      name: item.producto || `Producto ${index + 1}`,
      value: Math.round((item.monto / totalMonto) * 100),
      amount: item.monto || 0,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'][index % 6]
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            <span className="font-medium">Porcentaje:</span> {data.value}%
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Monto:</span> ${data.amount.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => value > 0 ? `${name}: ${value}%` : ''}
            outerRadius={80}
            innerRadius={25}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistribucionCarteraChart;
