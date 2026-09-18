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
import { toast } from "react-toastify";
import Autocomplete from "react-autocomplete";
import { API } from "../../../config/api"
import Select from 'react-select';
import debounce from 'debounce-promise';

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

export default function ModalCreateAtribuidas() {
  // Token

  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');


  // Modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [autoNome, setAutoNome] = useState("");
  const [autoNomeRegra, setAutoNomeRegra] = useState("");
  const [autoNomeListaPrecos, setAutoNomeListaPrecos] = useState("");

  const [idEmpresa, setIdEmpresa] = useState("");
  const [autoListEmpresa, setAutoListEmpresa] = useState([]);

  const [idRegraComercial, setIdRegraComercial] = useState("");
  const [autoListRegraComercial, setAutoListRegraComercial] = useState([]);

  const [idListaPrecos, setIdListaPrecos] = useState("");
  const [nomeListaPrecos, setNomeListaPrecos] = useState("");

  const [autoListPrecos, setAutoListPrecos] = useState([]);

  // Auto
  useEffect(() => {
    const listPrecos = async () => {
      try {
        const response = await axios.get(
          `${API.listaprecos}?email=${email}`,
  
          {
            headers: {
              "x-access-token": token
            }
          }
        );
  
        //const listData = response.data.data;
        // console.log(response)
        const data = response.data.data
          .map(item => {
            return { value: item.LISTA_PRECOS_ID, label: item.LISTA_PRECOS_NOME + '/' + item.LISTA_PRECOS_DESCRICAO };
          });
  
  
        
        setAutoListPrecos(data);
      } catch (err) {
        console.log(err);
      }
    };
  
    const listEmpresa = async () => {
      try {
        const response = await axios.get(
          `${API.empresa}`,

          {
            headers: {
              "x-access-token": token
            }
          }
        );

        const data = response.data.data
        .map(item => {
          return { value: item.EMPRESA_ID, label: item.EMPRESA_NOME };
        });

        setAutoListEmpresa(data);
      } catch (err) {
        console.log(err);
      }
    };

    const listRegraComercial = async () => {
      try {
        const response = await axios.get(
          `${API.regras}?email=${email}`,

          {
            headers: {
              "x-access-token": token
            }
          }
        );
        const data = response.data.data
        .map(item => {
          return { value: item.REGRAS_COMERCIAIS_ID, label: item.REGRAS_COMERCIAIS_INFO };
        });

        setAutoListRegraComercial(data);
      } catch (err) {
        console.log(err);
      }
    };


    listPrecos();
    listEmpresa();
    listRegraComercial();

  }, []);





  // react-hooks-form
  const { register, handleSubmit } = useForm();
  // Submit
  const onSubmit = async data => {
    try {
      await axios.post(
        `${API.regrasatribuidas}?email=${email}`,
        {
          REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID: idRegraComercial,
          REGRAS_ATRIBUIDAS_EMPRESA_ID: idEmpresa,
          REGRAS_ATRIBUIDAS_VALOR: data.valor,
          REGRAS_ATRIBUIDAS_LISTA_PRECOS: idListaPrecos
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      toast.success("Regra criada com sucesso");
      //window.location.reload();
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
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Empresa</label>
                    <Select
                    options={autoListEmpresa}
                    isClearable={true}
                    onChange={valor => {
                      setIdEmpresa(valor !== null ? valor.value : '');
                      
                    }}
                  />

                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>REGRA COMERCIAL</label>
                    <Select
                    options={autoListRegraComercial}
                    isClearable={true}
                    onChange={valor => {
                      setIdRegraComercial(valor !== null ? valor.value : '');
                      
                    }}
                  />
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={12}>
                  <label>LISTA DE PREÇO</label>
                  <Select
                    options={autoListPrecos}
                    loadOptions={autoListPrecos}
                    isClearable={true}
                    onChange={valor => {
                      setIdListaPrecos(valor !== null ? valor.value : '');
                      setNomeListaPrecos(valor !== null ? valor.label : '')
                    }}
                  />

                </Grid>




                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Valor</label>
                    <input name="valor" type="text" ref={register} />
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
