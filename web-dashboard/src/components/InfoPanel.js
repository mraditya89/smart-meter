import React, { Component } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import ContentPanel from './ContentPanel.js';
import api from '../api';


export default function InfoPanel(param) {
  return (
    <React.Fragment>
      <Title>Unit {param.unit.unit_id}</Title>
      <ContentPanel>Unit Id: {param.unit.unit_id}</ContentPanel>
      <ContentPanel>User Id: {param.unit.user_id}</ContentPanel>
      <ContentPanel>Email: {param.unit.email}</ContentPanel>
      <ContentPanel>Alamat: {param.unit.alamat}</ContentPanel>
      <ContentPanel>Kota: {param.unit.kota}</ContentPanel>
      <ContentPanel>Provinsi: {param.unit.provinsi}</ContentPanel>
    </React.Fragment>
  );
}