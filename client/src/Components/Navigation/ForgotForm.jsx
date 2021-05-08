import React, { useState } from "react";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import styles from "./ForgotForm.Module.scss";
import logo from "../../Images/emailsent.svg";

export const ForgotForm = ({ setShowForgotForm, close }) => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    let emailError = "";

    if (!email) {
      emailError = "Email cannot be blank";
    }

    if (email && !email.includes("@")) {
      emailError = "Invalid email";
    }

    if (emailError) {
      setEmailError(emailError);
      return false;
    }

    return true;
  };

  const sendEmail = () => {
    if (validate()) {
      setSent(true);
      fetch("/api/users/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
    }
  };

  return !sent ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <AiOutlineLeft onClick={() => setShowForgotForm(false)} />
        <p>UPDATE PASSWORD</p> <AiOutlineClose onClick={close} />
      </div>
      <p className={styles.text}>
        If you forgot your password, please enter your e-mail and we will send
        you instructions to reset it.
      </p>
      <div className={styles.inputwrapper}>
        <input
          style={{
            borderBottom: emailError ? "1px solid red" : "",
          }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.error}>{emailError}</div>
      </div>
      <button onClick={() => sendEmail()}>RESET PASSWORD</button>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5>UPDATE PASSWORD</h5>
        <AiOutlineClose onClick={close} />
      </div>
      <div className={styles.imagewrapper}>
        <img src={logo} alt="" />
      </div>
      <h1>Received!</h1>
      <p>You'll soon receive an email with the steps to reset your password</p>
    </div>
  );
};
