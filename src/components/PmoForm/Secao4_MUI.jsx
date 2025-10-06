// src/components/PmoForm/Secao4_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 2: Importar componentes do Accordion e outros necessários >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Card, CardHeader, 
  CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import TabelaDinamicaMUI from './TabelaDinamica_MUI';

// O subcomponente customizado continua aqui, mas vamos remover seu título interno depois
const TabelaAnimaisSubsistencia = ({ itens, onItensChange }) => {
  const colunas = [
    { header: 'Tipo', key: 'tipo', type: 'select', options: ['Subsistência', 'Companhia', 'Ornamental', 'Outro'] },
    { header: 'Espécie', key: 'especie' },
    { header: 'Quantidade', key: 'quantidade', type: 'number' },
    { header: 'Insumos', key: 'insumos' },
    { header: 'Tratamento dos Dejetos', key: 'tratamento_dejetos' },
    { header: 'Circulação na Área Orgânica', key: 'circulacao_area_organica' },
  ];

  return (
    <TabelaDinamicaMUI
      // <<< TAREFA 3: O título foi movido para o AccordionSummary, então podemos remover esta prop no futuro >>>
      // title="4.1.2 Animais de Subsistência, Companhia, Ornamentais e Outros"
      columns={colunas}
      data={itens}
      onDataChange={onItensChange}
      itemName="Animal de Subsistência/Outro"
      itemNoun="o"
    />
  );
};


function Secao4MUI({ data, onSectionChange }) {
  const safeData = data || {};
  const temAnimais = safeData.ha_animais_servico_subsistencia_companhia?.ha_animais_servico_subsistencia_companhia === true;

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
        ...safeData,
        ha_animais_servico_subsistencia_companhia: { ha_animais_servico_subsistencia_companhia: true }
      });
    }
  };

  const handleArrayChange = (objKey, arrayKey, novoArray) => {
    onSectionChange({ ...safeData, [objKey]: { ...(safeData[objKey] || {}), [arrayKey]: novoArray } });
  };

  const colunasAnimaisServico = [
    { header: 'Espécie', key: 'especie' },
    { header: 'Quantidade', key: 'quantidade', type: 'number' },
    { header: 'Manejo', key: 'manejo' },
    { header: 'Insumos', key: 'insumos' },
    { header: 'Tratamento dos Dejetos', key: 'tratamento_dejetos' },
  ];

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader
        title="Seção 4: Animais de Serviço, Subsistência, Companhia e Outros"
        titleTypographyProps={{ variant: 'h4', component: 'h2', align: 'left', p: 2 }}
      />
      <CardContent>
        {/* <<< TAREFA 1: A pergunta Sim/Não permanece intacta >>> */}
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>4.1. Há animais de serviço, subsistência, companhia ou ornamentais na propriedade?</Typography>
          </FormLabel>
          <RadioGroup row name="ha_animais" value={String(temAnimais)} onChange={handleSimNaoChange}>
            <FormControlLabel value="true" control={<Radio />} label="Sim" />
            <FormControlLabel value="false" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* <<< TAREFA 2: O conteúdo condicional agora é uma lista de Accordions >>> */}
        {temAnimais && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>4.1.1 Animais de Serviço</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TabelaDinamicaMUI
                  columns={colunasAnimaisServico}
                  data={safeData.animais_servico?.lista_animais_servico || []}
                  onDataChange={(novoArray) => handleArrayChange('animais_servico', 'lista_animais_servico', novoArray)}
                  itemName="Animal de Serviço"
                  itemNoun="o"
                />
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>4.1.2 Animais de Subsistência, Companhia e Outros</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TabelaAnimaisSubsistencia
                  itens={safeData.animais_subsistencia_companhia_ornamentais?.lista_animais_subsistencia || []}
                  onItensChange={(novoArray) => handleArrayChange('animais_subsistencia_companhia_ornamentais', 'lista_animais_subsistencia', novoArray)}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default Secao4MUI;