import React, { ReactNode } from 'react';
import { Box, Stack, Typography, Button, Paper } from '@mui/material';
import { AddCircleOutline as AddIcon, Spa as SpaIcon } from '@mui/icons-material';

interface SectionContainerProps {
    title: string;
    onAdd?: () => void;
    addButtonLabel?: string;
    isEmpty: boolean;
    emptyMessage: string;
    children: ReactNode;
    icon?: ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
    title,
    onAdd,
    addButtonLabel = "Adicionar",
    isEmpty,
    emptyMessage,
    children,
    icon
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            {/* Header Padronizado */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#16a34a' }}> {/* Cor verde/padrão PMO, pode ser ajustado props */}
                    {title}
                </Typography>

                {/* Botão no Header apenas se a lista NÃO estiver vazia (para adicionar "mais um") */}
                {/* OU sempre? O UX padrão sugere sempre acessível, mas o EmptyState já tem um botão call-to-action. */}
                {/* Vamos manter sempre visível para consistência, exceto se empty (pois o empty state tem o botão centralizado). */}
                {!isEmpty && onAdd && (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                        sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#16a34a' }}
                    >
                        {addButtonLabel}
                    </Button>
                )}
            </Stack>

            {/* Conteúdo ou Empty State */}
            {isEmpty ? (
                <Paper
                    variant="outlined"
                    sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 2,
                        bgcolor: '#f9f9f9', // Cinza bem claro
                        borderRadius: 2,
                        borderStyle: 'dashed',
                        borderColor: '#e0e0e0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Box sx={{ color: '#bdbdbd' }}>
                        {icon || <SpaIcon sx={{ fontSize: 48 }} />}
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {emptyMessage}
                    </Typography>
                    {onAdd && (
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={onAdd}
                            sx={{ mt: 1, textTransform: 'none' }}
                        >
                            {addButtonLabel}
                        </Button>
                    )}
                </Paper>
            ) : (
                <Box>
                    {children}
                </Box>
            )}
        </Box>
    );
};

export default SectionContainer;
