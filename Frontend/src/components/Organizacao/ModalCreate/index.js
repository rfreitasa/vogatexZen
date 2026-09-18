import React, { useState, useEffect } from 'react';
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
import { toast } from "react-toastify";
import { API } from "../../../config/api";
import { moment } from "moment"; // Adicionado moment

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "80%",
    overflow: "scroll",
    maxHeight: "80%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
    marginRight: "15px",
  },
}));

export default function ModalCreateEmpresa() {
  // Token
  const usuario_id = sessionStorage.getItem('id');
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');

  const [listPriceChoose, setListPriceChoose] = useState('');
  const [listPrice, setListPrice] = useState([]);
  const [optionlist, setOptionList] = useState('');
  // Modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const getListPrice = async usuario => {
      try {
        const response = await axios.get(
          `${API.listaprecos}?email=${email}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        const lista = response.data.data.map(item => {
          return {
            value: item.LISTA_PRECOS_ID,
            label: `${item.LISTA_PRECOS_NOME} - ${item.LISTA_PRECOS_DESCRICAO}`,
            selected: item.LISTA_PRECOS_DEFAULT === 'sim',
          };
        });

        let hasSelected = false;

        const options = lista.map(item => {
          if (item.selected) {
            hasSelected = true;
            setListPriceChoose(item.value);
            return (
              <option key={item.value} value={item.value} selected>
                {item.label}
              </option>
            );
          } else {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          }
        });

        if (!hasSelected) {
          options.unshift(
            <option key="" value="">
              Selecione uma lista
            </option>
          );
        }

        setOptionList(options);

      } catch (err) {
        toast.error('Erro ao carregar lista de preços de venda.');
      }
    };

    getListPrice(usuario_id);

  }, [email, token, usuario_id]);
  // react-hooks-form
  const { register, handleSubmit } = useForm();
  // Submit
  const onSubmit = async (data) => {
    console.log(data);
    try {
      await axios.post(
        `${API.organizacao}`,
        {
          nome: data.nome,
          tipo: data.tipo,
          api: data.api,
          bd: data.bd,
          usuario: data.usuario,
          password: data.password,
          ativo: data.ativo,
          frete: data.frete,
          frete_redesp: data.frete_redesp,
          lista_ordem: data.lista_ordem,
          lista_default: listPriceChoose,
          user_smtp: data.user_smtp,
          passwd_smtp: data.passwd_smtp,
          dominio_smtp: data.dominio_smtp,
          exibe_obs:data.exibe_obs
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      toast.success("Organização criada com sucesso");
    //  window.location.reload();
    } catch (err) {
      toast.error("Verifique todos os campos");
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
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Nome</label>
                    <input name="nome" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Tipo</label>
                    <select name="tipo" ref={register}>
                      <option value={"API"}>Api</option>
                      <option value={"BD"}>BD</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Api</label>
                    <input name="api" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>BD</label>
                    <input name="bd" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Usuário</label>
                    <input name="usuario" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Password</label>
                    <input name="password" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Ativo</label>
                    <select name="ativo" ref={register}>
                      <option value={0}>Ativo</option>
                      <option value={1}>Inativo</option>
                    </select>
                  </div>
                </Grid>

                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Frete</label>
                    <select name="frete" ref={register}>
                      <option value='DESTINATARIO'>DESTINATARIO</option>
                      <option value='EMITENTE'>EMITENTE</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Frete Redespacho</label>
                    <select name="frete_redesp" ref={register}>
                      <option value='DESTINATARIO'>DESTINATARIO</option>
                      <option value='EMITENTE'>EMITENTE</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Ordenação das listas de preço</label>
                    <select name="lista_ordem" ref={register}>
                      <option value='CRESCENTE'>CRESCENTE</option>
                      <option value='DECRESCENTE'>DECRESCENTE</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Lista Default</label>
                    <select
                      id="lista"
                      name="lista_default"
                      placeholder="Lista de preço"
                      style={{
                        minWidth: '10rem',
                        height: 'calc(2em + 0.75rem + 2px)',
                        fontSize: '12px',
                        marginRight: '5px',
                      }}
                      value={listPriceChoose ? listPriceChoose : ''}
                      onChange={e => setListPriceChoose(e.target.value)}
                    >
                      {optionlist}
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Exibe Obs cliente na finalização do pedido</label>
                    <select name="exibe_obs" ref={register}>
                    <option value={0}>Sim</option>
                    <option value={1}>Não</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>User SMTP</label>
                    <input name="user_smtp" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Password SMTP</label>
                    <input name="passwd_smtp" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Servidor SMTP</label>
                    <input name="dominio_smtp" type="text"
                      ref={register} />
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
