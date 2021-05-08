import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FormMsg } from "../../Errors/FormMsg";
import useQuery from "../../Hooks/useQuery";
import styles from "./ResetForm.Module.scss";

export const ResetForm = () => {
  const [message, setMessage] = useState({ msg: "", status: null });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { data, status, loading, setApiOptions } = useQuery({});
  const { id, token } = useParams();

  const validate = () => {
    let passwordError = "";
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      passwordError = "Password cannot be blank";
    }

    if (password && !password.match(passwordPattern)) {
      passwordError =
        "You must include at least 8 characters, including upper and lowercase letters, one number and a special character";
    }

    if (passwordError) {
      setPasswordError(passwordError);
      return false;
    }

    return true;
  };

  const changePassword = async () => {
    if (validate()) {
      setApiOptions({
        url: "/api/users/reset",
        method: "POST",
        body: { id, token, password },
      });
    }
  };

  useEffect(() => {
    if (loading === false && data) {
      setMessage({ msg: data.msg, status });
      setPassword("");
      setPasswordError("");
    }
  }, [loading]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.message}>
          {message.msg && (
            <FormMsg msg={message} clear={() => setMessage({ msg: null })} />
          )}
          {status !== 200 && (
            <>
              <span>Enter new password</span>
              <div className={styles.inputwrapper}>
                <input
                  style={{
                    borderBottom: passwordError ? "1px solid red" : "",
                  }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className={styles.error}>{passwordError}</div>
              </div>
              <button onClick={() => changePassword()}>Submit</button>
            </>
          )}
        </div>
        <Link className={styles.button} to="/">
          GO BACK TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
};
