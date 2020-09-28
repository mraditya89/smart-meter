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
    flex: 2,
  },
});

export default function DayaPanel(param) {
  const classes = useStyles();
  let totalDaya = 0;
  let lastDate = "-";
  if(param.data.length > 0) {
    lastDate = param.data[param.data.length-1].date_time;
    for(let i = 0; i < param.data.length; i++) {
      totalDaya += param.data[i].daya_pemakaian;
    }
  }
  return (
    <React.Fragment>
        <Title2>Total Penggunaan Daya</Title2>
        <Typography component="p" variant="h4" align="center" className={classes.depositContext}>
            {totalDaya} kWh
        </Typography>
        <Typography color="textSecondary" style={{fontSize: "12px"}}>
            {lastDate}
        </Typography>
        {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
            Detail
        </Link>
        </div> */}
    </React.Fragment>
  );
}