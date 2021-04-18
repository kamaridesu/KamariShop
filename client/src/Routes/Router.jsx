import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../Components/Home/Home";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";
import { Products } from "../Components/Admin/Products";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import { ErrorHandler } from "../Errors/ErrorHandler";
import { ProductForm } from "../Components/Admin/ProductForm";

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
        <AdminRoute
          exact
          path="/products/productform"
          component={ProductForm}
          roles={["admin"]}
        />
        <AdminRoute
          exact
          path="/products/editproduct/:id"
          component={ProductForm}
          roles={["admin"]}
        />
        <Route>
          <ErrorPage errorCode={404} message={"Not Found"} />;
        </Route>
      </Switch>
    </ErrorHandler>
  );
};
