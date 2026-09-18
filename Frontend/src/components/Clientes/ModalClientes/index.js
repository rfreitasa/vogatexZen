import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Autocomplete from 'react-autocomplete';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DataTable from 'components/Table/Table.js';
import ModalCreateContatos from '../ModalCreateContatos';
import EditContato from '../ModalEditContatos';
import DeleteContato from '../ModalDeleteContatos';

import { Chart } from 'react-google-charts';
import moment from 'moment';
import { API } from '../../../config/api';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Danger from 'components/Typography/Danger.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardIcon from 'components/Card/CardIcon.js';
import CardFooter from 'components/Card/CardFooter.js';
import 'react-tabs/style/react-tabs.css';
import Icon from '@material-ui/core/Icon';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton } from '@material-ui/core';
import ModalCreate from '../ModalCreateFiles';

// @material-ui/icons
import Store from '@material-ui/icons/Store';
import { Form } from './styles';

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
    maxHeight: '80%',
    minHeight: '80%',
    minWidth: '80%',
    overflow: 'scroll',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 420,
  },
  button: {
    border: 0,
    borderRadius: '20px',
    backgroundColor: '#00acc1',
    color: '#fff',
    padding: '5px',
    cursor: 'pointer',
  },
}));

export default function ModalClientes({ data }) {
  // Token
  const token = sessionStorage.getItem('token');
  const perfil = sessionStorage.getItem('perfil');
  const email = sessionStorage.getItem('email');

  // Modal
  const classes = useStyles();
  const [valueAutoId, setValueAutoId] = useState('');
  const [valueAutoname, setValueAutoname] = useState('');

  const [open, setOpen] = React.useState(false);
  const [isopen, setisOpen] = React.useState(true);
  const [redesp, setRedesp] = React.useState('');

  const datac = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];
  const [openInfoModal, setOpenInfoModal] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    getVendedores();
    getTransp();
  };
  const handleClose = () => {
    setOpen(false);
  };

  function handleCloseChild() {
    handleReqContatos();
    setisOpen(false);
  }

  const {
    id,
    type,
    name,
    fantasyName,
    documentNumber,
    inscricaoEstadual,
    inscricaoMunicipal,
    cpf,
    rg,
    street,
    number,
    complement,
    district,
    city,
    enderecoEstado,
    enderecoPais,
    zipcode,
    enderecoLatitude,
    enderecoLongitude,
    cliente,
    fornecedor,
    vendedor,
    transportadora,
    funcionario,
    segmentoDescricao,
    tags,
    person,
    observacoes,
    vendedorPadrao,
    salesPerson,
    personShipping,
  } = data;
  // react-hooks-form
  const { register, getValues } = useForm();
  // Submit

  // AutoComplete
  const [auto, setAuto] = useState();
  const [contatos, setContatos] = useState([]);
  const [infoComerciais, setInfoComerciais] = useState([]);
  const [limite, setLimite] = useState('');
  const [reserva, setReserva] = useState('');
  const [limite_credito_saldo, setLimite_credito_saldo] = useState(0);
  const [limite_reserva_saldo, setLimite_reserva_saldo] = useState(0);
  const [pagamentosEfetuados, setPagamentosEfetuados] = useState('');
  const [titulosVencidos, setTituloVencidos] = useState('');
  const [totalvencidos, setTotalVencidos] = useState('');
  const [titulosaVencer, setTituloaVencer] = useState('');
  const [prazo_medio, setPrazoMedio] = useState(0);
  const [atraso, setAtraso] = useState('');
  const [token_erp, settoken_erp] = useState('');
  const [files, setFiles] = useState('');

  const [compras, setCompras] = useState('');

  const getVendedores = async () => {
    try {
      if (data.personSalesperson) {
        const response2 = await axios.get(
          `${API.clientes}/${data.personSalesperson.id}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        const vendedor = response2.data.data;
        setValueAutoId(vendedor[0].id);
        setValueAutoname(vendedor[0].name);
      }
      //setContatos(contact);
    } catch (err) {
      toast.error('Houve um erro ao listar clientes.');
    }
  };

  async function handleReqFiles() {
    try {
      const response = await axios.get(`${API.clientes}/${data.id}/arquivos`, {
        headers: {
          'x-access-token': token,
        },
      });

      const files = response.data.data;

      setFiles(files);
      setLoading(false);
    } catch (err) {
      //  toast.error("Houve um erro ao listar contatos.");
    }
  }

  const getTransp = async () => {
    try {
      var id_redespacho = data?.properties?.personShippingTransshipment
        ? data?.properties.personShippingTransshipment
        : 0;
      if (id_redespacho > 0) {
        var where = `&concat_transp=${id_redespacho}`;
        const responseTransp = await axios.get(
          `${API.transportadorasByID}?email=${email}${where}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
    
        setRedesp(
          responseTransp.data.data
            ? `${responseTransp.data.data[0].id}-${responseTransp.data.data[0].name}(${responseTransp.data.data[0].fantasyName})-${responseTransp.data.data[0].documentNumber}`
            : '',
        );
      } else {
        setRedesp('');
      }
    } catch (err) {
      //  toast.error("Houve um erro ao listar contatos.");
    }
  };
  async function handleReqContatos() {
    try {
      const response2 = await axios.get(`${API.clientes}/${data.id}/contatos`, {
        headers: {
          'x-access-token': token,
        },
      });

      const contact = response2.data.data;

      setContatos(contact);
    } catch (err) {
      //  toast.error("Houve um erro ao listar contatos.");
    }
  }

  async function handleReqInfoComerciais() {
    try {
      const response = await axios.get(
        `${API.infocomerciais}?conta_cliente=${data.id}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const dados = response.data.data;
      // console.log(dados)
      const estatisticas_faturamento = dados[0][
        '/financial/report/billingTitleStats'
      ][0]
        ? dados[0]['/financial/report/billingTitleStats'][0]
        : null;
      const estatisticas_liquidacao = dados[1][
        '/financial/report/settlementStats'
      ][0]
        ? dados[1]['/financial/report/settlementStats'][0]
        : null;
      const estatisticas_faturas = dados[2]['/fiscal/report/invoiceStats'][0]
        ? dados[2]['/fiscal/report/invoiceStats'][0]
        : null;
      const estatisticas_credito = dados[3][
        '/financial/credit/dataSource/creditLineStats'
      ][0]
        ? dados[3]['/financial/credit/dataSource/creditLineStats'][0]
        : null;
      const dadoscomerciais = '';
      // console.log('aqui')
      //dadoscomerciais[0]["/financial/report/billingTitleStats"].parameters.PERSON_IDS
      //console.log(dadoscomerciais[0]["/financial/report/billingTitleStats"][0].person_id)
      //  setInfoComerciais(estatisticas_faturamento);
      setInfoComerciais([]);
      // console.log(estatisticas_faturas)

      let primeira_compra_valor = (estatisticas_faturas
        ? estatisticas_faturas.invoice_totalValue_first
        : 0
      ).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      let ultima_compra_valor = (estatisticas_faturas
        ? estatisticas_faturas.invoice_totalValue_last
        : 0
      ).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      let maior_compra_valor = (estatisticas_faturas
        ? estatisticas_faturas.invoice_totalValue_highValue
        : 0
      ).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      // console.log(estatisticas_faturamento.invoice_date_first);
      let primeira_compra_data = estatisticas_faturas
        ? moment(estatisticas_faturas.invoice_date_first).format('DD/MM/YYYY')
        : '';

      let ultima_compra_data = estatisticas_faturas
        ? moment(estatisticas_faturas.invoice_date_last).format('DD/MM/YYYY')
        : 0;

      let maior_compra_data = estatisticas_faturas
        ? moment(estatisticas_faturas.invoice_date_highValue).format(
            'DD/MM/YYYY',
          )
        : 0;
      //console.log(primeira_compra_valor , primeira_compra_data , ultima_compra_valor, ultima_compra_data, maior_compra_valor, maior_compra_data)
      setPrazoMedio([
        [
          'Element',
          'Dias',
          { role: 'style' },
          {
            sourceColumn: 0,
            role: 'annotation',
            type: 'string',
            calc: 'stringify',
          },
        ],
        [
          'Prazo Médio',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.average_term
              : 0,
          ),
          'blue',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.average_term
              : 0,
          ) + ' DIAS',
        ],
        ['', null, 'red', null],
      ]);
      setLimite_credito_saldo(
        Number(
          estatisticas_credito &&
            estatisticas_credito.personGroup_credit_balance
            ? estatisticas_credito.personGroup_credit_balance
            : estatisticas_credito.person_credit_balance,
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      );

      //Dados do gráfico
      setLimite([
        [
          'Element',
          'Valor',
          { role: 'style' },
          {
            sourceColumn: 0,
            role: 'annotation',
            type: 'string',
            calc: 'stringify',
          },
        ],
        [
          'Limite',
          Number(
            estatisticas_credito.personGroup_item_id > 0
              ? estatisticas_credito?.personGroup_credit
              : estatisticas_credito?.person_credit,
          ),
          '#b87333',
          Number(
            estatisticas_credito.personGroup_item_id > 0
              ? estatisticas_credito?.personGroup_credit
              : estatisticas_credito?.person_credit,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        ],
        [
          'Utilizado',
          Number(
            estatisticas_credito.personGroup_item_id > 0
              ? estatisticas_credito?.personGroup_used_total
              : estatisticas_credito?.person_used_total,
          ),
          'silver',
          Number(
            estatisticas_credito.personGroup_item_id > 0
              ? estatisticas_credito?.personGroup_used_total
              : estatisticas_credito?.person_used_total,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        ],
      ]);
      //console.log(estatisticas_liquidacao)
      setAtraso([
        [
          'Element',
          'Dias',
          { role: 'style' },
          {
            sourceColumn: 0,
            role: 'annotation',
            type: 'string',
            calc: 'stringify',
          },
        ],
        [
          'Atraso Médio',
          estatisticas_liquidacao
            ? Number(estatisticas_liquidacao.settlement_average_term)
            : 0,
          'blue',
          estatisticas_liquidacao
            ? Number(estatisticas_liquidacao.settlement_average_term)
            : 0,
        ],
      ]);

      setReserva([
        [
          'Element',
          'Valor',
          { role: 'style' },
          {
            sourceColumn: 0,
            role: 'annotation',
            type: 'string',
            calc: 'stringify',
          },
        ],
        [
          'Limite',
          Number(dadoscomerciais[0]?.IC_RESERVA_LIMITE),
          '#b87333',
          Number(dadoscomerciais[0]?.IC_RESERVA_LIMITE).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
        ],
        [
          'Utilizado',
          Number(dadoscomerciais[0]?.IC_RESERVA_UTILIZADA),
          'red',
          Number(dadoscomerciais[0]?.IC_RESERVA_UTILIZADA).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
        ],
      ]);

      setPagamentosEfetuados([
        ['Pagamentos efetuados', 'Valor R$', 'Títulos'],
        [
          'Em dia',
          Number(
            estatisticas_liquidacao ? estatisticas_liquidacao.on_time_value : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_liquidacao ? estatisticas_liquidacao.on_time_count : 0,
          ),
        ],
        [
          'Após  o vencimento',
          Number(
            estatisticas_liquidacao ? estatisticas_liquidacao.late_value : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_liquidacao ? estatisticas_liquidacao.late_count : 0,
          ),
        ],
        [
          'Antecipado',
          Number(
            estatisticas_liquidacao ? estatisticas_liquidacao.advance_value : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_liquidacao ? estatisticas_liquidacao.advance_count : 0,
          ),
        ],
        [
          'Em renegociação',
          Number(
            estatisticas_liquidacao
              ? estatisticas_liquidacao.renegotiation_value
              : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          '',
        ],
      ]);
      setTotalVencidos(
        Number(
          estatisticas_faturamento ? estatisticas_faturamento.overdue_total : 0,
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      );
      setTituloVencidos([
        ['Títulos vencidos', 'Valor R$', 'Títulos'],
        [
          'Títulos vencidos - Total',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_total
              : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_total_count
              : 0,
          ),
        ],
        [
          'Títulos vencidos até 7 dias',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.overdue_7 : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_7_count
              : 0,
          ),
        ],
        [
          'Títulos vencidos de 8 a 30 dias',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_8_30
              : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_8_30_count
              : 0,
          ),
        ],
        [
          'Títulos vencidos de 31 a 60 dias',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_31_60
              : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_31_60_count
              : 0,
          ),
        ],
        [
          'Títulos vencidos de 61 a 90 dias',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_61_90
              : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.overdue_61_90_count
              : 0,
          ),
        ],
        [
          'Títulos vencidos a mais de 91 dias',
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento['overdue_91+']
              : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento['overdue_91+_count']
              : 0,
          ),
        ],
      ]);
      setTituloaVencer([
        ['Títulos a vencer', 'Valor R$', 'Títulos'],
        [
          'Títulos a vencer - Total',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.due_total : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.due_total_count
              : 0,
          ),
        ],
        [
          'Títulos a vencer até 7 dias',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.due_7 : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.due_7_count : 0,
          ),
        ],
        [
          'Títulos a vencer de 8 a 30 dias',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.due_8_30 : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.due_8_30_count
              : 0,
          ),
        ],
        [
          'Títulos a vencer de 31 a 60 dias',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.due_31_60 : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.due_31_60_count
              : 0,
          ),
        ],
        [
          'Títulos a vencer de 61 a 90 dias',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento.due_61_90 : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento.due_61_90_count
              : 0,
          ),
        ],
        [
          'Títulos a vencer a mais de 91 dias',
          Number(
            estatisticas_faturamento ? estatisticas_faturamento['due_91+'] : 0,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(
            estatisticas_faturamento
              ? estatisticas_faturamento['due_91+_count']
              : 0,
          ),
        ],
      ]);
      setCompras([
        ['id', 'childLabel', 'parent', 'size', { role: 'style' }],
        [0, 'Compras', -1, 2, 'black'],
        [1, 'Primeira', 0, 3, 'black'],
        [2, 'Última', 0, 5, 'black'],
        [3, 'Maior', 0, 1, 'black'],
        [
          4,
          `Data:${primeira_compra_data ? primeira_compra_data : ''}`,
          1,
          2,
          'black',
        ],
        [
          5,
          `Valor: ${primeira_compra_valor ? primeira_compra_valor : ''}`,
          1,
          2,
          'black',
        ],
        [
          6,
          `Data:${ultima_compra_data ? ultima_compra_data : ''}`,
          2,
          2,
          'black',
        ],
        [
          7,
          `Valor:${ultima_compra_valor ? ultima_compra_valor : ''}`,
          2,
          2,
          'black',
        ],
        [
          8,
          `Data:${maior_compra_data ? maior_compra_data : ''}`,
          3,
          2,
          'black',
        ],
        [
          9,
          `Valor:${maior_compra_valor ? maior_compra_valor : ''}`,
          3,
          2,
          'black',
        ],
      ]);

      //   setContatos(contact);
    } catch (err) {
      //  toast.error("Houve um erro ao listar contatos.");
    }
  }

  function createData(type, description) {
    return {
      type,
      description,
    };
  }

  const rowHeadFiles = [
    {
      title: 'Download',
      field: 'download',
      cellStyle: {
        fontSize: '12px',
      },
      render: url => (
        <a
          href={url.url}
          target="_blank"
          download="" // Pode ser ajustado conforme necessário
          style={{ textDecoration: 'none' }}
        >
          <CloudDownloadIcon />
        </a>
      ),
    },
    {
      title: 'Descrição',
      field: 'description',
      cellStyle: {
        fontSize: '12px',
      },
    },
  ];

  var rowFiles = files
    ? files.map(item => {
        const { id, description, url } = item;

        return {
          url,
          description: description,
        };
      })
    : [{ error: 'Não encontrado' }];

  const rowHead = [
    {
      title: 'type',
      field: 'type',
      cellStyle: {
        fontSize: '12px',
      },
    },
    {
      title: 'Descrição',
      field: 'description',
      cellStyle: {
        fontSize: '12px',
      },
    },
  ];

  var rowContatos = contatos
    ? contatos.map(item => {
        const { type, description } = item;
        const row = createData(type, description);

        return row;
      })
    : [{ error: 'Não encontrado' }];

  const [logradouroApi, setLogradouro] = useState(street);
  const [cidadeApi, setCidade] = useState(city && city.name ? city.name : '');
  const [bairroApi, setBairro] = useState(district);
  const [estadoApi, setEstado] = useState(
    city && city.state && city.state.name ? city.state.name : '',
  );
  const [complementoApi, setComplemento] = useState(complement);
  const [loading, setLoading] = useState(true);

  // Cep
  const handleCep = async e => {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${e.target.value}/json`,
      );
      const {
        logradouro: logradouroApi,
        bairro: bairroApi,
        uf: ufApi,
        localidade: localidadeApi,
        complemento: complementoApi,
      } = response.data;

      setLogradouro(logradouroApi);
      setBairro(bairroApi);
      setEstado(ufApi);
      setCidade(localidadeApi);
      setComplemento(complementoApi);
    } catch (err) {
      toast.error('Cep inválido.');
    }
  };
  const handleDownload = url => {
    // Lógica para download do arquivo
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = url.substring(url.lastIndexOf('/') + 1);
    anchor.click();
  };

  const handleRemove = file => {
    // Lógica para remoção do arquivo
    setFiles(files.filter(f => f !== file));
  };

  const FileGrid = ({ files, onDownload, onRemove }) => {
    if (files.length === 0) {
      return <div>No files</div>;
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Nome do Arquivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{file.description}</td>
                <td>
                  <button onClick={() => onDownload(file)}>Download</button>
                  <button onClick={() => onRemove(file)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  // Selects
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
            <Tabs>
              <TabList>
                <Tab>Conta</Tab>
                <Tab>Transporte</Tab>
                <Tab onClick={() => handleReqContatos()}>Contatos</Tab>
                <Tab onClick={() => handleReqInfoComerciais()}>
                  Informações comerciais
                </Tab>
                <Tab onClick={() => handleReqFiles()}>Arquivos</Tab>
              </TabList>

              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                    <input
                      type="hidden"
                      ref={register}
                      defaultValue={id}
                      name="id"
                    />

                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="divCheck">
                        <h6>Cliente</h6>
                        <input
                          type="checkbox"
                          name="cliente"
                          ref={register}
                          defaultChecked={
                            tags
                              ? tags.includes('customer')
                                ? true
                                : false
                              : false
                          }
                          value={true}
                          readyonly
                        />
                      </div>
                    </Grid>

                    <Grid item xs={6} sm={6} lg={3}>
                      <div className="divCheck">
                        <h6>Ativa</h6>
                        <input
                          type="checkbox"
                          name="ativa"
                          ref={register}
                          defaultChecked={
                            tags
                              ? tags.includes('inactive')
                                ? false
                                : true
                              : false
                          }
                          readyonly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6} sm={6} lg={4}>
                      <div className="divCheck">
                        <h6>Bloqueada</h6>
                        <input
                          type="checkbox"
                          name="bloqueada"
                          ref={register}
                          defaultChecked={
                            tags
                              ? tags.includes('blocked')
                                ? true
                                : false
                              : false
                          }
                          readonly
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Tipo</label>
                        <select
                          name="type"
                          ref={register}
                          defaultValue={type}
                          disabled
                        >
                          <option value={'CORPORATION'}>CORPORATION</option>
                          <option value={'INDIVIDUAL'}>INDIVIDUAL</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Nome</label>
                        <input
                          name="name"
                          type="text"
                          ref={register}
                          defaultValue={name}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Nome fantasia</label>
                        <input
                          name="fantasyName"
                          type="text"
                          ref={register}
                          defaultValue={fantasyName}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Cnpj/CPF</label>
                        <input
                          name="documentNumber"
                          type="text"
                          ref={register}
                          defaultValue={documentNumber}
                          readOnly
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Cep</label>
                        <input
                          name="zipcode"
                          type="text"
                          onBlur={handleCep}
                          ref={register}
                          defaultValue={zipcode}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Endereço</label>
                        <input
                          name="street"
                          type="text"
                          value={logradouroApi}
                          onChange={e => setLogradouro(e.target.value)}
                          ref={register}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Número</label>
                        <input
                          name="number"
                          type="text"
                          ref={register}
                          defaultValue={number}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Complemento</label>
                        <input
                          name="complement"
                          type="text"
                          value={complementoApi ? complementoApi : ''}
                          onChange={e => setComplemento(e.target.value)}
                          ref={register}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Bairro</label>
                        <input
                          name="district"
                          type="text"
                          value={bairroApi ? bairroApi : ''}
                          onChange={e => setBairro(e.target.value)}
                          ref={register}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Cidade</label>
                        <input
                          name="city"
                          type="text"
                          value={cidadeApi ? cidadeApi : ''}
                          onChange={e => setCidade(e.target.value)}
                          ref={register}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Estado</label>
                        <input
                          name="enderecoEstado"
                          type="text"
                          value={estadoApi ? estadoApi : ''}
                          onChange={e => setEstado(e.target.value)}
                          ref={register}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>País</label>
                        <input
                          name="enderecoPais"
                          type="text"
                          ref={register}
                          defaultValue={city?.state?.country?.name || ''}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <div className="input">
                        <label>Vendedor</label>
                        <input
                          name="vendedor"
                          type="text"
                          ref={register}
                          defaultValue={
                            valueAutoId
                              ? valueAutoId + ' - ' + valueAutoname
                              : ''
                          }
                          readOnly
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Observações</label>
                        <textarea
                          label="Observações"
                          id="observacoes"
                          name="observacoes"
                          multiline
                          rows={5}
                          type="text"
                          value={observacoes ? observacoes : ''}
                          ref={register}
                          readOnly
                          style={{ width: '100%' }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>

              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                    <input type="hidden" ref={register} name="transp" />

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Transportadora</label>
                        <input
                          name="transp"
                          type="text"
                          ref={register}
                          defaultValue={
                            data.personShipping
                              ? `${data.personShipping.id}-${data.personShipping.name}(${data.personShipping.fantasyName})-${data.personShipping.documentNumber}`
                              : 'Não informado'
                          }
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Tipo de frete</label>
                        <input
                          name="transp"
                          type="text"
                          ref={register}
                          defaultValue={
                            data?.properties?.freightType
                              ? data?.properties.freightType == 'ISSUER'
                                ? 'EMITENTE'
                                : 'DESTINATARIO'
                              : 'Não informado'
                          }
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Redespacho</label>
                        <input
                          name="transpred"
                          type="text"
                          ref={register}
                          defaultValue={redesp ? redesp : 'Não informado'}
                          readOnly
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Tipo de frete</label>
                        <input
                          name="transp"
                          type="text"
                          ref={register}
                          defaultValue={
                            data?.properties?.personShippingTransshipment
                              ? data?.properties.personShippingTransshipment ==
                                'ISSUER'
                                ? 'EMITENTE'
                                : 'DESTINATARIO'
                              : 'Não informado'
                          }
                          readOnly
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>

              <TabPanel>
                <DataTable
                  rows={rowContatos}
                  rowHead={rowHead}
                  title={'Contatos'}
                />
              </TabPanel>
              <TabPanel>
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                          <Icon>trending_up</Icon>
                        </CardIcon>
                        <p
                          className={classes.cardCategory}
                          style={{
                            color: 'black',
                          }}
                        >
                          Limite de crédito (Saldo)
                        </p>
                        <h3
                          className={classes.cardTitle}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'black',
                          }}
                        >
                          {limite_credito_saldo}
                        </h3>
                      </CardHeader>
                      <CardFooter stats>
                        <div className={classes.stats}>
                          <Danger></Danger>
                        </div>
                      </CardFooter>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <CardHeader color="success" stats icon>
                        <CardIcon color="success">
                          <Store />
                        </CardIcon>
                        <p
                          className={classes.cardCategory}
                          style={{
                            color: 'black',
                          }}
                        >
                          Vencidos (Total)
                        </p>
                        <h3
                          className={classes.cardTitle}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'black',
                          }}
                        >
                          {totalvencidos ? totalvencidos : 0}
                        </h3>
                      </CardHeader>
                      <CardFooter stats>
                        <div className={classes.stats}>
                          <Danger></Danger>
                        </div>
                      </CardFooter>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <Chart
                        width={auto}
                        height={'250px'}
                        chartType="BarChart"
                        loader={<div>Carregando gráfico</div>}
                        data={limite}
                        options={{
                          is3D: true,

                          title: 'Limite de crédito',
                          titlePosition: 'out',
                          axisTitlesPosition: 'out',
                          hAxis: { textPosition: 'out' },
                          vAxis: { textPosition: 'out' },

                          width: auto,
                          height: auto,
                          bar: { groupWidth: '45%' },
                          legend: { position: 'none' },
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '6' }}
                      />
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <Chart
                        width={'auto'}
                        height={'250px'}
                        chartType="WordTree"
                        loader={<div>Carregando gráfico</div>}
                        data={compras}
                        options={{
                          maxFontSize: 12,
                          enableInteractivity: false,
                          tooltip: { trigger: 'none' },
                          chartArea: { width: '100%' },
                          width: auto,
                          height: auto,
                          colors: ['black', 'black', 'black'],

                          wordtree: {
                            format: 'explicit',
                            type: 'suffix',
                          },
                        }}
                        rootProps={{ 'data-testid': '1' }}
                      />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <Chart
                        width={'auto'}
                        height={'250px'}
                        chartType="BarChart"
                        loader={<div>Carregando gráfico</div>}
                        data={prazo_medio}
                        options={{
                          is3D: true,
                          title: 'Prazo Médio das compras',
                          width: auto,
                          height: auto,
                          bar: { groupWidth: '65%' },
                          legend: { position: 'none' },
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '6' }}
                      />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="success" stats icon>
                        <CardIcon color="success">
                          <Icon>attach_money</Icon>
                        </CardIcon>
                        <p
                          className={classes.cardCategory}
                          style={{
                            color: 'black',
                          }}
                        >
                          Informações Financeiras
                        </p>
                        <h3
                          className={classes.cardTitle}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'black',
                          }}
                        ></h3>
                      </CardHeader>
                      <CardFooter stats>
                        <div className={classes.stats}>
                          <Danger></Danger>
                        </div>
                      </CardFooter>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <Chart
                        width={'auto'}
                        height={'300px'}
                        chartType="Table"
                        loader={<div>Carregando gráfico</div>}
                        data={pagamentosEfetuados}
                        formatters={[
                          {
                            type: 'BarFormat',
                            column: 1,
                            options: {
                              width: 120,
                            },
                          },
                          {
                            type: 'ArrowFormat',
                            column: 2,
                          },
                        ]}
                        options={{
                          allowHtml: true,
                          showRowNumber: true,
                          width: '100%',
                          height: '100%',
                        }}
                        rootProps={{ 'data-testid': '2' }}
                      />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <Chart
                        width={auto}
                        height={'300px'}
                        chartType="BarChart"
                        loader={<div>Carregando gráfico</div>}
                        data={atraso}
                        options={{
                          is3D: true,

                          title: 'Atrasos',
                          titlePosition: 'out',
                          axisTitlesPosition: 'out',
                          hAxis: { textPosition: 'out' },
                          vAxis: { textPosition: 'out' },

                          width: auto,
                          height: auto,
                          bar: { groupWidth: '45%' },
                          legend: { position: 'none' },
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '6' }}
                      />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <Chart
                        width={'auto'}
                        height={'300px'}
                        chartType="Table"
                        loader={<div>Carregando gráfico</div>}
                        data={titulosVencidos}
                        formatters={[
                          {
                            type: 'BarFormat',
                            column: 1,
                            options: {
                              width: 120,
                            },
                          },
                          {
                            type: 'ArrowFormat',
                            column: 2,
                          },
                        ]}
                        options={{
                          allowHtml: true,
                          showRowNumber: true,
                          width: '100%',
                          height: '100%',
                        }}
                        rootProps={{ 'data-testid': '2' }}
                      />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <Card>
                      <Chart
                        width={'auto'}
                        height={'300px'}
                        chartType="Table"
                        loader={<div>Carregando gráfico</div>}
                        data={titulosaVencer}
                        formatters={[
                          {
                            type: 'BarFormat',
                            column: 1,
                            options: {
                              width: 120,
                            },
                          },
                          {
                            type: 'ArrowFormat',
                            column: 2,
                          },
                        ]}
                        options={{
                          allowHtml: true,
                          showRowNumber: true,
                          width: '100%',
                          height: '100%',
                        }}
                        rootProps={{ 'data-testid': '2' }}
                      />
                    </Card>
                  </GridItem>
                </GridContainer>
              </TabPanel>

              <TabPanel>
                <div>
                  <ModalCreate data={data.id} />

                  {loading ? (
                    <div>No files</div>
                  ) : (
                    <DataTable
                      rows={rowFiles}
                      rowHead={rowHeadFiles}
                      title={'Arquivos'}
                    />
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalClientes.propTypes = {
  data: PropTypes.object.isRequired,
};
