import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Brain, 
  X, 
  Download, 
  Share2, 
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { generateAISummary } from '../services/aiService';
import { exportSummaryToPDF } from '../services/pdfService';

const AISummaryModal = ({ isOpen, onClose, dashboardData }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryType, setSummaryType] = useState('executive');
  const [isGenerating, setIsGenerating] = useState(false);

  const summaryTypes = [
    {
      value: 'executive',
      label: t('aiSummary.ejecutivo'),
      description: t('aiSummary.ejecutivoDesc'),
      icon: TrendingUp
    },
    {
      value: 'detailed',
      label: t('aiSummary.detallado'),
      description: t('aiSummary.detalladoDesc'),
      icon: FileText
    },
    {
      value: 'financial',
      label: t('aiSummary.financiero'),
      description: t('aiSummary.financieroDesc'),
      icon: DollarSign
    }
  ];

  const generateSummary = async () => {
    setIsGenerating(true);
    setLoading(true);
    
    try {
      console.log('🤖 Generando resumen con IA...');
      console.log('📊 Datos del dashboard:', dashboardData);
      console.log('📝 Tipo de resumen:', summaryType);

      // Usar el servicio real de OpenAI
      const result = await generateAISummary(dashboardData, summaryType);
      
      if (result.success) {
        // Parsear el resumen de texto a estructura
        const parsedSummary = parseAISummary(result.summary, summaryType);
        setSummary(parsedSummary);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error generando resumen:', error);
      alert(`Error generando resumen: ${error.message}`);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  // Función para parsear el resumen de texto a estructura
  const parseAISummary = (aiText, type) => {
    console.log('📝 Texto completo de OpenAI:', aiText);
    
    // Extraer métricas clave del texto
    const keyMetrics = {
      carteraTotal: dashboardData?.carteraTotal || 0,
      creditosActivos: dashboardData?.creditosActivos || 0,
      porcentajeMora: dashboardData?.porcentajeMora || 0,
      promotoresActivos: dashboardData?.promotoresActivos || 0
    };

    // Limpiar el texto de caracteres raros
    const cleanText = aiText
      .replace(/[^\x20-\x7E]/g, '') // Solo caracteres ASCII básicos
      .replace(/\s+/g, ' ') // Normalizar espacios
      .replace(/[^\w\s.,;:!?()-]/g, '') // Solo letras, números, espacios y puntuación básica
      .trim();

    console.log('🧹 Texto limpio:', cleanText);

    // Dividir el texto en secciones por párrafos
    const sections = cleanText.split(/\n\s*\n/).filter(section => section.trim().length > 0);
    console.log('📑 Secciones encontradas:', sections);

    const insights = [];
    const recommendations = [];
    const nextActions = [];

    // Procesar cada sección buscando patrones específicos
    sections.forEach((section, index) => {
      const cleanSection = section.trim();
      console.log(`📄 Procesando sección ${index}:`, cleanSection.substring(0, 100) + '...');
      
      // Buscar secciones específicas por headers
      if (cleanSection.toLowerCase().includes('puntos destacados') || 
          cleanSection.toLowerCase().includes('insights') ||
          cleanSection.toLowerCase().includes('análisis') ||
          cleanSection.toLowerCase().includes('resumen') ||
          cleanSection.toLowerCase().includes('destacado')) {
        // Extraer solo el contenido después del header
        const content = cleanSection.split(/puntos destacados|insights|análisis|resumen|destacado/i)[1] || cleanSection;
        if (content.trim()) {
          insights.push(content.trim());
        }
      }
      // Buscar recomendaciones
      else if (cleanSection.toLowerCase().includes('recomendaciones') || 
               cleanSection.toLowerCase().includes('recomendación')) {
        const content = cleanSection.split(/recomendaciones|recomendación/i)[1] || cleanSection;
        if (content.trim()) {
          recommendations.push(content.trim());
        }
      }
      // Buscar próximas acciones
      else if (cleanSection.toLowerCase().includes('próximas acciones') || 
               cleanSection.toLowerCase().includes('próxima acción') ||
               cleanSection.toLowerCase().includes('acciones')) {
        const content = cleanSection.split(/próximas acciones|próxima acción|acciones/i)[1] || cleanSection;
        if (content.trim()) {
          nextActions.push(content.trim());
        }
      }
      // Si no es una sección específica pero contiene contenido relevante
      else if (cleanSection.length > 50) {
        // Si contiene guiones o viñetas, probablemente es contenido estructurado
        if (cleanSection.includes('-') || cleanSection.includes('•')) {
          insights.push(cleanSection);
        }
      }
    });

    // Si no se encontraron secciones específicas, usar el texto completo
    if (insights.length === 0 && recommendations.length === 0 && nextActions.length === 0) {
      console.log('⚠️ No se encontraron secciones específicas, usando texto completo');
      insights.push(cleanText);
    }

    // Asegurar que siempre tengamos contenido de OpenAI
    if (insights.length === 0) {
      insights.push(cleanText);
    }

    console.log('✅ Resultado del parsing:', {
      insights: insights.length,
      recommendations: recommendations.length,
      nextActions: nextActions.length
    });

    return {
      type: type,
      generatedAt: new Date().toISOString(),
      keyMetrics: keyMetrics,
      insights: insights.length > 0 ? insights : [cleanText.substring(0, 300) + '...'],
      recommendations: recommendations.length > 0 ? recommendations : ['Revisar datos para más recomendaciones'],
      nextActions: nextActions.length > 0 ? nextActions : ['Analizar métricas detalladamente'],
          financialMetrics: {
        ingresos: dashboardData?.ingresosMes || 0,
        crecimientoIngresos: 0,
        margenBeneficio: 0,
        roa: 0
          },
          projections: {
        proximoMes: {
          cartera: keyMetrics.carteraTotal * 1.1,
          mora: keyMetrics.porcentajeMora * 0.9
        },
        proximoTrimestre: {
          cartera: keyMetrics.carteraTotal * 1.25,
          mora: keyMetrics.porcentajeMora * 0.8
        }
      },
      rawText: aiText
    };
  };

  const handleClose = () => {
    setSummary(null);
    setIsGenerating(false);
    onClose();
  };

  const exportSummary = async () => {
    if (summary) {
      try {
        console.log('📄 Exportando resumen a PDF...');
        const result = await exportSummaryToPDF(summary, summaryType);
        
        if (result.success) {
          console.log('✅ PDF generado exitosamente:', result.fileName);
          alert(`PDF generado exitosamente: ${result.fileName}`);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('❌ Error exportando PDF:', error);
        alert(`Error generando PDF: ${error.message}`);
      }
    }
  };

  const shareSummary = () => {
    if (navigator.share && summary) {
      navigator.share({
        title: `Resumen ${summaryType} - ${new Date().toLocaleDateString()}`,
        text: `Resumen generado con IA: ${summary.insights.slice(0, 2).join('. ')}`,
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(`Resumen ${summaryType}: ${summary?.insights.slice(0, 2).join('. ')}`);
      alert('Resumen copiado al portapapeles');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('aiSummary.title')}
              </h2>
          </div>
          <button
            onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
          >
              <X className="w-5 h-5" />
          </button>
        </div>

          {!summary ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('aiSummary.tipoResumen')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summaryTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.value}
                        onClick={() => setSummaryType(type.value)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          summaryType === type.value
                            ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                        <div className="flex items-center mb-2">
                          <Icon className="w-5 h-5 text-primary-500 mr-2" />
                          <span className="font-medium text-gray-900">
                            {type.label}
                          </span>
                    </div>
                        <p className="text-sm text-gray-600">
                          {type.description}
                        </p>
                    </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('aiSummary.datosAnalizar')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-blue-700">
                        {t('aiSummary.carteraTotal')}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-blue-900">
                      ${dashboardData?.carteraTotal?.toLocaleString() || '0'}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-green-700">
                        {t('aiSummary.creditosActivos')}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-green-900">
                      {dashboardData?.creditosActivos || '0'}
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-yellow-700">
                        {t('aiSummary.porcentajeMora')}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-yellow-900">
                      {dashboardData?.porcentajeMora || '0'}%
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm text-purple-700">
                        {t('aiSummary.promotoresActivos')}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-purple-900">
                      {dashboardData?.promotoresActivos || '0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={generateSummary}
                  disabled={isGenerating}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('aiSummary.generandoResumen')}
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      {t('aiSummary.generarResumen')}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header del resumen */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('aiSummary.resumenListo')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generado el {new Date(summary.generatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={exportSummary}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Exportar PDF
                  </button>
                  {/* <button
                    onClick={shareSummary}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    {t('aiSummary.compartir')}
                  </button> */}
                </div>
              </div>

              {/* Métricas clave */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {t('aiSummary.metricasClave')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      ${summary.keyMetrics.carteraTotal.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Cartera Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {summary.keyMetrics.creditosActivos}
                    </div>
                    <div className="text-sm text-gray-600">Créditos Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {summary.keyMetrics.porcentajeMora}%
                    </div>
                    <div className="text-sm text-gray-600">% Mora</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {summary.keyMetrics.promotoresActivos}
                    </div>
                    <div className="text-sm text-gray-600">Promotores</div>
                  </div>
                      </div>
                    </div>
                  
                  {/* Insights */}
                  <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {t('aiSummary.puntosDestacados')}
                </h4>
                      <ul className="space-y-2">
                  {summary.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

              {/* Recomendaciones */}
                      <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                  {t('aiSummary.recomendaciones')}
                </h4>
                <ul className="space-y-2">
                  {summary.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
                  </div>

              {/* Próximas acciones */}
                      <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  {t('aiSummary.proximasAcciones')}
                </h4>
                <ul className="space-y-2">
                  {summary.nextActions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
                  </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSummary(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t('aiSummary.generarNuevo')}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {t('aiSummary.cancelar')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal;