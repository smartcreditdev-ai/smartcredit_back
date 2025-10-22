# SmartCredit Backoffice

Una aplicación web moderna para la gestión de créditos y cartera, construida con React, TailwindCSS y React Router.

## 🚀 Características

### 📊 Dashboard General
- Tarjetas con métricas clave (Créditos Activos, Cartera Total, % Mora, Promotores Activos)
- Gráficos de ejemplo para análisis de mora y distribución de cartera
- Panel de alertas y eventos en tiempo real

### 💳 Módulo Créditos
- Listado completo de créditos con filtros avanzados
- Búsqueda por cliente, promotor, sucursal y fecha
- Acciones de visualización y gestión

### 💰 Módulo Cobranzas
- Métricas de cartera en mora
- Gráficos de segmentación por días
- Tabla de clientes en mora con acciones de seguimiento

### 📂 Módulo Expedientes
- Gestión documental completa
- Visualización de documentos, fotos, contratos y GPS
- Sistema de referencias y validaciones

### 📈 Reportes y BI
- Análisis avanzado del negocio
- Métricas de rendimiento y ROI
- Predicciones y alertas inteligentes

### ⚙️ Integraciones
- Gestión de APIs y servicios externos
- Monitoreo de estado de integraciones
- Documentación de endpoints

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Herramienta de construcción
- **TailwindCSS** - Framework de estilos
- **React Router** - Navegación
- **Lucide React** - Iconos
- **Recharts** - Gráficos (preparado para implementación)

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd smartcredit_backoffice
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Sidebar.jsx     # Navegación lateral
│   ├── Header.jsx      # Encabezado de páginas
│   ├── StatCard.jsx    # Tarjetas de métricas
│   ├── DataTable.jsx   # Tabla de datos
│   ├── FilterBar.jsx   # Barra de filtros
│   └── ChartPlaceholder.jsx # Placeholder para gráficos
├── layouts/            # Layouts de la aplicación
│   └── MainLayout.jsx  # Layout principal
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.jsx   # Dashboard principal
│   ├── Creditos.jsx    # Módulo de créditos
│   ├── Cobranzas.jsx   # Módulo de cobranzas
│   ├── Expedientes.jsx # Módulo de expedientes
│   ├── Reportes.jsx    # Reportes y BI
│   └── Integraciones.jsx # Integraciones
├── App.jsx             # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🎨 Diseño

La aplicación utiliza un diseño moderno con:
- Sidebar fijo con navegación oscura
- Tarjetas con métricas y gráficos
- Tablas responsivas con filtros
- Colores consistentes y accesibles
- Iconos intuitivos de Lucide React

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Linter de código

## 📱 Responsive Design

La aplicación está optimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Próximos Pasos

- [ ] Implementar gráficos reales con Recharts
- [ ] Conectar con APIs backend
- [ ] Agregar autenticación y autorización
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar tests unitarios
- [ ] Optimizar rendimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
