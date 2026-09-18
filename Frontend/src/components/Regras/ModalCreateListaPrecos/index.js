import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import Async from 'react-select/async';

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
import { API } from '../../../config/api';
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
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const [idList, setIdList] = useState('');
  const [idCurrency, setIdCurrency] = useState('');
  const [currency, setCurrency] = useState([]);
  const [auto, setAuto] = useState([]);
  const [autoCurrency, setAutoCurrency] = useState([]);


  // Modal
  const classes = useStyles();
  const [open, setOpen] = useState(false);
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
        const options = response.data.data.map(item => ({
          value: item.id,
          label: item.code,
        }));
        setCurrency(options);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrencyOptions();
  }, [email, token]);

  // react-hooks-form
  const { register, handleSubmit } = useForm();

  
  const listPriceList = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.priceListERP}?email=${email}&parametro=${inputValue}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      //const listData = response.data.data;
      const listData = response.data.data
        ? response.data.data.map(item => {
          return { value: item.id, label: item.description };
        })
        : '';
      setAuto(listData);
      return listData;
    } catch (err) {
      console.log(err);
    }
  };

  const loadOptions = (inputValue, callback) =>
    listPriceList(inputValue, callback);
  
  const debouncedLoadList = debounce(loadOptions, 3000, {
    leading: false,
  });

  // Submit
  const onSubmit = async data => {
    try {
      await axios.post(
        `${API.listaprecos}?email=${email}`,
        {
          nome: idList,
          descricao: auto,
          LISTA_PRECOS_EXIBE_VALOR: data.LISTA_PRECOS_EXIBE_VALOR,
          LISTA_PRECOS_PERMITE_LISTAR_TODOS: data.LISTA_PRECOS_PERMITE_LISTAR_TODOS,
          LISTA_PRECOS_EDITA_VALOR_UNITARIO: data.LISTA_PRECOS_EDITA_VALOR_UNITARIO,
          LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO: data.LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,
          LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT: data.LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,
          LISTA_PRECOS_MOEDA: idCurrency,

        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      toast.success("Lista de preço criada com sucesso");
      window.location.reload();
    } catch (err) {
      if (err && err.response && err.response.status === 403) {
        toast.error('Lista já existe');
      }
      else {
        console.log(err.response.status)
        toast.error('Erro ao inserir');
      }
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Lista de preços</label>
                    <Async
                      loadOptions={debouncedLoadList}
                      isClearable={true}
                      value={idList ? { label: auto, value: idList } : null}
                      onChange={value => {
                        if (value) {
                          const valor = value.value;
                          if (valor > 1) {
                            setIdList(value.value);
                            setAuto(value.label);
                          }
                        } else {
                          // Caso o usuário limpe a seleção
                          setIdList('');
                          setAuto('');
                        }
                      }}
                      getOptionLabel={option => option.label}
                      getOptionValue={option => option.value}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Descrição</label>
                    <input name="descricao" defaultValue={idList ? auto : ''} type="text" ref={register} />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Exibe Valor</label>
                    <select
                      name="LISTA_PRECOS_EXIBE_VALOR"
                      ref={register}
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
                        step="0.0001"
                      ref={register}
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
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <div className="input">
                    <label>Moeda</label>
                    <Select
                      menuPlacement="top"
                      options={currency}
                      isClearable={true}
                      value={idCurrency && Array.isArray(currency) ? currency.find(option => option.value === idCurrency) : null}
                      onChange={value => {
                        if (value) {
                          setIdCurrency(value.value);
                          setAutoCurrency(value.label);
                        } else {
                          // Caso o usuário limpe a seleção
                          setIdCurrency('');
                          setAutoCurrency('');
                        }
                      }}
                    />
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
