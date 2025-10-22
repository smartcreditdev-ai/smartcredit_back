// Servicio simple de email que puedes integrar con tu backend
// o usar con servicios como EmailJS, SendGrid, etc.

// Función para enviar email usando fetch a tu propio endpoint
export const sendEmailToBackend = async (userData) => {
  try {
    console.log('📧 Enviando email vía backend personalizado:', userData.email);

    const emailPayload = {
      to: userData.email,
      subject: 'Bienvenido a SmartCredit - Credenciales de Acceso',
      template: 'welcome',
      data: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        password: userData.password,
        rol: userData.rol,
        loginUrl: `${window.location.origin}/login`,
        companyName: 'SmartCredit'
      }
    };

    // Aquí harías la llamada a tu backend
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(emailPayload)
    // });

    // Por ahora, simulamos el envío
    console.log('📧 Payload del email:', emailPayload);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Email enviado exitosamente',
      payload: emailPayload
    };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
};

// Función para mostrar las credenciales en una ventana modal
export const showCredentialsModal = (userData) => {
  const { nombre, apellido, email, password, rol } = userData;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;
  
  content.innerHTML = `
    <h2 style="color: #333; margin-top: 0;">🎉 Usuario Creado Exitosamente</h2>
    <p>Hola <strong>${nombre} ${apellido}</strong>, tu cuenta ha sido creada.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #495057; margin-top: 0;">🔐 Credenciales de Acceso</h3>
      <div style="margin: 10px 0;">
        <strong>Email:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${email}</code>
      </div>
      <div style="margin: 10px 0;">
        <strong>Contraseña:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${password}</code>
      </div>
      <div style="margin: 10px 0;">
        <strong>Rol:</strong> <span style="background: #d4edda; color: #155724; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${rol}</span>
      </div>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <strong>⚠️ Importante:</strong> Por favor, comparte estas credenciales con el usuario de forma segura y pídele que cambie la contraseña en su primer acceso.
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <button onclick="this.closest('.modal').remove()" style="
        background: #007bff;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      ">Entendido</button>
    </div>
  `;
  
  modal.className = 'modal';
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Auto-remover después de 30 segundos
  setTimeout(() => {
    if (modal.parentNode) {
      modal.remove();
    }
  }, 30000);
};

// Función para copiar credenciales al portapapeles
export const copyCredentialsToClipboard = (userData) => {
  const { nombre, apellido, email, password, rol } = userData;
  
  const credentials = `
Credenciales de Acceso - SmartCredit

Usuario: ${nombre} ${apellido}
Email: ${email}
Contraseña: ${password}
Rol: ${rol}

URL de acceso: ${window.location.origin}/login

Por favor, cambia tu contraseña después del primer inicio de sesión.
  `.trim();
  
  navigator.clipboard.writeText(credentials).then(() => {
    console.log('✅ Credenciales copiadas al portapapeles');
    // Mostrar notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 6px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = '✅ Credenciales copiadas al portapapeles';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }).catch(err => {
    console.error('❌ Error copiando al portapapeles:', err);
  });
};

export default {
  sendEmailToBackend,
  showCredentialsModal,
  copyCredentialsToClipboard
};
