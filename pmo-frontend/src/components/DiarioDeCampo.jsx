import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Agora aceita "pmoId" como propriedade (prop)
const DiarioDeCampo = ({ pmoId }) => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só busca se tivermos um ID (ou busca tudo se não tiver ID, opcional)
    if (pmoId) {
      fetchRegistros();
    }
  }, [pmoId]); // Recarrega se o ID mudar

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('caderno_campo')
        .select('*')
        .order('data_registro', { ascending: false });

      // O SEGREDO: Filtra pelo ID do plano atual
      if (pmoId) {
        query = query.eq('pmo_id', pmoId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRegistros(data);
    } catch (error) {
      console.error('Erro ao buscar registros:', error.message);
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

  return (
    <div className="mt-6"> {/* Removi margens fixas para encaixar na aba */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-700">
          📒 Caderno de Campo (Rastreabilidade)
        </h3>
        <button 
          onClick={fetchRegistros}
          className="text-sm text-green-600 hover:text-green-800 underline"
        >
          Atualizar Lista
        </button>
      </div>
      
      {loading ? (
        <p className="text-gray-500">Carregando registros...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atividade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalhes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <p>Nenhum registro encontrado para este plano.</p>
                    <p className="text-sm mt-2">Envie um áudio no WhatsApp dizendo: <br/>
                    <em>"Apliquei adubo no Sítio..."</em></p>
                  </td>
                </tr>
              ) : (
                registros.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatarData(reg.data_registro)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${reg.tipo_atividade === 'Colheita' ? 'bg-green-100 text-green-800' : 
                          reg.tipo_atividade === 'Insumo' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {reg.tipo_atividade}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{reg.produto}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reg.talhao_canteiro || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {reg.quantidade_valor > 0 ? `${reg.quantidade_valor} ${reg.quantidade_unidade}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs" title={reg.observacao_original}>
                      {reg.observacao_original}
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