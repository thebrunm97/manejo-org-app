import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormGroup, FormControlLabel, Checkbox, CircularProgress, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { supabase } from '../../supabaseClient';

interface LocationSelectorProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (locais: string[]) => void;
    pmoId: number;
}

interface CanteiroDB {
    nome: string;
}

interface TalhaoDB {
    nome: string;
    canteiros: CanteiroDB[];
}

const LocationSelectorDialog: React.FC<LocationSelectorProps> = ({ open, onClose, onConfirm, pmoId }) => {
    const [loading, setLoading] = useState(false);
    const [talhoes, setTalhoes] = useState<{ nome: string; canteiros: string[] }[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (open && pmoId) fetchLocais();
    }, [open, pmoId]);

    const fetchLocais = async () => {
        setLoading(true);
        setErrorMsg(null);
        const agrupado: Record<string, string[]> = {};

        try {
            // 1. BUSCA ESTRUTURAL (A Verdade Física)
            // Busca todos os talhões e seus respectivos canteiros
            const { data, error } = await supabase
                .from('talhoes')
                .select(`
                  nome,
                  canteiros ( nome )
                `);

            if (error) throw error;

            const infraData = data as unknown as TalhaoDB[];

            if (infraData) {
                infraData.forEach((talhao) => {
                    const nomeTalhao = talhao.nome || 'Sem Nome';
                    agrupado[nomeTalhao] = [];

                    if (talhao.canteiros && talhao.canteiros.length > 0) {
                        // Se tem canteiros, lista eles
                        talhao.canteiros.forEach((c) => {
                            agrupado[nomeTalhao].push(c.nome);
                        });
                    } else {
                        // Se é um talhão sem canteiros (ex: Pomar), adiciona opção genérica
                        agrupado[nomeTalhao].push('Área Total');
                    }
                });
            }

            // 2. BUSCA LEGADA (Para não perder "pomar de manga" que era texto solto)
            // Opcional: Se quiser garantir que locais antigos textuais apareçam
            const { data: pmoData } = await supabase
                .from('pmo_culturas')
                .select('localizacao')
                .eq('pmo_id', pmoId);

            if (pmoData) {
                pmoData.forEach((item: any) => {
                    const loc = item.localizacao;
                    // Se for string simples e não estiver nos grupos acima, adicione em "Outros"
                    if (typeof loc === 'string' && !loc.startsWith('{') && !loc.startsWith('[')) {
                        // Lógica simplificada para legado
                        let encontrou = false;
                        Object.keys(agrupado).forEach(t => {
                            // Verifica se o texto do local contêm o nome do talhão (ex: "Talhão 1" em "Canteiro do Talhão 1")
                            // Ou se o local já está listado
                            if (loc.includes(t)) encontrou = true;
                        });
                        if (!encontrou) {
                            if (!agrupado['Locais Legados']) agrupado['Locais Legados'] = [];
                            if (!agrupado['Locais Legados'].includes(loc)) agrupado['Locais Legados'].push(loc);
                        }
                    }
                });
            }

            // Ordenar canteiros numericamente se possível (Canteiro 1, 2, 10...)
            Object.keys(agrupado).forEach(key => {
                agrupado[key].sort((a, b) => {
                    const numA = parseInt(a.replace(/\D/g, '')) || 0;
                    const numB = parseInt(b.replace(/\D/g, '')) || 0;
                    return numA - numB || a.localeCompare(b);
                });
            });

            setTalhoes(Object.entries(agrupado).map(([nome, canteiros]) => ({ nome, canteiros })));

        } catch (error) {
            console.error("Erro ao buscar locais:", error);
            setErrorMsg("Falha ao carregar infraestrutura. Verifique sua conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (fullPath: string) => {
        setSelected(prev => prev.includes(fullPath)
            ? prev.filter(p => p !== fullPath)
            : [...prev, fullPath]
        );
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Selecionar Locais de Plantio</DialogTitle>
            <DialogContent dividers>
                {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

                {errorMsg && (
                    <Typography color="error" sx={{ p: 2, textAlign: 'center' }}>
                        {errorMsg}
                    </Typography>
                )}

                {!loading && !errorMsg && talhoes.map((t, i) => (
                    <Accordion key={i} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="bold">{t.nome}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {t.canteiros.map((c: string) => {
                                    const path = `${t.nome} > ${c}`;
                                    return (
                                        <FormControlLabel
                                            key={c}
                                            control={<Checkbox checked={selected.includes(path)} onChange={() => handleToggle(path)} />}
                                            label={c}
                                        />
                                    );
                                })}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={() => { onConfirm(selected); onClose(); }}>Confirmar ({selected.length})</Button>
            </DialogActions>
        </Dialog>
    );
};
export default LocationSelectorDialog;
