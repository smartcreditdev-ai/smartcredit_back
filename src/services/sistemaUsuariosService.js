import { supabase, supabaseAdmin } from '../lib/supabase';

// Verificar si un email ya existe en auth.users
export const verificarEmailExistente = async (email) => {
  try {
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users.find(user => user.email === email);
    return userExists ? true : false;
  } catch (error) {
    console.error('Error verificando email:', error);
    return false;
  }
};

// Obtener todos los usuarios del sistema
export const getSistemaUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('compania', 2)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error obteniendo usuarios del sistema:', error);
    return [];
  }
};

// Crear usuario en auth.users y en tabla usuarios
export const crearUsuarioSistema = async (userData) => {
  try {
    // 1. Verificar si el usuario ya existe en auth.users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users.find(user => user.email === userData.email);
    
    if (userExists) {
      return { 
        success: false, 
        error: 'Un usuario con este email ya existe en el sistema' 
      };
    }

    // 2. Crear usuario en auth.users usando admin API
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        agencia_id: userData.agencia_id
      }
    });

    if (authError) throw authError;

    // 3. Obtener nombre de la agencia
    const { data: agenciaData } = await supabase
      .from('agencias')
      .select('nombre')
      .eq('id', userData.agencia_id)
      .single();

    // 4. Crear registro en tabla usuarios
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: authUser.user.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        rol: userData.rol,
        agencia_id: userData.agencia_id,
        agencia: agenciaData?.nombre || '',
        compania: 2,
        estado: userData.estado || 'Activo',
        aprobado: true,
        fecha_creacion: new Date().toISOString()
      }])
      .select()
      .single();

    if (usuarioError) throw usuarioError;

    return { success: true, data: usuario };
  } catch (error) {
    console.error('Error creando usuario del sistema:', error);
    return { success: false, error: error.message };
  }
};

// Invitar usuario por email
export const invitarUsuario = async (email, userData) => {
  try {
    // 1. Verificar si el usuario ya existe en auth.users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users.find(user => user.email === email);
    
    if (userExists) {
      return { 
        success: false, 
        error: 'Un usuario con este email ya existe en el sistema' 
      };
    }

    // 2. Enviar invitación usando admin API
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        agencia_id: userData.agencia_id
      },
      redirectTo: 'https://www.smartcreditla.com/auth/callback'
    });

    if (authError) throw authError;

    // 3. Obtener nombre de la agencia
    const { data: agenciaData } = await supabase
      .from('agencias')
      .select('nombre')
      .eq('id', userData.agencia_id)
      .single();

    // 4. Crear registro en tabla usuarios
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: authUser.user.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: email,
        rol: userData.rol,
        agencia_id: userData.agencia_id,
        agencia: agenciaData?.nombre || '',
        compania: 2,
        estado: userData.estado || 'Activo',
        aprobado: true,
        fecha_creacion: new Date().toISOString()
      }])
      .select()
      .single();

    if (usuarioError) throw usuarioError;

    return { success: true, data: usuario };
  } catch (error) {
    console.error('Error invitando usuario:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar usuario del sistema
export const actualizarUsuarioSistema = async (userId, userData) => {
  try {
    // 1. Obtener nombre de la agencia si se cambió
    let agenciaNombre = '';
    if (userData.agencia_id) {
      const { data: agenciaData } = await supabase
        .from('agencias')
        .select('nombre')
        .eq('id', userData.agencia_id)
        .single();
      agenciaNombre = agenciaData?.nombre || '';
    }

    // 2. Actualizar en tabla usuarios
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .update({
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        agencia_id: userData.agencia_id,
        agencia: agenciaNombre,
        estado: userData.estado
      })
      .eq('id', userId)
      .eq('compania', 2)
      .select()
      .single();

    if (usuarioError) throw usuarioError;

    // 2. Actualizar metadata en auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        agencia_id: userData.agencia_id
      }
    });

    if (authError) throw authError;

    return { success: true, data: usuario };
  } catch (error) {
    console.error('Error actualizando usuario del sistema:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar usuario del sistema
export const eliminarUsuarioSistema = async (userId) => {
  try {
    // 1. Eliminar de tabla usuarios
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', userId)
      .eq('compania', 2);

    if (usuarioError) throw usuarioError;

    // 2. Eliminar de auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return { success: true };
  } catch (error) {
    console.error('Error eliminando usuario del sistema:', error);
    return { success: false, error: error.message };
  }
};

// Cambiar estado de usuario
export const cambiarEstadoUsuario = async (userId, estado) => {
  try {
  const { data, error } = await supabase
    .from('usuarios')
    .update({
      estado: estado
    })
    .eq('id', userId)
    .eq('compania', 2)
    .select()
    .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    return { success: false, error: error.message };
  }
};

// Obtener agencias para dropdown
export const getAgencias = async () => {
  try {
    console.log('Consultando agencias...');
    const { data, error } = await supabase
      .from('agencias')
      .select('id, nombre')
      .eq('compania', 2)
      .eq('activa', true)
      .order('nombre');

    if (error) {
      console.error('Error en consulta de agencias:', error);
      throw error;
    }

    console.log('Agencias encontradas:', data);
    return data || [];
  } catch (error) {
    console.error('Error obteniendo agencias:', error);
    return [];
  }
};

// Obtener clientes para dropdown
export const getClientes = async () => {
  try {
    console.log('Consultando clientes...');
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre, apellido, email')
      .eq('compania', 2)
      .eq('activo', true)
      .order('nombre');

    if (error) {
      console.error('Error en consulta de clientes:', error);
      throw error;
    }

    console.log('Clientes encontrados:', data);
    return data || [];
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

// Buscar usuarios
export const buscarUsuarios = async (searchTerm, rol = 'all') => {
  try {
    let query = supabase
      .from('usuarios')
      .select('*')
      .eq('compania', 2);

    if (rol !== 'all') {
      query = query.eq('rol', rol);
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

// Obtener estadísticas de usuarios
export const getEstadisticasUsuarios = async () => {
  try {
    const [activosResult, pendientesResult, totalResult] = await Promise.all([
      supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('estado', 'activo')
        .eq('compania', 2),
      supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('estado', 'pendiente')
        .eq('compania', 2),
      supabase
        .from('usuarios')
        .select('id', { count: 'exact' })
        .eq('compania', 2)
    ]);

    return {
      activos: activosResult.count || 0,
      pendientes: pendientesResult.count || 0,
      total: totalResult.count || 0
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { activos: 0, pendientes: 0, total: 0 };
  }
};
