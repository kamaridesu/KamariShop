import { Route } from "react-router-dom";
import { withNavigation } from "../Components/Navigation/withNavigation";

//este componente lo empleamos como ruta publica
export default (props) => {
  return withNavigation(Route, props);
};
