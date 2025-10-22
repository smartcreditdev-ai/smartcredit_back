import { supabase } from '../lib/supabase';

// Obtener todas las fórmulas de cálculo
export const getFormulas = async () => {
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
      fecha_creacion: formula.fecha_creacion,
      variables: formula.variables_formula?.sort((a, b) => a.orden - b.orden) || []
    })) || [];
  } catch (error) {
    console.error('Error obteniendo fórmulas de cálculo:', error);
    return [];
  }
};

// Crear nueva fórmula
export const createFormula = async (formulaData) => {
  try {
    const { data, error } = await supabase
      .from('formulas_calculo')
      .insert([{
        nombre: formulaData.nombre,
        descripcion: formulaData.descripcion,
        formula: formulaData.formula,
        activa: true,
        compania: 2
      }])
      .select();

    if (error) throw error;

    const formulaId = data[0].id;

    // Crear variables si existen
    if (formulaData.variables && formulaData.variables.length > 0) {
      const variablesData = formulaData.variables.map(variable => ({
        formula_id: formulaId,
        nombre: variable.nombre,
        tipo: variable.tipo,
        descripcion: variable.descripcion,
        valor_default: variable.valor_default,
        requerida: variable.requerida,
        orden: variable.orden,
        unidad: variable.unidad
      }));

      const { error: variablesError } = await supabase
        .from('variables_formula')
        .insert(variablesData);

      if (variablesError) throw variablesError;
    }

    return { success: true, id: formulaId };
  } catch (error) {
    console.error('Error creando fórmula:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar fórmula
export const updateFormula = async (id, formulaData) => {
  try {
    // Actualizar fórmula
    const { error: formulaError } = await supabase
      .from('formulas_calculo')
      .update({
        nombre: formulaData.nombre,
        descripcion: formulaData.descripcion,
        formula: formulaData.formula,
        activa: formulaData.activa
      })
      .eq('id', id)
      .eq('compania', 2);

    if (formulaError) throw formulaError;

    // Eliminar variables existentes
    const { error: deleteError } = await supabase
      .from('variables_formula')
      .delete()
      .eq('formula_id', id);

    if (deleteError) throw deleteError;

    // Crear nuevas variables
    if (formulaData.variables && formulaData.variables.length > 0) {
      const variablesData = formulaData.variables.map(variable => ({
        formula_id: id,
        nombre: variable.nombre,
        tipo: variable.tipo,
        descripcion: variable.descripcion,
        valor_default: variable.valor_default,
        requerida: variable.requerida,
        orden: variable.orden,
        unidad: variable.unidad
      }));

      const { error: variablesError } = await supabase
        .from('variables_formula')
        .insert(variablesData);

      if (variablesError) throw variablesError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error actualizando fórmula:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar fórmula
export const deleteFormula = async (id) => {
  try {
    // Eliminar variables primero
    const { error: variablesError } = await supabase
      .from('variables_formula')
      .delete()
      .eq('formula_id', id);

    if (variablesError) throw variablesError;

    // Eliminar fórmula
    const { error: formulaError } = await supabase
      .from('formulas_calculo')
      .delete()
      .eq('id', id)
      .eq('compania', 2);

    if (formulaError) throw formulaError;

    return { success: true };
  } catch (error) {
    console.error('Error eliminando fórmula:', error);
    return { success: false, error: error.message };
  }
};

// Toggle estado de fórmula
export const toggleFormulaStatus = async (id, activa) => {
  try {
    const { error } = await supabase
      .from('formulas_calculo')
      .update({ activa })
      .eq('id', id)
      .eq('compania', 2);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error cambiando estado de fórmula:', error);
    return { success: false, error: error.message };
  }
};

// Obtener fórmula por ID
export const getFormulaById = async (id) => {
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
      .eq('id', id)
      .eq('compania', 2)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      formula: data.formula,
      activa: data.activa,
      fecha_creacion: data.fecha_creacion,
      variables: data.variables_formula?.sort((a, b) => a.orden - b.orden) || []
    };
  } catch (error) {
    console.error('Error obteniendo fórmula:', error);
    return null;
  }
};
