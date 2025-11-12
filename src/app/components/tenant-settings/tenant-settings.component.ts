import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantResolverService } from '../../services/tenant-resolver.service';
import { TenantInstance } from '../../models/tenant.model';
import { CustomField, FormTemplate, EmailTemplate } from '../../models/tenant-settings.model';

@Component({
  selector: 'app-tenant-settings',
  standalone: false,
  templateUrl: './tenant-settings.component.html',
  styleUrls: ['./tenant-settings.component.css']
})
export class TenantSettingsComponent implements OnInit {
  currentTenant: TenantInstance | null = null;
  activeTab: 'branding' | 'features' | 'customFields' | 'forms' | 'email' | 'integrations' = 'branding';
  tabs: ('branding' | 'features' | 'customFields' | 'forms' | 'email' | 'integrations')[] = 
    ['branding', 'features', 'customFields', 'forms', 'email', 'integrations'];
  
  // Branding
  logoFile: File | null = null;
  faviconFile: File | null = null;
  logoPreview: string | null = null;
  faviconPreview: string | null = null;
  
  // Custom Fields
  customFields: CustomField[] = [];
  showCustomFieldModal = false;
  editingField: CustomField | null = null;
  newField: Partial<CustomField> = {
    entityType: 'lead',
    type: 'text',
    required: false,
    showInList: true,
    showInDetail: true
  };
  
  // Form Templates
  formTemplates: FormTemplate[] = [];
  showFormModal = false;
  
  // Email Templates
  emailTemplates: EmailTemplate[] = [];
  showEmailModal = false;
  
  constructor(private tenantResolver: TenantResolverService) {}
  
  ngOnInit(): void {
    this.tenantResolver.currentTenant$.subscribe(tenant => {
      this.currentTenant = tenant;
      if (tenant) {
        this.loadCustomFields();
        this.loadFormTemplates();
        this.loadEmailTemplates();
      }
    });
  }
  
  setActiveTab(tab: 'branding' | 'features' | 'customFields' | 'forms' | 'email' | 'integrations'): void {
    this.activeTab = tab;
  }
  
  // ===== BRANDING =====
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.logoFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.logoFile);
    }
  }
  
  onFaviconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.faviconFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.faviconPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.faviconFile);
    }
  }
  
  saveBranding(): void {
    if (!this.currentTenant) return;
    
    // In production, upload files and save to API
    console.log('Saving branding:', {
      primaryColor: this.currentTenant.branding.primaryColor,
      secondaryColor: this.currentTenant.branding.secondaryColor,
      companyName: this.currentTenant.branding.companyName,
      logo: this.logoFile,
      favicon: this.faviconFile
    });
    
    // Apply immediately
    this.tenantResolver.resolveTenant();
    alert('Branding saved successfully!');
  }
  
  // ===== FEATURES =====
  toggleFeature(feature: keyof TenantInstance['enabledFeatures']): void {
    if (!this.currentTenant) return;
    
    this.currentTenant.enabledFeatures[feature] = !this.currentTenant.enabledFeatures[feature];
    console.log('Feature toggled:', feature, this.currentTenant.enabledFeatures[feature]);
  }
  
  saveFeatures(): void {
    // In production, save to API
    alert('Features saved successfully!');
  }
  
  // ===== CUSTOM FIELDS =====
  loadCustomFields(): void {
    // In production, load from API
    this.customFields = [
      {
        id: '1',
        name: 'property_type',
        label: 'Property Type',
        type: 'select',
        entityType: 'property',
        required: true,
        options: ['Residential', 'Commercial', 'Land', 'Industrial'],
        showInList: true,
        showInDetail: true,
        order: 1,
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'lead_source_details',
        label: 'Lead Source Details',
        type: 'textarea',
        entityType: 'lead',
        required: false,
        showInList: false,
        showInDetail: true,
        order: 2,
        createdAt: new Date()
      }
    ];
  }
  
  openCustomFieldModal(field?: CustomField): void {
    if (field) {
      this.editingField = field;
      this.newField = { ...field };
    } else {
      this.editingField = null;
      this.newField = {
        entityType: 'lead',
        type: 'text',
        required: false,
        showInList: true,
        showInDetail: true
      };
    }
    this.showCustomFieldModal = true;
  }
  
  saveCustomField(): void {
    // In production, save to API
    if (this.editingField) {
      // Update existing
      const index = this.customFields.findIndex(f => f.id === this.editingField!.id);
      if (index !== -1) {
        this.customFields[index] = { ...this.newField } as CustomField;
      }
    } else {
      // Add new
      const field: CustomField = {
        id: Date.now().toString(),
        ...this.newField,
        createdAt: new Date()
      } as CustomField;
      this.customFields.push(field);
    }
    
    this.showCustomFieldModal = false;
    alert('Custom field saved!');
  }
  
  deleteCustomField(id: string): void {
    if (confirm('Delete this custom field? This action cannot be undone.')) {
      this.customFields = this.customFields.filter(f => f.id !== id);
      alert('Custom field deleted!');
    }
  }
  
  // ===== FORM TEMPLATES =====
  loadFormTemplates(): void {
    // In production, load from API
    this.formTemplates = [];
  }
  
  // ===== EMAIL TEMPLATES =====
  loadEmailTemplates(): void {
    // In production, load from API
    this.emailTemplates = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to {{companyName}}!',
        body: '<p>Hi {{firstName}},</p><p>Welcome!</p>',
        type: 'lead_welcome',
        variables: ['firstName', 'lastName', 'companyName'],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  getFeaturesList(): { key: keyof TenantInstance['enabledFeatures']; label: string; category: string }[] {
    return [
      { key: 'leads', label: 'Lead Management', category: 'CRM' },
      { key: 'contacts', label: 'Contact Management', category: 'CRM' },
      { key: 'deals', label: 'Deal Pipeline', category: 'CRM' },
      { key: 'tasks', label: 'Task Management', category: 'CRM' },
      { key: 'calendar', label: 'Calendar', category: 'CRM' },
      { key: 'properties', label: 'Property Listings', category: 'Properties' },
      { key: 'mortgage', label: 'Mortgage Calculator', category: 'Properties' },
      { key: 'analytics', label: 'Advanced Analytics', category: 'Analytics' },
      { key: 'advancedReports', label: 'Advanced Reports', category: 'Analytics' },
      { key: 'emailMarketing', label: 'Email Marketing', category: 'Communication' },
      { key: 'smsNotifications', label: 'SMS Notifications', category: 'Communication' },
      { key: 'apiAccess', label: 'API Access', category: 'Integrations' },
      { key: 'integrations', label: 'Third-party Integrations', category: 'Integrations' },
      { key: 'customBranding', label: 'Custom Branding', category: 'Advanced' },
      { key: 'whiteLabel', label: 'White Label', category: 'Advanced' },
      { key: 'multipleAgents', label: 'Multiple Agents', category: 'Advanced' },
      { key: 'customFields', label: 'Custom Fields', category: 'Advanced' },
      { key: 'mobileApp', label: 'Mobile App Access', category: 'Advanced' }
    ];
  }
  
  getFeaturesByCategory(category: string) {
    return this.getFeaturesList().filter(f => f.category === category);
  }
  
  getCategories(): string[] {
    return ['CRM', 'Properties', 'Analytics', 'Communication', 'Integrations', 'Advanced'];
  }
}
