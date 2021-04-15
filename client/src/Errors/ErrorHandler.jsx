import { useLocation } from "react-router";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";

export const ErrorHandler = ({ children }) => {
  const location = useLocation();

  const errorCode = location.state && location.state["errorStatusCode"];

  switch (errorCode) {
    case 403:
      return <ErrorPage errorCode={errorCode} message={"Forbidden"} />;
    case 404:
      return <ErrorPage errorCode={errorCode} message={"Not Found"} />;
    case 500:
      return <ErrorPage value={(errorCode, "Server Error")} />;
    default:
      return children;
  }
};
