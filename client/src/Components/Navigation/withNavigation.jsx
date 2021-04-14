import { Navigation } from "./Navigation";

export const withNavigation = (Component, props) => {
  return (
    <>
      <Navigation />
      <Component {...props} />
    </>
  );
};
