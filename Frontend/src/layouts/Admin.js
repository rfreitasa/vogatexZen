import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

//import Usuarios from '../views/Usuarios/Usuarios';
//import Organizacao from '../views/Organizacao/Organizacao';

import Precos from "../views/Precos/Precos";
import Regras from "../views/Regras/Regras";
//import EGR1000 from '../views/Relatorios/EGR1000';

import { API } from "../config/api";
import fundo from "../assets/img/layout.png";
//import Galeria from '../views/Galeria/Galeria';
// import { refreshToken } from "../store/modules/auth/actions";
//import Empresa from '../views/Empresa/Empresa';
// import bgImage from "assets/img/sidebar-2.jpg";
import logo from "images/logo.png";
const Usuarios = lazy(() => import("../views/Usuarios/Usuarios"));
const Organizacao = lazy(() => import("../views/Organizacao/Organizacao"));
const Empresa = lazy(() => import("../views/Empresa/Empresa"));
const Galeria = lazy(() => import("../views/Galeria/Galeria"));
const EGR1000 = lazy(() => import("../views/Relatorios/EGR1000/EGR1000"));
const EIR4002 = lazy(() => import("../views/Relatorios/EIR4002/EIR4002"));
const EIR6000 = lazy(() => import("../views/Relatorios/EIR6000/EIR6000"));
const PROGRAMACAO = lazy(() =>
  import("../views/Relatorios/PROGRAMACAO/PROGRAMACAO")
);
const PRONTAENTREGA = lazy(() =>
  import("../views/Relatorios/PRONTAENTREGA/PRONTAENTREGA")
);
const VENDAANALITICO = lazy(() =>
  import("../views/Relatorios/VENDAANALITICO/VENDAANALITICO")
);
const VENDASINTETICO = lazy(() =>
  import("../views/Relatorios/VENDASINTETICO/VENDASINTETICO")
);
const ESTOQUEIMAGEM = lazy(() =>
  import("../views/Relatorios/ESTOQUEIMAGEM/ESTOQUEIMAGEM")
);
const ALP0008 = lazy(() =>
  import("../views/Relatorios/ALP0008/ALP0008")
);
let ps;

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const profile = sessionStorage.getItem("perfil");

  // window.onbeforeunload = function() {
  //   localStorage.clear();
  // };

  const refresh = async () => {
    const response = await axios.post(`${API.refreshToken}`, {
      token,
      email,
    });
    const { token: tokenAtualizado } = response.data.data;
    if (token !== tokenAtualizado) {
      sessionStorage.setItem("token", tokenAtualizado);
      //   dispatch(refreshToken(tokenAtualizado));
    }
    setTimeout(refresh, 260000);
  };

  setTimeout(refresh, 260000);

  let vendedor = false;
  let operador = false;
  let rotas = true;

  if (profile === "operador") {
    operador = true;
    rotas = false;
  }

  if (profile === "vendedor") {
    vendedor = true;
    rotas = false;
  }

  const switchRoutes = (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {routes.map((prop) => {
          if (prop.submenu) {
            return prop.submenu.map((propsubmenu) => {
              if (propsubmenu.layout === "/admin") {
                return (
                  <Route
                    path={propsubmenu.layout + propsubmenu.path}
                    component={propsubmenu.component}
                  />
                );
              }
            });
          } else {
            if (prop.layout === "/admin") {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                />
              );
            }
          }
          return null;
        })}
        {vendedor ? (
          <>
            {" "}
            <Route path="/admin/EGR1000" component={EGR1000} />
            <Route path="/admin/EIR4002" component={EIR4002} />
            <Route path="/admin/EIR6000" component={EIR6000} />
            <Route path="/admin/PRONTAENTREGA" component={PRONTAENTREGA} />
            <Route path="/admin/PROGRAMACAO" component={PROGRAMACAO} />
            <Route path="/admin/VENDAANALITICO" component={VENDAANALITICO} />
            <Route path="/admin/VENDASINTETICO" component={VENDASINTETICO} />
            <Route path="/admin/ESTOQUEIMAGEM" component={ESTOQUEIMAGEM} />
            <Route path="/admin/ALP0008" component={ALP0008} />

          </>
        ) : (
          ""
        )}

        {operador ? (
          <>
            <Route path="/admin/EGR1000" component={EGR1000} />
            <Route path="/admin/EIR4002" component={EIR4002} />
            <Route path="/admin/EIR6000" component={EIR6000} />
            <Route path="/admin/PRONTAENTREGA" component={PRONTAENTREGA} />
            <Route path="/admin/PROGRAMACAO" component={PROGRAMACAO} />
            <Route path="/admin/VENDAANALITICO" component={VENDAANALITICO} />
            <Route path="/admin/VENDASINTETICO" component={VENDASINTETICO} />
            <Route path="/admin/usuarios" component={Usuarios} />
            <Route path="/admin/organizacao" component={Organizacao} />
            <Route path="/admin/empresa" component={Empresa} />
            <Route path="/admin/precos" component={Precos} />
            <Route path="/admin/galeria" component={Galeria} />
            <Route path="/admin/ESTOQUEIMAGEM" component={ESTOQUEIMAGEM} />
            <Route path="/admin/ALP0008" component={ALP0008} />
          </>
        ) : (
          ""
        )}

        {rotas ? (
          <>
            <Route path="/admin/EGR1000" component={EGR1000} />
            <Route path="/admin/EIR4002" component={EIR4002} />
            <Route path="/admin/EIR6000" component={EIR6000} />
            <Route path="/admin/PRONTAENTREGA" component={PRONTAENTREGA} />
            <Route path="/admin/PROGRAMACAO" component={PROGRAMACAO} />
            <Route path="/admin/VENDAANALITICO" component={VENDAANALITICO} />
            <Route path="/admin/VENDASINTETICO" component={VENDASINTETICO} />
            <Route path="/admin/usuarios" component={Usuarios} />
            <Route path="/admin/organizacao" component={Organizacao} />
            <Route path="/admin/empresa" component={Empresa} />
            <Route path="/admin/precos" component={Precos} />
            <Route path="/admin/regras" component={Regras} />
            <Route path="/admin/galeria" component={Galeria} />
            <Route path="/admin/ESTOQUEIMAGEM" component={ESTOQUEIMAGEM} />
            <Route path="/admin/ALP0008" component={ALP0008} />
          </>
        ) : (
          ""
        )}
        <Redirect from="/admin" to="/admin/usuarios" />
      </Switch>
    </Suspense>
  );

  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [color] = React.useState("blue");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    localStorage.setItem("menu", true);
  };
  let menu = localStorage.getItem("menu");
  if (window.innerWidth <= 9000) {
    if (menu === "false") {
      handleDrawerToggle();
    }
  }

  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"SalesBreath"}
        logo={logo}
        image={fundo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {getRoute() ? <Footer /> : null}
      </div>
    </div>
  );
}
