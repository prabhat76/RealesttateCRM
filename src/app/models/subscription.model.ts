export interface SubscriptionPlan {
  id: string;
  name: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  price: number;
  billingCycle: 'monthly' | 'annually';
  features: string[];
  limits: {
    maxUsers: number;
    maxLeads: number;
    maxDeals: number;
    maxProperties: number;
    maxStorage: number; // MB
    emailSupport: boolean;
    phoneSupport: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    advancedReports: boolean;
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      '1 user',
      '50 leads per month',
      '10 active deals',
      '20 properties',
      '100 MB storage',
      'Basic reports',
      'Email support'
    ],
    limits: {
      maxUsers: 1,
      maxLeads: 50,
      maxDeals: 10,
      maxProperties: 20,
      maxStorage: 100,
      emailSupport: true,
      phoneSupport: false,
      apiAccess: false,
      customBranding: false,
      advancedReports: false
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    billingCycle: 'monthly',
    features: [
      '5 users',
      'Unlimited leads',
      '100 active deals',
      'Unlimited properties',
      '5 GB storage',
      'Advanced reports',
      'Email & phone support',
      'API access'
    ],
    limits: {
      maxUsers: 5,
      maxLeads: -1, // unlimited
      maxDeals: 100,
      maxProperties: -1,
      maxStorage: 5120,
      emailSupport: true,
      phoneSupport: true,
      apiAccess: true,
      customBranding: false,
      advancedReports: true
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    billingCycle: 'monthly',
    features: [
      '15 users',
      'Unlimited leads & deals',
      'Unlimited properties',
      '20 GB storage',
      'Advanced reports & analytics',
      'Priority support',
      'API access',
      'Custom branding',
      'Team management'
    ],
    limits: {
      maxUsers: 15,
      maxLeads: -1,
      maxDeals: -1,
      maxProperties: -1,
      maxStorage: 20480,
      emailSupport: true,
      phoneSupport: true,
      apiAccess: true,
      customBranding: true,
      advancedReports: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    billingCycle: 'monthly',
    features: [
      'Unlimited users',
      'Unlimited everything',
      'Unlimited storage',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Training & onboarding'
    ],
    limits: {
      maxUsers: -1,
      maxLeads: -1,
      maxDeals: -1,
      maxProperties: -1,
      maxStorage: -1,
      emailSupport: true,
      phoneSupport: true,
      apiAccess: true,
      customBranding: true,
      advancedReports: true
    }
  }
];
