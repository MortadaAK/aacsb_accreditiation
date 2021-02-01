import {
  Button,
  CardActions,
  CardContent,
  Chip,
  Card,
  ListItem,
  makeStyles,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import Value from "../Components/Value";
import useStore from "../Store";
import { display as displayDegree } from "../Degree";
import CertificateStatus, {
  display as displayStatus,
} from "../CertificateStatus";
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  content: {
    position: "relative",
  },
  badge: { position: "absolute", top: 5, right: 5 },
});

const CertificateListItem = ({
  certificateAddress,
}: {
  certificateAddress: string;
}) => {
  const classes = useStyles();
  const { faculty, institution, account, certificate } = useStore((state) => ({
    faculty: state.faculty,
    institution: state.institution,
    certificate: state.certificate,
    account: state.account,
  }));
  return (
    <Value
      value={certificate}
      params={[certificateAddress]}
      topic={`CERTIFICATE|${certificateAddress}`}
    >
      {(certificate) => {
        if (!certificate) return null;
        const facultyName = (
          <Value value={certificate.faculty}>
            {(facultyAddress) => (
              <Value
                value={faculty}
                params={[facultyAddress]}
                topic={`FACULTY|${facultyAddress}`}
              >
                {(faculty) => <Value value={faculty?.name}></Value>}
              </Value>
            )}
          </Value>
        );
        const institutionName = (
          <Value value={certificate.institution}>
            {(institutionAddress) => (
              <Value
                value={institution}
                params={[institutionAddress]}
                topic={`INSTITUTION|${institutionAddress}`}
              >
                {(institution) => <Value value={institution?.name}></Value>}
              </Value>
            )}
          </Value>
        );
        return (
          <Card className={classes.root}>
            <CardContent component="div" className={classes.content}>
              <ListItem component="div">
                <ListItemText
                  primaryTypographyProps={{ component: "div" }}
                  secondaryTypographyProps={{ component: "div" }}
                  primary={facultyName}
                  secondary={institutionName}
                />
              </ListItem>
              <ListItem component="div">
                <ListItemText
                  primaryTypographyProps={{ component: "div" }}
                  primary={
                    <Value value={certificate.degree}>
                      {(result) => (
                        <Typography>{displayDegree(result)}</Typography>
                      )}
                    </Value>
                  }
                />
              </ListItem>
              <div className={classes.badge}>
                <Value value={certificate.status}>
                  {(result) => <Chip label={displayStatus(result)} />}
                </Value>
              </div>
            </CardContent>
            <CardActions>
              <Value value={certificate.status}>
                {(status) =>
                  status?.toNumber() === CertificateStatus.requested ? (
                    <Value value={certificate.editable} params={[account]}>
                      {(editable) =>
                        editable ? (
                          <>
                            <Button
                              size="small"
                              onClick={async () => {
                                await certificate.approve({
                                  from: account,
                                });
                              }}
                              variant="contained"
                              color="primary"
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              onClick={async () => {
                                await certificate.reject({
                                  from: account,
                                });
                              }}
                              variant="contained"
                            >
                              Reject
                            </Button>
                          </>
                        ) : null
                      }
                    </Value>
                  ) : null
                }
              </Value>
            </CardActions>
          </Card>
        );
      }}
    </Value>
  );
};
export default CertificateListItem;
