import React from "react";
import Box from "@material-ui/core/Box";
import FacultiesList from "../Components/FacultiesList";
import InstitutionsList from "../Components/InstitutionsList";
const Home = () => {
  return (
    <Box margin={1} padding={1}>
      <InstitutionsList />
      <FacultiesList />
    </Box>
  );
};
export default Home;
