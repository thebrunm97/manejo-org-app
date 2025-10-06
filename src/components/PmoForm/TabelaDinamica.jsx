// src/components/PmoForm/TabelaDinamica_MUI.jsx (VERSÃO FINAL E CORRIGIDA)

import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Button, 
  Typography, IconButton, Box, FormControl, Select, MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

function TabelaDinamicaMUI({ title, columns, data, onDataChange, itemName = 'Item', itemNoun = 'o' }) {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, fieldKey, value) => {
    const newData = [...safeData];
    newData[index][fieldKey] = value;
    onDataChange(newData);
  };

  const adicionarItem = () => {
    const novoItem = columns.reduce((acc, col) => {
      acc[col.key] = '';
      if (col.unitSelector) {
        acc[col.unitSelector.key] = col.unitSelector.options[0] || '';
      }
      return acc;
    }, {});
    onDataChange([...safeData, novoItem]);
  };

  const removerItem = (index) => {
    const newData = safeData.filter((_, i) => i !== index);
    onDataChange(newData);
  };

  // <<< CORREÇÃO 1: FUNÇÃO PARA IMPEDIR A TECLA "ENTER" DE SUBMETER O FORMULÁRIO >>>
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>)}
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((item, index) => (
              <TableRow key={index}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.unitSelector ? (
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                        <TextField
                          type={col.type || 'text'}
                          value={item[col.key] || ''}
                          onChange={(e) => handleItemChange(index, col.key, e.target.value)}
                          onKeyDown={handleKeyDown} // <<< CORREÇÃO 2: ADICIONADO AQUI
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                        <FormControl variant="standard" sx={{ minWidth: 65 }}>
                          <Select
                            value={item[col.unitSelector.key] || col.unitSelector.options[0]}
                            onChange={(e) => handleItemChange(index, col.unitSelector.key, e.target.value)}
                          >
                            {col.unitSelector.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    ) : (
                      <TextField
                        type={col.type || 'text'}
                        value={item[col.key] || ''}
                        onChange={(e) => handleItemChange(index, col.key, e.target.value)}
                        onKeyDown={handleKeyDown} // <<< CORREÇÃO 2: E ADICIONADO AQUI
                        variant="standard"
                        fullWidth
                        InputProps={{ disableUnderline: true }}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <IconButton type="button" onClick={() => removerItem(index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        type="button"
        startIcon={<AddCircleOutlineIcon />}
        onClick={adicionarItem}
        sx={{ mt: 2 }}
      >
        Adicionar nov{itemNoun} {itemName}
      </Button>
    </Box>
  );
}

export default TabelaDinamicaMUI;