import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, shareReplay, delay, switchMap } from 'rxjs/operators';
import { Lead, LeadActivity } from '../models/lead.model';
import { CacheService } from './cache.service';
import { StorageService, StorageType } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private leadsSubject = new BehaviorSubject<Lead[]>([]);
  public leads$: Observable<Lead[]>;
  
  private readonly LEADS_STORAGE_KEY = 'leads_data';
  private readonly CACHE_PREFIX = 'lead_';

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

  constructor(
    private cacheService: CacheService,
    private storageService: StorageService
  ) {
    // Load leads from storage
    const storedLeads = this.storageService.getItem<Lead[]>(this.LEADS_STORAGE_KEY, {
      type: StorageType.LOCAL
    });
    
    if (storedLeads && storedLeads.length > 0) {
      this.mockLeads = storedLeads;
    }
    
    this.leadsSubject.next(this.mockLeads);
    
    // Setup observable with caching
    this.leads$ = this.leadsSubject.asObservable().pipe(
      tap(leads => {
        // Persist to storage whenever leads change
        this.storageService.setItem(this.LEADS_STORAGE_KEY, leads, {
          type: StorageType.LOCAL,
          ttl: 24 * 60 * 60 * 1000 // 24 hours
        });
      }),
      shareReplay(1)
    );
  }

  getLeads(): Observable<Lead[]> {
    const cacheKey = 'all_leads';
    
    return this.cacheService.get(
      cacheKey,
      () => this.leads$,
      { maxAge: 2 * 60 * 1000 } // 2 minutes cache
    );
  }

  getLeadById(id: string): Observable<Lead | undefined> {
    const cacheKey = `${this.CACHE_PREFIX}${id}`;
    
    return this.cacheService.get(
      cacheKey,
      () => of(this.mockLeads.find(lead => lead.id === id)),
      { maxAge: 5 * 60 * 1000 } // 5 minutes cache
    );
  }

  createLead(lead: Partial<Lead>): Observable<Lead> {
    return of(null).pipe(
      delay(500), // Simulate API call
      switchMap(() => {
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
        
        // Cache the new lead
        this.cacheService.set(`${this.CACHE_PREFIX}${newLead.id}`, newLead);
        
        // Invalidate list cache
        this.cacheService.invalidate('all_leads');
        
        return of(newLead);
      }),
      tap(newLead => {
        console.log('Lead created:', newLead.id);
      }),
      catchError(error => {
        console.error('Failed to create lead:', error);
        return throwError(() => error);
      })
    );
  }

  updateLead(id: string, updates: Partial<Lead>): Observable<Lead> {
    return of(null).pipe(
      delay(300),
      switchMap(() => {
        const index = this.mockLeads.findIndex(lead => lead.id === id);
        if (index === -1) {
          return throwError(() => new Error('Lead not found'));
        }

        this.mockLeads[index] = {
          ...this.mockLeads[index],
          ...updates,
          updatedAt: new Date()
        };
        
        const updatedLead = this.mockLeads[index];
        this.leadsSubject.next([...this.mockLeads]);
        
        // Update cache
        this.cacheService.set(`${this.CACHE_PREFIX}${id}`, updatedLead);
        this.cacheService.invalidate('all_leads');
        
        return of(updatedLead);
      }),
      tap(lead => {
        console.log('Lead updated:', lead.id);
      }),
      catchError(error => {
        console.error('Failed to update lead:', error);
        return throwError(() => error);
      })
    );
  }

  deleteLead(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      switchMap(() => {
        const index = this.mockLeads.findIndex(lead => lead.id === id);
        if (index === -1) {
          return throwError(() => new Error('Lead not found'));
        }

        this.mockLeads.splice(index, 1);
        this.leadsSubject.next([...this.mockLeads]);
        
        // Invalidate caches
        this.cacheService.invalidate(`${this.CACHE_PREFIX}${id}`);
        this.cacheService.invalidate('all_leads');
        
        return of(true);
      }),
      tap(() => {
        console.log('Lead deleted:', id);
      }),
      catchError(error => {
        console.error('Failed to delete lead:', error);
        return throwError(() => error);
      })
    );
  }

  convertToContact(leadId: string): Observable<Lead> {
    return this.updateLead(leadId, { 
      status: 'converted',
      convertedToDealId: Date.now().toString()
    });
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

  getLeadsByStatus(status: string): Observable<Lead[]> {
    const cacheKey = `leads_status_${status}`;
    
    return this.cacheService.get(
      cacheKey,
      () => this.leads$.pipe(
        map(leads => leads.filter(lead => lead.status === status))
      ),
      { maxAge: 1 * 60 * 1000 } // 1 minute cache
    );
  }

  getLeadStats(): Observable<any> {
    const cacheKey = 'lead_stats';
    
    return this.cacheService.get(
      cacheKey,
      () => this.leads$.pipe(
        map(leads => ({
          total: leads.length,
          new: leads.filter(l => l.status === 'new').length,
          contacted: leads.filter(l => l.status === 'contacted').length,
          qualified: leads.filter(l => l.status === 'qualified').length,
          converted: leads.filter(l => l.status === 'converted').length,
          conversionRate: leads.length > 0 
            ? (leads.filter(l => l.status === 'converted').length / leads.length * 100).toFixed(1)
            : '0.0'
        }))
      ),
      { maxAge: 30 * 1000 } // 30 seconds cache
    );
  }

  // Batch operations
  bulkUpdateLeads(ids: string[], updates: Partial<Lead>): Observable<Lead[]> {
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        const updatedLeads: Lead[] = [];
        
        ids.forEach(id => {
          const index = this.mockLeads.findIndex(lead => lead.id === id);
          if (index !== -1) {
            this.mockLeads[index] = {
              ...this.mockLeads[index],
              ...updates,
              updatedAt: new Date()
            };
            updatedLeads.push(this.mockLeads[index]);
            
            // Update individual cache
            this.cacheService.invalidate(`${this.CACHE_PREFIX}${id}`);
          }
        });
        
        this.leadsSubject.next([...this.mockLeads]);
        this.cacheService.invalidate('all_leads');
        
        return of(updatedLeads);
      })
    );
  }

  // Search and filter
  searchLeads(query: string): Observable<Lead[]> {
    const cacheKey = `search_${query.toLowerCase()}`;
    
    return this.cacheService.get(
      cacheKey,
      () => this.leads$.pipe(
        map(leads => leads.filter(lead => 
          lead.firstName.toLowerCase().includes(query.toLowerCase()) ||
          lead.lastName.toLowerCase().includes(query.toLowerCase()) ||
          lead.email.toLowerCase().includes(query.toLowerCase()) ||
          lead.phone.includes(query)
        ))
      ),
      { maxAge: 2 * 60 * 1000 } // 2 minutes
    );
  }

  // Clear all lead caches
  clearCache(): void {
    this.cacheService.invalidatePattern(new RegExp(`^${this.CACHE_PREFIX}|^all_leads|^leads_status|^search_|^lead_stats`));
  }
}
