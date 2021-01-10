import React from "react";
import useStore from "../Store";
import Paginate from "./Paginate";
import Value from "./Value";
const FacultiesList = () => {
  const { application, faculty } = useStore();
  return (
    <Paginate
      length={application?.facultiesLength!}
      caller={application?.listFaculties!}
      contractBuilder={faculty}
      prefix="/faculties"
    >
      {(faculty) => <Value value={faculty?.name} />}
    </Paginate>
  );
};

export default FacultiesList;
