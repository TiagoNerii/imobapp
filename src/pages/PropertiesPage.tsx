import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePropertiesStore } from '../store/properties';
import { useAuthStore } from '../store/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import PropertyCard from '../components/properties/PropertyCard';
import { generateWhatsAppLink } from '../utils/formatters';

const PropertiesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { properties, getProperties, updatePropertyStatus, deleteProperty } = usePropertiesStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    if (user) {
      if (user.role === 'agent') {
        getProperties(user.id);
      } else {
        getProperties();
      }
    }
  }, [user]);
  
  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      deleteProperty(id);
    }
  };
  
  const handleViewProperty = (id: string) => {
    // In a real app, this would navigate to a property detail page
    console.log('View property', id);
  };
  
  const handleEditProperty = (id: string) => {
    // In a real app, this would navigate to a property edit page
    console.log('Edit property', id);
  };
  
  const handleShareViaWhatsApp = (id: string) => {
    const property = properties.find(p => p.id === id);
    
    if (!property) return;
    
    // Create a message without the price
    const message = `🏠 *${property.title}*\n\n` +
      `📍 ${property.location.neighborhood}, ${property.location.city}/${property.location.state}\n\n` +
      `🛏️ ${property.features.bedrooms} quartos\n` +
      `🚿 ${property.features.bathrooms} banheiros\n` +
      `🚗 ${property.features.parkingSpaces} vagas\n` +
      `📏 ${property.features.builtArea}m² de área construída\n\n` +
      `Entre em contato para mais informações!`;
    
    // Open WhatsApp with the message
    window.open(generateWhatsAppLink('', message), '_blank');
  };
  
  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      // Search by title or location
      const matchesSearch = 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      
      // Filter by price range
      let matchesPrice = true;
      if (priceFilter === 'under-500k') {
        matchesPrice = property.salePrice < 500000;
      } else if (priceFilter === '500k-1m') {
        matchesPrice = property.salePrice >= 500000 && property.salePrice < 1000000;
      } else if (priceFilter === 'over-1m') {
        matchesPrice = property.salePrice >= 1000000;
      }
      
      return matchesSearch && matchesStatus && matchesPrice;
    })
    .sort((a, b) => {
      // Sort by selected criterion
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-asc':
          return a.salePrice - b.salePrice;
        case 'price-desc':
          return b.salePrice - a.salePrice;
        default:
          return 0;
      }
    });
  
  // Get counts for each status
  const availableCount = properties.filter(p => p.status === 'available').length;
  const reservedCount = properties.filter(p => p.status === 'reserved').length;
  const soldCount = properties.filter(p => p.status === 'sold').length;
  
  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center">
            <Building2 size={24} className="mr-2 text-primary-800" />
            <h1 className="text-2xl font-bold text-gray-900">Imóveis</h1>
          </div>
          <p className="text-gray-600 mt-1">
            Gerencie seu portfólio de imóveis
          </p>
        </div>
        
        <Link to="/properties/new">
          <Button
            icon={<Plus size={16} />}
          >
            Adicionar Imóvel
          </Button>
        </Link>
      </div>
      
      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div 
          className={`
            bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
            ${statusFilter === 'available' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}
          `}
          onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Disponíveis</p>
              <p className="text-2xl font-semibold">{availableCount}</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`
            bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
            ${statusFilter === 'reserved' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200'}
          `}
          onClick={() => setStatusFilter(statusFilter === 'reserved' ? 'all' : 'reserved')}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <div className="h-4 w-4 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reservados</p>
              <p className="text-2xl font-semibold">{reservedCount}</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`
            bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer
            ${statusFilter === 'sold' ? 'border-gray-500 ring-1 ring-gray-500' : 'border-gray-200'}
          `}
          onClick={() => setStatusFilter(statusFilter === 'sold' ? 'all' : 'sold')}
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <div className="h-4 w-4 rounded-full bg-gray-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vendidos</p>
              <p className="text-2xl font-semibold">{soldCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar imóveis por título, descrição ou localização..."
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
              { value: 'price-asc', label: 'Menor preço' },
              { value: 'price-desc', label: 'Maior preço' },
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
                  { value: 'available', label: 'Disponível' },
                  { value: 'reserved', label: 'Reservado' },
                  { value: 'sold', label: 'Vendido' },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
              />
            </div>
            
            <div className="w-full sm:w-1/2">
              <Select
                label="Faixa de preço"
                options={[
                  { value: 'all', label: 'Todos os preços' },
                  { value: 'under-500k', label: 'Até R$ 500 mil' },
                  { value: '500k-1m', label: 'R$ 500 mil a R$ 1 milhão' },
                  { value: 'over-1m', label: 'Acima de R$ 1 milhão' },
                ]}
                value={priceFilter}
                onChange={(value) => setPriceFilter(value)}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Properties grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleViewProperty}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              onShareViaWhatsApp={handleShareViaWhatsApp}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          
          {searchTerm || statusFilter !== 'all' || priceFilter !== 'all' ? (
            <>
              <h3 className="text-lg font-medium text-gray-700">Nenhum resultado encontrado</h3>
              <p className="text-gray-500 mb-4">Tente ajustar seus filtros de busca</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriceFilter('all');
              }}>
                Limpar filtros
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-700">Nenhum imóvel cadastrado</h3>
              <p className="text-gray-500 mb-4">Comece adicionando seu primeiro imóvel</p>
              <Link to="/properties/new">
                <Button>Adicionar Imóvel</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;