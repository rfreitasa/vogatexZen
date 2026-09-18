import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import DataTable from 'components/Table/Table.js';
import ModalView from '../../components/Organizacao/ModalView';
import ModalCreateOrganizacao from '../../components/Organizacao/ModalCreate';
import { API } from '../../config/api';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '15px',
  },
}));

function createData(
  ORGANIZACAO_NOME,
  ORGANIZACAO_ATIVO,
  ORGANIZACAO_FRETE,
  ORGANIZACAO_FRETE_REDESP,
  ORGANIZACAO_LISTA_ORDEM,
  ORGANIZACAO_USER_SMTP,
  ORGANIZACAO_PASSWD_SMTP,
  ORGANIZACAO_DOMINIO_SMTP,
  view
) {
  return {
    ORGANIZACAO_NOME,
    ORGANIZACAO_ATIVO,
    ORGANIZACAO_FRETE,
    ORGANIZACAO_FRETE_REDESP,
    ORGANIZACAO_LISTA_ORDEM,
    ORGANIZACAO_USER_SMTP,
    ORGANIZACAO_PASSWD_SMTP,
    ORGANIZACAO_DOMINIO_SMTP,
    view,
  };
}

const rowHead = [
  {
    title: 'Nome',
    field: 'ORGANIZACAO_NOME',
  },
  {
    title: 'Ativa',
    field: 'ORGANIZACAO_ATIVO',
  },
  {
    title: 'Frete',
    field: 'ORGANIZACAO_FRETE',
  },
  {
    title: 'Frete Redespacho',
    field: 'ORGANIZACAO_FRETE_REDESP',
  },
  {
    title: 'Lista de Ordem',
    field: 'ORGANIZACAO_LISTA_ORDEM',
  },
  {
    title: 'User SMTP',
    field: 'ORGANIZACAO_USER_SMTP',
  },
  {
    title: 'Password SMTP',
    field: 'ORGANIZACAO_PASSWD_SMTP',
    hidden: true, // Oculta a coluna de senha
  },
  {
    title: 'Domínio SMTP',
    field: 'ORGANIZACAO_DOMINIO_SMTP',
  },
  {
    field: 'view',
  },
];

export default function Organizacao() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');

  const [listOrganizacao, setListOrganizacao] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const req = async () => {
      try {
        const response = await axios.get(`${API.organizacao}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const lista = response.data.data;
        setListOrganizacao(lista);
        setLoad(false);
      } catch (err) {
        if (err.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          toast.error('Erro ao carregar lista');
        }
      }
    };
    req();
  }, []);

  const rowsList = listOrganizacao
    ? listOrganizacao.map(item => {
        const {
          ORGANIZACAO_NOME,
          ORGANIZACAO_ATIVO,
          ORGANIZACAO_FRETE,
          ORGANIZACAO_FRETE_REDESP,
          ORGANIZACAO_LISTA_ORDEM,
          ORGANIZACAO_USER_SMTP,
          ORGANIZACAO_PASSWD_SMTP,
          ORGANIZACAO_DOMINIO_SMTP,
        } = item;

        const row = createData(
          ORGANIZACAO_NOME,
          ORGANIZACAO_ATIVO==1?'Sim':'Não',
          ORGANIZACAO_FRETE,
          ORGANIZACAO_FRETE_REDESP,
          ORGANIZACAO_LISTA_ORDEM,
          ORGANIZACAO_USER_SMTP,
          ORGANIZACAO_PASSWD_SMTP,
          ORGANIZACAO_DOMINIO_SMTP,
          <ModalView data={item} />
        );

        return row;
      })
    : [{ error: 'Não encontrado' }];

  return (
    <>
      <Paper className={classes.paper}>
        <ModalCreateOrganizacao />
        <DataTable
          load={load}
          rows={rowsList}
          rowHead={rowHead}
          title={'Organização'}
        />
      </Paper>
    </>
  );
}
