import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './auth';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'manual' | 'whatsapp' | 'referral' | 'website' | 'other';
  status: 'cold' | 'warm' | 'hot';
  agent_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface LeadsState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  getLeads: (agentId?: string) => Promise<void>;
  getLeadById: (id: string) => Promise<Lead | null>;
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'agent_id'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  isLoading: false,
  error: null,

  getLeads: async (agentId) => {
    set({ isLoading: true, error: null });

    try {
      const { profile } = useAuthStore.getState();
      if (!profile) {
        throw new Error('Usuário não autenticado');
      }

      let query = supabase.from('leads').select('*');

      if (profile.role === 'agent') {
        query = query.eq('agent_id', profile.id);
      } else if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      set({ leads: data || [], isLoading: false });
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao carregar leads';

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

  getLeadById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error getting lead by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getLeadById:', error);
      return null;
    }
  },

  addLead: async (leadData) => {
    set({ isLoading: true, error: null });

    try {
      const { profile, user } = useAuthStore.getState();

      if (!profile || !user) {
        throw new Error('Usuário não autenticado');
      }

      // Validar dados obrigatórios
      if (!leadData.name || !leadData.email || !leadData.phone) {
        throw new Error('Nome, email e telefone são obrigatórios');
      }

      if (!leadData.source || !leadData.status) {
        throw new Error('Origem e status são obrigatórios');
      }

      // Preparar dados para inserção
      const insertData = {
        name: leadData.name.trim(),
        email: leadData.email.trim().toLowerCase(),
        phone: leadData.phone.trim(),
        source: leadData.source,
        status: leadData.status,
        agent_id: profile.id, // Usar o ID do perfil do usuário logado
        notes: leadData.notes?.trim() || null,
      };

      console.log('Inserting lead data:', insertData);

      const { data, error } = await supabase
        .from('leads')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Lead created successfully:', data);

      set(state => ({
        leads: [data, ...state.leads],
        isLoading: false,
        error: null,
      }));
    } catch (error: unknown) { // 1. Mude de 'any' para 'unknown'
      let errorMessage = 'Erro ao adicionar lead';

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

  updateLead: async (id, updates) => {
    try {
      const { profile } = useAuthStore.getState();
      if (!profile) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .eq('agent_id', profile.id); // Garantir que só pode atualizar seus próprios leads

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === id ? { ...lead, ...updates } : lead
        ),
      }));
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error in updateLead:', err);
      set({ error: err.message || 'Erro ao atualizar lead' });
      throw err;
    }
  },

  updateLeadStatus: async (id, status) => {
    try {
      const { profile } = useAuthStore.getState();
      if (!profile) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .eq('agent_id', profile.id);

      if (error) {
        console.error('Error updating lead status:', error);
        throw error;
      }

      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === id ? { ...lead, status } : lead
        ),
      }));
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error in updateLeadStatus:', err);
      set({ error: err.message || 'Erro ao atualizar status do lead' });
      throw err;
    }
  },

  deleteLead: async (id) => {
    try {
      const { profile } = useAuthStore.getState();
      if (!profile) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('agent_id', profile.id);

      if (error) {
        console.error('Error deleting lead:', error);
        throw error;
      }

      set(state => ({
        leads: state.leads.filter(lead => lead.id !== id),
      }));
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error in deleteLead:', err);
      set({ error: err.message || 'Erro ao excluir lead' });
      throw err;
    }

  },
}));