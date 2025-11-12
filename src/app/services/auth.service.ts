import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { delay, map, tap, catchError, shareReplay, switchMap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { StorageService, StorageType } from './storage.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  private readonly USER_KEY = 'currentUser';
  private readonly SESSION_KEY = 'sessionToken';
  private readonly SESSION_EXPIRY = 'sessionExpiry';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Mock users database
  private mockUsers: User[] = [
    {
      id: '0',
      email: 'superadmin@novakeys.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'admin',
      organizationRole: 'owner',
      phone: '555-0000',
      permissions: ['*'] // All permissions
    },
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

  constructor(
    private storageService: StorageService,
    private cacheService: CacheService
  ) {
    const storedUser = this.storageService.getItem<User>(this.USER_KEY, {
      type: StorageType.LOCAL
    });
    
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser
    );
    this.currentUser$ = this.currentUserSubject.asObservable().pipe(
      shareReplay(1)
    );

    // Check session validity on init
    this.checkSessionValidity();
    
    // Setup session expiry timer
    this.setupSessionMonitoring();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<User> {
    return of(null).pipe(
      delay(1000), // Simulate network delay
      switchMap(() => {
        const user = this.mockUsers.find(u => u.email === credentials.email);
        
        // Check password - in production, this would be done server-side with hashing
        const validPassword = 
          (credentials.email === 'superadmin@novakeys.com' && credentials.password === 'superadmin') ||
          (credentials.email !== 'superadmin@novakeys.com' && credentials.password === 'password123');
        
        if (user && validPassword) {
          // Store user in local storage with encryption
          this.storageService.setItem(this.USER_KEY, user, {
            type: StorageType.LOCAL,
            encrypt: true
          });

          // Create session token
          const sessionToken = this.generateSessionToken();
          const expiryTime = Date.now() + this.SESSION_TIMEOUT;
          
          this.storageService.setItem(this.SESSION_KEY, sessionToken, {
            type: StorageType.SESSION
          });
          
          this.storageService.setItem(this.SESSION_EXPIRY, expiryTime, {
            type: StorageType.SESSION
          });

          // Update subject
          this.currentUserSubject.next(user);

          // Cache user data
          this.cacheService.set(`user_${user.id}`, user, {
            maxAge: 10 * 60 * 1000 // 10 minutes
          });

          // Setup session monitoring
          this.setupSessionMonitoring();

          return of(user);
        } else {
          return throwError(() => new Error('Invalid email or password'));
        }
      }),
      tap(user => {
        console.log('Login successful:', user.email);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  register(request: RegisterRequest): Observable<User> {
    return of(null).pipe(
      delay(1000),
      switchMap(() => {
        const newUser: User = {
          id: (this.mockUsers.length + 1).toString(),
          email: request.email,
          firstName: request.firstName,
          lastName: request.lastName,
          role: request.role,
          phone: request.phone
        };
        
        this.mockUsers.push(newUser);
        
        // Store with encryption
        this.storageService.setItem(this.USER_KEY, newUser, {
          type: StorageType.LOCAL,
          encrypt: true
        });
        
        this.currentUserSubject.next(newUser);
        
        // Cache user data
        this.cacheService.set(`user_${newUser.id}`, newUser);
        
        return of(newUser);
      }),
      tap(user => {
        console.log('Registration successful:', user.email);
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  logout(): void {
    // Clear all user data
    this.storageService.removeItem(this.USER_KEY, { type: StorageType.LOCAL });
    this.storageService.removeItem(this.SESSION_KEY, { type: StorageType.SESSION });
    this.storageService.removeItem(this.SESSION_EXPIRY, { type: StorageType.SESSION });
    
    // Clear user cache
    const currentUser = this.currentUserValue;
    if (currentUser) {
      this.cacheService.invalidate(`user_${currentUser.id}`);
    }
    
    // Clear all auth-related cache
    this.cacheService.invalidatePattern(/^(login_|user_)/);
    
    this.currentUserSubject.next(null);
    
    console.log('Logout successful');
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null && this.isSessionValid();
  }

  getToken(): string | null {
    return this.storageService.getItem<string>(this.SESSION_KEY, {
      type: StorageType.SESSION
    });
  }

  refreshSession(): void {
    if (this.isAuthenticated()) {
      const expiryTime = Date.now() + this.SESSION_TIMEOUT;
      this.storageService.setItem(this.SESSION_EXPIRY, expiryTime, {
        type: StorageType.SESSION
      });
    }
  }

  getUserById(id: string): Observable<User | undefined> {
    const cacheKey = `user_${id}`;
    
    return this.cacheService.get(
      cacheKey,
      () => of(this.mockUsers.find(u => u.id === id)),
      { maxAge: 5 * 60 * 1000 } // 5 minutes
    );
  }

  updateUserProfile(userId: string, updates: Partial<User>): Observable<User> {
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        const user = this.mockUsers.find(u => u.id === userId);
        if (!user) {
          return throwError(() => new Error('User not found'));
        }

        // Update user
        Object.assign(user, updates);

        // Update storage if current user
        if (this.currentUserValue?.id === userId) {
          this.storageService.setItem(this.USER_KEY, user, {
            type: StorageType.LOCAL,
            encrypt: true
          });
          this.currentUserSubject.next(user);
        }

        // Invalidate cache
        this.cacheService.invalidate(`user_${userId}`);

        return of(user);
      })
    );
  }

  private checkSessionValidity(): void {
    if (!this.isSessionValid()) {
      this.logout();
    }
  }

  private isSessionValid(): boolean {
    const expiry = this.storageService.getItem<number>(this.SESSION_EXPIRY, {
      type: StorageType.SESSION
    });
    
    if (!expiry) {
      return false;
    }
    
    return Date.now() < expiry;
  }

  private setupSessionMonitoring(): void {
    // Refresh session every 5 minutes if user is active
    timer(5 * 60 * 1000, 5 * 60 * 1000).pipe(
      tap(() => {
        if (this.isAuthenticated()) {
          this.refreshSession();
        }
      })
    ).subscribe();

    // Warn user 5 minutes before session expires
    timer(this.SESSION_TIMEOUT - (5 * 60 * 1000), this.SESSION_TIMEOUT).pipe(
      tap(() => {
        if (this.isAuthenticated()) {
          console.warn('Session expiring in 5 minutes');
          // You can show a notification here
        }
      })
    ).subscribe();
  }

  private generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
