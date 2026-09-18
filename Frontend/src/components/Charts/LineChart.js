import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import Card from '../Card/Card.js';
import CardHeader from '../Card/CardHeader.js';
import CardBody from '../Card/CardBody.js';
import CardFooter from '../Card/CardFooter.js';
import { makeStyles } from '@material-ui/core/styles';
import formatDecimal from '../../utils/formatDecimal.js';

const useStyles = makeStyles({
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
});

const LineChart = ({ data, labels, title, subtitle, meta }) => {
  const classes = useStyles();

  const chartData = [
    {
      id: '',
      data: data.map((value, index) => ({ x: labels[index], y: value })),
    },
  ];

  return (
    <Card chart>
      <CardHeader color="warning">
        <div style={{ height: 300 }}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: -40,
              legendPosition: 'middle',
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enablePointLabel={true} 

            pointLabelYOffset={-12}
            useMesh={true}
            tooltip={({ point }) => (
              <div
                style={{
                  color: point.serieColor,
                  background: 'white',
                  padding: '5px 10px',
                  border: '1px solid #ccc',
                }}
              >
                <strong>
                  {point.data.xFormatted}: {formatDecimal(point.data.y)}
                </strong>
              </div>
            )}
            // Formatação fixa para o eixo Y
            yFormat={value => `R$ ${formatDecimal(value)}`}
            // Formatação fixa para os valores dos pontos
            pointLabel={d => `R$ ${formatDecimal(d.y)}`}
          />
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

export default LineChart;
