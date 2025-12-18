// src/components/PmoForm/DadosCadastrais_MUI.jsx (Versão Final com Grid Layout)

import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

function DadosCadastraisMUI({ data, onDataChange, errors }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  const safeData = data || {};
  const safeErrors = errors || {};

  const fields = [
    { name: 'nome_produtor', label: 'Nome do Produtor', required: true },
    { name: 'cpf', label: 'CPF', required: true },
    { name: 'endereco_propriedade_base_fisica_produtiva', label: 'Endereço da Propriedade', required: true },
    { name: 'telefone', label: 'Telefone', type: 'tel', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'responsavel_preenchimento', label: 'Responsável pelo Preenchimento', required: true },
    { name: 'data_preenchimento', label: 'Data de Preenchimento', type: 'date', required: true },
  ];

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>
        1.1 Dados Cadastrais
      </Typography>
      
      {/* ============================================================== */}
      {/* ||  A CORREÇÃO ESTÁ AQUI: ADICIONANDO O GRID CONTAINER        || */}
      {/* ============================================================== */}
      <Grid container spacing={2}> {/* O container que define o layout de linha */}
        {fields.map((field) => (
          // Cada TextField agora está dentro de um Grid item, que age como uma coluna.
          // sm={6} faz com que ocupe 50% da largura em telas de tablet ou maiores.
          <Grid size={{ xs: 12, sm: 6 }} key={field.name}> 
            <TextField
              name={field.name}
              label={field.label}
              value={safeData[field.name] || ''}
              onChange={handleChange}
              error={!!safeErrors[field.name]}
              helperText={safeErrors[field.name] || ' '}
              type={field.type || 'text'}
              required={field.required}
              variant="outlined"
              fullWidth
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            />
          </Grid>
        ))}
      </Grid>
      {/* ============================================================== */}
      {/* ||                     FIM DA CORREÇÃO                      || */}
      {/* ============================================================== */}
    </>
  );
}

export default DadosCadastraisMUI;