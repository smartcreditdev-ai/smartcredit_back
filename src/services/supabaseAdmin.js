import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con Service Role Key
const supabaseUrl = 'https://muzjglimzoewwhysajmq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11empnbGltem9ld3doeXNham1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMzNTY3MywiZXhwIjoyMDcxOTExNjczfQ.viTxCrU0vNj_o_ZNz_XDmzxRp0rVZY4ZmyLWDKH0ovM';

// Crear cliente de Supabase con Service Role Key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función para invitar usuario por email
export const inviteUserByEmail = async (userData) => {
  try {
    console.log('🔍 Invitando usuario con Service Role Key:', userData.email);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      userData.email,
      {
        data: {
          nombre: userData.nombre,
          apellido: userData.apellido,
          rol: userData.rol,
          estado: userData.estado
        },
        redirectTo: `${window.location.origin}/auth/callback`
      }
    );

    if (authError) {
      console.error('❌ Error en Supabase Auth:', authError);
      throw authError;
    }

    console.log('✅ Usuario invitado en Auth:', authData.user?.id);

    // Crear usuario en la tabla usuarios
    if (authData.user) {
      const { data: usuarioData, error: usuarioError } = await supabaseAdmin
        .from('usuarios')
        .insert([{
          id: authData.user.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          rol: userData.rol,
          estado: userData.estado,
          compania: 2,
          fecha_creacion: new Date().toISOString(),
          ultimo_acceso: null
        }])
        .select();

      if (usuarioError) {
        console.error('❌ Error creando usuario en tabla:', usuarioError);
        throw usuarioError;
      }

      console.log('✅ Usuario creado en tabla usuarios:', usuarioData?.[0]);

      return {
        success: true,
        user: usuarioData?.[0],
        authData: {
          user_id: authData.user.id,
          email_confirmed_at: authData.user.email_confirmed_at,
          invitation_sent_at: authData.user.invitation_sent_at
        }
      };
    }

    throw new Error('No se pudo crear el usuario en Auth');

  } catch (error) {
    console.error('❌ Error invitando usuario por email:', error);
    throw error;
  }
};

// Función para crear usuario normal
export const createUserWithAdmin = async (userData) => {
  try {
    console.log('🔍 Creando usuario con Service Role Key:', userData.email);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: !userData.sendEmail, // Si sendEmail es true, no confirmar automáticamente
      user_metadata: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        estado: userData.estado
      }
    });

    if (authError) {
      console.error('❌ Error en Supabase Auth:', authError);
      throw authError;
    }

    console.log('✅ Usuario creado en Auth:', authData.user?.id);

    // Crear usuario en la tabla usuarios
    if (authData.user) {
      const { data: usuarioData, error: usuarioError } = await supabaseAdmin
        .from('usuarios')
        .insert([{
          id: authData.user.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          rol: userData.rol,
          estado: userData.estado,
          compania: 2,
          fecha_creacion: new Date().toISOString(),
          ultimo_acceso: null
        }])
        .select();

      if (usuarioError) {
        console.error('❌ Error creando usuario en tabla:', usuarioError);
        throw usuarioError;
      }

      console.log('✅ Usuario creado en tabla usuarios:', usuarioData?.[0]);

      return {
        success: true,
        user: usuarioData?.[0],
        authData: {
          user_id: authData.user.id,
          email_confirmed_at: authData.user.email_confirmed_at,
          confirmation_sent_at: authData.user.confirmation_sent_at
        },
        credentials: userData.sendEmail ? {
          email: userData.email,
          password: userData.password
        } : null
      };
    }

    throw new Error('No se pudo crear el usuario en Auth');

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    throw error;
  }
};

export default {
  inviteUserByEmail,
  createUserWithAdmin
};
