import React, { useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import { useHistory } from 'react-router-dom';
import { useMenu } from '../../hooks/menu';
import { FaAlignLeft, FaCircle } from 'react-icons/fa';


import { Container } from './styles';

import ListMenu from '../ListMenu';


import logo from '../../assets/logo-mini.png';
import { Email } from '@material-ui/icons';


const SideBar = () => {
  const { expansed, expansedFalse } = useMenu();

  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (window.screen.width <= 850) {
      expansedFalse();
    }
  });
  const email = sessionStorage.getItem('email');


  return (
    <>
      <Container isExpansed={expansed} ref={ref}>
        <img src={logo} alt="home" />
        
        <ListMenu />
      </Container>
    </>
  );
};

export default SideBar;
