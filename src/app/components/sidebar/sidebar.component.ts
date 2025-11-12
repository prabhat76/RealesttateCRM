import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isSuperadmin(): boolean {
    return this.currentUser?.email === 'superadmin@novakeys.com' || 
           (this.currentUser?.permissions?.includes('*') ?? false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
