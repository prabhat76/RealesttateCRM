export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'viewing' | 'paperwork' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: Date;
  completedAt?: Date;
  assignedTo: string; // Agent ID
  createdBy: string;
  relatedTo?: {
    type: 'lead' | 'contact' | 'deal' | 'property';
    id: string;
  };
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  reminder?: Date;
}
