import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NOVA KEYS Real Estate CRM';

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