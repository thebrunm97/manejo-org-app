// src/components/PmoForm/Secao10.jsx

import React from 'react';
import TabelaDinamica from './TabelaDinamica';
import CheckboxGroup from './CheckboxGroup';

function Secao10({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler para o campo "Outros" do CheckboxGroup
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ ...safeData, [name]: value });
  };

  // Define as colunas para a tabela 10.1
  const columnsControlePragas = [
    { header: 'Produto ou Manejo', key: 'produto_ou_manejo' },
    { header: 'Onde (em que cultura)', key: 'onde' },
    { header: 'Qual praga/doença?', key: 'qual_praga_doenca' },
    { header: 'Quando?', key: 'quando' },
    { header: 'Procedência Interna/Externa', key: 'procedencia' },
    { header: 'Composição', key: 'composicao' },
    { header: 'Marca', key: 'marca' },
    { header: 'Dosagem', key: 'dosagem' },
  ];

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>10. FITOSSANIDADE</h3>
      </div>
      <div className="card-body">

        <TabelaDinamica
          title="10.1. Como controla pragas e doenças?"
          columns={columnsControlePragas}
          data={safeData.controle_pragas_doencas}
          onDataChange={(newData) => onSectionChange({ ...safeData, controle_pragas_doencas: newData })}
          itemName="Controle"
          itemNoun="o"
        />
        <hr />

        <CheckboxGroup
          title="10.2. Como você faz o manejo e controle das plantas daninhas/espontâneas na área de produção?"
          options={['Roçada', 'Capina manual', 'Pastoreio/Trator animal', 'Adubo verde', 'Outros - citar:']}
          selectedString={safeData.manejo_plantas_daninhas}
          onSelectionChange={(newValue) => onSectionChange({ ...safeData, manejo_plantas_daninhas: newValue })}
          // Lógica para o campo condicional "Outros"
          otherOption="Outros - citar:"
          otherValue={safeData.manejo_plantas_daninhas_outros}
          onOtherChange={handleChange}
          otherName="manejo_plantas_daninhas_outros"
          otherPlaceholder="Especifique outros manejos..."
        />

      </div>
    </div>
  );
}

export default Secao10;