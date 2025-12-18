// src/components/PmoForm/TabelaDinamica_MUI.jsx
// VERSÃO BLINDADA: Com IDs estáveis + Proteção contra Enter

import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Button, 
  Typography, IconButton, Box, FormControl, Select, MenuItem, Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// Função para gerar ID único
const generateUniqueId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function TabelaDinamicaMUI({ title, columns, data, onDataChange, itemName = 'Item', itemNoun = 'o' }) {
  // Estado interno para garantir a estabilidade dos IDs
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Sincroniza dados externos e garante que todos tenham _id
    const dataWithIds = (Array.isArray(data) ? data : []).map(item => ({
      ...item,
      _id: item._id || generateUniqueId(),
    }));
    setTableData(dataWithIds);
  }, [data]);

  const handleItemChange = (id, fieldKey, value) => {
    const newData = tableData.map(item => {
      if (item._id !== id) return item;
      return { ...item, [fieldKey]: value };
    });
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
    
    novoItem._id = generateUniqueId(); // ID fundamental para não perder foco
    onDataChange([...tableData, novoItem]);
  };

  const removerItem = (id) => {
    const newData = tableData.filter(item => item._id !== id);
    onDataChange(newData);
  };

  // <<< PROTEÇÃO CONTRA O ENTER >>>
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
              <TableCell align="center" sx={{ fontWeight: 'bold', width: '100px' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((item) => (
              // USANDO O ID ÚNICO COMO CHAVE (Isso impede o pulo de foco!)
              <TableRow key={item._id}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.unitSelector ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type={col.type || 'text'}
                          value={item[col.key] || ''}
                          onChange={(e) => handleItemChange(item._id, col.key, e.target.value)}
                          onKeyDown={handleKeyDown} // Proteção adicionada
                          variant="standard"
                          fullWidth
                          placeholder={col.header}
                        />
                        <FormControl variant="standard" sx={{ minWidth: 65 }}>
                          <Select
                            value={item[col.unitSelector.key] || col.unitSelector.options[0]}
                            onChange={(e) => handleItemChange(item._id, col.unitSelector.key, e.target.value)}
                          >
                            {col.unitSelector.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    ) : (
                      <TextField
                        type={col.type || 'text'}
                        value={item[col.key] || ''}
                        onChange={(e) => handleItemChange(item._id, col.key, e.target.value)}
                        onKeyDown={handleKeyDown} // Proteção adicionada
                        variant="standard"
                        fullWidth
                        placeholder={col.header}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title={`Remover ${itemName}`}>
                    <IconButton type="button" onClick={() => removerItem(item._id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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