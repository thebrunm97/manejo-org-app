// src/components/PmoForm/Secao8.jsx (versão corrigida para estrutura aninhada)

import React from 'react';
import TabelaDinamica from './TabelaDinamica';

function Secao8({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler ajustado para a estrutura de dados aninhada
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ 
      ...safeData, 
      [name]: { // Mantém a estrutura de objeto para cada campo
        [name]: value
      } 
    });
  };

  const columnsInsumosFertilidade = [
    { header: 'Produto ou Manejo', key: 'produto_ou_manejo' },
    { header: 'Onde (em que cultura)', key: 'onde' },
    { header: 'Quando?', key: 'quando' },
    { header: 'Procedência Interna/Externa', key: 'procedencia' },
    { header: 'Composição', key: 'composicao' },
    { header: 'Marca', key: 'marca' },
    { header: 'Dosagem', key: 'dosagem' },
  ];

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>8. INSUMOS/EQUIPAMENTOS</h3>
      </div>
      <div className="card-body">
        
        <TabelaDinamica
          title="8.1. Quais insumos/manejos são utilizados para melhorar a fertilidade do sistema orgânico?"
          columns={columnsInsumosFertilidade}
          data={safeData.insumos_melhorar_fertilidade}
          onDataChange={(newData) => onSectionChange({ ...safeData, insumos_melhorar_fertilidade: newData })}
          itemName="Insumo/Manejo"
          itemNoun="o"
        />
        <hr />
        
        <div className="form-group mb-4">
            <h5 className="card-title">8.2. Quais são os insumos utilizados na produção não orgânica?</h5>
            <textarea 
                name="insumos_producao_nao_organica" 
                // Acessa a propriedade aninhada para obter o valor
                value={safeData.insumos_producao_nao_organica?.insumos_producao_nao_organica || ''} 
                onChange={handleChange} 
                className="form-control" 
                rows="4"
            ></textarea>
        </div>
        <hr />

        <div className="form-group mb-4">
            <h5 className="card-title">8.3. Nos casos de produção paralela (produção orgânica e não orgânica), como são controlados os insumos e os equipamentos?</h5>
            <textarea 
                name="controle_insumos_producao_paralela" 
                // Acessa a propriedade aninhada para obter o valor
                value={safeData.controle_insumos_producao_paralela?.controle_insumos_producao_paralela || ''} 
                onChange={handleChange} 
                className="form-control" 
                rows="4"
            ></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao8;