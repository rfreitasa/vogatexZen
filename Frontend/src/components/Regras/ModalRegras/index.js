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
import {API} from "../../../config/api"

import { Form, ButtonStyled } from "./styles";

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
    REGRAS_COMERCIAIS_ID,
    REGRAS_COMERCIAIS_TIPO,
    REGRAS_COMERCIAIS_NOME,
    REGRAS_COMERCIAIS_INFO
  } = data;

  const onSubmit = async data => {
    try {
      await axios.put(
        `${API.regras}/${REGRAS_COMERCIAIS_ID}`,
        {
          REGRAS_COMERCIAIS_NOME: data.nome,
          REGRAS_COMERCIAIS_INFO: data.info,
          REGRAS_COMERCIAIS_TIPO: data.tipo
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
                    <label>Nome</label>
                    <input
                      name="nome"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_COMERCIAIS_NOME}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Tipo</label>
                    <input
                      name="tipo"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_COMERCIAIS_TIPO}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Info</label>
                    <input
                      name="info"
                      type="text"
                      ref={register}
                      defaultValue={REGRAS_COMERCIAIS_INFO}
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

ModalRegras.propTypes = {
  data: PropTypes.object.isRequired
};
