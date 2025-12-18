// src/components/PmoForm/Secao17.jsx

import React from 'react';

function Secao17({ data, onSectionChange }) {
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
        <h3>17. OPINIÃO</h3>
      </div>
      <div className="card-body">

        <div className="form-group mb-4">
          <h5 className="card-title">17.1. Quais os principais problemas enfrentados na produção orgânica?</h5>
          <textarea
            name="principais_problemas_producao_organica"
            className="form-control"
            rows="4"
            value={safeData.principais_problemas_producao_organica?.principais_problemas_producao_organica || ''}
            onChange={handleChange}
          ></textarea>
        </div>

        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">17.2. Quais as principais vantagens da produção orgânica?</h5>
          <textarea
            name="principais_vantagens_producao_organica"
            className="form-control"
            rows="4"
            value={safeData.principais_vantagens_producao_organica?.principais_vantagens_producao_organica || ''}
            onChange={handleChange}
          ></textarea>
        </div>

        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">17.3. Outras informações que achar necessário.</h5>
          <textarea
            name="outras_informacoes_necessarias"
            className="form-control"
            rows="4"
            value={safeData.outras_informacoes_necessarias?.outras_informacoes_necessarias || ''}
            onChange={handleChange}
          ></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao17;