// Servicio para integración con OpenAI
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Generar resumen con IA
export const generateAISummary = async (dashboardData, summaryType = 'executive') => {
  try {
    console.log('🤖 Iniciando generación de resumen con IA...');
    console.log('📊 Datos del dashboard:', dashboardData);
    console.log('📝 Resumen:', summaryType);

    // Preparar el prompt según el tipo de resumen
    const prompt = buildPrompt(dashboardData, summaryType);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un analista financiero experto especializado en sistemas de gestión crediticia. Genera resúmenes profesionales y detallados basados en datos reales del sistema. Responde SOLO en texto plano, sin caracteres especiales, emojis o formato markdown. Usa solo letras, números, espacios y signos de puntuación básicos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Error de OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('✅ Resumen generado exitosamente');
    return {
      success: true,
      summary: summary,
      type: summaryType,
      timestamp: new Date().toISOString(),
      model: 'gpt-4o-mini'
    };

  } catch (error) {
    console.error('❌ Error generando resumen con IA:', error);
    return {
      success: false,
      error: error.message,
      type: summaryType
    };
  }
};

// Construir el prompt según el tipo de resumen
const buildPrompt = (dashboardData, summaryType) => {
  const basePrompt = `
Analiza los siguientes datos REALES de un sistema de gestión crediticia y genera un resumen profesional:

DATOS REALES DEL SISTEMA:
- Total Prospectos: ${dashboardData.totalClientes || 0}
- Cartera Total: $${dashboardData.carteraTotal || 0}
- Cartera en Mora: $${dashboardData.carteraMora || 0}
- Tasa de Morosidad: ${dashboardData.tasaMorosidad || 0}%
- Solicitudes Pendientes: ${dashboardData.solicitudesPendientes || 0}
- Solicitudes Aprobadas: ${dashboardData.solicitudesAprobadas || 0}
- Usuarios Activos: ${dashboardData.usuariosActivos || 0}
- Promotores Activos: ${dashboardData.promotoresActivos || 0}
- Cobradores Activos: ${dashboardData.cobradoresActivos || 0}
- Ingresos del Mes: $${dashboardData.ingresosMes || 0}
- Gastos del Mes: $${dashboardData.gastosMes || 0}
- Beneficio Neto: $${dashboardData.beneficioNeto || 0}
`;

  switch (summaryType) {
    case 'executive':
      return basePrompt + `

INSTRUCCIONES ESPECÍFICAS:
1. Genera un análisis ejecutivo completo y detallado
2. Incluye al menos 3-5 insights específicos y accionables
3. Proporciona 3-4 recomendaciones estratégicas concretas
4. Sugiere 2-3 próximas acciones específicas
5. Usa un lenguaje profesional pero accesible
6. Estructura tu respuesta en secciones claras

FORMATO DE RESPUESTA:
PUNTOS DESTACADOS:
- [Insight 1 específico]
- [Insight 2 específico]
- [Insight 3 específico]

RECOMENDACIONES:
- [Recomendación 1 específica]
- [Recomendación 2 específica]
- [Recomendación 3 específica]

PRÓXIMAS ACCIONES:
- [Acción 1 específica]
- [Acción 2 específica]
`;

    case 'detailed':
      return basePrompt + `

INSTRUCCIONES ESPECÍFICAS:
1. Genera un análisis detallado y profundo
2. Incluye al menos 5-7 insights específicos
3. Proporciona 4-5 recomendaciones detalladas
4. Sugiere 3-4 próximas acciones específicas
5. Incluye análisis de tendencias y patrones
6. Usa datos específicos en tus conclusiones

FORMATO DE RESPUESTA:
PUNTOS DESTACADOS:
- [Análisis detallado 1]
- [Análisis detallado 2]
- [Análisis detallado 3]
- [Análisis detallado 4]

RECOMENDACIONES:
- [Recomendación detallada 1]
- [Recomendación detallada 2]
- [Recomendación detallada 3]

PRÓXIMAS ACCIONES:
- [Acción específica 1]
- [Acción específica 2]
- [Acción específica 3]
`;

    case 'financial':
      return basePrompt + `

INSTRUCCIONES ESPECÍFICAS:
1. Enfócate en análisis financiero detallado
2. Incluye métricas financieras específicas
3. Proporciona recomendaciones financieras concretas
4. Analiza ratios y proyecciones
5. Incluye análisis de rentabilidad y riesgo

FORMATO DE RESPUESTA:
PUNTOS DESTACADOS:
- [Análisis financiero 1]
- [Análisis financiero 2]
- [Análisis financiero 3]

RECOMENDACIONES:
- [Recomendación financiera 1]
- [Recomendación financiera 2]
- [Recomendación financiera 3]

PRÓXIMAS ACCIONES:
- [Acción financiera 1]
- [Acción financiera 2]
`;

    default:
      return basePrompt + `

INSTRUCCIONES ESPECÍFICAS:
1. Genera un análisis general completo
2. Incluye insights relevantes basados en los datos
3. Proporciona recomendaciones prácticas
4. Sugiere acciones específicas

FORMATO DE RESPUESTA:
PUNTOS DESTACADOS:
- [Insight general 1]
- [Insight general 2]

RECOMENDACIONES:
- [Recomendación general 1]
- [Recomendación general 2]

PRÓXIMAS ACCIONES:
- [Acción general 1]
- [Acción general 2]
`;
  }
};

// Generar resumen de visitas con IA
export const generateAIVisitSummary = async (visitData) => {
  try {
    console.log('🤖 Generando resumen de visitas con IA...');
    console.log('📊 Datos de visitas:', visitData);

    const prompt = `
Analiza los siguientes datos de visitas y actividades de cobranza:

DATOS DE VISITAS:
- Total Visitas Programadas: ${visitData.totalVisitas || 0}
- Visitas Completadas: ${visitData.visitasCompletadas || 0}
- Visitas Exitosas: ${visitData.visitasExitosas || 0}
- Tasa de Éxito: ${visitData.tasaExito || 0}%
- Promedio de Tiempo por Visita: ${visitData.tiempoPromedio || 0} minutos
- Cobros Realizados: $${visitData.cobrosRealizados || 0}
- Clientes Visitados: ${visitData.clientesVisitados || 0}
- Promotores Activos: ${visitData.promotoresActivos || 0}

Genera un análisis detallado enfocándote en:
- Eficiencia de las visitas
- Patrones de éxito
- Áreas de mejora
- Recomendaciones operativas
- Optimización de rutas
`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en gestión de cobranza y optimización de visitas. Analiza datos operacionales y proporciona insights valiosos. Responde SOLO en texto plano, sin caracteres especiales, emojis o formato markdown. Usa solo letras, números, espacios y signos de puntuación básicos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Error de OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('✅ Resumen de visitas generado exitosamente');
    return {
      success: true,
      summary: summary,
      type: 'visit_analysis',
      timestamp: new Date().toISOString(),
      model: 'gpt-4o-mini'
    };

  } catch (error) {
    console.error('❌ Error generando resumen de visitas:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generar recomendaciones con IA
export const generateAIRecommendations = async (data, context = 'general') => {
  try {
    console.log('🤖 Generando recomendaciones con IA...');
    console.log('📊 Contexto:', context);

    const prompt = `
Basándote en los siguientes datos del sistema de gestión crediticia, genera recomendaciones específicas y accionables:

DATOS DEL SISTEMA:
${JSON.stringify(data, null, 2)}

Contexto: ${context}

Genera recomendaciones enfocadas en:
- Mejoras operacionales
- Optimización de procesos
- Reducción de riesgos
- Aumento de eficiencia
- Estrategias de crecimiento
`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un consultor experto en sistemas financieros. Proporciona recomendaciones prácticas y específicas basadas en datos reales. Responde SOLO en texto plano, sin caracteres especiales, emojis o formato markdown. Usa solo letras, números, espacios y signos de puntuación básicos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`Error de OpenAI: ${response.status} ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const recommendations = aiResponse.choices[0].message.content;

    console.log('✅ Recomendaciones generadas exitosamente');
    return {
      success: true,
      recommendations: recommendations,
      context: context,
      timestamp: new Date().toISOString(),
      model: 'gpt-4o-mini'
    };

  } catch (error) {
    console.error('❌ Error generando recomendaciones:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
