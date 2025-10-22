import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  User
} from 'lucide-react';
import SeguimientoProspectos from '../components/SeguimientoProspectos';
import SolicitudCredito from '../components/SolicitudCredito';
import GestionProspectos from '../components/GestionProspectos';

const Creditos = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('seguimiento');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['seguimiento', 'solicitud', 'prospectos'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'seguimiento', label: 'Seguimiento de Solicitud', icon: Users, enabled: true },
    { id: 'solicitud', label: 'Solicitud', icon: FileText, enabled: true },
    { id: 'prospectos', label: 'Prospectos', icon: User, enabled: true }
  ];


  return (
    <div className="space-y-6">
      

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isEnabled = tab.enabled;
            
            return (
              <button
                key={tab.id}
                onClick={() => isEnabled && setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : isEnabled
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      : 'border-transparent text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      <div className="space-y-6">
        {/* Tab: Seguimiento de Solicitud */}
        {activeTab === 'seguimiento' && <SeguimientoProspectos />}

        {/* Tab: Solicitud */}
        {activeTab === 'solicitud' && <SolicitudCredito />}

        {/* Tab: Prospectos */}
        {activeTab === 'prospectos' && <GestionProspectos />}
      </div>
    </div>
  );
};

export default Creditos;