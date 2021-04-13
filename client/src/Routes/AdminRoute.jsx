import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export const AdminRoute = ({ component: Component, roles, ...rest }) => {
  const { auth } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.isLogged) {
          return <Redirect to={{ pathname: "/" }} />;
        }

        if (roles && roles.indexOf(auth.user.role) === -1) {
          return <Redirect to={{ pathname: "/" }} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};
