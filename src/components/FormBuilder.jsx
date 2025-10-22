import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  X,
  Eye,
  Settings
} from 'lucide-react';

const FormBuilder = ({ form, onSave, onClose }) => {
  const [formData, setFormData] = useState(form || {
    nombre: '',
    descripcion: '',
    campos: [],
    activo: true
  });

  const [draggedField, setDraggedField] = useState(null);

  const fieldTypes = [
    { value: 'texto', label: 'Texto', icon: '📝' },
    { value: 'numero', label: 'Número', icon: '🔢' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'telefono', label: 'Teléfono', icon: '📱' },
    { value: 'fecha', label: 'Fecha', icon: '📅' },
    { value: 'select', label: 'Selección', icon: '📋' },
    { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { value: 'textarea', label: 'Texto Largo', icon: '📄' },
    { value: 'archivo', label: 'Archivo', icon: '📎' }
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      nombre: `Campo ${formData.campos.length + 1}`,
      tipo: type,
      requerido: false,
      orden: formData.campos.length + 1,
      opciones: type === 'select' ? ['Opción 1', 'Opción 2'] : [],
      placeholder: '',
      validaciones: []
    };

    setFormData(prev => ({
      ...prev,
      campos: [...prev.campos, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.filter(field => field.id !== fieldId)
    }));
  };

  const reorderFields = (fromIndex, toIndex) => {
    const newFields = [...formData.campos];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);

    // Actualizar orden
    const reorderedFields = newFields.map((field, index) => ({
      ...field,
      orden: index + 1
    }));

    setFormData(prev => ({
      ...prev,
      campos: reorderedFields
    }));
  };

  const handleDragStart = (e, index) => {
    setDraggedField(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedField !== null && draggedField !== dropIndex) {
      reorderFields(draggedField, dropIndex);
    }
    setDraggedField(null);
  };

  const addSelectOption = (fieldId) => {
    updateField(fieldId, {
      opciones: [...formData.campos.find(f => f.id === fieldId).opciones, 'Nueva opción']
    });
  };

  const updateSelectOption = (fieldId, optionIndex, value) => {
    const field = formData.campos.find(f => f.id === fieldId);
    const newOpciones = [...field.opciones];
    newOpciones[optionIndex] = value;
    updateField(fieldId, { opciones: newOpciones });
  };

  const removeSelectOption = (fieldId, optionIndex) => {
    const field = formData.campos.find(f => f.id === fieldId);
    const newOpciones = field.opciones.filter((_, index) => index !== optionIndex);
    updateField(fieldId, { opciones: newOpciones });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Constructor de Formularios</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de Configuración */}
            <div className="lg:col-span-1 space-y-6">
              {/* Información del Formulario */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Información del Formulario</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Formulario
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: Formulario de Cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Descripción del formulario..."
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="activo"
                      checked={formData.activo}
                      onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                      Formulario activo
                    </label>
                  </div>
                </div>
              </div>

              {/* Tipos de Campos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Agregar Campos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {fieldTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => addField(type.value)}
                      className="flex items-center space-x-2 p-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel de Campos */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Campos del Formulario</h3>
                
                {formData.campos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay campos agregados</p>
                    <p className="text-sm">Selecciona un tipo de campo para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.campos.map((field, index) => (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span className="text-sm font-medium text-gray-500">
                              Campo {field.orden}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteField(field.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre del Campo
                            </label>
                            <input
                              type="text"
                              value={field.nombre}
                              onChange={(e) => updateField(field.id, { nombre: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo
                            </label>
                            <select
                              value={field.tipo}
                              onChange={(e) => updateField(field.id, { tipo: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              {fieldTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.icon} {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Placeholder
                            </label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Texto de ayuda..."
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`requerido-${field.id}`}
                              checked={field.requerido}
                              onChange={(e) => updateField(field.id, { requerido: e.target.checked })}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`requerido-${field.id}`} className="ml-2 block text-sm text-gray-900">
                              Campo requerido
                            </label>
                          </div>
                        </div>

                        {/* Opciones para campos de selección */}
                        {field.tipo === 'select' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Opciones
                            </label>
                            <div className="space-y-2">
                              {field.opciones.map((opcion, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={opcion}
                                    onChange={(e) => updateSelectOption(field.id, optionIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  <button
                                    onClick={() => removeSelectOption(field.id, optionIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addSelectOption(field.id)}
                                className="text-primary-600 hover:text-primary-800 text-sm flex items-center space-x-1"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Agregar opción</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vista Previa */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Vista Previa</h3>
                <div className="bg-white border border-gray-300 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{formData.nombre || 'Formulario'}</h4>
                  <p className="text-sm text-gray-600 mb-4">{formData.descripcion}</p>
                  
                  <div className="space-y-4">
                    {formData.campos.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.nombre}
                          {field.requerido && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {field.tipo === 'texto' && (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                        
                        {field.tipo === 'email' && (
                          <input
                            type="email"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                        
                        {field.tipo === 'telefono' && (
                          <input
                            type="tel"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                        
                        {field.tipo === 'numero' && (
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                        
                        {field.tipo === 'fecha' && (
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                        
                        {field.tipo === 'select' && (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          >
                            <option value="">Seleccionar...</option>
                            {field.opciones.map((opcion, index) => (
                              <option key={index} value={opcion}>{opcion}</option>
                            ))}
                          </select>
                        )}
                        
                        {field.tipo === 'checkbox' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              disabled
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                              {field.placeholder || 'Acepto los términos'}
                            </label>
                          </div>
                        )}
                        
                        {field.tipo === 'textarea' && (
                          <textarea
                            placeholder={field.placeholder}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                        
                        {field.tipo === 'archivo' && (
                          <input
                            type="file"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Formulario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
