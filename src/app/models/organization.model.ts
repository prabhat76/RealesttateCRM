export interface Organization {
  id: string;
  name: string;
  type: 'agency' | 'brokerage' | 'individual';
  logo?: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  subscriptionPlan: 'free' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  subscriptionStartDate: Date;
  subscriptionEndDate?: Date;
  limits: {
    maxUsers: number;
    maxLeads: number;
    maxDeals: number;
    maxProperties: number;
    maxStorage: number; // MB
  };
  usage: {
    currentUsers: number;
    currentLeads: number;
    currentDeals: number;
    currentProperties: number;
    currentStorage: number; // MB
  };
  settings: {
    currency: string;
    timezone: string;
    dateFormat: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'admin' | 'agent' | 'viewer';
  permissions: string[];
  status: 'active' | 'invited' | 'suspended';
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt: Date;
}
