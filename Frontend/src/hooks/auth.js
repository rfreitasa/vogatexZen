import React, { createContext, useCallback, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import {API} from "../config/api"


const AuthContext = createContext({});

export const AuthProvider= ({ children }) => {
  const [data, setData] = useState(() => {
    const token = sessionStorage.getItem('@Salesbreath:token');
    const user = sessionStorage.getItem('@Salesbreath:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  const history = useHistory();

  const signIn = useCallback(async ({ emailUser, password }) => {
    
    const response = await api.post(`${API.login}`, {
      email: emailUser,
      password,
    });

    const {
      token,
      email,
      nome,
      perfil,
      id,
      id_erp
    } = response.data.data;

    const user = {
      email,
      nome,
      perfil,
      id
    };

    sessionStorage.setItem('@Salesbreath:token', token);
    sessionStorage.setItem('@Salesbreath:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.clear();
    setData({});
    history.push('/');
  }, [history]);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
//  console.log("3333");
  if (!context) {
    
    throw new Error('useAuth must be user within an AuthProvider');
  }

  return context;
}

/*import { all, takeLatest, call, put } from "redux-saga/effects";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";

import history from "../../../services/history";
import api from "../../../services/api";
import axios from "axios";
import LoadingOverlay from 'react-loading-overlay';
import { css } from 'glamor';
import {API} from "../../../config/api"




import { signInSuccess, signInFailure } from "./actions";



export function* signIn({ payload }) {
  try {

    const { email, password } = payload;
    const response = yield call(api.post, "usuarios/login", {
      email,
      senha: password
    });

    let { token, perfil, id, id_erp } = response.data.data;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('perfil', perfil);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('id_erp', id_erp);
    sessionStorage.setItem('signed', 'true');



    async function ConsultaTransp(id) {
      try {
        // console.log('o id é '+idCliente);
        const response = await axios.get(
          `${API.transportadorasByClienteId}/${id}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        return response.data.data;
      } catch (err) {
        //      sessionStorage.clear();

        toast.error("Não encontrado");
      }
      }


    const loadClients = async () => {
      try {
        var toastId=null;
        if(toastId === null){
                  
          toastId = toast.info('Carregando dados do sistema, aguarde.',{ progress: 15000 });
      }

       // 
        var where = `&cliente=true&bloqueada=false&ativa=true`;
        
        const response = await axios.get(
          `${API.clientes}?email=${email}${where}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        //função que troca null por "" para evitar erro em tela para objeto nulo .
        var k="";
        var v=";"
        for (const obj of response.data.data) {
          if (typeof obj !== 'object') continue;
          for (k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            v = obj[k];
            if (v === null || v === undefined) {
              obj[k] = '';
            }
          }
        }
        sessionStorage.setItem('clientes', JSON.stringify(response.data.data));
        toast.done(toastId);
      //  console.log(list_clients);

        history.push("/admin/dashboard");
      } catch (err) {
        toast.done(toastId);
        toast.error("Nenhum cliente encontrado");
        history.push("/admin/dashboard");

      }
    };
    loadClients();
     
    
    
    
    
//    yield put(signInSuccess(token, perfil, email, id, id_erp));
    
  } catch (err) {
    toast.error("Falha na autenticação, verifique seus dados");
    
    yield put(signInFailure());

  }
}

export function signOut() {
  var answer = window.confirm(
    "Deseja sair do sistema?"
  );
  if (answer) {
  sessionStorage.clear();
  localStorage.clear();
  history.push("/");
  }
}

export default all([
  takeLatest("@auth/SIGN_IN_REQUEST", signIn),
  takeLatest("@auth/SIGN_OUT", signOut)
]);
 */