import {
  AppBar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
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
import CertificateListItem from "../Components/CertificateListItem";
import FacultySelect, { FacultyRecord } from "../Components/FacultySelect";
import { Degree, DegreeSelect } from "../Degree";
const ModifierBuilder = (address: string) => Promise.resolve(address);
const DepartmentBuilder = (department: { id: BN; name: string }) =>
  Promise.resolve(department);
const Space = () => <div style={{ flexGrow: 1 }}></div>;

const AuthorizedAddresses = ({
  institution,
}: {
  institution: InstitutionInstance;
}) => {
  const account = useStore((state) => state.account);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddress("");
  };
  const handleSave = async () => {
    await institution.addModifier(address, { from: account });
    handleClose();
  };
  const remove = (address: string) => async () => {
    await institution.removeModifier(address, { from: account });
    handleClose();
  };

  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar>
          <Badge
            badgeContent={
              <Value
                topic={`INSTITUTION|${institution.address}`}
                value={institution.modifiersLength}
              />
            }
            color="primary"
          >
            <Typography>Authorized Addresses</Typography>
          </Badge>
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
        topic={`INSTITUTION|${institution.address}`}
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
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogContent dividers>
            <TextField
              fullWidth
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
  const account = useStore((state) => state.account);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
  };
  const handleSave = async () => {
    await institution.createStaffMember(name, { from: account });
    handleClose();
  };
  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar>
          <Badge
            color="primary"
            badgeContent={
              <Value
                topic={`INSTITUTION|${institution.address}`}
                value={institution.staffMembersLength}
              />
            }
          >
            <Typography>Staff Members</Typography>
          </Badge>
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
        topic={`INSTITUTION|${institution.address}`}
      >
        {(department) => (
          <ListItemText>
            <Typography>{department.name}</Typography>
          </ListItemText>
        )}
      </Paginate>
      {open && (
        <Dialog
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogContent dividers>
            <TextField
              fullWidth
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
const PendingCertificates = ({
  institution,
}: {
  institution: InstitutionInstance;
}) => {
  const { account, application, certificatesManager } = useStore((state) => ({
    account: state.account!,
    application: state.application!,
    certificatesManager: state.certificatesManager!,
  }));

  const [degree, setDegree] = useState(Degree.InstructionalPractitioner);
  const [open, setOpen] = useState(false);
  const [faculty, setFaculty] = useState<FacultyRecord | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFaculty(null);
  };
  const handleSave = async () => {
    if (faculty) {
      await certificatesManager.requestCertificate(
        faculty.address,
        institution.address,
        degree,
        { from: account }
      );
      handleClose();
    }
  };
  if (application) {
    return (
      <>
        <AppBar position="relative" color="secondary">
          <Toolbar>
            <Badge
              badgeContent={
                <Value
                  topic={`INSTITUTION|${institution.address}`}
                  value={institution.pendingCertificatesLength}
                />
              }
              color="primary"
            >
              <Typography>Pending Certificates</Typography>
            </Badge>
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
          caller={institution.pendingCertificates}
          length={institution.pendingCertificatesLength}
          topic={`INSTITUTION|${institution.address}`}
          contractBuilder={(address: string) => Promise.resolve(address)}
        >
          {(address) => <CertificateListItem certificateAddress={address} />}
        </Paginate>
        {open && (
          <Dialog
            fullWidth
            maxWidth="sm"
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogContent dividers>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <DegreeSelect
                    value={degree}
                    onChange={(degree) => setDegree(degree)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FacultySelect
                    faculty={faculty}
                    onChange={(faculty) => faculty && setFaculty(faculty)}
                  />
                </Grid>
              </Grid>
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
  } else {
    return null;
  }
};
const IssuedCertificates = ({
  institution,
}: {
  institution: InstitutionInstance;
}) => {
  const { application } = useStore((state) => ({
    application: state.application,
  }));
  if (application) {
    return (
      <>
        <AppBar position="relative" color="secondary">
          <Toolbar>
            <Badge
              badgeContent={
                <Value
                  topic={`INSTITUTION|${institution.address}`}
                  value={institution.issuedCertificatesLength}
                />
              }
              color="primary"
            >
              <Typography>Issued Certificates</Typography>
            </Badge>
          </Toolbar>
        </AppBar>
        <Paginate
          caller={institution.issuedCertificates}
          length={institution.issuedCertificatesLength}
          contractBuilder={(address: string) => Promise.resolve(address)}
          topic={`INSTITUTION|${institution.address}`}
        >
          {(address) => <CertificateListItem certificateAddress={address} />}
        </Paginate>
      </>
    );
  } else {
    return null;
  }
};
const Institution = () => {
  const { address } = useParams<{ address: string }>();
  const institution = useStore((state) => state.institution);
  return (
    <Value value={institution} params={[address]}>
      {(institution) =>
        institution ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar position="relative">
                <Toolbar>
                  <Value value={institution.name}>
                    {(name) => <Typography>{name}</Typography>}
                  </Value>
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
              <IssuedCertificates institution={institution} />
            </Grid>
            <Grid item xs={12} md={6}>
              <PendingCertificates institution={institution} />
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
