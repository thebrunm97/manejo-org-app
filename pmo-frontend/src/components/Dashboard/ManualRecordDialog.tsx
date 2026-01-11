import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogTitle, Tabs, Tab, Box, TextField, Button,
    DialogActions, FormControl, InputLabel, Select, MenuItem, Stack, Chip,
    Typography, InputAdornment, Alert
} from '@mui/material';
import { cadernoService } from '../../services/cadernoService';
import LocationSelectorDialog from '../Common/LocationSelectorDialog';
import {
    ActivityType,
    UnitType,
    CadernoEntry,
    DetalhesPlantio,
    DetalhesManejo,
    DetalhesColheita,
    DetalhesGenerico,
    CadernoCampoRecord,
    ManejoSubtype
} from '../../types/CadernoTypes';

// Ícones
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'; // Plantio
import ContentCutIcon from '@mui/icons-material/ContentCut'; // Colheita
import ScienceIcon from '@mui/icons-material/Science'; // Manejo
import InventoryIcon from '@mui/icons-material/Inventory'; // Outro

// --- CONSTANT DEFINITIONS ---
const UNIDADES_PLANTIO: UnitType[] = [
    UnitType.UNID,
    UnitType.MACO,
    UnitType.KG,
    UnitType.G,
    UnitType.M2,
    UnitType.CX,
    UnitType.TON
];

const UNIDADES_MANEJO: UnitType[] = [
    UnitType.L_HA,
    UnitType.KG_HA,
    UnitType.ML_L,
    UnitType.G_PLANTA,
    UnitType.ML_PLANTA,
    UnitType.UNID
];

const UNIDADES_COLHEITA: UnitType[] = [
    UnitType.KG,
    UnitType.TON,
    UnitType.CX,
    UnitType.MACO,
    UnitType.UNID
];

interface ManualRecordDialogProps {
    open: boolean;
    onClose: () => void;
    pmoId: number;
    recordToEdit?: CadernoCampoRecord | null;
    onRecordSaved: () => void;
}

const ManualRecordDialog: React.FC<ManualRecordDialogProps> = ({ open, onClose, pmoId, recordToEdit, onRecordSaved }) => {
    const isEditMode = !!recordToEdit;

    // UI State
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // Justification State (Edit Only)
    const [openJustification, setOpenJustification] = useState(false);
    const [justificativa, setJustificativa] = useState('');

    // Form States
    const [dataHora, setDataHora] = useState(new Date().toLocaleString('sv').slice(0, 16));
    const [locais, setLocais] = useState<string[]>([]);
    const [produto, setProduto] = useState('');
    const [observacao, setObservacao] = useState('');

    // Plantio
    const [metodoPropagacao, setMetodoPropagacao] = useState('Muda');
    const [qtdPlantio, setQtdPlantio] = useState('');
    const [unidadePlantio, setUnidadePlantio] = useState<UnitType>(UnitType.UNID);

    // Manejo
    // Manejo State
    const [subtipoManejo, setSubtipoManejo] = useState<ManejoSubtype>(ManejoSubtype.MANEJO_CULTURAL);
    // Common / Specific Manejo Fields
    const [tipoManejo, setTipoManejo] = useState('Adubação'); // Used for classification inside operation? Keep for legacy or specific detail
    const [insumo, setInsumo] = useState('');
    const [dosagem, setDosagem] = useState('');
    const [unidadeDosagem, setUnidadeDosagem] = useState<UnitType>(UnitType.L_HA);
    const [responsavel, setResponsavel] = useState('');
    // New Fields
    const [equipamento, setEquipamento] = useState('');
    const [itemHigienizado, setItemHigienizado] = useState('');
    const [produtoUtilizado, setProdutoUtilizado] = useState('');
    const [atividadeCultural, setAtividadeCultural] = useState('');
    const [qtdTrabalhadores, setQtdTrabalhadores] = useState('');

    // Colheita
    const [lote, setLote] = useState('');
    const [destino, setDestino] = useState('Mercado Interno');
    const [classificacao, setClassificacao] = useState('Primeira');
    const [qtdColheita, setQtdColheita] = useState('');
    const [unidadeColheita, setUnidadeColheita] = useState<UnitType>(UnitType.KG);

    // Dialogs
    const [openLocation, setOpenLocation] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Initialization & Population
    useEffect(() => {
        if (open) {
            setErrors({});
            if (recordToEdit) {
                // --- MODO EDIÇÃO ---
                // 1. Campos Comuns
                if (recordToEdit.data_registro) {
                    // Try to keep it ISO-like for input type=datetime-local
                    const d = new Date(recordToEdit.data_registro);
                    const localIso = d.toLocaleString('sv').slice(0, 16);
                    setDataHora(localIso);
                }

                setProduto(recordToEdit.produto || '');
                setObservacao(recordToEdit.observacao_original || '');
                setLocais(recordToEdit.talhao_canteiro ? recordToEdit.talhao_canteiro.split(';').map(s => s.trim()).filter(Boolean) : []);

                // 2. Determinar Aba e Campos Específicos
                // Normaliza para comparar com Enums ou strings legado
                const tipoRaw = recordToEdit.tipo_atividade;
                const details = recordToEdit.detalhes_tecnicos || {};

                // Use includes/checks for robust matching
                const isPlantio = tipoRaw === ActivityType.PLANTIO || tipoRaw === 'Plantio';
                const isManejo = tipoRaw === ActivityType.MANEJO || tipoRaw === 'Manejo' || tipoRaw === ActivityType.INSUMO;
                const isColheita = tipoRaw === ActivityType.COLHEITA || tipoRaw === 'Colheita';

                if (isPlantio) {
                    setActiveTab(0);
                    const d = details as DetalhesPlantio;
                    setMetodoPropagacao(d.metodo_propagacao || 'Muda');
                    setQtdPlantio(d.qtd_utilizada ? String(d.qtd_utilizada) : '');
                    // Cast safely if it's a valid enum, otherwise default or handle legacy
                    setUnidadePlantio((d.unidade_medida as UnitType) || UnitType.UNID);
                } else if (isManejo) {
                    setActiveTab(1);
                    const d = details as DetalhesManejo;
                    const legacy = details as any;

                    // Determine subtype or infer
                    let inferred = d.subtipo as ManejoSubtype;

                    if (!inferred) {
                        if (d.item_higienizado || legacy.item_limpo) {
                            inferred = ManejoSubtype.HIGIENIZACAO;
                        } else if (d.insumo || d.nome_insumo || d.dosagem || legacy.nome_insumo) {
                            inferred = ManejoSubtype.APLICACAO_INSUMO;
                        } else {
                            inferred = ManejoSubtype.MANEJO_CULTURAL;
                        }
                    }
                    setSubtipoManejo(inferred);

                    setTipoManejo(d.tipo_manejo || 'Adubação');
                    setInsumo(d.nome_insumo || d.insumo || legacy.insumo || '');
                    setDosagem(d.dosagem ? String(d.dosagem) : '');
                    setUnidadeDosagem((d.unidade_dosagem as UnitType) || UnitType.L_HA);
                    setResponsavel(d.responsavel || '');

                    // Populate new fields
                    setEquipamento(d.equipamento || '');
                    setItemHigienizado(d.item_higienizado || legacy.item_limpo || '');
                    setProdutoUtilizado(d.produto_utilizado || '');
                    setAtividadeCultural(d.atividade || d.tipo_manejo || ''); // Fallback for cultural activity
                    setQtdTrabalhadores(d.qtd_trabalhadores ? String(d.qtd_trabalhadores) : '');
                } else if (isColheita) {
                    setActiveTab(2);
                    const d = details as DetalhesColheita;
                    setLote(d.lote || '');
                    setDestino(d.destino || 'Mercado Interno');
                    setClassificacao(d.classificacao || 'Primeira');
                    setQtdColheita(d.qtd ? String(d.qtd) : '');
                    setUnidadeColheita((d.unidade as UnitType) || UnitType.KG);
                } else {
                    setActiveTab(3); // Outro
                }

                // Reset Justification
                setJustificativa('');
                setOpenJustification(false);

            } else {
                // --- MODO CRIAÇÃO (Reset) ---
                const today = new Date();
                const yy = today.getFullYear().toString().slice(-2);
                const mm = (today.getMonth() + 1).toString().padStart(2, '0');
                const dd = today.getDate().toString().padStart(2, '0');

                setDataHora(new Date().toLocaleString('sv').slice(0, 16));
                setLote(`LOTE-${yy}${mm}${dd}`);
                setLocais([]);
                setProduto('');
                setObservacao('');

                // Reset numeric fields
                setQtdPlantio('');
                setInsumo('');
                setDosagem('');
                setQtdColheita('');

                // Defaults
                setUnidadePlantio(UnitType.UNID);
                setUnidadeDosagem(UnitType.L_HA);
                setUnidadeColheita(UnitType.KG);

                // Default Tab
                setActiveTab(0);
            }
        }
    }, [open, recordToEdit]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        const hasLocais = locais.length > 0;
        const hasProduto = !!produto.trim();

        if (!dataHora) newErrors.data = 'Data é obrigatória';

        if (activeTab === 0) { // Plantio
            if (!hasProduto) newErrors.produto = 'Cultura é obrigatória';
            if (!metodoPropagacao) newErrors.metodo = 'Método é obrigatório';
            if (!hasLocais) newErrors.locais = 'Local é obrigatório';
        }
        else if (activeTab === 1) { // Manejo
            if (subtipoManejo === ManejoSubtype.HIGIENIZACAO) {
                if (!itemHigienizado.trim()) newErrors.itemHigienizado = 'Item obrigatório';
                if (!produtoUtilizado.trim()) newErrors.produtoUtilizado = 'Produto obrigatório';
            } else {
                // Manejo Cultural e Insumo exigem: (Cultura/Produto OR Local)
                if (!hasProduto && !hasLocais) {
                    newErrors.produto = 'Informe Cultura ou Local';
                    newErrors.locais = 'Informe Cultura ou Local';
                }

                if (subtipoManejo === ManejoSubtype.APLICACAO_INSUMO) {
                    if (!insumo.trim()) newErrors.insumo = 'Insumo obrigatório';
                    if (!dosagem.trim()) newErrors.dosagem = 'Dose obrigatória';
                }
                else if (subtipoManejo === ManejoSubtype.MANEJO_CULTURAL) {
                    if (!atividadeCultural.trim()) newErrors.atividadeCultural = 'Atividade obrigatória';
                }
            }
        }
        else if (activeTab === 2) { // Colheita
            if (!hasProduto) newErrors.produto = 'Cultura é obrigatória';
            if (!qtdColheita || parseFloat(qtdColheita) <= 0) newErrors.qtdColheita = 'Qtd é obrigatória';
        }
        else if (activeTab === 3) { // Outro
            if (!hasProduto && !hasLocais && !observacao.trim()) {
                newErrors.observacao = 'Preencha ao menos um campo';
                newErrors.produto = 'Obrigatório';
                newErrors.locais = 'Obrigatório';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInitialSaveClick = () => {
        if (!validate()) return;

        if (isEditMode) {
            setOpenJustification(true);
        } else {
            executeSave();
        }
    };

    const executeSave = async () => {
        setLoading(true);
        try {
            let tipo: ActivityType = ActivityType.OUTRO;
            if (activeTab === 0) tipo = ActivityType.PLANTIO;
            if (activeTab === 1) tipo = ActivityType.MANEJO;
            if (activeTab === 2) tipo = ActivityType.COLHEITA;

            // Base Payload
            const payloadBase = {
                id: isEditMode && recordToEdit ? recordToEdit.id : undefined, // Keep ID for updates if valid
                pmo_id: pmoId,
                data_registro: new Date(dataHora).toISOString(),
                tipo_atividade: tipo,
                talhao_canteiro: locais.join('; '),
                produto: produto,
                observacao_original: observacao || `Registro de ${tipo}`,
            };

            let finalPayload: CadernoEntry | null = null;

            // Specific Details
            if (tipo === ActivityType.PLANTIO) {
                const detalhes: DetalhesPlantio = {
                    metodo_propagacao: metodoPropagacao as any,
                    qtd_utilizada: parseFloat(qtdPlantio) || 0,
                    unidade_medida: unidadePlantio
                };

                finalPayload = {
                    ...payloadBase,
                    id: payloadBase.id!, // ID is optional in BaseRegistro but required for update? service takes care of it usually
                    quantidade_valor: parseFloat(qtdPlantio) || 0,
                    quantidade_unidade: unidadePlantio,
                    detalhes_tecnicos: detalhes
                } as CadernoEntry;
                // Using 'as CadernoEntry' because TS might complain about optional id matching EXACTLY BaseRegistro if undefined.
                // Ideally we separate Create vs Update payloads, but service handles both usually.
            }
            else if (tipo === ActivityType.MANEJO) {
                // Base details common to all
                const detalhesBase: DetalhesManejo = {
                    subtipo: subtipoManejo,
                    responsavel: responsavel,
                    // Legacy field retention if needed, or specific to context
                    tipo_manejo: tipoManejo
                };

                let detalhes: DetalhesManejo = { ...detalhesBase };

                if (subtipoManejo === ManejoSubtype.APLICACAO_INSUMO) {
                    detalhes = {
                        ...detalhes,
                        insumo: insumo,
                        dosagem: dosagem, // string allowed by schema
                        unidade_dosagem: unidadeDosagem,
                        equipamento: equipamento
                    };
                } else if (subtipoManejo === ManejoSubtype.HIGIENIZACAO) {
                    detalhes = {
                        ...detalhes,
                        item_higienizado: itemHigienizado,
                        produto_utilizado: produtoUtilizado
                    };
                } else {
                    // MANEJO_CULTURAL
                    detalhes = {
                        ...detalhes,
                        atividade: atividadeCultural,
                        qtd_trabalhadores: parseInt(qtdTrabalhadores || '0', 10)
                    };
                }

                // Decide what goes into 'produto' column for quick reference
                let produtoRef = '';
                if (subtipoManejo === ManejoSubtype.APLICACAO_INSUMO) produtoRef = insumo;
                else if (subtipoManejo === ManejoSubtype.HIGIENIZACAO) produtoRef = `${itemHigienizado} (${produtoUtilizado})`;
                else produtoRef = atividadeCultural;

                finalPayload = {
                    ...payloadBase,
                    id: payloadBase.id!,
                    produto: produtoRef,
                    detalhes_tecnicos: detalhes
                } as CadernoEntry;
            }
            else if (tipo === ActivityType.COLHEITA) {
                const detalhes: DetalhesColheita = {
                    lote: lote,
                    destino: destino,
                    classificacao: classificacao,
                    qtd: parseFloat(qtdColheita) || 0,
                    unidade: unidadeColheita
                };

                finalPayload = {
                    ...payloadBase,
                    id: payloadBase.id!,
                    quantidade_valor: parseFloat(qtdColheita) || 0,
                    quantidade_unidade: unidadeColheita,
                    detalhes_tecnicos: detalhes
                } as CadernoEntry;
            }
            else {
                // Outro
                const detalhes: DetalhesGenerico = {};
                finalPayload = {
                    ...payloadBase,
                    id: payloadBase.id!,
                    detalhes_tecnicos: detalhes
                } as CadernoEntry;
            }

            if (!finalPayload) return;

            if (isEditMode && recordToEdit) {
                // --- UPDATE ---
                // Prepend justification to observation
                const auditTrail = `[EDITADO em ${new Date().toLocaleString('pt-BR')}] Motivo: ${justificativa}\n\n`;
                finalPayload.observacao_original = auditTrail + (observacao || '');

                // Ensure ID is present
                if (!finalPayload.id) finalPayload.id = recordToEdit.id;

                await cadernoService.updateRegistro(recordToEdit.id, finalPayload);
            } else {
                // --- CREATE ---
                // ID is generated by backend, so we can cast to any or omit ID for creation
                // types/CadernoTypes probably makes ID required in CadernoEntry, but service addRegistro likely ignores it or takes Omit<CadernoEntry, 'id'>.
                // Since I cannot change the service signature right now, I will pass it as is.
                await cadernoService.addRegistro(finalPayload as any); // fallback to any just for the service call validation if strictly typed generic fails
            }

            onRecordSaved();
            onClose();

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar. Verifique o console.');
        } finally {
            setLoading(false);
            setOpenJustification(false);
        }
    };

    // Helper for resilience
    const renderUnitSelect = (
        value: UnitType | string,
        setValue: (val: any) => void, // Using any here to allow setting UnitType | string easily from e.target.value
        options: UnitType[],
        label: string = "Unid"
    ) => {
        // Safe check: value might be a string from legacy DB that isn't in UnitType enum
        const isCustomValue = value && !options.includes(value as UnitType);

        // Effective options include the custom value if it exists
        const effectiveOptions: (UnitType | string)[] = isCustomValue
            ? [value, ...options]
            : options;

        const safeValue = value || '';

        return (
            <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={safeValue}
                    label={label}
                    onChange={e => setValue(e.target.value as UnitType)} // Cast needed
                >
                    {effectiveOptions.map(opt => (
                        <MenuItem
                            key={opt}
                            value={opt}
                            sx={isCustomValue && opt === value
                                ? { fontStyle: 'italic', color: 'warning.main' }
                                : undefined}
                        >
                            {opt === value && isCustomValue ? `${opt} (Legado)` : opt}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };

    const labelProduto =
        activeTab !== 1
            ? 'Cultura/Produto'
            : subtipoManejo === ManejoSubtype.APLICACAO_INSUMO ||
                subtipoManejo === ManejoSubtype.MANEJO_CULTURAL
                ? 'Cultura Alvo'
                : 'Cultura/Produto';

    const labelLocais =
        activeTab !== 1
            ? 'Talhões / Canteiros'
            : subtipoManejo === ManejoSubtype.APLICACAO_INSUMO
                ? 'Locais de aplicação (Talhões/Canteiros)'
                : subtipoManejo === ManejoSubtype.HIGIENIZACAO
                    ? 'Locais / Áreas Higienizadas'
                    : 'Talhões / Canteiros';

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ bgcolor: isEditMode ? '#fff7e6' : '#f5f5f5', pb: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        {isEditMode ? 'EDITAR REGISTRO' : 'NOVO REGISTRO'}
                    </Box>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => !isEditMode && setActiveTab(v)} // Lock tab in edit mode
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<LocalFloristIcon />} label="PLANTIO" iconPosition="start" disabled={isEditMode && activeTab !== 0} />
                        <Tab icon={<ScienceIcon />} label="MANEJO" iconPosition="start" disabled={isEditMode && activeTab !== 1} />
                        <Tab icon={<ContentCutIcon />} label="COLHEITA" iconPosition="start" disabled={isEditMode && activeTab !== 2} />
                        <Tab icon={<InventoryIcon />} label="OUTRO" iconPosition="start" disabled={isEditMode && activeTab !== 3} />
                    </Tabs>
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>

                    {isEditMode && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Você está editando um registro existente. O tipo de atividade não pode ser alterado.
                        </Alert>
                    )}

                    <Stack spacing={3} sx={{ mt: 1 }}>

                        {/* Header: Data/Hora & Produto */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Data e Hora"
                                type="datetime-local"
                                value={dataHora}
                                onChange={e => {
                                    setDataHora(e.target.value);
                                    if (errors.data) setErrors({ ...errors, data: '' });
                                }}
                                sx={{ minWidth: 200 }}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.data}
                                helperText={errors.data}
                            />
                            {!(activeTab === 1 && subtipoManejo === ManejoSubtype.HIGIENIZACAO) && (
                                <TextField
                                    label={labelProduto}
                                    value={produto}
                                    onChange={e => {
                                        setProduto(e.target.value);
                                        if (errors.produto) setErrors({ ...errors, produto: '' });
                                    }}
                                    fullWidth
                                    placeholder="Ex: Alface Americana"
                                    error={!!errors.produto}
                                    helperText={errors.produto}
                                />
                            )}
                        </Stack>

                        {/* Location Selector */}
                        <Box>
                            <Typography variant="caption" color={errors.locais ? "error" : "text.secondary"} sx={{ fontWeight: 'bold' }}>
                                {labelLocais.toUpperCase()} {errors.locais && `(${errors.locais})`}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, p: 1.5,
                                    border: `1px dashed ${errors.locais ? '#d32f2f' : '#ccc'}`,
                                    borderRadius: 2, minHeight: 60,
                                    alignItems: 'center', cursor: 'pointer',
                                    '&:hover': { bgcolor: '#f9f9f9', borderColor: 'primary.main' }
                                }}
                                onClick={() => {
                                    setOpenLocation(true);
                                    if (errors.locais) setErrors({ ...errors, locais: '' });
                                }}
                            >
                                {locais.length === 0 && (
                                    <Typography color={errors.locais ? "error" : "text.secondary"} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AgricultureIcon color={errors.locais ? "error" : "action"} /> Clique para selecionar Talhões ou Canteiros...
                                    </Typography>
                                )}
                                {locais.map(l => (
                                    <Chip key={l} label={l} onDelete={() => setLocais(locais.filter(x => x !== l))} color="primary" variant="outlined" />
                                ))}
                            </Box>
                        </Box>

                        {/* --- TAB: PLANTIO --- */}
                        {activeTab === 0 && (
                            <Stack spacing={2} sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="success.main">DETALHES DO PLANTIO</Typography>
                                <Stack direction="row" spacing={2}>
                                    <FormControl fullWidth error={!!errors.metodo}>
                                        <InputLabel>Método</InputLabel>
                                        <Select
                                            value={metodoPropagacao}
                                            label="Método"
                                            onChange={e => {
                                                setMetodoPropagacao(e.target.value);
                                                if (errors.metodo) setErrors({ ...errors, metodo: '' });
                                            }}
                                        >
                                            <MenuItem value="Muda">Muda (Transplante)</MenuItem>
                                            <MenuItem value="Semente">Semente (Semeadura)</MenuItem>
                                            <MenuItem value="Estaca">Estaca/Bulbo</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Quantidade" type="number" value={qtdPlantio} onChange={e => setQtdPlantio(e.target.value)} fullWidth
                                        InputProps={{ endAdornment: <InputAdornment position="end">{unidadePlantio}</InputAdornment> }}
                                    />
                                    {renderUnitSelect(unidadePlantio, setUnidadePlantio, UNIDADES_PLANTIO)}
                                </Stack>
                            </Stack>
                        )}

                        {/* --- TAB: MANEJO --- */}
                        {activeTab === 1 && (
                            <Stack spacing={2} sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="primary.main">OPERAÇÃO DE MANEJO</Typography>

                                <FormControl fullWidth>
                                    <InputLabel id="subtipo-manejo-label">Tipo de Operação</InputLabel>
                                    <Select
                                        labelId="subtipo-manejo-label"
                                        label="Tipo de Operação"
                                        value={subtipoManejo}
                                        onChange={(e) => setSubtipoManejo(e.target.value as ManejoSubtype)}
                                    >
                                        <MenuItem value={ManejoSubtype.MANEJO_CULTURAL}>Manejo Cultural</MenuItem>
                                        <MenuItem value={ManejoSubtype.APLICACAO_INSUMO}>Aplicação de Insumos</MenuItem>
                                        <MenuItem value={ManejoSubtype.HIGIENIZACAO}>Higienização</MenuItem>
                                    </Select>
                                </FormControl>

                                <Typography variant="caption" sx={{ mt: 1, mb: 1, display: 'block' }}>
                                    Preencha os dados específicos da operação selecionada:
                                </Typography>

                                {/* --- RENDERIZAÇÃO CONDICIONAL POR SUBTIPO --- */}

                                {subtipoManejo === ManejoSubtype.APLICACAO_INSUMO && (
                                    <>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                label="Insumo Utilizado"
                                                value={insumo}
                                                onChange={e => {
                                                    setInsumo(e.target.value);
                                                    if (errors.insumo) setErrors({ ...errors, insumo: '' });
                                                }}
                                                fullWidth
                                                error={!!errors.insumo}
                                                helperText={errors.insumo}
                                            />
                                            <TextField label="Equipamento" value={equipamento} onChange={e => setEquipamento(e.target.value)} fullWidth placeholder="Ex: Pulverizador Costal" />
                                        </Stack>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <TextField
                                                label="Dosagem"
                                                value={dosagem}
                                                onChange={e => {
                                                    setDosagem(e.target.value);
                                                    if (errors.dosagem) setErrors({ ...errors, dosagem: '' });
                                                }}
                                                fullWidth
                                                error={!!errors.dosagem}
                                                helperText={errors.dosagem}
                                            />
                                            {renderUnitSelect(unidadeDosagem, setUnidadeDosagem, UNIDADES_MANEJO)}
                                        </Stack>
                                        {/* Optional legacy field or categorization if valuable */}
                                        <FormControl fullWidth>
                                            <InputLabel>Categoria (Opcional)</InputLabel>
                                            <Select value={tipoManejo} label="Categoria (Opcional)" onChange={e => setTipoManejo(e.target.value)}>
                                                <MenuItem value="Adubação">Adubação</MenuItem>
                                                <MenuItem value="Fitossanitário">Fitossanitário</MenuItem>
                                                <MenuItem value="Irrigação">Irrigação</MenuItem>
                                                <MenuItem value="Outro">Outro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </>
                                )}

                                {subtipoManejo === ManejoSubtype.HIGIENIZACAO && (
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Item Higienizado"
                                            value={itemHigienizado}
                                            onChange={e => {
                                                setItemHigienizado(e.target.value);
                                                if (errors.itemHigienizado) setErrors({ ...errors, itemHigienizado: '' });
                                            }}
                                            fullWidth
                                            placeholder="Ex: Caixas Colheita, Ferramentas"
                                            error={!!errors.itemHigienizado}
                                            helperText={errors.itemHigienizado}
                                        />
                                        <TextField
                                            label="Produto Utilizado"
                                            value={produtoUtilizado}
                                            onChange={e => {
                                                setProdutoUtilizado(e.target.value);
                                                if (errors.produtoUtilizado) setErrors({ ...errors, produtoUtilizado: '' });
                                            }}
                                            fullWidth
                                            placeholder="Ex: Hipoclorito, Detergente neutro"
                                            error={!!errors.produtoUtilizado}
                                            helperText={errors.produtoUtilizado}
                                        />
                                    </Stack>
                                )}

                                {subtipoManejo === ManejoSubtype.MANEJO_CULTURAL && (
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Atividade Realizada"
                                            value={atividadeCultural}
                                            onChange={e => {
                                                setAtividadeCultural(e.target.value);
                                                if (errors.atividadeCultural) setErrors({ ...errors, atividadeCultural: '' });
                                            }}
                                            fullWidth
                                            placeholder="Ex: Capina, Poda, Desbaste"
                                            error={!!errors.atividadeCultural}
                                            helperText={errors.atividadeCultural}
                                        />
                                        <TextField label="Qtd. Trabalhadores" type="number" value={qtdTrabalhadores} onChange={e => setQtdTrabalhadores(e.target.value)} fullWidth />
                                    </Stack>
                                )}

                                <TextField label="Responsável Técnico / Operador" value={responsavel} onChange={e => setResponsavel(e.target.value)} fullWidth />
                            </Stack>
                        )}

                        {/* --- TAB: COLHEITA --- */}
                        {activeTab === 2 && (
                            <Stack spacing={2} sx={{ p: 2, bgcolor: '#fff7ed', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="warning.main">RASTREABILIDADE DA COLHEITA</Typography>
                                <TextField label="LOTE (Auto-Gerado)" value={lote} onChange={e => setLote(e.target.value)} fullWidth />

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Quantidade Colhida"
                                        type="number"
                                        value={qtdColheita}
                                        onChange={e => {
                                            setQtdColheita(e.target.value);
                                            if (errors.qtdColheita) setErrors({ ...errors, qtdColheita: '' });
                                        }}
                                        fullWidth
                                        InputProps={{ endAdornment: <InputAdornment position="end">{unidadeColheita}</InputAdornment> }}
                                        error={!!errors.qtdColheita}
                                        helperText={errors.qtdColheita}
                                    />
                                    {renderUnitSelect(unidadeColheita, setUnidadeColheita, UNIDADES_COLHEITA)}
                                </Stack>

                                <Stack direction="row" spacing={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Destino</InputLabel>
                                        <Select value={destino} label="Destino" onChange={e => setDestino(e.target.value)}>
                                            <MenuItem value="Mercado Interno">Mercado Interno</MenuItem>
                                            <MenuItem value="Exportação">Exportação</MenuItem>
                                            <MenuItem value="Processamento">Processamento</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Classificação</InputLabel>
                                        <Select value={classificacao} label="Classificação" onChange={e => setClassificacao(e.target.value)}>
                                            <MenuItem value="Extra">Extra</MenuItem>
                                            <MenuItem value="Primeira">Primeira</MenuItem>
                                            <MenuItem value="Segunda">Segunda</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Stack>
                        )}

                        {/* Campo de Observação Geral */}
                        <TextField
                            label="Observações Adicionais"
                            multiline rows={2}
                            value={observacao}
                            onChange={e => {
                                setObservacao(e.target.value);
                                if (errors.observacao) setErrors({ ...errors, observacao: '' });
                            }}
                            fullWidth
                            error={!!errors.observacao}
                            helperText={errors.observacao}
                        />

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit">Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleInitialSaveClick}
                        disabled={loading}
                        size="large"
                        color={isEditMode ? "warning" : "primary"}
                    >
                        {isEditMode ? 'Salvar Edição' : 'Salvar Registro'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Justification Modal */}
            <Dialog
                open={openJustification}
                onClose={() => setOpenJustification(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#f59e0b' }}>
                    Motivo da Edição
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Para fins de auditoria, por favor justifique o motivo desta exata alteração.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Justificativa"
                        multiline
                        rows={3}
                        value={justificativa}
                        onChange={e => setJustificativa(e.target.value)}
                        placeholder="Ex: Erro de digitação na quantidade..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenJustification(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={executeSave}
                        disabled={!justificativa.trim() || loading}
                    >
                        Confirmar Edição
                    </Button>
                </DialogActions>
            </Dialog>

            <LocationSelectorDialog
                open={openLocation}
                onClose={() => setOpenLocation(false)}
                onConfirm={setLocais}
                pmoId={pmoId}
            />
        </>
    );
};
export default ManualRecordDialog;
