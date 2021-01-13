import { makeStyles } from "@material-ui/core";
import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#00b0ff",
    },
  },
});
const Root = () => {
  const classes = useStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <App />
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default Root;
