// src/components/PmoForm/Situacao.jsx (versão com validação)
import React from 'react';

function Situacao({ data, onDataChange, errors }) {
  const handleChange = (e) => {
    // A lógica para atualizar o objeto aninhado
    onDataChange({ 
      ...data, 
      [e.target.name]: e.target.value 
    });
  };

  const situacaoOpcoes = [
    "Toda a propriedade já é orgânica",
    "Toda a propriedade está em conversão",
    "Há produção não orgânica e em conversão (conversão parcial)",
    "Há produção orgânica e em conversão",
    "Há produção orgânica e não orgânica (produção paralela)",
    "Há produção orgânica, não orgânica e em conversão"
  ];

  const safeErrors = errors || {};

  return (
    <div className="card-body">
      <h5 className="card-title">1.7 Situação da Propriedade</h5>
      <div className="form-group">
        <select
          name="situacao_propriedade_producao_organica"
          value={data?.situacao_propriedade_producao_organica || ''}
          onChange={handleChange}
          // Aplica a classe de erro condicionalmente
          className={`form-select ${safeErrors.situacao_propriedade_producao_organica ? 'is-invalid' : ''}`}
          required
        >
          <option value="" disabled>Selecione uma opção</option>
          {situacaoOpcoes.map(opcao => (
            <option key={opcao} value={opcao}>{opcao}</option>
          ))}
        </select>
        {/* Exibe a mensagem de erro se ela existir */}
        {safeErrors.situacao_propriedade_producao_organica && <div className="invalid-feedback">{safeErrors.situacao_propriedade_producao_organica}</div>}
      </div>
    </div>
  );
}

export default Situacao;