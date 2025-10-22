import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  serviceId: 'service_smartcredit', // Necesitarás crear este servicio en EmailJS
  templateId: 'template_welcome', // Necesitarás crear este template
  publicKey: 'YOUR_PUBLIC_KEY' // Tu clave pública de EmailJS
};

// Función para enviar email de bienvenida
export const sendWelcomeEmail = async (userData) => {
  try {
    console.log('📧 Enviando email de bienvenida a:', userData.email);

    // Inicializar EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Datos del template
    const templateParams = {
      to_email: userData.email,
      to_name: `${userData.nombre} ${userData.apellido}`,
      user_email: userData.email,
      user_password: userData.password,
      user_role: userData.rol,
      login_url: window.location.origin + '/login',
      company_name: 'SmartCredit'
    };

    // Enviar email
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('✅ Email enviado exitosamente:', response);
    return {
      success: true,
      message: 'Email de bienvenida enviado exitosamente',
      response: response
    };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
};

// Función alternativa usando fetch para enviar a un endpoint personalizado
export const sendEmailViaAPI = async (userData) => {
  try {
    console.log('📧 Enviando email vía API personalizada:', userData.email);

    const emailData = {
      to: userData.email,
      subject: 'Bienvenido a SmartCredit - Credenciales de Acceso',
      html: createWelcomeEmailHTML(userData),
      text: createWelcomeEmailText(userData)
    };

    // Aquí harías una llamada a tu API personalizada
    // Por ahora, simularemos el envío
    console.log('📧 Datos del email:', emailData);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Email enviado vía API personalizada',
      emailData: emailData
    };

  } catch (error) {
    console.error('❌ Error enviando email vía API:', error);
    throw error;
  }
};

// Crear contenido HTML del email
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
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                margin: 20px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-text {
                font-size: 18px;
                margin-bottom: 30px;
                color: #555;
            }
            .credentials-box {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                position: relative;
            }
            .credentials-box::before {
                content: '🔐';
                position: absolute;
                top: -15px;
                left: 20px;
                background: white;
                padding: 0 10px;
                font-size: 20px;
            }
            .credential-item {
                margin: 15px 0;
                padding: 10px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .credential-item:last-child {
                border-bottom: none;
            }
            .credential-label {
                font-weight: 600;
                color: #495057;
                display: inline-block;
                width: 120px;
            }
            .credential-value {
                color: #212529;
                font-family: 'Courier New', monospace;
                background: #e9ecef;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 14px;
            }
            .instructions {
                background: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }
            .instructions h3 {
                margin: 0 0 15px 0;
                color: #1976d2;
                font-size: 16px;
            }
            .instructions ul {
                margin: 0;
                padding-left: 20px;
            }
            .instructions li {
                margin: 8px 0;
                color: #424242;
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .login-button {
                display: inline-block;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s;
            }
            .login-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
            }
            .security-notice {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ¡Bienvenido a SmartCredit!</h1>
                <p>Sistema de Gestión de Créditos</p>
            </div>
            
            <div class="content">
                <div class="welcome-text">
                    <strong>Hola ${nombre} ${apellido},</strong><br>
                    Tu cuenta ha sido creada exitosamente en el sistema SmartCredit.
                </div>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #495057;">Credenciales de Acceso</h3>
                    <div class="credential-item">
                        <span class="credential-label">Email:</span>
                        <span class="credential-value">${email}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Contraseña:</span>
                        <span class="credential-value">${password}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Rol:</span>
                        <span class="credential-value">${rol}</span>
                    </div>
                </div>
                
                <div class="security-notice">
                    <strong>⚠️ Importante:</strong> Por seguridad, cambia tu contraseña después del primer inicio de sesión.
                </div>
                
                <div class="instructions">
                    <h3>📋 Instrucciones de Acceso</h3>
                    <ul>
                        <li>Guarda estas credenciales en un lugar seguro</li>
                        <li>Haz clic en el botón de abajo para acceder al sistema</li>
                        <li>Cambia tu contraseña en la primera sesión</li>
                        <li>Si tienes problemas, contacta al administrador</li>
                    </ul>
                </div>
                
                <div class="button-container">
                    <a href="${window.location.origin}/login" class="login-button">
                        🚀 Iniciar Sesión
                    </a>
                </div>
                
                <p style="color: #6c757d; font-size: 14px; text-align: center;">
                    Si el botón no funciona, copia y pega esta URL en tu navegador:<br>
                    <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 3px;">
                        ${window.location.origin}/login
                    </code>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>SmartCredit</strong> - Sistema de Gestión de Créditos</p>
                <p>Este es un email automático. Por favor, no respondas a este mensaje.</p>
                <p>Si no solicitaste esta cuenta, contacta al administrador del sistema.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Crear contenido de texto plano del email
const createWelcomeEmailText = (userData) => {
  const { nombre, apellido, email, password, rol } = userData;
  
  return `
¡Bienvenido a SmartCredit!

Hola ${nombre} ${apellido},

Tu cuenta ha sido creada exitosamente en el sistema SmartCredit.

CREDENCIALES DE ACCESO:
- Email: ${email}
- Contraseña: ${password}
- Rol: ${rol}

INSTRUCCIONES:
1. Guarda estas credenciales en un lugar seguro
2. Accede al sistema en: ${window.location.origin}/login
3. Cambia tu contraseña después del primer inicio de sesión
4. Si tienes problemas, contacta al administrador

IMPORTANTE: Por seguridad, cambia tu contraseña después del primer acceso.

---
SmartCredit - Sistema de Gestión de Créditos
Este es un email automático. Por favor, no respondas a este mensaje.
  `;
};

export default {
  sendWelcomeEmail,
  sendEmailViaAPI
};
