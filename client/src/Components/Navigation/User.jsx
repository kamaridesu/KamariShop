import React, { useContext } from "react";
import { useAuth } from "../../Context/AuthContextProvider";
import { Form } from "./Form";

export const User = () => {
  const { auth } = useAuth();

  return (
    <>
      <Form />
    </>
  );
};
