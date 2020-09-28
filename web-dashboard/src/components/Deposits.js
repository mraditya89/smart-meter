import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title2 from './Title2';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title2>Jumlah Unit Residensial</Title2>
      <Typography component="p" variant="h3">
        123
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        pada 15 Mei, 2020
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Detail
        </Link>
      </div>
    </React.Fragment>
  );
}