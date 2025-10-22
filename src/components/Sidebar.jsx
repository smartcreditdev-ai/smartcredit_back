import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  CreditCard, 
  DollarSign, 
  FolderOpen, 
  BarChart3, 
  Plug,
  Shield,
  X,
  Lock,
  Calculator,
  Package,
  HeadphonesIcon,
  TrendingUp
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const menuItems = [
    { path: '/', label: t('navigation.dashboard'), icon: LayoutDashboard, enabled: true },
    { path: '/creditos', label: t('navigation.creditos'), icon: CreditCard, enabled: true },
    { path: '/cartera', label: t('navigation.cartera'), icon: TrendingUp, enabled: true },
    { path: '/simulador', label: t('navigation.simulador'), icon: Calculator, enabled: true },
    { path: '/productos', label: t('navigation.productos'), icon: Package, enabled: true },
    { path: '/cobranzas', label: t('navigation.cobranzas'), icon: DollarSign, enabled: true },
    { path: '/expedientes', label: t('navigation.expedientes'), icon: FolderOpen, enabled: false },
    { path: '/reportes', label: t('navigation.reportes'), icon: BarChart3, enabled: false },
    { path: '/integraciones', label: t('navigation.integraciones'), icon: Plug, enabled: false },
    { path: '/administrador', label: t('navigation.administrador'), icon: Shield, enabled: true },
    { path: '/soporte', label: t('navigation.soporte'), icon: HeadphonesIcon, enabled: true },
  ];

  return (
    <div className={`fixed top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:left-0 lg:translate-x-0 lg:z-30 right-0 z-40 flex flex-col`}>
      <div className="p-6 flex-shrink-0">
        <div className="flex justify-between items-center lg:justify-center">
          <div className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="SmartCredit Logo" 
              className="w-48 h-32 lg:w-60 lg:h-40 rounded-lg shadow-sm logo-smartcredit"
            />
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isEnabled = item.enabled;
            
            return (
              <li key={item.path}>
                {isEnabled ? (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                ) : (
                  <div 
                    className="sidebar-item opacity-50 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                    <Lock className="w-4 h-4 ml-2 text-gray-400" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Lock className="w-6 h-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Funcionalidad Premium</h3>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Esta funcionalidad está disponible en el <strong>Plan Pro</strong>. 
                Para acceder a todas las características avanzadas, contacte con administración.
              </p>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-2">Plan Pro incluye:</h4>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>• Módulo de Cobranzas completo</li>
                  <li>• Gestión de Expedientes</li>
                  <li>• Reportes y Business Intelligence</li>
                  <li>• Integraciones avanzadas</li>
                  <li>• Panel de Administración</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Aquí podrías redirigir a una página de contacto o administración
                  window.open('mailto:admin@empresa.com?subject=Solicitud Plan Pro', '_blank');
                }}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Contactar Administración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
