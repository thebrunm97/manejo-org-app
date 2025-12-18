// src/components/PmoForm/SeparacaoAreasProducaoParalela.jsx
import React from 'react';

function SeparacaoAreasProducaoParalela({ data, onDataChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedDescricao = data.descricao_separacao_areas_producao_paralela ?
        data.descricao_separacao_areas_producao_paralela.split('; ').filter(Boolean) : [];
      if (checked) {
        updatedDescricao.push(value);
      } else {
        const index = updatedDescricao.indexOf(value);
        if (index > -1) {
          updatedDescricao.splice(index, 1);
        }
      }
      onDataChange({ ...data, descricao_separacao_areas_producao_paralela: updatedDescricao.join('; ') });
    } else {
      onDataChange({ ...data, [name]: value });
    }
  };

  // Funções auxiliares para verificar se o checkbox está marcado
  const isChecked = (value) => {
    return data.descricao_separacao_producao_paralela && data.descricao_separacao_producao_paralela.includes(value);
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.8 Separação de Áreas em Caso de Produção Paralela</h5>
      <p>Em caso de produção paralela (produção orgânica e não orgânica), como realiza a separação das áreas? </p>
      <div className="form-group">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="areasDiferentes"
            name="separacao_areas_producao_paralela_areas_diferentes"
            value="Áreas diferentes e identificadas"
            checked={data.descricao_separacao_areas_producao_paralela?.includes("Áreas diferentes e identificadas") || false}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="areasDiferentes">
            Áreas diferentes e identificadas 
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="especiesDiferentes"
            name="separacao_areas_producao_paralela_especies_diferentes"
            value="Espécies diferentes ou variedades que apresentam diferenças visuais"
            checked={data.descricao_separacao_areas_producao_paralela?.includes("Espécies diferentes ou variedades que apresentam diferenças visuais") || false}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="especiesDiferentes">
            Espécies diferentes ou variedades que apresentam diferenças visuais 
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="insumosSeparados"
            name="separacao_areas_producao_paralela_insumos_identificados_separados"
            value="Insumos identificados e armazenados separadamente"
            checked={data.descricao_separacao_areas_producao_paralela?.includes("Insumos identificados e armazenados separadamente") || false}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="insumosSeparados">
            Insumos identificados e armazenados separadamente 
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="animaisEspeciesDiferentes"
            name="separacao_areas_producao_paralela_animais_especies_diferentes"
            value="Animais de espécies diferentes"
            checked={data.descricao_separacao_areas_producao_paralela?.includes("Animais de espécies diferentes") || false}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="animaisEspeciesDiferentes">
            Animais de espécies diferentes 
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="animaisMesmaEspecie"
            name="separacao_areas_producao_paralela_animais_mesma_especie_finalidades"
            value="Animais da mesma espécie com finalidades produtivas diferentes"
            checked={data.descricao_separacao_areas_producao_paralela?.includes("Animais da mesma espécie com finalidades produtivas diferentes") || false}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="animaisMesmaEspecie">
            Animais da mesma espécie com finalidades produtivas diferentes 
          </label>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="outrosCitar" className="form-label">Outros, citar: </label>
          <textarea
            name="descricao_separacao_areas_producao_paralela_outros"
            value={data.descricao_separacao_areas_producao_paralela_outros || ''}
            onChange={handleChange}
            className="form-control"
            rows="2"
            placeholder="Descreva outras formas de separação..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default SeparacaoAreasProducaoParalela;