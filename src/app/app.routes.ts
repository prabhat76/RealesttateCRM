import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BuyPropertyComponent } from './components/properties/buy-property.component';
import { SellPropertyComponent } from './components/properties/sell-property.component';
import { MortgageComponent } from './components/properties/mortgage.component';
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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
