import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    standalone: false,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  Math = Math;
  
  stats = [
    { icon: 'fas fa-building', label: 'Total Properties', value: '1,234', change: 12, color: '#8B0000' },
    { icon: 'fas fa-users', label: 'Active Leads', value: '856', change: 8, color: '#D4AF37' },
    { icon: 'fas fa-handshake', label: 'Closed Deals', value: '142', change: -3, color: '#B8941F' },
    { icon: 'fas fa-dollar-sign', label: 'Revenue', value: '$2.4M', change: 15, color: '#5c0000' }
  ];
  
  properties = [
    {
      title: 'Modern Downtown Apartment',
      location: 'Downtown, NY',
      price: 450000,
      type: 'Sale',
      beds: 2,
      baths: 2,
      sqft: 1200,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=120&h=80&fit=crop'
    },
    {
      title: 'Luxury Villa with Pool',
      location: 'Beverly Hills, CA',
      price: 1200000,
      type: 'Sale',
      beds: 4,
      baths: 3,
      sqft: 2800,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=120&h=80&fit=crop'
    },
    {
      title: 'Cozy Family Home',
      location: 'Suburbs, TX',
      price: 320000,
      type: 'Sale',
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=120&h=80&fit=crop'
    }
  ];
  
  leads = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      status: 'New',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=667eea&color=fff'
    },
    {
      name: 'Mike Chen',
      email: 'mike@email.com',
      status: 'Contacted',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff'
    },
    {
      name: 'Emily Davis',
      email: 'emily@email.com',
      status: 'Qualified',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff'
    },
    {
      name: 'Robert Wilson',
      email: 'robert@email.com',
      status: 'New',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Wilson&background=ef4444&color=fff'
    }
  ];
}
