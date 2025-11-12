import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantInstance, PlatformStats, TenantActivity, PLAN_TEMPLATES } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  private tenantsSubject = new BehaviorSubject<TenantInstance[]>([]);
  public tenants$ = this.tenantsSubject.asObservable();

  private mockTenants: TenantInstance[] = [
    {
      id: 't1',
      name: 'NOVA KEYS Real Estate',
      slug: 'novakeys',
      domain: 'novakeys.com',
      status: 'active',
      branding: {
        logo: 'assets/image.png',
        primaryColor: '#8B0000',
        secondaryColor: '#D4AF37',
        companyName: 'NOVA KEYS',
        faviconUrl: 'assets/favicon.ico'
      },
      subscriptionPlan: 'pro',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(2025, 9, 1),
      billingCycle: 'monthly',
      monthlyRevenue: 99,
      enabledFeatures: {
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
      },
      usage: {
        currentUsers: 3,
        currentLeads: 124,
        currentDeals: 23,
        currentProperties: 45,
        currentStorage: 2340,
        emailsSentThisMonth: 432,
        smsSentThisMonth: 87
      },
      ownerEmail: 'admin@novakeys.com',
      ownerName: 'John Doe',
      ownerPhone: '+1-555-0100',
      databaseName: 'novakeys_db',
      apiKey: 'nk_live_abc123xyz789',
      createdAt: new Date(2025, 9, 1),
      createdBy: 'superadmin1',
      lastAccessedAt: new Date(2025, 10, 13),
      contactEmail: 'support@novakeys.com',
      contactPhone: '+1-555-0100',
      billingEmail: 'billing@novakeys.com'
    },
    {
      id: 't2',
      name: 'Premier Properties Group',
      slug: 'premierprops',
      status: 'active',
      branding: {
        primaryColor: '#1e3a8a',
        secondaryColor: '#fbbf24',
        companyName: 'Premier Properties'
      },
      subscriptionPlan: 'basic',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(2025, 8, 15),
      billingCycle: 'monthly',
      monthlyRevenue: 49,
      enabledFeatures: {
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
      },
      usage: {
        currentUsers: 4,
        currentLeads: 89,
        currentDeals: 12,
        currentProperties: 67,
        currentStorage: 1240,
        emailsSentThisMonth: 876,
        smsSentThisMonth: 0
      },
      ownerEmail: 'contact@premierprops.com',
      ownerName: 'Sarah Johnson',
      databaseName: 'premierprops_db',
      createdAt: new Date(2025, 8, 15),
      createdBy: 'superadmin1',
      lastAccessedAt: new Date(2025, 10, 12),
      contactEmail: 'contact@premierprops.com'
    },
    {
      id: 't3',
      name: 'Luxury Realty Inc',
      slug: 'luxuryrealty',
      status: 'trial',
      branding: {
        primaryColor: '#059669',
        secondaryColor: '#fcd34d',
        companyName: 'Luxury Realty'
      },
      subscriptionPlan: 'pro',
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(2025, 10, 28),
      subscriptionStartDate: new Date(2025, 10, 1),
      billingCycle: 'monthly',
      monthlyRevenue: 0,
      enabledFeatures: {
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
      },
      usage: {
        currentUsers: 1,
        currentLeads: 23,
        currentDeals: 5,
        currentProperties: 12,
        currentStorage: 456,
        emailsSentThisMonth: 45,
        smsSentThisMonth: 12
      },
      ownerEmail: 'info@luxuryrealty.com',
      ownerName: 'Michael Brown',
      databaseName: 'luxuryrealty_db',
      createdAt: new Date(2025, 10, 1),
      createdBy: 'superadmin1',
      lastAccessedAt: new Date(2025, 10, 13),
      contactEmail: 'info@luxuryrealty.com'
    }
  ];

  constructor() {
    this.tenantsSubject.next(this.mockTenants);
  }

  getTenants(): Observable<TenantInstance[]> {
    return this.tenants$;
  }

  getTenantById(id: string): TenantInstance | undefined {
    return this.mockTenants.find(t => t.id === id);
  }

  getTenantBySlug(slug: string): TenantInstance | undefined {
    return this.mockTenants.find(t => t.slug === slug);
  }

  getAllTenants(): TenantInstance[] {
    return [...this.mockTenants];
  }

  createTenant(tenant: Partial<TenantInstance>): TenantInstance {
    const plan = PLAN_TEMPLATES.find(p => p.id === tenant.subscriptionPlan) || PLAN_TEMPLATES[0];
    
    const newTenant: TenantInstance = {
      id: 't' + Date.now(),
      name: tenant.name || '',
      slug: tenant.slug || tenant.name?.toLowerCase().replace(/\s+/g, '') || '',
      domain: tenant.domain,
      status: 'trial',
      branding: {
        primaryColor: tenant.branding?.primaryColor || '#8B0000',
        secondaryColor: tenant.branding?.secondaryColor || '#D4AF37',
        companyName: tenant.name || '',
        logo: tenant.branding?.logo,
        faviconUrl: tenant.branding?.faviconUrl
      },
      subscriptionPlan: tenant.subscriptionPlan || 'free',
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      subscriptionStartDate: new Date(),
      billingCycle: tenant.billingCycle || 'monthly',
      monthlyRevenue: 0,
      enabledFeatures: plan.features as TenantInstance['enabledFeatures'],
      limits: plan.limits,
      usage: {
        currentUsers: 1,
        currentLeads: 0,
        currentDeals: 0,
        currentProperties: 0,
        currentStorage: 0,
        emailsSentThisMonth: 0,
        smsSentThisMonth: 0
      },
      ownerEmail: tenant.ownerEmail || '',
      ownerName: tenant.ownerName || '',
      ownerPhone: tenant.ownerPhone,
      databaseName: `${tenant.slug}_db`,
      apiKey: `nk_${tenant.subscriptionStatus}_${Date.now()}`,
      createdAt: new Date(),
      createdBy: 'superadmin1',
      contactEmail: tenant.contactEmail || tenant.ownerEmail || '',
      contactPhone: tenant.contactPhone,
      billingEmail: tenant.billingEmail
    };

    this.mockTenants.unshift(newTenant);
    this.tenantsSubject.next([...this.mockTenants]);
    return newTenant;
  }

  updateTenant(id: string, updates: Partial<TenantInstance>): TenantInstance | undefined {
    const index = this.mockTenants.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTenants[index] = {
        ...this.mockTenants[index],
        ...updates
      };
      this.tenantsSubject.next([...this.mockTenants]);
      return this.mockTenants[index];
    }
    return undefined;
  }

  updateTenantFeatures(id: string, features: Partial<TenantInstance['enabledFeatures']>): TenantInstance | undefined {
    const tenant = this.getTenantById(id);
    if (tenant) {
      return this.updateTenant(id, {
        enabledFeatures: {
          ...tenant.enabledFeatures,
          ...features
        }
      });
    }
    return undefined;
  }

  suspendTenant(id: string, reason?: string): boolean {
    const updated = this.updateTenant(id, { status: 'suspended', notes: reason });
    return !!updated;
  }

  activateTenant(id: string): boolean {
    const updated = this.updateTenant(id, { status: 'active' });
    return !!updated;
  }

  deleteTenant(id: string): boolean {
    const index = this.mockTenants.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTenants.splice(index, 1);
      this.tenantsSubject.next([...this.mockTenants]);
      return true;
    }
    return false;
  }

  getPlatformStats(): PlatformStats {
    const total = this.mockTenants.length;
    const active = this.mockTenants.filter(t => t.status === 'active').length;
    const trial = this.mockTenants.filter(t => t.status === 'trial').length;
    const suspended = this.mockTenants.filter(t => t.status === 'suspended').length;
    
    const totalRevenue = this.mockTenants
      .filter(t => t.status === 'active')
      .reduce((sum, t) => sum + t.monthlyRevenue, 0);
    
    const totalUsers = this.mockTenants.reduce((sum, t) => sum + t.usage.currentUsers, 0);
    const totalLeads = this.mockTenants.reduce((sum, t) => sum + t.usage.currentLeads, 0);
    const totalDeals = this.mockTenants.reduce((sum, t) => sum + t.usage.currentDeals, 0);
    const storageUsed = this.mockTenants.reduce((sum, t) => sum + t.usage.currentStorage, 0) / 1024; // Convert to GB

    return {
      totalTenants: total,
      activeTenants: active,
      trialTenants: trial,
      suspendedTenants: suspended,
      totalRevenue: totalRevenue * 12, // Annual
      monthlyRevenue: totalRevenue,
      totalUsers,
      totalLeads,
      totalDeals,
      storageUsed,
      tenantsByPlan: {
        free: this.mockTenants.filter(t => t.subscriptionPlan === 'free').length,
        basic: this.mockTenants.filter(t => t.subscriptionPlan === 'basic').length,
        pro: this.mockTenants.filter(t => t.subscriptionPlan === 'pro').length,
        enterprise: this.mockTenants.filter(t => t.subscriptionPlan === 'enterprise').length,
        custom: this.mockTenants.filter(t => t.subscriptionPlan === 'custom').length
      },
      recentSignups: this.mockTenants.filter(t => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return t.createdAt >= thirtyDaysAgo;
      }).length,
      churnRate: 2.5, // Mock
      growthRate: 15.3 // Mock
    };
  }
}
