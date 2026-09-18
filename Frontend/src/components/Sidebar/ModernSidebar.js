import React, { useState, useEffect, useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import {
  FiSettings,
  FiUser,
  FiCompass,
  FiBox,
  FiCrosshair,
  FiCamera,
  FiDollarSign,
  FiChevronDown,
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiShoppingCart,
  FiBarChart2,
  FiFileText,
  FiUserPlus,
  FiLogOut
} from 'react-icons/fi';
import { 
  Dashboard, 
  ShoppingBasket, 
  SupervisorAccount, 
  Contacts, 
  AddShoppingCart, 
  Assessment,
  PersonAdd
} from '@material-ui/icons';

import { NavLink, useLocation } from 'react-router-dom';
import { Container, SidebarContainer, MenuList, UserInfo } from './ModernSidebarStyles';
import { useMenu } from '../../hooks/menu';

import logo from '../../assets/logo-mini.png';

const ModernSidebar = () => {
  const { expansed, expansedFalse } = useMenu();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const sidebarRef = useRef(null);
  const perfil = sessionStorage.getItem('perfil');

  useOnClickOutside(sidebarRef, () => {
    if (window.innerWidth <= 850) {
      expansedFalse();
    }
  });

  useEffect(() => {
    const user = {
      name: sessionStorage.getItem('userName') || 'Usuário',
      email: sessionStorage.getItem('email') || '',
      role: perfil || 'user'
    };
    setUserData(user);
  }, [perfil]);

  const conditionOffMenu = perfil === 'admin' || perfil === 'admin_global' || perfil === 'ti';
  const conditionOffMenuTi = perfil === 'ti';
  const conditionOffMenuAdminGlobal = perfil === 'admin_global';

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closemenu = () => {
    if (window.innerWidth <= 500) {
      expansedFalse();
    }
  };

  const handleNavClick = () => {
    closemenu();
    setActiveDropdown(null);
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: { label: 'Admin', color: '#ef4444' },
      admin_global: { label: 'Admin Global', color: '#dc2626' },
      ti: { label: 'TI', color: '#7c3aed' },
      supervisor: { label: 'Supervisor', color: '#059669' },
      vendedor: { label: 'Vendedor', color: '#2563eb' }
    };
    const roleInfo = roles[role] || { label: 'Usuário', color: '#6b7280' };
    
    return (
      <span className="role-badge" style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}>
        {roleInfo.label}
      </span>
    );
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: <Dashboard style={{ fontSize: 20 }} />,
      label: 'Dashboard'
    },
    {
      path: '/leads',
      icon: <PersonAdd style={{ fontSize: 20 }} />,
      label: 'Leads'
    },
    {
      path: '/clientes',
      icon: <SupervisorAccount style={{ fontSize: 20 }} />,
      label: 'Clientes'
    },
    {
      path: '/produtos',
      icon: <ShoppingBasket style={{ fontSize: 20 }} />,
      label: 'Produtos'
    },
    {
      path: '/carrinho',
      icon: <AddShoppingCart style={{ fontSize: 20 }} />,
      label: 'Carrinho'
    },
    {
      path: '/relatorios',
      icon: <Assessment style={{ fontSize: 20 }} />,
      label: 'Relatórios'
    },
    {
      path: '/pedidos',
      icon: <Contacts style={{ fontSize: 20 }} />,
      label: 'Pedidos'
    }
  ];

  const configItems = [
    {
      path: '/admin/usuarios',
      icon: <FiUser size={18} />,
      label: 'Usuários',
      show: true
    },
    {
      path: '/admin/organizacao',
      icon: <FiCompass size={18} />,
      label: 'Organização',
      show: !conditionOffMenuTi
    },
    {
      path: '/admin/empresa',
      icon: <FiCrosshair size={18} />,
      label: 'Empresa',
      show: !conditionOffMenuTi
    },
    {
      path: '/admin/galeria',
      icon: <FiCamera size={18} />,
      label: 'Galeria de Imagens',
      show: true
    },
    {
      path: '/admin/campanhas',
      icon: <FiUser size={18} />,
      label: 'Campanhas',
      show: conditionOffMenuAdminGlobal
    },
    {
      path: '/admin/precos',
      icon: <FiDollarSign size={18} />,
      label: 'Lista de Preços',
      show: conditionOffMenuAdminGlobal
    },
    {
      path: '/admin/regras',
      icon: <FiBox size={18} />,
      label: 'Regras de Negócio',
      show: conditionOffMenuAdminGlobal
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <Container isExpansed={expansed} ref={sidebarRef}>
      <SidebarContainer isExpansed={expansed}>
        {/* Logo */}
        <div className="sidebar-header">
          <img src={logo} alt="home" className="logo" />
          {expansed && (
            <div className="logo-text">
              <span className="logo-primary">Business</span>
              <span className="logo-secondary">Pro</span>
            </div>
          )}
        </div>

        {/* User Info */}
        {expansed && (
          <UserInfo>
            <div className="user-avatar">
              <div className="avatar-placeholder">
                {userData.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="user-details">
              <span className="user-name">{userData.name}</span>
              <span className="user-email">{userData.email}</span>
              {getRoleBadge(userData.role)}
            </div>
          </UserInfo>
        )}

        {/* Menu Items */}
        <MenuList isExpansed={expansed}>
          {menuItems.map((item) => (
            <li key={item.path} className="menu-item">
              <NavLink
                to={item.path}
                className={isActiveLink(item.path) ? 'menu-link active' : 'menu-link'}
                onClick={handleNavClick}
              >
                <div className="menu-icon">
                  {item.icon}
                </div>
                {expansed && (
                  <span className="menu-text">{item.label}</span>
                )}
                {isActiveLink(item.path) && expansed && (
                  <div className="active-indicator"></div>
                )}
              </NavLink>
            </li>
          ))}

          {/* Configurações Dropdown */}
          {conditionOffMenu && (
            <li className="menu-item dropdown">
              <div 
                className={`menu-link ${activeDropdown === 'config' ? 'active' : ''}`}
                onClick={() => toggleDropdown('config')}
              >
                <div className="menu-icon">
                  <FiSettings size={20} />
                </div>
                {expansed && (
                  <>
                    <span className="menu-text">Configurações</span>
                    <div className={`dropdown-arrow ${activeDropdown === 'config' ? 'open' : ''}`}>
                      <FiChevronDown size={16} />
                    </div>
                  </>
                )}
              </div>
              
              {expansed && activeDropdown === 'config' && (
                <ul className="dropdown-menu">
                  {configItems.map((item) => 
                    item.show && (
                      <li key={item.path} className="dropdown-item">
                        <NavLink
                          to={item.path}
                          className={isActiveLink(item.path) ? 'dropdown-link active' : 'dropdown-link'}
                          onClick={handleNavClick}
                        >
                          <div className="dropdown-icon">
                            {item.icon}
                          </div>
                          <span className="dropdown-text">{item.label}</span>
                          {isActiveLink(item.path) && (
                            <div className="dropdown-indicator"></div>
                          )}
                        </NavLink>
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          )}
        </MenuList>

        {/* Footer */}
        {expansed && (
          <div className="sidebar-footer">
            <div className="menu-stats">
              <div className="stat-item">
                <span className="stat-value">128</span>
                <span className="stat-label">Clientes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">45</span>
                <span className="stat-label">Pedidos</span>
              </div>
            </div>
            
            <button 
              className="logout-btn"
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/login';
              }}
            >
              <FiLogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </SidebarContainer>
    </Container>
  );
};

export default ModernSidebar; // ✅ Exportação padrão correta