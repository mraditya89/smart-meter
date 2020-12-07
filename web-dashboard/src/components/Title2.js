import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import OfflineBoltIcon from "@material-ui/icons/OfflineBolt";
import FlashOffIcon from "@material-ui/icons/FlashOff";
import BlurOffIcon from "@material-ui/icons/BlurOff";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

const ICON = {
  "Unit Total": (
    <HomeIcon
      style={{ fontSize: "1.6em", marginRight: "0.2em", marginTop: "5px" }}
      color="primary"
    />
  ),
  "Unit Menyala": (
    <EmojiObjectsIcon
      style={{ fontSize: "1.6em", marginRight: "0.2em", marginTop: "5px" }}
      color="primary"
    />
  ),
  "Unit Mati": (
    <FlashOffIcon
      style={{ fontSize: "1.6em", marginRight: "0.2em", marginTop: "5px" }}
      color="primary"
    />
  ),
  "Unit Tempered": (
    <BlurOffIcon
      style={{ fontSize: "1.6em", marginRight: "0.2em", marginTop: "5px" }}
      color="primary"
    />
  ),
};
const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Title2(props) {
  const classes = useStyles();
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      {ICON[props.children]}
      <div>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          className={classes.depositContext}
        >
          {props.children}
        </Typography>
      </div>
    </div>
  );
}

Title2.propTypes = {
  children: PropTypes.node,
};
