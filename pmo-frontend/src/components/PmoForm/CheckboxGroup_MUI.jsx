// src/components/PmoForm/CheckboxGroup_MUI.jsx

import React from 'react';
import { 
  FormControl, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Grid, 
  TextField, 
  Typography 
} from '@mui/material';

function CheckboxGroupMUI({ 
  title, 
  options, 
  selectedString, 
  onSelectionChange, 
  otherOption, 
  otherValue, 
  onOtherChange,
  otherName,
  otherPlaceholder = "Por favor, especifique..."
}) {
  
  // A lógica interna para manipular a string de seleção permanece a mesma
  const guaranteedString = String(selectedString ?? '');
  const selectedOptions = guaranteedString.split('; ').filter(Boolean);
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newSelected = [...selectedOptions];

    if (checked && !newSelected.includes(value)) {
      newSelected.push(value);
    } else {
      newSelected = newSelected.filter(option => option !== value);
    }
    
    onSelectionChange(newSelected.join('; '));
  };

  const isOtherSelected = otherOption && selectedOptions.includes(otherOption);

  return (
    // FormControl serve como o container principal para o grupo de inputs
    <FormControl component="fieldset" fullWidth margin="normal">
      {/* FormLabel é o substituto acessível para o <h5> */}
      <FormLabel component="legend">
        <Typography variant="h6">{title}</Typography>
      </FormLabel>
      
      {/* FormGroup organiza os checkboxes */}
      <FormGroup>
        {/* Usamos o Grid do MUI para criar o layout de duas colunas */}
        <Grid container>
          {options.map((option) => (
            <Grid size={{ xs: 12, sm: 6 }} key={option}>
              {/* FormControlLabel é a maneira correta de agrupar um checkbox e seu label */}
              <FormControlLabel
                control={
                  <Checkbox 
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={handleCheckboxChange}
                  />
                }
                label={option}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      {/* Renderização condicional do campo de texto "Outros" */}
      {isOtherSelected && (
        <TextField
          name={otherName}
          label={otherPlaceholder}
          value={otherValue || ''} 
          onChange={onOtherChange} 
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          margin="normal"
        />
      )}
    </FormControl>
  );
}

export default CheckboxGroupMUI;