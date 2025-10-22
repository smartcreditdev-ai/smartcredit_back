import React, { useState, useEffect } from 'react';
import { X, Filter, Search, Calendar, User, Phone, MessageSquare, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ActividadesDetalladasModal = ({ isOpen, onClose, promotor }) => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    cliente: 'todos',
    estado: 'todas'
  });
  const [actividadesFiltradas, setActividadesFiltradas] = useState([]);

  useEffect(() => {
    if (isOpen && promotor) {
      cargarActividades();
    }
  }, [isOpen, promotor]);

  useEffect(() => {
    filtrarActividades();
  }, [actividades, filtros]);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('seguimiento_actividades')
        .select(`
          *,
          clientes!cliente_id (
            nombre,
            apellido,
            dni
          )
        `)
        .eq('promotor_id', promotor.id)
        .eq('compania', 2)
        .order('fecha_actividad', { ascending: false });

      if (error) throw error;

      setActividades(data || []);
    } catch (error) {
      console.error('Error cargando actividades:', error);
      setActividades([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarActividades = () => {
    let filtradas = [...actividades];

    if (filtros.cliente !== 'todos') {
      filtradas = filtradas.filter(act => {
        const nombreCompleto = `${act.clientes?.nombre || ''} ${act.clientes?.apellido || ''}`.trim();
        return nombreCompleto.toLowerCase().includes(filtros.cliente.toLowerCase());
      });
    }

    if (filtros.estado !== 'todas') {
      filtradas = filtradas.filter(act => act.resultado === filtros.estado);
    }

    setActividadesFiltradas(filtradas);
  };

  const getIconoActividad = (tipo) => {
    switch (tipo) {
      case 'llamada':
        return <Phone className="w-4 h-4" />;
      case 'mensaje':
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'visita':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getColorActividad = (tipo) => {
    switch (tipo) {
      case 'llamada':
        return 'bg-blue-100 text-blue-800';
      case 'mensaje':
      case 'sms':
        return 'bg-green-100 text-green-800';
      case 'visita':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorResultado = (resultado) => {
    switch (resultado) {
      case 'exitoso':
        return 'bg-green-100 text-green-800';
      case 'fallido':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !promotor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Actividades Detalladas - {promotor.nombre}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {promotor.llamadas} Llamadas
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {promotor.mensajes} Mensajes
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {promotor.visitas} Visitas
              </span>
              <span className="text-gray-500">
                {promotor.completadas} Completadas
              </span>
              <span className="text-gray-500">
                {promotor.programadas} Programadas
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filtros</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={filtros.cliente}
                onChange={(e) => setFiltros({...filtros, cliente: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los clientes</option>
                {[...new Set(actividades
                  .map(a => {
                    const nombre = a.clientes?.nombre || '';
                    const apellido = a.clientes?.apellido || '';
                    return `${nombre} ${apellido}`.trim();
                  })
                  .filter(nombre => nombre.length > 0)
                )].map(cliente => (
                  <option key={cliente} value={cliente}>{cliente}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todas">Todos los resultados</option>
                {[...new Set(actividades.map(a => a.resultado).filter(Boolean))].map(resultado => (
                  <option key={resultado} value={resultado}>
                    {resultado.charAt(0).toUpperCase() + resultado.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {actividadesFiltradas.length} de {actividades.length} actividades
            </div>
            {(filtros.cliente !== 'todos' || filtros.estado !== 'todas') && (
              <button
                onClick={() => setFiltros({ cliente: 'todos', estado: 'todas' })}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Actividades Completadas y Programadas
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : actividadesFiltradas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay actividades que coincidan con los filtros
            </div>
          ) : (
            <div className="space-y-4">
              {actividadesFiltradas.map((actividad, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getColorActividad(actividad.tipo_actividad)}`}>
                        {getIconoActividad(actividad.tipo_actividad)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{actividad.tipo_actividad}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorResultado(actividad.resultado)}`}>
                            {actividad.resultado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Fecha: {formatearFecha(actividad.fecha_actividad)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {actividad.clientes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        {actividad.clientes.nombre} {actividad.clientes.apellido}
                      </div>
                      <div className="text-sm text-gray-600">
                        (DNI: {actividad.clientes.dni})
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Información de Seguimiento:
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Resultado: {actividad.resultado}</div>
                      {actividad.observaciones && (
                        <div className="mt-2">
                          <div className="font-medium">Observaciones:</div>
                          <div className="text-gray-600">{actividad.observaciones}</div>
                        </div>
                      )}
                      {actividad.duracion_minutos && (
                        <div className="mt-1">
                          Duración: {actividad.duracion_minutos} minutos
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActividadesDetalladasModal;
