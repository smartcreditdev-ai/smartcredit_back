import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AgencyFilterProvider } from './contexts/AgencyFilterContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Creditos from './pages/Creditos';
import GestionCartera from './pages/GestionCartera';
import Simulador from './pages/Simulador';
import Productos from './pages/Productos';
import Cobranzas from './pages/Cobranzas';
import Expedientes from './pages/Expedientes';
import Reportes from './pages/Reportes';
import Integraciones from './pages/Integraciones';
import Administrador from './pages/Administrador';
import Soporte from './pages/Soporte';
import Login from './pages/Login';
import AuthCallback from './pages/auth/callback';

function App() {
  return (
    <AuthProvider>
      <AgencyFilterProvider>
        <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Redirigir raíz a dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout title="Dashboard General" subtitle="Resumen ejecutivo del sistema">
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/creditos" element={
          <ProtectedRoute>
            <MainLayout title="Módulo Créditos" subtitle="Gestión de cartera crediticia">
              <Creditos />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/cartera" element={
          <ProtectedRoute>
            <MainLayout title="Gestión de Cartera" subtitle="Análisis y gestión integral de la cartera crediticia">
              <GestionCartera />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/simulador" element={
          <ProtectedRoute>
            <MainLayout title="Simulador de Préstamos" subtitle="Calculadora de préstamos y simulaciones financieras">
              <Simulador />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/productos" element={
          <ProtectedRoute>
            <MainLayout title="Gestión de Productos" subtitle="Administración de productos crediticios y servicios">
              <Productos />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/cobranzas" element={
          <ProtectedRoute>
            <MainLayout title="Módulo Cobranzas" subtitle="Gestión de cartera en mora">
              <Cobranzas />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/expedientes" element={
          <ProtectedRoute>
            <MainLayout title="Módulo Expedientes" subtitle="Gestión documental de clientes">
              <Expedientes />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/reportes" element={
          <ProtectedRoute>
            <MainLayout title="Reportes y BI" subtitle="Análisis y reportes del sistema">
              <Reportes />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/integraciones" element={
          <ProtectedRoute>
            <MainLayout title="Integraciones" subtitle="Conectores y APIs del sistema">
              <Integraciones />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/administrador" element={
          <ProtectedRoute>
            <MainLayout title="Administrador" subtitle="Gestión de usuarios, roles y configuraciones">
              <Administrador />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/soporte" element={
          <ProtectedRoute>
            <MainLayout title="Centro de Soporte" >
              <Soporte />
            </MainLayout>
          </ProtectedRoute>
        } />
        </Routes>
      </AgencyFilterProvider>
    </AuthProvider>
  );
}

export default App;
