import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lead, LeadActivity } from '../models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private leadsSubject = new BehaviorSubject<Lead[]>([]);
  public leads$ = this.leadsSubject.asObservable();

  private mockLeads: Lead[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '555-0101',
      source: 'website',
      status: 'new',
      type: 'buyer',
      budget: 500000,
      interestedIn: 'Single Family Home in Downtown',
      assignedTo: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 10),
      updatedAt: new Date(2025, 10, 10),
      score: 85
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '555-0102',
      source: 'referral',
      status: 'contacted',
      type: 'seller',
      interestedIn: 'Want to sell 3BR condo',
      assignedTo: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 9),
      updatedAt: new Date(2025, 10, 11),
      lastContactedAt: new Date(2025, 10, 11),
      score: 92
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'mbrown@email.com',
      phone: '555-0103',
      source: 'social',
      status: 'qualified',
      type: 'buyer',
      budget: 750000,
      interestedIn: 'Luxury apartment with city view',
      assignedTo: 'agent2',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 8),
      updatedAt: new Date(2025, 10, 12),
      lastContactedAt: new Date(2025, 10, 12),
      score: 78,
      notes: 'Pre-approved for mortgage. Looking to close in 60 days.'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '555-0104',
      source: 'advertisement',
      status: 'new',
      type: 'both',
      budget: 400000,
      interestedIn: 'Looking to upgrade from current home',
      assignedTo: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 12),
      updatedAt: new Date(2025, 10, 12),
      score: 65
    }
  ];

  constructor() {
    this.leadsSubject.next(this.mockLeads);
  }

  getLeads(): Observable<Lead[]> {
    return this.leads$;
  }

  getLeadById(id: string): Lead | undefined {
    return this.mockLeads.find(lead => lead.id === id);
  }

  createLead(lead: Partial<Lead>): Lead {
    const newLead: Lead = {
      id: Date.now().toString(),
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source || 'website',
      status: 'new',
      type: lead.type || 'buyer',
      budget: lead.budget,
      interestedIn: lead.interestedIn,
      notes: lead.notes,
      assignedTo: lead.assignedTo || 'agent1',
      organizationId: 'org1',
      createdAt: new Date(),
      updatedAt: new Date(),
      score: this.calculateLeadScore(lead)
    };

    this.mockLeads.unshift(newLead);
    this.leadsSubject.next([...this.mockLeads]);
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | undefined {
    const index = this.mockLeads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      this.mockLeads[index] = {
        ...this.mockLeads[index],
        ...updates,
        updatedAt: new Date()
      };
      this.leadsSubject.next([...this.mockLeads]);
      return this.mockLeads[index];
    }
    return undefined;
  }

  deleteLead(id: string): boolean {
    const index = this.mockLeads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      this.mockLeads.splice(index, 1);
      this.leadsSubject.next([...this.mockLeads]);
      return true;
    }
    return false;
  }

  convertToContact(leadId: string): void {
    const lead = this.getLeadById(leadId);
    if (lead) {
      this.updateLead(leadId, { 
        status: 'converted',
        convertedToDealId: Date.now().toString()
      });
    }
  }

  private calculateLeadScore(lead: Partial<Lead>): number {
    let score = 50; // Base score
    
    if (lead.budget && lead.budget > 300000) score += 20;
    if (lead.source === 'referral') score += 15;
    if (lead.source === 'website') score += 10;
    if (lead.phone) score += 10;
    if (lead.email) score += 5;
    
    return Math.min(score, 100);
  }

  getLeadsByStatus(status: string): Lead[] {
    return this.mockLeads.filter(lead => lead.status === status);
  }

  getLeadStats() {
    return {
      total: this.mockLeads.length,
      new: this.mockLeads.filter(l => l.status === 'new').length,
      contacted: this.mockLeads.filter(l => l.status === 'contacted').length,
      qualified: this.mockLeads.filter(l => l.status === 'qualified').length,
      converted: this.mockLeads.filter(l => l.status === 'converted').length,
      conversionRate: (this.mockLeads.filter(l => l.status === 'converted').length / this.mockLeads.length * 100).toFixed(1)
    };
  }
}
