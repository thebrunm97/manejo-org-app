import { supabase } from '../supabaseClient';

export const dashboardService = {
    // 1. Fetch de Talhões Simplificado (Consertar Bug Crítico)
    // O componente pode chamar isso sem depender de props complexas
    async getTalhoes(pmoId) {
        // Busca direta - RLS do Supabase garante que o usuário só vê os seus
        // CORREÇÃO: Usar tabela 'propriedade_talhoes'
        let query = supabase
            .from('propriedade_talhoes')
            .select('id, nome, cultura');

        if (pmoId) {
            query = query.eq('pmo_id', pmoId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Erro ao buscar talhões:", error);
            return [];
        }
        return data || [];
    },

    // 2. Upload de Comprovante (Prioritário para Auditoria)
    async uploadComprovante(file) {
        if (!file) return null;

        try {
            // Nome único: timestamp_nome-limpo
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_audit.${fileExt}`;

            // Upload para bucket 'comprovantes'
            const { error: uploadError } = await supabase.storage
                .from('comprovantes')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // URL Pública
            const { data } = supabase.storage
                .from('comprovantes')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error) {
            console.error('Falha no upload:', error);
            throw new Error("Não foi possível salvar o comprovante. Tente novamente.");
        }
    },

    // 3. Salvar Registro (Suporte a Polimorfismo)
    async saveRegistro(payload) {
        // Validação básica de campos críticos
        if (!payload.pmo_id) throw new Error("ID do Plano de Manejo inválido.");
        if (!payload.data_registro) throw new Error("Data é obrigatória.");

        let error;

        if (payload.id) {
            // UPDATE
            const { id, ...updateData } = payload;

            // MVP: Garantir campos planos para auditoria fácil
            if (updateData.detalhes_tecnicos && updateData.detalhes_tecnicos.historico_alteracoes) {
                const hist = updateData.detalhes_tecnicos.historico_alteracoes;
                if (hist.length > 0) {
                    const lastLog = hist[hist.length - 1];
                    updateData.detalhes_tecnicos.justificativa_edicao = lastLog.motivo;
                    updateData.detalhes_tecnicos.data_edicao = lastLog.data;
                }
            }

            const result = await supabase
                .from('caderno_campo')
                .update(updateData)
                .eq('id', id);
            error = result.error;
        } else {
            // INSERT
            // Remove 'id' if it exists and is falsy/null to let Postgres auto-generate it
            const { id, ...insertData } = payload;
            const result = await supabase
                .from('caderno_campo')
                .insert([insertData]);
            error = result.error;
        }

        if (error) {
            console.error('Erro de persistência:', error);
            throw new Error(`Erro ao salvar: ${error.message}`);
        }

        return true;
    },

    // 4. Wrapper simplificado para salvar registro com parâmetros explícitos
    async saveRecord(tipo, form, anexo, pmoId) {
        // Validação de pmoId
        if (!pmoId) throw new Error("ID do Plano de Manejo é obrigatório.");

        // Construir payload e delegar para saveRegistro
        const payload = {
            ...form,
            pmo_id: pmoId,
            tipo_atividade: tipo
        };

        // Adicionar anexo se fornecido
        if (anexo && payload.detalhes_tecnicos) {
            payload.detalhes_tecnicos.anexo_url = anexo;
        }

        return await this.saveRegistro(payload);
    },

    // 5. Buscar itens (sementes/insumos) do PMO para Autocomplete
    async getItensPmo(pmoId) {
        if (!pmoId) return { sementes: [], insumos: [] };

        try {
            const { data, error } = await supabase
                .from('pmos')
                .select('form_data')
                .eq('id', pmoId)
                .single();

            if (error || !data) {
                console.error('Erro ao buscar itens do PMO:', error);
                return { sementes: [], insumos: [] };
            }

            const fd = data.form_data || {};

            // Caminhos seguros baseados em formData.js
            const sementesOrg = fd.secao_9_propagacao_vegetal?.origem_sementes_mudas_organicas?.sementes_mudas_organicas || [];
            const sementesNaoOrg = fd.secao_9_propagacao_vegetal?.origem_sementes_mudas_nao_organicas?.sementes_mudas_nao_organicas || [];
            const insumos = fd.secao_10_fitossanidade?.controle_pragas_doencas || [];

            // BLINDAGEM CRÍTICA: Garantir que sempre retornamos arrays válidos
            return {
                sementes: [
                    ...(Array.isArray(sementesOrg) ? sementesOrg : []),
                    ...(Array.isArray(sementesNaoOrg) ? sementesNaoOrg : [])
                ],
                insumos: Array.isArray(insumos) ? insumos : []
            };
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            return { sementes: [], insumos: [] };
        }
    },

    // 6. Criar item rápido (semente ou insumo) no JSONB do PMO
    async createQuickItem(pmoId, tipo, nome) {
        if (!pmoId || !tipo || !nome) {
            throw new Error('Parâmetros inválidos para criar item rápido');
        }

        try {
            // Passo 1: Buscar form_data atual
            const { data, error: fetchError } = await supabase
                .from('pmos')
                .select('form_data')
                .eq('id', pmoId)
                .single();

            if (fetchError) throw fetchError;

            const formData = { ...data.form_data } || {};
            const newId = `quick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Passo 2: Modificar JSON (Append ao array apropriado)
            if (tipo === 'semente') {
                // Garantir estrutura existe
                if (!formData.secao_9_propagacao_vegetal) {
                    formData.secao_9_propagacao_vegetal = {};
                }
                if (!formData.secao_9_propagacao_vegetal.origem_sementes_mudas_organicas) {
                    formData.secao_9_propagacao_vegetal.origem_sementes_mudas_organicas = {};
                }
                if (!formData.secao_9_propagacao_vegetal.origem_sementes_mudas_organicas.sementes_mudas_organicas) {
                    formData.secao_9_propagacao_vegetal.origem_sementes_mudas_organicas.sementes_mudas_organicas = [];
                }

                formData.secao_9_propagacao_vegetal.origem_sementes_mudas_organicas.sementes_mudas_organicas.push({
                    _id: newId,
                    tipo: 'semente',
                    especies: nome,
                    origem: '⚡ CADASTRO RÁPIDO (Caderno)',
                    quantidade: '',
                    sistema_organico: true,
                    data_compra: ''
                });
            } else if (tipo === 'insumo') {
                // Garantir estrutura existe
                if (!formData.secao_10_fitossanidade) {
                    formData.secao_10_fitossanidade = {};
                }
                if (!formData.secao_10_fitossanidade.controle_pragas_doencas) {
                    formData.secao_10_fitossanidade.controle_pragas_doencas = [];
                }

                formData.secao_10_fitossanidade.controle_pragas_doencas.push({
                    _id: newId,
                    produto_ou_manejo: nome,
                    onde: '',
                    qual_praga_doenca: '',
                    quando: '',
                    procedencia: '⚡ CADASTRO RÁPIDO (Caderno)',
                    composicao: '',
                    marca: '',
                    dosagem: ''
                });
            }

            // Passo 3: Salvar de volta (Update)
            const { error: updateError } = await supabase
                .from('pmos')
                .update({ form_data: formData })
                .eq('id', pmoId);

            if (updateError) throw updateError;

            console.log(`✅ Item "${nome}" criado como ${tipo} no PMO ${pmoId}`);
            return nome;

        } catch (error) {
            console.error('Erro ao criar item rápido:', error);
            throw new Error(`Falha ao criar ${tipo}: ${error.message}`);
        }
    }
};
