import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../Components/Home/Home";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";
import { Products } from "../Components/Admin/Products";
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
          component={Products}
          roles={["admin"]}
        />
        <Route>
          <ErrorPage errorCode={404} message={"Not Found"} />;
        </Route>
      </Switch>
    </ErrorHandler>
  );
};
