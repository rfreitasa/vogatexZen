import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
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
    cursor: "pointer",
    display: "flex",
    marginLeft: "auto",
    marginBottom: "20px"
  }
}));

export default function ModalCreateFiles({ data }) {
console.log(data)
  // Token
  const token = sessionStorage.getItem('token');
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [mascara, setMascara] = React.useState("");
  const [typeInput, setTypeInput] = React.useState('text');
  const [selectedFile, setSelectedFile] = React.useState(null); // Estado para armazenar o arquivo selecionado

  // Função para lidar com a seleção de arquivo
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
  
   // onchangechild(false);
    setOpen(false);

  };

  // react-hooks-form
  const { register, handleSubmit } = useForm();


  // Submit
  const onSubmit = async dados => {
    try {
       const { descricao } = dados;
    
    const formData = new FormData();
    formData.append('descricao', descricao);
    formData.append('anexo', selectedFile);
    formData.append('token', token);


    await axios.post(
      `${API.clientes}/${data}/arquivos`,
      formData,
      {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data" // Importante definir o cabeçalho corretamente para envio de arquivo
        }
      }
    );

      toast.success("Arquivo criado");
       handleClose();
  
    } catch (err) {
      toast.error("Falha na criação, verifique seus dados");
    }
  };

  // Selects
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
                <input type="hidden" ref={register} name="id" />
             
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Descrição</label>

                    <InputMask mask={mascara}>
                      <input name="descricao" type={typeInput} ref={register} />
                    </InputMask>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Arquivo</label>
                    <input name="anexo" type="file" onChange={handleFileChange} />
                  </div>
                </Grid>
              
              </Grid>
              <ButtonStyled variant="contained" color="primary">
                Inserir
              </ButtonStyled>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalCreateFiles.propTypes = {
  data: PropTypes.object.isRequired,
  onchangechild: PropTypes.object.isRequired,

};
