import React from "react";
import { BsExclamationCircleFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./FormMsg.Module.scss";

//este componente lo usamos para mostrar mensajes de fallo y existo segun la respuesta del fetch
export const FormMsg = ({ msg, clear }) => {
  return (
    <div
      className={
        msg.status === 200
          ? `${styles.container} ${styles.success}`
          : `${styles.container} ${styles.failed}`
      }
    >
      <div>
        <BsExclamationCircleFill />
      </div>
      <div>
        <span>{msg.msg}</span>
      </div>
      <div onClick={clear}>
        <AiOutlineClose />
      </div>
    </div>
  );
};
