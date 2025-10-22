# 🚀 Deploy en Vercel - SmartCredit Backoffice

## 📋 Pasos para hacer deploy

### 1. **Preparar el proyecto**
```bash
# Asegúrate de que el proyecto esté en un repositorio Git
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

### 2. **Crear cuenta en Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu cuenta de GitHub/GitLab/Bitbucket

### 3. **Importar proyecto**
1. En el dashboard de Vercel, haz clic en "New Project"
2. Selecciona tu repositorio `smartcredit_backoffice`
3. Vercel detectará automáticamente que es un proyecto Vite

### 4. **Configurar variables de entorno**
En la sección "Environment Variables" de Vercel, agrega:

```
VITE_SUPABASE_URL = https://muzjglimzoewwhysajmq.supabase.co
VITE_SUPABASE_ANON_KEY = tu_anon_key_de_supabase
```

### 5. **Configuración del build**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 6. **Deploy**
1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación
3. Recibirás una URL como: `https://tu-proyecto.vercel.app`

## 🔧 Configuración adicional

### Variables de entorno recomendadas:
```env
VITE_SUPABASE_URL=https://muzjglimzoewwhysajmq.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_GMAIL_CLIENT_ID=1089227604602-of4gnto5kq77i8lsndlvelar15kvmn3q.apps.googleusercontent.com
VITE_GMAIL_API_KEY=AIzaSyBmKCC8hBZ7thXw4fEppAKwpUNNQpFMMKU
```

### Dominio personalizado (opcional):
1. Ve a "Domains" en tu proyecto de Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## 🐛 Solución de problemas

### Error de build:
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no haya errores de linting

### Error de variables de entorno:
- Verifica que las variables estén configuradas en Vercel
- Asegúrate de que empiecen con `VITE_`

### Error de rutas:
- El archivo `vercel.json` ya está configurado para SPA
- Todas las rutas redirigen a `index.html`

## 📱 Funcionalidades en producción

✅ **Funcionalidades que funcionan:**
- Dashboard con estadísticas
- Gestión de usuarios con invitaciones por email
- Solicitudes de crédito
- Gestión de prospectos
- Reportes y gráficos
- Sistema de autenticación

✅ **Emails:**
- Invitaciones de usuarios funcionan
- Modal de credenciales como respaldo

## 🔒 Seguridad

- Las variables de entorno están protegidas
- El Service Role Key solo se usa en el cliente (para desarrollo)
- En producción, considera usar un backend para operaciones sensibles

## 📊 Monitoreo

Vercel proporciona:
- Analytics de rendimiento
- Logs de errores
- Métricas de uso
- Deploys automáticos desde Git

---

**¡Tu aplicación estará disponible en minutos!** 🎉
