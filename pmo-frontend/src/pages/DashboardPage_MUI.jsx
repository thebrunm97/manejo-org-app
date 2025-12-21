import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Box, Fab, Card, CardActions, CardContent, CircularProgress,
  Grid, Typography, Chip, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip
} from '@mui/material';

// Ícones
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Ícone do Caderno

const PmoCard = ({ pmo, onDelete }) => {
  const navigate = useNavigate();
  
  const statusConfig = {
    'RASCUNHO': { label: 'Rascunho', color: 'default', icon: <EditIcon fontSize="inherit" /> },
    'CONCLUÍDO': { label: 'Concluído', color: 'info', icon: <HourglassEmptyIcon fontSize="inherit" /> },
    'APROVADO': { label: 'Aprovado', color: 'success', icon: <CheckCircleIcon fontSize="inherit" /> },
    'REPROVADO': { label: 'Reprovado', color: 'error', icon: <ErrorIcon fontSize="inherit" /> },
  };
  const currentStatus = statusConfig[pmo.status] || statusConfig['RASCUNHO'];

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DescriptionIcon color="action" sx={{ mr: 1.5, fontSize: 40 }} />
            <Box>
              <Typography variant="h6" component="h2" noWrap title={pmo.nome_identificador}>
                {pmo.nome_identificador}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Versão: {pmo.version || '1'}
              </Typography>
            </Box>
          </Box>
          <Chip icon={currentStatus.icon} label={currentStatus.label} color={currentStatus.color} size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Criado em: {new Date(pmo.created_at).toLocaleDateString('pt-BR')}
          </Typography>
        </CardContent>
        
        {/* BARRA DE AÇÕES */}
        <CardActions sx={{ justifyContent: 'flex-end', borderTop: '1px solid #eee' }}>
            
            {/* --- BOTÃO ESPECIAL: CADERNO DE CAMPO --- */}
            <Tooltip title="Abrir Caderno de Campo Digital">
                <IconButton 
                  size="small" 
                  color="success" 
                  // AQUI ESTÁ A MUDANÇA: Passamos o parâmetro ?aba=caderno
                  onClick={() => navigate(`/pmo/${pmo.id}/editar?aba=caderno`)}
                >
                    <MenuBookIcon />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="Ver Detalhes (Leitura)">
                <IconButton size="small" onClick={() => navigate(`/pmo/${pmo.id}`)}>
                    <VisibilityIcon />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="Editar PMO">
                <IconButton size="small" color="primary" onClick={() => navigate(`/pmo/${pmo.id}/editar`)}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="Excluir">
                <IconButton size="small" color="error" onClick={() => onDelete(pmo)}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
};

function DashboardPageMUI() {
  const [pmos, setPmos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [pmoToDelete, setPmoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleListPmos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('pmos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setPmos(data);
      } catch (err) { console.error("Erro ao buscar PMOs:", err.message); } 
      finally { setIsLoading(false); }
    };
    handleListPmos();
  }, []);

  const openDeleteDialog = (pmo) => {
    setPmoToDelete(pmo);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setPmoToDelete(null);
    setDialogOpen(false);
  };

  const handleDeletePmo = async () => {
    if (!pmoToDelete) return;
    setIsDeleting(true);

    try {
      const anexos = pmoToDelete.form_data?.secao_18_anexos?.lista_anexos || [];
      if (anexos.length > 0) {
        const filePaths = anexos.map(anexo => anexo.path_arquivo);
        const { error: storageError } = await supabase.storage.from('anexos-pmos').remove(filePaths);
        if (storageError) console.error("Aviso: Falha ao deletar alguns anexos no storage.", storageError);
      }

      const { error: dbError } = await supabase.from('pmos').delete().eq('id', pmoToDelete.id);
      if (dbError) throw dbError;

      setPmos(currentPmos => currentPmos.filter(p => p.id !== pmoToDelete.id));

    } catch (err) {
      console.error("Erro ao excluir o PMO:", err.message);
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Meus Planos de Manejo</Typography>
      </Box>

      <Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
        ) : pmos.length > 0 ? (
          <Grid container spacing={3}>
            {pmos.map(pmo => (
              <PmoCard key={pmo.id} pmo={pmo} onDelete={openDeleteDialog} />
            ))}
          </Grid>
        ) : (
          <Typography sx={{ mt: 4, textAlign: 'center' }}>Nenhum Plano de Manejo encontrado.</Typography>
        )}
      </Box>
      
      <Fab color="primary" aria-label="adicionar pmo" onClick={() => navigate('/pmo/novo')} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <AddIcon />
      </Fab>

      <Dialog open={isDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o plano "<strong>{pmoToDelete?.nome_identificador}</strong>"?
            <br />
            Esta ação não pode ser desfeita. Todos os dados e anexos associados serão permanentemente removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>Cancelar</Button>
          <Button onClick={handleDeletePmo} color="error" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={22} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPageMUI;