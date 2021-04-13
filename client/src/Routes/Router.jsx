import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "../Components/Home/Home";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";
import { Admin } from "../Components/Admin/Admin";
import { PublicRoute } from "./PublicRoute";
import { AdminRoute } from "./AdminRoute";

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute exact path="/" component={Home} />
        <AdminRoute exact path="/admin" component={Admin} roles={["admin"]} />
        <Route component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
