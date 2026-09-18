import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';

import { list } from './actions';

export function* listProdutos({ payload }) {
  try {
    const { token } = payload;
    api.defaults.headers['x-access-token'] = `${token}`;
    const response = yield call(
      api.get,
      `http://act.salesbreath.com.br:3002/api/v1/Produtos?codigo=7840`,
    );

    const lista = response.data.data;

    yield put(list(lista));

    history.push('/admin/produtos');
  } catch (err) {
    toast.error('Ocorreu um erro!');
  }
}

export default all([takeLatest('@produtos/REQUESTLIST', listProdutos)]);
