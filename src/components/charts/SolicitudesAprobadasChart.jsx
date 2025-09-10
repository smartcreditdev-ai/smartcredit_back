import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SolicitudesAprobadasChart = ({ data = [] }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    { mes: 'Ene', aprobadas: 0, rechazadas: 0 },
    { mes: 'Feb', aprobadas: 0, rechazadas: 0 },
    { mes: 'Mar', aprobadas: 0, rechazadas: 0 },
    { mes: 'Abr', aprobadas: 0, rechazadas: 0 },
    { mes: 'May', aprobadas: 0, rechazadas: 0 },
    { mes: 'Jun', aprobadas: 0, rechazadas: 0 }
  ];

  // Transformar datos de Supabase al formato esperado por el gráfico
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return defaultData;
    
    // Agrupar por tipo de solicitud
    const aprobadas = data.find(item => item.tipo === 'Aprobadas')?.cantidad || 0;
    const rechazadas = data.find(item => item.tipo === 'Rechazadas')?.cantidad || 0;
    const pendientes = data.find(item => item.tipo === 'Pendientes')?.cantidad || 0;
    
    // Crear datos para el último mes (simulado)
    const mesActual = new Date().toLocaleDateString('es-ES', { month: 'short' });
    
    return [
      { mes: mesActual, aprobadas, rechazadas, pendientes }
    ];
  }, [data]);

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
