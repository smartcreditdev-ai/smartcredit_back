// Configuración para el envío de emails
// Puedes cambiar estas configuraciones según tu proveedor de email

export const EMAIL_CONFIG = {
  // Configuración de Gmail API (si decides usarla)
  GMAIL: {
    clientId: '1089227604602-of4gnto5kq77i8lsndlvelar15kvmn3q.apps.googleusercontent.com',
    apiKey: 'AIzaSyBmKCC8hBZ7thXw4fEppAKwpUNNQpFMMKU',
    // Necesitarás configurar OAuth2 para obtener refresh token
  },
  
  // Configuración de EmailJS (más fácil de implementar)
  EMAILJS: {
    serviceId: 'service_smartcredit', // Cambia por tu service ID
    templateId: 'template_welcome', // Cambia por tu template ID
    publicKey: 'YOUR_PUBLIC_KEY', // Cambia por tu public key
  },
  
  // Configuración de tu backend personalizado
  BACKEND: {
    endpoint: '/api/send-email', // Endpoint de tu backend
    apiKey: 'YOUR_API_KEY', // Si necesitas autenticación
  },
  
  // Configuración general
  GENERAL: {
    companyName: 'SmartCredit',
    fromEmail: 'noreply@smartcredit.com',
    fromName: 'SmartCredit Team',
    supportEmail: 'support@smartcredit.com',
  }
};

// Función para obtener la configuración activa
export const getActiveEmailConfig = () => {
  // Por defecto, usamos el servicio simple
  return {
    provider: 'simple', // 'gmail', 'emailjs', 'backend', 'simple'
    config: EMAIL_CONFIG.GENERAL
  };
};

export default EMAIL_CONFIG;
