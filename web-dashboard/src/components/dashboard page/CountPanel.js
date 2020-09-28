import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title2 from '../Title2';

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function ControlPanel(param) {
    const classes = useStyles();
    const dt = new Date();
    return (
        <React.Fragment>
            <Title2>{param.title}</Title2>
            <Typography component="p" variant="h3" align="center" className={classes.depositContext}>
                {param.jumlah}
            </Typography>
            <Typography color="textSecondary">
                {dt.getDate() + "-" + (dt.getMonth()+1).toString() + "-" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes()}
            </Typography>
            {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Detail
        </Link>
      </div> */}
        </React.Fragment>
    );
}