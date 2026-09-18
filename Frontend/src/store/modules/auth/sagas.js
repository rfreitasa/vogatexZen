import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';
import axios from 'axios';
import { API } from '../../../config/api';

import { signInSuccess, signInFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(
      api.post,
      'usuarios/login',
      {
        email,
        senha: password,
      },
    );

    const {
      token,
      perfil,
      id,
      id_erp,
      ordenacao_lista,
      frete,
      frete_redesp,
      exibe_obs,
      restricoes,
    } = response.data.data;

    const restricoesUsuario = Array.isArray(restricoes)
      ? restricoes
      : [];

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('perfil', perfil);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('id_erp', id_erp);
    sessionStorage.setItem('ordenacao_lista', ordenacao_lista || '');
    sessionStorage.setItem('frete', frete || '');
    sessionStorage.setItem('frete_redesp', frete_redesp || '');
    sessionStorage.setItem('exibe_obs', exibe_obs || '');

    sessionStorage.setItem(
      'restricoes',
      JSON.stringify(restricoesUsuario),
    );

    sessionStorage.setItem('signed', 'true');

    yield put(
      signInSuccess(
        token,
        perfil,
        email,
        id,
        id_erp,
        ordenacao_lista,
        frete,
        frete_redesp,
        exibe_obs,
        restricoesUsuario,
      ),
    );

    async function ObtemFiltros(idUsuario) {
      try {
        const responseFiltros = await axios.get(
          `${API.obtemfiltro}/${idUsuario}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        const filtros = responseFiltros.data.data || [];

        const filtrosAgrupados = filtros.reduce(
          (agrupamento, filtro) => {
            const { referencia } = filtro;

            if (!agrupamento[referencia]) {
              agrupamento[referencia] = [];
            }

            agrupamento[referencia].push(filtro);

            return agrupamento;
          },
          {},
        );

        Object.keys(filtrosAgrupados).forEach(referencia => {
          sessionStorage.setItem(
            referencia,
            JSON.stringify(filtrosAgrupados[referencia]),
          );
        });

        return filtros;
      } catch (err) {
        return [];
      }
    }

    yield call(
      ObtemFiltros,
      id,
    );

    window.location.reload();
  } catch (err) {
    toast.error(
      'Falha na autenticação, verifique seus dados',
    );

    yield put(
      signInFailure(),
    );
  }
}

export function signOut() {
  const answer = window.confirm(
    'Deseja sair do sistema?',
  );

  if (answer) {
    sessionStorage.clear();
    localStorage.clear();

    history.push('/');
  }
}

export default all([
  takeLatest(
    '@auth/SIGN_IN_REQUEST',
    signIn,
  ),

  takeLatest(
    '@auth/SIGN_OUT',
    signOut,
  ),
]);