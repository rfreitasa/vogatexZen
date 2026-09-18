import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { signInRequest } from '../../store/modules/auth/actions';
import logo from '../../images/logo.png';
import { makeStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import './style.css';
import { Container,ContainerBox,ContainerExt } from './styles.js';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  form: {
    width: '90%',
  },
}));

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function LoginData() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  //const { loading } = useSelector(state => state.auth);

  useEffect(() => {
    setLoading(false);
  }, [password, email]);

  const handleSubmit = evt => {
    evt.preventDefault();
    setLoading(true);

    const autentica = dispatch(signInRequest(email, password));
  };

  return (
    <ContainerExt>
      <ContainerBox>
        <Container>
          <img className="img" align="center" src={logo} alt="logo" />
          <h3>
            <center>Bem Vindo.</center>
          </h3>

          <form
            className={classes.form}
            schema={schema}
            onSubmit={handleSubmit}
            disabled={loading}
          >
            <div className={classes.margin}>
              <Grid
                container
                spacing={1}
                justify="center"
                alignItems="flex-end"
              >
                <Grid item>
                  <AccountCircle />
                </Grid>
                <Grid item>
                  <TextField
                    name="email"
                    placeholder="Email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
            <div className={classes.margin}>
              <Grid
                container
                spacing={1}
                justify="center"
                alignItems="flex-end"
              >
                <Grid item>
                  <VpnKeyIcon />
                </Grid>
                <Grid item>
                  <TextField
                    type="password"
                    id="password"
                    name="password"
                    label="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ margin: 'auto', marginTop: '10px' }}
            >
              {loading && (
                <i
                  className="fa fa-refresh fa-spin"
                  style={{ marginRight: '5px' }}
                />
              )}
              {loading && <span>Autenticando</span>}
              {!loading && <span>Entrar</span>}
            </Button>
          </form>
        </Container>
      </ContainerBox>
    </ContainerExt>
  );
}
/*

import React, { useEffect, useRef, useState, useCallback } from 'react';

import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import './style.css';

import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, ContainerExt, ContainerBox } from './styles';
import getValidationErrors from 'utils/getValidationErrors';

import logo from 'assets/logo.png';
import { useAuth } from '../../hooks/auth';
//import InputMask from '../../components/InputMask';
import api from '../../services/api';
//import Footer from './Footer';
import { FcStart } from 'react-icons/fc';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  form: {
    width: '90%',
  },
}));

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

const Home = () => {
  const formRef = useRef();
  const [message, setMessage] = useState('');
  const { signIn } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  //const { loading } = useSelector(state => state.auth);

  useEffect(() => {
    setLoading(false);
  }, [password, email]);

  const handleSubmit = useCallback(
    async (event, data) => {
      try {
        event.preventDefault();
        setLoading(true);

        console.log('teste2');
        console.log(data);

        await signIn({
          emailUser: 'raphael@personal.com',
          password: '123456',
        });

        console.log('teste');


        //   history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          return;
        }
        toast.error('Ocorreu um erro ao fazer login, cheque as crendenciais.');
      }
    },
    [signIn, history],
  );

  return (
    <ContainerExt>
      <ContainerBox>
        <Container>
          <img className="img" align="center" src={logo} alt="logo" />
          <h3>
            <center>Bem Vindo.</center>
          </h3>

          <form
            ref={formRef}
            className={classes.form}
            schema={schema}
            onSubmit={handleSubmit}
            disabled={loading}
          >
            <div className={classes.margin}>
              <Grid
                container
                spacing={1}
                justify="center"
                alignItems="flex-end"
              >
                <Grid item>
                  <AccountCircle />
                </Grid>
                <Grid item>
                  <TextField
                    name="email"
                    placeholder="Email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
            <div className={classes.margin}>
              <Grid
                container
                spacing={1}
                justify="center"
                alignItems="flex-end"
              >
                <Grid item>
                  <VpnKeyIcon />
                </Grid>
                <Grid item>
                  <TextField
                    type="password"
                    id="password"
                    name="password"
                    label="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ margin: 'auto', marginTop: '10px' }}
            >
              {loading && (
                <i
                  className="fa fa-refresh fa-spin"
                  style={{ marginRight: '5px' }}
                />
              )}
              {loading && <span>Autenticando</span>}
              {!loading && <span>Entrar</span>}
            </Button>
          </form>
        </Container>
      </ContainerBox>
    </ContainerExt>
  );
};

export default Home;
*/