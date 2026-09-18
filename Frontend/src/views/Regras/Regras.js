import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import DataTable from 'components/Table/Table.js';
import ModalRegras from '../../components/Regras/ModalRegras';
import ModalRegrasAtribuidas from '../../components/Regras/ModalRegrasAtribuidas';
import ModalCreateRegras from '../../components/Regras/ModalCreate';
import ModalCreateAtribuidas from '../../components/Regras/ModalCreateAtribuidas';
import { API } from '../../config/api';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '2px',
  },
}));

function createData(
  REGRAS_COMERCIAIS_NOME,
  REGRAS_COMERCIAIS_INFO,
  REGRAS_COMERCIAIS_TIPO,
  edit,
) {
  return {
    REGRAS_COMERCIAIS_NOME,
    REGRAS_COMERCIAIS_INFO,
    REGRAS_COMERCIAIS_TIPO,
    edit,
  };
}

const rowHead = [
  {
    title: 'Nome',
    field: 'REGRAS_COMERCIAIS_NOME',
  },
  {
    title: 'Info',
    field: 'REGRAS_COMERCIAIS_INFO',
  },
  {
    title: 'Tipo',
    field: 'REGRAS_COMERCIAIS_TIPO',
  },
  {
    field: 'edit',
  },
];

function createDataAtribuidas(
  REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME,
  REGRAS_ATRIBUIDAS_EMPRESA_NOME,
  REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME,
  REGRAS_ATRIBUIDAS_VALOR,
  editAt,
) {
  return {
    REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME,
    REGRAS_ATRIBUIDAS_EMPRESA_NOME,
    REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME,
    REGRAS_ATRIBUIDAS_VALOR,
    editAt,
  };
}

const rowHeadAtribuidas = [
  {
    title: 'REGRA COMERCIAL',
    field: 'REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME',
  },
  {
    title: 'EMPRESA',
    field: 'REGRAS_ATRIBUIDAS_EMPRESA_NOME',
  },
  {
    title: 'LISTA DE PREÇO',
    field: 'REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME',
  },
  {
    title: 'VALOR',
    field: 'REGRAS_ATRIBUIDAS_VALOR',
  },
  {
    field: 'editAt',
  },
];
export default function Usuarios() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const [listRegras, setlistRegras] = useState([]);
  const [listRegrasAtribuidas, setlistRegrasAtribuidas] = useState([]);

  const [load, setLoad] = useState(true);

  useEffect(() => {
    const req = async () => {
      try {
        const response = await axios.get(`${API.regras}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });
//console.log(response)
        const lista = response.data.data;
        setlistRegras(lista);
        setLoad(false);
      } catch (err) {
        toast.error('Você não tem permissão para visualizar essa tabela');
      }
    };

    const reqAtribuidas = async () => {
      try {
        const response = await axios.get(
          `${API.regrasatribuidas}?email=${email}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        const lista = response.data.data;
        setlistRegrasAtribuidas(lista);
        //console.log(lista);
        setLoad(false);
      } catch (err) {
        toast.error('Você não tem permissão para visualizar essa tabela');
      }
    };

    req();
    reqAtribuidas();
  }, []);

  const rowsList = listRegras
    ? listRegras.map(item => {
        const {
          REGRAS_COMERCIAIS_NOME,
          REGRAS_COMERCIAIS_INFO,
          REGRAS_COMERCIAIS_TIPO,
        } = item;

        const row = createData(
          REGRAS_COMERCIAIS_NOME,
          REGRAS_COMERCIAIS_INFO,
          REGRAS_COMERCIAIS_TIPO,
          <ModalRegras data={item} />,
        );

        return row;
      })
    : [{ error: 'Não encontrado' }];

  const rowsListAtribuidas = listRegrasAtribuidas
    ? listRegrasAtribuidas.map(item => {
        const {
          REGRAS_ATRIBUIDAS_ID,
          REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME,
          REGRAS_ATRIBUIDAS_EMPRESA_NOME,
          REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME,
          REGRAS_ATRIBUIDAS_LISTA_PRECOS_ID,
          REGRAS_ATRIBUIDAS_LISTA_PRECOS_DESCRICAO,
          REGRAS_ATRIBUIDAS_VALOR,
        } = item;

        const rowAtribuidas = createDataAtribuidas(
          REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME,
          REGRAS_ATRIBUIDAS_EMPRESA_NOME,
          REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME + ' - ' + REGRAS_ATRIBUIDAS_LISTA_PRECOS_DESCRICAO,
          REGRAS_ATRIBUIDAS_VALOR,
          <ModalRegrasAtribuidas data={item} />,
        );

        return rowAtribuidas;
      })
    : [{ error: 'Não encontrado' }];

  return (
    <>
      {' '}
      <Tabs>
        <TabList>
          <Tab>Tipo de Regras</Tab>
          <Tab>Regras Atribuídas</Tab>
        </TabList>

        <TabPanel>
          <Paper className={classes.paper}>
            <ModalCreateRegras />
            <DataTable
              load={load}
              rows={rowsList}
              rowHead={rowHead}
              title={'Regras de Negócio'}
            />
          </Paper>
        </TabPanel>
        <TabPanel>
          <Paper className={classes.paper}>
            <ModalCreateAtribuidas />
            <DataTable
              load={load}
              rows={rowsListAtribuidas}
              rowHead={rowHeadAtribuidas}
              title={'Regras de Negócio Atribuídas'}
            />
          </Paper>
        </TabPanel>
      </Tabs>
    </>
  );
}
