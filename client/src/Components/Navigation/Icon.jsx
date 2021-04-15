import React, { useState } from "react";
import { Modal } from "./Modal";

export const Icon = ({ Component, children }) => {
  const [modalVisble, setModalVisible] = useState(false);
  const [modalTriggerElement, setModalTriggerElement] = useState(null);

  return (
    <div
      onClick={(e) => {
        setModalVisible((e) => !e);
        setModalTriggerElement(e.target);
      }}
    >
      <Component />
      {modalVisble && (
        <Modal
          setModalVisible={setModalVisible}
          modalTriggerElement={modalTriggerElement}
        >
          {children}
        </Modal>
      )}
    </div>
  );
};