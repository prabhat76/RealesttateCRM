export interface TenantInstance {
  id: string;
  name: string;
  slug: string; // subdomain or unique identifier
  domain?: string; // custom domain if provided
  status: 'active' | 'suspended' | 'trial' | 'expired';
  
  // Branding
  branding: {
    logo?: string;
    favicon?: string;
    faviconUrl?: string; // deprecated, use favicon
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    customCSS?: string;
    customJS?: string;
    loginBackground?: string;
  };
  
  // Subscription
  subscriptionPlan: 'free' | 'basic' | 'pro' | 'enterprise' | 'custom';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: Date;
  subscriptionStartDate: Date;
  subscriptionEndDate?: Date;
  billingCycle: 'monthly' | 'annually';
  monthlyRevenue: number;
  
  // Features - Superadmin controls what features this tenant can access
  enabledFeatures: {
    leads: boolean;
    contacts: boolean;
    deals: boolean;
    tasks: boolean;
    calendar: boolean;
    properties: boolean;
    mortgage: boolean;
    analytics: boolean;
    emailMarketing: boolean;
    smsNotifications: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    whiteLabel: boolean;
    multipleAgents: boolean;
    advancedReports: boolean;
    customFields: boolean;
    integrations: boolean;
    mobileApp: boolean;
  };
  
  // Limits
  limits: {
    maxUsers: number;
    maxLeads: number; // -1 for unlimited
    maxDeals: number;
    maxProperties: number;
    maxStorage: number; // MB
    maxEmailsPerMonth: number;
    maxSMSPerMonth: number;
  };
  
  // Usage
  usage: {
    currentUsers: number;
    currentLeads: number;
    currentDeals: number;
    currentProperties: number;
    currentStorage: number;
    emailsSentThisMonth: number;
    smsSentThisMonth: number;
  };
  
  // Owner Info
  ownerEmail: string;
  ownerName: string;
  ownerPhone?: string;
  
  // Settings
  settings?: {
    emailProvider?: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
    emailConfig?: any;
    timezone?: string;
    dateFormat?: string;
    currency?: string;
    language?: string;
  };
  
  // Database & Tech
  databaseName?: string;
  apiKey?: string;
  webhookUrl?: string;
  
  // Metadata
  createdAt: Date;
  createdBy: string; // Superadmin user ID
  lastAccessedAt?: Date;
  notes?: string;
  
  // Contact
  contactEmail: string;
  contactPhone?: string;
  billingEmail?: string;
}

export interface SuperAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'superadmin';
  permissions: string[];
  avatar?: string;
  phone?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  twoFactorEnabled: boolean;
}

export interface TenantActivity {
  id: string;
  tenantId: string;
  tenantName: string;
  action: 'created' | 'suspended' | 'activated' | 'upgraded' | 'downgraded' | 'feature_enabled' | 'feature_disabled' | 'deleted';
  description: string;
  performedBy: string;
  performedByName: string;
  metadata?: any;
  createdAt: Date;
}

export interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  totalLeads: number;
  totalDeals: number;
  storageUsed: number; // GB
  
  tenantsByPlan: {
    free: number;
    basic: number;
    pro: number;
    enterprise: number;
    custom: number;
  };
  
  recentSignups: number; // last 30 days
  churnRate: number;
  growthRate: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  isGlobal: boolean; // If true, can be toggled globally for all tenants
  defaultEnabled: boolean;
  category: 'crm' | 'properties' | 'communication' | 'analytics' | 'integrations' | 'advanced';
}

export const AVAILABLE_FEATURES: FeatureFlag[] = [
  { id: 'f1', name: 'Lead Management', key: 'leads', description: 'Capture and manage leads', isGlobal: false, defaultEnabled: true, category: 'crm' },
  { id: 'f2', name: 'Contact Management', key: 'contacts', description: 'Full contact database', isGlobal: false, defaultEnabled: true, category: 'crm' },
  { id: 'f3', name: 'Deal Pipeline', key: 'deals', description: 'Sales pipeline and deal tracking', isGlobal: false, defaultEnabled: true, category: 'crm' },
  { id: 'f4', name: 'Task Management', key: 'tasks', description: 'Tasks and calendar', isGlobal: false, defaultEnabled: true, category: 'crm' },
  { id: 'f5', name: 'Property Listings', key: 'properties', description: 'Property management', isGlobal: false, defaultEnabled: true, category: 'properties' },
  { id: 'f6', name: 'Mortgage Calculator', key: 'mortgage', description: 'Mortgage calculations', isGlobal: false, defaultEnabled: true, category: 'properties' },
  { id: 'f7', name: 'Advanced Analytics', key: 'analytics', description: 'Reports and analytics', isGlobal: false, defaultEnabled: false, category: 'analytics' },
  { id: 'f8', name: 'Email Marketing', key: 'emailMarketing', description: 'Email campaigns', isGlobal: false, defaultEnabled: false, category: 'communication' },
  { id: 'f9', name: 'SMS Notifications', key: 'smsNotifications', description: 'SMS messaging', isGlobal: false, defaultEnabled: false, category: 'communication' },
  { id: 'f10', name: 'API Access', key: 'apiAccess', description: 'REST API access', isGlobal: false, defaultEnabled: false, category: 'integrations' },
  { id: 'f11', name: 'Custom Branding', key: 'customBranding', description: 'Custom colors and logo', isGlobal: false, defaultEnabled: false, category: 'advanced' },
  { id: 'f12', name: 'White Label', key: 'whiteLabel', description: 'Remove platform branding', isGlobal: false, defaultEnabled: false, category: 'advanced' },
  { id: 'f13', name: 'Multiple Agents', key: 'multipleAgents', description: 'Team collaboration', isGlobal: false, defaultEnabled: true, category: 'crm' },
  { id: 'f14', name: 'Advanced Reports', key: 'advancedReports', description: 'Custom reports', isGlobal: false, defaultEnabled: false, category: 'analytics' },
  { id: 'f15', name: 'Custom Fields', key: 'customFields', description: 'Custom data fields', isGlobal: false, defaultEnabled: false, category: 'advanced' },
  { id: 'f16', name: 'Integrations', key: 'integrations', description: 'Third-party integrations', isGlobal: false, defaultEnabled: false, category: 'integrations' },
  { id: 'f17', name: 'Mobile App Access', key: 'mobileApp', description: 'Mobile application', isGlobal: false, defaultEnabled: false, category: 'advanced' }
];

export interface PlanTemplate {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annually';
  features: { [key: string]: boolean };
  limits: {
    maxUsers: number;
    maxLeads: number;
    maxDeals: number;
    maxProperties: number;
    maxStorage: number;
    maxEmailsPerMonth: number;
    maxSMSPerMonth: number;
  };
  popular?: boolean;
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: {
      leads: true,
      contacts: true,
      deals: false,
      tasks: true,
      calendar: true,
      properties: true,
      mortgage: true,
      analytics: false,
      emailMarketing: false,
      smsNotifications: false,
      apiAccess: false,
      customBranding: false,
      whiteLabel: false,
      multipleAgents: false,
      advancedReports: false,
      customFields: false,
      integrations: false,
      mobileApp: false
    },
    limits: {
      maxUsers: 1,
      maxLeads: 50,
      maxDeals: 10,
      maxProperties: 20,
      maxStorage: 100,
      maxEmailsPerMonth: 100,
      maxSMSPerMonth: 0
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    billingCycle: 'monthly',
    features: {
      leads: true,
      contacts: true,
      deals: true,
      tasks: true,
      calendar: true,
      properties: true,
      mortgage: true,
      analytics: true,
      emailMarketing: true,
      smsNotifications: false,
      apiAccess: true,
      customBranding: false,
      whiteLabel: false,
      multipleAgents: true,
      advancedReports: false,
      customFields: false,
      integrations: true,
      mobileApp: false
    },
    limits: {
      maxUsers: 5,
      maxLeads: -1,
      maxDeals: 100,
      maxProperties: -1,
      maxStorage: 5120,
      maxEmailsPerMonth: 2000,
      maxSMSPerMonth: 100
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    billingCycle: 'monthly',
    popular: true,
    features: {
      leads: true,
      contacts: true,
      deals: true,
      tasks: true,
      calendar: true,
      properties: true,
      mortgage: true,
      analytics: true,
      emailMarketing: true,
      smsNotifications: true,
      apiAccess: true,
      customBranding: true,
      whiteLabel: false,
      multipleAgents: true,
      advancedReports: true,
      customFields: true,
      integrations: true,
      mobileApp: true
    },
    limits: {
      maxUsers: 15,
      maxLeads: -1,
      maxDeals: -1,
      maxProperties: -1,
      maxStorage: 20480,
      maxEmailsPerMonth: 10000,
      maxSMSPerMonth: 500
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    billingCycle: 'monthly',
    features: {
      leads: true,
      contacts: true,
      deals: true,
      tasks: true,
      calendar: true,
      properties: true,
      mortgage: true,
      analytics: true,
      emailMarketing: true,
      smsNotifications: true,
      apiAccess: true,
      customBranding: true,
      whiteLabel: true,
      multipleAgents: true,
      advancedReports: true,
      customFields: true,
      integrations: true,
      mobileApp: true
    },
    limits: {
      maxUsers: -1,
      maxLeads: -1,
      maxDeals: -1,
      maxProperties: -1,
      maxStorage: -1,
      maxEmailsPerMonth: -1,
      maxSMSPerMonth: -1
    }
  }
];
