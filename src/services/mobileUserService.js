import { supabase } from '../lib/supabase';

// Obtener usuarios pendientes de aprobación
export const getPendingUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('aprobado', false)
      .eq('compania', 2)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error obteniendo usuarios pendientes:', error);
    return [];
  }
};

// Obtener usuarios aprobados
export const getApprovedUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('aprobado', true)
      .eq('compania', 2)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error obteniendo usuarios aprobados:', error);
    return [];
  }
};

// Aprobar usuario
export const approveUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        aprobado: true,
        estado: 'Activo'
      })
      .eq('id', userId)
      .eq('compania', 2)
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error aprobando usuario:', error);
    return { success: false, error: error.message };
  }
};

// Rechazar usuario
export const rejectUser = async (userId, motivo) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        aprobado: false,
        estado: 'Rechazado'
      })
      .eq('id', userId)
      .eq('compania', 2)
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error rechazando usuario:', error);
    return { success: false, error: error.message };
  }
};

// Obtener detalles de usuario
export const getUserDetails = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .eq('compania', 2)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error obteniendo detalles de usuario:', error);
    return null;
  }
};

// Actualizar información de usuario
export const updateUserInfo = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(userData)
      .eq('id', userId)
      .eq('compania', 2)
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estadísticas de usuarios
export const getUserStats = async () => {
  try {
    const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
      supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('aprobado', false)
        .eq('compania', 2),
      supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('aprobado', true)
        .eq('compania', 2),
      supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('estado', 'rechazado')
        .eq('compania', 2)
    ]);

    return {
      pending: pendingResult.count || 0,
      approved: approvedResult.count || 0,
      rejected: rejectedResult.count || 0,
      total: (pendingResult.count || 0) + (approvedResult.count || 0) + (rejectedResult.count || 0)
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { pending: 0, approved: 0, rejected: 0, total: 0 };
  }
};

// Buscar usuarios
export const searchUsers = async (searchTerm, status = 'all') => {
  try {
    let query = supabase
      .from('usuarios')
      .select('*')
      .eq('compania', 2);

    if (status !== 'all') {
      if (status === 'pending') {
        query = query.eq('aprobado', false);
      } else if (status === 'approved') {
        query = query.eq('aprobado', true);
      }
    }

    if (searchTerm) {
      query = query.or(`nombre.ilike.%${searchTerm}%,apellido.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query.order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error buscando usuarios:', error);
    return [];
  }
};
