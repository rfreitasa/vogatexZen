import React from 'react';
import Modal from 'react-modal';

const CampoSelectionModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Seleção de Campos"
    >
      <div>
        <h2>Selecione os campos:</h2>
        <label>
          <input type="checkbox" /> Campo 1
        </label>
        <label>
          <input type="checkbox" /> Campo 2
        </label>
        {/* Adicione mais campos de seleção conforme necessário */}
        <button onClick={onClose}>Fechar Modal</button>
      </div>
    </Modal>
  );
};

export default CampoSelectionModal;