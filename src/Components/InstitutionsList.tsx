import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import useStore from "../Store";
import Paginate from "./Paginate";
import Value from "./Value";
const InstitutionsList = () => {
  const { application, institution } = useStore();
  return (
    <Box>
      <AppBar position="relative">
        <Toolbar>
          <Typography>Institutions</Typography>
        </Toolbar>
      </AppBar>
      <Paginate
        length={application?.institutionsLength!}
        caller={application?.listInstitutions!}
        contractBuilder={institution}
        prefix="/institutions"
      >
        {(institution) => <Value value={institution?.name} />}
      </Paginate>
    </Box>
  );
};

export default InstitutionsList;
