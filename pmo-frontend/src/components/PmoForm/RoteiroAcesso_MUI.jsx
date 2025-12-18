// src/components/PmoForm/RoteiroAcesso_MUI.jsx

import React from 'react';
import { TextField, Typography } from '@mui/material';

function RoteiroAcessoMUI({ data, onDataChange, errors }) {
  const handleChange = (e) => {
    // A lógica interna para atualizar o estado não muda.
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  const fieldName = 'roteiro_acesso';
  const hasError = !!errors?.[fieldName];
  const errorMessage = errors?.[fieldName] || ' ';

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>
        1.2 Roteiro de Acesso
      </Typography>
      <TextField
        name={fieldName}
        label="Descrição do Roteiro de Acesso"
        value={data?.[fieldName] || ''}
        onChange={handleChange}
        error={hasError}
        helperText={errorMessage}
        variant="outlined"
        fullWidth
        multiline // Transforma em uma área de texto
        rows={3}
        required
      />
    </>
  );
}

export default RoteiroAcessoMUI;