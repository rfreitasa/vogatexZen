import React from 'react';
import { useTransition } from 'react-spring';

import { Container, Routes } from './styles';

import { useMenu } from '../../hooks/menu';

import SideBar from 'components/Sidebar/Sidebar.js';
import NavBar from 'components/Navbars/Navbar.js';
import Footer from 'components/Footer/Footer.js';

const Layout= ({ children }) => {
  const { expansed } = useMenu();

  const menu = useTransition(SideBar, null, {
    initial: { gridTemplateColumns: '12% 88%' },
    update: {
      gridTemplateColumns: !expansed ? '12% 88%' : '5%  95%',
    },
  });

  return (
    <>
      {menu.map(({ key, props }) => {
        return (
          <Container key={key} style={props}>
            <SideBar />
            <NavBar />
            <Routes>{children}</Routes>
            <Footer />
          </Container>
        );
      })}
    </>
  );
};

export default Layout;
