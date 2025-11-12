import { Component } from '@angular/core';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-sell-property',
  standalone: false,
  templateUrl: './sell-property.component.html',
  styleUrls: ['./sell-property.component.css']
})
export class SellPropertyComponent {
  propertyData: Partial<Property> = {
    title: '',
    description: '',
    type: 'apartment',
    status: 'for-sale',
    price: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0
  };
  loading = false;
  submitted = false;

  onSubmit(): void {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
      alert('Property listing submitted successfully! Our agent will contact you within 24 hours.');
      this.resetForm();
    }, 1500);
  }

  resetForm(): void {
    this.propertyData = {
      title: '',
      description: '',
      type: 'apartment',
      status: 'for-sale',
      price: 0,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      bedrooms: 0,
      bathrooms: 0,
      area: 0
    };
  }
}
