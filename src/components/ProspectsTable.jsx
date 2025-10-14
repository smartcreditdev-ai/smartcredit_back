import React from 'react';
import DataTable from './DataTable';
import { UserCheck, UserX, Edit, Eye } from 'lucide-react';

const ProspectsTable = ({ prospects, onAssignPromoter, onView, onEdit, onDelete }) => {
  const columns = [
    {
      key: 'cliente',
      header: 'Cliente',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'montoSolicitado',
      header: 'Monto Solicitado',
      render: (value) => <span className="font-semibold">${value.toLocaleString()}</span>
    },
    {
      key: 'producto',
      header: 'Producto',
      render: (value) => {
        const productColors = {
          'Personal': 'bg-blue-100 text-blue-800',
          'Hipotecario': 'bg-green-100 text-green-800',
          'Automotriz': 'bg-purple-100 text-purple-800',
          'Comercial': 'bg-orange-100 text-orange-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${productColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
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
          'Nuevo': 'bg-yellow-100 text-yellow-800',
          'En evaluación': 'bg-blue-100 text-blue-800',
          'Aprobado': 'bg-green-100 text-green-800',
          'Rechazado': 'bg-red-100 text-red-800',
          'En proceso': 'bg-purple-100 text-purple-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'fechaCreacion',
      header: 'Fecha Creación',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Ver',
      onClick: (row) => onView && onView(row),
      variant: 'primary'
    },
    {
      label: 'Editar',
      onClick: (row) => onEdit && onEdit(row),
      variant: 'primary'
    },
    {
      label: 'Asignar',
      onClick: (row) => onAssignPromoter && onAssignPromoter(row),
      variant: 'primary'
    },
    {
      label: 'Eliminar',
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
      
      <DataTable
        columns={columns}
        data={prospects}
        actions={actions}
        onRowClick={(row) => onView && onView(row)}
      />
    </div>
  );
};

export default ProspectsTable;
