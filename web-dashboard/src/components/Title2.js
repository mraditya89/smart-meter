import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  depositContext: {
    // flex: 1,
  },
});

export default function Title2(props) {
  const classes = useStyles();
  return (
    <Typography
      component="h2"
      variant="h6"
      color="primary"
      gutterBottom
      className={classes.depositContext}
    >
      {props.children}
    </Typography>
  );
}

Title2.propTypes = {
  children: PropTypes.node,
};
