import React from "react";
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
import { API } from "../../../config/api"


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
    backgroundColor: "#00c156",
    color: "#fff",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    marginLeft: "auto",
    marginRight: "15px"
  }
}));

export default function ModalCreateRegras() {
  // Token
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  // Modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // react-hooks-form
  const { register, handleSubmit } = useForm();
  // Submit
  const onSubmit = async data => {
    try {
      await axios.post(
        `${API.regras}?email=${email}`,
        {
          nome: data.nome,
          tipo: data.tipo,
          info: data.info
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      toast.success("Regra criada com sucesso");
      window.location.reload();
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
                    <input name="nome" type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Tipo</label>
                    <select
                      name="tipo"
                      ref={register}
                      defaultValue={"NUMBER"}
                    >
                      <option value="Number">Number</option>
                      <option value="String">String</option>
                    </select>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Info</label>
                    <input name="info" type="text" ref={register} />
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
