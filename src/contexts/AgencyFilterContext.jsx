import React, { createContext, useContext, useState } from 'react';

const AgencyFilterContext = createContext();

export const useAgencyFilter = () => {
  const context = useContext(AgencyFilterContext);
  if (!context) {
    throw new Error('useAgencyFilter must be used within an AgencyFilterProvider');
  }
  return context;
};

export const AgencyFilterProvider = ({ children }) => {
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedAgencyId, setSelectedAgencyId] = useState('');

  const value = {
    selectedAgency,
    setSelectedAgency,
    selectedAgencyId,
    setSelectedAgencyId
  };

  return (
    <AgencyFilterContext.Provider value={value}>
      {children}
    </AgencyFilterContext.Provider>
  );
};
