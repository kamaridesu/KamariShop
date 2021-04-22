import React, { useState } from "react";
import { Modal } from "./Modal";

export const IconButton = ({
  Icon,
  ModalContent,
  classname,
  callback,
  ...rest
}) => {
  const [modalVisble, setModalVisible] = useState(false);
  const [modalTriggerElement, setModalTriggerElement] = useState(null);

  return (
    <>
      <div
        onClick={(e) => {
          setModalVisible((e) => !e);
          setModalTriggerElement(e.target);
        }}
      >
        <Icon />
      </div>
      {modalVisble && (
        <Modal
          classname={classname}
          setModalVisible={setModalVisible}
          modalTriggerElement={modalTriggerElement}
        >
          <ModalContent
            close={() => setModalVisible(false)}
            callback={callback}
            {...rest}
          />
        </Modal>
      )}
    </>
  );
};
