import { supabase } from '../lib/supabase'

// Servicios para obtener datos de las tablas

// Obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  try {
    // Obtener créditos activos
    const { data: creditosActivos, error: errorCreditos } = await supabase
      .from('aplicaciones')
      .select('id, monto, estado')
      .eq('estado', 'Aprobado')

    if (errorCreditos) throw errorCreditos

    // Obtener cartera total
    const carteraTotal = creditosActivos?.reduce((sum, credito) => sum + parseFloat(credito.monto), 0) || 0

    // Obtener clientes en mora
    const { data: clientesMora, error: errorMora } = await supabase
      .from('cobranzas')
      .select('id, estado')
      .eq('estado', 'En mora')

    if (errorMora) throw errorMora

    // Obtener usuarios activos
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id')

    if (errorUsuarios) throw errorUsuarios

    return {
      creditosActivos: creditosActivos?.length || 0,
      carteraTotal: carteraTotal,
      porcentajeMora: clientesMora?.length || 0,
      promotoresActivos: usuarios?.length || 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error)
    return {
      creditosActivos: 0,
      carteraTotal: 0,
      porcentajeMora: 0,
      promotoresActivos: 0
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

    if (error) throw error

    // Agrupar por rangos de días
    const rangos = {
      '0-30 días': { cantidad: 0, monto: 0, color: '#10B981' },
      '31-60 días': { cantidad: 0, monto: 0, color: '#F59E0B' },
      '61-90 días': { cantidad: 0, monto: 0, color: '#EF4444' },
      '91+ días': { cantidad: 0, monto: 0, color: '#DC2626' }
    }

    data?.forEach(cobranza => {
      // Calcular días de mora basado en fecha de pago
      const fechaVencimiento = new Date(cobranza.fecha_pago)
      const hoy = new Date()
      const diasMora = Math.max(0, Math.floor((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24)))
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
      .select('proposito, monto')
      .eq('estado', 'Aprobado')

    if (error) throw error

    // Agrupar por propósito
    const distribucion = {}
    data?.forEach(aplicacion => {
      const proposito = aplicacion.proposito || 'Sin especificar'
      const monto = parseFloat(aplicacion.monto) || 0

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
      .select('fecha_aprobacion, monto, estado')
      .eq('estado', 'Aprobado')
      .gte('fecha_aprobacion', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    // Agrupar por mes
    const meses = {}
    data?.forEach(aplicacion => {
      const fecha = new Date(aplicacion.fecha_aprobacion)
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      const monto = parseFloat(aplicacion.monto) || 0

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
          monto,
          plazo_meses
        )
      `)
      .eq('estado', 'En mora')

    if (error) throw error

    return data?.map(cobranza => {
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
  } catch (error) {
    console.error('Error obteniendo clientes en mora:', error)
    return []
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
        clientes (
          id,
          nombre,
          apellido,
          telefono,
          email
        )
      `)
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
        clientes (
          id,
          nombre,
          apellido,
          dni,
          telefono,
          email
        )
      `)
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
