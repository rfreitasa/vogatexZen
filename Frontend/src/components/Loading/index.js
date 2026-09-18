import React from 'react';

import { Container } from './styles';

import logo from '../../assets/logo.png';

const Loading = ({ isLoading }) => {
  return (
    <Container isLoading={isLoading}>
      <img src={logo} alt="logo" />
    </Container>
  );
};

export default Loading;
