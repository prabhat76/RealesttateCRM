import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Mock users database
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@crm.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '555-0100'
    },
    {
      id: '2',
      email: 'agent@crm.com',
      firstName: 'John',
      lastName: 'Agent',
      role: 'agent',
      phone: '555-0101'
    }
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<User> {
    // Mock authentication - In production, call your API
    return of(null).pipe(
      delay(1000), // Simulate network delay
      map(() => {
        const user = this.mockUsers.find(u => u.email === credentials.email);
        
        if (user && credentials.password === 'password123') {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<User> {
    // Mock registration - In production, call your API
    return of(null).pipe(
      delay(1000),
      map(() => {
        const newUser: User = {
          id: (this.mockUsers.length + 1).toString(),
          email: request.email,
          firstName: request.firstName,
          lastName: request.lastName,
          role: request.role,
          phone: request.phone
        };
        
        this.mockUsers.push(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        return newUser;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }
}
