import { supabase } from '../lib/supabase';

// Función para calcular cuota mensual (N7 del código viejo)
export const calcularCuotaMensual = (monto, tasaAnual, plazoMeses) => {
  const tasaMensual = tasaAnual / 100 / 12;
  if (tasaMensual === 0) {
    return monto / plazoMeses;
  }
  return monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1);
};

// Función para calcular tabla de amortización (Rxe del código viejo)
export const calcularTablaAmortizacion = (monto, tasaAnual, plazoMeses) => {
  const tasaMensual = tasaAnual / 100 / 12;
  const cuotaMensual = calcularCuotaMensual(monto, tasaAnual, plazoMeses);
  const tabla = [];
  let saldoPendiente = monto;
  
  for (let mes = 1; mes <= plazoMeses; mes++) {
    const interes = saldoPendiente * tasaMensual;
    const capital = cuotaMensual - interes;
    saldoPendiente = Math.max(0, saldoPendiente - capital);
    
    tabla.push({
      mes,
      cuota: cuotaMensual,
      capital,
      interes,
      saldo: saldoPendiente
    });
  }
  
  return tabla;
};

// Obtener fórmulas de cálculo disponibles
export const getFormulasCalculo = async () => {
  try {
    const { data, error } = await supabase
      .from('formulas_calculo')
      .select(`
        *,
        variables_formula (
          id,
          nombre,
          tipo,
          descripcion,
          valor_default,
          requerida,
          orden,
          unidad
        )
      `)
      .eq('activa', true)
      .eq('compania', 2)
      .order('nombre');
    
    if (error) throw error;
    
    return data?.map(formula => ({
      id: formula.id,
      nombre: formula.nombre,
      descripcion: formula.descripcion,
      formula: formula.formula,
      activa: formula.activa,
      variables: formula.variables_formula?.sort((a, b) => a.orden - b.orden) || []
    })) || [];
  } catch (error) {
    console.error('Error obteniendo fórmulas de cálculo:', error);
    return [];
  }
};

// Calcular préstamo usando una fórmula específica
export const calcularPrestamoConFormula = async (formulaId, variables) => {
  try {
    const { data: formula, error } = await supabase
      .from('formulas_calculo')
      .select(`
        *,
        variables_formula (
          id,
          nombre,
          tipo,
          descripcion,
          valor_default,
          requerida,
          orden,
          unidad
        )
      `)
      .eq('id', formulaId)
      .eq('activa', true)
      .single();
    
    if (error) throw error;
    
    // Crear contexto de variables para la fórmula
    const contexto = {};
    formula.variables_formula.forEach(variable => {
      const valor = variables[variable.nombre] || variable.valor_default;
      contexto[variable.nombre] = valor;
    });
    
    // Evaluar la fórmula (esto es un ejemplo básico, en producción se necesitaría un evaluador más seguro)
    const resultado = evaluarFormula(formula.formula, contexto);
    
    return {
      formula: formula,
      variables: contexto,
      resultado: resultado
    };
  } catch (error) {
    console.error('Error calculando préstamo con fórmula:', error);
    throw error;
  }
};

// Función básica para evaluar fórmulas (simplificada)
const evaluarFormula = (formula, variables) => {
  try {
    // Reemplazar variables en la fórmula
    let formulaEvaluable = formula;
    Object.keys(variables).forEach(variable => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      formulaEvaluable = formulaEvaluable.replace(regex, variables[variable]);
    });
    
    // Evaluar la fórmula (en producción usar una librería como math.js para mayor seguridad)
    return eval(formulaEvaluable);
  } catch (error) {
    console.error('Error evaluando fórmula:', error);
    return 0;
  }
};

// Obtener productos disponibles para simulación
export const getProductosSimulacion = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('nombre');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};
