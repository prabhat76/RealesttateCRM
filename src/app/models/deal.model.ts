export interface Deal {
  id: string;
  title: string;
  contactId: string;
  propertyId?: string;
  value: number; // Deal value
  commission?: number;
  stage: 'new' | 'qualified' | 'viewing' | 'offer' | 'negotiation' | 'contract' | 'closed-won' | 'closed-lost';
  probability: number; // 0-100%
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  type: 'buy' | 'sell' | 'rent' | 'lease';
  status: 'active' | 'won' | 'lost';
  lostReason?: string;
  assignedTo: string; // Agent ID
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: 'stage_change' | 'note' | 'call' | 'email' | 'meeting' | 'document';
  description: string;
  oldStage?: string;
  newStage?: string;
  createdBy: string;
  createdAt: Date;
}
