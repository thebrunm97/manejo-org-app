import React, { useState } from 'react';
import {
    Box, Tabs, Tab, Grid, Paper, Typography, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Button, TextField,
    RadioGroup, FormControlLabel, Radio, Card, CardContent, CardActionArea
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';
import RouteIcon from '@mui/icons-material/Route';

// Dados mockados para os talhões e espaços
const MOCK_LAYOUT = {
    'Talhão 1': [
        { id: 1, nome: 'Canteiro 01', tipo: 'canteiro' },
        { id: 2, nome: 'Entrelinha A', tipo: 'entrelinha' },
        { id: 3, nome: 'Canteiro 02', tipo: 'canteiro' },
        { id: 4, nome: 'Entrelinha B', tipo: 'entrelinha' },
        { id: 5, nome: 'Canteiro 03', tipo: 'canteiro' }
    ],
    'Talhão 2': [
        { id: 6, nome: 'Canteiro A1', tipo: 'canteiro' },
        { id: 7, nome: 'Canteiro A2', tipo: 'canteiro' },
        { id: 8, nome: 'Entrelinha Central', tipo: 'entrelinha' }
    ],
    'SAF Experimental': [
        { id: 9, nome: 'Linha de Árvores', tipo: 'canteiro' },
        { id: 10, nome: 'Entrelinha Norte', tipo: 'entrelinha' },
        { id: 11, nome: 'Entrelinha Sul', tipo: 'entrelinha' },
        { id: 12, nome: 'Berço Frutíferas', tipo: 'canteiro' }
    ]
};

/**
 * Componente de Seletor Visual para espaços em SAF
 * Apresenta Grid visual com cards clicáveis para canteiros e entrelinhas
 * 
 * @param {Object} props
 * @param {string} props.value - Valor atual no formato "Talhão - Espaço"
 * @param {function} props.onChange - Callback quando seleção muda
 */
const SeletorVisualSaf = ({ value = '', onChange }) => {
    const talhoes = Object.keys(MOCK_LAYOUT);

    // Estado para navegação de talhões
    const [talhaoAtual, setTalhaoAtual] = useState(talhoes[0]);

    // Estado para layout (dados mockados)
    const [layout, setLayout] = useState(MOCK_LAYOUT);

    // Estado para dialog de criação
    const [dialogOpen, setDialogOpen] = useState(false);
    const [novoEspaco, setNovoEspaco] = useState({ nome: '', tipo: 'canteiro' });

    // Parse do valor atual para destacar seleção
    const [talhaoSelecionado, espacoSelecionado] = value && value.includes(' - ')
        ? value.split(' - ')
        : ['', ''];

    const handleTalhaoChange = (event, newValue) => {
        setTalhaoAtual(newValue);
    };

    const handleEspacoClick = (espaco) => {
        const novoValor = `${talhaoAtual} - ${espaco.nome}`;
        if (onChange) {
            onChange(novoValor);
        }
    };

    const handleAdicionarEspaco = () => {
        if (!novoEspaco.nome.trim()) {
            alert('Por favor, informe o nome do espaço');
            return;
        }

        const novoId = Math.max(...Object.values(layout).flat().map(e => e.id), 0) + 1;
        const espacoCriado = {
            id: novoId,
            nome: novoEspaco.nome.trim(),
            tipo: novoEspaco.tipo
        };

        setLayout(prev => ({
            ...prev,
            [talhaoAtual]: [...(prev[talhaoAtual] || []), espacoCriado]
        }));

        setNovoEspaco({ nome: '', tipo: 'canteiro' });
        setDialogOpen(false);

        // Auto-seleciona o espaço recém-criado
        handleEspacoClick(espacoCriado);
    };

    const renderEspacoCard = (espaco) => {
        const isCanteiro = espaco.tipo === 'canteiro';
        const isSelected = talhaoSelecionado === talhaoAtual && espacoSelecionado === espaco.nome;

        return (
            <Grid item xs={6} sm={4} md={3} key={espaco.id}>
                <Card
                    elevation={isSelected ? 6 : 1}
                    sx={{
                        border: isSelected ? 3 : 2,
                        borderColor: isSelected ? 'primary.main' : (isCanteiro ? 'success.light' : 'warning.main'),
                        bgcolor: isCanteiro ? 'success.50' : 'warning.50',
                        transition: 'all 0.2s',
                        '&:hover': {
                            elevation: 4,
                            transform: 'translateY(-4px)'
                        }
                    }}
                >
                    <CardActionArea onClick={() => handleEspacoClick(espaco)} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {isCanteiro ? (
                                <GrassIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            ) : (
                                <RouteIcon sx={{ fontSize: 40, color: 'warning.dark' }} />
                            )}
                            <Typography variant="body2" align="center" sx={{ fontWeight: 600 }}>
                                {espaco.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {isCanteiro ? 'Canteiro' : 'Entrelinha'}
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    return (
        <Box sx={{ width: '100%', my: 2 }}>
            {/* Tabs de Navegação */}
            <Tabs
                value={talhaoAtual}
                onChange={handleTalhaoChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
                {talhoes.map(talhao => (
                    <Tab key={talhao} label={talhao} value={talhao} />
                ))}
            </Tabs>

            {/* Grid de Espaços */}
            <Grid container spacing={2}>
                {(layout[talhaoAtual] || []).map(espaco => renderEspacoCard(espaco))}

                {/* Botão Adicionar Espaço */}
                <Grid item xs={6} sm={4} md={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            border: 2,
                            borderStyle: 'dashed',
                            borderColor: 'grey.400',
                            bgcolor: 'grey.50',
                            minHeight: 140,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.50'
                            }
                        }}
                        onClick={() => setDialogOpen(true)}
                    >
                        <IconButton color="primary" size="large">
                            <AddIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Adicionar Espaço
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Seleção Atual */}
            {value && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Selecionado:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {value}
                    </Typography>
                </Box>
            )}

            {/* Dialog de Criação */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Adicionar Novo Espaço em {talhaoAtual}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Nome do Espaço"
                            value={novoEspaco.nome}
                            onChange={(e) => setNovoEspaco(prev => ({ ...prev, nome: e.target.value }))}
                            fullWidth
                            autoFocus
                            placeholder="Ex: Canteiro 04, Entrelinha C"
                        />

                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Tipo de Espaço:</Typography>
                            <RadioGroup
                                value={novoEspaco.tipo}
                                onChange={(e) => setNovoEspaco(prev => ({ ...prev, tipo: e.target.value }))}
                            >
                                <FormControlLabel
                                    value="canteiro"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <GrassIcon sx={{ color: 'success.main' }} />
                                            <Typography>Canteiro / Linha de Cultivo</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="entrelinha"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <RouteIcon sx={{ color: 'warning.dark' }} />
                                            <Typography>Entrelinha / Caminho</Typography>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleAdicionarEspaco}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SeletorVisualSaf;
