import { supabase } from '../lib/supabase';

const COMPANY_ID = 2;

// Obtener cartera de créditos (aplicaciones aprobadas)
export const getCarteraCreditos = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select(`
        id,
        cliente_id,
        monto_solicitado,
        plazo_deseado,
        fecha_aprobacion,
        tasa_interes,
        cuota_mensual,
        fecha_vencimiento,
        dias_mora,
        estado,
        observaciones,
        clientes (
          id,
          nombre,
          apellido,
          dni,
          telefono,
          email,
          direccion,
          compania,
          promotor_id
        ),
        cobranzas (
          id,
          fecha_pago,
          monto,
          tipo_de_pago
        )
      `)
      .eq('estado', 'aprobado')
      .eq('compania', COMPANY_ID)
      .eq('clientes.compania', COMPANY_ID)
      .order('fecha_aprobacion', { ascending: false });

    if (error) throw error;

    // Obtener información de promotores para cada cliente
    const carteraConPromotores = await Promise.all((data || []).map(async (aplicacion) => {
      let promotor = null;
      if (aplicacion.clientes?.promotor_id) {
        try {
          const { data: promotorData } = await supabase
            .from('usuarios')
            .select('nombre, apellido')
            .eq('id', aplicacion.clientes.promotor_id)
            .eq('compania', COMPANY_ID)
            .single();
          
          if (promotorData) {
            promotor = `${promotorData.nombre} ${promotorData.apellido}`;
          }
        } catch (error) {
          console.log('No se pudo obtener promotor:', error);
        }
      }

      // Calcular días de atraso basado en la última fecha de pago
      let diasAtraso = 0;
      if (aplicacion.cobranzas && aplicacion.cobranzas.length > 0) {
        // Ordenar pagos por fecha descendente para obtener el más reciente
        const pagosOrdenados = aplicacion.cobranzas.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
        const ultimoPago = pagosOrdenados[0];
        const fechaUltimoPago = new Date(ultimoPago.fecha_pago);
        const hoy = new Date();
        diasAtraso = Math.floor((hoy - fechaUltimoPago) / (1000 * 60 * 60 * 24));
      } else {
        // Si no hay pagos, calcular desde la fecha de vencimiento
        if (aplicacion.fecha_vencimiento) {
          const fechaVencimiento = new Date(aplicacion.fecha_vencimiento);
          const hoy = new Date();
          diasAtraso = Math.floor((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24));
        }
      }

      return {
        ...aplicacion,
        cliente: `${aplicacion.clientes?.nombre || ''} ${aplicacion.clientes?.apellido || ''}`.trim(),
        dni: aplicacion.clientes?.dni || '',
        telefono: aplicacion.clientes?.telefono || '',
        email: aplicacion.clientes?.email || '',
        direccion: aplicacion.clientes?.direccion || '',
        promotor: promotor,
        dias_mora: diasAtraso // Sobrescribir con el cálculo basado en fecha_pago
      };
    }));

    return carteraConPromotores;
  } catch (error) {
    console.error('Error obteniendo cartera de créditos:', error);
    return [];
  }
};

// Obtener estadísticas de cartera
export const getCarteraStats = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select('monto_solicitado, fecha_aprobacion')
      .eq('estado', 'aprobado')
      .eq('compania', COMPANY_ID);

    if (error) throw error;

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const totalCartera = (data || []).reduce((sum, app) => sum + (app.monto_solicitado || 0), 0);
    const carteraMes = (data || []).filter(app => {
      const fechaAprobacion = new Date(app.fecha_aprobacion);
      return fechaAprobacion >= inicioMes && fechaAprobacion <= finMes;
    }).reduce((sum, app) => sum + (app.monto_solicitado || 0), 0);

    return {
      totalCartera,
      carteraMes,
      totalCreditos: data?.length || 0
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de cartera:', error);
    return { totalCartera: 0, carteraMes: 0, totalCreditos: 0 };
  }
};

// Actualizar estado de crédito
export const actualizarEstadoCredito = async (aplicacionId, nuevoEstado, observaciones = '') => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        estado: nuevoEstado,
        observaciones: observaciones
      })
      .eq('id', aplicacionId)
      .eq('compania', COMPANY_ID)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error actualizando estado de crédito:', error);
    throw error;
  }
};

// Registrar pago en tabla cobranzas
export const registrarPago = async (pagoData) => {
  try {
    const { data, error } = await supabase
      .from('cobranzas')
      .insert([{
        cliente_id: pagoData.cliente_id,
        aplicacion_id: pagoData.aplicacion_id,
        fecha_pago: pagoData.fecha_pago,
        monto: parseFloat(pagoData.monto),
        observaciones: pagoData.observaciones || '',
        estado: pagoData.estado || 'confirmado',
        tipo_de_pago: pagoData.tipo_de_pago || 'total',
        compania: COMPANY_ID,
        fecha_vencimiento: pagoData.fecha_vencimiento || null,
        dias_mora: pagoData.dias_mora || 0,
        monto_capital: pagoData.monto_capital ? parseFloat(pagoData.monto_capital) : null,
        monto_interes: pagoData.monto_interes ? parseFloat(pagoData.monto_interes) : null,
        monto_mora: pagoData.monto_mora ? parseFloat(pagoData.monto_mora) : null,
        usuario_cobrador_id: pagoData.usuario_cobrador_id || null,
        metodo_contacto: pagoData.metodo_contacto || null,
        resultado_contacto: pagoData.resultado_contacto || null
      }])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error registrando pago:', error);
    throw error;
  }
};

// Obtener historial de pagos
export const getHistorialPagos = async (aplicacionId) => {
  try {
    const { data, error } = await supabase
      .from('cobranzas')
      .select(`
        *,
        clientes (
          nombre,
          apellido
        )
      `)
      .eq('aplicacion_id', aplicacionId)
      .eq('compania', COMPANY_ID)
      .order('fecha_pago', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo historial de pagos:', error);
    return [];
  }
};

// Obtener renovaciones
export const getRenovaciones = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select(`
        id,
        cliente_id,
        monto_solicitado,
        plazo_deseado,
        fecha_aprobacion,
        tasa_interes,
        cuota_mensual,
        fecha_vencimiento,
        dias_mora,
        estado,
        observaciones,
        clientes (
          id,
          nombre,
          apellido,
          dni,
          telefono,
          email,
          direccion,
          compania,
          promotor_id
        )
      `)
      .eq('estado', 'Renovación')
      .eq('compania', COMPANY_ID)
      .eq('clientes.compania', COMPANY_ID)
      .order('fecha_aprobacion', { ascending: false });

    if (error) throw error;

    // Obtener información de promotores para cada cliente
    const renovacionesConPromotores = await Promise.all((data || []).map(async (aplicacion) => {
      let promotor = null;
      if (aplicacion.clientes?.promotor_id) {
        try {
          const { data: promotorData } = await supabase
            .from('usuarios')
            .select('nombre, apellido')
            .eq('id', aplicacion.clientes.promotor_id)
            .eq('compania', COMPANY_ID)
            .single();
          
          if (promotorData) {
            promotor = `${promotorData.nombre} ${promotorData.apellido}`;
          }
        } catch (error) {
          console.log('No se pudo obtener promotor:', error);
        }
      }

      return {
        ...aplicacion,
        cliente: `${aplicacion.clientes?.nombre || ''} ${aplicacion.clientes?.apellido || ''}`.trim(),
        dni: aplicacion.clientes?.dni || '',
        telefono: aplicacion.clientes?.telefono || '',
        email: aplicacion.clientes?.email || '',
        direccion: aplicacion.clientes?.direccion || '',
        promotor: promotor
      };
    }));

    return renovacionesConPromotores;
  } catch (error) {
    console.error('Error obteniendo renovaciones:', error);
    return [];
  }
};

// Obtener desertados
export const getDesertados = async () => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .select(`
        id,
        cliente_id,
        monto_solicitado,
        plazo_deseado,
        fecha_aprobacion,
        tasa_interes,
        cuota_mensual,
        fecha_vencimiento,
        dias_mora,
        estado,
        observaciones,
        clientes (
          id,
          nombre,
          apellido,
          dni,
          telefono,
          email,
          direccion,
          compania,
          promotor_id
        )
      `)
      .eq('estado', 'Desertado')
      .eq('compania', COMPANY_ID)
      .eq('clientes.compania', COMPANY_ID)
      .order('fecha_aprobacion', { ascending: false });

    if (error) throw error;

    // Obtener información de promotores para cada cliente
    const desertadosConPromotores = await Promise.all((data || []).map(async (aplicacion) => {
      let promotor = null;
      if (aplicacion.clientes?.promotor_id) {
        try {
          const { data: promotorData } = await supabase
            .from('usuarios')
            .select('nombre, apellido')
            .eq('id', aplicacion.clientes.promotor_id)
            .eq('compania', COMPANY_ID)
            .single();
          
          if (promotorData) {
            promotor = `${promotorData.nombre} ${promotorData.apellido}`;
          }
        } catch (error) {
          console.log('No se pudo obtener promotor:', error);
        }
      }

      return {
        ...aplicacion,
        cliente: `${aplicacion.clientes?.nombre || ''} ${aplicacion.clientes?.apellido || ''}`.trim(),
        dni: aplicacion.clientes?.dni || '',
        telefono: aplicacion.clientes?.telefono || '',
        email: aplicacion.clientes?.email || '',
        direccion: aplicacion.clientes?.direccion || '',
        promotor: promotor
      };
    }));

    return desertadosConPromotores;
  } catch (error) {
    console.error('Error obteniendo desertados:', error);
    return [];
  }
};
