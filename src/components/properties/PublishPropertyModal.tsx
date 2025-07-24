import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Property } from '../../types';
import { PropertyPublishingService, PublishingPlatform, PublishingResult } from '../../services/propertyPublishing';
import { useAuthStore } from '../../store/auth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface PublishPropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PublishPropertyModal: React.FC<PublishPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PublishingPlatform[]>(['all']);
  const [includePrice, setIncludePrice] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);
  const [customDescription, setCustomDescription] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingResults, setPublishingResults] = useState<PublishingResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const publishingService = PropertyPublishingService.getInstance();

  if (!isOpen) return null;

  const handlePlatformChange = (platform: PublishingPlatform) => {
    if (platform === 'all') {
      setSelectedPlatforms(['all']);
    } else {
      setSelectedPlatforms(prev => {
        const filtered = prev.filter(p => p !== 'all');
        if (filtered.includes(platform)) {
          return filtered.filter(p => p !== platform);
        } else {
          return [...filtered, platform];
        }
      });
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setShowResults(false);

    try {
      const validation = publishingService.validatePropertyForPublishing(property);
      
      if (!validation.isValid) {
        alert(`Erro na validação:\n${validation.errors.join('\n')}`);
        setIsPublishing(false);
        return;
      }

      const options = {
        platforms: selectedPlatforms,
        includePrice,
        includePhotos,
        customDescription: customDescription.trim() || undefined,
        contactInfo: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
        },
      };

      const results = await publishingService.publishProperty(property, options);
      setPublishingResults(results);
      setShowResults(true);
    } catch (error) {
      alert(`Erro ao publicar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const platforms = [
    { id: 'all' as PublishingPlatform, name: 'Todas as Plataformas', color: 'bg-primary-100 text-primary-800' },
    { id: 'olx' as PublishingPlatform, name: 'OLX', color: 'bg-purple-100 text-purple-800' },
    { id: 'zapimoveis' as PublishingPlatform, name: 'ZapImóveis', color: 'bg-blue-100 text-blue-800' },
    { id: 'vivareal' as PublishingPlatform, name: 'VivaReal', color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Anunciar Imóvel</h3>
              <p className="text-sm text-gray-500">{property.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {!showResults ? (
            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecione as plataformas:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <label
                      key={platform.id}
                      className={`
                        flex items-center p-3 border rounded-md cursor-pointer transition-colors
                        ${selectedPlatforms.includes(platform.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => handlePlatformChange(platform.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {platform.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Publishing Options */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Opções de publicação:</h4>
                
                <div className="flex items-center">
                  <input
                    id="include-price"
                    type="checkbox"
                    checked={includePrice}
                    onChange={(e) => setIncludePrice(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-price" className="ml-2 text-sm text-gray-700">
                    Incluir preço no anúncio
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="include-photos"
                    type="checkbox"
                    checked={includePhotos}
                    onChange={(e) => setIncludePhotos(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-photos" className="ml-2 text-sm text-gray-700">
                    Incluir fotos no anúncio
                  </label>
                </div>
              </div>

              {/* Custom Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição personalizada (opcional):
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Deixe em branco para usar a descrição padrão do imóvel"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Informações de contato:</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                  <Input
                    label="Telefone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
                
                <Input
                  label="E-mail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handlePublish}
                  isLoading={isPublishing}
                  icon={<Upload size={16} />}
                  disabled={selectedPlatforms.length === 0 || !contactName || !contactPhone || !contactEmail}
                >
                  {isPublishing ? 'Publicando...' : 'Publicar Anúncio'}
                </Button>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Resultados da Publicação</h4>
              
              <div className="space-y-3">
                {publishingResults.map((result, index) => (
                  <Card key={index} className={`border-l-4 ${result.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          {result.success ? (
                            <CheckCircle size={20} className="text-green-500 mr-2" />
                          ) : (
                            <AlertCircle size={20} className="text-red-500 mr-2" />
                          )}
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {result.platform === 'olx' && 'OLX'}
                              {result.platform === 'zapimoveis' && 'ZapImóveis'}
                              {result.platform === 'vivareal' && 'VivaReal'}
                            </h5>
                            <p className="text-sm text-gray-600">{result.message}</p>
                            {result.adId && (
                              <p className="text-xs text-gray-500 mt-1">ID: {result.adId}</p>
                            )}
                          </div>
                        </div>
                        
                        {result.success && result.adUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<ExternalLink size={14} />}
                            onClick={() => window.open(result.adUrl, '_blank')}
                          >
                            Ver Anúncio
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Publicar Novamente
                </Button>
                <Button onClick={onClose}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishPropertyModal;