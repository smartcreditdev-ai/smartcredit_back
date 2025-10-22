// Servicio para exportación a PDF con estilo corporativo
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Configuración de estilos corporativos
const CORPORATE_STYLES = {
  primaryColor: '#3B82F6', // Azul corporativo
  secondaryColor: '#1E40AF',
  accentColor: '#F59E0B', // Dorado
  textColor: '#1F2937',
  lightGray: '#F3F4F6',
  darkGray: '#6B7280',
  fontFamily: 'Arial, sans-serif',
  headerFontSize: 24,
  subheaderFontSize: 18,
  bodyFontSize: 12,
  smallFontSize: 10
};

// Función para limpiar texto de caracteres especiales
const cleanText = (text) => {
  if (!text) return '';
  
  return String(text)
    .replace(/[^\x20-\x7E]/g, '') // Solo caracteres ASCII básicos
    .replace(/\s+/g, ' ') // Normalizar espacios
    .replace(/[^\w\s.,;:!?()-]/g, '') // Solo letras, números, espacios y puntuación básica
    .trim();
};

// Función para validar y limpiar datos
const sanitizeData = (data) => {
  if (!data) return {};
  
  return {
    keyMetrics: {
      carteraTotal: data.keyMetrics?.carteraTotal || 0,
      creditosActivos: data.keyMetrics?.creditosActivos || 0,
      porcentajeMora: data.keyMetrics?.porcentajeMora || 0,
      promotoresActivos: data.keyMetrics?.promotoresActivos || 0
    },
    insights: Array.isArray(data.insights) ? data.insights.map(cleanText).filter(text => text.length > 0) : ['Analisis en proceso...'],
    recommendations: Array.isArray(data.recommendations) ? data.recommendations.map(cleanText).filter(text => text.length > 0) : ['Revisar datos para mas recomendaciones'],
    nextActions: Array.isArray(data.nextActions) ? data.nextActions.map(cleanText).filter(text => text.length > 0) : ['Analizar metricas detalladamente']
  };
};

// Función para crear PDF con estilo corporativo
export const generateCorporatePDF = async (summaryData, type = 'executive') => {
  try {
    console.log('📄 Generando PDF corporativo...');
    
    // Validar y limpiar datos
    const cleanData = sanitizeData(summaryData);
    console.log('📊 Datos validados:', cleanData);
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Agregar logo (simulado con texto por ahora)
    addLogo(doc, pageWidth);
    
    // Agregar header corporativo
    addCorporateHeader(doc, pageWidth, type);
    
    // Agregar contenido principal
    addMainContent(doc, cleanData, type);
    
    // Agregar footer corporativo
    addCorporateFooter(doc, pageWidth, pageHeight);
    
    // Generar nombre del archivo
    const fileName = `Resumen_${type}_SmartCredit_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Descargar PDF
    doc.save(fileName);
    
    console.log('✅ PDF generado exitosamente');
    return {
      success: true,
      fileName: fileName,
      message: 'PDF generado con estilo corporativo'
    };
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para agregar logo corporativo
const addLogo = (doc, pageWidth) => {
  // Logo de texto sin emojis
  doc.setFontSize(16);
  doc.setTextColor(CORPORATE_STYLES.primaryColor);
  doc.setFont('helvetica', 'bold');
  
  const logoText = 'SMARTCREDIT';
  const logoWidth = doc.getTextWidth(logoText);
  const logoX = (pageWidth - logoWidth) / 2;
  
  doc.text(logoText, logoX, 20);
  
  // Línea decorativa debajo del logo
  doc.setDrawColor(CORPORATE_STYLES.primaryColor);
  doc.setLineWidth(0.5);
  doc.line(logoX - 10, 25, logoX + logoWidth + 10, 25);
};

// Función para agregar header corporativo
const addCorporateHeader = (doc, pageWidth, type) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Título principal
  doc.setFontSize(CORPORATE_STYLES.headerFontSize);
  doc.setTextColor(CORPORATE_STYLES.textColor);
  doc.setFont('helvetica', 'bold');
  
  const titleText = getTitleByType(type);
  const titleWidth = doc.getTextWidth(titleText);
  const titleX = (pageWidth - titleWidth) / 2;
  
  doc.text(titleText, titleX, 45);
  
  // Subtítulo
  doc.setFontSize(CORPORATE_STYLES.bodyFontSize);
  doc.setTextColor(CORPORATE_STYLES.darkGray);
  doc.setFont('helvetica', 'normal');
  
  const subtitleText = `Generado el ${currentDate} con Inteligencia Artificial`;
  const subtitleWidth = doc.getTextWidth(subtitleText);
  const subtitleX = (pageWidth - subtitleWidth) / 2;
  
  doc.text(subtitleText, subtitleX, 55);
  
  // Línea separadora
  doc.setDrawColor(CORPORATE_STYLES.lightGray);
  doc.setLineWidth(0.3);
  doc.line(20, 60, pageWidth - 20, 60);
};

// Función para agregar contenido principal
const addMainContent = (doc, summaryData, type) => {
  let yPosition = 75;
  
  // Métricas clave
  addMetricsSection(doc, summaryData, yPosition);
  yPosition += 60;
  
  // Insights principales
  addInsightsSection(doc, summaryData, yPosition);
  yPosition += 80;
  
  // Recomendaciones
  addRecommendationsSection(doc, summaryData, yPosition);
  yPosition += 60;
  
  // Próximas acciones
  addNextActionsSection(doc, summaryData, yPosition);
};

// Función para agregar sección de métricas
const addMetricsSection = (doc, summaryData, yPosition) => {
  doc.setFontSize(CORPORATE_STYLES.subheaderFontSize);
  doc.setTextColor(CORPORATE_STYLES.primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('METRICAS CLAVE', 20, yPosition);
  
  // Fondo para métricas
  doc.setFillColor(CORPORATE_STYLES.lightGray);
  doc.rect(20, yPosition + 5, 170, 45, 'F');
  
  // Métricas en grid
  const metrics = [
    { label: 'Cartera Total', value: `$${summaryData.keyMetrics?.carteraTotal?.toLocaleString() || '0'}` },
    { label: 'Créditos Activos', value: String(summaryData.keyMetrics?.creditosActivos || '0') },
    { label: '% Mora', value: `${summaryData.keyMetrics?.porcentajeMora || '0'}%` },
    { label: 'Promotores', value: String(summaryData.keyMetrics?.promotoresActivos || '0') }
  ];
  
  metrics.forEach((metric, index) => {
    const x = 30 + (index % 2) * 80;
    const y = yPosition + 20 + Math.floor(index / 2) * 15;
    
    doc.setFontSize(CORPORATE_STYLES.smallFontSize);
    doc.setTextColor(CORPORATE_STYLES.darkGray);
    doc.setFont('helvetica', 'normal');
    doc.text(cleanText(String(metric.label)), x, y);
    
    doc.setFontSize(CORPORATE_STYLES.bodyFontSize);
    doc.setTextColor(CORPORATE_STYLES.textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(cleanText(String(metric.value)), x, y + 8);
  });
};

// Función para agregar sección de insights
const addInsightsSection = (doc, summaryData, yPosition) => {
  doc.setFontSize(CORPORATE_STYLES.subheaderFontSize);
  doc.setTextColor(CORPORATE_STYLES.primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('PUNTOS DESTACADOS', 20, yPosition);
  
  doc.setFontSize(CORPORATE_STYLES.bodyFontSize);
  doc.setTextColor(CORPORATE_STYLES.textColor);
  doc.setFont('helvetica', 'normal');
  
  const insights = summaryData.insights || ['Análisis en proceso...'];
  let currentY = yPosition + 10;
  
  insights.forEach((insight, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    const insightText = cleanText(String(insight || 'Sin datos'));
    
    // Si el insight contiene múltiples líneas (separadas por - o •)
    if (insightText.includes('-') || insightText.includes('•')) {
      const lines = insightText.split(/[-•]/).filter(line => line.trim().length > 0);
      lines.forEach((line, lineIndex) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        const cleanLine = cleanText(line.trim());
        const wrappedText = doc.splitTextToSize(`• ${cleanLine}`, 160);
        doc.text(wrappedText, 20, currentY);
        currentY += wrappedText.length * 5 + 5;
      });
    } else {
      const wrappedText = doc.splitTextToSize(`• ${insightText}`, 160);
      doc.text(wrappedText, 20, currentY);
      currentY += wrappedText.length * 5 + 5;
    }
  });
};

// Función para agregar sección de recomendaciones
const addRecommendationsSection = (doc, summaryData, yPosition) => {
  doc.setFontSize(CORPORATE_STYLES.subheaderFontSize);
  doc.setTextColor(CORPORATE_STYLES.accentColor);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIONES', 20, yPosition);
  
  doc.setFontSize(CORPORATE_STYLES.bodyFontSize);
  doc.setTextColor(CORPORATE_STYLES.textColor);
  doc.setFont('helvetica', 'normal');
  
  const recommendations = summaryData.recommendations || ['Revisar datos para más recomendaciones'];
  let currentY = yPosition + 10;
  
  recommendations.forEach((recommendation, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    const recommendationText = cleanText(String(recommendation || 'Sin recomendaciones'));
    
    // Si la recomendación contiene múltiples líneas
    if (recommendationText.includes('-') || recommendationText.includes('•')) {
      const lines = recommendationText.split(/[-•]/).filter(line => line.trim().length > 0);
      lines.forEach((line, lineIndex) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        const cleanLine = cleanText(line.trim());
        const wrappedText = doc.splitTextToSize(`• ${cleanLine}`, 160);
        doc.text(wrappedText, 20, currentY);
        currentY += wrappedText.length * 5 + 5;
      });
    } else {
      const wrappedText = doc.splitTextToSize(`• ${recommendationText}`, 160);
      doc.text(wrappedText, 20, currentY);
      currentY += wrappedText.length * 5 + 5;
    }
  });
};

// Función para agregar sección de próximas acciones
const addNextActionsSection = (doc, summaryData, yPosition) => {
  doc.setFontSize(CORPORATE_STYLES.subheaderFontSize);
  doc.setTextColor(CORPORATE_STYLES.secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('PROXIMAS ACCIONES', 20, yPosition);
  
  doc.setFontSize(CORPORATE_STYLES.bodyFontSize);
  doc.setTextColor(CORPORATE_STYLES.textColor);
  doc.setFont('helvetica', 'normal');
  
  const nextActions = summaryData.nextActions || ['Analizar metricas detalladamente'];
  let currentY = yPosition + 10;
  
  nextActions.forEach((action, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    const actionText = cleanText(String(action || 'Sin acciones definidas'));
    
    // Si la acción contiene múltiples líneas
    if (actionText.includes('-') || actionText.includes('•')) {
      const lines = actionText.split(/[-•]/).filter(line => line.trim().length > 0);
      lines.forEach((line, lineIndex) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        const cleanLine = cleanText(line.trim());
        const wrappedText = doc.splitTextToSize(`• ${cleanLine}`, 160);
        doc.text(wrappedText, 20, currentY);
        currentY += wrappedText.length * 5 + 5;
      });
    } else {
      const wrappedText = doc.splitTextToSize(`• ${actionText}`, 160);
      doc.text(wrappedText, 20, currentY);
      currentY += wrappedText.length * 5 + 5;
    }
  });
};

// Función para agregar footer corporativo
const addCorporateFooter = (doc, pageWidth, pageHeight) => {
  const footerY = pageHeight - 20;
  
  // Línea separadora
  doc.setDrawColor(CORPORATE_STYLES.lightGray);
  doc.setLineWidth(0.3);
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
  
  // Texto del footer
  doc.setFontSize(CORPORATE_STYLES.smallFontSize);
  doc.setTextColor(CORPORATE_STYLES.darkGray);
  doc.setFont('helvetica', 'normal');
  
  const footerText = 'SmartCredit - Sistema de Gestión Crediticia | Generado con IA';
  const footerWidth = doc.getTextWidth(footerText);
  const footerX = (pageWidth - footerWidth) / 2;
  
  doc.text(footerText, footerX, footerY);
  
  // Página actual
  const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
  doc.text(`Página ${pageNumber}`, pageWidth - 30, footerY);
};

// Función para obtener título según el tipo
const getTitleByType = (type) => {
  const titles = {
    'executive': 'RESUMEN EJECUTIVO',
    'detailed': 'ANÁLISIS DETALLADO',
    'financial': 'REPORTE FINANCIERO',
    'operational': 'ANÁLISIS OPERACIONAL',
    'risk': 'EVALUACIÓN DE RIESGOS'
  };
  
  return titles[type] || 'RESUMEN GENERAL';
};

// Función para exportar desde componente React
export const exportSummaryToPDF = async (summaryData, type = 'executive') => {
  try {
    console.log('📄 Iniciando exportación a PDF...');
    
    const result = await generateCorporatePDF(summaryData, type);
    
    if (result.success) {
      console.log('✅ PDF exportado exitosamente:', result.fileName);
      return result;
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('❌ Error en exportación PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
