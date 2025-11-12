import { Component, OnInit } from '@angular/core';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-buy-property',
  standalone: false,
  templateUrl: './buy-property.component.html',
  styleUrls: ['./buy-property.component.css']
})
export class BuyPropertyComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  searchTerm = '';
  selectedType = 'all';
  minPrice = 0;
  maxPrice = 10000000;

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    // Mock data - In production, fetch from API
    this.properties = [
      {
        id: '1',
        title: 'Luxury Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.',
        type: 'apartment',
        status: 'for-sale',
        price: 450000,
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
        agentId: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Spacious Family House',
        description: 'Perfect family home with large backyard and modern amenities.',
        type: 'house',
        status: 'for-sale',
        price: 675000,
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'],
        agentId: '2',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '3',
        title: 'Modern Condo with Amenities',
        description: 'Contemporary condo with pool, gym, and 24/7 security.',
        type: 'condo',
        status: 'for-sale',
        price: 380000,
        address: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
        agentId: '1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        id: '4',
        title: 'Waterfront Villa',
        description: 'Stunning waterfront property with private dock and beach access.',
        type: 'house',
        status: 'for-sale',
        price: 1250000,
        address: '321 Beach Road',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        bedrooms: 5,
        bathrooms: 4,
        area: 4000,
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'],
        agentId: '2',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      }
    ];
    this.filteredProperties = [...this.properties];
  }

  filterProperties(): void {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          property.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || property.type === this.selectedType;
      const matchesPrice = property.price >= this.minPrice && property.price <= this.maxPrice;
      
      return matchesSearch && matchesType && matchesPrice;
    });
  }

  viewProperty(property: Property): void {
    alert(`Viewing: ${property.title}\nPrice: $${property.price.toLocaleString()}\nContact agent for more details.`);
  }

  scheduleViewing(property: Property): void {
    alert(`Viewing scheduled for: ${property.title}\nOur agent will contact you shortly.`);
  }
}
