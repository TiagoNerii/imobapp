import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MessageSquare, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLeadsStore } from '../store/leads';
import { useAuthStore } from '../store/auth';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const NewLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addLead, isLoading, error } = useLeadsStore();
  const { profile, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'manual' as const,
    status: 'cold' as const,
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  // Verificar se o usuário está autenticado
  if (!isAuthenticated || !profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle size={24} className="text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-900">Acesso Negado</h3>
                <p className="text-red-700">Você precisa estar logado para acessar esta página.</p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => navigate('/login')}>
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
      }
    }
    
    if (!formData.source) {
      newErrors.source = 'Origem é obrigatória';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!profile) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('Submitting lead with data:', formData);
      console.log('Current profile:', profile);
      
      await addLead({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        source: formData.source,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
      });
      
      console.log('Lead created successfully, redirecting...');
      
      // Redirect to leads page on success
      navigate('/leads', { 
        state: { 
          message: 'Lead adicionado com sucesso!' 
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      // Error is already handled by the store
    }
  };
  
  const sourceOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'referral', label: 'Indicação' },
    { value: 'website', label: 'Site' },
    { value: 'other', label: 'Outro' },
  ];
  
  const statusOptions = [
    { value: 'cold', label: 'Frio' },
    { value: 'warm', label: 'Morno' },
    { value: 'hot', label: 'Quente' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/leads')}
            className="mr-4"
          >
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Novo Lead</h1>
        </div>
        <p className="text-gray-600">
          Adicione um novo lead ao seu pipeline de vendas
        </p>
      </div>
      
      {/* Error Alert */}
      {error && submitAttempted && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erro ao salvar lead:</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-1 text-red-600">
                Verifique sua conexão e tente novamente. Se o problema persistir, entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* User Info Debug (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Debug Info (Development)</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>User ID:</strong> {profile?.id || 'Not found'}</p>
              <p><strong>User Name:</strong> {profile?.name || 'Not found'}</p>
              <p><strong>User Role:</strong> {profile?.role || 'Not found'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome completo *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                leftIcon={<User size={18} />}
                placeholder="João Silva"
                required
              />
              
              <Input
                label="E-mail *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail size={18} />}
                placeholder="joao@email.com"
                required
              />
            </div>
            
            <Input
              label="Telefone *"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              leftIcon={<Phone size={18} />}
              placeholder="(11) 99999-9999"
              required
            />
            
            {/* Lead Classification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Origem do lead *"
                options={sourceOptions}
                value={formData.source}
                onChange={handleSelectChange('source')}
                error={errors.source}
              />
              
              <Select
                label="Status inicial *"
                options={statusOptions}
                value={formData.status}
                onChange={handleSelectChange('status')}
                error={errors.status}
              />
            </div>
            
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-500">
                  <FileText size={18} />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Adicione observações sobre este lead..."
                  rows={4}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Informações adicionais sobre o interesse do lead, preferências, etc.
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/leads')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Lead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Tips */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <MessageSquare size={20} className="text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Dicas para qualificar leads</h3>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• <strong>Frio:</strong> Demonstrou interesse inicial, mas ainda está pesquisando</li>
                <li>• <strong>Morno:</strong> Tem interesse real e está comparando opções</li>
                <li>• <strong>Quente:</strong> Pronto para tomar decisão, tem urgência ou orçamento definido</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewLeadPage;