/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import DataTable from 'components/Table/Table.js';
import Carrinho from 'components/CarrinhoModal';
import FinalizaPedido from './FinalizaPedido';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Pdf from '../../components/Produtos/PDF';
import PdfColecao from '../../components/Produtos/PDFCOLECAO';
import ImagesProducts from '../../components/Produtos/Carousel';
import { makeStyles } from '@material-ui/core/styles';
import { Form, ButtonStyled, Input, ContainerSearch } from './styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import axios from 'axios';
import { FormAuto } from './stylesFinaliza';
import { API } from '../../config/api';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import Async from 'react-select/async';
import debounce from 'debounce-promise';
import { update } from 'store/modules/pedidos/actions';
import { TablePagination, Typography, Divider } from '@material-ui/core';
import Badge from "@material-ui/core/Badge";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { target } from 'glamor';


// Função para criar OBJ dos produtos
function createData(
  actions,
  ITEM_CODIGO,
  ITEM_NOME,
  ITEM_GRADE,
  PE_OU_PROG,
  EMPRESA,
  ITEM_SALDO,
  inputQuantidade,
  inputValor,
  ITEM_VALOR_UNITARIO
) {
  return {
    actions,
    ITEM_CODIGO,
    ITEM_NOME,
    ITEM_GRADE,
    PE_OU_PROG,
    EMPRESA,
    ITEM_SALDO,
    inputQuantidade,
    inputValor,
    ITEM_VALOR_UNITARIO,
  };
}

// Exemplo de colunas
const rowHead = [
  {
    title: 'Ações',
    field: 'actions',
    headerStyle: {
      width: 30,
      maxWidth: 30,
      textAlign: 'center',
    },
    cellStyle: {
      fontSize: '12px',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0', // Definindo a cor de fundo

    },
    render: rowData => (
      <div style={{ display: 'flex', gap: '0px' }}>
        {rowData.actions}
      </div>
    ),
  },
  {
    title: 'Código',
    field: 'ITEM_CODIGO',
    headerStyle: {
      width: 15,
      maxWidth: 20,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
    defaultSort: 'asc',
  },
  {
    title: 'Nome',
    field: 'ITEM_NOME',
    headerStyle: {
      width: 45,
      maxWidth: 60,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
  {
    title: 'Variante',
    field: 'ITEM_GRADE',
    headerStyle: {
      width: 25,
      maxWidth: 30,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
  {
    title: 'Prog',
    field: 'PE_OU_PROG',
    headerStyle: {
      width: 25,
      maxWidth: 25,
      minWidth: 25,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
  {
    title: 'Empresa',
    field: 'EMPRESA',
    headerStyle: {
      width: 15,
      maxWidth: 20,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
  {
    title: 'Disponível',
    field: 'ITEM_SALDO',
    headerStyle: {
      textAlign: 'right',
      width: 15,
      maxWidth: 20,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      textAlign: 'right',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
  {
    title: 'Quantidade',
    field: 'inputQuantidade',
    headerStyle: {
      width: 15,
      maxWidth: 20,
      textAlign: 'center',
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
  {
    title: 'Valor unitário',
    field: 'inputValor',
    headerStyle: {
      textAlign: 'center',
      width: 25,
      maxWidth: 25,
    },
    cellStyle: {
      fontSize: '12px', // Aumentando a fonte
      whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif', // Alterando a família da fonte
    },
  },
];


function formatDecimal(numero) {
  return numero.replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
}
function Clientes() {
  const [isConfirmRequest, setIsConfirmRequest] = useState(false);
  const [isConfirmRequestEdit, setIsConfirmRequestEdit] = useState(false);
  const [valor_unitario_default, setValor_unitario_default] = useState(0);
  const [open, setOpen] = React.useState(false);

  const [lista, setLista] = useState([]);
  const [listCart, setListCart] = useState([]);
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const usuario_id = sessionStorage.getItem('id');

  const isRequest = listCart.length === 0;
  const [ConfirmPedido, setConfirmPedido] = useState(false);
  const [autoTransp, setTransp] = useState([]);
  const [autoCliente, setAutoCliente] = useState([]);
  const [autoVendedor, setAutoVendedor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [totalEstoqueEsc, setTotalEstoqueEsc] = useState(0);
  const [listPrice, setListPrice] = useState([]);
  const [listPriceChoose, setListPriceChoose] = useState('');
  const [maxDiscount, setmaxDiscount] = useState(0);
  const [optionlist, setOptionList] = useState('');
  const [listRules, setlistRules] = useState('');
  const ordenacao_default = sessionStorage.getItem("ordenacao_lista");

  const [currency, setCurrency] = useState('BRL');


  const useStyles = makeStyles(theme => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    paper: {
      backgroundColor: theme.palette.background.paper,
      paddingTop: '5px',
    },
  }));
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsConfirmRequestEdit(false);
  };

  useEffect(() => {

    /*
    async  function ConsultaTransp(id){
      try {
       // console.log('o id é '+idCliente);
        const response = await axios.get(
          `http://concept.salesbreath.com.br:3002/api/v1/clientes/transportadorasByClienteId/${id}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        return response.data.data;
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar o login");
       //   sessionStorage.clear();
        } else {
    //      sessionStorage.clear();
  
          toast.error("Erro ao carregar lista de vendedores");
        }
      }
    };




    const loadClients = async () => {
      try {
        const response = await axios.get(
          `http://concept.salesbreath.com.br:3002/api/v1/clientes?email=${email}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        var list_clients=[];
        //list_clients.push(response.data.data);
        //console.log(response.data.data);
        for (let index = 0; index < response.data.data.length; index++) {  
        
          //list_clients.codigo         = response.data.data[index].id;
          
          const transpid   = await ConsultaTransp(response.data.data[index].id);
          //console.log(transpid[0].TRANSPORTADORA_ID);
          
          response.data.data[index].transportadora_id       = transpid[0].TRANSPORTADORA_ID;
          response.data.data[index].transportadora_apelido  = transpid[0].TRANSPORTADORA_APELIDO;
          response.data.data[index].transportadora_cnpj     = transpid[0].TRANSPORTADORA_CNPJ;
          response.data.data[index].redespacho_id           = transpid[0].REDESPACHO_ID;
          response.data.data[index].redespacho_apelido      = transpid[0].REDESPACHO_APELIDO;
          response.data.data[index].redespacho_cnpj         = transpid[0].REDESPACHO_CNPJ;

          list_clients.push(response.data.data[index])
          //console.log('bora ver');
          //console.log(response.data.data[index].id);
          //console.log(transpid);


          
         
        }
        console.log('mostrando posicao 0 ');
        console.log(list_clients);
        //list_new_client =[];





        setAutoCliente(list_clients);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar o login");
          sessionStorage.clear();
        } else {
          sessionStorage.clear();

          toast.error("Erro ao carregar lista de clientes");
        }
      }
    };

    const loadSales = async () => {
      try {
        const response = await axios.get(
          `http://concept.salesbreath.com.br:3002/api/v1/clientes/vendedores?email=${email}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );

        setAutoVendedor(response.data.data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar o login");
          sessionStorage.clear();
        } else {
          sessionStorage.clear();

          toast.error("Erro ao carregar lista de vendedores");
        }
      }
    };
*/

    //loadCarriers();
    //   loadClients();
    //   loadSales();
    getListPrice(usuario_id);
    getCartEndpoint();
  }, []);



  // Função para ordenar a lista
  const ordenarLista = (lista, ordenacao_default) => {
    let listaOrdenada = [...lista];

    if (ordenacao_default === 'CRESCENTE') {
      listaOrdenada = listaOrdenada.sort((a, b) => a.name.localeCompare(b.name));
    } else if (ordenacao_default === 'DECRESCENTE') {
      listaOrdenada = listaOrdenada.sort((a, b) => b.name.localeCompare(a.name));
    }
    return listaOrdenada;
  };


  const getListPrice = async usuario => {
    try {
      const response = await axios.get(
        `${API.regras}/atribuidas?email=${email}&usuario=${usuario}`,
        {
          headers: {
            'x-access-token': token,
          },
        }
      );
      
      const lista = response.data.data.map(item => {
        return {
          value: item.LISTA_PRECOS_ID,
          label: `${item.LISTA_PRECOS_NOME}-${item.LISTA_PRECOS_DESCRICAO}`,
          name: item.LISTA_PRECOS_DESCRICAO,
          selected: item.SELECIONADO,
          default: item.LISTA_PRECOS_DEFAULT === 'sim', // Convertendo para booleano
        };
      });
  
      // Ordenar a lista de acordo com o parâmetro order
      const listaOrdenada = ordenarLista(lista, ordenacao_default);
  
      // Filtrar os itens selecionados
      const listitems = listaOrdenada.filter(item => item.selected === 'selected');
  
      console.log(listitems);
  
      setListPrice(listitems);
  
      setOptionList(
        listitems.length > 0 
          ? listitems.map((item, index) => {
              if (item.default) {
                setListPriceChoose(item.value);
                return <option value={item.value} selected>{item.label}</option>;
              } else if (index === 0 && !listitems.some(i => i.default)) {
                // Se não houver nenhum item marcado como default, marca o primeiro
                setListPriceChoose(item.value);
                return <option value={item.value} selected>{item.label}</option>;
              } else {
                return <option value={item.value}>{item.label}</option>;
              }
            })
          : '<option value=""></option>'
      );
    } catch (err) {
      toast.error('Erro ao carregar lista de preços de venda.');
    }
  };
  

  async function getCartEndpoint() {
    try {
      const response = await axios.get(`${API.carrinho}?email=${email}`, {
        headers: {
          'x-access-token': token,
        },
      });
      var newarray = [];

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
          const {
            ID,
            ITEM_CODIGO,
            ITEM_ID,
            ITEM_NOME,
            PEDIDO_NUM,
            ITEM_GRADE,
            EMPRESA_APELIDO,
            PE_OU_PROG,
            ITEM_SALDO,
            ITEM_UNIDADE,
            ITEM_VALOR_UNITARIO,
            ITEM_VALOR_UNITARIO_ESCOLHIDO,
            LISTA_PRECO_ID
          } = newitem;
          newarray.push(newitem);
        });
      });
      if (newarray.length > 0) {
        setListPriceChoose(newarray[0].LISTA_PRECO_ID);
      }
      setListCart(newarray);
      const totalEstoqEscolhido = newarray
        ? newarray.reduce((total, newarray) => total + newarray.QUANTIDADE, 0)
        : 0;
      setTotalEstoqueEsc(totalEstoqEscolhido);
    } catch (error) {
      //  console.log(error);
      if (error.response && error.response.status === 402) {
        //token expirado
        toast.error('Sua sessão expirou, favor efetuar o login');
        sessionStorage.clear();
      } else {
        //
      }

      return false;
    }
  }
  //desmenbrando o array

  // Função para verificar se há alguma lista diferente que foi utilizada
  const hasDifferentListPriceUsed = () => {

    for (const item of listCart) {
      if (item.LISTA_PRECO_ID !== listPriceChoose) {
        // Se encontrar uma lista diferente, retorna true
        return true;
      }
    }
    // Se percorrer todo o array e não encontrar lista diferente, retorna false
    return false;
  };


  const addToCartAmount = async (data, value) => {



    const index =
      listCart.length > 0
        ? listCart.findIndex(i => i.ITEM_ID === data.ITEM_ID)
        : -1;

    const itemBalance = await checkItemBalance(data);

    // console.log(">>> index ......:", index);
    // console.log(">>> value ......:", value);
    // console.log(">>> itemBalance.:", itemBalance);
    // console.log(">>> data .......:", data);

    const amountOld = data.QUANTIDADE;
    data.QUANTIDADE = value;
    data.ITEM_SALDO = (itemBalance - value).toFixed(2);
    if (data.ITEM_SALDO >= 0) {

      if (index === -1) {
        if (value > 0) setListCart([...listCart, data]);
      } else {
        if (index > -1 && parseFloat(value) === 0.0) {
          data.ITEM_SALDO = itemBalance;
          setListCart(listCart.filter(i => i.ITEM_ID !== data.ITEM_ID));
        } else {
          listCart[index].QUANTIDADE = data.QUANTIDADE;
          listCart[index].ITEM_SALDO = data.ITEM_SALDO;
          if (value > 0) setListCart(listCart);
        }
      }
      const dataSendCart = {
        email: email,
        item_id: data.ITEM_ID,
        codigo: data.ITEM_CODIGO,
        item_nome: data.ITEM_NOME,
        item_grade: data.ITEM_GRADE,
        item_unidade: data.ITEM_UNIDADE,
        empresa_id_erp: data.EMPRESA_ID,
        empresa_apelido: data.EMPRESA_APELIDO,
        data_programacao: data.ITEM_PREVISAO,
        quantidade: value,
        lista_preco_id: listPriceChoose,
        valor_unitario: data.ITEM_VALOR_UNITARIO_ESCOLHIDO,
        valor_unitario_padrao: data.ITEM_VALOR_UNITARIO,
        tipo_venda: data.PE_OU_PROG,
        programacao_numero: data.PROGRAMACAO_ID,
        programacao_item_id: data.ITEM_ID,
        pedido_num: data.PEDIDO_NUM
      };
      // console.log("22222222222222222222");
      // console.log(dataSendCart);
      if (!isConfirmRequest && parseFloat(value) > 0.0) {
        const response = await insertItemCart(dataSendCart, amountOld);
        // console.log("retorno" + response);
        getCartEndpoint();
      }
    }
    else {
      toast('Quantidade não permitida.', {
        autoClose: 5000,
      });
    }

  };

  const addToCartPrice = async (data, value) => {


    const index =
      listCart.length > 0
        ? listCart.findIndex(i => i.ITEM_ID == data.ITEM_ID)
        : -1;
    //const valueValid = data.ITEM_VALOR_UNITARIO_ESCOLHIDO * 0.79;
    /*console.log(">>> index .......:", index);
      console.log(">>> value Item ..:", data.ITEM_VALOR_UNITARIO);
      console.log(">>> value Digita :", value);
      console.log(">>> valueValid ..:", valueValid);
      console.log("");
      console.log(">>> data ........:", data);
      console.log(">>> listCart ....:", listCart);
      */

    if (index === -1) {
      //   if (value > Number(data.ITEM_VALOR_UNITARIO) - maxDiscount) {
      data.ITEM_VALOR_UNITARIO_ESCOLHIDO = value;
      // }
      const dataSendCart = {
        email: email,
        item_id: data.ITEM_ID,
        codigo: data.ITEM_CODIGO,
        item_nome: data.ITEM_NOME,
        item_grade: data.ITEM_GRADE,
        item_unidade: data.ITEM_UNIDADE,
        empresa_id_erp: data.EMPRESA_ID,
        empresa_apelido: data.EMPRESA_APELIDO,
        data_programacao: data.ITEM_PREVISAO,
        quantidade: data.QUANTIDADE,
        lista_preco_id: listPriceChoose,
        valor_unitario: value,
        valor_unitario_padrao: data.ITEM_VALOR_UNITARIO,
        tipo_venda: data.PE_OU_PROG,
        programacao_numero: data.PROGRAMACAO_ID,
        programacao_item_id: data.ITEM_ID,
        pedido_num: data.PEDIDO_NUM
      };

      if (
        !isConfirmRequest &&
        parseFloat(value) > 0 &&
        parseFloat(data.QUANTIDADE) > 0
      ) {

        const itemBalance = await checkItemBalance(data);
        data.ITEM_SALDO = (itemBalance - data.QUANTIDADE).toFixed(2);

        if (data.ITEM_SALDO >= 0) {


          if (data.QUANTIDADE > 0 && data.ITEM_SALDO >= 0) setListCart(listCart.filter(i => i.ITEM_ID !== data.ITEM_ID));
          ;

          const response = await insertItemCart(
            dataSendCart,
            data.QUANTIDADE,
          );
        }




        // console.log("retorno" + response);
        getCartEndpoint();
      }

      //   if (value !== data.ITEM_VALOR_UNITARIO_ESCOLHIDO) setListCart([...listCart, data]);
    } else {
      //  if (value > Number(data.ITEM_VALOR_UNITARIO) - maxDiscount) {
      if (value !== data.ITEM_VALOR_UNITARIO) {
        listCart[index].ITEM_VALOR_UNITARIO_ESCOLHIDO = value;
        data.ITEM_VALOR_UNITARIO_ESCOLHIDO = value;
        const dataSendCart = {
          email: email,
          item_id: data.ITEM_ID,
          codigo: data.ITEM_CODIGO,
          item_nome: data.ITEM_NOME,
          item_grade: data.ITEM_GRADE,
          item_unidade: data.ITEM_UNIDADE,
          empresa_id_erp: data.EMPRESA_ID,
          empresa_apelido: data.EMPRESA_APELIDO,
          data_programacao: data.ITEM_PREVISAO,
          quantidade: data.QUANTIDADE,
          lista_preco_id: listPriceChoose,
          valor_unitario: value,
          valor_unitario_padrao: data.ITEM_VALOR_UNITARIO,
          tipo_venda: data.PE_OU_PROG,
          programacao_numero: data.PROGRAMACAO_ID,
          programacao_item_id: data.ITEM_ID,
          pedido_num: data.PEDIDO_NUM
        };
        if (
          !isConfirmRequest &&
          parseFloat(value) > 0 &&
          parseFloat(data.QUANTIDADE) > 0
        ) {



          const itemBalance = await checkItemBalance(data);
          data.ITEM_SALDO = (itemBalance - data.QUANTIDADE).toFixed(2);

          if (data.ITEM_SALDO >= 0) {


            if (data.QUANTIDADE > 0 && data.ITEM_SALDO >= 0) setListCart(listCart.filter(i => i.ITEM_ID !== data.ITEM_ID));


            const response = await insertItemCart(
              dataSendCart,
              data.QUANTIDADE,
            );
          }







          // console.log("retorno" + response);
          getCartEndpoint();
        }

        //      setListCart(listCart);
      }
      /*  } else {
          //        listCart[index].ITEM_VALOR_UNITARIO_ESCOLHIDO =  data.ITEM_VALOR_UNITARIO_PADRAO
          //      data.ITEM_VALOR_UNITARIO_ESCOLHIDO = data.ITEM_VALOR_UNITARIO_PADRAO
          toast('O valor informado está abaixo do mínimo permitido.', {
            autoClose: 5000,
          });
        }*/
    }
  };

  const handleSearch = async e => {
    try {
      setLoading(true);
      if (listPriceChoose == '') {
        toast('Favor informar uma lista de preço', { autoClose: 5000 });
        setLoading(false);
      } else {
        if (e.produto !== '') {

          const lista_preco_regras = await axios.get(
            `${API.listaprecos}/${listPriceChoose}`,
            {
              headers: {
                'x-access-token': token,
              },
            },
          );
          const listprecos = lista_preco_regras.data.data;
          setlistRules(listprecos);

          const response = await axios.get(
            `${API.produtos}?email=${email}&nome=${e.produto}&lista_preco=${listPriceChoose}`,
            {
              headers: {
                'x-access-token': token,
              },
            },
          );
          const list = response.data.data;
          list.forEach(objeto => {
            // Verifique se MOSTRA_VALOR é igual a 'NAO'
            if (listprecos[0].LISTA_PRECOS_EXIBE_VALOR == 'nao') {
              // Se verdadeiro, defina ITEM_VALOR_UNITARIO como 0
              objeto.ITEM_VALOR_UNITARIO = 0;
            }
          });


          console.log(list);
          setLista([]);
          setLista(list);

          const totalEstoq = list
            ? list.reduce((total, list) => total + Number(list.ITEM_SALDO), 0)
            : 0;
          setTotalEstoque(totalEstoq);
        } else {
          toast('Favor informar um produto para pesquisa', { autoClose: 5000 });
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 402) {
        //token expirado
        toast.error('Sua sessão expirou, favor efetuar o login');
        sessionStorage.clear();
      } else if (error.response && error.response.status === 404) {
        //token expirado
        toast.error('Produto não encontrado.');
      } else {
        //
      }
    }
  };

  const checkItemBalance = async item => {
    try {
      const response = await axios.get(
        `${API.consultasaldo}?email=${email}&item_id=${item.ITEM_ID}&empresa_id=${item.EMPRESA_ID}&tipo_venda=${item.PROGRAMACAO_ID}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      return response.data ? response.data.data.saldo.toFixed(2) : -1;
    } catch (err) {
      toast.error('Erro ao obter o saldo');
    }
  };

  const insertItemCart = async item => {
    try {
      console.log(item);
      const response = await axios.post(`${API.adicionaaocarrinho}`, item, {
        headers: {
          'x-access-token': token,
        },
      });
      return response.data.data;
    } catch (err) {
      console.log(err);
      toast.error('Erro ao inserir.');
      return 'erro';
    }
  };

  // let mask = function(rawValue) {
  //   let array = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  //   let value = rawValue;
  //   let teste = String(350);
  //   let resultado = teste.substr(0, 1) + "." + teste.substr(1, 2);

  //   console.log("ValorMask", value);

  //   if (value.length == 3) {
  //     let valorTransfor = String(value) + 0;
  //     console.log("teste", valorTransfor);
  //   }
  //   switch (value.length) {
  //     case 3:
  //       array = [/[0-9]/, ".", /\d/, /\d/];
  //       break;
  //     case 5:
  //       array = [/[0-9]/, /\d/, ".", /\d/, /\d/];
  //       break;
  //     case 6:
  //       array = [/[0-9]/, /\d/, /\d/, ".", /\d/, /\d/];
  //       break;
  //     case 7:
  //       array = [/[0-9]/, /\d/, /\d/, /\d/, ".", /\d/, /\d/];
  //       break;
  //     case 8:
  //       array = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, ".", /\d/, /\d/];
  //   }

  //   return array;
  // };
  const onSubmit = dados => {
    //  console.log(dados.valor_default_unitario);
    const rowsList = lista
      ? lista.map(item => {
        const {
          ITEM_ID,
          ITEM_CODIGO,
          ITEM_NOME,
          ITEM_GRADE,
          PE_OU_PROG,
          ITEM_SALDO,
          PEDIDO_NUM,
          ITEM_UNIDADE,
          ITEM_VALOR_UNITARIO,
          ITEM_VALOR_UNITARIO_ESCOLHIDO,
          QUANTIDADE,
        } = item;
        let qtn = QUANTIDADE;
        if (item.QUANTIDADE < 0.1) {
          item.ITEM_VALOR_UNITARIO_ESCOLHIDO = dados.valor_default_unitario;
          //   item.ITEM_VALOR_UNITARIO=dados.valor_default_unitario;
        }
        //item.ITEM_VALOR_UNITARIO.value=Number(dados.valor_default_unitario);
      })
      : '';

    setLista([]);
    setLista(lista);
    setOpen(false); //Fecho o modal
  };
  const { handleSubmit, register } = useForm();
  // console.log(lista);
  const rowsList = lista
    ? lista.map(item => {
      const {
        ITEM_ID,
        ITEM_CODIGO,
        ITEM_NOME,
        ITEM_GRADE,
        MESTRE_CODIGO,
        MESTRE_ID,
        EMPRESA_APELIDO,
        PE_OU_PROG,
        PEDIDO_NUM,
        ITEM_PREVISAO,
        ITEM_SALDO,
        ITEM_UNIDADE,
        ITEM_VALOR_UNITARIO,
        ITEM_VALOR_UNITARIO_ESCOLHIDO,
        QUANTIDADE,
      } = item;
      let qtn = QUANTIDADE;
      //  console.log(qtn);
      if (qtn > 0) {
        if (!String(qtn).match(/.00/) && String(qtn).length == 5) {
          if (qtn >= 100) {
            qtn += '0';
            //    console.log('sssss', qtn);
          }
        }
      }
      // if (qtn == 4) {
      //   if (!String(qtn).match(/.00/)) {
      //     qtn += "00";
      //     console.log("e", qtn);
      //   }
      // }
      let mask = function (rawValue) {
        /* let array = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        let value = rawValue;
        switch (value.length) {
          case 3:
            array = [/[0-9]/, ".", /\d/, /\d/];
            break;
          case 4:
            if (qtn < 10) {
              array = [/[0-9]/, ".", /\d/, /\d/];
            }
            break;
          case 5:
            array = [/[0-9]/, /\d/, ".", /\d/, /\d/];
            break;
          case 6:
            array = [/[0-9]/, /\d/, /\d/, ".", /\d/, /\d/];
            break;
          case 7:
            array = [/[0-9]/, /\d/, /\d/, /\d/, ".", /\d/, /\d/];
            break;
          case 8:
            array = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, ".", /\d/, /\d/];
        }

        return array;*/
      };
      const row = createData(
        <div style={{ display: 'flex', gap: '0px' }}>
          <Pdf num={MESTRE_ID} />
          <PdfColecao num={MESTRE_CODIGO} />
          <ImagesProducts num={ITEM_CODIGO} mestre_id={MESTRE_ID} mestre_codigo={MESTRE_CODIGO} />
        </div>,
        ITEM_CODIGO,
        ITEM_NOME,
        ITEM_GRADE,
        PEDIDO_NUM ? PEDIDO_NUM + ' - ' + PE_OU_PROG : PE_OU_PROG,
        EMPRESA_APELIDO,
        formatDecimal(ITEM_SALDO) + ' ' + ITEM_UNIDADE,
        <Input
          type="number"
          name="quantidade"
          ref={register}
          defaultValue={QUANTIDADE}
          onWheel={e => e.target.blur()}
          onFocus={e => e.target.select()}

          onBlur={e => {
            if (hasDifferentListPriceUsed()) {
              toast('Há itens no carrinho com outra lista de preço, para incluir item considerando essa lista de preço, limpe o carrinho.', {
                autoClose: 5000,
              });
            } else {
              if (item.ITEM_VALOR_UNITARIO_ESCOLHIDO > 0) {
                addToCartAmount(item, e.target.value);
              }
              else {
                item.QUANTIDADE = e.target.value;
              }
            }
          }
          }
          style={{ minWidth: '7rem', maxWidth: '7rem', textAlign: 'right' }}
        />,

        <Input
          type="number"
          name="valorUnitario"
          id="valorUnitario"
          ref={register}
          disabled={listRules[0].LISTA_PRECOS_EDITA_VALOR_UNITARIO === 'nao'}
          defaultValue={ITEM_VALOR_UNITARIO_ESCOLHIDO}
          onBlur={e => {
            if (hasDifferentListPriceUsed()) {
              toast('Há itens no carrinho com outra lista de preço, para incluir item considerando essa lista de preço, limpe o carrinho.', {
                autoClose: 5000,
              });
            }
            else {
              //verifica limite de desconto 
              if (Number(listRules[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO) >= 0 &&
                ITEM_VALOR_UNITARIO > 0) {//lê-se : Permite desconto no valor?

                // Converter a porcentagem para um fator multiplicativo
                const fatorDesconto = 1 - listRules[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO / 100;
                // Calcular o valor permitido com desconto
                const valorPermitidoComDesconto = Number(ITEM_VALOR_UNITARIO) * Number(fatorDesconto);

                // Verificar se o valor_unitario digitado está fora do limite permitido
                if (e.target.value < valorPermitidoComDesconto) {

                  toast.error('O valor informado está fora do limite de desconto permitido para a lista de preço.')
                  e.target.value = ITEM_VALOR_UNITARIO;

                }

              }



              addToCartPrice(item, e.target.value);
            }
          }}
          style={{ minWidth: '7rem', maxWidth: '7rem', textAlign: 'right' }}
        />,
        ITEM_VALOR_UNITARIO,
      );

      return row;
    })
    : [{ error: 'Não encontrado' }];

  async function cancelRequest() {
    setListCart([]);
    setLista([]);
    setIsConfirmRequest(false);
  }

  function confirmaPedido(e) {
    e.preventDefault();

    setConfirmPedido(true);
    setIsConfirmRequest(true);
  }
  // Inicia o processo de seleção e Produtos (quantidade e valor)
  return (
    <>
      <Form onSubmit={handleSubmit(handleSearch)}>
        <div className="lineForm">
          {!isConfirmRequest && (
            <>

              <input
                name="produto"
                style={{
                  marginRight: '10px',
                }}
                type="text"
                ref={register}
                placeholder="Digite o nome do produto"
              />
              <select
                id="lista"
                name="lista"
                placeholder="Lista de preço"
                style={{
                  minWidth: '10rem',
                  height: 'calc(2em + 0.75rem + 2px)',
                  fontSize: '12px',
                  marginRight: '5px',
                }}
                ref={register}
                value={listPriceChoose ? listPriceChoose : ''}
                //defaultValue={frete}
                onChange={e => {
                  setListPriceChoose(e.target.value);

                }}
              >
                ${optionlist}

              </select>

              <ButtonStyled>
                {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: '5px' }}
                  />
                )}
                {loading && <span>Buscando Produtos</span>}
                {!loading && <span>Pesquisar</span>}
              </ButtonStyled>
            </>
          )}
          {!isRequest && !isConfirmRequest && (
            <>
              {' '}
              <button
                style={{
                  marginTop: 10,
                  marginLeft: 0,
                  padding: 10,
                  width: 200,
                  border: 0,
                  backgroundColor: '#00acc1',
                  borderRadius: 5,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                  transition: '0.4s',
                  cursor: 'pointer',
                }}
                disabled={isRequest}
                onClick={confirmaPedido}
              >
                Finalizar Pedido
              </button>

            </>
          )}
        </div>
        {!isRequest && !isConfirmRequest && <Carrinho itemCart={listCart} moeda={currency} />}
      </Form>
      {ConfirmPedido && (
        <>
          <FormAuto>
            <FinalizaPedido
              itemCart={listCart}
              Transp={autoTransp}
              Clients={autoCliente}
              Vendedores={autoVendedor}

            />
          </FormAuto>
        </>
      )}
      {!isConfirmRequest && (
        <>
          {isConfirmRequestEdit && (
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <div className={classes.paper}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} lg={12}>
                        <div className="inputdecimal">
                          <Grid item xs={12} sm={12} lg={12}>
                            <div className="input">
                              <label>Valor unitário padrão</label>
                              <input
                                name="valor_default_unitario"
                                type="number"
                                ref={register}
                                defaultValue={valor_unitario_default}
                                step={0.01}
                              />
                            </div>
                            <span
                              style={{
                                overflowWrap: 'break-word',
                                fontSize: '9px',
                                textAlign: 'right',
                              }}
                            >
                              *A alteração do valor gerará impacto sobre todos
                              os produtos pesquisados, desconsiderando o filtro
                              opcional da tabela (Filtrar)
                            </span>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                    <ButtonStyled variant="contained" color="primary">
                      Alterar valor unitário
                    </ButtonStyled>
                  </Form>
                </div>
              </Fade>
            </Modal>
          )}

          <DataTable
            rows={rowsList}
            rowHead={rowHead}
            title={'Produtos'}
            sort={true}
            filter={true}
            maxHeight="76"
            titleNoData={'Pesquise os produtos'}
            addAction={[
              {
                icon: 'list',
                onClick: () => {
                  setIsConfirmRequestEdit(!isConfirmRequestEdit);
                  setOpen(true);

                  const value = rowsList[0]
                    ? rowsList.slice(0, 1)[0].inputValor.props.defaultValue
                    : 0;
                  setValor_unitario_default(value);
                },
                isFreeAction: true,
                tooltip: 'Alterar valor unitário',
              },
            ]}
            components={{
              Pagination: props => (
                <>
                  <Grid container spacing={0} style={{ alignItems: 'end' }}>
                    <Grid item xs={10} lg={11} md={11}>
                      <Grid container spacing={0} style={{ width: '100%' }}>
                        <Grid
                          className="index"
                          item
                          sm={12}
                          lg={12}
                          md={12}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            textAlign: 'end',
                          }}
                        >
                          <Typography variant="subtitle2">
                            Total escolhido:
                          </Typography>
                        </Grid>
                        <Grid
                          className="index"
                          item
                          sm={12}
                          lg={12}
                          md={12}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            textAlign: 'end',
                          }}
                        >
                          <Typography variant="subtitle2">Estoque:</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2} lg={1} md={1}>
                      <Grid container spacing={0} style={{ width: '100%' }}>
                        <Grid
                          className="index"
                          item
                          sm={12}
                          lg={12}
                          md={12}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            textAlign: 'end',
                          }}
                        >
                          <Typography variant="subtitle2">
                            {totalEstoqueEsc.toLocaleString('pt-BR', {
                              style: 'decimal',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                            }) + ' m '}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        className="index"
                        item
                        sm={12}
                        lg={12}
                        md={12}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          textAlign: 'end',
                        }}
                      >
                        <Typography variant="subtitle2">
                          {totalEstoque
                            ? totalEstoque.toLocaleString('pt-BR', {
                              style: 'decimal',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                            }) + ' m '
                            : '0,00 m'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <TablePagination {...props} />
                </>
              ),
            }}
          />
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default connect()(Clientes);
