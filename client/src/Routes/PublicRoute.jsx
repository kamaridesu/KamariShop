import { Navigation } from "../Components/Navigation/Navigation";
import { Route } from "react-router-dom";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const component = (props) => (
    <>
      <Navigation />
      <Component {...props} />
    </>
  );
  return <Route {...rest} component={component} />;
};
