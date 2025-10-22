import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SolicitudCreditoForm from './SolicitudCreditoForm';
import NotificationModal from './NotificationModal';

const SolicitudCredito = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    type: 'success',
    title: '',
    message: ''
  });

  const handleSave = async (aplicacionData) => {
    try {
      // Mostrar notificación de éxito
      setNotificationData({
        type: 'success',
        title: '¡Solicitud Creada!',
        message: 'La solicitud de crédito ha sido creada exitosamente y está pendiente de revisión.'
      });
      setShowNotification(true);
      // El formulario se resetea automáticamente
    } catch (error) {
      console.error('Error guardando aplicación:', error);
      // Mostrar notificación de error
      setNotificationData({
        type: 'error',
        title: 'Error al Crear Solicitud',
        message: 'Hubo un problema al crear la solicitud. Por favor, inténtalo de nuevo.'
      });
      setShowNotification(true);
    }
  };

  const handleCloseForm = () => {
    // En este caso, no cerramos el formulario porque es la pestaña principal
    // Solo reseteamos si es necesario
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Nueva Solicitud de Crédito</h2>
        <p className="text-gray-600">Completa el formulario para crear una nueva solicitud de crédito</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow p-6">
        <SolicitudCreditoForm
          aplicacion={null}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      </div>

      {/* Modal de Notificación */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationData.type}
        title={notificationData.title}
        message={notificationData.message}
        autoClose={true}
        duration={4000}
      />
    </div>
  );
};

export default SolicitudCredito;