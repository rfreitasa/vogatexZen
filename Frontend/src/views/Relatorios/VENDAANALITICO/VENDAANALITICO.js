import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
import { Pesquisa, Form, ButtonStyled, Select } from '../styles';
import { API } from '../../../config/api';
import Async from 'react-select/async';
import debounce from 'debounce-promise';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

function VENDAANALITICO() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const id_user = sessionStorage.getItem('id');
  const clientes = JSON.parse(sessionStorage.getItem('clientes'));

  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete

  const [classesReport, setClassesReport] = useState([]);
  const [nomeClassesReport, setNomeClassesReport] = useState('');
  const [idClassesReport, setIdClassesReport] = useState('');
  const [loading, setLloading] = useState(false);
  const [clienteEscolhido, setClienteEscolhido] = useState('');
  const [vendedorEscolhido, setVendedorEscolhido] = useState(
    perfil === 'vendedor'
      ? clientes && clientes[0].vendedorPadrao === null
        ? ''
        : clientes[0].vendedorPadrao.id
      : '',
  );
  const [gerenteEscolhido, setGerenteEscolhido] = useState('');
  const [statusEscolhido, setStatusEscolhido] = useState('');
  const [produtoEscolhido, setProdutoEscolhido] = useState('');
  const [classeEscolhida, setClasseEscolhida] = useState('');
  const [defaultSellerID, setDefaultSellerID] = useState(
    perfil === 'vendedor'
      ? clientes && clientes[0].vendedorPadrao === null
        ? ''
        : clientes[0].vendedorPadrao.id
      : '',
  );
  const [defaultSeller, setDefaultSeller] = useState(
    perfil === 'vendedor'
      ? clientes && clientes[0].vendedorPadrao === null
        ? ''
        : clientes[0].vendedorPadrao.nome
      : '',
  );

  const loadClients = async (inputValue, callback) => {
    try {
      var nome = encodeURIComponent(inputValue);

      var where = `&concat_cliente='*${nome}*'&bloqueada=false&ativa=true`;
      setLloading(true);
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

      setLloading(false);
      console.log(response.data.data);
      const data = response.data.data.map(item => {
        return { value: item.id, label: item.nome_concat.toUpperCase() };
      });

      // console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };

  const loadSellers = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.vendedores}?email=${email}`, {
        headers: {
          'x-access-token': token,
        },
      });

      //////console.log(response.data.data);
      const data = response.data.data
        .map(item => {
          return { value: item.NUMCAD1, label: item.NOME.toUpperCase() };
        })
        .filter(item => {
          return item.label.includes(inputValue.toUpperCase());
        });

      // //console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };
  const loadProducts = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?pesquisa='${inputValue}'`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      //console.log(response.data.data);
      /*
      "ITEM_ID": 10504,
      "CODIGO": "068556-001",
      "NOME": "POLY RAYON SPAN XADREZ",
      "GRADE": "Mestre"
      */
      const data = response.data.data.map(item => {
        return {
          value: item.ITEM_ID,
          label:
            item.ITEM_ID +
            ' - ' +
            item.CODIGO +
            ' - ' +
            (item.NOME ? item.NOME : '') +
            ' - ' +
            (item.GRADE ? item.GRADE : ''),
        };
      });

      ////console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };
  const loadSupervisors = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.usuarios}`, {
        headers: {
          'x-access-token': token,
        },
      });

      const data = response.data.data;
      //console.log(data);
      if (perfil !== 'vendedor' && perfil !== 'supervisor') {
        return data
          .filter(function (obj) {
            return obj.USUARIO_PERFIL === 'supervisor';
          })
          .map(item => {
            return {
              value: item.USUARIO_CONTA_ID_ERP,
              label: item.USUARIO_NOME,
            };
          });
      } else if (perfil === 'supervisor') {
        return data
          .filter(function (obj) {
            return obj.USUARIO_ID == id_user;
          })
          .map(item => {
            return {
              value: item.USUARIO_CONTA_ID_ERP,
              label: item.USUARIO_NOME,
            };
          });
      } else {
        const id_sup = data.filter(function (obj) {
          return obj.USUARIO_ID == id_user;
        });

        if (id_sup[0] && id_sup[0].USUARIO_CONTA_SUPERVISOR_ID) {
          return data
            .filter(function (obj) {
              return obj.USUARIO_ID == id_sup[0].USUARIO_CONTA_SUPERVISOR_ID;
            })
            .map(item => {
              return {
                value: item.USUARIO_CONTA_ID_ERP,
                label: item.USUARIO_NOME,
              };
            });
        }
      }
    } catch (error) {
      toast.error('Erro ao carregar lista.');
    }
  };
  const loadStats = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.statuspedidos}`, {
        headers: {
          'x-access-token': token,
        },
      });
      //console.log(response.data.data);
      const data = response.data.data.map(item => {
        return { value: item.CODIGO, label: item.DESCRICAO.toUpperCase() };
      });
      data.push(
        { value: 'EM_ABERTO', label: 'EM ABERTO' },
        { value: 'EM_PROGRAMACAO', label: 'EM PROGRAMAÇÃO' },
        { value: 'EM_PRONTA_ENTREGA', label: 'EM PRONTA ENTREGA' },
      );
      return data.filter(item => {
        return item.label.includes(inputValue.toUpperCase());
      });
    } catch (error) {
      if (error.response && error.response.status === 402) {
        //token expirado
        toast.error('Sua sessão expirou, favor efetuar login');
        sessionStorage.clear();
      } else {
        toast.error('Erro ao carregar ');
      }
    }
  };

  const loadClass = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.classesReport}?email=${email}`, {
        headers: {
          'x-access-token': token,
        },
      });
      //console.log(response.data.data);
      const data = response.data.data
        .map(item => {
          return { value: item.CLASSE_ID, label: item.CLASSE.toUpperCase() };
        })
        .filter(item => {
          return item.label.includes(inputValue.toUpperCase());
        });

      return data;
    } catch (error) {
      if (error.response && error.response.status === 402) {
        //token expirado
        toast.error('Sua sessão expirou, favor efetuar login');
        sessionStorage.clear();
      } else {
        toast.error('Erro ao carregar ');
      }
    }
  };

  const Pesquisaitem = (data, e) => {
    e.preventDefault();
    if (data.dt_inicial === '' || data.dt_final === '') {
      toast.error('Campo data Inicial e final são obrigatórios.');
    } else {
      clienteEscolhido > 0 || vendedorEscolhido > 0 || produtoEscolhido > 0
        ? handleSearch(data)
        : toast.error(
            'Obrigatório a escolha de ao menos 1 desses filtros: Cliente, Vendedor ou Produto.',
          );
    }
  };

  const handleSearch = async data => {
    try {
      setLloading(true);
      var axios_search = '';

      //console.log(data);
      //:agrupamento, :filtro_data, :data_inicial, :data_final, :cliente_id, :vendedor_id, :gerente_id, :item_id, :status, :classe_id)
      var where = `&agrupamento='${data.agrupamento}'&classe=${classeEscolhida}&filtro_data='${data.filtro_data}'&dt_inicial='${data.dt_inicial}'&dt_final='${data.dt_final}'&cliente=${clienteEscolhido}&vendedor=${vendedorEscolhido}&gerente=${gerenteEscolhido}&produto=${produtoEscolhido}&status=${statusEscolhido}`;
      //console.log(where);
      axios_search = `${API.relatorios}/?relatorio=VENDAANALITICO&email=${email}${where}`;
      //console.log(axios_search);
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
    } catch (error) {
      setLloading(false);

      toast.error('Não localizado, verifique os campos de pesquisa.');
    }
  };
  //DEBOUNCE CLIENTES
  const loadOptionsClientes = (inputValue, callback) =>
    loadClients(inputValue, callback);

  const debouncedLoadOptionsClientes = debounce(loadOptionsClientes, 2000, {
    leading: true,
  });

  //DEBOUNCE SUPERVISORES
  const loadOptionsSupervisores = (inputValue, callback) =>
    loadSupervisors(inputValue, callback);

  const debouncedLoadOptionsSupervisores = debounce(
    loadOptionsSupervisores,
    2000,
    {
      leading: true,
    },
  );

  //DEBOUNCE STATUS
  const loadOptionsStats = (inputValue, callback) =>
    loadStats(inputValue, callback);

  const debouncedLoadOptionsStats = debounce(loadOptionsStats, 2000, {
    leading: true,
  });

  //DEBOUNCE VENDEDORES
  const loadOptionsSellers = (inputValue, callback) =>
    loadSellers(inputValue, callback);

  const debouncedLoadOptionSellers = debounce(loadOptionsSellers, 1000, {
    leading: true,
  });

  //DEBOUNCE PRODUCTS
  const loadOptionsProducts = (inputValue, callback) =>
    inputValue.length > 3 ? loadProducts(inputValue, callback) : '';

  const debouncedLoadOptionProducts = debounce(loadOptionsProducts, 2000, {
    leading: true,
  });

  //DEBOUNCE CLASSES
  const loadOptionsClass = (inputValue, callback) =>
    loadClass(inputValue, callback);

  const debouncedLoadOptionClass = debounce(loadOptionsClass, 2000, {
    leading: true,
  });

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
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Cliente</label>
                        <Async
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          loadOptions={debouncedLoadOptionsClientes}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => "Nenhuma opção encontrada"}
                          placeholder="Clientes"
                          styles={{
                            menuPortal: base => ({
                              ...base,
                              zIndex: 224,
                            }),
                            container: base => ({
                              ...base,
                              minWidth: '20rem',
                            }),
                          }}  
                          onSelect={(e) => {
                            setClienteEscolhido(e.target.value);
                          }}
                          onChange={(value) => {
                            const valor = value === null ? "" : value.value;

                            setClienteEscolhido(valor);
                          }}
                        />

                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Vendedor</label>

                        <Async
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          loadOptions={
                            perfil !== 'vendedor'
                              ? debouncedLoadOptionSellers
                              : ''
                          }
                          cacheOptions
                          isClearable={perfil !== 'vendedor' ? true : false}
                          defaultValue={{
                            label: defaultSeller,
                            value: defaultSellerID,
                          }}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Vendedor"
                          onSelect={e => {
                            setVendedorEscolhido(e.target.value);
                          }}
                          onChange={valor => {
                            if (perfil !== 'vendedor') {
                              const value = valor === null ? '' : valor.value;
                              setVendedorEscolhido(value);
                            }
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Gerente</label>

                        <Async
                          loadOptions={
                            perfil !== 'vendedor'
                              ? debouncedLoadOptionsSupervisores
                              : ''
                          }
                          cacheOptions
                          isClearable={perfil !== 'vendedor' ? true : false}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Gerente"
                          onSelect={e => {
                            setGerenteEscolhido(e.target.value);
                          }}
                          onChange={valor => {
                            if (perfil != 'vendedor') {
                              const value = valor === null ? '' : valor.value;
                              setGerenteEscolhido(value);
                            }
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Status</label>

                        <Async
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          loadOptions={debouncedLoadOptionsStats}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Status"
                          onSelect={e => {
                            setStatusEscolhido(e.target.value);
                          }}
                          onChange={valor => {
                            const value = valor === null ? '' : valor.value;

                            setStatusEscolhido(value);
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Produto</label>

                        <Async
                          loadOptions={debouncedLoadOptionProducts}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Produto"
                          onSelect={e => {
                            setProdutoEscolhido(e.target.value);
                          }}
                          onChange={valor => {
                            const value = valor === null ? '' : valor.value;
                            setProdutoEscolhido(value);
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Classe</label>

                        <Async
                          loadOptions={debouncedLoadOptionClass}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Classe"
                          onSelect={e => {
                            setClasseEscolhida(e.target.value);
                          }}
                          onChange={valor => {
                            const value = valor === null ? '' : valor.value;
                            setClasseEscolhida(value);
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={2}>
                      <div className="input">
                        <label>Filtro de data</label>
                        <select name="filtro_data" ref={register}>
                          <option value="EMISSAO" selected>
                            EMISSÃO
                          </option>
                          <option value="PREVISAO">PREVISÃO</option>
                        </select>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={2}>
                      <div className="input">
                        <label>Data Inicial</label>
                        <input
                          type="date"
                          className="data"
                          name="dt_inicial"
                          ref={register}
                          required
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={2}>
                      <div className="input">
                        <label>Data Final</label>
                        <input
                          type="date"
                          className="data"
                          name="dt_final"
                          ref={register}
                          required
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={3}>
                      <div className="input">
                        <label>Agrupamento</label>
                        <select name="agrupamento" ref={register}>
                          <option value="EMISSAO" selected>
                            EMISSÃO
                          </option>
                          <option value="CLIENTE">CLIENTE</option>
                          <option value="VENDEDOR">VENDEDOR</option>
                          <option value="STATUS">STATUS</option>
                          <option value="PREVISAO">PREVISÃO</option>
                          <option value="MESTRE">MESTRE</option>
                          <option value="ITEM">ITEM</option>
                        </select>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={12}>
                      <ButtonStyled
                        variant="contained"
                        color="primary"
                        disabled={!loading ? false : true}
                        onClick={e => Pesquisaitem(getValues(), e)}
                      >
                        {loading && (
                          <i
                            className="fa fa-refresh fa-spin"
                            style={{ marginRight: '5px' }}
                          />
                        )}
                        {loading && <span>Gerando relatório...</span>}
                        {!loading && <span>Pesquisar</span>}{' '}
                      </ButtonStyled>
                    </Grid>
                  </Grid>
                </Form>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Pesquisa>
    </>
  );
}

export default connect()(VENDAANALITICO);
