// Format currency values to BRL
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format date to Brazilian format
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

// Format phone numbers
export const formatPhone = (phone: string): string => {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format according to Brazilian phone number pattern
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Return original if it doesn't match expected formats
  return phone;
};

// Generate WhatsApp link
export const generateWhatsAppLink = (phone: string, message?: string): string => {
  // Clean phone number (keep only numbers)
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Add country code if missing (assuming Brazil)
  const phoneWithCountry = cleanedPhone.startsWith('55') ? cleanedPhone : `55${cleanedPhone}`;
  
  // Create WhatsApp link with encoded message
  if (message) {
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  }
  
  return `https://wa.me/${phoneWithCountry}`;
};

// Get color class based on lead status
export const getLeadStatusColor = (status: 'cold' | 'warm' | 'hot'): string => {
  switch (status) {
    case 'cold':
      return 'bg-status-cold';
    case 'warm':
      return 'bg-status-warm';
    case 'hot':
      return 'bg-status-hot';
    default:
      return 'bg-gray-400';
  }
};

// Get color class based on property status
export const getPropertyStatusColor = (status: 'available' | 'reserved' | 'sold'): string => {
  switch (status) {
    case 'available':
      return 'bg-status-available';
    case 'reserved':
      return 'bg-status-reserved';
    case 'sold':
      return 'bg-status-sold';
    default:
      return 'bg-gray-400';
  }
};