import { Footer } from "../Footer/Footer";
import { Nav } from "./Nav";

export const withNavigation = (Component, props) => {
  return (
    <>
      <Nav />
      <Component {...props} />
      <Footer />
    </>
  );
};
