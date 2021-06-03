import { Route } from "react-router-dom";
import { useAuth } from "../Context/AuthContextProvider";
import { withNavigation } from "../Components/Navigation/withNavigation";
import { useHistory } from "react-router";

//este componente verifica si el usuario esta logueado y el role del usuario antes de permitir el acceso
export const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { auth } = useAuth();
  const history = useHistory();
  if (auth.loading) {
    return null;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.isLoggedIn) {
          return history.replace(history.location.pathname, {
            errorStatusCode: 401,
          });
        }

        if (roles && roles.indexOf(auth.user.role) === -1) {
          return history.replace(history.location.pathname, {
            errorStatusCode: 403,
          });
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default (props) => withNavigation(PrivateRoute, props);
