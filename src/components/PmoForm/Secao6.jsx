// src/components/PmoForm/Secao6.jsx
import React from 'react';
import CheckboxGroup from './CheckboxGroup'; // PASSO 1: Importa o componente reutilizável

// --- Componente Principal da Seção 6 ---
function Secao6({ data, onSectionChange }) {
  // Se 'data' for nulo ou indefinido, usamos um objeto vazio como fallback para evitar erros.
  const safeData = data || {};

  // Manipulador genérico para campos de texto e radio buttons
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "ha_risco_contaminacao_agua") {
        onSectionChange({ ...safeData, [name]: value === 'true' });
    } else {
        onSectionChange({ ...safeData, [name]: value });
    }
  };

  const riscoContaminacao = safeData.ha_risco_contaminacao_agua;

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>6. ASPECTOS AMBIENTAIS</h3>
      </div>
      <div className="card-body">

        <CheckboxGroup
          title="6.1. Como irá promover a biodiversidade..."
          options={['Culturas consorciadas', 'Sistemas agroflorestais', 'Rotação de culturas', 'Plantio em nível', 'Recuperação/enriquecimento de APPs', 'Plantio direto', 'Corredor ecológico...', 'Preservação da mata ciliar', 'Manejo do mato...', 'Cercamento de nascentes', 'Ausência de fogo', 'Terraceamento', 'Adubação verde', 'Mantém nascente de água própria', 'Adubos orgânicos', 'Realiza manejo das águas residuais', 'Diversificação da produção', 'Evita o desperdício de água', 'Plantio de flores...', 'Orienta vizinhos', 'Cultivo em aleias/faixas', 'Quebra ventos', 'Cobertura do solo']}
          selectedString={safeData.promocao_biodiversidade}
          onSelectionChange={(newValue) => onSectionChange({ ...safeData, promocao_biodiversidade: newValue })}
        />
        <hr/>
        
        {/* PASSO 2: Usar o CheckboxGroup importado com as novas props */}
        <CheckboxGroup
            title="6.2. Qual a fonte de água utilizada na propriedade?"
            options={['Mina própria...', 'Cisterna', 'Açude', 'Mina fora da propriedade', 'Rio ou riacho', 'Canais coletivos...', 'Água subterrânea - Qual?']}
            selectedString={safeData.fonte_agua}
            onSelectionChange={(newValue) => onSectionChange({ ...safeData, fonte_agua: newValue })}
            
            // Props para o campo condicional
            otherOption="Água subterrânea - Qual?"
            otherValue={safeData.fonte_agua_subterranea_especificacao}
            onOtherChange={handleChange}
            otherName="fonte_agua_subterranea_especificacao"
        />
        <hr/>

        <div className="form-group mb-4">
            <h5 className="card-title">6.3. Como controla o uso da água na produção?</h5>
            <textarea name="controle_uso_agua" value={safeData.controle_uso_agua || ''} onChange={handleChange} className="form-control" rows="3"></textarea>
        </div>
        <hr/>
        
        <div className="form-group mb-4">
            <h5 className="card-title">6.4. Há risco de contaminação para sua água?</h5>
            <div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="ha_risco_contaminacao_agua" id="risco_sim" value="true" checked={riscoContaminacao === true} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="risco_sim">Sim</label>
              </div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="ha_risco_contaminacao_agua" id="risco_nao" value="false" checked={riscoContaminacao === false} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="risco_nao">Não</label>
              </div>
            </div>
            {riscoContaminacao && (
                <div className="mt-2">
                    <label className="form-label small">Qual(is)?</label>
                    <textarea name="qual_risco_contaminacao_agua" value={safeData.qual_risco_contaminacao_agua || ''} onChange={handleChange} className="form-control" rows="3"></textarea>
                </div>
            )}
        </div>
        <hr/>

        <CheckboxGroup
            title="6.5. Quais os principais riscos de contaminação...?"
            options={['Cultivos transgênicos...', 'Uso de insumos químicos...', 'Contaminação por pulverização...', 'Contaminação dos cursos...', 'Enxurrada', 'Insumos externos...', 'Animais trazidos de fora...']}
            selectedString={safeData.riscos_contaminacao_unidade_producao}
            onSelectionChange={(newValue) => onSectionChange({ ...safeData, riscos_contaminacao_unidade_producao: newValue })}
        />
        <hr/>

        <div className="form-group mb-4">
            <h5 className="card-title">6.6. Como pretende diminuir ou eliminar os riscos...?</h5>
            <textarea name="medidas_minimizar_riscos_contaminacao" value={safeData.medidas_minimizar_riscos_contaminacao || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
        </div>
        <hr/>

        <CheckboxGroup
            title="6.7. Que práticas são adotadas para o manejo de resíduos orgânicos?"
            options={['Acumula o esterco...', 'Faz compostagem', 'Coloca no biodigestor', 'Produz biofertilizante', 'Faz vermicompostagem/húmus', 'Utiliza na alimentação de animais']}
            selectedString={safeData.praticas_manejo_residuos_organicos}
            onSelectionChange={(newValue) => onSectionChange({ ...safeData, praticas_manejo_residuos_organicos: newValue })}
        />
        <hr/>
        
        <div className="form-group mb-4">
            <h5 className="card-title">6.8. Compostagem</h5>
            <textarea name="compostagem" value={safeData.compostagem || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
        </div>
        <hr/>

        <div className="form-group mb-4">
            <h5 className="card-title">6.9. Como é tratado/manejado o lixo na propriedade?</h5>
            <textarea name="tratamento_lixo" value={safeData.tratamento_lixo || ''} onChange={handleChange} className="form-control" rows="3"></textarea>
        </div>
      </div>
    </div>
  );
}

export default Secao6;