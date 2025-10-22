import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import { RefreshCw, Calendar, AlertTriangle, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { getCarteraCreditos } from '../services/api';

const CreditRenewal = () => {
  const [filters, setFilters] = useState({
    sucursal: '',
    promotor: '',
    estado: '',
    diasVencimiento: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [carteraData, setCarteraData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de cartera
  useEffect(() => {
    const loadCarteraData = async () => {
      try {
        setLoading(true);
        const data = await getCarteraCreditos();
        setCarteraData(data);
      } catch (error) {
        console.error('Error cargando datos de cartera:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCarteraData();
  }, []);

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
      key: 'cliente',
      header: 'Cliente',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.cliente}</div>
          <div className="text-sm text-gray-500">DNI: {row.dni}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'promotor',
      header: 'Promotor',
      render: (value) => (
        <span className="text-sm">{value || 'Sin asignar'}</span>
      )
    },
    {
      key: 'monto_solicitado',
      header: 'Monto Original',
      render: (value) => <span className="font-semibold">${value?.toLocaleString()}</span>
    },
    {
      key: 'monto',
      header: 'Saldo Pendiente',
      render: (value) => <span className="font-semibold text-red-600">${value?.toLocaleString()}</span>
    },
    {
      key: 'proposito',
      header: 'Propósito',
      render: (value) => {
        const productColors = {
          'personal': 'bg-blue-100 text-blue-800',
          'hipotecario': 'bg-green-100 text-green-800',
          'automotriz': 'bg-purple-100 text-purple-800',
          'comercial': 'bg-orange-100 text-orange-800',
          'educacion': 'bg-indigo-100 text-indigo-800',
          'salud': 'bg-pink-100 text-pink-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${productColors[value?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
            {value || 'No especificado'}
          </span>
        );
      }
    },
    {
      key: 'fecha_vencimiento',
      header: 'Vencimiento',
      render: (value) => {
        if (!value) return <span className="text-sm text-gray-500">No definido</span>;
        
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
      render: (value, row) => {
        // Determinar elegibilidad basado en fecha de vencimiento y estado
        let estadoRenovacion = 'No Elegible';
        if (row.fecha_vencimiento) {
          const fecha = new Date(row.fecha_vencimiento);
          const hoy = new Date();
          const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
          
          if (diasRestantes <= 30 && diasRestantes >= -30) {
            estadoRenovacion = 'Elegible';
          } else if (diasRestantes < -30) {
            estadoRenovacion = 'No Elegible';
          } else {
            estadoRenovacion = 'No Elegible';
          }
        }

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
        const config = statusConfig[estadoRenovacion] || statusConfig['No Elegible'];
        const Icon = config.icon;
        
        return (
          <div className="flex items-center">
            <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
              {estadoRenovacion}
            </span>
          </div>
        );
      }
    },
    {
      key: 'plazo_meses',
      header: 'Plazo',
      render: (value) => <span className="text-sm">{value} meses</span>
    }
  ];

  // Calcular estadísticas de renovación
  const elegiblesRenovacion = carteraData.filter(credito => {
    if (!credito.fecha_vencimiento) return false;
    const fecha = new Date(credito.fecha_vencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 30 && diasRestantes >= -30;
  }).length;

  const proximosVencer = carteraData.filter(credito => {
    if (!credito.fecha_vencimiento) return false;
    const fecha = new Date(credito.fecha_vencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 30 && diasRestantes >= 0;
  }).length;

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
      value: elegiblesRenovacion.toString(),
      change: '+12%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'En Proceso',
      value: '0', // TODO: Implementar lógica de renovaciones en proceso
      change: '+3',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Próximos a Vencer',
      value: proximosVencer.toString(),
      change: '+5',
      icon: Calendar,
      color: 'yellow'
    },
    {
      title: 'Renovados Este Mes',
      value: '0', // TODO: Implementar lógica de renovaciones completadas
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
          data={carteraData}
          actions={actions}
          loading={loading}
          onRowClick={(row) => console.log('Click en crédito:', row)}
        />
      </div>
    </div>
  );
};

export default CreditRenewal;
