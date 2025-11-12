export interface Activity {
  id: string;
  type: 'call' | 'email' | 'sms' | 'meeting' | 'note' | 'task' | 'deal_update' | 'property_update';
  title: string;
  description: string;
  relatedTo?: {
    type: 'lead' | 'contact' | 'deal' | 'property';
    id: string;
    name: string;
  };
  createdBy: string;
  createdByName: string;
  organizationId: string;
  createdAt: Date;
  metadata?: any;
}
