import React, { useContext } from "react";
import { useAuth } from "../../Context/AuthContextProvider";
import { Form } from "./Form";
import { UserMenu } from "./UserMenu";

export const User = ({ close }) => {
  const { auth } = useAuth();

  return <>{auth.isLoggedIn ? <UserMenu close={close} /> : <Form />}</>;
};
