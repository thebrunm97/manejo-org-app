import React from 'react';
import { TextField, MenuItem, Typography } from '@mui/material';

function SituacaoMUI({ data, onDataChange, errors }) {
  const handleChange = (e) => onDataChange({ ...data, [e.target.name]: e.target.value });
  const fieldName = 'situacao_propriedade_producao_organica';
  const opcoes = ["Toda a propriedade já é orgânica", "Toda a propriedade está em conversão", "Há produção não orgânica e em conversão (conversão parcial)", "Há produção orgânica e em conversão", "Há produção orgânica e não orgânica (produção paralela)", "Há produção orgânica, não orgânica e em conversão"];
  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>1.7 Situação da Propriedade</Typography>
      <TextField name={fieldName} label="Situação da Propriedade" value={data?.[fieldName] || ''} onChange={handleChange} error={!!errors?.[fieldName]} helperText={errors?.[fieldName] || ' '} select fullWidth variant="outlined" required>
        <MenuItem value="" disabled>Selecione uma opção</MenuItem>
        {opcoes.map(opcao => <MenuItem key={opcao} value={opcao}>{opcao}</MenuItem>)}
      </TextField>
    </>
  );
}
export default SituacaoMUI;