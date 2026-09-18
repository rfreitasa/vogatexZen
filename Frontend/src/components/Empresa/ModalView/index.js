import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { Form, ButtonStyled } from './styles';
import Async from 'react-select/async';
import debounce from 'debounce-promise';
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment';
import { API } from '../../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import { Label } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '80%',
    height: '80%',
    overflow: 'scroll',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    border: 0,
    borderRadius: '20px',
    backgroundColor: '#00acc1',
    color: '#fff',
    padding: '5px',
    cursor: 'pointer',
    display: 'flex',
  },
  paper2: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minWidth: '50%',
    minHeight: '50%',
  },
  progress: {
    marginTop: 200,

    textAlign: 'center',
    alignItems: 'center',
    width: '100%',
    '& > * + *': {},
  },
  root: {
    display: 'flex',
    minWidth: 320,
    maxWidth: 500,
    flexDirection: 'column', //change to row for horizontal layout
    '& .MuiCardHeader-root': {
      backgroundColor: 'yellow',
    },
    '& .MuiCardHeader-root': {
      backgroundColor: 'yellow',
    },
    '& .MuiCardHeader-title': {
      //could also be placed inside header class
      backgroundColor: '#FCFCFC',
    },
    '& .MuiCardHeader-subheader	': {
      backgroundImage: 'linear-gradient(to bottom right, #090977, #00d4ff);',
    },
    '& .MuiCardContent-root': {
      backgroundImage: 'linear-gradient(to bottom right, #00d4ff, #00ff1d);',
    },
  },
  header: {
    fontSize: '1.15rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 500,
    textAlign: 'center',
    color: 'black',
    lineHeight: 1.4,
  },
  content: {
    display: 'flex',
    minHeight: '100%',
    flexWrap: 'wrap',
  },
  contentItem: {
    flex: 'calc(50% - 4px)',
    '@media (max-width: 500px)': {},
  },
  textContent: {
    fontSize: 18,
    textAlign: 'center',
    border: '1px solid black',
  },
  footer: {
    fontSize: 14,
    backgroundImage: 'linear-gradient(to bottom right, #8c9d9b, #bdcdbf);',
  },
  card: {
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    boxShadow: '0 5px 8px 0 rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fafafa',
  },
}));

export default function ModalView({ data }) {
  // Modal
  const classes = useStyles();
  const [perfilVendas, setPerfilVendas] = useState('');
  const [perfilFiscal, setPerfilFiscal] = useState('');

  const [perfilVendasPRG, setPerfilVendasPRG] = useState('');
  const [perfilFiscalPRG, setPerfilFiscalPRG] = useState('');

  const [PerfilVendasOptions, setPerfilVendasOptions] = useState([]);
  const [PerfilVendasOptionsPRG, setPerfilVendasOptionsPRG] = useState([]);
  const [PerfilFiscalOptions, setPerfilFiscalOptions] = useState([]);

  const [optionVendaDefault, setOptionVendaDefault] = useState([]);
  const [optionVendaDefaultPRG, setOptionVendaDefaultPRG] = useState([]);
  const [optionFiscalDefault, setOptionFiscalDefault] = useState([]);
  const [optionFiscalDefaultPRG, setOptionFiscalDefaultPRG] = useState([]);
  const [userSMTP, setUserSMTP] = useState(
    data.EMPRESA_USER_SMTP ? data.EMPRESA_USER_SMTP : '',
  );
  const [passwdSMTP, setPasswdSMTP] = useState(
    data.EMPRESA_PASSWD_SMTP ? data.EMPRESA_PASSWD_SMTP : '',
  );
  const [dominioSMTP, setDominioSMTP] = useState(
    data.EMPRESA_DOMINIO_SMTP ? data.EMPRESA_DOMINIO_SMTP : '',
  );

  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const loadPerfilVendas = async () => {
      try {
        // var busca = encodeURIComponent(inputValue);
        // var where = `&parametro='*${busca}*'`;
        const response = await axios.get(`${API.perfilVendas}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });
        const datavsalesb = response.data
          ? response.data.data
              .filter(item => item.tags && item.tags.includes('salesbreath'))
              .map(item => {
                return {
                  value: item.id,
                  label: item.description.toUpperCase(),
                };
              })
          : '';
        const datav = response.data
          ? response.data.data.map(item => {
              return { value: item.id, label: item.description.toUpperCase() };
            })
          : '';
        setPerfilVendasOptions(datavsalesb);
        setPerfilVendasOptionsPRG(datav);

        if (datav[0]) {
          setPerfilVendas(
            datav[0]
              ? datav.filter(
                  option => option.value == data.EMPRESA_PERFIL_VENDA,
                )[0].value
              : '',
          );

          setPerfilVendasPRG(
            datav[0]
              ? datav.filter(
                  option => option.value == data.EMPRESA_PERFIL_VENDA_PRG,
                )[0].value
              : '',
          );
          //console.log(data.EMPRESA_PERFIL_VENDA)
          setOptionVendaDefault(
            datav[0]
              ? datav.filter(
                  option => option.value == data.EMPRESA_PERFIL_VENDA,
                )
              : '',
          );

          setOptionVendaDefaultPRG(
            datav[0]
              ? datav.filter(
                  option => option.value == data.EMPRESA_PERFIL_VENDA_PRG,
                )
              : '',
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    const loadPerfilFiscal = async () => {
      try {
        // var busca = encodeURIComponent(inputValue);
        // var where = `&parametro='*${busca}*'`;
        const response = await axios.get(`${API.perfilFiscal}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const datav = response.data
          ? response.data.data.map(item => {
              return { value: item.id, label: item.description.toUpperCase() };
            })
          : '';

        setPerfilFiscalOptions(datav);

        if (datav[0]) {
          setPerfilFiscal(
            datav[0]
              ? datav.filter(
                  option => option.value == data.EMPRESA_PERFIL_FISCAL,
                )[0].value
              : '',
          );
          setOptionFiscalDefault(
            datav[0]
              ? datav.filter(
                  option => option.value == data.EMPRESA_PERFIL_FISCAL,
                )
              : '',
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadPerfilFiscal();
    loadPerfilVendas();
  }, []);

  //  loadCarriers();
  //    setAutoCliente(JSON.parse(clientes));
  const {
    EMPRESA_ID,
    EMPRESA_NOME,
    EMPRESA_VALOR_MENSAL,
    EMPRESA_OBS,
    EMPRESA_CEP,
    EMPRESA_ENDERECO,
    EMPRESA_NUMERO,
    EMPRESA_COMPLEMENTO,
    EMPRESA_BAIRRO,
    EMPRESA_CIDADE,
    EMPRESA_EMAIL,
    EMPRESA_CONTATO,
    EMPRESA_CNPJ,
    EMPRESA_ESTADO,
    EMPRESA_TELEFONE,
    EMPRESA_ATIVO,
    EMPRESA_PERFIL_VENDA,
    EMPRESA_PERFIL_VENDA_PRG,
    EMPRESA_PERFIL_FISCAL,
    EMPRESA_USER_SMTP,
    EMPRESA_PASSWD_SMTP,
    EMPRESA_DOMINIO_SMTP,
    EMPRESA_CLUSTER,
  } = data;
  const onSubmit = async data => {
    try {
      console.log(data);
      await axios.put(
        `${API.empresa}/${EMPRESA_ID}`,
        {
          EMPRESA_PERFIL_VENDA: perfilVendas,
          EMPRESA_PERFIL_VENDA_PRG: perfilVendasPRG,
          EMPRESA_PERFIL_FISCAL: perfilFiscal,
          EMPRESA_USER_SMTP: userSMTP,
          EMPRESA_PASSWD_SMTP: passwdSMTP,
          EMPRESA_DOMINIO_SMTP: dominioSMTP,
          EMPRESA_CLUSTER: data.EMPRESA_CLUSTER,
          EMPRESA_ATIVO: data.EMPRESA_ATIVO,
          EMPRESA_NOME:data.EMPRESA_NOME
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      window.location.reload();
    } catch (err) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  // react-hooks-form
  const { register, handleSubmit } = useForm();
  // Data

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
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={1}>
                <Grid
                  className="index2"
                  item
                  sm={12}
                  lg={12}
                  md={12}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    borderBottom: '2px solid blue',
                    paddingBottom: '10px',
                    paddingTop: '0px',
                  }}
                >
                  <p>
                    <strong>Configurações</strong>
                  </p>
                </Grid>

                <br></br>
                <Grid
                  className="index2"
                  item
                  sm={4}
                  lg={4}
                  md={4}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <label>PERFIL DE VENDA DEFAULT</label>

                  <Select
                    options={PerfilVendasOptions ? PerfilVendasOptions : []}
                    isClearable={false}
                    defaultValue={optionVendaDefault ? optionVendaDefault : []}
                    styles={{
                      menuPortal: base => ({
                        ...base,
                        zIndex: 100,
                      }),

                      container: base => ({
                        ...base,
                        minWidth: '8rem',
                      }),
                    }}
                    onChange={value => {
                      const valor = value === null ? '' : value.value;
                      if (valor > 1) {
                        setPerfilVendas(value.value ? value.value : '');
                      } else {
                        setPerfilVendas('');
                      }
                    }}
                  />
                </Grid>

                <Grid
                  className="index2"
                  item
                  sm={4}
                  lg={4}
                  md={4}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <label>PERFIL DE VENDA PRG</label>

                  <Select
                    options={
                      PerfilVendasOptionsPRG ? PerfilVendasOptionsPRG : []
                    }
                    isClearable={false}
                    defaultValue={optionVendaDefaultPRG}
                    styles={{
                      menuPortal: base => ({
                        ...base,
                        zIndex: 100,
                      }),

                      container: base => ({
                        ...base,
                        minWidth: '8rem',
                      }),
                    }}
                    onChange={value => {
                      const valor = value === null ? '' : value.value;
                      if (valor > 1) {
                        setPerfilVendasPRG(value.value ? value.value : '');
                      } else {
                        setPerfilVendasPRG('');
                      }
                    }}
                  />
                </Grid>

                <Grid
                  className="index2"
                  item
                  sm={4}
                  lg={4}
                  md={4}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <label>PERFIL FISCAL DEFAULT</label>

                  <Select
                    options={PerfilFiscalOptions ? PerfilFiscalOptions : []}
                    isClearable={false}
                    defaultValue={
                      optionFiscalDefault ? optionFiscalDefault : []
                    }
                    styles={{
                      menuPortal: base => ({
                        ...base,
                        zIndex: 100,
                      }),

                      container: base => ({
                        ...base,
                        minWidth: '8rem',
                      }),
                    }}
                    onChange={value => {
                      const valor = value === null ? '' : value.value;
                      if (valor > 1) {
                        setPerfilFiscal(value.value ? value.value : '');
                      } else {
                        setPerfilFiscal('');
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>USER SMTP</label>
                    <input
                      name="user_smtp"
                      type="text"
                      value={userSMTP ? userSMTP : ''}
                      onChange={e => setUserSMTP(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>PASSWORD SMTP</label>
                    <input
                      name="passwd_smtp"
                      type="password"
                      value={passwdSMTP ? passwdSMTP : ''}
                      onChange={e => setPasswdSMTP(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>SERVIDOR SMTP</label>
                    <input
                      name="dominio_smtp"
                      type="text"
                      value={dominioSMTP ? dominioSMTP : ''}
                      onChange={e => setDominioSMTP(e.target.value)}
                      ref={register}
                    />
                  </div>
                </Grid>

                <ButtonStyled variant="contained" color="primary">
                  Atualizar
                </ButtonStyled>

                <Grid
                  className="index2"
                  item
                  sm={12}
                  lg={12}
                  md={12}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    borderBottom: '2px solid blue', // Ajuste na propriedade borderBottom
                    paddingBottom: '20px', // Ajuste para adicionar um espaçamento na parte inferior
                    paddingTop: '0px',
                  }}
                >
                  <p>
                    <strong>Dados da empresa</strong>
                  </p>
                </Grid>

                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Nome</label>
                    <input
                      type="texte"
                      name="EMPRESA_NOME"
                      ref={register}
                      defaultValue={EMPRESA_NOME}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>CLUSTER</label>
                    <input
                      type="texte"
                      id="cluster"
                      name="EMPRESA_CLUSTER"
                      ref={register}
                      defaultValue={EMPRESA_CLUSTER}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Email</label>
                    <input
                      readOnly
                      type="email"
                      ref={register}
                      defaultValue={EMPRESA_EMAIL}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Valor Mensal</label>
                    <input
                      type="number"
                      readOnly
                      defaultValue={EMPRESA_VALOR_MENSAL}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Observações</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_OBS}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Cep</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_CEP}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Endereço</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_ENDERECO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Número</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_NUMERO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Complemento</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_COMPLEMENTO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Bairro</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_BAIRRO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Cidade</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_CIDADE}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Estado</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_ESTADO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Contato</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_CONTATO}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Cnpj</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_CNPJ}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label>Telefone</label>
                    <input
                      readOnly
                      type="text"
                      ref={register}
                      defaultValue={EMPRESA_TELEFONE}
                    />
                  </div>
                </Grid>
                <Grid item xs={6} sm={12} lg={6}>
                  <div className="input">
                    <label htmlFor="ativo">Ativo</label>
                    <select
                      id="EMPRESA_ATIVO"
                      name="EMPRESA_ATIVO"
                      ref={register}
                      defaultValue={EMPRESA_ATIVO === 1 ? '1' : '0'}
                    >
                      <option value="0">Ativo</option>
                      <option value="1">Inativo</option>
                    </select>
                  </div>
                </Grid>
              </Grid>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalView.propTypes = {
  data: PropTypes.object.isRequired,
};
