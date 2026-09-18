import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';

import { useForm } from 'react-hook-form';
import Autocomplete from 'react-autocomplete';
import Select from 'react-select';

import { API } from '../../../config/api';

import { Form, ButtonStyled } from './styles';

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
}));

export default function ModalUsuarios({
  data,
  Supervisores = [],
  open,
  onClose,
  onSaved,
}) {
  const token = sessionStorage.getItem('token');

  const perfil = sessionStorage.getItem('perfil');

  const email = sessionStorage.getItem('email');

  const classes = useStyles();

  const {
    USUARIO_ID,
    USUARIO_NOME,
    USUARIO_EMAIL,
    USUARIO_ATIVO,
    USUARIO_CONTA_ID_ERP,
    USUARIO_PERFIL,
  } = data;

  const { register, handleSubmit } = useForm();

  const [valueSupAutoId, setValueSupAutoId] = useState(
    data.USUARIO_CONTA_SUPERVISOR_ID || null,
  );

  const [valueSupAutoNome, setValueSupAutoNome] = useState(
    data.SUPERVISOR_NOME || '',
  );

  const [listOptions, setListOptions] = useState([]);

  const [listAttach, setListAttach] = useState([]);

  const [restricoesOptions, setRestricoesOptions] = useState([]);

  const [restricoesSelecionadas, setRestricoesSelecionadas] = useState([]);

  const [carregandoDados, setCarregandoDados] = useState(false);

  useEffect(() => {
    setValueSupAutoId(data.USUARIO_CONTA_SUPERVISOR_ID || null);

    setValueSupAutoNome(data.SUPERVISOR_NOME || '');
  }, [data.USUARIO_ID, data.USUARIO_CONTA_SUPERVISOR_ID, data.SUPERVISOR_NOME]);

  useEffect(() => {
    if (!open || !USUARIO_ID) {
      return;
    }

    const carregarDados = async () => {
      try {
        setCarregandoDados(true);

        const [listasResponse, restricoesResponse] = await Promise.all([
          axios.get(
            `${API.regras}/atribuidas?email=${email}&usuario=${USUARIO_ID}`,
            {
              headers: {
                'x-access-token': token,
              },
            },
          ),

          axios.get(
            `${API.usuarios}/restricoes/atribuidas?usuario=${USUARIO_ID}`,
            {
              headers: {
                'x-access-token': token,
              },
            },
          ),
        ]);

        const listasDados = listasResponse.data.data || [];

        const listas = listasDados.map(item => {
          return {
            value: item.LISTA_PRECOS_ID,

            label: `${item.LISTA_PRECOS_NOME} - ${item.LISTA_PRECOS_DESCRICAO}`,

            selected: item.SELECIONADO,
          };
        });

        setListOptions(listas);

        setListAttach(
          listas.filter(item => {
            return (
              item.selected === 'selected' ||
              item.selected === true ||
              item.selected === 1 ||
              item.selected === '1'
            );
          }),
        );

        const restricoesDados = restricoesResponse.data.data || [];

        const restricoes = restricoesDados.map(item => {
          return {
            value: item.RECURSO_ID,

            label: `${item.RECURSO_TIPO} - ${item.RECURSO_DESCRICAO}`,

            tipo: item.RECURSO_TIPO,

            codigo: item.RECURSO_CODIGO,

            descricao: item.RECURSO_DESCRICAO,

            selected: item.SELECIONADO,
          };
        });

        setRestricoesOptions(restricoes);

        setRestricoesSelecionadas(
          restricoes.filter(item => {
            return (
              item.selected === 'selected' ||
              item.selected === true ||
              item.selected === 1 ||
              item.selected === '1'
            );
          }),
        );
      } catch (err) {
        toast.error('Erro ao carregar dados do usuário.');
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarDados();
  }, [open, USUARIO_ID, email, token]);

  const onSubmit = async formData => {
    try {
      const restricoesIds = restricoesSelecionadas.map(item => item.value);

      await axios.put(
        `${API.usuarios}/${USUARIO_ID}`,
        {
          USUARIO_NOME: formData.nome,

          USUARIO_EMAIL: formData.email,

          USUARIO_PASSWORD: formData.senha,

          USUARIO_ATIVO: formData.ativo,

          USUARIO_CONTA_ID_ERP: formData.idErp,

          USUARIO_CONTA_SUPERVISOR_ID: valueSupAutoId,

          USUARIO_PERFIL: formData.perfil,

          LISTAS: listAttach,

          RESTRICOES: restricoesIds,
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      toast.success('Usuário atualizado com sucesso');

      onClose();

      if (onSaved) {
        await onSaved();
      }
    } catch (err) {
      toast.error(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Erro ao atualizar usuário',
      );
    }
  };

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <Form key={USUARIO_ID} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Nome</label>

                  <input
                    name="nome"
                    type="text"
                    ref={register}
                    defaultValue={USUARIO_NOME}
                    readOnly
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Email</label>

                  <input
                    name="email"
                    type="email"
                    ref={register}
                    defaultValue={USUARIO_EMAIL}
                  />
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

                  <select
                    name="ativo"
                    ref={register}
                    defaultValue={USUARIO_ATIVO}
                  >
                    <option value={1}>Inativo</option>

                    <option value={0}>Ativo</option>
                  </select>
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Número da Conta do ERP</label>

                  <input
                    name="idErp"
                    type="number"
                    ref={register}
                    defaultValue={USUARIO_CONTA_ID_ERP}
                    readOnly
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Perfil</label>

                  <select
                    name="perfil"
                    ref={register}
                    defaultValue={USUARIO_PERFIL}
                  >
                    <option value="funcionario">Funcionário</option>

                    <option value="vendedor">Vendedor</option>

                    <option value="operador">Operador</option>

                    <option value="supervisor">Supervisor</option>

                    <option value="assistente">Assistente Supervisor</option>

                    {perfil === 'admin_global' ? (
                      <option value="admin_global">Admin_global</option>
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
                    value={valueSupAutoNome}
                    onChange={e => {
                      const valor = e.target.value;

                      setValueSupAutoNome(valor);

                      if (valor.trim() === '') {
                        setValueSupAutoId(null);
                      }
                    }}
                    onSelect={(val, item) => {
                      setValueSupAutoNome(val);

                      setValueSupAutoId(item.USUARIO_ID);
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={12}>
                <div>
                  <label>Lista de preços habilitadas ao usuário</label>

                  <Select
                    name="listas"
                    placeholder="Selecione as listas"
                    value={listAttach}
                    options={listOptions}
                    onChange={value => {
                      setListAttach(value || []);
                    }}
                    isMulti
                    isClearable
                    isDisabled={carregandoDados}
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
                    placeholder={
                      carregandoDados
                        ? 'Carregando...'
                        : 'Selecione os menus ou relatórios bloqueados'
                    }
                    value={restricoesSelecionadas}
                    options={restricoesOptions}
                    onChange={value => {
                      setRestricoesSelecionadas(value || []);
                    }}
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    isDisabled={carregandoDados}
                  />
                </div>
              </Grid>
            </Grid>

            <ButtonStyled
              variant="contained"
              color="primary"
              type="submit"
              disabled={carregandoDados}
            >
              Atualizar
            </ButtonStyled>
          </Form>
        </div>
      </Fade>
    </Modal>
  );
}

ModalUsuarios.propTypes = {
  data: PropTypes.object.isRequired,

  Supervisores: PropTypes.array,

  open: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,

  onSaved: PropTypes.func,
};
