import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Weather from '../Features/Weather/Weather';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  header: {
    borderBottom: '1px solid #ddd',
    background: '#444',
    color: '#fff'
  }
});

export default () => {
  const classes = useStyles();
  return (
    <Box className={classes.header}>
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          EOG React Visualization Assessment
        </Typography>
        <Weather />
      </Toolbar>
    </Box>
  );
};
