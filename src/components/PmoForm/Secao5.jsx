// src/components/PmoForm/Secao5.jsx
import React from 'react';

// Tabela específica para a Seção 5
const TabelaProducaoTerceirizada = ({ itens, onItensChange }) => {
  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const novosItens = [...itens];

    // Lógica especial para o checkbox de "Processamento"
    if (name === 'processamento_sim') {
        novosItens[index]['processamento'] = true;
    } else if (name === 'processamento_nao') {
        novosItens[index]['processamento'] = false;
    } else {
        novosItens[index][name] = value;
    }
    
    onItensChange(novosItens);
  };

  const adicionarItem = () => {
    // Define o valor inicial de 'processamento' como null ou undefined
    onItensChange([...itens, { fornecedor: '', localidade: '', produto: '', quantidade_ano: '', processamento: null }]);
  };

  const removerItem = (index) => {
    onItensChange(itens.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h6 className="card-subtitle mb-2 text-muted">5.1. Adquire produtos de terceiros para processar ou comercializar sem processamento?</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Fornecedor</th>
              <th>Localidade</th>
              <th>Produto</th>
              <th>Quantidade/ano</th>
              <th style={{ minWidth: '150px' }}>Processamento</th>
              <th style={{ width: "5%" }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens?.map((item, index) => (
              <tr key={index}>
                <td><input type="text" name="fornecedor" value={item.fornecedor || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="text" name="localidade" value={item.localidade || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="text" name="produto" value={item.produto || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" step="0.01" name="quantidade_ano" value={item.quantidade_ano || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td>
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name={`processamento_sim`} // Nome único para o rádio "Sim"
                        id={`proc_sim_${index}`}
                        checked={item.processamento === true}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                      <label className="form-check-label" htmlFor={`proc_sim_${index}`}>Sim</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name={`processamento_nao`} // Nome único para o rádio "Não"
                        id={`proc_nao_${index}`}
                        checked={item.processamento === false}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                      <label className="form-check-label" htmlFor={`proc_nao_${index}`}>Não</label>
                    </div>
                  </div>
                </td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-success btn-sm mt-2" onClick={adicionarItem}>+ Adicionar Produto Terceirizado</button>
    </div>
  );
};


// --- Componente Principal da Seção 5 ---
function Secao5({ data, onSectionChange }) { 
    // O manipulador de mudança agora precisa reconstruir o objeto corretamente
  const handleTabelaChange = (novoArray) => {
    onSectionChange({
      // Preserva outras chaves da Seção 5, se houver
      ...data,
      // Atualiza a chave que contém o array
      produtos_terceirizados: novoArray,
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>5. PRODUÇÃO TERCEIRIZADA</h3>
      </div>
      <div className="card-body">
        <TabelaProducaoTerceirizada
          // <<< CORREÇÃO APLICADA AQUI >>>
          // Passamos o array que está DENTRO do objeto 'data'
          itens={data?.produtos_terceirizados || []}
          onItensChange={handleTabelaChange}
        />
      </div>
    </div>
  );
}

export default Secao5;