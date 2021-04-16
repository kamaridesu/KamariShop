import React, { useState } from "react";
import { FormMsg } from "../../Errors/FormMsg";
import useQuery from "../../Hooks/useQuery";
import styles from "./Form.Module.scss";

export const Form = () => {
  const [state, setstate] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, loading, setApiOptions] = useQuery({});

  const handleForm = () => {
    setApiOptions({
      url: "/api/users/test",
      method: "POST",
      body: { email, password },
    });
  };

  return (
    <div className={styles.form}>
      <p className={styles.title}>
        {state ? "SIGN INTO YOUR ACCOUNT" : "CREATE ACCOUNT"}
      </p>
      <FormMsg />
      <div className={styles.middleSection}>
        <div>
          <label>email</label>
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
        <button onClick={() => setstate((e) => !e)}>
          {state ? "REGISTER" : "LOGIN"}
        </button>
      </div>
    </div>
  );
};
