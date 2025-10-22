import React from 'react';
import DataTable from './DataTable';
import { UserCheck, UserX, Edit, Eye } from 'lucide-react';

const ProspectsTable = ({ prospects, loading = false, onEdit, onDelete }) => {
  const columns = [
    {
      key: 'cliente',
      header: 'Cliente',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.nombre} {row.apellido}</div>
          <div className="text-sm text-gray-500">DNI: {row.dni}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'direccion',
      header: 'Dirección',
      render: (value) => (
        <span className="text-sm text-gray-600 max-w-xs truncate" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'promotor',
      header: 'Promotor',
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <>
              <UserCheck className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">{value}</span>
            </>
          ) : (
            <>
              <UserX className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-gray-500">Sin asignar</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          'activo': 'bg-green-100 text-green-800',
          'inactivo': 'bg-red-100 text-red-800',
          'pendiente': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'fecha_creacion',
      header: 'Fecha Registro',
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
      icon: Edit,
      onClick: (row) => onEdit && onEdit(row),
      variant: 'primary'
    },
    {
      label: 'Eliminar',
      icon: UserX,
      onClick: (row) => onDelete && onDelete(row),
      variant: 'danger'
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Prospectos</h3>
        <div className="text-sm text-gray-500">
          Total: {prospects.length} prospectos
        </div>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={prospects}
          loading={loading}
          actions={actions}
        />
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : prospects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay prospectos registrados
          </div>
        ) : (
          prospects.map((prospect) => (
            <div key={prospect.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{prospect.nombre} {prospect.apellido}</h4>
                  <p className="text-sm text-gray-500">DNI: {prospect.dni}</p>
                  <p className="text-sm text-gray-500">{prospect.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[prospect.estado] || 'bg-gray-100 text-gray-800'}`}>
                  {prospect.estado}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Teléfono:</span>
                  <span className="text-sm">{prospect.telefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Dirección:</span>
                  <span className="text-sm text-gray-600 max-w-xs truncate" title={prospect.direccion}>
                    {prospect.direccion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fecha:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(prospect.fecha_creacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => action.onClick(prospect)}
                      className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md ${action.className}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProspectsTable;
