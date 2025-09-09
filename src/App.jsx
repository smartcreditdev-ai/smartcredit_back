import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Creditos from './pages/Creditos';
import Cobranzas from './pages/Cobranzas';
import Expedientes from './pages/Expedientes';
import Reportes from './pages/Reportes';
import Integraciones from './pages/Integraciones';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout title="Dashboard General" subtitle="Resumen ejecutivo del sistema">
          <Dashboard />
        </MainLayout>
      } />
      <Route path="/creditos" element={
        <MainLayout title="Módulo Créditos" subtitle="Gestión de cartera crediticia">
          <Creditos />
        </MainLayout>
      } />
      <Route path="/cobranzas" element={
        <MainLayout title="Módulo Cobranzas" subtitle="Gestión de cartera en mora">
          <Cobranzas />
        </MainLayout>
      } />
      <Route path="/expedientes" element={
        <MainLayout title="Módulo Expedientes" subtitle="Gestión documental de clientes">
          <Expedientes />
        </MainLayout>
      } />
      <Route path="/reportes" element={
        <MainLayout title="Reportes y BI" subtitle="Análisis y reportes del sistema">
          <Reportes />
        </MainLayout>
      } />
      <Route path="/integraciones" element={
        <MainLayout title="Integraciones" subtitle="Conectores y APIs del sistema">
          <Integraciones />
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;
