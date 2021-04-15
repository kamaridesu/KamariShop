import React, { createContext, useState, useEffect, useContext } from "react";
import useQuery from "../Hooks/useQuery";

export const AuthStateContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { data: user, loading } = useQuery("/api/users/userstate", "GET");

  const [auth, setAuth] = useState({
    user: null,
    isLoggedIn: false,
    loading: true,
  });

  useEffect(() => {
    if (!loading) {
      setAuth({
        user: user,
        isLoggedIn: !!user,
        loading: loading,
      });
    }
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
