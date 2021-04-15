import React, { useContext } from "react";
import { useAuth } from "../../Context/AuthContextProvider";

export const User = () => {
  const { auth } = useAuth();

  return <div>user</div>;
};
