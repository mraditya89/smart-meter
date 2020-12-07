import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title2 from "../Title2";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

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
  const dt = new Date().toLocaleString();
  return (
    <React.Fragment>
      <Title2>{param.title}</Title2>
      <Typography
        component="p"
        variant="h3"
        align="center"
        className={classes.depositContext}
      >
        {param.jumlah}
      </Typography>
      <div style={{ display: "flex" }}>
        {/* <AccessTimeIcon style={{ fontSize: "1.3em", marginRight: "0.2em" }} /> */}
        <Typography color="textSecondary">{dt}</Typography>
      </div>
    </React.Fragment>
  );
}
