import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FormMsg } from "../../Errors/FormMsg";
import useQuery from "../../Hooks/useQuery";
import styles from "./ResetForm.Module.scss";

export const ResetForm = () => {
  const [message, setMessage] = useState({ msg: "", status: null });
  const [password, setPassword] = useState("");
  const { data, status, loading, setApiOptions } = useQuery({});
  const { id, token } = useParams();

  const changePassword = async () => {
    setApiOptions({
      url: "/api/users/reset",
      method: "POST",
      body: { id, token, password },
    });
  };

  useEffect(() => {
    if (loading === false && data) {
      setMessage({ msg: data.msg, status });
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
