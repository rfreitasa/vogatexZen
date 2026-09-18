import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import axios from 'axios';
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Autocomplete from 'react-autocomplete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Pesquisa, Form, ButtonStyled } from '../styles';
import { API } from '../../../config/api';
import debounce from 'debounce-promise';
import Async from 'react-select/async';
import Select from 'react-select';




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




function EIR6000() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const clientes = JSON.parse(sessionStorage.getItem('clientes'));
  const [fieldsReadonly, setfieldsReadonly] = useState(false);
  const [listEmpresas, setListEmpresas] = useState('');

  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete
  const [auto, setAuto] = useState([]);



  const [vendedorP, setVendedorP] = useState('');
  const [idVendedorP, setIdVendedorP] = useState('');
  const [Estados, setEstados] = useState([]);
  const [nomeEstado, setNomeEstado] = useState('');
  const [idEstado, setIdEstado] = useState('');

  const [Departamentos, setDepartamentos] = useState([]);
  const [nomeDepartamento, setNomeDepartamento] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');

  const [Marcas, setMarcas] = useState([]);
  const [nomeMarcas, setNomeMarcas] = useState('');
  const [idMarcas, setIdMarcas] = useState('');

  const [autoNomeSupervisor, setAutoNomeSupervisor] = useState('');
  const [idSupervisor, setIdSupervisor] = useState('');
  const [autoListSupervisor, setAutoListSupervisor] = useState([]);

  const [autoVendedor, setAutoVendedor] = useState([]);

  const [idProduto, setIdProduto] = useState('');
  const [idProdutoGrade, setIdProdutoGrade] = useState('');

  const estadosBrasileiros = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' },
  ];

  let value = '';
  let valueId = '';
  const [valueAutoId, setValueAutoId] = useState(valueId);
  const [valueAutoNome, setValueAutoNome] = useState(value);

  const [autoCliente, setAutoCliente] = useState(clientes);

  const [nomeCliente, setNomeCliente] = useState('');
  const [idCliente, setIdCliente] = useState('');

  const [loading, setLloading] = useState(false);

  useEffect(() => {
    async function handleClean() {
      setIdCliente('');
    }
    async function handleCleanEstado() {
      setIdEstado('');
    }

    async function handleCleanVendedor() {
      setValueAutoId('');
    }

    if (valueAutoNome.length === 0) {
      handleCleanVendedor();
    }

    if (nomeCliente.length === 0) {
      handleClean();
    }
    if (nomeEstado.length === 0) {
      handleCleanEstado();
    }




  }, [nomeEstado, valueAutoNome]);


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
    } catch (err) { }
  };
  const loadProdutosMestre = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?email=${email}&tipo=='mestre'&pesquisa=${inputValue}`,
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
            return item.product.id + item.product.code == y.product.id + y.product.code;
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
            (item.product.id ),

        };
      })
      .sort((a, b) => {
        return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
      });
      // console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };
  const loadProdutosGrade = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?email=${email}&tipo=='filho'&pesquisa=${inputValue}`,
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
              (item.complement ? item.complement : item.variant ? item.variant.description : ''),
          };
        })
        .sort((a, b) => {
          return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        });

      // console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };

  //DEBOUNCE CLIENTES
  const loadOptionsClientes = (inputValue, callback) =>
    loadClients(inputValue, callback);

  const debouncedLoadOptionsClientes = debounce(loadOptionsClientes, 3000, {
    leading: false,
  });
  //DEBOUNCE PRODUTOS
  const loadOptionsProdutosMestre = (inputValue, callback) =>
    loadProdutosMestre(inputValue, callback);


  const loadOptionsProdutosGrade = (inputValue, callback) =>
    loadProdutosGrade(inputValue, callback);

  const debouncedLoadOptionsProdutos = debounce(loadOptionsProdutosMestre, 3000, {
    leading: false,
  });

  const debouncedLoadOptionsProdutosGrade = debounce(loadOptionsProdutosGrade, 3000, {
    leading: false,
  });

  useEffect(() => {
    async function handleReq() {
      try {
        const response = await axios.get(`${API.vendedores}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const list = response.data.data;
        setAuto(list);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          //  toast.error('Erro ao carregar ');
        }
      }
    }

    const getSupervisores = async () => {
      try {
        const response = await axios.get(`${API.usuarios}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const data = response.data.data;
       
        if(perfil=='supervisor')
        {
          setAutoListSupervisor(
            data.filter(function (obj) {
              return obj.USUARIO_PERFIL === 'supervisor' && obj.USUARIO_EMAIL.trim().toUpperCase()==email.trim().toUpperCase();
            }),
          );
        }
        else{
          setAutoListSupervisor(
            data.filter(function (obj) {
              return obj.USUARIO_PERFIL === 'supervisor';
            }),
          );
        } 
         //filter perfil por supervisor
        //      setAutoListGerente(data);
      } catch (error) {
        toast.error('Erro ao carregar lista.');
      }
    };

    async function getEstados() {
      try {
        const response = await axios.get(`${API.estados}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const data = response.data ? response.data.data.map(item => {
          return { value: item.UFS_ID, label: item.UFS_NOME.toUpperCase() };
        }) : '';
        setEstados(data);
       
        // console.log(Estados);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          //   toast.error('Erro ao carregar ');
        }
      }
    }
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

        const data = response.data ? response.data.data.map(item => {
          return { value: item.id, label: item.name.toUpperCase() };
        }) : '';

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

    const loadCompany = async () => {
      try {
        const response = await axios.get(`${API.empresa}`, {
          headers: {
            'x-access-token': token,
          },
        });

        //const lista = response.data.data;

        const data = response.data ? response.data.data.filter(item => item.EMPRESA_NOME != 'PERSONAL SOFTWARE' && item.EMPRESA_ATIVO == 0).map(item => {
          return { value: item.EMPRESA_ID_ERP, label: item.EMPRESA_NOME.toUpperCase() };
        }) : '';

        setListEmpresas(data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          toast.error('Erro ao carregar lista');
        }
      }
    };
    loadCompany();
    loadSales();
    getSupervisores();
    // getEstados();
    handleReq();
  }, []);

  const Pesquisaitem = (data, e) => {
    e.preventDefault();
    handleSearch(data);
  };

  const handleSearch = async data => {
    try {
      setLloading(true);
      if (data.dataini === '' || data.datafim === '') {
        toast.error('Campo data Inicial e final são obrigatórios.');
        setLloading(false);
      } else {
        var axios_search = '';
        // Função para verificar e retornar o array ou null
        const verificaEAtualizaArray = (array) => {
          if (Array.isArray(array) && array.length > 0) {
            return encodeURIComponent(JSON.stringify(array.map(item => item.value)));
          } else {
            return null;
          }
        };

        const empresas_selecionadas = verificaEAtualizaArray(idEmpresas);
        const produtomestre_selecionados = verificaEAtualizaArray(idProduto);
        const produtograde_selecionados = verificaEAtualizaArray(idProdutoGrade);

        var where = `&produtograde=${produtograde_selecionados}&produtomestre=${produtomestre_selecionados}&dados=${data.dados}&empresas=${empresas_selecionadas}&supervisor=${idSupervisor}&dt_ini=${data.dataini}&dt_fim=${data.datafim}&agrupamento=${data.agrupamento}&ordenacao=${data.ordenacao}&vendedor=${idVendedorP}&cliente=${idCliente}`;



        axios_search = `${API.relatorios}/?relatorio=EIR6000&email=${email}&${where}`;
        try {
          toast.success('Aguarde seu Relatório está sendo gerado.');
          const response = await axios.get(`${axios_search}`, {
            responseType: 'blob',
            headers: {
              'x-access-token': token,
            },
          });
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          setLloading(false);
          window.open(fileURL);
        } catch (err) {
          if (err.response.status === 402) {
            //token expirado
            toast.error('Sua sessão expirou, favor efetuar login');
            sessionStorage.clear();
          } else {
            toast.error('Não foi possível gerar seu Relatório');
          }
        }
      }
    } catch (error) {
      setLloading(false);

      toast.error('Não localizado, verifique os campos de pesquisa.');
    }
  };

  //const listPedidos = useSelector(state => state.filter.listPedido);
  //console.log(dadosPedidos);

  return (
    <>
      <Pesquisa>
        <div>
          <ExpansionPanel expanded={PanelOpen}>
            <ExpansionPanelSummary
              expanded={PanelOpen}
              onClick={() => {
                //  setPanelOpen(!PanelOpen);
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography component={'span'} className={classes.heading}>
                Painel de pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={'div'}>
                <Form>
                  <Grid container spacing={1}>

                    <Grid item xs={12} sm={12} lg={5}>
                      <div className="input">
                        <label>Dados*</label>
                        <select name="dados" ref={register} >
                          <option value="person_nameCalc" selected>
                            Pessoa
                          </option>
                          <option value="personGroup_description">Grupo empresarial</option>
                          <option value="city_name">
                            Cidade
                          </option>
                          <option value="state_name">
                            Estado
                          </option>
                          <option value="salesperson_name">Vendedor</option>
                          <option value="product_code">Produto mestre</option>
                          <option value="productPacking_code">Produto grade</option>
                          <option value="product_category_description_1">Classe</option>


                        </select>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={5}>
                      <div className="input">
                        <label>Agrupamento</label>
                        <select name="agrupamento" ref={register}>
                          <option value="" selected>
                            Nenhum
                          </option>
                          <option value="state_code" selected>
                            Estado
                          </option>
                          <option value="salesperson_name">Vendedor</option>
                          <option value="product_code">
                            Produto Mestre
                          </option>
                          <option value="productPacking_code">
                            Produto filho
                          </option>
                          <option value="person_nameCalc">Cliente</option>
                          <option value="product_category_description_1">Classe</option>

                        </select>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={2}>
                      <div className="input">
                        <label>Ordenação</label>
                        <select name="ordenacao" ref={register}>
                          <option value="invoiceItem_quantity" >
                            Quantidade
                          </option>
                          <option value="invoiceItem_totalValue" selected>Valor</option>
                        </select>
                      </div>
                    </Grid>





                    <Grid item xs={12} sm={12} lg={3}>
                      <div className="input">
                        <label>Data Inicial</label>
                        <input
                          type="date"
                          className="data"
                          name="dataini"
                          ref={register}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={3}>
                      <div className="input">
                        <label>Data Final</label>
                        <input
                          type="date"
                          className="data"
                          name="datafim"
                          ref={register}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Empresas</label>
                        <Select
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          options={listEmpresas ? listEmpresas : []}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Empresas"
                          menuPortalTarget={document.body}
                          isMulti

                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 10000,
                            }),
                          }}
                          onChange={value => {

                            setIdEmpresas(value);

                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={6} sm={12} lg={4}>
                      <div className="input">
                        <label>Supervisor</label>
                        <input
                          name="supervisorId"
                          type="hidden"
                          ref={register}
                          defaultValue={idSupervisor}
                        />

                        <Autocomplete
                          renderInput={props => (
                            <input {...props} autoComplete={false} />
                          )}
                          items={autoListSupervisor}
                          shouldItemRender={(item, value) =>
                            item.USUARIO_NOME.toLowerCase().indexOf(
                              value.toLowerCase(),
                            ) > -1
                          }
                          getItemValue={item => {
                            setIdSupervisor(item.USUARIO_ID);
                            return item.USUARIO_NOME;
                          }}
                          menuStyle={{
                            borderRadius: '3px',
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '2px 0',
                            fontSize: '90%',
                            position: 'fixed',
                            overflow: 'auto',
                            maxHeight: '50%',
                            zIndex: '400',
                          }}
                          renderItem={(item, isHighlighted) => (
                            <div
                              key={item.USUARIO_CONTA_ID_ERP}
                              style={{
                                background: isHighlighted
                                  ? 'lightgray'
                                  : 'white',
                                width: '100%',
                              }}
                            >
                              {item.USUARIO_NOME}
                            </div>
                          )}
                          value={autoNomeSupervisor}
                          onChange={e => setAutoNomeSupervisor(e.target.value)}
                          onSelect={val => setAutoNomeSupervisor(val)}
                          isDisabled={perfil === 'vendedor'}
                        />
                      </div>
                    </Grid>

                    <Grid
                      className="index2"
                      item
                      sm={12}
                      lg={6}
                      md={12}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <div className="input">

                        <label>Vendedor*</label>

                        <Select
                          options={autoVendedor}
                          isClearable={
                            perfil !== 'vendedor' ? true : false
                          }
                          value={{
                            label: vendedorP ? vendedorP : '',
                            value: idVendedorP
                              ? idVendedorP
                              : '',
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
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
                      </div>
                    </Grid>



                    <Grid item xs={12} sm={12} lg={2}>
                      <div className="input">
                        <label>Estado</label>
                        <select name="estado" ref={register}>
                          <option value=""></option>
                          {estadosBrasileiros.map((estado) => (
                            <option key={estado.uf} value={estado.uf}>
                              {estado.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Grid>


                    <Grid
                      className="index2"
                      item
                      sm={12}
                      lg={4}
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
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9998,
                          }),
                        }}
                        value={{
                          label: nomeCliente ? nomeCliente : '',
                          value: idCliente ? idCliente : '',
                        }}
                        onSelect={val => {
                          if (val.length > 1) {
                            //   setIdVendedorP(val.dados.properties.salesPerson);
                            // setVendedorP(autoVendedor.filter(item => item.value == val.dados.properties.salesPerson)[0] ? autoVendedor.filter(item => item.value == val.dados.properties.salesPerson)[0].label : '');

                            setIdCliente(val.value);
                          }
                        }}
                        onChange={value => {
                          const valor =
                            value === null ? '' : value.value;
                          if (valor > 1) {
                            //  console.log(value)
                            //  console.log(autoVendedor)
                            setIdCliente(valor);
                            setNomeCliente(value.labelshow);
                            //setIdVendedorP(value.dados.properties.salesPerson);
                            //console.log(autoVendedor.filter(item => item.id == value.dados.properties.salesPerson)[0].name)
                            //setVendedorP(autoVendedor.filter(item => item.id == value.dados.properties.salesPerson)[0].name)

                            /*
                                                        if (autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0] && autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0].label != '') {
                                                          setfieldsReadonly(true);
                                                          setIdVendedorP(value.dados.properties.salesPerson);
                                                          setVendedorP(autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0] ? autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0].label : '');
                            
                                                        }
                                                        else {
                                                          if (perfil !== 'vendedor') {
                                                            setfieldsReadonly(false);
                                                          }
                                                        }
                            
                            */
                          } else {
                            setIdCliente('');
                            setNomeCliente('');
                          }
                        }}
                      />
                    </Grid>


                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Produto Mestre</label>
                        <Async
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          loadOptions={debouncedLoadOptionsProdutos}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Produto"
                          menuPortalTarget={document.body}
                          isMulti

                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9997,
                            }),
                          }}
                          onChange={value => {
                            setIdProduto(value)
                          }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Produto Grade</label>
                        <Async
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          loadOptions={debouncedLoadOptionsProdutosGrade}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Produto"
                          menuPortalTarget={document.body}
                          isMulti

                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9996,
                            }),
                          }}
                          onChange={value => {
                            setIdProdutoGrade(value)
                          }}
                        />
                      </div>
                    </Grid>


                  </Grid>
                  <ButtonStyled
                    variant="contained"
                    color="primary"
                    onClick={e => Pesquisaitem(getValues(), e)}
                  >
                    Pesquisar
                  </ButtonStyled>
                </Form>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Pesquisa>
    </>
  );
}

export default connect()(EIR6000);
