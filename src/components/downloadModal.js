import React from 'react';

const DownloadModal = ({ isOpen, onClose, onDownloadPDF, onDownloadDOCX }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content meal-card shadow-sm p-5 w-50 bg-light-subtle rounded-4">
          <h2>Escolha o formato de download</h2>
            <button onClick={onDownloadPDF} className="btn btn-lg btn-light">Baixar PDF</button>
            <button onClick={onDownloadDOCX} className="btn btn-lg btn-light">Baixar DOCX</button>
            <button onClick={onClose} className="btn btn-lg btn-light">Cancelar</button>
        </div>
      </div>
    );
};

export default DownloadModal;
