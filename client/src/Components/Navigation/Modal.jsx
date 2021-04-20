import React, { useRef, useEffect } from "react";
import styles from "../Navigation/Modal.Module.scss";

export const Modal = ({
  children,
  setModalVisible,
  modalTriggerElement,
  classname,
}) => {
  const container = useRef();

  let Handler = (event) => {
    const el = event.target;

    if (!container.current.contains(el) && !modalTriggerElement.contains(el)) {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", Handler);

    return () => {
      document.removeEventListener("mousedown", Handler);
    };
  });

  return (
    <div
      ref={container}
      className={
        classname ? `${styles.modal} ${styles[classname]}` : `${styles.modal}`
      }
    >
      {children}
    </div>
  );
};
