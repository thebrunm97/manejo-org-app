// src/components/PmoForm/Secao12.jsx

import React from 'react';
import CheckboxGroup from './CheckboxGroup';

function Secao12({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler genérico para a maioria dos campos
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue;

    // Converte para booleano no caso dos radio buttons
    if (name.startsWith('ha_') || name === 'produtos_sao_rotulados') {
      newValue = value === 'true';
    } else {
      newValue = value;
    }

    // Lógica para campos de texto simples que usam estrutura aninhada
    const camposAninhados = [
      'higienizacao_produtos_organicos', 'descricao_processamento_producao_organica',
      'descricao_processamento_producao_paralela', 'higienizacao_equipamentos_instalacoes',
      'descricao_rotulagem', 'controle_pragas_instalacoes', 'transporte_produtos_organicos'
    ];

    if (camposAninhados.includes(name)) {
      onSectionChange({ ...safeData, [name]: { [name]: newValue } });
    } else {
      onSectionChange({ ...safeData, [name]: newValue });
    }
  };

  // Handler específico para o campo de acondicionamento que tem múltiplos sub-campos
  const handleAcondicionamentoChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
        ...safeData,
        acondicionamento_produtos: {
            ...safeData.acondicionamento_produtos,
            [name]: value
        }
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>12. PÓS-COLHEITA (PROCESSAMENTO, ACONDICIONAMENTO, ARMAZENAMENTO E TRANSPORTE)</h3>
      </div>
      <div className="card-body">

        {/* 12.1 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.1. É realizado algum procedimento para higienização dos produtos orgânicos? Em caso afirmativo, explique como é feito e quais produtos são utilizados.</h5>
          <textarea name="higienizacao_produtos_organicos" className="form-control" rows="3" value={safeData.higienizacao_produtos_organicos?.higienizacao_produtos_organicos || ''} onChange={handleChange}></textarea>
        </div>
        <hr />

        {/* 12.2 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.2. É realizado algum tipo de processamento na produção orgânica?</h5>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ha_processamento_producao_organica" value="true" checked={safeData.ha_processamento_producao_organica === true} onChange={handleChange} />
            <label className="form-check-label">Sim</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ha_processamento_producao_organica" value="false" checked={safeData.ha_processamento_producao_organica === false} onChange={handleChange} />
            <label className="form-check-label">Não</label>
          </div>
          {safeData.ha_processamento_producao_organica && (
            <div className="mt-2">
              <label className="form-label small">12.2.1. Em caso positivo, descreva o procedimento...</label>
              <textarea name="descricao_processamento_producao_organica" className="form-control" rows="3" value={safeData.descricao_processamento_producao_organica?.descricao_processamento_producao_organica || ''} onChange={handleChange}></textarea>
            </div>
          )}
        </div>
        <hr />

        {/* 12.3 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.3. Há processamento da produção paralela (não orgânica)?</h5>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ha_processamento_producao_paralela" value="true" checked={safeData.ha_processamento_producao_paralela === true} onChange={handleChange} />
            <label className="form-check-label">Sim</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ha_processamento_producao_paralela" value="false" checked={safeData.ha_processamento_producao_paralela === false} onChange={handleChange} />
            <label className="form-check-label">Não</label>
          </div>
          {safeData.ha_processamento_producao_paralela && (
            <div className="mt-2">
              <label className="form-label small">12.3.1. Caso exista processamento de produtos orgânicos e não orgânicos na mesma área...</label>
              <textarea name="descricao_processamento_producao_paralela" className="form-control" rows="3" value={safeData.descricao_processamento_producao_paralela?.descricao_processamento_producao_paralela || ''} onChange={handleChange}></textarea>
            </div>
          )}
        </div>
        <hr />

        {/* 12.4 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.4. Descreva como é feita a higienização dos equipamentos e das instalações...</h5>
          <textarea name="higienizacao_equipamentos_instalacoes" className="form-control" rows="3" value={safeData.higienizacao_equipamentos_instalacoes?.higienizacao_equipamentos_instalacoes || ''} onChange={handleChange}></textarea>
        </div>
        <hr />

        {/* 12.5 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.5. Acondicionamento dos produtos</h5>
          <div className="row">
            <div className="col-md-6">
              <h6>EMBALADOS/ENVASADOS</h6>
              <div className="form-group">
                <label className="form-label small">Cite quais produtos são embalados/envasados:</label>
                <textarea name="embalados_envasados_produtos" className="form-control" rows="2" value={safeData.acondicionamento_produtos?.embalados_envasados_produtos || ''} onChange={handleAcondicionamentoChange}></textarea>
              </div>
              <div className="form-group mt-2">
                <label className="form-label small">Descreva como é realizada a embalagem/envase...</label>
                <textarea name="embalados_envasados_descricao" className="form-control" rows="2" value={safeData.acondicionamento_produtos?.embalados_envasados_descricao || ''} onChange={handleAcondicionamentoChange}></textarea>
              </div>
            </div>
            <div className="col-md-6">
              <h6>GRANEL</h6>
              <div className="form-group">
                <label className="form-label small">Cite quais produtos são comercializados a granel:</label>
                <textarea name="granel_produtos" className="form-control" rows="2" value={safeData.acondicionamento_produtos?.granel_produtos || ''} onChange={handleAcondicionamentoChange}></textarea>
              </div>
              <div className="form-group mt-2">
                <label className="form-label small">Descreva como é realizada a identificação e separação...</label>
                <textarea name="granel_descricao" className="form-control" rows="2" value={safeData.acondicionamento_produtos?.granel_descricao || ''} onChange={handleAcondicionamentoChange}></textarea>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* 12.6 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.6. Os produtos são rotulados?</h5>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="produtos_sao_rotulados" value="true" checked={safeData.produtos_sao_rotulados === true} onChange={handleChange} />
            <label className="form-check-label">Sim</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="produtos_sao_rotulados" value="false" checked={safeData.produtos_sao_rotulados === false} onChange={handleChange} />
            <label className="form-check-label">Não</label>
          </div>
          {safeData.produtos_sao_rotulados && (
            <div className="mt-2">
              <label className="form-label small">Em caso positivo, descreva as informações constantes no rótulo...</label>
              <textarea name="descricao_rotulagem" className="form-control" rows="3" value={safeData.descricao_rotulagem?.descricao_rotulagem || ''} onChange={handleChange}></textarea>
            </div>
          )}
        </div>
        <hr />

        {/* 12.7 */}
        <CheckboxGroup
            title="12.7. Quais os procedimentos adotados para o armazenamento dos produtos?"
            options={['Identificação clara de produtos orgânicos e não orgânicos', 'Local específico para armazenamento de lotes de produtos orgânicos', 'Local é mantido limpo e higienizado', 'Equipamentos/embalagens/envase feitos de materiais que não interferem na composição dos produtos', 'Outros - citar:']}
            selectedString={safeData.procedimentos_armazenamento}
            onSelectionChange={(newValue) => onSectionChange({ ...safeData, procedimentos_armazenamento: newValue })}
            otherOption="Outros - citar:"
            otherValue={safeData.procedimentos_armazenamento_outros}
            onOtherChange={handleChange}
            otherName="procedimentos_armazenamento_outros"
            otherPlaceholder="Especifique outros procedimentos..."
        />
        <hr />
        
        {/* 12.8 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.8. Como é feito o controle de pragas em instalações de processamento, armazenamento e transporte de produtos orgânicos?</h5>
          <textarea name="controle_pragas_instalacoes" className="form-control" rows="3" value={safeData.controle_pragas_instalacoes?.controle_pragas_instalacoes || ''} onChange={handleChange}></textarea>
        </div>
        <hr />

        {/* 12.9 */}
        <div className="form-group mb-4">
          <h5 className="card-title">12.9. Descreva como é feito o transporte dos produtos orgânicos?</h5>
          <textarea name="transporte_produtos_organicos" className="form-control" rows="3" value={safeData.transporte_produtos_organicos?.transporte_produtos_organicos || ''} onChange={handleChange}></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao12;