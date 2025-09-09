import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatCard from '../components/StatCard';
import MoraPorRangoChart from '../components/charts/MoraPorRangoChart';
import DistribucionCarteraChart from '../components/charts/DistribucionCarteraChart';
import SolicitudesAprobadasChart from '../components/charts/SolicitudesAprobadasChart';
import MapaClientesChart from '../components/charts/MapaClientesChart';
import TendenciaCarteraChart from '../components/charts/TendenciaCarteraChart';
import AISummaryModal from '../components/AISummaryModal';
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  Users,
  Bell,
  AlertTriangle,
  Bot,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [isAISummaryModalOpen, setIsAISummaryModalOpen] = useState(false);
  
  const stats = [
    {
      title: t('dashboard.creditosActivos'),
      value: '1,247',
      change: '+12%',
      icon: CreditCard,
      color: 'blue'
    },
    {
      title: t('dashboard.carteraTotal'),
      value: '$2.4M',
      change: '+8%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: t('dashboard.porcentajeMora'),
      value: '3.2%',
      change: '-0.5%',
      icon: TrendingDown,
      color: 'red'
    },
    {
      title: t('dashboard.promotoresActivos'),
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
      {/* Header con Botón AI Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h2>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        <button
          onClick={() => setIsAISummaryModalOpen(true)}
          className="btn-primary flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        >
          <Bot className="w-4 h-4" />
          <span>{t('aiSummary.generarResumen')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.moraPorRango')}</h3>
          <p className="text-sm text-gray-600 mb-4">Distribución de cartera en mora por períodos</p>
          <MoraPorRangoChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.distribucionCartera')}</h3>
          <p className="text-sm text-gray-600 mb-4">Composición de la cartera por tipo de producto</p>
          <DistribucionCarteraChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.solicitudesAprobadas')}</h3>
          <p className="text-sm text-gray-600 mb-4">Tendencia de aprobaciones del último mes</p>
          <SolicitudesAprobadasChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.mapaClientes')}</h3>
          <p className="text-sm text-gray-600 mb-4">Distribución geográfica de la cartera</p>
          <MapaClientesChart />
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tendencia de Cartera</h3>
            <p className="text-sm text-gray-600 mb-4">Evolución de la cartera en los últimos 6 meses</p>
            <TendenciaCarteraChart />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.alertasEventos')}</h3>
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

      {/* AI Summary Modal */}
      <AISummaryModal 
        isOpen={isAISummaryModalOpen}
        onClose={() => setIsAISummaryModalOpen(false)}
        dashboardData={{
          stats,
          alerts
        }}
      />
    </div>
  );
};

export default Dashboard;
