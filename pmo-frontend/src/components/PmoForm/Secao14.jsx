// src/components/PmoForm/Secao14.jsx

import React from 'react';

// Um pequeno componente auxiliar para cada linha de checkbox
const CanalCheckbox = ({ label, name, checked, onChange, conditionalValue, onTextChange, placeholder }) => {
  return (
    <div className="form-check mb-2">
      <input
        className="form-check-input"
        type="checkbox"
        id={name}
        value={label}
        checked={checked}
        onChange={(e) => onChange(e.target.value, e.target.checked)}
      />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
      {checked && placeholder && (
        <input
          type="text"
          name={name}
          className="form-control form-control-sm mt-1"
          placeholder={placeholder}
          value={conditionalValue || ''}
          onChange={onTextChange}
        />
      )}
    </div>
  );
};


function Secao14({ data, onSectionChange }) {
  const safeData = data || {};
  const canaisSelecionados = String(safeData.canais_comercializacao || '').split('; ').filter(Boolean);

  const handleCheckboxChange = (value, isChecked) => {
    let novasOpcoes = [...canaisSelecionados];
    if (isChecked && !novasOpcoes.includes(value)) {
      novasOpcoes.push(value);
    } else {
      novasOpcoes = novasOpcoes.filter(opt => opt !== value);
    }
    onSectionChange({ ...safeData, canais_comercializacao: novasOpcoes.join('; ') });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ ...safeData, [name]: value });
  };

  // Opções de canais
  const canais = [
    { label: 'Na unidade de produção.' },
    { label: 'Programa de Aquisição de Alimentos (PAA).' },
    { label: 'Programa Nacional de Alimentação Escolar (PNAE).' },
    { label: 'Em estabelecimentos atacadistas e varejistas – Quais:', name: 'canais_atacadistas_quais', placeholder: 'Quais estabelecimentos?' },
    { label: 'Em feiras – Quais:', name: 'canais_feiras_quais', placeholder: 'Quais feiras?' },
    { label: 'Em cooperativas e associações – Quais:', name: 'canais_cooperativas_quais', placeholder: 'Quais cooperativas/associações?' },
    { label: 'Em outros canais – Quais:', name: 'canais_outros_quais', placeholder: 'Quais outros canais?' }
  ];

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>14. COMERCIALIZAÇÃO</h3>
      </div>
      <div className="card-body">
        <div className="form-group mb-4">
          <h5 className="card-title">14.1. Em quais canais os produtos são comercializados?</h5>
          {canais.map(canal => (
            <CanalCheckbox
              key={canal.label}
              label={canal.label}
              name={canal.name}
              checked={canaisSelecionados.includes(canal.label)}
              onChange={handleCheckboxChange}
              conditionalValue={canal.name ? safeData[canal.name] : ''}
              onTextChange={handleTextChange}
              placeholder={canal.placeholder}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Secao14;