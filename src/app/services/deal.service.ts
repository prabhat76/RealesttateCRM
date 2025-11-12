import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Deal } from '../models/deal.model';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  private dealsSubject = new BehaviorSubject<Deal[]>([]);
  public deals$ = this.dealsSubject.asObservable();

  private mockDeals: Deal[] = [
    {
      id: '1',
      title: 'Downtown Condo Sale - Smith',
      contactId: 'c1',
      propertyId: 'p1',
      value: 485000,
      commission: 14550,
      stage: 'offer',
      probability: 75,
      expectedCloseDate: new Date(2025, 11, 15),
      type: 'buy',
      status: 'active',
      assignedTo: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 1),
      updatedAt: new Date(2025, 10, 12),
      notes: 'Client pre-approved, very motivated'
    },
    {
      id: '2',
      title: 'Luxury Villa Sale - Brown',
      contactId: 'c2',
      propertyId: 'p2',
      value: 1250000,
      commission: 37500,
      stage: 'negotiation',
      probability: 60,
      expectedCloseDate: new Date(2026, 0, 30),
      type: 'sell',
      status: 'active',
      assignedTo: 'agent2',
      organizationId: 'org1',
      createdAt: new Date(2025, 9, 20),
      updatedAt: new Date(2025, 10, 10),
      notes: 'High-value client, needs quick sale'
    },
    {
      id: '3',
      title: 'Starter Home Purchase - Davis',
      contactId: 'c3',
      value: 325000,
      commission: 9750,
      stage: 'viewing',
      probability: 45,
      expectedCloseDate: new Date(2026, 1, 15),
      type: 'buy',
      status: 'active',
      assignedTo: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 8),
      updatedAt: new Date(2025, 10, 11)
    },
    {
      id: '4',
      title: 'Investment Property - Wilson',
      contactId: 'c4',
      propertyId: 'p3',
      value: 650000,
      commission: 19500,
      stage: 'contract',
      probability: 90,
      expectedCloseDate: new Date(2025, 11, 20),
      type: 'buy',
      status: 'active',
      assignedTo: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 9, 15),
      updatedAt: new Date(2025, 10, 13)
    }
  ];

  constructor() {
    this.dealsSubject.next(this.mockDeals);
  }

  getDeals(): Observable<Deal[]> {
    return this.deals$;
  }

  getDealById(id: string): Deal | undefined {
    return this.mockDeals.find(deal => deal.id === id);
  }

  createDeal(deal: Partial<Deal>): Deal {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: deal.title || '',
      contactId: deal.contactId || '',
      propertyId: deal.propertyId,
      value: deal.value || 0,
      commission: deal.commission || (deal.value || 0) * 0.03,
      stage: deal.stage || 'new',
      probability: deal.probability || 25,
      expectedCloseDate: deal.expectedCloseDate,
      type: deal.type || 'buy',
      status: 'active',
      assignedTo: deal.assignedTo || 'agent1',
      organizationId: 'org1',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: deal.notes
    };

    this.mockDeals.unshift(newDeal);
    this.dealsSubject.next([...this.mockDeals]);
    return newDeal;
  }

  updateDeal(id: string, updates: Partial<Deal>): Deal | undefined {
    const index = this.mockDeals.findIndex(deal => deal.id === id);
    if (index !== -1) {
      this.mockDeals[index] = {
        ...this.mockDeals[index],
        ...updates,
        updatedAt: new Date()
      };
      this.dealsSubject.next([...this.mockDeals]);
      return this.mockDeals[index];
    }
    return undefined;
  }

  updateDealStage(id: string, stage: Deal['stage']): Deal | undefined {
    // Update probability based on stage
    const probabilityMap: { [key: string]: number } = {
      'new': 10,
      'qualified': 25,
      'viewing': 40,
      'offer': 60,
      'negotiation': 75,
      'contract': 90,
      'closed-won': 100,
      'closed-lost': 0
    };

    return this.updateDeal(id, {
      stage,
      probability: probabilityMap[stage] || 50,
      status: stage === 'closed-won' ? 'won' : stage === 'closed-lost' ? 'lost' : 'active',
      actualCloseDate: stage === 'closed-won' || stage === 'closed-lost' ? new Date() : undefined
    });
  }

  getDealsByStage(stage: string): Deal[] {
    return this.mockDeals.filter(deal => deal.stage === stage);
  }

  getDealStats() {
    const activeDeals = this.mockDeals.filter(d => d.status === 'active');
    const totalValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const totalCommission = activeDeals.reduce((sum, d) => sum + (d.commission || 0), 0);
    const wonDeals = this.mockDeals.filter(d => d.status === 'won');
    const avgDealValue = activeDeals.length > 0 ? totalValue / activeDeals.length : 0;

    return {
      total: this.mockDeals.length,
      active: activeDeals.length,
      won: wonDeals.length,
      totalValue,
      totalCommission,
      avgDealValue,
      avgProbability: activeDeals.length > 0 
        ? activeDeals.reduce((sum, d) => sum + d.probability, 0) / activeDeals.length 
        : 0
    };
  }
}
