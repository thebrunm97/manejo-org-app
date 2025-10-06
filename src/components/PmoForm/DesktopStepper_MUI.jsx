// src/components/PmoForm/DesktopStepper_MUI.jsx

import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import StepIconMUI from './StepIcon_MUI.jsx'; // Nosso ícone customizado

function DesktopStepperMUI({ sections, currentStep, goToStep, sectionStatus }) {

  // O Tabs espera um evento, mas nosso goToStep passa apenas o número.
  // Criamos um handler para fazer a ponte.
  const handleChange = (event, newValue) => {
    goToStep(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 1, borderRadius: 2, boxShadow: 1 }}>
      <Tabs
        value={currentStep} // O valor atual controla qual aba/passo está ativo
        onChange={handleChange}
        variant="scrollable" // A mágica acontece aqui! Habilita a rolagem e as setas.
        scrollButtons="auto" // Mostra as setas apenas quando necessário
        allowScrollButtonsMobile
        aria-label="Navegação das seções do formulário"
        // Estilos para os indicadores e a linha
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none', // Escondemos o indicador azul padrão do Tabs
          },
          '& .MuiTabs-scrollButtons': {
            color: 'primary.main', // Cor das setas
          },
        }}
      >
        {sections.map((section) => (
          <Tab
            key={section.id}
            value={section.id}
            // O ícone customizado mostra o estado (ativo, completo, etc.)
            icon={<StepIconMUI completed={sectionStatus[section.key] === 'completo'} active={currentStep === section.id} icon={section.id} />}
            label={section.label}
            sx={{ 
              minWidth: '120px', 
              textTransform: 'none', // Remove o uppercase padrão
              fontWeight: 500,
              flexShrink: 0, // Impede que as abas encolham
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default DesktopStepperMUI;