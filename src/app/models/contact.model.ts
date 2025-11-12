export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  type: 'buyer' | 'seller' | 'landlord' | 'tenant' | 'investor';
  tags: string[];
  notes?: string;
  assignedTo?: string; // Agent ID
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  properties?: string[]; // Property IDs
  deals?: string[]; // Deal IDs
  preferredContactMethod?: 'email' | 'phone' | 'sms';
}

export interface ContactNote {
  id: string;
  contactId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}
