import React, { useMemo } from 'react';

import {
  FiSettings,
  FiUser,
  FiCompass,
  FiBox,
  FiCrosshair,
  FiCamera,
  FiDollarSign,
} from 'react-icons/fi';

import Dashboard from '@material-ui/icons/Dashboard';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ContactsIcon from '@material-ui/icons/Contacts';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { NavLink } from 'react-router-dom';

import { Container } from './styles';
import { useMenu } from '../../hooks/menu';

import Dropdown from './Dropdown';

const ListMenu = () => {
  const { expansed, expansedFalse } = useMenu();

  const perfil = sessionStorage.getItem('perfil');

  const restricoes = useMemo(() => {
    try {
      const dados = sessionStorage.getItem('restricoes');

      if (!dados) {
        return [];
      }

      const parsed = JSON.parse(dados);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }, []);

  const temRestricao = (tipo, codigo) => {
    return restricoes.some(
      restricao =>
        String(restricao.tipo).toUpperCase() === String(tipo).toUpperCase() &&
        String(restricao.codigo).toLowerCase() === String(codigo).toLowerCase(),
    );
  };

  const podeAcessar = codigo => {
    return !temRestricao('MENU', codigo);
  };

  const conditionOffMenu =
    perfil === 'admin' || perfil === 'admin_global' || perfil === 'ti';

  const conditionOffMenuTi = perfil === 'ti';

  const conditionOffMenuAdminGlobal = perfil === 'admin_global';

  const exibirConfiguracoes =
    conditionOffMenu &&
    (podeAcessar('usuarios') ||
      podeAcessar('organizacao') ||
      podeAcessar('empresa') ||
      podeAcessar('galeria') ||
      podeAcessar('campanhas') ||
      podeAcessar('precos') ||
      podeAcessar('regras'));

  function closemenu() {
    if (window.screen.width <= 500) {
      expansedFalse();
    }
  }

  return (
    <Container isExpansed={expansed}>
      {podeAcessar('dashboard') && (
        <li>
          <NavLink
            to="/dashboard"
            onClick={() => {
              closemenu();
            }}
          >
            <Dashboard size={18} />

            <p>Dashboard</p>
          </NavLink>
        </li>
      )}

      {podeAcessar('leads') && (
        <li>
          <NavLink
            to="/leads"
            onClick={() => {
              closemenu();
            }}
          >
            <PersonAddIcon size={18} />

            <p>Leads</p>
          </NavLink>
        </li>
      )}

      {podeAcessar('clientes') && (
        <li>
          <NavLink
            to="/clientes"
            onClick={() => {
              closemenu();
            }}
          >
            <SupervisorAccountIcon size={18} />

            <p>Clientes</p>
          </NavLink>
        </li>
      )}

      {podeAcessar('produtos') && (
        <li>
          <NavLink
            to="/produtos"
            onClick={() => {
              closemenu();
            }}
          >
            <ShoppingBasketIcon size={18} />

            <p>Produtos</p>
          </NavLink>
        </li>
      )}

      {podeAcessar('carrinho') && (
        <li>
          <NavLink
            to="/carrinho"
            onClick={() => {
              closemenu();
            }}
          >
            <AddShoppingCartIcon size={18} />

            <p>Carrinho</p>
          </NavLink>
        </li>
      )}

      {podeAcessar('relatorios') && (
        <li>
          <NavLink
            to="/relatorios"
            onClick={() => {
              closemenu();
            }}
          >
            <AssessmentIcon size={18} />

            <p>Relatórios</p>
          </NavLink>
        </li>
      )}

      {podeAcessar('pedidos') && (
        <li>
          <NavLink
            to="/pedidos"
            onClick={() => {
              closemenu();
            }}
          >
            <ContactsIcon size={18} />

            <p>Pedidos</p>
          </NavLink>
        </li>
      )}

      {exibirConfiguracoes && (
        <Dropdown icon={FiSettings} title="Configurações">
          {podeAcessar('usuarios') && (
            <li>
              <NavLink
                to="/admin/usuarios"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiUser size={18} />

                <p>Usuários</p>
              </NavLink>
            </li>
          )}

          {!conditionOffMenuTi && podeAcessar('organizacao') && (
            <li>
              <NavLink
                to="/admin/organizacao"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiCompass size={18} />

                <p>Organização</p>
              </NavLink>
            </li>
          )}

          {!conditionOffMenuTi && podeAcessar('empresa') && (
            <li>
              <NavLink
                to="/admin/empresa"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiCrosshair size={18} />

                <p>Empresa</p>
              </NavLink>
            </li>
          )}

          {podeAcessar('galeria') && (
            <li>
              <NavLink
                to="/admin/galeria"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiCamera size={18} />

                <p>Galeria de imagens</p>
              </NavLink>
            </li>
          )}

          {conditionOffMenuAdminGlobal && podeAcessar('campanhas') && (
            <li>
              <NavLink
                to="/admin/campanhas"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiUser size={18} />

                <p>Campanhas</p>
              </NavLink>
            </li>
          )}

          {conditionOffMenuAdminGlobal && podeAcessar('precos') && (
            <li>
              <NavLink
                to="/admin/precos"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiDollarSign size={18} />

                <p>Lista de preços</p>
              </NavLink>
            </li>
          )}

          {conditionOffMenuAdminGlobal && podeAcessar('regras') && (
            <li>
              <NavLink
                to="/admin/regras"
                onClick={() => {
                  closemenu();
                }}
              >
                <FiBox size={18} />

                <p>Regras de negócio</p>
              </NavLink>
            </li>
          )}
        </Dropdown>
      )}
    </Container>
  );
};

export default ListMenu;
