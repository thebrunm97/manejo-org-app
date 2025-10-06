// src/components/PmoForm/AreaPropriedade_MUI.jsx (Sintaxe 100% corrigida para Grid v2)

import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const AreaTextField = ({ name, label, data, errors, handleChange }) => {
  const hasError = !!errors?.[name];
  const errorMessage = errors?.[name] || ' ';

  return (
    // <<< CORREÇÃO APLICADA AQUI >>>
    // As props xs, sm, e md foram movidas para dentro do objeto "size"
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <TextField
        name={name}
        label={label}
        value={data?.[name] || ''}
        onChange={handleChange}
        error={hasError}
        helperText={errorMessage}
        type="number"
        variant="outlined"
        fullWidth
        InputProps={{ step: "0.01" }}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
  );
};

// O resto do arquivo permanece igual
function AreaPropriedadeMUI({ data, onDataChange, errors }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  const fields = [
    { name: 'area_producao_organica_hectares', label: 'Área de Produção Orgânica (ha)' },
    { name: 'area_producao_nao_organica_hectares', label: 'Área Não Orgânica (ha)' },
    { name: 'area_producao_em_conversao_hectares', label: 'Área em Conversão (ha)' },
    { name: 'areas_protegidas_hectares', label: 'Áreas Protegidas (ha)' },
    { name: 'area_ocupada_instalacoes_benfeitorias_hectares', label: 'Área de Instalações (ha)' },
    { name: 'area_total_propriedade_hectares', label: 'Área Total (ha)' },
  ];

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: { xs: 2, md: 0 } }}>
        1.5 Área da Propriedade
      </Typography>
      
      <Grid container spacing={3}>
        {fields.map(field => (
          <AreaTextField
            key={field.name}
            name={field.name}
            label={field.label}
            data={data}
            errors={errors}
            handleChange={handleChange}
          />
        ))}
      </Grid>
    </>
  );
}

export default AreaPropriedadeMUI;