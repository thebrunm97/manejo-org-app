// src/components/PmoForm/Secao11.jsx (versão corrigida para acessibilidade e testes)

import React from 'react';

function Secao11({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
      ...safeData,
      [name]: {
        [name]: value
      }
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>11. COLHEITA</h3>
      </div>
      <div className="card-body">

        <div className="form-group mb-4">
          {/* PASSO 1: Adicionamos um 'id' ao título */}
          <h5 className="card-title" id="label-controle-organico">
            11.1. Como é controlada a colheita dos produtos orgânicos?
          </h5>
          <textarea
            name="controle_colheita_organicos"
            className="form-control"
            rows="4"
            value={safeData.controle_colheita_organicos?.controle_colheita_organicos || ''}
            onChange={handleChange}
            // PASSO 2: Conectamos o textarea à 'label' (h5)
            aria-labelledby="label-controle-organico"
          ></textarea>
        </div>

        <hr />

        <div className="form-group mb-4">
          {/* Repetimos o padrão para o segundo campo */}
          <h5 className="card-title" id="label-controle-nao-organico">
            11.2. Nos casos de produção paralela, como é controlada a colheita dos produtos não orgânicos? Como é feita a separação dos produtos orgânicos dos produtos não orgânicos?
          </h5>
          <textarea
            name="controle_colheita_nao_organicos"
            className="form-control"
            rows="4"
            value={safeData.controle_colheita_nao_organicos?.controle_colheita_nao_organicos || ''}
            onChange={handleChange}
            aria-labelledby="label-controle-nao-organico"
          ></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao11;