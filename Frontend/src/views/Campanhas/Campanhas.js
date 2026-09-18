import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import ModalCreateCampanha from '../../components/Campanhas/Create';
import { API } from '../../config/api';
import Delete from '../../components/Campanhas/Delete';
import ModalVisualiza from '../../components/Campanhas/Visualiza';
import ModalEdita from '../../components/Campanhas/Edita';

import DataTable from 'components/Table/Table.js';
import moment from 'moment';

import {
  TableContainer,
  TableHeader,
  GradientBackground,
  ActionButton,
  StatusBadge,
} from './styles';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
}));
const calcularStatus = (dataInicio, dataFim, statusManual) => {
  // Se houver status manual cancelado, priorizar
  if (statusManual && statusManual.toLowerCase() === 'cancelada') {
    return { status: 'Cancelado', bgColor: '#fee2e2', textColor: '#dc2626' };
  }

  // Verificar se temos datas válidas
  if (!dataInicio || !dataFim) {
    return {
      status: 'Datas indefinidas',
      bgColor: '#e5e7eb',
      textColor: '#4b5563',
    };
  }

  // Função para converter formato DD/MM/YYYY para Date object
  const converterParaData = dataString => {
    if (!dataString) return null;

    // Verificar se já está no formato Date (caso venha do backend assim)
    if (dataString instanceof Date) {
      return dataString;
    }

    // Converter formato DD/MM/YYYY para MM/DD/YYYY (que o Date entende)
    const partes = dataString.split('/');
    if (partes.length === 3) {
      // partes[0] = dia, partes[1] = mês, partes[2] = ano
      return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
    }

    // Tentar parse como formato ISO (YYYY-MM-DD) se o split não funcionou
    return new Date(dataString);
  };

  const dataAtual = new Date();
  const inicio = converterParaData(dataInicio);
  const fim = converterParaData(dataFim);

  // Verificar se as conversões foram bem sucedidas
  if (isNaN(inicio) || isNaN(fim)) {
    return {
      status: 'Datas inválidas',
      bgColor: '#e5e7eb',
      textColor: '#4b5563',
    };
  }

  // Ajustar para considerar apenas a data (ignorar horário)
  dataAtual.setHours(0, 0, 0, 0);
  inicio.setHours(0, 0, 0, 0);
  fim.setHours(0, 0, 0, 0);

  if (dataAtual < inicio) {
    return { status: 'Aguardando', bgColor: '#e0f2fe', textColor: '#0369a1' };
  } else if (dataAtual > fim) {
    return { status: 'Finalizado', bgColor: '#dcfce7', textColor: '#166534' };
  } else {
    return { status: 'Em andamento', bgColor: '#fef3c7', textColor: '#92400e' };
  }
};
const formatDecimal = numero => {
  if (numero === null || numero === undefined) {
    return '0,00';
  }

  // Converter para número se for string
  const num =
    typeof numero === 'string' ? parseFloat(numero.replace(',', '.')) : numero;

  // Verificar se é um número válido
  if (isNaN(num)) {
    return '0,00';
  }

  // Formatar para o padrão brasileiro
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

function createData(
  acoes,
  nome,
  dataInicio,
  dataFim,
  valorEsperado,
  status,
  pedidosBloqueados,
  limitePedido,
  local,
) {
  return {
    acoes,
    nome,
    dataInicio,
    dataFim,
    valorEsperado,
    status,
    pedidosBloqueados,
    limitePedido,
    local,
  };
}

const rowHead = [
  {
    field: 'acoes',
    title: '',
    headerStyle: {
      width: 60,
      textAlign: 'center',
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      padding: '0px 2px',
    },
    cellStyle: {
      textAlign: 'center',
      padding: '8px',
    },
  },
  {
    title: 'Nome da campanha',
    field: 'nome',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: 200,
      padding: '0px 8px',
    },
    cellStyle: {
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  },

  {
    title: 'Início',
    field: 'dataInicio',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0px 8px',
    },
    cellStyle: {
      whiteSpace: 'nowrap',
      padding: '12px 16px',
      fontSize: '14px',
    },
  },
  {
    title: 'Fim',
    field: 'dataFim',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0px 6px',
    },
    cellStyle: {
      whiteSpace: 'nowrap',
      padding: '12px 16px',
      fontSize: '14px',
    },
  },

  {
    title: 'Meta (R$)',
    field: 'valorEsperado',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0px 8px',
    },
    cellStyle: {
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'right',
    },
    render: rowData =>
      rowData.valorEsperado ? (
        <span style={{ color: '#059669', fontWeight: '600' }}>
          R$ {rowData.valorEsperado}
        </span>
      ) : (
        '-'
      ),
  },
  {
    title: 'Status',
    field: 'statusTexto', // Campo oculto para ordenação/pesquisa
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0px 8px',
    },
    cellStyle: {
      padding: '12px 16px',
      fontSize: '14px',
    },
    render: rowData => {
      const { status, bgColor, textColor } = calcularStatus(
        rowData.dataInicio,
        rowData.dataFim,
        rowData.status,
      );

      return (
        <StatusBadge bgColor={bgColor} textColor={textColor}>
          {status}
        </StatusBadge>
      );
    },
    // Configurações para tornar o campo ordenável e pesquisável
    customSort: (a, b) => {
      const statusA = calcularStatus(a.dataInicio, a.dataFim, a.status).status;
      const statusB = calcularStatus(b.dataInicio, b.dataFim, b.status).status;
      return statusA.localeCompare(statusB);
    },
    customFilterAndSearch: (term, rowData) => {
      const status = calcularStatus(
        rowData.dataInicio,
        rowData.dataFim,
        rowData.status,
      ).status;
      return status.toLowerCase().includes(term.toLowerCase());
    },
  },
  {
    title: 'Pedidos bloqueados',
    field: 'pedidosBloqueados',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: 200,
      padding: '0px 8px',
    },
    cellStyle: {
      padding: '12px 16px',
      fontSize: '14px',
      textAlign: 'center',
    },
    render: rowData => (
      <span
        style={{
          color: rowData.pedidosBloqueados === 'sim' ? '#dc2626' : '#059669',
          fontWeight: '600',
        }}
      >
        {rowData.pedidosBloqueados === 'sim' ? 'Sim' : 'Não'}
      </span>
    ),
  },
  {
    title: 'Limite por pedido (R$)',
    field: 'limitePedido',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0px 8px',
    },
    cellStyle: {
      padding: '12px 16px',
      fontSize: '14px',
      textAlign: 'right',
    },
    render: rowData =>
      rowData.limitePedido ? (
        <span style={{ color: '#2563eb', fontWeight: '500' }}>
          R$ {rowData.limitePedido}
        </span>
      ) : (
        '-'
      ),
  },
  {
    title: 'Local',
    field: 'local',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0px 8px',
    },
    cellStyle: {
      padding: '12px 16px',
      fontSize: '14px',
    },
  },
];

export default function Campanhas() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const [listCampanhas, setListCampanhas] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const req = async () => {
      try {
        const response = await axios.get(`${API.campanhas}?email=${email}`, {
          headers: { 'x-access-token': token },
        });

        const lista = response.data.data;
        setListCampanhas(lista);
        setLoad(false);
      } catch (err) {
        toast.error('Nenhuma campanha encontrada');
        setLoad(false);
      }
    };
    req();
  }, []);
  // Função para verificar se a campanha já terminou
  const isCampanhaFinalizada = dataFim => {
    if (!dataFim) return false;

    const hoje = new Date();
    const dataFimCampanha = new Date(dataFim);

    // Considerar apenas a data (ignorar horário)
    hoje.setHours(0, 0, 0, 0);
    dataFimCampanha.setHours(0, 0, 0, 0);

    return hoje > dataFimCampanha;
  };

  // Função para verificar se deve mostrar botões de edição
  const shouldShowEditButtons = (dataFim, status) => {
    // Se a campanha já terminou, não mostrar botões
    if (isCampanhaFinalizada(dataFim)) {
      return false;
    }

    // Se estiver cancelada, também não mostrar
    const isCancelada = status && status.toLowerCase() === 'Cancelada';
    return !isCancelada;
  };
  const rowsList = listCampanhas
    ? listCampanhas.map(item => {
        const {
          CAMPANHA_ID,
          CAMPANHA_NOME,
          CAMPANHA_INICIO,
          CAMPANHA_FIM,
          CAMPANHA_META,
          CAMPANHA_STATUS,
          CAMPANHA_PEDIDOS_BLOQUEADOS,
          CAMPANHA_LIMITE_PEDIDO,
          CAMPANHA_LOCAL,
          CAMPANHA_OBSERVACOES,
          CAMPANHA_USUARIO_ID,
        } = item;

        const showEditDelete = shouldShowEditButtons(
          CAMPANHA_FIM,
          CAMPANHA_STATUS,
        );
        const isFinalizada = isCampanhaFinalizada(CAMPANHA_FIM);
        const isCancelada =
          CAMPANHA_STATUS && CAMPANHA_STATUS.toLowerCase() === 'cancelado';

        return createData(
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'start',
              gap: '8px',
              minHeight: '40px',
            }}
          >
            {/* Botão de visualizar - sempre visível */}
            <ActionButton>
              <ModalVisualiza data={item} />
            </ActionButton>

            {/* Botões de editar e deletar - apenas se não estiver finalizada ou cancelada */}
            {showEditDelete && (
              <>
                <ActionButton>
                  <ModalEdita data={item} />
                </ActionButton>
                <ActionButton>
                  <Delete id={CAMPANHA_ID} />
                </ActionButton>
              </>
            )}

            
          </div>,
          CAMPANHA_NOME,
          moment(CAMPANHA_INICIO.slice(0, 10)).format('DD/MM/YYYY'),
          moment(CAMPANHA_FIM.slice(0, 10)).format('DD/MM/YYYY'),
          formatDecimal(CAMPANHA_META),
          CAMPANHA_STATUS,
          CAMPANHA_PEDIDOS_BLOQUEADOS,
          formatDecimal(CAMPANHA_LIMITE_PEDIDO),
          CAMPANHA_LOCAL,
        );
      })
    : [{ error: 'Não encontrado' }];

  return (
    <div style={{ padding: '20px' }}>
      <GradientBackground>
        <h2
          style={{
            margin: 0,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontWeight: '600',
          }}
        >
          <span className="material-icons" style={{ fontSize: '28px' }}>
            campaign
          </span>
          Campanhas
        </h2>
        <ModalCreateCampanha />
      </GradientBackground>

      <Paper className={classes.paper}>
        <DataTable
          rows={rowsList}
          rowHead={rowHead}
          sort={true}
          load={load}
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
    </div>
  );
}
