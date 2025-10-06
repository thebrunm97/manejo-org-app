// src/components/PmoForm/Secao2_MUI.jsx (Com seletor de unidade para Área Plantada)

import React, { useCallback } from 'react';
import { 
  Accordion, AccordionDetails, AccordionSummary, Box, Typography 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabelaDinamicaMUI from './TabelaDinamica_MUI';

function Secao2MUI({ data, onSectionChange }) {
  const safeData = data || {};

  const handleVegetalChange = useCallback((newData) => {
    onSectionChange({ ...safeData, producao_primaria_vegetal: { ...safeData.producao_primaria_vegetal, produtos_primaria_vegetal: newData } });
  }, [onSectionChange, safeData]);

  const handleAnimalChange = useCallback((newData) => {
    onSectionChange({ ...safeData, producao_primaria_animal: { ...safeData.producao_primaria_animal, animais_primaria_animal: newData } });
  }, [onSectionChange, safeData]);

  const handleProcessamentoVegetalChange = useCallback((newData) => {
    onSectionChange({ ...safeData, processamento_produtos_origem_vegetal: { ...safeData.processamento_produtos_origem_vegetal, produtos_processamento_vegetal: newData } });
  }, [onSectionChange, safeData]);

  const handleProcessamentoAnimalChange = useCallback((newData) => {
    onSectionChange({ ...safeData, processamento_produtos_origem_animal: { ...safeData.processamento_produtos_origem_animal, produtos_processamento_animal: newData } });
  }, [onSectionChange, safeData]);


  const columnsVegetal = [
    { header: 'Produto', key: 'produto' },
    { header: 'Talhões/Canteiros', key: 'talhoes_canteiros' },
    { // <<< ALTERAÇÃO APLICADA AQUI >>>
      header: 'Área Plantada', 
      key: 'area_plantada', 
      type: 'number',
      unitSelector: { 
        key: 'area_plantada_unidade', 
        options: ['ha', 'm²']
      }
    },
    { 
      header: 'Produção Esperada/Ano', 
      key: 'producao_esperada_ano', 
      type: 'number',
      unitSelector: { key: 'producao_unidade', options: ['kg', 'ton', 'cx'] }
    }
  ];
  
  const columnsAnimal = [
    { header: 'Espécie', key: 'especie' },
    { header: 'Nº de animais', key: 'n_de_animais', type: 'number' },
    { header: 'Área Externa', key: 'area_externa', type: 'number' },
    { header: 'Área Interna', key: 'area_interna_instalacoes', type: 'number' },
    { header: 'Exploração', key: 'exploracao' },
    { header: 'Estágio de Vida', key: 'estagio_de_vida' },
    { header: 'Média de Peso Vivo', key: 'media_de_peso_vivo', type: 'number' },
    { 
      header: 'Produção Esperada/Ano', 
      key: 'producao_esperada_ano', 
      type: 'text',
      unitSelector: { key: 'producao_unidade', options: ['kg', 'ton', 'L', 'dúzia'] }
    }
  ];
  
  const columnsProcessamento = [
    { header: 'Produto', key: 'produto' },
    { header: 'Frequência', key: 'frequencia_producao' },
    { header: 'Época', key: 'epoca_producao' },
    { 
      header: 'Produção Esperada/Ano', 
      key: 'producao_esperada_ano',
      type: 'number',
      unitSelector: { key: 'producao_unidade', options: ['kg', 'ton', 'L', 'potes'] }
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 2: Atividades Produtivas Orgânicas
      </Typography>
      <Typography variant="body1" sx={{ mt: -2, mb: 1 }}>
        Detalhe as atividades produtivas orgânicas da propriedade.
      </Typography>
          
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>2.1. Produção Primária Vegetal (PPV)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaDinamicaMUI
            columns={columnsVegetal}
            data={safeData.producao_primaria_vegetal?.produtos_primaria_vegetal}
            onDataChange={handleVegetalChange}
            itemName="Produto"
            itemNoun="o"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>2.2. Produção Primária Animal (PPA)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaDinamicaMUI
            columns={columnsAnimal}
            data={safeData.producao_primaria_animal?.animais_primaria_animal}
            onDataChange={handleAnimalChange}
            itemName="Animal"
            itemNoun="o"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>2.3. Processamento de Produtos de Origem Vegetal (PPOV)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaDinamicaMUI
            columns={columnsProcessamento}
            data={safeData.processamento_produtos_origem_vegetal?.produtos_processamento_vegetal}
            onDataChange={handleProcessamentoVegetalChange}
            itemName="Produto Processado (Vegetal)"
            itemNoun=""
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>2.4. Processamento de Produtos de Origem Animal (PPOA)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaDinamicaMUI
            columns={columnsProcessamento}
            data={safeData.processamento_produtos_origem_animal?.produtos_processamento_animal}
            onDataChange={handleProcessamentoAnimalChange}
            itemName="Produto Processado (Animal)"
            itemNoun=""
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Secao2MUI;