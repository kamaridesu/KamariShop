import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../Components/Home/Home";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";
import { Admin } from "../Components/Admin/Admin";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import { ErrorHandler } from "../Errors/ErrorHandler";

export const Router = () => {
  return (
    <ErrorHandler>
      <Switch>
        <PublicRoute exact path="/" component={Home} />
        <AdminRoute
          exact
          path="/products"
          component={Admin}
          roles={["admin"]}
        />
        <Route>
          <ErrorPage errorCode={404} message={"Not Found"} />;
        </Route>
      </Switch>
    </ErrorHandler>
  );
};
