// src/components/PmoForm/Secao14_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, FormControl,
  FormGroup, FormControlLabel, Checkbox, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Subcomponente para cada linha de checkbox (sem alterações)
const CanalCheckboxMUI = ({ label, name, checked, onChange, conditionalValue, onTextChange, placeholder }) => {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            value={label}
            checked={checked}
            onChange={(e) => onChange(e.target.value, e.target.checked)}
          />
        }
        label={label}
      />
      {checked && placeholder && (
        <TextField
          name={name}
          placeholder={placeholder}
          value={conditionalValue || ''}
          onChange={onTextChange}
          variant="standard"
          size="small"
          fullWidth
          sx={{ mb: 1, pl: 4 }}
        />
      )}
    </Box>
  );
};

function Secao14MUI({ data, onSectionChange }) {
  const safeData = data || {};
  const canaisSelecionados = String(safeData.canais_comercializacao || '').split('; ').filter(Boolean);

  const handleCheckboxChange = (value, isChecked) => {
    let novasOpcoes = [...canaisSelecionados];
    if (isChecked && !novasOpcoes.includes(value)) {
      novasOpcoes.push(value);
    } else {
      novasOpcoes = novasOpcoes.filter(opt => opt !== value);
    }
    onSectionChange({ ...safeData, canais_comercializacao: novasOpcoes.join('; ') });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ ...safeData, [name]: value });
  };

  const canais = [
    { label: 'Na unidade de produção.' },
    { label: 'Programa de Aquisição de Alimentos (PAA).' },
    { label: 'Programa Nacional de Alimentação Escolar (PNAE).' },
    { label: 'Em estabelecimentos atacadistas e varejistas – Quais:', name: 'canais_atacadistas_quais', placeholder: 'Especifique os estabelecimentos...' },
    { label: 'Em feiras – Quais:', name: 'canais_feiras_quais', placeholder: 'Especifique as feiras...' },
    { label: 'Em cooperativas e associações – Quais:', name: 'canais_cooperativas_quais', placeholder: 'Especifique as cooperativas/associações...' },
    { label: 'Em outros canais – Quais:', name: 'canais_outros_quais', placeholder: 'Especifique outros canais...' }
  ];

  return (
    // <<< TAREFA 1: A estrutura de Card foi substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* <<< TAREFA 2: Título principal alinhado à esquerda >>> */}
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 14: Comercialização
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {/* <<< TAREFA 3: Pergunta principal movida para o Summary >>> */}
          <Typography sx={{ fontWeight: 'bold' }}>14.1. Em quais canais os produtos são comercializados?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* <<< TAREFA 4: Conteúdo do formulário movido para os Details >>> */}
          <FormControl component="fieldset" fullWidth>
            <FormGroup sx={{ mt: 1 }}>
              {canais.map(canal => (
                <CanalCheckboxMUI
                  key={canal.label}
                  label={canal.label}
                  name={canal.name}
                  checked={canaisSelecionados.includes(canal.label)}
                  onChange={handleCheckboxChange}
                  conditionalValue={canal.name ? safeData[canal.name] : ''}
                  onTextChange={handleTextChange}
                  placeholder={canal.placeholder}
                />
              ))}
            </FormGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Secao14MUI;