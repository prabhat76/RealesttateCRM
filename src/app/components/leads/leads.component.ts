import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead.model';

@Component({
  selector: 'app-leads',
  standalone: false,
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  
  filterStatus: string = 'all';
  filterType: string = 'all';
  searchQuery: string = '';
  sortBy: string = 'createdAt';
  
  leadStats: any = {};
  showAddModal: boolean = false;
  
  newLead: Partial<Lead> = {
    type: 'buyer',
    source: 'website',
    status: 'new'
  };

  constructor(
    private leadService: LeadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeads();
    this.loadStats();
  }

  loadLeads(): void {
    this.leadService.getLeads().subscribe(leads => {
      this.leads = leads;
      this.applyFilters();
    });
  }

  loadStats(): void {
    this.leadStats = this.leadService.getLeadStats();
  }

  applyFilters(): void {
    this.filteredLeads = this.leads.filter(lead => {
      const statusMatch = this.filterStatus === 'all' || lead.status === this.filterStatus;
      const typeMatch = this.filterType === 'all' || lead.type === this.filterType;
      const searchMatch = !this.searchQuery || 
        lead.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        lead.phone.includes(this.searchQuery);
      
      return statusMatch && typeMatch && searchMatch;
    });

    // Sort
    this.filteredLeads.sort((a, b) => {
      if (this.sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (this.sortBy === 'score') {
        return (b.score || 0) - (a.score || 0);
      } else if (this.sortBy === 'name') {
        return a.firstName.localeCompare(b.firstName);
      }
      return 0;
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newLead = {
      type: 'buyer',
      source: 'website',
      status: 'new'
    };
  }

  createLead(): void {
    if (this.newLead.firstName && this.newLead.lastName && this.newLead.email) {
      this.leadService.createLead(this.newLead);
      this.closeAddModal();
      this.loadLeads();
      this.loadStats();
    }
  }

  viewLead(leadId: string): void {
    this.router.navigate(['/leads', leadId]);
  }

  updateLeadStatus(leadId: string, status: string): void {
    this.leadService.updateLead(leadId, { status: status as any });
    this.loadStats();
  }

  deleteLead(leadId: string): void {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.leadService.deleteLead(leadId);
      this.loadStats();
    }
  }

  convertLead(leadId: string): void {
    if (confirm('Convert this lead to a contact and create a deal?')) {
      this.leadService.convertToContact(leadId);
      this.loadStats();
    }
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'new': 'status-new',
      'contacted': 'status-contacted',
      'qualified': 'status-qualified',
      'unqualified': 'status-unqualified',
      'converted': 'status-converted'
    };
    return classes[status] || '';
  }

  getScoreClass(score?: number): string {
    if (!score) return 'score-low';
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }
}
