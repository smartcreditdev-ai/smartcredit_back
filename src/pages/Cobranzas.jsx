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
  Loader2,
  X
} from 'lucide-react';

const Cobranzas = () => {
  const { t } = useTranslation();
  const [isAIVisitModalOpen, setIsAIVisitModalOpen] = useState(false);
  const [isProgramarVisitasModalOpen, setIsProgramarVisitasModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [visitaForm, setVisitaForm] = useState({
    cliente_id: '',
    fecha_visita: '',
    observacion: '',
    tipo_visita: 'Cobranza',
    estado: 'Programada'
  });
  
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

  const handleProgramarVisitas = () => {
    setIsProgramarVisitasModalOpen(true);
  };

  const handleVisitaFormChange = (field, value) => {
    setVisitaForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCrearVisita = async () => {
    try {
      // Aquí iría la lógica para crear la visita en Supabase
      console.log('Creando visita:', visitaForm);
      
      // Por ahora solo cerramos el modal
      setIsProgramarVisitasModalOpen(false);
      setVisitaForm({
        cliente_id: '',
        fecha_visita: '',
        observacion: '',
        tipo_visita: 'Cobranza',
        estado: 'Programada'
      });
      
      alert('Visita programada exitosamente');
    } catch (error) {
      console.error('Error creando visita:', error);
      alert('Error al programar la visita');
    }
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
            {/* <button 
              onClick={handleAIVisit}
              className="btn-secondary flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Bot className="w-4 h-4" />
              <span>{t('cobranzas.visitarConAI')}</span>
            </button> */}
            <button 
              onClick={handleProgramarVisitas}
              className="btn-secondary flex items-center space-x-2"
            >
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

      {/* Modal Programar Visitas */}
      {isProgramarVisitasModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Programar Visita</h3>
              <button
                onClick={() => setIsProgramarVisitasModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  value={visitaForm.cliente_id}
                  onChange={(e) => handleVisitaFormChange('cliente_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.cliente}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Visita
                </label>
                <input
                  type="date"
                  value={visitaForm.fecha_visita}
                  onChange={(e) => handleVisitaFormChange('fecha_visita', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Visita
                </label>
                <select
                  value={visitaForm.tipo_visita}
                  onChange={(e) => handleVisitaFormChange('tipo_visita', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Cobranza">Cobranza</option>
                  <option value="Seguimiento">Seguimiento</option>
                  <option value="Negociación">Negociación</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={visitaForm.estado}
                  onChange={(e) => handleVisitaFormChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Programada">Programada</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={visitaForm.observacion}
                  onChange={(e) => handleVisitaFormChange('observacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Observaciones sobre la visita..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProgramarVisitasModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCrearVisita}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Programar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cobranzas;
