import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../Context/AuthContextProvider";
import { withNavigation } from "../Components/Navigation/withNavigation";

export const AdminRoute = ({ component: Component, roles, ...rest }) => {
  const { auth } = useAuth();
  if (auth.loading) {
    return null;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.isLoggedIn) {
          return <Redirect to={{ pathname: "/" }} />;
        }

        if (roles && roles.indexOf(auth.user.role) === -1) {
          return <Redirect to={{ pathname: "/" }} />;
        }
        console.log("admin route");
        return <Component {...props} />;
      }}
    />
  );
};

export default (props) => withNavigation(AdminRoute, props);
