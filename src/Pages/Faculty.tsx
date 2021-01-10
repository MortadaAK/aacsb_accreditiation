import React from "react";
import { useParams } from "react-router";
const Faculty = () => {
  const { address } = useParams<{ address: string }>();
  return (
    <>
      Faculty
      <br />
      {address}
    </>
  );
};
export default Faculty;
