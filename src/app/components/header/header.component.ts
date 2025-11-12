import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TenantResolverService } from '../../services/tenant-resolver.service';
import { TenantInstance } from '../../models/tenant.model';

@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentTenant: TenantInstance | null = null;
  showTenantSwitcher = false;

  constructor(
    public authService: AuthService,
    private tenantResolver: TenantResolverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tenantResolver.currentTenant$.subscribe(tenant => {
      this.currentTenant = tenant;
    });
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }

  get isSuperadmin(): boolean {
    return this.currentUser?.role === 'admin' && 
           this.currentUser?.organizationRole === 'owner' &&
           this.currentUser?.email === 'superadmin@novakeys.com';
  }

  goToSuperadmin(): void {
    this.router.navigate(['/superadmin']);
  }

  toggleTenantSwitcher(): void {
    this.showTenantSwitcher = !this.showTenantSwitcher;
  }
}
