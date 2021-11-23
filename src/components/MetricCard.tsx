import React from "react";
import { Box, makeStyles, CircularProgress } from "@material-ui/core";
import { chartingColors } from '../Features/Charting/Charting'

const useStyles = makeStyles({
  root: {
    padding: '20px',
    border: '1px solid #ddd',
  },
  title: {
    margin: 0
  },
  value: {
    margin: 0,
    fontSize: '2em',
    fontFamily: 'Roboto'
  }
});

interface IMetricCard {
  title: string;
  value: string | number;
  index: number,
};

const MetricCard: React.SFC<IMetricCard> = ({ index = 0, title = '', value = '' }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} style={{ color: chartingColors[index] }}>
      <h4 className={classes.title}>{title}</h4>
      <h4 className={classes.value}>{
        value === ''
          ? <CircularProgress />
          : value
      }</h4>
    </Box>
  );
};

export default MetricCard;