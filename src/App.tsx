import {
  Box,
  Container,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStore, { inboxEvents, EventData } from "./contract";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
const theme = createMuiTheme({});
function App() {
  const classes = useStyles();
  const { selectedAccount, message, setMessage } = useStore();
  const [events, setEvents] = useState<EventData[]>([]);
  useEffect(() => {
    inboxEvents().then((events) => {
      setEvents(events);
    });
  }, [message]);
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Tooltip title={selectedAccount!}>
              <Typography variant="h6" className={classes.title}>
                Your address is {selectedAccount?.slice(0, 10)}...
              </Typography>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Box my={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Last message is: <br />
              {message}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMessage("new message " + Math.random())}
          >
            generate new message
          </Button>
        </Container>
        <Container maxWidth="md">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell variant="head">Previous Message</TableCell>
                <TableCell variant="head">Next Message</TableCell>
                <TableCell variant="head">Transaction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.reverse().map((event) => (
                <TableRow>
                  <TableCell>{event.returnValues.prevMessage}</TableCell>
                  <TableCell>{event.returnValues.message}</TableCell>
                  <TableCell>
                    <Tooltip title={event.transactionHash}>
                      <Typography>
                        {event.transactionHash.slice(0, 15)}...
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
