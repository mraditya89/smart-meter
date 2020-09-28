import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RefreshIcon from '@material-ui/icons/Refresh';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Link } from 'react-router-dom'

export const mainListItems = (
  <div>

    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>

    <Link to="/unit-list" style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Unit" />
      </ListItem>
    </Link>

    <Link to="/transaksi" style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Transaksi" />
      </ListItem>
    </Link>

    <Link to="/register" style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Register Unit" />
      </ListItem>
    </Link>

    <ListItem button onClick={()=>{window.location.reload()}}>
      <ListItemIcon>
        <RefreshIcon />
      </ListItemIcon>
      <ListItemText primary="Refresh Data" />
    </ListItem>

    <Link to="/" style={{ textDecoration: 'none' }}>
      <ListItem button onClick={()=>localStorage.removeItem('token')}>
        <ListItemIcon>
          <ArrowBackIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </Link>

  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Arsip</ListSubheader>
    <Link to="/last-year" style={{ textDecoration: 'none' }}>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Tahun lalu" />
      </ListItem>
    </Link>
    {/* <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current year" />
    </ListItem> */}
  </div>
);