import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EditIcon from '@material-ui/icons/Info';
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
//import Pedidos from '../../../views/Pedidos';

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



// @material-ui/icons
import Store from '@material-ui/icons/Store';
import { Form } from './styles';
import Pedidos from 'views/Pedidos/Pedidos';

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

export default function ModalClientes({ data, prazo, parentData}) {
  // Token
  const token = sessionStorage.getItem('token');
  const perfil = sessionStorage.getItem('perfil');
  const email = sessionStorage.getItem('email');
  // Modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [isopen, setisOpen] = React.useState(true);
  const [pedidosOpen, setPedidosOpen] = React.useState(false);

    useEffect(() => {
     handleReqInfoComerciais();
   }, []);


  const datac = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];
  const renderCustomAxisTick = ({ x, y, payload }) => {
    let path = '';

    switch (payload.value) {
      case 'Page A':
        path =
          'M899.072 99.328q9.216 13.312 17.92 48.128t16.384 81.92 13.824 100.352 11.264 102.912 9.216 90.112 6.144 60.928q4.096 30.72 7.168 70.656t5.632 79.872 4.096 75.264 2.56 56.832q-13.312 16.384-30.208 25.6t-34.304 11.264-34.304-2.56-30.208-16.896q-1.024-10.24-3.584-33.28t-6.144-53.76-8.192-66.56-8.704-71.68q-11.264-83.968-23.552-184.32-7.168 37.888-11.264 74.752-4.096 31.744-6.656 66.56t-0.512 62.464q1.024 18.432 3.072 29.184t4.608 19.968 5.12 21.504 5.12 34.304 5.12 56.832 4.608 90.112q-11.264 24.576-50.688 42.496t-88.576 29.696-97.28 16.896-74.752 5.12q-18.432 0-46.08-2.56t-60.416-7.168-66.048-12.288-61.952-17.92-49.664-24.064-28.16-30.208q2.048-55.296 5.12-90.112t5.632-56.832 5.12-34.304 5.12-21.504 4.096-19.968 3.584-29.184q2.048-27.648-0.512-62.464t-6.656-66.56q-4.096-36.864-11.264-74.752-13.312 100.352-24.576 184.32-5.12 35.84-9.216 71.68t-8.192 66.56-6.656 53.76-2.56 33.28q-13.312 12.288-30.208 16.896t-34.304 2.56-33.792-11.264-29.696-25.6q0-21.504 2.048-56.832t4.096-75.264 5.632-79.872 6.656-70.656q2.048-20.48 6.144-60.928t9.728-90.112 11.776-102.912 13.824-100.352 16.384-81.92 17.92-48.128q20.48-12.288 56.32-25.6t73.216-26.624 71.168-25.088 50.176-22.016q10.24 13.312 16.896 61.44t13.312 115.712 15.36 146.432 23.04 153.6l38.912-334.848-29.696-25.6 43.008-54.272 15.36 2.048 15.36-2.048 43.008 54.272-29.696 25.6 38.912 334.848q14.336-74.752 23.04-153.6t15.36-146.432 13.312-115.712 16.896-61.44q16.384 10.24 50.176 22.016t71.168 25.088 73.216 26.624 56.32 25.6';
        break;
      case 'Page B':
        path =
          'M662.528 451.584q10.24 5.12 30.208 16.384t46.08 31.744 57.856 52.736 65.024 80.896 67.072 115.2 64.512 154.624q-15.36 9.216-31.232 21.504t-31.232 22.016-31.744 15.36-32.768 2.56q-44.032-9.216-78.336-8.192t-62.976 7.68-53.248 16.896-47.616 19.968-46.08 16.384-49.664 6.656q-57.344-1.024-110.592-16.896t-101.376-32.256-89.6-25.088-75.264 4.608q-20.48 8.192-41.984 1.024t-38.912-18.432q-20.48-13.312-39.936-33.792 37.888-116.736 86.016-199.68t92.672-136.704 78.848-81.408 43.52-33.792q9.216-5.12 10.24-25.088t-1.024-40.448q-3.072-24.576-9.216-54.272l-150.528-302.08 180.224-29.696q27.648 52.224 53.76 79.36t50.176 36.864 45.568 5.12 39.936-17.92q43.008-30.72 80.896-103.424l181.248 29.696q-20.48 48.128-45.056 99.328-20.48 44.032-47.616 97.28t-57.856 105.472q-12.288 34.816-13.824 57.344t1.536 36.864q4.096 16.384 12.288 25.6z';
        break;

      default:
        path = '';
    }

    return (
      <svg
        x={x - 12}
        y={y + 4}
        width={24}
        height={24}
        viewBox="0 0 1024 1024"
        fill="#666"
      >
        <path d={path} />
      </svg>
    );
  };

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="#666"
        textAnchor="middle"
        dy={-6}
      >{`value: ${value}`}</text>
    );
  };

  const handleOpen = () => {
    handleReqInfoComerciais();
    setOpen(true);

  };
  const handleClose = () => {
    setOpen(false);
  };



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
  const [titulosaVencer, setTituloaVencer] = useState('');
  const [prazo_medio, setPrazoMedio] = useState(0);
  const [atraso, setAtraso] = useState('');
 
  const [compras, setCompras] = useState('');


  async function handleReqPedidos() {
   data?
    setPedidosOpen(true)  
    :        toast.error("Por favor escolha o cliente.");

  }

  async function handleReqInfoComerciais() {
    try {
  
      const response = await axios.get(
        `${API.infocomerciais}?conta_cliente=${data}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const dadoscomerciais = response.data.data;

      setInfoComerciais(dadoscomerciais[0]);

      let primeira_compra_valor = dadoscomerciais[0].IC_PRIMEIRA_COMPRA_VALOR.toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        },
      );

      let ultima_compra_valor = dadoscomerciais[0].IC_ULTIMA_COMPRA_VALOR.toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        },
      );

      let maior_compra_valor = dadoscomerciais[0].IC_MAIOR_COMPRA_VALOR.toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        },
      );

      let primeira_compra_data = moment(
        dadoscomerciais[0].IC_PRIMEIRA_COMPRA_DATA,
      ).format('DD/MM/YYYY');

      let ultima_compra_data = moment(
        dadoscomerciais[0].IC_ULTIMA_COMPRA_DATA,
      ).format('DD/MM/YYYY');

      let maior_compra_data = moment(
        dadoscomerciais[0].IC_MAIOR_COMPRA_DATA,
      ).format('DD/MM/YYYY');

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
          Number(dadoscomerciais[0].IC_PRAZO_MEDIO),
          'blue',
          Number(dadoscomerciais[0].IC_PRAZO_MEDIO) + ' DIAS',
        ],
        ['', null, 'red', null],
      ]);

      setLimite_credito_saldo(
        Number(dadoscomerciais[0].IC_CREDITO_DISPONIVEL).toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        ),
      );
      //console.log('credito'+Number(dadoscomerciais[0].IC_CREDITO_DISPONIVEL));
      parentData(dadoscomerciais[0].IC_CREDITO_DISPONIVEL);
      setLimite_reserva_saldo(
        Number(dadoscomerciais[0].IC_RESERVA_DISPONIVEL).toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        ),
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
          Number(dadoscomerciais[0].IC_CREDITO_LIMITE),
          '#b87333',
          Number(dadoscomerciais[0].IC_CREDITO_LIMITE).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        ],
        [
          'Utilizado',
          Number(dadoscomerciais[0].IC_CREDITO_UTILIZADO),
          'silver',
          Number(dadoscomerciais[0].IC_CREDITO_UTILIZADO).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
        ],
      ]);

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
          Number(dadoscomerciais[0].PE_ATRASO_MEDIO),
          'blue',
          Number(dadoscomerciais[0].PE_ATRASO_MEDIO),
        ],
        [
          'Maior Atraso',
          Number(dadoscomerciais[0].PE_MAIOR_ATRASO),
          'red',
          Number(dadoscomerciais[0].PE_MAIOR_ATRASO),
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
          Number(dadoscomerciais[0].IC_RESERVA_LIMITE),
          '#b87333',
          Number(dadoscomerciais[0].IC_RESERVA_LIMITE).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        ],
        [
          'Utilizado',
          Number(dadoscomerciais[0].IC_RESERVA_UTILIZADA),
          'red',
          Number(dadoscomerciais[0].IC_RESERVA_UTILIZADA).toLocaleString(
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
          Number(dadoscomerciais[0].PE_EM_DIA_VALOR).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].PE_EM_DIA_TITULOS),
        ],
        [
          'Após  o vencimento',
          Number(dadoscomerciais[0].PE_APOS_VENCIMENTO_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].PE_APOS_VENCIMENTO_TITULOS),
        ],
        [
          'Em cartório',
          Number(dadoscomerciais[0].PE_CARTORIO_VALOR).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].PE_CARTORIO_TITULOS),
        ],
        [
          'Em protesto',
          Number(dadoscomerciais[0].PE_PROTESTO_VALOR).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].PE_PROTESTO_TITULOS),
        ],
      ]);

      setTituloVencidos([
        ['Títulos vencidos', 'Valor R$', 'Títulos'],
        [
          'Títulos vencidos - Total',
          Number(dadoscomerciais[0].VI_TOTAL).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].VI_TITULOS),
        ],
        [
          'Títulos vencidos até 7 dias',
          Number(dadoscomerciais[0].VI_ATE_07_DIAS_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].VI_ATE_07_DIAS_TITULOS),
        ],
        [
          'Títulos vencidos a mais de 7 dias',
          Number(dadoscomerciais[0].VI_ACIMA_07_DIAS_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].VI_ACIMA_07_DIAS_TITULOS),
        ],
        [
          'Em cartório',
          Number(dadoscomerciais[0].VI_CARTORIO_VALOR).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].VI_CARTORIO_TITULOS),
        ],
        [
          'Em protesto',
          Number(dadoscomerciais[0].VI_PROTESTO_VALOR).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].VI_PROTESTO_TITULOS),
        ],
      ]);

      setTituloaVencer([
        ['Títulos a vencer', 'Valor R$', 'Títulos'],
        [
          'Títulos a vencer - Total',
          Number(dadoscomerciais[0].VE_TOTAL).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          Number(dadoscomerciais[0].VE_TITULOS),
        ],
        [
          'Títulos a vencer em até 30 dias',
          Number(dadoscomerciais[0].VE_ATE_30_DIAS_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].VE_ATE_30_DIAS_TITULOS),
        ],
        [
          'Títulos a vencer entre 30 e 60 dias',
          Number(dadoscomerciais[0].VE_30_60_DIAS_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].VE_30_60_DIAS_TITULOS),
        ],
        [
          'Títulos a vencer entre 60 e 90 dias',
          Number(dadoscomerciais[0].VE_60_90_DIAS_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].VE_60_90_DIAS_TITULOS),
        ],
        [
          'Títulos a vencer acima de 90 dias',
          Number(dadoscomerciais[0].VE_ACIMA_90_DIAS_VALOR).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          Number(dadoscomerciais[0].VE_ACIMA_90_DIAS_TITULOS),
        ],
      ]);

      setCompras([
        ['id', 'childLabel', 'parent', 'size', { role: 'style' }],
        [0, 'Compras', -1, 2, 'black'],
        [1, 'Primeira', 0, 3, 'black'],
        [2, 'Última', 0, 5, 'black'],
        [3, 'Maior', 0, 1, 'black'],
        [4, `Data:${primeira_compra_data}`, 1, 2, 'black'],
        [5, `Valor: ${primeira_compra_valor}`, 1, 2, 'black'],
        [6, `Data:${ultima_compra_data}`, 2, 2, 'black'],
        [7, `Valor:${ultima_compra_valor}`, 2, 2, 'black'],
        [8, `Data:${maior_compra_data}`, 3, 2, 'black'],
        [9, `Valor:${maior_compra_valor}`, 3, 2, 'black'],
      ]);

      //   setContatos(contact);
    } catch (err) {
      
      //  toast.error("Houve um erro ao listar contatos.");
    }
  }




  // Selects
  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <EditIcon />
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
                <Tab onClick={() => handleReqInfoComerciais()}>
                  Informações comerciais e financeiras
                </Tab>
               
               
              </TabList>

              <TabPanel>
                <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
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
                          Prazo de pagamento liberado
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
                          {prazo?prazo:'Não cadastrado'}
                        </h3>
                      </CardHeader>
                      <CardFooter stats>
                        <div className={classes.stats}>
                          <Danger></Danger>
                        </div>
                      </CardFooter>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={6} md={4}>
                    <Card>
                      <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                          <Icon>attach_money</Icon>
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

                  <GridItem xs={12} sm={6} md={4}>
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
                          Reserva Disponível (Saldo)
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
                          {limite_reserva_saldo}
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
                        chartType="BarChart"
                        loader={<div>Carregando gráfico</div>}
                        data={reserva}
                        options={{
                          is3D: true,

                          title: 'Limite de reserva',
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
                {
                  pedidosOpen && (
                        <Pedidos Client={data} />
                  )
                }
              </TabPanel>
            </Tabs>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalClientes.propTypes = {
  data: PropTypes.string.isRequired,
  prazo: PropTypes.string.isRequired
};
