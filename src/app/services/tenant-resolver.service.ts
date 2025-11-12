import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantInstance } from '../models/tenant.model';
import { SuperadminService } from './superadmin.service';

@Injectable({
  providedIn: 'root'
})
export class TenantResolverService {
  private currentTenantSubject = new BehaviorSubject<TenantInstance | null>(null);
  public currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(private superadminService: SuperadminService) {
    this.resolveTenant();
  }

  /**
   * Resolve tenant based on:
   * 1. Custom domain (e.g., realty.com)
   * 2. Subdomain (e.g., acme.novakeys.com)
   * 3. URL parameter (?tenant=acme)
   * 4. Default/fallback tenant
   */
  resolveTenant(): TenantInstance | null {
    const hostname = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');

    let tenantSlug: string | null = null;

    // Check if custom domain
    if (this.isCustomDomain(hostname)) {
      tenantSlug = this.getTenantByDomain(hostname);
    }
    // Check if subdomain
    else if (this.isSubdomain(hostname)) {
      tenantSlug = this.getSubdomain(hostname);
    }
    // Check URL parameter
    else if (tenantParam) {
      tenantSlug = tenantParam;
    }
    // Default for localhost development
    else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      tenantSlug = 'demo'; // Default demo tenant for development
    }

    if (tenantSlug) {
      const tenant = this.loadTenantBySlug(tenantSlug);
      this.currentTenantSubject.next(tenant);
      
      // Apply tenant branding
      if (tenant) {
        this.applyTenantBranding(tenant);
      }
      
      return tenant;
    }

    return null;
  }

  private isCustomDomain(hostname: string): boolean {
    const platformDomains = ['novakeys.com', 'yourplatform.com', 'localhost'];
    return !platformDomains.some(domain => hostname.includes(domain));
  }

  private isSubdomain(hostname: string): boolean {
    const parts = hostname.split('.');
    const platformDomains = ['novakeys.com', 'yourplatform.com'];
    
    // Check if it's a subdomain like acme.novakeys.com
    return parts.length > 2 && platformDomains.some(domain => hostname.includes(domain));
  }

  private getSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    // Return the first part as the tenant slug
    return parts[0];
  }

  private getTenantByDomain(domain: string): string | null {
    // In production, this would query your database
    // Mock mapping for demonstration
    const domainMapping: { [key: string]: string } = {
      'realty.com': 'acme',
      'bestproperties.io': 'bestprop',
      'luxuryestates.com': 'luxury'
    };

    return domainMapping[domain] || null;
  }

  private loadTenantBySlug(slug: string): TenantInstance | null {
    // First, try to get from SuperadminService (real data)
    const tenants = this.superadminService.getAllTenants();
    const foundTenant = tenants.find(t => 
      t.slug === slug || 
      t.domain === window.location.hostname ||
      t.slug === 'demo' // Fallback for development
    );

    if (foundTenant) {
      return foundTenant;
    }

    // Fallback to demo tenant for development
    if (slug === 'demo' || window.location.hostname === 'localhost') {
      return this.createDemoTenant();
    }

    return null;
  }

  private createDemoTenant(): TenantInstance {
    // Mock demo tenant for development
    return {
      id: 'demo',
      name: 'Demo Real Estate',
      slug: 'demo',
      domain: window.location.hostname,
      status: 'active',
      subscriptionPlan: 'pro',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date('2024-01-15'),
      billingCycle: 'monthly',
      monthlyRevenue: 99,
      ownerName: 'John Demo',
      ownerEmail: 'demo@realty.com',
      ownerPhone: '555-0100',
      contactEmail: 'support@realty.com',
      databaseName: 'demo_db',
      createdBy: 'superadmin',
      branding: {
        logo: 'assets/image.png',
        favicon: 'assets/image.png',
        primaryColor: '#8B0000',
        secondaryColor: '#D4AF37',
        companyName: 'Demo Real Estate',
        customCSS: ''
      },
      enabledFeatures: {
        leads: true,
        contacts: true,
        deals: true,
        properties: true,
        tasks: true,
        calendar: true,
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
        maxUsers: 15,
        maxLeads: -1,
        maxDeals: -1,
        maxProperties: -1,
        maxStorage: 20480,
        maxEmailsPerMonth: 10000,
        maxSMSPerMonth: 1000
      },
      usage: {
        currentUsers: 5,
        currentLeads: 234,
        currentDeals: 45,
        currentProperties: 123,
        currentStorage: 5678,
        emailsSentThisMonth: 456,
        smsSentThisMonth: 89
      },
      settings: {
        emailProvider: 'smtp',
        emailConfig: {
          host: 'smtp.gmail.com',
          port: 587,
          username: 'noreply@realty.com',
          secure: true
        },
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        language: 'en'
      },
      createdAt: new Date('2024-01-15')
    };
  }

  private applyTenantBranding(tenant: TenantInstance): void {
    // Apply primary color
    document.documentElement.style.setProperty('--brand-primary', tenant.branding.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', tenant.branding.secondaryColor);

    // Update page title
    document.title = tenant.branding.companyName + ' CRM';

    // Update favicon
    if (tenant.branding.favicon) {
      this.updateFavicon(tenant.branding.favicon);
    }

    // Inject custom CSS
    if (tenant.branding.customCSS) {
      this.injectCustomCSS(tenant.branding.customCSS);
    }

    // Update meta tags
    this.updateMetaTags(tenant);
  }

  private updateFavicon(faviconUrl: string): void {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  private injectCustomCSS(css: string): void {
    const styleId = 'tenant-custom-css';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }

  private updateMetaTags(tenant: TenantInstance): void {
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `${tenant.branding.companyName} - Real Estate CRM Platform`);

    // Update theme color
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', tenant.branding.primaryColor);
  }

  getCurrentTenant(): TenantInstance | null {
    return this.currentTenantSubject.value;
  }

  hasFeature(feature: keyof TenantInstance['enabledFeatures']): boolean {
    const tenant = this.getCurrentTenant();
    return tenant?.enabledFeatures[feature] ?? false;
  }

  isFeatureEnabled(feature: string): boolean {
    const tenant = this.getCurrentTenant();
    if (!tenant) return false;
    return (tenant.enabledFeatures as any)[feature] === true;
  }

  checkLimit(limitType: keyof TenantInstance['limits'], currentUsage: number): { allowed: boolean; remaining: number } {
    const tenant = this.getCurrentTenant();
    if (!tenant) {
      return { allowed: false, remaining: 0 };
    }

    const limit = tenant.limits[limitType];
    
    // -1 means unlimited
    if (limit === -1) {
      return { allowed: true, remaining: -1 };
    }

    const remaining = limit - currentUsage;
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining)
    };
  }

  /**
   * Switch to a different tenant by slug
   * Useful for superadmin to preview tenant instances
   */
  switchTenant(slug: string): boolean {
    const tenant = this.loadTenantBySlug(slug);
    if (tenant) {
      this.currentTenantSubject.next(tenant);
      this.applyTenantBranding(tenant);
      
      // Update URL parameter
      const url = new URL(window.location.href);
      url.searchParams.set('tenant', slug);
      window.history.pushState({}, '', url.toString());
      
      return true;
    }
    return false;
  }

  /**
   * Get tenant by slug (for superadmin preview)
   */
  getTenantBySlug(slug: string): TenantInstance | null {
    return this.loadTenantBySlug(slug);
  }
}
