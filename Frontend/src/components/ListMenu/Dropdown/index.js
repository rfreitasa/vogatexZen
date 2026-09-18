import React, { useState, useCallback, useEffect } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';
import { useMenu } from '../../../hooks/menu';
import { Container } from './styles';


const Dropdown = ({ children, icon: Icon, title }) => {
  const { expansed } = useMenu();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expansed) {
      setOpen(false);
    }
  }, [expansed]);

  const handleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleOpenOver = useCallback(() => {
    if (expansed) {
      setOpen(!open);
    }
  }, [expansed, open]);

  return (
    <Container
      isExpansed={expansed}
      open={open}
      onMouseEnter={() => handleOpenOver()}
      onMouseLeave={() => handleOpenOver()}
    >
      <button type="button" onClick={() => handleOpen()}>
        <Icon size={18} />
        <span>
          <p>{title}</p>
          <FiChevronLeft size={18} />
        </span>
      </button>
      <ul>{children}</ul>
    </Container>
  );
};

export default Dropdown;
