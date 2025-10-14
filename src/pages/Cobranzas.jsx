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
    const montoMoraTotal = clientes?.reduce((sum, cliente) => sum + (parseFloat(cliente.montoMora) || 0), 0) || 0;
    const clientesEnMora = clientes?.length || 0;
    const clientesCriticos = clientes?.filter(cliente => (cliente.diasMora || 0) > 60).length || 0;
    
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
        title: 'Monto por Mora',
        value: `$${montoMoraTotal.toLocaleString()}`,
        change: '+2%',
        icon: TrendingDown,
        color: 'orange'
      },
      {
        title: 'Clientes Críticos',
        value: clientesCriticos.toString(),
        change: '+1',
        icon: FileText,
        color: 'red'
      }
    ];
  }, [clientes]);

  const columns = [
    {
      key: 'cliente',
      header: 'Cliente',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'monto',
      header: 'Monto Total',
      render: (value) => (
        <span className="font-semibold text-red-600">
          ${(value || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: 'montoMora',
      header: 'Monto Mora',
      render: (value) => (
        <span className="font-semibold text-orange-600">
          ${(value || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: 'diasMora',
      header: 'Días Mora',
      render: (value) => {
        const dias = value || 0;
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            dias <= 30 ? 'bg-yellow-100 text-yellow-800' :
            dias <= 60 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {dias} días
          </span>
        );
      }
    },
    {
      key: 'fechaVencimiento',
      header: 'Fecha Vencimiento',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString('es-ES') : 'Sin fecha'}
        </span>
      )
    },
    {
      key: 'resultadoContacto',
      header: 'Último Contacto',
      render: (value) => {
        const contactColors = {
          'Sin contacto': 'bg-gray-100 text-gray-800',
          'Contactado': 'bg-blue-100 text-blue-800',
          'No contesta': 'bg-red-100 text-red-800',
          'Promesa de pago': 'bg-green-100 text-green-800',
          'Rechaza pago': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value || 'Sin contacto'}
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
      montoCapital: parseFloat(cliente.montoCapital) || 0,
      montoInteres: parseFloat(cliente.montoInteres) || 0,
      montoMora: parseFloat(cliente.montoMora) || 0,
      diasMora: parseInt(cliente.diasMora) || 0,
      fechaVencimiento: cliente.fechaVencimiento,
      fechaPago: cliente.fechaPago,
      resultadoContacto: cliente.resultadoContacto || 'Sin contacto',
      metodoContacto: cliente.metodoContacto || 'Sin método',
      tipoPago: cliente.tipoPago || 'Sin especificar',
      observaciones: cliente.observaciones || 'Sin observaciones',
      clienteId: cliente.clienteId,
      aplicacionId: cliente.aplicacionId,
      usuarioCobradorId: cliente.usuarioCobradorId,
      // Campos adicionales para compatibilidad
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion
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
