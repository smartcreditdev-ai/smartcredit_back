import React, { useState } from 'react';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import { DollarSign, TrendingUp, AlertTriangle, Calendar, Eye, Edit, RefreshCw } from 'lucide-react';

const PortfolioManagement = () => {
  const [filters, setFilters] = useState({
    sucursal: '',
    promotor: '',
    estado: '',
    producto: '',
    vencimiento: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filterOptions = [
    {
      key: 'sucursal',
      placeholder: 'Sucursal',
      value: filters.sucursal,
      options: [
        { value: 'centro', label: 'Centro' },
        { value: 'norte', label: 'Norte' },
        { value: 'sur', label: 'Sur' },
        { value: 'este', label: 'Este' }
      ]
    },
    {
      key: 'promotor',
      placeholder: 'Promotor',
      value: filters.promotor,
      options: [
        { value: 'maria-garcia', label: 'María García' },
        { value: 'carlos-lopez', label: 'Carlos López' },
        { value: 'juan-perez', label: 'Juan Pérez' },
        { value: 'ana-martinez', label: 'Ana Martínez' }
      ]
    },
    {
      key: 'estado',
      placeholder: 'Estado',
      value: filters.estado,
      options: [
        { value: 'activo', label: 'Activo' },
        { value: 'vencido', label: 'Vencido' },
        { value: 'pagado', label: 'Pagado' },
        { value: 'en-mora', label: 'En Mora' },
        { value: 'cancelado', label: 'Cancelado' }
      ]
    },
    {
      key: 'producto',
      placeholder: 'Producto',
      value: filters.producto,
      options: [
        { value: 'personal', label: 'Personal' },
        { value: 'hipotecario', label: 'Hipotecario' },
        { value: 'automotriz', label: 'Automotriz' },
        { value: 'comercial', label: 'Comercial' }
      ]
    },
    {
      key: 'vencimiento',
      placeholder: 'Vencimiento',
      value: filters.vencimiento,
      options: [
        { value: 'proximo-vencer', label: 'Próximo a Vencer' },
        { value: 'vencido', label: 'Vencido' },
        { value: 'vigente', label: 'Vigente' }
      ]
    }
  ];

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.documento}</div>
        </div>
      )
    },
    {
      key: 'promotor',
      header: 'Promotor'
    },
    {
      key: 'montoOriginal',
      header: 'Monto Original',
      render: (value) => <span className="font-semibold">${value?.toLocaleString()}</span>
    },
    {
      key: 'saldoPendiente',
      header: 'Saldo Pendiente',
      render: (value) => <span className="font-semibold text-red-600">${value?.toLocaleString()}</span>
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
      key: 'estado',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          'Activo': 'bg-green-100 text-green-800',
          'Vencido': 'bg-red-100 text-red-800',
          'Pagado': 'bg-blue-100 text-blue-800',
          'En Mora': 'bg-yellow-100 text-yellow-800',
          'Cancelado': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'fechaVencimiento',
      header: 'Vencimiento',
      render: (value) => {
        const fecha = new Date(value);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
        
        return (
          <div>
            <div className="text-sm text-gray-900">{fecha.toLocaleDateString('es-ES')}</div>
            <div className={`text-xs ${
              diasRestantes < 0 ? 'text-red-600' :
              diasRestantes <= 30 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {diasRestantes < 0 ? `${Math.abs(diasRestantes)} días vencido` :
               diasRestantes <= 30 ? `${diasRestantes} días restantes` :
               `${diasRestantes} días restantes`}
            </div>
          </div>
        );
      }
    },
    {
      key: 'cuotaMensual',
      header: 'Cuota Mensual',
      render: (value) => <span className="font-semibold">${value}</span>
    }
  ];

  const data = [
    {
      id: 'C001',
      cliente: 'Juan Pérez',
      documento: '12345678',
      promotor: 'María García',
      montoOriginal: 15000,
      saldoPendiente: 8500,
      producto: 'Personal',
      estado: 'Activo',
      fechaVencimiento: '2024-03-15',
      cuotaMensual: 750,
      cuotasPagadas: 8,
      cuotasTotales: 24
    },
    {
      id: 'C002',
      cliente: 'Ana Martínez',
      documento: '87654321',
      promotor: 'Carlos López',
      montoOriginal: 25000,
      saldoPendiente: 12000,
      producto: 'Hipotecario',
      estado: 'Activo',
      fechaVencimiento: '2024-02-28',
      cuotaMensual: 1200,
      cuotasPagadas: 12,
      cuotasTotales: 36
    },
    {
      id: 'C003',
      cliente: 'Roberto Silva',
      documento: '11223344',
      promotor: 'Juan Pérez',
      montoOriginal: 8000,
      saldoPendiente: 0,
      producto: 'Automotriz',
      estado: 'Pagado',
      fechaVencimiento: '2024-01-15',
      cuotaMensual: 800,
      cuotasPagadas: 12,
      cuotasTotales: 12
    },
    {
      id: 'C004',
      cliente: 'Laura Rodríguez',
      documento: '55667788',
      promotor: 'Ana Martínez',
      montoOriginal: 12000,
      saldoPendiente: 6000,
      producto: 'Personal',
      estado: 'En Mora',
      fechaVencimiento: '2024-01-10',
      cuotaMensual: 600,
      cuotasPagadas: 10,
      cuotasTotales: 20
    }
  ];

  const actions = [
    {
      label: 'Ver',
      onClick: (row) => console.log('Ver crédito:', row.id),
      variant: 'primary'
    },
    {
      label: 'Editar',
      onClick: (row) => console.log('Editar crédito:', row.id),
      variant: 'primary'
    },
    {
      label: 'Renovar',
      onClick: (row) => console.log('Renovar crédito:', row.id),
      variant: 'primary'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Buscar:', term);
  };

  // Estadísticas de cartera
  const stats = [
    {
      title: 'Cartera Total',
      value: '$45,500',
      change: '+5.2%',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Créditos Activos',
      value: '127',
      change: '+8',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'En Mora',
      value: '23',
      change: '-3',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Próximos a Vencer',
      value: '15',
      change: '+2',
      icon: Calendar,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas de Cartera */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs mes anterior
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-500' :
                stat.color === 'green' ? 'bg-green-500' :
                stat.color === 'red' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <FilterBar
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Tabla de Cartera */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Gestión de Cartera</h3>
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Gestionar</span>
            </button>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={data}
          actions={actions}
          onRowClick={(row) => console.log('Click en crédito:', row)}
        />
      </div>
    </div>
  );
};

export default PortfolioManagement;
