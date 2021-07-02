import {
  AppBar,
  Badge,
  Button,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FacultyInstance } from "../../types/truffle-contracts";
import Paginate from "../Components/Paginate";
import Value from "../Components/Value";
import useStore from "../Store";
import CertificateListItem from "../Components/CertificateListItem";
import { useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
const IssuedCertificates = ({ faculty }: { faculty: FacultyInstance }) => {
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
                  topic={`FACULTY|${faculty.address}`}
                  value={faculty.certificatesLength}
                />
              }
              color="primary"
            >
              <Typography>Issued Certificates</Typography>
            </Badge>
          </Toolbar>
        </AppBar>
        <Paginate
          caller={faculty.listCertificates}
          length={faculty.certificatesLength}
          contractBuilder={(address: string) => Promise.resolve(address)}
          topic={`FACULTY|${faculty.address}`}
        >
          {(address) => <CertificateListItem certificateAddress={address} />}
        </Paginate>
      </>
    );
  } else {
    return null;
  }
};
const PendingCertificates = ({ faculty }: { faculty: FacultyInstance }) => {
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
                  topic={`FACULTY|${faculty.address}`}
                  value={faculty.pendingCertificatesLength}
                />
              }
              color="primary"
            >
              <Typography>Pending Certificates</Typography>
            </Badge>
          </Toolbar>
        </AppBar>
        <Paginate
          caller={faculty.pendingCertificates}
          length={faculty.pendingCertificatesLength}
          contractBuilder={(address: string) => Promise.resolve(address)}
          topic={`FACULTY|${faculty.address}`}
        >
          {(address) => <CertificateListItem certificateAddress={address} />}
        </Paginate>
      </>
    );
  } else {
    return null;
  }
};
const Faculty = () => {
  const { address } = useParams<{ address: string }>();
  const { faculty, institutionBuilder } = useStore((state) => ({
    faculty: state.faculty,
    institutionBuilder: state.institution,
  }));
  return (
    <Value value={faculty} params={[address]}>
      {(faculty) =>
        faculty ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar position="relative">
                <Toolbar>
                  <Value value={faculty.name}>
                    {(name) => <Typography>Faculty: {name}</Typography>}
                  </Value>
                  <div style={{ flex: 1 }}></div>
                  <Value
                    value={faculty.currentInstitution}
                    topic={`FACULTY|${faculty.address}`}
                  >
                    {(address) =>
                      address ? (
                        <Value value={institutionBuilder} params={[address]}>
                          {(institution) => (
                            <Value value={institution?.name}>
                              {(name) => (
                                <Button
                                  color="inherit"
                                  component={RouterLink}
                                  to={`/institutions/${institution?.address}`}
                                >
                                  {name}
                                </Button>
                              )}
                            </Value>
                          )}
                        </Value>
                      ) : null
                    }
                  </Value>
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={12} md={6}>
              <IssuedCertificates faculty={faculty} />
            </Grid>
            <Grid item xs={12} md={6}>
              <PendingCertificates faculty={faculty} />
            </Grid>
          </Grid>
        ) : null
      }
    </Value>
  );
};
export default Faculty;
