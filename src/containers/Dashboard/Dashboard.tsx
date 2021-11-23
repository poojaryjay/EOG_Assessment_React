import React from 'react';
import { Grid } from '@material-ui/core';
import useStyles from "./useStyles";
import Filters from '../../Features/Filters/Filters';
import Charting from '../../Features/Charting/Charting';
import Metrics from '../../Features/Metrics/Metrics';
import { Provider as UqrlProvider, createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Subscription from '../../Features/Subscription/Subscription';

// websocket grpahql client
const subscriptionClient = new SubscriptionClient(
  'wss://react.eogresources.com/graphql',
  {
    reconnect: true,
    timeout: 20000
  }
);
// URQL client for graphQL subscription 
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

const Dashboard = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={8} className={classes.content}>
        <UqrlProvider value={client}>
          {/* Dropdown filter */}
          <Filters />
          {/* Metric tiles for showing latest value */}
          <Metrics />
          {/* Chart for showing graph data */}
          <Charting />
          <Subscription />
        </UqrlProvider>
      </Grid>
    </Grid>
  );
};

export default Dashboard;