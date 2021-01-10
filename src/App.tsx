import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import useStore from "./Store";
import Value from "./Components/Value";
import FacultyPanel from "./Components/FacultyPanel";
import Routes from "./Routes";
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
}));
const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress size={100} />
    </div>
  );
};
const Content = () => {
  const { account, application } = useStore((state) => ({
    account: state.account!,
    application: state.application!,
  }));
  const classes = useStyles();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Tooltip title={account as string}>
            <Typography variant="h6" className={classes.title}>
              Your address is {(account as string).slice(0, 10)}...
            </Typography>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box margin={2}>
          <Grid container>
            <Grid item sm={12} md={8}>
              <Routes />
            </Grid>
            <Grid item sm={12} md={4}>
              <Box margin={1} padding={1}>
                <Value
                  value={application.faculties!}
                  params={[account]}
                  topic="myFaculty"
                >
                  {(faculty) => <FacultyPanel address={faculty} />}
                </Value>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
const App = () => {
  const { initialized } = useStore();
  return initialized ? <Content /> : <Loading />;
};
export default App;
