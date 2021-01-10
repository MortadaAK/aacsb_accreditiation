import React from "react";
import Box from "@material-ui/core/Box";
import Value from "../Components/Value";
import FacultiesList from "../Components/FacultiesList";
import useStore from "../Store";
const Home = () => {
  const { application } = useStore();
  return (
    <Box margin={1} padding={1}>
      <FacultiesList />
      <Value value={application!.institutionsLength} />
    </Box>
  );
};
export default Home;
