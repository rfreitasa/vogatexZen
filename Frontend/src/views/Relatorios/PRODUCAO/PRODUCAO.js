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

function PRODUCAO() {
  const classes = useStyles();
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const perfil = sessionStorage.getItem("perfil");

  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete

  const [classesReport, setClassesReport] = useState([]);
  const [nomeClassesReport, setNomeClassesReport] = useState("");
  const [idClassesReport, setIdClassesReport] = useState("");
  const [loading, setLloading] = useState(false);

  useEffect(() => {
    async function getClassesReport() {
      try {
        const response = await axios.get(
          `${API.classesReport}?email=${email}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        const data = response.data.data.map((item) => {
          return { value: item.CLASSE_ID, label: item.CLASSE };
        });
        // console.log(data);
        setClassesReport(data);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar login");
          sessionStorage.clear();
        } else {
          toast.error("Erro ao carregar ");
        }
      }
    }

    getClassesReport();
  }, []);

  const Pesquisaitem = (data, e) => {
    e.preventDefault();
    handleSearch(data);
  };

  const handleSearch = async (data) => {
    try {
      setLloading(true);
      var axios_search = "";

      console.log(data);

      var where = `&parametro=${data.parametro}&classe_id=${idClassesReport}&classe_nome=${nomeClassesReport}&saldo=${data.sem_saldo}`;

      axios_search = `${API.relatorios}/?relatorio=PRODUCAO&email=${email}${where}`;
      //console.log(axios_search);
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
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Parâmetro</label>
                        <input type="text" name="parametro" ref={register} />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Classe</label>

                        <Select
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          options={classesReport}
                          isClearable={false}
                          onSelect={(e) => {
                            setIdClassesReport(e.target.value);
                          }}
                          onChange={(value) => {
                            console.log(value);
                            setIdClassesReport(value.value);
                            setNomeClassesReport(value.label);
                          }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="labelcheck">
                        <label>Visualizar itens sem saldo</label>
                      </div>
                      <div className="inputcheck">
                        <input
                          type="checkbox"
                          textAlign="left"
                          name="sem_saldo"
                          ref={register}
                          defaultChecked={false}
                        />
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

export default connect()(PRODUCAO);
