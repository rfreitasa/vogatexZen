import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Form, ButtonStyled } from "./styles";
import Autocomplete from "react-autocomplete";
// import Box from "@material-ui/core/Box";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {API} from "../../config/api"

import {
  setInputsValues,
  pedidosList
} from "../../store/modules/filter/action";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function FilterBar() {
  const classes = useStyles();
  const token = useSelector(state => state.auth.token);

  const { register, getValues } = useForm();

  // AutoComplete
  const [auto, setAuto] = useState([]);
  let value = "";
  const [valueAutoId, setValueAutoId] = useState(value);
  const [valueAutoNome, setValueAutoNome] = useState(value);

  const email = useSelector(state => state.user.email);

  useEffect(() => {
    async function handleReq() {
      try {
        const response = await axios.get(
          `${API.vendedores}?email=${email}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );

        const list = response.data.data;
        setAuto(list);
      } catch (err) {
        toast.error("Erro ao listar vendedores");
      }
    }

    handleReq();
  }, []);

  const dispatch = useDispatch();

  const Pesquisa = (data, e) => {
    e.preventDefault();
    dispatch(setInputsValues(data));
    handleSearch();
  };

  const { inputs } = useSelector(state => state.filter);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${API.pedidos}/?email=${email}&emissao>=${inputs.dataini}<=${inputs.datafim}`,
        {
          headers: {
            "x-access-token": token
          }
        }
      );

      const list = response.data.data;
      dispatch(pedidosList(list[0]));
    } catch (err) {
      toast.error("Falha ao procurar, verifique todos os campos.");
    }
  };

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component={"span"} className={classes.heading}>
            Painel de pesquisa
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Typography component={"div"}>
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={2} sm={12} lg={2}>
                  <div className="input">
                    <label>Número</label>
                    <input type="number" name="numero" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={2} sm={12} lg={2}>
                  <div className="input">
                    <label>Status</label>
                    <select name="status" ref={register}>
                      <option value=""></option>
                      <option value="">Digitando</option>
                      <option value="">Orçamento</option>
                      <option value="">Reprovado</option>
                      <option value="">Aprovar comercial</option>
                      <option value="">Aprovado</option>
                      <option value="">Completo</option>
                      <option value="">Cancelado</option>
                      <option value="">Agrupado</option>
                      <option value="">Atendido parcialmente</option>
                    </select>
                  </div>
                </Grid>

                <Grid item xs={8} sm={12} lg={8}>
                  <div className="input">
                    <label>Vendedor Padrão</label>
                    <input
                      name="vendedorPadraoId"
                      type="hidden"
                      ref={register}
                      defaultValue={valueAutoId}
                    />
                    <input
                      name="vendedorPadraoNome"
                      type="hidden"
                      ref={register}
                    />
                    <Autocomplete
                      items={auto}
                      shouldItemRender={(item, value) =>
                        item.NOME.toLowerCase().indexOf(value.toLowerCase()) >
                        -1
                      }
                      getItemValue={item => {
                        setValueAutoId(item.NUMCAD1);
                        return item.NOME;
                      }}
                      renderItem={(item, isHighlighted) => (
                        <div
                          key={item.NUMCAD1}
                          inputVariant="outlined"
                          style={{
                            background: isHighlighted ? "lightgray" : "white",
                            width: "100%"
                          }}
                        >
                          <span
                            key={item.NUMCAD1}
                            style={{ fontWeight: isHighlighted ? 700 : 400 }}
                          >
                            {item.NOME}
                          </span>
                        </div>
                      )}
                      value={valueAutoNome}
                      onChange={e => setValueAutoNome(e.target.value)}
                      onSelect={val => setValueAutoNome(val)}
                    />
                  </div>
                </Grid>
                <Grid item xs={3} sm={12} lg={3}>
                  <div className="input">
                    <label>Data Inicial</label>
                    <input type="date" name="dataini" ref={register} />
                  </div>
                </Grid>

                <Grid item xs={3} sm={12} lg={3}>
                  <div className="input">
                    <label>Data Final</label>
                    <input type="date" name="datafim" ref={register} />
                  </div>
                </Grid>
              </Grid>
              <ButtonStyled
                variant="contained"
                color="primary"
                onClick={e => Pesquisa(getValues(), e)}
              >
                Pesquisar
              </ButtonStyled>
            </Form>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
