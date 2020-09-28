import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import UnitList from './components/UnitList.js';
import UnitPage from './components/UnitPage.js';
import Login from './components/Login.js';
import TransaksiPage from './components/TransaksiPage';
import LastYearPage from './components/LastYearPage';
import RegisterList from './components/RegisterList';

function App() {
  return (
    <Router>
      {/* <Redirect to="/dashboard" /> */}
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/unit-list" exact component={UnitList} />
        <Route path="/unit-page/:id" exact component={UnitPage} />
        <Route path="/transaksi" exact component={TransaksiPage} />
        <Route path="/last-year" exact component={LastYearPage} />
        <Route path="/register" exact component={RegisterList} />
      </Switch>
    </Router>
  );
}

export default App;
