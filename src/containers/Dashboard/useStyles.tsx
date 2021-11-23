import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  sidebar: {
    height: '100vh',
    background: '#3B79F2'
  },
  content: {
    padding: 30,
    margin: 'auto',
    borderLeft: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    minHeight: 'calc(100vh - 64px)',
    background: '#ffffff'
  }
}));

export default useStyles;