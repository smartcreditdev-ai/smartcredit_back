# 📧 Configuración de Envío de Emails - SmartCredit

## 🎯 Funcionalidad Implementada

He implementado un sistema completo de envío de emails para las credenciales de nuevos usuarios. El sistema incluye:

### ✅ **Características Actuales:**
- ✅ Modal con credenciales que se muestra automáticamente
- ✅ Copia automática de credenciales al portapapeles
- ✅ Email HTML profesional con diseño responsive
- ✅ Integración con la creación de usuarios
- ✅ Logs detallados para debugging
- ✅ Manejo de errores sin interrumpir la creación del usuario

### 🔧 **Opciones de Configuración:**

## **Opción 1: Servicio Simple (Actual - Funciona Inmediatamente)**
- ✅ **Ya funciona** - No requiere configuración adicional
- ✅ Muestra modal con credenciales
- ✅ Copia automáticamente al portapapeles
- ✅ El admin puede compartir las credenciales manualmente

## **Opción 2: EmailJS (Recomendado - Fácil de configurar)**

### Pasos para configurar EmailJS:

1. **Crear cuenta en EmailJS:**
   - Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
   - Crea una cuenta gratuita

2. **Configurar servicio de email:**
   - Conecta tu cuenta de Gmail/Outlook
   - Crea un nuevo servicio llamado `service_smartcredit`

3. **Crear template de email:**
   - Crea un template llamado `template_welcome`
   - Usa este contenido HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenido a SmartCredit</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1>🎉 ¡Bienvenido a SmartCredit!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2>Hola {{to_name}},</h2>
        
        <p>Tu cuenta ha sido creada exitosamente en el sistema SmartCredit.</p>
        
        <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 5px; padding: 20px; margin: 20px 0;">
            <h3>🔐 Credenciales de Acceso</h3>
            <p><strong>Email:</strong> {{user_email}}</p>
            <p><strong>Contraseña:</strong> {{user_password}}</p>
            <p><strong>Rol:</strong> {{user_role}}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{login_url}}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">🚀 Iniciar Sesión</a>
        </div>
        
        <p><strong>⚠️ Importante:</strong> Cambia tu contraseña después del primer inicio de sesión.</p>
    </div>
</body>
</html>
```

4. **Actualizar configuración:**
   - Edita `src/config/emailConfig.js`
   - Reemplaza `YOUR_PUBLIC_KEY` con tu public key de EmailJS
   - Cambia `service_smartcredit` y `template_welcome` si usaste otros nombres

5. **Activar EmailJS:**
   - Edita `src/services/api.js`
   - Cambia `sendEmailViaAPI` por `sendWelcomeEmail` (de emailService.js)

## **Opción 3: Gmail API (Avanzado)**

### Pasos para configurar Gmail API:

1. **Configurar OAuth2:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto o selecciona uno existente
   - Habilita Gmail API
   - Crea credenciales OAuth2

2. **Obtener refresh token:**
   - Usa el script de autorización de Google
   - Guarda el refresh token en variables de entorno

3. **Configurar variables de entorno:**
```env
GMAIL_CLIENT_ID=1089227604602-of4gnto5kq77i8lsndlvelar15kvmn3q.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=tu_client_secret
GMAIL_REFRESH_TOKEN=tu_refresh_token
```

## **Opción 4: Backend Personalizado**

### Crear endpoint en tu backend:

```javascript
// Ejemplo con Node.js/Express
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text } = req.body;
  
  // Usar nodemailer, sendgrid, o tu proveedor preferido
  const result = await sendEmail({ to, subject, html, text });
  
  res.json({ success: true, result });
});
```

## 🚀 **Cómo Probar:**

1. **Crear un nuevo usuario** en la sección Administrador
2. **Marcar el checkbox** "Enviar email de bienvenida con credenciales"
3. **Verificar en la consola** los logs de envío
4. **Revisar el modal** que aparece con las credenciales
5. **Verificar el portapapeles** (se copia automáticamente)

## 📋 **Logs a Revisar:**

En la consola del navegador verás:
```
🔍 Iniciando creación de usuario: {email: "...", sendEmail: true}
📧 Enviando email de bienvenida...
✅ Email de bienvenida enviado exitosamente
✅ Usuario creado en tabla usuarios: {...}
```

## 🔧 **Personalización:**

### Cambiar el diseño del email:
- Edita `src/services/emailService.js`
- Modifica la función `createWelcomeEmailHTML()`

### Cambiar el modal de credenciales:
- Edita `src/services/simpleEmailService.js`
- Modifica la función `showCredentialsModal()`

### Cambiar la configuración:
- Edita `src/config/emailConfig.js`
- Actualiza los valores según tu proveedor

## ⚠️ **Notas Importantes:**

1. **Seguridad:** Nunca envíes contraseñas en texto plano por email en producción
2. **Spam:** Los emails pueden ir a la carpeta de spam
3. **Límites:** Los servicios gratuitos tienen límites de envío
4. **Backup:** El modal siempre se muestra como respaldo

## 🆘 **Solución de Problemas:**

### Si no aparece el modal:
- Verifica la consola del navegador
- Asegúrate de que `sendEmail` esté marcado

### Si no se copia al portapapeles:
- Verifica que el navegador permita acceso al portapapeles
- Revisa la consola por errores

### Si el email no llega:
- Revisa la carpeta de spam
- Verifica la configuración del proveedor
- Revisa los logs en la consola

---

**¿Necesitas ayuda con alguna configuración específica?** ¡Dime qué opción prefieres y te ayudo a configurarla!
