import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  UserCheck,
  AlertTriangle,
  Bell,
  Activity
} from 'lucide-react';
import { useAgencyFilter } from '../contexts/AgencyFilterContext';
import AISummaryModal from '../components/AISummaryModal';
import ActividadesDetalladasModal from '../components/ActividadesDetalladasModal';
import StatCard from '../components/StatCard';
import ProspectosPorCampañaChart from '../components/charts/ProspectosPorCampañaChart';
import FuentesInformacionChart from '../components/charts/FuentesInformacionChart';
import SolicitudesAprobadasChart from '../components/charts/SolicitudesAprobadasChart';
import ProspectosPorDepartamentoChart from '../components/charts/ProspectosPorDepartamentoChart';
import {
  getDashboardMetrics,
  getProspectosPorCampaña,
  getFuentesInformacion,
  getSolicitudesAprobadasVsRechazadas,
  getProspectosPorDepartamento,
  getActividadesPromotores,
  getResumenActividades
} from '../services/dashboardService';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedAgencyId } = useAgencyFilter();
  const [showAISummary, setShowAISummary] = useState(false);
  const [showActividadesModal, setShowActividadesModal] = useState(false);
  const [promotorSeleccionado, setPromotorSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});
  const [prospectosPorCampaña, setProspectosPorCampaña] = useState([]);
  const [fuentesInformacion, setFuentesInformacion] = useState([]);
  const [solicitudesAprobadas, setSolicitudesAprobadas] = useState([]);
  const [prospectosPorDepartamento, setProspectosPorDepartamento] = useState([]);
  const [actividadesPromotores, setActividadesPromotores] = useState([]);
  const [resumenActividades, setResumenActividades] = useState({});

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        const [
          metricsData,
          campañaData,
          fuentesData,
          solicitudesData,
          departamentoData,
          actividadesData,
          resumenData
        ] = await Promise.all([
          getDashboardMetrics(selectedAgencyId),
          getProspectosPorCampaña(selectedAgencyId),
          getFuentesInformacion(selectedAgencyId),
          getSolicitudesAprobadasVsRechazadas(selectedAgencyId),
          getProspectosPorDepartamento(selectedAgencyId),
          getActividadesPromotores(selectedAgencyId),
          getResumenActividades(selectedAgencyId)
        ]);

        setMetrics(metricsData);
        setProspectosPorCampaña(campañaData);
        setFuentesInformacion(fuentesData);
        setSolicitudesAprobadas(solicitudesData);
        setProspectosPorDepartamento(departamentoData);
        setActividadesPromotores(actividadesData);
        setResumenActividades(resumenData);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedAgencyId]);

  const handleVerDetalles = (promotor) => {
    setPromotorSeleccionado(promotor);
    setShowActividadesModal(true);
  };

  const handleIrASeguimientoSolicitudes = () => {
    navigate('/creditos?tab=seguimiento');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.title')}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAISummary(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {t('dashboard.generateAISummary')}
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Prospectos"
          value={metrics.totalClientes || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Cartera Total"
          value={`$${(metrics.carteraTotal || 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Créditos Activos"
          value={metrics.creditosActivos || 0}
          icon={CreditCard}
          color="purple"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={metrics.solicitudesPendientes || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Aprobados Este Mes"
          value={metrics.aprobadosMes || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Promotores Activos"
          value={metrics.promotoresActivos || 0}
          icon={UserCheck}
          color="indigo"
        />
        <StatCard
          title="En Mora"
          value={`${metrics.porcentajeMora || 0}%`}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Prospectos por Campaña */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Prospectos por Campaña
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Distribución de prospectos según la campaña de origen
          </p>
          <ProspectosPorCampañaChart data={prospectosPorCampaña} />
        </div>

        {/* Fuentes de Información */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fuentes de Información
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Cómo se enteraron los prospectos de nuestros servicios
          </p>
          <FuentesInformacionChart data={fuentesInformacion} />
        </div>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Solicitudes Aprobadas vs Rechazadas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Solicitudes Aprobadas vs Rechazadas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tendencia de aprobaciones del último mes
          </p>
          <SolicitudesAprobadasChart data={solicitudesAprobadas} />
        </div>

        {/* Prospectos por Departamento */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Prospectos por Departamento
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Distribución de prospectos por departamento
          </p>
          <ProspectosPorDepartamentoChart data={prospectosPorDepartamento} />
        </div>
      </div>

      {/* Alertas y Eventos + Actividades de Promotores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Alertas y Eventos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Alertas y Eventos</h3>
          </div>
          <div className="space-y-2">
            {metrics.solicitudesPendientes > 0 ? (
              <button 
                onClick={handleIrASeguimientoSolicitudes}
                className="w-full flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
              >
                <span className="text-sm text-gray-700">Solicitudes pendientes</span>
                <span className="text-sm font-medium text-yellow-800">
                  {metrics.solicitudesPendientes} solicitudes esperando revisión
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Solicitudes pendientes</span>
                <span className="text-sm font-medium text-green-800">
                  No hay solicitudes pendientes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actividades de Promotores */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Actividades de Promotores</h3>
          </div>
          <div className="text-sm text-gray-600 mb-2">Todos los promotores</div>
          <div className="text-sm text-gray-600 mb-4">Últimos 30 días</div>
          
          {/* Resumen General dentro de Actividades de Promotores */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-3">
              <Activity className="w-4 h-4 text-blue-500 mr-2" />
              <h4 className="text-sm font-semibold text-gray-900">Resumen General</h4>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="font-medium text-lg">{resumenActividades.totalLlamadas || 0}</div>
                <div className="text-gray-500">Llamadas</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-lg">{resumenActividades.totalMensajes || 0}</div>
                <div className="text-gray-500">Mensajes</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-lg">{resumenActividades.totalVisitas || 0}</div>
                <div className="text-gray-500">Visitas</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {actividadesPromotores.map((promotor) => (
              <div key={promotor.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{promotor.nombre}</span>
                  <button 
                    onClick={() => handleVerDetalles(promotor)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Ver Detalles
                  </button>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {promotor.completadas} completadas, {promotor.programadas} programadas
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium">{promotor.llamadas}</div>
                    <div className="text-gray-500">Llamadas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{promotor.mensajes}</div>
                    <div className="text-gray-500">Mensajes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{promotor.visitas}</div>
                    <div className="text-gray-500">Visitas</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAISummary && (
        <AISummaryModal
          isOpen={showAISummary}
          onClose={() => setShowAISummary(false)}
          dashboardData={metrics}
        />
      )}

      {showActividadesModal && (
        <ActividadesDetalladasModal
          isOpen={showActividadesModal}
          onClose={() => {
            setShowActividadesModal(false);
            setPromotorSeleccionado(null);
          }}
          promotor={promotorSeleccionado}
        />
      )}
    </div>
  );
};

export default Dashboard;