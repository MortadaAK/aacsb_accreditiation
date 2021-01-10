import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import useStore from "../Store";
import Value from "./Value";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { TextField } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const Panel = ({ address }: { address: string }) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const { faculty: getFaculty, instition: getInstition, account } = useStore();
  return (
    <Value value={getFaculty} params={[address]}>
      {(faculty) => {
        if (faculty) {
          return (
            <Card className={classes.root}>
              <CardHeader
                titleTypographyProps={{ component: "span" }}
                title={
                  <Value topic="Faculty" value={faculty.name}>
                    {(name) => {
                      setName(name!);
                      return <>{name}</>;
                    }}
                  </Value>
                }
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  <Value value={faculty.currentInstitution}>
                    {(address) => (
                      <Value
                        value={
                          address ? () => getInstition(address) : undefined
                        }
                      >
                        {(instition) => (
                          <Value value={instition?.name}>
                            {(name) => {
                              return <>Institution: {name}</>;
                            }}
                          </Value>
                        )}
                      </Value>
                    )}
                  </Value>
                </Typography>
              </CardContent>
              <Value value={faculty.allowed} params={[account]}>
                {(allowed) =>
                  allowed ? (
                    <CardActions disableSpacing>
                      <Form name={name} title="Edit" action={faculty.update} />
                    </CardActions>
                  ) : null
                }
              </Value>
            </Card>
          );
        } else {
          return <></>;
        }
      }}
    </Value>
  );
};
const Form = ({
  title,
  action,
  name: initialName = "",
}: {
  title: string;
  name?: string;
  action: (name: string, opts: any) => Promise<any>;
}) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(initialName);
  const { account, notify } = useStore();
  useEffect(() => {
    setName(initialName);
  }, [initialName]);
  const handleClose = () => {
    setVisible(false);
  };
  const handleSave = () => {
    action(name, { from: account }).then(() => {
      handleClose();
      notify("myFaculty");
    });
  };
  return (
    <>
      <Button variant="contained" onClick={() => setVisible(true)}>
        {title}
      </Button>
      {visible && (
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={visible}
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
const Register = () => {
  const { application } = useStore();

  return (
    <Form title="Register as Faculty" action={application?.createFaculty!} />
  );
};
const FacultyPanel = ({ address }: { address: string | undefined }) => {
  if (address) {
    return <Panel address={address} />;
  } else {
    return <Register />;
  }
};
export default FacultyPanel;
