import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BuyPropertyComponent } from './components/properties/buy-property.component';
import { SellPropertyComponent } from './components/properties/sell-property.component';
import { MortgageComponent } from './components/properties/mortgage.component';
import { LeadsComponent } from './components/leads/leads.component';
import { SuperadminComponent } from './components/superadmin/superadmin.component';
import { TenantSettingsComponent } from './components/tenant-settings/tenant-settings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'buy', 
    component: BuyPropertyComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'sell', 
    component: SellPropertyComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'mortgage', 
    component: MortgageComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'leads', 
    component: LeadsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'superadmin', 
    component: SuperadminComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'settings', 
    component: TenantSettingsComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
