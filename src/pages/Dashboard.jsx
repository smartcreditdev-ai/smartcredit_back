import React from 'react';
import StatCard from '../components/StatCard';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  Users,
  Bell,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Créditos Activos',
      value: '1,247',
      change: '+12%',
      icon: CreditCard,
      color: 'blue'
    },
    {
      title: 'Cartera Total',
      value: '$2.4M',
      change: '+8%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: '% Mora',
      value: '3.2%',
      change: '-0.5%',
      icon: TrendingDown,
      color: 'red'
    },
    {
      title: 'Promotores Activos',
      value: '24',
      change: '+2',
      icon: Users,
      color: 'purple'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Cliente en mora crítica',
      message: 'Juan Pérez - $5,000 (45 días)',
      time: 'Hace 2 horas'
    },
    {
      id: 2,
      type: 'info',
      title: 'Nueva solicitud',
      message: 'María García - $3,500',
      time: 'Hace 4 horas'
    },
    {
      id: 3,
      type: 'success',
      title: 'Pago recibido',
      message: 'Carlos López - $2,200',
      time: 'Hace 6 horas'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          type="bar"
          title="Mora por Rango de Días"
          description="Distribución de cartera en mora por períodos"
        />
        <ChartPlaceholder
          type="pie"
          title="Distribución de Cartera por Producto"
          description="Composición de la cartera por tipo de producto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          type="bar"
          title="Solicitudes Aprobadas vs Rechazadas"
          description="Tendencia de aprobaciones del último mes"
        />
        <ChartPlaceholder
          type="map"
          title="Mapa de Clientes por Región"
          description="Distribución geográfica de la cartera"
        />
      </div>

      {/* Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartPlaceholder
            type="line"
            title="Tendencia de Cartera"
            description="Evolución de la cartera en los últimos 6 meses"
          />
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Alertas y Eventos</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-yellow-400' :
                    alert.type === 'info' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
