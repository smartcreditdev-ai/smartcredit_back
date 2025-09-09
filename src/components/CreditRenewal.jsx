import React, { useState } from 'react';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import { RefreshCw, Calendar, AlertTriangle, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';

const CreditRenewal = () => {
  const [filters, setFilters] = useState({
    sucursal: '',
    promotor: '',
    estado: '',
    diasVencimiento: ''
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
        { value: 'proximo-vencer', label: 'Próximo a Vencer' },
        { value: 'vencido', label: 'Vencido' },
        { value: 'elegible-renovacion', label: 'Elegible para Renovación' }
      ]
    },
    {
      key: 'diasVencimiento',
      placeholder: 'Días Vencimiento',
      value: filters.diasVencimiento,
      options: [
        { value: '0-30', label: '0-30 días' },
        { value: '31-60', label: '31-60 días' },
        { value: '61-90', label: '61-90 días' },
        { value: 'vencido', label: 'Ya vencido' }
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
      key: 'fechaVencimiento',
      header: 'Vencimiento',
      render: (value) => {
        const fecha = new Date(value);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
        
        return (
          <div>
            <div className="text-sm text-gray-900">{fecha.toLocaleDateString('es-ES')}</div>
            <div className={`text-xs flex items-center ${
              diasRestantes < 0 ? 'text-red-600' :
              diasRestantes <= 30 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {diasRestantes < 0 ? (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {Math.abs(diasRestantes)} días vencido
                </>
              ) : diasRestantes <= 30 ? (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  {diasRestantes} días restantes
                </>
              ) : (
                <>
                  <Calendar className="w-3 h-3 mr-1" />
                  {diasRestantes} días restantes
                </>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'estadoRenovacion',
      header: 'Estado Renovación',
      render: (value) => {
        const statusConfig = {
          'Elegible': { 
            icon: CheckCircle, 
            color: 'text-green-600', 
            bg: 'bg-green-100',
            text: 'text-green-800'
          },
          'En Proceso': { 
            icon: Clock, 
            color: 'text-blue-600', 
            bg: 'bg-blue-100',
            text: 'text-blue-800'
          },
          'No Elegible': { 
            icon: XCircle, 
            color: 'text-red-600', 
            bg: 'bg-red-100',
            text: 'text-red-800'
          },
          'Renovado': { 
            icon: RefreshCw, 
            color: 'text-purple-600', 
            bg: 'bg-purple-100',
            text: 'text-purple-800'
          }
        };
        const config = statusConfig[value] || statusConfig['No Elegible'];
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
      key: 'historialPagos',
      header: 'Historial',
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900">{row.cuotasPagadas}/{row.cuotasTotales} cuotas</div>
          <div className="text-gray-500">{value}% pagado</div>
        </div>
      )
    }
  ];

  const data = [
    {
      id: 'C001',
      cliente: 'Juan Pérez',
      documento: '12345678',
      promotor: 'María García',
      montoOriginal: 15000,
      saldoPendiente: 2500,
      producto: 'Personal',
      fechaVencimiento: '2024-02-15',
      estadoRenovacion: 'Elegible',
      cuotasPagadas: 20,
      cuotasTotales: 24,
      historialPagos: 83
    },
    {
      id: 'C002',
      cliente: 'Ana Martínez',
      documento: '87654321',
      promotor: 'Carlos López',
      montoOriginal: 25000,
      saldoPendiente: 5000,
      producto: 'Hipotecario',
      fechaVencimiento: '2024-01-28',
      estadoRenovacion: 'En Proceso',
      cuotasPagadas: 30,
      cuotasTotales: 36,
      historialPagos: 83
    },
    {
      id: 'C003',
      cliente: 'Roberto Silva',
      documento: '11223344',
      promotor: 'Juan Pérez',
      montoOriginal: 8000,
      saldoPendiente: 0,
      producto: 'Automotriz',
      fechaVencimiento: '2024-01-15',
      estadoRenovacion: 'Renovado',
      cuotasPagadas: 12,
      cuotasTotales: 12,
      historialPagos: 100
    },
    {
      id: 'C004',
      cliente: 'Laura Rodríguez',
      documento: '55667788',
      promotor: 'Ana Martínez',
      montoOriginal: 12000,
      saldoPendiente: 8000,
      producto: 'Personal',
      fechaVencimiento: '2024-01-10',
      estadoRenovacion: 'No Elegible',
      cuotasPagadas: 8,
      cuotasTotales: 20,
      historialPagos: 40
    }
  ];

  const actions = [
    {
      label: 'Ver',
      onClick: (row) => console.log('Ver crédito:', row.id),
      variant: 'primary'
    },
    {
      label: 'Renovar',
      onClick: (row) => console.log('Renovar crédito:', row.id),
      variant: 'primary'
    },
    {
      label: 'Evaluar',
      onClick: (row) => console.log('Evaluar renovación:', row.id),
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

  // Estadísticas de renovación
  const stats = [
    {
      title: 'Elegibles para Renovación',
      value: '45',
      change: '+12%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'En Proceso',
      value: '8',
      change: '+3',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Próximos a Vencer',
      value: '23',
      change: '+5',
      icon: Calendar,
      color: 'yellow'
    },
    {
      title: 'Renovados Este Mes',
      value: '15',
      change: '+8%',
      icon: RefreshCw,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas de Renovación */}
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
                stat.color === 'green' ? 'bg-green-500' :
                stat.color === 'blue' ? 'bg-blue-500' :
                stat.color === 'yellow' ? 'bg-yellow-500' :
                'bg-purple-500'
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

      {/* Tabla de Renovaciones */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Gestión de Renovaciones</h3>
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Programar</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Procesar Renovaciones</span>
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

export default CreditRenewal;
