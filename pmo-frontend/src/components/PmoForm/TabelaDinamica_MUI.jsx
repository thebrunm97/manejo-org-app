// src/components/PmoForm/TabelaDinamica_MUI.jsx (VERSÃO FINAL COM IDs ÚNICOS E ESTÁVEIS)

import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Button, 
  Typography, IconButton, Box, FormControl, Select, MenuItem, Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// Função para gerar um ID simples e único
const generateUniqueId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function TabelaDinamicaMUI({ title, columns, data, onDataChange, itemName = 'Item', itemNoun = 'o' }) {
  // ==================================================================
  // ||      ESTADO INTERNO APENAS PARA GERENCIAR OS IDs ÚNICOS      ||
  // ==================================================================
  // Usamos um estado local para garantir que cada linha tenha um ID estável.
  // Isso é essencial para o React preservar o estado dos inputs durante re-renderizações.
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Este efeito sincroniza os dados externos com o estado interno, garantindo que cada linha tenha um _id.
    const dataWithIds = (Array.isArray(data) ? data : []).map(item => ({
      ...item,
      _id: item._id || generateUniqueId(), // Adiciona um ID se não existir
    }));
    setTableData(dataWithIds);
  }, [data]); // Depende dos dados que vêm do componente pai

  const handleItemChange = (id, fieldKey, value) => {
    const newData = tableData.map(item => {
      if (item._id !== id) return item;
      return { ...item, [fieldKey]: value };
    });
    // Informa o pai sobre a mudança, enviando os dados SEM o _id temporário se preferir,
    // mas é mais robusto manter o _id para a próxima renderização.
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
    
    novoItem._id = generateUniqueId(); // Adiciona o ID único na criação
    
    onDataChange([...tableData, novoItem]);
  };

  const removerItem = (id) => {
    const newData = tableData.filter(item => item._id !== id);
    onDataChange(newData);
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
            {/* ================================================================== */}
            {/* ||             A MUDANÇA MAIS IMPORTANTE ESTÁ AQUI              || */}
            {/* ================================================================== */}
            {tableData.map((item) => (
              // Usando o ID único e estável como a chave da linha
              <TableRow key={item._id}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.unitSelector ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type={col.type || 'text'}
                          value={item[col.key] || ''}
                          onChange={(e) => handleItemChange(item._id, col.key, e.target.value)}
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