import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as d3 from 'd3';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead.model';
import { CacheService } from '../../services/cache.service';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  date: Date;
  value: number;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: false,
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('leadSourceChart', { static: false }) leadSourceChart!: ElementRef;
  @ViewChild('statusChart', { static: false }) statusChart!: ElementRef;
  @ViewChild('trendChart', { static: false }) trendChart!: ElementRef;
  @ViewChild('conversionFunnel', { static: false }) conversionFunnel!: ElementRef;
  @ViewChild('heatmapChart', { static: false }) heatmapChart!: ElementRef;

  leads$!: Observable<Lead[]>;
  stats$!: Observable<any>;
  
  // KPIs
  totalLeads = 0;
  qualifiedLeads = 0;
  conversionRate = 0;
  averageResponseTime = '2.5 hours';
  
  // Chart Data
  leadSourceData: ChartData[] = [];
  statusData: ChartData[] = [];
  trendData: TimeSeriesData[] = [];
  funnelData: ConversionFunnel[] = [];
  
  // Filters
  dateRange: 'week' | 'month' | 'quarter' | 'year' = 'month';
  selectedMetric: 'leads' | 'conversion' | 'revenue' = 'leads';
  
  private resizeObserver?: ResizeObserver;

  constructor(
    private leadService: LeadService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setupDataSubscriptions();
  }

  ngAfterViewInit(): void {
    // Delay to ensure DOM is ready
    setTimeout(() => {
      this.renderAllCharts();
      this.setupResizeListener();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  loadData(): void {
    this.leads$ = this.leadService.leads$;
    this.stats$ = this.leadService.getLeadStats();
  }

  setupDataSubscriptions(): void {
    combineLatest([this.leads$, this.stats$]).pipe(
      map(([leads, stats]) => {
        // Calculate KPIs
        this.totalLeads = leads.length;
        this.qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
        this.conversionRate = this.totalLeads > 0 
          ? Math.round((stats.converted / this.totalLeads) * 100) 
          : 0;
        
        // Prepare chart data
        this.prepareLeadSourceData(leads);
        this.prepareStatusData(stats);
        this.prepareTrendData(leads);
        this.prepareFunnelData(leads);
        
        return { leads, stats };
      })
    ).subscribe(() => {
      // Re-render charts when data changes
      if (this.leadSourceChart) {
        this.renderAllCharts();
      }
    });
  }

  prepareLeadSourceData(leads: Lead[]): void {
    const sourceCount = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.leadSourceData = Object.entries(sourceCount).map(([label, value]) => ({
      label,
      value,
      color: this.getSourceColor(label)
    }));
  }

  prepareStatusData(stats: any): void {
    this.statusData = [
      { label: 'New', value: stats.new, color: '#4CAF50' },
      { label: 'Contacted', value: stats.contacted, color: '#2196F3' },
      { label: 'Qualified', value: stats.qualified, color: '#FF9800' },
      { label: 'Converted', value: stats.converted, color: '#8B0000' }
    ];
  }

  prepareTrendData(leads: Lead[]): void {
    // Group leads by date for last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dateMap = new Map<string, number>();
    
    // Initialize all dates with 0
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }
    
    // Count leads per date
    leads.forEach(lead => {
      const dateStr = new Date(lead.createdAt).toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      }
    });
    
    this.trendData = Array.from(dateMap.entries()).map(([dateStr, value]) => ({
      date: new Date(dateStr),
      value
    }));
  }

  prepareFunnelData(leads: Lead[]): void {
    const total = leads.length;
    const stages = [
      { stage: 'Total Leads', count: total },
      { stage: 'Contacted', count: leads.filter(l => ['contacted', 'qualified'].includes(l.status)).length },
      { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
      { stage: 'In Progress', count: leads.filter(l => ['contacted', 'qualified'].includes(l.status)).length },
      { stage: 'Converted', count: leads.filter(l => l.status === 'converted').length }
    ];
    
    this.funnelData = stages.map(stage => ({
      stage: stage.stage,
      count: stage.count,
      percentage: total > 0 ? Math.round((stage.count / total) * 100) : 0
    }));
  }

  renderAllCharts(): void {
    if (this.leadSourceChart?.nativeElement) {
      this.renderPieChart(this.leadSourceChart.nativeElement, this.leadSourceData);
    }
    if (this.statusChart?.nativeElement) {
      this.renderBarChart(this.statusChart.nativeElement, this.statusData);
    }
    if (this.trendChart?.nativeElement) {
      this.renderLineChart(this.trendChart.nativeElement, this.trendData);
    }
    if (this.conversionFunnel?.nativeElement) {
      this.renderFunnelChart(this.conversionFunnel.nativeElement, this.funnelData);
    }
    if (this.heatmapChart?.nativeElement) {
      this.renderHeatmap(this.heatmapChart.nativeElement);
    }
  }

  renderPieChart(element: HTMLElement, data: ChartData[]): void {
    // Clear existing
    d3.select(element).selectAll('*').remove();
    
    const width = element.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color || '#999'));
    
    const pie = d3.pie<ChartData>()
      .value(d => d.value)
      .sort(null);
    
    const arc = d3.arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);
    
    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');
    
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).style('opacity', 0.8);
      });
    
    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => d.data.value > 0 ? d.data.value : '');
    
    // Legend
    const legend = d3.select(element)
      .select('svg')
      .append('g')
      .attr('transform', `translate(${width - 120}, 20)`);
    
    data.forEach((d, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(d.label));
      
      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '11px')
        .text(d.label);
    });
  }

  renderBarChart(element: HTMLElement, data: ChartData[]): void {
    d3.select(element).selectAll('*').remove();
    
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.2);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height, 0]);
    
    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => d.color || '#8B0000')
      .style('opacity', 0.8)
      .on('mouseover', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
      });
    
    // Add value labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.label)! + x.bandwidth() / 2))
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => d.value);
    
    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
    
    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));
  }

  renderLineChart(element: HTMLElement, data: TimeSeriesData[]): void {
    d3.select(element).selectAll('*').remove();
    
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height, 0]);
    
    // Line
    const line = d3.line<TimeSeriesData>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    // Area under the line
    const area = d3.area<TimeSeriesData>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(data)
      .attr('fill', '#8B0000')
      .attr('fill-opacity', 0.2)
      .attr('d', area);
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#8B0000')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 4)
      .attr('fill', '#8B0000')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
        
        // Tooltip
        const tooltip = d3.select(element)
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('font-size', '12px');
        
        tooltip
          .html(`${d.date.toLocaleDateString()}<br/>Leads: ${d.value}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 30}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
        d3.select(element).selectAll('.tooltip').remove();
      });
    
    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(8));
    
    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));
  }

  renderFunnelChart(element: HTMLElement, data: ConversionFunnel[]): void {
    d3.select(element).selectAll('*').remove();
    
    const width = element.clientWidth;
    const height = 400;
    const maxWidth = width * 0.8;
    const stageHeight = height / data.length;
    
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const maxCount = data[0]?.count || 1;
    
    data.forEach((stage, i) => {
      const stageWidth = (stage.count / maxCount) * maxWidth;
      const x = (width - stageWidth) / 2;
      const y = i * stageHeight;
      
      const color = d3.interpolateRgb('#4CAF50', '#8B0000')(i / (data.length - 1));
      
      svg.append('rect')
        .attr('x', x)
        .attr('y', y + 5)
        .attr('width', stageWidth)
        .attr('height', stageHeight - 10)
        .attr('fill', color)
        .style('opacity', 0.8)
        .on('mouseover', function() {
          d3.select(this).style('opacity', 1);
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 0.8);
        });
      
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', y + stageHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .style('font-weight', 'bold')
        .style('font-size', '14px')
        .text(`${stage.stage}: ${stage.count} (${stage.percentage}%)`);
    });
  }

  renderHeatmap(element: HTMLElement): void {
    d3.select(element).selectAll('*').remove();
    
    // Sample heatmap data - days of week vs hours of day
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Generate random data for demo
    const heatmapData: Array<{ day: string; hour: number; value: number }> = [];
    days.forEach(day => {
      hours.forEach(hour => {
        const value = Math.floor(Math.random() * 50);
        heatmapData.push({ day, hour, value });
      });
    });
    
    const margin = { top: 30, right: 20, bottom: 30, left: 50 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const x = d3.scaleBand()
      .domain(hours.map(String))
      .range([0, width])
      .padding(0.05);
    
    const y = d3.scaleBand()
      .domain(days)
      .range([0, height])
      .padding(0.05);
    
    const color = d3.scaleSequential(d3.interpolateReds)
      .domain([0, 50]);
    
    svg.selectAll()
      .data(heatmapData)
      .enter()
      .append('rect')
      .attr('x', d => x(String(d.hour))!)
      .attr('y', d => y(d.day)!)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.value))
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .on('mouseover', function(event, d) {
        d3.select(this).style('stroke', '#000').style('stroke-width', '2px');
      })
      .on('mouseout', function() {
        d3.select(this).style('stroke', 'white').style('stroke-width', '1px');
      });
    
    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickValues(hours.filter((_, i) => i % 2 === 0).map(String)));
    
    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));
  }

  setupResizeListener(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.renderAllCharts();
    });
    
    if (this.leadSourceChart) {
      this.resizeObserver.observe(this.leadSourceChart.nativeElement);
    }
  }

  getSourceColor(source: string): string {
    const colors: Record<string, string> = {
      'Website': '#4CAF50',
      'Referral': '#2196F3',
      'Social Media': '#E91E63',
      'Cold Call': '#FF9800',
      'Email Campaign': '#9C27B0',
      'Walk-in': '#00BCD4'
    };
    return colors[source] || '#999';
  }

  changeDateRange(range: 'week' | 'month' | 'quarter' | 'year'): void {
    this.dateRange = range;
    this.loadData();
    this.renderAllCharts();
  }

  exportData(format: 'csv' | 'pdf' | 'excel'): void {
    console.log(`Exporting data as ${format}...`);
    alert(`Export as ${format.toUpperCase()} - Coming soon!`);
  }

  refreshData(): void {
    this.cacheService.invalidatePattern(/^(leads_|lead_stats)/);
    this.loadData();
  }

  getConvertedCount(): number {
    return Math.floor(this.totalLeads * 0.15);
  }

  getLostCount(): number {
    return Math.floor(this.totalLeads * 0.08);
  }
}
