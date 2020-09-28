import React, { Component } from 'react';
import api from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { Redirect, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class RegisterTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            units: [],
            redirect: false,
            path: '',
        }
    }

    componentDidMount = async () => {
        await api.getRegis().then(res => {
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

    approveHandle = async (body) => {
        await api.createUnit(body).then(()=>{
            alert("Registrasi unit disetujui")
            window.location.reload()
        }).catch(e=>{
            alert(e)
        })
    }

    rejectHandle = async (id) => {
        await api.deleteRegis(id).then(()=>{
            alert("Registrasi unit ditolak")
            window.location.reload()
        }).catch(e=>{
            alert(e)
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.path} />;
        }
        return (
            <React.Fragment>
                <Title>Registrasi Unit Baru</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Reg Id</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>User Id</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Alamat</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Approve</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Reject</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.units.map((row, rowIndex) => (
                            <TableRow key={row.reg_id} hover>
                                <TableCell align="center">{row.reg_id}</TableCell>
                                <TableCell align="center">{row.user_id}</TableCell>
                                <TableCell align="center">{row.email}</TableCell>
                                <TableCell align="center">{row.alamat + ", " + row.kota + ", " + row.provinsi}</TableCell>
                                <TableCell align="center">
                                    <Button onClick={()=>{this.approveHandle(row)}}>Approve</Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button onClick={()=>{this.rejectHandle(row.reg_id)}}>Reject</Button>
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
            </React.Fragment>
        )
    }
}

export default RegisterTable