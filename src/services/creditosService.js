// Servicios para el módulo de créditos basados en el código viejo
import { supabase } from '../lib/supabase';

const COMPANY_ID = 2; // Hardcoded company ID as per old code analysis

// ===== SEGUIMIENTO DE PROSPECTOS =====

// Obtener clientes/prospectos con información del promotor
export const getProspectos = async (filter = "all") => {
  try {
    let query = supabase
      .from("clientes")
      .select(`
        id,
        nombre,
        apellido,
        telefono,
        telefono_adicional,
        email,
        direccion,
        dni,
        fecha_nacimiento,
        estado,
        promotor_id,
        agencia_id,
        agencia,
        sector_economico,
        departamento,
        zona,
        etnia,
        grupo_etario,
        facilitador,
        campaña,
        donde_se_entero,
        programa_recomendado,
        tipo_garantia,
        antiguedad_negocio,
        tamaño_negocio,
        experiencia_banca_comunal,
        monto_solicitado,
        latitud,
        longitud,
        comentarios,
        dni_image,
        photos,
        fecha_creacion,
        usuarios!promotor_id (
          nombre,
          apellido,
          compania
        )
      `)
      .eq("compania", COMPANY_ID)
      .order("fecha_creacion", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(cliente => ({
      ...cliente,
      promotor: cliente.usuarios && cliente.usuarios.compania === COMPANY_ID 
        ? `${cliente.usuarios.nombre} ${cliente.usuarios.apellido}` 
        : null
    }));
  } catch (error) {
    console.error("Error obteniendo prospectos:", error);
    return [];
  }
};

// Registrar seguimiento de prospecto
export const registrarSeguimiento = async (aplicacionId, tipoSeguimiento, datos) => {
  try {
    const { codigoCliente, codigoGrupo, montoDesembolsado, proximaVisita, motivoRechazo } = datos;
    
    let estado = "";
    let observaciones = `Tipo de seguimiento: ${tipoSeguimiento}`;
    
    switch (tipoSeguimiento) {
      case "aprobacion":
        estado = "aprobado";
        if (codigoCliente) observaciones += `\nCódigo Cliente: ${codigoCliente}`;
        if (codigoGrupo) observaciones += `\nCódigo Grupo: ${codigoGrupo}`;
        if (montoDesembolsado) observaciones += `\nMonto Desembolsado: $${montoDesembolsado.toLocaleString()}`;
        break;
      case "credito_futuro":
        estado = "credito_futuro";
        if (proximaVisita) observaciones += `\nPróxima Visita: ${proximaVisita}`;
        break;
      case "rechazo":
        estado = "rechazo_prospecto";
        if (motivoRechazo) observaciones += `\nMotivo Rechazo: ${motivoRechazo}`;
        break;
    }

    const { data, error } = await supabase
      .from("aplicaciones")
      .update({
        estado: estado,
        observaciones: observaciones,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq("id", aplicacionId)
      .eq("compania", COMPANY_ID)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error registrando seguimiento:", error);
    throw error;
  }
};

// Crear nuevo prospecto/cliente
export const crearProspecto = async (prospectoData) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .insert([{
        nombre: prospectoData.nombre,
        apellido: prospectoData.apellido,
        telefono: prospectoData.telefono,
        telefono_adicional: prospectoData.telefono_adicional || null,
        email: prospectoData.email,
        direccion: prospectoData.direccion,
        dni: prospectoData.dni,
        fecha_nacimiento: prospectoData.fecha_nacimiento || null,
        estado: prospectoData.estado || 'activo',
        promotor_id: prospectoData.promotor_id || null,
        agencia_id: prospectoData.agencia_id || null,
        agencia: prospectoData.agencia || null,
        sector_economico: prospectoData.sector_economico || null,
        departamento: prospectoData.departamento || null,
        zona: prospectoData.zona || null,
        etnia: prospectoData.etnia || null,
        grupo_etario: prospectoData.grupo_etario || null,
        facilitador: prospectoData.facilitador || null,
        campaña: prospectoData.campaña || null,
        donde_se_entero: prospectoData.donde_se_entero || null,
        programa_recomendado: prospectoData.programa_recomendado || null,
        tipo_garantia: prospectoData.tipo_garantia || null,
        antiguedad_negocio: prospectoData.antiguedad_negocio || null,
        tamaño_negocio: prospectoData.tamaño_negocio || null,
        experiencia_banca_comunal: prospectoData.experiencia_banca_comunal || false,
        monto_solicitado: prospectoData.monto_solicitado || null,
        latitud: prospectoData.latitud || null,
        longitud: prospectoData.longitud || null,
        comentarios: prospectoData.comentarios || null,
        dni_image: prospectoData.dni_image || null,
        photos: prospectoData.photos || null,
        compania: COMPANY_ID,
        fecha_creacion: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error creando prospecto:", error);
    throw error;
  }
};

// Actualizar prospecto/cliente
export const actualizarProspecto = async (clienteId, prospectoData) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .update({
        nombre: prospectoData.nombre,
        apellido: prospectoData.apellido,
        telefono: prospectoData.telefono,
        telefono_adicional: prospectoData.telefono_adicional || null,
        email: prospectoData.email,
        direccion: prospectoData.direccion,
        dni: prospectoData.dni,
        fecha_nacimiento: prospectoData.fecha_nacimiento || null,
        estado: prospectoData.estado || 'activo',
        promotor_id: prospectoData.promotor_id || null,
        agencia_id: prospectoData.agencia_id || null,
        agencia: prospectoData.agencia || null,
        sector_economico: prospectoData.sector_economico || null,
        departamento: prospectoData.departamento || null,
        zona: prospectoData.zona || null,
        etnia: prospectoData.etnia || null,
        grupo_etario: prospectoData.grupo_etario || null,
        facilitador: prospectoData.facilitador || null,
        campaña: prospectoData.campaña || null,
        donde_se_entero: prospectoData.donde_se_entero || null,
        programa_recomendado: prospectoData.programa_recomendado || null,
        tipo_garantia: prospectoData.tipo_garantia || null,
        antiguedad_negocio: prospectoData.antiguedad_negocio || null,
        tamaño_negocio: prospectoData.tamaño_negocio || null,
        experiencia_banca_comunal: prospectoData.experiencia_banca_comunal || false,
        monto_solicitado: prospectoData.monto_solicitado || null,
        latitud: prospectoData.latitud || null,
        longitud: prospectoData.longitud || null,
        comentarios: prospectoData.comentarios || null,
        dni_image: prospectoData.dni_image || null,
        photos: prospectoData.photos || null
      })
      .eq("id", clienteId)
      .eq("compania", COMPANY_ID)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error actualizando prospecto:", error);
    throw error;
  }
};

// Eliminar cliente/prospecto
export const eliminarCliente = async (clienteId) => {
  try {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", clienteId)
      .eq("compania", COMPANY_ID);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    throw error;
  }
};

// ===== SOLICITUD DE CRÉDITO =====

// Obtener aplicaciones/solicitudes de crédito
export const getAplicaciones = async (searchTerm = '', filterStatus = 'all') => {
  try {
    let query = supabase
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
          dni_image,
          photos
        ),
        productos (
          id,
          nombre
        )
      `)
      .eq('compania', COMPANY_ID)
      .order('fecha_solicitud', { ascending: false });

    if (searchTerm) {
      query = query.or(`clientes.nombre.ilike.%${searchTerm}%,clientes.apellido.ilike.%${searchTerm}%,clientes.dni.ilike.%${searchTerm}%`);
    }
    if (filterStatus !== 'all') {
      query = query.eq('estado', filterStatus);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(app => ({
      ...app,
      cliente_nombre: app.clientes ? `${app.clientes.nombre} ${app.clientes.apellido}` : 'N/A',
      cliente_dni: app.clientes ? app.clientes.dni : 'N/A',
      cliente_telefono: app.clientes ? app.clientes.telefono : 'N/A',
      cliente_email: app.clientes ? app.clientes.email : 'N/A',
      dni_image: app.clientes ? app.clientes.dni_image : null,
      photos: app.clientes ? app.clientes.photos : null,
      producto_nombre: app.productos ? app.productos.nombre : 'N/A'
    })) || [];
  } catch (error) {
    console.error('Error obteniendo aplicaciones:', error);
    return [];
  }
};

// Crear nueva aplicación/solicitud de crédito
export const crearAplicacion = async (aplicacionData) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .insert([{
        cliente_id: aplicacionData.cliente_id,
        monto_solicitado: parseFloat(aplicacionData.monto_solicitado),
        plazo_deseado: parseInt(aplicacionData.plazo_deseado),
        product_id: parseInt(aplicacionData.product_id),
        ingresos_mensuales: parseFloat(aplicacionData.ingresos_mensuales),
        otros_ingresos: aplicacionData.otros_ingresos ? parseFloat(aplicacionData.otros_ingresos) : null,
        empresa: aplicacionData.empresa,
        cargo: aplicacionData.cargo,
        telefono_empresa: aplicacionData.telefono_empresa || null,
        anios_en_empresa: aplicacionData.anios_en_empresa ? parseInt(aplicacionData.anios_en_empresa) : null,
        personal_ref1_nombre: aplicacionData.personal_ref1_nombre,
        personal_ref1_telefono: aplicacionData.personal_ref1_telefono,
        personal_ref1_relacion: aplicacionData.personal_ref1_relacion,
        personal_ref2_nombre: aplicacionData.personal_ref2_nombre || null,
        personal_ref2_telefono: aplicacionData.personal_ref2_telefono || null,
        proposito: aplicacionData.proposito || null,
        observaciones: aplicacionData.observaciones || null,
        documento: aplicacionData.documento || null,
        comprobante_ingresos: aplicacionData.comprobante_ingresos || null,
        estado: aplicacionData.estado || 'pendiente',
        compania: COMPANY_ID,
        fecha_solicitud: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creando aplicación:', error);
    throw error;
  }
};

// Actualizar aplicación/solicitud de crédito
export const actualizarAplicacion = async (aplicacionId, aplicacionData) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        cliente_id: aplicacionData.cliente_id,
        monto_solicitado: parseFloat(aplicacionData.monto_solicitado),
        plazo_deseado: parseInt(aplicacionData.plazo_deseado),
        product_id: parseInt(aplicacionData.product_id),
        ingresos_mensuales: parseFloat(aplicacionData.ingresos_mensuales),
        otros_ingresos: aplicacionData.otros_ingresos ? parseFloat(aplicacionData.otros_ingresos) : null,
        empresa: aplicacionData.empresa,
        cargo: aplicacionData.cargo,
        telefono_empresa: aplicacionData.telefono_empresa || null,
        anios_en_empresa: aplicacionData.anios_en_empresa ? parseInt(aplicacionData.anios_en_empresa) : null,
        personal_ref1_nombre: aplicacionData.personal_ref1_nombre,
        personal_ref1_telefono: aplicacionData.personal_ref1_telefono,
        personal_ref1_relacion: aplicacionData.personal_ref1_relacion,
        personal_ref2_nombre: aplicacionData.personal_ref2_nombre || null,
        personal_ref2_telefono: aplicacionData.personal_ref2_telefono || null,
        proposito: aplicacionData.proposito || null,
        observaciones: aplicacionData.observaciones || null,
        documento: aplicacionData.documento || null,
        comprobante_ingresos: aplicacionData.comprobante_ingresos || null,
        estado: aplicacionData.estado || 'pendiente'
      })
      .eq('id', aplicacionId)
      .eq('compania', COMPANY_ID)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error actualizando aplicación:', error);
    throw error;
  }
};

// Actualizar solo el estado de una aplicación
export const actualizarEstadoAplicacion = async (aplicacionId, nuevoEstado) => {
  try {
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        estado: nuevoEstado
      })
      .eq('id', aplicacionId)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error actualizando estado de aplicación:', error);
    throw error;
  }
};

// Actualizar datos del cliente
export const actualizarDatosCliente = async (clienteId, datosCliente) => {
  try {
    console.log('Actualizando cliente:', clienteId, datosCliente);
    
    const { data, error } = await supabase
      .from('clientes')
      .update(datosCliente)
      .eq('id', clienteId)
      .select();

    if (error) {
      console.error('Error de Supabase:', error);
      throw error;
    }
    
    console.log('Cliente actualizado exitosamente:', data);
    return data?.[0] || null;
  } catch (error) {
    console.error('Error actualizando datos del cliente:', error);
    throw error;
  }
};

// Eliminar aplicación/solicitud de crédito
export const eliminarAplicacion = async (aplicacionId) => {
  try {
    const { error } = await supabase
      .from('aplicaciones')
      .delete()
      .eq('id', aplicacionId)
      .eq('compania', COMPANY_ID);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error eliminando aplicación:', error);
    throw error;
  }
};

// Obtener productos disponibles
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('id, nombre, descripcion')
      .eq('compania', COMPANY_ID)
      .eq('activo', true);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};

// ===== SEGUIMIENTO DE ACTIVIDADES =====

// Obtener actividades de promotores
export const getActividadesPromotores = async (promotorId = null, clienteId = null) => {
  try {
    let query = supabase
      .from('seguimiento_actividades')
      .select('*')
      .eq('compania', COMPANY_ID)
      .order('fecha_actividad', { ascending: false });

    if (promotorId) {
      query = query.eq('promotor_id', promotorId);
    }
    if (clienteId) {
      query = query.eq('cliente_id', clienteId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo actividades de promotores:', error);
    return [];
  }
};

// Registrar nueva actividad de seguimiento
export const registrarActividad = async (actividadData) => {
  try {
    console.log('Datos recibidos en registrarActividad:', actividadData);
    
    // Validar campos requeridos
    if (!actividadData.cliente_id) {
      throw new Error('cliente_id es requerido');
    }
    if (!actividadData.promotor_id) {
      throw new Error('promotor_id es requerido');
    }
    if (!actividadData.tipo_actividad) {
      throw new Error('tipo_actividad es requerido');
    }
    if (!actividadData.fecha_actividad) {
      throw new Error('fecha_actividad es requerida');
    }
    
    const dataToInsert = {
      cliente_id: actividadData.cliente_id,
      promotor_id: actividadData.promotor_id,
      tipo_actividad: actividadData.tipo_actividad,
      fecha_actividad: actividadData.fecha_actividad,
      duracion_minutos: actividadData.duracion_minutos || null,
      observaciones: actividadData.observaciones || null,
      resultado: actividadData.resultado || 'pendiente', // Campo obligatorio, usar 'pendiente' por defecto
      compania: COMPANY_ID
    };
    
    console.log('Datos a insertar:', dataToInsert);
    
    const { data, error } = await supabase
      .from('seguimiento_actividades')
      .insert([dataToInsert])
      .select();
      
    if (error) {
      console.error('Error de Supabase:', error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error registrando actividad:', error);
    throw error;
  }
};

// Obtener aplicaciones/solicitudes de crédito (función original para compatibilidad)
export const getAplicacionesOld = async () => {
  try {
    const { data, error } = await supabase
      .from("aplicaciones")
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
        ),
        productos (
          id,
          nombre,
          descripcion
        )
      `)
      .eq("compania", COMPANY_ID)
      .eq("clientes.compania", COMPANY_ID)
      .order("fecha_solicitud", { ascending: false });

    if (error) throw error;

    return (data || []).map(aplicacion => ({
      ...aplicacion,
      cliente: `${aplicacion.clientes?.nombre || ""} ${aplicacion.clientes?.apellido || ""}`,
      dni: aplicacion.clientes?.dni || "",
      telefono: aplicacion.clientes?.telefono || "",
      email: aplicacion.clientes?.email || "",
      producto_nombre: aplicacion.productos?.nombre || "Producto no encontrado"
    }));
  } catch (error) {
    console.error("Error obteniendo aplicaciones:", error);
    return [];
  }
};

// Obtener expedientes (aplicaciones sin productos)
export const getExpedientes = async () => {
  try {
    const { data, error } = await supabase
      .from("aplicaciones")
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
      .eq("compania", COMPANY_ID)
      .eq("clientes.compania", COMPANY_ID)
      .order("fecha_solicitud", { ascending: false });

    if (error) throw error;

    return (data || []).map(aplicacion => ({
      ...aplicacion,
      cliente: `${aplicacion.clientes?.nombre || ""} ${aplicacion.clientes?.apellido || ""}`,
      dni: aplicacion.clientes?.dni || "",
      telefono: aplicacion.clientes?.telefono || "",
      email: aplicacion.clientes?.email || ""
    }));
  } catch (error) {
    console.error("Error obteniendo expedientes:", error);
    return [];
  }
};


// ===== CARTERA DE CRÉDITOS =====

// Obtener cartera de créditos aprobados
export const getCarteraCreditos = async () => {
  try {
    const { data, error } = await supabase
      .from("aplicaciones")
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
      .eq("estado", "Aprobado")
      .eq("compania", COMPANY_ID)
      .eq("clientes.compania", COMPANY_ID)
      .order("fecha_aprobacion", { ascending: false });

    if (error) throw error;

    // Obtener información del promotor para cada cliente
    const aplicacionesConPromotor = await Promise.all(
      (data || []).map(async (aplicacion) => {
        let promotor = null;
        if (aplicacion.clientes?.promotor_id) {
          try {
            const { data: promotorData } = await supabase
              .from("usuarios")
              .select("nombre, apellido")
              .eq("id", aplicacion.clientes.promotor_id)
              .eq("compania", COMPANY_ID)
              .single();
            
            if (promotorData) {
              promotor = `${promotorData.nombre} ${promotorData.apellido}`;
            }
          } catch (error) {
            console.log("No se pudo obtener promotor:", error);
          }
        }

        return {
          ...aplicacion,
          cliente: `${aplicacion.clientes?.nombre || ""} ${aplicacion.clientes?.apellido || ""}`,
          dni: aplicacion.clientes?.dni || "",
          telefono: aplicacion.clientes?.telefono || "",
          email: aplicacion.clientes?.email || "",
          promotor: promotor
        };
      })
    );

    return aplicacionesConPromotor;
  } catch (error) {
    console.error("Error obteniendo cartera de créditos:", error);
    return [];
  }
};

// Obtener estadísticas de aplicaciones aprobadas
export const getEstadisticasAplicaciones = async () => {
  try {
    const { data, error } = await supabase
      .from("aplicaciones")
      .select("monto_solicitado, fecha_aprobacion")
      .eq("estado", "Aprobado")
      .eq("compania", COMPANY_ID);

    if (error) throw error;

    const fechaActual = new Date();
    const fechaInicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const fechaFinMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    const aplicacionesMes = (data || []).filter(aplicacion => {
      const fechaAprobacion = new Date(aplicacion.fecha_aprobacion);
      return fechaAprobacion >= fechaInicioMes && fechaAprobacion <= fechaFinMes;
    });

    const totalMonto = aplicacionesMes.reduce((sum, aplicacion) => 
      sum + (parseFloat(aplicacion.monto_solicitado) || 0), 0
    );

    return {
      totalAplicaciones: aplicacionesMes.length,
      totalMonto: totalMonto,
      promedioMonto: aplicacionesMes.length > 0 ? totalMonto / aplicacionesMes.length : 0
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas de aplicaciones:", error);
    return { totalAplicaciones: 0, totalMonto: 0, promedioMonto: 0 };
  }
};

// Actualizar solicitud de crédito
export const actualizarSolicitud = async (solicitudId, datosActualizados) => {
  try {
    console.log('Actualizando solicitud:', solicitudId, datosActualizados);
    
    const { data, error } = await supabase
      .from('aplicaciones')
      .update({
        // Información de la solicitud (campos que existen en la tabla)
        monto_solicitado: parseFloat(datosActualizados.monto_solicitado) || 0,
        plazo_deseado: parseInt(datosActualizados.plazo_deseado) || 0,
        estado: datosActualizados.estado,
        observaciones: datosActualizados.observaciones,
        
        // Información financiera
        ingresos_mensuales: parseFloat(datosActualizados.ingresos_mensuales) || 0,
        otros_ingresos: parseFloat(datosActualizados.otros_ingresos) || 0,
        anios_en_empresa: parseInt(datosActualizados.anios_en_empresa) || 0,
        
        // Información laboral
        empresa: datosActualizados.empresa,
        cargo: datosActualizados.cargo,
        telefono_empresa: datosActualizados.telefono_empresa,
        
        // Información del crédito
        tasa_interes: parseFloat(datosActualizados.tasa_interes) || 0,
        cuota_mensual: parseFloat(datosActualizados.cuota_mensual) || 0,
        proposito: datosActualizados.proposito,
        
        // Referencias personales
        personal_ref1_nombre: datosActualizados.personal_ref1_nombre,
        personal_ref1_telefono: datosActualizados.personal_ref1_telefono,
        personal_ref1_relacion: datosActualizados.personal_ref1_relacion,
        personal_ref2_nombre: datosActualizados.personal_ref2_nombre,
        personal_ref2_telefono: datosActualizados.personal_ref2_telefono,
        
        // Información de rechazo
        motivo_rechazo: datosActualizados.motivo_rechazo,
        dias_mora: parseInt(datosActualizados.dias_mora) || 0
      })
      .eq('id', solicitudId)
      .eq('compania', COMPANY_ID)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando solicitud:', error);
      throw error;
    }

    console.log('Solicitud actualizada exitosamente:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error en actualizarSolicitud:', error);
    return { success: false, error: error.message };
  }
};

