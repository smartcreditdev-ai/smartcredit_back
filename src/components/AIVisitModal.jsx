import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Bot, MapPin, Clock, Phone, MessageSquare, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AIVisitModal = ({ isOpen, onClose, selectedClients = [] }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Configuración, 2: Generando, 3: Resultado
  const [visitConfig, setVisitConfig] = useState({
    priority: 'high',
    timeSlot: 'morning',
    includePhoneCall: true,
    includeSMS: true,
    maxVisits: 10
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setStep(2);
    
    // Simular generación de plan con AI (placeholder hasta tener API key)
    setTimeout(() => {
      const mockPlan = {
        totalVisits: selectedClients.length,
        estimatedTime: '4.5 horas',
        route: [
          { client: 'Juan Pérez', address: 'Av. Principal 123', priority: 'Alta', time: '09:00', notes: 'Cliente crítico, necesita plan de pago' },
          { client: 'Ana Martínez', address: 'Calle Secundaria 456', priority: 'Media', time: '10:30', notes: 'Buena comunicación, negociar cuota' },
          { client: 'Roberto Silva', address: 'Plaza Central 789', priority: 'Alta', time: '12:00', notes: 'Mora alta, evaluar refinanciamiento' },
          { client: 'Laura Rodríguez', address: 'Residencial Norte 321', priority: 'Baja', time: '14:00', notes: 'Cliente nuevo, explicar beneficios' },
          { client: 'Miguel Torres', address: 'Zona Industrial 654', priority: 'Media', time: '15:30', notes: 'Pago pendiente hoy, confirmar' }
        ],
        recommendations: [
          'Priorizar clientes con mora > 60 días',
          'Llevar propuestas de refinanciamiento',
          'Usar enfoque colaborativo en negociaciones',
          'Documentar todas las conversaciones'
        ],
        successProbability: 78
      };
      
      setGeneratedPlan(mockPlan);
      setStep(3);
      setIsGenerating(false);
    }, 3000);
  };

  const handleClose = () => {
    setStep(1);
    setGeneratedPlan(null);
    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('aiVisit.title')}</h2>
              <p className="text-sm text-gray-600">{t('aiVisit.subtitle')}</p>
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
          {step === 1 && (
            <div className="space-y-6">
              {/* Clientes Seleccionados */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aiVisit.clientesSeleccionados')}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{t('aiVisit.totalClientes')}:</span>
                    <span className="text-sm text-gray-600">{selectedClients.length}</span>
                  </div>
                  <div className="space-y-2">
                    {selectedClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{client.cliente}</span>
                        <span className="text-gray-500">${client.monto.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Configuración de Visitas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aiVisit.configuracionVisitas')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('aiVisit.prioridad')}</label>
                    <select
                      value={visitConfig.priority}
                      onChange={(e) => setVisitConfig({...visitConfig, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="high">{t('aiVisit.prioridadAlta')}</option>
                      <option value="medium">{t('aiVisit.prioridadMedia')}</option>
                      <option value="low">{t('aiVisit.prioridadBaja')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('aiVisit.horarioPreferido')}</label>
                    <select
                      value={visitConfig.timeSlot}
                      onChange={(e) => setVisitConfig({...visitConfig, timeSlot: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="morning">{t('aiVisit.horarioManana')}</option>
                      <option value="afternoon">{t('aiVisit.horarioTarde')}</option>
                      <option value="flexible">{t('aiVisit.horarioFlexible')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('aiVisit.maximoVisitas')}</label>
                    <input
                      type="number"
                      value={visitConfig.maxVisits}
                      onChange={(e) => setVisitConfig({...visitConfig, maxVisits: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="20"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visitConfig.includePhoneCall}
                        onChange={(e) => setVisitConfig({...visitConfig, includePhoneCall: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{t('aiVisit.incluirLlamadas')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visitConfig.includeSMS}
                        onChange={(e) => setVisitConfig({...visitConfig, includeSMS: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{t('aiVisit.incluirSMS')}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Botón Generar */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('aiVisit.cancelar')}
                </button>
                <button
                  onClick={handleGeneratePlan}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>{t('aiVisit.generarPlan')}</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('aiVisit.generandoPlan')}</h3>
              <p className="text-gray-600 mb-4">{t('aiVisit.analizandoDatos')}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ {t('aiVisit.analizandoHistorial')}</p>
                <p>✓ {t('aiVisit.calculandoRutas')}</p>
                <p>✓ {t('aiVisit.generandoRecomendaciones')}</p>
              </div>
            </div>
          )}

          {step === 3 && generatedPlan && (
            <div className="space-y-6">
              {/* Resumen del Plan */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{t('aiVisit.planGenerado')}</h3>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{t('aiVisit.listoParaEjecutar')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t('aiVisit.totalVisitas')}:</span>
                    <span className="ml-2 font-medium">{generatedPlan.totalVisits}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('aiVisit.tiempoEstimado')}:</span>
                    <span className="ml-2 font-medium">{generatedPlan.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('aiVisit.probabilidadExito')}:</span>
                    <span className="ml-2 font-medium text-green-600">{generatedPlan.successProbability}%</span>
                  </div>
                </div>
              </div>

              {/* Ruta de Visitas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aiVisit.rutaOptimizada')}</h3>
                <div className="space-y-3">
                  {generatedPlan.route.map((visit, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{visit.client}</h4>
                            <p className="text-sm text-gray-600">{visit.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            visit.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                            visit.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {visit.priority}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{visit.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        {visit.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendaciones */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aiVisit.recomendacionesIA')}</h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {generatedPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('aiVisit.modificarConfiguracion')}
                </button>
                <button
                  onClick={() => console.log('Exportar plan:', generatedPlan)}
                  className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {t('aiVisit.exportarPlan')}
                </button>
                <button
                  onClick={() => console.log('Ejecutar plan:', generatedPlan)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('aiVisit.ejecutarPlan')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVisitModal;
