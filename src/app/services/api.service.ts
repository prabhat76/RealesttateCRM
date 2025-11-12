import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Properties
  getProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/properties`, { headers: this.getHeaders() });
  }

  getRecentProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/properties/recent`, { headers: this.getHeaders() });
  }

  createProperty(property: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/properties`, property, { headers: this.getHeaders() });
  }

  // Leads
  getLeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leads`, { headers: this.getHeaders() });
  }

  getRecentLeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leads/recent`, { headers: this.getHeaders() });
  }

  createLead(lead: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/leads`, lead, { headers: this.getHeaders() });
  }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }
}