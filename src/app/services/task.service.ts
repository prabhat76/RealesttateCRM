import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private mockTasks: Task[] = [
    {
      id: '1',
      title: 'Follow up with John Smith',
      description: 'Call to discuss property viewing schedule',
      type: 'call',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(2025, 10, 14),
      assignedTo: 'agent1',
      createdBy: 'agent1',
      relatedTo: { type: 'lead', id: 'l1' },
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 13),
      updatedAt: new Date(2025, 10, 13),
      reminder: new Date(2025, 10, 14, 9, 0)
    },
    {
      id: '2',
      title: 'Send property brochures to Sarah',
      description: 'Email brochures for 3 properties in downtown area',
      type: 'email',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(2025, 10, 14),
      assignedTo: 'agent1',
      createdBy: 'agent1',
      relatedTo: { type: 'contact', id: 'c2' },
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 13),
      updatedAt: new Date(2025, 10, 13)
    },
    {
      id: '3',
      title: 'Property viewing with Michael',
      description: 'Show luxury apartment at 123 Main St',
      type: 'viewing',
      priority: 'urgent',
      status: 'in-progress',
      dueDate: new Date(2025, 10, 15),
      assignedTo: 'agent2',
      createdBy: 'agent2',
      relatedTo: { type: 'deal', id: 'd3' },
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 12),
      updatedAt: new Date(2025, 10, 13),
      reminder: new Date(2025, 10, 15, 14, 0)
    },
    {
      id: '4',
      title: 'Prepare contract documents',
      description: 'Draft purchase agreement for Brown villa sale',
      type: 'paperwork',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(2025, 10, 16),
      assignedTo: 'agent2',
      createdBy: 'agent2',
      relatedTo: { type: 'deal', id: 'd2' },
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 13),
      updatedAt: new Date(2025, 10, 13)
    },
    {
      id: '5',
      title: 'Market analysis report',
      description: 'Complete comparative market analysis for new listing',
      type: 'other',
      priority: 'medium',
      status: 'completed',
      dueDate: new Date(2025, 10, 12),
      completedAt: new Date(2025, 10, 12),
      assignedTo: 'agent1',
      createdBy: 'agent1',
      organizationId: 'org1',
      createdAt: new Date(2025, 10, 10),
      updatedAt: new Date(2025, 10, 12)
    }
  ];

  constructor() {
    this.tasksSubject.next(this.mockTasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTaskById(id: string): Task | undefined {
    return this.mockTasks.find(task => task.id === id);
  }

  createTask(task: Partial<Task>): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title || '',
      description: task.description,
      type: task.type || 'other',
      priority: task.priority || 'medium',
      status: 'pending',
      dueDate: task.dueDate,
      assignedTo: task.assignedTo || 'agent1',
      createdBy: task.createdBy || 'agent1',
      relatedTo: task.relatedTo,
      organizationId: 'org1',
      createdAt: new Date(),
      updatedAt: new Date(),
      reminder: task.reminder
    };

    this.mockTasks.unshift(newTask);
    this.tasksSubject.next([...this.mockTasks]);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const index = this.mockTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.mockTasks[index] = {
        ...this.mockTasks[index],
        ...updates,
        updatedAt: new Date()
      };
      
      if (updates.status === 'completed' && !this.mockTasks[index].completedAt) {
        this.mockTasks[index].completedAt = new Date();
      }
      
      this.tasksSubject.next([...this.mockTasks]);
      return this.mockTasks[index];
    }
    return undefined;
  }

  deleteTask(id: string): boolean {
    const index = this.mockTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.mockTasks.splice(index, 1);
      this.tasksSubject.next([...this.mockTasks]);
      return true;
    }
    return false;
  }

  getTasksByStatus(status: string): Task[] {
    return this.mockTasks.filter(task => task.status === status);
  }

  getTasksDueToday(): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.mockTasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate < tomorrow;
    });
  }

  getOverdueTasks(): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.mockTasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  }

  getTaskStats() {
    const pending = this.mockTasks.filter(t => t.status === 'pending').length;
    const inProgress = this.mockTasks.filter(t => t.status === 'in-progress').length;
    const completed = this.mockTasks.filter(t => t.status === 'completed').length;
    const overdue = this.getOverdueTasks().length;
    const dueToday = this.getTasksDueToday().length;

    return {
      total: this.mockTasks.length,
      pending,
      inProgress,
      completed,
      overdue,
      dueToday,
      completionRate: this.mockTasks.length > 0 
        ? (completed / this.mockTasks.length * 100).toFixed(1) 
        : '0'
    };
  }
}
