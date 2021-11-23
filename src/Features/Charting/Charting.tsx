import React, { useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSelectedMetrics } from '../Metrics/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, } from 'urql';
import { actions } from '../Subscription/reducer';
import { getMeasurements } from '../Filters/selectors';
import { getChartData, IChartData } from './getChartData';
import { Paper } from '@material-ui/core';
import useStyles from './useStyles';
import { getTicks } from './getTicks';
import { getUnits } from './getUnits';
import { tickFormatter } from './tickFormatter';

// graphql query
const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

const timeAgo = () => new Date().getTime() - 34 * 60 * 1000;

// Different colors for each tile
export const chartingColors = [
  '#37B99A',
  '#E8543F',
  '#424852',
  '#238AE6',
  '#595B5D',
  '#7950F2',
  '#DC7921',
];

const Charting = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getSelectedMetrics);
  const measurements = useSelector(getMeasurements);
  const startTime = timeAgo();
  const classes = useStyles();

  // creating the query for fetching the graphql data
  const [result, executeQuery] = useQuery({
    query,
    pause: true,
    variables: {
      input: metrics.map(metric => ({
        metricName: metric.title,
        after: startTime
      }))
    },
  });

  const { data } = result;

  // dispatch the action to fetch the data
  const multipleMeasurementsCallback = useCallback((getMultipleMeasurements) => {
    dispatch(actions.multipleMeasurementRecieved(getMultipleMeasurements));
  }, [dispatch]);

  useEffect(() => {
    // execute the query whenever the metrics are added/removed.
    executeQuery();
    // eslint-disable-next-line
  }, [metrics.length]);

  useEffect(() => {
    if (data && data.getMultipleMeasurements && data.getMultipleMeasurements.length === metrics.length) {
      multipleMeasurementsCallback(data.getMultipleMeasurements);
    }
  }, [data, metrics.length, multipleMeasurementsCallback]);

  // convert the subscription data as per the charting options
  const chartData: IChartData[] = getChartData(measurements, metrics.map(m => m.title));

  if (!chartData.length) return null;

  const firstTick = +chartData[0].name;
  const lastTick = +chartData[chartData.length - 1].name;
  const ticks = getTicks(firstTick, lastTick);
  const units = getUnits(measurements);

  return (
    chartData.length
      ? (
        <Paper className={classes.wrapper}>
          <ResponsiveContainer height={500}>
            <LineChart
              data={chartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                scale="time"
                ticks={ticks}
                type="number"
                interval="preserveStartEnd"
                tickFormatter={tick => tickFormatter(+tick)}
                domain={[firstTick, lastTick]}
              />
              {
                metrics.map((m, i) => (
                  <YAxis
                    key={m.title}
                    unit={units[m.title]}
                    yAxisId={`left${i + 1}`}
                    orientation="left"
                  />
                ))
              }
              <Tooltip labelFormatter={(label) => <span>{new Date(+label).toString()}</span>} />
              <Legend />
              {
                metrics.map((m, i) => (
                  <Line
                    key={m.title}
                    unit={units[m.title]}
                    yAxisId={`left${i + 1}`}
                    dataKey={m.title}
                    stroke={chartingColors[i]}
                    activeDot={{ r: 8 }}
                    dot={false}
                  />
                ))
              }
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )
      : null
  )
}

export default React.memo(Charting);
