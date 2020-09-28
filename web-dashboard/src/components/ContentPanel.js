import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function ContentPanel(props) {
  return (
    <Typography component="h2" variant="body1" color="#000000" align="left">
      {props.children}
    </Typography>
  );
}

ContentPanel.propTypes = {
  children: PropTypes.node,
};