import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import useStore from "../Store";
import Paginate from "./Paginate";
import Value from "./Value";
const InstitutionsList = () => {
  const { instituionsManager, institution } = useStore((state) => ({
    instituionsManager: state.instituionsManager,
    institution: state.institution,
  }));
  return (
    <Box>
      <AppBar position="relative">
        <Toolbar>
          <Typography>Institutions</Typography>
        </Toolbar>
      </AppBar>
      <Paginate
        length={instituionsManager?.institutionsLength!}
        caller={instituionsManager?.listInstitutions!}
        contractBuilder={institution}
        prefix="/institutions"
        topic="INSTITUTION"
      >
        {(institution) => <Value value={institution?.name} />}
      </Paginate>
    </Box>
  );
};

export default InstitutionsList;
