import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import AuthLayout from './layouts/auth';
import DefaultLayout from './layouts/default';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const signed =
    sessionStorage.getItem('signed') === null
      ? 'false'
      : sessionStorage.getItem('signed');

  const restricoes = (() => {
    try {
      const dados = sessionStorage.getItem('restricoes');

      if (!dados) {
        return [];
      }

      const parsed = JSON.parse(dados);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      return [];
    }
  })();

  const dashboardBloqueado = restricoes.some(
    restricao =>
      String(restricao.tipo).toUpperCase() === 'MENU' &&
      String(restricao.codigo).toLowerCase() === 'dashboard',
  );

  const paginaInicial = dashboardBloqueado
    ? '/clientes'
    : '/dashboard';

  if (signed === 'false' && isPrivate) {
    return <Redirect to="/" />;
  }

  if (signed === 'true' && !isPrivate) {
    return <Redirect to={paginaInicial} />;
  }

  const Layout = signed
    ? DefaultLayout
    : AuthLayout;

  return (
    <Route
      exact
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};