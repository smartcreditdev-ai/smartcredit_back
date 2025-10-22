import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAgencyFilter } from '../contexts/AgencyFilterContext';
import { getAgencias } from '../services/api';

const AgencyFilter = () => {
  const { t } = useTranslation();
  const { selectedAgency, setSelectedAgency, selectedAgencyId, setSelectedAgencyId } = useAgencyFilter();
  const [agencias, setAgencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        const data = await getAgencias();
        setAgencias(data);
      } catch (error) {
        console.error('Error cargando agencias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencias();
  }, []);

  const handleAgencyChange = (event) => {
    const agencyId = event.target.value;
    
    if (agencyId === '') {
      setSelectedAgency('');
      setSelectedAgencyId('');
    } else {
      const selectedAgencyData = agencias.find(agencia => agencia.id === agencyId);
      if (selectedAgencyData) {
        setSelectedAgency(selectedAgencyData.nombre);
        setSelectedAgencyId(selectedAgencyData.id);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span className="text-sm text-gray-600">Cargando agencias...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <label htmlFor="agency-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {t('filters.agencia')}:
      </label>
      <select
        id="agency-filter"
        value={selectedAgencyId}
        onChange={handleAgencyChange}
        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
      >
        <option value="">{t('filters.todasAgencias')}</option>
        {agencias.map((agencia) => (
          <option key={agencia.id} value={agencia.id}>
            {agencia.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AgencyFilter;
