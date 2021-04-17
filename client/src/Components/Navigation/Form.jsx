import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContextProvider";
import { FormMsg } from "../../Errors/FormMsg";
import useQuery from "../../Hooks/useQuery";
import styles from "./Form.Module.scss";

export const Form = () => {
  const [state, setstate] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, loading, setApiOptions] = useQuery({});
  const [message, setMessage] = useState({ msg: "", status: null });
  const { setAuth } = useAuth();

  const handleForm = () => {
    if (state) {
      setApiOptions({
        url: "/api/users/login",
        method: "POST",
        body: { email, password },
      });
    } else {
      setApiOptions({
        url: "/api/users/register",
        method: "POST",
        body: { email, password },
      });
    }
  };

  useEffect(() => {
    if (loading === false) {
      if (data.status === 200) {
        setAuth({ ...data });
      }
      setMessage({ ...data });
      setEmail("");
      setPassword("");
    }
  }, [loading, data]);

  return (
    <div className={styles.form}>
      <p className={styles.title}>
        {state ? "SIGN INTO YOUR ACCOUNT" : "CREATE ACCOUNT"}
      </p>
      {message.msg && (
        <FormMsg msg={message} clear={() => setMessage({ msg: null })} />
      )}
      <div className={styles.middleSection}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.bottomSection}>
        <button type="submit" onClick={() => handleForm()}>
          {state ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
        <button
          onClick={() => {
            setstate((e) => !e);
            setEmail("");
            setPassword("");
          }}
        >
          {state ? "REGISTER" : "LOGIN"}
        </button>
      </div>
    </div>
  );
};
