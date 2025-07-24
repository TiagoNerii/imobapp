import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './auth';

// O tipo 'Property' agora vem do arquivo do Supabase, não é mais definido aqui.
import { Property } from '../lib/supabase';

// --------------------------------------------------------------------
// O BLOCO "interface Property {...}" QUE ESTAVA AQUI FOI APAGADO.
// --------------------------------------------------------------------

interface PropertiesState {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  getProperties: (ownerId?: string) => Promise<void>;
  getPropertyById: (id: string) => Promise<Property | null>;
  addProperty: (property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  updatePropertyStatus: (id: string, status: Property['status']) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

export const usePropertiesStore = create<PropertiesState>((set) => ({ // Removi o 'get' que não estava sendo usado
  properties: [],
  isLoading: false,
  error: null,

  getProperties: async (ownerId) => {
    set({ isLoading: true, error: null });

    try {
      const { profile } = useAuthStore.getState();
      if (!profile) throw new Error('Usuário não autenticado');

      let query = supabase.from('properties').select('*');

      if (profile.role === 'agent') {
        query = query.eq('owner_id', profile.id);
      } else if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      set({ properties: data || [], isLoading: false });
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao carregar imóveis';

      // 2. Verifique se o erro é um objeto do tipo Error
      if (error instanceof Error) {
        errorMessage = error.message; // 3. Agora o acesso é seguro!
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  getPropertyById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting property by ID:', error); // Adicionado log de erro
      return null;
    }
  },

  addProperty: async (propertyData) => {
    set({ isLoading: true, error: null });

    try {
      const { profile } = useAuthStore.getState();
      if (!profile) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          owner_id: profile.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Adiciona o novo imóvel ao início da lista
      set(state => ({
        properties: [data, ...state.properties],
        isLoading: false,
      }));
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao adicionar imoveis';

      // 2. Verifique se o erro é um objeto do tipo Error
      if (error instanceof Error) {
        errorMessage = error.message; // 3. Agora o acesso é seguro!
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  updateProperty: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        properties: state.properties.map(property =>
          property.id === id ? { ...property, ...updates } : property
        ),
      }));
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao atualizar imoveis';

      // 2. Verifique se o erro é um objeto do tipo Error
      if (error instanceof Error) {
        errorMessage = error.message; // 3. Agora o acesso é seguro!
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  updatePropertyStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        properties: state.properties.map(property =>
          property.id === id ? { ...property, status } : property
        ),
      }));
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao atualizar status do imovel';

      // 2. Verifique se o erro é um objeto do tipo Error
      if (error instanceof Error) {
        errorMessage = error.message; // 3. Agora o acesso é seguro!
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  deleteProperty: async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        properties: state.properties.filter(property => property.id !== id),
      }));
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao excluir imovel';

      // 2. Verifique se o erro é um objeto do tipo Error
      if (error instanceof Error) {
        errorMessage = error.message; // 3. Agora o acesso é seguro!
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  }
}));