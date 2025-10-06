// src/components/PmoForm/Secao3.jsx (com radio buttons)

import React from 'react';
import TabelaDinamica from './TabelaDinamica';

function Secao3({ data, onSectionChange }) {
  const safeData = data || {};

  // Este handler agora trata tanto da seleção do Sim/Não quanto de outros campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue;
    if (type === 'checkbox') {
        newValue = checked;
    } else if (name === 'produtos_nao_certificados') {
        newValue = value === 'true'; // Converte a string 'true'/'false' para booleano
    } else {
        newValue = value;
    }

    onSectionChange({ ...safeData, [name]: newValue });
  };

  const handleArrayChange = (objKey, arrayKey, novoArray) => {
    const newSectionData = {
      ...safeData,
      [objKey]: {
        ...safeData[objKey],
        [arrayKey]: novoArray
      }
    };
    onSectionChange(newSectionData);
  };

  // As definições de colunas continuam as mesmas
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
        <h3>3. Atividades Produtivas Não Orgânicas (Convencionais)</h3>
      </div>
      <div className="card-body">
        <h5 className="card-title">A propriedade possui produtos não certificados (convencionais)?</h5>
        
        {/* ================== INÍCIO DA MUDANÇA ================== */}
        <div className="form-group mb-4">
            <div className="form-check form-check-inline">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    name="produtos_nao_certificados" 
                    id="nao_certificados_sim" 
                    value="true" 
                    checked={safeData.produtos_nao_certificados === true} 
                    onChange={handleChange} 
                />
                <label className="form-check-label" htmlFor="nao_certificados_sim">Sim</label>
            </div>
            <div className="form-check form-check-inline">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    name="produtos_nao_certificados" 
                    id="nao_certificados_nao" 
                    value="false" 
                    checked={safeData.produtos_nao_certificados === false} 
                    onChange={handleChange} 
                />
                <label className="form-check-label" htmlFor="nao_certificados_nao">Não</label>
            </div>
        </div>
        {/* =================== FIM DA MUDANÇA ==================== */}

        {/* O conteúdo condicional continua a funcionar com a mesma variável */}
        {safeData.produtos_nao_certificados && (
          <>
            <TabelaDinamica
              title="3.1. Produção Primária Vegetal Não Orgânica"
              columns={columnsVegetal}
              data={safeData.producao_primaria_vegetal_nao_organica?.produtos_primaria_vegetal_nao_organica}
              onDataChange={(newData) => handleArrayChange('producao_primaria_vegetal_nao_organica', 'produtos_primaria_vegetal_nao_organica', newData)}
              itemName="Produto Não Orgânico"
              itemNoun="o"
            />
            <hr />
            <TabelaDinamica
              title="3.2. Produção Primária Animal Não Orgânica"
              columns={columnsAnimal}
              data={safeData.producao_primaria_animal_nao_organica?.animais_primaria_animal_nao_organica}
              onDataChange={(newData) => handleArrayChange('producao_primaria_animal_nao_organica', 'animais_primaria_animal_nao_organica', newData)}
              itemName="Animal Não Orgânico"
              itemNoun="o"
            />
            <hr />
            <TabelaDinamica
              title="3.3. Processamento de Produtos de Origem Vegetal Não Orgânico"
              columns={columnsProcessamento}
              data={safeData.processamento_produtos_origem_vegetal_nao_organico?.produtos_processamento_vegetal_nao_organico}
              onDataChange={(newData) => handleArrayChange('processamento_produtos_origem_vegetal_nao_organico', 'produtos_processamento_vegetal_nao_organico', newData)}
              itemName="Produto Processado (Vegetal)"
              itemNoun=""
            />
            <hr />
            <TabelaDinamica
              title="3.4. Processamento de Produtos de Origem Animal Não Orgânico"
              columns={columnsProcessamento}
              data={safeData.processamento_produtos_origem_animal_nao_organico?.produtos_processamento_animal_nao_organico}
              onDataChange={(newData) => handleArrayChange('processamento_produtos_origem_animal_nao_organico', 'produtos_processamento_animal_nao_organico', newData)}
              itemName="Produto Processado (Animal)"
              itemNoun=""
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Secao3;