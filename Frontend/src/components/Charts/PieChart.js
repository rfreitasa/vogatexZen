import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import Card from '../Card/Card.js';
import CardHeader from '../Card/CardHeader.js';
import CardBody from '../Card/CardBody.js';
import CardFooter from '../Card/CardFooter.js';
import { makeStyles } from '@material-ui/core/styles';
import formatDecimal from '../../utils/formatDecimal.js';

const useStyles = makeStyles(theme => ({
  cardTitle: {
    color: '#3C4858',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  cardCategory: {
    margin: '0',
    color: '#999999',
  },
  stats: {
    color: '#999999',
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
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '300px', // Ajustar conforme necessário
    width: '100%', // Usar 100% da largura do contêiner pai
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  pieChart: {
    flex: 1,
    height: props => props.chartSize || '80%', // Usar o tamanho fornecido ou 100% por padrão
    width: props => props.chartSize || '80%', // Usar o tamanho fornecido ou 100% por padrão
    [theme.breakpoints.down('sm')]: {
      height: '300px',
      maxHeight: '300px',
      width: '100%',
    },
  },
  table: {
    flex: 1,
    marginLeft: '20px',
    borderCollapse: 'collapse',
    maxWidth: '50%', // Limitar a largura máxima
    width: '100%',
    overflowX: 'auto', // Habilitar scroll horizontal, se necessário
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0',
      marginTop: '20px',
      maxWidth: '100%', // Largura completa em telas pequenas
    },
  },
  
  tableHeader: {
    backgroundColor: '#22518b',
    fontWeight: 'bold',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '8px',
  },
}));

const PieChart = ({
  data,
  labels,
  title,
  subtitle,
  meta,
  numberFormat,
  chartSize,
}) => {
  const classes = useStyles({ chartSize });

  const formatValue = value => {
    if (numberFormat === 'currency') {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    } else if (numberFormat === 'decimal') {
      return formatDecimal(value);
    } else {
      return parseFloat(value).toFixed(2); // ou outra lógica para outros formatos
    }
  };

  // Verifique se 'data' é um array
  if (!Array.isArray(data)) {
    return <div>Dados inválidos</div>;
  }

  const totalValue = data.reduce((acc, value) => acc + value, 0);

  const chartData = data.map((value, index) => ({
    id: labels[index],
    label: labels[index],
    value: value,
    percentage: ((value / totalValue) * 100).toFixed(2),
  }));

  return (
    <Card chart>
      <CardHeader color="info">
        <div className={classes.chartContainer}>
          <div className={classes.pieChart}>
            <ResponsivePie
              data={chartData}
              valueFormat={function(e) {
                return formatValue(e);
              }}
              margin={{ top: 1, right: 1, bottom: 1, left: 1 }} // Margens ajustadas
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'category10' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableRadialLabels={false}
              enableSliceLabels={true}
              sliceLabel={slice =>
                `${slice.id}: ${formatValue(slice.value)} (${
                  slice.data.percentage
                }%)`
              }
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="#333333"
              enableTooltip={true}
              tooltip={({ datum }) => (
                <strong>
                  {datum.label}: {formatValue(datum.value)} (
                  {datum.data.percentage}%)
                </strong>
              )}
            />
          </div>
          <table className={classes.table}>
            <thead className={classes.tableHeader}>
              <tr>
                <th className={classes.tableCell}>Empresa</th>
                <th className={classes.tableCell}>Valor</th>
                <th className={classes.tableCell}>%</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map(entry => (
                <tr key={entry.id}>
                  <td className={classes.tableCell}>{entry.label}</td>
                  <td className={classes.tableCell}>
                    {formatValue(entry.value > 0 ? entry.value : 0)}
                  </td>
                  <td className={classes.tableCell}>
                    {entry.percentage > 0 ? entry.percentage : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardHeader>
      <CardBody>
        <h4 className={classes.cardTitle}>{title}</h4>
        <p className={classes.cardCategory}>{subtitle}</p>
      </CardBody>
      <CardFooter chart>
        <div className={classes.stats}>
          <h3>{meta}</h3>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieChart;
