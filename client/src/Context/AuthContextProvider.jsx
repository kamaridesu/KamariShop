import React, { createContext, useState, useEffect, useContext } from "react";
import useQuery from "../Hooks/useQuery";

export const AuthStateContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { data, loading } = useQuery({
    url: "/api/users/userstate",
    method: "GET",
  });

  const [auth, setAuth] = useState({
    user: null,
    isLoggedIn: false,
    loading: true,
  });

  useEffect(() => {
    if (!loading) {
      setAuth({
        user: data,
        isLoggedIn: !!data,
        loading: loading,
      });
    }
  }, [data, loading]);

  return (
    <AuthStateContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthStateContext);
};
