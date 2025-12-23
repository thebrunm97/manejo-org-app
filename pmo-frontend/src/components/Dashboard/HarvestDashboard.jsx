import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Box, Grid, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, 
  Card, CardContent, Alert 
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScaleIcon from '@mui/icons-material/Scale';

const HarvestDashboard = ({ pmoId }) => {
  const [loading, setLoading] = useState(false);
  const [colheitas, setColheitas] = useState([]);
  const [resumo, setResumo] = useState({});
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (pmoId) {
      fetchColheitas();
    } else {
      setColheitas([]);
      setResumo({});
    }
  }, [pmoId]);

  const fetchColheitas = async () => {
    try {
      setLoading(true);
      setErro(null);
      
      const { data, error } = await supabase
        .from('caderno_campo')
        .select('*')
        .eq('tipo_atividade', 'Colheita')
        .eq('pmo_id', pmoId) 
        .neq('tipo_atividade', 'CANCELADO') // Exclui cancelados aqui também
        .order('data_registro', { ascending: false });

      if (error) throw error;

      setColheitas(data || []);
      calcularResumo(data || []);
    } catch (error) {
      console.error('Erro ao buscar colheitas:', error);
      setErro('Não foi possível carregar os dados de produção.');
      setColheitas([]); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = (dados) => {
    const totalPorProduto = (dados || []).reduce((acc, item) => {
      const prod = item.produto || 'NÃO IDENTIFICADO';
      const qtd = parseFloat(item.quantidade_valor || 0);
      
      if (!acc[prod]) acc[prod] = { total: 0, unidade: item.quantidade_unidade };
      acc[prod].total += qtd;
      return acc;
    }, {});

    setResumo(totalPorProduto);
  };

  if (!pmoId) {
      return (
        <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
            Vincule um Plano de Manejo ao WhatsApp para ver o painel de produção.
        </Alert>
      );
  }

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (erro) return <Alert severity="error">{erro}</Alert>;

  return (
    <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}>
        <AgricultureIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Produção em Tempo Real (Plano Ativo)
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(resumo).length === 0 ? (
           <Grid item xs={12}>
             <Alert severity="info">Nenhuma colheita registrada neste plano ainda.</Alert>
           </Grid>
        ) : (
          Object.entries(resumo).map(([produto, dados]) => (
            <Grid item xs={12} sm={6} md={4} key={produto}>
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderLeft: '6px solid #2E7D32' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="overline">Total Colhido</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{produto}</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <ScaleIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="h4" color="primary">
                      {dados.total.toLocaleString('pt-BR')} <span style={{fontSize: '1rem'}}>{dados.unidade}</span>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {(colheitas || []).length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                Últimos registros recebidos pelo robô:
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
                <Table size="small">
                <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                    <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Qtd</TableCell>
                    <TableCell>Obs (WhatsApp)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(colheitas || []).slice(0, 5).map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{new Date(row.data_registro).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{row.produto}</TableCell>
                        <TableCell align="right">{row.quantidade_valor} {row.quantidade_unidade}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.85rem' }}>
                        {row.observacao_original}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
          </>
      )}
    </Box>
  );
};

export default HarvestDashboard;