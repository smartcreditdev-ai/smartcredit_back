import { supabase } from '../lib/supabase';

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('compania', 2)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};

// Obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .eq('compania', 2)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
};

// Crear nuevo producto
export const createProducto = async (producto) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        ...producto,
        compania: 2,
        activo: true,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creando producto:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar producto
export const updateProducto = async (id, producto) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update({
        ...producto,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .eq('compania', 2)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar producto (hard delete)
export const deleteProducto = async (id) => {
  try {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
      .eq('compania', 2);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return { success: false, error: error.message };
  }
};

// Activar/Desactivar producto
export const toggleProductoStatus = async (id, activo) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update({ 
        activo,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .eq('compania', 2)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error cambiando estado del producto:', error);
    return { success: false, error: error.message };
  }
};
