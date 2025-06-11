import React, { createContext, useContext, useState } from 'react';

const ProcurementContext = createContext(null);

export const ProcurementProvider = ({ children, initialActionMaps = {} }) => {
  const [actionMaps, setActionMaps] = useState(initialActionMaps);

  // You can add functions to update actionMaps if needed later

  return (
    <ProcurementContext.Provider value={{ actionMaps }}>
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (context === undefined) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
}; 