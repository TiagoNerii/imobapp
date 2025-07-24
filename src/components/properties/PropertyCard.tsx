import React, { useState } from 'react';
import { 
  MapPin, Home, Ruler, Car, Bath, Bed, Heart, Share2, Eye, Edit, Trash2, Upload 
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Property } from '../../types';
import { formatCurrency, formatDate, getPropertyStatusColor } from '../../utils/formatters';
import PublishPropertyModal from './PublishPropertyModal';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShareViaWhatsApp: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onView,
  onEdit,
  onDelete,
  onShareViaWhatsApp,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [showPublishModal, setShowPublishModal] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'sold': return 'default';
      default: return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'reserved': return 'Reservado';
      case 'sold': return 'Vendido';
      default: return 'Desconhecido';
    }
  };
  
  // Get the first photo or use a placeholder
  const coverImage = property.photos.length > 0 
    ? property.photos[0] 
    : 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg';
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
        {/* Property image */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={coverImage} 
            alt={property.title} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex space-x-2">
            <Badge variant={getStatusBadgeVariant(property.status)}>
              {getStatusLabel(property.status)}
            </Badge>
          </div>
          {onToggleFavorite && (
            <button 
              className={`
                absolute top-3 right-3 p-2 rounded-full 
                ${isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/70 text-gray-700 hover:bg-white'}
              `}
              onClick={() => onToggleFavorite(property.id)}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        
        <CardContent className="p-5">
          <div className="mb-3">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
            </div>
            <p className="text-primary-800 font-bold text-xl mt-1">
              {formatCurrency(property.salePrice)}
            </p>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            <span className="line-clamp-1">
              {property.location.neighborhood}, {property.location.city}/{property.location.state}
            </span>
          </div>
          
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="px-2 w-1/3 mb-2">
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-md">
                <div className="flex items-center text-primary-800">
                  <Bed size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Quartos</p>
                <p className="font-semibold text-sm">{property.features.bedrooms}</p>
              </div>
            </div>
            
            <div className="px-2 w-1/3 mb-2">
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-md">
                <div className="flex items-center text-primary-800">
                  <Bath size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Banheiros</p>
                <p className="font-semibold text-sm">{property.features.bathrooms}</p>
              </div>
            </div>
            
            <div className="px-2 w-1/3 mb-2">
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-md">
                <div className="flex items-center text-primary-800">
                  <Car size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Vagas</p>
                <p className="font-semibold text-sm">{property.features.parkingSpaces}</p>
              </div>
            </div>
            
            <div className="px-2 w-1/2 mb-2">
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-md">
                <div className="flex items-center text-primary-800">
                  <Home size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Área Construída</p>
                <p className="font-semibold text-sm">{property.features.builtArea} m²</p>
              </div>
            </div>
            
            <div className="px-2 w-1/2 mb-2">
              <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-md">
                <div className="flex items-center text-primary-800">
                  <Ruler size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Área Total</p>
                <p className="font-semibold text-sm">{property.features.totalArea} m²</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-2 mb-2">{property.description}</p>
          
          <div className="text-xs text-gray-500">
            Adicionado em {formatDate(property.createdAt)}
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
          <Button 
            variant="outline"
            size="sm"
            icon={<Share2 size={16} />}
            onClick={() => onShareViaWhatsApp(property.id)}
          >
            Compartilhar
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            icon={<Upload size={16} />}
            onClick={() => setShowPublishModal(true)}
          >
            Anunciar
          </Button>
          
          <Button 
            variant="secondary"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => onView(property.id)}
          >
            Ver Detalhes
          </Button>
          
          <div className="flex ml-auto space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              icon={<Edit size={16} />}
              onClick={() => onEdit(property.id)}
            />
            
            <Button 
              variant="ghost"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() => onDelete(property.id)}
              className="text-red-500 hover:bg-red-50"
            />
          </div>
        </CardFooter>
      </Card>

      {/* Publish Property Modal */}
      <PublishPropertyModal
        property={property}
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />
    </>
  );
};

export default PropertyCard;