import React, { createContext, useState, useEffect, useContext } from "react";
import useQuery from "../Hooks/useQuery";
import { getUserState } from "../Services/actions";

export const AuthStateContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { data: user, loading } = useQuery("/api/users/userstate", "GET");

  const [auth, setAuth] = useState({
    user: null,
    isLoggedIn: false,
    loading: true,
  });

  useEffect(() => {
    console.log("authcontext", user);
    setAuth({ user: user, isLoggedIn: !!user, loading: loading });
  }, [user, loading]);

  return (
    <AuthStateContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthStateContext);
};
