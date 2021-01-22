import React, { useState } from "react";
import useStore from "../Store";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { TextField } from "@material-ui/core";

const Form = ({
  title,
  action,
}: {
  title: string;
  name?: string;
  action: (name: string, opts: any) => Promise<any>;
}) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const account = useStore((state) => state.account);
  const handleClose = () => {
    setVisible(false);
  };
  const handleSave = () => {
    action(name, { from: account }).then(() => {
      handleClose();
      setName("");
    });
  };
  return (
    <>
      <Button variant="contained" onClick={() => setVisible(true)}>
        {title}
      </Button>
      {visible && (
        <Dialog
          fullWidth
          maxWidth="sm"
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
  const instituionsManager = useStore((state) => state.instituionsManager);
  return (
    <Form
      title="Register Institution"
      action={instituionsManager?.createInstitution!}
    />
  );
};
const InstitutionPanel = () => {
  return <Register />;
};
export default InstitutionPanel;
