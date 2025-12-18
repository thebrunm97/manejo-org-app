import React from 'react';

// Tabela específica para os Animais de Serviço
const TabelaAnimaisServico = ({ itens, onItensChange }) => {
  const handleItemChange = (index, e) => {
    const novosItens = [...itens];
    novosItens[index][e.target.name] = e.target.value;
    onItensChange(novosItens);
  };

  const adicionarItem = () => {
    onItensChange([...itens, { especie: '', quantidade: '', manejo: '', insumos: '', tratamento_dejetos: '' }]);
  };

  const removerItem = (index) => {
    onItensChange(itens.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h6 className="card-subtitle mb-2 text-muted">4.1.1 Animais de Serviço</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Espécie</th>
              <th>Quantidade</th>
              <th>Manejo</th>
              <th>Insumos</th>
              <th>Tratamento dos Dejetos</th>
              <th style={{ width: "5%" }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens?.map((item, index) => (
              <tr key={index}>
                <td><input type="text" name="especie" value={item.especie || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" name="quantidade" value={item.quantidade || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><textarea name="manejo" value={item.manejo || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" rows="2"></textarea></td>
                <td><textarea name="insumos" value={item.insumos || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" rows="2"></textarea></td>
                <td><textarea name="tratamento_dejetos" value={item.tratamento_dejetos || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" rows="2"></textarea></td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-success btn-sm mt-2" onClick={adicionarItem}>+ Adicionar Animal de Serviço</button>
    </div>
  );
};

// Tabela específica para os Animais de Subsistência, etc.
const TabelaAnimaisSubsistencia = ({ itens, onItensChange }) => {
  const handleItemChange = (index, e) => {
    const novosItens = [...itens];
    novosItens[index][e.target.name] = e.target.value;
    onItensChange(novosItens);
  };
  
  const adicionarItem = () => {
    onItensChange([...itens, { tipo: '', especie: '', quantidade: '', insumos: '', tratamento_dejetos: '', circulacao_area_organica: '' }]);
  };
  
  const removerItem = (index) => {
    onItensChange(itens.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h6 className="card-subtitle mb-2 text-muted">4.1.2 Animais de Subsistência, Companhia, Ornamentais e Outros</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Tipo</th>
              <th>Espécie</th>
              <th>Quantidade</th>
              <th>Insumos</th>
              <th>Tratamento dos Dejetos</th>
              <th>Circulação na Área Orgânica</th>
              <th style={{ width: "5%" }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens?.map((item, index) => (
              <tr key={index}>
                <td>
                  <select name="tipo" value={item.tipo || ''} onChange={(e) => handleItemChange(index, e)} className="form-select">
                    <option value="" disabled>Selecione...</option>
                    <option value="Subsistência">Subsistência</option>
                    <option value="Companhia">Companhia</option>
                    <option value="Ornamental">Ornamental</option>
                    <option value="Outro">Outro</option>
                  </select>
                </td>
                <td><input type="text" name="especie" value={item.especie || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" name="quantidade" value={item.quantidade || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><textarea name="insumos" value={item.insumos || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" rows="2"></textarea></td>
                <td><textarea name="tratamento_dejetos" value={item.tratamento_dejetos || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" rows="2"></textarea></td>
                <td><textarea name="circulacao_area_organica" value={item.circulacao_area_organica || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" rows="2"></textarea></td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-success btn-sm mt-2" onClick={adicionarItem}>+ Adicionar Animal de Subsistência/Outros</button>
    </div>
  );
};


// --- Componente Principal da Seção 4 ---
function Secao4({ data, onSectionChange }) {
  const temAnimais = data?.ha_animais_servico_subsistencia_companhia?.ha_animais_servico_subsistencia_companhia || false;

  const handleSimNaoChange = (e) => {
    const valor = e.target.value === 'true';
    if (!valor) {
      onSectionChange({
        ha_animais_servico_subsistencia_companhia: { ha_animais_servico_subsistencia_companhia: false },
        animais_servico: { lista_animais_servico: [] },
        animais_subsistencia_companhia_ornamentais: { lista_animais_subsistencia: [] }
      });
    } else {
      onSectionChange({
        ...data,
        ha_animais_servico_subsistencia_companhia: { ha_animais_servico_subsistencia_companhia: true }
      });
    }
  };

  const handleArrayChange = (objKey, arrayKey, novoArray) => {
    onSectionChange({ ...data, [objKey]: { ...data[objKey], [arrayKey]: novoArray } });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>4. ANIMAIS DE SERVIÇO, SUBSISTÊNCIA, COMPANHIA, ORNAMENTAIS E OUTROS.</h3>
      </div>
      
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">4.1. Há animais de serviço, subsistência, companhia ou ornamentais?</h6>
        <div className="form-group mb-3">
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ha_animais" id="animais_sim" value="true" checked={temAnimais === true} onChange={handleSimNaoChange} />
            <label className="form-check-label" htmlFor="animais_sim">Sim</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ha_animais" id="animais_nao" value="false" checked={temAnimais === false} onChange={handleSimNaoChange} />
            <label className="form-check-label" htmlFor="animais_nao">Não</label>
          </div>
        </div>

        {temAnimais && (
          <div>
            <p>Caso exista, preencha as tabelas abaixo:</p>
            <hr />
            
            <TabelaAnimaisServico
              itens={data?.animais_servico?.lista_animais_servico || []}
              onItensChange={(novoArray) => handleArrayChange('animais_servico', 'lista_animais_servico', novoArray)}
            />
            
            <hr />
            
            <TabelaAnimaisSubsistencia
              itens={data?.animais_subsistencia_companhia_ornamentais?.lista_animais_subsistencia || []}
              onItensChange={(novoArray) => handleArrayChange('animais_subsistencia_companhia_ornamentais', 'lista_animais_subsistencia', novoArray)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Secao4;