import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { API } from "../../../config/api"
import { Form, ButtonStyled } from "./styles";
import debounce from 'debounce-promise';
import Select from 'react-select';


import Async from 'react-select/async';



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
    overflow: "scroll",
    maxHeight: "80%"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
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

export default function ModalRegras({ data }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const email = sessionStorage.getItem('email');
  const token = sessionStorage.getItem('token');
  const [idCurrency, setIdCurrency] = useState(data.LISTA_PRECOS_MOEDA ? data.LISTA_PRECOS_MOEDA : '');
  const [currency, setCurrency] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    // Carregar todas as opções de currency ao montar o componente
    const fetchCurrencyOptions = async () => {
      try {
        const response = await axios.get(
          `${API.getCurrency}?email=${email}`,
          {
            headers: {
              'x-access-token': token,
            },
          }
        );
        let hasSelected = false;
        const options = response.data.data.map(item => {
        
        
          if (idCurrency == item.id) {
            hasSelected = true;

            return (
              <option key={item.id} value={item.id} selected >
                {item.code}
              </option>
            )
   
          }
          else {
            return (
              <option key={item.id} value={item.id}  >
                {item.code}
              </option>
            )
          }
        });
       
        if (!hasSelected) {
          options.unshift(
            <option key="" value="">
              Selecione uma lista
            </option>
          );
        }
 
        setCurrency(options);








      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrencyOptions();
  }, [email, token]);




  // Form
  const {
    LISTA_PRECOS_ID,
    LISTA_PRECOS_DESCRICAO,
    LISTA_PRECOS_NOME,
    LISTA_PRECOS_EXIBE_VALOR,
    LISTA_PRECOS_PERMITE_LISTAR_TODOS,
    LISTA_PRECOS_EDITA_VALOR_UNITARIO,
    LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,
    LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,
    LISTA_PRECOS_MOEDA
  } = data;

  const onSubmit = async data => {
    try {
      await axios.put(
        `${API.listaprecos}/${LISTA_PRECOS_ID}`,
        {
          LISTA_PRECOS_DESCRICAO: data.LISTA_PRECOS_DESCRICAO,
          LISTA_PRECOS_NOME: data.LISTA_PRECOS_NOME,
          LISTA_PRECOS_EXIBE_VALOR: data.LISTA_PRECOS_EXIBE_VALOR,
          LISTA_PRECOS_PERMITE_LISTAR_TODOS: data.LISTA_PRECOS_PERMITE_LISTAR_TODOS,
          LISTA_PRECOS_EDITA_VALOR_UNITARIO: data.LISTA_PRECOS_EDITA_VALOR_UNITARIO,
          LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO: data.LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,
          LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT: data.LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,
          LISTA_PRECOS_MOEDA: idCurrency
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      window.location.reload();
    } catch (err) {
      toast.error("Não foi possível atualizar.");
    }
  };

  const { register, handleSubmit } = useForm();

  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <EditIcon />
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
                    <label>Lista</label>
                    <input
                      name="LISTA_PRECOS_NOME"
                      type="text"
                      ref={register}
                      defaultValue={LISTA_PRECOS_NOME}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Descrição</label>
                    <input
                      name="LISTA_PRECOS_DESCRICAO"
                      type="text"
                      ref={register}
                      defaultValue={LISTA_PRECOS_DESCRICAO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Exibe Valor</label>
                    <select
                      name="LISTA_PRECOS_EXIBE_VALOR"
                      ref={register}
                      defaultValue={LISTA_PRECOS_EXIBE_VALOR}
                    >
                      <option value="sim" selected>Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Permite Listar Todos</label>
                    <select
                      name="LISTA_PRECOS_PERMITE_LISTAR_TODOS"
                      ref={register}
                      defaultValue={LISTA_PRECOS_PERMITE_LISTAR_TODOS}
                    >
                      <option value="sim">Sim</option>
                      <option value="nao" selected>Não</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>

                  <div className="input">
                    <label>Edita Valor Unitário</label>
                    <select
                      name="LISTA_PRECOS_EDITA_VALOR_UNITARIO"
                      ref={register}
                      defaultValue={LISTA_PRECOS_EDITA_VALOR_UNITARIO}
                    >
                      <option value="sim" selected>Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>

                  <div className="input">
                    <label>Valor Permitido Inferior ao Unitário (%)</label>
                    <input
                      name="LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO"
                      type="number"
                      ref={register}
                      step="0.0001"
                      defaultValue={LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>

                  <div className="input">
                    <label>Percentual Comissão Default (%)</label>
                    <input
                      name="LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT"
                      type="number"
                      ref={register}
                      defaultValue={LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Moeda</label>
                    <select
                      id="lista"
                      name="LISTA_PRECOS_MOEDA"

                      style={{
                        minWidth: '10rem',
                        height: 'calc(2em + 0.75rem + 2px)',
                        fontSize: '12px',
                        marginRight: '5px',
                      }}
                      value={idCurrency ? idCurrency : ''}
                      onChange={e => setIdCurrency(e.target.value)}
                    >
                      {currency}
                    </select>
                  </div>
                </Grid>

              </Grid>
              <ButtonStyled variant="contained" color="primary">
                Atualizar
              </ButtonStyled>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalRegras.propTypes = {
  data: PropTypes.object.isRequired
};
