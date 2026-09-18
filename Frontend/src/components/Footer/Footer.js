import React from 'react';

import { Container } from './styles';

const Footer = () => {
  return (
    <Container>
      <span>
        &copy; {1900 + new Date().getYear()} BREATH IT SOLUTIONS - SALESBREATH
      </span>
    </Container>
  );
};

export default Footer;
