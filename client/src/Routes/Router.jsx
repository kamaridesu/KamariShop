import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Home } from "../Components/Home/Home";
import { Navigation } from "../Components/Navigation/Navigation";
import { NoMatch } from "../Components/Nomatch/NoMatch";

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <>
          <Navigation />
          <Route exact path="/" component={Home} />
        </>
        <Route component={NoMatch} />
      </Switch>
    </BrowserRouter>
  );
};
