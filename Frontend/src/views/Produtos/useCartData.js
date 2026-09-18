// cart.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../config/api';

export async function getCartEndpoint(email, token, setCurrency) {
  try {

    if(token){
    const response = await axios.get(`${API.carrinho}?email=${email}`, {
      headers: {
        'x-access-token': token,
      },
    });

    let newarray = [];

    //Obtem a moeda
    if (response.data.data.length > 0) {
      const get_currency = await axios.get(
        `${API.getCurrencyById}?email=${email}&parametro=${response.data.data[0][0].LISTA_PRECOS_MOEDA}`,
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      setCurrency(get_currency.data.data[0].code);
    }

    response.data.data.map(item => {
      item.map(newitem => {
        newarray.push(newitem);
      });
    });

    return newarray; // Retorna o array de itens no carrinho
  }
  else{return[]}
  } catch (error) {
    if (error.response && error.response.status === 402) {
      toast.error('Sua sessão expirou, favor efetuar o login');
      sessionStorage.clear();
    }
    return [];
  }
}
