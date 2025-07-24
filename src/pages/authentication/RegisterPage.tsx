import React from 'react';
import { Navigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuthStore } from '../../store/auth';
import logo from '../../assets/logo.svg';

const RegisterPage: React.FC = () => {
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
              Crie sua conta agora
            </h2>
            
            <p className="text-primary-100 mb-8">
              Aumente suas vendas e organize seus imóveis e leads com a plataforma 
              mais completa para corretores e imobiliárias.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Aumente suas conversões</h3>
                  <p className="text-sm text-primary-200">
                    Qualifique seus leads e acompanhe todo o processo de venda.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-800 p-2 rounded-full mr-3">
                  <Building size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-medium">Planos flexíveis</h3>
                  <p className="text-sm text-primary-200">
                    Comece grátis e faça upgrade conforme seu negócio cresce.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Segurança garantida</h3>
                  <p className="text-sm text-primary-200">
                    Seus dados estão sempre protegidos em nossa plataforma.
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
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;