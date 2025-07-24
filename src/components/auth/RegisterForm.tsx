import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UserRole } from '../../types';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'agent' as UserRole,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
        formData.role as 'agent' | 'agency'
      );
      
      navigate('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Criar uma conta</h2>
        <p className="text-gray-600 mt-1">Preencha os dados para começar</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>  
        <div className="space-y-4">
          <Input
            label="Nome completo"
            type="text"
            id="name"
            name="name"
            placeholder="João Silva"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            leftIcon={<User size={18} />}
            required
          />
          
          <Input
            label="E-mail"
            type="email"
            id="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<Mail size={18} />}
            required
          />
          
          <Input
            label="Telefone"
            type="tel"
            id="phone"
            name="phone"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            leftIcon={<Phone size={18} />}
            required
          />
          
          <Input
            label="Senha"
            type="password"
            id="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<Lock size={18} />}
            required
          />
          
          <Input
            label="Confirmar senha"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<Lock size={18} />}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de conta
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`
                flex items-center p-3 border rounded-md cursor-pointer transition-colors
                ${formData.role === 'agent' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-300 hover:bg-gray-50'}
              `}>
                <input
                  type="radio"
                  name="role"
                  value="agent"
                  checked={formData.role === 'agent'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <User size={18} className="mb-1" />
                  <p className="text-sm font-medium">Corretor</p>
                </div>
              </label>
              
              <label className={`
                flex items-center p-3 border rounded-md cursor-pointer transition-colors
                ${formData.role === 'agency' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-300 hover:bg-gray-50'}
              `}>
                <input
                  type="radio"
                  name="role"
                  value="agency"
                  checked={formData.role === 'agency'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <Building2 size={18} className="mb-1" />
                  <p className="text-sm font-medium">Imobiliária</p>
                </div>
              </label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Criar conta
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-primary-700 hover:text-primary-800">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;