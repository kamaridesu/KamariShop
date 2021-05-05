import React, { useState } from "react";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import styles from "./ForgotForm.Module.scss";
import logo from "../../Images/emailsent.svg";

export const ForgotForm = ({ setShowResetForm, close }) => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const sendEmail = () => {
    fetch("/api/users/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
  };

  return !sent ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <AiOutlineLeft onClick={() => setShowResetForm(false)} />
        <p>UPDATE PASSWORD</p> <AiOutlineClose onClick={close} />
      </div>
      <p className={styles.text}>
        If you forgot your password, please enter your e-mail and we will send
        you instructions to reset it.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={() => {
          sendEmail();
          setSent(true);
        }}
      >
        RESET PASSWORD
      </button>
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
