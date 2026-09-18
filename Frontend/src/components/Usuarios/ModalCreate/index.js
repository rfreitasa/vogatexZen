import React, { useEffect, useMemo, useState } from 'react';

import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Grid from '@material-ui/core/Grid';

import { useForm } from 'react-hook-form';

import { Form, ButtonStyled } from './styles';

import { toast } from 'react-toastify';

import Autocomplete from 'react-autocomplete';

import { API } from '../../../config/api';

import Async from 'react-select/async';
import Select from 'react-select';

import debounce from 'debounce-promise';

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

    width: '80%',

    height: '80%',

    overflow: 'auto',

    maxHeight: '80%',
  },

  button: {
    border: 0,
    borderRadius: '20px',
    backgroundColor: '#00c156',
    color: '#fff',
    padding: '5px',
    cursor: 'pointer',
    display: 'flex',
    marginLeft: 'auto',
    marginRight: '15px',
  },
}));

export default function ModalCreate({ Supervisores = [], onSaved }) {
  const token = sessionStorage.getItem('token');

  const email = sessionStorage.getItem('email');

  const perfil = sessionStorage.getItem('perfil');

  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [autoNome, setAutoNome] = useState('');

  const [idErp, setIdErp] = useState('');

  const [autoNomeSupervisor, setAutoNomeSupervisor] = useState('');

  const [idSupervisor, setIdSupervisor] = useState(null);

  const [restricoesOptions, setRestricoesOptions] = useState([]);

  const [restricoesSelecionadas, setRestricoesSelecionadas] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  const listUsuarios = async inputValue => {
    try {
      if (!inputValue || inputValue.trim().length < 2) {
        return [];
      }

      const response = await axios.get(
        `${API.usuarios_erp}?email=${email}&user=${encodeURIComponent(
          inputValue,
        )}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const dados = response.data.data || [];

      return dados.map(item => {
        return {
          value: item.id,
          label: item.name.toUpperCase(),
        };
      });
    } catch (err) {
      return [];
    }
  };

  const debouncedLoadUsuarios = useMemo(() => debounce(listUsuarios, 800), [
    token,
    email,
  ]);

  const reqRestricoes = async () => {
    try {
      const response = await axios.get(`${API.usuarios}/restricoes/listar`, {
        headers: {
          'x-access-token': token,
        },
      });

      const dados = response.data.data || [];

      setRestricoesOptions(
        dados.map(item => {
          return {
            value: item.RECURSO_ID,

            label: `${item.RECURSO_TIPO} - ${item.RECURSO_DESCRICAO}`,

            tipo: item.RECURSO_TIPO,

            codigo: item.RECURSO_CODIGO,

            descricao: item.RECURSO_DESCRICAO,
          };
        }),
      );
    } catch (err) {
      toast.error('Erro ao carregar menus e relatórios.');
    }
  };

  useEffect(() => {
    if (open && restricoesOptions.length === 0) {
      reqRestricoes();
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setAutoNome('');
    setIdErp('');

    setAutoNomeSupervisor('');
    setIdSupervisor(null);

    setRestricoesSelecionadas([]);

    reset();
  };

  const onSubmit = async formData => {
    try {
      if (!idErp) {
        toast.error('Selecione um usuário do ERP.');

        return;
      }

      const restricoesIds = restricoesSelecionadas.map(item => item.value);

      await axios.post(
        `${API.usuarios}`,
        {
          nome: autoNome,

          email: formData.email,

          senha: formData.senha,

          ativo: formData.ativo,

          conta_id_erp: idErp,

          grupo_id: formData.grupo_id,

          empresa_id: formData.empresa_id,

          perfil: formData.perfil,

          conta_supervisor_id: idSupervisor,

          conta_gerente_id: idSupervisor,

          RESTRICOES: restricoesIds,
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      toast.success('Usuário criado com sucesso');

      handleClose();

      if (onSaved) {
        await onSaved();
      }
    } catch (error) {
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Erro ao inserir usuário',
      );
    }
  };

  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <AddCircleOutlineIcon />
      </button>

      <Modal
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input2">
                    <label>Nome</label>

                    <Async
                      cacheOptions
                      defaultOptions={false}
                      loadOptions={debouncedLoadUsuarios}
                      isClearable
                      placeholder="Digite o nome do usuário"
                      value={
                        autoNome
                          ? {
                              label: autoNome,
                              value: idErp,
                            }
                          : null
                      }
                      onChange={value => {
                        if (!value) {
                          setIdErp('');
                          setAutoNome('');
                          return;
                        }

                        setIdErp(value.value);

                        setAutoNome(value.label);
                      }}
                      noOptionsMessage={() => 'Nenhum usuário encontrado'}
                      loadingMessage={() => 'Buscando...'}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input">
                    <label>Email</label>

                    <input name="email" type="email" ref={register} />
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input">
                    <label>Senha</label>

                    <input name="senha" type="password" ref={register} />
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input">
                    <label>Ativo</label>

                    <select name="ativo" ref={register} defaultValue={0}>
                      <option value={0}>Ativo</option>

                      <option value={1}>Inativo</option>
                    </select>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input">
                    <label>Número da Conta ERP</label>

                    <input
                      readOnly
                      value={idErp}
                      name="idERP"
                      type="number"
                      ref={register}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input">
                    <label>Perfil</label>

                    <select
                      name="perfil"
                      ref={register}
                      defaultValue="funcionario"
                    >
                      <option value="vendedor">Vendedor</option>

                      <option value="operador">Operador</option>

                      <option value="funcionario">Funcionário</option>

                      <option value="assistente">Assistente Supervisor</option>

                      <option value="supervisor">Supervisor</option>

                      {perfil === 'admin_global' ? (
                        <option value="admin_global">Admin global</option>
                      ) : null}

                      {perfil === 'admin_global' || perfil === 'ti' ? (
                        <option value="ti">TI</option>
                      ) : null}
                    </select>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <div className="input" id="sup">
                    <label>Supervisor</label>

                    <Autocomplete
                      renderInput={props => (
                        <input {...props} autoComplete="off" />
                      )}
                      items={Supervisores || []}
                      shouldItemRender={(item, valorBusca) =>
                        item.USUARIO_NOME.toLowerCase().indexOf(
                          valorBusca.toLowerCase(),
                        ) > -1
                      }
                      getItemValue={item => item.USUARIO_NOME}
                      menuStyle={{
                        borderRadius: '3px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 0',
                        fontSize: '90%',
                        position: 'fixed',
                        overflow: 'auto',
                        maxHeight: '50%',
                        zIndex: '400',
                      }}
                      renderItem={(item, isHighlighted) => (
                        <div
                          key={item.USUARIO_ID}
                          style={{
                            background: isHighlighted ? 'lightgray' : 'white',
                            width: '100%',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          {item.USUARIO_NOME}
                        </div>
                      )}
                      value={autoNomeSupervisor}
                      onChange={e => {
                        const valor = e.target.value;

                        setAutoNomeSupervisor(valor);

                        if (valor.trim() === '') {
                          setIdSupervisor(null);
                        }
                      }}
                      onSelect={(val, item) => {
                        setAutoNomeSupervisor(val);

                        setIdSupervisor(item.USUARIO_ID);
                      }}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} lg={12}>
                  <div>
                    <label>
                      Menus e relatórios que o usuário NÃO pode acessar
                    </label>

                    <Select
                      name="restricoes"
                      placeholder="Selecione os menus ou relatórios bloqueados"
                      value={restricoesSelecionadas}
                      options={restricoesOptions}
                      onChange={value => {
                        setRestricoesSelecionadas(value || []);
                      }}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                      noOptionsMessage={() => 'Nenhum recurso encontrado'}
                    />
                  </div>
                </Grid>

                <input
                  type="hidden"
                  name="grupo_id"
                  value={1}
                  ref={register}
                  readOnly
                />

                <input
                  type="hidden"
                  name="empresa_id"
                  value={1}
                  ref={register}
                  readOnly
                />
              </Grid>

              <ButtonStyled variant="contained" color="primary" type="submit">
                Criar
              </ButtonStyled>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
