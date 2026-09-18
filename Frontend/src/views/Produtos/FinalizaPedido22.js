/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import DataTable from 'components/Table/Table.js';
import ItemProdutos from 'components/Pedidos/ModalItemProdutos';
import { withStyles } from '@material-ui/core/styles';

import IconRequestPass from '@material-ui/icons/CheckCircle';
import IconRequestfailure from '@material-ui/icons/Cancel';

import { ToastContainer, toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import { ReactMultiEmail } from 'react-multi-email';

import Badge from '@material-ui/core/Badge';

import PropTypes from 'prop-types';

import Autocomplete from 'react-autocomplete';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import ParcelNumber from 'components/Pedidos/RequestParcelNumber';
import { API } from '../../config/api';
import history from '../../services/history';
import Async from 'react-select/async';
import debounce from 'debounce-promise';
import Select from 'react-select';
import InfoClient from 'components/Clientes/InfoClientes/index';

import {
  Pesquisa,
  Form,
  ButtonStyled,
  ButtonRequest,
  Input,
  FormAuto,
  PaperStyle,
} from './stylesFinaliza';

import axios from 'axios';
import moment from 'moment';
import { components } from 'react-select/dist/react-select.cjs.prod';

// Função para criar OBJ dos Pedidos
function createRequest(
  view,
  idReq,
  prog,
  busines,
  total,
  idOperator,
  idCarriers,
) {
  return {
    view,
    idReq,
    prog,
    busines,
    total,
    idOperator,
    idCarriers,
  };
}

const headRequest = [
  {
    title: '',
    field: 'view',
    headerStyle: {
      width: 10,
      maxWidth: 10,
      padding: 1,
    },
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      padding: '1px',
    },
  },
  {
    title: 'Referência',
    field: 'idReq',
  },
  {
    title: 'Programacão',
    field: 'prog',
  },
  {
    title: 'Empresa',
    field: 'busines',
  },

  {
    title: 'Total',
    field: 'total',
  },
];

// Funções para criar o OBJ FinishRequest
function createDataFinishRequest(
  mailsent,
  icon,
  items,
  id,
  numeroReferencia,
  paymentForm,
  programacao,
  cliente,
  status,
  id_empresa
) {
  return {
    mailsent,
    icon,
    items,
    id,
    numeroReferencia,
    paymentForm,
    programacao,
    cliente,
    status,
    id_empresa
  };
}

const rowHeadRequest = [
  {
    title: '',
    field: 'mailsent',
    cellStyle: {
      fontSize: '12px',
    },
  },

  {
    title: 'Status',
    field: 'icon',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: '',
    field: 'items',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: 'N.Pedido',
    field: 'id',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: 'Referência',
    field: 'numeroReferencia',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: 'Prazo Pagamento',
    field: 'paymentForm',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: 'Programação',
    field: 'programacao',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: 'Cliente',
    field: 'cliente',
    cellStyle: {
      fontSize: '12px',
    },
  },
  {
    title: 'Status',
    field: 'status',
    cellStyle: {
      fontSize: '12px',
    },
  },
];

function FinalizaPedido({ itemCart, Transp, Clients }) {
  const [isConfirmReq, setisConfirmReq] = useState(true);
  const [isFinishRequest, setIsFinishRequest] = useState(false);
  const [isViewRequest, setIsViewRequest] = useState(false);

  const [lista, setLista] = useState([]);
  const [listCart, setListCart] = useState([itemCart]);
  const [loading, setLloading] = useState(true);
  const [valueIp, setValue] = useState('');

  const [progress, SetProgress] = useState(false);
  const [itemSendRequest, setItemSendRequest] = useState([]);
  const [prz_pagCliente, setPrzPagCliente] = useState('');

  const [autoCliente, setAutoCliente] = useState([]);
  const [autoVendedor, setAutoVendedor] = useState([]);
  const [autoTransp, setTransp] = useState(Transp);

  const [listRequest, setListRequest] = useState([]);

  const [nomeCliente, setNomeCliente] = useState('');
  const [nomeClienteForm, setNomeClienteForm] = useState('');

  const [nomeTransp, setNomeTransp] = useState('');
  const [nomeTranspForm, setNomeTranspForm] = useState('');

  const [nomeTranspRedespacho, setNomeTranspRedespacho] = useState('');
  const [nomeTranspRedespachoForm, setNomeTranspRedespachoForm] = useState('');

  const [idCliente, setIdCliente] = useState('');

  const [vendedorP, setVendedorP] = useState('');
  const [idVendedorP, setIdVendedorP] = useState('');
  const [idTransp, setIdTransp] = useState('');
  const [idTranspRedespacho, setIdTranspRedespacho] = useState('');
  const [obs, setObs] = useState('');
  const [vlparcelas, setVlParcelas] = useState('0');
  const [qtdparcelas, setQtdParcelas] = useState('1');
  const [prz_medio, setPrzMedio] = useState('0');
  const [vl_tot_pedido, setVl_Tot_Pedido] = useState(0);

  const [emails, setEmail] = useState([]);
  const [emailsAutomatico, setEmailAutomatico] = useState([]);

  const frete_default = sessionStorage.getItem('frete');

  const [frete, setFrete] = useState(
    frete_default ? frete_default : 'DESTINATARIO',
  );
  const [freteredesp, setFreteredesp] = useState('DESTINATARIO'); //manter como default FOB
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const userId = sessionStorage.getItem('id');
  const userIdErp = sessionStorage.getItem('id_erp');
  const clientes = sessionStorage.getItem('clientes');

  const isRequest = listCart.length === 0;
  const [fieldsReadonly, setfieldsReadonly] = useState(false);

  const [paymentForm, setPaymentForm] = useState('');

  const [parcelasCartao, setParcelasCartao] = useState('');
  const [perfilVendas, setPerfilVendas] = useState('');
  const [PerfilVendasOptions, setPerfilOptions] = useState('');
  const [optionDefault, setOptionDefault] = useState('');

  const [nomeClienteEntrega, setNomeClienteEntrega] = useState('');
  const [showTriangClient, setshowTriangClient] = useState(false);
  const [idClienteEntrega, setIdClienteEntrega] = useState('');
  const [idEnderecoClienteEntrega, setIdEnderecoClienteEntrega] = useState('');
  const [EnderecoClienteEntrega, setEnderecoClienteEntrega] = useState('');
  const [regras, setRegras] = useState('');
  const [validacao, setValidacao] = useState('');

  const refInput = React.createRef(null);

  const useStyles = makeStyles(theme => ({
    paper: {
      backgroundColor: theme.palette.background.paper,
      paddingTop: '5px',
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    paper2: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      minWidth: '50%',
      minHeight: '50%',
    },
    progress: {
      marginTop: 200,

      textAlign: 'center',
      alignItems: 'center',
      width: '100%',
      '& > * + *': {},
    },
    root: {
      display: 'flex',
      minWidth: 320,
      maxWidth: 500,
      flexDirection: 'column', //change to row for horizontal layout
      '& .MuiCardHeader-root': {
        backgroundColor: 'yellow',
      },
      '& .MuiCardHeader-root': {
        backgroundColor: 'yellow',
      },
      '& .MuiCardHeader-title': {
        //could also be placed inside header class
        backgroundColor: '#FCFCFC',
      },
      '& .MuiCardHeader-subheader	': {
        backgroundImage: 'linear-gradient(to bottom right, #090977, #00d4ff);',
      },
      '& .MuiCardContent-root': {
        backgroundImage: 'linear-gradient(to bottom right, #00d4ff, #00ff1d);',
      },
    },
    header: {
      fontSize: '1.15rem',
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontWeight: 500,
      textAlign: 'center',
      color: 'black',
      lineHeight: 1.4,
    },
    content: {
      display: 'flex',
      minHeight: '100%',
      flexWrap: 'wrap',
    },
    contentItem: {
      flex: 'calc(50% - 4px)',
      '@media (max-width: 500px)': {},
    },
    textContent: {
      fontSize: 18,
      textAlign: 'center',
      border: '1px solid black',
    },
    footer: {
      fontSize: 14,
      backgroundImage: 'linear-gradient(to bottom right, #8c9d9b, #bdcdbf);',
    },
    card: {
      maxWidth: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      boxShadow: '0 5px 8px 0 rgba(0, 0, 0, 0.3)',
      backgroundColor: '#fafafa',
    },
  }));

  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.text.secondary,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 10,
    },
  }))(TableCell);
  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const StyledTableCellPrimary = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 16,
    },
  }))(TableCell);

  const classes = useStyles();
  const perfil = sessionStorage.getItem('perfil');

  useEffect(() => {
    const loadSales = async () => {
      try {
        const response = await axios.get(`${API.vendedores}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });
        if (perfil === 'vendedor' && response.data.data[0]) {
          if (response.data.data[0].id) {
            setIdVendedorP(response.data.data[0].id);
            setVendedorP(response.data.data[0].name);
            setfieldsReadonly(true);
          }
        }

        const data = response.data
          ? response.data.data.map(item => {
              return { value: item.id, label: item.name.toUpperCase() };
            })
          : '';

        setAutoVendedor(data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar o login');
        } else {
          toast.error('Erro ao carregar lista de vendedores');
        }
      }
    };
    const loadPerfilVendas = async empresa => {
      try {
        //Obtem perfil Venda default
        const ha_ProntaEntrega = itemCart.filter(
          item => item.PROGRAMACAO_NUMERO == 'P.E',
        );
        var perfil = null;
        if (ha_ProntaEntrega[0]) {
          //verifica se há perfil preenchido
          perfil = empresa[0]
            ? empresa
                .map(empresa => {
                  if (
                    empresa.EMPRESA_PERFIL_VENDA != '' &&
                    empresa.EMPRESA_PERFIL_VENDA != null
                  ) {
                    const ha_perfil = ha_ProntaEntrega.filter(
                      item => item.EMPRESA_ID == empresa.EMPRESA_ID_ERP,
                    );
                    if (ha_perfil[0]) {
                      return empresa.EMPRESA_PERFIL_VENDA;
                    } else {
                      return null;
                    }
                  } else {
                    return null;
                  }
                })
                .filter(perfil => perfil !== null)
            : null;
          //Regra: Se houver cadastrado 2 empresas com perfis diferentes e for colocado produtos das 2 empresas no carrinho,
          //pegaremos o primeiro apontamento perfil[0]
        }
        // var where = `&parametro='*${busca}*'`;
        const response = await axios.get(`${API.perfilVendas}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });
        const data = response.data
          ? response.data.data
              .filter(item => item.tags && item.tags.includes('salesbreath'))
              .map(item => {
                return {
                  value: item.id,
                  label: item.description.toUpperCase(),
                };
              })
          : '';

        if (data[0]) {
          const companydata = await loadCompany();

          setPerfilOptions(data);
          setPerfilVendas(
            data[0] && perfil[0] != null
              ? data.filter(option => option.value == perfil[0])[0].value
              : '',
          );

          setOptionDefault(
            data[0] && perfil[0] != null
              ? data.filter(option => option.value == perfil[0])
              : '',
          );
        }
      } catch (err) {
      }
    };
    const loadCompany = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get(`${API.empresa}`, {
            headers: {
              'x-access-token': token,
            },
          });

          const lista = response.data.data;
          resolve(lista);
        } catch (err) {
          if (err.response && err.response.status === 402) {
            // Token expired
            toast.error('Sua sessão expirou, favor efetuar login');
            sessionStorage.clear();
            reject(err);
          } else {
            // Other errors
            reject(err);
          }
        }
      });
    };
    const loadRules = async empresa => {
      try {
        const response = await axios.get(
          `${API.regrasatribuidas}?email=${email}`,

          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        // console.log(response.data.data);
        var objeto_regras = {};

        if (response.data && response.data.data) {
          response.data.data.map(item => {
            objeto_regras[`${item.REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME}`] =
              item.REGRAS_ATRIBUIDAS_VALOR;
          });
          //Obtenho as primeira regra

          const empresaListaPrecos = itemCart.map(objeto => ({
            EMPRESA_ID: objeto.EMPRESA_ID,
            LISTA_PRECO_ID: objeto.LISTA_PRECO_ID,
          }));

          const Regras = response.data.data.filter(regra => {
            return (
              Number(empresaListaPrecos[0].EMPRESA_ID) ===
                Number(regra.REGRAS_ATRIBUIDAS_EMPRESA_ID) &&
              Number(empresaListaPrecos[0].LISTA_PRECO_ID) ===
                Number(regra.REGRAS_ATRIBUIDAS_LISTA_PRECOS_ID)
            );
          });

          Regras.map(item => {
            objeto_regras[`${item.REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME}`] =
              item.REGRAS_ATRIBUIDAS_VALOR;
          });
          // Verificar se a primeira incidência foi encontrada

          //   console.log(objeto_regras)
          if (objeto_regras) {
            setRegras(objeto_regras);
          } else {
            setRegras(null);
          }
        }
      } catch (err) {
      }
    };

    loadCompany()
      .then(result => {
        // Handle the result (array) here
        loadPerfilVendas(result);
        confirmRequest();
      })
      .catch(error => {
        // Handle errors here
        console.error(error);
      });

    //  loadCarriers();
    //    setAutoCliente(JSON.parse(clientes));
    loadSales();
    loadRules();
    //OBTEM REGRAS ATRIBUIDAS
  }, []);

  const loadCarriers = async (inputValue, callback) => {
    try {
      var where = `&concat_transp='*${inputValue}*'`;
      const responseTransp = await axios.get(
        `${API.transportadoras}?email=${email}${where}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const data = responseTransp.data.data.map(item => {
        return {
          value: item.id,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<strong>Id:</strong> ' +
                  item.id +
                  '<br> <strong>Nome/Apelido:</strong>' +
                  item.name +
                  '/' +
                  item.fantasyName +
                  '<br><strong>CNPJ:</strong>' +
                  item.documentNumber +
                  '<hr>',
              }}
            />
          ),
          labelshow: item.id + '-' + item.name + ' ' + item.documentNumber,
          dados: item,
        };
      });
      //console.log(data);
      return data;
    } catch (err) {
      if (err.response && err.response.status === 402) {
        //token expirado
        toast.error('Sua sessão expirou, favor efetuar o login');
        sessionStorage.clear();
      } else {
        toast.error('Erro ao carregar lista de transportadoras');
      }
    }
  };

  const loadDestinationClientAddress = async inputValue => {
    try {
      const response = await axios.get(`${API.clienteEndereco}/${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });

      return response?.data ? response?.data?.data[0] : '';
    } catch (err) {
      if (err.response && err.response.status === 402) {
        //token expirado
        toast.error('Sua sessão expirou, favor efetuar o login');
        sessionStorage.clear();
      } else {
        toast.error(
          'Erro ao obter o endereço de entrega do pedido triangulado',
        );
      }
    }
  };

  //DEBOUNCE TRANSPORTADORA
  const loadOptionsTransp = (inputValue, callback) =>
    loadCarriers(inputValue, callback);

  const debouncedLoadOptionsTransp = debounce(loadOptionsTransp, 3000, {
    leading: false,
  });

  const loadClients = async (inputValue, callback) => {
    try {
      var busca = encodeURIComponent(inputValue);

      var where = `&concat_cliente='*${busca}*'`;

      const response = await axios.get(
        `${API.clientes}?email=${email}${where}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      //função que troca null por "" para evitar erro em tela para objeto nulo .
      var k = '';
      var v = ';';
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

      const data = response.data.data.map(item => {
        return {
          value: item.id,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<strong>Id:</strong> ' +
                  item.id +
                  '<br> <strong>Nome/Apelido:</strong>' +
                  item.name +
                  '<br><strong>CNPJ/CPF:</strong>' +
                  item.documentNumber +
                  '<br><strong>Cidade:</strong>' +
                  item.city.name +
                  '/' +
                  item.city.state.name +
                  '<hr>',
              }}
            />
          ),
          labelshow: item.id + ' ' + item.name + ' ' + item.documentNumber,
          dados: item,
        };
      });
      return data;
    } catch (err) {}
  };

  const loadClientsNoParameters = async (inputValue, callback) => {
    try {
      var busca = encodeURIComponent(inputValue);

      var where = `&concat_cliente='*${busca}*'`;

      const response = await axios.get(
        `${API.clientes}/noparameters?email=${email}${where}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      //console.log(response)
      //função que troca null por "" para evitar erro em tela para objeto nulo .
      var k = '';
      var v = ';';
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
      const data = response.data.data.map(item => {
        return {
          value: item.id,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<strong>Id:</strong> ' +
                  item.id +
                  '<br> <strong>Nome/Apelido:</strong>' +
                  item.name +
                  '<br><strong>CNPJ/CPF:</strong>' +
                  item.documentNumber +
                  '<br><strong>Cidade:</strong>' +
                  item?.city?.name +
                  '/' +
                  item?.city?.state?.name +
                  '<hr>',
              }}
            />
          ),
          labelshow: item.id + ' ' + item.name + ' ' + item?.documentNumber,
          dados: item,
        };
      });
      // console.log(data);
      return data;
    } catch (err) {}
  };

  //DEBOUNCE CLIENTES
  const loadOptionsClientes = (inputValue, callback) =>
    loadClients(inputValue, callback);

  const debouncedLoadOptionsClientes = debounce(loadOptionsClientes, 3000, {
    leading: false,
  });

  const loadOptionsClientesNoParameters = (inputValue, callback) =>
    loadClientsNoParameters(inputValue, callback);

  const debouncedLoadOptionsClientesNoParameters = debounce(
    loadOptionsClientesNoParameters,
    3000,
    {
      leading: false,
    },
  );

  async function confirmRequest() {
    setisConfirmReq(true);

    const response = await axios.get(`${API.carrinho}?email=${email}`, {
      headers: {
        'x-access-token': token,
      },
    });
    const itemRequestSend = [];
    const idNumberRequest = [];
    var total_pedido_geral = 0;
    for (let index = 0; index < response.data.data.length; index++) {
      const itemRequest = {
        email,
        user_erp: userIdErp,
        numero_pedido: response.data.data[index].pedido_num,
        numero_pedido: response.data.data[index].pedido_id,
        cliente_id: idCliente,
        cliente_id_entrega: idEnderecoClienteEntrega,
        clienteNome: nomeCliente,
        vendedor_id: idVendedorP,
        vendedor_nome: vendedorP,
        operador_id: userIdErp,
        prazo_pagamento: '',
        prazo_pagamento_media: '',
        valor_parcelas: '',
        referencia: '',
        forma_pagamento: '',
        emissao: moment().format('YYYY/MM/DD'),
        empresa_id: 0,
        lista_preco: '',
        perfil_vendas: perfilVendas,
        tipo_frete: frete,
        tipo_frete_redespacho: freteredesp,
        observacoes: obs,
        emails_adicionais: email,
        dt_previsao_entrega: '',
        transportadora: 0,
        transportadora_nome: '',
        redespacho: 0,
        redespacho_nome: '',
        status: '$digitando',
        items: [...response.data.data[index]],
      };

      const listProducts = [];
      let companyName = '';
      let companyId = 0;
      let dateProgram = '';
      let totalPedido = 0;
      let data_prog = '';
      let num_pedido = null;
      let id_pedido = null;


      // Coleta os itens do pedido (Produtos)
      for (let idx = 0; idx < response.data.data[index].length; idx++) {
        const i = response.data.data[index][idx];
        num_pedido = i.PEDIDO_NUM;
        id_pedido = i.PEDIDO_ID;
        //  console.log(i);
        const item = {
          ID: i.ID,
          ITEM_CODIGO: i.ITEM_CODIGO,
          ITEM_ID: i.ITEM_ID,
          ITEM_NOME: i.ITEM_NOME,
          EMPRESA_ID: i.EMPRESA_ID,
          EMPRESA_APELIDO: i.EMPRESA_APELIDO,
          DATA_PROGRAMACAO: i.DATA_PROGRAMACAO,
          QUANTIDADE: i.QUANTIDADE,
          ITEM_UNIDADE: i.ITEM_UNIDADE,
          ITEM_QUALIDADE: i.ITEM_QUALIDADE,
          ITEM_GRADE: i.ITEM_GRADE,
          LISTA_PRECO: i.LISTA_PRECO_ID,
          VALOR_UNITARIO: i.VALOR_UNITARIO,
          VALOR_UNITARIO_PADRAO: i.VALOR_UNITARIO_PADRAO,
          VALOR_TOTAL: i.VALOR_TOTAL,
          TIPO_VENDA: i.TIPO_VENDA,
          PROGRAMACAO_NUMERO: i.PROGRAMACAO_NUMERO,
          PROGRAMACAO_ITEM_ID: i.PROGRAMACAO_ITEM_ID,
          PROGRAMACAO_DESCRICAO: i.PEDIDO_NUM
            ? i.PEDIDO_NUM + ' - ' + i.TIPO_VENDA
            : i.TIPO_VENDA,
          CARRINHO_USUARIO_ID: i.CARRINHO_USUARIO_ID,
          CARRINHO_CONTA_ID: i.CARRINHO_CONTA_ID,
        };
        listProducts.push(item);
        totalPedido = totalPedido + i.QUANTIDADE * i.VALOR_UNITARIO;
        total_pedido_geral =
          total_pedido_geral + i.QUANTIDADE * i.VALOR_UNITARIO;
        if (companyName === '') {
          companyName = i.EMPRESA_APELIDO;
          dateProgram = i.PEDIDO_NUM
            ? i.PEDIDO_NUM + ' - ' + i.TIPO_VENDA
            : i.TIPO_VENDA;

          companyId = i.EMPRESA_ID;
          data_prog = i.TIPO_VENDA;
        }
      }

      itemRequest.empresa_id = companyId;
      itemRequest.items = listProducts;
      itemRequest.dt_previsao_entrega = data_prog;
      itemRequest.numero_pedido = num_pedido;
      itemRequest.id_pedido = id_pedido;


      const row = createRequest(
        <ItemProdutos itemCart={listProducts} />,

        <Input
          type="text"
          name="referenc"
          className="index"
          onChange={e => (itemRequest.referencia = e.target.value)}
          style={{
            minWidth: '7rem',
            maxWidth: '7rem',
            padding: '1.125rem 0.15rem',
            height: 'calc(1.5em + 0.35rem + 2px)',
            fontSize: '12px',
          }}
        />,
        dateProgram,
        companyName,
        <Input
          type="text"
          name="totalRequest"
          disabled
          value={totalPedido.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          style={{
            minWidth: '10rem',
            textAlign: 'right',
            padding: '1.125rem 0.15rem',
          }}
        />,
      );
      idNumberRequest.push(row);
      itemRequestSend.push(itemRequest);
    }
    setVl_Tot_Pedido(total_pedido_geral);
    // //console.log('total do pedido' + total_pedido_geral);
    setItemSendRequest(itemRequestSend);
    setListCart(idNumberRequest);
    setLloading(false);
  }

  async function orderViewCancel() {
    setIsViewRequest(false);
    setisConfirmReq(true);
  }
  async function orderView() {
    var obsTriangular = '';
    if (showTriangClient) {
      obsTriangular = EnderecoClienteEntrega + '\n' + obs;
    } else {
      obsTriangular = obs;
    }

    setObs(`${obsTriangular}`);

    for (let index = 0; index < itemSendRequest.length; index++) {
      const i = itemSendRequest[index];
      i.cliente_id = idCliente;
      i.cliente_id_entrega = idEnderecoClienteEntrega;
      i.clienteNome = nomeCliente;

      i.vendedor_id = idVendedorP;
      i.vendedor_nome = vendedorP;
      i.tipo_frete = frete;
      i.tipo_frete_redespacho = freteredesp;

      i.observacoes = obsTriangular;
      i.perfil_vendas = perfilVendas;
      i.transportadora = idTransp;
      i.transportadora_nome = nomeTransp;
      i.redespacho_nome = nomeTranspRedespacho;
      i.redespacho = idTranspRedespacho;
      i.prazo_pagamento = paymentForm;
    }

    if (paymentForm !== '') {
      setIsViewRequest(true);
    } else {
      toast.error('Prazo de pagamento não pode ser nulo');
    }
  }

  async function orderConfirmation() {
    if (idCliente.length === 0 || idVendedorP === 0) {
      toast.success('Favor preencher os campos obrigatórios');
    } else {
      setIsFinishRequest(true);
      setLloading(true);
      var responseContatos = null;
      let emails = email ? email + ',' : '';
      let emails_disparo_automatico = email ? email + ',' : '';
      try {
        var responseContatos = null;

        //obtem endereço de email do vendedor associado
        const EmailVendedorAssociado = await axios.get(`${API.usuarios}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const emailsvendedores = EmailVendedorAssociado.data.data;
        const returnVendedores = emailsvendedores
          ? emailsvendedores.filter(function(obj) {
              return obj.USUARIO_CONTA_ID_ERP === String(idVendedorP);
            })
          : '';
        //obtem endereço de email do cliente associado ao pedido
        const EmailCliente = await axios.get(
          `${API.clientes}/${idCliente}/contatos`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        const emailscliente = EmailCliente.data.data;
        const returnclientesmail = emailscliente
          ? emailscliente.filter(function(obj) {
              return obj.type === 'EMAIL';
            })
          : '';
        if (returnclientesmail[0]) {
          emails = emails + returnclientesmail[0].description + ',';
          // emails = emails.slice(0, -1);

          // setEmail(emails.split(','));
        }

        if (returnVendedores[0]) {
          emails = emails + returnVendedores[0].USUARIO_EMAIL + ',';
          emails = emails.slice(0, -1);

          setEmail(emails.split(','));
        }
      } catch (error) {
        //
      }

      const listRequestResponse = [];

      for (let index = 0; index < itemSendRequest.length; index++) {
        const i = itemSendRequest[index];
        i.cliente_id = idCliente;
        i.cliente_id_entrega = idEnderecoClienteEntrega;
        i.vendedor_id = idVendedorP;
        i.observacoes = obs;
        i.transportadora = idTransp;
        i.redespacho = idTranspRedespacho;
        i.vltotal = vl_tot_pedido;

        var erro = 'nao';
        var response = null;

        try {
          const response2 = await axios.post(`${API.pedidos}`, i, {
            headers: {
              'x-access-token': token,
            },
          });

          if (
            response2.data &&
            parseInt(response2.data.status) === 200 &&
            response2.data.data.id > 0
          ) {
            //limpa carrinho(somente itens inseridos)
            for (let x = 0; x < i.items.length; x++) {
              try {
                await axios.delete(
                  `${API.carrinhoremoveitem}/${i.items[x].ID}`,
                  {
                    headers: {
                      'x-access-token': token,
                    },
                  },
                );
                //   toast.success("Item removido do carrinho com sucesso");

                //window.location.reload();
              } catch (err) {}
            }

            //atualizar carrinho que pedido foi gerado
            listRequestResponse.push(
              createDataFinishRequest(
                '',
                <IconRequestPass style={{ color: 'green' }} />,
                <ItemProdutos itemCart={i.items} />,
                response2.data.data.id,
                i.referencia,
                i.prazo_pagamento,
                moment(i.emissao).format('DD/MM/YYYY'),
                response2.data.data.person.name,
                'Enviado',
                i.empresa_id
              ),
            );
          } else {
            toast.error(
              'Erro ao inserir. Os itens serão mantidos em seu carrinho',
            );

            listRequestResponse.push(
              createDataFinishRequest(
                '',
                <IconRequestfailure style={{ color: 'red' }} />,
                <ItemProdutos itemCart={i.items} />,
                '',
                i.referencia,
                i.prazo_pagamento,
                moment(i.emissao).format('DD/MM/YYYY'),
                i.clienteNome,
                response2 && response2.data.data && response2.data.data.mensagem
                  ? response2.data.data.mensagem
                  : '',
                  i.empresa_id
              ),
            );
          }
        } catch (error) {}
      }
      /*
      ////console.log(listRequestResponse);
      //Enviando pedido automaticamente
      const emailSentTo = emails_disparo_automatico.join();

      var array_pedidos_auto = [];

      for (let index = 0; index < listRequestResponse.length; index++) {
        const i = listRequestResponse[index];
        if (i.id > 0) {
          array_pedidos_auto.push({ numero: i.id });
        }
      }

      const data_sendEmail = {
        usuario: email,
        emails: emailSentTo,
        titulo: "",
        descricao: "Pedido emitido pelo sistema SalesBreath",
        pedidos: array_pedidos_auto,
      };
      //console.log("dados a enviar");
      //console.log(data_sendEmail);
      try {
        toast.success("Enviando email,aguarde.", { autoClose: 10000 });

        setLloading(true);

        const response_mail = await axios.post(
          `${API.sendmailPedidos}`,
          data_sendEmail,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        setLloading(false);

        for (
          let idxmail = 0;
          idxmail < response_mail.data.data.data.length;
          idxmail++
        ) {
          listRequest[idxmail].mailsent = "Email Enviado";
        }
        //  setListRequest(listRequest);
      } catch (error) {
        setLloading(false);
        toast.error(

          error.response && error.response.data.message
            ? error.response.data.message
            : "Erro ao enviar email"
        );
      }
      */

      setListRequest(listRequestResponse);
      setLloading(false);
    }
  }

  async function cancelRequest() {
    setListCart([]);
    setLista([]);
    setisConfirmReq(false);
    history.push('/produtos');
  }

  async function sendUserNotification(e) {
    e.preventDefault();
    const emailSentTo = emails.join();
    var answer = window.confirm('Tem certeza que deseja enviar o email ?');
    if (answer) {
      var array_pedidos = '';

      for (let index = 0; index < listRequest.length; index++) {
        const i = listRequest[index];
        
        if (i.id > 0) {
          if (index == 0) {
            array_pedidos = array_pedidos + `${i.id}`;
          } else {
            array_pedidos = array_pedidos + `,${i.id}`;
          }
        }
      }

      const data_sendEmail = {
        usuario: email,
        emails: emailSentTo,
        titulo: '',
        descricao: 'Pedido emitido pelo sistema SalesBreath',
        numero_pedido: array_pedidos,
      };
      //console.log("dados a enviar");
      //console.log(data_sendEmail);
      try {
        toast.success('Enviando email,aguarde.', { autoClose: 10000 });

        setLloading(true);

        const response_mail = await axios.post(
          `${API.sendmailPedidos}`,
          data_sendEmail,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        setLloading(false);

        for (
          let idxmail = 0;
          idxmail < response_mail.data.data.length;
          idxmail++
        ) {
          listRequest[idxmail].mailsent = 'Email Enviado';
        }
        setListRequest(listRequest);
      } catch (error) {
        setLloading(false);
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Erro ao enviar email',
        );
      }
    } else {
      return null;
    }
  }

  // Monta a tela conforme condiçoes das variaveis:
  //
  // isConfirmReq:
  // se for FALSE, renderiza tela de produtos para
  // inserção no carrinho, caso seja TRUE, carrinho
  // com produto para realizar processo de finalização de pedido.
  //
  // isFinishRequest:
  // se for FALSE, processo de finalização do pedido em curso.
  // se for TRUE, iniciou o processo de finalização, enviou os pedidos
  // para o back end, e esta exibindo o resulta em tela para o usuário.
  if (!isConfirmReq) {
    return null;
  } else {
    if (progress) {
      return (
        <>
          <div className={classes.progress}>
            <span alignItems="center">
              Estamos carregando a lista de clientes, favor aguardar.
            </span>

            <LinearProgress />
          </div>
        </>
      );
    }

    if (isConfirmReq && !isFinishRequest && !isViewRequest && !progress) {
      // Inicia o processo de confirmação de pedido

      return (
        <>
          {' '}
          <FormAuto>
            <div className="lineForm">
              <Pesquisa>
                <div>
                  <Typography component={'div'}>
                    <FormAuto>
                      <Grid
                        container
                        spacing={3}
                        style={{
                          width: '100%',
                          minHeight: '100%',
                        }}
                      >
                        <Grid item xs={12} lg={5} md={5}>
                          <Card className={classes.card}>
                            <CardHeader
                              className={classes.header}
                              component={Typography}
                              title={'DEFINIÇÕES DA VENDA'}
                            />

                            <CardContent>
                              <Grid
                                container
                                spacing={1}
                                style={{ width: '100%', background: 'white' }}
                              >
                                <Grid item xs={12} lg={12} md={12}>
                                  <Grid
                                    container
                                    spacing={1}
                                    style={{ width: '100%' }}
                                  >
                                    <Grid
                                      className="index2"
                                      item
                                      sm={12}
                                      lg={12}
                                      md={4}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                      }}
                                    >
                                      <label>PERFIL DE VENDA</label>

                                      <Select
                                        options={PerfilVendasOptions}
                                        isClearable={false}
                                        value={
                                          PerfilVendasOptions
                                            ? PerfilVendasOptions.filter(
                                                item =>
                                                  item.value == perfilVendas,
                                              )
                                            : []
                                        }
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: base => ({
                                            ...base,
                                            zIndex: 100,
                                          }),

                                          container: base => ({
                                            ...base,
                                            minWidth: '8rem',
                                          }),
                                        }}
                                        onChange={value => {
                                          const valor =
                                            value === null ? '' : value.value;
                                          if (valor > 1) {
                                            setPerfilVendas(
                                              value.value ? value.value : '',
                                            );
                                          } else {
                                            setPerfilVendas('');
                                          }
                                        }}
                                      />
                                    </Grid>
                                    <Grid
                                      className="index"
                                      item
                                      xs={12}
                                      sm={12}
                                      lg={12}
                                    >
                                      <input
                                        style={{
                                          minWidth: '1rem',
                                          width: '50px',
                                          verticalAlign: 'middle',
                                          height: 'calc(2em + 0.75rem + 2px)',
                                          fontSize: '12px',
                                          marginRight: '5px',
                                        }}
                                        type="checkbox"
                                        name="triangular"
                                        defaultChecked={false}
                                        onClick={() =>
                                          setshowTriangClient(!showTriangClient)
                                        }
                                      />
                                      <label>Operação Triangular? </label>
                                    </Grid>

                                    <Grid
                                      className="index2"
                                      item
                                      sm={12}
                                      lg={12}
                                      md={12}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                      }}
                                    >
                                      <label>Cliente*</label>

                                      <Async
                                        //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                                        loadOptions={
                                          debouncedLoadOptionsClientes
                                        }
                                        cacheOptions
                                        isClearable={true}
                                        menuPortalTarget={document.body}
                                        noOptionsMessage={() =>
                                          'Nenhuma opção encontrada'
                                        }
                                        placeholder="Clientes"
                                        styles={{
                                          menuPortal: base => ({
                                            ...base,
                                            zIndex: 16,
                                          }),
                                          container: base => ({
                                            ...base,
                                            minWidth: '8rem',
                                          }),
                                          control: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          input: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          singleValue: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),

                                        }}
                                        value={{
                                          label: nomeCliente ? nomeCliente : '',
                                          value: idCliente ? idCliente : '',
                                        }}
                                        onSelect={val => {
                                          if (val.length > 1) {
                                            if (val.dados.personSalesperson) {
                                              setIdVendedorP(
                                                val.dados.personSalesperson
                                                  ? val.dados.personSalesperson
                                                      .id
                                                  : '',
                                              );
                                              setVendedorP(
                                                autoVendedor.filter(
                                                  item =>
                                                    item.value ==
                                                    val.dados.personSalesperson
                                                      .id,
                                                )[0]
                                                  ? autoVendedor.filter(
                                                      item =>
                                                        item.value ==
                                                        val.dados
                                                          .personSalesperson.id,
                                                    )[0].label
                                                  : '',
                                              );
                                            }
                                            setIdCliente(val.value);
                                          }
                                        }}
                                        onChange={value => {
                                          const valor =
                                            value === null ? '' : value.value;
                                          if (valor > 1) {
                                            setIdCliente(valor);
                                            setNomeCliente(value.labelshow);


                                            if (
                                              value.dados.personSalesperson &&
                                              autoVendedor.filter(
                                                item =>
                                                  item.value ==
                                                  value.dados.personSalesperson
                                                    .id,
                                              )[0] &&
                                              autoVendedor.filter(
                                                item =>
                                                  item.value ==
                                                  value.dados.personSalesperson
                                                    .id,
                                              )[0].label != ''
                                            ) {
                                              setfieldsReadonly(true);
                                              setIdVendedorP(
                                                value.dados.personSalesperson
                                                  .id,
                                              );
                                              setVendedorP(
                                                autoVendedor.filter(
                                                  item =>
                                                    item.value ==
                                                    value.dados
                                                      .personSalesperson.id,
                                                )[0]
                                                  ? autoVendedor.filter(
                                                      item =>
                                                        item.value ==
                                                        value.dados
                                                          .personSalesperson.id,
                                                    )[0].label
                                                  : '',
                                              );
                                            } else {
                                              if (perfil !== 'vendedor') {
                                                setfieldsReadonly(false);
                                              }
                                            }
                                          } else {
                                            setIdCliente('');
                                            setNomeCliente('');
                                          }
                                        }}
                                        components={{
                                          SingleValue: ({
                                            children,
                                            ...props
                                          }) => (
                                            <components.SingleValue {...props}>
                                              <span title={props.data.label}>
                                                {children}
                                              </span>
                                            </components.SingleValue>
                                          ),
                                        }}
                                      />
                                    </Grid>

                                    {showTriangClient && (
                                      <>
                                        <Grid
                                          className="index2"
                                          item
                                          sm={12}
                                          lg={12}
                                          md={12}
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                          }}
                                        >
                                          <label>Cliente Entrega</label>

                                          <Async
                                            //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                                            loadOptions={
                                              debouncedLoadOptionsClientesNoParameters
                                            }
                                            cacheOptions
                                            isClearable={true}
                                            noOptionsMessage={() =>
                                              'Nenhuma opção encontrada'
                                            }
                                            menuPortalTarget={document.body}
                                            styles={{
                                              menuPortal: base => ({
                                                ...base,
                                                zIndex: 10000,
                                              }),
                                            }}
                                            placeholder="Clientes"
                                            onSelect={e => {
                                              setIdClienteEntrega(
                                                e.target.value,
                                              );
                                            }}
                                            value={{
                                              label: nomeClienteEntrega
                                                ? nomeClienteEntrega
                                                : '',
                                              value: idClienteEntrega
                                                ? idClienteEntrega
                                                : '',
                                            }}
                                            onChange={async value => {
                                              const valor =
                                                value === null
                                                  ? ''
                                                  : value.value;

                                              if (valor > 1) {
                                                const addressClient = await loadDestinationClientAddress(
                                                  valor,
                                                );
                                                setIdEnderecoClienteEntrega(
                                                  addressClient?.id,
                                                );
                                                setEnderecoClienteEntrega(
                                                  `OPERACAO TRIANGULAR: PESSOA: ${value.labelshow} CNPJ: ${value?.dados?.documentNumber}`,
                                                );
                                                setIdClienteEntrega(valor);
                                                setNomeClienteEntrega(
                                                  value.labelshow,
                                                );
                                              } else {
                                                setIdClienteEntrega('');
                                                setNomeClienteEntrega('');
                                              }
                                            }}
                                            components={{
                                              SingleValue: ({
                                                children,
                                                ...props
                                              }) => (
                                                <components.SingleValue
                                                  {...props}
                                                >
                                                  <span
                                                    title={props.data.label}
                                                  >
                                                    {children}
                                                  </span>
                                                </components.SingleValue>
                                              ),
                                            }}
                                          />
                                        </Grid>
                                      </>
                                    )}

                                    <Grid
                                      className="index2"
                                      item
                                      sm={12}
                                      lg={12}
                                      md={12}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                      }}
                                    >
                                      <label>Vendedor*</label>

                                      <Select
                                        options={autoVendedor}
                                        isClearable={
                                          perfil !== 'vendedor' ? true : false
                                        }
                                        value={{
                                          label: vendedorP ? vendedorP : '',
                                          value: idVendedorP ? idVendedorP : '',
                                        }}
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: base => ({
                                            ...base,
                                            zIndex: 99,
                                          }),

                                          container: base => ({
                                            ...base,
                                            minWidth: '8rem',
                                          }),
                                          control: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          input: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          singleValue: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                        }}
                                        isDisabled={fieldsReadonly}
                                        onChange={value => {
                                          const valor =
                                            value === null ? '' : value.value;
                                          if (valor > 1) {
                                            setIdVendedorP(
                                              value.value ? value.value : '',
                                            );
                                            setVendedorP(
                                              value.label ? value.label : '',
                                            );
                                          } else {
                                            setIdVendedorP('');
                                            setVendedorP('');
                                          }
                                        }}
                                      />
                                    </Grid>
                                    {
                                      //[08:52, 26/04/2022] Fabiano Tempesta: Só permita que ele selecione EMITENTE se o valor for maior que R$ 2.500,00
                                      //[08:52, 26/04/2022] Fabiano Tempesta: É que pode acontecer do cliente exigir uma transportadora própria (frete DESTINATÁRIO) independente do valor
                                    }

                                    <Grid item xs={12} sm={12} lg={9}>
                                      <div className="input">
                                        <label>Prazo Pagamento</label>

                                        <Input
                                          type="text"
                                          id="prazoPaga"
                                          name="prazoPaga"
                                          style={{
                                            minWidth: '100%',
                                            //padding: "1.125rem 0.15rem",
                                            minHeight:
                                              'calc(2.0em + 0.65rem + 2px)',
                                            fontSize: '14px',
                                          }}
                                          onKeyDown={e => {
                                            // Permite a tecla "Tab", "Backspace" e caracteres numéricos e a barra ("/")
                                            if (
                                              e.key !== 'Tab' &&
                                              e.key !== 'Backspace' &&
                                              !/^\d$/.test(e.key) &&
                                              e.key !== '/'
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          onBlur={e => {
                                            if (
                                              e.target.value.toLowerCase() ===
                                              'a vista'
                                            ) {
                                              //  console.log(value);
                                              setQtdParcelas(1);
                                              setPrzMedio(0);
                                              setPaymentForm(0);
                                              setVlParcelas(
                                                (vl_tot_pedido / 1)
                                                  .toFixed(2)
                                                  .replace('.', ',')
                                                  .replace(
                                                    /(\d)(?=(\d{3})+\,)/g,
                                                    '$1.',
                                                  ),
                                              );
                                            } else {
                                              // Divide a entrada em um array de números
                                              const numeros = e.target.value
                                                .split('/')
                                                .map(Number);
                                              const maiorPrazo = Math.max(
                                                ...numeros,
                                              );

                                              // Calcula a média dos números
                                              const media =
                                                numeros.reduce(
                                                  (total, numero) =>
                                                    total + numero,
                                                  0,
                                                ) / numeros.length;

                                              const vlparc =
                                                vl_tot_pedido / numeros.length;
                                              //   console.log(vlparc)
                                              if (regras) {
                                                //Foi digitado um prazo maior que o permitido?

                                                setValidacao(0); //0-OK  1-Regra nao atenndida

                                                //REGRA PARCELA MINIMA , SE HOUVER + DE 1 PARCELA

                                                if (
                                                  regras.valor_minimo_parcelas &&
                                                  Number(
                                                    regras.valor_minimo_parcelas,
                                                  ) > Number(vlparc) &&
                                                  numeros.length > 1
                                                ) {
                                                  toast.error(
                                                    'O valor mínimo das parcelas é de: R$ ' +
                                                      regras.valor_minimo_parcelas +
                                                      ' reais',
                                                  );
                                                  setValidacao(1);
                                                }
                                                //REGRA PARCELA MAXIMA EM DIAS
                                                if (
                                                  regras.prazo_maximo &&
                                                  Number(regras.prazo_maximo) <
                                                    Number(maiorPrazo)
                                                ) {
                                                  toast.error(
                                                    'A parcela máxima não pode exceder: ' +
                                                      regras.prazo_maximo +
                                                      ' dias',
                                                  );
                                                  setValidacao(1);
                                                }
                                                //REGRA QTD MAXIMA DE PARCELAS
                                                if (
                                                  regras.qtd_parcelas &&
                                                  Number(regras.qtd_parcelas) <
                                                    numeros.length
                                                ) {
                                                  toast.error(
                                                    'Limite máximo de parcelas: ' +
                                                      regras.qtd_parcelas,
                                                  );
                                                  setValidacao(1);
                                                }

                                                if (
                                                  regras.prazo_medio &&
                                                  Number(regras.prazo_medio) <
                                                    Number(media)
                                                ) {
                                                  setValidacao(1);
                                                  toast.error(
                                                    'Prazo médio excede limite de : ' +
                                                      regras.prazo_medio +
                                                      ' dias',
                                                  );
                                                }

                                                // if(maiorPrazo>regras)
                                              }

                                              setQtdParcelas(numeros.length);
                                              setPrzMedio(media);
                                              setPaymentForm(e.target.value);
                                              setVlParcelas(
                                                (vl_tot_pedido / numeros.length)
                                                  .toFixed(2)
                                                  .replace('.', ',')
                                                  .replace(
                                                    /(\d)(?=(\d{3})+\,)/g,
                                                    '$1.',
                                                  ),
                                              );
                                              // Define a média como o prazo médio
                                              // setPrazoMedio(media);
                                            }
                                          }}
                                        />
                                      </div>
                                    </Grid>

                                    <>
                                      <Grid item xs={12} sm={12} lg={3}>
                                        <div className="input">
                                          <label>Prazo médio</label>
                                          <input
                                            name="prz_medio"
                                            type="text"
                                            value={prz_medio}
                                            required="required"
                                            style={{
                                              minWidth: '100%',
                                              //padding: "1.125rem 0.15rem",
                                              minHeight:
                                                'calc(2.0em + 0.65rem + 2px)',
                                              fontSize: '14px',
                                            }}
                                          />
                                        </div>
                                      </Grid>
                                    </>
                                    <Grid item xs={12} sm={12} lg={3}>
                                      <div className="input">
                                        <label>Valor Parcelas</label>
                                        <input
                                          name="vl_parcelas"
                                          value={vlparcelas}
                                          type="text"
                                          required="required"
                                          style={{
                                            minWidth: '100%',
                                            //padding: "1.125rem 0.15rem",
                                            minHeight:
                                              'calc(2.0em + 0.65rem + 2px)',
                                            fontSize: '14px',
                                          }}
                                        />
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={2}>
                                      <ParcelNumber paymentTerm={qtdparcelas} />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CardContent>

                            <CardHeader
                              className={classes.header}
                              component={Typography}
                              title={'DEFINIÇÕES DE TRANSPORTE'}
                            />
                            <CardContent>
                              <Grid
                                container
                                spacing={2}
                                style={{ width: '100%', background: 'white' }}
                              >
                                <Grid item xs={12} lg={12} md={12}>
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{ width: '100%' }}
                                  >
                                    <Grid item xs={12} sm={12} lg={5}>
                                      <div className="input">
                                        <label>Tipo Frete</label>

                                        <select
                                          id="tipo_frete"
                                          name="tipo_frete"
                                          style={{
                                            minWidth: '3rem',
                                            //padding: "1.125rem 0.15rem",
                                            minHeight:
                                              'calc(2.0em + 0.65rem + 2px)',
                                            fontSize: '16px',
                                          }}
                                          defaultValue={frete}
                                          onChange={e => {
                                            setFrete(e.target.value);
                                          }}
                                        >
                                          <option value="EMITENTE">
                                            EMITENTE(CIF)
                                          </option>
                                          <option value="DESTINATARIO">
                                            DESTINATARIO(FOB)
                                          </option>
                                        </select>
                                      </div>
                                    </Grid>
                                    <Grid
                                      className="index2"
                                      item
                                      sm={12}
                                      lg={7}
                                      md={12}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                      }}
                                    >
                                      <label>Transportadora*</label>

                                      <Async
                                        //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                                        loadOptions={debouncedLoadOptionsTransp}
                                        cacheOptions
                                        isClearable={true}
                                        menuPortalTarget={document.body}
                                        menuPlacement="top"
                                        styles={{
                                          menuPortal: base => ({
                                            ...base,
                                            zIndex: 320,
                                          }),
                                          container: base => ({
                                            ...base,
                                            minWidth: '20rem',
                                          }),
                                          control: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          input: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          singleValue: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),

                                        }}
                                        noOptionsMessage={() =>
                                          'Nenhuma opção encontrada'
                                        }
                                        placeholder="Transportadora"
                                        value={{
                                          label: nomeTransp ? nomeTransp : '',
                                          value: idTransp ? idTransp : '',
                                        }}
                                        onSelect={val => {
                                          if (val.length > 1) {
                                            setIdTransp(val.value);
                                          }
                                        }}
                                        onChange={value => {
                                          const valor =
                                            value === null ? '' : value.value;
                                          if (valor > 1) {
                                            setIdTransp(valor);
                                            setNomeTransp(value.labelshow);
                                          } else {
                                            setIdTransp('');
                                            setNomeTransp('');
                                          }
                                        }}
                                        components={{
                                          SingleValue: ({
                                            children,
                                            ...props
                                          }) => (
                                            <components.SingleValue {...props}>
                                              <span title={props.data.label}>
                                                {children}
                                              </span>
                                            </components.SingleValue>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={5}>
                                      <div className="input">
                                        <label>Tipo Frete</label>

                                        <select
                                          id="tipo_frete_redesp"
                                          name="tipo_frete_redesp"
                                          style={{
                                            minWidth: '3rem',
                                            //padding: "1.125rem 0.15rem",
                                            minHeight:
                                              'calc(2.0em + 0.65rem + 2px)',
                                            fontSize: '16px',
                                          }}
                                          defaultValue={freteredesp}
                                          onChange={e => {
                                            setFreteredesp(e.target.value);
                                          }}
                                          disabled
                                        >
                                          <option value="EMITENTE">
                                            EMITENTE(CIF)
                                          </option>
                                          <option value="DESTINATARIO">
                                            DESTINATARIO(FOB)
                                          </option>
                                        </select>
                                      </div>
                                    </Grid>
                                    <Grid
                                      className="index2"
                                      item
                                      sm={12}
                                      lg={7}
                                      md={12}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                      }}
                                    >
                                      <label>Redespacho</label>

                                      <Async
                                        //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                                        loadOptions={debouncedLoadOptionsTransp}
                                        cacheOptions
                                        isClearable={true}
                                        menuPortalTarget={document.body}
                                        menuPlacement="top"
                                        styles={{
                                          menuPortal: base => ({
                                            ...base,
                                            zIndex: 320,
                                          }),
                                          container: base => ({
                                            ...base,
                                            minWidth: '20rem',
                                          }),
                                          control: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          input: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),
                                          singleValue: base => ({
                                            ...base,
                                            fontSize: '16px',
                                          }),

                                        }}
                                        noOptionsMessage={() =>
                                          'Nenhuma opção encontrada'
                                        }
                                        placeholder="REDESPACHO"
                                        value={{
                                          label: nomeTranspRedespacho
                                            ? nomeTranspRedespacho
                                            : '',
                                          value: idTranspRedespacho
                                            ? idTranspRedespacho
                                            : '',
                                        }}
                                        onSelect={val => {
                                          if (val.length > 1) {
                                            setIdTranspRedespacho(val.value);
                                          }
                                        }}
                                        onChange={value => {
                                          const valor =
                                            value === null ? '' : value.value;
                                          if (valor > 1) {
                                            setIdTranspRedespacho(valor);
                                            setNomeTranspRedespacho(
                                              value.labelshow,
                                            );
                                          } else {
                                            setIdTranspRedespacho('');
                                            setNomeTranspRedespacho('');
                                          }
                                        }}
                                        components={{
                                          SingleValue: ({
                                            children,
                                            ...props
                                          }) => (
                                            <components.SingleValue {...props}>
                                              <span title={props.data.label}>
                                                {children}
                                              </span>
                                            </components.SingleValue>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} lg={7} md={7}>
                          <Card className={classes.card}>
                            <CardHeader
                              className={classes.header}
                              component={Typography}
                              title={'PEDIDOS'}
                            />
                            <CardContent>
                              <Grid
                                container
                                spacing={0}
                                style={{
                                  width: '100%',
                                  minHeight: '100%',
                                }}
                              >
                                <Grid
                                  className="index2"
                                  item
                                  sm={12}
                                  lg={12}
                                  md={12}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                  }}
                                >
                                  <DataTable
                                    rows={listCart}
                                    rowHead={headRequest}
                                    title={''}
                                    titleNoData={''}
                                    searchInput={false}
                                    load={loading}
                                    maxHeight={'45'}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12}>
                                  <label>Observações</label>

                                  <div className="input">
                                    <textarea
                                      rows="5"
                                      cols="40"
                                      name="obs"
                                      type="text"
                                      onChange={e => setObs(e.target.value)}
                                    />
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  lg={12}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <label>* Campos obrigatórios</label>
                                </Grid>

                                <ToastContainer />

                                <ButtonRequest
                                  bg="#ff5858"
                                  disabled={isRequest}
                                  onClick={cancelRequest}
                                >
                                  Cancelar
                                </ButtonRequest>

                                {(idCliente.length !== 0) &
                                (idVendedorP.length !== 0) &
                                (vlparcelas !== '') &
                                (paymentForm !== '') &
                                (validacao !== 1) &
                                (!showTriangClient ||
                                  (showTriangClient &&
                                    idClienteEntrega.length !== 0)) ? (
                                  <ButtonRequest
                                    bg="#00acc1"
                                    disabled={isRequest}
                                    onClick={() => {
                                      orderView();
                                    }}
                                  >
                                    Visualizar Pedidos
                                  </ButtonRequest>
                                ) : (
                                  ''
                                )}
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </FormAuto>
                  </Typography>
                </div>
              </Pesquisa>

              <ToastContainer />
            </div>
          </FormAuto>
        </>
      );
    } else if (isFinishRequest) {
      return (
        <PaperStyle>
          <div className="div">
            <h1 style={{ marginTop: '18px' }}>Notificação do Cliente</h1>
            <FormAuto>
              <Grid container spacing={1}>
                <Grid className="index" item sm={12} lg={6} md={12}>
                  <label>Email de notificação</label>
                  <ReactMultiEmail
                    placeholder="Emails que receberam o pdf"
                    emails={emails}
                    onChange={_emails => {
                      setEmail(_emails);
                    }}
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          {email}
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />
                </Grid>
                <ButtonRequest
                  bg="#00acc1"
                  disabled={isRequest}
                  onClick={e => sendUserNotification(e)}
                >
                  Enviar Notificação
                </ButtonRequest>
              </Grid>
            </FormAuto>
          </div>

          <DataTable
            rows={listRequest}
            rowHead={rowHeadRequest}
            title={''}
            titleNoData={''}
            searchInput={false}
            load={loading}
          />

          <br />
          <br />
        </PaperStyle>
      );
    } else if (isViewRequest) {
      function ccyFormat(numero) {
        return (
          'R$ ' +
          numero
            .toFixed(2)
            .replace('.', ',')
            .replace(/(\d)(?=(\d{3})+\,)/g, '$1.')
        );
      }

      function subtotal(items) {
        return items
          .map(({ VALOR_TOTAL }) => VALOR_TOTAL)
          .reduce((sum, i) => sum + i, 0);
      }

      function total() {
        var tot = 0;
        itemSendRequest.map(item => {
          tot = tot + subtotal(item.items);
        });
        return tot;
      }
      return (
        <PaperStyle>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <StyledTableCellPrimary colSpan="6" align="center">
                    Pedido(s) {' de: ' + itemSendRequest[0].clienteNome}
                    {showTriangClient && (
                      <>
                        <br></br>
                        ATENÇÃO: {' ' + EnderecoClienteEntrega}
                      </>
                    )}
                  </StyledTableCellPrimary>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Cliente</StyledTableCell>
                  <StyledTableCell align="center">Vendedor</StyledTableCell>
                  <StyledTableCell align="center">
                    Transportadora
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow key={itemSendRequest[0].index}>
                  <StyledTableCell>{nomeCliente}</StyledTableCell>
                  <StyledTableCell align="center">
                    {itemSendRequest[0].vendedor_id + '-' + vendedorP}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {itemSendRequest[0].transportadora_nome}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Código</StyledTableCell>
                  <StyledTableCell align="left">Item</StyledTableCell>
                  <StyledTableCell align="left">Grade</StyledTableCell>
                  <StyledTableCell align="right">Empresa</StyledTableCell>
                  <StyledTableCell align="right">Programação</StyledTableCell>
                  <StyledTableCell align="right">Quantidade</StyledTableCell>
                  <StyledTableCell align="right">
                    Valor Unitário
                  </StyledTableCell>
                  <StyledTableCell align="right">Valor Total</StyledTableCell>
                </TableRow>
              </TableHead>

              {itemSendRequest.map((item, index) => (
                <TableBody>
                  {item.items.map(row => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{row.ITEM_CODIGO}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.ITEM_NOME}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.ITEM_GRADE}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.EMPRESA_APELIDO}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.PROGRAMACAO_DESCRICAO}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.QUANTIDADE + row.ITEM_UNIDADE}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {ccyFormat(row.VALOR_UNITARIO)}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {ccyFormat(row.VALOR_TOTAL)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}

                  <TableRow>
                    <StyledTableCell rowSpan={6} colSpan={6} align="right" />
                    <StyledTableCell colSpan={1} align="right">
                      Subtotal
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {ccyFormat(subtotal(item.items))}
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={1} align="right">
                      Prazo de pagamento
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {paymentForm == 'CARTÃO DE CRÉDITO'
                        ? item.prazo_pagamento + 'x'
                        : item.prazo_pagamento}
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              ))}

              <TableRow>
                <StyledTableCell colSpan={7} align="right">
                  Total
                </StyledTableCell>
                <StyledTableCell align="right">
                  {ccyFormat(total())}
                </StyledTableCell>
              </TableRow>
            </Table>
          </TableContainer>
          <br />
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <StyledTableCell rowSpan="6" align="center">
                    Observações
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow key={itemSendRequest[0]}>
                  <StyledTableCell align="left">
                    <textarea
                      style={{ width: '100%', height: '100px' }}
                      readOnly
                    >
                      {itemSendRequest[0].observacoes}
                    </textarea>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <ButtonRequest
            bg="#00acc1"
            disabled={isRequest}
            onClick={orderConfirmation}
          >
            Confirmar Pedido
          </ButtonRequest>
          <ButtonRequest bg="#00acc1" onClick={orderViewCancel}>
            Voltar
          </ButtonRequest>
        </PaperStyle>
      );
    }
  }
}

FinalizaPedido.propTypes = {
  itemCart: PropTypes.arrayOf(PropTypes.object).isRequired,
  confirma: PropTypes.bool,
  Transp: PropTypes.arrayOf(PropTypes.object).isRequired,
  Clients: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default connect()(FinalizaPedido);
