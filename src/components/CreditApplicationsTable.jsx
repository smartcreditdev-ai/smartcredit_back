import React from 'react';
import DataTable from './DataTable';
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';

const CreditApplicationsTable = ({ applications, onApprove, onReject, onEdit }) => {
  const columns = [
    {
      key: 'cliente',
      header: 'Cliente',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.nombres} {row.apellidos}</div>
          <div className="text-sm text-gray-500">DNI: {row.dni}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'monto_solicitado',
      header: 'Monto Solicitado',
      render: (value) => <span className="font-semibold">${value?.toLocaleString()}</span>
    },
    {
      key: 'proposito',
      header: 'Propósito',
      render: (value) => {
        const purposeColors = {
          'personal': 'bg-blue-100 text-blue-800',
          'hipotecario': 'bg-green-100 text-green-800',
          'automotriz': 'bg-purple-100 text-purple-800',
          'comercial': 'bg-orange-100 text-orange-800',
          'educacion': 'bg-indigo-100 text-indigo-800',
          'salud': 'bg-pink-100 text-pink-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${purposeColors[value?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
            {value || 'No especificado'}
          </span>
        );
      }
    },
    {
      key: 'plazo_deseado',
      header: 'Plazo',
      render: (value) => <span className="text-sm">{value} meses</span>
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (value) => {
        const statusConfig = {
          'Pendiente': { 
            icon: Clock, 
            color: 'text-yellow-600', 
            bg: 'bg-yellow-100',
            text: 'text-yellow-800'
          },
          'Aprobado': { 
            icon: CheckCircle, 
            color: 'text-green-600', 
            bg: 'bg-green-100',
            text: 'text-green-800'
          },
          'Denegado': { 
            icon: XCircle, 
            color: 'text-red-600', 
            bg: 'bg-red-100',
            text: 'text-red-800'
          },
          'Rechazado': { 
            icon: XCircle, 
            color: 'text-red-600', 
            bg: 'bg-red-100',
            text: 'text-red-800'
          },
          'En revisión': { 
            icon: AlertTriangle, 
            color: 'text-blue-600', 
            bg: 'bg-blue-100',
            text: 'text-blue-800'
          }
        };
        const config = statusConfig[value] || statusConfig['Pendiente'];
        const Icon = config.icon;
        
        return (
          <div className="flex items-center">
            <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
              {value}
            </span>
          </div>
        );
      }
    },
    {
      key: 'fecha_solicitud',
      header: 'Fecha Solicitud',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Editar',
      onClick: (row) => onEdit && onEdit(row),
      variant: 'primary'
    },
    {
      label: 'Aprobar',
      onClick: (row) => onApprove && onApprove(row),
      variant: 'success'
    },
    {
      label: 'Rechazar',
      onClick: (row) => onReject && onReject(row),
      variant: 'danger'
    }
  ];

  // Filtrar acciones según el estado
  const getActionsForRow = (row) => {
    if (row.estado === 'Pendiente' || row.estado === 'En revisión') {
      return actions; // Todas las acciones para solicitudes pendientes
    } else if (row.estado === 'Aprobado') {
      return [actions[0]]; // Solo "Editar" para solicitudes aprobadas
    } else if (row.estado === 'Rechazado') {
      return [actions[0]]; // Solo "Editar" para solicitudes rechazadas
    }
    return actions;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Solicitudes de Crédito</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-yellow-500" />
            <span>Pendientes: {applications.filter(app => app.estado === 'Pendiente').length}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            <span>Aprobadas: {applications.filter(app => app.estado === 'Aprobado').length}</span>
          </div>
          <div className="flex items-center">
            <XCircle className="w-4 h-4 mr-1 text-red-500" />
            <span>Rechazadas: {applications.filter(app => app.estado === 'Rechazado').length}</span>
          </div>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={applications}
        actions={actions}
        onRowClick={(row) => onView && onView(row)}
      />
    </div>
  );
};

export default CreditApplicationsTable;
