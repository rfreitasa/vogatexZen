import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DatePicker, Space, Button, Radio, Popover } from 'antd';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DateRangeIcon from '@material-ui/icons/DateRange';

import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import BarChart from 'components/Charts/BarChart';

import { API } from '../../config/api';
import formatDecimal from '../../utils/formatDecimal';
import translate from 'components/Tradutor/tradutor';

import moment from 'moment';
import 'moment/locale/pt-br';

const { RangePicker } = DatePicker;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: '0 6px 30px',
    boxSizing: 'border-box',
  },

  header: {
    background: 'linear-gradient(135deg, #144bc1 0%, #040918 100%)',
    padding: '20px',
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '-1px',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
    color: '#ffffff',

    '@media (max-width: 800px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '12px',
    },
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  headerIcon: {
    fontSize: '28px',
    color: '#ffffff',
  },

  headerTitle: {
    margin: 0,
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.2,
  },

  headerPeriod: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: '12px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
  },

  content: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '0 0 16px 16px',
    minHeight: 'calc(100vh - 150px)',
  },

  searchCard: {
    margin: '0 0 24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  },

  searchBody: {
    padding: '14px 20px !important',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',

    '@media (max-width: 800px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },

  searchTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#2563eb',
    fontWeight: 600,
    fontSize: '15px',
  },

  searchControls: {
    display: 'flex',
    justifyContent: 'flex-end',

    '@media (max-width: 800px)': {
      justifyContent: 'flex-start',
    },
  },

  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '18px',
    marginBottom: '26px',

    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },

    '@media (max-width: 650px)': {
      gridTemplateColumns: '1fr',
    },
  },

  kpiCard: {
    position: 'relative',
    margin: 0,
    minHeight: '145px',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
    background: '#ffffff',
    transition: 'transform .2s ease, box-shadow .2s ease',

    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.10)',
    },
  },

  kpiBody: {
    padding: '20px !important',
    height: '100%',
    boxSizing: 'border-box',
  },

  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },

  kpiIcon: {
    width: '46px',
    height: '46px',
    minWidth: '46px',
    borderRadius: '11px',
    background: 'linear-gradient(135deg, #144bc1 0%, #183b8f 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 5px 12px rgba(37, 99, 235, 0.20)',

    '& svg': {
      fontSize: '24px',
    },
  },

  kpiLabel: {
    margin: '0 0 7px',
    color: '#64748b',
    fontSize: '13px',
    fontWeight: 500,
  },

  kpiValue: {
    margin: 0,
    color: '#172033',
    fontSize: '21px',
    lineHeight: 1.25,
    fontWeight: 700,
  },

  kpiFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '17px',
    paddingTop: '13px',
    borderTop: '1px solid #eef1f5',
    color: '#64748b',
    fontSize: '12px',
  },

  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '20px',

    '@media (max-width: 1100px)': {
      gridTemplateColumns: '1fr',
    },
  },

  chartCard: {
    margin: 0,
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 5px 18px rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
    background: '#ffffff',
  },

  chartHeader: {
    minHeight: '66px',
    padding: '14px 18px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    borderBottom: '1px solid #e5e7eb',
    background: 'linear-gradient(135deg, #144bc1 0%, #040918 100%)',
    color: '#ffffff',

    '@media (max-width: 600px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },

  chartTitleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  chartIcon: {
    width: '38px',
    height: '38px',
    minWidth: '38px',
    borderRadius: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.12)',
    color: '#ffffff',

    '& svg': {
      fontSize: '21px',
    },
  },

  chartTitle: {
    margin: 0,
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 600,
  },

  chartSubtitle: {
    margin: '4px 0 0',
    color: 'rgba(255,255,255,0.72)',
    fontSize: '12px',
  },

  chartButton: {
    '&.ant-btn-primary': {
      background: '#2563eb',
      borderColor: '#2563eb',
      borderRadius: '7px',
      boxShadow: 'none',
    },

    '&.ant-btn-primary:hover': {
      background: '#3b82f6',
      borderColor: '#3b82f6',
    },
  },

  chartBody: {
    minHeight: '390px',
    padding: '20px !important',
    background: '#ffffff',
  },

  chartLoading: {
    minHeight: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#64748b',
    fontSize: '13px',
  },

  kpiLoading: {
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
    color: '#2563eb',
    fontWeight: 600,
    fontSize: '18px',

    '&::after': {
      content: '""',
      flex: 1,
      height: '2px',
      background: 'linear-gradient(90deg, #2563eb 0%, transparent 100%)',
      marginLeft: '12px',
    },
  },

  filterPopover: {
    width: 250,
  },
}));

function createData(cliente, status, pedidos, valor) {
  return {
    cliente,
    status,
    pedidos,
    valor,
  };
}

const Dashboard = () => {
  const classes = useStyles();

  const email = sessionStorage.getItem('email');

  const id_user = sessionStorage.getItem('id');

  const [vendasAno, setVendasAno] = useState([]);

  const [annualRevenueData, setAnnualRevenueData] = useState([]);

  const [meta, setMeta] = useState('');

  const [metaAferida, setMetaAferida] = useState('');

  const [vendas, setVendas] = useState(0);

  const [vendasPessoal, setVendasPessoal] = useState(0);

  const [qtdVendas, setQtdVendas] = useState(0);

  const [qtdVendasPessoal, setQtdVendasPessoal] = useState(0);

  const [qtdVendasAberto, setQtdVendasAberto] = useState(0);

  const [vlVendasAberto, setVlVendasAberto] = useState(0);

  const [qtdVendasAbertoPeriodo, setQtdVendasAbertoPeriodo] = useState(0);

  const [vlVendasAbertoPeriodo, setVlVendasAbertoPeriodo] = useState(0);

  const [qtdpedidosEmitidos, setQtdPedidosEmitidos] = useState(0);

  const [vlpedidosEmitidos, setVlPedidosEmitidos] = useState(0);

  const [qtdpedidosFinalizados, setQtdPedidosFinalizados] = useState(0);

  const [vlpedidosFinalizados, setVlPedidosFinalizados] = useState(0);

  const [vendasStatusValor, setVendasStatusValor] = useState([]);

  const [vendasStatusQtd, setVendasStatusQtd] = useState([]);

  const [vendedoresStatus, setVendedoresStatus] = useState([]);

  const [clientesStatus, setClientesStatus] = useState([]);

  const [transportadorasStatus, setTransportadorasStatus] = useState([]);

  const [estadoCidadesMap, setEstadoCidadesMap] = useState([]);

  const [companyData, setCompanyData] = useState([]);

  const [loadingResumo, setLoadingResumo] = useState(true);

  const [startDate, setStartDate] = useState(moment().startOf('month'));

  const [endDate, setEndDate] = useState(moment().endOf('month'));

  const [chartFilters, setChartFilters] = useState({
    annual: {
      mode: 'single',
      period: null,
      open: false,
      loading: true,
    },

    monthly: {
      mode: 'single',
      period: null,
      open: false,
      loading: true,
    },
  });

  const axiosInstance = axios.create({
    baseURL: API.dashboard,

    headers: {
      'Content-Type': 'application/json',

      'x-access-token': sessionStorage.getItem('token'),
    },
  });

  const updateChartFilter = (chart, key, value) => {
    setChartFilters(prev => ({
      ...prev,

      [chart]: {
        ...prev[chart],
        [key]: value,
      },
    }));
  };

  const getSubtitle = chart => {
    const { period, mode } = chartFilters[chart];

    if (mode === 'single') {
      const year = period && !period[0] ? Number(period.format('YYYY')) : null;

      if (!year) {
        return '';
      }

      return `Período: ${year}`;
    }

    if (mode === 'range' && period && period.length === 2) {
      const startYear = period[0] ? Number(period[0].format('YYYY')) : null;

      const endYear = period[1] ? Number(period[1].format('YYYY')) : null;

      if (!startYear || !endYear) {
        return '';
      }

      return `Período: ${startYear} - ${endYear}`;
    }

    return '';
  };

  const fetchChartData = async (chart, startYear, endYear) => {
    let payload;

    updateChartFilter(chart, 'loading', true);

    try {
      if (startYear && endYear) {
        payload = {
          dateStart: moment()
            .year(startYear)
            .startOf('year')
            .format('YYYY-MM-DD'),

          dateEnd: moment()
            .year(endYear)
            .endOf('year')
            .format('YYYY-MM-DD'),
        };
      } else {
        const { period, mode } = chartFilters[chart];

        if (!period) {
          updateChartFilter(chart, 'loading', false);

          return;
        }

        if (mode === 'single') {
          const year = Number(period.format('YYYY'));

          payload = {
            dateStart: moment()
              .year(year)
              .startOf('year')
              .format('YYYY-MM-DD'),

            dateEnd: moment()
              .year(year)
              .endOf('year')
              .format('YYYY-MM-DD'),
          };
        }

        if (mode === 'range' && period.length === 2) {
          const yearStart = Number(period[0].format('YYYY'));

          const yearEnd = Number(period[1].format('YYYY'));

          payload = {
            dateStart: moment()
              .year(yearStart)
              .startOf('year')
              .format('YYYY-MM-DD'),

            dateEnd: moment()
              .year(yearEnd)
              .endOf('year')
              .format('YYYY-MM-DD'),
          };
        }
      }

      const faturamento = await axiosInstance.get(
        `/vlvendasmes?email=${email}&DATE_START=${payload.dateStart}&DATE_END=${
          payload.dateEnd
        }&SHOW_${chart === 'annual' ? 'YEAR' : 'MONTH'}=true`,
      );

      const sumByMonthYear = {};

      const sumByYear = {};

      const dados = faturamento?.data?.data || [];

      dados.forEach(item => {
        const monthYearKey = `${String(item.invoice_month).padStart(2, '0')}/${
          item.invoice_year
        }`;

        if (!sumByMonthYear[monthYearKey]) {
          sumByMonthYear[monthYearKey] = 0;
        }

        sumByMonthYear[monthYearKey] += Number(item.sum_totalValue) || 0;

        if (!sumByYear[item.invoice_year]) {
          sumByYear[item.invoice_year] = 0;
        }

        sumByYear[item.invoice_year] += Number(item.sum_totalValue) || 0;
      });

      if (chart === 'annual') {
        setAnnualRevenueData(
          Object.entries(sumByYear).map(([key, value]) => ({
            label: key,

            value: value,
          })),
        );
      }

      if (chart === 'monthly') {
        setVendasAno(
          Object.entries(sumByMonthYear).map(([key, value]) => ({
            label: key,

            value: value,
          })),
        );
      }
    } catch (error) {
      toast.error('Não foi possível carregar os dados do gráfico.');
    } finally {
      updateChartFilter(chart, 'loading', false);

      updateChartFilter(chart, 'open', false);
    }
  };

  const renderDatePicker = chart => (
    <div className={classes.filterPopover}>
      {chart !== 'monthly' && (
        <Radio.Group
          value={chartFilters[chart].mode}
          onChange={e => updateChartFilter(chart, 'mode', e.target.value)}
          style={{
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Radio.Button value="single">Ano Único</Radio.Button>

          <Radio.Button value="range">Intervalo</Radio.Button>
        </Radio.Group>
      )}

      {chartFilters[chart].mode === 'single' && (
        <DatePicker
          picker="year"
          onChange={date => updateChartFilter(chart, 'period', date)}
          style={{
            width: '100%',
          }}
        />
      )}

      {chart !== 'monthly' && chartFilters[chart].mode === 'range' && (
        <RangePicker
          picker="year"
          onChange={dates => updateChartFilter(chart, 'period', dates)}
          style={{
            width: '100%',
          }}
        />
      )}

      <Space
        style={{
          width: '100%',
          marginTop: 10,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          type="primary"
          loading={chartFilters[chart].loading}
          onClick={() => fetchChartData(chart)}
        >
          Aplicar Filtro
        </Button>
      </Space>
    </div>
  );

  const transformDataForTable = vendedorGroups => {
    const tableData = [];

    if (vendedorGroups && Object.keys(vendedorGroups).length > 0) {
      Object.keys(vendedorGroups).forEach(vendedor => {
        const statusData = vendedorGroups[vendedor];

        Object.keys(statusData).forEach(status => {
          const { valor, pedidos } = statusData[status];

          tableData.push({
            cliente: vendedor,

            status: status,

            valor: valor,

            pedidos: pedidos,
          });
        });
      });

      return tableData;
    }

    return [];
  };

  useEffect(() => {
    moment.locale('pt-br');

    const initialStart = moment().startOf('month');

    const initialEnd = moment().endOf('month');

    setStartDate(initialStart);

    setEndDate(initialEnd);

    const currentYear = moment().year();

    const threeYearsAgo = moment()
      .subtract(3, 'years')
      .year();

    fetchData(
      initialStart.format('YYYY-MM-DD'),

      initialEnd.format('YYYY-MM-DD'),
    );

    fetchChartData('annual', threeYearsAgo, currentYear);

    fetchChartData('monthly', currentYear, currentYear);
  }, []);

  async function fetchData(dateStart, dateEnd) {
    setLoadingResumo(true);

    try {
      const [
        pedidosResult,
        disponivelResult,
        abertoResult,
        vendasResult,
      ] = await Promise.allSettled([
        axiosInstance.get(
          `/qtdvendasmes?email=${email}&DATE_START=${dateStart}&DATE_END=${dateEnd}&SHOW_YEAR=true`,
        ),

        axiosInstance.get(
          `/qtdvendasmes?email=${email}&AVAILABILITY_DATE_START=${dateStart}&AVAILABILITY_DATE_END=${dateEnd}&SHOW_YEAR=true`,
        ),

        axiosInstance.get(`/qtdvendasmes?email=${email}&SHOW_YEAR=true`),

        axiosInstance.get(
          `/vlvendasmes?email=${email}&DATE_START=${dateStart}&DATE_END=${dateEnd}&SHOW_YEAR=true`,
        ),
      ]);

      const pedidos =
        pedidosResult.status === 'fulfilled' ? pedidosResult.value : null;

      const pedidosDisponivel =
        disponivelResult.status === 'fulfilled' ? disponivelResult.value : null;

      const pedidosEmAberto =
        abertoResult.status === 'fulfilled' ? abertoResult.value : null;

      const vendasResponse =
        vendasResult.status === 'fulfilled' ? vendasResult.value : null;

      let totSum = 0;
      let totSumPersonal = 0;
      let totVendas = 0;
      let totVendasPessoal = 0;

      const sumByCompany = {};

      const vendasData = vendasResponse?.data?.data || [];

      vendasData.forEach(item => {
        const valor = Number(item.sum_totalValue) || 0;

        totSum += valor;

        if (String(item.salesperson_id) === String(id_user)) {
          totVendasPessoal++;

          totSumPersonal += valor;
        }

        totVendas++;

        const empresa = item.company_code || 'Não informado';

        if (!sumByCompany[empresa]) {
          sumByCompany[empresa] = 0;
        }

        sumByCompany[empresa] += valor;
      });

      const companyDataArray = Object.entries(sumByCompany)
        .map(([key, value]) => ({
          label: key,
          value: value,
        }))
        .sort((a, b) => b.value - a.value);

      setCompanyData(companyDataArray);

      setVendas(totSum);

      setVendasPessoal(totSumPersonal);

      setQtdVendas(totVendas);

      setQtdVendasPessoal(totVendasPessoal);

      setEstadoCidadesMap(pedidos?.data?.data?.estadoCidadesMap || []);

      const metaValue = Number(pedidos?.data?.[0]?.VALOR) || 0;

      setMeta(formatDecimal(metaValue));

      const percentual =
        metaValue > 0 ? ((totSum / metaValue) * 100).toFixed(2) : 0;

      setMetaAferida(percentual);

      const rows = pedidos?.data?.data?.vendedorGroups
        ? transformDataForTable(pedidos.data.data.vendedorGroups)
        : [];

      const rowsClientes = pedidos?.data?.data?.clienteGroups
        ? transformDataForTable(pedidos.data.data.clienteGroups)
        : [];

      const rowsTransportadoras = pedidos?.data?.data?.transportadoraGroups
        ? transformDataForTable(pedidos.data.data.transportadoraGroups)
        : [];

      setVendedoresStatus(
        rows.map(item =>
          createData(
            item.cliente || '',

            translate(item.status),

            item.pedidos,

            Number(item.valor || 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
          ),
        ),
      );

      setClientesStatus(rowsClientes);

      setTransportadorasStatus(
        rowsTransportadoras.map(item =>
          createData(
            item.cliente && item.cliente !== 'undefined'
              ? item.cliente
              : 'Não informado',

            translate(item.status),

            item.pedidos,

            Number(item.valor || 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
          ),
        ),
      );

      const valoresPeriodo = [];

      const qtdPeriodo = [];

      const valoresAberto = [];

      const qtdAberto = [];

      const valoresDisponibilidade = [];

      const qtdDisponibilidade = [];

      const statusVendaPeriodo = pedidos?.data?.data?.statusVenda || {};

      Object.keys(statusVendaPeriodo).forEach(status => {
        valoresPeriodo.push({
          label: translate(status),

          value: Number(statusVendaPeriodo[status].valor) || 0,
        });

        qtdPeriodo.push({
          label: translate(status),

          value: Number(statusVendaPeriodo[status].pedidos) || 0,
        });
      });

      const statusVendaAberto = pedidosEmAberto?.data?.data?.statusVenda || {};

      Object.keys(statusVendaAberto).forEach(status => {
        valoresAberto.push({
          label: translate(status),

          value: Number(statusVendaAberto[status].valor) || 0,
        });

        qtdAberto.push({
          label: translate(status),

          value: Number(statusVendaAberto[status].pedidos) || 0,
        });
      });

      const statusVendaDisponibilidade =
        pedidosDisponivel?.data?.data?.statusVenda || {};

      Object.keys(statusVendaDisponibilidade).forEach(status => {
        valoresDisponibilidade.push({
          label: translate(status),

          value: Number(statusVendaDisponibilidade[status].valor) || 0,
        });

        qtdDisponibilidade.push({
          label: translate(status),

          value: Number(statusVendaDisponibilidade[status].pedidos) || 0,
        });
      });

      setVendasStatusQtd(qtdPeriodo);

      setVendasStatusValor(valoresPeriodo);

      const labelsOpen = ['PREPARANDO', 'PREPARADO', 'APROVADO', 'SEPARACAO'];

      const labelsFinished = ['FINALIZADO'];

      const qtdOpen = qtdAberto
        .filter(item => labelsOpen.includes(item.label))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      const valorOpen = valoresAberto
        .filter(item => labelsOpen.includes(item.label))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      setQtdVendasAberto(qtdOpen);

      setVlVendasAberto(
        valorOpen.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      );

      const qtdOpenPeriodo = qtdDisponibilidade
        .filter(item => labelsOpen.includes(item.label))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      const valorOpenPeriodo = valoresDisponibilidade
        .filter(item => labelsOpen.includes(item.label))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      setQtdVendasAbertoPeriodo(qtdOpenPeriodo);

      setVlVendasAbertoPeriodo(
        valorOpenPeriodo.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      );

      const qtdEmitidos = qtdPeriodo
        .filter(item => item.label !== 'AGRUPADO')
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      const valorEmitidos = valoresPeriodo
        .filter(item => item.label !== 'AGRUPADO')
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      setQtdPedidosEmitidos(qtdEmitidos);

      setVlPedidosEmitidos(
        valorEmitidos.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      );

      const qtdFinalizados = qtdPeriodo
        .filter(item => labelsFinished.includes(item.label))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      const valorFinalizados = valoresPeriodo
        .filter(item => labelsFinished.includes(item.label))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

      setQtdPedidosFinalizados(qtdFinalizados);

      setVlPedidosFinalizados(
        valorFinalizados.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      );
    } catch (error) {
      setQtdVendasAberto(0);
      setVlVendasAberto(0);

      setQtdVendasAbertoPeriodo(0);

      setVlVendasAbertoPeriodo(0);

      setVlPedidosEmitidos(0);
      setQtdPedidosEmitidos(0);

      setVlPedidosFinalizados(0);

      setQtdPedidosFinalizados(0);

      setVendas(0);
      setVendasPessoal(0);
      setQtdVendas(0);

      setQtdVendasPessoal(0);

      setEstadoCidadesMap([]);
      setCompanyData([]);

      setVendasStatusQtd([]);

      setVendasStatusValor([]);
    } finally {
      setLoadingResumo(false);
    }
  }

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error('Informe as duas datas.');

      return;
    }

    if (endDate.isBefore(startDate)) {
      toast.error('Data de fim não pode ser anterior à data de início!');

      return;
    }

    fetchData(
      startDate.format('YYYY-MM-DD'),

      endDate.format('YYYY-MM-DD'),
    );
  };

  const renderKpi = ({ icon, title, value, footer }) => (
    <Card className={classes.kpiCard}>
      <CardBody className={classes.kpiBody}>
        {loadingResumo ? (
          <div className={classes.kpiLoading}>
            <CircularProgress size={30} />
          </div>
        ) : (
          <>
            <div className={classes.kpiTop}>
              <div>
                <p className={classes.kpiLabel}>{title}</p>

                <h3 className={classes.kpiValue}>{value}</h3>
              </div>

              <div className={classes.kpiIcon}>{icon}</div>
            </div>

            <div className={classes.kpiFooter}>
              <TrendingUpIcon
                style={{
                  fontSize: 16,
                }}
              />

              {footer}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );

  const renderLoadingChart = texto => (
    <div className={classes.chartLoading}>
      <CircularProgress size={34} />

      {texto}
    </div>
  );

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <AssessmentIcon className={classes.headerIcon} />

          <h2 className={classes.headerTitle}>Dashboard</h2>
        </div>

        <div className={classes.headerPeriod}>
          <DateRangeIcon
            style={{
              fontSize: 17,
            }}
          />

          {startDate && endDate
            ? `${startDate.format('DD/MM/YYYY')} até ${endDate.format(
                'DD/MM/YYYY',
              )}`
            : 'Período não selecionado'}
        </div>
      </div>

      <div className={classes.content}>
        <Card className={classes.searchCard}>
          <CardBody className={classes.searchBody}>
            <div className={classes.searchTitle}>
              <DateRangeIcon />
              Período de análise
            </div>

            <div className={classes.searchControls}>
              <Space direction="horizontal" size={12}>
                <DatePicker
                  placeholder="Data de Início"
                  value={startDate}
                  onClick={() => setStartDate(null)}
                  onChange={date => setStartDate(date)}
                  format="DD/MM/YYYY"
                />

                <DatePicker
                  placeholder="Data de Fim"
                  value={endDate}
                  onClick={() => setEndDate(null)}
                  onChange={date => setEndDate(date)}
                  format="DD/MM/YYYY"
                />

                <Button
                  type="primary"
                  loading={loadingResumo}
                  onClick={handleSearch}
                >
                  Pesquisar
                </Button>
              </Space>
            </div>
          </CardBody>
        </Card>

        <div className={classes.kpiGrid}>
          {renderKpi({
            icon: <AccessTimeIcon />,

            title: 'Vendas em aberto',

            value: vlVendasAberto || 'R$ 0,00',

            footer: `${qtdVendasAberto || 0} pedidos`,
          })}

          {renderKpi({
            icon: <ShoppingCartIcon />,

            title: 'Vendas em aberto no período',

            value: vlVendasAbertoPeriodo || 'R$ 0,00',

            footer: `${qtdVendasAbertoPeriodo || 0} pedidos`,
          })}

          {renderKpi({
            icon: <AssessmentIcon />,

            title: 'Vendas no período',

            value: vlpedidosEmitidos || 'R$ 0,00',

            footer: `${qtdpedidosEmitidos || 0} pedidos`,
          })}

          {renderKpi({
            icon: <AttachMoneyIcon />,

            title: 'Total faturado',

            value: `R$ ${formatDecimal(vendas || 0)}`,

            footer: 'Faturamento no período',
          })}
        </div>

        <div className={classes.sectionHeader}>Evolução do faturamento</div>

        <div className={classes.chartsGrid}>
          <Card className={classes.chartCard}>
            <div className={classes.chartHeader}>
              <div className={classes.chartTitleArea}>
                <div className={classes.chartIcon}>
                  <TrendingUpIcon />
                </div>

                <div>
                  <h3 className={classes.chartTitle}>Faturamento Anual</h3>

                  <p className={classes.chartSubtitle}>Evolução por ano</p>
                </div>
              </div>

              <Popover
                content={renderDatePicker('annual')}
                trigger="click"
                open={chartFilters.annual.open}
                onOpenChange={open => updateChartFilter('annual', 'open', open)}
              >
                <Button type="primary" className={classes.chartButton}>
                  Selecionar Período
                </Button>
              </Popover>
            </div>

            <CardBody className={classes.chartBody}>
              {chartFilters.annual.loading ? (
                renderLoadingChart('Carregando faturamento anual...')
              ) : (
                <BarChart
                  data={annualRevenueData}
                  orientation="vertical"
                  title=""
                  subtitle={getSubtitle('annual')}
                  meta=""
                  numberFormat="currency"
                />
              )}
            </CardBody>
          </Card>

          <Card className={classes.chartCard}>
            <div className={classes.chartHeader}>
              <div className={classes.chartTitleArea}>
                <div className={classes.chartIcon}>
                  <AssessmentIcon />
                </div>

                <div>
                  <h3 className={classes.chartTitle}>Faturamento por Mês</h3>

                  <p className={classes.chartSubtitle}>Distribuição mensal</p>
                </div>
              </div>

              <Popover
                content={renderDatePicker('monthly')}
                trigger="click"
                open={chartFilters.monthly.open}
                onOpenChange={open =>
                  updateChartFilter('monthly', 'open', open)
                }
              >
                <Button type="primary" className={classes.chartButton}>
                  Selecionar Período
                </Button>
              </Popover>
            </div>

            <CardBody className={classes.chartBody}>
              {chartFilters.monthly.loading ? (
                renderLoadingChart('Carregando faturamento mensal...')
              ) : (
                <BarChart
                  data={vendasAno}
                  orientation="vertical"
                  title=""
                  subtitle={getSubtitle('monthly')}
                  meta=""
                  numberFormat="currency"
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
