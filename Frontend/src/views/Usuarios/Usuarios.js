import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

import { toast } from 'react-toastify';
import DataTable from 'components/Table/Table.js';

import ModalUsuarios from '../../components/Usuarios/ModalUsuarios';
import ModalCreateUser from '../../components/Usuarios/ModalCreate';
import Delete from '../../components/Delete';

import { API } from '../../config/api';

import Switch from 'react-switch';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '15px',
  },

  editButton: {
    border: 0,
    borderRadius: '20px',
    backgroundColor: '#00acc1',
    color: '#fff',
    padding: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function createData(
  USUARIO_ATIVO,
  USUARIO_NOME,
  USUARIO_EMAIL,
  USUARIO_PERFIL,
  SUPERVISOR_NOME,
  edit,
  dell,
) {
  return {
    USUARIO_ATIVO,
    USUARIO_NOME,
    USUARIO_EMAIL,
    USUARIO_PERFIL,
    SUPERVISOR_NOME,
    edit,
    dell,
  };
}

const rowHead = [
  {
    title: 'Ativo',
    field: 'USUARIO_ATIVO',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Nome',
    field: 'USUARIO_NOME',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Email',
    field: 'USUARIO_EMAIL',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Perfil',
    field: 'USUARIO_PERFIL',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Supervisor',
    field: 'SUPERVISOR_NOME',
    headerStyle: {
      textAlign: 'left',
    },
    cellStyle: {
      fontSize: '10px',
      textAlign: 'left',
      whiteSpace: 'nowrap',
    },
  },
  {
    field: 'edit',
  },
  {
    field: 'dell',
  },
];

export default function Usuarios() {
  const classes = useStyles();

  const token = sessionStorage.getItem('token');
  const perfil = sessionStorage.getItem('perfil');

  const [listUsuarios, setListUsuarios] = useState([]);
  const [load, setLoad] = useState(true);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoad(true);

      const response = await axios.get(
        `${API.usuarios}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const lista = response.data.data || [];

      setListUsuarios(lista);
    } catch (err) {
      toast.error('Erro ao carregar lista de usuários.');
    } finally {
      setLoad(false);
    }
  }, [token]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const listSup = useMemo(() => {
    return listUsuarios.filter(
      item => item.USUARIO_PERFIL === 'supervisor',
    );
  }, [listUsuarios]);

  const usuariosComSupervisor = useMemo(() => {
    const supervisorMap = new Map();

    listUsuarios.forEach(usuario => {
      supervisorMap.set(
        Number(usuario.USUARIO_ID),
        usuario.USUARIO_NOME,
      );
    });

    return listUsuarios.map(usuario => {
      const supervisorId =
        usuario.USUARIO_CONTA_SUPERVISOR_ID;

      return {
        ...usuario,

        SUPERVISOR_NOME: supervisorId
          ? supervisorMap.get(Number(supervisorId)) || ''
          : '',
      };
    });
  }, [listUsuarios]);

  const podeEditar = useCallback(
    usuario => {
      if (perfil === 'admin_global') {
        return true;
      }

      if (
        (perfil === 'operador' || perfil === 'ti') &&
        usuario.USUARIO_PERFIL !== 'admin_global'
      ) {
        return true;
      }

      return false;
    },
    [perfil],
  );

  const podeExcluir = useCallback(
    usuario => {
      if (perfil === 'admin_global') {
        return true;
      }

      if (
        perfil === 'ti' &&
        usuario.USUARIO_PERFIL !== 'admin_global'
      ) {
        return true;
      }

      return false;
    },
    [perfil],
  );

  const abrirEdicao = useCallback(usuario => {
    setUsuarioSelecionado(usuario);
    setModalEdicaoAberto(true);
  }, []);

  const fecharEdicao = useCallback(() => {
    setModalEdicaoAberto(false);
    setUsuarioSelecionado(null);
  }, []);

  const handleChangeStatus = useCallback(
    async data => {
      try {
        await axios.put(
          `${API.usuarios}/${data.USUARIO_ID}`,
          {
            USUARIO_PASSWORD: '',
            USUARIO_ATIVO:
              Number(data.USUARIO_ATIVO) === 0
                ? 1
                : 0,
          },
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        setListUsuarios(listaAnterior =>
          listaAnterior.map(usuario => {
            if (
              Number(usuario.USUARIO_ID) ===
              Number(data.USUARIO_ID)
            ) {
              return {
                ...usuario,
                USUARIO_ATIVO:
                  Number(usuario.USUARIO_ATIVO) === 0
                    ? 1
                    : 0,
              };
            }

            return usuario;
          }),
        );

        toast.success(
          'Atualização de status executada.',
        );
      } catch (err) {
        toast.error(
          'Erro ao atualizar usuário',
        );
      }
    },
    [token],
  );

  const rowsList = useMemo(() => {
    if (!usuariosComSupervisor.length) {
      return [];
    }

    return usuariosComSupervisor.map(item => {
      const {
        USUARIO_ATIVO,
        USUARIO_NOME,
        USUARIO_EMAIL,
        USUARIO_PERFIL,
        SUPERVISOR_NOME,
        USUARIO_ID,
      } = item;

      return createData(
        <Switch
          onChange={() =>
            handleChangeStatus(item)
          }
          checked={
            Number(USUARIO_ATIVO) === 0
          }
        />,

        (USUARIO_NOME || '').toUpperCase(),

        (USUARIO_EMAIL || '').toUpperCase(),

        (USUARIO_PERFIL || '').toUpperCase(),

        (SUPERVISOR_NOME || '').toUpperCase(),

        podeEditar(item) ? (
          <button
            type="button"
            className={classes.editButton}
            onClick={() =>
              abrirEdicao(item)
            }
          >
            <EditIcon />
          </button>
        ) : null,

        podeExcluir(item) ? (
          <Delete id={USUARIO_ID} />
        ) : null,
      );
    });
  }, [
    usuariosComSupervisor,
    handleChangeStatus,
    podeEditar,
    podeExcluir,
    abrirEdicao,
    classes.editButton,
  ]);

  return (
    <>
      <Paper className={classes.paper}>
        <ModalCreateUser
          Supervisores={listSup}
          onSaved={carregarUsuarios}
        />

        <DataTable
          load={load}
          rows={rowsList}
          rowHead={rowHead}
          title="Usuarios"
        />
      </Paper>

      {usuarioSelecionado ? (
        <ModalUsuarios
          key={usuarioSelecionado.USUARIO_ID}
          data={usuarioSelecionado}
          Supervisores={listSup}
          open={modalEdicaoAberto}
          onClose={fecharEdicao}
          onSaved={carregarUsuarios}
        />
      ) : null}
    </>
  );
}