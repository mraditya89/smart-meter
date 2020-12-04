import React from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import xirkaLogo from "../../assets/img/xirka-logo.png";
import itbLogo from "../../assets/img/itb.png";

const Copyright = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src={xirkaLogo}
          alt="xirka"
          style={{ marginRight: "10px", height: "35px" }}
        />
        <img src={itbLogo} alt="itb" style={{ height: "35px" }} />
      </div>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" /*href="https://material-ui.com/"*/>
          Dashboard Meteran
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
};

export default Copyright;
