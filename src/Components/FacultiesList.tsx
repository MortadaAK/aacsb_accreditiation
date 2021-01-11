import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import useStore from "../Store";
import Paginate from "./Paginate";
import Value from "./Value";
const FacultiesList = () => {
  const { application, faculty } = useStore();
  return (
    <Box>
      <AppBar position="relative">
        <Toolbar>
          <Typography>Faculties</Typography>
        </Toolbar>
      </AppBar>
      <Paginate
        length={application?.facultiesLength!}
        caller={application?.listFaculties!}
        contractBuilder={faculty}
        prefix="/faculties"
      >
        {(faculty) => <Value value={faculty?.name} />}
      </Paginate>
    </Box>
  );
};

export default FacultiesList;
