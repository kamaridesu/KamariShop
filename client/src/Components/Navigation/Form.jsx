import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContextProvider";
import { FormMsg } from "../../Errors/FormMsg";
import useQuery from "../../Hooks/useQuery";
import styles from "./Form.Module.scss";
import { Input } from "antd";

export const Form = ({ setShowForgotForm }) => {
  const [state, setstate] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { data, status, loading, setApiOptions } = useQuery({});
  const [message, setMessage] = useState({ msg: "", status: null });
  const { setAuth } = useAuth();

  const validate = () => {
    let emailError = "";
    let passwordError = "";
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email) {
      emailError = "Email cannot be blank";
    }

    if (email && !email.includes("@")) {
      emailError = "Invalid email";
    }

    if (!password) {
      passwordError = "Password cannot be blank";
    }

    if (password && !password.match(passwordPattern) && !state) {
      passwordError =
        "You must include at least 8 characters, including upper and lowercase letters, one number and a special character";
    }

    if (emailError || passwordError) {
      setEmailError(emailError);
      setPasswordError(passwordError);
      return false;
    }

    return true;
  };

  const handleForm = () => {
    setEmailError("");
    setPasswordError("");
    setMessage({ msg: null });

    if (validate()) {
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
    }
  };

  useEffect(() => {
    if (loading === false) {
      if (status === 200) {
        console.log(data);
        setAuth({ ...data });
        setEmail("");
        setPassword("");
      }
      setMessage({ msg: data.msg, status: status });
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
        <div className={styles.inputwrapper}>
          <label>Email</label>
          <span>
            <input
              style={{
                borderBottom: emailError ? "1px solid red" : "",
              }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
          <div className={styles.error}>{emailError}</div>
        </div>
        <div className={styles.inputwrapper}>
          <label>Password</label>
          <Input.Password
            style={{
              borderBottom: passwordError ? "1px solid red" : "",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.error}>{passwordError}</div>
        </div>
      </div>
      <div className={styles.forgot} onClick={() => setShowForgotForm(true)}>
        Reset my password
      </div>
      <div className={styles.bottomSection}>
        <button type="submit" onClick={() => handleForm()}>
          {state ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
        <button
          onClick={() => {
            setstate((e) => !e);
            setMessage({ msg: null });
            setEmail("");
            setPassword("");
            setEmailError("");
            setPasswordError("");
          }}
        >
          {state ? "REGISTER" : "LOGIN"}
        </button>
      </div>
    </div>
  );
};
