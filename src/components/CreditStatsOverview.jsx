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
  totalClients = 0,
  totalPortfolio = 0,
  activeCredits = 0,
  pendingApplications = 0,
  overdueCredits = 0,
  approvedThisMonth = 0,
  prospects = 0,
  renewalsPending = 0
}) => {
  const stats = [
    {
      title: 'Total Clientes',
      value: totalClients.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Cartera Total',
      value: `$${totalPortfolio.toLocaleString()}`,
      change: '+8.5%',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Créditos Activos',
      value: activeCredits.toLocaleString(),
      change: '+15',
      icon: CreditCard,
      color: 'purple',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Solicitudes Pendientes',
      value: pendingApplications.toLocaleString(),
      change: '+3',
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'En Mora',
      value: overdueCredits.toLocaleString(),
      change: '-2',
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Aprobados Este Mes',
      value: approvedThisMonth.toLocaleString(),
      change: '+25%',
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Prospectos',
      value: prospects.toLocaleString(),
      change: '+8',
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Renovaciones Pendientes',
      value: renewalsPending.toLocaleString(),
      change: '+5',
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
        {stats.map((stat, index) => (
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
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-600">Tasa de Aprobación</div>
            <div className="text-xs text-green-600 mt-1">+2.1% vs mes anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">2.3 días</div>
            <div className="text-sm text-gray-600">Tiempo Promedio de Aprobación</div>
            <div className="text-xs text-green-600 mt-1">-0.5 días vs mes anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">3.2%</div>
            <div className="text-sm text-gray-600">Tasa de Mora</div>
            <div className="text-xs text-green-600 mt-1">-0.3% vs mes anterior</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditStatsOverview;
