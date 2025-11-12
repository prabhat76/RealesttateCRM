import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Auth Components
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';

// Dashboard Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

// Property Components
import { BuyPropertyComponent } from './components/properties/buy-property.component';
import { SellPropertyComponent } from './components/properties/sell-property.component';
import { MortgageComponent } from './components/properties/mortgage.component';

// CRM Components
import { LeadsComponent } from './components/leads/leads.component';
import { SuperadminComponent } from './components/superadmin/superadmin.component';
import { TenantSettingsComponent } from './components/tenant-settings/tenant-settings.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';

// Services
import { AuthService } from './services/auth.service';
import { LeadService } from './services/lead.service';
import { DealService } from './services/deal.service';
import { TaskService } from './services/task.service';
import { SuperadminService } from './services/superadmin.service';
import { TenantResolverService } from './services/tenant-resolver.service';
import { StorageService } from './services/storage.service';
import { CacheService } from './services/cache.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    BuyPropertyComponent,
    SellPropertyComponent,
    MortgageComponent,
    LeadsComponent,
    SuperadminComponent,
    TenantSettingsComponent,
    AnalyticsDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatBadgeModule
  ],
  providers: [
    AuthService, 
    LeadService, 
    DealService, 
    TaskService, 
    SuperadminService, 
    TenantResolverService,
    StorageService,
    CacheService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
