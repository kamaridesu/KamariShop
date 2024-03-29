import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home } from "../Components/Home/Home";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";
import { Products } from "../Components/Admin/Products";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { ErrorHandler } from "../Errors/ErrorHandler";
import { ProductForm } from "../Components/Admin/ProductForm";
import { ProductsScreen } from "../Components/Main/ProductsScreen";
import { ProductScreen } from "../Components/Main/ProductScreen";
import { ResetForm } from "../Components/Main/ResetForm";
import { ProfileForm } from "../Components/Main/ProfileForm";

//este componente es nuestro router para acceder a los distintos urls de la pagina
export const Router = () => {
  return (
    <ErrorHandler>
      <Switch>
        <PublicRoute exact path="/" component={Home} />
        <PublicRoute exact path="/hats/:gender" component={ProductsScreen} />
        <PublicRoute exact path="/hats/:gender" component={ProductsScreen} />
        <PublicRoute exact path="/hats/:gender/:id" component={ProductScreen} />
        <PrivateRoute
          exact
          path="/profile"
          component={ProfileForm}
          roles={["admin", "user"]}
        />
        <PrivateRoute
          exact
          path="/products"
          component={Products}
          roles={["admin"]}
        />
        <PrivateRoute
          exact
          path="/products/productform"
          component={ProductForm}
          roles={["admin"]}
        />
        <PrivateRoute
          exact
          path="/products/editproduct/:id"
          component={ProductForm}
          roles={["admin"]}
        />
        <Route path="/resetpassword/:id/:token">
          <ResetForm />
        </Route>
        <Route>
          <ErrorPage errorCode={404} message={"Not Found"} />;
        </Route>
      </Switch>
    </ErrorHandler>
  );
};
