import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  getFormulasCalculo,
  calcularPrestamoConFormula,
  calcularCuotaMensual,
  calcularTablaAmortizacion,
  getProductosSimulacion
} from '../services/simuladorService';

const SimuladorPrestamos = () => {
  const { t } = useTranslation();
  const [formulas, setFormulas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formulaSeleccionada, setFormulaSeleccionada] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [variables, setVariables] = useState({});
  const [resultado, setResultado] = useState(null);
  const [tablaAmortizacion, setTablaAmortizacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formulasData, productosData] = await Promise.all([
        getFormulasCalculo(),
        getProductosSimulacion()
      ]);
      setFormulas(formulasData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError(t('simulador.errorCargando'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormulaChange = (formulaId) => {
    const formula = formulas.find(f => f.id === formulaId);
    setFormulaSeleccionada(formula);
    
    // Inicializar variables con valores por defecto
    const variablesIniciales = {};
    formula?.variables.forEach(variable => {
      variablesIniciales[variable.nombre] = variable.valor_default || '';
    });
    setVariables(variablesIniciales);
    setResultado(null);
    setTablaAmortizacion([]);
  };

  const handleVariableChange = (variableNombre, valor) => {
    setVariables(prev => ({
      ...prev,
      [variableNombre]: valor
    }));
  };

  // Función para encontrar el valor de una variable por diferentes nombres posibles
  const findVariableValue = (variableName, variables) => {
    const possibleNames = [
      variableName,
      variableName.toLowerCase(),
      variableName.replace(/[_\s]/g, '_'),
      variableName.replace(/[_\s]/g, ''),
      // Nombres comunes en español
      variableName.includes('monto') ? 'monto' : null,
      variableName.includes('plazo') ? 'plazo' : null,
      variableName.includes('tasa') ? 'tasa' : null,
      // Nombres comunes en inglés
      variableName.includes('amount') ? 'amount' : null,
      variableName.includes('period') ? 'period' : null,
      variableName.includes('rate') ? 'rate' : null,
    ].filter(Boolean);

    for (const name of possibleNames) {
      if (variables[name] && variables[name] !== '') {
        return variables[name];
      }
    }
    return null;
  };


  const calcularPrestamo = async () => {
    if (!formulaSeleccionada) {
      setError('Selecciona un tipo de préstamo');
      return;
    }

    // Validar que todas las variables requeridas estén completas
    const variablesRequeridas = formulaSeleccionada.variables.filter(v => v.requerida);
    const variablesFaltantes = variablesRequeridas.filter(v => !variables[v.nombre] || variables[v.nombre] === '');
    
    if (variablesFaltantes.length > 0) {
      setError(`Completa los campos requeridos: ${variablesFaltantes.map(v => v.nombre).join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calcular usando la fórmula seleccionada
      const resultadoFormula = await calcularPrestamoConFormula(formulaSeleccionada.id, variables);
      
      // Extraer valores de las variables dinámicas
      // Buscar el primer valor numérico válido para cada tipo
      let monto = 0;
      let plazo = 0;
      let tasa = 0;
      
      // Buscar cualquier valor que parezca un monto (números grandes)
      for (const [key, value] of Object.entries(variables)) {
        const val = parseFloat(value);
        if (!isNaN(val) && val > 0) {
          // Si es un número grande (probablemente monto)
          if (val >= 100) {
            monto = val;
            break;
          }
        }
      }
      
      // Buscar cualquier valor que parezca un plazo (números pequeños)
      for (const [key, value] of Object.entries(variables)) {
        const val = parseInt(value);
        if (!isNaN(val) && val > 0 && val <= 360) { // Plazos típicos
          plazo = val;
          break;
        }
      }
      
      // Buscar cualquier valor que parezca una tasa (números decimales)
      for (const [key, value] of Object.entries(variables)) {
        const val = parseFloat(value);
        if (!isNaN(val) && val > 0 && val <= 100) { // Tasas típicas
          tasa = val;
          break;
        }
      }
      
      console.log('Variables disponibles:', variables);
      console.log('Valores extraídos:', { monto, plazo, tasa });
      
      // Si no encontramos valores, usar los primeros valores numéricos disponibles
      if (monto === 0 || plazo === 0 || tasa === 0) {
        const numericValues = Object.values(variables)
          .map(v => parseFloat(v))
          .filter(v => !isNaN(v) && v > 0)
          .sort((a, b) => b - a); // Ordenar de mayor a menor
        
        if (numericValues.length >= 3) {
          monto = numericValues[0]; // El más grande
          plazo = numericValues[1]; // El segundo
          tasa = numericValues[2]; // El tercero
        } else {
          setError(`No se encontraron suficientes valores numéricos. Variables: ${JSON.stringify(variables)}`);
          return;
        }
      }
      
      const cuotaMensual = calcularCuotaMensual(monto, tasa, plazo);
      const tabla = calcularTablaAmortizacion(monto, tasa, plazo);
      
      setResultado({
        formula: resultadoFormula,
        cuotaMensual,
        montoTotal: cuotaMensual * plazo,
        interesTotal: (cuotaMensual * plazo) - monto,
        tabla
      });
      
      setTablaAmortizacion(tabla);
    } catch (error) {
      console.error('Error calculando préstamo:', error);
      setError('Error calculando el préstamo');
    } finally {
      setLoading(false);
    }
  };

  const limpiarSimulacion = () => {
    setFormulaSeleccionada(null);
    setProductoSeleccionado(null);
    setVariables({});
    setResultado(null);
    setTablaAmortizacion([]);
    setError(null);
  };

  const exportarTabla = () => {
    if (!tablaAmortizacion.length) return;
    
    const csvContent = [
      'Mes,Cuota,Capital,Interés,Saldo',
      ...tablaAmortizacion.map(fila => 
        `${fila.mes},${fila.cuota.toFixed(2)},${fila.capital.toFixed(2)},${fila.interes.toFixed(2)},${fila.saldo.toFixed(2)}`
      ).join('\n')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tabla_amortizacion_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !resultado) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-2 text-gray-600">{t('simulador.calculando')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calcula cuotas mensuales y genera tablas de amortización</h1>
        <p className="text-gray-600">Simulador de préstamos con fórmulas de cálculo personalizadas</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Configuración */}
        <div className="space-y-6">
          {/* Configuración del Préstamo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Configuración del Préstamo</h3>
            
            {/* Tipo de Préstamo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Préstamo</label>
              <select
                value={formulaSeleccionada?.id || ''}
                onChange={(e) => handleFormulaChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Selecciona un tipo de préstamo</option>
                {formulas.map(formula => (
                  <option key={formula.id} value={formula.id}>
                    {formula.nombre}
                  </option>
                ))}
              </select>
              {formulaSeleccionada && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium text-blue-900">{formulaSeleccionada.nombre}</h4>
                      <p className="text-sm text-blue-700">{formulaSeleccionada.descripcion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Variables de la Fórmula */}
            {formulaSeleccionada && formulaSeleccionada.variables && formulaSeleccionada.variables.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Variables de la Fórmula</h4>
                <div className="space-y-4">
                  {formulaSeleccionada.variables.map(variable => (
                    <div key={variable.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {variable.nombre}
                        {variable.requerida && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={variable.tipo === 'number' ? 'number' : 'text'}
                          value={variables[variable.nombre] || ''}
                          onChange={(e) => handleVariableChange(variable.nombre, e.target.value)}
                          placeholder={variable.descripcion}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        {variable.unidad && (
                          <span className="absolute right-3 top-2 text-gray-500">{variable.unidad}</span>
                        )}
                      </div>
                      {variable.descripcion && (
                        <p className="text-xs text-gray-500 mt-1">{variable.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={calcularPrestamo}
              disabled={loading || !formulaSeleccionada}
              className="w-full mt-6 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Calculando...' : 'Calcular Cuota'}
            </button>
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="space-y-6">
          {resultado ? (
            <>
              {/* Resultados de la Simulación */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Resultados de la Simulación</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${resultado.cuotaMensual.toFixed(2)}
                      </div>
                      <div className="text-lg text-green-800 font-medium">Cuota Mensual</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        ${resultado.montoTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Monto Total</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        ${resultado.interesTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Interés Total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de Amortización */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Tabla de Amortización
                  </h3>
                  <button
                    onClick={exportarTabla}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">{t('simulador.mes')}</th>
                        <th className="text-right py-2 px-3">{t('simulador.cuota')}</th>
                        <th className="text-right py-2 px-3">{t('simulador.capital')}</th>
                        <th className="text-right py-2 px-3">{t('simulador.interes')}</th>
                        <th className="text-right py-2 px-3">{t('simulador.saldo')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablaAmortizacion.slice(0, 12).map((fila, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 px-3">{fila.mes}</td>
                          <td className="py-2 px-3 text-right">${fila.cuota.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right">${fila.capital.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right">${fila.interes.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right">${fila.saldo.toFixed(2)}</td>
                        </tr>
                      ))}
                      {tablaAmortizacion.length > 12 && (
                        <tr>
                          <td colSpan="5" className="py-2 px-3 text-center text-gray-500">
                            ... y {tablaAmortizacion.length - 12} meses más
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resultados de la Simulación</h3>
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Selecciona un tipo de préstamo y configura los parámetros</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimuladorPrestamos;
