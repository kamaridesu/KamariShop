import React, { useState } from "react";
import { Modal } from "./Modal";

export const IconButton = ({ Icon, ModalContent, classname, callback }) => {
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
          classname={classname}
          setModalVisible={setModalVisible}
          modalTriggerElement={modalTriggerElement}
        >
          <ModalContent
            close={() => setModalVisible(false)}
            callback={callback}
          />
        </Modal>
      )}
    </div>
  );
};
