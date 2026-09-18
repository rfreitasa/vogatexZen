import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import history from "../../../services/history";
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
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "scroll"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 520
  },
  button: {    
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#00c156",
    color: "#fff",
    padding: "5px",
    cursor: "pointer"    
  }
}));

export default function EditContatos({ data ,onchangechild}) {
  // Token
  const token = sessionStorage.getItem('token');
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [mascara, setMascara] = React.useState("");
  const [typeInput, setTypeInput] = React.useState('text');

  const {tipo,descricao,id,complemento}=data;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
  
    onchangechild(false);
    setOpen(false);

  };

  // react-hooks-form
  const { register, handleSubmit } = useForm();

  const handleChange = e => {
    if (e.target.value === "EMAIL" ||e.target.value === "EMAIL_NFE") {
      setTypeInput('email');
    }
    else{ setTypeInput('text'); }
    
    if (e.target.value === "TELEFONE") {
              setMascara("(99)9999.9999");
      
    } else if (e.target.value === "CELULAR") {
              setMascara("(99)99999.9999");
      
    } else {
              setMascara("");
    }
  };
  // Submit
  const onSubmit = async dados => {
    try {
      
      const { tipo, descricao, complemento } = dados;
      await axios.put(
        `${API.clientes}/${data.id}/contatos`,
        {
          tipo,
          descricao,
          complemento,
          cliente_id: data.conta.id
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );

      toast.success("Contato alterado");
       handleClose();
    //  setOpen(false);
     // document.location.reload(true);

     // history.push("/admin/table");
    } catch (err) {
      toast.error("Falha na criação, verifique seus dados");
    }
  };

  // Selects
  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <EditIcon/>
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
                <input type="hidden" ref={register} name="id" />
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Tipo</label>
                    <select name="tipo" defaultValue={tipo} onChange={handleChange} ref={register}>
                      <option value="">ESCOLHA</option>
                      <option value="TELEFONE">TELEFONE</option>
                      <option value="CELULAR">CELULAR</option>
                      <option value="EMAIL">EMAIL</option>
                      <option value="EMAIL_NFE">EMAIL_NFE</option>
                      <option value="FAX">FAX</option>
                      <option value="MESSENGER">MESSENGER</option>
                      <option value="NEXTEL">NEXTEL</option>
                      <option value="PAGER">PAGER</option>
                      <option value="SKYPE">SKYPE</option>
                      <option value="WEB">WEB</option>
                    </select>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Descrição</label>

                    <InputMask defaultValue={descricao} mask={mascara}>
                      <input name="descricao"  type={typeInput} ref={register} />
                    </InputMask>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Complemento</label>
                    <input name="complemento" defaultValue={complemento} type="text" ref={register} />
                  </div>
                </Grid>
              </Grid>
              <ButtonStyled variant="contained" color="primary">
                Alterar
              </ButtonStyled>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

EditContatos.propTypes = {
  data: PropTypes.object.isRequired,
  onchangechild: PropTypes.object.isRequired,

};
