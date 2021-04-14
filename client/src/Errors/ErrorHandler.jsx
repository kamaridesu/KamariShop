import { useLocation } from "react-router";
import { ErrorPage } from "../Components/ErrorPage/ErrorPage";

export const ErrorHandler = ({ children }) => {
  const location = useLocation();

  const errorCode = location.state && location.state["errorStatusCode"];
  console.log("errorhandler", location);
  switch (errorCode) {
    case 403:
      return <ErrorPage />;
    case 404:
      return null;
    //   return <Page404 />;
    case 500:
      return null;

    default:
      return children;
  }
};
