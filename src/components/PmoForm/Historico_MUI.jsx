import React from 'react';
import { TextField, Typography } from '@mui/material';

function HistoricoMUI({ data, onDataChange, errors }) {
  const handleChange = (e) => onDataChange({ ...data, [e.target.name]: e.target.value });
  const fieldName = 'historico_propriedade_producao_organica';
  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>1.6 Histórico da Propriedade e Produção Orgânica</Typography>
      <TextField name={fieldName} label="Descreva o histórico..." value={data?.[fieldName] || ''} onChange={handleChange} error={!!errors?.[fieldName]} helperText={errors?.[fieldName] || ' '} variant="outlined" fullWidth multiline rows={4} required />
    </>
  );
}
export default HistoricoMUI;