import React, { Component } from "react";
import api from "../api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { Redirect, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

class UnitTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
      redirect: false,
      path: "",
    };
  }

  componentDidMount = async () => {
    await api
      .getUnits()
      .then((res) => {
        this.setState({
          units: res.data.data,
        });
      })
      .catch((e) => {
        console.log(e);
        alert("Session timeout, please re login");
        localStorage.removeItem("token");
        this.handleOnClick(`/`);
      });
  };

  handleOnClick = (link) => {
    this.setState({
      redirect: true,
      path: link,
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.path} />;
    }
    let statusMeteran = [];
    if (this.state.units.length > 0) {
      this.state.units.map((row, rowIndex) => {
        if (row.status_code == 0) {
          statusMeteran[rowIndex] = "Off";
        } else {
          statusMeteran[rowIndex] = "On";
        }
      });
    }
    return (
      <React.Fragment>
        <Title>Unit Residensial</Title>
        <Table size="small" style={{ marginTop: "15px" }}>
          <TableHead>
            <TableRow style={{ backgroundColor: "#1565c0" }}>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                Unit Id
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                User Id
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                Kondisi
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                Kota
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.units.map((row, rowIndex) => (
              <TableRow
                key={row.unit_id}
                hover
                onClick={() => {
                  this.handleOnClick(`/unit-page/${row.unit_id}`);
                }}
                style={{
                  backgroundColor: rowIndex % 2 !== 0 ? "#e3f2fd" : "",
                }}
              >
                <TableCell align="center" style={{ padding: "13px" }}>
                  {row.unit_id}
                </TableCell>
                <TableCell align="center" style={{ padding: "13px" }}>
                  {row.user_id}
                </TableCell>
                <TableCell align="center" style={{ padding: "13px" }}>
                  <Button
                    variant="contained"
                    color={
                      statusMeteran[rowIndex] === "On" ? "primary" : "secondary"
                    }
                    style={{ padding: "2px 5px" }}
                  >
                    {statusMeteran[rowIndex] === "On" ? (
                      <EmojiObjectsIcon
                        style={{ fontSize: "1.5em", marginRight: "0.2em" }}
                      />
                    ) : (
                      <HighlightOffIcon
                        style={{ fontSize: "1.5em", marginRight: "0.2em" }}
                      />
                    )}
                    {statusMeteran[rowIndex]}
                  </Button>
                </TableCell>
                <TableCell align="center" style={{ padding: "13px" }}>
                  {row.kota}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default UnitTable;
