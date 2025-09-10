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
  Loader2
} from 'lucide-react';

const Expedientes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
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
      label: 'Abrir',
      onClick: (row) => setSelectedFile(row),
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Files Table */}
        <div className="lg:col-span-2">
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
              onRowClick={(row) => setSelectedFile(row)}
            />
          )}
        </div>

        {/* File Details Panel */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Expediente</h3>
          
          {selectedFile ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Cliente: {selectedFile.cliente}</h4>
                <p className="text-sm text-gray-600">ID: #{selectedFile.id}</p>
                <p className="text-sm text-gray-600">Documento: {selectedFile.documento}</p>
                <p className="text-sm text-gray-600">Sucursal: {selectedFile.sucursal}</p>
                <p className="text-sm text-gray-600">Promotor: {selectedFile.promotor}</p>
              </div>

              {/* Resumen de Créditos */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Resumen de Créditos
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Total Créditos</div>
                    <div className="text-2xl font-bold text-blue-600">{selectedFile.totalCreditos || 0}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">Créditos Activos</div>
                    <div className="text-2xl font-bold text-green-600">{selectedFile.creditosActivos || 0}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg col-span-2">
                    <div className="font-medium text-purple-800">Monto Total Solicitado</div>
                    <div className="text-2xl font-bold text-purple-600">${(selectedFile.montoTotal || 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      setSelectedClient(selectedFile);
                      setShowCreditHistory(true);
                    }}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <History className="w-4 h-4" />
                    <span>Ver Historial Completo</span>
                  </button>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentos
                </h5>
                <div className="space-y-1">
                  {fileDetails[selectedFile.id]?.documentos.map((doc, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {doc.name} ({doc.size})
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  Fotos
                </h5>
                <div className="space-y-1">
                  {fileDetails[selectedFile.id]?.fotos.map((photo, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {photo.name} ({photo.size})
                    </div>
                  ))}
                </div>
              </div>

              {/* Contracts */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Contratos
                </h5>
                <div className="space-y-1">
                  {fileDetails[selectedFile.id]?.contratos.map((contract, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {contract.name} ({contract.size})
                    </div>
                  ))}
                </div>
              </div>

              {/* GPS */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  GPS
                </h5>
                <div className="space-y-1">
                  {fileDetails[selectedFile.id]?.gps.map((location, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {location.name}
                      <br />
                      <span className="text-xs text-gray-500">
                        Lat: {location.lat}, Lng: {location.lng}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* References */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Referencias
                </h5>
                <div className="space-y-1">
                  {fileDetails[selectedFile.id]?.referencias.map((ref, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <div className="font-medium">{ref.name}</div>
                      <div className="text-xs text-gray-500">{ref.phone}</div>
                      <div className="text-xs text-gray-500">{ref.relationship}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Selecciona un expediente para ver los detalles</p>
            </div>
          )}
        </div>
      </div>

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
