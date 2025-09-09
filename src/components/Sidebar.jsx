import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  DollarSign, 
  FolderOpen, 
  BarChart3, 
  Plug 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/creditos', label: 'Créditos', icon: CreditCard },
    { path: '/cobranzas', label: 'Cobranzas', icon: DollarSign },
    { path: '/expedientes', label: 'Expedientes', icon: FolderOpen },
    { path: '/reportes', label: 'Reportes/BI', icon: BarChart3 },
    { path: '/integraciones', label: 'Integraciones', icon: Plug },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-dark-800 shadow-lg z-30">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="SmartCredit Logo" 
              className="w-12 h-18 rounded-lg shadow-sm logo-smartcredit"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">
              Smart<span className="text-primary-400">Credit</span>
            </h1>
            <p className="text-gray-400 text-xs truncate">Backoffice</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
