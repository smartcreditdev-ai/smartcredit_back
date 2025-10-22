import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Building,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  X,
  AlertCircle
} from 'lucide-react';
import { getProspectos, eliminarCliente } from '../services/creditosService';
import ProspectForm from './ProspectForm';

const GestionProspectos = () => {
  const { t } = useTranslation();
  const [prospectos, setProspectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProspecto, setEditingProspecto] = useState(null);
  const [viewingProspecto, setViewingProspecto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prospectoToDelete, setProspectoToDelete] = useState(null);
  const [estadosDisponibles, setEstadosDisponibles] = useState([]);

  useEffect(() => {
    loadProspectos();
  }, []);

  const loadProspectos = async () => {
    try {
      setLoading(true);
      const data = await getProspectos();
      setProspectos(data);
      
      // Obtener estados únicos de los prospectos
      const estadosUnicos = [...new Set(data.map(prospecto => prospecto.estado).filter(Boolean))];
      setEstadosDisponibles(estadosUnicos);
    } catch (error) {
      console.error('Error cargando prospectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (prospectData) => {
    try {
      // Aquí implementarías la lógica para crear/actualizar prospecto
      console.log('Guardando prospecto:', prospectData);
      setShowForm(false);
      setEditingProspecto(null);
      loadProspectos();
    } catch (error) {
      console.error('Error guardando prospecto:', error);
      alert('Error guardando prospecto');
    }
  };

  const handleView = (prospecto) => {
    setViewingProspecto(prospecto);
  };

  const handleEdit = (prospecto) => {
    setEditingProspecto(prospecto);
    setShowForm(true);
  };

  const handleDeleteClick = (prospecto) => {
    setProspectoToDelete(prospecto);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (prospectoToDelete) {
      try {
        await eliminarCliente(prospectoToDelete.id);
        loadProspectos();
        setShowDeleteModal(false);
        setProspectoToDelete(null);
      } catch (error) {
        console.error('Error eliminando prospecto:', error);
        alert('Error eliminando prospecto');
      }
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'convertido':
        return 'bg-blue-100 text-blue-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'convertido':
        return <TrendingUp className="w-4 h-4" />;
      case 'rechazado':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const filteredProspectos = prospectos.filter(prospecto => {
    const matchesSearch = prospecto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospecto.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospecto.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospecto.telefono?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || prospecto.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: prospectos.length,
    activos: prospectos.filter(p => p.estado === 'activo').length,
    pendientes: prospectos.filter(p => p.estado === 'pendiente').length,
    convertidos: prospectos.filter(p => p.estado === 'convertido').length,
    rechazados: prospectos.filter(p => p.estado === 'rechazado').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600">Total Prospectos</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600">Activos</p>
              <p className="text-2xl font-bold text-green-800">{stats.activos}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pendientes}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600">Convertidos</p>
              <p className="text-2xl font-bold text-purple-800">{stats.convertidos}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-red-600">Rechazados</p>
              <p className="text-2xl font-bold text-red-800">{stats.rechazados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos los estados</option>
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Prospecto</span>
          </button>
        </div>
      </div>

      {/* Tabla de Prospectos */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Gestión de Prospectos</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredProspectos.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay prospectos</h3>
            <p className="text-gray-500">No se encontraron prospectos con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProspectos.map((prospecto) => (
                  <tr key={prospecto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {prospecto.nombre} {prospecto.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {prospecto.dni}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {prospecto.telefono}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {prospecto.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {prospecto.direccion}
                        </div>
                        <div className="text-gray-500">
                          {prospecto.departamento}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {prospecto.usuarios?.nombre ? 
                          `${prospecto.usuarios.nombre} ${prospecto.usuarios.apellido}` : 
                          'Sin asignar'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prospecto.estado)}`}>
                        {getStatusIcon(prospecto.estado)}
                        <span className="ml-1">{prospecto.estado}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(prospecto.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(prospecto)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          title="Ver Detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(prospecto)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(prospecto)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <ProspectForm
          prospect={editingProspecto}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProspecto(null);
          }}
        />
      )}

      {/* Modal de Ver Detalles */}
      {viewingProspecto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-primary-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Detalles del Prospecto
                  </h2>
                </div>
                <button
                  onClick={() => setViewingProspecto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                      <p className="text-gray-900">{viewingProspecto.nombre} {viewingProspecto.apellido}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">DNI</label>
                      <p className="text-gray-900">{viewingProspecto.dni}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono</label>
                      <p className="text-gray-900">{viewingProspecto.telefono}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{viewingProspecto.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Dirección</label>
                      <p className="text-gray-900">{viewingProspecto.direccion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Departamento</label>
                      <p className="text-gray-900">{viewingProspecto.departamento}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                      <p className="text-gray-900">{viewingProspecto.fecha_nacimiento ? new Date(viewingProspecto.fecha_nacimiento).toLocaleDateString() : 'No especificada'}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Prospecto */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Información del Prospecto
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Agencia</label>
                      <p className="text-gray-900">{viewingProspecto.agencia}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Facilitador</label>
                      <p className="text-gray-900">{viewingProspecto.facilitador}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Campaña</label>
                      <p className="text-gray-900">{viewingProspecto.campaña}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sector Económico</label>
                      <p className="text-gray-900">{viewingProspecto.sector_economico}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Experiencia Banca Comunal</label>
                      <p className="text-gray-900">{viewingProspecto.experiencia_banca_comunal ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Antigüedad del Negocio</label>
                      <p className="text-gray-900">{viewingProspecto.antiguedad_negocio}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tamaño del Negocio</label>
                      <p className="text-gray-900">{viewingProspecto.tamaño_negocio}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Programa Recomendado</label>
                      <p className="text-gray-900">{viewingProspecto.programa_recomendado}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Dónde se Enteró</label>
                      <p className="text-gray-900">{viewingProspecto.donde_se_entero}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Monto Solicitado</label>
                      <p className="text-gray-900">Q {viewingProspecto.monto_solicitado?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Datos Adicionales */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Datos Adicionales
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Grupo Etario</label>
                      <p className="text-gray-900">{viewingProspecto.grupo_etario}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Etnia</label>
                      <p className="text-gray-900">{viewingProspecto.etnia}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Zona</label>
                      <p className="text-gray-900">{viewingProspecto.zona}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${getStatusColor(viewingProspecto.estado)}`}>
                        {getStatusIcon(viewingProspecto.estado)}
                        <span className="ml-1">{viewingProspecto.estado}</span>
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
                      <p className="text-gray-900">{new Date(viewingProspecto.fecha_creacion).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Comentarios */}
                {viewingProspecto.comentarios && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Comentarios
                    </h3>
                    <p className="text-gray-900">{viewingProspecto.comentarios}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setViewingProspecto(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && prospectoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Eliminación
                </h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  ¿Estás seguro de que quieres eliminar este prospecto?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 font-medium">
                    {prospectoToDelete.nombre} {prospectoToDelete.apellido}
                  </p>
                  <p className="text-sm text-red-600">
                    Esta acción es irreversible y eliminará permanentemente todos los datos del prospecto.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProspectoToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar Definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProspectos;
