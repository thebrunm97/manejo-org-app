import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ScienceIcon from '@mui/icons-material/Science';
import RefreshIcon from '@mui/icons-material/Refresh';

const DiarioDeCampo = ({ pmoId }) => {
  // INICIALIZAÇÃO SEGURA: Começa sempre como array vazio []
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    data_registro: 'Todos',
    tipo_atividade: 'Todos',
    produto: 'Todos'
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState(null);

  useEffect(() => {
    if (pmoId) fetchRegistros();
  }, [pmoId]);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('caderno_campo')
        .select('*')
        .eq('pmo_id', pmoId)
        .order('data_registro', { ascending: false });

      if (error) throw error;
      // TRAVA DE SEGURANÇA 1: Garante que nunca seja null/undefined
      setRegistros(data || []);
    } catch (error) {
      console.error('Erro:', error.message);
      setRegistros([]); // Em caso de erro, define como array vazio para não quebrar o .map
    } finally {
      setLoading(false);
    }
  };

  const abrirFiltro = (event, coluna) => {
    setAnchorEl(event.currentTarget);
    setColunaAtiva(coluna);
  };

  const fecharFiltro = (valor) => {
    if (valor) {
      setFiltrosAtivos(prev => ({ ...prev, [colunaAtiva]: valor }));
    }
    setAnchorEl(null);
    setColunaAtiva(null);
  };

  // TRAVA DE SEGURANÇA 2: Uso de ?. e || [] no filter
  const registrosFiltrados = (registros || []).filter(reg => {
    if (!reg) return false; // Ignora registros inválidos
    const dataFormatada = reg.data_registro ? new Date(reg.data_registro).toLocaleDateString('pt-BR') : '-';
    
    const matchData = filtrosAtivos.data_registro === 'Todos' || dataFormatada === filtrosAtivos.data_registro;
    const matchTipo = filtrosAtivos.tipo_atividade === 'Todos' || reg.tipo_atividade === filtrosAtivos.tipo_atividade;
    const matchProduto = filtrosAtivos.produto === 'Todos' || reg.produto === filtrosAtivos.produto;
    return matchData && matchTipo && matchProduto;
  });

  // TRAVA DE SEGURANÇA 3: Proteção na geração das opções do menu
  const obterOpcoesunicas = (coluna) => {
    if (!registros || registros.length === 0) return ['Todos'];

    if (coluna === 'data_registro') {
      const datas = registros.map(r => r.data_registro ? new Date(r.data_registro).toLocaleDateString('pt-BR') : '-');
      return ['Todos', ...new Set(datas)];
    }
    
    // Proteção contra campo undefined
    const valores = registros.map(r => r[coluna] || '-');
    return ['Todos', ...new Set(valores)];
  };

  return (
    <div className="mt-6 w-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          📒 Caderno de Campo Digital
        </h3>
        
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); 
            fetchRegistros();
          }}
          className="flex items-center gap-1 text-sm text-green-700 font-medium hover:bg-green-50 px-3 py-1 rounded border border-green-200 transition-all"
        >
          <RefreshIcon sx={{ fontSize: 18 }} /> Atualizar Lista
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center cursor-pointer hover:text-green-700" onClick={(e) => abrirFiltro(e, 'data_registro')}>
                    Data <ArrowDropDownIcon fontSize="small" />
                    {filtrosAtivos.data_registro !== 'Todos' && <span className="ml-1 text-[9px] bg-green-200 px-1 rounded">●</span>}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center cursor-pointer hover:text-green-700" onClick={(e) => abrirFiltro(e, 'tipo_atividade')}>
                    Atividade <ArrowDropDownIcon fontSize="small" />
                    {filtrosAtivos.tipo_atividade !== 'Todos' && <span className="ml-1 text-[9px] bg-green-200 px-1 rounded">●</span>}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center cursor-pointer hover:text-green-700" onClick={(e) => abrirFiltro(e, 'produto')}>
                    Produto <ArrowDropDownIcon fontSize="small" />
                    {filtrosAtivos.produto !== 'Todos' && <span className="ml-1 text-[9px] bg-green-200 px-1 rounded">●</span>}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Local/Qtd</th>
                <th className="px-4 py-3 text-left w-1/3">Detalhes Técnicos</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center"><CircularProgress size={30} /></td></tr>
              ) : (!registrosFiltrados || registrosFiltrados.length === 0) ? ( // TRAVA DE SEGURANÇA 4
                <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-medium">Nenhum registro encontrado.</td></tr>
              ) : (
                registrosFiltrados.map((reg) => (
                  <tr key={reg.id || Math.random()} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      {reg.data_registro ? new Date(reg.data_registro).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full 
                        ${reg.tipo_atividade === 'Colheita' ? 'bg-orange-100 text-orange-800' : 
                          reg.tipo_atividade === 'Insumo' ? 'bg-blue-100 text-blue-800' : 
                          reg.tipo_atividade === 'Plantio' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {reg.tipo_atividade || 'Outro'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold uppercase text-gray-800">{reg.produto || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">📍 {reg.talhao_canteiro || '-'}</span>
                        {reg.quantidade_valor > 0 && (
                          <span className="font-bold text-gray-800 text-[12px]">⚖️ {reg.quantidade_valor} {reg.quantidade_unidade}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {reg.detalhes_tecnicos?.receita || reg.detalhes_tecnicos?.composicao ? (
                        <div className="text-xs bg-green-50 p-2 rounded border border-green-100">
                          <strong className="flex items-center gap-1 text-green-700">
                            <ScienceIcon sx={{ fontSize: 14 }} /> Receita:
                          </strong>
                          {reg.detalhes_tecnicos.receita || reg.detalhes_tecnicos.composicao}
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-400">{reg.observacao_original || ''}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => fecharFiltro()}
        PaperProps={{ style: { maxHeight: 300, width: '20ch' } }}
      >
        {colunaAtiva && obterOpcoesunicas(colunaAtiva).map((opcao) => (
          <MenuItem 
            key={opcao} 
            selected={filtrosAtivos[colunaAtiva] === opcao}
            onClick={() => fecharFiltro(opcao)}
            sx={{ fontSize: '12px' }}
          >
            {opcao}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DiarioDeCampo;