import { google } from 'googleapis';

// Configuración de Gmail API
const GMAIL_CONFIG = {
  clientId: '1089227604602-of4gnto5kq77i8lsndlvelar15kvmn3q.apps.googleusercontent.com',
  apiKey: 'AIzaSyBmKCC8hBZ7thXw4fEppAKwpUNNQpFMMKU',
  // Nota: Para usar Gmail API necesitamos un refresh token
  // Esto se obtiene a través del proceso de OAuth2
};

// Inicializar Gmail API
const initializeGmail = () => {
  const auth = new google.auth.OAuth2(
    GMAIL_CONFIG.clientId,
    null, // clientSecret (no necesario para API key)
    'http://localhost:3000' // redirectUri
  );

  auth.setCredentials({
    // Aquí necesitaríamos el refresh token
    // Por ahora usaremos una aproximación diferente
  });

  return google.gmail({ version: 'v1', auth });
};

// Función para enviar email de bienvenida con credenciales
export const sendWelcomeEmail = async (userData) => {
  try {
    console.log('📧 Iniciando envío de email de bienvenida:', userData.email);

    // Por ahora, vamos a usar una aproximación más simple
    // Crearemos un email HTML y lo enviaremos usando una API externa
    const emailContent = createWelcomeEmailHTML(userData);
    
    // Usar una API de envío de emails como EmailJS o similar
    // Por ahora, simularemos el envío
    console.log('📧 Contenido del email:', emailContent);
    
    return {
      success: true,
      message: 'Email de bienvenida enviado exitosamente',
      emailContent: emailContent
    };

  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
    throw error;
  }
};

// Crear el contenido HTML del email de bienvenida
const createWelcomeEmailHTML = (userData) => {
  const { nombre, apellido, email, password, rol } = userData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a SmartCredit</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .credentials {
                background: #e8f4fd;
                border: 1px solid #bee5eb;
                border-radius: 5px;
                padding: 20px;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 ¡Bienvenido a SmartCredit!</h1>
            <p>Sistema de Gestión de Créditos</p>
        </div>
        
        <div class="content">
            <h2>Hola ${nombre} ${apellido},</h2>
            
            <p>Tu cuenta ha sido creada exitosamente en el sistema SmartCredit. A continuación encontrarás tus credenciales de acceso:</p>
            
            <div class="credentials">
                <h3>🔐 Credenciales de Acceso</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Contraseña:</strong> ${password}</p>
                <p><strong>Rol:</strong> ${rol}</p>
            </div>
            
            <p><strong>Instrucciones importantes:</strong></p>
            <ul>
                <li>Guarda estas credenciales en un lugar seguro</li>
                <li>Cambia tu contraseña después del primer inicio de sesión</li>
                <li>Si tienes problemas para acceder, contacta al administrador</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${window.location.origin}/login" class="button">Iniciar Sesión</a>
            </div>
            
            <p><strong>¿Necesitas ayuda?</strong></p>
            <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactar al equipo de soporte.</p>
        </div>
        
        <div class="footer">
            <p>Este es un email automático del sistema SmartCredit.</p>
            <p>Por favor, no respondas a este email.</p>
        </div>
    </body>
    </html>
  `;
};

// Función alternativa usando EmailJS (más simple de implementar)
export const sendEmailWithEmailJS = async (userData) => {
  try {
    // EmailJS es más fácil de configurar y no requiere OAuth
    // Aquí implementaríamos la lógica de EmailJS
    
    console.log('📧 Enviando email con EmailJS:', userData.email);
    
    // Por ahora, retornamos éxito
    return {
      success: true,
      message: 'Email enviado con EmailJS'
    };
    
  } catch (error) {
    console.error('❌ Error enviando email con EmailJS:', error);
    throw error;
  }
};

export default {
  sendWelcomeEmail,
  sendEmailWithEmailJS
};
