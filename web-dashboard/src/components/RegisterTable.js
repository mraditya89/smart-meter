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
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteIcon from "@material-ui/icons/Delete";

class RegisterTable extends Component {
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
      .getRegis()
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

  approveHandle = async (body) => {
    await api
      .createUnit(body)
      .then(() => {
        alert("Registrasi unit disetujui");
        window.location.reload();
      })
      .catch((e) => {
        alert(e);
      });
  };

  rejectHandle = async (id) => {
    await api
      .deleteRegis(id)
      .then(() => {
        alert("Registrasi unit ditolak");
        window.location.reload();
      })
      .catch((e) => {
        alert(e);
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.path} />;
    }
    return (
      <div style={{ paddingTop: "20px" }}>
        <Title>Registrasi Unit Baru</Title>
        <Table
          size="small"
          aria-label="custom pagination table"
          style={{ marginTop: "15px" }}
        >
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
                Reg Id
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
                Email
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                Alamat
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                Approve
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  padding: "13px",
                  color: "#e1f5fe",
                }}
              >
                Reject
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.units.map((row, rowIndex) => (
              <TableRow
                key={row.reg_id}
                hover
                style={{
                  backgroundColor: rowIndex % 2 !== 0 ? "#e3f2fd" : "",
                }}
              >
                <TableCell
                  align="center"
                  style={{ width: 160, padding: "13px" }}
                >
                  {row.reg_id}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: 160, padding: "13px" }}
                >
                  {row.user_id}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: 160, padding: "13px" }}
                >
                  {row.email}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: 160, padding: "13px" }}
                >
                  {row.alamat + ", " + row.kota + ", " + row.provinsi}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: 160, padding: "13px" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.approveHandle(row);
                    }}
                    style={{ padding: "3px 10px" }}
                  >
                    <PersonAddIcon
                      style={{ fontSize: "1.3em", marginRight: "0.3em" }}
                    />
                    Approve
                  </Button>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: 160, padding: "13px" }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      this.rejectHandle(row.reg_id);
                    }}
                    style={{ padding: "3px 10px" }}
                  >
                    <DeleteIcon
                      style={{ fontSize: "1.3em", marginRight: "0.3em" }}
                    />{" "}
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <div className={classes.seeMore}>
                    <Link color="primary" href="#" onClick={preventDefault}>
                    See more orders
                    </Link>
                </div> */}
      </div>
    );
  }
}

export default RegisterTable;
