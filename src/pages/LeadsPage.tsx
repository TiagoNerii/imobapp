import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLeadsStore } from '../store/leads';
import { useAuthStore } from '../store/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import LeadCard from '../components/leads/LeadCard';

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

const LeadsPage: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuthStore();
  const { leads, getLeads, updateLeadStatus, deleteLead, isLoading, error } = useLeadsStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    if (profile) {
      if (profile.role === 'agent') {
        getLeads(profile.id);
      } else {
        getLeads();
      }
    }
  }, [profile, getLeads]);
  
  // Show success message if redirected from new lead page
  useEffect(() => {
    if (location.state?.message) {
      setShowSuccessMessage(true);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await deleteLead(id);
      } catch (error) {
        console.error('Erro ao excluir lead:', error);
      }
    }
  };
  
  const handleViewLead = (id: string) => {
    // In a real app, this would navigate to a lead detail page
    console.log('View lead', id);
  };
  
  const handleEditLead = (id: string) => {
    // In a real app, this would navigate to a lead edit page
    console.log('Edit lead', id);
  };
  
  const handleStatusChange = async (id: string, status: 'cold' | 'warm' | 'hot') => {
    try {
      await updateLeadStatus(id, status);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };
  
  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      // Search by name or email
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      // Filter by source
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      // Sort by selected criterion
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  
  // Get counts for each status
  const coldLeadsCount = leads.filter(lead => lead.status === 'cold').length;
  const warmLeadsCount = leads.filter(lead => lead.status === 'warm').length;
  const hotLeadsCount = leads.filter(lead => lead.status === 'hot').length;
  
  return (
    <div>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2" />
            <span>{location.state?.message}</span>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Erro:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center">
            <Users size={24} className="mr-2 text-primary-800" />
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          </div>
          <p className="text-gray-600 mt-1">
            Gerencie seus leads e acompanhe oportunidades de negócios
          </p>
        </div>
        
        <Link to="/leads/new">
          <Button
            icon={<Plus size={16} />}
          >
            Adicionar Lead
          </Button>
        </Link>
      </div>
      
      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div 
          className={`
            bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
            ${statusFilter === 'cold' ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}
          `}
          onClick={() => setStatusFilter(statusFilter === 'cold' ? 'all' : 'cold')}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Leads Frios</p>
              <p className="text-2xl font-semibold">{coldLeadsCount}</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`
            bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
            ${statusFilter === 'warm' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200'}
          `}
          onClick={() => setStatusFilter(statusFilter === 'warm' ? 'all' : 'warm')}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <div className="h-4 w-4 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Leads Mornos</p>
              <p className="text-2xl font-semibold">{warmLeadsCount}</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`
            bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
            ${statusFilter === 'hot' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}
          `}
          onClick={() => setStatusFilter(statusFilter === 'hot' ? 'all' : 'hot')}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Leads Quentes</p>
              <p className="text-2xl font-semibold">{hotLeadsCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar leads por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
          
          <Button
            variant="outline"
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
          
          <Select
            options={[
              { value: 'newest', label: 'Mais recentes' },
              { value: 'oldest', label: 'Mais antigos' },
              { value: 'name-asc', label: 'Nome (A-Z)' },
              { value: 'name-desc', label: 'Nome (Z-A)' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
        </div>
        
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="w-full sm:w-1/2">
              <Select
                label="Status"
                options={[
                  { value: 'all', label: 'Todos os status' },
                  { value: 'cold', label: 'Frios' },
                  { value: 'warm', label: 'Mornos' },
                  { value: 'hot', label: 'Quentes' },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
              />
            </div>
            
            <div className="w-full sm:w-1/2">
              <Select
                label="Origem"
                options={[
                  { value: 'all', label: 'Todas as origens' },
                  { value: 'manual', label: 'Manual' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'referral', label: 'Indicação' },
                  { value: 'website', label: 'Site' },
                  { value: 'other', label: 'Outra' },
                ]}
                value={sourceFilter}
                onChange={(value) => setSourceFilter(value)}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          <span className="ml-2 text-gray-600">Carregando leads...</span>
        </div>
      )}
      
      {/* Leads grid */}
      {!isLoading && (
        <>
          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onView={handleViewLead}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' ? (
                <>
                  <h3 className="text-lg font-medium text-gray-700">Nenhum resultado encontrado</h3>
                  <p className="text-gray-500 mb-4">Tente ajustar seus filtros de busca</p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSourceFilter('all');
                  }}>
                    Limpar filtros
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-700">Nenhum lead cadastrado</h3>
                  <p className="text-gray-500 mb-4">Comece adicionando seu primeiro lead</p>
                  <Link to="/leads/new">
                    <Button>Adicionar Lead</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadsPage;