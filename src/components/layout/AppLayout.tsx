import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Home, Users, Building2, FilePlus, Bell, LogOut, 
  ChevronDown, ChevronRight, Settings, User
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import logo from '../../assets/logo.svg';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Navigation items
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
    { name: 'Imóveis', path: '/properties', icon: <Building2 size={20} /> },
    { name: 'Novo Lead', path: '/leads/new', icon: <FilePlus size={20} /> },
  ];
  
  // Agency-specific navigation items
  const agencyItems = user?.role === 'agency' ? [
    { name: 'Corretores', path: '/agents', icon: <Users size={20} /> },
  ] : [];
  
  const allNavigationItems = [...navigationItems, ...agencyItems];
  
  if (!isAuthenticated) {
    return null; // Don't render if not authenticated
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-primary-800 text-white transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-primary-700">
            <img src={logo} alt="ImobApp Logo" className="h-8 w-auto mr-2" />
            <span className="text-xl font-bold text-gold">ImobApp</span>
            
            {/* Close button - mobile only */}
            <button
              className="ml-auto rounded-md lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="mt-2 px-2 space-y-1">
              {allNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    pathname === item.path
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Subscription info */}
            <div className="mt-6 px-4">
              <div className="rounded-md bg-primary-700 p-3">
                <h3 className="text-sm font-medium text-primary-100">Seu plano</h3>
                <p className="mt-1 text-sm text-white">Gratuito</p>
                <div className="mt-2">
                  <Link
                    to="/subscription"
                    className="block rounded-md bg-gold px-2 py-1 text-xs font-medium text-primary-800 text-center"
                  >
                    Fazer upgrade
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar footer */}
          <div className="flex-shrink-0 border-t border-primary-700 p-4">
            <button
              className="flex w-full items-center text-primary-100 hover:text-white"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow z-10">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Mobile menu button */}
            <button
              className="text-gray-600 focus:outline-none focus:text-gray-900 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Page title - mobile only */}
            <div className="lg:hidden">
              <h1 className="text-lg font-semibold text-gray-800">
                {allNavigationItems.find(item => item.path === pathname)?.name || 'ImobApp'}
              </h1>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-600 hover:text-gray-900">
                <Bell size={20} />
              </button>
              
              {/* User dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary-800 flex items-center justify-center text-white">
                    {user?.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <span className="hidden text-gray-700 md:block">{user?.name}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    onBlur={() => setDropdownOpen(false)}
                  >
                    <Link
                      to="/profile"
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Perfil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Configurações
                    </Link>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {allNavigationItems.find(item => item.path === pathname)?.name || 'ImobApp'}
              </h1>
            </div>
            
            {/* Breadcrumbs */}
            <nav className="mt-1 flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1 text-sm text-gray-500">
                <li>
                  <Link to="/dashboard" className="hover:text-gray-700">
                    Início
                  </Link>
                </li>
                {pathname !== '/dashboard' && (
                  <>
                    <li>
                      <ChevronRight size={14} />
                    </li>
                    <li className="text-gray-700">
                      {allNavigationItems.find(item => item.path === pathname)?.name || 'Página'}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>
          
          {/* Page components */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;