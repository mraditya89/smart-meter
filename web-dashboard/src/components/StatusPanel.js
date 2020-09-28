import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title2 from './Title2';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const apiUrl = 'https://api-meteran-dashboard.herokuapp.com/api/relay'
const apiUrlCheck = 'https://api-meteran-dashboard.herokuapp.com/api'

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  depositContext: {
    flex: 2,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 0),
  },
}));

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export default function StatusPanel(param) {
  const classes = useStyles();
  const history = useHistory();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState('');

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  let statusMeteran = '-';
  let relayText = '-';
  let ison = 1;
  if (param.unit.status_code == 0 || param.unit.status_code == 2) {
    if (param.unit.status_code == 0) {
      statusMeteran = 'Off';
    } else if (param.unit.status_code == 2) {
      statusMeteran = 'Off (Tempered)';
    }
    relayText = 'Nyalakan';
    ison = 1;
  } else {
    if (param.unit.status_code == 1) {
      statusMeteran = 'On';
    } else if (param.unit.status_code == 3) {
      statusMeteran = 'On (Tempered)';
    }
    relayText = 'Matikan';
    ison = 0;
  }

  const passwordValidate = async () => {
    await axios.get(`${apiUrlCheck}/check-operator/${user}/${password}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).then(res => {
      console.log(res)
      if (res.data.isValid == true) {
        relayConfirm();
        closeModal()
      } else {
        window.alert('Password salah !')
        closeModal()
      }
    }).catch((e, res) => {
      console.log(e)
      alert("Wrong user or password");
      closeModal()
    })
  }

  const relayConfirm = () => {
    if (param.unit.status_code == 0) {
      if (param.unit.last_modified_by == 2) {
        window.alert('Saldo dari unit meteran habis')
      } else if (param.unit.last_modified_by == 3) {
        window.alert('Beban dari unit meteran berlebih')
      } else {
        //var ask = window.confirm(relayText + ' meteran ?');
        // if (ask) {
        //   relayFunction()
        // }
        relayFunction()
      }
    } else {
      //var ask = window.confirm(relayText + ' meteran ?');
      // if (ask) {
      //   relayFunction()
      // }
      relayFunction()
    }
  }
  const relayFunction = async () => {
    axios.post(`${apiUrl}`, null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'op_code': 5,
        'id': param.unit.unit_id,
        'ison': ison,
        'rcode': 1
      }
    }).then((res) => {
      console.log(res)
      window.alert('Perintah berehasil dilakukan, mohon tunggu data terudate')
      history.push('/dashboard')
    }).catch((e) => {
      console.log(e)
      window.alert(e)
    })
  }

  return (
    <React.Fragment>
      <Title2>Status Unit Meteran</Title2>
      <Typography component="p" variant="h4" align="center" className={classes.depositContext}>
        {statusMeteran}
      </Typography>
      <Typography color="textSecondary">
        last modified by : {param.unit.last_modified_by}
      </Typography>
      <div>
        <Link color="primary" onClick={() => { openModal() }}>
          {relayText}
        </Link>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h3 align="center">Masukan ulang password untuk melanjutkan</h3>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user"
              label="User"
              name="user"
              autoComplete="user"
              autoFocus
              onChange={(text) => {
                setUser(text.target.value)
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(text) => {
                setPassword(text.target.value)
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(event) => {
                event.preventDefault()
                passwordValidate()
              }}
            >
              Confirm
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(event) => {
                event.preventDefault()
                closeModal()
              }}
            >
              Cancel
            </Button>
          </form>
        </Modal>
      </div>
    </React.Fragment>
  );
}