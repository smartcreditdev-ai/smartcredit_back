import React from 'react';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { Download, Calendar, Filter } from 'lucide-react';

const Reportes = () => {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reportes y Business Intelligence</h2>
          <p className="text-sm text-gray-600 mt-1">Análisis detallado del negocio</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Seleccionar Período</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">24.5%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <span className="text-white font-bold">↗</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio de Aprobación</p>
              <p className="text-2xl font-semibold text-gray-900">2.3 días</p>
              <p className="text-sm text-green-600 mt-1">-0.5 días vs mes anterior</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <span className="text-white font-bold">⏱</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
              <p className="text-2xl font-semibold text-gray-900">68.2%</p>
              <p className="text-sm text-red-600 mt-1">-1.2% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <span className="text-white font-bold">📊</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfacción del Cliente</p>
              <p className="text-2xl font-semibold text-gray-900">4.7/5</p>
              <p className="text-sm text-green-600 mt-1">+0.2 vs mes anterior</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <span className="text-white font-bold">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          type="line"
          title="Tendencia de Aprobaciones por Mes"
          description="Evolución de créditos aprobados en los últimos 12 meses"
        />
        <ChartPlaceholder
          type="bar"
          title="Rendimiento por Promotor"
          description="Comparativa de ventas y aprobaciones por promotor"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          type="pie"
          title="Distribución de Productos por Rentabilidad"
          description="Análisis de rentabilidad por tipo de producto"
        />
        <ChartPlaceholder
          type="bar"
          title="Análisis de Riesgo por Segmento"
          description="Clasificación de riesgo por segmento de cliente"
        />
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartPlaceholder
            type="line"
            title="Predicción de Cartera"
            description="Modelo predictivo de comportamiento de cartera"
          />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas de BI</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm font-medium text-yellow-800">Aumento en Mora</p>
              <p className="text-xs text-yellow-600">La mora ha aumentado 15% en la sucursal Norte</p>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <p className="text-sm font-medium text-green-800">Objetivo Cumplido</p>
              <p className="text-xs text-green-600">Meta de ventas superada en 8% este mes</p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm font-medium text-blue-800">Nueva Oportunidad</p>
              <p className="text-xs text-blue-600">Segmento joven muestra alta demanda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
