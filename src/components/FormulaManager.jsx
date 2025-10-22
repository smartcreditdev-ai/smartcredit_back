import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calculator, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Code,
  Hash,
  TestTube,
  Play,
  Database,
  Loader2
} from 'lucide-react';
import { 
  getFormulas, 
  createFormula, 
  updateFormula, 
  deleteFormula, 
  toggleFormulaStatus 
} from '../services/formulaService';

const FormulaManager = () => {
  const { t } = useTranslation();
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFormula, setEditingFormula] = useState(null);
  const [testingFormula, setTestingFormula] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    formula: '',
    activa: true,
    variables: []
  });

  const [testData, setTestData] = useState({
    monto: 100000,
    tasa: 12,
    plazo: 12,
    seguro: 0.5
  });

  // Funciones exactas del código viejo
  const N7 = (e, t, r) => {
    const n = t / 100 / 12;
    return n === 0 ? e / r : e * (n * Math.pow(1 + n, r)) / (Math.pow(1 + n, r) - 1);
  };

  const Rxe = (e, t, r) => {
    const n = t / 100 / 12;
    const i = N7(e, t, r);
    const a = [];
    let o = e;
    for (let s = 1; s <= r; s++) {
      const c = o * n;
      const u = i - c;
      o = Math.max(0, o - u);
      a.push({ mes: s, cuota: i, capital: u, interes: c, saldo: o });
    }
    return a;
  };


  useEffect(() => {
    loadFormulas();
  }, []);

  const loadFormulas = async () => {
    setLoading(true);
    try {
      const data = await getFormulas();
      setFormulas(data);
    } catch (error) {
      console.error('Error obteniendo fórmulas de cálculo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariableChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.map((variable, i) => 
        i === index ? { ...variable, [field]: value } : variable
      )
    }));
  };

  const addVariable = () => {
    setFormData(prev => ({
      ...prev,
      variables: [...prev.variables, {
        id: Date.now(),
        nombre: '',
        tipo: 'number',
        descripcion: '',
        valor_default: '',
        requerida: true,
        orden: prev.variables.length + 1,
        unidad: ''
      }]
    }));
  };

  const removeVariable = (index) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingFormula) {
        // Actualizar fórmula existente
        const result = await updateFormula(editingFormula.id, formData);
        if (result.success) {
          await loadFormulas(); // Recargar datos
        } else {
          alert(`Error actualizando fórmula: ${result.error}`);
          return;
        }
      } else {
        // Crear nueva fórmula
        const result = await createFormula(formData);
        if (result.success) {
          await loadFormulas(); // Recargar datos
        } else {
          alert(`Error creando fórmula: ${result.error}`);
          return;
        }
      }
      
      setShowModal(false);
      setEditingFormula(null);
      setFormData({
        nombre: '',
        descripcion: '',
        formula: '',
        activa: true,
        variables: []
      });
    } catch (error) {
      console.error('Error guardando fórmula:', error);
      alert('Error guardando fórmula');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (formula) => {
    setEditingFormula(formula);
    setFormData(formula);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta fórmula?')) {
      try {
        const result = await deleteFormula(id);
        if (result.success) {
          await loadFormulas(); // Recargar datos
        } else {
          alert(`Error eliminando fórmula: ${result.error}`);
        }
      } catch (error) {
        console.error('Error eliminando fórmula:', error);
        alert('Error eliminando fórmula');
      }
    }
  };

  const handleTest = (formula) => {
    setTestingFormula(formula);
    setTestResults(null);
    
    try {
      let result;
      
      // Usar las funciones exactas del código viejo
      if (formula.formula.includes('N7(')) {
        result = N7(testData.monto, testData.tasa, testData.plazo);
      } else if (formula.formula.includes('Rxe(')) {
        result = Rxe(testData.monto, testData.tasa, testData.plazo);
      } else {
        // Evaluar fórmula personalizada
        const testFunction = new Function(
          ...formula.variables.map(v => v.nombre),
          `return ${formula.formula}`
        );
        
        const testValues = formula.variables.map(variable => {
          switch (variable.nombre) {
            case 'monto': return testData.monto;
            case 'tasa': return testData.tasa;
            case 'plazo': return testData.plazo;
            case 'seguro': return testData.seguro;
            default: return variable.valor_default || 0;
          }
        });
        
        result = testFunction(...testValues);
      }
      
      setTestResults({
        success: true,
        result: result,
        formula: formula.formula,
        variables: formula.variables.map((v, i) => ({
          nombre: v.nombre,
          valor: testData[v.nombre] || v.valor_default,
          unidad: v.unidad
        }))
      });
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const result = await toggleFormulaStatus(id, !currentStatus);
      if (result.success) {
        await loadFormulas(); // Recargar datos
      } else {
        alert(`Error cambiando estado: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error cambiando estado');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-primary-500" />
            Gestión de Fórmulas de Cálculo
          </h3>
          <p className="text-gray-600 mt-1">Administra las fórmulas disponibles para el simulador de préstamos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Fórmula
        </button>
      </div>

      {/* Lista de Fórmulas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {formulas.map((formula) => (
          <div key={formula.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{formula.nombre}</h4>
                  <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                    formula.activa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formula.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{formula.descripcion}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Database className="w-4 h-4 mr-1" />
                  {formula.variables.length} variables
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleStatus(formula.id, formula.activa)}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    formula.activa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {formula.activa ? 'Activa' : 'Inactiva'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Code className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Fórmula:</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <code className="text-sm text-gray-800">{formula.formula}</code>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Hash className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Variables:</span>
              </div>
              <div className="space-y-1">
                {formula.variables.map((variable, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">{variable.nombre}</span>
                      <span className="text-gray-400 ml-2">({variable.tipo})</span>
                      {variable.requerida && (
                        <span className="ml-2 px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">Requerida</span>
                      )}
                    </div>
                    <span className="text-gray-400">{variable.unidad}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTest(formula)}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <TestTube className="w-4 h-4 mr-1" />
                  Probar
                </button>
                <button
                  onClick={() => handleEdit(formula)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(formula.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Fórmula */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingFormula ? 'Editar Fórmula' : 'Nueva Fórmula'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingFormula(null);
                    setFormData({
                      nombre: '',
                      descripcion: '',
                      formula: '',
                      activa: true,
                      variables: []
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Fórmula
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ej: Cuota Fija Mensual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="activa"
                      value={formData.activa ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="true">Activa</option>
                      <option value="false">Inactiva</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe qué hace esta fórmula..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fórmula JavaScript
                  </label>
                  <textarea
                    name="formula"
                    value={formData.formula}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    placeholder="N7(monto, tasa, plazo) o monto * (tasa/100/12) * Math.pow(1 + tasa/100/12, plazo) / (Math.pow(1 + tasa/100/12, plazo) - 1)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes usar funciones predefinidas como N7(), Rxe() o escribir fórmulas personalizadas con JavaScript.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Variables de la Fórmula
                    </label>
                    <button
                      onClick={addVariable}
                      className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Variable
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="grid grid-cols-6 gap-3 p-3 border border-gray-200 rounded-lg">
                        <div>
                          <input
                            type="text"
                            value={variable.nombre}
                            onChange={(e) => handleVariableChange(index, 'nombre', e.target.value)}
                            placeholder="Nombre"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <select
                            value={variable.tipo}
                            onChange={(e) => handleVariableChange(index, 'tipo', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="number">Número</option>
                            <option value="string">Texto</option>
                            <option value="boolean">Booleano</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={variable.descripcion}
                            onChange={(e) => handleVariableChange(index, 'descripcion', e.target.value)}
                            placeholder="Descripción"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={variable.valor_default}
                            onChange={(e) => handleVariableChange(index, 'valor_default', e.target.value)}
                            placeholder="Valor por defecto"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={variable.unidad}
                            onChange={(e) => handleVariableChange(index, 'unidad', e.target.value)}
                            placeholder="Unidad"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={variable.requerida}
                              onChange={(e) => handleVariableChange(index, 'requerida', e.target.checked)}
                              className="mr-1"
                            />
                            <span className="text-xs">Requerida</span>
                          </label>
                          <button
                            onClick={() => removeVariable(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingFormula(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Guardando...' : 'Guardar Fórmula'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Prueba */}
      {testingFormula && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Probar Fórmula: {testingFormula.nombre}
                </h3>
                <button
                  onClick={() => {
                    setTestingFormula(null);
                    setTestResults(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valores de Prueba
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {testingFormula.variables.map((variable, index) => (
                      <div key={index}>
                        <label className="block text-xs text-gray-600 mb-1">
                          {variable.nombre} ({variable.unidad})
                        </label>
                        <input
                          type="number"
                          value={testData[variable.nombre] || variable.valor_default}
                          onChange={(e) => setTestData(prev => ({ 
                            ...prev, 
                            [variable.nombre]: parseFloat(e.target.value) 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleTest(testingFormula)}
                  className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ejecutar Prueba
                </button>

                {testResults && (
                  <div className={`p-4 rounded-lg ${
                    testResults.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {testResults.success ? (
                      <div>
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="font-medium text-green-800">Prueba Exitosa</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 mb-2">
                          Resultado: ${testResults.result.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-green-700">
                          <div className="font-medium mb-1">Variables utilizadas:</div>
                          {testResults.variables.map((variable, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{variable.nombre}:</span>
                              <span>{variable.valor} {variable.unidad}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <span className="font-medium text-red-800">Error en la Fórmula</span>
                        </div>
                        <div className="text-sm text-red-700">
                          {testResults.error}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaManager;