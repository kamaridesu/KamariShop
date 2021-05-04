import React, { useState } from "react";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import { FormMsg } from "../../Errors/FormMsg";
import styles from "./ResetForm.module.scss";
import logo from "../../Images/emailsent.svg";

export const ResetForm = ({ setShowResetForm, close }) => {
  return false ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <AiOutlineLeft onClick={() => setShowResetForm(false)} />
        <p>UPDATE PASSWORD</p> <AiOutlineClose onClick={close} />
      </div>
      <p className={styles.text}>
        If you forgot your password, please enter your e-mail and we will send
        you instructions to reset it.
      </p>
      <input type="email" />
      <button>RESET PASSWORD</button>
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
