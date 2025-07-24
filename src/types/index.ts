// User types
export type UserRole = 'agent' | 'agency' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  photoUrl?: string;
  createdAt: Date;
}

export interface Agent extends User {
  role: 'agent';
  agencyId?: string;
  leadsCount: number;
  conversionRate?: number;
}

export interface Agency extends User {
  role: 'agency';
  agents: string[];
}

// Lead types
export type LeadStatus = 'cold' | 'warm' | 'hot';
export type LeadSource = 'manual' | 'whatsapp' | 'referral' | 'website' | 'other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  agentId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Property types
export type PropertyStatus = 'available' | 'reserved' | 'sold';

export interface Property {
  id: string;
  title: string;
  description: string;
  salePrice: number;
  appraisalValue?: number;
  location: {
    address?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    builtArea: number;
    totalArea: number;
  };
  benefits: string[];
  photos: string[];
  status: PropertyStatus;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription types
export type SubscriptionPlan = 'free' | 'agent-premium' | 'agency-premium';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

// Message template types
export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  userId: string; // Owner of the template
  type: 'greeting' | 'documents' | 'visit' | 'property' | 'custom';
}