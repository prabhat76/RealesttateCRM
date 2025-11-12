export interface TenantSettings {
  // Email Configuration
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
  emailConfig: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    secure?: boolean;
    apiKey?: string;
  };
  emailFromName?: string;
  emailFromAddress?: string;
  emailReplyTo?: string;

  // Localization
  timezone: string;
  dateFormat: string;
  timeFormat?: '12h' | '24h';
  currency: string;
  language: string;
  firstDayOfWeek?: 'sunday' | 'monday';

  // Notifications
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };

  // Integrations
  integrations?: {
    zapier?: {
      enabled: boolean;
      apiKey?: string;
    };
    webhooks?: {
      enabled: boolean;
      endpoints?: WebhookEndpoint[];
    };
    googleCalendar?: {
      enabled: boolean;
      clientId?: string;
    };
    googleMaps?: {
      enabled: boolean;
      apiKey?: string;
    };
  };

  // Security
  security?: {
    twoFactorAuth: boolean;
    sessionTimeout: number; // minutes
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    ipWhitelist?: string[];
  };

  // Features Toggle
  features?: {
    [key: string]: boolean;
  };
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'textarea' | 'url' | 'currency';
  entityType: 'lead' | 'contact' | 'deal' | 'property';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select/multiselect
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customRule?: string;
  };
  placeholder?: string;
  helpText?: string;
  showInList?: boolean;
  showInDetail?: boolean;
  order: number;
  createdAt: Date;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  entityType: 'lead' | 'contact' | 'deal' | 'property';
  fields: FormField[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  customFieldId?: string; // Reference to custom field
  label: string;
  type: string;
  required: boolean;
  order: number;
  width?: 'full' | 'half' | 'third';
  conditional?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
}

export interface BrandingAssets {
  logo?: File | string;
  favicon?: File | string;
  loginBackground?: File | string;
  emailHeader?: File | string;
  emailFooter?: File | string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  background?: string;
  text?: string;
  border?: string;
}

export interface TenantCustomization {
  tenantId: string;
  branding: {
    colors: ColorScheme;
    fonts?: {
      heading?: string;
      body?: string;
    };
    assets: BrandingAssets;
    customCSS?: string;
    customJS?: string;
  };
  customFields: CustomField[];
  formTemplates: FormTemplate[];
  emailTemplates?: EmailTemplate[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // HTML content
  type: 'lead_welcome' | 'lead_followup' | 'deal_update' | 'appointment_reminder' | 'custom';
  variables: string[]; // Available variables like {{firstName}}, {{propertyAddress}}
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
