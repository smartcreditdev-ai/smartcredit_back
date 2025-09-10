import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import MoraSegmentationChart from '../components/MoraSegmentationChart';
import CollectorsMap from '../components/CollectorsMap';
import PortfolioTrendChart from '../components/PortfolioTrendChart';
import AIVisitModal from '../components/AIVisitModal';
import { useClientesEnMora } from '../hooks/useSupabaseData';
import { 
  DollarSign, 
  Users, 
  TrendingDown, 
  FileText,
  Phone,
  Calendar,
  Bot,
  Loader2
} from 'lucide-react';

const Cobranzas = () => {
  const { t } = useTranslation();
  const [isAIVisitModalOpen, setIsAIVisitModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  
  // Obtener datos reales de clientes en mora
  const { clientes, loading: clientesLoading, error: clientesError } = useClientesEnMora();

  // Calcular estadísticas basadas en datos reales
  const stats = React.useMemo(() => {
    const carteraEnMora = clientes?.reduce((sum, cliente) => sum + (parseFloat(cliente.monto) || 0), 0) || 0;
    const clientesEnMora = clientes?.length || 0;
    const porcentajeMora = clientesEnMora > 0 ? ((clientesEnMora / 100) * 100).toFixed(1) : 0; // Estimado
    
    return [
      {
        title: 'Cartera en Mora',
        value: `$${carteraEnMora.toLocaleString()}`,
        change: '-5%',
        icon: DollarSign,
        color: 'red'
      },
      {
        title: 'Clientes en Mora',
        value: clientesEnMora.toString(),
        change: '-3',
        icon: Users,
        color: 'red'
      },
      {
        title: '% Mora',
        value: `${porcentajeMora}%`,
        change: '-0.5%',
        icon: TrendingDown,
        color: 'green'
      },
      {
        title: 'Planes de Pago Activos',
        value: '12', // Mantener como estimado por ahora
        change: '+2',
        icon: FileText,
        color: 'blue'
      }
    ];
  }, [clientes]);

  const columns = [
    {
      key: 'cliente',
      header: 'Cliente'
    },
    {
      key: 'monto',
      header: 'Monto',
      render: (value) => <span className="font-semibold">${value.toLocaleString()}</span>
    },
    {
      key: 'diasMora',
      header: 'Días Mora',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value <= 30 ? 'bg-yellow-100 text-yellow-800' :
          value <= 60 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value} días
        </span>
      )
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          'En seguimiento': 'bg-blue-100 text-blue-800',
          'Crítico': 'bg-red-100 text-red-800',
          'En riesgo': 'bg-orange-100 text-orange-800',
          'Pago hoy': 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    }
  ];

  // Usar datos reales de clientes en mora
  const data = React.useMemo(() => {
    if (!clientes || clientes.length === 0) return [];
    
    return clientes.map(cliente => ({
      cliente: cliente.cliente || 'Cliente sin nombre',
      monto: parseFloat(cliente.monto) || 0,
      diasMora: cliente.diasMora || 0,
      estado: cliente.diasMora > 60 ? 'Crítico' : 
              cliente.diasMora > 30 ? 'En seguimiento' : 
              cliente.diasMora > 0 ? 'En riesgo' : 'Pago hoy',
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      observaciones: cliente.observaciones
    }));
  }, [clientes]);

  const handleAIVisit = () => {
    // Por ahora usar todos los clientes, en el futuro se puede seleccionar específicos
    setSelectedClients(data);
    setIsAIVisitModalOpen(true);
  };

  const actions = [
    {
      label: 'Plan',
      onClick: (row) => console.log('Crear plan de pago:', row.cliente),
      variant: 'primary'
    },
    {
      label: 'Contactar',
      onClick: (row) => console.log('Contactar cliente:', row.cliente),
      variant: 'primary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <MoraSegmentationChart data={data} />
        </div>
        <div className="card">
          <CollectorsMap />
        </div>
      </div>

      {/* Clients in Default Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Clientes en Mora</h3>
          <div className="flex space-x-2">
            <button className="btn-primary flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Contactar Todos</span>
            </button>
            <button 
              onClick={handleAIVisit}
              className="btn-secondary flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Bot className="w-4 h-4" />
              <span>{t('cobranzas.visitarConAI')}</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Programar Visitas</span>
            </button>
          </div>
        </div>
        
        {clientesLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Cargando clientes en mora...</span>
          </div>
        ) : clientesError ? (
          <div className="text-center text-red-600 py-8">
            <p>Error al cargar los datos: {clientesError}</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            actions={actions}
            onRowClick={(row) => console.log('Click en cliente:', row)}
          />
        )}
      </div>

      {/* Tendencia de Cartera */}
      <div className="card">
        <PortfolioTrendChart />
      </div>

      {/* AI Visit Modal */}
      <AIVisitModal 
        isOpen={isAIVisitModalOpen}
        onClose={() => setIsAIVisitModalOpen(false)}
        selectedClients={selectedClients}
      />
    </div>
  );
};

export default Cobranzas;
