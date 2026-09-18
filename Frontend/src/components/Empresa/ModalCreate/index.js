import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { Form, ButtonStyled } from "./styles";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import Autocomplete from "react-autocomplete";
import {API} from "../../../config/api"

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "80%",
    height: "80%",
    overflow: "scroll"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#00c156",
    color: "#fff",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    marginLeft: "auto",
    marginRight: "15px"
  }
}));

export default function ModalCreateEmpresa() {
  // Token
  const token = sessionStorage.getItem('token');
  // Modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // Auto
  const [autoList, setAutoList] = useState([]);
  const [nomeEmp, setNomeEmp] = useState("");
  const [numEmp, setNumEmp] = useState("");
  const [numOrgEmp, setOrgEmp] = useState("");

  useEffect(() => {
    if (nomeEmp.length >= 4) {
      list();
    }
  }, [nomeEmp]);

  const list = async () => {
    try {
      const response = await axios.get(
        `${API.empresa_erp}`,
        {
          headers: {
            "x-access-token": token
          }
        }
      );

      const listData = response.data.data;
      setAutoList(listData);
    } catch (err) {
      console.log(err);
    }
  };

  // react-hooks-form
  const { register, handleSubmit } = useForm();
  // Submit
  const onSubmit = async data => {
    try {
      await axios.post(
        `${API.empresa}`,
        {
          id_erp: numEmp,
          nome: nomeEmp,
          contrato_ini: data.contrato_ini,
          contrato_fim: data.contrato_fim,
          valor_mensal: data.valor_mensal,
          obs: data.obs,
          cep: data.cep,
          endereco: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          email: data.email,
          contato: data.contato,
          logo: null,
          organizacao_id: numOrgEmp,
          cnpj: data.cnpj,
          estado: data.estado,
          telefone: data.telefone,
          ativo: Boolean(data.ativo)
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      toast.success("Empresa criada com sucesso");
      window.location.reload();
    } catch (err) {
      toast.error("Verifique todos os campos");
    }
  };

  // Cep
  const [logradouroApi, setLogradouro] = useState("");
  const [cidadeApi, setCidade] = useState("");
  const [bairroApi, setBairro] = useState("");
  const [estadoApi, setEstado] = useState("");
  const [complementoApi, setComplemento] = useState("");
  // Cep
  const handleCep = async e => {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${e.target.value}/json`
      );
      const {
        logradouro: logradouroApi,
        bairro: bairroApi,
        uf: ufApi,
        localidade: localidadeApi,
        complemento: complementoApi
      } = response.data;

      setLogradouro(logradouroApi);
      setBairro(bairroApi);
      setEstado(ufApi);
      setCidade(localidadeApi);
      setComplemento(complementoApi);
    } catch (err) {
      toast.error("Cep inválido");
    }
  };

  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <AddCircleOutlineIcon />
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Nome</label>
                    {/* <input name="nome" type="text" ref={register} /> */}
                    <Autocomplete
                      renderInput={props => (
                        <input {...props} autoComplete={false} required />
                      )}
                      items={autoList}
                      shouldItemRender={(item, value) =>
                        item.APELIDO.toLowerCase().indexOf(
                          value.toLowerCase()
                        ) > -1
                      }
                      getItemValue={item => {
                        setNumEmp(item.NUMEMP1);
                        setOrgEmp(item.NUMV2$ORG1);
                        return item.APELIDO;
                      }}
                      menuStyle={{
                        borderRadius: "3px",
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                        background: "rgba(255, 255, 255, 0.9)",
                        padding: "2px 0",
                        fontSize: "90%",
                        position: "fixed",
                        overflow: "auto",
                        maxHeight: "50%",
                        zIndex: "400"
                      }}
                      renderItem={(item, isHighlighted) => (
                        <div
                          key={item.id}
                          style={{
                            background: isHighlighted ? "lightgray" : "white",
                            width: "100%"
                          }}
                        >
                          {item.APELIDO}
                        </div>
                      )}
                      value={nomeEmp}
                      onChange={e => setNomeEmp(e.target.value)}
                      onSelect={val => setNomeEmp(val)}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Email</label>
                    <input name="email" type="email" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Contrato Inicial</label>
                    <input name="contrato_ini" type="date" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Contrato Final</label>
                    <input name="contrato_fim" type="date" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Valor Mensal</label>
                    <input
                      name="valor_mensal"
                      min={0}
                      type="number"
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Cep</label>
                    <input
                      name="cep"
                      type="text"
                      onBlur={handleCep}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Logradouro</label>
                    <input
                      name="logradouro"
                      type="text"
                      value={logradouroApi}
                      onChange={e => setLogradouro(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Número</label>
                    <input name="numero" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Complemento</label>
                    <input
                      name="complemento"
                      type="text"
                      value={complementoApi ? complementoApi : ""}
                      onChange={e => setComplemento(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Bairro</label>
                    <input
                      name="bairro"
                      type="text"
                      value={bairroApi ? bairroApi : ""}
                      onChange={e => setBairro(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Cidade</label>
                    <input
                      name="cidade"
                      type="text"
                      value={cidadeApi ? cidadeApi : ""}
                      onChange={e => setCidade(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Estado</label>
                    <input
                      name="estado"
                      type="text"
                      value={estadoApi ? estadoApi : ""}
                      onChange={e => setEstado(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Contato</label>
                    <input name="contato" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Cnpj</label>
                    <InputMask mask="99.999.999/9999-99">
                      <input name="cnpj" type="text" ref={register} />
                    </InputMask>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Telefone </label>
                    <InputMask mask="(99) 9 9999-9999">
                      <input name="telefone" type="text" ref={register} />
                    </InputMask>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Ativa</label>
                    <select name="ativo" ref={register}>
                      <option value={true}>Sim</option>
                      <option value={false}>Não</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Obeservações</label>
                    <textarea name="obs" type="text" ref={register} />
                  </div>
                </Grid>
              </Grid>
              <ButtonStyled variant="contained" color="primary">
                Criar
              </ButtonStyled>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
