import React, { useState } from "react";
import { Modal } from "./Modal";

export const IconButton = ({ Icon, ModalContent }) => {
  const [modalVisble, setModalVisible] = useState(false);
  const [modalTriggerElement, setModalTriggerElement] = useState(null);

  return (
    <div>
      <Icon
        onClick={(e) => {
          setModalVisible((e) => !e);
          setModalTriggerElement(e.target);
        }}
      />
      {modalVisble && (
        <Modal
          setModalVisible={setModalVisible}
          modalTriggerElement={modalTriggerElement}
        >
          <ModalContent close={() => setModalVisible(false)} />
        </Modal>
      )}
    </div>
  );
};
