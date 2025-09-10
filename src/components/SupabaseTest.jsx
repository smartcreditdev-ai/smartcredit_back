import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as api from '../services/api';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Probando...');
  const [tableCounts, setTableCounts] = useState({});
  const [sampleData, setSampleData] = useState({});

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Probar conexión básica
        const { data, error } = await supabase
          .from('compania')
          .select('count')
          .limit(1);

        if (error) {
          setConnectionStatus(`Error: ${error.message}`);
          return;
        }

        setConnectionStatus('✅ Conexión exitosa');

        // Obtener conteos de todas las tablas
        const tables = ['compania', 'usuarios', 'clientes', 'aplicaciones', 'cobranzas', 'visitas'];
        const counts = {};

        for (const table of tables) {
          try {
            const { count, error: countError } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });

            if (!countError) {
              counts[table] = count;
            } else {
              counts[table] = `Error: ${countError.message}`;
            }
          } catch (err) {
            counts[table] = `Error: ${err.message}`;
          }
        }

        setTableCounts(counts);

        // Probar servicios API
        try {
          const [stats, moraData, distribucionData, clientesMora] = await Promise.all([
            api.getDashboardStats(),
            api.getMoraPorRango(),
            api.getDistribucionCartera(),
            api.getClientesEnMora()
          ]);

          setSampleData({
            stats,
            moraData: moraData.length,
            distribucionData: distribucionData.length,
            clientesMora: clientesMora.length
          });
        } catch (apiError) {
          console.error('Error probando servicios API:', apiError);
        }
      } catch (err) {
        setConnectionStatus(`Error de conexión: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🔗 Estado de Conexión Supabase</h3>
      
      <div className="mb-4">
        <p className="text-sm font-medium">Estado:</p>
        <p className="text-sm text-gray-600">{connectionStatus}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Conteo de registros por tabla:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(tableCounts).map(([table, count]) => (
            <div key={table} className="flex justify-between">
              <span className="font-medium">{table}:</span>
              <span className={typeof count === 'number' ? 'text-green-600' : 'text-red-600'}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(sampleData).length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Datos de prueba de servicios API:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="font-medium">Créditos activos:</span>
              <span className="text-blue-600">{sampleData.stats?.creditosActivos || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Cartera total:</span>
              <span className="text-green-600">${(sampleData.stats?.carteraTotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rangos de mora:</span>
              <span className="text-orange-600">{sampleData.moraData || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Clientes en mora:</span>
              <span className="text-red-600">{sampleData.clientesMora || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;
