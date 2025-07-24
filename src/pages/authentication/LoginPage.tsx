import React from 'react';
import { Navigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';
import { useAuthStore } from '../../store/auth';
import logo from '../../assets/logo.svg';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl">
        {/* Brand section */}
        <div className="bg-primary-900 text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-6">
              <img src={logo} alt="ImobApp Logo" className="h-10 w-10 mr-3" />
              <h1 className="text-3xl font-bold text-gold">ImobApp</h1>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">
              Transforme leads em clientes reais
            </h2>
            
            <p className="text-primary-100 mb-8">
              A plataforma completa para corretores e imobiliárias gerenciarem seus leads, 
              imóveis e oportunidades de negócio em um só lugar.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary-800 p-2 rounded-full mr-3">
                  <Building size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-medium">Cadastre seus imóveis</h3>
                  <p className="text-sm text-primary-200">
                    Mantenha um portfólio organizado e detalhado de todos os seus imóveis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="22" x2="16" y1="11" y2="11" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Gerencie seus leads</h3>
                  <p className="text-sm text-primary-200">
                    Qualifique seus leads de acordo com o potencial de conversão.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Suporte por WhatsApp</h3>
                  <p className="text-sm text-primary-200">
                    Interaja com seus clientes diretamente pelo WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block mt-8">
            <p className="text-primary-200 text-sm">
              © 2025 ImobApp. Todos os direitos reservados.
            </p>
          </div>
        </div>
        
        {/* Form section */}
        <div className="bg-white p-8 md:p-12 md:w-1/2 flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;