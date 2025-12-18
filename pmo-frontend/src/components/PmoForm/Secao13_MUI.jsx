// src/components/PmoForm/Secao13_MUI.jsx (Com a tabela 13.6 responsiva)

import React from 'react';
// <<< 1. IMPORTS ATUALIZADOS PARA INCLUIR OS HOOKS DE RESPONSIVIDADE E O GRID >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, TextField, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton,
  useTheme, useMediaQuery, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckboxGroupMUI from './CheckboxGroup_MUI';
import TabelaDinamicaMUI from './TabelaDinamica_MUI';

// Subcomponente: Tabela de Nutrição Animal (13.5) - Sem alterações
const TabelaNutricaoAnimalMUI = ({ data, onDataChange }) => {
    const safeData = Array.isArray(data) ? data : [];
    const handleItemChange = (index, field, value) => {
      const newData = [...safeData];
      newData[index][field] = value;
      onDataChange(newData);
    };
    const adicionarItem = () => onDataChange([...safeData, { animal: '', identificacao_ingrediente: '', origem_transgenica: null, descricao: '', procedencia: '', frequencia: '', quantidade: '' }]);
    const removerItem = (index) => onDataChange(safeData.filter((_, i) => i !== index));
  
    return (
      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>*Em caso de alimentação externa, informe se provém de sistema orgânico.</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Animal</TableCell>
                <TableCell>Ingrediente/Composição</TableCell>
                <TableCell>Origem Transgênica?</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Procedência</TableCell>
                <TableCell>Frequência</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell align="center">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {safeData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell><TextField variant="standard" fullWidth value={item.animal || ''} onChange={(e) => handleItemChange(index, 'animal', e.target.value)} /></TableCell>
                  <TableCell><TextField variant="standard" fullWidth value={item.identificacao_ingrediente || ''} onChange={(e) => handleItemChange(index, 'identificacao_ingrediente', e.target.value)} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                      <Radio checked={item.origem_transgenica === true} onChange={() => handleItemChange(index, 'origem_transgenica', true)} name={`trans-${index}`} size="small"/> Sim
                      <Radio checked={item.origem_transgenica === false} onChange={() => handleItemChange(index, 'origem_transgenica', false)} name={`trans-${index}`} size="small"/> Não
                    </Box>
                  </TableCell>
                  <TableCell><TextField variant="standard" fullWidth value={item.descricao || ''} onChange={(e) => handleItemChange(index, 'descricao', e.target.value)} /></TableCell>
                  <TableCell><TextField variant="standard" fullWidth value={item.procedencia || ''} onChange={(e) => handleItemChange(index, 'procedencia', e.target.value)} /></TableCell>
                  <TableCell><TextField variant="standard" fullWidth value={item.frequencia || ''} onChange={(e) => handleItemChange(index, 'frequencia', e.target.value)} /></TableCell>
                  <TableCell><TextField variant="standard" fullWidth value={item.quantidade || ''} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} /></TableCell>
                  <TableCell align="center"><IconButton onClick={() => removerItem(index)} color="error"><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button startIcon={<AddCircleOutlineIcon />} onClick={adicionarItem} sx={{ mt: 2 }}>Adicionar Nutrição</Button>
      </Box>
    );
};

// <<< 2. CÓDIGO DO SUBCOMPONENTE 13.6 ATUALIZADO PARA SER RESPONSIVO >>>
const PlanoAnualAlimentacaoMUI = ({ data, onDataChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const safeData = Array.isArray(data) ? data : [];

    const handleItemChange = (index, field, value) => {
        const newData = [...safeData];
        newData[index][field] = value;
        onDataChange(newData);
    };
    const adicionarAlimento = () => onDataChange([...safeData, { alimento: '', Jan: false, Fev: false, Mar: false, Abr: false, Mai: false, Jun: false, Jul: false, Ago: false, Set: false, Out: false, Nov: false, Dez: false }]);
    const removerAlimento = (index) => onDataChange(safeData.filter((_, i) => i !== index));

    // Layout para Mobile
    const MobileLayout = () => (
        <Box>
            {safeData.map((item, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <TextField
                        label="Alimento"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={item.alimento || ''}
                        onChange={(e) => handleItemChange(index, 'alimento', e.target.value)}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        Marque os meses de fornecimento:
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        {meses.map(mes => (
                            <Grid size={{ xs: 4 }} key={mes}>
                                <FormControlLabel
                                    control={<Checkbox checked={item[mes] || false} onChange={(e) => handleItemChange(index, mes, e.target.checked)} />}
                                    label={mes}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <IconButton
                        onClick={() => removerAlimento(index)}
                        color="error"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Paper>
            ))}
        </Box>
    );

    // Layout para Desktop
    const DesktopLayout = () => (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Alimento</TableCell>
                        {meses.map(mes => <TableCell key={mes} align="center" sx={{ fontWeight: 'bold' }}>{mes}</TableCell>)}
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {safeData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell><TextField variant="standard" fullWidth value={item.alimento || ''} onChange={(e) => handleItemChange(index, 'alimento', e.target.value)} /></TableCell>
                            {meses.map(mes => (
                                <TableCell key={mes} align="center">
                                    <Checkbox checked={item[mes] || false} onChange={(e) => handleItemChange(index, mes, e.target.checked)} />
                                </TableCell>
                            ))}
                            <TableCell align="center"><IconButton onClick={() => removerAlimento(index)} color="error"><DeleteIcon /></IconButton></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box>
            {isMobile ? <MobileLayout /> : <DesktopLayout />}
            <Button startIcon={<AddCircleOutlineIcon />} onClick={adicionarAlimento} sx={{ mt: 2 }}>
                Adicionar Alimento
            </Button>
        </Box>
    );
};


// Componente Principal da Seção 13
function Secao13MUI({ data, onSectionChange }) {
    const safeData = data || {};

    const handleChange = (e) => onSectionChange({ ...safeData, [e.target.name]: e.target.value });
    const handleCheckboxChange = (fieldName, newValue) => onSectionChange({ ...safeData, [fieldName]: newValue });
    const handleNestedChange = (e) => onSectionChange({ ...safeData, [e.target.name]: { [e.target.name]: e.target.value } });
    const handleManejoSanitarioChange = (e) => onSectionChange({ ...safeData, manejo_sanitario_animal: { ...safeData.manejo_sanitario_animal, [e.target.name]: { [e.target.name]: e.target.value } } });

    const colunasEvolucaoPlantel = [ { header: 'Tipo de animal', key: 'tipo_animal' }, { header: 'Nº atual', key: 'numero_atual', type: 'number' }, { header: 'Em 1 ano', key: 'em_1_ano', type: 'number' }, { header: 'Em 3 anos', key: 'em_3_anos', type: 'number' }, { header: 'Em 5 anos', key: 'em_5_anos', type: 'number' }];
    const colunasTratamentoAnimais = [ { header: 'Animal/Lote', key: 'animal_lote'}, { header: 'Diagnóstico', key: 'diagnostico'}, { header: 'Tratamento', key: 'tratamento'}, { header: 'Período de Carência', key: 'periodo_carencia'}];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
                Seção 13: Produção Animal
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>Preencha abaixo se houver produção primária animal.</Typography>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.1. Técnicas para melhoria de pastos</Typography></AccordionSummary>
                <AccordionDetails>
                    <CheckboxGroupMUI options={['Pastejo rotacionado', 'Consorciação de pastagens', 'Rotação de culturas', 'Adubação orgânica', 'Uso de quebra-vento', 'Plantio de árvores nativas e/ou frutíferas', 'Integração lavoura/pecuária/floresta', 'Outros - citar:']} selectedString={safeData.tecnicas_melhoria_pastos} onSelectionChange={(newValue) => handleCheckboxChange('tecnicas_melhoria_pastos', newValue)} otherOption="Outros - citar:" otherValue={safeData.tecnicas_melhoria_pastos_outros} onOtherChange={handleChange} otherName="tecnicas_melhoria_pastos_outros" />
                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.2. Como realiza a reprodução?</Typography></AccordionSummary>
                <AccordionDetails>
                    <CheckboxGroupMUI options={['Compra animais de fora para reposição de matrizes', 'Reproduz os próprios animais pela monta natural', 'Reproduz os animais por métodos artificiais.', 'Outros - citar:']} selectedString={safeData.reproducao_animais} onSelectionChange={(newValue) => handleCheckboxChange('reproducao_animais', newValue)} otherOption="Outros - citar:" otherValue={safeData.reproducao_animais_outros} onOtherChange={handleChange} otherName="reproducao_animais_outros" />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.3. Aquisição de animais</Typography></AccordionSummary>
                <AccordionDetails>
                    <CheckboxGroupMUI title="13.3.1. Sistema de produção de origem" options={['Sistema orgânico', 'Sistema não orgânico']} selectedString={safeData.aquisicao_animais?.sistema_producao_aquisicao} onSelectionChange={(newValue) => onSectionChange({ ...safeData, aquisicao_animais: { ...safeData.aquisicao_animais, sistema_producao_aquisicao: newValue } })}/>
                    <TextField sx={{mt:2}} label="13.3.2. Especifique espécie, finalidade e idade dos animais adquiridos" name="especificacao_aquisicao_animais" fullWidth multiline rows={3} value={safeData.aquisicao_animais?.especificacao_aquisicao_animais?.especificacao_aquisicao_animais || ''} onChange={(e) => onSectionChange({ ...safeData, aquisicao_animais: { ...safeData.aquisicao_animais, especificacao_aquisicao_animais: { especificacao_aquisicao_animais: e.target.value } } })}/>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.4. Evolução do plantel</Typography></AccordionSummary>
                <AccordionDetails>
                    <TabelaDinamicaMUI title="" columns={colunasEvolucaoPlantel} data={safeData.evolucao_plantel} onDataChange={(newData) => onSectionChange({ ...safeData, evolucao_plantel: newData })} itemName="Tipo de Animal" />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.5. Como você faz a nutrição animal?</Typography></AccordionSummary>
                <AccordionDetails>
                    <TabelaNutricaoAnimalMUI data={safeData.nutricao_animal} onDataChange={(newData) => onSectionChange({ ...safeData, nutricao_animal: newData })} />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.6. Existe um plano anual de alimentação animal?</Typography></AccordionSummary>
                <AccordionDetails>
                    <PlanoAnualAlimentacaoMUI data={safeData.plano_anual_alimentacao_animal} onDataChange={(newData) => onSectionChange({ ...safeData, plano_anual_alimentacao_animal: newData })} />
                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.7. Como é feita a alimentação de mamíferos jovens?</Typography></AccordionSummary>
                <AccordionDetails>
                    <TextField name="alimentacao_mamiferos_jovens" fullWidth multiline rows={3} value={safeData.alimentacao_mamiferos_jovens?.alimentacao_mamiferos_jovens || ''} onChange={handleNestedChange} />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.8. Como promove o bem-estar dos animais?</Typography></AccordionSummary>
                <AccordionDetails>
                    <CheckboxGroupMUI options={['Manejo adequado e tranquilo', 'Água de boa qualidade', 'Alimento farto e de boa qualidade', 'Instalações adequadas e confortáveis', 'Lotação adequada', 'Áreas de sombreamento no pasto', 'Acesso diário dos animais confinados a área com sol e pastagem', 'Promove o isolamento dos animais doentes e em tratamento', 'Nutrição adequada', 'Tratamento e suporte adequados aos animais doentes', 'Sombreamento artificial em áreas de lavoura como opção de pastoreio', 'Manejo adequado da “cama”', 'Outras formas:']} selectedString={safeData.bem_estar_animais} onSelectionChange={(newValue) => handleCheckboxChange('bem_estar_animais', newValue)} otherOption="Manejo adequado da “cama”" otherValue={safeData.bem_estar_animais_manejo_cama} onOtherChange={handleChange} otherName="bem_estar_animis_manejo_cama" otherPlaceholder="Material da cama e espécie utilizada." />
                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>13.9. Manejo sanitário animal</Typography></AccordionSummary>
                <AccordionDetails>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField label="13.9.1. O que é feito para a promoção da saúde animal?" name="promocao_saude_animal" fullWidth multiline rows={3} value={safeData.manejo_sanitario_animal?.promocao_saude_animal?.promocao_saude_animal || ''} onChange={handleManejoSanitarioChange} />
                        <TextField label="13.9.2. Como é feito o controle de vermes e parasitas?" name="controle_vermes_parasitas" fullWidth multiline rows={3} value={safeData.manejo_sanitario_animal?.controle_vermes_parasitas?.controle_vermes_parasitas || ''} onChange={handleManejoSanitarioChange} />
                        <TabelaDinamicaMUI title="13.9.3. Descreva os tratamentos realizados em animais doentes." columns={colunasTratamentoAnimais} data={safeData.manejo_sanitario_animal?.tratamento_animais_doentes} onDataChange={(newData) => onSectionChange({ ...safeData, manejo_sanitario_animal: {...safeData.manejo_sanitario_animal, tratamento_animais_doentes: newData}})} itemName="Tratamento" itemNoun="o" />
                        <TextField label="13.9.4. Como é feita a castração dos animais?" name="castracao_animais" fullWidth multiline rows={3} value={safeData.manejo_sanitario_animal?.castracao_animais?.castracao_animais || ''} onChange={handleManejoSanitarioChange} />
                        <TextField label="13.9.5. Como é feito o corte de pontas de chifres, o mochamento e as marcações?" name="corte_chifres_mochamento_marcacoes" fullWidth multiline rows={3} value={safeData.manejo_sanitario_animal?.corte_chifres_mochamento_marcacoes?.corte_chifres_mochamento_marcacoes || ''} onChange={handleManejoSanitarioChange} />
                        <TextField label="13.9.6. Como é feita a vacinação dos animais?" name="vacinacao_animais" fullWidth multiline rows={3} value={safeData.manejo_sanitario_animal?.vacinacao_animais?.vacinacao_animais || ''} onChange={handleManejoSanitarioChange} />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default Secao13MUI;