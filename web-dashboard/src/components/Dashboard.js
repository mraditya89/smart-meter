import React, { Component } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import Iframe from "react-iframe";
import api from "../api";
import Chart2 from "./dashboard page/Chart2";
import Chart3 from "./dashboard page/Chart3";
import CountPanel from "./dashboard page/CountPanel";
import { useHistory, Redirect } from "react-router-dom";
import { Icon } from "@material-ui/core";
import Copyright from "./Copyright/Copyright";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 160,
  },
  fixedHeight2: {
    height: 400,
  },
}));

function DashboardFunction(param) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight2);

  const dt = new Date();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard Operator
          </Typography>
          {/* <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3} alignItems={"center"}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Paper className={fixedHeightPaper}>
                {/* <EmojiObjectsIcon
                  color={"primary"}
                  style={{ fontSize: 40, position: "absolute", right: "0px" }}
                /> */}
                <CountPanel title="Unit Total" jumlah={param.jumlah.total} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CountPanel title="Unit Menyala" jumlah={param.jumlah.on} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CountPanel title="Unit Mati" jumlah={param.jumlah.off} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CountPanel
                  title="Unit Tempered"
                  jumlah={param.jumlah.tempered}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper2}>
                <Chart2 datas={param.datas} year={dt.getFullYear()} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper2}>
                <Chart3 location={param.unit_location} />
              </Paper>
            </Grid>

            {/* Chart */}
            {/* <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid> */}

            {/* Recent Deposits */}
            {/* <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid> */}

            {/* MongoDB Chart 1 */}
            {/* <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                <div align="center">
                <Iframe frameBorder="0"
                        width="500x"
                        height="400px"
                        src="https://charts.mongodb.com/charts-project-0-pxjyo/embed/charts?id=8acbe38e-fbc6-4156-b94b-c49a892a9719&theme=light"/>
                </div>
              </Paper>
            </Grid> */}

            {/* MongoDB Chart 2 */}
            {/* <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                <div align="center">
                <Iframe frameBorder="0"
                        width="500x"
                        height="400px"
                        src="https://charts.mongodb.com/charts-project-0-pxjyo/embed/charts?id=c2673dfd-a3cf-4095-bd49-4512fad34dda&theme=light"/>
                </div>
              </Paper>
            </Grid> */}
          </Grid>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jumlah: "",
      data_all: [],
      unit_location: [],
      redirect: false,
      path: "",
    };
  }

  componentDidMount = async () => {
    await api
      .getJumlahUnitBagian()
      .then((res) => {
        this.setState({
          jumlah: res.data.data,
        });
      })
      .catch((e) => {
        console.log(e);
        alert("Session timeout, please re login");
        localStorage.removeItem("token");
        this.handleRedirect("/");
      });
    await api.getCurrentYear().then((res) => {
      this.setState({
        data_all: res.data.data,
      });
    });
    await api.getUnitLocation().then((res) => {
      this.setState({
        unit_location: res.data.data,
      });
    });
  };

  handleRedirect = (link) => {
    this.setState({
      redirect: true,
      path: link,
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.path} />;
    }
    return (
      <DashboardFunction
        jumlah={this.state.jumlah}
        datas={this.state.data_all}
        unit_location={this.state.unit_location}
      />
    );
  }
}
