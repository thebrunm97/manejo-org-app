// src/components/PmoForm/Secao18_MUI.jsx (Com correção para visualização de PDF)

import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import {
  Box, Button, TextField, Typography, List, ListItem, ListItemText,
  IconButton, CircularProgress, Alert, Link, Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

function Secao18MUI({ data, onSectionChange }) {
  const safeData = data || {};
  const anexos = Array.isArray(safeData.lista_anexos) ? safeData.lista_anexos : [];

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const { user } = useAuth();
  
  const fileInputRef = useRef(null);

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setDocName(file.name.split('.').slice(0, -1).join('.'));
      setError('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleAnexar = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo primeiro.');
      return;
    }
    if (!docName.trim()) {
      setError('O nome do documento é obrigatório.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      if (!user) throw new Error('Você precisa estar logado para fazer o upload.');

      const fileExt = selectedFile.name.split('.').pop();
      const fileNameOnStorage = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileNameOnStorage}`;

      // <<< CORREÇÃO APLICADA AQUI >>>
      const { error: uploadError } = await supabase.storage
        .from('anexos-pmos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type,
          contentDisposition: 'inline', // Instrui o navegador a abrir o arquivo
        });
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('anexos-pmos')
        .getPublicUrl(filePath);

      const novoAnexo = {
        nome_documento: docName,
        descricao: docDescription,
        url_arquivo: urlData.publicUrl,
        path_arquivo: filePath,
      };

      onSectionChange({ ...safeData, lista_anexos: [...anexos, novoAnexo] });

      setSelectedFile(null);
      setDocName('');
      setDocDescription('');

    } catch (error) {
      setError(error.message);
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelar = () => {
    setSelectedFile(null);
    setDocName('');
    setDocDescription('');
    setError('');
  };

  const removerAnexoDaLista = async (index, path_arquivo) => {
    try {
      const { error: deleteError } = await supabase.storage.from('anexos-pmos').remove([path_arquivo]);
      if (deleteError) throw deleteError;
      
      const novosAnexos = anexos.filter((_, i) => i !== index);
      onSectionChange({ ...safeData, lista_anexos: novosAnexos });
    } catch (err) {
      setError('Falha ao remover o anexo: ' + err.message);
      console.error('Erro ao remover anexo:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 18: Anexos
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" gutterBottom>Adicionar Novo Documento</Typography>

        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: uploading ? 'grey.300' : 'action.hover',
            mb: 2
          }}
          onClick={!uploading ? handleUploadClick : undefined}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Arraste e solte ou clique para selecionar
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Arquivos recomendados: PDF, Imagens (JPG, PNG)
          </Typography>
          <input type="file" hidden ref={fileInputRef} onChange={handleFileSelection} disabled={uploading} />
        </Box>
        
        {uploading && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}><CircularProgress size={20} /><Typography>Enviando...</Typography></Box>}
        {selectedFile && !uploading && <Typography sx={{ mb: 2, textAlign: 'center' }}>Arquivo selecionado: <strong>{selectedFile.name}</strong></Typography>}

        <TextField
          required
          label="Nome do Documento"
          placeholder="Ex: Certificado de Conformidade"
          fullWidth
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          sx={{ mb: 2 }}
          disabled={uploading}
        />
        <TextField
          label="Descrição (opcional)"
          placeholder="Adicione uma breve descrição sobre o documento..."
          fullWidth
          multiline
          rows={4}
          value={docDescription}
          onChange={(e) => setDocDescription(e.target.value)}
          disabled={uploading}
        />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancelar} disabled={uploading}>Cancelar</Button>
          <Button variant="contained" onClick={handleAnexar} disabled={uploading || !selectedFile}>
            {uploading ? 'Aguarde...' : 'Anexar Documento'}
          </Button>
        </Box>
      </Paper>

      {anexos.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Anexos Adicionados:</Typography>
          <List>
            {anexos.map((anexo, index) => (
              <ListItem key={index} divider secondaryAction={
                <>
                  <IconButton edge="end" aria-label="ver" component={Link} href={anexo.url_arquivo} target="_blank" rel="noopener noreferrer">
                    <LinkIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="deletar" onClick={() => removerAnexoDaLista(index, anexo.path_arquivo)} color="error" sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }>
                <ListItemText primary={anexo.nome_documento} secondary={anexo.descricao || ''} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default Secao18MUI;