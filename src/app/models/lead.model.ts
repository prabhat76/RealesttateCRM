export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'advertisement' | 'walk-in' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  type: 'buyer' | 'seller' | 'both';
  budget?: number;
  interestedIn?: string; // Property type or location
  notes?: string;
  assignedTo?: string; // Agent ID
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  convertedToDealId?: string;
  lastContactedAt?: Date;
  score?: number; // Lead score 0-100
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  createdBy: string;
  createdAt: Date;
}
