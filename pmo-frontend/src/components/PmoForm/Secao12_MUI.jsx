// src/components/PmoForm/Secao12_MUI.jsx (Refatorado com Accordion e Grid v2)

import React from 'react';
// <<< TAREFA 2: Importar componentes do Accordion >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Typography, TextField, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxGroupMUI from './CheckboxGroup_MUI';

// Subcomponente para a questão 12.5
const AcondicionamentoProdutos = ({ data, onAcondicionamentoChange }) => (
  <Box>
    {/* <<< TAREFA 1: Corrigindo a sintaxe do Grid para a v2 (size={{...}}) >>> */}
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="subtitle1" gutterBottom>EMBALADOS/ENVASADOS</Typography>
        <TextField name="embalados_envasados_produtos" label="Cite quais produtos" value={data?.embalados_envasados_produtos || ''} onChange={onAcondicionamentoChange} fullWidth multiline rows={2} variant="outlined" margin="dense" />
        <TextField name="embalados_envasados_descricao" label="Descreva o procedimento" value={data?.embalados_envasados_descricao || ''} onChange={onAcondicionamentoChange} fullWidth multiline rows={2} variant="outlined" margin="dense" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="subtitle1" gutterBottom>A GRANEL</Typography>
        <TextField name="granel_produtos" label="Cite quais produtos" value={data?.granel_produtos || ''} onChange={onAcondicionamentoChange} fullWidth multiline rows={2} variant="outlined" margin="dense" />
        <TextField name="granel_descricao" label="Descreva a identificação/separação" value={data?.granel_descricao || ''} onChange={onAcondicionamentoChange} fullWidth multiline rows={2} variant="outlined" margin="dense" />
      </Grid>
    </Grid>
  </Box>
);

function Secao12MUI({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name.startsWith('ha_') || name === 'produtos_sao_rotulados') {
      finalValue = value === 'true';
    }
    const camposAninhados = ['higienizacao_produtos_organicos', 'descricao_processamento_producao_organica', 'descricao_processamento_producao_paralela', 'higienizacao_equipamentos_instalacoes', 'descricao_rotulagem', 'controle_pragas_instalacoes', 'transporte_produtos_organicos'];
    if (camposAninhados.includes(name)) {
      onSectionChange({ ...safeData, [name]: { [name]: finalValue } });
    } else {
      onSectionChange({ ...safeData, [name]: finalValue });
    }
  };

  const handleCheckboxChange = (fieldName, newValue) => {
    onSectionChange({ ...safeData, [fieldName]: newValue });
  };
  
  const handleAcondicionamentoChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ ...safeData, acondicionamento_produtos: { ...(safeData.acondicionamento_produtos || {}), [name]: value } });
  };

  return (
    // <<< TAREFA 2: Estrutura de Card substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
        Seção 12: Pós-Colheita, Processamento e Transporte
      </Typography>

      {/* <<< TAREFA 3: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.1. Descreva a higienização dos produtos orgânicos (se houver)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="higienizacao_produtos_organicos" value={safeData.higienizacao_produtos_organicos?.higienizacao_produtos_organicos || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.2. É realizado algum tipo de processamento na produção orgânica?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row name="ha_processamento_producao_organica" value={String(safeData.ha_processamento_producao_organica ?? 'false')} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
            {safeData.ha_processamento_producao_organica && <TextField label="Descreva o procedimento" name="descricao_processamento_producao_organica" value={safeData.descricao_processamento_producao_organica?.descricao_processamento_producao_organica || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" margin="normal" />}
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.3. Há processamento da produção paralela (não orgânica)?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row name="ha_processamento_producao_paralela" value={String(safeData.ha_processamento_producao_paralela ?? 'false')} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
            {safeData.ha_processamento_producao_paralela && <TextField label="Descreva a separação e controle" name="descricao_processamento_producao_paralela" value={safeData.descricao_processamento_producao_paralela?.descricao_processamento_producao_paralela || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" margin="normal" />}
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.4. Descreva a higienização de equipamentos e instalações</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="higienizacao_equipamentos_instalacoes" value={safeData.higienizacao_equipamentos_instalacoes?.higienizacao_equipamentos_instalacoes || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
           <Typography sx={{ fontWeight: 'bold' }}>12.5. Acondicionamento dos produtos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AcondicionamentoProdutos data={safeData.acondicionamento_produtos} onAcondicionamentoChange={handleAcondicionamentoChange} />
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.6. Os produtos são rotulados?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row name="produtos_sao_rotulados" value={String(safeData.produtos_sao_rotulados ?? 'false')} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
            {safeData.produtos_sao_rotulados && <TextField label="Descreva as informações do rótulo" name="descricao_rotulagem" value={safeData.descricao_rotulagem?.descricao_rotulagem || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" margin="normal" />}
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
           <Typography sx={{ fontWeight: 'bold' }}>12.7. Quais os procedimentos adotados para o armazenamento dos produtos?</Typography>
        </AccordionSummary>
        <AccordionDetails>
           <CheckboxGroupMUI
            title=""
            options={['Identificação clara de produtos orgânicos e não orgânicos', 'Local específico para armazenamento de lotes de produtos orgânicos', 'Local é mantido limpo e higienizado', 'Equipamentos/embalagens/envase feitos de materiais que não interferem na composição dos produtos', 'Outros - citar:']}
            selectedString={safeData.procedimentos_armazenamento}
            onSelectionChange={(newValue) => handleCheckboxChange('procedimentos_armazenamento', newValue)}
            otherOption="Outros - citar:"
            otherValue={safeData.procedimentos_armazenamento_outros}
            onOtherChange={handleChange}
            otherName="procedimentos_armazenamento_outros"
            otherPlaceholder="Especifique outros procedimentos..."
          />
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.8. Descreva o controle de pragas em instalações</Typography>
        </AccordionSummary>
        <AccordionDetails>
           <TextField name="controle_pragas_instalacoes" value={safeData.controle_pragas_instalacoes?.controle_pragas_instalacoes || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>12.9. Descreva como é feito o transporte dos produtos orgânicos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField name="transporte_produtos_organicos" value={safeData.transporte_produtos_organicos?.transporte_produtos_organicos || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao12MUI;