// src/pages/PmoDetailPage_MUI.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Box, Button, Card, CardContent, CardHeader, CircularProgress,
  Grid, Typography, List, ListItem, ListItemText, Divider, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Subcomponente para exibir um item de detalhe (label + valor)
const DetailItem = ({ label, value, sx }) => (
  <Box sx={sx}>
    <Typography variant="caption" color="text.secondary" component="div">
      {label}
    </Typography>
    <Typography variant="body1" component="div">
      {value || 'Não informado'}
    </Typography>
  </Box>
);

// Subcomponente para exibir uma lista de itens de uma tabela
const DetailTable = ({ title, items, columns }) => (
  <Box mt={2}>
    <Typography variant="subtitle1" gutterBottom>{title}</Typography>
    {items && items.length > 0 ? (
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={item[columns[0].key]}
              secondary={
                columns.slice(1).map(col => `${col.header}: ${item[col.key] || 'N/A'}`).join(' | ')
              }
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary">Nenhum item cadastrado.</Typography>
    )}
  </Box>
);

function PmoDetailPageMUI() {
  const { pmoId } = useParams();
  const navigate = useNavigate();
  const [pmo, setPmo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPmo = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('pmos')
          .select('*')
          .eq('id', pmoId)
          .single();

        if (fetchError) throw fetchError;
        setPmo(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes deste PMO.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPmo();
  }, [pmoId]);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!pmo) {
    return <Typography>Plano de Manejo não encontrado.</Typography>;
  }
  
  const d = pmo.form_data;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">{pmo.nome_identificador}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Voltar ao Painel
          </Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/pmo/${pmoId}/editar`)}>
            Editar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader title="Informações Gerais" />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DetailItem label="Status" value={<Chip label={pmo.status || 'RASCUNHO'} color="primary" />} />
              <DetailItem label="Versão" value={pmo.version} />
              <DetailItem label="Criado em" value={new Date(pmo.created_at).toLocaleString('pt-BR')} />
              <DetailItem label="Produtor" value={d.secao_1_descricao_propriedade?.dados_cadastrais?.nome_produtor} />
              <DetailItem label="CPF" value={d.secao_1_descricao_propriedade?.dados_cadastrais?.cpf} />
              <DetailItem label="Responsável pelo Preenchimento" value={d.secao_1_descricao_propriedade?.dados_cadastrais?.responsavel_preenchimento} />
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardHeader title="Áreas da Propriedade (ha)" />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DetailItem label="Área Orgânica" value={d.secao_1_descricao_propriedade?.area_propriedade?.area_producao_organica_hectares} />
              <DetailItem label="Área em Conversão" value={d.secao_1_descricao_propriedade?.area_propriedade?.area_producao_em_conversao_hectares} />
              <DetailItem label="Área Não-Orgânica" value={d.secao_1_descricao_propriedade?.area_propriedade?.area_producao_nao_organica_hectares} />
              <Divider />
              <DetailItem label="Área Total" value={d.secao_1_descricao_propriedade?.area_propriedade?.area_total_propriedade_hectares} sx={{fontWeight: 'bold'}} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardHeader title="Atividades Produtivas Orgânicas" />
            <CardContent>
              <DetailTable
                title="Produção Vegetal"
                items={d.secao_2_atividades_produtivas_organicas?.producao_primaria_vegetal?.produtos_primaria_vegetal}
                columns={[{ key: 'produto', header: 'Produto' }, { key: 'producao_esperada_ano', header: 'Produção Esperada/Ano' }]}
              />
              <Divider sx={{my:2}}/>
              <DetailTable
                title="Produção Animal"
                items={d.secao_2_atividades_produtivas_organicas?.producao_primaria_animal?.animais_primaria_animal}
                columns={[{ key: 'especie', header: 'Espécie' }, { key: 'n_de_animais', header: 'Nº de Animais' }]}
              />
            </CardContent>
          </Card>
          
           <Card sx={{ mt: 3 }}>
            <CardHeader title="Anexos" />
            <CardContent>
                 <List dense>
                    {(d.secao_18_anexos?.lista_anexos || []).map((anexo, index) => (
                        <ListItem key={index} component="a" href={anexo.url_arquivo} target="_blank" rel="noopener noreferrer" button>
                            <ListItemText primary={anexo.nome_documento} secondary={anexo.url_arquivo}/>
                        </ListItem>
                    ))}
                    {(!d.secao_18_anexos?.lista_anexos || d.secao_18_anexos.lista_anexos.length === 0) && (
                        <Typography variant="body2" color="text.secondary">Nenhum anexo encontrado.</Typography>
                    )}
                 </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PmoDetailPageMUI;