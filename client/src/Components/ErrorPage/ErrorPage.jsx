import React from "react";
import { Link } from "react-router-dom";
import styles from "./ErrorPage.Module.scss";

export const ErrorPage = ({ errorCode, message }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.message}>
          <span>{errorCode}</span>
          <span>{message}</span>
        </div>
        <Link className={styles.button} to="/">
          GO BACK TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
};
