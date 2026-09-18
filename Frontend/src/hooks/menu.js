import React, { createContext, useContext, useCallback, useState } from 'react';
import { Provider } from 'react-redux';

const MenuContext = createContext({});

export const MenuProvider=({ children }) => {
  const [expansed, setExpansed] = useState(false);
  
  const expansedFalse = useCallback(() => {
    setExpansed(false);
  }, []);

  const handleExpansed = useCallback(() => {
    if (expansed) {
      setExpansed(false);
    } else {
      setExpansed(true);
    }
  }, [expansed]);

  return (
    <MenuContext.Provider value={{ handleExpansed, expansed, expansedFalse }}>
      {children}
    </MenuContext.Provider>
  );
};

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be user within an AuthProvider');
  }

  return context;
}
