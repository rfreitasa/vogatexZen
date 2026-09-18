import React from 'react';

import { AuthProvider } from './auth';
import { MenuProvider } from './menu';

const Hooks = ({ children }) => (
  <AuthProvider>
      <MenuProvider>
      </MenuProvider>
  </AuthProvider>
);

export default Hooks;
