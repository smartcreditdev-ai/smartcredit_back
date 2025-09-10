import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatCard from '../components/StatCard';
import MoraPorRangoChart from '../components/charts/MoraPorRangoChart';
import DistribucionCarteraChart from '../components/charts/DistribucionCarteraChart';
import SolicitudesAprobadasChart from '../components/charts/SolicitudesAprobadasChart';
import MapaClientesChart from '../components/charts/MapaClientesChart';
import TendenciaCarteraChart from '../components/charts/TendenciaCarteraChart';
import AISummaryModal from '../components/AISummaryModal';
import { useDashboardStats, useChartData } from '../hooks/useSupabaseData';
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  Users,
  Bell,
  AlertTriangle,
  Bot,
  FileText,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [isAISummaryModalOpen, setIsAISummaryModalOpen] = useState(false);
  
  // Obtener datos reales de Supabase
  const { stats: realStats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: moraData, loading: moraLoading } = useChartData('moraPorRango');
  const { data: distribucionData, loading: distribucionLoading } = useChartData('distribucionCartera');
  const { data: solicitudesData, loading: solicitudesLoading } = useChartData('solicitudesAprobadas');
  const { data: mapaData, loading: mapaLoading } = useChartData('mapaClientes');
  const { data: tendenciaData, loading: tendenciaLoading } = useChartData('tendenciaCartera');
  
  // Formatear estadísticas para las cards
  const stats = [
    {
      title: t('dashboard.creditosActivos'),
      value: statsLoading ? '...' : realStats.creditosActivos.toLocaleString(),
      change: '+12%',
      icon: CreditCard,
      color: 'blue'
    },
    {
      title: t('dashboard.carteraTotal'),
      value: statsLoading ? '...' : `$${(realStats.carteraTotal / 1000000).toFixed(1)}M`,
      change: '+8%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: t('dashboard.porcentajeMora'),
      value: statsLoading ? '...' : `${realStats.porcentajeMora}%`,
      change: '-0.5%',
      icon: TrendingDown,
      color: 'red'
    },
    {
      title: t('dashboard.promotoresActivos'),
      value: statsLoading ? '...' : realStats.promotoresActivos.toString(),
      change: '+2',
      icon: Users,
      color: 'purple'
    }
  ];

  // Obtener alertas dinámicas basadas en datos reales
  const alerts = React.useMemo(() => {
    const alertList = [];
    
    // Alertas de clientes en mora crítica
    if (moraData && moraData.length > 0) {
      const moraCritica = moraData.find(rango => rango.rango === '91+');
      if (moraCritica && moraCritica.cantidad > 0) {
        alertList.push({
          id: 1,
          type: 'warning',
          title: 'Clientes en mora crítica',
          message: `${moraCritica.cantidad} clientes con más de 90 días de mora`,
          time: 'Reciente'
        });
      }
    }
    
    // Alertas de nuevas solicitudes (simulado basado en datos)
    if (solicitudesData && solicitudesData.length > 0) {
      const pendientes = solicitudesData.find(tipo => tipo.tipo === 'Pendientes');
      if (pendientes && pendientes.cantidad > 0) {
        alertList.push({
          id: 2,
          type: 'info',
          title: 'Solicitudes pendientes',
          message: `${pendientes.cantidad} solicitudes esperando revisión`,
          time: 'Reciente'
        });
      }
    }
    
    // Alertas de aprobaciones recientes
    if (solicitudesData && solicitudesData.length > 0) {
      const aprobadas = solicitudesData.find(tipo => tipo.tipo === 'Aprobadas');
      if (aprobadas && aprobadas.cantidad > 0) {
        alertList.push({
          id: 3,
          type: 'success',
          title: 'Solicitudes aprobadas',
          message: `${aprobadas.cantidad} solicitudes aprobadas este mes`,
          time: 'Reciente'
        });
      }
    }
    
    return alertList;
  }, [moraData, solicitudesData]);

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
          {moraLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <MoraPorRangoChart data={moraData} />
          )}
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.distribucionCartera')}</h3>
          <p className="text-sm text-gray-600 mb-4">Composición de la cartera por tipo de producto</p>
          {distribucionLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <DistribucionCarteraChart data={distribucionData} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.solicitudesAprobadas')}</h3>
          <p className="text-sm text-gray-600 mb-4">Tendencia de aprobaciones del último mes</p>
          {solicitudesLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <SolicitudesAprobadasChart data={solicitudesData} />
          )}
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.mapaClientes')}</h3>
          <p className="text-sm text-gray-600 mb-4">Distribución geográfica de la cartera</p>
          {mapaLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <MapaClientesChart data={mapaData} />
          )}
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tendencia de Cartera</h3>
            <p className="text-sm text-gray-600 mb-4">Evolución de la cartera en los últimos 6 meses</p>
            {tendenciaLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <TendenciaCarteraChart data={tendenciaData} />
            )}
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
