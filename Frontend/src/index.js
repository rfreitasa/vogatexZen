import React from 'react';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { Router, Switch, Redirect } from 'react-router-dom';
import GlobalStyles from './styles/global';

import Routes from './routes';

import './config/ReactotronConfig';

import history from './services/history';
import { store, persistor } from './store';

// core components

import 'assets/css/material-dashboard-react.css?v=1.8.0';

import { MenuProvider } from './hooks/menu';


ReactDOM.render(
  <Provider store={store}>
    <MenuProvider>
    <PersistGate persistor={persistor}>
      <Router history={history}>
        <Routes />
        <ToastContainer autoClose={3000} />
      </Router>
    </PersistGate>
    </MenuProvider>
    <GlobalStyles />
  </Provider>,
  document.getElementById('root'),
);

/*
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import GlobalStyles from './styles/global';

import Routes from './routes';
import Loading from './components/Loading';

import { AuthProvider } from './hooks/auth';

ReactDOM.render(
  <BrowserRouter>
    <Suspense fallback={<Loading isLoading />}>
      <AuthProvider>
          <Routes />
      </AuthProvider>
      <GlobalStyles />
    </Suspense>
  </BrowserRouter>,
  document.getElementById('root'),
);
*/