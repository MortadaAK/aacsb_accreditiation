import React from "react";
import { Switch, Route } from "react-router-dom";
import Faculty from "./Pages/Faculty";
import Institution from "./Pages/Institution";
import Home from "./Pages/Home";
const Routes = () => {
  return (
    <Switch>
      <Route path="/institutions/:address" strict component={Institution} />
      <Route path="/faculties/:address" strict component={Faculty} />
      <Route path="/" strict component={Home} />
    </Switch>
  );
};
export default Routes;
