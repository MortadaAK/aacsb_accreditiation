import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import React, { useState } from "react";
import { useParams } from "react-router";
import { InstitutionInstance } from "../../types/truffle-contracts";
import Paginate from "../Components/Paginate";
import Value from "../Components/Value";
import useStore from "../Store";
const ModifierBuilder = (address: string) => Promise.resolve(address);
const DepartmentBuilder = (department: { id: BN; name: string }) =>
  Promise.resolve(department);
const Space = () => <div style={{ flexGrow: 1 }}></div>;

const AuthorizedAddresses = ({
  institution,
}: {
  institution: InstitutionInstance;
}) => {
  const { account } = useStore();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [c, render] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddress("");
  };
  const handleSave = async () => {
    await institution.addModifier(address, { from: account });
    render(c + 1);
    handleClose();
  };
  const remove = (address: string) => async () => {
    await institution.removeModifier(address, { from: account });
    render(c + 1);
    handleClose();
  };

  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar>
          <Typography>Authorized Addresses</Typography>
          <Space />
          <Value value={institution.allowed} params={[account]}>
            {(allowed) =>
              allowed ? (
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleOpen}
                >
                  <Add />
                </IconButton>
              ) : null
            }
          </Value>
        </Toolbar>
      </AppBar>
      <Paginate
        caller={institution.listModifiers}
        length={institution.modifiersLength}
        contractBuilder={ModifierBuilder}
      >
        {(address) => (
          <>
            <ListItemText>
              <Tooltip title={address}>
                <Typography>{address.substr(0, 15)}...</Typography>
              </Tooltip>
            </ListItemText>
            <ListItemSecondaryAction>
              <Value
                value={institution.allowedToRemove}
                params={[account, address]}
              >
                {(allowed) => (
                  <>
                    {allowed ? (
                      <IconButton onClick={remove(address)}>
                        <Remove />
                      </IconButton>
                    ) : null}
                  </>
                )}
              </Value>
            </ListItemSecondaryAction>
          </>
        )}
      </Paginate>
      {open && (
        <Dialog
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogContent dividers>
            <TextField
              label="Address"
              value={address}
              onChange={({ target: { value } }) => {
                setAddress(value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

const StaffMembers = ({
  institution,
}: {
  institution: InstitutionInstance;
}) => {
  const { account } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [c, render] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
  };
  const handleSave = async () => {
    await institution.createStaffMember(name, { from: account });
    render(c + 1);
    handleClose();
  };
  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar>
          <Typography>Staff Members</Typography>
          <Space />
          <Value value={institution.allowed} params={[account]}>
            {(allowed) =>
              allowed ? (
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleOpen}
                >
                  <Add />
                </IconButton>
              ) : null
            }
          </Value>
        </Toolbar>
      </AppBar>
      <Paginate
        caller={institution.listStaffMembers}
        length={institution.staffMembersLength}
        contractBuilder={DepartmentBuilder}
        additionalParams={[false]}
      >
        {(department) => (
          <ListItemText>
            <Typography>{department.name}</Typography>
          </ListItemText>
        )}
      </Paginate>
      {open && (
        <Dialog
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogContent dividers>
            <TextField
              label="Name"
              value={name}
              onChange={({ target: { value } }) => {
                setName(value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
const Institution = () => {
  const { address } = useParams<{ address: string }>();
  const { institution } = useStore();
  return (
    <Value value={institution} params={[address]}>
      {(institution) =>
        institution ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar position="relative">
                <Toolbar>
                  <Typography>
                    <Value value={institution.name} />
                  </Typography>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppBar position="relative" color="secondary">
                <Toolbar>
                  <Typography>Faculties</Typography>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={12} md={6}>
              <StaffMembers institution={institution} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppBar position="relative" color="secondary">
                <Toolbar>
                  <Typography>Issued Certificates</Typography>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppBar position="relative" color="secondary">
                <Toolbar>
                  <Typography>Pending Certificates</Typography>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={12} md={6}>
              <AuthorizedAddresses institution={institution} />
            </Grid>
          </Grid>
        ) : null
      }
    </Value>
  );
};
export default Institution;
