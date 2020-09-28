import React, { Component } from 'react';
import api from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { Redirect, useHistory } from 'react-router-dom'

class UnitTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            units: [],
            redirect: false,
            path: '',
        }
    }

    componentDidMount = async () => {
        await api.getUnits().then(res => {
            this.setState({
                units: res.data.data
            })
        }).catch((e) => {
            console.log(e);
            alert("Session timeout, please re login")
            localStorage.removeItem('token')
            this.handleOnClick(`/`)
        })
    }

    handleOnClick = (link) => {
        this.setState({
            redirect: true,
            path: link,
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.path} />;
        }
        let statusMeteran = [];
        if(this.state.units.length > 0) {
            this.state.units.map((row, rowIndex)=>{
                if(row.status_code == 0) {
                    statusMeteran[rowIndex] = 'Off';
                } else {
                    statusMeteran[rowIndex] = 'On';
                }
            })
        }
        return (
            <React.Fragment>
                <Title>Unit Residensial</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Unit Id</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>User Id</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Kondisi</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Kota</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.units.map((row, rowIndex) => (
                            <TableRow key={row.unit_id} hover onClick={() => { this.handleOnClick(`/unit-page/${row.unit_id}`) }}>
                                <TableCell align="center">{row.unit_id}</TableCell>
                                <TableCell align="center">{row.user_id}</TableCell>
                                <TableCell align="center">{statusMeteran[rowIndex]}</TableCell>
                                <TableCell align="center">{row.kota}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <div className={classes.seeMore}>
                    <Link color="primary" href="#" onClick={preventDefault}>
                    See more orders
                    </Link>
                </div> */}
            </React.Fragment>
        )
    }
}

export default UnitTable