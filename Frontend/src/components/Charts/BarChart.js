import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Card from '../Card/Card.js';
import CardHeader from '../Card/CardHeader.js';
import CardBody from '../Card/CardBody.js';
import CardFooter from '../Card/CardFooter.js';
import { makeStyles } from '@material-ui/core/styles';
import formatDecimal from '../../utils/formatDecimal.js';

const useStyles = makeStyles({
  cardTitle: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    textAlign: 'center', // Centraliza o título
  },
  cardCategory: {
    margin: '0',
    color: '#FFFFFF',
    textAlign: 'center', // Centraliza o subtítulo
  },
  stats: {
    color: '#FFFFFF',
    display: 'inline-flex',
    fontSize: '12px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .material-icons': {
      top: '4px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
      fontSize: '16px',
      lineHeight: '16px',
    },
  },
});

// Função para transformar dados de vendedorGroups
const transformVendedorGroups = (vendedorGroups) => {
  const data = [];
  
  Object.keys(vendedorGroups).forEach((vendedor) => {
    const statusData = vendedorGroups[vendedor];
    Object.keys(statusData).forEach((status) => {
      const { valor, pedidos } = statusData[status];
      data.push({
        label: `${vendedor} - ${status}`,
        value: valor,
        pedidos: pedidos,
      });
    });
  });
  
  return data;
};

// Função para transformar outros tipos de dados (se necessário)
const transformData = (data, dataType) => {
  if (dataType === 'vendedorGroups') {
    return transformVendedorGroups(data);
  }
  // Adicione outras transformações conforme necessário
  return data;
};

const BarChart = ({ data, dataType, orientation, title, subtitle, meta, numberFormat }) => {
  const classes = useStyles();
  const transformedData = transformData(data, dataType);

  const formatValue = (value) => {
    if (numberFormat === 'currency') {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    } else if (numberFormat === 'decimal') {
      return formatDecimal(value);
    } else {
      return parseFloat(value); // ou outra lógica para outros formatos
    }
  };

  const calculateLabelRotation = () => {
    // Decide se deve rotacionar os rótulos com base na orientação e no número de barras
    if (orientation === 'horizontal') {
      return 0;
    } else {
      return transformedData.length > 5 ? -45 : 0; // Rotaciona em -45 graus se houver mais de 8 barras
    }
  };

  return (
    <Card chart>
      <CardHeader color="info">
        <h4 className={classes.cardTitle}>{title}</h4>
        <p className={classes.cardCategory}>{subtitle}</p>
      </CardHeader>
      <CardBody>
        <div style={{ height: orientation === 'horizontal' ? '300px' : '300px', backgroundColor: '#f0f0f0' }}> {/* Fundo cinza clarinho */}
          <ResponsiveBar
            data={transformedData}
            keys={['value']}
            indexBy="label"
            margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
            padding={0.3}
            layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
            colors={{ scheme: 'category10' }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: calculateLabelRotation(),
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={2}
            labelSkipHeight={2}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            enableLabel={true} // Habilita a exibição dos valores no topo das barras
            labelFormat={(value) => formatValue(value)}
            enableGridY={true} // Desabilita a grade vertical para evitar sobreposição de rótulos
            tooltip={({ id, value, color }) => (
              <strong style={{ color }}>
                 {formatValue(value)}
              </strong>
            )}
            theme={{
              background: '#f0f0f0', // Fundo cinza clarinho
              axis: {
                domain: {
                  line: {
                    stroke: '#777777',
                    strokeWidth: 1
                  }
                },
                ticks: {
                  line: {
                    stroke: '#777777',
                    strokeWidth: 1
                  },
                  text: {
                    fill: '#333333'
                  }
                }
              },
              grid: {
                line: {
                  stroke: '#dddddd',
                  strokeWidth: 1
                }
              }
            }}
          />
        </div>
      </CardBody>
      <CardFooter chart>
        <div className={classes.stats}>
          <h3>{meta}</h3>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarChart;
