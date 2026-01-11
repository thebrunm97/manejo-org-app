import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Chip, Divider, Grid, Paper,
    Stack, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SpaIcon from '@mui/icons-material/Spa';
import GrassIcon from '@mui/icons-material/Grass';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';

import { CadernoCampoRecord, DetalhesColheita, DetalhesManejo, DetalhesPlantio } from '../../types/CadernoTypes';

export interface RecordDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    record: CadernoCampoRecord | null;
}

// Fallback icon for Manejo if needed, or reuse one
const SprayCanIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" stroke="none" />
        <path d="M12 2v4M8 6h8M8 10h8M12 10v6M9 16c-1.5 0-2 1.5-2 3v3h10v-3c0-1.5-.5-3-2-3" />
    </svg>
);

const getIconByType = (tipo: string) => {
    switch (tipo) {
        case 'colheita': return <AgricultureIcon />;
        case 'manejo': return <SprayCanIcon />;
        case 'insumo': return <Inventory2Icon />;
        case 'plantio': return <SpaIcon />;
        default: return <LocalFloristIcon />;
    }
};

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({ open, onClose, record }) => {
    if (!record) return null;

    const rawTipo = record.tipo_atividade || 'Outro';
    const tipo = rawTipo.toLowerCase();
    const details = record.detalhes_tecnicos || {};

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data desconhecida';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const locais = (record.talhao_canteiro || '')
        .split(';')
        .map(part => part.trim())
        .filter(Boolean);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    padding: 2,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        bgcolor: '#f1f5f9',
                        p: 1,
                        borderRadius: '12px',
                        color: '#0f172a',
                        display: 'flex'
                    }}>
                        {getIconByType(tipo)}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {rawTipo}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                            <EventIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {formatDate(record.data_registro)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#e2e8f0' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
                <Stack spacing={3}>

                    {/* SEÇÃO PRINCIPAL: PRODUTO & LOCAL */}
                    <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                                    Produto / Cultura
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                    {record.produto || 'Não informado'}
                                </Typography>
                            </Grid>

                            {(record.quantidade_valor || record.quantidade_unidade) && (
                                <Grid size={6}>
                                    <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                                        Quantidade
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#15803d' }}>
                                        {record.quantidade_valor || '-'}
                                        <Typography component="span" sx={{ fontSize: '0.8em', ml: 0.5, color: '#64748b' }}>
                                            {record.quantidade_unidade}
                                        </Typography>
                                    </Typography>
                                </Grid>
                            )}

                            <Grid size={record.quantidade_valor ? 6 : 12}>
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                                    Local
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                                    <PlaceIcon sx={{ fontSize: 18, color: '#64748b', mt: 0.2 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                        {locais.length === 0
                                            ? 'Geral / Não especificado'
                                            : locais.map((part, idx) => (
                                                <React.Fragment key={idx}>
                                                    {idx > 0 && <br />}
                                                    {part}
                                                </React.Fragment>
                                            ))}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* DETALHES ESPECÍFICOS */}
                    {Object.keys(details).length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}>
                                Detalhes da Atividade
                            </Typography>

                            <Grid container spacing={2}>
                                {tipo === 'colheita' && (() => {
                                    const d = details as DetalhesColheita;
                                    return (
                                        <>
                                            {d.lote && <DetailItem label="Lote" value={d.lote} />}
                                            {d.destino && <DetailItem label="Destino" value={d.destino} />}
                                            {d.classificacao && <DetailItem label="Classificação" value={d.classificacao} />}
                                            {d.qtd && d.qtd !== record.quantidade_valor && (
                                                <DetailItem label="Qtd. Extra" value={`${d.qtd} ${d.unidade || ''}`} />
                                            )}
                                        </>
                                    );
                                })()}

                                {(tipo === 'manejo' || tipo === 'insumo') && (() => {
                                    const d = details as DetalhesManejo;
                                    return (
                                        <>
                                            {(d.nome_insumo || d.insumo) && <DetailItem label="Insumo Aplicado" value={d.nome_insumo || d.insumo} colSpan={12} />}
                                            {d.dosagem && <DetailItem label="Dosagem" value={`${d.dosagem} ${d.unidade_dosagem || ''}`} />}
                                            {d.metodo_aplicacao && <DetailItem label="Método" value={d.metodo_aplicacao} />}
                                            {d.responsavel && <DetailItem label="Responsável" value={d.responsavel} />}
                                            {d.periodo_carencia && <DetailItem label="Carência" value={d.periodo_carencia} />}
                                        </>
                                    );
                                })()}

                                {tipo === 'plantio' && (() => {
                                    const d = details as DetalhesPlantio;
                                    return (
                                        <>
                                            {d.metodo_propagacao && <DetailItem label="Propagação" value={d.metodo_propagacao} />}
                                            {d.qtd_utilizada && <DetailItem label="Qtd. Sementes/Mudas" value={`${d.qtd_utilizada} ${d.unidade_medida}`} />}
                                            {d.espacamento && <DetailItem label="Espaçamento" value={d.espacamento} />}
                                            {d.lote_semente && <DetailItem label="Lote Semente" value={d.lote_semente} />}
                                        </>
                                    );
                                })()}

                                {!['colheita', 'manejo', 'insumo', 'plantio'].includes(tipo) && (
                                    <Grid size={12}>
                                        <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                            {JSON.stringify(details, null, 2)}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {/* OBSERVAÇÕES */}
                    {record.observacao_original && (
                        <Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                                Observações
                            </Typography>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#fffbed', border: '1px solid #fef3c7', borderRadius: '12px' }}>
                                <Typography variant="body2" sx={{ color: '#92400e', whiteSpace: 'pre-wrap' }}>
                                    {record.observacao_original}
                                </Typography>
                            </Paper>
                        </Box>
                    )}

                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    disableElevation
                    sx={{
                        bgcolor: '#0f172a',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '10px',
                        px: 3,
                        '&:hover': { bgcolor: '#1e293b' }
                    }}
                >
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Helper Subcomponent for Grid Items
const DetailItem = ({ label, value, colSpan = 6 }: { label: string, value: any, colSpan?: number }) => (
    <Grid size={colSpan}>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
            {value || '-'}
        </Typography>
    </Grid>
);

export default RecordDetailsDialog;
