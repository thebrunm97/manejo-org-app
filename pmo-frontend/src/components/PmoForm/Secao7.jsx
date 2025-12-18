// src/components/PmoForm/Secao7.jsx

import React from 'react';
import CheckboxGroup from './CheckboxGroup';

function TabelaMembrosFamilia({ membros, onMembrosChange }) {
  // GARANTIA: Se 'membros' não for um array, usa um array vazio para evitar o erro.
  const membrosArray = Array.isArray(membros) ? membros : [];

  const handleMemberChange = (index, field, value) => {
    const novosMembros = [...membrosArray];
    novosMembros[index][field] = value;
    onMembrosChange(novosMembros);
  };

  const adicionarMembro = () => {
    onMembrosChange([...membrosArray, { nome: '', parentesco: '', funcao: '' }]);
  };

  const removerMembro = (index) => {
    const novosMembros = membrosArray.filter((_, i) => i !== index);
    onMembrosChange(novosMembros);
  };

  return (
    <div className="form-group mb-4">
      <h5 className="card-title">7.1. Quais os membros da família estão envolvidos na produção?</h5>
      {/* Agora usamos 'membrosArray' que é garantidamente um array */}
      {membrosArray.map((membro, index) => (
        <div key={index} className="row g-3 align-items-center mb-2">
          <div className="col-sm">
            <input type="text" className="form-control" placeholder="Nome do Membro" value={membro.nome} onChange={(e) => handleMemberChange(index, 'nome', e.target.value)} />
          </div>
          <div className="col-sm">
            <input type="text" className="form-control" placeholder="Parentesco" value={membro.parentesco} onChange={(e) => handleMemberChange(index, 'parentesco', e.target.value)} />
          </div>
          <div className="col-sm">
            <input type="text" className="form-control" placeholder="Função na Produção" value={membro.funcao} onChange={(e) => handleMemberChange(index, 'funcao', e.target.value)} />
          </div>
          <div className="col-sm-auto">
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removerMembro(index)}>Remover</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline-primary mt-2" onClick={adicionarMembro}>+ Adicionar Membro</button>
    </div>
  );
}


// O resto do componente Secao7 permanece o mesmo
function Secao7({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ha_mao_de_obra_nao_familiar") {
      onSectionChange({ ...safeData, [name]: value === 'true' });
    } else {
      onSectionChange({ ...safeData, [name]: value });
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>7. ASPECTOS SOCIAIS</h3>
      </div>
      <div className="card-body">
        <TabelaMembrosFamilia 
            membros={safeData.membros_familia_producao}
            onMembrosChange={(newMembros) => onSectionChange({...safeData, membros_familia_producao: newMembros})}
        />
        <hr/>
        <div className="form-group mb-4">
            <h5 className="card-title">7.2. Há mão de obra que não seja da família?</h5>
            <div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="ha_mao_de_obra_nao_familiar" id="mao_de_obra_sim" value="true" checked={safeData.ha_mao_de_obra_nao_familiar === true} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="mao_de_obra_sim">Sim</label>
              </div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="ha_mao_de_obra_nao_familiar" id="mao_de_obra_nao" value="false" checked={safeData.ha_mao_de_obra_nao_familiar === false} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="mao_de_obra_nao">Não</label>
              </div>
            </div>
            {safeData.ha_mao_de_obra_nao_familiar && (
                <div className="mt-3">
                    <div className="mb-3">
                        <label className="form-label small">Quantas?</label>
                        <input type="number" name="quantidade_mao_de_obra" value={safeData.quantidade_mao_de_obra || ''} onChange={handleChange} className="form-control" style={{ maxWidth: '150px' }} />
                    </div>
                    <CheckboxGroup
                        title="Qual a relação trabalhista?"
                        options={['Trabalhador temporário', 'Trabalhador permanente', 'Parceria']}
                        selectedString={safeData.relacao_trabalhista}
                        onSelectionChange={(newValue) => onSectionChange({ ...safeData, relacao_trabalhista: newValue })}
                    />
                </div>
            )}
        </div>
        <hr/>
        <CheckboxGroup
          title="7.3. Incentiva e promove atividades educativas envolvendo família e/ou funcionário? Se sim, qual(is)?"
          options={['Incentivo à escolarização', 'Cursos', 'Outras. Quais?']}
          selectedString={safeData.incentivo_atividades_educativas}
          onSelectionChange={(newValue) => onSectionChange({ ...safeData, incentivo_atividades_educativas: newValue })}
          otherOption="Outras. Quais?"
          otherValue={safeData.incentivo_atividades_outros}
          onOtherChange={handleChange}
          otherName="incentivo_atividades_outros"
          otherPlaceholder="Especifique as outras atividades..."
        />
        <hr/>
        <CheckboxGroup
          title="7.4. Como se relaciona com outros produtores e com as atividades culturais?"
          options={['Participa de associação de produção ou associação comunitária.', 'Participa de atividades que valorizam a cultura local.', 'Promove atividades culturais que valorizam a cultura local.']}
          selectedString={safeData.relacionamento_outros_produtores}
          onSelectionChange={(newValue) => onSectionChange({ ...safeData, relacionamento_outros_produtores: newValue })}
        />
      </div>
    </div>
  );
}

export default Secao7;