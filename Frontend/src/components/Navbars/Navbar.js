import React from 'react';

import { FiMenu, FiLogOut } from 'react-icons/fi';

import { useMenu } from '../../hooks/menu';
import { useAuth } from '../../hooks/auth';
import AdminNavbarLinks from "./AdminNavbarLinks.js";

import { Container, ButtonContainer } from './styles';

const NavBar = () => {
  const { handleExpansed } = useMenu();
  const { signOut } = useAuth();

  return (
    <Container>
      <button type="button" onClick={() => handleExpansed()}>
        <FiMenu size={20} />
      </button>

      <ButtonContainer>

      <AdminNavbarLinks/>
      </ButtonContainer>
    </Container>
  );
};

export default NavBar;






