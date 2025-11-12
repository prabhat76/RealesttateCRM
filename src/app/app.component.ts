import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Propella Real Estate CRM';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  get showLayout(): boolean {
    const currentRoute = this.router.url;
    return this.authService.isAuthenticated() && 
           currentRoute !== '/login' && 
           currentRoute !== '/register';
  }
}