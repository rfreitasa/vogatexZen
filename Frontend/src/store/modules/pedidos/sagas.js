import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';

import { list } from './actions';

export function* listUsuarios({ payload }) {
  try {
    const { token } = payload;
    api.defaults.headers['x-access-token'] = `${token}`;
    const response = yield call(
      api.get,
      // `http://act.salesbreath.com.br:3002/api/v1/pedidos/?email=vicaio@personal.com&emissao>=2020-01-01&emissao<=2020-01-20`
    );

    const lista = response.data.data;
    console.log(lista);
    yield put(list(lista));

    history.push('/admin/pedidos');
  } catch (err) {
    toast.error('Ocorreu um erro!');
  }
}

export default all([takeLatest('@pedidos/REQUESTLIST', listPedidos)]);
