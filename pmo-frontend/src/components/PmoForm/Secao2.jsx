// src/components/PmoForm/Secao2.jsx (versão refatorada)
import React from 'react';
import TabelaDinamica from './TabelaDinamica'; // Importa nosso componente unificado

function Secao2({ data, onSectionChange }) {
  const safeData = data || {};

  const handleSectionDataChange = (sectionKey, newData) => {
    onSectionChange({
      ...safeData,
      [sectionKey]: newData
    });
  };

  // Define as colunas para cada tabela
  const columnsVegetal = [
    { header: 'Produto', key: 'produto' },
    { header: 'Talhões/Canteiros', key: 'talhoes_canteiros' },
    { header: 'Área Plantada', key: 'area_plantada', type: 'number', placeholder: 'Apenas números' },
    { header: 'Produção Esperada/Ano', key: 'producao_esperada_ano', type: 'number', placeholder: 'Apenas números' }
  ];

  const columnsAnimal = [
    { header: 'Espécie', key: 'especie' },
    { header: 'Nº de animais', key: 'n_de_animais', type: 'number' },
    { header: 'Área Externa', key: 'area_externa', type: 'number' },
    { header: 'Área Interna', key: 'area_interna_instalacoes', type: 'number' },
    { header: 'Exploração', key: 'exploracao' },
    { header: 'Estágio de Vida', key: 'estagio_de_vida' },
    { header: 'Média de Peso Vivo', key: 'media_de_peso_vivo', type: 'number' },
    { header: 'Produção Esperada/Ano', key: 'producao_esperada_ano' }
  ];

  const columnsProcessamento = [
    { header: 'Produto', key: 'produto' },
    { header: 'Frequência', key: 'frequencia_producao' },
    { header: 'Época', key: 'epoca_producao' },
    { header: 'Produção Esperada/Ano', key: 'producao_esperada_ano' }
  ];

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>2. Atividades Produtivas Orgânicas</h3>
        <p className="mb-0"><small>Nesta seção são detalhadas as atividades produtivas orgânicas da propriedade.</small></p>
      </div>
      <div className="card-body">
        <TabelaDinamica
          title="2.1. Produção Primária Vegetal (PPV)"
          columns={columnsVegetal}
          data={safeData.producao_primaria_vegetal?.produtos_primaria_vegetal}
          onDataChange={(newData) => handleSectionDataChange('producao_primaria_vegetal', { ...safeData.producao_primaria_vegetal, produtos_primaria_vegetal: newData })}
          itemName="Produto"
          itemNoun="o"
        />
        <hr />
        <TabelaDinamica
          title="2.2. Produção Primária Animal (PPA)"
          columns={columnsAnimal}
          data={safeData.producao_primaria_animal?.animais_primaria_animal}
          onDataChange={(newData) => handleSectionDataChange('producao_primaria_animal', { ...safeData.producao_primaria_animal, animais_primaria_animal: newData })}
          itemName="Animal"
          itemNoun="o"
        />
        <hr />
        <TabelaDinamica
          title="2.3. Processamento de Produtos de Origem Vegetal (PPOV)"
          columns={columnsProcessamento}
          data={safeData.processamento_produtos_origem_vegetal?.produtos_processamento_vegetal}
          onDataChange={(newData) => handleSectionDataChange('processamento_produtos_origem_vegetal', { ...safeData.processamento_produtos_origem_vegetal, produtos_processamento_vegetal: newData })}
          itemName="Produto Processado (Vegetal)"
          itemNoun=""
        />
        <hr />
        <TabelaDinamica
          title="2.4. Processamento de Produtos de Origem Animal (PPOA)"
          columns={columnsProcessamento}
          data={safeData.processamento_produtos_origem_animal?.produtos_processamento_animal}
          onDataChange={(newData) => handleSectionDataChange('processamento_produtos_origem_animal', { ...safeData.processamento_produtos_origem_animal, produtos_processamento_animal: newData })}
          itemName="Produto Processado (Animal)"
          itemNoun=""
        />
      </div>
    </div>
  );
}

export default Secao2;