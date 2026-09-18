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
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import axios from 'axios';
import { FormAuto } from './stylesFinaliza';
import { API } from '../../config/api';
import Paper from '@material-ui/core/Paper';

import {
  TablePagination,
  Typography,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

// Import dos componentes estilizados
import {
  GradientBackground,
  StyledPaper,
  StyledInputGroup,
  PrimaryButton,
  SecondaryButton,
  SearchContainer,
  ButtonContainer,
  StatusBadge,
  LineForm,
  ActionsRow,
  Input,
  Select as StyledSelect,
  LoadingOverlay,
  ModalContent,
  StockInfo,
  Page,
  ScrollArea,
  ActionGroup,
} from './styles';

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
  ITEM_VALOR_UNITARIO,
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

// Colunas com novo estilo
const rowHead = [
  {
    title: 'Ações',
    field: 'actions',
    headerStyle: {
      width: 100,
      textAlign: 'center',
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      padding: '2px 1px',
    },
    cellStyle: {
      textAlign: 'center',
      padding: '1px',
    },
    render: rowData => (
      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
        {rowData.actions}
      </div>
    ),
  },
  {
    title: 'Código',
    field: 'ITEM_CODIGO',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 100,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      textAlign: 'center',
    },
  },
  {
    title: 'Nome',
    field: 'ITEM_NOME',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 200,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Variante',
    field: 'ITEM_GRADE',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 120,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Prog',
    field: 'PE_OU_PROG',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 100,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Empresa',
    field: 'EMPRESA',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 100,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Disponível',
    field: 'ITEM_SALDO',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 120,
      textAlign: 'right',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
  {
    title: 'Quantidade',
    field: 'inputQuantidade',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 120,
      textAlign: 'center',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      textAlign: 'center',
    },
  },
  {
    title: 'Valor unitário',
    field: 'inputValor',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 1px',
      width: 140,
      textAlign: 'center',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '2px 1px',
      textAlign: 'center',
    },
  },
];

function formatDecimal(numero) {
  return numero.replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
}

function Produtos() {
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
  const ordenacao_default = sessionStorage.getItem('ordenacao_lista');
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState('BRL');
  const [orderByIndex, setOrderByIndex] = useState(null);
  const [orderDirection, setOrderDirection] = useState('asc');
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
  const onSubmit = dados => {
    //  console.log(dados.valor_default_unitario);
    const rowsList = lista
      ? lista.map(item => {
          const {
            PERFIL_VENDA,
            SUBTIPO,
            SALEPROFILE,
            ITEM_ID,
            ITEM_CODIGO,
            ITEM_NOME,
            ITEM_GRADE,
            PE_OU_PROG,
            ITEM_SALDO,
            PEDIDO_NUM,
            PEDIDO_ID,
            PERMITE_VENDA_SEM_SALDO,
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

    setLista(applySort(lista));

    setOpen(false); //Fecho o modal
  };
  const { handleSubmit, register } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsConfirmRequestEdit(false);
  };

  useEffect(() => {
    getListPrice(usuario_id);
    getCartEndpoint();
  }, []);
  const applySort = React.useCallback(
    (list, idx = orderByIndex, dirState = orderDirection) => {
      if (idx == null) return list;
      const col = rowHead[idx];
      const field = col && col.field;
      if (!field) return list;

      const dir = dirState === 'desc' ? -1 : 1;

      return [...list].sort((a, b) => {
        const av = a[field];
        const bv = b[field];

        const an = Number(av);
        const bn = Number(bv);
        const bothNum = !isNaN(an) && !isNaN(bn);

        if (bothNum) return (an - bn) * dir;

        return (
          String(av ?? '').localeCompare(String(bv ?? ''), 'pt-BR', {
            numeric: true,
            sensitivity: 'base',
          }) * dir
        );
      });
    },
    [orderByIndex, orderDirection],
  );
  const ordenarLista = (lista, ordenacao_default) => {
    let listaOrdenada = [...lista];
    if (ordenacao_default === 'CRESCENTE') {
      listaOrdenada = listaOrdenada.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } else if (ordenacao_default === 'DECRESCENTE') {
      listaOrdenada = listaOrdenada.sort((a, b) =>
        b.name.localeCompare(a.name),
      );
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
        },
      );

      const lista = response.data.data.map(item => ({
        value: item.LISTA_PRECOS_ID,
        label: `${item.LISTA_PRECOS_NOME}-${item.LISTA_PRECOS_DESCRICAO}`,
        name: item.LISTA_PRECOS_DESCRICAO,
        selected: item.SELECIONADO,
        default: item.LISTA_PRECOS_DEFAULT === 'sim',
      }));

      const listaOrdenada = ordenarLista(lista, ordenacao_default);
      const listitems = listaOrdenada.filter(
        item => item.selected === 'selected',
      );

      setListPrice(listitems);

      const options =
        listitems.length > 0 ? (
          listitems.map((item, index) => {
            if (
              item.default ||
              (index === 0 && !listitems.some(i => i.default))
            ) {
              setListPriceChoose(item.value);
              return (
                <option key={item.value} value={item.value} selected>
                  {item.label}
                </option>
              );
            }
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })
        ) : (
          <option value=""></option>
        );

      setOptionList(options);
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
      response.data.data.map(item => {
        item.map(newitem => {
          newarray.push(newitem);
        });
      });

      if (newarray.length > 0) {
        setListPriceChoose(newarray[0].LISTA_PRECO_ID);
        const get_currency = await axios.get(
          `${API.getCurrencyById}?email=${email}&parametro=${newarray[0].LISTA_PRECOS_MOEDA}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        setCurrency(get_currency.data.data[0].code);
      }

      setListCart(newarray);
      const totalEstoqEscolhido = newarray.reduce(
        (total, item) => total + item.QUANTIDADE,
        0,
      );
      setTotalEstoqueEsc(totalEstoqEscolhido);
    } catch (error) {
      if (error.response?.status === 402) {
        toast.error('Sua sessão expirou, favor efetuar o login');
        sessionStorage.clear();
      }
    }
  }

  const hasDifferentListPriceUsed = () => {
    return listCart.some(item => item.LISTA_PRECO_ID !== listPriceChoose);
  };

  const addToCartAmount = async (data, value) => {
    setIsLoading(true);
    try {
      const index = listCart.findIndex(i => i.ITEM_ID === data.ITEM_ID);
     
      console.log(data)
      var itemBalance = '';
      if(data.TIPO=='ESPERA_PE' || data.TIPO=='ESPERA_PRG'){
        itemBalance = parseFloat(0);
      } else{
        itemBalance = await checkItemBalance(data);
      }
      console.log(itemBalance);
      const amountOld = data.QUANTIDADE;

      data.QUANTIDADE = value;
      data.ITEM_SALDO = (itemBalance - value).toFixed(2);
      if (data.ITEM_SALDO >= 0 || data.TIPO=='ESPERA_PE' || data.TIPO=='ESPERA_PRG') {
        //
        if (index === -1) {
          if (value > 0) setListCart([...listCart, data]);
        } else {
          if (parseFloat(value) === 0.0) {
            data.ITEM_SALDO = itemBalance;
            setListCart(listCart.filter(i => i.ITEM_ID !== data.ITEM_ID));
          } else {
            listCart[index].QUANTIDADE = data.QUANTIDADE;
            listCart[index].ITEM_SALDO = data.ITEM_SALDO;
            if (value > 0) setListCart([...listCart]);
          }
        }

        const dataSendCart = {
          tipo: data.TIPO,
          subtipo: data.SUBTIPO,
          saleprofile: data.SALEPROFILE,
          email: email,
          item_id: data.ITEM_ID,
          codigo: data.ITEM_CODIGO,
          item_nome: data.ITEM_NOME,
          item_grade: data.ITEM_GRADE,
          item_unidade: data.ITEM_UNIDADE,
          empresa_id_erp: data.EMPRESA_ID,
          empresa_apelido: data.EMPRESA_APELIDO,
          quantidade: value,
          lista_preco_id: listPriceChoose,
          valor_unitario: data.ITEM_VALOR_UNITARIO_ESCOLHIDO,
          valor_unitario_padrao: data.ITEM_VALOR_UNITARIO,
          tipo_venda: data.PE_OU_PROG,
          programacao_numero: data.PROGRAMACAO_ID,
          programacao_data: data.PROGRAMACAO_DATA,
          programacao_item_id: data.ITEM_ID,
          pedido_num: data.PEDIDO_NUM,
          pedido_id: data.PEDIDO_ID,
        };
console.log(value)
        if (!isConfirmRequest && parseFloat(value) > 0.0) {
          await insertItemCart(dataSendCart, amountOld);
          getCartEndpoint();
        }
      } else {
        toast('Quantidade não permitida.', { autoClose: 5000 });
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCartPrice = async (data, value) => {
    const index = listCart.findIndex(i => i.ITEM_ID == data.ITEM_ID);

    if (index === -1) {
      data.ITEM_VALOR_UNITARIO_ESCOLHIDO = value;
    } else {
      if (value !== data.ITEM_VALOR_UNITARIO) {
        listCart[index].ITEM_VALOR_UNITARIO_ESCOLHIDO = value;
        data.ITEM_VALOR_UNITARIO_ESCOLHIDO = value;
      }
    }

    const dataSendCart = {
      tipo: data.TIPO,
      subtipo: data.SUBTIPO,
      email: email,
      item_id: data.ITEM_ID,
      codigo: data.ITEM_CODIGO,
      item_nome: data.ITEM_NOME,
      item_grade: data.ITEM_GRADE,
      item_unidade: data.ITEM_UNIDADE,
      empresa_id_erp: data.EMPRESA_ID,
      empresa_apelido: data.EMPRESA_APELIDO,
      quantidade: data.QUANTIDADE,
      saleprofile: data.SALEPROFILE,
      lista_preco_id: listPriceChoose,
      valor_unitario: value,
      valor_unitario_padrao: data.ITEM_VALOR_UNITARIO,
      tipo_venda: data.PE_OU_PROG,
      programacao_numero: data.PROGRAMACAO_ID,
      programacao_item_id: data.ITEM_ID,
      programacao_data: data.PROGRAMACAO_DATA,
      pedido_num: data.PEDIDO_NUM,
      pedido_id: data.PEDIDO_ID,

    };
console.log(data)
    if (
      !isConfirmRequest &&
      parseFloat(value) > 0 &&
      parseFloat(data.QUANTIDADE) > 0
    ) {

      var itemBalance = '';
      if(data.TIPO=='ESPERA_PE' || data.TIPO=='ESPERA_PRG'){
        itemBalance = parseFloat(0);
      } else{
        itemBalance = await checkItemBalance(data);
      }
      //const itemBalance = await checkItemBalance(data);
      data.ITEM_SALDO = (itemBalance - data.QUANTIDADE).toFixed(2);

      if (data.ITEM_SALDO >= 0 || data.TIPO=='ESPERA_PE' || data.TIPO=='ESPERA_PRG') {
        await insertItemCart(dataSendCart, data.QUANTIDADE);
        getCartEndpoint();
      }
    }
  };

  const handleSearch = async e => {
    try {
      setLoading(true);
      if (!listPriceChoose) {
        toast('Favor informar uma lista de preço', { autoClose: 5000 });
        setLoading(false);
        return;
      }

      if (!e.produto) {
        toast('Favor informar um produto para pesquisa', { autoClose: 5000 });
        setLoading(false);
        return;
      }

      const lista_preco_regras = await axios.get(
        `${API.listaprecos}/${listPriceChoose}`,
        { headers: { 'x-access-token': token } },
      );

      const listprecos = lista_preco_regras.data.data;
      setlistRules(listprecos);

      const response = await axios.get(
        `${API.produtos}?email=${email}&nome=${e.produto}&lista_preco=${listPriceChoose}`,
        { headers: { 'x-access-token': token } },
      );

      const list = response.data.data;
      if (listprecos[0]?.LISTA_PRECOS_EXIBE_VALOR == 'nao') {
        list.forEach(objeto => {
          objeto.ITEM_VALOR_UNITARIO = 0;
        });
      }
      setLista([]);
      const listWithUid = list.map((it, idx) => ({
        ...it,
        ROW_UID: `${it.ITEM_ID}-${it.EMPRESA_ID}-${it.ITEM_GRADE ||
          ''}-${it.PE_OU_PROG || ''}-${it.PEDIDO_NUM || ''}-${idx}`,
      }));

      setLista(applySort(listWithUid));
      //setLista(applySort(list));

      const totalEstoq = list.reduce(
        (total, item) => total + Number(item.ITEM_SALDO),
        0,
      );
      setTotalEstoque(totalEstoq);
    } catch (error) {
      if (error.response?.status === 402) {
        toast.error('Sua sessão expirou, favor efetuar o login');
        sessionStorage.clear();
      } else if (error.response?.status === 404) {
        toast.error('Produto não encontrado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkItemBalance = async item => {
    try {



      const response = await axios.get(
        `${API.consultasaldo}?email=${email}&item_id=${item.ITEM_ID}&empresa_id=${item.EMPRESA_ID}&tipo_venda=${item.PROGRAMACAO_ID}&programacao_data=${item.PROGRAMACAO_DATA}`,
        { headers: { 'x-access-token': token } },
      );
      return response.data ? response.data.data.saldo.toFixed(2) : -1;
    } catch (err) {
      toast.error('Erro ao obter o saldo');
      return -1;
    }
  };

  const insertItemCart = async item => {
    try {
      const response = await axios.post(`${API.adicionaaocarrinho}`, item, {
        headers: { 'x-access-token': token },
      });
      return response.data.data;
    } catch (err) {
      toast.error('Erro ao inserir item no carrinho.');
      return 'erro';
    }
  };

  const rowsList = lista.map(item => {
    const {
      TIPO,
      SUBTIPO,
      SALEPROFILE,
      ITEM_ID,
      ITEM_CODIGO,
      ITEM_NOME,
      ITEM_COD_GRADE,
      ITEM_GRADE,
      MESTRE_CODIGO,
      MESTRE_ID,
      EMPRESA_APELIDO,
      PE_OU_PROG,
      PEDIDO_NUM,
      PERMITE_VENDA_SEM_SALDO,
      ITEM_SALDO,
      ITEM_UNIDADE,
      ITEM_VALOR_UNITARIO,
      ITEM_VALOR_UNITARIO_ESCOLHIDO,
      QUANTIDADE,
    } = item;

    const row = createData(
      <ActionGroup
        key={`act-${PEDIDO_NUM}${PE_OU_PROG}${EMPRESA_APELIDO}${PEDIDO_NUM} `}
      >
        <Pdf num={MESTRE_ID} />
        <PdfColecao num={MESTRE_CODIGO} />
        <ImagesProducts
          num={ITEM_CODIGO}
          grade={ITEM_COD_GRADE}
          mestre_id={ITEM_ID}
          mestre_codigo={MESTRE_CODIGO}
        />
      </ActionGroup>,
      ITEM_CODIGO,
      ITEM_NOME,
      ITEM_GRADE,
      PEDIDO_NUM ? (
        <>
          {SUBTIPO}
          {TIPO === 'ESPERA_PRG' &&  (
            <span
              style={{
                display: 'inline-block',
                marginLeft: '8px',
                padding: '7px 13px',
                borderRadius: '12px',
                backgroundColor: '#ff9800',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              ⏳ FILA
            </span>
          )}
        </>
      ) : (
        <>
          {SUBTIPO}
          {TIPO === 'ESPERA_PE' && (
            <span
              style={{
                display: 'inline-block',
                marginLeft: '8px',
                padding: '7px 13px',
                borderRadius: '12px',
                backgroundColor: '#ff9800',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              ⏳ FILA
            </span>
          )}
        </>
      ),
      EMPRESA_APELIDO,
      formatDecimal(ITEM_SALDO) + ' ' + ITEM_UNIDADE,
      <Input
        key={`q-${item.ROW_UID}`}
        type="number"
        name={`quantidade-${item.ROW_UID}`}
        onChange={e => {
          const v = e.target.value;
          setLista(prev =>
            prev.map(it =>
              it.ROW_UID === item.ROW_UID ? { ...it, QUANTIDADE: v } : it,
            ),
          );
        }}
        //        ref={register}
        value={item.QUANTIDADE ?? ''}
        onWheel={e => e.target.blur()}
        onFocus={e => e.target.select()}
        disabled={isLoading}
        onBlur={e => {
          if (hasDifferentListPriceUsed()) {
            toast(
              'Há itens no carrinho com outra lista de preço, para incluir item considerando essa lista de preço, limpe o carrinho.',
              { autoClose: 5000 },
            );
          } else if (item.ITEM_VALOR_UNITARIO_ESCOLHIDO > 0) {
            addToCartAmount(item, e.target.value);
          }
        }}
        style={{ minWidth: '7rem', maxWidth: '7rem', textAlign: 'right' }}
      />,
      <Input
        key={`v-${item.ROW_UID}`}
        type="number"
        name={`valorUnitario-${item.ROW_UID}`}
        //   ref={register}
        value={item.ITEM_VALOR_UNITARIO_ESCOLHIDO ?? ''}
        disabled={listRules[0]?.LISTA_PRECOS_EDITA_VALOR_UNITARIO === 'nao'}
        // defaultValue={ITEM_VALOR_UNITARIO_ESCOLHIDO}
        onChange={e => {
          const v = e.target.value;
          setLista(prev =>
            prev.map(it =>
              it.ROW_UID === item.ROW_UID
                ? { ...it, ITEM_VALOR_UNITARIO_ESCOLHIDO: v }
                : it,
            ),
          );
        }}
        onBlur={e => {
          if (hasDifferentListPriceUsed()) {
            toast(
              'Há itens no carrinho com outra lista de preço, para incluir item considerando essa lista de preço, limpe o carrinho.',
              { autoClose: 5000 },
            );
          } else {
            if (
              listRules[0]?.LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO >=
                0 &&
              item.ITEM_VALOR_UNITARIO > 0
            ) {
              const fator =
                1 -
                listRules[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO /
                  100;
              const minimo = Number(item.ITEM_VALOR_UNITARIO) * fator;
              if (Number(e.target.value) < minimo) {
                toast.error(
                  'O valor informado está fora do limite de desconto permitido para a lista de preço.',
                );
                // resetar para o valor permitido
                setLista(prev =>
                  prev.map(it =>
                    it.ITEM_ID === ITEM_ID
                      ? {
                          ...it,
                          ITEM_VALOR_UNITARIO_ESCOLHIDO:
                            item.ITEM_VALOR_UNITARIO,
                        }
                      : it,
                  ),
                );
                return;
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
  });

  const confirmaPedido = e => {
    e.preventDefault();
    setConfirmPedido(true);
    setIsConfirmRequest(true);
  };

  const cancelRequest = () => {
    setListCart([]);
    setLista([]);
    setIsConfirmRequest(false);
  };

  return (
    <div style={{ padding: '0px' }}>
      <GradientBackground>
        <h2>
          <AttachMoneyIcon style={{ fontSize: '28px' }} />
          Produtos
        </h2>

        {listCart.length > 0 && !ConfirmPedido && (
          <ActionsRow>
            <Carrinho itemCart={listCart} moeda={currency} />
            <StatusBadge bgColor="#dcfce7" textColor="#166534">
              {listCart.length} iten(s) no carrinho
            </StatusBadge>
            <StatusBadge bgColor="#dbeafe" textColor="#1e40af">
              {currency}
            </StatusBadge>
            <PrimaryButton onClick={confirmaPedido} disabled={isRequest}>
              Finalizar Pedido
            </PrimaryButton>
          </ActionsRow>
        )}
      </GradientBackground>
      <StyledPaper>
        {!isConfirmRequest && (
          <StyledPaper>
            <SearchContainer>
              <form onSubmit={handleSubmit(handleSearch)}>
                <LineForm
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '0px',
                  }}
                >
                  <StyledInputGroup style={{ flex: 1, minWidth: '200px' }}>
                    <label>Produto</label>
                    <input
                      name="produto"
                      type="text"
                      ref={register}
                      placeholder="Digite o nome do produto"
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        width: '100%',
                      }}
                    />
                  </StyledInputGroup>

                  <StyledInputGroup style={{ flex: 1, minWidth: '200px' }}>
                    <label>Lista de Preço</label>
                    <select
                      id="lista"
                      name="lista"
                      ref={register}
                      value={listPriceChoose}
                      onChange={e => setListPriceChoose(e.target.value)}
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        width: '100%',
                        background: 'white',
                      }}
                    >
                      {optionlist}
                    </select>
                  </StyledInputGroup>

                  <PrimaryButton
                    type="submit"
                    disabled={loading}
                    style={{
                      marginBottom: '0px',
                      minWidth: '140px',
                      height: '44px',
                    }}
                  >
                    {loading && (
                      <i
                        className="fa fa-refresh fa-spin"
                        style={{ marginRight: '8px' }}
                      />
                    )}
                    {loading ? 'Buscando...' : 'Pesquisar'}
                  </PrimaryButton>
                </LineForm>
              </form>
            </SearchContainer>
          </StyledPaper>
        )}
        {ConfirmPedido && (
          <FormAuto>
            <FinalizaPedido
              itemCart={listCart}
              Transp={autoTransp}
              Clients={autoCliente}
              Vendedores={autoVendedor}
            />
          </FormAuto>
        )}

        {!isConfirmRequest && (
          <>
            {isConfirmRequestEdit && (
              <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
              >
                <Fade in={open}>
                  <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <StyledInputGroup>
                            <label>Valor unitário padrão</label>
                            <Input
                              name="valor_default_unitario"
                              type="number"
                              ref={register}
                              defaultValue={valor_unitario_default}
                              step={0.01}
                            />
                          </StyledInputGroup>
                          <span
                            style={{
                              overflowWrap: 'break-word',
                              fontSize: '12px',
                              color: '#6b7280',
                              textAlign: 'right',
                              display: 'block',
                              marginTop: '8px',
                            }}
                          >
                            *A alteração do valor gerará impacto sobre todos os
                            produtos pesquisados
                          </span>
                        </Grid>
                      </Grid>
                      <ButtonContainer style={{ marginTop: '20px' }}>
                        <PrimaryButton type="submit">
                          Alterar valor unitário
                        </PrimaryButton>
                        <SecondaryButton type="button" onClick={handleClose}>
                          Cancelar
                        </SecondaryButton>
                      </ButtonContainer>
                    </form>
                  </ModalContent>
                </Fade>
              </Modal>
            )}

            {isLoading && (
              <LoadingOverlay>
                <CircularProgress style={{ color: '#fff' }} />
              </LoadingOverlay>
            )}

            <DataTable
              rows={rowsList}
              rowHead={rowHead}
              title={'Produtos'}
              sort={true}
              filter={true}
              maxHeight="60"
              titleNoData={'Pesquise os produtos'}
              addAction={[
                {
                  icon: 'list',
                  onClick: () => {
                    setIsConfirmRequestEdit(!isConfirmRequestEdit);
                    setOpen(true);
                    const value =
                      rowsList[0]?.inputValor?.props?.defaultValue || 0;
                    setValor_unitario_default(value);
                  },
                  isFreeAction: true,
                  tooltip: 'Alterar valor unitário',
                },
              ]}
              onOrderChange={colId => {
                const nextDir =
                  colId === orderByIndex
                    ? orderDirection === 'asc'
                      ? 'desc'
                      : 'asc'
                    : 'asc';
                setOrderByIndex(colId);
                setOrderDirection(nextDir);
                setLista(prev => applySort(prev, colId, nextDir));
              }}
              components={{
                Pagination: props => (
                  <>
                    <Grid
                      container
                      spacing={0}
                      style={{ alignItems: 'end', padding: '16px 0' }}
                    >
                      <Grid item xs={6}>
                        <StockInfo>
                          Total escolhido:{' '}
                          {totalEstoqueEsc.toLocaleString('pt-BR')} m
                        </StockInfo>
                        <StockInfo>
                          Estoque total: {totalEstoque.toLocaleString('pt-BR')}{' '}
                          m
                        </StockInfo>
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <TablePagination {...props} />
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                ),
              }}
            />
          </>
        )}
      </StyledPaper>
      <ToastContainer />
    </div>
  );
}

export default connect()(Produtos);
