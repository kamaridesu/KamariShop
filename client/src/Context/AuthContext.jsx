import React, { createContext, useState, useEffect } from "react";
import { getUserState } from "../Services/actions";

export const AuthStateContext = createContext();

export const AuthContext = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    isLogged: false,
    loading: false,
  });

  useEffect(() => {
    const fetch = async () => {
      setAuth({
        ...auth,
        loading: true,
      });
      const result = await getUserState();
      setAuth({
        ...auth,
        loading: false,
      });
    };
    fetch();
  }, []);

  return (
    <AuthStateContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthStateContext.Provider>
  );
};
