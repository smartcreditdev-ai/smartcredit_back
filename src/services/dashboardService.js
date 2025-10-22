import { supabase } from '../lib/supabase';

// Helper function para obtener clientes por agencia
const getClientesByAgencia = async (agencyId) => {
  if (!agencyId) return null;
  
  const { data: clientesAgencia } = await supabase
    .from('clientes')
    .select('id')
    .eq('agencia_id', agencyId)
    .eq('compania', 2);
  
  return clientesAgencia?.map(c => c.id) || [];
};

// Helper function para obtener promotores por agencia
const getPromotoresByAgencia = async (agencyId) => {
  if (!agencyId) return null;
  
  const { data: promotoresAgencia } = await supabase
    .from('usuarios')
    .select('id')
    .eq('agencia_id', agencyId)
    .eq('compania', 2);
  
  return promotoresAgencia?.map(p => p.id) || [];
};

// Obtener métricas principales del dashboard
export const getDashboardMetrics = async (agencyId = null) => {
  try {
    // Obtener total de prospectos (clientes)
    let clientesQuery = supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('compania', 2);
    
    if (agencyId) {
      clientesQuery = clientesQuery.eq('agencia_id', agencyId);
    }
    
    const { count: totalClientes, error: errorClientes } = await clientesQuery;

    if (errorClientes) {
      console.error('Error obteniendo clientes:', errorClientes);
      throw errorClientes;
    }

    // Obtener cartera total (suma de montos aprobados)
    let carteraQuery = supabase
      .from('aplicaciones')
      .select('monto_solicitado')
      .eq('estado', 'aprobado')
      .eq('compania', 2);
    
    if (agencyId) {
      const clienteIds = await getClientesByAgencia(agencyId);
      if (clienteIds.length > 0) {
        carteraQuery = carteraQuery.in('cliente_id', clienteIds);
      } else {
        // Si no hay clientes en esta agencia, usar un UUID que no existe
        carteraQuery = carteraQuery.eq('cliente_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
    const { data: carteraData, error: errorCartera } = await carteraQuery;

    if (errorCartera) throw errorCartera;

    const carteraTotal = carteraData?.reduce((sum, app) => sum + (app.monto_solicitado || 0), 0) || 0;
    
    console.log('Debug Dashboard Metrics:', {
      agencyId,
      totalClientes: totalClientes || 0,
      carteraData: carteraData?.length || 0,
      carteraTotal
    });

    // Obtener créditos activos
    let creditosQuery = supabase
      .from('aplicaciones')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'aprobado')
      .eq('compania', 2);
    
    if (agencyId) {
      const clienteIds = await getClientesByAgencia(agencyId);
      if (clienteIds.length > 0) {
        creditosQuery = creditosQuery.in('cliente_id', clienteIds);
      } else {
        // Si no hay clientes en esta agencia, usar un UUID que no existe
        creditosQuery = creditosQuery.eq('cliente_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
    const { count: creditosActivos, error: errorCreditos } = await creditosQuery;

    if (errorCreditos) throw errorCreditos;

    // Obtener solicitudes pendientes
    let solicitudesQuery = supabase
      .from('aplicaciones')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'pendiente')
      .eq('compania', 2);
    
    if (agencyId) {
      const clienteIds = await getClientesByAgencia(agencyId);
      if (clienteIds.length > 0) {
        solicitudesQuery = solicitudesQuery.in('cliente_id', clienteIds);
      } else {
        // Si no hay clientes en esta agencia, usar un UUID que no existe
        solicitudesQuery = solicitudesQuery.eq('cliente_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
    const { count: solicitudesPendientes, error: errorPendientes } = await solicitudesQuery;

    if (errorPendientes) throw errorPendientes;

    // Obtener aprobados este mes
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { count: aprobadosMes, error: errorAprobados } = await supabase
      .from('aplicaciones')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'aprobado')
      .eq('compania', 2)
      .gte('fecha_aprobacion', startOfMonth.toISOString())
      .lte('fecha_aprobacion', endOfMonth.toISOString());

    if (errorAprobados) throw errorAprobados;

    // Obtener promotores activos
    const { count: promotoresActivos, error: errorPromotores } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'Activo')
      .eq('compania', 2);

    if (errorPromotores) throw errorPromotores;

    // Calcular porcentaje de mora
    const { data: moraData, error: errorMora } = await supabase
      .from('aplicaciones')
      .select('estado')
      .eq('compania', 2);

    if (errorMora) throw errorMora;

    const totalAplicaciones = moraData?.length || 0;
    const enMora = moraData?.filter(app => app.estado === 'En mora').length || 0;
    const porcentajeMora = totalAplicaciones > 0 ? (enMora / totalAplicaciones) * 100 : 0;

    return {
      totalClientes: totalClientes || 0,
      carteraTotal,
      creditosActivos: creditosActivos || 0,
      solicitudesPendientes: solicitudesPendientes || 0,
      aprobadosMes: aprobadosMes || 0,
      promotoresActivos: promotoresActivos || 0,
      porcentajeMora: Math.round(porcentajeMora * 100) / 100
    };
  } catch (error) {
    console.error('Error obteniendo métricas del dashboard:', error);
    return {
      totalClientes: 0,
      carteraTotal: 0,
      creditosActivos: 0,
      solicitudesPendientes: 0,
      aprobadosMes: 0,
      promotoresActivos: 0,
      porcentajeMora: 0
    };
  }
};

// Obtener distribución de prospectos por campaña
export const getProspectosPorCampaña = async (agencyId = null) => {
  try {
    let query = supabase
      .from('clientes')
      .select('campaña')
      .eq('compania', 2);
    
    if (agencyId) {
      query = query.eq('agencia_id', agencyId);
    }
    
    const { data, error } = await query;

    if (error) throw error;

    const campañas = {};
    data?.forEach(cliente => {
      const campaña = cliente.campaña || 'Sin campaña';
      campañas[campaña] = (campañas[campaña] || 0) + 1;
    });

    const total = data?.length || 0;
    const distribucion = Object.entries(campañas).map(([campaña, cantidad]) => ({
      campaña,
      cantidad,
      porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0
    }));

    return distribucion;
  } catch (error) {
    console.error('Error obteniendo prospectos por campaña:', error);
    return [];
  }
};

// Obtener fuentes de información
export const getFuentesInformacion = async (agencyId = null) => {
  try {
    let query = supabase
      .from('clientes')
      .select('donde_se_entero')
      .eq('compania', 2);
    
    if (agencyId) {
      query = query.eq('agencia_id', agencyId);
    }
    
    const { data, error } = await query;

    if (error) throw error;

    const fuentes = {};
    data?.forEach(cliente => {
      const fuente = cliente.donde_se_entero || 'Sin especificar';
      fuentes[fuente] = (fuentes[fuente] || 0) + 1;
    });

    return Object.entries(fuentes).map(([fuente, cantidad]) => ({
      fuente,
      cantidad
    }));
  } catch (error) {
    console.error('Error obteniendo fuentes de información:', error);
    return [];
  }
};

// Obtener solicitudes aprobadas vs rechazadas (último mes)
export const getSolicitudesAprobadasVsRechazadas = async (agencyId = null) => {
  try {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    let query = supabase
      .from('aplicaciones')
      .select('estado, fecha_solicitud')
      .eq('compania', 2)
      .gte('fecha_solicitud', startOfMonth.toISOString())
      .lte('fecha_solicitud', endOfMonth.toISOString());
    
    if (agencyId) {
      const clienteIds = await getClientesByAgencia(agencyId);
      if (clienteIds.length > 0) {
        query = query.in('cliente_id', clienteIds);
      } else {
        // Si no hay clientes en esta agencia, usar un UUID que no existe
        query = query.eq('cliente_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
    const { data, error } = await query;

    if (error) throw error;

    const aprobadas = data?.filter(app => app.estado === 'Aprobado').length || 0;
    const rechazadas = data?.filter(app => app.estado === 'Rechazado').length || 0;

    return [
      { estado: 'Aprobadas', cantidad: aprobadas },
      { estado: 'Rechazadas', cantidad: rechazadas }
    ];
  } catch (error) {
    console.error('Error obteniendo solicitudes aprobadas vs rechazadas:', error);
    return [];
  }
};

// Obtener prospectos por departamento
export const getProspectosPorDepartamento = async (agencyId = null) => {
  try {
    let query = supabase
      .from('clientes')
      .select('departamento')
      .eq('compania', 2);
    
    if (agencyId) {
      query = query.eq('agencia_id', agencyId);
    }
    
    const { data, error } = await query;

    if (error) throw error;

    const departamentos = {};
    data?.forEach(cliente => {
      const depto = cliente.departamento || 'Sin departamento';
      departamentos[depto] = (departamentos[depto] || 0) + 1;
    });

    return Object.entries(departamentos).map(([departamento, cantidad]) => ({
      departamento,
      cantidad
    }));
  } catch (error) {
    console.error('Error obteniendo prospectos por departamento:', error);
    return [];
  }
};

// Obtener actividades de promotores
export const getActividadesPromotores = async (agencyId = null) => {
  try {
    let query = supabase
      .from('seguimiento_actividades')
      .select(`
        promotor_id,
        tipo_actividad,
        fecha_actividad
      `)
      .eq('compania', 2)
      .gte('fecha_actividad', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (agencyId) {
      const promotorIds = await getPromotoresByAgencia(agencyId);
      if (promotorIds.length > 0) {
        query = query.in('promotor_id', promotorIds);
      } else {
        // Si no hay promotores en esta agencia, usar un UUID que no existe
        query = query.eq('promotor_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
    const { data: actividades, error } = await query;

    if (error) throw error;

    // Obtener información de usuarios por separado
    const promotorIds = [...new Set(actividades?.map(a => a.promotor_id) || [])];
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido')
      .in('id', promotorIds)
      .eq('compania', 2);

    if (usuariosError) throw usuariosError;

    const usuariosMap = {};
    usuarios?.forEach(usuario => {
      usuariosMap[usuario.id] = usuario;
    });

    const promotores = {};
    const hoy = new Date();

    actividades?.forEach(actividad => {
      const promotorId = actividad.promotor_id;
      const esFutura = new Date(actividad.fecha_actividad) > hoy;
      
      if (!promotores[promotorId]) {
        const usuario = usuariosMap[promotorId];
        promotores[promotorId] = {
          id: promotorId,
          nombre: usuario ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() : 'Promotor desconocido',
          llamadas: 0,
          mensajes: 0,
          visitas: 0,
          completadas: 0,
          programadas: 0
        };
      }

      if (esFutura) {
        promotores[promotorId].programadas++;
      } else {
        promotores[promotorId].completadas++;
        
        switch (actividad.tipo_actividad) {
          case 'llamada':
            promotores[promotorId].llamadas++;
            break;
          case 'sms':
            promotores[promotorId].mensajes++;
            break;
          case 'visita':
            promotores[promotorId].visitas++;
            break;
        }
      }
    });

    return Object.values(promotores);
  } catch (error) {
    console.error('Error obteniendo actividades de promotores:', error);
    return [];
  }
};

// Obtener resumen general de actividades
export const getResumenActividades = async (agencyId = null) => {
  try {
    let query = supabase
      .from('seguimiento_actividades')
      .select('tipo_actividad')
      .eq('compania', 2)
      .gte('fecha_actividad', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (agencyId) {
      const promotorIds = await getPromotoresByAgencia(agencyId);
      if (promotorIds.length > 0) {
        query = query.in('promotor_id', promotorIds);
      } else {
        // Si no hay promotores en esta agencia, usar un UUID que no existe
        query = query.eq('promotor_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
    const { data, error } = await query;

    if (error) throw error;

    const resumen = {
      totalLlamadas: 0,
      totalMensajes: 0,
      totalVisitas: 0
    };

    data?.forEach(actividad => {
      switch (actividad.tipo_actividad) {
        case 'llamada':
          resumen.totalLlamadas++;
          break;
        case 'sms':
          resumen.totalMensajes++;
          break;
        case 'visita':
          resumen.totalVisitas++;
          break;
      }
    });

    return resumen;
  } catch (error) {
    console.error('Error obteniendo resumen de actividades:', error);
    return {
      totalLlamadas: 0,
      totalMensajes: 0,
      totalVisitas: 0
    };
  }
};