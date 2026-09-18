import React from "react";
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

import { Form, ButtonStyled } from "./styles";
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

export default function ModalRegrasAtribuidas({ data }) {
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

  // Form
  const {
    REGRAS_ATRIBUIDAS_ID,
    REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME,
    REGRAS_ATRIBUIDAS_EMPRESA_NOME,
    REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME,
    REGRAS_ATRIBUIDAS_VALOR
  } = data;
//console.log(data);
  const onSubmit = async data => {
    try {
      await axios.put(
        `${API.regrasatribuidas}/${REGRAS_ATRIBUIDAS_ID}`,
        {
          REGRAS_ATRIBUIDAS_VALOR: data.valor
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
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Regra Comercial</label>
                    <input
                      name="regra"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME}
                      readOnly
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Empresa</label>
                    <input
                      name="empresa"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_ATRIBUIDAS_EMPRESA_NOME}
                      readOnly
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Lista de preço</label>
                    <input
                      name="lista"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME}
                      readOnly
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Valor</label>
                    <input
                      name="valor"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_ATRIBUIDAS_VALOR}
                    />
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

ModalRegrasAtribuidas.propTypes = {
  data: PropTypes.object.isRequired
};
