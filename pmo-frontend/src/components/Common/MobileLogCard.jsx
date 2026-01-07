import React from 'react';
import { Card, Box, Stack, Chip, Typography, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

const getStatusColor = (tipo) => {
    const map = {
        'Insumo': 'warning', 'Manejo': 'info', 'Plantio': 'success',
        'Colheita': 'primary', 'CANCELADO': 'error', 'Outro': 'default'
    };
    return map[tipo] || 'default';
};

const MobileLogCard = ({ reg, onEdit, onDelete }) => {
    const isCancelado = reg.tipo_atividade === 'CANCELADO';
    const historico = reg.detalhes_tecnicos?.historico_alteracoes || [];
    const ultimaJustificativa = historico.length > 0 ? historico[historico.length - 1].motivo : null;

    return (
        <Card elevation={2} sx={{ mb: 2, borderRadius: 3, overflow: 'visible', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', opacity: isCancelado ? 0.7 : 1 }}>
            <Box sx={{ p: 2 }}>
                {/* HEADER: Tipo e Data */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Chip
                        label={reg.tipo_atividade || 'Atividade'}
                        size="small"
                        color={getStatusColor(reg.tipo_atividade)}
                        variant={isCancelado ? "outlined" : "filled"}
                        sx={{ fontWeight: 800, fontSize: '0.7rem', height: 24 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {reg.data_registro ? new Date(reg.data_registro).toLocaleDateString('pt-BR') : '-'}
                    </Typography>
                </Stack>

                {/* BODY: Produto e Local */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="subtitle1" fontWeight={800}
                        color={isCancelado ? 'text.secondary' : 'text.primary'}
                        sx={{ lineHeight: 1.3, mb: 0.5, fontSize: '1.05rem', textDecoration: isCancelado ? 'line-through' : 'none' }}>
                        {reg.produto || 'Produto não informado'}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
                            📍 {reg.talhao_canteiro || 'Local não definido'}
                        </Typography>
                    </Stack>

                    {/* Detalhes Técnicos (Receita/Obs) */}
                    {(reg.detalhes_tecnicos?.receita || reg.observacao_original) && (
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block', fontStyle: 'italic', lineHeight: 1.2 }}>
                            "{reg.detalhes_tecnicos?.receita || reg.observacao_original}"
                        </Typography>
                    )}

                    {isCancelado && ultimaJustificativa && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                            MOTIVO: {ultimaJustificativa}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Divider />

            {/* FOOTER: Quantidade e Ações */}
            <Box sx={{ p: 1, pl: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fafafa' }}>
                <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ fontSize: '0.95rem' }}>
                    {reg.quantidade_valor > 0 ? `${reg.quantidade_valor} ${reg.quantidade_unidade}` : ''}
                </Typography>

                <Stack direction="row" spacing={0}>
                    {onEdit && onDelete && !isCancelado ? (
                        <>
                            <IconButton size="small" onClick={() => onEdit(reg)} sx={{ color: 'primary.main', p: 1 }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(reg)} sx={{ color: 'error.main', p: 1 }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton size="small" disabled><HistoryIcon /></IconButton>
                    )}
                </Stack>
            </Box>
        </Card>
    );
};

export default MobileLogCard;
