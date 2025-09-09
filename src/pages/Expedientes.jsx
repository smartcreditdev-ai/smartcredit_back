import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import { 
  Eye, 
  FileText, 
  Image, 
  MapPin, 
  Users,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const Expedientes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filters, setFilters] = useState({
    cliente: '',
    promotor: '',
    sucursal: '',
    fecha: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

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
      header: 'Cliente'
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

  const data = [
    {
      id: '001',
      cliente: 'Juan Pérez',
      sucursal: 'Centro',
      promotor: 'María García',
      estado: 'Completo'
    },
    {
      id: '002',
      cliente: 'Ana Martínez',
      sucursal: 'Norte',
      promotor: 'Carlos López',
      estado: 'En revisión'
    },
    {
      id: '003',
      cliente: 'Roberto Silva',
      sucursal: 'Sur',
      promotor: 'Juan Pérez',
      estado: 'Incompleto'
    },
    {
      id: '004',
      cliente: 'Laura Rodríguez',
      sucursal: 'Centro',
      promotor: 'Ana Martínez',
      estado: 'Completo'
    },
    {
      id: '005',
      cliente: 'Miguel Torres',
      sucursal: 'Norte',
      promotor: 'María García',
      estado: 'En revisión'
    }
  ];

  const actions = [
    {
      label: 'Abrir',
      onClick: (row) => setSelectedFile(row),
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
          <DataTable
            columns={columns}
            data={data}
            actions={actions}
            onRowClick={(row) => setSelectedFile(row)}
          />
        </div>

        {/* File Details Panel */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Expediente</h3>
          
          {selectedFile ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Cliente: {selectedFile.cliente}</h4>
                <p className="text-sm text-gray-600">ID: #{selectedFile.id}</p>
                <p className="text-sm text-gray-600">Sucursal: {selectedFile.sucursal}</p>
                <p className="text-sm text-gray-600">Promotor: {selectedFile.promotor}</p>
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
    </div>
  );
};

export default Expedientes;
