// src/components/PmoForm/Secao1_MUI.jsx (Refatorado com Accordion e Grid v2)

import React from 'react';
// <<< TAREFA 2: Importar componentes do Accordion >>>
import { 
  Accordion, AccordionDetails, AccordionSummary, Box, Card, 
  CardContent, CardHeader, Grid, Typography 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Componentes filhos (sem alteração aqui)
import DadosCadastraisMUI from './DadosCadastrais_MUI'; 
import RoteiroAcessoMUI from './RoteiroAcesso_MUI';
import MapaCroquiMUI from './MapaCroqui_MUI';
import CoordenadasMUI from './Coordenadas_MUI';
import AreaPropriedadeMUI from './AreaPropriedade_MUI'; 
import HistoricoMUI from './Historico_MUI';
import SituacaoMUI from './Situacao_MUI';
import SeparacaoAreasProducaoParalelaMUI from './SeparacaoAreasProducaoParalela_MUI';

function Secao1MUI({ data, onSectionChange, errors }) {
  const handleSubSectionChange = (subSectionName, subSectionData) => {
    onSectionChange({ ...data, [subSectionName]: subSectionData });
  };

  const safeData = data || {};
  const safeErrors = errors || {};

  return (
    // O Card principal agora serve como um contêiner para os Accordions
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader 
        title="Seção 1: Descrição da Propriedade"
        titleTypographyProps={{ variant: 'h4', component: 'h2', align: 'left', p: 2 }}
      />
      <CardContent>
        {/* <<< TAREFA 1: A sintaxe do Grid container não muda >>> */}
        <Grid container spacing={2}>
          
          {/* --- Subseção 1: Dados Cadastrais --- */}
          {/* <<< TAREFA 1: Grid size={{...}} e TAREFA 2: Wrapper Accordion >>> */}
          <Grid size={{ xs: 12 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1.1 Dados Cadastrais</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DadosCadastraisMUI 
                  data={safeData.dados_cadastrais} 
                  onDataChange={(newData) => handleSubSectionChange('dados_cadastrais', newData)} 
                  errors={safeErrors.dados_cadastrais}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          {/* <<< TAREFA 3: Dividers removidos >>> */}

          {/* --- Subseção 2: Roteiro e Mapa --- */}
          <Grid size={{ xs: 12 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1.2 Roteiro de Acesso e Croqui</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <RoteiroAcessoMUI data={safeData.roteiro_acesso_propriedade} onDataChange={(newData) => handleSubSectionChange('roteiro_acesso_propriedade', newData)} errors={safeErrors.roteiro_acesso_propriedade} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <MapaCroquiMUI data={safeData.mapa_propriedade_croqui} onDataChange={(newData) => handleSubSectionChange('mapa_propriedade_croqui', newData)} errors={safeErrors.mapa_propriedade_croqui} />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          {/* --- Subseção 3: Coordenadas e Área --- */}
          <Grid size={{ xs: 12 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1.3 Coordenadas e Área</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}><CoordenadasMUI data={safeData.coordenadas_geograficas} onDataChange={(newData) => handleSubSectionChange('coordenadas_geograficas', newData)} errors={safeErrors.coordenadas_geograficas} /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}><AreaPropriedadeMUI data={safeData.area_propriedade} onDataChange={(newData) => handleSubSectionChange('area_propriedade', newData)} errors={safeErrors.area_propriedade} /></Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* --- Demais Subseções --- */}
          <Grid size={{ xs: 12 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1.4 Histórico da Propriedade</Typography></AccordionSummary>
                <AccordionDetails><HistoricoMUI data={safeData.historico_propriedade_producao_organica} onDataChange={(newData) => handleSubSectionChange('historico_propriedade_producao_organica', newData)} errors={safeErrors.historico_propriedade_producao_organica} /></AccordionDetails>
            </Accordion>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1.5 Situação da Propriedade</Typography></AccordionSummary>
                <AccordionDetails><SituacaoMUI data={safeData.situacao_propriedade_relacao_producao_organica} onDataChange={(newData) => handleSubSectionChange('situacao_propriedade_relacao_producao_organica', newData)} errors={safeErrors.situacao_propriedade_producao_organica} /></AccordionDetails>
            </Accordion>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1.6 Separação de Áreas (Produção Paralela)</Typography></AccordionSummary>
                <AccordionDetails><SeparacaoAreasProducaoParalelaMUI data={safeData.separacao_areas_producao_paralela} onDataChange={(newData) => handleSubSectionChange('separacao_areas_producao_paralela', newData)} errors={safeErrors.separacao_areas_producao_paralela} /></AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Secao1MUI;