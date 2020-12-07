import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title2 from "./Title2";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 2,
  },
});

export default function SaldoPanel(param) {
  const classes = useStyles();
  let saldo = 0;
  let date = "";
  if (param.data != "" && param.data !== undefined) {
    saldo = param.data.daya_sisa;
    date = param.data.date_time;
  }
  return (
    <React.Fragment>
      <Title2>Saldo</Title2>
      <Typography
        component="p"
        variant="h4"
        align="center"
        className={classes.depositContext}
      >
        {saldo} kWh
      </Typography>
      <Typography color="textSecondary" style={{ fontSize: "12px" }}>
        {date && new Date(date).toLocaleString()}
      </Typography>
      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
            Detail
        </Link>
        </div> */}
    </React.Fragment>
  );
}
