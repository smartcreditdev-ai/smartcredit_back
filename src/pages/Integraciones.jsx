import React, { useState } from 'react';
import { 
  Plug, 
  CheckCircle, 
  XCircle, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Database,
  Shield,
  Zap
} from 'lucide-react';

const Integraciones = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Sistema Bancario Central',
      description: 'Integración con el sistema bancario para consultas de saldo y movimientos',
      status: 'active',
      lastSync: '2024-01-15 14:30:00',
      type: 'banking'
    },
    {
      id: 2,
      name: 'Bureau de Crédito',
      description: 'Consulta de historial crediticio y scoring de clientes',
      status: 'active',
      lastSync: '2024-01-15 14:25:00',
      type: 'credit'
    },
    {
      id: 3,
      name: 'Sistema de Identificación',
      description: 'Validación de identidad y documentos oficiales',
      status: 'error',
      lastSync: '2024-01-15 12:15:00',
      type: 'identity'
    },
    {
      id: 4,
      name: 'SMS Gateway',
      description: 'Envío de notificaciones y códigos de verificación',
      status: 'active',
      lastSync: '2024-01-15 14:35:00',
      type: 'communication'
    },
    {
      id: 5,
      name: 'Sistema de Geolocalización',
      description: 'Validación de ubicación y seguimiento GPS',
      status: 'inactive',
      lastSync: '2024-01-14 18:45:00',
      type: 'location'
    },
    {
      id: 6,
      name: 'API de Reportes',
      description: 'Generación automática de reportes regulatorios',
      status: 'active',
      lastSync: '2024-01-15 14:20:00',
      type: 'reporting'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'banking':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'credit':
        return <Shield className="w-5 h-5 text-purple-500" />;
      case 'identity':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'communication':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'location':
        return <ExternalLink className="w-5 h-5 text-red-500" />;
      case 'reporting':
        return <Database className="w-5 h-5 text-indigo-500" />;
      default:
        return <Plug className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleRefresh = (id) => {
    console.log('Refrescar integración:', id);
    // Aquí iría la lógica para refrescar la integración
  };

  const handleConfigure = (id) => {
    console.log('Configurar integración:', id);
    // Aquí iría la lógica para abrir configuración
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Integraciones del Sistema</h2>
          <p className="text-sm text-gray-600 mt-1">Gestiona las conexiones con servicios externos</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refrescar Todas</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plug className="w-4 h-4" />
            <span>Nueva Integración</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Integraciones Activas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integrations.filter(i => i.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Con Errores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integrations.filter(i => i.status === 'error').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integrations.filter(i => i.status === 'inactive').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Integración</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Última Sincronización</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {integrations.map((integration) => (
                <tr key={integration.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(integration.type)}
                      <div>
                        <div className="font-medium text-gray-900">{integration.name}</div>
                        <div className="text-sm text-gray-500">{integration.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(integration.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                        {integration.status === 'active' ? 'Activa' :
                         integration.status === 'error' ? 'Error' : 'Inactiva'}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {new Date(integration.lastSync).toLocaleString('es-ES')}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRefresh(integration.id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        <RefreshCw className="w-3 h-3 inline mr-1" />
                        Refrescar
                      </button>
                      <button
                        onClick={() => handleConfigure(integration.id)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Settings className="w-3 h-3 inline mr-1" />
                        Configurar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Documentation */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Documentación de APIs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">API de Créditos</h4>
            <p className="text-sm text-gray-600 mb-3">Endpoints para gestión de créditos y solicitudes</p>
            <div className="flex space-x-2">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">GET</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">POST</span>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">PUT</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">API de Reportes</h4>
            <p className="text-sm text-gray-600 mb-3">Generación de reportes y análisis de datos</p>
            <div className="flex space-x-2">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">GET</span>
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integraciones;
