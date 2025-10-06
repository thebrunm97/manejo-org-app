// src/components/PmoForm/Secao13.jsx (versão com layout corrigido)

import React from 'react';
import CheckboxGroup from './CheckboxGroup';
import TabelaDinamica from './TabelaDinamica';

// O sub-componente TabelaNutricaoAnimal não precisa de mudanças, mas o incluo para o arquivo ficar completo.
const TabelaNutricaoAnimal = ({ data, onDataChange }) => {
    // ... (código completo do sub-componente TabelaNutricaoAnimal aqui)
    const safeData = Array.isArray(data) ? data : [];
    const handleItemChange = (index, field, value) => {
      const newData = [...safeData];
      newData[index][field] = value;
      onDataChange(newData);
    };
    const adicionarItem = () => {
      const novoItem = { animal: '', identificacao_ingrediente: '', origem_transgenica: null, descricao: '', procedencia: '', frequencia: '', quantidade: '' };
      onDataChange([...safeData, novoItem]);
    };
    const removerItem = (index) => {
      onDataChange(safeData.filter((_, i) => i !== index));
    };
  
    return (
      <div className="form-group mb-4">
        <h5 className="card-title">13.5. Como você faz a nutrição animal?</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Animal</th>
                <th>Identificação do ingrediente/matéria prima/composição</th>
                <th>Origem Transgênica?</th>
                <th>Descrição (Especificar como é produzido)</th>
                <th>Procedência Interna ou Externa*</th>
                <th>Frequência de utilização</th>
                <th>Quantidade</th>
                <th style={{ width: '100px' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {safeData.map((item, index) => (
                <tr key={index}>
                  <td><input type="text" className="form-control" value={item.animal || ''} onChange={(e) => handleItemChange(index, 'animal', e.target.value)} /></td>
                  <td><input type="text" className="form-control" value={item.identificacao_ingrediente || ''} onChange={(e) => handleItemChange(index, 'identificacao_ingrediente', e.target.value)} /></td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <div className="form-check"><input className="form-check-input" type="radio" name={`origem_transgenica_${index}`} checked={item.origem_transgenica === true} onChange={() => handleItemChange(index, 'origem_transgenica', true)} /><label className="form-check-label">Sim</label></div>
                      <div className="form-check"><input className="form-check-input" type="radio" name={`origem_transgenica_${index}`} checked={item.origem_transgenica === false} onChange={() => handleItemChange(index, 'origem_transgenica', false)} /><label className="form-check-label">Não</label></div>
                    </div>
                  </td>
                  <td><input type="text" className="form-control" value={item.descricao || ''} onChange={(e) => handleItemChange(index, 'descricao', e.target.value)} /></td>
                  <td><input type="text" className="form-control" value={item.procedencia || ''} onChange={(e) => handleItemChange(index, 'procedencia', e.target.value)} /></td>
                  <td><input type="text" className="form-control" value={item.frequencia || ''} onChange={(e) => handleItemChange(index, 'frequencia', e.target.value)} /></td>
                  <td><input type="text" className="form-control" value={item.quantidade || ''} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} /></td>
                  <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn btn-outline-primary mt-2" onClick={adicionarItem}>+ Adicionar Nutrição</button>
        <p className="form-text small mt-2">*Em caso de alimentação de origem externa, provém de sistema orgânico de produção? Em caso de utilização de alimentos não orgânicos, especificar qual a % destes na alimentação total e para qual espécie é fornecido.</p>
      </div>
    );
};

// Sub-componente para a grade estática de planejamento anual (13.6)
const PlanoAnualAlimentacao = ({ data, onDataChange }) => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const safeData = Array.isArray(data) ? data : [];

    const handleItemChange = (index, field, value) => {
        const newData = [...safeData];
        newData[index][field] = value;
        onDataChange(newData);
    };

    const adicionarAlimento = () => {
        const novoItem = { alimento: '', Jan: false, Fev: false, Mar: false, Abr: false, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false };
        onDataChange([...safeData, novoItem]);
    };
    
    const removerAlimento = (index) => {
        const newData = safeData.filter((_, i) => i !== index);
        onDataChange(newData);
    };

    return (
        <div className="form-group mb-4">
            <h5 className="card-title">13.6. Existe um plano anual de alimentação animal?</h5>
            <div className="table-responsive">
                <table className="table table-bordered table-sm text-center">
                    <thead className="table-light">
                        <tr>
                            <th style={{width: '25%'}}>Alimento</th>
                            {meses.map(mes => <th key={mes} style={{width: '6%'}}>{mes}</th>)}
                            <th style={{width: '5%'}}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {safeData.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Pastos, forragens, etc."
                                        value={item.alimento || ''}
                                        onChange={(e) => handleItemChange(index, 'alimento', e.target.value)}
                                    />
                                </td>
                                {meses.map(mes => (
                                    <td key={mes}>
                                        <div className="form-check d-flex justify-content-center">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={item[mes] || false}
                                                onChange={(e) => handleItemChange(index, mes, e.target.checked)}
                                            />
                                        </div>
                                    </td>
                                ))}
                                <td>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removerAlimento(index)}>X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button type="button" className="btn btn-outline-primary mt-2" onClick={adicionarAlimento}>+ Adicionar Alimento</button>
        </div>
    );
};

// --- Componente Principal da Seção 13 ---
function Secao13({ data, onSectionChange }) {
    const safeData = data || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        onSectionChange({ ...safeData, [name]: value });
    };
    
    const handleNestedChange = (e) => {
        const { name, value } = e.target;
        onSectionChange({ ...safeData, [name]: { [name]: value } });
    };

    const handleAquisicaoChange = (e) => {
        const { name, value } = e.target;
        onSectionChange({ ...safeData, aquisicao_animais: { ...safeData.aquisicao_animais, [name]: value } });
    };

    const handleManejoSanitarioChange = (e) => {
        const { name, value } = e.target;
        onSectionChange({ ...safeData, manejo_sanitario_animal: { ...safeData.manejo_sanitario_animal, [name]: { [name]: value } } });
    };

    const colunasEvolucaoPlantel = [
        { header: 'Tipo de animal', key: 'tipo_animal' },
        { header: 'Número de animais atual', key: 'numero_atual', type: 'number' },
        { header: 'Em 1 ano', key: 'em_1_ano', type: 'number' },
        { header: 'Em 3 anos', key: 'em_3_anos', type: 'number' },
        { header: 'Em 5 anos', key: 'em_5_anos', type: 'number' },
    ];

    const colunasTratamentoAnimais = [
        { header: 'Animal/Lote', key: 'animal_lote'},
        { header: 'Diagnóstico da Doença', key: 'diagnostico'},
        { header: 'Tratamento', key: 'tratamento'},
        { header: 'Período de Carência', key: 'periodo_carencia'},
    ];

    const reproducaoAnimaisString = String(safeData.reproducao_animais || '');
    const bemEstarString = String(safeData.bem_estar_animais || '');

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3>13. PRODUÇÃO ANIMAL</h3>
                <p className="mb-0 small text-muted">Preencha abaixo se for produção primária animal.</p>
            </div>
            <div className="card-body">

                <CheckboxGroup
                    title="13.1. Quais as técnicas empregadas para melhorar a fertilidade e a produtividade dos pastos?"
                    options={['Pastejo rotacionado', 'Consorciação de pastagens', 'Rotação de culturas', 'Adubação orgânica', 'Uso de quebra-vento', 'Plantio de árvores nativas e/ou frutíferas', 'Integração lavoura/pecuária/floresta', 'Outros - citar:']}
                    selectedString={safeData.tecnicas_melhoria_pastos}
                    onSelectionChange={(newValue) => onSectionChange({ ...safeData, tecnicas_melhoria_pastos: newValue })}
                    otherOption="Outros - citar:"
                    otherValue={safeData.tecnicas_melhoria_pastos_outros}
                    onOtherChange={handleChange}
                    otherName="tecnicas_melhoria_pastos_outros"
                />
                <hr />

                <div className="form-group mb-4">
                    <CheckboxGroup
                        title="13.2. Como realiza a reprodução dos animais?"
                        options={['Compra animais de fora para reposição de matrizes', 'Reproduz os próprios animais pela monta natural', 'Reproduz os animais por métodos artificiais.', 'Outros - citar:']}
                        selectedString={safeData.reproducao_animais}
                        onSelectionChange={(newValue) => onSectionChange({ ...safeData, reproducao_animais: newValue })}
                        otherOption="Outros - citar:"
                        otherValue={safeData.reproducao_animais_outros}
                        onOtherChange={handleChange}
                        otherName="reproducao_animais_outros"
                    />
                    {reproducaoAnimaisString.includes('monta natural') && (
                        <div className="mt-2">
                            <label className="form-label small">Se monta natural, citar macho presente no plantel/rebanho:</label>
                            <textarea name="reproducao_animais_monta_natural_detalhes" className="form-control" rows="2" value={safeData.reproducao_animais_monta_natural_detalhes || ''} onChange={handleChange}></textarea>
                        </div>
                    )}
                    {reproducaoAnimaisString.includes('métodos artificiais') && (
                        <div className="mt-2">
                            <label className="form-label small">Se métodos artificiais, citar as técnicas empregadas:</label>
                            <textarea name="reproducao_animais_metodos_artificiais_detalhes" className="form-control" rows="2" value={safeData.reproducao_animais_metodos_artificiais_detalhes || ''} onChange={handleChange}></textarea>
                        </div>
                    )}
                </div>
                <hr />
                
                <div className="form-group mb-4">
                    <h5 className="card-title">13.3. Aquisição de animais</h5>
                    <CheckboxGroup
                        title="13.3.1. De qual sistema de produção eles são adquiridos?"
                        options={['Sistema orgânico', 'Sistema não orgânico']}
                        selectedString={safeData.aquisicao_animais?.sistema_producao_aquisicao}
                        onSelectionChange={(newValue) => handleAquisicaoChange({ target: { name: 'sistema_producao_aquisicao', value: newValue }})}
                    />
                    <div className="mt-2">
                        <label className="form-label">13.3.2. Especificar qual espécie está adquirindo; qual a finalidade/aptidão e qual a idade dos animais adquiridos.</label>
                        <textarea name="especificacao_aquisicao_animais" className="form-control" rows="3" value={safeData.aquisicao_animais?.especificacao_aquisicao_animais?.especificacao_aquisicao_animais || ''} onChange={(e) => onSectionChange({ ...safeData, aquisicao_animais: { ...safeData.aquisicao_animais, especificacao_aquisicao_animais: { especificacao_aquisicao_animais: e.target.value } } })}></textarea>
                    </div>
                </div>
                <hr/>
                
                <TabelaDinamica
                    title="13.4. Como será a evolução do seu plantel (Número de indivíduos ao longo dos anos)?"
                    columns={colunasEvolucaoPlantel}
                    data={safeData.evolucao_plantel}
                    onDataChange={(newData) => onSectionChange({ ...safeData, evolucao_plantel: newData })}
                    itemName="Tipo de Animal"
                />
                <hr/>
                
                <TabelaNutricaoAnimal
                    data={safeData.nutricao_animal}
                    onDataChange={(newData) => onSectionChange({ ...safeData, nutricao_animal: newData })}
                />
                <hr/>
                
                <PlanoAnualAlimentacao 
                    data={safeData.plano_anual_alimentacao_animal}
                    onDataChange={(newData) => onSectionChange({ ...safeData, plano_anual_alimentacao_animal: newData })}
                />
                <hr/>
                
                <div className="form-group mb-4">
                    <h5 className="card-title">13.7. Como é feita a alimentação de mamíferos jovens?</h5>
                    <textarea name="alimentacao_mamiferos_jovens" className="form-control" rows="3" value={safeData.alimentacao_mamiferos_jovens?.alimentacao_mamiferos_jovens || ''} onChange={handleNestedChange}></textarea>
                </div>
                <hr/>

                <CheckboxGroup
                    title="13.8. Como promove o bem-estar dos animais?"
                    options={['Manejo adequado e tranquilo', 'Água de boa qualidade', 'Alimento farto e de boa qualidade', 'Instalações adequadas e confortáveis', 'Lotação adequada', 'Áreas de sombreamento no pasto', 'Acesso diário dos animais confinados a área com sol e pastagem', 'Promove o isolamento dos animais doentes e em tratamento', 'Nutrição adequada', 'Tratamento e suporte adequados aos animais doentes', 'Sombreamento artificial em áreas de lavoura como opção de pastoreio', 'Manejo adequado da “cama”', 'Outras formas:']}
                    selectedString={safeData.bem_estar_animais}
                    onSelectionChange={(newValue) => onSectionChange({ ...safeData, bem_estar_animais: newValue })}
                    otherOption="Manejo adequado da “cama”"
                    otherValue={safeData.bem_estar_animais_manejo_cama}
                    onOtherChange={handleChange}
                    otherName="bem_estar_animais_manejo_cama"
                    otherPlaceholder="Especificar o material da cama e a espécie para qual ela é utilizada."
                />
                {bemEstarString.includes('Outras formas:') && (
                     <div className="mt-2">
                        <label className="form-label small">Outras formas:</label>
                        <textarea name="bem_estar_animais_outras_formas" className="form-control" rows="2" value={safeData.bem_estar_animais_outras_formas || ''} onChange={handleChange}></textarea>
                    </div>
                )}
                <hr/>

                {/* ================== INÍCIO DA MUDANÇA ================== */}
                <div className="form-group mb-4">
                    <h5 className="card-title">13.9. Manejo sanitário animal?</h5>
                    <div className="ps-3">
                        <div className="form-group mb-3">
                            <label className="form-label">13.9.1. O que é feito para a promoção da saúde animal?</label>
                            <textarea name="promocao_saude_animal" className="form-control" rows="3" value={safeData.manejo_sanitario_animal?.promocao_saude_animal?.promocao_saude_animal || ''} onChange={handleManejoSanitarioChange}></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">13.9.2. Como é feito o controle de vermes e parasitas?</label>
                            <textarea name="controle_vermes_parasitas" className="form-control" rows="3" value={safeData.manejo_sanitario_animal?.controle_vermes_parasitas?.controle_vermes_parasitas || ''} onChange={handleManejoSanitarioChange}></textarea>
                        </div>
                        <div className="mt-4"> {/* Div para dar espaço */}
                          <TabelaDinamica
                              title="13.9.3. Descreva os tratamentos realizados em animais doentes."
                              columns={colunasTratamentoAnimais}
                              data={safeData.manejo_sanitario_animal?.tratamento_animais_doentes}
                              onDataChange={(newData) => onSectionChange({ ...safeData, manejo_sanitario_animal: {...safeData.manejo_sanitario_animal, tratamento_animais_doentes: newData}})}
                              itemName="Tratamento"
                              itemNoun="o"
                          />
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">13.9.4. Como é feita a castração dos animais?</label>
                            <textarea name="castracao_animais" className="form-control" rows="3" value={safeData.manejo_sanitario_animal?.castracao_animais?.castracao_animais || ''} onChange={handleManejoSanitarioChange}></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">13.9.5. Como é feito o corte de pontas de chifres, o mochamento e as marcações necessárias?</label>
                            <textarea name="corte_chifres_mochamento_marcacoes" className="form-control" rows="3" value={safeData.manejo_sanitario_animal?.corte_chifres_mochamento_marcacoes?.corte_chifres_mochamento_marcacoes || ''} onChange={handleManejoSanitarioChange}></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">13.9.6. Como é feita a vacinação dos animais?</label>
                            <textarea name="vacinacao_animais" className="form-control" rows="3" value={safeData.manejo_sanitario_animal?.vacinacao_animais?.vacinacao_animais || ''} onChange={handleManejoSanitarioChange}></textarea>
                        </div>
                    </div>
                </div>
                {/* =================== FIM DA MUDANÇA ==================== */}
            </div>
        </div>
    );
}

export default Secao13;