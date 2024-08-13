import React from 'react';

const DownloadModal = ({ isOpen, onClose, onDownloadPDF, onDownloadDOCX }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Escolha o formato de download</h2>
            <button onClick={onDownloadPDF} className="btn-listfood">Baixar PDF</button>
            <button onClick={onDownloadDOCX} className="btn-listfood">Baixar DOCX</button>
            <button onClick={onClose} className="btn-listfood">Cancelar</button>
        </div>
      </div>
    );
};

export default DownloadModal;
