// src/components/PmoForm/MapaCroqui_MUI.jsx

import React from 'react';
import { TextField, Typography } from '@mui/material';

function MapaCroquiMUI({ data, onDataChange, errors }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  const fieldName = 'mapa_croqui_propriedade';
  const hasError = !!errors?.[fieldName];
  const errorMessage = errors?.[fieldName] || ' ';

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>
        1.3 Mapa da Propriedade/Croqui
      </Typography>
      <TextField
        name={fieldName}
        label="Descrição do Mapa ou Croqui"
        value={data?.[fieldName] || ''}
        onChange={handleChange}
        error={hasError}
        helperText={errorMessage}
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        required
      />
    </>
  );
}

export default MapaCroquiMUI;