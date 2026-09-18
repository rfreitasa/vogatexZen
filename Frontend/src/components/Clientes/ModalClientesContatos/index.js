/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ContactsIcon from "@material-ui/icons/Contacts";
import Grid from "@material-ui/core/Grid";
import InputMask from "react-input-mask";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DataTable from "components/Table/Table.js";
import { toast } from "react-toastify";
import {API} from "../../../config/api"


import "react-tabs/style/react-tabs.css";

import { Form } from "./styles";

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
    maxHeight: "80%",
    overflow: "scroll"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220
  },
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#00acc1",
    color: "#fff",
    padding: "5px",
    cursor: "pointer"
  }
}));

export default function ModalClientes({ data }) {
  console.log(data);
  // Token
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  
  // Modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    requisicao();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const {
    id,
    ativa,
    bloqueada,
    tipo,
    nome,
    apelido,
    cnpj,
    inscricaoEstadual,
    inscricaoMunicipal,
    cpf,
    rg,
    enderecoLogradouro,
    enderecoNumero,
    enderecoComplemento,
    enderecoBairro,
    enderecoCidade,
    enderecoEstado,
    enderecoPais,
    enderecoCep,
    // enderecoLatitude,
    // enderecoLongitude,
    cliente,
    fornecedor,
    vendedor,
    transportadora,
    funcionario,
    // segmentoDescricao,
    // tags,
    observacoes,
    vendedorPadrao
  } = data;
  // react-hooks-form
  const { register } = useForm();

  // AutoComplete
  const [auto, setAuto] = useState();
  let value = vendedorPadrao === null ? "" : vendedorPadrao.nome;
  let valueId = vendedorPadrao === null ? "" : vendedorPadrao.id;
  const [valueAutoId, setValueAutoId] = useState(valueId);
  const [valueAutoNome, setValueAutoNome] = useState(value);
  const [contatos, setContatos] = useState([]);

  const requisicao = async () => {
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
      toast.error("Erro ao listar vendedores.");
    }
  };

  const handleReqContatos = async () => {
    try {
      const response = await axios.get(
        `${API.clientes}/${data.id}/contatos`,
        {
          headers: {
            "x-access-token": token
          }
        }
      );

      const contact = response.data.data;

      setContatos(contact);
    } catch (err) {
  
    }
  };

  const rowHead = [
    {
      title: "Tipo",
      field: "tipo"
    },
    {
      title: "Descrição",
      field: "descricao"
    },
    {
      title: "Complemento",
      field: "complemento"
    }
  ];

  const rowsList = contatos
    ? contatos.map(item => {
        const { tipo, descricao, complemento } = item;

        return { tipo, descricao, complemento };
      })
    : [{ error: "Não encontrado" }];

  const [logradouroApi, setLogradouro] = useState(enderecoLogradouro);
  const [cidadeApi, setCidade] = useState(enderecoCidade);
  const [bairroApi, setBairro] = useState(enderecoBairro);
  const [estadoApi, setEstado] = useState(enderecoEstado);
  const [complementoApi, setComplemento] = useState(enderecoComplemento);
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
      toast.error("Cep inválido.");
    }
  };

  // Selects
  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <ContactsIcon />
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
            <Tabs>
              <TabList>
                <Tab>Conta</Tab>
                <Tab>Endereço</Tab>
                <Tab onClick={() => handleReqContatos()}>Contatos</Tab>
              </TabList>

              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                   

                   
                <Grid item xs={4} sm={4} lg={4}>
                  <div className="divCheck">
                    <h6>Ativa</h6>
                    <input
                      type="checkbox"
                      name="ativa"
                      ref={register}
                      checked
                      value={true}
                      readyonly
                    />
                  </div>
                </Grid>
                <Grid item xs={4} sm={4} lg={4}>
                  <div className="divCheck">
                    <h6>Bloqueada</h6>
                    <input
                      type="checkbox"
                      name="bloqueada"
                      ref={register}
                      value={false}
                      disabled
                    />
                  </div>
                </Grid>
                <Grid item xs={4} sm={4} lg={4}>
                  <div className="divCheck">
                    <h6>Cliente</h6>
                    <input
                      type="checkbox"
                      name="cliente"
                      ref={register}
                      checked
                      value={true}
                      readyonly
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>ID</label>
                        <input
                          readOnly
                          name="id"
                          type="text"
                          ref={register}
                          defaultValue={id}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Tipo</label>
                        <select
                          disabled
                          name="tipo"
                          ref={register}
                          defaultValue={tipo}
                        >
                          <option value={"JURIDICA"}>JURIDICO</option>
                          <option value={"FISICA"}>FISICA</option>
                        </select>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Nome</label>
                        <input
                          readOnly
                          name="nome"
                          type="text"
                          ref={register}
                          defaultValue={nome}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Apelido</label>
                        <input
                          readOnly
                          name="apelido"
                          type="text"
                          ref={register}
                          defaultValue={apelido}
                        />
                      </div>
                    </Grid>

                    {tipo == "JURIDICA" ? (
                      <>
                        <Grid item xs={12} sm={6} lg={6}>
                          <div className="input">
                            <label>Cnpj</label>
                            <InputMask mask="99.999.999/9999-99">
                              <input
                                name="cnpj"
                                type="text"
                                ref={register}
                                defaultValue={cnpj}
                              />
                            </InputMask>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={6}>
                          <div className="input">
                            <label>Inscrição Estual</label>
                            <InputMask mask="999.999.999.999">
                              <input
                                name="inscricaoEstadual"
                                type="text"
                                placeholder="999.999.999.999"
                                ref={register}
                                defaultValue={inscricaoEstadual}
                              />
                            </InputMask>
                          </div>
                        </Grid>
                        
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} sm={6} lg={6}>
                          <div className="input">
                            <label>Cpf</label>
                            <InputMask mask="999.999.999-99">
                              <input
                                name="cpf"
                                type="text"
                                ref={register}
                                defaultValue={cpf}
                              />
                            </InputMask>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={6}>
                          <div className="input">
                            <label>RG</label>
                            <InputMask mask="99.999.999-99">
                              <input
                                name="rg"
                                type="text"
                                ref={register}
                                defaultValue={rg}
                              />
                            </InputMask>
                          </div>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Observações</label>
                        <textarea
                          readOnly
                          multiline="true"
                          name="observacoes"
                          type="text"
                          ref={register}
                          defaultValue={observacoes}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Vendedor</label>
                        <input
                          readOnly
                          name="vendedorPadraoNome"
                          type="text"
                          ref={register}
                          defaultValue={valueAutoNome}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>
              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Cep</label>
                        <input
                          name="enderecoCep"
                          type="text"
                          onBlur={handleCep}
                          ref={register}
                          defaultValue={enderecoCep}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Endereço</label>
                        <input
                          name="enderecoLogradouro"
                          type="text"
                          value={logradouroApi}
                          onChange={e => setLogradouro(e.target.value)}
                          ref={register}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Número</label>
                        <input
                          name="enderecoNumero"
                          type="text"
                          ref={register}
                          defaultValue={enderecoNumero}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Bairro</label>
                        <input
                          name="enderecoBairro"
                          type="text"
                          value={bairroApi ? bairroApi : ""}
                          onChange={e => setBairro(e.target.value)}
                          ref={register}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Cidade</label>
                        <input
                          name="enderecoCidade"
                          type="text"
                          value={cidadeApi ? cidadeApi : ""}
                          onChange={e => setCidade(e.target.value)}
                          ref={register}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Complemento</label>
                        <input
                          name="enderecoComplemento"
                          type="text"
                          value={complementoApi ? complementoApi : ""}
                          onChange={e => setComplemento(e.target.value)}
                          ref={register}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>Estado</label>
                        <input
                          name="enderecoEstado"
                          type="text"
                          value={estadoApi ? estadoApi : ""}
                          onChange={e => setEstado(e.target.value)}
                          ref={register}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                      <div className="input">
                        <label>País</label>
                        <input
                          name="enderecoPais"
                          type="text"
                          ref={register}
                          defaultValue={enderecoPais}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>
              <TabPanel>
                <DataTable
                  rows={rowsList}
                  rowHead={rowHead}
                  title={"Contatos"}
                />
              </TabPanel>
            </Tabs>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalClientes.propTypes = {
  data: PropTypes.object.isRequired
};
