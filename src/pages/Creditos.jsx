import React, { useState } from 'react';
import CreditApplicationForm from '../components/CreditApplicationForm';
import CreditApplicationsTable from '../components/CreditApplicationsTable';
import ApprovalModal from '../components/ApprovalModal';
import PortfolioManagement from '../components/PortfolioManagement';
import CreditRenewal from '../components/CreditRenewal';
import ProspectForm from '../components/ProspectForm';
import ProspectsTable from '../components/ProspectsTable';
import AssignPromoterModal from '../components/AssignPromoterModal';
import { FileText, CheckCircle, DollarSign, RefreshCw, Users, UserPlus } from 'lucide-react';

const Creditos = () => {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showProspectForm, setShowProspectForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedProspect, setSelectedProspect] = useState(null);
  

  // Datos de solicitudes de crédito
  const [applications, setApplications] = useState([
    {
      id: 'S001',
      cliente: 'Roberto Silva',
      documento: '12345678',
      email: 'roberto.silva@email.com',
      telefono: '+54 11 1234-5678',
      direccion: 'Av. Corrientes 1234, CABA',
      ocupacion: 'Empleado',
      ingresosMensuales: 80000,
      gastosMensuales: 50000,
      montoSolicitado: 15000,
      plazo: 24,
      producto: 'personal',
      proposito: 'Compra de electrodomésticos',
      cuotaMensual: 750,
      estado: 'Pendiente',
      fechaSolicitud: '2024-01-15T10:30:00Z'
    },
    {
      id: 'S002',
      cliente: 'Laura Rodríguez',
      documento: '87654321',
      email: 'laura.rodriguez@email.com',
      telefono: '+54 11 8765-4321',
      direccion: 'Av. Santa Fe 5678, CABA',
      ocupacion: 'Profesional',
      ingresosMensuales: 120000,
      gastosMensuales: 70000,
      montoSolicitado: 25000,
      plazo: 36,
      producto: 'hipotecario',
      proposito: 'Compra de vivienda',
      cuotaMensual: 1200,
      estado: 'En revisión',
      fechaSolicitud: '2024-01-14T14:20:00Z'
    },
    {
      id: 'S003',
      cliente: 'Miguel Torres',
      documento: '11223344',
      email: 'miguel.torres@email.com',
      telefono: '+54 11 1122-3344',
      direccion: 'Av. Rivadavia 9012, CABA',
      ocupacion: 'Comerciante',
      ingresosMensuales: 100000,
      gastosMensuales: 60000,
      montoSolicitado: 8000,
      plazo: 12,
      producto: 'automotriz',
      proposito: 'Compra de vehículo',
      cuotaMensual: 800,
      estado: 'Aprobado',
      fechaSolicitud: '2024-01-13T09:15:00Z'
    }
  ]);

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

          <CreditApplicationsTable
            applications={applications}
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
