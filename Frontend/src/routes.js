import React, { Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import Layout from './components/Layout';

import Produtos from 'views/Produtos/Produtos.js';
import Clientes from 'views/Clientes/Clientes.js';
import Leads from 'views/Leads/Leads';
import Pedidos from 'views/Pedidos/Pedidos.js';
import Carrinho from 'views/Carrinho/Carrinho';
import Relatorios from 'views/Relatorios/relatorios.js';
import Home from 'views/Home/home.js';
import DashboardPage from 'views/Dashboard/Dashboard.js';

const Usuarios = lazy(() => import('views/Usuarios/Usuarios'));

const Organizacao = lazy(() => import('views/Organizacao/Organizacao'));

const Campanhas = lazy(() => import('views/Campanhas/Campanhas'));

const Empresa = lazy(() => import('views/Empresa/Empresa'));

const Precos = lazy(() => import('views/Precos/Precos'));

const Regras = lazy(() => import('views/Regras/Regras'));

const Galeria = lazy(() => import('views/Galeria/Galeria'));

const EGR1000 = lazy(() => import('views/Relatorios/EGR1000/EGR1000'));

const EIR4002 = lazy(() => import('views/Relatorios/EIR4002/EIR4002'));

const EIR6000 = lazy(() => import('views/Relatorios/EIR6000/EIR6000.js'));

const EIR6000COM = lazy(() => import('views/Relatorios/EIR6000/EIR6000COM.js'));

const PEDIDOSVENDA = lazy(() =>
  import('views/Relatorios/PEDIDOSVENDA/PEDIDOSVENDA.js'),
);

const NOTASFISCAIS = lazy(() =>
  import('views/Relatorios/NOTASFISCAIS/NOTASFISCAIS.js'),
);

const FICHATECNICA = lazy(() =>
  import('views/Relatorios/FICHATECNICA/FICHATECNICA.js'),
);

const RELIMG = lazy(() =>
  import('views/Relatorios/ESTOQUEIMAGEM/ESTOQUEIMAGEM'),
);

const CONTASARECEBER = lazy(() =>
  import('views/Relatorios/CONTASARECEBER/CONTASARECEBER'),
);

const PROGRAMACAO = lazy(() =>
  import('views/Relatorios/PROGRAMACAO/PROGRAMACAO'),
);

const PRONTAENTREGA = lazy(() =>
  import('views/Relatorios/PRONTAENTREGA/PRONTAENTREGA'),
);

const VENDAANALITICO = lazy(() =>
  import('views/Relatorios/VENDAANALITICO/VENDAANALITICO'),
);

const VENDASINTETICO = lazy(() =>
  import('views/Relatorios/VENDASINTETICO/VENDASINTETICO'),
);

const ALP0008 = lazy(() => import('views/Relatorios/ALP0008/ALP0008'));

const PRODUCAO = lazy(() => import('views/Relatorios/PRODUCAO/PRODUCAO'));

const perfil = sessionStorage.getItem('perfil');

const getRestricoes = () => {
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
};

const restricoes = getRestricoes();

const temRestricao = (tipo, codigo) => {
  return restricoes.some(
    restricao =>
      String(restricao.tipo).toUpperCase() === String(tipo).toUpperCase() &&
      String(restricao.codigo).toLowerCase() === String(codigo).toLowerCase(),
  );
};

const podeAcessar = (tipo, codigo) => {
  return !temRestricao(tipo, codigo);
};

const Routes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />

        <Layout>
          {podeAcessar('MENU', 'dashboard') && (
            <Route path="/dashboard" isPrivate component={DashboardPage} />
          )}

          {podeAcessar('MENU', 'produtos') && (
            <Route path="/produtos" isPrivate component={Produtos} />
          )}

          {podeAcessar('MENU', 'clientes') && (
            <Route path="/clientes" isPrivate component={Clientes} />
          )}

          {podeAcessar('MENU', 'leads') && (
            <Route path="/leads" isPrivate component={Leads} />
          )}

          {podeAcessar('MENU', 'pedidos') && (
            <Route path="/pedidos" isPrivate component={Pedidos} />
          )}

          {podeAcessar('MENU', 'carrinho') && (
            <Route path="/carrinho" isPrivate component={Carrinho} />
          )}

          {podeAcessar('MENU', 'relatorios') && (
            <Route path="/relatorios" isPrivate component={Relatorios} />
          )}

          {podeAcessar('RELATORIO', 'listagem_clientes') && (
            <Route path="/admin/EGR1000" isPrivate component={EGR1000} />
          )}

          {podeAcessar('RELATORIO', 'eir4002') && (
            <Route path="/admin/EIR4002" isPrivate component={EIR4002} />
          )}

          {podeAcessar('RELATORIO', 'ranking_vendas') && (
            <Route
              path="/admin/EIR6000/EIR6000.js"
              isPrivate
              component={EIR6000}
            />
          )}

          {podeAcessar('RELATORIO', 'relatorio_comissoes') && (
            <Route
              path="/admin/EIR6000/EIR6000COM.js"
              isPrivate
              component={EIR6000COM}
            />
          )}

          {podeAcessar('RELATORIO', 'analise_atividade') && (
            <Route path="/admin/ALP0008" isPrivate component={ALP0008} />
          )}

          {podeAcessar('RELATORIO', 'contas_a_receber') && (
            <Route
              path="/admin/CONTASARECEBER"
              isPrivate
              component={CONTASARECEBER}
            />
          )}

          {podeAcessar('RELATORIO', 'pedidos_venda') && (
            <Route
              path="/admin/PEDIDOSVENDA"
              isPrivate
              component={PEDIDOSVENDA}
            />
          )}

          {podeAcessar('RELATORIO', 'notas_fiscais') && (
            <Route
              path="/admin/NOTASFISCAIS"
              isPrivate
              component={NOTASFISCAIS}
            />
          )}

          {podeAcessar('RELATORIO', 'ficha_tecnica') && (
            <Route
              path="/admin/FICHATECNICA"
              isPrivate
              component={FICHATECNICA}
            />
          )}

          {podeAcessar('RELATORIO', 'pronta_entrega') && (
            <Route
              path="/admin/PRONTAENTREGA"
              isPrivate
              component={PRONTAENTREGA}
            />
          )}

          {podeAcessar('RELATORIO', 'programacao') && (
            <Route
              path="/admin/PROGRAMACAO"
              isPrivate
              component={PROGRAMACAO}
            />
          )}

          {podeAcessar('RELATORIO', 'producao') && (
            <Route path="/admin/PRODUCAO" isPrivate component={PRODUCAO} />
          )}

          {podeAcessar('RELATORIO', 'venda_analitico') && (
            <Route
              path="/admin/VENDAANALITICO"
              isPrivate
              component={VENDAANALITICO}
            />
          )}

          {podeAcessar('RELATORIO', 'venda_sintetico') && (
            <Route
              path="/admin/VENDASINTETICO"
              isPrivate
              component={VENDASINTETICO}
            />
          )}

          {podeAcessar('RELATORIO', 'estoque_imagens') && (
            <Route path="/admin/ESTOQUEIMAGEM" isPrivate component={RELIMG} />
          )}

          {perfil === 'admin_global' ? (
            <>
              {podeAcessar('MENU', 'usuarios') && (
                <Route path="/admin/usuarios" isPrivate component={Usuarios} />
              )}

              {podeAcessar('MENU', 'organizacao') && (
                <Route
                  path="/admin/organizacao"
                  isPrivate
                  component={Organizacao}
                />
              )}

              {podeAcessar('MENU', 'empresa') && (
                <Route path="/admin/empresa" isPrivate component={Empresa} />
              )}

              {podeAcessar('MENU', 'precos') && (
                <Route path="/admin/precos" isPrivate component={Precos} />
              )}

              {podeAcessar('MENU', 'galeria') && (
                <Route path="/admin/galeria" isPrivate component={Galeria} />
              )}

              {podeAcessar('MENU', 'regras') && (
                <Route path="/admin/regras" isPrivate component={Regras} />
              )}

              {podeAcessar('MENU', 'campanhas') && (
                <Route
                  path="/admin/campanhas"
                  isPrivate
                  component={Campanhas}
                />
              )}
            </>
          ) : perfil === 'ti' ? (
            <>
              {podeAcessar('MENU', 'usuarios') && (
                <Route path="/admin/usuarios" isPrivate component={Usuarios} />
              )}

              {podeAcessar('MENU', 'campanhas') && (
                <Route
                  path="/admin/campanhas"
                  isPrivate
                  component={Campanhas}
                />
              )}

              {podeAcessar('MENU', 'galeria') && (
                <Route path="/admin/galeria" isPrivate component={Galeria} />
              )}
            </>
          ) : null}
        </Layout>
      </Switch>
    </Suspense>
  );
};

export default Routes;
