import { Route } from "react-router-dom";
import { withNavigation } from "../Components/Navigation/withNavigation";

export default (props) => {
  return withNavigation(Route, props);
};
