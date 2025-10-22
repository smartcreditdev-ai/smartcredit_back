import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Activity, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';

const ActivityTracker = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    promoter: 'all',
    type: 'all',
    dateRange: 'today'
  });

  // Datos simulados de actividades
  const mockActivities = [
    {
      id: 1,
      promoterId: 1,
      promoterName: 'Carlos Mendoza',
      clientId: 101,
      clientName: 'Juan Pérez',
      type: 'call',
      status: 'completed',
      duration: 15,
      date: '2024-01-15T10:30:00Z',
      notes: 'Cliente interesado en renovación',
      result: 'positive'
    },
    {
      id: 2,
      promoterId: 1,
      promoterName: 'Carlos Mendoza',
      clientId: 102,
      clientName: 'María García',
      type: 'visit',
      status: 'completed',
      duration: 45,
      date: '2024-01-15T11:15:00Z',
      notes: 'Visita exitosa, cliente pagó cuota pendiente',
      result: 'success'
    },
    {
      id: 3,
      promoterId: 2,
      promoterName: 'Ana López',
      clientId: 103,
      clientName: 'Pedro Rodríguez',
      type: 'sms',
      status: 'completed',
      duration: 2,
      date: '2024-01-15T09:00:00Z',
      notes: 'Recordatorio de pago enviado',
      result: 'neutral'
    },
    {
      id: 4,
      promoterId: 1,
      promoterName: 'Carlos Mendoza',
      clientId: 104,
      clientName: 'Luis Hernández',
      type: 'visit',
      status: 'scheduled',
      duration: 30,
      date: '2024-01-15T14:00:00Z',
      notes: 'Visita programada para seguimiento',
      result: 'pending'
    },
    {
      id: 5,
      promoterId: 2,
      promoterName: 'Ana López',
      clientId: 105,
      clientName: 'Carmen Vásquez',
      type: 'call',
      status: 'completed',
      duration: 20,
      date: '2024-01-15T08:45:00Z',
      notes: 'Cliente no disponible, dejar mensaje',
      result: 'negative'
    }
  ];

  const mockPromoters = [
    { id: 1, name: 'Carlos Mendoza', status: 'active', totalActivities: 25, completedActivities: 20 },
    { id: 2, name: 'Ana López', status: 'active', totalActivities: 18, completedActivities: 15 },
    { id: 3, name: 'Luis Rodríguez', status: 'inactive', totalActivities: 12, completedActivities: 8 }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities(mockActivities);
      setPromoters(mockPromoters);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return Phone;
      case 'visit': return MapPin;
      case 'sms': return MessageSquare;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'text-blue-500 bg-blue-100';
      case 'visit': return 'text-green-500 bg-green-100';
      case 'sms': return 'text-purple-500 bg-purple-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'success': return 'text-green-600';
      case 'positive': return 'text-blue-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter.promoter !== 'all' && activity.promoterId !== parseInt(filter.promoter)) return false;
    if (filter.type !== 'all' && activity.type !== filter.type) return false;
    
    const activityDate = new Date(activity.date);
    const today = new Date();
    
    switch (filter.dateRange) {
      case 'today':
        return activityDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return activityDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return activityDate >= monthAgo;
      default:
        return true;
    }
  });

  const stats = {
    totalActivities: activities.length,
    completedActivities: activities.filter(a => a.status === 'completed').length,
    scheduledActivities: activities.filter(a => a.status === 'scheduled').length,
    totalDuration: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
    successRate: activities.filter(a => a.status === 'completed').length > 0 
      ? Math.round((activities.filter(a => a.result === 'success' || a.result === 'positive').length / activities.filter(a => a.status === 'completed').length) * 100)
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-500" />
            Seguimiento de Actividades
          </h3>
          <p className="text-gray-600 mt-1">Monitoreo de actividades de promotores</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalActivities}</div>
              <div className="text-sm text-gray-600">Total Actividades</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.completedActivities}</div>
              <div className="text-sm text-gray-600">Completadas</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.scheduledActivities}</div>
              <div className="text-sm text-gray-600">Programadas</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.successRate}%</div>
              <div className="text-sm text-gray-600">Tasa de Éxito</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotor
            </label>
            <select
              value={filter.promoter}
              onChange={(e) => setFilter(prev => ({ ...prev, promoter: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos los promotores</option>
              {promoters.map(promoter => (
                <option key={promoter.id} value={promoter.id}>
                  {promoter.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Actividad
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="call">Llamadas</option>
              <option value="visit">Visitas</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={filter.dateRange}
              onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Actividades */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Actividades Recientes ({filteredActivities.length})
          </h4>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredActivities.map(activity => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.promoterName} - {activity.clientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.type === 'call' ? 'Llamada telefónica' :
                           activity.type === 'visit' ? 'Visita presencial' :
                           activity.type === 'sms' ? 'Mensaje SMS' : 'Actividad'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status === 'completed' ? 'Completada' :
                           activity.status === 'scheduled' ? 'Programada' :
                           activity.status === 'cancelled' ? 'Cancelada' : activity.status}
                        </span>
                        <span className={`text-sm font-medium ${getResultColor(activity.result)}`}>
                          {activity.result === 'success' ? '✓' :
                           activity.result === 'positive' ? '+' :
                           activity.result === 'negative' ? '-' :
                           activity.result === 'neutral' ? '=' : '?'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.duration} min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {activity.clientName}
                      </div>
                    </div>
                    {activity.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Notas:</strong> {activity.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen de Promotores */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Resumen por Promotor
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoters.map(promoter => (
            <div key={promoter.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{promoter.name}</h5>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  promoter.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {promoter.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Actividades:</span>
                  <span className="font-medium">{promoter.totalActivities}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completadas:</span>
                  <span className="font-medium">{promoter.completedActivities}</span>
                </div>
                <div className="flex justify-between">
                  <span>Eficiencia:</span>
                  <span className="font-medium">
                    {Math.round((promoter.completedActivities / promoter.totalActivities) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
