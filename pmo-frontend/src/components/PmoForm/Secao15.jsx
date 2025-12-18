// src/components/PmoForm/Secao15.jsx

import React from 'react';
import CheckboxGroup from './CheckboxGroup';

function Secao15({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler para os campos de texto da seção
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Verifica se o campo deve ter estrutura aninhada
    if (name === 'registros_rastreabilidade') {
      onSectionChange({ ...safeData, [name]: { [name]: value } });
    } else {
      // Caso contrário, atualiza diretamente (para o campo "Outros")
      onSectionChange({ ...safeData, [name]: value });
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>15. RASTREABILIDADE (DOCUMENTOS/REGISTROS)</h3>
      </div>
      <div className="card-body">

        <div className="form-group mb-4">
          <h5 className="card-title">15.1. Que tipo de registros são adotados para comprovar a rastreabilidade em sua propriedade, incluindo produção, armazenamento, processamento, aquisições e vendas?</h5>
          <textarea
            name="registros_rastreabilidade"
            className="form-control"
            rows="4"
            value={safeData.registros_rastreabilidade?.registros_rastreabilidade || ''}
            onChange={handleChange}
          ></textarea>
        </div>

        <hr />

        <CheckboxGroup
          title="15.2. Com que frequência realiza os registros/anotações?"
          options={['Diário', 'Semanal', 'Quinzenal', 'Mensal', 'Outro(s) - Qual(is)?']}
          selectedString={safeData.frequencia_registros_anotacoes}
          onSelectionChange={(newValue) => onSectionChange({ ...safeData, frequencia_registros_anotacoes: newValue })}
          // Lógica para o campo condicional "Outros"
          otherOption="Outro(s) - Qual(is)?"
          otherValue={safeData.frequencia_registros_anotacoes_outros}
          onOtherChange={handleChange}
          otherName="frequencia_registros_anotacoes_outros"
          otherPlaceholder="Especifique a outra frequência..."
        />

      </div>
    </div>
  );
}

export default Secao15;