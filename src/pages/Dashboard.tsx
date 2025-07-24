import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, TrendingUp, DollarSign, Clipboard, 
  Phone, ArrowUpRight, BarChart, PieChart 
} from 'lucide-react';
import { useLeadsStore } from '../store/leads';
import { usePropertiesStore } from '../store/properties';
import { useAuthStore } from '../store/auth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import StatCard from '../components/dashboard/StatCard';
import LeadCard from '../components/leads/LeadCard';
import PropertyCard from '../components/properties/PropertyCard';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { leads, getLeads, updateLeadStatus } = useLeadsStore();
  const { properties, getProperties } = usePropertiesStore();
  
  useEffect(() => {
    if (user) {
      // Load data based on user role
      if (user.role === 'agent') {
        getLeads(user.id);
        getProperties(user.id);
      } else if (user.role === 'agency') {
        // For agencies, load all data from their agents
        getLeads();
        getProperties();
      }
    }
  }, [user]);
  
  // Stats calculations for the current user or agency
  const totalLeads = leads.length;
  const coldLeads = leads.filter(lead => lead.status === 'cold').length;
  const warmLeads = leads.filter(lead => lead.status === 'warm').length;
  const hotLeads = leads.filter(lead => lead.status === 'hot').length;
  
  const totalProperties = properties.length;
  const availableProperties = properties.filter(prop => prop.status === 'available').length;
  
  // Latest leads and properties
  const latestLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const latestProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Chart data for lead status
  const leadStatusData = {
    labels: ['Frios', 'Mornos', 'Quentes'],
    datasets: [
      {
        data: [coldLeads, warmLeads, hotLeads],
        backgroundColor: [
          '#EF4444',  // Red for cold
          '#F59E0B',  // Orange for warm
          '#10B981',  // Green for hot
        ],
        borderColor: [
          '#FFF',
          '#FFF',
          '#FFF',
        ],
        borderWidth: 2,
      },
    ],
  };
  
  // Chart data for leads by source
  const leadsBySource = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const leadSourceLabels = {
    'manual': 'Manual',
    'whatsapp': 'WhatsApp',
    'referral': 'Indicação',
    'website': 'Site',
    'other': 'Outro',
  };
  
  const leadSourceData = {
    labels: Object.keys(leadsBySource).map(source => 
      leadSourceLabels[source as keyof typeof leadSourceLabels] || source
    ),
    datasets: [
      {
        label: 'Leads por origem',
        data: Object.values(leadsBySource),
        backgroundColor: [
          '#60A5FA',  // Blue
          '#34D399',  // Green
          '#A78BFA',  // Purple
          '#FBBF24',  // Yellow
          '#F87171',  // Red
        ],
      },
    ],
  };
  
  // Chart data for monthly leads
  const monthlyLeadsData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Leads',
        data: [12, 15, 18, 14, 22, totalLeads],
        backgroundColor: '#3B82F6',
      },
    ],
  };
  
  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Leads"
          value={totalLeads}
          icon={<Users size={24} />}
          change={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Leads Quentes"
          value={hotLeads}
          icon={<TrendingUp size={24} />}
          iconColor="bg-green-100 text-green-800"
          change={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Imóveis Disponíveis"
          value={availableProperties}
          icon={<Building2 size={24} />}
          iconColor="bg-blue-100 text-blue-800"
        />
        
        <StatCard
          title="Valor em Carteira"
          value={`R$ ${(availableProperties * 150000).toLocaleString('pt-BR')}`}
          icon={<DollarSign size={24} />}
          iconColor="bg-gold-light text-gold-dark"
        />
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart size={18} className="mr-2" />
              Leads por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar 
                data={monthlyLeadsData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <PieChart size={18} className="mr-2" />
                Status dos Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Pie 
                  data={leadStatusData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <PieChart size={18} className="mr-2" />
                Origem dos Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Pie 
                  data={leadSourceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent leads section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Leads Recentes</h2>
          <Link to="/leads">
            <Button 
              variant="outline" 
              size="sm"
              icon={<ArrowUpRight size={16} />}
            >
              Ver Todos
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestLeads.length > 0 ? (
            latestLeads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onView={(id) => console.log('View lead', id)}
                onEdit={(id) => console.log('Edit lead', id)}
                onDelete={(id) => console.log('Delete lead', id)}
                onStatusChange={(id, status) => updateLeadStatus(id, status)}
              />
            ))
          ) : (
            <Card className="col-span-full p-8 text-center">
              <Clipboard size={32} className="mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">Nenhum lead cadastrado</h3>
              <p className="text-gray-500 mb-4">Comece cadastrando seu primeiro lead</p>
              <Link to="/leads/new">
                <Button>Adicionar Lead</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
      
      {/* Recent properties section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Imóveis Recentes</h2>
          <Link to="/properties">
            <Button 
              variant="outline" 
              size="sm"
              icon={<ArrowUpRight size={16} />}
            >
              Ver Todos
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProperties.length > 0 ? (
            latestProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={(id) => console.log('View property', id)}
                onEdit={(id) => console.log('Edit property', id)}
                onDelete={(id) => console.log('Delete property', id)}
                onShareViaWhatsApp={(id) => console.log('Share property', id)}
              />
            ))
          ) : (
            <Card className="col-span-full p-8 text-center">
              <Building2 size={32} className="mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">Nenhum imóvel cadastrado</h3>
              <p className="text-gray-500 mb-4">Comece cadastrando seu primeiro imóvel</p>
              <Link to="/properties/new">
                <Button>Adicionar Imóvel</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Precisa de ajuda para fechar mais negócios?</h2>
            <p className="text-primary-100 mt-2">
              Fale com um de nossos especialistas e descubra como aumentar suas conversões.
            </p>
          </div>
          <Button 
            variant="secondary"
            size="lg"
            icon={<Phone size={18} />}
          >
            Agendar Consultoria
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;