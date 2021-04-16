import React from "react";
import { BsExclamationCircleFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./FormMsg.Module.scss";

export const FormMsg = ({ message, clear, success }) => {
  return (
    <div
      className={
        success
          ? `${styles.container} ${styles.success}`
          : `${styles.container} ${styles.failed}`
      }
    >
      <div>
        <BsExclamationCircleFill />
      </div>
      <div>
        <span>Some message{message}</span>
      </div>
      <div onClick={clear}>
        <AiOutlineClose />
      </div>
    </div>
  );
};
