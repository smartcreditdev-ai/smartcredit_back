import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Bot, FileText, Download, RefreshCw, Loader, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const AISummaryModal = ({ isOpen, onClose, dashboardData }) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [summaryType, setSummaryType] = useState('executive'); // executive, detailed, financial

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    
    // Simular generación de resumen con AI (placeholder hasta tener API key)
    setTimeout(() => {
      const mockSummary = {
        executive: {
          title: "Resumen Ejecutivo - Enero 2025",
          period: "1-31 Enero 2025",
          keyMetrics: {
            totalPortfolio: 2400000,
            portfolioGrowth: 8.2,
            delinquencyRate: 3.2,
            activeCredits: 1247,
            newApprovals: 89,
            collectionEfficiency: 94.5
          },
          highlights: [
            {
              type: 'positive',
              title: 'Crecimiento Sostenido',
              description: 'La cartera total ha crecido un 8.2% este mes, superando las proyecciones en 2.1%',
              impact: 'Alto'
            },
            {
              type: 'positive',
              title: 'Eficiencia de Cobranza',
              description: 'La tasa de cobranza alcanzó 94.5%, la más alta en los últimos 6 meses',
              impact: 'Alto'
            },
            {
              type: 'warning',
              title: 'Atención a Mora',
              description: 'Aunque la mora se mantiene en 3.2%, hay 47 clientes que requieren seguimiento inmediato',
              impact: 'Medio'
            }
          ],
          recommendations: [
            'Mantener el enfoque en la calidad de nuevos créditos para sostener el crecimiento',
            'Implementar estrategias proactivas para los 47 clientes en mora crítica',
            'Considerar expandir la capacidad de aprobación dado el buen desempeño actual',
            'Revisar procesos de cobranza para replicar las mejores prácticas'
          ],
          nextActions: [
            'Reunión semanal con equipo de cobranzas - Lunes 9:00 AM',
            'Revisión de cartera en riesgo - Miércoles 2:00 PM',
            'Análisis de nuevos productos - Viernes 10:00 AM'
          ]
        },
        detailed: {
          title: "Análisis Detallado - Enero 2025",
          period: "1-31 Enero 2025",
          sections: [
            {
              title: "Rendimiento de Cartera",
              metrics: [
                { label: "Cartera Total", value: "$2,400,000", change: "+8.2%", trend: "up" },
                { label: "Créditos Activos", value: "1,247", change: "+12%", trend: "up" },
                { label: "Tasa de Mora", value: "3.2%", change: "-0.5%", trend: "down" },
                { label: "Promotores Activos", value: "24", change: "+2", trend: "up" }
              ]
            },
            {
              title: "Análisis de Productos",
              metrics: [
                { label: "Créditos Personales", value: "45%", amount: "$1,080,000" },
                { label: "Créditos Comerciales", value: "30%", amount: "$720,000" },
                { label: "Microcréditos", value: "25%", amount: "$600,000" }
              ]
            },
            {
              title: "Distribución Geográfica",
              metrics: [
                { label: "Región Norte", value: "35%", clients: "436" },
                { label: "Región Sur", value: "28%", clients: "349" },
                { label: "Región Centro", value: "37%", clients: "462" }
              ]
            }
          ],
          insights: [
            "Los créditos personales representan el 45% de la cartera, mostrando una tendencia estable",
            "La región centro concentra el mayor volumen de clientes con mejor tasa de pago",
            "Los microcréditos tienen la menor tasa de mora (1.8%) del portafolio"
          ]
        },
        financial: {
          title: "Análisis Financiero - Enero 2025",
          period: "1-31 Enero 2025",
          financialMetrics: {
            revenue: 185000,
            revenueGrowth: 12.5,
            operatingCosts: 45000,
            costEfficiency: 24.3,
            netIncome: 140000,
            profitMargin: 75.7,
            roa: 5.8,
            roe: 12.3
          },
          cashFlow: {
            operating: 165000,
            investing: -25000,
            financing: -15000,
            netChange: 125000
          },
          riskMetrics: {
            creditRisk: "Bajo",
            liquidityRatio: 2.8,
            capitalAdequacy: 15.2,
            provisionCoverage: 120
          },
          projections: {
            nextMonth: {
              portfolio: 2580000,
              revenue: 195000,
              delinquency: 3.0
            },
            nextQuarter: {
              portfolio: 2750000,
              revenue: 210000,
              delinquency: 2.8
            }
          }
        }
      };
      
      setGeneratedSummary(mockSummary[summaryType]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleClose = () => {
    setGeneratedSummary(null);
    setIsGenerating(false);
    onClose();
  };

  const handleExport = () => {
    if (generatedSummary) {
      const dataStr = JSON.stringify(generatedSummary, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resumen-ai-${summaryType}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('aiSummary.title')}</h2>
              <p className="text-sm text-gray-600">{t('aiSummary.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!generatedSummary && !isGenerating && (
            <div className="space-y-6">
              {/* Tipo de Resumen */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aiSummary.tipoResumen')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSummaryType('executive')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      summaryType === 'executive' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{t('aiSummary.ejecutivo')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t('aiSummary.ejecutivoDesc')}</p>
                  </button>

                  <button
                    onClick={() => setSummaryType('detailed')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      summaryType === 'detailed' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{t('aiSummary.detallado')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t('aiSummary.detalladoDesc')}</p>
                  </button>

                  <button
                    onClick={() => setSummaryType('financial')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      summaryType === 'financial' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{t('aiSummary.financiero')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t('aiSummary.financieroDesc')}</p>
                  </button>
                </div>
              </div>

              {/* Datos del Dashboard */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aiSummary.datosAnalizar')}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{t('aiSummary.creditosActivos')}:</span>
                      <span className="ml-2 font-medium">1,247</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('aiSummary.carteraTotal')}:</span>
                      <span className="ml-2 font-medium">$2.4M</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('aiSummary.porcentajeMora')}:</span>
                      <span className="ml-2 font-medium">3.2%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('aiSummary.promotoresActivos')}:</span>
                      <span className="ml-2 font-medium">24</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Generar */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('aiSummary.cancelar')}
                </button>
                <button
                  onClick={handleGenerateSummary}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>{t('aiSummary.generarResumen')}</span>
                </button>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('aiSummary.generandoResumen')}</h3>
              <p className="text-gray-600 mb-4">{t('aiSummary.analizandoDatos')}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ {t('aiSummary.procesandoMetricas')}</p>
                <p>✓ {t('aiSummary.identificandoTendencias')}</p>
                <p>✓ {t('aiSummary.generandoInsights')}</p>
                <p>✓ {t('aiSummary.creandoRecomendaciones')}</p>
              </div>
            </div>
          )}

          {generatedSummary && (
            <div className="space-y-6">
              {/* Header del Resumen */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{generatedSummary.title}</h3>
                  <p className="text-sm text-gray-600">{generatedSummary.period}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{t('aiSummary.resumenListo')}</span>
                </div>
              </div>

              {/* Contenido del Resumen Ejecutivo */}
              {summaryType === 'executive' && (
                <div className="space-y-6">
                  {/* Métricas Clave */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.metricasClave')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t('aiSummary.carteraTotal')}:</span>
                        <span className="ml-2 font-medium">${generatedSummary.keyMetrics.totalPortfolio.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.crecimientoCartera')}:</span>
                        <span className="ml-2 font-medium text-green-600">+{generatedSummary.keyMetrics.portfolioGrowth}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.tasaMora')}:</span>
                        <span className="ml-2 font-medium text-red-600">{generatedSummary.keyMetrics.delinquencyRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.creditosActivos')}:</span>
                        <span className="ml-2 font-medium">{generatedSummary.keyMetrics.activeCredits.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.nuevasAprobaciones')}:</span>
                        <span className="ml-2 font-medium">{generatedSummary.keyMetrics.newApprovals}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.eficienciaCobranza')}:</span>
                        <span className="ml-2 font-medium text-green-600">{generatedSummary.keyMetrics.collectionEfficiency}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.puntosDestacados')}</h4>
                    <div className="space-y-3">
                      {generatedSummary.highlights.map((highlight, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          highlight.type === 'positive' ? 'bg-green-50 border-green-500' :
                          highlight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          'bg-red-50 border-red-500'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{highlight.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{highlight.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              highlight.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                              highlight.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {highlight.impact}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recomendaciones */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.recomendaciones')}</h4>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {generatedSummary.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Próximas Acciones */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.proximasAcciones')}</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {generatedSummary.nextActions.map((action, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido del Resumen Detallado */}
              {summaryType === 'detailed' && (
                <div className="space-y-6">
                  {generatedSummary.sections.map((section, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{section.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{metric.label}</span>
                            <div className="text-right">
                              <span className="font-medium">{metric.value}</span>
                              {metric.change && (
                                <span className={`ml-2 text-xs ${
                                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {metric.change}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Insights */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.insights')}</h4>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {generatedSummary.insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido del Resumen Financiero */}
              {summaryType === 'financial' && (
                <div className="space-y-6">
                  {/* Métricas Financieras */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.metricasFinancieras')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t('aiSummary.ingresos')}:</span>
                        <span className="ml-2 font-medium">${generatedSummary.financialMetrics.revenue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.crecimientoIngresos')}:</span>
                        <span className="ml-2 font-medium text-green-600">+{generatedSummary.financialMetrics.revenueGrowth}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.margenBeneficio')}:</span>
                        <span className="ml-2 font-medium text-green-600">{generatedSummary.financialMetrics.profitMargin}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.roa')}:</span>
                        <span className="ml-2 font-medium text-blue-600">{generatedSummary.financialMetrics.roa}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Flujo de Caja */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.flujoCaja')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t('aiSummary.operativo')}:</span>
                        <span className="ml-2 font-medium text-green-600">${generatedSummary.cashFlow.operating.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.inversion')}:</span>
                        <span className="ml-2 font-medium text-red-600">${generatedSummary.cashFlow.investing.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.financiamiento')}:</span>
                        <span className="ml-2 font-medium text-red-600">${generatedSummary.cashFlow.financing.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('aiSummary.cambioNeto')}:</span>
                        <span className="ml-2 font-medium text-green-600">${generatedSummary.cashFlow.netChange.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proyecciones */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{t('aiSummary.proyecciones')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">{t('aiSummary.proximoMes')}</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('aiSummary.cartera')}:</span>
                            <span className="font-medium">${generatedSummary.projections.nextMonth.portfolio.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('aiSummary.ingresos')}:</span>
                            <span className="font-medium">${generatedSummary.projections.nextMonth.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('aiSummary.mora')}:</span>
                            <span className="font-medium">{generatedSummary.projections.nextMonth.delinquency}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">{t('aiSummary.proximoTrimestre')}</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('aiSummary.cartera')}:</span>
                            <span className="font-medium">${generatedSummary.projections.nextQuarter.portfolio.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('aiSummary.ingresos')}:</span>
                            <span className="font-medium">${generatedSummary.projections.nextQuarter.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('aiSummary.mora')}:</span>
                            <span className="font-medium">{generatedSummary.projections.nextQuarter.delinquency}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setGeneratedSummary(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  {t('aiSummary.generarNuevo')}
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  {t('aiSummary.exportar')}
                </button>
                <button
                  onClick={() => console.log('Compartir resumen:', generatedSummary)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('aiSummary.compartir')}
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
