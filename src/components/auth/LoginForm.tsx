import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
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
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Bem-vindo ao ImobApp</h2>
        <p className="text-gray-600 mt-1">Faça login para continuar</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            id="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail size={18} />}
            required
          />
          
          <Input
            label="Senha"
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock size={18} />}
            required
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-700 hover:text-primary-800">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-primary-700 hover:text-primary-800">
            Cadastre-se
          </Link>
        </p>
      </div>
      
      {/* Demo credentials */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 text-center">Credenciais de demonstração:</p>
        <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-semibold">Corretor:</p>
            <p>joao.silva@example.com</p>
            <p>senha123</p>
          </div>
          <div>
            <p className="font-semibold">Imobiliária:</p>
            <p>contato@excelencia.com.br</p>
            <p>senha123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;