import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  X, 
  Brain, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Calendar,
  Download,
  Play
} from 'lucide-react';

const AIVisitModal = ({ isOpen, onClose, selectedClients = [] }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    priority: 'high',
    preferredTime: 'morning',
    maxVisits: 10,
    includeCalls: true,
    includeSMS: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(null);
  const [step, setStep] = useState('config'); // config, generating, results

  const priorities = [
    { value: 'high', label: t('aiVisit.prioridadAlta'), color: 'red' },
    { value: 'medium', label: t('aiVisit.prioridadMedia'), color: 'yellow' },
    { value: 'low', label: t('aiVisit.prioridadBaja'), color: 'green' }
  ];

  const timeSlots = [
    { value: 'morning', label: t('aiVisit.horarioManana') },
    { value: 'afternoon', label: t('aiVisit.horarioTarde') },
    { value: 'flexible', label: t('aiVisit.horarioFlexible') }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setStep('generating');
    
    try {
      console.log('🤖 Generando plan de visitas con IA...');
      console.log('👥 Clientes seleccionados:', selectedClients);
      console.log('⚙️ Configuración:', config);

      // Simular generación del plan
      await new Promise(resolve => setTimeout(resolve, 4000));

      const mockPlan = {
        id: Date.now(),
        generatedAt: new Date().toISOString(),
        totalVisits: Math.min(selectedClients.length, config.maxVisits),
        estimatedTime: `${Math.ceil(selectedClients.length * 0.5)} horas`,
        successProbability: 78.5,
        optimizedRoute: [
          {
            id: 1,
            client: selectedClients[0] || { name: 'Juan Pérez', address: 'Zona 10, Guatemala' },
            priority: 'high',
            estimatedTime: '09:00',
            duration: '30 min',
            type: 'visit',
            coordinates: { lat: 14.6349, lng: -90.5069 }
          },
          {
            id: 2,
            client: selectedClients[1] || { name: 'María García', address: 'Zona 15, Guatemala' },
            priority: 'medium',
            estimatedTime: '10:00',
            duration: '25 min',
            type: 'call',
            coordinates: { lat: 14.6449, lng: -90.5169 }
          },
          {
            id: 3,
            client: selectedClients[2] || { name: 'Carlos López', address: 'Zona 1, Guatemala' },
            priority: 'high',
            estimatedTime: '11:30',
            duration: '35 min',
            type: 'visit',
            coordinates: { lat: 14.6249, lng: -90.4969 }
          }
        ],
        recommendations: [
          "Iniciar con clientes de alta prioridad en la mañana",
          "Usar llamadas telefónicas para clientes de bajo riesgo",
          "Agrupar visitas por zona geográfica para optimizar tiempo",
          "Enviar SMS de confirmación 1 hora antes de cada visita"
        ],
        aiInsights: [
          "Los clientes de Zona 10 tienen mayor probabilidad de pago",
          "Evitar visitas después de las 16:00 en Zona 1",
          "Los martes y jueves muestran mejor tasa de éxito",
          "Clientes con historial de pagos puntuales responden mejor a llamadas"
        ]
      };

      setPlan(mockPlan);
      setStep('results');
    } catch (error) {
      console.error('❌ Error generando plan:', error);
      alert(`Error generando plan: ${error.message}`);
      setStep('config');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setPlan(null);
    setStep('config');
    setIsGenerating(false);
    onClose();
  };

  const exportPlan = () => {
    if (plan) {
      const dataStr = JSON.stringify(plan, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plan-visitas-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
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
                {t('aiVisit.title')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'config' && (
            <div className="space-y-6">
              {/* Clientes seleccionados */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('aiVisit.clientesSeleccionados')}
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-700">
                        {t('aiVisit.totalClientes')}: {selectedClients.length}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {selectedClients.slice(0, 3).map(client => client.name).join(', ')}
                        {selectedClients.length > 3 && ` y ${selectedClients.length - 3} más...`}
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('aiVisit.configuracionVisitas')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('aiVisit.prioridad')}
                    </label>
                    <select
                      name="priority"
                      value={config.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('aiVisit.horarioPreferido')}
                    </label>
                    <select
                      name="preferredTime"
                      value={config.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('aiVisit.maximoVisitas')}
                    </label>
                    <input
                      type="number"
                      name="maxVisits"
                      value={config.maxVisits}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="includeCalls"
                        checked={config.includeCalls}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {t('aiVisit.incluirLlamadas')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="includeSMS"
                        checked={config.includeSMS}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {t('aiVisit.incluirSMS')}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={generatePlan}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 flex items-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {t('aiVisit.generarPlan')}
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('aiVisit.generandoPlan')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('aiVisit.analizandoDatos')}
              </p>
              
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <div className="animate-pulse w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  {t('aiVisit.analizandoHistorial')}
                </div>
                <div className="flex items-center justify-center">
                  <div className="animate-pulse w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  {t('aiVisit.calculandoRutas')}
                </div>
                <div className="flex items-center justify-center">
                  <div className="animate-pulse w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  {t('aiVisit.generandoRecomendaciones')}
                </div>
              </div>
            </div>
          )}

          {step === 'results' && plan && (
            <div className="space-y-6">
              {/* Header del plan */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('aiVisit.planGenerado')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('aiVisit.listoParaEjecutar')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={exportPlan}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t('aiVisit.exportarPlan')}
                  </button>
                </div>
              </div>

              {/* Métricas del plan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-blue-700">
                      {t('aiVisit.totalVisitas')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {plan.totalVisits}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-green-700">
                      {t('aiVisit.tiempoEstimado')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {plan.estimatedTime}
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-purple-700">
                      {t('aiVisit.probabilidadExito')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {plan.successProbability}%
                  </div>
                </div>
              </div>

              {/* Ruta optimizada */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 text-primary-500 mr-2" />
                  {t('aiVisit.rutaOptimizada')}
                </h4>
                <div className="space-y-3">
                  {plan.optimizedRoute.map((visit, index) => (
                    <div key={visit.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {visit.client.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {visit.client.address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {visit.estimatedTime}
                        </div>
                        <div className="flex items-center">
                          {visit.type === 'visit' ? (
                            <MapPin className="w-4 h-4 mr-1" />
                          ) : visit.type === 'call' ? (
                            <Phone className="w-4 h-4 mr-1" />
                          ) : (
                            <MessageSquare className="w-4 h-4 mr-1" />
                          )}
                          {visit.duration}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          visit.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : visit.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {visit.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendaciones de IA */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 text-primary-500 mr-2" />
                  {t('aiVisit.recomendacionesIA')}
                </h4>
                <ul className="space-y-2">
                  {plan.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insights de IA */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                  Insights de IA
                </h4>
                <ul className="space-y-2">
                  {plan.aiInsights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setStep('config')}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t('aiVisit.modificarConfiguracion')}
                </button>
                <button
                  onClick={() => {/* Implementar ejecución del plan */}}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('aiVisit.ejecutarPlan')}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {t('aiVisit.cancelar')}
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