// src/components/PmoForm/Secao15_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxGroupMUI from './CheckboxGroup_MUI';

function Secao15MUI({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler que lida tanto com campos de texto aninhados quanto simples (para o "Outros")
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'registros_rastreabilidade') {
      onSectionChange({ ...safeData, [name]: { [name]: value } });
    } else {
      onSectionChange({ ...safeData, [name]: value });
    }
  };

  const handleCheckboxChange = (fieldName, newValue) => {
    onSectionChange({ ...safeData, [fieldName]: newValue });
  };

  return (
    // <<< TAREFA 1: A estrutura de Card foi substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 15: Rastreabilidade (Documentos/Registros)
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {/* <<< TAREFA 3: O título da pergunta foi movido para cá >>> */}
          <Typography sx={{ fontWeight: 'bold' }}>
            15.1. Que tipo de registros são adotados para comprovar a rastreabilidade?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Inclua produção, armazenamento, processamento, aquisições и vendas.
          </Typography>
          <TextField
            name="registros_rastreabilidade"
            value={safeData.registros_rastreabilidade?.registros_rastreabilidade || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>
            15.2. Com que frequência realiza os registros/anotações?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxGroupMUI
            options={['Diário', 'Semanal', 'Quinzenal', 'Mensal', 'Outro(s) - Qual(is)?']}
            selectedString={safeData.frequencia_registros_anotacoes}
            onSelectionChange={(newValue) => handleCheckboxChange('frequencia_registros_anotacoes', newValue)}
            otherOption="Outro(s) - Qual(is)?"
            otherValue={safeData.frequencia_registros_anotacoes_outros}
            onOtherChange={handleChange}
            otherName="frequencia_registros_anotacoes_outros"
            otherPlaceholder="Especifique a outra frequência..."
          />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao15MUI;