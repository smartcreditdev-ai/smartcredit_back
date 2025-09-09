import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SolicitudesAprobadasChart = () => {
  const data = [
    { mes: 'Ene', aprobadas: 45, rechazadas: 12 },
    { mes: 'Feb', aprobadas: 52, rechazadas: 8 },
    { mes: 'Mar', aprobadas: 38, rechazadas: 15 },
    { mes: 'Abr', aprobadas: 61, rechazadas: 9 },
    { mes: 'May', aprobadas: 47, rechazadas: 11 },
    { mes: 'Jun', aprobadas: 55, rechazadas: 7 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const aprobadas = payload[0]?.value || 0;
      const rechazadas = payload[1]?.value || 0;
      const total = aprobadas + rechazadas;
      const tasaAprobacion = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-green-600">
            <span className="font-medium">Aprobadas:</span> {aprobadas}
          </p>
          <p className="text-red-600">
            <span className="font-medium">Rechazadas:</span> {rechazadas}
          </p>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">Tasa de Aprobación:</span> {tasaAprobacion}%
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
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="mes" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="aprobadas" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="Aprobadas"
          />
          <Bar 
            dataKey="rechazadas" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
            name="Rechazadas"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SolicitudesAprobadasChart;
