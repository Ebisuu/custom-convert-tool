import React, {Fragment} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import ClientPage from './pages/clientPage';
import HomePage from './pages/homepage';

const Routes = props => (
  <Router>
    <Fragment>
      {/* Homepage */}
      <Route exact path="/"><HomePage clients={props.clients} /></Route>
      <Route exact path="/client/:clientId"><ClientPage clients={props.clients} /></Route>
    </Fragment>
  </Router>
);
export default Routes;
