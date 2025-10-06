// src/components/PmoForm/Secao6_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover Card/CardHeader >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, TextField, FormControl,
  FormLabel, RadioGroup, FormControlLabel, Radio, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxGroupMUI from './CheckboxGroup_MUI';

function Secao6MUI({ data, onSectionChange, errors }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "ha_risco_contaminacao_agua") {
      finalValue = value === 'true';
    }
    onSectionChange({ ...safeData, [name]: finalValue });
  };

  const handleCheckboxChange = (fieldName, newValue) => {
    onSectionChange({ ...safeData, [fieldName]: newValue });
  };

  return (
    // <<< TAREFA 1: O Card foi removido, agora temos um Box para conter os Accordions >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
        Seção 6: Aspectos Ambientais
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta ou grupo vira um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.1. Como irá promover a biodiversidade, conservar o solo e a água e proteger as fontes e nascentes?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxGroupMUI
            options={['Culturas consorciadas', 'Sistemas agroflorestais', 'Rotação de culturas', 'Plantio em nível', 'Recuperação/enriquecimento de APPs', 'Plantio direto', 'Corredor ecológico...', 'Preservação da mata ciliar', 'Manejo do mato...', 'Cercamento de nascentes', 'Ausência de fogo', 'Terraceamento', 'Adubação verde', 'Mantém nascente de água própria', 'Adubos orgânicos', 'Realiza manejo das águas residuais', 'Diversificação da produção', 'Evita o desperdício de água', 'Plantio de flores...', 'Orienta vizinhos', 'Cultivo em aleias/faixas', 'Quebra ventos', 'Cobertura do solo']}
            selectedString={safeData.promocao_biodiversidade}
            onSelectionChange={(newValue) => handleCheckboxChange('promocao_biodiversidade', newValue)}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.2. Qual a fonte de água utilizada na propriedade?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxGroupMUI
            options={['Mina própria...', 'Cisterna', 'Açude', 'Mina fora da propriedade', 'Rio ou riacho', 'Canais coletivos...', 'Água subterrânea - Qual?']}
            selectedString={safeData.fonte_agua}
            onSelectionChange={(newValue) => handleCheckboxChange('fonte_agua', newValue)}
            otherOption="Água subterrânea - Qual?"
            otherValue={safeData.fonte_agua_subterranea_especificacao}
            onOtherChange={handleChange}
            otherName="fonte_agua_subterranea_especificacao"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.3. Como controla o uso da água na produção?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="controle_uso_agua" value={safeData.controle_uso_agua || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.4. Há risco de contaminação para sua água?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <RadioGroup row name="ha_risco_contaminacao_agua" value={String(safeData.ha_risco_contaminacao_agua ?? 'false')} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
            {safeData.ha_risco_contaminacao_agua === true && (
              <TextField name="qual_risco_contaminacao_agua" label="Qual(is)?" value={safeData.qual_risco_contaminacao_agua || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" margin="normal" />
            )}
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.5. Quais os principais riscos de contaminação existentes na sua unidade de produção?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxGroupMUI
            options={['Cultivos transgênicos...', 'Uso de insumos químicos...', 'Contaminação por pulverização...', 'Contaminação dos cursos...', 'Enxurrada', 'Insumos externos...', 'Animais trazidos de fora...']}
            selectedString={safeData.riscos_contaminacao_unidade_producao}
            onSelectionChange={(newValue) => handleCheckboxChange('riscos_contaminacao_unidade_producao', newValue)}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.6. Como pretende diminuir ou eliminar os riscos de contaminação identificados?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="medidas_minimizar_riscos_contaminacao" value={safeData.medidas_minimizar_riscos_contaminacao || ''} onChange={handleChange} fullWidth multiline rows={4} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.7. Que práticas são adotadas para o manejo de resíduos orgânicos?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxGroupMUI
            options={['Acumula o esterco...', 'Faz compostagem', 'Coloca no biodigestor', 'Produz biofertilizante', 'Faz vermicompostagem/húmus', 'Utiliza na alimentação de animais']}
            selectedString={safeData.praticas_manejo_residuos_organicos}
            onSelectionChange={(newValue) => handleCheckboxChange('praticas_manejo_residuos_organicos', newValue)}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.8. Compostagem</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="compostagem" value={safeData.compostagem || ''} onChange={handleChange} fullWidth multiline rows={4} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>6.9. Como é tratado/manejado o lixo na propriedade?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="tratamento_lixo" value={safeData.tratamento_lixo || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao6MUI;