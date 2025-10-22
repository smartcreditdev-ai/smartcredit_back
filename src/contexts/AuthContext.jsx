import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Obtener sesión inicial
    getSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Cambio de estado de autenticación:', event, session?.user?.email);
        
        if (session?.user) {
          console.log('✅ Usuario autenticado:', session.user.email);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          console.log('🔄 Estableciendo loading = false después de fetchUserProfile');
          setLoading(false);
        } else {
          console.log('❌ No hay sesión activa');
          setUser(null);
          setUserProfile(null);
          console.log('🔄 Estableciendo loading = false');
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error obteniendo sesión:', error);
        return;
      }

      if (session?.user) {
        console.log('✅ Sesión inicial encontrada:', session.user.email);
        setUser(session.user);
        await fetchUserProfile(session.user.id);
        console.log('🔄 getSession: Estableciendo loading = false después de fetchUserProfile');
        setLoading(false);
      } else {
        console.log('❌ No hay sesión inicial');
        console.log('🔄 getSession: Estableciendo loading = false');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error en getSession:', error);
      console.log('🔄 getSession: Estableciendo loading = false por error');
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    console.log('🔍 Buscando perfil para userId:', userId);
    
    // Crear un perfil básico inmediatamente
    const basicProfile = {
      id: userId,
      email: user?.email || '',
      nombre: user?.user_metadata?.full_name || 'Usuario',
      rol: 'Usuario',
      estado: 'Activo',
      aprobado: true
    };
    
    console.log('✅ Estableciendo perfil básico:', basicProfile);
    setUserProfile(basicProfile);
    
    // Intentar buscar en la base de datos de forma asíncrona (no bloquea)
    setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          console.log('✅ Perfil de usuario encontrado en BD:', data);
          setUserProfile(data);
        }
      } catch (dbError) {
        console.log('ℹ️ Usuario no encontrado en BD, manteniendo perfil básico');
      }
    }, 100);
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ Error en signIn:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('❌ Error en signOut:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isApproved: userProfile?.aprobado === true,
    isActive: userProfile?.estado === 'Activo'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
