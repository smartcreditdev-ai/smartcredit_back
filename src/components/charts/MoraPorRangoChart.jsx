import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoraPorRangoChart = ({ data = [] }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    { rango: '0-30 días', cantidad: 0, monto: 0 },
    { rango: '31-60 días', cantidad: 0, monto: 0 },
    { rango: '61-90 días', cantidad: 0, monto: 0 },
    { rango: '91+ días', cantidad: 0, monto: 0 }
  ];

  // Transformar datos de Supabase al formato esperado por el gráfico
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return defaultData;
    
    return data.map(item => ({
      rango: item.rango === '0-30' ? '0-30 días' :
             item.rango === '31-60' ? '31-60 días' :
             item.rango === '61-90' ? '61-90 días' :
             item.rango === '91+' ? '91+ días' : item.rango,
      cantidad: item.cantidad || 0,
      monto: item.monto || 0
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Clientes:</span> {payload[0]?.value || 0}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Monto:</span> ${(payload[1]?.value || 0).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            dataKey="rango" 
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
          <Bar 
            yAxisId="left"
            dataKey="cantidad" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="Clientes"
          />
          <Bar 
            yAxisId="right"
            dataKey="monto" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="Monto"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoraPorRangoChart;
