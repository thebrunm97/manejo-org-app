// src/components/PmoForm/Secao16.jsx

import React from 'react';

function Secao16({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler que já lida com a estrutura de dados aninhada
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
      ...safeData,
      [name]: { // Mantém o padrão de objeto aninhado
        [name]: value
      }
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>16. SAC (SERVIÇO DE ATENDIMENTO AO CONSUMIDOR)</h3>
      </div>
      <div className="card-body">

        <div className="form-group mb-4">
          <h5 className="card-title">16.1. Quais são as formas dos consumidores fazerem reclamações ou críticas aos produtos?</h5>
          <textarea
            name="formas_reclamacoes_criticas"
            className="form-control"
            rows="4"
            value={safeData.formas_reclamacoes_criticas?.formas_reclamacoes_criticas || ''}
            onChange={handleChange}
          ></textarea>
        </div>

        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">16.2. Como são tratadas possíveis reclamações ou críticas recebidas dos consumidores?</h5>
          <textarea
            name="tratamento_reclamacoes_criticas"
            className="form-control"
            rows="4"
            value={safeData.tratamento_reclamacoes_criticas?.tratamento_reclamacoes_criticas || ''}
            onChange={handleChange}
          ></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao16;