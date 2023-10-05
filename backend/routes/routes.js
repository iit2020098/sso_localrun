import React from "react";
import { Route, Switch } from "react-router-dom";
import Signup from "../../login-signup/src/components/Signup/Signup";
import Signin from "../../login-signup/src/components/Signup/Signup";
import FirstVisit from "../../login-signup/src/components/FirstVisit/FirstVisit"

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route path="/SignIn" component={Signin} />
      <Route path="/FirstVisit" component={FirstVisit} />
      {/* Add more routes as needed */}
    </Switch>
  );
};

export default Routes;
