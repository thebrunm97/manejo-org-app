import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Stack, Collapse, Button, Divider } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, BugReport as BugIcon, WaterDrop as DosagemIcon, ExpandMore, ExpandLess } from '@mui/icons-material';

const FitossanidadeCard = ({ item, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const themeColor = '#f59e0b'; // Laranja/Âmbar

  return (
    <Card elevation={2} sx={{ borderRadius: 2, borderLeft: `6px solid ${themeColor}` }}>
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
                {item.produto_ou_manejo || 'Produto não informado'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alvo: <strong>{item.qual_praga_doenca || 'Não especificado'}</strong>
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
          {item.onde && (
            <Chip label={`Cultura: ${item.onde}`} size="small" variant="outlined" />
          )}
          {item.dosagem && (
            <Chip 
              icon={<DosagemIcon fontSize="small" />} 
              label={item.dosagem} 
              size="small" 
              sx={{ bgcolor: '#e0f2fe', color: '#0284c7', borderColor: 'transparent' }} 
            />
          )}
        </Stack>

        {/* Detalhes Expansíveis (Procedência, Composição, etc) */}
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
                {item.quando && <Box><strong>Quando aplicar:</strong> {item.quando}</Box>}
                {item.procedencia && <Box><strong>Procedência:</strong> {item.procedencia}</Box>}
                {item.composicao && <Box><strong>Composição:</strong> {item.composicao}</Box>}
                {item.marca && <Box><strong>Marca:</strong> {item.marca}</Box>}
              </Stack>
            </Box>
          </Collapse>
        </Box>

      </CardContent>
    </Card>
  );
};

export default FitossanidadeCard;