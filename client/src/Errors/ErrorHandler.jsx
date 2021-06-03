import { useLocation } from "react-router";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";

//este componente se encarga de cargarnos el fallo adecuado segun el fetch
export const ErrorHandler = ({ children }) => {
  const location = useLocation();

  const errorCode = location.state && location.state["errorStatusCode"];

  switch (errorCode) {
    case 401:
      return <ErrorPage errorCode={errorCode} message={"Unauthorized"} />;
    case 403:
      return <ErrorPage errorCode={errorCode} message={"Forbidden"} />;
    case 404:
      return <ErrorPage errorCode={errorCode} message={"Not Found"} />;
    case 500:
      return <ErrorPage errorCode={errorCode} message={"Server Error"} />;
    default:
      return children;
  }
};
