import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Grid } from '@mui/material';

// Listas de opções para SAF
const TALHOES = ['Talhão 1', 'Talhão 2', 'Talhão 3', 'SAF Experimental', 'SAF Principal', 'Horta Mandala'];
const MICRO_LOCAIS = [
    'Linha de Árvores',
    'Entrelinha',
    'Berço',
    'Borda',
    'Canteiro',
    'Entrelinha de Café',
    'Linha de Bananeiras',
    'Estrato Baixo',
    'Estrato Médio',
    'Estrato Alto'
];

/**
 * Componente de input hierárquico para localização em Sistemas Agroflorestais (SAF)
 * 
 * @param {Object} props
 * @param {string} props.value - Valor inicial no formato "Talhão - Detalhe"
 * @param {function} props.onChange - Callback chamado quando o valor muda
 * @param {string} props.size - Tamanho dos campos (opcional, padrão: 'small')
 */
const LocalizacaoSafInput = ({ value = '', onChange, size = 'small' }) => {
    const [talhao, setTalhao] = useState('');
    const [detalhe, setDetalhe] = useState('');

    // Parser: Separa o valor inicial em talhão e detalhe
    useEffect(() => {
        if (value && typeof value === 'string' && value.includes(' - ')) {
            const parts = value.split(' - ');
            setTalhao(parts[0].trim());
            setDetalhe(parts[1].trim());
        } else if (value && typeof value === 'string' && value.trim()) {
            // Se não tem separador, assume que é só o talhão
            setTalhao(value.trim());
            setDetalhe('');
        } else {
            setTalhao('');
            setDetalhe('');
        }
    }, [value]);

    // Concatena e notifica mudança
    const handleUpdate = (newTalhao, newDetalhe) => {
        let resultado = '';

        if (newTalhao && newDetalhe) {
            resultado = `${newTalhao} - ${newDetalhe}`;
        } else if (newTalhao) {
            resultado = newTalhao;
        } else if (newDetalhe) {
            resultado = newDetalhe;
        }

        if (onChange) {
            onChange(resultado);
        }
    };

    const handleTalhaoChange = (event, newValue) => {
        setTalhao(newValue || '');
        handleUpdate(newValue || '', detalhe);
    };

    const handleDetalheChange = (event, newValue) => {
        setDetalhe(newValue || '');
        handleUpdate(talhao, newValue || '');
    };

    return (
        <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
                <Autocomplete
                    freeSolo
                    size={size}
                    options={TALHOES}
                    value={talhao}
                    onChange={handleTalhaoChange}
                    onInputChange={handleTalhaoChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Talhão"
                            placeholder="Ex: Talhão 1"
                            size={size}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Autocomplete
                    freeSolo
                    size={size}
                    options={MICRO_LOCAIS}
                    value={detalhe}
                    onChange={handleDetalheChange}
                    onInputChange={handleDetalheChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Micro-Local"
                            placeholder="Ex: Entrelinha"
                            size={size}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default LocalizacaoSafInput;
