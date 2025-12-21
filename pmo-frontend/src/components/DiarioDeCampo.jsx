import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Chip, Tooltip } from '@mui/material'; // Usaremos componentes visuais
import ScienceIcon from '@mui/icons-material/Science'; // Ícone de "Química/Receita"

const DiarioDeCampo = ({ pmoId }) => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pmoId) fetchRegistros();
  }, [pmoId]);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('caderno_campo')
        .select('*')
        .order('data_registro', { ascending: false });

      if (pmoId) {
        query = query.eq('pmo_id', pmoId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRegistros(data);
    } catch (error) {
      console.error('Erro:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  // Função para renderizar os detalhes técnicos bonitinhos
  const renderDetalhes = (reg) => {
    // Se tiver detalhes técnicos salvos em JSON
    if (reg.detalhes_tecnicos && typeof reg.detalhes_tecnicos === 'object') {
      const { composicao, origem, obs } = reg.detalhes_tecnicos;
      
      return (
        <div className="flex flex-col gap-1">
          {composicao && (
            <div className="text-xs text-gray-700 bg-green-50 p-1 rounded border border-green-100">
               <strong>🧪 Receita:</strong> {composicao}
            </div>
          )}
          {origem && (
            <span className="text-xs text-gray-500">Origem: {origem}</span>
          )}
          {/* Se não tiver JSON, mostra a observação antiga */}
          {!composicao && !origem && <span className="text-xs italic">{reg.observacao_original}</span>}
        </div>
      );
    }
    // Fallback para texto simples
    return <span className="text-sm text-gray-500">{reg.observacao_original}</span>;
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          📒 Caderno de Campo Digital
        </h3>
        <button 
          onClick={fetchRegistros}
          className="text-sm text-green-600 hover:text-green-800 underline font-medium"
        >
          🔄 Atualizar Lista
        </button>
      </div>
      
      {loading ? (
        <p className="text-gray-500 text-center py-10">Carregando registros do campo...</p>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Atividade</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Local/Qtd</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-1/3">Detalhes Técnicos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <p className="text-lg">Nenhum registro ainda.</p>
                    <p className="text-sm mt-2">Envie um áudio no WhatsApp: <em>"Preparei biofertilizante com..."</em></p>
                  </td>
                </tr>
              ) : (
                registros.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatarData(reg.data_registro)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${reg.tipo_atividade === 'Colheita' ? 'bg-green-100 text-green-800' : 
                          ['Insumo', 'Adubação'].includes(reg.tipo_atividade) ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {reg.tipo_atividade}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {reg.produto}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span>📍 {reg.talhao_canteiro || '-'}</span>
                        {reg.quantidade_valor > 0 && (
                            <span className="font-bold text-gray-800">
                                ⚖️ {reg.quantidade_valor} {reg.quantidade_unidade}
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 align-top">
                      {renderDetalhes(reg)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DiarioDeCampo;