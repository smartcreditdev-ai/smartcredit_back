import React, { useState } from 'react';
import CreditApplicationForm from '../components/CreditApplicationForm';
import CreditApplicationsTable from '../components/CreditApplicationsTable';
import ApprovalModal from '../components/ApprovalModal';
import PortfolioManagement from '../components/PortfolioManagement';
import CreditRenewal from '../components/CreditRenewal';
import ProspectForm from '../components/ProspectForm';
import ProspectsTable from '../components/ProspectsTable';
import AssignPromoterModal from '../components/AssignPromoterModal';
import CreditStatsOverview from '../components/CreditStatsOverview';
import { useAplicaciones, useClientesEnMora } from '../hooks/useSupabaseData';
import { FileText, CheckCircle, DollarSign, RefreshCw, Users, UserPlus, Loader2 } from 'lucide-react';

const Creditos = () => {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showProspectForm, setShowProspectForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedProspect, setSelectedProspect] = useState(null);
  
  // Obtener datos reales de aplicaciones
  const { aplicaciones, loading: aplicacionesLoading, error: aplicacionesError } = useAplicaciones();
  
  // Obtener datos de clientes en mora para cálculos
  const { clientes: clientesEnMora } = useClientesEnMora();

  // Datos de prospectos
  const [prospects, setProspects] = useState([
    {
      id: 'P001',
      cliente: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      montoSolicitado: 15000,
      producto: 'Personal',
      promotor: '',
      estado: 'Nuevo',
      fechaCreacion: '2024-01-15'
    },
    {
      id: 'P002',
      cliente: 'Laura Rodríguez',
      email: 'laura.rodriguez@email.com',
      montoSolicitado: 25000,
      producto: 'Hipotecario',
      promotor: 'María García',
      estado: 'En evaluación',
      fechaCreacion: '2024-01-14'
    },
    {
      id: 'P003',
      cliente: 'Miguel Torres',
      email: 'miguel.torres@email.com',
      montoSolicitado: 8000,
      producto: 'Automotriz',
      promotor: '',
      estado: 'Nuevo',
      fechaCreacion: '2024-01-13'
    }
  ]);

  // Funciones para manejo de solicitudes de crédito
  const handleAddApplication = (applicationData) => {
    const newApplication = {
      id: `S${String(applications.length + 1).padStart(3, '0')}`,
      ...applicationData,
      fechaSolicitud: new Date().toISOString()
    };
    setApplications(prev => [newApplication, ...prev]);
    console.log('Nueva solicitud agregada:', newApplication);
  };

  const handleApproveApplication = (applicationId, approvalData) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            estado: 'Aprobado',
            montoAprobado: approvalData.montoAprobado,
            plazoAprobado: approvalData.plazoAprobado,
            comentariosAprobacion: approvalData.comentarios,
            fechaAprobacion: new Date().toISOString()
          }
        : app
    ));
    console.log('Solicitud aprobada:', applicationId, approvalData);
  };

  const handleRejectApplication = (applicationId, rejectionData) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            estado: 'Denegado',
            comentariosDenegacion: rejectionData,
            fechaDenegacion: new Date().toISOString()
          }
        : app
    ));
    console.log('Solicitud denegada:', applicationId, rejectionData);
  };

  const handleViewApplication = (application) => {
    console.log('Ver solicitud:', application);
  };

  // Funciones para manejo de prospectos
  const handleAddProspect = (prospectData) => {
    const newProspect = {
      id: `P${String(prospects.length + 1).padStart(3, '0')}`,
      cliente: `${prospectData.nombre} ${prospectData.apellido}`,
      email: prospectData.email,
      montoSolicitado: parseInt(prospectData.montoSolicitado),
      producto: prospectData.producto,
      promotor: prospectData.promotor,
      estado: 'Nuevo',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setProspects(prev => [newProspect, ...prev]);
    console.log('Nuevo prospecto agregado:', newProspect);
  };

  const handleAssignPromoter = (prospectId, promoterId) => {
    setProspects(prev => prev.map(prospect => 
      prospect.id === prospectId 
        ? { ...prospect, promotor: promoterId, estado: 'En evaluación' }
        : prospect
    ));
    console.log('Promotor asignado:', prospectId, promoterId);
  };

  const handleViewProspect = (prospect) => {
    console.log('Ver prospecto:', prospect);
  };

  const handleEditProspect = (prospect) => {
    console.log('Editar prospecto:', prospect);
  };

  const handleDeleteProspect = (prospect) => {
    setProspects(prev => prev.filter(p => p.id !== prospect.id));
    console.log('Prospecto eliminado:', prospect);
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'solicitudes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Aprobar/Rechazar
          </button>
          <button
            onClick={() => setActiveTab('cartera')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cartera'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Gestión de Cartera
          </button>
          <button
            onClick={() => setActiveTab('renovacion')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'renovacion'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Renovación
          </button>
          <button
            onClick={() => setActiveTab('prospectos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prospectos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Prospectos
          </button>
        </nav>
      </div>

      {/* Estadísticas Generales */}
      <CreditStatsOverview
        totalClients={aplicaciones?.length || 0} // Solo clientes reales
        totalPortfolio={aplicaciones?.reduce((sum, app) => sum + (parseFloat(app.monto) || 0), 0) || 0} // Solo cartera real
        activeCredits={aplicaciones?.filter(app => app.estado === 'Aprobado').length || 0} // Solo créditos reales
        pendingApplications={aplicaciones?.filter(app => app.estado === 'Pendiente' || app.estado === 'En revisión').length || 0}
        overdueCredits={clientesEnMora?.length || 0} // En mora reales
        approvedThisMonth={aplicaciones?.filter(app => {
          const fecha = new Date(app.fecha_aprobacion);
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return app.estado === 'Aprobado' && fecha >= lastMonth;
        }).length || 0}
        prospects={prospects.length}
        renewalsPending={0} // Sin renovaciones por ahora
        aplicaciones={aplicaciones || []} // Datos reales para cálculos
        clientesEnMora={clientesEnMora || []} // Datos reales de mora
      />

      {/* Tab Content */}
      {activeTab === 'solicitudes' ? (
        <>
          {/* Applications Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Aprobar/Rechazar Créditos</h2>
              <p className="text-sm text-gray-600">Revisa, aprueba o deniega solicitudes de crédito</p>
            </div>
            <button
              onClick={() => setShowApplicationForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Nueva Solicitud</span>
            </button>
          </div>

          {aplicacionesLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Cargando solicitudes...</span>
            </div>
          ) : aplicacionesError ? (
            <div className="text-center text-red-600 py-8">
              <p>Error al cargar las solicitudes: {aplicacionesError}</p>
            </div>
          ) : (
            <CreditApplicationsTable
              applications={aplicaciones || []}
              onApprove={(application) => {
                setSelectedApplication(application);
                setShowApprovalModal(true);
              }}
              onReject={(application) => {
                setSelectedApplication(application);
                setShowApprovalModal(true);
              }}
              onView={handleViewApplication}
            />
          )}
        </>
      ) : activeTab === 'cartera' ? (
        <PortfolioManagement />
      ) : activeTab === 'renovacion' ? (
        <CreditRenewal />
      ) : activeTab === 'prospectos' ? (
        <>
          {/* Prospects Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Gestión de Prospectos</h2>
              <p className="text-sm text-gray-600">Administra los prospectos y asigna promotores</p>
            </div>
            <button
              onClick={() => setShowProspectForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Prospecto</span>
            </button>
          </div>

          <ProspectsTable
            prospects={prospects}
            onAssignPromoter={(prospect) => {
              setSelectedProspect(prospect);
              setShowAssignModal(true);
            }}
            onView={handleViewProspect}
            onEdit={handleEditProspect}
            onDelete={handleDeleteProspect}
          />
        </>
      ) : null}

      {/* Modals */}
      <CreditApplicationForm
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSubmit={handleAddApplication}
      />

      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onApprove={handleApproveApplication}
        onReject={handleRejectApplication}
      />

      <ProspectForm
        isOpen={showProspectForm}
        onClose={() => setShowProspectForm(false)}
        onSubmit={handleAddProspect}
      />

      <AssignPromoterModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedProspect(null);
        }}
        prospect={selectedProspect}
        onAssign={handleAssignPromoter}
      />
    </div>
  );
};

export default Creditos;
