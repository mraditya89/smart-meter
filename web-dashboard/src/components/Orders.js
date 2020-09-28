import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import api from '../api';

// Generate Order Data
function createData(id, unitId, condition, credit, address) {
  return { id, unitId, condition, credit, address };
}

const rows = [
  createData(0, '1', 'Aktif', 20.5, 'Bandung Kota'),
  createData(1, '2', 'Aktif', 12.3, 'Jakarta Selatan'),
  createData(2, '3', 'Mati', 0, 'Balikpapan'),
  createData(3, '4', 'Aktif', 3, 'Palembang'),
  createData(4, '5', 'Mati', 101.4, 'Surabaya')
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Unit Residensial</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{fontWeight: 'bold'}}>Unit Id</TableCell>
            <TableCell align="center" style={{fontWeight: 'bold'}}>Kondisi</TableCell>
            <TableCell align="center" style={{fontWeight: 'bold'}}>Pulsa (kWh)</TableCell>
            <TableCell align="center" style={{fontWeight: 'bold'}}>Alamat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.unitId}</TableCell>
              <TableCell align="center">{row.condition}</TableCell>
              <TableCell align="center">{row.credit}</TableCell>
              <TableCell align="center">{row.address}</TableCell>
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
  );
}