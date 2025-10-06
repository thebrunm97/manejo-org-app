// src/components/PmoForm/Secao9.jsx

import React from 'react';
import TabelaDinamica from './TabelaDinamica';

// Sub-componente especializado para a tabela 9.1, que tem uma coluna de radio buttons
function TabelaOrigemOrganica({ data, onDataChange }) {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, field, value) => {
    const newData = [...safeData];
    newData[index][field] = value;
    onDataChange(newData);
  };

  const adicionarItem = () => {
    const novoItem = { especies: '', origem: '', quantidade: '', sistema_organico: null, data_compra: '' };
    onDataChange([...safeData, novoItem]);
  };

  const removerItem = (index) => {
    const newData = safeData.filter((_, i) => i !== index);
    onDataChange(newData);
  };

  return (
    <div className="form-group mb-4">
      <h5 className="card-title">9.1. Qual a origem das sementes e mudas utilizadas da produção orgânica?</h5>
      <p className="form-text">É necessário descrever a procedência para todas as espécies cultivadas na unidade de produção.</p>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Espécies/Cultivares ou Variedades</th>
              <th>Origem das Sementes ou Mudas (Indicar o fornecedor)</th>
              <th>Quantidade</th>
              <th>Sistema Orgânico de Produção</th>
              <th>Data da Compra</th>
              <th style={{ width: '100px' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {safeData.map((item, index) => (
              <tr key={index}>
                <td><input type="text" className="form-control" value={item.especies || ''} onChange={(e) => handleItemChange(index, 'especies', e.target.value)} /></td>
                <td><input type="text" className="form-control" value={item.origem || ''} onChange={(e) => handleItemChange(index, 'origem', e.target.value)} /></td>
                <td><input type="text" className="form-control" value={item.quantidade || ''} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} /></td>
                <td>
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name={`sistema_organico_${index}`} checked={item.sistema_organico === true} onChange={() => handleItemChange(index, 'sistema_organico', true)} />
                      <label className="form-check-label">Sim</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name={`sistema_organico_${index}`} checked={item.sistema_organico === false} onChange={() => handleItemChange(index, 'sistema_organico', false)} />
                      <label className="form-check-label">Não</label>
                    </div>
                  </div>
                </td>
                <td><input type="date" className="form-control" value={item.data_compra || ''} onChange={(e) => handleItemChange(index, 'data_compra', e.target.value)} /></td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>Remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-outline-primary mt-2" onClick={adicionarItem}>+ Adicionar Semente/Muda</button>
    </div>
  );
}


// --- Componente Principal da Seção 9 ---
function Secao9({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
      ...safeData,
      [name]: { // Mantém a estrutura de objeto aninhado
        [name]: value
      }
    });
  };

  // Define as colunas para a tabela 9.4, que é mais simples
  const columnsNaoOrganica = [
    { header: 'Espécies/Cultivares ou Variedades', key: 'especies' },
    { header: 'Origem das Sementes ou Mudas (Indicar o fornecedor)', key: 'origem' },
    { header: 'Quantidade', key: 'quantidade' },
  ];

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>9. PROPAGAÇÃO VEGETAL</h3>
      </div>
      <div className="card-body">

        <TabelaOrigemOrganica
          data={safeData.sementes_mudas_organicas}
          onDataChange={(newData) => onSectionChange({ ...safeData, sementes_mudas_organicas: newData })}
        />
        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">9.2. É realizado algum tratamento nas sementes ou mudas? Em caso afirmativo, especifique os produtos utilizados.</h5>
          <textarea name="tratamento_sementes_mudas" value={safeData.tratamento_sementes_mudas?.tratamento_sementes_mudas || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
        </div>
        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">9.3. Em caso de produção própria, comente o manejo adotado nos campos/ambientes de produção.</h5>
          <p className="form-text">Importante informar a composição do substrato e tratamento utilizado (em especial para cogumelos).</p>
          <textarea name="manejo_producao_propria" value={safeData.manejo_producao_propria?.manejo_producao_propria || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
        </div>
        <hr />

        <TabelaDinamica
          title="9.4. Qual a origem das sementes e mudas da produção não orgânica?"
          itemName="Semente/Muda"
          itemNoun="a"
          columns={columnsNaoOrganica}
          data={safeData.sementes_mudas_nao_organicas}
          onDataChange={(newData) => onSectionChange({ ...safeData, sementes_mudas_nao_organicas: newData })}
        />
        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">9.5. Qual a postura da propriedade quanto ao uso de materiais transgênicos na produção orgânica?</h5>
          <textarea name="postura_uso_materiais_transgenicos_organica" value={safeData.postura_uso_materiais_transgenicos_organica?.postura_uso_materiais_transgenicos_organica || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
        </div>
        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">9.6. Quais os cuidados da propriedade quanto ao uso de materiais transgênicos na produção não orgânica?</h5>
          <textarea name="cuidados_uso_materiais_transgenicos_nao_organica" value={safeData.cuidados_uso_materiais_transgenicos_nao_organica?.cuidados_uso_materiais_transgenicos_nao_organica || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao9;