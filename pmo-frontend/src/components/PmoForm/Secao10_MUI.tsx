import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  BugReport as BugIcon,
  WaterDrop as DosagemIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import SectionContainer from '../Common/SectionContainer';

// ===========================================
// 1. Interfaces (TypeScript)
// ===========================================
export interface FitossanidadeItem {
  id?: string;
  _id?: string;
  produto_ou_manejo: string;
  alvo_principal: string;
  qual_praga_doenca?: string;
  dosagem: string;
  quando: string;
  procedencia: string;
  composicao: string;
  marca: string;
  onde?: string;
}

interface FitossanidadeCardProps {
  item: FitossanidadeItem;
  onEdit: () => void;
  onDelete: () => void;
}

// ===========================================
// 2. Componente Card (Blindado)
// ===========================================
const FitossanidadeCard: React.FC<FitossanidadeCardProps> = ({ item, onEdit, onDelete }) => {
  if (!item) return null;

  const [expanded, setExpanded] = useState(false);
  const themeColor = '#f59e0b'; // Laranja/Âmbar

  return (
    <Card elevation={1} sx={{ borderRadius: 2, borderLeft: `6px solid ${themeColor}`, mb: 2, bgcolor: '#fff' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">

          {/* Lado Esquerdo: Ícone e Título */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{
              bgcolor: `${themeColor}20`,
              p: 1,
              borderRadius: '50%',
              color: themeColor
            }}>
              <BugIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                {item?.produto_ou_manejo || 'Não informado'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alvo: <strong>{item?.alvo_principal || item?.['qual_praga_doenca'] || 'Não informado'}</strong>
              </Typography>
            </Box>
          </Box>

          {/* Lado Direito: Ações */}
          <Stack direction="row">
            <IconButton size="small" onClick={onEdit} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Chips de Contexto */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          {item?.onde && (
            <Chip label={`Cultura: ${item.onde}`} size="small" variant="outlined" />
          )}
          {item?.dosagem && (
            <Chip
              icon={<DosagemIcon fontSize="small" />}
              label={item.dosagem}
              size="small"
              sx={{ bgcolor: '#e0f2fe', color: '#0284c7', borderColor: 'transparent' }}
            />
          )}
        </Stack>

        {/* Detalhes Expansíveis */}
        <Box sx={{ mt: 1 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ color: 'text.secondary', textTransform: 'none', p: 0, minWidth: 0 }}
          >
            {expanded ? 'Ocultar detalhes' : 'Ver detalhes técnicos'}
          </Button>

          <Collapse in={expanded}>
            <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f9fafb', borderRadius: 1, fontSize: '0.875rem' }}>
              <Stack spacing={1}>
                {item?.quando && <Box><strong>Quando aplicar:</strong> {item.quando}</Box>}
                {item?.procedencia && <Box><strong>Procedência:</strong> {item.procedencia}</Box>}
                {item?.composicao && <Box><strong>Composição:</strong> {item.composicao}</Box>}
                {item?.marca && <Box><strong>Marca:</strong> {item.marca}</Box>}
              </Stack>
            </Box>
          </Collapse>
        </Box>

      </CardContent>
    </Card>
  );
};

// ===========================================
// 3. Componente Principal (Section Wrapper)
// ===========================================
interface Secao10MUIProps {
  data: any;
  onSectionChange: (newData: any) => void;
}

const Secao10MUI: React.FC<Secao10MUIProps> = ({ data, onSectionChange }) => {
  const items: FitossanidadeItem[] = Array.isArray(data?.lista_fitossanidade) ? data.lista_fitossanidade : [];

  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FitossanidadeItem | null>(null);

  // Handlers CRUD
  const handleDataChange = (newItems: any[]) => {
    onSectionChange({ ...data, lista_fitossanidade: newItems });
  };

  const handleAddNew = () => {
    setEditingItem({
      _id: `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      produto_ou_manejo: '',
      alvo_principal: '',
      dosagem: '',
      quando: '',
      procedencia: '',
      composicao: '',
      marca: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (item: FitossanidadeItem) => {
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este manejo?')) {
      handleDataChange(items.filter(i => (i._id || i.id) !== id));
    }
  };

  const handleSaveModal = () => {
    if (!editingItem) return;

    if (!editingItem.produto_ou_manejo) {
      alert('Por favor, informe o produto ou manejo.');
      return;
    }

    const index = items.findIndex(i => (i._id === editingItem._id) || (i.id && i.id === editingItem.id));

    let newItems = [...items];
    if (index >= 0) {
      newItems[index] = editingItem;
    } else {
      newItems.push(editingItem);
    }

    handleDataChange(newItems);
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleFieldChange = (field: keyof FitossanidadeItem, value: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };


  return (
    <SectionContainer
      title="Manejo Fitossanitário (Pragas e Doenças)"
      onAdd={handleAddNew}
      addButtonLabel="Adicionar Manejo"
      isEmpty={items.length === 0}
      emptyMessage="Nenhum manejo de fitossanidade registrado."
      icon={<BugIcon sx={{ fontSize: 48 }} />}
    >
      <Stack spacing={0}>
        {items.map((item, index) => (
          <FitossanidadeCard
            key={item._id || item.id || index}
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id || item.id || '')}
          />
        ))}
        {/* Botão extra no final da lista opcional, mas o SectionContainer já tem um no header. 
              Para manter o padrão do usuário de ter um "Adicionar Outro" fácil no final: */}
        <Button
          variant="outlined"
          color="primary" // Mantendo coerência com o tema do SectionContainer
          startIcon={<EditIcon />} // Ícone genérico ou add
          onClick={handleAddNew}
          sx={{ mt: 1, textTransform: 'none', fontWeight: 600, borderStyle: 'dashed' }}
        >
          Adicionar Outro Item
        </Button>
      </Stack>

      {/* Modal de Edição */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1e293b', fontWeight: 700 }}>
          {editingItem?.produto_ou_manejo ? 'Editar Manejo' : 'Novo Manejo Fitossanitário'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
            Preencha as informações sobre o produto ou técnica utilizada.
          </Typography>
          <Grid container spacing={2}>
            {/* 1. Produto / Manejo (100%) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Produto ou Manejo"
                placeholder="Ex: Calda Bordalesa, Óleo de Neem"
                fullWidth
                required
                value={editingItem?.produto_ou_manejo || ''}
                onChange={(e) => handleFieldChange('produto_ou_manejo', e.target.value)}
              />
            </Grid>

            {/* 2. Alvo Principal (100%) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Alvo Principal (Praga/Doença)"
                placeholder="Ex: Lagarta, Ferrugem"
                fullWidth
                value={editingItem?.alvo_principal || ''}
                onChange={(e) => handleFieldChange('alvo_principal', e.target.value)}
              />
            </Grid>

            {/* 3. Dosagem & Quando (50% / 50%) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Dosagem Utilizada"
                placeholder="Ex: 100ml / 20L"
                fullWidth
                value={editingItem?.dosagem || ''}
                onChange={(e) => handleFieldChange('dosagem', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quando aplicar?"
                placeholder="Ex: Preventivo ou Curativo"
                fullWidth
                value={editingItem?.quando || ''}
                onChange={(e) => handleFieldChange('quando', e.target.value)}
              />
            </Grid>

            {/* 4. Procedência & Marca (50% / 50%) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Procedência"
                placeholder="Onde comprou / produziu?"
                fullWidth
                value={editingItem?.procedencia || ''}
                onChange={(e) => handleFieldChange('procedencia', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Marca Comercial"
                placeholder="Ex: Caseira, Marca X"
                fullWidth
                value={editingItem?.marca || ''}
                onChange={(e) => handleFieldChange('marca', e.target.value)}
              />
            </Grid>

            {/* 5. Composição (100% - Multiline) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Composição / Ingrediente Ativo"
                placeholder="Ex: Sulfato de cobre e cal"
                fullWidth
                multiline
                rows={2}
                value={editingItem?.composicao || ''}
                onChange={(e) => handleFieldChange('composicao', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveModal} variant="contained" sx={{ bgcolor: '#f59e0b', color: 'white' }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </SectionContainer>
  );
};

export default Secao10MUI;