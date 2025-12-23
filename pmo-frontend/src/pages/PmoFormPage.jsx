import React, { useState, useEffect, useMemo, useCallback } from 'react';
// ADICIONADO: useLocation para ler a URL
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { initialFormData } from '../utils/formData';
import { deepMerge } from '../utils/deepMerge';
import * as validations from '../validation/pmoValidation';
import { localDb } from '../utils/db';

import { 
    Box, Typography, Alert, TextField, useTheme, useMediaQuery, MobileStepper,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
    Paper, Snackbar 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Componentes do Formulário
import DesktopStepperMUI from '../components/PmoForm/DesktopStepper_MUI.jsx';
import StepperNavigationMUI from '../components/PmoForm/StepperNavigation_MUI.jsx';
import MobileBottomNav from '../components/PmoForm/MobileBottomNav.jsx';
import SectionsModal from '../components/PmoForm/SectionsModal.jsx';

// Importação do Caderno de Campo
import DiarioDeCampo from '../components/DiarioDeCampo';

// Seções do PMO
import Secao1MUI from '../components/PmoForm/Secao1_MUI.jsx';
import Secao2MUI from '../components/PmoForm/Secao2_MUI.jsx';
import Secao3MUI from '../components/PmoForm/Secao3_MUI.jsx';
import Secao4MUI from '../components/PmoForm/Secao4_MUI.jsx';
import Secao5MUI from '../components/PmoForm/Secao5_MUI.jsx';
import Secao6MUI from '../components/PmoForm/Secao6_MUI.jsx';
import Secao7MUI from '../components/PmoForm/Secao7_MUI.jsx';
import Secao8MUI from '../components/PmoForm/Secao8_MUI.jsx';
import Secao9MUI from '../components/PmoForm/Secao9_MUI.jsx';
import Secao10MUI from '../components/PmoForm/Secao10_MUI.jsx';
import Secao11MUI from '../components/PmoForm/Secao11_MUI.jsx';
import Secao12MUI from '../components/PmoForm/Secao12_MUI.jsx';
import Secao13MUI from '../components/PmoForm/Secao13_MUI.jsx';
import Secao14MUI from '../components/PmoForm/Secao14_MUI.jsx';
import Secao15MUI from '../components/PmoForm/Secao15_MUI.jsx';
import Secao16MUI from '../components/PmoForm/Secao16_MUI.jsx';
import Secao17MUI from '../components/PmoForm/Secao17_MUI.jsx';
import Secao18MUI from '../components/PmoForm/Secao18_MUI.jsx';

const cleanFormDataForSubmission = (data) => {
    const cleanedData = deepMerge({}, data);
    const parseToFloatOrNull = (value) => {
        if (value === '' || value === null || value === undefined) return null;
        const num = parseFloat(String(value).replace(',', '.'));
        return isNaN(num) ? null : num;
    };
    const parseToIntOrNull = (value) => {
        if (value === '' || value === null || value === undefined) return null;
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
    };
    const isRowEmpty = (row) => {
        if (!row || typeof row !== 'object') return true;
        return Object.values(row).every(value => value === null || value === undefined || value === '');
    };
    const processSectionTables = (sectionData, tableConfigs) => {
        if (!sectionData) return;
        for (const config of tableConfigs) {
            const { path, conversions } = config;
            let parent = sectionData;
            for (let i = 0; i < path.length - 1; i++) {
                parent = parent?.[path[i]];
            }
            if (parent) {
                const arrayKey = path[path.length - 1];
                let items = parent[arrayKey];
                if (items && Array.isArray(items)) {
                    let filteredItems = items.filter(item => !isRowEmpty(item));
                    filteredItems.forEach(item => {
                        if (conversions) {
                            conversions.forEach(conv => {
                                if (item.hasOwnProperty(conv.field)) {
                                    item[conv.field] = conv.parser(item[conv.field]);
                                }
                            });
                        }
                    });
                    parent[arrayKey] = filteredItems;
                }
            }
        }
    };
    processSectionTables(cleanedData.secao_2_atividades_produtivas_organicas, [{ path: ['producao_primaria_vegetal', 'produtos_primaria_vegetal'], conversions: [{ field: 'area_plantada', parser: parseToFloatOrNull }, { field: 'producao_esperada_ano', parser: parseToFloatOrNull }] }, { path: ['producao_primaria_animal', 'animais_primaria_animal'], conversions: [{ field: 'n_de_animais', parser: parseToIntOrNull }, { field: 'area_externa', parser: parseToFloatOrNull }, { field: 'area_interna_instalacoes', parser: parseToFloatOrNull }, { field: 'media_de_peso_vivo', parser: parseToFloatOrNull }] }, { path: ['processamento_produtos_origem_vegetal', 'produtos_processamento_vegetal'], conversions: [] }, { path: ['processamento_produtos_origem_animal', 'produtos_processamento_animal'], conversions: [] }]);
    processSectionTables(cleanedData.secao_3_atividades_produtivas_nao_organicas, [{ path: ['producao_primaria_vegetal_nao_organica', 'produtos_primaria_vegetal_nao_organica'], conversions: [{ field: 'area_plantada', parser: parseToFloatOrNull }, { field: 'producao_esperada_ano', parser: parseToFloatOrNull }] }, { path: ['producao_primaria_animal_nao_organica', 'animais_primaria_animal_nao_organica'], conversions: [{ field: 'n_de_animais', parser: parseToIntOrNull }, { field: 'area_externa', parser: parseToFloatOrNull }, { field: 'area_interna_instalacoes', parser: parseToFloatOrNull }, { field: 'media_de_peso_vivo', parser: parseToFloatOrNull }] }, { path: ['processamento_produtos_origem_vegetal_nao_organico', 'produtos_processamento_vegetal_nao_organico'], conversions: [] }, { path: ['processamento_produtos_origem_animal_nao_organico', 'produtos_processamento_animal_nao_organico'], conversions: [] }]);
    processSectionTables(cleanedData.secao_4_animais_servico_subsistencia_companhia, [{ path: ['animais_servico', 'lista_animais_servico'], conversions: [{ field: 'quantidade', parser: parseToIntOrNull }] }, { path: ['animais_subsistencia_companhia_ornamentais', 'lista_animais_subsistencia'], conversions: [{ field: 'quantidade', parser: parseToIntOrNull }] }]);
    const secao4Data = cleanedData.secao_4_animais_servico_subsistencia_companhia;
    if (secao4Data && !secao4Data.ha_animais_servico_subsistencia_companhia?.ha_animais_servico_subsistencia_companhia) {
        delete secao4Data.animais_servico;
        delete secao4Data.animais_subsistencia_companhia_ornamentais;
    }
    const secao5Data = cleanedData.secao_5_producao_terceirizada;
    if (secao5Data?.produtos_terceirizados) {
        let items = secao5Data.produtos_terceirizados;
        const isSecao5RowEmpty = (row) => !row.fornecedor && !row.localidade && !row.produto && !row.quantidade_ano;
        items = items.filter(item => !isRowEmpty(item));
        items.forEach(item => {
            item.quantidade_ano = parseToFloatOrNull(item.quantidade_ano);
            if (item.processamento !== true && item.processamento !== false) {
                item.processamento = null;
            }
        });
        secao5Data.produtos_terceirizados = items;
    }
    const avaliacao = cleanedData.secao_avaliacao_plano_manejo;
    if (avaliacao) {
        if (avaliacao.espaco_oac && (avaliacao.espaco_oac.data_recebimento_plano_manejo === '' || avaliacao.espaco_oac.data_recebimento_plano_manejo === 'null')) {
            avaliacao.espaco_oac.data_recebimento_plano_manejo = null;
        }
        if (avaliacao.status_documento && (avaliacao.status_documento.data_analise === '' || avaliacao.status_documento.data_analise === 'null')) {
            avaliacao.status_documento.data_analise = null;
        }
    }
    return cleanedData;
};

function PmoFormPage() {
    const navigate = useNavigate();
    const { pmoId } = useParams();
    // 1. INICIALIZA LOCATION
    const location = useLocation();

    const [isEditMode, setIsEditMode] = useState(false);
    const [editablePmoId, setEditablePmoId] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [nomeIdentificador, setNomeIdentificador] = useState('');
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [sectionStatus, setSectionStatus] = useState({});
    const [saveStatus, setSaveStatus] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [isSectionsModalOpen, setSectionsModalOpen] = useState(false);
    const [isConfirmExitOpen, setConfirmExitOpen] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const formSections = useMemo(() => [
        { id: 1, key: 'secao_1_descricao_propriedade', Component: Secao1MUI, validate: validations.validateSecao1, label: 'Propriedade' },
        { id: 2, key: 'secao_2_atividades_produtivas_organicas', Component: Secao2MUI, validate: validations.validateSecao2, label: 'Atividades Orgânicas' },
        { id: 3, key: 'secao_3_atividades_produtivas_nao_organicas', Component: Secao3MUI, validate: validations.validateSecao3, label: 'Atividades Não-Orgânicas' },
        { id: 4, key: 'secao_4_animais_servico_subsistencia_companhia', Component: Secao4MUI, validate: validations.validateSecao4, label: 'Outros Animais' },
        { id: 5, key: 'secao_5_producao_terceirizada', Component: Secao5MUI, validate: validations.validateSecao5, label: 'Terceiros' },
        { id: 6, key: 'secao_6_aspectos_ambientais', Component: Secao6MUI, validate: validations.validateSecao6, label: 'Ambiental' },
        { id: 7, key: 'secao_7_aspectos_sociais', Component: Secao7MUI, validate: validations.validateSecao7, label: 'Social' },
        { id: 8, key: 'secao_8_insumos_equipamentos', Component: Secao8MUI, validate: validations.validateSecao8, label: 'Insumos' },
        { id: 9, key: 'secao_9_propagacao_vegetal', Component: Secao9MUI, validate: validations.validateSecao9, label: 'Propagação' },
        { id: 10, key: 'secao_10_fitossanidade', Component: Secao10MUI, validate: validations.validateSecao10, label: 'Fitossanidade' },
        { id: 11, key: 'secao_11_colheita', Component: Secao11MUI, validate: validations.validateSecao11, label: 'Colheita' },
        { id: 12, key: 'secao_12_pos_colheita', Component: Secao12MUI, validate: validations.validateSecao12, label: 'Pós-Colheita' },
        { id: 13, key: 'secao_13_producao_animal', Component: Secao13MUI, validate: validations.validateSecao13, label: 'Produção Animal' },
        { id: 14, key: 'secao_14_comercializacao', Component: Secao14MUI, validate: validations.validateSecao14, label: 'Comércio' },
        { id: 15, key: 'secao_15_rastreabilidade', Component: Secao15MUI, validate: validations.validateSecao15, label: 'Rastreio' },
        { id: 16, key: 'secao_16_sac', Component: Secao16MUI, validate: validations.validateSecao16, label: 'SAC' },
        { id: 17, key: 'secao_17_opiniao', Component: Secao17MUI, validate: validations.validateSecao17, label: 'Opinião' },
        { id: 18, key: 'secao_18_anexos', Component: Secao18MUI, validate: validations.validateSecao18, label: 'Anexos' },
        // Seção 19: Caderno de Campo
        { id: 19, key: 'caderno_de_campo', Component: DiarioDeCampo, validate: () => true, label: 'Caderno de Campo' }
    ], []);

    const totalSteps = formSections.length;

    // 2. EFEITO MÁGICO: Verifica se deve pular para o Caderno
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('aba') === 'caderno') {
            setCurrentStep(19);
        }
    }, [location.search]);

    const syncOfflineData = useCallback(async () => {
        if (!navigator.onLine) return;
        const pendingUpdates = await localDb.getAll();
        if (pendingUpdates.length === 0) return;

        setSaveStatus(`Sincronizando ${pendingUpdates.length} plano(s)...`);
        setIsLoading(true);

        for (const update of pendingUpdates) {
            try {
                const { id, ...supabasePayload } = update;
                if (id.toString().startsWith('offline_')) {
                    const { error } = await supabase.from('pmos').insert(supabasePayload);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('pmos').update(supabasePayload).eq('id', id);
                    if (error) throw error;
                }
                await localDb.delete(id);
            } catch (err) {
                console.error(`Falha ao sincronizar o PMO ${update.id}:`, err);
            }
        }
        
        setIsLoading(false);
        setSaveStatus(`Sincronização concluída!`);
        setTimeout(() => setSaveStatus(''), 5000);
        if (pmoId) navigate(0);
    }, [pmoId, navigate]);

    useEffect(() => {
        window.addEventListener('online', syncOfflineData);
        return () => window.removeEventListener('online', syncOfflineData);
    }, [syncOfflineData]);

    useEffect(() => {
        setIsLoading(true);
        if (pmoId) {
            setIsEditMode(true);
            setEditablePmoId(pmoId);
        } else {
            setIsEditMode(false);
            setEditablePmoId(null);
            setFormData(initialFormData);
            setNomeIdentificador('');
            setIsLoading(false);
        }
    }, [pmoId]);

    useEffect(() => {
        const fetchPmoData = async () => {
            if (editablePmoId) {
                await syncOfflineData();
                try {
                    const offlineData = await localDb.get(editablePmoId);
                    if (offlineData) {
                        setFormData(deepMerge(initialFormData, offlineData.form_data));
                        setNomeIdentificador(offlineData.nome_identificador);
                    } else {
                        const { data, error } = await supabase.from('pmos').select('*').eq('id', editablePmoId).single();
                        if (error) throw error;
                        if (data) {
                            setFormData(deepMerge(initialFormData, data.form_data));
                            setNomeIdentificador(data.nome_identificador);
                        } else {
                            setErrors({ global: `Plano de Manejo com ID ${editablePmoId} não encontrado.` });
                            setTimeout(() => navigate('/'), 3000);
                        }
                    }
                } catch (err) {
                    setErrors({ global: 'Não foi possível carregar os dados do plano.' });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPmoData();
    }, [editablePmoId, syncOfflineData, navigate]);

    const handleSave = async (statusFinal = 'RASCUNHO') => {
        if (!nomeIdentificador) {
            setErrors({ global: 'O "Nome de Identificação do Plano" é obrigatório.' });
            return;
        }

        const cleanedData = cleanFormDataForSubmission(formData);
        const pmoIdToSave = editablePmoId || `offline_${Date.now()}`;
        
        if (!editablePmoId && !navigator.onLine) {
            setEditablePmoId(pmoIdToSave);
        }

        const payload = { id: pmoIdToSave, nome_identificador: nomeIdentificador, form_data: cleanedData, status: statusFinal };

        if (navigator.onLine) {
            setIsLoading(true);
            setSaveStatus('Salvando na nuvem...');
            try {
                const { id, ...supabasePayload } = payload;
                let result;
                if (isEditMode && editablePmoId && !String(editablePmoId).startsWith('offline_')) {
                    result = await supabase.from('pmos').update(supabasePayload).eq('id', editablePmoId).select();
                } else {
                    result = await supabase.from('pmos').insert(supabasePayload).select();
                    if (result.data?.[0]) {
                        const newPmoId = result.data[0].id;
                        if (String(id).startsWith('offline_')) {
                            await localDb.delete(id);
                        }
                        navigate(`/pmo/${newPmoId}/editar`, { replace: true });
                        setEditablePmoId(newPmoId);
                        setIsEditMode(true);
                    }
                }
                if (result.error) throw result.error;
                setSaveStatus(statusFinal === 'RASCUNHO' ? 'Rascunho salvo!' : 'Plano finalizado!');
                setIsDirty(false);
                if (statusFinal !== 'RASCUNHO') setTimeout(() => navigate('/'), 2000);
            } catch (err) {
                setSaveStatus('Falha na nuvem. Salvando localmente...');
                await localDb.set(payload);
                setErrors({ global: `Falha na conexão. Dados salvos offline. (${err.message})` });
            } finally {
                setIsLoading(false);
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } else {
            setSaveStatus('Você está offline. Salvando localmente...');
            try {
                await localDb.set(payload);
                setIsDirty(false);
                setSaveStatus('Salvo localmente! Será sincronizado quando houver conexão.');
            } catch (err) {
                setErrors({ global: `Não foi possível salvar localmente. (${err.message})` });
            } finally {
                setTimeout(() => setSaveStatus(''), 3000);
            }
        }
    };

    const goToStep = (step) => {
        if (step >= 1 && step <= totalSteps) setCurrentStep(step);
    };

    const nextStep = () => goToStep(currentStep + 1);
    const prevStep = () => goToStep(currentStep - 1);

    const handleSectionChange = useCallback((sectionKey, newData) => {
        setFormData(prevData => ({ ...prevData, [sectionKey]: newData }));
        setIsDirty(true);
    }, []);

    const handleAttemptExit = () => {
        if (isDirty) {
            setConfirmExitOpen(true);
        } else {
            navigate('/');
        }
    };

    const handleCancelExit = () => setConfirmExitOpen(false);
        
    const currentSectionConfig = formSections.find(sec => sec.id === currentStep);

    if (isLoading) return <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><Typography>Carregando...</Typography></Box>;

    return (
        <Box 
            key={editablePmoId || 'new-pmo'}
            sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 1, sm: 2, md: 3 }, pb: { xs: '80px', md: 3 } }}
        >
            <Button type="button" variant="text" startIcon={<ArrowBackIcon />} onClick={handleAttemptExit} sx={{ mb: 2, p: 1 }}>
                Voltar ao Painel
            </Button>

            <Typography variant="h4" gutterBottom>
                {isEditMode ? `Editando: ${nomeIdentificador || ''}` : 'Novo Plano de Manejo Orgânico'}
            </Typography>

            <TextField
                required
                fullWidth
                label="Nome de Identificação do Plano"
                value={nomeIdentificador}
                onChange={(e) => {
                    setNomeIdentificador(e.target.value);
                    setIsDirty(true);
                }}
                sx={{ mb: 4 }}
                variant="outlined"
                helperText="Dê um nome ao seu plano para facilitar a identificação (ex: Sítio São José 2025)."
            />

            <Box sx={{ width: '100%', mb: 4 }}>
                {isMobile ? (
                    <Paper sx={{ position: 'sticky', top: 0, zIndex: 100 }} elevation={2}>
                        <MobileStepper
                            variant="progress"
                            steps={totalSteps}
                            position="static"
                            activeStep={currentStep - 1}
                            sx={{ bgcolor: 'background.paper', flexGrow: 1, '.MuiMobileStepper-progress': { width: '100%' } }}
                        />
                    </Paper>
                ) : (
                    <DesktopStepperMUI
                        sections={formSections}
                        currentStep={currentStep}
                        goToStep={goToStep}
                        sectionStatus={sectionStatus}
                    />
                )}
            </Box>

            <div>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSave('CONCLUÍDO'); }}
                >
                    {currentSectionConfig && (
                        <currentSectionConfig.Component 
                            key={currentSectionConfig.key} 
                            data={formData[currentSectionConfig.key]} 
                            formData={formData} 
                            onSectionChange={(newData) => handleSectionChange(currentSectionConfig.key, newData)} 
                            errors={errors[currentSectionConfig.key]}
                            pmoId={editablePmoId} // Passando ID para o Caderno
                        />
                    )}
                    
                    {errors.global && <Alert severity="error" sx={{ mt: 2 }}>{errors.global}</Alert>}
                    
                    {!isMobile && (
                        <StepperNavigationMUI
                            currentStep={currentStep} totalSteps={totalSteps} isLoading={isLoading} saveStatus={saveStatus}
                            onPrev={prevStep} onSaveDraft={() => handleSave('RASCUNHO')} onNext={nextStep}
                            onFinalSubmit={() => handleSave('CONCLUÍDO')} onGoToStart={handleAttemptExit}
                        />
                    )}
                </form>
            </div>

            {isMobile && (
                <MobileBottomNav
                    onNext={nextStep}
                    onPrev={prevStep}
                    onSaveDraft={() => handleSave('RASCUNHO')}
                    onGoToSections={() => setSectionsModalOpen(true)}
                    isNextDisabled={isLoading || currentStep === totalSteps}
                    isPrevDisabled={isLoading || currentStep === 1}
                />
            )}

            <SectionsModal
                open={isSectionsModalOpen}
                onClose={() => setSectionsModalOpen(false)}
                sections={formSections}
                currentStep={currentStep}
                onNavigate={(step) => {
                    goToStep(step);
                    setSectionsModalOpen(false);
                }}
                sectionStatus={sectionStatus}
            />

            <Dialog open={isConfirmExitOpen} onClose={handleCancelExit}>
                <DialogTitle>Sair da Edição?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você tem alterações não salvas. Deseja salvá-las como rascunho antes de sair?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelExit}>Cancelar</Button>
                    <Button onClick={() => { setConfirmExitOpen(false); navigate('/'); }} color="error">Sair sem Salvar</Button>
                    <Button onClick={() => { handleSave('RASCUNHO'); setConfirmExitOpen(false); navigate('/'); }} color="primary" autoFocus>Salvar e Sair</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!saveStatus}
                autoHideDuration={4000}
                onClose={() => setSaveStatus('')}
                message={saveStatus}
            />
        </Box>
    );
}

export default PmoFormPage;