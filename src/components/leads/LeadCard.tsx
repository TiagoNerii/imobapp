import React from 'react';
import { Phone, Mail, MessageSquare, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate, formatPhone, generateWhatsAppLink } from '../../utils/formatters';

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

interface LeadCardProps {
  lead: Lead;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'cold' | 'warm' | 'hot') => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'manual': return 'Manual';
      case 'whatsapp': return 'WhatsApp';
      case 'referral': return 'Indicação';
      case 'website': return 'Site';
      case 'other': return 'Outro';
      default: return 'Outro';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'cold': return 'Frio';
      case 'warm': return 'Morno';
      case 'hot': return 'Quente';
      default: return 'Desconhecido';
    }
  };
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'cold': return 'danger';
      case 'warm': return 'warning';
      case 'hot': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <Card className="hover:shadow-card-hover transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Adicionado em {formatDate(new Date(lead.created_at))}</p>
          </div>
          
          <Badge variant={getBadgeVariant(lead.status)}>
            {getStatusLabel(lead.status)}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2" />
            <span>{formatPhone(lead.phone)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={16} className="mr-2" />
            <span>{lead.email}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mr-2">
              {getSourceLabel(lead.source)}
            </span>
          </div>
        </div>
        
        {lead.notes && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-700">{lead.notes}</p>
          </div>
        )}
        
        {/* Status change buttons */}
        <div className="mt-4 flex space-x-2">
          <button 
            className={`w-1/3 h-2 rounded-full transition-colors ${
              lead.status === 'cold' ? 'bg-red-500' : 'bg-gray-200 hover:bg-red-300'
            }`}
            onClick={() => onStatusChange(lead.id, 'cold')}
            title="Marcar como Frio"
          />
          <button 
            className={`w-1/3 h-2 rounded-full transition-colors ${
              lead.status === 'warm' ? 'bg-yellow-500' : 'bg-gray-200 hover:bg-yellow-300'
            }`}
            onClick={() => onStatusChange(lead.id, 'warm')}
            title="Marcar como Morno"
          />
          <button 
            className={`w-1/3 h-2 rounded-full transition-colors ${
              lead.status === 'hot' ? 'bg-green-500' : 'bg-gray-200 hover:bg-green-300'
            }`}
            onClick={() => onStatusChange(lead.id, 'hot')}
            title="Marcar como Quente"
          />
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
        <Button 
          variant="secondary"
          size="sm"
          icon={<MessageSquare size={16} />}
          onClick={() => window.open(generateWhatsAppLink(lead.phone), '_blank')}
        >
          WhatsApp
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          icon={<Eye size={16} />}
          onClick={() => onView(lead.id)}
        >
          Ver
        </Button>
        
        <div className="flex ml-auto space-x-2">
          <Button 
            variant="ghost"
            size="sm"
            icon={<Edit size={16} />}
            onClick={() => onEdit(lead.id)}
          />
          
          <Button 
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => onDelete(lead.id)}
            className="text-red-500 hover:bg-red-50"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;