import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

// Services
import { AuthService } from './services/auth.service';
import { LeadService } from './services/lead.service';
import { DealService } from './services/deal.service';
import { TaskService } from './services/task.service';
import { SuperadminService } from './services/superadmin.service';
import { TenantResolverService } from './services/tenant-resolver.service';

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
    TenantSettingsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService, LeadService, DealService, TaskService, SuperadminService, TenantResolverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
