import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import ClientCreditHistory from '../components/ClientCreditHistory';
import { useExpedientes } from '../hooks/useSupabaseData';
import { 
  Eye, 
  FileText, 
  Image, 
  MapPin, 
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  CreditCard,
  History,
  Loader2,
  X
} from 'lucide-react';

const Expedientes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showExpedienteModal, setShowExpedienteModal] = useState(false);
  const [filters, setFilters] = useState({
    cliente: '',
    promotor: '',
    sucursal: '',
    fecha: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Obtener datos reales de expedientes
  const { expedientes, loading: expedientesLoading, error: expedientesError } = useExpedientes();

  const filterOptions = [
    {
      key: 'cliente',
      placeholder: 'Cliente',
      value: filters.cliente,
      options: [
        { value: 'juan-perez', label: 'Juan Pérez' },
        { value: 'ana-martinez', label: 'Ana Martínez' },
        { value: 'roberto-silva', label: 'Roberto Silva' }
      ]
    },
    {
      key: 'promotor',
      placeholder: 'Promotor',
      value: filters.promotor,
      options: [
        { value: 'maria-garcia', label: 'María García' },
        { value: 'carlos-lopez', label: 'Carlos López' },
        { value: 'juan-perez', label: 'Juan Pérez' }
      ]
    },
    {
      key: 'sucursal',
      placeholder: 'Sucursal',
      value: filters.sucursal,
      options: [
        { value: 'centro', label: 'Centro' },
        { value: 'norte', label: 'Norte' },
        { value: 'sur', label: 'Sur' }
      ]
    },
    {
      key: 'fecha',
      placeholder: 'Fecha',
      value: filters.fecha,
      options: [
        { value: 'hoy', label: 'Hoy' },
        { value: 'semana', label: 'Esta semana' },
        { value: 'mes', label: 'Este mes' }
      ]
    }
  ];

  const columns = [
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
      key: 'sucursal',
      header: 'Sucursal'
    },
    {
      key: 'promotor',
      header: 'Promotor'
    },
    {
      key: 'creditos',
      header: 'Créditos',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{row.totalCreditos || 0}</span>
          <span className="text-xs text-gray-500">({row.creditosActivos || 0} activos)</span>
        </div>
      )
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (value) => {
        const statusConfig = {
          'Completo': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          'En revisión': { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          'Incompleto': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
        };
        const config = statusConfig[value] || statusConfig['Incompleto'];
        const Icon = config.icon;
        
        return (
          <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
              {value}
            </span>
          </div>
        );
      }
    }
  ];

  // Usar datos reales de expedientes
  const data = React.useMemo(() => {
    if (!expedientes || expedientes.length === 0) return [];
    
    return expedientes.map(expediente => ({
      id: expediente.id,
      cliente: expediente.cliente || 'Cliente sin nombre',
      documento: expediente.dni || 'Sin documento',
      sucursal: expediente.sucursal || 'Sin sucursal',
      promotor: expediente.promotor || 'Sin promotor',
      estado: expediente.estado === 'Aprobado' ? 'Completo' : 
              expediente.estado === 'Pendiente' ? 'En revisión' : 'Incompleto',
      totalCreditos: 1, // Estimado por ahora
      creditosActivos: expediente.estado === 'Aprobado' ? 1 : 0,
      montoTotal: parseFloat(expediente.monto) || 0,
      telefono: expediente.telefono,
      email: expediente.email
    }));
  }, [expedientes]);

  const actions = [
    {
      label: 'Ver Detalles',
      onClick: (row) => {
        setSelectedFile(row);
        setShowExpedienteModal(true);
      },
      variant: 'primary'
    },
    {
      label: 'Historial',
      onClick: (row) => {
        setSelectedClient(row);
        setShowCreditHistory(true);
      },
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

  const fileDetails = {
    '001': {
      documentos: [
        { name: 'DNI.pdf', type: 'documento', size: '2.1 MB' },
        { name: 'Recibo de Sueldo.pdf', type: 'documento', size: '1.5 MB' },
        { name: 'Declaración Jurada.pdf', type: 'documento', size: '0.8 MB' }
      ],
      fotos: [
        { name: 'Foto DNI.jpg', type: 'imagen', size: '1.2 MB' },
        { name: 'Foto Domicilio.jpg', type: 'imagen', size: '2.3 MB' }
      ],
      contratos: [
        { name: 'Contrato Personal.pdf', type: 'documento', size: '3.2 MB' }
      ],
      gps: [
        { name: 'Ubicación Domicilio', type: 'ubicacion', lat: -34.6037, lng: -58.3816 }
      ],
      referencias: [
        { name: 'María López', phone: '+54 11 1234-5678', relationship: 'Familiar' },
        { name: 'Carlos García', phone: '+54 11 8765-4321', relationship: 'Laboral' }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      
      {/* Files Table - Full Width */}
      {expedientesLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando expedientes...</span>
        </div>
      ) : expedientesError ? (
        <div className="text-center text-red-600 py-8">
          <p>Error al cargar los expedientes: {expedientesError}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          actions={actions}
          onRowClick={(row) => {
            setSelectedFile(row);
            setShowExpedienteModal(true);
          }}
        />
      )}

      {/* Modal de Detalles del Expediente */}
      {showExpedienteModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles del Expediente - {selectedFile.cliente}
              </h2>
              <button
                onClick={() => {
                  setShowExpedienteModal(false);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Información del Cliente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Cliente:</span>
                    <p className="text-gray-900">{selectedFile.cliente}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Documento:</span>
                    <p className="text-gray-900">{selectedFile.documento}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Sucursal:</span>
                    <p className="text-gray-900">{selectedFile.sucursal}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Promotor:</span>
                    <p className="text-gray-900">{selectedFile.promotor}</p>
                  </div>
                </div>
              </div>

              {/* Resumen de Créditos */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Resumen de Créditos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="font-medium text-blue-800 mb-1">Total Créditos</div>
                    <div className="text-3xl font-bold text-blue-600">{selectedFile.totalCreditos || 0}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="font-medium text-green-800 mb-1">Créditos Activos</div>
                    <div className="text-3xl font-bold text-green-600">{selectedFile.creditosActivos || 0}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="font-medium text-purple-800 mb-1">Monto Total</div>
                    <div className="text-3xl font-bold text-purple-600">${(selectedFile.montoTotal || 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSelectedClient(selectedFile);
                      setShowCreditHistory(true);
                      setShowExpedienteModal(false);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <History className="w-4 h-4" />
                    <span>Ver Historial Completo</span>
                  </button>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documentos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fileDetails[selectedFile.id]?.documentos.map((doc, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.size}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Ver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fotos */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Fotos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fileDetails[selectedFile.id]?.fotos.map((photo, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{photo.name}</p>
                          <p className="text-sm text-gray-600">{photo.size}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Ver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contratos */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Contratos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fileDetails[selectedFile.id]?.contratos.map((contract, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{contract.name}</p>
                          <p className="text-sm text-gray-600">{contract.size}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Ver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPS */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ubicaciones GPS
                </h3>
                <div className="space-y-3">
                  {fileDetails[selectedFile.id]?.gps.map((location, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{location.name}</p>
                          <p className="text-sm text-gray-600">
                            Lat: {location.lat}, Lng: {location.lng}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Ver en Mapa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referencias */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Referencias
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fileDetails[selectedFile.id]?.referencias.map((ref, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">{ref.name}</p>
                        <p className="text-sm text-gray-600">{ref.phone}</p>
                        <p className="text-sm text-gray-500">{ref.relationship}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowExpedienteModal(false);
                  setSelectedFile(null);
                }}
                className="btn-outline"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setSelectedClient(selectedFile);
                  setShowCreditHistory(true);
                  setShowExpedienteModal(false);
                }}
                className="btn-primary"
              >
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial de Créditos */}
      <ClientCreditHistory
        client={selectedClient}
        onClose={() => {
          setShowCreditHistory(false);
          setSelectedClient(null);
        }}
      />
    </div>
  );
};

export default Expedientes;
