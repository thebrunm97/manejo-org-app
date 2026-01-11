import { supabase } from '../supabaseClient';

/**
 * Salva uma seção específica do PMO em uma tabela relacional do Supabase.
 * Realiza a limpeza de IDs temporários ('row_') para garantir INSERTs corretos,
 * e mantém IDs (UUIDs) para UPDATEs.
 * 
 * @param {string|number} pmoId - O ID do Plano de Manejo (FK).
 * @param {string} tableName - Nome da tabela no Supabase (ex: 'pmo_culturas').
 * @param {Array} data - Array de objetos (linhas da tabela).
 * @param {Object} [columnMapping] - Opcional: Objeto { frontKey: 'db_column' }.
 */
export const savePmoSection = async (pmoId, tableName, data, columnMapping = {}) => {
    // Garantir que columnMapping seja um objeto, mesmo que passem null explicitamente
    const safeMapping = columnMapping || {};
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.log(`[pmoService] Sem dados para salvar em ${tableName}.`);
        return;
    }

    console.group(`[pmoService] Salvando ${tableName} (PMO: ${pmoId})`);

    // 1. Sanitize & Prepare Payload
    const cleanedData = data.map(item => {
        // Separa ID e _id do resto para não enviar 'undefined' ou colunas inexistentes
        const { id, _id, ...rest } = item;

        // Tenta encontrar o identificador real (seja 'id' ou '_id')
        const rawId = id || _id;
        const rawIdStr = String(rawId || '');

        // Verifica se é ID temporário (gerado pelo front)
        // Ex: 'row_123...', 'item_abc...', 'new_...' ou vazio
        const isTemporaryId =
            !rawId ||
            rawIdStr.startsWith('row_') ||
            rawIdStr.startsWith('item_') ||
            rawIdStr.startsWith('temp_') ||
            rawIdStr.startsWith('new_');

        // Base payload com FK
        const payload = {
            pmo_id: pmoId
        };

        if (!isTemporaryId && rawId) {
            payload.id = rawId;
        } else {
            // BACKUP: Gerar UUID v4 puro JS para garantir compatibilidade total (mesmo sem HTTPS/crypto)
            payload.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Mapeia colunas (DE/PARA) e copia dados
        Object.keys(rest).forEach(key => {
            const dbKey = safeMapping[key] || key;

            // Tratamento de valores vazios para null (postgres friendly)
            let value = rest[key];
            if (value === '' && key !== 'nome') value = null;

            payload[dbKey] = value;
        });

        return payload;
    });

    console.log('Payload limpo:', cleanedData);

    // 2. Upsert no Supabase
    try {
        const { data: result, error } = await supabase
            .from(tableName)
            .upsert(cleanedData)
            .select();

        if (error) {
            console.error(`Erro ao salvar ${tableName}:`, error);
            throw error;
        }

        console.log(`Sucesso! ${result?.length} registros processados.`);
        console.groupEnd();
        return result;

    } catch (err) {
        console.groupEnd();
        throw err;
    }
};
