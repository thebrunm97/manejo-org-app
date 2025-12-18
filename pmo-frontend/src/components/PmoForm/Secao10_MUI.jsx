// src/components/PmoForm/Secao10_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabelaDinamicaMUI from './TabelaDinamica_MUI';
import CheckboxGroupMUI from './CheckboxGroup_MUI';

function Secao10MUI({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ ...safeData, [name]: value });
  };

  const handleCheckboxChange = (fieldName, newValue) => {
    onSectionChange({ ...safeData, [fieldName]: newValue });
  };

  const columnsControlePragas = [
    { header: 'Produto ou Manejo', key: 'produto_ou_manejo' },
    { header: 'Onde (em que cultura)', key: 'onde' },
    { header: 'Qual praga/doença?', key: 'qual_praga_doenca' },
    { header: 'Quando?', key: 'quando' },
    { header: 'Procedência', key: 'procedencia' },
    { header: 'Composição', key: 'composicao' },
    { header: 'Marca', key: 'marca' },
    { header: 'Dosagem', key: 'dosagem' },
  ];

  return (
    // <<< TAREFA 1: A estrutura de Card foi substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
        Seção 10: Fitossanidade
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>10.1. Como controla pragas e doenças?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaDinamicaMUI
            columns={columnsControlePragas}
            data={safeData.controle_pragas_doencas}
            onDataChange={(newData) => onSectionChange({ ...safeData, controle_pragas_doencas: newData })}
            itemName="Controle"
            itemNoun="o"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>10.2. Como você faz o manejo e controle das plantas daninhas/espontâneas na área de produção?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxGroupMUI
            options={['Roçada', 'Capina manual', 'Pastoreio/Trator animal', 'Adubo verde', 'Outros - citar:']}
            selectedString={safeData.manejo_plantas_daninhas}
            onSelectionChange={(newValue) => handleCheckboxChange('manejo_plantas_daninhas', newValue)}
            otherOption="Outros - citar:"
            otherValue={safeData.manejo_plantas_daninhas_outros}
            onOtherChange={handleChange}
            otherName="manejo_plantas_daninhas_outros"
            otherPlaceholder="Especifique outros manejos..."
          />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao10MUI;