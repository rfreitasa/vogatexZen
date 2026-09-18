import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import DataTable from 'components/Table/Table.js';
import ModalView from '../../components/Empresa/ModalView';
import ModalCreateEmpresa from '../../components/Empresa/ModalCreate';
import { API } from '../../config/api';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '15px',
  },
}));

function createData(EMPRESA_NOME, EMPRESA_ENDERECO, EMPRESA_TELEFONE, PERFIL_VENDA, PERFIL_VENDA_PRG, PERFIL_FISCAL, PERFIL_FISCAL_PRG, view) {
  return { EMPRESA_NOME, EMPRESA_ENDERECO, EMPRESA_TELEFONE, PERFIL_VENDA, PERFIL_VENDA_PRG, PERFIL_FISCAL, PERFIL_FISCAL_PRG, view };
}

const rowHead = [
  {
    title: 'Nome',
    field: 'EMPRESA_NOME',
  },
  {
    title: 'Endereço',
    field: 'EMPRESA_ENDERECO',
  },
  {
    title: 'Contato',
    field: 'EMPRESA_TELEFONE',
  },
  {
    title: 'Perfil Venda',
    field: 'PERFIL_VENDA',
  },
  {
    title: 'Perfil Venda PRG',
    field: 'PERFIL_VENDA_PRG',
  },
  {
    title: 'Perfil Fiscal',
    field: 'PERFIL_FISCAL',
  },
  {
    title: 'Perfil Fiscal PRG',
    field: 'PERFIL_FISCAL_PRG',
  },
  {
    field: 'view',
  },
];

export default function Empresa() {
  const classes = useStyles();

  const token = sessionStorage.getItem('token');

  const [listEmpresas, setListEmpresas] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const req = async () => {
      try {
        const response = await axios.get(`${API.empresa}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const lista = response.data.data;
        setListEmpresas(lista);
        setLoad(false);
      } catch (err) {
        if (err.response && err.response.status === 402) {
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

  const rowsList = listEmpresas
    ? listEmpresas.map(item => {
      const { EMPRESA_NOME, 
        EMPRESA_ENDERECO, 
        EMPRESA_TELEFONE,
        EMPRESA_PERFIL_VENDA,
        EMPRESA_PERFIL_VENDA_PRG,
        EMPRESA_PERFIL_FISCAL,
        EMPRESA_PERFIL_FISCAL_PRG,
      EMPRESA_USER_SMTP,
      EMPRESA_PASSWD_SMTP,
      EMPRESA_DOMINIO_SMTP,
      } = item;

      const row = createData(
        EMPRESA_NOME,
        EMPRESA_ENDERECO,
        EMPRESA_TELEFONE,
        EMPRESA_PERFIL_VENDA,
        EMPRESA_PERFIL_VENDA_PRG,
        EMPRESA_PERFIL_FISCAL,
        EMPRESA_PERFIL_FISCAL_PRG,
        <ModalView data={item} />,
      );

      return row;
    })
    : [{ error: 'Não encontrado' }];

  return (
    <>
      <Paper className={classes.paper}>
        <ModalCreateEmpresa />
        <DataTable
          load={load}
          rows={rowsList}
          rowHead={rowHead}
          title={'Empresas'}
        />
      </Paper>
    </>
  );
}
