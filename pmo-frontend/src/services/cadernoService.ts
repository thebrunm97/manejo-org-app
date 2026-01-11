import { supabase } from '../supabaseClient';
import {
    CadernoEntry,
    ActivityType,
    DetalhesPlantioSchema,
    DetalhesManejoSchema,
    DetalhesColheitaSchema,
    DetalhesGenericoSchema
} from '../types/CadernoTypes';

export const getRegistros = async (pmoId: number): Promise<CadernoEntry[]> => {
    const { data, error } = await supabase
        .from('caderno_campo')
        .select('*, talhoes ( nome )')
        .eq('pmo_id', pmoId)
        .order('data_registro', { ascending: false });

    if (error) {
        console.error('Error fetching registros:', error.message);
        throw error;
    }

    if (!data) return [];

    // --- Runtime Validation & Transformation ---
    return data.map((raw: any) => {
        try {
            // Determine Schema Based on Activity Type
            let detalhesParsed = {};
            const tipo = raw.tipo_atividade;
            const rawDetalhes = raw.detalhes_tecnicos || {};

            if (tipo === ActivityType.PLANTIO || tipo === 'Plantio') {
                const result = DetalhesPlantioSchema.safeParse(rawDetalhes);
                detalhesParsed = result.success ? result.data : rawDetalhes;
            }
            else if (tipo === ActivityType.MANEJO || tipo === 'Manejo') {
                const result = DetalhesManejoSchema.safeParse(rawDetalhes);
                detalhesParsed = result.success ? result.data : rawDetalhes;
            }
            else if (tipo === ActivityType.COLHEITA || tipo === 'Colheita') {
                const result = DetalhesColheitaSchema.safeParse(rawDetalhes);
                detalhesParsed = result.success ? result.data : rawDetalhes;
            }
            else {
                detalhesParsed = rawDetalhes; // Fallback for 'Outro'
            }

            // Return Typed Object
            return {
                ...raw,
                detalhes_tecnicos: detalhesParsed
            } as CadernoEntry;

        } catch (err) {
            console.warn(`Failed to parse registro ${raw.id}:`, err);
            // Return raw with 'Outro' type fallback to avoid crashing UI
            return { ...raw, tipo_atividade: 'Outro', detalhes_tecnicos: {} } as CadernoEntry;
        }
    });
};

export const addRegistro = async (registro: Omit<CadernoEntry, 'id' | 'created_at'>): Promise<CadernoEntry> => {
    const { data, error } = await supabase
        .from('caderno_campo')
        .insert(registro)
        .select()
        .single();

    if (error) {
        console.error('Error adding registro:', error.message);
        throw error;
    }

    return data as CadernoEntry;
};

export const deleteRegistro = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('caderno_campo')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting registro:', error.message);
        throw error;
    }
};

export const updateRegistro = async (id: string, updates: Partial<CadernoEntry>): Promise<CadernoEntry> => {
    const { data, error } = await supabase
        .from('caderno_campo')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating registro:', error.message);
        throw error;
    }
    return data as CadernoEntry;
}

export const cadernoService = {
    getRegistros,
    addRegistro,
    deleteRegistro,
    updateRegistro
};
