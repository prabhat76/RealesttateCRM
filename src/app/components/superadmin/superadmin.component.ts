import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuperadminService } from '../../services/superadmin.service';
import { TenantInstance, PlatformStats, PLAN_TEMPLATES, PlanTemplate } from '../../models/tenant.model';

@Component({
  selector: 'app-superadmin',
  standalone: false,
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {
  tenants: TenantInstance[] = [];
  filteredTenants: TenantInstance[] = [];
  platformStats: PlatformStats | null = null;
  
  searchQuery: string = '';
  filterStatus: string = 'all';
  filterPlan: string = 'all';
  
  showCreateModal: boolean = false;
  showTenantDetails: TenantInstance | null = null;
  
  newTenant: Partial<TenantInstance> = {
    subscriptionPlan: 'free',
    billingCycle: 'monthly',
    branding: {
      primaryColor: '#8B0000',
      secondaryColor: '#D4AF37',
      companyName: ''
    }
  };
  
  plans = PLAN_TEMPLATES;

  constructor(
    private superadminService: SuperadminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTenants();
    this.loadStats();
  }

  loadTenants(): void {
    this.superadminService.getTenants().subscribe(tenants => {
      this.tenants = tenants;
      this.applyFilters();
    });
  }

  loadStats(): void {
    this.platformStats = this.superadminService.getPlatformStats();
  }

  applyFilters(): void {
    this.filteredTenants = this.tenants.filter(tenant => {
      const statusMatch = this.filterStatus === 'all' || tenant.status === this.filterStatus;
      const planMatch = this.filterPlan === 'all' || tenant.subscriptionPlan === this.filterPlan;
      const searchMatch = !this.searchQuery ||
        tenant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tenant.ownerEmail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return statusMatch && planMatch && searchMatch;
    });

    // Sort by most recent
    this.filteredTenants.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newTenant = {
      subscriptionPlan: 'free',
      billingCycle: 'monthly',
      branding: {
        primaryColor: '#8B0000',
        secondaryColor: '#D4AF37',
        companyName: ''
      }
    };
  }

  createTenant(): void {
    if (this.newTenant.name && this.newTenant.ownerEmail && this.newTenant.ownerName) {
      // Generate slug if not provided
      if (!this.newTenant.slug) {
        this.newTenant.slug = this.newTenant.name.toLowerCase().replace(/\s+/g, '');
      }
      
      this.newTenant.branding!.companyName = this.newTenant.name;
      this.superadminService.createTenant(this.newTenant);
      this.closeCreateModal();
      this.loadTenants();
      this.loadStats();
    }
  }

  selectPlan(planId: string): void {
    this.newTenant.subscriptionPlan = planId as any;
  }

  viewTenant(tenant: TenantInstance): void {
    this.showTenantDetails = tenant;
  }

  closeTenantDetails(): void {
    this.showTenantDetails = null;
  }

  suspendTenant(id: string): void {
    if (confirm('Are you sure you want to suspend this tenant? They will lose access immediately.')) {
      this.superadminService.suspendTenant(id, 'Suspended by superadmin');
      this.loadTenants();
      this.loadStats();
    }
  }

  activateTenant(id: string): void {
    this.superadminService.activateTenant(id);
    this.loadTenants();
    this.loadStats();
  }

  deleteTenant(id: string): void {
    if (confirm('Are you sure you want to DELETE this tenant? This action cannot be undone!')) {
      const confirmDelete = prompt('Type "DELETE" to confirm:');
      if (confirmDelete === 'DELETE') {
        this.superadminService.deleteTenant(id);
        this.loadTenants();
        this.loadStats();
        this.closeTenantDetails();
      }
    }
  }

  toggleFeature(tenant: TenantInstance, feature: keyof TenantInstance['enabledFeatures']): void {
    const currentValue = tenant.enabledFeatures[feature];
    this.superadminService.updateTenantFeatures(tenant.id, {
      [feature]: !currentValue
    });
    this.loadTenants();
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'active': 'status-active',
      'trial': 'status-trial',
      'suspended': 'status-suspended',
      'expired': 'status-expired'
    };
    return classes[status] || '';
  }

  getPlanClass(plan: string): string {
    const classes: { [key: string]: string } = {
      'free': 'plan-free',
      'basic': 'plan-basic',
      'pro': 'plan-pro',
      'enterprise': 'plan-enterprise'
    };
    return classes[plan] || '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getDaysUntilTrialEnd(tenant: TenantInstance): number {
    if (!tenant.trialEndsAt) return 0;
    const now = new Date();
    const end = new Date(tenant.trialEndsAt);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getUsagePercentage(current: number, max: number): number {
    if (max === -1) return 0; // Unlimited
    return Math.round((current / max) * 100);
  }

  isOverLimit(current: number, max: number): boolean {
    if (max === -1) return false; // Unlimited
    return current >= max;
  }

  adjustColor(color: string, amount: number): string {
    // Simple color adjustment - darken/lighten hex color
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
