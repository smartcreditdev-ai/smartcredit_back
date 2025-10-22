import React from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  CreditCard,
  RefreshCw
} from 'lucide-react';

const CreditStatsOverview = ({ 
  stats = {
    totalClientes: 0,
    carteraTotal: 0,
    creditosActivos: 0,
    solicitudesPendientes: 0,
    enMora: 0,
    aprobadosEsteMes: 0,
    prospectos: 0,
    renovacionesPendientes: 0,
    tasaAprobacion: 0,
    tiempoPromedioAprobacion: 0,
    tasaMora: 0
  }
}) => {
  const statsCards = [
    {
      title: 'Total Clientes',
      value: stats.totalClientes.toLocaleString(),
      change: 'Real',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Cartera Total',
      value: `$${stats.carteraTotal.toLocaleString()}`,
      change: 'Real',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Créditos Activos',
      value: stats.creditosActivos.toLocaleString(),
      change: 'Real',
      icon: CreditCard,
      color: 'purple',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Solicitudes Pendientes',
      value: stats.solicitudesPendientes.toLocaleString(),
      change: 'Real',
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'En Mora',
      value: stats.enMora.toLocaleString(),
      change: 'Real',
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Aprobados Este Mes',
      value: stats.aprobadosEsteMes.toLocaleString(),
      change: 'Real',
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Prospectos',
      value: stats.prospectos.toLocaleString(),
      change: 'Real',
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Renovaciones Pendientes',
      value: stats.renovacionesPendientes.toLocaleString(),
      change: 'Real',
      icon: RefreshCw,
      color: 'orange',
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Resumen General de Créditos</h2>
          <p className="text-sm text-gray-600 mt-1">Estadísticas consolidadas del sistema</p>
        </div>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs font-medium text-gray-600">{stat.title}</div>
              <div className={`text-xs font-medium ${
                stat.change.startsWith('+') 
                  ? stat.textColor 
                  : stat.change.startsWith('-') 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {stat.change} vs mes anterior
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores de Rendimiento */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.tasaAprobacion}%</div>
            <div className="text-sm text-gray-600">Tasa de Aprobación</div>
            <div className="text-xs text-gray-500 mt-1">Datos en tiempo real</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.tiempoPromedioAprobacion} días</div>
            <div className="text-sm text-gray-600">Tiempo Promedio de Aprobación</div>
            <div className="text-xs text-gray-500 mt-1">Datos en tiempo real</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.tasaMora}%</div>
            <div className="text-sm text-gray-600">Tasa de Mora</div>
            <div className="text-xs text-gray-500 mt-1">Datos en tiempo real</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditStatsOverview;
