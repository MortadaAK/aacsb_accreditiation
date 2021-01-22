import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import useStore from "../Store";
import Paginate from "./Paginate";
import Value from "./Value";
const FacultiesList = () => {
  const { facultiesManager, faculty } = useStore((state) => ({
    facultiesManager: state.facultiesManager,
    faculty: state.faculty,
  }));
  return (
    <Box>
      <AppBar position="relative">
        <Toolbar>
          <Typography>Faculties</Typography>
        </Toolbar>
      </AppBar>
      <Paginate
        length={facultiesManager?.facultiesLength!}
        caller={facultiesManager?.listFaculties!}
        contractBuilder={faculty}
        prefix="/faculties"
        topic="FACULTY"
      >
        {(faculty) => <Value value={faculty?.name} />}
      </Paginate>
    </Box>
  );
};

export default FacultiesList;
