import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '../../components/Regras/DeleteListaPrecos';
import DataTable from 'components/Table/Table.js';
import ModalListaPrecos from '../../components/Regras/ModalListaPrecos';
import ModalCreateListasPrecos from '../../components/Regras/ModalCreateListaPrecos';
import { API } from '../../config/api';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '15px',
  },
}));

/* Regras
- [  ] exibe valor da lista na tela de produtos
- [  ] permite listar todos os produtos nessa lista(Especial)
- [  ] permite editar valor unitário
- [  ] permite valor inferior ao sugerido
- [  0,00 ] percentual de comissão  */

function createData(EDIT, DEL, LISTA_PRECOS_NOME, LISTA_PRECOS_DESCRICAO, LISTA_PRECOS_EXIBE_VALOR, LISTA_PRECOS_PERMITE_LISTAR_TODOS, LISTA_PRECOS_EDITA_VALOR_UNITARIO, LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO, LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,LISTA_PRECOS_MOEDA,) {
  return {
    EDIT,
    DEL,
    LISTA_PRECOS_NOME,
    LISTA_PRECOS_DESCRICAO,
    LISTA_PRECOS_EXIBE_VALOR,
    LISTA_PRECOS_PERMITE_LISTAR_TODOS,
    LISTA_PRECOS_EDITA_VALOR_UNITARIO,
    LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,
    LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,
    LISTA_PRECOS_MOEDA,
  };
}

const rowHead = [
  {
    field: 'EDIT',
    headerStyle: {
      width: 20,
      maxWidth: 20,
      textAlign: 'left',
    },
    cellStyle: {
      fontSize: '15px',
      textAlign: 'left',
      width: 20,
      maxWidth: 20

    },
  },
  {
    field: 'DEL',
    headerStyle: {
      width: 15,
      marginLeft: 2,
      maxWidth: 20,
      textAlign: 'center',
    },
    cellStyle: {
      fontSize: '15px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
      verticalAlign: 'middle',
      height: '100%',
      margin: '1px',
      padding: '1px',
    },
  },
  {
    title: 'Lista',
    field: 'LISTA_PRECOS_NOME',

    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Descrição',
    field: 'LISTA_PRECOS_DESCRICAO',
    cellStyle: {
      minWidth: '200px', // Adicione a largura desejada para a célula
    },
    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Exibe valor da lista na tela de produtos',
    field: 'LISTA_PRECOS_EXIBE_VALOR',
    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      minWidth: '180px', // Adicione a largura desejada para a célula

    },
  },
  {
    title: 'Permite listar produtos de todas as listas',
    field: 'LISTA_PRECOS_PERMITE_LISTAR_TODOS',
    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      minWidth: '220px', // Adicione a largura desejada para a célula

    },
  },
  {
    title: 'Permite editar valor unitário',
    field: 'LISTA_PRECOS_EDITA_VALOR_UNITARIO',
    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      minWidth: '180px', // Adicione a largura desejada para a célula

    },
  },
  {
    title: 'Valor permitido inferior ao unitário (%)',
    field: 'LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO',
    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      minWidth: '220px', // Adicione a largura desejada para a célula

    },
  },
  {
    title: 'Comissão (%)',
    field: 'LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT',
    headerStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      whiteSpace: 'nowrap',
    },
  }
];

export default function Precos() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const [listRegras, setlistRegras] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const req = async () => {
      try {
        const response = await axios.get(`${API.listaprecos}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const lista = response.data.data;
        setlistRegras(lista);
        setLoad(false);
      } catch (err) {
        toast.error('Você não tem permissão para visualizar essa tabela');
      }
    };

    req();
  }, []);

  const rowsList = listRegras
    ? listRegras.map(item => {
      const {
        LISTA_PRECOS_ID,
        LISTA_PRECOS_NOME,
        LISTA_PRECOS_DESCRICAO,
        LISTA_PRECOS_EXIBE_VALOR,
        LISTA_PRECOS_PERMITE_LISTAR_TODOS,
        LISTA_PRECOS_EDITA_VALOR_UNITARIO,
        LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,
        LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,
        LISTA_PRECOS_MOEDA,
    
      } = item;

      const row = createData(
        <ModalListaPrecos data={item} />,
        <Delete id={LISTA_PRECOS_ID} />,
        LISTA_PRECOS_NOME,
        LISTA_PRECOS_DESCRICAO,
        LISTA_PRECOS_EXIBE_VALOR,
        LISTA_PRECOS_PERMITE_LISTAR_TODOS,
        LISTA_PRECOS_EDITA_VALOR_UNITARIO,
        LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,
        LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT,
        LISTA_PRECOS_MOEDA,
      );

      return row;
    })
    : [{ error: 'Não encontrado' }];

  return (
    <>
      <Paper className={classes.paper}>
        <ModalCreateListasPrecos />
        <DataTable
          load={load}
          rows={rowsList}
          rowHead={rowHead}
          title={'Lista de preços'}
          options={{
            actionsColumnIndex: -1,
            headerStyle: {
              backgroundColor: '#f2f2f2',
            },
            cellStyle: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />
      </Paper>
    </>
  );
}
