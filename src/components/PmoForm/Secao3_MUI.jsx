// src/components/PmoForm/Secao3_MUI.jsx (Refatorado com Accordion Condicional)

import React from 'react';
// <<< TAREFA 2: Importar componentes do Accordion e outros necessários >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Card, CardHeader, CardContent,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import TabelaDinamicaMUI from './TabelaDinamica_MUI';

function Secao3MUI({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = value === 'true';
    onSectionChange({ ...safeData, [name]: newValue });
  };

  const handleArrayChange = (objKey, arrayKey, novoArray) => {
    onSectionChange({
      ...safeData,
      [objKey]: {
        ...safeData[objKey],
        [arrayKey]: novoArray
      }
    });
  };

  const columnsVegetal = [
    { header: 'Produto', key: 'produto' },
    { header: 'Talhões/Canteiros', key: 'talhoes_canteiros' },
    { header: 'Área Plantada', key: 'area_plantada', type: 'number' },
    { header: 'Produção Esperada/Ano', key: 'producao_esperada_ano', type: 'number' }
  ];
  const columnsAnimal = [
    { header: 'Espécie', key: 'especie' },
    { header: 'Nº de animais', key: 'n_de_animais', type: 'number' },
    { header: 'Área Externa', key: 'area_externa', type: 'number' },
    { header: 'Área Interna', key: 'area_interna_instalacoes', type: 'number' },
    { header: 'Exploração', key: 'exploracao' },
    { header: 'Estágio de Vida', key: 'estagio_de_vida' },
    { header: 'Média de Peso Vivo', key: 'media_de_peso_vivo', type: 'number' },
    { header: 'Produção Esperada/Ano', key: 'producao_esperada_ano' }
  ];
  const columnsProcessamento = [
    { header: 'Produto', key: 'produto' },
    { header: 'Frequência', key: 'frequencia_producao' },
    { header: 'Época', key: 'epoca_producao' },
    { header: 'Produção Esperada/Ano', key: 'producao_esperada_ano' }
  ];

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader
        title="Seção 3: Atividades Produtivas Não Orgânicas (Convencionais)"
        titleTypographyProps={{ variant: 'h4', component: 'h2', align: 'left', p: 2 }}
      />
      <CardContent>
        {/* <<< TAREFA 1: A pergunta Sim/Não permanece como ponto de entrada >>> */}
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>A propriedade possui atividades produtivas não orgânicas (convencionais)?</Typography>
          </FormLabel>
          <RadioGroup
            row
            name="produtos_nao_certificados"
            value={String(safeData.produtos_nao_certificados ?? '')}
            onChange={handleChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Sim" />
            <FormControlLabel value="false" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* As tabelas só são renderizadas se a resposta for "Sim" */}
        {safeData.produtos_nao_certificados && (
          // Usamos um Box para dar espaçamento entre os Accordions
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* <<< TAREFA 2: Cada tabela agora é um Accordion >>> */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>3.1. Produção Primária Vegetal Não Orgânica</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TabelaDinamicaMUI columns={columnsVegetal} data={safeData.producao_primaria_vegetal_nao_organica?.produtos_primaria_vegetal_nao_organica} onDataChange={(newData) => handleArrayChange('producao_primaria_vegetal_nao_organica', 'produtos_primaria_vegetal_nao_organica', newData)} itemName="Produto Não Orgânico" itemNoun="o" />
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>3.2. Produção Primária Animal Não Orgânica</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TabelaDinamicaMUI columns={columnsAnimal} data={safeData.producao_primaria_animal_nao_organica?.animais_primaria_animal_nao_organica} onDataChange={(newData) => handleArrayChange('producao_primaria_animal_nao_organica', 'animais_primaria_animal_nao_organica', newData)} itemName="Animal Não Orgânico" itemNoun="o" />
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>3.3. Processamento de Produtos de Origem Vegetal Não Orgânico</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TabelaDinamicaMUI columns={columnsProcessamento} data={safeData.processamento_produtos_origem_vegetal_nao_organico?.produtos_processamento_vegetal_nao_organico} onDataChange={(newData) => handleArrayChange('processamento_produtos_origem_vegetal_nao_organico', 'produtos_processamento_vegetal_nao_organico', newData)} itemName="Produto Processado (Vegetal)" itemNoun="" />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>3.4. Processamento de Produtos de Origem Animal Não Orgânico</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TabelaDinamicaMUI columns={columnsProcessamento} data={safeData.processamento_produtos_origem_animal_nao_organico?.produtos_processamento_animal_nao_organico} onDataChange={(newData) => handleArrayChange('processamento_produtos_origem_animal_nao_organico', 'produtos_processamento_animal_nao_organico', newData)} itemName="Produto Processado (Animal)" itemNoun="" />
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default Secao3MUI;