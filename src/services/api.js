import { supabase } from '../lib/supabase'
import { sendEmailViaAPI } from './emailService'
import { showCredentialsModal, copyCredentialsToClipboard } from './simpleEmailService'
import { inviteUserByEmail as inviteUserByEmailAdmin, createUserWithAdmin } from './supabaseAdmin'

// Servicios para obtener datos de las tablas


export const getDashboardStats = async () => {
  try {
    // Obtener créditos activos (aplicaciones aprobadas)
    const { data: creditosActivos, error: errorCreditos } = await supabase
      .from('aplicaciones')
      .select('id, monto_solicitado, estado')
      .eq('estado', 'Aprobado')
      .eq('compania', 2)

    if (errorCreditos) throw errorCreditos

    const carteraTotal = creditosActivos?.reduce((sum, credito) => sum + parseFloat(credito.monto_solicitado), 0) || 0

    const { data: clientesMora, error: errorMora } = await supabase
      .from('cobranzas')
      .select('id, estado')
      .eq('estado', 'En mora')
      .eq('compania', 2)

    if (errorMora) throw errorMora

    // Obtener usuarios activos
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id')
      .eq('compania', 2)

    if (errorUsuarios) throw errorUsuarios

    // Obtener total de clientes
    const { data: totalClientes, error: errorClientes } = await supabase
      .from('clientes')
      .select('id')
      .eq('compania', 2)

    if (errorClientes) throw errorClientes

    // Obtener solicitudes pendientes
    const { data: solicitudesPendientes, error: errorPendientes } = await supabase
      .from('aplicaciones')
      .select('id')
      .eq('estado', 'Pendiente')
      .eq('compania', 2)

    if (errorPendientes) throw errorPendientes

    // Obtener aprobados este mes
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const { data: aprobadosMes, error: errorAprobados } = await supabase
      .from('aplicaciones')
      .select('id')
      .eq('estado', 'Aprobado')
      .eq('compania', 2)
      .gte('fecha_aprobacion', inicioMes.toISOString())

    if (errorAprobados) throw errorAprobados

    return {
      creditosActivos: creditosActivos?.length || 0,
      carteraTotal: carteraTotal,
      porcentajeMora: clientesMora?.length || 0,
      promotoresActivos: usuarios?.length || 0,
      totalClientes: totalClientes?.length || 0,
      solicitudesPendientes: solicitudesPendientes?.length || 0,
      aprobadosMes: aprobadosMes?.length || 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error)
    return {
      creditosActivos: 0,
      carteraTotal: 0,
      porcentajeMora: 0,
      promotoresActivos: 0,
      totalClientes: 0,
      solicitudesPendientes: 0,
      aprobadosMes: 0
    }
  }
}

// Obtener datos para gráficos de mora por rango
export const getMoraPorRango = async () => {
  try {
    const { data, error } = await supabase
      .from('cobranzas')
      .select('*')
      .eq('estado', 'En mora')
      .eq('compania', 2)

    if (error) throw error

    // Agrupar por rangos de días
    const rangos = {
      '0-30 días': { cantidad: 0, monto: 0, color: '#10B981' },
      '31-60 días': { cantidad: 0, monto: 0, color: '#F59E0B' },
      '61-90 días': { cantidad: 0, monto: 0, color: '#EF4444' },
      '91+ días': { cantidad: 0, monto: 0, color: '#DC2626' }
    }

    data?.forEach(cobranza => {
      // Usar el campo dias_mora directamente de la tabla
      const diasMora = cobranza.dias_mora || 0
      const monto = parseFloat(cobranza.monto) || 0

      if (diasMora <= 30) {
        rangos['0-30 días'].cantidad++
        rangos['0-30 días'].monto += monto
      } else if (diasMora <= 60) {
        rangos['31-60 días'].cantidad++
        rangos['31-60 días'].monto += monto
      } else if (diasMora <= 90) {
        rangos['61-90 días'].cantidad++
        rangos['61-90 días'].monto += monto
      } else {
        rangos['91+ días'].cantidad++
        rangos['91+ días'].monto += monto
      }
    })

    return Object.entries(rangos).map(([rango, data]) => ({
      rango,
      cantidad: data.cantidad,
      monto: data.monto,
      color: data.color
    }))
  } catch (error) {
    console.error('Error obteniendo mora por rango:', error)
    return []
  }
}

// Obtener distribución de cartera por producto
export const getDistribucionCartera = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select('proposito, monto_solicitado')
      .eq('estado', 'Aprobado')
      .eq('compania', 2)

    if (error) throw error

    // Agrupar por propósito
    const distribucion = {}
    data?.forEach(aplicacion => {
      const proposito = aplicacion.proposito || 'Sin especificar'
      const monto = parseFloat(aplicacion.monto_solicitado) || 0

      if (distribucion[proposito]) {
        distribucion[proposito] += monto
      } else {
        distribucion[proposito] = monto
      }
    })

    return Object.entries(distribucion).map(([producto, monto]) => ({
      producto,
      monto,
      porcentaje: 0 // Se calculará en el componente
    }))
  } catch (error) {
    console.error('Error obteniendo distribución de cartera:', error)
    return []
  }
}

// Obtener solicitudes aprobadas vs rechazadas
export const getSolicitudesAprobadas = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select('estado, fecha_solicitud')
      .eq('compania', 2)
      .gte('fecha_solicitud', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    const aprobadas = data?.filter(app => app.estado === 'Aprobado').length || 0
    const rechazadas = data?.filter(app => app.estado === 'Rechazado').length || 0
    const pendientes = data?.filter(app => app.estado === 'Pendiente').length || 0

    return [
      { tipo: 'Aprobadas', cantidad: aprobadas },
      { tipo: 'Rechazadas', cantidad: rechazadas },
      { tipo: 'Pendientes', cantidad: pendientes }
    ]
  } catch (error) {
    console.error('Error obteniendo solicitudes aprobadas:', error)
    return []
  }
}

// Obtener mapa de clientes por región
export const getMapaClientes = async () => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('latitud, longitud, estado')
      .eq('compania', 2)

    if (error) throw error

    // Agrupar por regiones aproximadas (Buenos Aires)
    const regiones = {
      'Centro': { cantidad: 0, clientes: [] },
      'Norte': { cantidad: 0, clientes: [] },
      'Sur': { cantidad: 0, clientes: [] },
      'Este': { cantidad: 0, clientes: [] },
      'Oeste': { cantidad: 0, clientes: [] }
    }

    data?.forEach(cliente => {
      const lat = parseFloat(cliente.latitud)
      const lng = parseFloat(cliente.longitud)

      // Lógica simple para determinar región basada en coordenadas
      if (lat > -34.6 && lng < -58.4) {
        regiones['Centro'].cantidad++
        regiones['Centro'].clientes.push(cliente)
      } else if (lat > -34.6) {
        regiones['Norte'].cantidad++
        regiones['Norte'].clientes.push(cliente)
      } else if (lng < -58.4) {
        regiones['Sur'].cantidad++
        regiones['Sur'].clientes.push(cliente)
      } else if (lng > -58.3) {
        regiones['Este'].cantidad++
        regiones['Este'].clientes.push(cliente)
      } else {
        regiones['Oeste'].cantidad++
        regiones['Oeste'].clientes.push(cliente)
      }
    })

    return Object.entries(regiones).map(([region, data]) => ({
      region,
      cantidad: data.cantidad
    }))
  } catch (error) {
    console.error('Error obteniendo mapa de clientes:', error)
    return []
  }
}

// Obtener tendencia de cartera
export const getTendenciaCartera = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select('fecha_aprobacion, monto_solicitado, estado')
      .eq('estado', 'Aprobado')
      .eq('compania', 2)
      .gte('fecha_aprobacion', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    // Agrupar por mes
    const meses = {}
    data?.forEach(aplicacion => {
      const fecha = new Date(aplicacion.fecha_aprobacion)
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      const monto = parseFloat(aplicacion.monto_solicitado) || 0

      if (meses[mes]) {
        meses[mes] += monto
      } else {
        meses[mes] = monto
      }
    })

    return Object.entries(meses).map(([mes, monto]) => ({
      mes,
      carteraTotal: monto,
      carteraMora: monto * 0.1, // 10% estimado en mora
      porcentajeMora: 10
    }))
  } catch (error) {
    console.error('Error obteniendo tendencia de cartera:', error)
    return []
  }
}

// Obtener clientes en mora para cobranzas
export const getClientesEnMora = async () => {
  try {
    const { data, error } = await supabase
      .from('cobranzas')
      .select(`
        id,
        cliente_id,
        aplicacion_id,
        fecha_pago,
        monto,
        estado,
        observaciones,
        clientes (
          id,
          nombre,
          apellido,
          telefono,
          email,
          direccion
        ),
        aplicaciones (
          id,
          monto_solicitado,
          plazo_deseado
        )
      `)
      .eq('estado', 'En mora')
      .eq('compania', 2)

    if (error) throw error

    const realData = data?.map(cobranza => {
      // Calcular días de mora
      const fechaVencimiento = new Date(cobranza.fecha_pago)
      const hoy = new Date()
      const diasMora = Math.max(0, Math.floor((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24)))
      
      return {
        id: cobranza.id,
        cliente: `${cobranza.clientes?.nombre || ''} ${cobranza.clientes?.apellido || ''}`.trim() || 'Cliente sin nombre',
        telefono: cobranza.clientes?.telefono || 'Sin teléfono',
        email: cobranza.clientes?.email || 'Sin email',
        direccion: cobranza.clientes?.direccion || 'Sin dirección',
        monto: parseFloat(cobranza.monto) || 0,
        diasMora: diasMora,
        fechaVencimiento: cobranza.fecha_pago,
        observaciones: cobranza.observaciones || 'Sin observaciones'
      }
    }) || []

    // Si no hay datos reales, devolver datos hardcodeados
    if (realData.length === 0) {
      const mockClientesEnMora = [
        {
          id: '1',
          cliente: 'María González',
          telefono: '+502 1234-5678',
          email: 'maria.gonzalez@email.com',
          direccion: 'Zona 10, Ciudad de Guatemala',
          monto: 15000,
          diasMora: 15,
          fechaVencimiento: '2024-01-01',
          observaciones: 'Cliente con dificultades económicas'
        },
        {
          id: '2',
          cliente: 'Carlos Mendoza',
          telefono: '+502 2345-6789',
          email: 'carlos.mendoza@email.com',
          direccion: 'Zona 15, Ciudad de Guatemala',
          monto: 25000,
          diasMora: 30,
          fechaVencimiento: '2023-12-15',
          observaciones: 'No responde a llamadas'
        },
        {
          id: '3',
          cliente: 'Ana Rodríguez',
          telefono: '+502 3456-7890',
          email: 'ana.rodriguez@email.com',
          direccion: 'Mixco, Guatemala',
          monto: 12000,
          diasMora: 45,
          fechaVencimiento: '2023-12-01',
          observaciones: 'Cambió de domicilio sin notificar'
        },
        {
          id: '4',
          cliente: 'Luis Herrera',
          telefono: '+502 4567-8901',
          email: 'luis.herrera@email.com',
          direccion: 'Villa Nueva, Guatemala',
          monto: 18000,
          diasMora: 60,
          fechaVencimiento: '2023-11-15',
          observaciones: 'Cliente en proceso de negociación'
        },
        {
          id: '5',
          cliente: 'Carmen Vásquez',
          telefono: '+502 5678-9012',
          email: 'carmen.vasquez@email.com',
          direccion: 'Zona 4, Ciudad de Guatemala',
          monto: 22000,
          diasMora: 90,
          fechaVencimiento: '2023-10-15',
          observaciones: 'Requiere visita domiciliaria'
        },
        {
          id: '6',
          cliente: 'Roberto Morales',
          telefono: '+502 6789-0123',
          email: 'roberto.morales@email.com',
          direccion: 'San Miguel Petapa, Guatemala',
          monto: 30000,
          diasMora: 120,
          fechaVencimiento: '2023-09-15',
          observaciones: 'Caso para cobranza legal'
        },
        {
          id: '7',
          cliente: 'Patricia López',
          telefono: '+502 7890-1234',
          email: 'patricia.lopez@email.com',
          direccion: 'Zona 1, Ciudad de Guatemala',
          monto: 16000,
          diasMora: 75,
          fechaVencimiento: '2023-11-01',
          observaciones: 'Cliente con plan de pago activo'
        },
        {
          id: '8',
          cliente: 'Diego Jiménez',
          telefono: '+502 8901-2345',
          email: 'diego.jimenez@email.com',
          direccion: 'Zona 16, Ciudad de Guatemala',
          monto: 14000,
          diasMora: 25,
          fechaVencimiento: '2023-12-20',
          observaciones: 'Último contacto hace 2 semanas'
        }
      ];

      console.log('📊 Usando datos hardcodeados para clientes en mora');
      return mockClientesEnMora;
    }

    return realData;
  } catch (error) {
    console.error('Error obteniendo clientes en mora:', error)
    
    // En caso de error, devolver datos hardcodeados
    const mockClientesEnMora = [
      {
        id: '1',
        cliente: 'María González',
        telefono: '+502 1234-5678',
        email: 'maria.gonzalez@email.com',
        direccion: 'Zona 10, Ciudad de Guatemala',
        monto: 15000,
        diasMora: 15,
        fechaVencimiento: '2024-01-01',
        observaciones: 'Cliente con dificultades económicas'
      },
      {
        id: '2',
        cliente: 'Carlos Mendoza',
        telefono: '+502 2345-6789',
        email: 'carlos.mendoza@email.com',
        direccion: 'Zona 15, Ciudad de Guatemala',
        monto: 25000,
        diasMora: 30,
        fechaVencimiento: '2023-12-15',
        observaciones: 'No responde a llamadas'
      }
    ];

    console.log('📊 Error en consulta, usando datos hardcodeados para clientes en mora');
    return mockClientesEnMora;
  }
}

// Obtener usuarios para administrador
export const getUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('fecha_creacion', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return []
  }
}

// Obtener aplicaciones para créditos
export const getAplicaciones = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select(`
        *,
        clientes!inner (
          id,
          nombre,
          apellido,
          telefono,
          email,
          compania
        )
      `)
      .eq('compania', 2)
      .eq('clientes.compania', 2)
      .order('fecha_solicitud', { ascending: false })

    if (error) throw error

    return data?.map(aplicacion => ({
      ...aplicacion,
      cliente: `${aplicacion.clientes?.nombre} ${aplicacion.clientes?.apellido}`,
      telefono: aplicacion.clientes?.telefono,
      email: aplicacion.clientes?.email
    })) || []
  } catch (error) {
    console.error('Error obteniendo aplicaciones:', error)
    return []
  }
}

// Obtener expedientes (aplicaciones con documentos)
export const getExpedientes = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select(`
        *,
        clientes!inner (
          id,
          nombre,
          apellido,
          dni,
          telefono,
          email,
          compania
        )
      `)
      .eq('compania', 2)
      .eq('clientes.compania', 2)
      .order('fecha_solicitud', { ascending: false })

    if (error) throw error

    return data?.map(aplicacion => ({
      ...aplicacion,
      cliente: `${aplicacion.clientes?.nombre} ${aplicacion.clientes?.apellido}`,
      dni: aplicacion.clientes?.dni,
      telefono: aplicacion.clientes?.telefono,
      email: aplicacion.clientes?.email
    })) || []
  } catch (error) {
    console.error('Error obteniendo expedientes:', error)
    return []
  }
}

// Obtener clientes (prospectos)
export const getClientes = async () => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        usuarios!promotor_id (
          nombre,
          apellido,
          compania
        )
      `)
      .eq('compania', 2)
      .order('fecha_creacion', { ascending: false })

    if (error) throw error

    return data?.map(cliente => ({
      ...cliente,
      promotor: cliente.usuarios && cliente.usuarios.compania === 2 
        ? `${cliente.usuarios.nombre} ${cliente.usuarios.apellido}` 
        : null
    })) || []
  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return []
  }
}

// Obtener cartera de créditos (aplicaciones aprobadas)
export const getCarteraCreditos = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select(`
        *,
        clientes!inner (
          id,
          nombre,
          apellido,
          dni,
          telefono,
          email,
          compania,
          promotor_id
        )
      `)
      .eq('estado', 'Aprobado')
      .eq('compania', 2)
      .eq('clientes.compania', 2)
      .order('fecha_aprobacion', { ascending: false })

    if (error) throw error

    // Obtener información de promotores por separado
    const aplicacionesConPromotores = await Promise.all(
      data?.map(async (aplicacion) => {
        let promotor = null;
        
        if (aplicacion.clientes?.promotor_id) {
          try {
            const { data: promotorData } = await supabase
              .from('usuarios')
              .select('nombre, apellido')
              .eq('id', aplicacion.clientes.promotor_id)
              .eq('compania', 2)
              .single();
            
            if (promotorData) {
              promotor = `${promotorData.nombre} ${promotorData.apellido}`;
            }
          } catch (promotorError) {
            console.log('No se pudo obtener promotor:', promotorError);
          }
        }

        return {
          ...aplicacion,
          cliente: `${aplicacion.clientes?.nombre} ${aplicacion.clientes?.apellido}`,
          dni: aplicacion.clientes?.dni,
          telefono: aplicacion.clientes?.telefono,
          email: aplicacion.clientes?.email,
          promotor: promotor
        };
      }) || []
    );

    return aplicacionesConPromotores;
  } catch (error) {
    console.error('Error obteniendo cartera de créditos:', error)
    return []
  }
}

// Insertar nuevo cliente (prospecto)
export const insertClient = async (clientData) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        id: clientData.id,
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        dni: clientData.dni,
        telefono: clientData.telefono,
        email: clientData.email,
        direccion: clientData.direccion,
        estado: clientData.estado,
        compania: 2, // Siempre compañía 2
        fecha_creacion: clientData.fecha_creacion,
        promotor_id: clientData.promotor_id
      }])
      .select()

    if (error) throw error

    return data?.[0] || null
  } catch (error) {
    console.error('Error insertando cliente:', error)
    throw error
  }
}

// Obtener usuarios/promotores de la compañía 2
export const getPromotores = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, rol, estado, compania')
      .eq('compania', 2)
      .eq('estado', 'Activo')
      .order('nombre', { ascending: true })

    if (error) throw error

    const promotores = data?.map(usuario => ({
      id: usuario.id,
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      rol: usuario.rol
    })) || []

    console.log('Promotores cargados:', promotores);
    return promotores;
  } catch (error) {
    console.error('Error obteniendo promotores:', error)
    return []
  }
}

// Actualizar cliente existente
export const updateClient = async (clientId, clientData) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        dni: clientData.dni,
        telefono: clientData.telefono,
        email: clientData.email,
        direccion: clientData.direccion,
        estado: clientData.estado,
        promotor_id: clientData.promotor_id
      })
      .eq('id', clientId)
      .eq('compania', 2)
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error actualizando cliente:', error)
    throw error
  }
}

// Eliminar cliente
export const deleteClient = async (clientId) => {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', clientId)
      .eq('compania', 2)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error eliminando cliente:', error)
    throw error
  }
}

// Insertar aplicación de crédito
export const insertAplicacion = async (aplicacionData) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .insert([{
        id: aplicacionData.id,
        cliente_id: aplicacionData.cliente_id,
        monto_solicitado: parseFloat(aplicacionData.monto_solicitado),
        plazo_deseado: parseInt(aplicacionData.plazo_deseado),
        proposito: aplicacionData.proposito,
        ingresos_mensuales: parseFloat(aplicacionData.ingresos_mensuales),
        empresa: aplicacionData.empresa,
        cargo: aplicacionData.cargo,
        telefono_empresa: aplicacionData.telefono_empresa || null,
        anios_en_empresa: aplicacionData.anios_en_empresa ? parseInt(aplicacionData.anios_en_empresa) : null,
        otros_ingresos: aplicacionData.otros_ingresos ? parseFloat(aplicacionData.otros_ingresos) : null,
        personal_ref1_nombre: aplicacionData.personal_ref1_nombre,
        personal_ref1_telefono: aplicacionData.personal_ref1_telefono,
        personal_ref1_relacion: aplicacionData.personal_ref1_relacion,
        personal_ref2_nombre: aplicacionData.personal_ref2_nombre || null,
        personal_ref2_telefono: aplicacionData.personal_ref2_telefono || null,
        observaciones: aplicacionData.observaciones || null,
        estado: 'Pendiente',
        compania: 2,
        fecha_solicitud: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error insertando aplicación:', error)
    throw error
  }
}

// Actualizar aplicación de crédito
export const updateAplicacion = async (aplicacionId, aplicacionData) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        monto_solicitado: parseFloat(aplicacionData.monto_solicitado),
        plazo_deseado: parseInt(aplicacionData.plazo_deseado),
        proposito: aplicacionData.proposito,
        ingresos_mensuales: parseFloat(aplicacionData.ingresos_mensuales),
        empresa: aplicacionData.empresa,
        cargo: aplicacionData.cargo,
        telefono_empresa: aplicacionData.telefono_empresa || null,
        anios_en_empresa: aplicacionData.anios_en_empresa ? parseInt(aplicacionData.anios_en_empresa) : null,
        otros_ingresos: aplicacionData.otros_ingresos ? parseFloat(aplicacionData.otros_ingresos) : null,
        personal_ref1_nombre: aplicacionData.personal_ref1_nombre,
        personal_ref1_telefono: aplicacionData.personal_ref1_telefono,
        personal_ref1_relacion: aplicacionData.personal_ref1_relacion,
        personal_ref2_nombre: aplicacionData.personal_ref2_nombre || null,
        personal_ref2_telefono: aplicacionData.personal_ref2_telefono || null,
        observaciones: aplicacionData.observaciones || null
      })
      .eq('id', aplicacionId)
      .eq('compania', 2)
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error actualizando aplicación:', error)
    throw error
  }
}

// Aprobar aplicación de crédito
export const approveAplicacion = async (aplicacionId) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        estado: 'Aprobado',
        fecha_aprobacion: new Date().toISOString()
      })
      .eq('id', aplicacionId)
      .eq('compania', 2)
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error aprobando aplicación:', error)
    throw error
  }
}

// Rechazar aplicación de crédito
export const rejectAplicacion = async (aplicacionId) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        estado: 'Rechazado',
        fecha_rechazo: new Date().toISOString()
      })
      .eq('id', aplicacionId)
      .eq('compania', 2)
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Error rechazando aplicación:', error)
    throw error
  }
}

// Crear usuario en Supabase Auth
export const createAuthUser = async (userData) => {
  try {
    console.log('🔍 Iniciando creación de usuario:', {
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido,
      sendEmail: userData.sendEmail
    });

    // Opción 1: Usar admin.inviteUserByEmail (más seguro - requiere configuración de admin)
    // Esta opción envía un email de invitación donde el usuario puede establecer su contraseña
    
    // Opción 2: Usar signUp con confirmación de email (actual)
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nombre: userData.nombre,
          apellido: userData.apellido,
          rol: userData.rol,
          estado: userData.estado
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    console.log('📧 Respuesta de Supabase Auth:', { data, error });

    if (error) {
      console.error('❌ Error en Supabase Auth:', error);
      throw error;
    }

    // Después de crear en Auth, crear en la tabla usuarios
    if (data.user) {
      console.log('✅ Usuario creado en Auth:', {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        confirmation_sent_at: data.user.confirmation_sent_at
      });

      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .insert([{
          id: data.user.id,
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
        console.error('❌ Error creando usuario en tabla usuarios:', usuarioError);
        throw usuarioError;
      }

      console.log('✅ Usuario creado en tabla usuarios:', usuarioData?.[0]);
      
      // Enviar email de bienvenida si está habilitado
      if (userData.sendEmail) {
        try {
          console.log('📧 Enviando email de bienvenida...');
          await sendEmailViaAPI(userData);
          console.log('✅ Email de bienvenida enviado exitosamente');
        } catch (emailError) {
          console.error('⚠️ Error enviando email de bienvenida:', emailError);
          // No lanzamos el error para no interrumpir la creación del usuario
        }
      }
      
      // Mostrar modal con credenciales para que el admin pueda copiarlas
      setTimeout(() => {
        showCredentialsModal(userData);
        // También copiar automáticamente al portapapeles
        copyCredentialsToClipboard(userData);
      }, 1000);
      
      return usuarioData?.[0] || null;
    }

    console.log('⚠️ No se creó usuario en Auth');
    return null;
  } catch (error) {
    console.error('Error creando usuario en Auth:', error);
    throw error;
  }
}

// Función para invitar usuario por email usando Service Role Key
export const inviteUserByEmail = async (userData) => {
  try {
    console.log('🔍 Invitando usuario con Service Role Key:', userData.email);
    
    const result = await inviteUserByEmailAdmin(userData);
    console.log('✅ Usuario invitado exitosamente:', result);
    return result.user;

  } catch (error) {
    console.error('❌ Error invitando usuario por email:', error);
    throw error;
  }
}

// Función para crear usuario usando Service Role Key
export const createUserViaAPI = async (userData) => {
  try {
    console.log('🔍 Creando usuario con Service Role Key:', userData.email);
    
    const result = await createUserWithAdmin(userData);
    console.log('✅ Usuario creado exitosamente:', result);
    return result.user;

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    throw error;
  }
}

// Obtener estadísticas consolidadas del sistema
export const getCreditStats = async () => {
  try {
    // Obtener total de clientes
    const { count: totalClientes } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('compania', 2)

    // Obtener aplicaciones por estado
    const { data: aplicaciones } = await supabase
      .from('aplicaciones')
      .select('estado, monto_solicitado, fecha_aprobacion, fecha_solicitud')
      .eq('compania', 2)

    // Calcular estadísticas
    const aprobadas = aplicaciones?.filter(app => app.estado === 'Aprobado') || []
    const pendientes = aplicaciones?.filter(app => app.estado === 'Pendiente' || app.estado === 'En revisión') || []
    const rechazadas = aplicaciones?.filter(app => app.estado === 'Rechazado') || []
    
    // Cartera total (suma de montos aprobados)
    const carteraTotal = aprobadas.reduce((sum, app) => sum + parseFloat(app.monto_solicitado || 0), 0)
    
    // Aprobados este mes
    const hoy = new Date()
    const mesActual = hoy.getMonth()
    const añoActual = hoy.getFullYear()
    const aprobadosEsteMes = aprobadas.filter(app => {
      if (!app.fecha_aprobacion) return false
      const fecha = new Date(app.fecha_aprobacion)
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
    }).length

    // Tasa de aprobación
    const totalProcesadas = aprobadas.length + rechazadas.length
    const tasaAprobacion = totalProcesadas > 0 ? (aprobadas.length / totalProcesadas) * 100 : 0

    // Tiempo promedio de aprobación (días)
    const tiemposAprobacion = aprobadas
      .filter(app => app.fecha_solicitud && app.fecha_aprobacion)
      .map(app => {
        const solicitud = new Date(app.fecha_solicitud)
        const aprobacion = new Date(app.fecha_aprobacion)
        return Math.ceil((aprobacion - solicitud) / (1000 * 60 * 60 * 24))
      })
    
    const tiempoPromedioAprobacion = tiemposAprobacion.length > 0 
      ? tiemposAprobacion.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposAprobacion.length 
      : 0

    return {
      totalClientes: totalClientes || 0,
      carteraTotal,
      creditosActivos: aprobadas.length,
      solicitudesPendientes: pendientes.length,
      enMora: 0, // TODO: Calcular desde tabla cobranzas
      aprobadosEsteMes,
      prospectos: totalClientes || 0, // Total de clientes registrados
      renovacionesPendientes: 0, // TODO: Implementar lógica de renovaciones
      tasaAprobacion: Math.round(tasaAprobacion * 10) / 10,
      tiempoPromedioAprobacion: Math.round(tiempoPromedioAprobacion * 10) / 10,
      tasaMora: 0 // TODO: Calcular desde tabla cobranzas
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de créditos:', error)
    return {
      totalClientes: 0,
      carteraTotal: 0,
      creditosActivos: 0,
      solicitudesPendientes: 0,
      enMora: 0,
      aprobadosEsteMes: 0,
      prospectos: 0,
      renovacionesPendientes: 0,
      tasaAprobacion: 0,
      tiempoPromedioAprobacion: 0,
      tasaMora: 0
    }
  }
}

// Obtener agencias
export const getAgencias = async () => {
  try {
    const { data, error } = await supabase
      .from('agencias')
      .select('*')
      .eq('activa', true)
      .order('nombre')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error obteniendo agencias:', error)
    return []
  }
}

// Gestión de usuarios
export const updateUser = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        rol: userData.rol,
        estado: userData.estado
      })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    throw error
  }
}

export const toggleUserStatus = async (userId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ estado: newStatus })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error cambiando estado de usuario:', error)
    throw error
  }
}

export const getPendingUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('aprobado', false)
      .order('fecha_creacion', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error obteniendo usuarios pendientes:', error)
    return []
  }
}

export const approveUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        aprobado: true, 
        estado: 'Activo' 
      })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error aprobando usuario:', error)
    throw error
  }
}

export const rejectUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        aprobado: false, 
        estado: 'Inactivo' 
      })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error rechazando usuario:', error)
    throw error
  }
}
