import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MoraSegmentationChart = ({ data = [] }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    {
      name: '0-30 días',
      cantidad: 0,
      monto: 0,
      color: '#10B981'
    },
    {
      name: '31-60 días',
      cantidad: 0,
      monto: 0,
      color: '#F59E0B'
    },
    {
      name: '61-90 días',
      cantidad: 0,
      monto: 0,
      color: '#EF4444'
    },
    {
      name: '91+ días',
      cantidad: 0,
      monto: 0,
      color: '#DC2626'
    }
  ];

  // Transformar datos de cobranzas al formato esperado por el gráfico
  const transformData = (cobranzasData) => {
    if (!cobranzasData || cobranzasData.length === 0) {
      return defaultData;
    }

    const rangos = {
      '0-30 días': { cantidad: 0, monto: 0, color: '#10B981' },
      '31-60 días': { cantidad: 0, monto: 0, color: '#F59E0B' },
      '61-90 días': { cantidad: 0, monto: 0, color: '#EF4444' },
      '91+ días': { cantidad: 0, monto: 0, color: '#DC2626' }
    };

    cobranzasData.forEach(cliente => {
      const diasMora = parseInt(cliente.diasMora) || 0;
      const monto = parseFloat(cliente.monto) || 0;

      if (diasMora <= 30) {
        rangos['0-30 días'].cantidad++;
        rangos['0-30 días'].monto += monto;
      } else if (diasMora <= 60) {
        rangos['31-60 días'].cantidad++;
        rangos['31-60 días'].monto += monto;
      } else if (diasMora <= 90) {
        rangos['61-90 días'].cantidad++;
        rangos['61-90 días'].monto += monto;
      } else {
        rangos['91+ días'].cantidad++;
        rangos['91+ días'].monto += monto;
      }
    });

    return Object.entries(rangos).map(([name, data]) => ({
      name,
      cantidad: data.cantidad,
      monto: data.monto,
      color: data.color
    }));
  };

  const chartData = transformData(data);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const clientes = parseInt(payload[0]?.value) || 0;
      const monto = parseFloat(payload[1]?.value) || 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Clientes:</span> {clientes}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Monto:</span> ${monto.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Segmentación de Mora por Días</h3>
        <div className="text-sm text-gray-500">
          Total: {chartData.reduce((sum, item) => sum + (parseInt(item.cantidad) || 0), 0)} clientes
        </div>
      </div>
      
      <div className="h-80">
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
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">{item.name}</div>
              <div className="text-gray-600">{parseInt(item.cantidad) || 0} clientes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoraSegmentationChart;
