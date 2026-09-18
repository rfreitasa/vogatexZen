import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Card from '../Card/Card.js';
import CardHeader from '../Card/CardHeader.js';
import CardBody from '../Card/CardBody.js';
import CardFooter from '../Card/CardFooter.js';
import { makeStyles } from '@material-ui/core/styles';

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
  chartContainer: {
    height: '160px', // Ajuste a altura conforme necessário
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CircularProgressChart = ({ percentage, title, subtitle, meta }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader color="success">
        <div className={classes.chartContainer}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
              textColor: '#3e98c7',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />
        </div>
      </CardHeader>
      <CardBody>
        <h4 className={classes.cardTitle}>{title}</h4>
        <p className={classes.cardCategory}>{subtitle}</p>
      </CardBody>
      <CardFooter>
        <div className={classes.stats}>
          <h3>{meta}</h3>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CircularProgressChart;