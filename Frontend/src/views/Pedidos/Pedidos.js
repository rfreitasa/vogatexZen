import React, { useState, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import DataTable from 'components/Table/Table.js';
import ModalPedidosSQL from 'components/Pedidos/ModalPedidosSQL';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import axios from 'axios';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pdf from '../../components/Pedidos/PDF';
import NotasOperador from '../../components/Pedidos/NotasOperador';
import SendEmail from '../../components/Pedidos/ModalEmail';
import moment from 'moment';
import { API } from '../../config/api';
import Paper from '@material-ui/core/Paper';
import Async from 'react-select/async';
import debounce from 'debounce-promise';
import { TablePagination, Divider } from '@material-ui/core';
import Select from 'react-select';
import translate from 'components/Tradutor/tradutor';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    margin: '2px 2px',
  },
  heading: {
    fontWeight: 600,
    fontSize: '18px',
    color: '#2563eb',
  },
  badgeContainer: {
    display: 'flex',
    gap: '1px',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2px',
    width: '100%',

    '& label': {
      marginBottom: '8px',
      fontWeight: 500,
      color: '#374151',
      fontSize: '14px',
      textAlign: 'left',
    },

    '& input': {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      width: '100%',

      '&:focus': {
        outline: 'none',
        borderColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)',
      },
    },
  },
  searchPanel: {
    marginBottom: '24px',

    '& .MuiExpansionPanel-root': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },

    '& .MuiExpansionPanelSummary-root': {
      background: '#f8fafc',
      borderBottom: '1px solid #e5e7eb',
    },
  },
  searchForm: {
    width: '100%',
    padding: '16px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',

    '& .primary-button': {
      background: 'linear-gradient(135deg, #144bc1 0%, #040918 100%)',

      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',

      '&:hover:not(:disabled)': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(37, 99, 235, 0.3)',
      },
    },

    '& .secondary-button': {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',

      '&:hover': {
        background: '#e5e7eb',
      },
    },
  },
  gradientBackground: {
    background: 'linear-gradient(135deg, #144bc1 0%, #040918 100%)',
    padding: '20px',
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '-1px',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
  },
}));

function createData(
  actions,
  numeroSistema,
  empresa,
  status,
  nomeConta,
  emissao,
  disponibilidade,
  tags,
  vendedor,
  valor,
) {
  return {
    actions,
    numeroSistema,
    empresa,
    status,
    nomeConta,
    emissao,
    disponibilidade,
    tags,
    vendedor,
    valor,
  };
}

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
      padding: '10px 8px',
    },
    cellStyle: {
      textAlign: 'center',
      padding: '8px',
    },
    render: rowData => (
      <div style={{ display: 'flex', gap: '0px' }}>{rowData.actions}</div>
    ),
  },
  {
    title: 'Pedido',
    field: 'numeroSistema',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 8px',
      width: 100,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 8px',
      textAlign: 'center',
    },
  },
  {
    title: 'Empresa',
    field: 'empresa',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 100,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Status',
    field: 'status',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 120,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
    },
  },
  {
    title: 'Cliente',
    field: 'nomeConta',
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
      textAlign: 'left',
    },
  },
  {
    title: 'Emissão',
    field: 'emissao',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 120,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
    },
  },
  {
    title: 'Disponibilidade',
    field: 'disponibilidade',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 140,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
    },
  },
  {
    title: 'Tags',
    field: 'tags',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 150,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
    },
  },
  {
    title: 'Vendedor',
    field: 'vendedor',
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
      textAlign: 'left',
    },
  },
  {
    title: 'Pedido Valor',
    field: 'valor',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 140,
      textAlign: 'right',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
];

function Pedidos() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const id_user = sessionStorage.getItem('id');
  const { register, getValues, handleSubmit } = useForm();

  const [isPanelOpen, setPanelOpen] = useState(false);
  const [dadosPedidos, setDadosPedidos] = useState();
  const [statusPedidos, setStatusPedidos] = useState([]);
  const [idVendedorP, setIdVendedorP] = useState([]);
  const [autoVendedor, setAutoVendedor] = useState([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [totalPedidos, settotalPedidos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [idProduto, setIdProduto] = useState('');
  const [idProdutoMestre, setIdProdutoMestre] = useState('');
  const [status_options, setStatus_options] = useState();

  const loadStatusPedidos = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.statuspedidos}`, {
        headers: {
          'x-access-token': token,
        },
      });
      const status = response.data.data.map(item => {
        return {
          value: item.code,
          label: translate(item.code),
        };
      });
      setStatus_options(status);
    } catch (error) {
      if (error.response && error.response.status === 402) {
        toast.error('Sua sessão expirou, favor efetuar login');
        sessionStorage.clear();
      } else {
        toast.error('Erro ao carregar ');
      }
    }
  };

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

      // Limpeza de dados nulos
      for (const obj of response.data.data) {
        if (typeof obj !== 'object') continue;
        for (const k in obj) {
          if (!obj.hasOwnProperty(k)) continue;
          if (obj[k] === null || obj[k] === undefined) {
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

  const loadProdutosMestre = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?tipo=filho&pesquisa=${inputValue}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      var reduced = [];
      response.data.data.forEach(item => {
        var duplicated =
          reduced.findIndex(y => {
            return (
              item.product.id + item.product.code ==
              y.product.id + y.product.code
            );
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });

      const data = reduced
        .map(item => {
          return {
            value: item.product.id,
            label:
              item.product.code +
              ' - ' +
              (item.product.description ? item.product.description : '') +
              ' - ' +
              item.product.id,
          };
        })
        .sort((a, b) => {
          return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        });

      return data;
    } catch (err) {
      setLoading(false);
    }
  };

  const loadProdutosGrade = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?tipo=grade&pesquisa=${inputValue}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      var reduced = [];
      response.data.data.forEach(item => {
        var duplicated =
          reduced.findIndex(y => {
            return item.id + item.code == y.id + y.code;
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });

      const data = reduced
        .map(item => {
          return {
            value: item.id,
            label:
              item.code +
              ' - ' +
              (item.product.description ? item.product.description : '') +
              ' - ' +
              (item.complement
                ? item.complement
                : item.variant
                ? item.variant.description
                : ''),
          };
        })
        .sort((a, b) => {
          return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        });

      return data;
    } catch (err) {
      setLoading(false);
    }
  };

  // DEBOUNCE functions
  const loadOptionsClientes = (inputValue, callback) =>
    loadClients(inputValue, callback);

  const loadOptionsProdutosMestre = (inputValue, callback) =>
    loadProdutosMestre(inputValue, callback);

  const loadOptionsProdutosGrade = (inputValue, callback) =>
    loadProdutosGrade(inputValue, callback);

  const debouncedLoadOptionsClientes = debounce(loadOptionsClientes, 3000, {
    leading: false,
  });

  const debouncedLoadOptionsProdutos = debounce(
    loadOptionsProdutosMestre,
    3000,
    {
      leading: false,
    },
  );

  const debouncedLoadOptionsProdutosGrade = debounce(
    loadOptionsProdutosGrade,
    3000,
    {
      leading: false,
    },
  );

  useEffect(() => {
    const loadSales = async () => {
      try {
        const response = await axios.get(`${API.vendedores}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const data = response.data
          ? response.data.data.map(item => {
              return { value: item.id, label: item.name.toUpperCase() };
            })
          : [];

        setAutoVendedor(data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          toast.error('Sua sessão expirou, favor efetuar o login');
        } else {
          toast.error('Erro ao carregar lista de vendedores');
        }
      }
    };

    loadStatusPedidos();
    loadSales();
  }, []);

  const searchItem = (data, e) => {
    e.preventDefault();
    setLoading(true);
    handleSearch(data);
    setPanelOpen(false);
  };

  const handleSearch = async data => {
    try {
      setLoading(true);
        if ((data.dataini == '' || data.datafim == '') && (data.numero === ''&& data.codigo === '')){
        toast.error('Campo data Inicial e final são obrigatórios.');
        setLoading(false);
        return;
      }

      toast.success('Pesquisando');
      var where = '';
      where = where + `&perfil=${perfil}`;

      if (data.dataini != '' && data.datafim != '') {
        let dataFinal = new Date(data.datafim);
        dataFinal.setDate(dataFinal.getDate() + 1);
        let novaDataFinal = dataFinal.toISOString().split('T')[0];
        where = where + `&DATE_START=${data.dataini}&DATE_END=${novaDataFinal}`;
      }

      if (data.numero !== '') {
        where = where + `&SALE_ID=${data.numero}`;
      }
      if (data.codigo !== '') {
        where = where + `&SALE_CODE=${data.codigo}`;
      }
      if (idCliente > 0) {
        where = where + `&PERSON_IDS=${idCliente}`;
      }

      if (idProduto > 0) {
        where = where + `&PRODUCT_PACKING_IDS=${idProduto}`;
      }

      if (idProdutoMestre > 0) {
        where = where + `&PRODUCT_IDS=${idProdutoMestre}`;
      }

      if (idVendedorP.length > 0) {
        const vendedores_selecionados = encodeURIComponent(
          JSON.stringify(
            idVendedorP?.map(item => {
              return item.value;
            }),
          ),
        );
        where = where + `&SALESPERSON_IDS=${vendedores_selecionados}`;
      }

      if (data.tags.length > 0) {
        where = where + `&TAG_LIST=${encodeURIComponent(data.tags)}`;
      }

      try {
        const response = await axios.get(
          `${API.pedidos}?email=${email}${where}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        response.data.data.forEach(item => {
          item.PEDIDO_VALOR = item.PEDIDO_VALOR > 0 ? item.PEDIDO_VALOR : 0;
        });

        var listPedidos = response.data.data;

        if (statusPedidos.length > 0) {
          listPedidos = listPedidos.filter(objeto => {
            const statusObjeto = objeto.STATUS;
            return statusPedidos.some(status => status.value === statusObjeto);
          });
        }
        setDadosPedidos(listPedidos);
        const total = listPedidos
          ? listPedidos.reduce(
              (total, item) =>
                total + (item.PEDIDO_VALOR ? item.PEDIDO_VALOR : 0),
              0,
            )
          : 0;
        settotalPedidos(total);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response.status === 402) {
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          setDadosPedidos('');
          settotalPedidos(0);
          toast.error('Dados não localizados');
        }
      }
    } catch (error) {
      setLoading(false);
      setDadosPedidos('');
      settotalPedidos(0);
      toast.error('Não localizado, verifique os campos de pesquisa.');
    }
  };

  const rowsList = dadosPedidos
    ? dadosPedidos.map(item => {
        const vendedor_desc = item.VENDEDOR_APELIDO
          ? `${item.VENDEDOR_ID}-${item.VENDEDOR_APELIDO}`
          : item.VENDEDOR_ID;

        return createData(
          <div className={classes.badgeContainer}>
            <ModalPedidosSQL data={item} />
            <Pdf num={item.NUMERO_SISTEMA} />
            <SendEmail num={item.NUMERO_SISTEMA} empresa={item.EMPRESA_ID} />
            <NotasOperador num={item.NUMERO_SISTEMA} />
          </div>,
          item.NUMERO_SISTEMA ? item.NUMERO_SISTEMA : '',
          item.EMPRESA,
          item.STATUS == 'PREPARED'
            ? item.WORKFLOW
            : translate(item.STATUS)
            ? translate(item.STATUS)
            : '',
          item.CLIENTE_COD ? item.CLIENTE_COD + ' - ' + item.APELIDO : '',
          moment(item.PEDIDO_EMISSAO.slice(0, 10)).format('DD/MM/YYYY'),
          moment(item.PEDIDO_DISPONIBILIDADE.slice(0, 10)).format('DD/MM/YYYY'),
          item.TAGS ? item.TAGS : '',
          vendedor_desc ? vendedor_desc : '',
          item.PEDIDO_VALOR.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        );
      })
    : [{ error: 'Não encontrado' }];

  return (
    <div style={{ padding: '2px' }}>
      <div className={classes.gradientBackground}>
        <h2
          style={{
            margin: 0,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontWeight: '600',
          }}
        >
          <span className="material-icons" style={{ fontSize: '28px' }}>
            shopping_cart
          </span>
          Pedidos
        </h2>
      </div>

      <Paper className={classes.paper}>
        <div className={classes.searchPanel}>
          <ExpansionPanel expanded={isPanelOpen}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setPanelOpen(!isPanelOpen)}
            >
              <Typography className={classes.heading}>
                Painel de Pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <form
                className={classes.searchForm}
                onSubmit={handleSubmit(data =>
                  searchItem(data, { preventDefault: () => {} }),
                )}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <div className={classes.inputGroup}>
                      <label>Número</label>
                      <input type="number" name="numero" ref={register} />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <div className={classes.inputGroup}>
                      <label>Código</label>
                      <input type="text" name="codigo" ref={register} />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <div className={classes.inputGroup}>
                      <label>Data Inicial</label>
                      <input
                        type="date"
                        defaultValue=""
                        name="dataini"
                        ref={register}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <div className={classes.inputGroup}>
                      <label>Data Final</label>
                      <input type="date" name="datafim" ref={register} />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <div className={classes.inputGroup}>
                      <label>Tags</label>
                      <input type="text" name="tags" ref={register} />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={3} md={2}>
                    <div className={classes.inputGroup}>
                      <label>Status</label>
                      <Select
                        name="status"
                        placeholder="Status"
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          container: base => ({
                            ...base,
                            minWidth: '8rem',
                          }),
                        }}
                        defaultValue={statusPedidos ? statusPedidos : []}
                        options={status_options}
                        onChange={value => {
                          setStatusPedidos(value);
                        }}
                        isMulti
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={12} md={4}>
                    <div className={classes.inputGroup}>
                      <label>Vendedor</label>
                      <Select
                        options={autoVendedor}
                        isClearable={perfil !== 'vendedor'}
                        menuPortalTarget={document.body}
                        isMulti
                        onChange={value => {
                          setIdVendedorP(value);
                        }}
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          container: base => ({
                            ...base,
                            minWidth: '8rem',
                          }),
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={12} md={4}>
                    <div className={classes.inputGroup}>
                      <label>Cliente</label>
                      <Async
                        loadOptions={debouncedLoadOptionsClientes}
                        cacheOptions
                        isClearable={true}
                        menuPortalTarget={document.body}
                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                        placeholder="Clientes"
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          container: base => ({
                            ...base,
                            minWidth: '8rem',
                          }),
                        }}
                        value={{
                          label: nomeCliente ? nomeCliente : '',
                          value: idCliente ? idCliente : '',
                        }}
                        onChange={value => {
                          const valor = value === null ? '' : value.value;
                          if (valor > 1) {
                            setIdCliente(valor);
                            setNomeCliente(value.labelshow);
                          } else {
                            setIdCliente('');
                            setNomeCliente('');
                          }
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <div className={classes.inputGroup}>
                      <label>Produto Mestre</label>
                      <Async
                        loadOptions={debouncedLoadOptionsProdutos}
                        cacheOptions
                        isClearable={true}
                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                        placeholder="Produto"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          container: base => ({
                            ...base,
                            minWidth: '20rem',
                          }),
                        }}
                        onChange={value => {
                          const valor = value === null ? '' : value.value;
                          if (valor > 1) {
                            setIdProdutoMestre(valor);
                          } else {
                            setIdProdutoMestre('');
                          }
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <div className={classes.inputGroup}>
                      <label>Produto Grade</label>
                      <Async
                        loadOptions={debouncedLoadOptionsProdutosGrade}
                        cacheOptions
                        isClearable={true}
                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                        placeholder="Produto"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          container: base => ({
                            ...base,
                            minWidth: '20rem',
                          }),
                        }}
                        onChange={value => {
                          const valor = value === null ? '' : value.value;
                          if (valor > 1) {
                            setIdProduto(valor);
                          } else {
                            setIdProduto('');
                          }
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>

                <div className={classes.footer}>
                  <div className={classes.buttonContainer}>
                    <button type="submit" className="primary-button">
                      Pesquisar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanelOpen(false)}
                      className="secondary-button"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </form>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>

        <DataTable
          rows={rowsList}
          sort={true}
          rowHead={rowHead}
          title={'Pedidos'}
          titleNoData={'Pesquise os pedidos'}
          load={loading}
          components={{
            Pagination: props => (
              <>
                <Grid container spacing={0} style={{ alignItems: 'end' }}>
                  <Grid item xs={10} lg={11} md={11}>
                    <Grid container spacing={0} style={{ width: '100%' }}>
                      <Grid
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
                          Total de Pedidos:
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} lg={1} md={1}>
                    <Grid container spacing={0} style={{ width: '100%' }}>
                      <Grid
                        item
                        sm={12}
                        lg={12}
                        md={12}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="subtitle2">
                          {totalPedidos
                            ? totalPedidos.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })
                            : '0,00'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <TablePagination {...props} />
              </>
            ),
          }}
          options={{
            headerStyle: {
              position: 'sticky',
              top: 0,
              zIndex: 10,
            },
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            padding: 'dense',
            rowStyle: {
              fontSize: '14px',
            },
          }}
        />
      </Paper>
    </div>
  );
}

export default connect()(Pedidos);
