// src/components/PmoForm/Secao16_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Secao16MUI({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler para os campos de texto aninhados
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
      ...safeData,
      [name]: { [name]: value }
    });
  };

  return (
    // <<< TAREFA 1: A estrutura de Card foi substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 16: SAC (Serviço de Atendimento ao Consumidor)
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {/* <<< TAREFA 3: O título da pergunta foi movido para cá >>> */}
          <Typography sx={{ fontWeight: 'bold' }}>
            16.1. Quais são as formas dos consumidores fazerem reclamações ou críticas aos produtos?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="formas_reclamacoes_criticas"
            value={safeData.formas_reclamacoes_criticas?.formas_reclamacoes_criticas || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva as formas de contato aqui..."
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>
            16.2. Como são tratadas possíveis reclamações ou críticas recebidas dos consumidores?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="tratamento_reclamacoes_criticas"
            value={safeData.tratamento_reclamacoes_criticas?.tratamento_reclamacoes_criticas || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva o procedimento de tratamento aqui..."
          />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao16MUI;