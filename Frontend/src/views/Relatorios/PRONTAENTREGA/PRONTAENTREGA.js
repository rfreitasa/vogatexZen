import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import axios from "axios";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Pesquisa, Form, ButtonStyled } from "../styles";
import { API } from "../../../config/api";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

function PRONTAENTREGA() {
  const classes = useStyles();
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const perfil = sessionStorage.getItem("perfil");
  const usuario_id = sessionStorage.getItem('id');


  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete

  const [classesReport, setClassesReport] = useState([]);
  const [nomeClassesReport, setNomeClassesReport] = useState("");
  const [idClassesReport, setIdClassesReport] = useState("");
  const [loading, setLloading] = useState(false);
  const [listEmpresas, setListEmpresas] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');
  const [listPrice, setListPrice] = useState([]);
  const [listPriceChoose, setListPriceChoose] = useState('');
  const [optionlist, setOptionList] = useState('');






  useEffect(() => {
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
        const lista = response.data.data.map(item => {
          return {
            value: item.LISTA_PRECOS_ID,
            label: item.LISTA_PRECOS_NOME + '-' + item.LISTA_PRECOS_DESCRICAO,
            selected: item.SELECIONADO,
          };
        });

        //   setListPrice(lista);
        const listitems = lista.filter(item => {
          return item.selected == 'selected';
        })

        setListPrice(listitems);
        setOptionList(listitems[0]
          ? listitems.map(item => {
            return <option value={item.value}>{item.label}</option>;

          })
          : ' <option value=""></option>'
        )

      } catch (err) {
        toast.error('Erro ao carregar lista de preços de venda.');
      }
    };

    loadCompany();
    getListPrice(usuario_id);

  }, []); // Chama a função na montagem inicial



  const Pesquisaitem = (data, e) => {
    e.preventDefault();
    handleSearch(data);
  };
  const verificaEAtualizaArray = (array) => {
    if (Array.isArray(array) && array.length > 0) {
      return array.map(item => item.value).join(',');
    } else {
      return null;
    }
  };

  const handleSearch = async (data) => {
    try {
      setLloading(true);
      var axios_search = "";

      var where = '';
      if (idEmpresas.length > 0) {

        const empresas_selecionadas = verificaEAtualizaArray(idEmpresas);

        where = where + `&empresas=${empresas_selecionadas}`;

      }
      if (listPriceChoose.length > 0) {


        where = where + `&lista=${listPriceChoose}`;

      }
      if (data.parametro != '') {
        where = where + `&nome=${data.parametro}`;
      }
      axios_search = `${API.relatorios}/?relatorio=PRONTAENTREGA&email=${email}${where}`;
      try {
        toast.success("Aguarde seu Relatório está sendo gerado.");
        const response = await axios.get(`${axios_search}`, {
          responseType: "blob",
          headers: {
            "x-access-token": token,
          },
        });
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setLloading(false);
        window.open(fileURL);
      } catch (err) {
        if (err.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar login");
          sessionStorage.clear();
        } else {
          toast.error("Não foi possível gerar seu Relatório");
        }
      }
    } catch (error) {
      setLloading(false);

      toast.error("Não localizado, verifique os campos de pesquisa.");
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
              <Typography component={"span"} className={classes.heading}>
                Painel de pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={"div"}>
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Parâmetro</label>
                        <input type="text" name="parametro" ref={register} />
                      </div>
                    </Grid>
                    <Grid key="empresas" item xs={12} sm={12} lg={12}>
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
                            control: base => ({
                              ...base,
                              fontSize: '12px',
                            }),
                            input: base => ({
                              ...base,
                              fontSize: '12px',
                            }),
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
                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Lista</label>

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
                          <option value="">Selecione uma opção</option> {/* Opção vazia */}

                          ${optionlist}

                        </select>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={12}>
                      <ButtonStyled
                        variant="contained"
                        color="primary"
                        onClick={(e) => Pesquisaitem(getValues(), e)}
                      >
                        {loading && (
                          <i
                            className="fa fa-refresh fa-spin"
                            style={{ marginRight: "5px" }}
                          />
                        )}
                        {loading && <span>Gerando relatório...</span>}
                        {!loading && <span>Pesquisar</span>}
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

export default connect()(PRONTAENTREGA);
