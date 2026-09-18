import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import { Form } from "./styles";
import Select from 'react-select';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API } from '../../../config/api';

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
    cursor: "pointer",
    display: "flex"
  }
}));

export default function ModalView({ data }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [listPriceChoose, setListPriceChoose] = useState('');
  const [listPrice, setListPrice] = useState([]);
  const [optionlist, setOptionList] = useState('');
  const [optionprodutolist, setOptionprodutoList] = useState('');


  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [formValues, setFormValues] = useState({
    ORGANIZACAO_ID: data.ORGANIZACAO_ID,
    ORGANIZACAO_NOME: data.ORGANIZACAO_NOME,
    ORGANIZACAO_FRETE: data.ORGANIZACAO_FRETE,
    ORGANIZACAO_FRETE_REDESP: data.ORGANIZACAO_FRETE_REDESP,
    ORGANIZACAO_LISTA_ORDEM: data.ORGANIZACAO_LISTA_ORDEM,
    ORGANIZACAO_LISTA_DEFAULT: '',
    ORGANIZACAO_USER_SMTP: data.ORGANIZACAO_USER_SMTP,
    ORGANIZACAO_PASSWD_SMTP: data.ORGANIZACAO_PASSWD_SMTP,
    ORGANIZACAO_DOMINIO_SMTP: data.ORGANIZACAO_DOMINIO_SMTP,
    ORGANIZACAO_EXIBE_OBS: data.ORGANIZACAO_EXIBE_OBS,
    ORGANIZACAO_PRODUTO_SESTOQUE: data.ORGANIZACAO_PRODUTO_SESTOQUE,
    ORGANIZACAO_VENDE_SESTOQUE: data.ORGANIZACAO_VENDE_SESTOQUE,

  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormValues({ ...formValues, [name]: selectedOption.value });
  };

  const handleSelectProdutoChange = (name, selectedprodutoOption) => {
    setFormValues({ ...formValues, [name]: selectedprodutoOption.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${API.organizacao}`,
        {
          ...formValues,
          ORGANIZACAO_LISTA_DEFAULT: listPriceChoose
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      toast.success('Organização atualizada com sucesso.');
      window.location.reload();
    } catch (err) {
      toast.error('Verifique todos os campos.');
    }
  };

  const usuario_id = sessionStorage.getItem('id');
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');

  const freteOptions = [
    { value: 'DESTINATARIO', label: 'Destinatário' },
    { value: 'EMITENTE', label: 'Emitente' }
  ];

  const ordemOptions = [
    { value: 'CRESCENTE', label: 'Crescente' },
    { value: 'DECRESCENTE', label: 'Decrescente' }
  ];
  const exibe_obsOptions = [
    { value: '0', label: 'Sim' },
    { value: '1', label: 'Não' }
  ];


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

  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <VisibilityIcon />
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
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item sm={12} lg={6} md={6}>
                  <div className="input">
                    <label>Nome</label>
                    <input
                      type="text"
                      readOnly
                      defaultValue={formValues.ORGANIZACAO_NOME}
                      name="ORGANIZACAO_NOME"
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Frete</label>
                    <Select
                      defaultValue={freteOptions.find(option => option.value === formValues.ORGANIZACAO_FRETE)}
                      options={freteOptions}
                      onChange={(selectedOption) => handleSelectChange('ORGANIZACAO_FRETE', selectedOption)}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Frete Redespacho</label>
                    <Select
                      defaultValue={freteOptions.find(option => option.value === formValues.ORGANIZACAO_FRETE_REDESP)}
                      options={freteOptions}
                      onChange={(selectedOption) => handleSelectChange('ORGANIZACAO_FRETE_REDESP', selectedOption)}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Ordenação das listas de preço</label>
                    <Select
                      defaultValue={ordemOptions.find(option => option.value === formValues.ORGANIZACAO_LISTA_ORDEM)}
                      options={ordemOptions}
                      onChange={(selectedOption) => handleSelectChange('ORGANIZACAO_LISTA_ORDEM', selectedOption)}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Lista Default</label>
                    <select
                      id="lista"
                      name="ORGANIZACAO_LISTA_DEFAULT"
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
                    <label>Exibe obs do cliente na finalização do pedido</label>
                    <Select
                      defaultValue={exibe_obsOptions.find(option => String(option.value) === String(formValues.ORGANIZACAO_EXIBE_OBS))}
                      options={exibe_obsOptions}
                      onChange={(selectedOption) => handleSelectChange('ORGANIZACAO_EXIBE_OBS', selectedOption)}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Exibir produtos sem estoque?</label>
                    <Select
                      defaultValue={exibe_obsOptions.find(option => String(option.value) === String(formValues.ORGANIZACAO_PRODUTO_SESTOQUE))}
                      options={exibe_obsOptions}
                      onChange={(selectedOption) => handleSelectChange('ORGANIZACAO_PRODUTO_SESTOQUE', selectedOption)}
                    />
                  </div>
                </Grid>

                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Permitir venda de produtos sem estoque?</label>
                    <Select
                      defaultValue={exibe_obsOptions.find(option => String(option.value) === String(formValues.ORGANIZACAO_VENDE_SESTOQUE))}
                      options={exibe_obsOptions}
                      onChange={(selectedOption) => handleSelectChange('ORGANIZACAO_VENDE_SESTOQUE', selectedOption)}
                    />
                  </div>
                </Grid>



                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Usuário SMTP</label>
                    <input
                      type="text"
                      name="ORGANIZACAO_USER_SMTP"
                      autoComplete="off"
                      defaultValue={formValues.ORGANIZACAO_USER_SMTP}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Senha SMTP</label>
                    <input
                      type="password"
                      name="ORGANIZACAO_PASSWD_SMTP"
                      autoComplete="off"
                      defaultValue={formValues.ORGANIZACAO_PASSWD_SMTP}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Servidor SMTP</label>
                    <input
                      type="text"
                      name="ORGANIZACAO_DOMINIO_SMTP"
                      defaultValue={formValues.ORGANIZACAO_DOMINIO_SMTP}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
              </Grid>
              <button type="submit" className={classes.button}>
                Enviar
              </button>
            </Form>
          </div>
        </Fade>
      </Modal>
      <ToastContainer />
    </div>
  );
}

ModalView.propTypes = {
  data: PropTypes.object.isRequired
};
